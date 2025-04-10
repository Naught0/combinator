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
      <div className="flex flex-grow flex-col items-center md:max-w-screen-xl">
        <ToastContainer theme="dark" />
        <div className="flex min-h-screen w-full flex-grow flex-col items-center gap-6 px-6 py-6 md:gap-12 md:px-12">
          <Nav />
          <div className="flex w-full flex-grow flex-col">
            <Outlet />
          </div>
        </div>
        <ScrollToTop />
      </div>
      <Footer />
    </main>
  );
};
