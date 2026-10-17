(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.BitcoinWriterAnalytics = factory();
  }
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  var STORAGE_KEY = 'bitcoin_writer_analytics';
  var DEFAULT_DAILY_GOAL = 1000;
  var FIVE_MINUTES_MS = 5 * 60 * 1000;

  function toNonNegativeNumber(value, fallback) {
    var parsed = Number(value);
    if (!Number.isFinite(parsed) || parsed < 0) {
      return fallback;
    }
    return parsed;
  }

  function buildDateKey(input) {
    var date = input instanceof Date ? input : new Date(input || Date.now());
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1).padStart(2, '0');
    var day = String(date.getDate()).padStart(2, '0');
    return year + '-' + month + '-' + day;
  }

  function parseDateKey(dateKey) {
    var parts = String(dateKey || '').split('-');
    if (parts.length !== 3) {
      return null;
    }
    var year = Number(parts[0]);
    var month = Number(parts[1]);
    var day = Number(parts[2]);
    if (!Number.isInteger(year) || !Number.isInteger(month) || !Number.isInteger(day)) {
      return null;
    }
    return new Date(year, month - 1, day);
  }

  function createDefaultState() {
    return {
      version: 1,
      dailyGoal: DEFAULT_DAILY_GOAL,
      totalWordsWritten: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      lastUpdatedAt: null,
      daily: {},
      session: {
        lastWordCount: null,
        lastActivityAt: null,
        startedAt: null,
        activeDateKey: null
      }
    };
  }

  function createEmptyDay() {
    return {
      wordsWritten: 0,
      sessions: 0,
      highestWordCount: 0,
      updatedAt: null
    };
  }

  function normalizeDay(day) {
    var base = createEmptyDay();
    if (!day || typeof day !== 'object') {
      return base;
    }
    return {
      wordsWritten: toNonNegativeNumber(day.wordsWritten, 0),
      sessions: toNonNegativeNumber(day.sessions, 0),
      highestWordCount: toNonNegativeNumber(day.highestWordCount, 0),
      updatedAt: day.updatedAt ? String(day.updatedAt) : null
    };
  }

  function computeStreaks(daily, nowDateKey) {
    var activeDays = Object.keys(daily || {})
      .filter(function (dateKey) {
        return daily[dateKey] && daily[dateKey].wordsWritten > 0;
      })
      .sort();

    if (activeDays.length === 0) {
      return { currentStreak: 0, longestStreak: 0 };
    }

    var longest = 1;
    var running = 1;

    for (var index = 1; index < activeDays.length; index += 1) {
      var previous = parseDateKey(activeDays[index - 1]);
      var current = parseDateKey(activeDays[index]);
      if (!previous || !current) {
        running = 1;
      } else {
        var difference = Math.round((current.getTime() - previous.getTime()) / 86400000);
        running = difference === 1 ? running + 1 : 1;
      }
      if (running > longest) {
        longest = running;
      }
    }

    var currentStreak = 0;
    if (activeDays[activeDays.length - 1] === nowDateKey) {
      currentStreak = 1;
      for (var reverseIndex = activeDays.length - 1; reverseIndex > 0; reverseIndex -= 1) {
        var currentDate = parseDateKey(activeDays[reverseIndex]);
        var previousDate = parseDateKey(activeDays[reverseIndex - 1]);
        if (!currentDate || !previousDate) {
          break;
        }
        var gap = Math.round((currentDate.getTime() - previousDate.getTime()) / 86400000);
        if (gap !== 1) {
          break;
        }
        currentStreak += 1;
      }
    }

    return {
      currentStreak: currentStreak,
      longestStreak: longest
    };
  }

  function normalizeState(input) {
    var source = input && typeof input === 'object' ? input : {};
    var state = {
      version: 1,
      dailyGoal: Math.max(100, toNonNegativeNumber(source.dailyGoal, DEFAULT_DAILY_GOAL) || DEFAULT_DAILY_GOAL),
      totalWordsWritten: 0,
      totalSessions: 0,
      currentStreak: 0,
      longestStreak: 0,
      lastActiveDate: null,
      lastUpdatedAt: source.lastUpdatedAt ? String(source.lastUpdatedAt) : null,
      daily: {},
      session: {
        lastWordCount: source.session && source.session.lastWordCount !== null && source.session.lastWordCount !== undefined
          ? toNonNegativeNumber(source.session.lastWordCount, 0)
          : null,
        lastActivityAt: source.session && source.session.lastActivityAt ? String(source.session.lastActivityAt) : null,
        startedAt: source.session && source.session.startedAt ? String(source.session.startedAt) : null,
        activeDateKey: source.session && source.session.activeDateKey ? String(source.session.activeDateKey) : null
      }
    };

    Object.keys(source.daily || {}).forEach(function (dateKey) {
      if (/^\d{4}-\d{2}-\d{2}$/.test(dateKey)) {
        state.daily[dateKey] = normalizeDay(source.daily[dateKey]);
      }
    });

    Object.keys(state.daily).sort().forEach(function (dateKey) {
      var day = state.daily[dateKey];
      state.totalWordsWritten += day.wordsWritten;
      state.totalSessions += day.sessions;
      if (day.wordsWritten > 0) {
        state.lastActiveDate = dateKey;
      }
    });

    var streaks = computeStreaks(state.daily, buildDateKey(new Date()));
    state.currentStreak = streaks.currentStreak;
    state.longestStreak = streaks.longestStreak;

    return state;
  }

  function resolveStorage(storage) {
    if (storage && typeof storage.getItem === 'function' && typeof storage.setItem === 'function') {
      return storage;
    }
    if (typeof window !== 'undefined' && window.localStorage) {
      return window.localStorage;
    }
    return null;
  }

  function readState(storage) {
    var resolvedStorage = resolveStorage(storage);
    if (!resolvedStorage) {
      return createDefaultState();
    }

    try {
      var raw = resolvedStorage.getItem(STORAGE_KEY);
      if (!raw) {
        return createDefaultState();
      }
      return normalizeState(JSON.parse(raw));
    } catch (error) {
      return createDefaultState();
    }
  }

  function writeState(state, storage) {
    var resolvedStorage = resolveStorage(storage);
    var normalized = normalizeState(state);
    normalized.lastUpdatedAt = new Date().toISOString();

    if (resolvedStorage) {
      try {
        resolvedStorage.setItem(STORAGE_KEY, JSON.stringify(normalized));
      } catch (error) {
        return normalized;
      }
    }

    return normalized;
  }

  function ensureDay(state, dateKey) {
    if (!state.daily[dateKey]) {
      state.daily[dateKey] = createEmptyDay();
    }
    return state.daily[dateKey];
  }

  function syncSessionWordCount(currentWordCount, options, storage) {
    var now = options && options.now ? new Date(options.now) : new Date();
    var state = readState(storage);
    state.session.lastWordCount = toNonNegativeNumber(currentWordCount, 0);
    state.session.lastActivityAt = now.toISOString();
    state.session.activeDateKey = buildDateKey(now);

    if (options && options.resetStartedAt) {
      state.session.startedAt = null;
    }

    return writeState(state, storage);
  }

  function recordWordCountChange(currentWordCount, options, storage) {
    var now = options && options.now ? new Date(options.now) : new Date();
    var inactivityMs = options && options.inactivityMs
      ? toNonNegativeNumber(options.inactivityMs, FIVE_MINUTES_MS)
      : FIVE_MINUTES_MS;
    var state = readState(storage);
    var current = toNonNegativeNumber(currentWordCount, 0);
    var previous = state.session.lastWordCount;
    var dateKey = buildDateKey(now);
    var day = ensureDay(state, dateKey);

    if (previous === null || previous === undefined) {
      state.session.lastWordCount = current;
      state.session.lastActivityAt = now.toISOString();
      state.session.activeDateKey = dateKey;
      return writeState(state, storage);
    }

    var lastActivity = state.session.lastActivityAt ? new Date(state.session.lastActivityAt) : null;
    var isStale = !state.session.startedAt || !lastActivity || Number.isNaN(lastActivity.getTime())
      || (now.getTime() - lastActivity.getTime()) > inactivityMs
      || state.session.activeDateKey !== dateKey;

    if (isStale) {
      day.sessions += 1;
      state.session.startedAt = now.toISOString();
    }

    var positiveDelta = current > previous ? current - previous : 0;
    if (positiveDelta > 0) {
      day.wordsWritten += positiveDelta;
      day.highestWordCount = Math.max(day.highestWordCount, current);
      state.lastActiveDate = dateKey;
    }

    day.updatedAt = now.toISOString();
    state.session.lastWordCount = current;
    state.session.lastActivityAt = now.toISOString();
    state.session.activeDateKey = dateKey;

    return writeState(state, storage);
  }

  function setDailyGoal(nextGoal, storage) {
    var state = readState(storage);
    state.dailyGoal = Math.max(100, toNonNegativeNumber(nextGoal, DEFAULT_DAILY_GOAL) || DEFAULT_DAILY_GOAL);
    return writeState(state, storage);
  }

  function formatLabel(dateKey) {
    var date = parseDateKey(dateKey);
    if (!date) {
      return dateKey;
    }

    return date.toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric'
    });
  }

  function listRecentDays(stateInput, options) {
    var state = normalizeState(stateInput);
    var days = options && options.days ? toNonNegativeNumber(options.days, 7) : 7;
    var endDate = options && options.now ? new Date(options.now) : new Date();
    endDate.setHours(0, 0, 0, 0);

    var recentDays = [];
    for (var offset = days - 1; offset >= 0; offset -= 1) {
      var date = new Date(endDate);
      date.setDate(endDate.getDate() - offset);
      var dateKey = buildDateKey(date);
      var day = state.daily[dateKey] || createEmptyDay();
      recentDays.push({
        dateKey: dateKey,
        label: formatLabel(dateKey),
        wordsWritten: day.wordsWritten,
        sessions: day.sessions,
        goalMet: day.wordsWritten >= state.dailyGoal
      });
    }

    return recentDays;
  }

  function getSummary(stateInput, options) {
    var state = normalizeState(stateInput);
    var now = options && options.now ? new Date(options.now) : new Date();
    var dateKey = buildDateKey(now);
    var today = state.daily[dateKey] || createEmptyDay();
    var last7Days = listRecentDays(state, { days: 7, now: now });
    var bestDayWords = 0;
    var activeDays = 0;

    Object.keys(state.daily).forEach(function (dayKey) {
      var day = state.daily[dayKey];
      if (day.wordsWritten > bestDayWords) {
        bestDayWords = day.wordsWritten;
      }
      if (day.wordsWritten > 0) {
        activeDays += 1;
      }
    });

    var streaks = computeStreaks(state.daily, dateKey);

    return {
      dailyGoal: state.dailyGoal,
      todayWords: today.wordsWritten,
      todaySessions: today.sessions,
      goalProgress: state.dailyGoal > 0 ? Math.min(1, today.wordsWritten / state.dailyGoal) : 0,
      currentStreak: streaks.currentStreak,
      longestStreak: Math.max(state.longestStreak, streaks.longestStreak),
      totalWordsWritten: state.totalWordsWritten,
      totalSessions: state.totalSessions,
      bestDayWords: bestDayWords,
      activeDays: activeDays,
      averageWordsPerActiveDay: activeDays > 0 ? Math.round(state.totalWordsWritten / activeDays) : 0,
      last7Days: last7Days,
      lastUpdatedAt: state.lastUpdatedAt
    };
  }

  return {
    STORAGE_KEY: STORAGE_KEY,
    DEFAULT_DAILY_GOAL: DEFAULT_DAILY_GOAL,
    buildDateKey: buildDateKey,
    createDefaultState: createDefaultState,
    computeStreaks: computeStreaks,
    readState: readState,
    writeState: writeState,
    syncSessionWordCount: syncSessionWordCount,
    recordWordCountChange: recordWordCountChange,
    setDailyGoal: setDailyGoal,
    listRecentDays: listRecentDays,
    getSummary: getSummary
  };
});