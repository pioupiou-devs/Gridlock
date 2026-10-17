import '../App.css'
import Canvas from './canvas/canvas';
import Toolbar from './toolbar/toolbar';
import Topbar from './topbar/topbar';

function App() {
  return (
    <>
      <Topbar/>
      <div style={{backgroundColor: "darkgreen"}}>
        <Canvas/>
        <Toolbar/>
      </div>
    </>
  )
}

export default App
