import { importShared } from './__federation_fn_import.js';
import LayoutApp, { j as jsxRuntimeExports } from './__federation_expose_LayoutApp.js';
import { r as reactDomExports } from './index2.js';

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

const React = await importShared('react');
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(React.StrictMode, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutApp, {}) })
);
