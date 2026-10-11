import React, { useMemo, useState, useEffect } from 'react';

interface WritingAnalyticsProps {
  text: string;
}

const WritingAnalytics: React.FC<WritingAnalyticsProps> = ({ text }) => {
  const [targetWordCount, setTargetWordCount] = useState(() => {
    if (typeof window !== 'undefined') {
      return parseInt(localStorage.getItem('writing_target') || '500');
    }
    return 500;
  });

  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('writing_target', targetWordCount.toString());
    }
  }, [targetWordCount]);

  // Simple Streak Logic: Check if user has written something today
  useEffect(() => {
    if (typeof window !== 'undefined' && text.length > 10) {
      const today = new Date().toDateString();
      const lastWriteDate = localStorage.getItem('last_write_date');
      let currentStreak = parseInt(localStorage.getItem('writing_streak') || '0');

      if (lastWriteDate !== today) {
        const yesterday = new Date();
        yesterday.setDate(yesterday.getDate() - 1);
        
        if (lastWriteDate === yesterday.toDateString()) {
          currentStreak += 1;
        } else {
          currentStreak = 1;
        }
        localStorage.setItem('last_write_date', today);
        localStorage.setItem('writing_streak', currentStreak.toString());
        setStreak(currentStreak);
      } else {
        setStreak(currentStreak || 1);
      }
    }
  }, [text]);

  const stats = useMemo(() => {
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
    const charCount = cleanText.length;
    const wordCount = words.length;
    
    const readTimeMins = Math.ceil(wordCount / 200);
    const speakTimeMins = Math.ceil(wordCount / 130);
    const progress = Math.min(Math.round((wordCount / targetWordCount) * 100), 100);
    const sentences = cleanText.split(/[.!?]+/).filter(s => s.trim().length > 0);
    const avgSentenceLength = sentences.length > 0 ? Math.round(wordCount / sentences.length) : 0;

    return {
      wordCount,
      charCount,
      readTimeMins,
      speakTimeMins,
      progress,
      avgSentenceLength,
      sentenceCount: sentences.length
    };
  }, [text, targetWordCount]);

  return (
    <div className="writing-analytics-panel" style={{
      padding: '16px',
      backgroundColor: '#1a1a1a',
      color: '#eee',
      borderRadius: '8px',
      fontSize: '13px',
      border: '1px solid #333'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
        <h4 style={{ margin: 0, fontSize: '14px' }}>Writing Analytics</h4>
        <div style={{ fontSize: '11px', color: '#ff9800', fontWeight: 'bold' }}>
          🔥 {streak} DAY STREAK
        </div>
      </div>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span style={{ fontSize: '11px', color: '#888' }}>GOAL PROGRESS</span>
          <span>{stats.progress}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px', marginBottom: '8px' }}>
          <div style={{ 
            width: `${stats.progress}%`, 
            height: '100%', 
            backgroundColor: stats.progress >= 100 ? '#4caf50' : '#2196f3',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
        </div>
        <div style={{ display: 'flex', alignItems: 'center', fontSize: '11px' }}>
          <input 
            type="number" 
            value={targetWordCount} 
            onChange={(e) => setTargetWordCount(Math.max(1, parseInt(e.target.value) || 0))}
            style={{ width: '50px', background: 'transparent', border: '1px solid #444', color: '#fff', marginRight: '5px', padding: '2px' }}
          />
          <span style={{ color: '#888' }}>word goal ({stats.wordCount} written)</span>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div className="stat-item">
          <div style={{ color: '#888', fontSize: '11px' }}>READ TIME</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>~{stats.readTimeMins} min</div>
        </div>
        <div className="stat-item">
          <div style={{ color: '#888', fontSize: '11px' }}>SPEAK TIME</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>~{stats.speakTimeMins} min</div>
        </div>
        <div className="stat-item">
          <div style={{ color: '#888', fontSize: '11px' }}>SENTENCES</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{stats.sentenceCount}</div>
        </div>
        <div className="stat-item">
          <div style={{ color: '#888', fontSize: '11px' }}>AVG. SENTENCE</div>
          <div style={{ fontSize: '16px', fontWeight: 'bold' }}>{stats.avgSentenceLength} words</div>
        </div>
      </div>

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #333', color: '#888', fontSize: '11px', display: 'flex', justifyContent: 'space-between' }}>
        <span>Chars: {stats.charCount}</span>
        <span>Target: {targetWordCount}</span>
      </div>
    </div>
  );
};

export default WritingAnalytics;
