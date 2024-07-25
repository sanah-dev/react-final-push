import 'styled-components';

declare module 'styled-components' {
  export interface DefaultTheme {
    red: string;
    black: {
      default: string;
      hover: string;
    };
    white: {
      default: string;
      hover: string;
    };
  }
}
