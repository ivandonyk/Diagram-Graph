import * as React from "react";
import { render } from "react-dom";

import 'react-chat-elements/dist/main.css';
import App from "./components/App";

const rootEl = document.getElementById("root");

render(<App />, rootEl);
