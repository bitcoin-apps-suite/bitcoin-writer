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
                style={{ left: `${57.5 + i * 150}px` }}
              >
                <span className="ruler-mark-label">{i}"</span>
              </div>
              {/* Only show subdivision marks before the 8-inch mark (A4 width) */}
              {i < 8 && (
                <>
                  <div 
                    className="ruler-mark half-inch" 
                    style={{ left: `${57.5 + i * 150 + 75}px` }}
                  />
                  <div 
                    className="ruler-mark quarter-inch" 
                    style={{ left: `${57.5 + i * 150 + 37}px` }}
                  />
                  <div 
                    className="ruler-mark quarter-inch" 
                    style={{ left: `${57.5 + i * 150 + 112}px` }}
                  />
                </>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default EditorRulers;