import { importShared } from './__federation_fn_import.js';
import { e as createLucideIcon, f as createContextScope, u as useComposedRefs, j as jsxRuntimeExports, g as createSlot, R as Root, C as Content, h as cn, i as Close, X, P as Portal, O as Overlay, k as getLocalStorageItem, E as Eye, B as Button, U as User, I as Input } from './__federation_expose_LayoutApp.js';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$3 = [
  ["path", { d: "M5 12h14", key: "1ays0h" }],
  ["path", { d: "m12 5 7 7-7 7", key: "xquz4c" }]
];
const ArrowRight = createLucideIcon("arrow-right", __iconNode$3);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$2 = [
  ["rect", { width: "20", height: "14", x: "2", y: "5", rx: "2", key: "ynyp8z" }],
  ["line", { x1: "2", x2: "22", y1: "10", y2: "10", key: "1b3vmo" }]
];
const CreditCard = createLucideIcon("credit-card", __iconNode$2);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode$1 = [
  ["path", { d: "M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8", key: "1357e3" }],
  ["path", { d: "M3 3v5h5", key: "1xhq8a" }],
  ["path", { d: "M12 7v5l4 2", key: "1fdv2h" }]
];
const History = createLucideIcon("history", __iconNode$1);

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  [
    "path",
    {
      d: "M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z",
      key: "1qme2f"
    }
  ],
  ["circle", { cx: "12", cy: "12", r: "3", key: "1v7zrd" }]
];
const Settings = createLucideIcon("settings", __iconNode);

// src/collection-legacy.tsx
const React$2 = await importShared('react');
function createCollection(name) {
  const PROVIDER_NAME = name + "CollectionProvider";
  const [createCollectionContext, createCollectionScope] = createContextScope(PROVIDER_NAME);
  const [CollectionProviderImpl, useCollectionContext] = createCollectionContext(
    PROVIDER_NAME,
    { collectionRef: { current: null }, itemMap: /* @__PURE__ */ new Map() }
  );
  const CollectionProvider = (props) => {
    const { scope, children } = props;
    const ref = React$2.useRef(null);
    const itemMap = React$2.useRef(/* @__PURE__ */ new Map()).current;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionProviderImpl, { scope, itemMap, collectionRef: ref, children });
  };
  CollectionProvider.displayName = PROVIDER_NAME;
  const COLLECTION_SLOT_NAME = name + "CollectionSlot";
  const CollectionSlotImpl = createSlot(COLLECTION_SLOT_NAME);
  const CollectionSlot = React$2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children } = props;
      const context = useCollectionContext(COLLECTION_SLOT_NAME, scope);
      const composedRefs = useComposedRefs(forwardedRef, context.collectionRef);
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionSlotImpl, { ref: composedRefs, children });
    }
  );
  CollectionSlot.displayName = COLLECTION_SLOT_NAME;
  const ITEM_SLOT_NAME = name + "CollectionItemSlot";
  const ITEM_DATA_ATTR = "data-radix-collection-item";
  const CollectionItemSlotImpl = createSlot(ITEM_SLOT_NAME);
  const CollectionItemSlot = React$2.forwardRef(
    (props, forwardedRef) => {
      const { scope, children, ...itemData } = props;
      const ref = React$2.useRef(null);
      const composedRefs = useComposedRefs(forwardedRef, ref);
      const context = useCollectionContext(ITEM_SLOT_NAME, scope);
      React$2.useEffect(() => {
        context.itemMap.set(ref, { ref, ...itemData });
        return () => void context.itemMap.delete(ref);
      });
      return /* @__PURE__ */ jsxRuntimeExports.jsx(CollectionItemSlotImpl, { ...{ [ITEM_DATA_ATTR]: "" }, ref: composedRefs, children });
    }
  );
  CollectionItemSlot.displayName = ITEM_SLOT_NAME;
  function useCollection(scope) {
    const context = useCollectionContext(name + "CollectionConsumer", scope);
    const getItems = React$2.useCallback(() => {
      const collectionNode = context.collectionRef.current;
      if (!collectionNode) return [];
      const orderedNodes = Array.from(collectionNode.querySelectorAll(`[${ITEM_DATA_ATTR}]`));
      const items = Array.from(context.itemMap.values());
      const orderedItems = items.sort(
        (a, b) => orderedNodes.indexOf(a.ref.current) - orderedNodes.indexOf(b.ref.current)
      );
      return orderedItems;
    }, [context.collectionRef, context.itemMap]);
    return getItems;
  }
  return [
    { Provider: CollectionProvider, Slot: CollectionSlot, ItemSlot: CollectionItemSlot },
    useCollection,
    createCollectionScope
  ];
}

// src/collection.tsx
await importShared('react');

// packages/react/direction/src/direction.tsx
const React$1 = await importShared('react');
var DirectionContext = React$1.createContext(void 0);
function useDirection(localDir) {
  const globalDir = React$1.useContext(DirectionContext);
  return localDir || globalDir || "ltr";
}

await importShared('react');
function Sheet({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root, { "data-slot": "sheet", ...props });
}
function SheetPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { "data-slot": "sheet-portal", ...props });
}
function SheetOverlay({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Overlay,
    {
      "data-slot": "sheet-overlay",
      className: cn(
        "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 fixed inset-0 z-50 bg-black/50",
        className
      ),
      ...props
    }
  );
}
function SheetContent({
  className,
  children,
  side = "right",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(SheetPortal, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(SheetOverlay, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      Content,
      {
        "data-slot": "sheet-content",
        className: cn(
          "bg-background data-[state=open]:animate-in data-[state=closed]:animate-out fixed z-50 flex flex-col gap-4 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500",
          side === "right" && "data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right inset-y-0 right-0 h-full w-3/4 border-l sm:max-w-sm",
          side === "left" && "data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left inset-y-0 left-0 h-full w-3/4 border-r sm:max-w-sm",
          side === "top" && "data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top inset-x-0 top-0 h-auto border-b",
          side === "bottom" && "data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom inset-x-0 bottom-0 h-auto border-t",
          className
        ),
        ...props,
        children: [
          children,
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            Close,
            {
              className: "ring-offset-background focus:ring-ring data-[state=open]:bg-secondary absolute top-4 right-4 rounded-xs opacity-70 transition-opacity hover:opacity-100 focus:ring-2 focus:ring-offset-2 focus:outline-hidden disabled:pointer-events-none",
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(X, { className: "size-4" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "sr-only", children: "Close" })
              ]
            }
          )
        ]
      }
    )
  ] });
}

await importShared('react');

const React = await importShared('react');
const {useState} = React;
const DepositModal = ({ isOpen, onClose }) => {
  const [activePaymentMethod, setActivePaymentMethod] = useState("Skrill");
  const [expandedSections, setExpandedSections] = useState({
    balanceManagement: true,
    bonuses: false,
    profile: false,
    betHistory: false
  });
  const [activeSubmenu, setActiveSubmenu] = useState("Deposit");
  const userData = getLocalStorageItem("userData") || {};
  const username = userData.username || "User";
  const userId = userData.userId || "31724076";
  const paymentMethods = [
    {
      id: "Skrill",
      name: "Skrill",
      logo: "/payments/skrill-preview.png",
      fee: "Free",
      processTime: "Instant",
      min: "5 £",
      max: "2000 £"
    },
    {
      id: "SafeCharge",
      name: "SafeCharge",
      logo: "/payments/safecharge-preview.png",
      fee: "Free",
      processTime: "Instant",
      min: "5 £",
      max: "5000 £"
    },
    {
      id: "MuchBetter",
      name: "MuchBetter",
      logo: "/payments/MUHBTR.png",
      fee: "Free",
      processTime: "Instant",
      min: "5 £",
      max: "5000 £"
    },
    {
      id: "Neteller",
      name: "Neteller",
      logo: "/payments/neteller-preview.png",
      fee: "Free",
      processTime: "Instant",
      min: "5 £",
      max: "5000 £"
    }
  ];
  const handlePaymentMethodSelect = (id) => {
    setActivePaymentMethod(id);
  };
  const handleDeposit = (e) => {
    e.preventDefault();
    onClose();
  };
  const toggleSection = (section) => {
    setExpandedSections((prev) => ({
      ...prev,
      [section]: !prev[section]
    }));
  };
  const handleSubmenuClick = (menu) => {
    setActiveSubmenu(menu);
  };
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Sheet, { open: isOpen, onOpenChange: onClose, children: /* @__PURE__ */ jsxRuntimeExports.jsx(SheetContent, { side: "right", className: "p-0 w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl overflow-y-auto", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex flex-col h-full max-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex flex-col md:flex-row h-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full md:w-80 bg-[#2a2a2a] text-white p-4 flex flex-col flex-shrink-0", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center mb-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-10 h-10 rounded-full bg-gray-500 flex items-center justify-center text-white mr-3", children: /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: username.substring(0, 2).toUpperCase() }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "font-semibold", children: username }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-xs text-gray-400 flex items-center", children: [
            userId,
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "ml-1 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "text-gray-400", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("path", { d: "M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "8", y: "2", width: "8", height: "4", rx: "1", ry: "1" })
            ] }) })
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-[#2a2a2a] border border-red-600 rounded-md p-3 flex items-start", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-red-600 mr-2 mt-0.5", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "16", height: "16", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("circle", { cx: "12", cy: "12", r: "10" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "12" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "16", x2: "12.01", y2: "16" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex-grow", children: /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm text-gray-300", children: "Account not verified" }) })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "mb-6 w-full border border-red-600 text-white rounded-md py-2 hover:bg-red-800/20 transition-colors", children: "VERIFY YOUR ACCOUNT" }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-gradient-to-r from-green-600 to-green-500 rounded-md p-4 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Eye, { size: 64 }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-1", children: "Main Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-3", children: "0.00 £" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex space-x-2", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(CreditCard, { className: "mr-1 h-4 w-4" }),
            "DEPOSIT"
          ] }),
          /* @__PURE__ */ jsxRuntimeExports.jsxs(Button, { variant: "outline", size: "sm", className: "bg-white/10 hover:bg-white/20 text-white border-white/20 flex items-center", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(ArrowRight, { className: "mr-1 h-4 w-4" }),
            "WITHDRAW"
          ] })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "mb-4 bg-gradient-to-r from-yellow-600 to-yellow-500 rounded-md p-4 relative overflow-hidden", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "absolute right-0 top-1/2 transform -translate-y-1/2 opacity-20", children: /* @__PURE__ */ jsxRuntimeExports.jsx("svg", { xmlns: "http://www.w3.org/2000/svg", width: "64", height: "64", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", children: /* @__PURE__ */ jsxRuntimeExports.jsx("polygon", { points: "12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" }) }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-sm font-medium mb-1", children: "Total Bonus Balance" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("h3", { className: "text-2xl font-bold mb-3", children: "0.00 £" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex justify-between items-center", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "Bonus Balance" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm font-medium", children: "0.00 £" })
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between mb-2 cursor-pointer",
            onClick: () => toggleSection("balanceManagement"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(Settings, { size: 18, className: "mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "BALANCE MANAGEMENT" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: `transform transition-transform ${expandedSections.balanceManagement ? "" : "rotate-180"}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        ),
        expandedSections.balanceManagement && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "pl-7 space-y-3 text-sm", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex items-center pl-2 cursor-pointer ${activeSubmenu === "Deposit" ? "text-white border-l-2 border-yellow-500" : "text-gray-400 hover:text-white"}`,
              onClick: () => handleSubmenuClick("Deposit"),
              children: "Deposit"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex items-center pl-2 cursor-pointer ${activeSubmenu === "Withdraw" ? "text-white border-l-2 border-yellow-500" : "text-gray-400 hover:text-white"}`,
              onClick: () => handleSubmenuClick("Withdraw"),
              children: "Withdraw"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex items-center pl-2 cursor-pointer ${activeSubmenu === "Transaction History" ? "text-white border-l-2 border-yellow-500" : "text-gray-400 hover:text-white"}`,
              onClick: () => handleSubmenuClick("Transaction History"),
              children: "Transaction History"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex items-center pl-2 cursor-pointer ${activeSubmenu === "Withdraw Status" ? "text-white border-l-2 border-yellow-500" : "text-gray-400 hover:text-white"}`,
              onClick: () => handleSubmenuClick("Withdraw Status"),
              children: "Withdraw Status"
            }
          ),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              className: `flex items-center pl-2 cursor-pointer ${activeSubmenu === "Net Deposit History" ? "text-white border-l-2 border-yellow-500" : "text-gray-400 hover:text-white"}`,
              onClick: () => handleSubmenuClick("Net Deposit History"),
              children: "Net Deposit History"
            }
          )
        ] })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between cursor-pointer",
            onClick: () => toggleSection("bonuses"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("svg", { xmlns: "http://www.w3.org/2000/svg", width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "2", strokeLinecap: "round", strokeLinejoin: "round", className: "mr-2", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx("rect", { x: "3", y: "3", width: "18", height: "18", rx: "2", ry: "2" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "8", y1: "12", x2: "16", y2: "12" }),
                  /* @__PURE__ */ jsxRuntimeExports.jsx("line", { x1: "12", y1: "8", x2: "12", y2: "16" })
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "BONUSES" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: `transform transition-transform ${expandedSections.bonuses ? "rotate-180" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        ),
        expandedSections.bonuses && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-7 mt-3 text-sm text-gray-400", children: "No bonus information available" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between cursor-pointer",
            onClick: () => toggleSection("profile"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(User, { size: 18, className: "mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "MY PROFILE" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: `transform transition-transform ${expandedSections.profile ? "rotate-180" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        ),
        expandedSections.profile && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-7 mt-3 text-sm text-gray-400", children: "Profile information will be displayed here" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "border-t border-gray-700 py-3", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: "flex items-center justify-between cursor-pointer",
            onClick: () => toggleSection("betHistory"),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(History, { size: 18, className: "mr-2" }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "font-medium", children: "BET HISTORY" })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "svg",
                {
                  xmlns: "http://www.w3.org/2000/svg",
                  width: "20",
                  height: "20",
                  viewBox: "0 0 24 24",
                  fill: "none",
                  stroke: "currentColor",
                  strokeWidth: "2",
                  strokeLinecap: "round",
                  strokeLinejoin: "round",
                  className: `transform transition-transform ${expandedSections.betHistory ? "rotate-180" : ""}`,
                  children: /* @__PURE__ */ jsxRuntimeExports.jsx("polyline", { points: "6 9 12 15 18 9" })
                }
              )
            ]
          }
        ),
        expandedSections.betHistory && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "pl-7 mt-3 text-sm text-gray-400", children: "Bet history will be displayed here" })
      ] })
    ] }),
    /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex-1 overflow-auto bg-[#313131]", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-between items-center p-5 border-b border-gray-700", children: /* @__PURE__ */ jsxRuntimeExports.jsx("h2", { className: "text-xl font-semibold text-white", children: "Deposit" }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "p-5", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-8", children: paymentMethods.map((method) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
          "div",
          {
            className: `bg-[#2d2d2d] rounded-md p-4 flex flex-col items-center justify-between cursor-pointer transition-colors border-2 ${activePaymentMethod === method.id ? "border-yellow-500" : "border-[#404040]"}`,
            onClick: () => handlePaymentMethodSelect(method.id),
            children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-12 mb-3 flex items-center justify-center w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: method.logo,
                  alt: method.name,
                  className: "max-h-10 w-full object-contain"
                }
              ) }),
              /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "text-center text-sm text-gray-200 w-full truncate", children: method.name })
            ]
          },
          method.id
        )) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "overflow-x-auto mb-6", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("table", { className: "w-full text-left text-gray-300", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("thead", { className: "text-xs uppercase bg-[#363636] text-gray-400", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Payment Name" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Fee" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Process Time" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Min" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("th", { className: "px-4 py-3", children: "Max" })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("tbody", { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("tr", { className: "bg-[#2d2d2d]", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: activePaymentMethod }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: "Free" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: "Instant" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: "5 £" }),
            /* @__PURE__ */ jsxRuntimeExports.jsx("td", { className: "px-4 py-3", children: "2000 £" })
          ] }) })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#2d2d2d] p-4 text-sm text-gray-400 mb-8 rounded", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("p", { children: [
          "Safer Gambling message: Set limits on your gambling. For support, contact the National Gambling Helpline on 0808 8020 133 or visit",
          " ",
          /* @__PURE__ */ jsxRuntimeExports.jsx("a", { href: "http://www.begambleaware.org/", className: "text-blue-500 hover:underline", target: "_blank", rel: "noreferrer", children: "http://www.begambleaware.org/" })
        ] }) }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("form", { onSubmit: handleDeposit, className: "space-y-4", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "email",
              placeholder: "E-mail",
              className: "bg-[#3a3a3a] text-white border-[#4a4a4a] focus:border-yellow-500 h-12"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
            Input,
            {
              type: "number",
              placeholder: "Amount",
              className: "bg-[#3a3a3a] text-white border-[#4a4a4a] focus:border-yellow-500 h-12"
            }
          ) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(
            Button,
            {
              type: "submit",
              className: "w-full h-12 bg-yellow-500 hover:bg-yellow-600 text-black font-bold",
              children: "DEPOSIT"
            }
          )
        ] })
      ] })
    ] })
  ] }) }) }) });
};

export { ArrowRight as A, DepositModal as D, createCollection as c, useDirection as u };
