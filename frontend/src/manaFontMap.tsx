import { ReactElement } from "react";

interface type {
  [key: string]: (key: string) => ReactElement;
}
export const manaFontMap: type = {
  "{c}": (key) => <i className="ms ms-cost ms-c" key={key}></i>,
  "{w}": (key) => <i className="ms ms-cost ms-w" key={key}></i>,
  "{u}": (key) => <i className="ms ms-cost ms-u" key={key}></i>,
  "{b}": (key) => <i className="ms ms-cost ms-b" key={key}></i>,
  "{r}": (key) => <i className="ms ms-cost ms-r" key={key}></i>,
  "{g}": (key) => <i className="ms ms-cost ms-g" key={key}></i>,
  "{0}": (key) => <i className="ms ms-cost ms-0" key={key}></i>,
  "{1}": (key) => <i className="ms ms-cost ms-1" key={key}></i>,
  "{2}": (key) => <i className="ms ms-cost ms-2" key={key}></i>,
  "{3}": (key) => <i className="ms ms-cost ms-3" key={key}></i>,
  "{4}": (key) => <i className="ms ms-cost ms-4" key={key}></i>,
  "{5}": (key) => <i className="ms ms-cost ms-5" key={key}></i>,
  "{6}": (key) => <i className="ms ms-cost ms-6" key={key}></i>,
  "{7}": (key) => <i className="ms ms-cost ms-7" key={key}></i>,
  "{8}": (key) => <i className="ms ms-cost ms-8" key={key}></i>,
  "{9}": (key) => <i className="ms ms-cost ms-9" key={key}></i>,
  "{10}": (key) => <i className="ms ms-cost ms-10" key={key}></i>,
  "{11}": (key) => <i className="ms ms-cost ms-11" key={key}></i>,
  "{12}": (key) => <i className="ms ms-cost ms-12" key={key}></i>,
};
