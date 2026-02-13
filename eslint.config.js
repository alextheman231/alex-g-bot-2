import plugin from "@alextheman/eslint-plugin";

export default [
  ...plugin.configs["combined/typescript"],
  ...plugin.configs["general/package-json"],
];
