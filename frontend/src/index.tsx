import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style/index.css";
import "mana-font";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import { QueryClient, QueryClientProvider } from "react-query";

const CACHE_TTL_MS = 5 * 60 * 1000;
const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: CACHE_TTL_MS, retry: false, keepPreviousData: true },
  },
});
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
