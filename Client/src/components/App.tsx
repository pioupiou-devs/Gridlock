import { useState } from 'react';
import './App.css'
import Canvas from './canvas/canvas';
import Toolbar from './toolbar/toolbar';
import { defaultTools } from './toolbar/toolDefinitions';
import Topbar from './topbar/topbar';

function App() {
  const [selectedToolId, setSelectedToolId] = useState(defaultTools[0].id);

  return (
    <div className="app-shell">
      <Topbar />
      <div className="canvas-zone">
        <Canvas
          resolution={{ columns: 32, rows: 18 }}
          selectedToolId={selectedToolId}
        />
      </div>
      <Toolbar
        activeToolId={selectedToolId}
        onSelectTool={setSelectedToolId}
      />
    </div>
  )
}

export default App
