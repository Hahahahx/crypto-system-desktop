import React from "react";
import ReactDOM from "react-dom";
import { Routers } from "ux-autoroute";
import routeConfig from "./router";
import "@styles/index.less";

const App = () => {
  return <Routers type="hash" routers={routeConfig} />;
};

ReactDOM.render(<App />, document.getElementById("app"));
