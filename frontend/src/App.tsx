import "@fontsource-variable/inter";
import "@fontsource-variable/josefin-sans";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.min.css";
import { Footer } from "./Footer";
import Nav from "./Nav";
import { Outlet } from "react-router";

export const App = () => {
  return (
    <main className="flex h-full min-h-screen w-full flex-col items-center bg-zinc-800 text-zinc-100">
      <ToastContainer theme="dark" />
      <div className="flex min-h-screen w-full flex-grow flex-col items-center gap-6 px-3 py-6 md:max-w-screen-lg md:gap-12 xl:max-w-screen-lg">
        <Nav />
        <div className="flex w-full flex-grow flex-col">
          <Outlet />
        </div>
      </div>
      <Footer />
    </main>
  );
};
