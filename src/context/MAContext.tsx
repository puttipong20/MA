/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-empty-function */
import { useState, createContext } from "react";
import { MA } from "../@types/Type";

export const MAcontext = createContext({
  ma: {} as MA,
  setMA: (_newMA: MA): void => {},
});

interface Props {
  children: React.ReactNode;
}

const MAcontextProvider: React.FC<Props> = (props) => {
  const [ma, setMA] = useState<MA>();

  const setNewMA = (newMA: MA) => {
    setMA(newMA);
  };

  const context = {
    ma: ma!,
    setMA: setNewMA,
  };

  return (
    <MAcontext.Provider value={context}>{props.children}</MAcontext.Provider>
  );
};

export default MAcontextProvider;
