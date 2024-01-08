import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style/style.sass";
import "mana-font";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-slab";

const elem = document.getElementById("root");
const root = createRoot(elem);
root.render(
  <React.StrictMode>
    <RecoilRoot>
      <App />
    </RecoilRoot>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
