import React from "react";
import { Typography } from "antd";

import "antd/dist/antd.css";
import "./App.css";
import DApp from "./DApp";
function App() {
  return (
    <div className="App">
      <Typography.Title>Multichain SDK Demo</Typography.Title>
      <a
        href="https://github.com/skyorion427/multichain-sdk-demo"
        target="_blank"
        rel="noopener noreferrer"
      >
        <Typography.Title level={3} className="code-link">
          {"< / >"} Anyone can build a dApp on Thorchain.
        </Typography.Title>
      </a>
      <DApp />
    </div>
  );
}

export default App;
