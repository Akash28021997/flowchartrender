import React, { useState } from 'react';
import Xarrow from 'react-xarrows';
import './Arrow.css';

function Arrow() {
    const [startText, setStartText] = useState('100');

  return (
    <div className="Arrow">
      <div id="start" className="box start-box" style={{position: 'absolute', top: '100px', left: '300px'}}>
        <input
          type="text"
          value={startText}
          onChange={(e) => setStartText(e.target.value)}
          style={{ border: 'none', background: 'transparent', textAlign: 'center', width: '30px' }}
        />
      </div>
      <div id="end" className="box end-box" style={{position: 'absolute', top: '100px', left: '250px'}}>
      </div>
      <div className="arrow-container">
            <Xarrow 
                start="start" 
                end="end" 
                color="black"
                headSize={4}
                strokeWidth={2}
                curveness={0.8}
                path="smooth"
            />
        </div>
    </div>
  );
}

export default Arrow;
