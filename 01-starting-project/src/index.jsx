import ReactDOM from "react-dom/client";

import App from "./App.jsx";
import "./index.css";
import "./i18n";

const entryPoint = document.getElementById("root");
ReactDOM.createRoot(entryPoint).render(<App />);
