'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';

declare global {
  interface Window {
    BitcoinWriterAnalytics?: {
      readState: () => any;
      getSummary: (state: any) => AnalyticsSummary;
      setDailyGoal: (goal: number) => any;
    };
  }
}

type DaySummary = {
  dateKey: string;
  label: string;
  wordsWritten: number;
  sessions: number;
  goalMet: boolean;
};

type AnalyticsSummary = {
  dailyGoal: number;
  todayWords: number;
  todaySessions: number;
  goalProgress: number;
  currentStreak: number;
  longestStreak: number;
  totalWordsWritten: number;
  totalSessions: number;
  bestDayWords: number;
  activeDays: number;
  averageWordsPerActiveDay: number;
  last7Days: DaySummary[];
  lastUpdatedAt: string | null;
};

const emptySummary: AnalyticsSummary = {
  dailyGoal: 1000,
  todayWords: 0,
  todaySessions: 0,
  goalProgress: 0,
  currentStreak: 0,
  longestStreak: 0,
  totalWordsWritten: 0,
  totalSessions: 0,
  bestDayWords: 0,
  activeDays: 0,
  averageWordsPerActiveDay: 0,
  last7Days: [],
  lastUpdatedAt: null
};

export default function AnalyticsPage() {
  const [summary, setSummary] = useState<AnalyticsSummary>(emptySummary);
  const [goalInput, setGoalInput] = useState('1000');
  const [loaded, setLoaded] = useState(false);

  const refreshSummary = () => {
    const analytics = window.BitcoinWriterAnalytics;
    if (!analytics) {
      return;
    }

    const nextSummary = analytics.getSummary(analytics.readState());
    setSummary(nextSummary);
    setGoalInput(String(nextSummary.dailyGoal));
    setLoaded(true);
  };

  useEffect(() => {
    refreshSummary();

    const handleStorage = () => refreshSummary();
    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, []);

  const highestDailyValue = useMemo(() => {
    const values = summary.last7Days.map((day) => day.wordsWritten);
    return Math.max(summary.dailyGoal, 1, ...values);
  }, [summary.dailyGoal, summary.last7Days]);

  const saveGoal = () => {
    const analytics = window.BitcoinWriterAnalytics;
    if (!analytics) {
      return;
    }

    const nextGoal = Number(goalInput);
    if (!Number.isFinite(nextGoal) || nextGoal < 100) {
      setGoalInput(String(summary.dailyGoal));
      return;
    }

    analytics.setDailyGoal(nextGoal);
    refreshSummary();
  };

  return (
    <>
      <Script src="/js/writing-analytics.js" strategy="beforeInteractive" onLoad={refreshSummary} />
      <div
        style={{
          minHeight: '100vh',
          background: 'radial-gradient(circle at top, rgba(247, 147, 26, 0.18), transparent 35%), #111111',
          color: '#f4f4f4',
          padding: '96px 24px 48px'
        }}
      >
        <div style={{ maxWidth: '1120px', margin: '0 auto' }}>
          <div
            style={{
              display: 'flex',
              flexWrap: 'wrap',
              justifyContent: 'space-between',
              gap: '16px',
              alignItems: 'flex-start',
              marginBottom: '32px'
            }}
          >
            <div>
              <p style={{ color: '#f7931a', fontSize: '12px', letterSpacing: '0.18em', textTransform: 'uppercase', marginBottom: '8px' }}>
                Writing Analytics
              </p>
              <h1 style={{ fontSize: '40px', lineHeight: 1.1, margin: 0 }}>Productivity Dashboard</h1>
              <p style={{ color: '#b9b9b9', fontSize: '16px', maxWidth: '620px', marginTop: '12px' }}>
                Track writing velocity, daily targets, and streaks across Bitcoin Writer sessions.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <Link
                href="/write"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '12px 18px',
                  borderRadius: '12px',
                  background: '#f7931a',
                  color: '#111111',
                  textDecoration: 'none',
                  fontWeight: 700
                }}
              >
                Back To Editor
              </Link>
              <button
                type="button"
                onClick={refreshSummary}
                style={{
                  padding: '12px 18px',
                  borderRadius: '12px',
                  border: '1px solid rgba(255,255,255,0.18)',
                  background: 'rgba(255,255,255,0.04)',
                  color: '#f4f4f4',
                  fontWeight: 600,
                  cursor: 'pointer'
                }}
              >
                Refresh
              </button>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
              marginBottom: '24px'
            }}
          >
            {[
              { label: 'Today', value: summary.todayWords.toLocaleString() + ' words', note: summary.todaySessions + ' sessions' },
              { label: 'Current Streak', value: summary.currentStreak + ' days', note: 'Best: ' + summary.longestStreak + ' days' },
              { label: 'Total Output', value: summary.totalWordsWritten.toLocaleString() + ' words', note: summary.activeDays + ' active days' },
              { label: 'Best Day', value: summary.bestDayWords.toLocaleString() + ' words', note: 'Average active day: ' + summary.averageWordsPerActiveDay.toLocaleString() }
            ].map((card) => (
              <div
                key={card.label}
                style={{
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid rgba(255,255,255,0.08)',
                  borderRadius: '18px',
                  padding: '20px'
                }}
              >
                <div style={{ color: '#b0b0b0', fontSize: '13px', marginBottom: '10px' }}>{card.label}</div>
                <div style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{card.value}</div>
                <div style={{ color: '#8f8f8f', fontSize: '13px' }}>{card.note}</div>
              </div>
            ))}
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'minmax(0, 2fr) minmax(320px, 1fr)',
              gap: '16px',
              alignItems: 'start'
            }}
          >
            <section
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', flexWrap: 'wrap', marginBottom: '20px' }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: '22px' }}>Last 7 Days</h2>
                  <p style={{ margin: '8px 0 0', color: '#9f9f9f' }}>Positive word deltas only. Deletions do not reduce your totals.</p>
                </div>
                <div style={{ color: '#9f9f9f', fontSize: '13px', alignSelf: 'center' }}>
                  {summary.totalSessions.toLocaleString()} sessions recorded
                </div>
              </div>

              <div style={{ display: 'grid', gap: '14px' }}>
                {summary.last7Days.map((day) => {
                  const width = Math.max(6, Math.round((day.wordsWritten / highestDailyValue) * 100));
                  return (
                    <div key={day.dateKey}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px' }}>
                        <span style={{ color: '#d7d7d7' }}>{day.label}</span>
                        <span style={{ color: day.goalMet ? '#f7931a' : '#989898' }}>
                          {day.wordsWritten.toLocaleString()} words · {day.sessions} sessions
                        </span>
                      </div>
                      <div style={{ height: '12px', borderRadius: '999px', background: 'rgba(255,255,255,0.07)', overflow: 'hidden' }}>
                        <div
                          style={{
                            width: width + '%',
                            height: '100%',
                            borderRadius: '999px',
                            background: day.goalMet
                              ? 'linear-gradient(90deg, #f7931a 0%, #ffb14d 100%)'
                              : 'linear-gradient(90deg, #5a5a5a 0%, #818181 100%)',
                            transition: 'width 0.25s ease'
                          }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>

            <section
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
                borderRadius: '20px',
                padding: '24px',
                display: 'grid',
                gap: '20px'
              }}
            >
              <div>
                <h2 style={{ margin: 0, fontSize: '22px' }}>Daily Goal</h2>
                <p style={{ margin: '8px 0 0', color: '#9f9f9f' }}>Set a target that keeps your streak honest.</p>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', marginBottom: '8px' }}>
                  <span>{summary.todayWords.toLocaleString()} / {summary.dailyGoal.toLocaleString()} words</span>
                  <span>{Math.round(summary.goalProgress * 100)}%</span>
                </div>
                <div style={{ height: '14px', borderRadius: '999px', background: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
                  <div
                    style={{
                      width: Math.max(4, Math.round(summary.goalProgress * 100)) + '%',
                      height: '100%',
                      borderRadius: '999px',
                      background: 'linear-gradient(90deg, #f7931a 0%, #ffcd75 100%)'
                    }}
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gap: '10px' }}>
                <label htmlFor="daily-goal" style={{ fontSize: '13px', color: '#bdbdbd' }}>Daily word goal</label>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <input
                    id="daily-goal"
                    type="number"
                    min={100}
                    step={100}
                    value={goalInput}
                    onChange={(event) => setGoalInput(event.target.value)}
                    style={{
                      flex: 1,
                      padding: '12px 14px',
                      borderRadius: '12px',
                      border: '1px solid rgba(255,255,255,0.14)',
                      background: 'rgba(0,0,0,0.22)',
                      color: '#f4f4f4'
                    }}
                  />
                  <button
                    type="button"
                    onClick={saveGoal}
                    style={{
                      padding: '12px 16px',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#f7931a',
                      color: '#111111',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Save
                  </button>
                </div>
              </div>

              <div style={{ paddingTop: '4px', borderTop: '1px solid rgba(255,255,255,0.08)', color: '#9f9f9f', fontSize: '13px', display: 'grid', gap: '8px' }}>
                <div>Writers earn progress from net new words typed in the editor.</div>
                <div>Sessions roll over after 5 minutes of inactivity.</div>
                <div>{loaded ? 'Last updated: ' + (summary.lastUpdatedAt ? new Date(summary.lastUpdatedAt).toLocaleString() : 'No activity yet') : 'Loading analytics...'}</div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </>
  );
}