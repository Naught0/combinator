import NiceButton from "./NiceButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRight } from "@fortawesome/free-solid-svg-icons";

export function Form({
  onSubmit,
  children,
  disabled,
  loading,
}: React.PropsWithChildren & {
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  disabled?: boolean;
  loading?: boolean;
}) {
  return (
    <form className="flex max-w-[512px] flex-col gap-3" onSubmit={onSubmit}>
      {children}
      <div>
        <NiceButton
          className={"inline-flex justify-center gap-2"}
          type="submit"
          disabled={disabled || loading}
          loading={loading}
        >
          <span>think for me</span>{" "}
          <span>
            <FontAwesomeIcon icon={faArrowRight} />
          </span>
        </NiceButton>
      </div>
    </form>
  );
}
