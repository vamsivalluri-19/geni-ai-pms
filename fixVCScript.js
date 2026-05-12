const fs = require('fs');

const file = 'c:/Projects/Gen-AI-Placement-Management-System/frontend/src/components/VideoConference.jsx';
let content = fs.readFileSync(file, 'utf8');

const oldGridClassStr = `
  const videoGridClass = 'grid grid-cols-1 md:grid-cols-2 gap-6 p-4 h-full items-center justify-center';
  const localTileClass = 'flex flex-col items-center justify-center border-2 border-indigo-500 bg-black rounded-2xl overflow-hidden relative aspect-video min-h-[220px] max-h-[340px]';
  const remoteTileClass = 'flex flex-col items-center justify-center border-2 border-blue-400 bg-black rounded-2xl overflow-hidden relative aspect-video min-h-[220px] max-h-[340px]';
`;
const newGridClassStr = `
  const videoGridClass = 'flex flex-col md:flex-row gap-4 p-4 w-full h-full';
  const localTileClass = 'flex-1 relative bg-slate-950 rounded-2xl shadow-inner border border-indigo-500/50 overflow-hidden flex min-h-[250px]';
  const remoteTileClass = 'flex-1 relative bg-slate-950 rounded-2xl shadow-inner border border-blue-500/50 overflow-hidden flex min-h-[250px]';
`;
content = content.replace(oldGridClassStr.trim(), newGridClassStr.trim());

// We also need to fix the parent div styling
const oldDivStr = `<div
          className="bg-black rounded-2xl shadow-lg border border-indigo-400/70 relative w-full overflow-hidden"
          ref={videosContainerRef}
          style={{
            width: '100%',
            aspectRatio: fullscreen ? undefined : compact ? '16 / 9' : '16 / 10',
            height: fullscreen ? '80vh' : 'auto',
            minHeight: fullscreen ? undefined : compact ? '180px' : '220px'
          }}
        >`;
const newDivStr = `<div
          className="bg-black rounded-2xl shadow-2xl border border-indigo-500/50 relative w-full overflow-hidden flex"
          ref={videosContainerRef}
          style={{
            width: '100%',
            height: fullscreen ? '100vh' : compact ? '50vh' : '65vh',
            minHeight: '400px',
            maxHeight: fullscreen ? 'none' : '600px'
          }}
        >`;
content = content.replace(oldDivStr, newDivStr);

// To ensure full screen video covers the tile, replace "className=\"w-full h-full object-cover\"" with object-contain
content = content.replace(/className="w-full h-full object-cover"/g, 'className="absolute inset-0 w-full h-full object-cover"');
content = content.replace(/boxShadow: '0 4px 24px #0004'/g, 'backgroundColor: "#000"');

// There are spans positioned awkwardly, let's fix them:
// <span className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded bg-indigo-600/80 text-white shadow">You</span>
content = content.replace(/className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded bg-indigo-600\/80 text-white shadow"/g, 'className="absolute bottom-4 left-4 text-xs font-bold px-4 py-1.5 rounded-lg bg-indigo-600/90 text-white shadow-lg backdrop-blur z-20"');

content = content.replace(/className="absolute top-2 left-2 text-xs font-bold px-3 py-1 rounded bg-blue-600\/80 text-white shadow"/g, 'className="absolute bottom-4 left-4 text-xs font-bold px-4 py-1.5 rounded-lg bg-blue-600/90 text-white shadow-lg backdrop-blur z-20"');

fs.writeFileSync(file, content, 'utf8');
console.log('VideoConference updated!');
