import { Link } from "react-router";
import logo from "./images/logo.svg";

export default function Nav() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center justify-center gap-3">
      <div className="flex flex-row items-center gap-2">
        <Link
          to="/"
          className="inline-flex font-serif text-2xl font-medium text-white no-underline sm:text-3xl md:text-4xl"
        >
          <span className="inline-flex flex-wrap items-center">
            <span className="inline-flex items-center gap-1">
              <img className="w-5 sm:w-9" src={logo} alt="" width={32} />
              <span className="text-hit-pink-300">mtg</span>
            </span>
            <wbr />
            combinator
          </span>
        </Link>
      </div>
      <p className="text-sm italic text-zinc-300 sm:text-base">
        infinite combos, finite brain cells
      </p>
    </div>
  );
}
