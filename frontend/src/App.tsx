import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import Nav from "./Nav";
import { Outlet } from "react-router";
import { ScrollToTop } from "./ScrollToTop";

export const App = () => {
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center bg-zinc-900 text-zinc-100">
      <ToastContainer theme="dark" />
      <div className="flex min-h-screen w-full flex-grow flex-col items-center gap-6 px-3 py-6 md:max-w-screen-lg md:gap-12 xl:max-w-screen-2xl">
        <Nav />
        <p className="max-w-screen-sm bg-red-400/30 px-4 py-3 text-center">
          Combo search is currently broken due to a change in the Commander
          Spellbook API. Functionality will be restored soon.
        </p>
        <div className="flex w-full flex-grow flex-col">
          <Outlet />
        </div>
      </div>
      <ScrollToTop />
      <Footer />
    </main>
  );
};
