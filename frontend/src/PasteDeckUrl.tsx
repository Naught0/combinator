import { useNavigate, useParams } from "react-router";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { Input } from "./components/ui/input";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { parseDeckUrl } from "./services";
import { AxiosError } from "axios";

export function PasteDeckUrl() {
  const { deckUrl } = useParams<{ deckUrl: string }>();
  const [value, setValue] = useState(deckUrl ?? "");
  const [submittedUrl, setSubmittedUrl] = useState<string | null>(null);
  const submitted = submittedUrl !== null;
  let navigate = useNavigate();
  const { data, error } = useQuery<DeckData, AxiosError>({
    queryKey: ["deck-url", submittedUrl],
    queryFn: async () => {
      return await parseDeckUrl(submittedUrl!);
    },
    enabled: submitted,
  });
  useEffect(
    function redirectOnDeckData() {
      if (!data) return;
      setSubmittedUrl(null);
      navigate(`/deck/${data.source}/${data.id}`, { replace: true });
    },
    [data],
  );
  return (
    <TabContainer>
      <Form
        onSubmit={(e) => {
          e.preventDefault();
          setSubmittedUrl(value);
        }}
        disabled={value.length < 5 || submitted}
        loading={submitted}
      >
        <Field>
          <Input
            name="deck-url"
            type="text"
            placeholder="Moxfield, Archidekt, or MTGGoldfish deck URL"
            variant={!!error ? "error" : "default"}
            onInput={(e) => {
              setValue((e.target as HTMLInputElement).value);
              if (submitted) setSubmittedUrl(null);
            }}
            value={value}
          />
          <p className="text-sm text-red-100">
            {((error as AxiosError)?.response?.data as { detail?: string })
              ?.detail ?? error?.message}
          </p>
        </Field>
      </Form>
    </TabContainer>
  );
}