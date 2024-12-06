import { useNavigate, useParams } from "react-router";
import { Loading } from "../Loading";
import { parseDeckUrl } from "../services";
import { useEffect } from "react";

export function RedirectDeck() {
  const { "*": deckUrl } = useParams();
  let navigate = useNavigate();
  if (!deckUrl) {
    navigate("/");
  }
  useEffect(() => {
    if (!deckUrl) return;
    (async () => {
      const data = await parseDeckUrl(deckUrl);
      if (data) navigate(`/deck/${data.source}/${data.id}`, { replace: true });
    })();
  }, [deckUrl]);

  return <Loading size="lg" message="Looking for deck" />;
}
