import React from 'react';

export function Background() {
  return (
    <div className="fixed inset-0 pointer-events-none">
      <div className="absolute inset-0">
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="vertical-lines" x="0" y="0" width="20" height="100%" patternUnits="userSpaceOnUse">
                <line x1="10" y1="0" x2="10" y2="100%" stroke="white" strokeWidth="0.5" />
              </pattern>
            </defs>
            <rect x="0" y="0" width="100%" height="100%" fill="url(#vertical-lines)" />
          </svg>
        </div>
      </div>
    </div>
  );
}