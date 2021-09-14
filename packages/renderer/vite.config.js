/* eslint-env node */

import { chrome } from "../../electron-vendors.config.json";
import { join } from "path";
import { builtinModules } from "module";
// import vue from '@vitejs/plugin-vue';
import reactRefresh from "@vitejs/plugin-react-refresh";
import vitePluginImp from "vite-plugin-imp";
import { AutoRouterVitePlugin } from "ux-autoroute-plugin";
import path from "path";

const PACKAGE_ROOT = __dirname;
const rendererPath = join(PACKAGE_ROOT, "src")

/**
 * @type {import('vite').UserConfig}
 * @see https://vitejs.dev/config/
 */
const config = {
  mode: process.env.MODE,
  root: PACKAGE_ROOT,
  resolve: {
    alias: {
      "@": rendererPath + "/",
      "@assets": path.join(rendererPath, "..") + "/assets/",
      "@styles": rendererPath + "/styles/",
      "@hooks": rendererPath + "/hooks/",
    },
  },
  plugins: [
    reactRefresh(),
    AutoRouterVitePlugin({
      pagePath: path.join(rendererPath, "pages"),
      output: rendererPath,
      filename: "router.ts",
      defaultLazyImport: false,
    }),
    vitePluginImp({
      libList: [
        {
          libName: "antd",
          style: (name) => `antd/lib/${name}/style/index.css`,
          libDirectory: "es",
        },
      ],
    })],
  base: "",
  server: {
    fs: {
      strict: true,
    },
  },
  build: {
    sourcemap: true,
    target: `chrome${chrome}`,
    outDir: "dist",
    assetsDir: ".",
    terserOptions: {
      ecma: 2020,
      compress: {
        passes: 2,
      },
      safari10: false,
    },
    rollupOptions: {
      external: [
        ...builtinModules,
      ],
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
        },
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  },
};

export default config;
