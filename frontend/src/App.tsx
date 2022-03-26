import { faCircleRight } from '@fortawesome/free-regular-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import React, { useState } from 'react';
import { Combo } from './Combo';
import { Footer } from './Footer';
import logo from "./images/logo.svg";

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [deckData, setDeckData] = useState<DeckData>();
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState<string>();

  const findCombos = () => {
    setDeckData(undefined);
    setError(undefined);

    (async () => {
      setFetching(true);
      try {
        const { data } = await axios.get("/api/search", { params: { "url": deckUrl } });
        setDeckData(data);
      } catch (e) {
        setError("Error -- Ensure you provided a valid Moxfield, MTGGoldfish, or Archidekt URL.");
      }
      setFetching(false);
    })();

  }

  return (
    <React.Fragment>
      <nav className="navbar has-background-grey has-shadow px-4">
        <div className="navbar-brand">
          <div className="navbar-item">
            <span className="icon-text">
              <span className="icon mr-4"><img src={logo} alt="" style={{ minWidth: "64px" }} /></span>
              <span className="fancy">infinite combos, finite brain cells</span>
            </span>
          </div>
        </div>
      </nav>
      <div className="section fullheight">
        <div className="container">
          <h1 className="title">What combos are in your deck?</h1>
          <div className="field is-horizontal mb-5">
            <div className="field-body">
              <div className="field">
                <input type="text" className={`input is-medium ${error && "is-danger"}`} placeholder="Archidekt, Moxfield, or MTGGoldfish deck URL" onInput={(e) => setDeckUrl((e.target as HTMLInputElement).value)} />
                {error && <p className="has-text-danger help">{error}</p>}
              </div>
              <div className="field">
                <div className="buttons">
                  <button className={`button is-primary is-medium ${fetching && "is-loading"}`} disabled={deckUrl.length < 10} onClick={findCombos}>
                    <span>think for me</span>
                    <span className="icon">
                      <FontAwesomeIcon icon={faCircleRight} />
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
          {deckData &&
            <div className='container combo-container has-background-grey p-5'>
              <h1 className="title">{deckData.meta.name}</h1>
              <p className="subtitle mb-2">by {deckData.meta.author}</p>
              {deckData.combos.length > 0 && <p className='mb-4 help'><i>Click a combo to see its prerequisites and steps</i></p>}
              {deckData.combos.length > 0 && deckData.combos.map(c => <Combo data={c} />)}
              {!(deckData.combos.length > 0) && <h1 className='is-size-4'>💡 Pro Tip: Try adding some combos to your list</h1>}
            </div>
          }
        </div>
      </div>
      <Footer />
    </React.Fragment >
  );
}
