import { importShared } from './__federation_fn_import.js';
import { j as jsxRuntimeExports } from './__federation_expose_LayoutApp.js';

await importShared('react');

const Layout = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: "Layout" });
};

export { Layout as default };
