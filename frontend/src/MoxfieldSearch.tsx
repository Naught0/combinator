import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { Input } from "./components/ui/input";
import { Field } from "./Field";
import { Form } from "./Form";
import { TabContainer } from "./TabContainer";
import { useRecoilState } from "recoil";
import { moxfieldUserNameAtom } from "./atoms";

export default function MoxfieldSearch() {
  const { userName: urlUserName } = useParams();
  const [userName, setUserName] = useRecoilState(moxfieldUserNameAtom);
  const [value, setValue] = useState(userName);
  const navigate = useNavigate();
  useEffect(
    function initUserName() {
      if (urlUserName) return setValue(urlUserName);
    },
    [urlUserName],
  );

  return (
    <TabContainer>
      <Form
        onSubmit={async (e) => {
          e.preventDefault();
          setUserName(value);
          navigate(`/user/moxfield/${value}`);
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
