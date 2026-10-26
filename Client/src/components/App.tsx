import { useState } from 'react';
import './App.css'
import Canvas from './canvas/canvas';
import Toolbar from './toolbar/toolbar';
import { defaultTools } from './toolbar/toolDefinitions';
import { defaultTileDefinitions } from './canvas/tileDefinitions';
import Topbar from './topbar/topbar';
import { SignalRProvider } from '../context/SignalRContext';

function App() {
  const [selectedToolId, setSelectedToolId] = useState(defaultTools[0].id);

  return (
    <SignalRProvider>
      <div className="app-shell">
        <Topbar />
        {/* <div className="canvas-zone">
          <Canvas
            resolution={{ columns: 32, rows: 18 }}
            selectedToolId={selectedToolId}
            toolDefinitions={defaultTools}
            tileDefinitions={defaultTileDefinitions}
          />
        </div> */}
        <Toolbar
          activeToolId={selectedToolId}
          onSelectTool={setSelectedToolId}
          tools={defaultTools}
        />
      </div>
    </SignalRProvider>
  )
}

export default App
