import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  compiler: {
    emotion: true,
  },
};
export default config;
