import React from 'react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-12 pt-8 border-t border-gray-700">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex flex-col items-center space-y-4">
          {/* Draw Steel Logo and Legal Text */}
          <div className="flex items-center justify-center gap-4 max-w-4xl">
            <img 
              src={`${process.env.PUBLIC_URL}/Powered_By_Draw_Steel.webp`}
              alt="Powered by Draw Steel"
              className="h-4 w-auto max-w-16 object-contain flex-shrink-0"
              style={{ maxHeight: '80px', height: '80px', width: 'auto' }}
              onError={(e) => {
                // Hide image if file doesn't exist
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
            <div className="text-gray-400 text-sm">
              <p>
                Draw Steel Encounter Builder is an independent product published under the DRAW STEEL Creator License 
                and is not affiliated with MCDM Productions, LLC. DRAW STEEL © 2024 MCDM Productions, LLC.
              </p>
            </div>
          </div>
          
          {/* Additional Footer Info */}
          <div className="text-center text-gray-500 text-xs">
            <p>Built with React • Deployed with GitHub Pages</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
