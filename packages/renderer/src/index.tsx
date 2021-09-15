import React from "react";
import ReactDOM from "react-dom";
import { Routers } from "ux-autoroute";
import routeConfig from "./router";
import "@styles/index.less";
import { ReduxProvider } from "ux-redux-module";
import { module } from "@/models";

const App = () => {
  return (
    <ReduxProvider value={module}>
      <Routers type="hash" routers={routeConfig} />
    </ReduxProvider>
  );
};

ReactDOM.render(<App />, document.getElementById("app"));
