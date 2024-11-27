import { useState } from "react";

export function MoxfieldDeadbanner() {
  const [show, setShow] = useState(
    sessionStorage.getItem("ignoreMoxfieldIssues") !== "true",
  );
  return show ? (
    <div className="bg-rose-400/30 text-sm px-5 py-3 rounded-lg flex flex-col items-center justify-center text-center">
      <p className="font-bold">Moxfield has blocked access to their APIs</p>
      <p>
        You may use other sources or paste in your list until this is resolved
      </p>
      <p>Sorry for the inconvenience!</p>
      <div className="flex mt-2 flex-row gap-3 underline">
        <button onClick={() => setShow(false)}>dismiss</button>
        <button
          onClick={() => {
            setShow(false);
            sessionStorage.setItem("ignoreMoxfieldIssues", "true");
          }}
        >
          don&apos;t show again
        </button>
      </div>
    </div>
  ) : null;
}
