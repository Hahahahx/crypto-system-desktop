/* eslint-env node */

import { chrome } from "../../electron-vendors.config.json";
import { join } from "path";
import { builtinModules } from "module";
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
    alias: [
      { find: /^~/, replacement: "" },
      { find: "@", replacement: rendererPath + "/", },
      { find: "@assets", replacement: path.join(rendererPath, "..") + "/assets/", },
      { find: "@styles", replacement: rendererPath + "/styles/", },
      { find: "@components", replacement: rendererPath + "/components/", },
      { find: "@models", replacement: rendererPath + "/models/", },
      { find: "@services", replacement: rendererPath + "/services/", },
      { find: "@hooks", replacement: rendererPath + "/hooks/", },
      { find: "@common", replacement: path.join(rendererPath, "..", '..') + "/common/", },
    ]
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
          style: (name) => {
            return name === "row" ? null : `antd/lib/${name}/style/index.css`
          },
          libDirectory: "es",
        },
      ],
    })],
  base: "",
  css: {
    preprocessorOptions: {
      less: {
        javascriptEnabled: true,
      }
    }
  },
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
      // ?????????????????????crypto?????????????????????????????????????????????????????????????????????
      // ?????????crypto??????????????????????????????
      external: [
        ...builtinModules.filter(item => item !== "crypto"),
      ],
      output: {
        manualChunks: {
          react: ["react", "react-dom"],
          antd: ["antd"],
          antdPro: ["@ant-design/pro-list"],
        },
      },
    },
    emptyOutDir: true,
    brotliSize: false,
  }
};

export default config;
