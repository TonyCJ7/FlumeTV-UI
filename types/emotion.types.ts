import type { Theme as MuiTheme } from "@mui/material/styles";
import type { SlateTokenSet } from "@/theme/tokens";

declare module "@mui/material/styles" {
  interface Theme {
    slate: SlateTokenSet;
  }
  interface ThemeOptions {
    slate?: SlateTokenSet;
  }
}

declare module "@emotion/react" {
  export interface Theme extends MuiTheme {}
}
