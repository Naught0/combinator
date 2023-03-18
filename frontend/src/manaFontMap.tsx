import { ReactNode } from "react";

function getPairs(a: unknown[]) {
  var i,
    j,
    result = [];
  for (i = 0; i < a.length; i++) {
    for (j = i; j < a.length; j++) {
      result.push([a[i], a[j]]);
    }
  }
  return result;
}

const symbols = [
  ...[...Array(21).keys()].map((n) => n.toString()),
  "100",
  "c",
  "w",
  "u",
  "b",
  "r",
  "g",
];
const iconClassName = "ml-1 ms ms-shadow ms-cost ms-";
export const manaFontMap = getPairs(symbols)
  .filter(([l, r]) => l !== r)
  .map(([l, r]) => ({ dataName: `{${l}/${r}}`, partialClassName: `${l}${r}` }))
  // https://stackoverflow.com/a/44325124/7770440
  .reduce(
    (obj: { [k: string]: ReactNode }, item) => (
      (obj[item.dataName] = (
        <i className={`${iconClassName}${item.partialClassName}`}></i>
      )),
      obj
    ),
    {}
  );

for (const s of symbols) {
  manaFontMap[`{${s}}`] = <i className={`${iconClassName}${s}`}></i>;
}
