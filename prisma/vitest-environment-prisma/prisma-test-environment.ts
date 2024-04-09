import { Environment } from "vitest";

export default <Environment>{
  name: "prisma",
  transformMode: "ssr",
  async setup() {
    console.log("Setting up");

    return {
      teardown() {
        console.log("Tearing down");
      },
    };
  },
};
