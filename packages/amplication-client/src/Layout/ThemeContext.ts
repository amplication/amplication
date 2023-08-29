import { createContext } from "react";

export type ThemeDataType = {
  theme: string;
  setTheme: (theme: string) => void;
};

const ThemeContext = createContext<ThemeDataType>({
  theme: "",
  setTheme: (theme: string) => {
    throw new Error();
  },
});

export default ThemeContext;
