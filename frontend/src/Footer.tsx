import { Hyperlink } from "./Hyperlink";

export const Footer = () => {
  return (
    <footer className="footer has-background-grey">
      <div className="content is-size-7 has-text-centered">
        <p>
          <a href="https://jamese.dev" rel="noreferrer" target="_blank">
            I made dis
          </a>
          {" and it's "}
          <Hyperlink href="https://github.com/naught0/combinator">
            open source
          </Hyperlink>
        </p>
        <p>
          combo data from the wise &amp; powerful{" "}
          <a
            href="https://commanderspellbook.com/"
            rel="noreferrer"
            target="_blank"
          >
            Commander&apos;s Spellbook
          </a>
        </p>
        <p>
          cool mana icons from{" "}
          <a
            href="https://mana.andrewgioia.com/index.html"
            rel="noreferrer"
            target="_blank"
          >
            Andrew Gioia
          </a>
        </p>
        <p>
          <span>other stuff: </span>
          <span>
            <Hyperlink href="https://fontawesome.com/">font awesome</Hyperlink>,{" "}
          </span>
          <span>
            <Hyperlink href="https://bulma.io/">bulma</Hyperlink>,{" "}
          </span>
          <span>
            <Hyperlink href="https://moxfield.com/">moxfield</Hyperlink>,{" "}
          </span>
          <span>
            <Hyperlink href="https://archidekt.com/">archidekt</Hyperlink>
            {", & "}
          </span>
          <span>
            <Hyperlink href="https://www.mtggoldfish.com/">
              mtggoldfish
            </Hyperlink>
          </span>
        </p>
      </div>
    </footer>
  );
};
