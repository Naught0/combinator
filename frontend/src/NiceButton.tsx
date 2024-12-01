import { cn } from "./lib/utils";
import "./style/rainbow-button.css";
import * as Button from "./components/ui/button";

export default function NiceButton(props: Button.ButtonProps) {
  return (
    <Button.Button
      {...props}
      className={cn("wowee-that-is-a-nice-button", props.className)}
      variant="primary"
    >
      {props.children}
    </Button.Button>
  );
}
