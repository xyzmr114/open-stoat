/// <reference types="@electron-forge/plugin-vite/forge-vite-env" />

declare module "*.png?asset" {
  const src: string;
  export default src;
}

declare module "*.css" {
  const content: string;
  export default content;
}

