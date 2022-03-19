import axios from 'axios';
import React, { useState } from 'react';
import { Combo } from './Combo';

export const App = () => {
  const [deckUrl, setDeckUrl] = useState("");
  const [deckData, setDeckData] = useState<DeckData>();

  const findCombos = () => {
    (async () => {
      const { data } = await axios.get("/api/search", { params: { "url": deckUrl } });
      setDeckData(data);
    })();
  }

  return (
    <React.Fragment>
      <nav className="navbar is-info"></nav>
      <div className="section fullheight">
        <div className="container">
          <h1 className="title">What combos are in your deck?</h1>
          <p className="subtitle">You know damn well you don't know</p>
          <div className="field is-horizontal">
            <div className="field-body">
              <div className="field"><input type="text" className="input is-medium" placeholder="Moxfield URL" onInput={(e) => setDeckUrl((e.target as HTMLInputElement).value)} /></div>
              <div className="field">
                <div className="buttons">
                  <button className="button is-primary is-medium" disabled={deckUrl.length < 10} onClick={findCombos}>Gimme combos</button>
                </div>
              </div>
            </div>
          </div>
          {deckData &&
            <div className='container combo-container has-background-grey px-3 pb-4'>
              <hr className="has-background-warning" />
              <h1 className="title">{deckData.meta.name}</h1>
              <p className="subtitle">by {deckData.meta.author}</p>
              {deckData.combos.map(c => <Combo data={c} />)}
            </div>
          }
        </div>
      </div>
    </React.Fragment >
  );
}
