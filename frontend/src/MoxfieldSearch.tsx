import React, { useState } from "react";
import { Form } from "./Form";
import { Input } from "./components/ui/input";
import { useMoxfieldData } from "./hooks/useComboData";
import { TabContainer } from "./TabContainer";
import { UserDecksContainer } from "./UserDeck";

export default function MoxfieldSearch() {
  const [userName, setUserName] = useState("");
  const {
    get: getMoxfieldDecks,
    data,
    loading: loadingMoxfield,
    error: moxfieldError,
    page,
    setPage,
    pageSize,
    setPageSize,
  } = useMoxfieldData({
    userName,
  });

  return (
    <TabContainer>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          await getMoxfieldDecks();
        }}
        disabled={userName.length < 3}
        loading={loadingMoxfield}
      >
        <Input
          placeholder="Moxfield username"
          onChange={(e) => setUserName(e.target.value)}
          value={userName}
        />
      </Form>
      <UserDecksContainer decks={data} />
    </TabContainer>
  );
}
