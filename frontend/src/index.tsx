import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style/style.sass";
import "mana-font";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import { ChakraProvider } from "@chakra-ui/react";
import { chakraTheme } from "./chakra/theme";
import "@fontsource/josefin-slab";
import "@fontsource/inter";
import "@fontsource/jetbrains-mono";

const elem = document.getElementById("root");
if (elem) {
  const root = createRoot(elem);
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <ChakraProvider theme={chakraTheme}>
          <App />
        </ChakraProvider>
      </RecoilRoot>
    </React.StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
