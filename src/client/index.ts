import "./css/index.css";
import "./thirdparty/jscolor";
import "./pages/gameplay";
import {showGameplay} from "./pages/gameplay";

document.getElementById('join').onclick = e => {
     showGameplay();
};

