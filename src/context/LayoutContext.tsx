import { useState, createContext } from "react";

export const LayoutContext = createContext({
  toggle: false,
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  setToggle: () => { },
});

const LayoutContextProvider = (props: any) => {
  const [toggle, setToggle] = useState(true);

  const setIsToggle = () => {
    setToggle(!toggle);
  };

  const context = {
    toggle: toggle,
    setToggle: setIsToggle,
  };

  //   useEffect(() => {
  //     console.log(toggle);
  //   }, [toggle]);

  return (
    <LayoutContext.Provider value={context}>
      {props.children}
    </LayoutContext.Provider>
  );
};

export default LayoutContextProvider;
