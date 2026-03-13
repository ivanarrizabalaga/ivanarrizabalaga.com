import { Font } from "@react-pdf/renderer";
import path from "node:path";

const nodeModules = path.join(process.cwd(), "node_modules");

Font.register({
  family: "IBM Plex Sans",
  fonts: [
    {
      src: path.join(
        nodeModules,
        "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-400-normal.woff"
      ),
    },
    {
      src: path.join(
        nodeModules,
        "@fontsource/ibm-plex-sans/files/ibm-plex-sans-latin-700-normal.woff"
      ),
      fontWeight: 700,
    },
  ],
});

Font.register({
  family: "Space Mono",
  fonts: [
    {
      src: path.join(
        nodeModules,
        "@fontsource/space-mono/files/space-mono-latin-400-normal.woff"
      ),
    },
    {
      src: path.join(
        nodeModules,
        "@fontsource/space-mono/files/space-mono-latin-700-normal.woff"
      ),
      fontWeight: 700,
    },
  ],
});

export const FONT_SANS = "IBM Plex Sans";
export const FONT_MONO = "Space Mono";
