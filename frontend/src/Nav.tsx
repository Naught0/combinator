import logo from "./images/logo.svg";

export default function Nav() {
  return (
    <div className="flex w-full flex-row flex-wrap items-center gap-3">
      <div className="flex flex-row items-center gap-2">
        <img src={logo} alt="" width={32} />
        <span className="font-serif text-3xl font-medium md:text-4xl">
          <span className="text-orange-300">mtg</span>
          <wbr />
          combinator
        </span>
      </div>
      <div className="italic text-zinc-300">
        infinite combos, finite brain cells
      </div>
    </div>
  );
}
