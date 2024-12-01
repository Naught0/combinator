import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import "mana-font";
import React from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { RecoilRoot } from "recoil";
import { App } from "./App";
import reportWebVitals from "./reportWebVitals";
import "./style/index.css";

const queryClient = new QueryClient();
const elem = document.getElementById("root");
if (elem) {
  const root = createRoot(elem);
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <App />
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
