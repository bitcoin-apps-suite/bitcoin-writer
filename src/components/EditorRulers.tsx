import React from 'react';
import './EditorRulers.css';

interface EditorRulersProps {
  showRulers: boolean;
}

const EditorRulers: React.FC<EditorRulersProps> = ({ showRulers }) => {
  if (!showRulers) return null;

  return (
    <>
      {/* Horizontal Ruler */}
      <div className="editor-horizontal-ruler">
        <div className="ruler-marks-container">
          {[...Array(9)].map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className="ruler-mark inch" 
                style={{ left: `${50 + i * 96}px` }}
              >
                <span className="ruler-mark-label">{i}"</span>
              </div>
              {/* Only show subdivision marks before the 8-inch mark (A4 width) */}
              {i < 8 && (
                <>
                  <div 
                    className="ruler-mark half-inch" 
                    style={{ left: `${50 + i * 96 + 48}px` }}
                  />
                  <div 
                    className="ruler-mark quarter-inch" 
                    style={{ left: `${50 + i * 96 + 24}px` }}
                  />
                  <div 
                    className="ruler-mark quarter-inch" 
                    style={{ left: `${50 + i * 96 + 72}px` }}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
      
      {/* Vertical Ruler - A4 is 11.69 inches tall, show 0-12 */}
      <div className="editor-vertical-ruler">
        <div className="ruler-marks-container">
          {[...Array(12)].map((_, i) => (
            <React.Fragment key={i}>
              <div 
                className="ruler-mark inch" 
                style={{ top: `${18 + i * 72}px` }}
              >
                <span className="ruler-mark-label">{i}"</span>
              </div>
              <div 
                className="ruler-mark half-inch" 
                style={{ top: `${18 + i * 72 + 36}px` }}
              />
              <div 
                className="ruler-mark quarter-inch" 
                style={{ top: `${18 + i * 72 + 18}px` }}
              />
              <div 
                className="ruler-mark quarter-inch" 
                style={{ top: `${18 + i * 72 + 54}px` }}
              />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default EditorRulers;