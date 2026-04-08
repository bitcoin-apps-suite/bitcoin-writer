import React, { useMemo } from 'react';

interface WritingAnalyticsProps {
  text: string;
  targetWordCount?: number;
}

const WritingAnalytics: React.FC<WritingAnalyticsProps> = ({ text, targetWordCount = 500 }) => {
  const stats = useMemo(() => {
    const cleanText = text.trim();
    const words = cleanText ? cleanText.split(/\s+/).filter(w => w.length > 0) : [];
    const charCount = cleanText.length;
    const wordCount = words.length;
    
    // Estimates
    const readTimeMins = Math.ceil(wordCount / 200); // 200 wpm average
    const speakTimeMins = Math.ceil(wordCount / 130); // 130 wpm average
    
    // Progress
    const progress = Math.min(Math.round((wordCount / targetWordCount) * 100), 100);
    
    // Sentiment/Tone (Simulated for MVP)
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
      <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', borderBottom: '1px solid #333', paddingBottom: '8px' }}>
        Writing Analytics
      </h4>
      
      <div style={{ marginBottom: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
          <span>Goal Progress ({stats.wordCount} / {targetWordCount} words)</span>
          <span>{stats.progress}%</span>
        </div>
        <div style={{ width: '100%', height: '6px', backgroundColor: '#333', borderRadius: '3px' }}>
          <div style={{ 
            width: `${stats.progress}%`, 
            height: '100%', 
            backgroundColor: stats.progress >= 100 ? '#4caf50' : '#2196f3',
            borderRadius: '3px',
            transition: 'width 0.3s ease'
          }} />
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

      <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1px solid #333', color: '#888', fontSize: '11px' }}>
        Character count: {stats.charCount}
      </div>
    </div>
  );
};

export default WritingAnalytics;
