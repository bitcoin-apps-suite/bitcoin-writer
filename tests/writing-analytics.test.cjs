const test = require('node:test');
const assert = require('node:assert/strict');
const analytics = require('../public/js/writing-analytics.js');

function createMemoryStorage() {
  const state = new Map();
  return {
    getItem(key) {
      return state.has(key) ? state.get(key) : null;
    },
    setItem(key, value) {
      state.set(key, value);
    },
    removeItem(key) {
      state.delete(key);
    }
  };
}

test('records positive word deltas and rolls sessions after inactivity', () => {
  const storage = createMemoryStorage();

  analytics.syncSessionWordCount(100, { now: '2026-03-10T09:00:00' }, storage);
  analytics.recordWordCountChange(130, { now: '2026-03-10T09:01:00', inactivityMs: 300000 }, storage);
  analytics.recordWordCountChange(125, { now: '2026-03-10T09:02:00', inactivityMs: 300000 }, storage);
  analytics.recordWordCountChange(150, { now: '2026-03-10T09:10:30', inactivityMs: 300000 }, storage);

  const summary = analytics.getSummary(analytics.readState(storage), { now: '2026-03-10T12:00:00' });

  assert.equal(summary.todayWords, 55);
  assert.equal(summary.todaySessions, 2);
  assert.equal(summary.totalWordsWritten, 55);
  assert.equal(summary.totalSessions, 2);
});

test('computes current and longest streaks from active writing days', () => {
  const storage = createMemoryStorage();

  analytics.syncSessionWordCount(0, { now: '2026-03-08T08:00:00', resetStartedAt: true }, storage);
  analytics.recordWordCountChange(10, { now: '2026-03-08T08:10:00' }, storage);

  analytics.syncSessionWordCount(0, { now: '2026-03-09T08:00:00', resetStartedAt: true }, storage);
  analytics.recordWordCountChange(15, { now: '2026-03-09T08:10:00' }, storage);

  analytics.syncSessionWordCount(0, { now: '2026-03-11T08:00:00', resetStartedAt: true }, storage);
  analytics.recordWordCountChange(5, { now: '2026-03-11T08:10:00' }, storage);

  const summary = analytics.getSummary(analytics.readState(storage), { now: '2026-03-11T12:00:00' });

  assert.equal(summary.currentStreak, 1);
  assert.equal(summary.longestStreak, 2);
  assert.equal(summary.bestDayWords, 15);
  assert.equal(summary.activeDays, 3);
});