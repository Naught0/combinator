import { useEffect, useState } from "react";
import { Form } from "./Form";
import { Input } from "./components/ui/input";
import { TabContainer } from "./TabContainer";
import { UserDecksContainer } from "./UserDeck";
import { useQuery } from "@tanstack/react-query";
import { getComboData, getMoxfieldUserData } from "./services";
import { AxiosError } from "axios";
import { Field } from "./Field";
import { ComboContainer } from "./ComboContainer";

export default function MoxfieldSearch() {
  const [userName, setUserName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, error } = useQuery<Deck[], AxiosError>({
    queryKey: ["moxfield-decks", userName],
    queryFn: async () => {
      const data = await getMoxfieldUserData({ userName });
      return data;
    },
    enabled,
  });

  useEffect(
    function disableQuery() {
      if (!data) return;
      setEnabled(false);
    },
    [data],
  );

  return (
    <TabContainer>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          setEnabled(true);
        }}
        disabled={userName.length < 3}
        loading={isLoading}
      >
        <Field error={error && "Unable to find user"}>
          <Input
            placeholder="Moxfield username"
            onChange={(e) => setUserName(e.target.value)}
            value={userName}
            variant={error ? "error" : "default"}
          />
        </Field>
      </Form>
      {data && <UserDecksContainer decks={data} />}
    </TabContainer>
  );
}
