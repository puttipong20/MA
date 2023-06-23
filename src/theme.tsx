import { extendTheme } from "@chakra-ui/react";

const myTheme = extendTheme({
  breakpoints: {
    "6s": "320px",
    s: "768px",
    m: "800px",
    l: "834px",
    "6l": "3840px",
  },
});

export default myTheme;
