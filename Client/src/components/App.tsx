import './App.css'
import Canvas from './canvas/canvas';
import Toolbar from './toolbar/toolbar';
import Topbar from './topbar/topbar';

function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <div className="canvas-zone">
        <Canvas resolution={{ columns: 32, rows: 18 }} />
      </div>
      <Toolbar />
    </div>
  )
}

export default App
