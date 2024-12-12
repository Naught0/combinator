import { Hyperlink } from "./Hyperlink";
import { Waves } from "./Waves";

const ResourceColumn = ({
  children,
  title,
}: React.PropsWithChildren<{ title: string }>) => {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-base font-bold">{title}</h3>
      {children}
    </div>
  );
};

export const Footer = () => {
  return (
    <footer className="flex w-full flex-col items-center justify-start bg-zinc-900 pb-36">
      <Waves />

      <div className="flex w-full max-w-screen-md flex-col gap-3 text-sm">
        <div className="flex w-full flex-col gap-6 pt-36 md:pt-48">
          <div className="flex flex-grow flex-row flex-wrap justify-evenly gap-6">
            <ResourceColumn title={"MTG Resources"}>
              <p>
                <a
                  href="https://commanderspellbook.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  Commander&apos;s Spellbook
                </a>
              </p>
              <p>
                <Hyperlink href="https://scryfall.com/">Scryfall</Hyperlink>
              </p>
              <p>
                <Hyperlink href="https://www.mtggoldfish.com/" className="">
                  MTGGoldfish
                </Hyperlink>
              </p>
              <p>
                <Hyperlink href="https://moxfield.com/">Moxfield</Hyperlink>
              </p>
              <p>
                <Hyperlink href="https://archidekt.com/">Archidekt</Hyperlink>
              </p>
              <p>
                <a
                  href="https://mana.andrewgioia.com/index.html"
                  rel="noreferrer"
                  target="_blank"
                >
                  Mana Icons
                </a>
              </p>
            </ResourceColumn>
            <ResourceColumn title={"About"}>
              <p>
                <a href="https://jamese.dev" rel="noreferrer" target="_blank">
                  @naught0 - author
                </a>
              </p>
              <p>
                <Hyperlink href="https://github.com/naught0/combinator">
                  Source
                </Hyperlink>
              </p>
            </ResourceColumn>
          </div>
        </div>
        <div className="my-6 flex flex-col items-center gap-1">
          <p>
            <b>mtgcombinator</b> is in no way associated with{" "}
            <a href="https://company.wizards.com">Wizards of the Coast</a>
          </p>
        </div>
      </div>
    </footer>
  );
};
