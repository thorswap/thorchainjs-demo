import React from "react";
import { Typography } from "antd";

import "antd/dist/antd.css";
import "./App.css";
import DApp from "./DApp";

function App() {
  return (
    <div className="App">
      <Typography.Title>Multichain SDK Demo</Typography.Title>
      <Typography.Title level={3}>
        Anyone can build a dApp on Thorchain.
      </Typography.Title>
      <DApp />
    </div>
  );
}

export default App;
