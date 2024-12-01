import { useState } from "react";
import { Form } from "./Form";
import { Input } from "./components/ui/input";
import { TabContainer } from "./TabContainer";
import { UserDecksContainer } from "./UserDeck";
import { useQuery } from "react-query";
import { getMoxfieldUserData } from "./services";
import { AxiosError } from "axios";
import { Field } from "./Field";

export default function MoxfieldSearch() {
  const [userName, setUserName] = useState("");
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, error } = useQuery<Deck[], AxiosError>(
    ["moxfield-decks", userName],
    () => getMoxfieldUserData({ userName }),
    {
      enabled,
      onSettled() {
        setEnabled(false);
      },
      keepPreviousData: true,
      retry: false,
    },
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
