import { useEffect, useState } from "react";
import { Form } from "./Form";
import { Input } from "./components/ui/input";
import { TabContainer } from "./TabContainer";
import { UserDecksContainer } from "./UserDeck";
import { useQuery } from "@tanstack/react-query";
import { getMoxfieldUserData } from "./services";
import { AxiosError } from "axios";
import { Field } from "./Field";
import { useRecoilState } from "recoil";
import { moxfieldUserNameAtom } from "./atoms";

export default function MoxfieldSearch() {
  const [userName, setUserName] = useRecoilState(moxfieldUserNameAtom);
  const [enabled, setEnabled] = useState(false);
  const { data, isLoading, error, isFetched } = useQuery<Deck[], AxiosError>({
    queryKey: ["moxfield-decks", userName],
    queryFn: () => getMoxfieldUserData({ userName }),
    enabled,
  });

  useEffect(
    function disableQuery() {
      setEnabled(false);
    },
    [isFetched],
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
            name="moxfield-username"
            placeholder="Moxfield username"
            onChange={(e) => setUserName(e.target.value.trim())}
            value={userName}
            variant={error ? "error" : "default"}
          />
        </Field>
      </Form>
      {data && <UserDecksContainer decks={data} />}
    </TabContainer>
  );
}
