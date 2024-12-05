import React from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./style/index.css";
import "mana-font";
import reportWebVitals from "./reportWebVitals";
import { RecoilRoot } from "recoil";
import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { createSyncStoragePersister } from "@tanstack/query-sync-storage-persister";
import { persistQueryClient } from "@tanstack/react-query-persist-client";
import { BrowserRouter, Route, Routes } from "react-router";
import { DeckCombos } from "./routes/DeckCombos";
import { MoxfieldUser } from "./routes/MoxfieldUser";
import { Paste } from "./routes/Paste";
import { Search } from "./Search";
import { RedirectDeck } from "./RedirectDeck";

const CACHE_TTL_MS = 15 * 60 * 1000;
const GC_TIME_MS = 1000 * 60 * 60 * 24 * 7;

const persister = createSyncStoragePersister({
  storage: window.localStorage,
});

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: CACHE_TTL_MS, retry: false, gcTime: GC_TIME_MS },
  },
});
persistQueryClient({ queryClient, persister });

const elem = document.getElementById("root");
if (elem) {
  const root = createRoot(elem);
  root.render(
    <React.StrictMode>
      <RecoilRoot>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<App />}>
                <Route path="/" element={<Search />} />
                <Route path="/deck/:source/:deckId" element={<DeckCombos />} />
                <Route path="/deck/*" element={<RedirectDeck />} />
                <Route
                  path="/user/moxfield/:userName"
                  element={<MoxfieldUser />}
                />
                <Route path="/paste/:pastedList" element={<Paste />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </RecoilRoot>
    </React.StrictMode>,
  );
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
