import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Input } from "./components/ui/input";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";

export default function MoxfieldSearch() {
  const { userName } = useParams();
  const [value, setValue] = useState(userName ?? "");
  const navigate = useNavigate();

  return (
    <TabContainer>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          await navigate(`/user/moxfield/${value}`);
        }}
        disabled={value.length < 3}
      >
        <Field>
          <Input
            name="moxfield-username"
            placeholder="Moxfield username"
            onChange={(e) => setValue(e.target.value.trim())}
            value={value}
          />
        </Field>
      </Form>
    </TabContainer>
  );
}
