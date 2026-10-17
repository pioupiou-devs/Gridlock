import ButtonHolder from "./ButtonHolder";
import "./toolbar.css";

const staticButtonLabels = ["Brush", "Eraser", "Fill", "Reset"];
const dynamicButtonPlaceholders = ["Action A", "Action B"];

function Toolbar() {
    return (
        <div className="toolbar-wrap">
            <footer className="toolbar">
                <div className="toolbar-section">
                    <strong>Static</strong>
                    <ButtonHolder labels={staticButtonLabels} />
                </div>
                <div className="toolbar-section">
                    <strong>Dynamic</strong>
                    <ButtonHolder labels={dynamicButtonPlaceholders} />
                </div>
            </footer>
        </div>
    );
}

export default Toolbar;