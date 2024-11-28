import { ButtonHTMLAttributes } from "react";
import { cn } from "./lib/utils";
import "./style/rainbow-button.sass";
import { Button } from "./components/ui/button";

export default function NiceButton(
  props: ButtonHTMLAttributes<HTMLButtonElement> & {},
) {
  return (
    <Button
      {...props}
      className={cn("wowee-that-is-a-nice-button", props.className)}
      variant="primary"
    >
      {props.children}
    </Button>
  );
}
