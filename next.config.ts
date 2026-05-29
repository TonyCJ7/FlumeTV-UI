import type { NextConfig } from "next";

const config: NextConfig = {
  output: "standalone",
  compiler: {
    emotion: true,
  },
  env: {
    BASE_API_URL: process.env.BASE_API_URL,
  },
};
export default config;
