import { defineConfig } from "wxt";

// See https://wxt.dev/api/config.html
export default defineConfig({
  modules: ["@wxt-dev/module-react", "@wxt-dev/webextension-polyfill"],
  manifest: {
    name: "BilletLove Extension",
    permissions: ["storage"],
    host_permissions: ["https://www.billetweb.fr/*"],
  },
});
