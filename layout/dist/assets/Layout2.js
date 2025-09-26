import { importShared } from './__federation_fn_import.js';
import { e as createLucideIcon, j as jsxRuntimeExports, f as createContextScope, l as useId, m as Primitive, n as composeEventHandlers, u as useComposedRefs, o as useControllableState, p as useCallbackRef, q as createPopperScope, r as Root2, A as Anchor, s as Presence, t as Portal$1, v as hideOthers, w as dispatchDiscreteCustomEvent, x as ReactRemoveScroll, y as useFocusGuards, g as createSlot, F as FocusScope, D as DismissableLayer, z as Content, H as Arrow, J as composeRefs, h as cn, K as useNavigate, M as useLocation, N as ChevronDown, X, Q as useDispatch, S as useSelector, T as Link, U as User, V as RegisterModal, W as LoginModal, Y as Toaster$1, Z as NavLink, _ as Outlet } from './__federation_expose_LayoutApp.js';
import { c as createCollection, u as useDirection, D as DepositModal } from './DepositModal.js';
import { g as getUserData, l as logout } from './getUserDataAction.js';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["path", { d: "M4 12h16", key: "1lakjw" }],
  ["path", { d: "M4 18h16", key: "19g7jn" }],
  ["path", { d: "M4 6h16", key: "1o0s65" }]
];
const Menu$2 = createLucideIcon("menu", __iconNode);

const React$7 = await importShared('react');
const {useEffect: useEffect$1,useState: useState$3} = React$7;

const Clock = React$7.memo(() => {
  const [currentTime, setCurrentTime] = useState$3("");
  useEffect$1(() => {
    const updateTime = () => {
      const now = /* @__PURE__ */ new Date();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";
      hours = hours % 12 || 12;
      const paddedHour = hours.toString().padStart(2, "0");
      const formattedTime = `${paddedHour}:${minutes}:${seconds} ${ampm}`;
      setCurrentTime(formattedTime);
    };
    updateTime();
    const timer = setInterval(updateTime, 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-clock-bg text-white text-sm py-1 px-1 md:px-3 rounded-md border border-gray-500", children: currentTime });
});

// src/roving-focus-group.tsx
const React$6 = await importShared('react');
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME$2 = "RovingFocusGroup";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(GROUP_NAME$2);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME$2,
  [createCollectionScope$2]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$2);
var RovingFocusGroup = React$6.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME$2;
var RovingFocusGroupImpl = React$6.forwardRef((props, forwardedRef) => {
  const {
    __scopeRovingFocusGroup,
    orientation,
    loop = false,
    dir,
    currentTabStopId: currentTabStopIdProp,
    defaultCurrentTabStopId,
    onCurrentTabStopIdChange,
    onEntryFocus,
    preventScrollOnEntryFocus = false,
    ...groupProps
  } = props;
  const ref = React$6.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME$2
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = React$6.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection$2(__scopeRovingFocusGroup);
  const isClickFocusRef = React$6.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = React$6.useState(0);
  React$6.useEffect(() => {
    const node = ref.current;
    if (node) {
      node.addEventListener(ENTRY_FOCUS, handleEntryFocus);
      return () => node.removeEventListener(ENTRY_FOCUS, handleEntryFocus);
    }
  }, [handleEntryFocus]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    RovingFocusProvider,
    {
      scope: __scopeRovingFocusGroup,
      orientation,
      dir: direction,
      loop,
      currentTabStopId,
      onItemFocus: React$6.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: React$6.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: React$6.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: React$6.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount - 1),
        []
      ),
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Primitive.div,
        {
          tabIndex: isTabbingBackOut || focusableItemsCount === 0 ? -1 : 0,
          "data-orientation": orientation,
          ...groupProps,
          ref: composedRefs,
          style: { outline: "none", ...props.style },
          onMouseDown: composeEventHandlers(props.onMouseDown, () => {
            isClickFocusRef.current = true;
          }),
          onFocus: composeEventHandlers(props.onFocus, (event) => {
            const isKeyboardFocus = !isClickFocusRef.current;
            if (event.target === event.currentTarget && isKeyboardFocus && !isTabbingBackOut) {
              const entryFocusEvent = new CustomEvent(ENTRY_FOCUS, EVENT_OPTIONS);
              event.currentTarget.dispatchEvent(entryFocusEvent);
              if (!entryFocusEvent.defaultPrevented) {
                const items = getItems().filter((item) => item.focusable);
                const activeItem = items.find((item) => item.active);
                const currentItem = items.find((item) => item.id === currentTabStopId);
                const candidateItems = [activeItem, currentItem, ...items].filter(
                  Boolean
                );
                const candidateNodes = candidateItems.map((item) => item.ref.current);
                focusFirst$1(candidateNodes, preventScrollOnEntryFocus);
              }
            }
            isClickFocusRef.current = false;
          }),
          onBlur: composeEventHandlers(props.onBlur, () => setIsTabbingBackOut(false))
        }
      )
    }
  );
});
var ITEM_NAME$2 = "RovingFocusGroupItem";
var RovingFocusGroupItem = React$6.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeRovingFocusGroup,
      focusable = true,
      active = false,
      tabStopId,
      children,
      ...itemProps
    } = props;
    const autoId = useId();
    const id = tabStopId || autoId;
    const context = useRovingFocusContext(ITEM_NAME$2, __scopeRovingFocusGroup);
    const isCurrentTabStop = context.currentTabStopId === id;
    const getItems = useCollection$2(__scopeRovingFocusGroup);
    const { onFocusableItemAdd, onFocusableItemRemove, currentTabStopId } = context;
    React$6.useEffect(() => {
      if (focusable) {
        onFocusableItemAdd();
        return () => onFocusableItemRemove();
      }
    }, [focusable, onFocusableItemAdd, onFocusableItemRemove]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection$2.ItemSlot,
      {
        scope: __scopeRovingFocusGroup,
        id,
        focusable,
        active,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            tabIndex: isCurrentTabStop ? 0 : -1,
            "data-orientation": context.orientation,
            ...itemProps,
            ref: forwardedRef,
            onMouseDown: composeEventHandlers(props.onMouseDown, (event) => {
              if (!focusable) event.preventDefault();
              else context.onItemFocus(id);
            }),
            onFocus: composeEventHandlers(props.onFocus, () => context.onItemFocus(id)),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (event.key === "Tab" && event.shiftKey) {
                context.onItemShiftTab();
                return;
              }
              if (event.target !== event.currentTarget) return;
              const focusIntent = getFocusIntent(event, context.orientation, context.dir);
              if (focusIntent !== void 0) {
                if (event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
                event.preventDefault();
                const items = getItems().filter((item) => item.focusable);
                let candidateNodes = items.map((item) => item.ref.current);
                if (focusIntent === "last") candidateNodes.reverse();
                else if (focusIntent === "prev" || focusIntent === "next") {
                  if (focusIntent === "prev") candidateNodes.reverse();
                  const currentIndex = candidateNodes.indexOf(event.currentTarget);
                  candidateNodes = context.loop ? wrapArray$2(candidateNodes, currentIndex + 1) : candidateNodes.slice(currentIndex + 1);
                }
                setTimeout(() => focusFirst$1(candidateNodes));
              }
            }),
            children: typeof children === "function" ? children({ isCurrentTabStop, hasTabStop: currentTabStopId != null }) : children
          }
        )
      }
    );
  }
);
RovingFocusGroupItem.displayName = ITEM_NAME$2;
var MAP_KEY_TO_FOCUS_INTENT = {
  ArrowLeft: "prev",
  ArrowUp: "prev",
  ArrowRight: "next",
  ArrowDown: "next",
  PageUp: "first",
  Home: "first",
  PageDown: "last",
  End: "last"
};
function getDirectionAwareKey(key, dir) {
  if (dir !== "rtl") return key;
  return key === "ArrowLeft" ? "ArrowRight" : key === "ArrowRight" ? "ArrowLeft" : key;
}
function getFocusIntent(event, orientation, dir) {
  const key = getDirectionAwareKey(event.key, dir);
  if (orientation === "vertical" && ["ArrowLeft", "ArrowRight"].includes(key)) return void 0;
  if (orientation === "horizontal" && ["ArrowUp", "ArrowDown"].includes(key)) return void 0;
  return MAP_KEY_TO_FOCUS_INTENT[key];
}
function focusFirst$1(candidates, preventScroll = false) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus({ preventScroll });
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray$2(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root = RovingFocusGroup;
var Item = RovingFocusGroupItem;

// src/menu.tsx
const React$5 = await importShared('react');
var SELECTION_KEYS = ["Enter", " "];
var FIRST_KEYS = ["ArrowDown", "PageUp", "Home"];
var LAST_KEYS = ["ArrowUp", "PageDown", "End"];
var FIRST_LAST_KEYS = [...FIRST_KEYS, ...LAST_KEYS];
var SUB_OPEN_KEYS = {
  ltr: [...SELECTION_KEYS, "ArrowRight"],
  rtl: [...SELECTION_KEYS, "ArrowLeft"]
};
var SUB_CLOSE_KEYS = {
  ltr: ["ArrowLeft"],
  rtl: ["ArrowRight"]
};
var MENU_NAME$1 = "Menu";
var [Collection$1, useCollection$1, createCollectionScope$1] = createCollection(MENU_NAME$1);
var [createMenuContext, createMenuScope] = createContextScope(MENU_NAME$1, [
  createCollectionScope$1,
  createPopperScope,
  createRovingFocusGroupScope
]);
var usePopperScope = createPopperScope();
var useRovingFocusGroupScope$1 = createRovingFocusGroupScope();
var [MenuProvider, useMenuContext] = createMenuContext(MENU_NAME$1);
var [MenuRootProvider, useMenuRootContext] = createMenuContext(MENU_NAME$1);
var Menu$1 = (props) => {
  const { __scopeMenu, open = false, children, dir, onOpenChange, modal = true } = props;
  const popperScope = usePopperScope(__scopeMenu);
  const [content, setContent] = React$5.useState(null);
  const isUsingKeyboardRef = React$5.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const direction = useDirection(dir);
  React$5.useEffect(() => {
    const handleKeyDown = () => {
      isUsingKeyboardRef.current = true;
      document.addEventListener("pointerdown", handlePointer, { capture: true, once: true });
      document.addEventListener("pointermove", handlePointer, { capture: true, once: true });
    };
    const handlePointer = () => isUsingKeyboardRef.current = false;
    document.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      document.removeEventListener("keydown", handleKeyDown, { capture: true });
      document.removeEventListener("pointerdown", handlePointer, { capture: true });
      document.removeEventListener("pointermove", handlePointer, { capture: true });
    };
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Root2, { ...popperScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuProvider,
    {
      scope: __scopeMenu,
      open,
      onOpenChange: handleOpenChange,
      content,
      onContentChange: setContent,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenuRootProvider,
        {
          scope: __scopeMenu,
          onClose: React$5.useCallback(() => handleOpenChange(false), [handleOpenChange]),
          isUsingKeyboardRef,
          dir: direction,
          modal,
          children
        }
      )
    }
  ) });
};
Menu$1.displayName = MENU_NAME$1;
var ANCHOR_NAME = "MenuAnchor";
var MenuAnchor = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...anchorProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor, { ...popperScope, ...anchorProps, ref: forwardedRef });
  }
);
MenuAnchor.displayName = ANCHOR_NAME;
var PORTAL_NAME$1 = "MenuPortal";
var [PortalProvider, usePortalContext] = createMenuContext(PORTAL_NAME$1, {
  forceMount: void 0
});
var MenuPortal = (props) => {
  const { __scopeMenu, forceMount, children, container } = props;
  const context = useMenuContext(PORTAL_NAME$1, __scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(PortalProvider, { scope: __scopeMenu, forceMount, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Portal$1, { asChild: true, container, children }) }) });
};
MenuPortal.displayName = PORTAL_NAME$1;
var CONTENT_NAME$1 = "MenuContent";
var [MenuContentProvider, useMenuContentContext] = createMenuContext(CONTENT_NAME$1);
var MenuContent = React$5.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = React$5.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const ref = React$5.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React$5.useEffect(() => {
      const content = ref.current;
      if (content) return hideOthers(content);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        ...props,
        ref: composedRefs,
        trapFocus: context.open,
        disableOutsidePointerEvents: context.open,
        disableOutsideScroll: true,
        onFocusOutside: composeEventHandlers(
          props.onFocusOutside,
          (event) => event.preventDefault(),
          { checkForDefaultPrevented: false }
        ),
        onDismiss: () => context.onOpenChange(false)
      }
    );
  }
);
var MenuRootContentNonModal = React$5.forwardRef((props, forwardedRef) => {
  const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenuContentImpl,
    {
      ...props,
      ref: forwardedRef,
      trapFocus: false,
      disableOutsidePointerEvents: false,
      disableOutsideScroll: false,
      onDismiss: () => context.onOpenChange(false)
    }
  );
});
var Slot = createSlot("MenuContent.ScrollLock");
var MenuContentImpl = React$5.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenu,
      loop = false,
      trapFocus,
      onOpenAutoFocus,
      onCloseAutoFocus,
      disableOutsidePointerEvents,
      onEntryFocus,
      onEscapeKeyDown,
      onPointerDownOutside,
      onFocusOutside,
      onInteractOutside,
      onDismiss,
      disableOutsideScroll,
      ...contentProps
    } = props;
    const context = useMenuContext(CONTENT_NAME$1, __scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, __scopeMenu);
    const popperScope = usePopperScope(__scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
    const getItems = useCollection$1(__scopeMenu);
    const [currentItemId, setCurrentItemId] = React$5.useState(null);
    const contentRef = React$5.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = React$5.useRef(0);
    const searchRef = React$5.useRef("");
    const pointerGraceTimerRef = React$5.useRef(0);
    const pointerGraceIntentRef = React$5.useRef(null);
    const pointerDirRef = React$5.useRef("right");
    const lastPointerXRef = React$5.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : React$5.Fragment;
    const scrollLockWrapperProps = disableOutsideScroll ? { as: Slot, allowPinchZoom: true } : void 0;
    const handleTypeaheadSearch = (key) => {
      const search = searchRef.current + key;
      const items = getItems().filter((item) => !item.disabled);
      const currentItem = document.activeElement;
      const currentMatch = items.find((item) => item.ref.current === currentItem)?.textValue;
      const values = items.map((item) => item.textValue);
      const nextMatch = getNextMatch(values, search, currentMatch);
      const newItem = items.find((item) => item.textValue === nextMatch)?.ref.current;
      (function updateSearch(value) {
        searchRef.current = value;
        window.clearTimeout(timerRef.current);
        if (value !== "") timerRef.current = window.setTimeout(() => updateSearch(""), 1e3);
      })(search);
      if (newItem) {
        setTimeout(() => newItem.focus());
      }
    };
    React$5.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = React$5.useCallback((event) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: React$5.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: React$5.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return;
            contentRef.current?.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: React$5.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: React$5.useCallback((intent) => {
          pointerGraceIntentRef.current = intent;
        }, []),
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(ScrollLockWrapper, { ...scrollLockWrapperProps, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          FocusScope,
          {
            asChild: true,
            trapped: trapFocus,
            onMountAutoFocus: composeEventHandlers(onOpenAutoFocus, (event) => {
              event.preventDefault();
              contentRef.current?.focus({ preventScroll: true });
            }),
            onUnmountAutoFocus: onCloseAutoFocus,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(
              DismissableLayer,
              {
                asChild: true,
                disableOutsidePointerEvents,
                onEscapeKeyDown,
                onPointerDownOutside,
                onFocusOutside,
                onInteractOutside,
                onDismiss,
                children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                  Root,
                  {
                    asChild: true,
                    ...rovingFocusGroupScope,
                    dir: rootContext.dir,
                    orientation: "vertical",
                    loop,
                    currentTabStopId: currentItemId,
                    onCurrentTabStopIdChange: setCurrentItemId,
                    onEntryFocus: composeEventHandlers(onEntryFocus, (event) => {
                      if (!rootContext.isUsingKeyboardRef.current) event.preventDefault();
                    }),
                    preventScrollOnEntryFocus: true,
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(
                      Content,
                      {
                        role: "menu",
                        "aria-orientation": "vertical",
                        "data-state": getOpenState(context.open),
                        "data-radix-menu-content": "",
                        dir: rootContext.dir,
                        ...popperScope,
                        ...contentProps,
                        ref: composedRefs,
                        style: { outline: "none", ...contentProps.style },
                        onKeyDown: composeEventHandlers(contentProps.onKeyDown, (event) => {
                          const target = event.target;
                          const isKeyDownInside = target.closest("[data-radix-menu-content]") === event.currentTarget;
                          const isModifierKey = event.ctrlKey || event.altKey || event.metaKey;
                          const isCharacterKey = event.key.length === 1;
                          if (isKeyDownInside) {
                            if (event.key === "Tab") event.preventDefault();
                            if (!isModifierKey && isCharacterKey) handleTypeaheadSearch(event.key);
                          }
                          const content = contentRef.current;
                          if (event.target !== content) return;
                          if (!FIRST_LAST_KEYS.includes(event.key)) return;
                          event.preventDefault();
                          const items = getItems().filter((item) => !item.disabled);
                          const candidateNodes = items.map((item) => item.ref.current);
                          if (LAST_KEYS.includes(event.key)) candidateNodes.reverse();
                          focusFirst(candidateNodes);
                        }),
                        onBlur: composeEventHandlers(props.onBlur, (event) => {
                          if (!event.currentTarget.contains(event.target)) {
                            window.clearTimeout(timerRef.current);
                            searchRef.current = "";
                          }
                        }),
                        onPointerMove: composeEventHandlers(
                          props.onPointerMove,
                          whenMouse((event) => {
                            const target = event.target;
                            const pointerXHasChanged = lastPointerXRef.current !== event.clientX;
                            if (event.currentTarget.contains(target) && pointerXHasChanged) {
                              const newDir = event.clientX > lastPointerXRef.current ? "right" : "left";
                              pointerDirRef.current = newDir;
                              lastPointerXRef.current = event.clientX;
                            }
                          })
                        )
                      }
                    )
                  }
                )
              }
            )
          }
        ) })
      }
    );
  }
);
MenuContent.displayName = CONTENT_NAME$1;
var GROUP_NAME$1 = "MenuGroup";
var MenuGroup = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "MenuLabel";
var MenuLabel = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = React$5.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = React$5.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = React$5.useRef(false);
    const handleSelect = () => {
      const menuItem = ref.current;
      if (!disabled && menuItem) {
        const itemSelectEvent = new CustomEvent(ITEM_SELECT, { bubbles: true, cancelable: true });
        menuItem.addEventListener(ITEM_SELECT, (event) => onSelect?.(event), { once: true });
        dispatchDiscreteCustomEvent(menuItem, itemSelectEvent);
        if (itemSelectEvent.defaultPrevented) {
          isPointerDownRef.current = false;
        } else {
          rootContext.onClose();
        }
      }
    };
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        ...itemProps,
        ref: composedRefs,
        disabled,
        onClick: composeEventHandlers(props.onClick, handleSelect),
        onPointerDown: (event) => {
          props.onPointerDown?.(event);
          isPointerDownRef.current = true;
        },
        onPointerUp: composeEventHandlers(props.onPointerUp, (event) => {
          if (!isPointerDownRef.current) event.currentTarget?.click();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (disabled || isTypingAhead && event.key === " ") return;
          if (SELECTION_KEYS.includes(event.key)) {
            event.currentTarget.click();
            event.preventDefault();
          }
        })
      }
    );
  }
);
MenuItem.displayName = ITEM_NAME$1;
var MenuItemImpl = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
    const ref = React$5.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = React$5.useState(false);
    const [textContent, setTextContent] = React$5.useState("");
    React$5.useEffect(() => {
      const menuItem = ref.current;
      if (menuItem) {
        setTextContent((menuItem.textContent ?? "").trim());
      }
    }, [itemProps.children]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Collection$1.ItemSlot,
      {
        scope: __scopeMenu,
        disabled,
        textValue: textValue ?? textContent,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Item, { asChild: true, ...rovingFocusGroupScope, focusable: !disabled, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.div,
          {
            role: "menuitem",
            "data-highlighted": isFocused ? "" : void 0,
            "aria-disabled": disabled || void 0,
            "data-disabled": disabled ? "" : void 0,
            ...itemProps,
            ref: composedRefs,
            onPointerMove: composeEventHandlers(
              props.onPointerMove,
              whenMouse((event) => {
                if (disabled) {
                  contentContext.onItemLeave(event);
                } else {
                  contentContext.onItemEnter(event);
                  if (!event.defaultPrevented) {
                    const item = event.currentTarget;
                    item.focus({ preventScroll: true });
                  }
                }
              })
            ),
            onPointerLeave: composeEventHandlers(
              props.onPointerLeave,
              whenMouse((event) => contentContext.onItemLeave(event))
            ),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    );
  }
);
var CHECKBOX_ITEM_NAME$1 = "MenuCheckboxItem";
var MenuCheckboxItem = React$5.forwardRef(
  (props, forwardedRef) => {
    const { checked = false, onCheckedChange, ...checkboxItemProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemcheckbox",
        "aria-checked": isIndeterminate(checked) ? "mixed" : checked,
        ...checkboxItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          checkboxItemProps.onSelect,
          () => onCheckedChange?.(isIndeterminate(checked) ? true : !checked),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuCheckboxItem.displayName = CHECKBOX_ITEM_NAME$1;
var RADIO_GROUP_NAME$1 = "MenuRadioGroup";
var [RadioGroupProvider, useRadioGroupContext] = createMenuContext(
  RADIO_GROUP_NAME$1,
  { value: void 0, onValueChange: () => {
  } }
);
var MenuRadioGroup = React$5.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = React$5.forwardRef(
  (props, forwardedRef) => {
    const { value, ...radioItemProps } = props;
    const context = useRadioGroupContext(RADIO_ITEM_NAME$1, props.__scopeMenu);
    const checked = value === context.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicatorProvider, { scope: props.__scopeMenu, checked, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItem,
      {
        role: "menuitemradio",
        "aria-checked": checked,
        ...radioItemProps,
        ref: forwardedRef,
        "data-state": getCheckedState(checked),
        onSelect: composeEventHandlers(
          radioItemProps.onSelect,
          () => context.onValueChange?.(value),
          { checkForDefaultPrevented: false }
        )
      }
    ) });
  }
);
MenuRadioItem.displayName = RADIO_ITEM_NAME$1;
var ITEM_INDICATOR_NAME = "MenuItemIndicator";
var [ItemIndicatorProvider, useItemIndicatorContext] = createMenuContext(
  ITEM_INDICATOR_NAME,
  { checked: false }
);
var MenuItemIndicator = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, forceMount, ...itemIndicatorProps } = props;
    const indicatorContext = useItemIndicatorContext(ITEM_INDICATOR_NAME, __scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Presence,
      {
        present: forceMount || isIndeterminate(indicatorContext.checked) || indicatorContext.checked === true,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.span,
          {
            ...itemIndicatorProps,
            ref: forwardedRef,
            "data-state": getCheckedState(indicatorContext.checked)
          }
        )
      }
    );
  }
);
MenuItemIndicator.displayName = ITEM_INDICATOR_NAME;
var SEPARATOR_NAME$1 = "MenuSeparator";
var MenuSeparator = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...separatorProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Primitive.div,
      {
        role: "separator",
        "aria-orientation": "horizontal",
        ...separatorProps,
        ref: forwardedRef
      }
    );
  }
);
MenuSeparator.displayName = SEPARATOR_NAME$1;
var ARROW_NAME$1 = "MenuArrow";
var MenuArrow = React$5.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...arrowProps } = props;
    const popperScope = usePopperScope(__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow, { ...popperScope, ...arrowProps, ref: forwardedRef });
  }
);
MenuArrow.displayName = ARROW_NAME$1;
var SUB_NAME = "MenuSub";
var [MenuSubProvider, useMenuSubContext] = createMenuContext(SUB_NAME);
var SUB_TRIGGER_NAME$1 = "MenuSubTrigger";
var MenuSubTrigger = React$5.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const openTimerRef = React$5.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = React$5.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    React$5.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    React$5.useEffect(() => {
      const pointerGraceTimer = pointerGraceTimerRef.current;
      return () => {
        window.clearTimeout(pointerGraceTimer);
        onPointerGraceIntentChange(null);
      };
    }, [pointerGraceTimerRef, onPointerGraceIntentChange]);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(MenuAnchor, { asChild: true, ...scope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuItemImpl,
      {
        id: subContext.triggerId,
        "aria-haspopup": "menu",
        "aria-expanded": context.open,
        "aria-controls": subContext.contentId,
        "data-state": getOpenState(context.open),
        ...props,
        ref: composeRefs(forwardedRef, subContext.onTriggerChange),
        onClick: (event) => {
          props.onClick?.(event);
          if (props.disabled || event.defaultPrevented) return;
          event.currentTarget.focus();
          if (!context.open) context.onOpenChange(true);
        },
        onPointerMove: composeEventHandlers(
          props.onPointerMove,
          whenMouse((event) => {
            contentContext.onItemEnter(event);
            if (event.defaultPrevented) return;
            if (!props.disabled && !context.open && !openTimerRef.current) {
              contentContext.onPointerGraceIntentChange(null);
              openTimerRef.current = window.setTimeout(() => {
                context.onOpenChange(true);
                clearOpenTimer();
              }, 100);
            }
          })
        ),
        onPointerLeave: composeEventHandlers(
          props.onPointerLeave,
          whenMouse((event) => {
            clearOpenTimer();
            const contentRect = context.content?.getBoundingClientRect();
            if (contentRect) {
              const side = context.content?.dataset.side;
              const rightSide = side === "right";
              const bleed = rightSide ? -5 : 5;
              const contentNearEdge = contentRect[rightSide ? "left" : "right"];
              const contentFarEdge = contentRect[rightSide ? "right" : "left"];
              contentContext.onPointerGraceIntentChange({
                area: [
                  // Apply a bleed on clientX to ensure that our exit point is
                  // consistently within polygon bounds
                  { x: event.clientX + bleed, y: event.clientY },
                  { x: contentNearEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.top },
                  { x: contentFarEdge, y: contentRect.bottom },
                  { x: contentNearEdge, y: contentRect.bottom }
                ],
                side
              });
              window.clearTimeout(pointerGraceTimerRef.current);
              pointerGraceTimerRef.current = window.setTimeout(
                () => contentContext.onPointerGraceIntentChange(null),
                300
              );
            } else {
              contentContext.onTriggerLeave(event);
              if (event.defaultPrevented) return;
              contentContext.onPointerGraceIntentChange(null);
            }
          })
        ),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isTypingAhead = contentContext.searchRef.current !== "";
          if (props.disabled || isTypingAhead && event.key === " ") return;
          if (SUB_OPEN_KEYS[rootContext.dir].includes(event.key)) {
            context.onOpenChange(true);
            context.content?.focus();
            event.preventDefault();
          }
        })
      }
    ) });
  }
);
MenuSubTrigger.displayName = SUB_TRIGGER_NAME$1;
var SUB_CONTENT_NAME$1 = "MenuSubContent";
var MenuSubContent = React$5.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
    const ref = React$5.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentImpl,
      {
        id: subContext.contentId,
        "aria-labelledby": subContext.triggerId,
        ...subContentProps,
        ref: composedRefs,
        align: "start",
        side: rootContext.dir === "rtl" ? "left" : "right",
        disableOutsidePointerEvents: false,
        disableOutsideScroll: false,
        trapFocus: false,
        onOpenAutoFocus: (event) => {
          if (rootContext.isUsingKeyboardRef.current) ref.current?.focus();
          event.preventDefault();
        },
        onCloseAutoFocus: (event) => event.preventDefault(),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          if (event.target !== subContext.trigger) context.onOpenChange(false);
        }),
        onEscapeKeyDown: composeEventHandlers(props.onEscapeKeyDown, (event) => {
          rootContext.onClose();
          event.preventDefault();
        }),
        onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
          const isKeyDownInside = event.currentTarget.contains(event.target);
          const isCloseKey = SUB_CLOSE_KEYS[rootContext.dir].includes(event.key);
          if (isKeyDownInside && isCloseKey) {
            context.onOpenChange(false);
            subContext.trigger?.focus();
            event.preventDefault();
          }
        })
      }
    ) }) }) });
  }
);
MenuSubContent.displayName = SUB_CONTENT_NAME$1;
function getOpenState(open) {
  return open ? "open" : "closed";
}
function isIndeterminate(checked) {
  return checked === "indeterminate";
}
function getCheckedState(checked) {
  return isIndeterminate(checked) ? "indeterminate" : checked ? "checked" : "unchecked";
}
function focusFirst(candidates) {
  const PREVIOUSLY_FOCUSED_ELEMENT = document.activeElement;
  for (const candidate of candidates) {
    if (candidate === PREVIOUSLY_FOCUSED_ELEMENT) return;
    candidate.focus();
    if (document.activeElement !== PREVIOUSLY_FOCUSED_ELEMENT) return;
  }
}
function wrapArray$1(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
function getNextMatch(values, search, currentMatch) {
  const isRepeated = search.length > 1 && Array.from(search).every((char) => char === search[0]);
  const normalizedSearch = isRepeated ? search[0] : search;
  const currentMatchIndex = currentMatch ? values.indexOf(currentMatch) : -1;
  let wrappedValues = wrapArray$1(values, Math.max(currentMatchIndex, 0));
  const excludeCurrentMatch = normalizedSearch.length === 1;
  if (excludeCurrentMatch) wrappedValues = wrappedValues.filter((v) => v !== currentMatch);
  const nextMatch = wrappedValues.find(
    (value) => value.toLowerCase().startsWith(normalizedSearch.toLowerCase())
  );
  return nextMatch !== currentMatch ? nextMatch : void 0;
}
function isPointInPolygon(point, polygon) {
  const { x, y } = point;
  let inside = false;
  for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
    const ii = polygon[i];
    const jj = polygon[j];
    const xi = ii.x;
    const yi = ii.y;
    const xj = jj.x;
    const yj = jj.y;
    const intersect = yi > y !== yj > y && x < (xj - xi) * (y - yi) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}
function isPointerInGraceArea(event, area) {
  if (!area) return false;
  const cursorPos = { x: event.clientX, y: event.clientY };
  return isPointInPolygon(cursorPos, area);
}
function whenMouse(handler) {
  return (event) => event.pointerType === "mouse" ? handler(event) : void 0;
}
var Root3$1 = Menu$1;
var Anchor2 = MenuAnchor;
var Portal = MenuPortal;
var Content2$1 = MenuContent;
var Group = MenuGroup;
var Label = MenuLabel;
var Item2 = MenuItem;
var CheckboxItem = MenuCheckboxItem;
var RadioGroup = MenuRadioGroup;
var RadioItem = MenuRadioItem;
var ItemIndicator = MenuItemIndicator;
var Separator = MenuSeparator;
var Arrow2 = MenuArrow;
var SubTrigger = MenuSubTrigger;
var SubContent = MenuSubContent;

// src/menubar.tsx
const React$4 = await importShared('react');
var MENUBAR_NAME = "Menubar";
var [Collection, useCollection, createCollectionScope] = createCollection(MENUBAR_NAME);
var [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope
]);
var useMenuScope = createMenuScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenubarContextProvider, useMenubarContext] = createMenubarContext(MENUBAR_NAME);
var Menubar$1 = React$4.forwardRef(
  (props, forwardedRef) => {
    const {
      __scopeMenubar,
      value: valueProp,
      onValueChange,
      defaultValue,
      loop = true,
      dir,
      ...menubarProps
    } = props;
    const direction = useDirection(dir);
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const [value, setValue] = useControllableState({
      prop: valueProp,
      onChange: onValueChange,
      defaultProp: defaultValue ?? "",
      caller: MENUBAR_NAME
    });
    const [currentTabStopId, setCurrentTabStopId] = React$4.useState(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenubarContextProvider,
      {
        scope: __scopeMenubar,
        value,
        onMenuOpen: React$4.useCallback(
          (value2) => {
            setValue(value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        onMenuClose: React$4.useCallback(() => setValue(""), [setValue]),
        onMenuToggle: React$4.useCallback(
          (value2) => {
            setValue((prevValue) => prevValue ? "" : value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        dir: direction,
        loop,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Provider, { scope: __scopeMenubar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.Slot, { scope: __scopeMenubar, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Root,
          {
            asChild: true,
            ...rovingFocusGroupScope,
            orientation: "horizontal",
            loop,
            dir: direction,
            currentTabStopId,
            onCurrentTabStopIdChange: setCurrentTabStopId,
            children: /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "menubar", ...menubarProps, ref: forwardedRef })
          }
        ) }) })
      }
    );
  }
);
Menubar$1.displayName = MENUBAR_NAME;
var MENU_NAME = "MenubarMenu";
var [MenubarMenuProvider, useMenubarMenuContext] = createMenubarContext(MENU_NAME);
var MenubarMenu$1 = (props) => {
  const { __scopeMenubar, value: valueProp, ...menuProps } = props;
  const autoValue = useId();
  const value = valueProp || autoValue || "LEGACY_REACT_AUTO_VALUE";
  const context = useMenubarContext(MENU_NAME, __scopeMenubar);
  const menuScope = useMenuScope(__scopeMenubar);
  const triggerRef = React$4.useRef(null);
  const wasKeyboardTriggerOpenRef = React$4.useRef(false);
  const open = context.value === value;
  React$4.useEffect(() => {
    if (!open) wasKeyboardTriggerOpenRef.current = false;
  }, [open]);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    MenubarMenuProvider,
    {
      scope: __scopeMenubar,
      value,
      triggerId: useId(),
      triggerRef,
      contentId: useId(),
      wasKeyboardTriggerOpenRef,
      children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        Root3$1,
        {
          ...menuScope,
          open,
          onOpenChange: (open2) => {
            if (!open2) context.onMenuClose();
          },
          modal: false,
          dir: context.dir,
          ...menuProps
        }
      )
    }
  );
};
MenubarMenu$1.displayName = MENU_NAME;
var TRIGGER_NAME = "MenubarTrigger";
var MenubarTrigger$1 = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar);
    const ref = React$4.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, menuContext.triggerRef);
    const [isFocused, setIsFocused] = React$4.useState(false);
    const open = context.value === menuContext.value;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection.ItemSlot, { scope: __scopeMenubar, value: menuContext.value, disabled, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
      Item,
      {
        asChild: true,
        ...rovingFocusGroupScope,
        focusable: !disabled,
        tabStopId: menuContext.value,
        children: /* @__PURE__ */ jsxRuntimeExports.jsx(Anchor2, { asChild: true, ...menuScope, children: /* @__PURE__ */ jsxRuntimeExports.jsx(
          Primitive.button,
          {
            type: "button",
            role: "menuitem",
            id: menuContext.triggerId,
            "aria-haspopup": "menu",
            "aria-expanded": open,
            "aria-controls": open ? menuContext.contentId : void 0,
            "data-highlighted": isFocused ? "" : void 0,
            "data-state": open ? "open" : "closed",
            "data-disabled": disabled ? "" : void 0,
            disabled,
            ...triggerProps,
            ref: composedRefs,
            onPointerDown: composeEventHandlers(props.onPointerDown, (event) => {
              if (!disabled && event.button === 0 && event.ctrlKey === false) {
                context.onMenuOpen(menuContext.value);
                if (!open) event.preventDefault();
              }
            }),
            onPointerEnter: composeEventHandlers(props.onPointerEnter, () => {
              const menubarOpen = Boolean(context.value);
              if (menubarOpen && !open) {
                context.onMenuOpen(menuContext.value);
                ref.current?.focus();
              }
            }),
            onKeyDown: composeEventHandlers(props.onKeyDown, (event) => {
              if (disabled) return;
              if (["Enter", " "].includes(event.key)) context.onMenuToggle(menuContext.value);
              if (event.key === "ArrowDown") context.onMenuOpen(menuContext.value);
              if (["Enter", " ", "ArrowDown"].includes(event.key)) {
                menuContext.wasKeyboardTriggerOpenRef.current = true;
                event.preventDefault();
              }
            }),
            onFocus: composeEventHandlers(props.onFocus, () => setIsFocused(true)),
            onBlur: composeEventHandlers(props.onBlur, () => setIsFocused(false))
          }
        ) })
      }
    ) });
  }
);
MenubarTrigger$1.displayName = TRIGGER_NAME;
var PORTAL_NAME = "MenubarPortal";
var MenubarPortal$1 = (props) => {
  const { __scopeMenubar, ...portalProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal, { ...menuScope, ...portalProps });
};
MenubarPortal$1.displayName = PORTAL_NAME;
var CONTENT_NAME = "MenubarContent";
var MenubarContent$1 = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, align = "start", ...contentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(CONTENT_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar);
    const getItems = useCollection(__scopeMenubar);
    const hasInteractedOutsideRef = React$4.useRef(false);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      Content2$1,
      {
        id: menuContext.contentId,
        "aria-labelledby": menuContext.triggerId,
        "data-radix-menubar-content": "",
        ...menuScope,
        ...contentProps,
        ref: forwardedRef,
        align,
        onCloseAutoFocus: composeEventHandlers(props.onCloseAutoFocus, (event) => {
          const menubarOpen = Boolean(context.value);
          if (!menubarOpen && !hasInteractedOutsideRef.current) {
            menuContext.triggerRef.current?.focus();
          }
          hasInteractedOutsideRef.current = false;
          event.preventDefault();
        }),
        onFocusOutside: composeEventHandlers(props.onFocusOutside, (event) => {
          const target = event.target;
          const isMenubarTrigger = getItems().some((item) => item.ref.current?.contains(target));
          if (isMenubarTrigger) event.preventDefault();
        }),
        onInteractOutside: composeEventHandlers(props.onInteractOutside, () => {
          hasInteractedOutsideRef.current = true;
        }),
        onEntryFocus: (event) => {
          if (!menuContext.wasKeyboardTriggerOpenRef.current) event.preventDefault();
        },
        onKeyDown: composeEventHandlers(
          props.onKeyDown,
          (event) => {
            if (["ArrowRight", "ArrowLeft"].includes(event.key)) {
              const target = event.target;
              const targetIsSubTrigger = target.hasAttribute("data-radix-menubar-subtrigger");
              const isKeyDownInsideSubMenu = target.closest("[data-radix-menubar-content]") !== event.currentTarget;
              const prevMenuKey = context.dir === "rtl" ? "ArrowRight" : "ArrowLeft";
              const isPrevKey = prevMenuKey === event.key;
              const isNextKey = !isPrevKey;
              if (isNextKey && targetIsSubTrigger) return;
              if (isKeyDownInsideSubMenu && isPrevKey) return;
              const items = getItems().filter((item) => !item.disabled);
              let candidateValues = items.map((item) => item.value);
              if (isPrevKey) candidateValues.reverse();
              const currentIndex = candidateValues.indexOf(menuContext.value);
              candidateValues = context.loop ? wrapArray(candidateValues, currentIndex + 1) : candidateValues.slice(currentIndex + 1);
              const [nextValue] = candidateValues;
              if (nextValue) context.onMenuOpen(nextValue);
            }
          },
          { checkForDefaultPrevented: false }
        ),
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarContent$1.displayName = CONTENT_NAME;
var GROUP_NAME = "MenubarGroup";
var MenubarGroup = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
MenubarGroup.displayName = GROUP_NAME;
var LABEL_NAME = "MenubarLabel";
var MenubarLabel = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
MenubarLabel.displayName = LABEL_NAME;
var ITEM_NAME = "MenubarItem";
var MenubarItem$1 = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
MenubarItem$1.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "MenubarCheckboxItem";
var MenubarCheckboxItem = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
  }
);
MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "MenubarRadioGroup";
var MenubarRadioGroup = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
  }
);
MenubarRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "MenubarRadioItem";
var MenubarRadioItem = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
  }
);
MenubarRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "MenubarItemIndicator";
var MenubarItemIndicator = React$4.forwardRef((props, forwardedRef) => {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
MenubarItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME = "MenubarSeparator";
var MenubarSeparator = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
  }
);
MenubarSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "MenubarArrow";
var MenubarArrow = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
MenubarArrow.displayName = ARROW_NAME;
var SUB_TRIGGER_NAME = "MenubarSubTrigger";
var MenubarSubTrigger = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subTriggerProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubTrigger,
      {
        "data-radix-menubar-subtrigger": "",
        ...menuScope,
        ...subTriggerProps,
        ref: forwardedRef
      }
    );
  }
);
MenubarSubTrigger.displayName = SUB_TRIGGER_NAME;
var SUB_CONTENT_NAME = "MenubarSubContent";
var MenubarSubContent = React$4.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...subContentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      SubContent,
      {
        ...menuScope,
        "data-radix-menubar-content": "",
        ...subContentProps,
        ref: forwardedRef,
        style: {
          ...props.style,
          // re-namespace exposed content custom properties
          ...{
            "--radix-menubar-content-transform-origin": "var(--radix-popper-transform-origin)",
            "--radix-menubar-content-available-width": "var(--radix-popper-available-width)",
            "--radix-menubar-content-available-height": "var(--radix-popper-available-height)",
            "--radix-menubar-trigger-width": "var(--radix-popper-anchor-width)",
            "--radix-menubar-trigger-height": "var(--radix-popper-anchor-height)"
          }
        }
      }
    );
  }
);
MenubarSubContent.displayName = SUB_CONTENT_NAME;
function wrapArray(array, startIndex) {
  return array.map((_, index) => array[(startIndex + index) % array.length]);
}
var Root3 = Menubar$1;
var Menu = MenubarMenu$1;
var Trigger = MenubarTrigger$1;
var Portal2 = MenubarPortal$1;
var Content2 = MenubarContent$1;
var Item3 = MenubarItem$1;

await importShared('react');
function Menubar({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Root3,
    {
      "data-slot": "menubar",
      className: cn(
        "bg-background flex h-9 items-center gap-1 rounded-md border p-1 shadow-xs",
        className
      ),
      ...props
    }
  );
}
function MenubarMenu({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Menu, { "data-slot": "menubar-menu", ...props });
}
function MenubarPortal({
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(Portal2, { "data-slot": "menubar-portal", ...props });
}
function MenubarTrigger({
  className,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Trigger,
    {
      "data-slot": "menubar-trigger",
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[state=open]:bg-accent data-[state=open]:text-accent-foreground flex items-center rounded-sm px-2 py-1 text-sm font-medium outline-hidden select-none",
        className
      ),
      ...props
    }
  );
}
function MenubarContent({
  className,
  align = "start",
  alignOffset = -4,
  sideOffset = 8,
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(MenubarPortal, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
    Content2,
    {
      "data-slot": "menubar-content",
      align,
      alignOffset,
      sideOffset,
      className: cn(
        "bg-popover text-popover-foreground data-[state=open]:animate-in data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 z-50 min-w-[12rem] origin-(--radix-menubar-content-transform-origin) overflow-hidden rounded-md border p-1 shadow-md",
        className
      ),
      ...props
    }
  ) });
}
function MenubarItem({
  className,
  inset,
  variant = "default",
  ...props
}) {
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Item3,
    {
      "data-slot": "menubar-item",
      "data-inset": inset,
      "data-variant": variant,
      className: cn(
        "focus:bg-accent focus:text-accent-foreground data-[variant=destructive]:text-destructive data-[variant=destructive]:focus:bg-destructive/10 dark:data-[variant=destructive]:focus:bg-destructive/20 data-[variant=destructive]:focus:text-destructive data-[variant=destructive]:*:[svg]:!text-destructive [&_svg:not([class*='text-'])]:text-muted-foreground relative flex cursor-default items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-hidden select-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[inset]:pl-8 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className
      ),
      ...props
    }
  );
}

const React$3 = await importShared('react');
const DesktopNav = ({ navItems }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const isMenuActive = (item) => item.items && item.items.some((sub) => location.pathname === sub.href);
  return /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "hidden md:block w-full", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menubar, { className: "bg-transparent flex justify-start gap-2 border-none text-navbar-text h-10", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(MenubarMenu, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsxs(
      MenubarTrigger,
      {
        className: `
                h-full px-3 rounded-none cursor-pointer flex items-center gap-1 transition-colors duration-200
                ${isMenuActive(item) ? "border-b-2 border-yellow-400 text-white font-bold bg-black" : "hover:bg-black hover:border-b-2 hover:border-yellow-400 hover:text-white"}
              `,
        ...!item.items && item.href ? { onClick: () => navigate(item.href) } : {},
        children: [
          item.label,
          item.items && item.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
        ]
      }
    ),
    item.items && item.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenubarContent,
      {
        className: "min-w-[200px] bg-navbar-dropdown border-navbar-border rounded-sm",
        sideOffset: 5,
        side: "bottom",
        children: item.items.map((subItem) => /* @__PURE__ */ jsxRuntimeExports.jsx(
          MenubarItem,
          {
            className: `text-navbar-text rounded-sm bg-mobile-menu my-2 hover:bg-navbar-dropdown-hover hover:border-l-2 hover:border-l-navbar-highlight cursor-pointer ${location.pathname === subItem.href ? "bg-navbar-dropdown-hover border-l-2 border-yellow-400 text-white font-bold" : ""}`,
            onClick: () => navigate(subItem.href),
            children: subItem.label
          },
          subItem.href
        ))
      }
    )
  ] }, item.label)) }) });
};
const DesktopNav$1 = React$3.memo(DesktopNav);

const React$2 = await importShared('react');
const {useState: useState$2} = React$2;
const MobileNav = ({ isOpen, toggleOpen, navItems }) => {
  const [expandedIndex, setExpandedIndex] = useState$2(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toggleExpand = (index) => {
    setExpandedIndex((prev) => prev === index ? null : index);
  };
  const isMenuActive = (item) => item.items && item.items.some((sub) => location.pathname === sub.href);
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "md:hidden relative w-full flex items-center justify-start", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "button",
      {
        onClick: toggleOpen,
        className: "flex items-center justify-center w-10 h-10 text-navbar-text hover:bg-navbar-dropdown-hover rounded",
        "aria-label": isOpen ? "Close menu" : "Open menu",
        children: isOpen ? /* @__PURE__ */ jsxRuntimeExports.jsx(X, { size: 24 }) : /* @__PURE__ */ jsxRuntimeExports.jsx(Menu$2, { size: 24 })
      }
    ),
    isOpen && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mobile-menu-container absolute left-0 top-10 mt-2 w-56 bg-mobile-menu rounded-md shadow-lg z-50", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "py-1", children: navItems.map((item, index) => /* @__PURE__ */ jsxRuntimeExports.jsxs(
      "div",
      {
        className: "border-b border-navbar-border last:border-b-0",
        children: [
          /* @__PURE__ */ jsxRuntimeExports.jsxs(
            "div",
            {
              className: `px-4 py-2 text-navbar-text font-medium cursor-pointer flex justify-between items-center ${isMenuActive(item) ? "border-b-2 border-yellow-400 text-white font-bold bg-black" : ""}`,
              ...!item.items && item.href ? {
                onClick: () => {
                  navigate(item.href);
                  toggleOpen();
                }
              } : {
                onClick: () => toggleExpand(index),
                role: "button",
                tabIndex: 0,
                onKeyDown: (e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleExpand(index);
                  }
                }
              },
              children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: item.label }),
                item.items && item.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "ml-2 text-sm", children: expandedIndex === index ? "-" : "+" })
              ]
            }
          ),
          expandedIndex === index && item.items && item.items.length > 0 && /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-navbar-dropdown-hover", children: item.items.map((subItem) => /* @__PURE__ */ jsxRuntimeExports.jsx(
            "div",
            {
              onClick: () => {
                navigate(subItem.href);
                toggleOpen();
              },
              className: `block px-8 py-2 text-navbar-text text-sm hover:bg-navbar-dropdown-hover cursor-pointer ${location.pathname === subItem.href ? "border-l-2 border-yellow-400 text-white font-bold bg-navbar-dropdown-hover" : ""}`,
              children: subItem.label
            },
            subItem.label
          )) })
        ]
      },
      item.label
    )) }) })
  ] });
};
const MobileNav$1 = React$2.memo(MobileNav);

const React$1 = await importShared('react');
const {useState: useState$1,useEffect,useCallback,useMemo} = React$1;
const navItems$1 = [
  {
    label: "Live",
    items: [
      { label: "Event View", href: "/live_events/event-view" },
      { label: "Live Calendar", href: "/live_events/live-calendar" },
      { label: "Results", href: "/live_events/results" },
      { label: "Statistics", href: "/live_events/statistics" }
    ]
  },
  { label: "Sports", items: [{ label: "Event View", href: "/live/in-play" }, { label: "Live Calendar", href: "/live/streaming" }, { label: "Results", href: "/live/scores" }, { label: "Statistics", href: "/live/scores" }] },
  { label: "Casino", items: [{ label: "Home", href: "/casino/slots" }, { label: "Tournaments", href: "/casino/tournaments" }] },
  { label: "Games", href: "/games" },
  { label: "Promotions", items: [{ label: "Sports Bonus", href: "/promotions/sports" }, { label: "Casino Bonus", href: "/promotions/casino" }, { label: "VIP Program", href: "/promotions/vip" }] },
  { label: "Virtual Sports", items: [{ label: "Virtual Football", href: "/virtual/football" }, { label: "Virtual Horse Racing", href: "/virtual/horse-racing" }, { label: "Virtual Tennis", href: "/virtual/tennis" }] },
  { label: "Esports", items: [{ label: "Event View", href: "/esports/event-view" }, { label: "Live Calendar", href: "/esports/live-calendar" }, { label: "Results", href: "/esports/results" }, { label: "Statistics", href: "/esports/statistics" }] },
  { label: "PlayTech", items: [{ label: "Slots", href: "/playtech/slots" }, { label: "Live Casino", href: "/playtech/live" }, { label: "Table Games", href: "/playtech/table" }] }
];
function MainNavbar() {
  const location = useLocation();
  useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, userData } = useSelector((state) => state.Login);
  const { userData: profileData, loading } = useSelector((state) => state.GetUserData);
  const [isScrolled, setIsScrolled] = useState$1(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState$1(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState$1(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState$1(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState$1(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState$1(false);
  const [forceUpdate, setForceUpdate] = useState$1(0);
  const calculateActiveExposure = useCallback((exposures) => {
    if (!exposures || !Array.isArray(exposures)) {
      return 0;
    }
    const total = exposures.reduce((total2, exposureObj) => {
      if (exposureObj?.is_clear === "true" || exposureObj?.is_clear === true) {
        return total2;
      }
      const exposureValue = parseFloat(exposureObj?.exposure) || 0;
      return total2 + exposureValue;
    }, 0);
    return total;
  }, []);
  const getTotalExposure = useMemo(() => {
    const sourceData = userData || profileData || {};
    if (sourceData?.exposures) {
      return calculateActiveExposure(sourceData.exposures);
    } else if (sourceData?.exposure) {
      return parseFloat(sourceData.exposure) || 0;
    }
    return 0;
  }, [profileData, userData, calculateActiveExposure]);
  const getBalance = useMemo(() => {
    const sourceData = userData || profileData || {};
    const balance = parseFloat(sourceData?.balance) || 0;
    const activeExposure = getTotalExposure;
    return balance - activeExposure;
  }, [profileData, userData, getTotalExposure]);
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    const handleClickOutside = (e) => {
      if (isMobileMenuOpen && !e.target.closest(".mobile-menu-container")) {
        setIsMobileMenuOpen(false);
      }
      if (isUserMenuOpen && !e.target.closest(".user-menu-container")) {
        setIsUserMenuOpen(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("scroll", handleScroll);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isMobileMenuOpen, isUserMenuOpen]);
  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.get("login") === "true") {
      setIsLoginModalOpen(true);
      window.history.replaceState({}, document.title, location.pathname);
    }
  }, [location]);
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(getUserData());
    }
  }, [isAuthenticated, dispatch]);
  useEffect(() => {
   
  }, [profileData]);
  useEffect(() => {
   
    const sourceData = userData || profileData || {};
    const totalExposure = calculateActiveExposure(sourceData?.exposures) || parseFloat(sourceData?.exposure) || 0;
    const activeExposure = getTotalExposure;
    console.log("getBalance value:", getBalance);
    console.log("getTotalExposure value (active only):", activeExposure);
    console.log("Total exposure (including cleared):", totalExposure);
    console.log("Balance calculation details:", {
      sourceBalance: userData?.balance,
      sourceExposure: userData?.exposure,
      calculatedBalance: parseFloat(userData?.balance) || 0,
      calculatedExposure: parseFloat(userData?.exposure) || 0,
      totalExposure,
      activeExposure,
      finalBalance: (parseFloat(userData?.balance) || 0) - activeExposure
      // Use active exposure for balance
    });
  }, [userData, getBalance, getTotalExposure, calculateActiveExposure]);
  useEffect(() => {
   
    setForceUpdate((prev) => prev + 1);
  }, [profileData]);
  useEffect(() => {
    
  }, [forceUpdate]);
  const toggleMobileMenu = useCallback(() => {
    setIsMobileMenuOpen((prev) => !prev);
  }, []);
  const UserDataSkeleton = () => /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-4", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 bg-gray-400 rounded animate-pulse" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-1 bg-gray-400 rounded" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-4 w-20 bg-gray-400 rounded animate-pulse" })
  ] });
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      "div",
      {
        className: `fixed top-0 left-0 w-full z-50 transition-all duration-300 ${isScrolled ? "backdrop-blur-md bg-black/70 shadow-lg" : "bg-navbar-main"}`,
        children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "text-navbar-text h-28 w-full relative", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mx-auto px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-full w-full", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex items-center gap-4", children: /* @__PURE__ */ jsxRuntimeExports.jsxs(Link, { to: "/", className: "flex items-center gap-4", children: [
              /* @__PURE__ */ jsxRuntimeExports.jsx(
                "img",
                {
                  src: "/appLogo/LOGOICON.png",
                  alt: "Logo",
                  className: "w-16 h-16 object-contain"
                }
              ),
              /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-muted-card text-brand cursor-pointer hover:text-chart-5", children: "Sportsbook" })
            ] }) }),
            /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center md:gap-4 gap-2", children: [
              isAuthenticated && loading && /* @__PURE__ */ jsxRuntimeExports.jsx(UserDataSkeleton, {}),
              isAuthenticated && !loading && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "hidden md:flex items-center gap-4 text-white font-bold", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Balance: ",
                  getBalance
                ] }),
                /* @__PURE__ */ jsxRuntimeExports.jsx("span", { children: "|" }),
                /* @__PURE__ */ jsxRuntimeExports.jsxs("span", { children: [
                  "Exposure: ",
                  getTotalExposure
                ] })
              ] }),
              isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  className: "bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm",
                  onClick: () => setIsDepositModalOpen(true),
                  children: "DEPOSIT"
                }
              ),
              !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "p",
                {
                  onClick: () => setIsLoginModalOpen(true),
                  className: "hidden md:block text-navbar-text text-sm underline hover:no-underline cursor-pointer",
                  children: "Login"
                }
              ),
              !isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsx(
                "button",
                {
                  onClick: () => setIsRegisterModalOpen(true),
                  className: "bg-yellow-500 hidden md:block text-black font-bold h-10 py-2 px-6 rounded-md text-sm",
                  children: "Register"
                }
              ),
              isAuthenticated && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "relative user-menu-container", children: [
                /* @__PURE__ */ jsxRuntimeExports.jsx(
                  "button",
                  {
                    onClick: () => setIsUserMenuOpen(!isUserMenuOpen),
                    className: "flex items-center justify-center w-10 h-10 rounded-full bg-gray-200 hover:bg-gray-300 transition-colors",
                    children: /* @__PURE__ */ jsxRuntimeExports.jsx(User, { className: "w-5 h-5 text-gray-700" })
                  }
                ),
                isUserMenuOpen && /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50", children: [
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/profile",
                      className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                      onClick: () => setIsUserMenuOpen(false),
                      children: "Profile"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    Link,
                    {
                      to: "/change-password",
                      className: "block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                      onClick: () => setIsUserMenuOpen(false),
                      children: "Change Password"
                    }
                  ),
                  /* @__PURE__ */ jsxRuntimeExports.jsx(
                    "button",
                    {
                      onClick: () => {
                        dispatch(logout());
                        setIsUserMenuOpen(false);
                      },
                      className: "block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100",
                      children: "Logout"
                    }
                  )
                ] })
              ] }),
              /* @__PURE__ */ jsxRuntimeExports.jsx(Clock, {})
            ] })
          ] }) }),
          /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-10 w-[95%] absolute bottom-0 left-1/2 transform -translate-x-1/2 z-20 bg-muted-foreground rounded-t-lg", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "container mx-auto h-full flex items-center px-4", children: [
            /* @__PURE__ */ jsxRuntimeExports.jsx(
              MobileNav$1,
              {
                isOpen: isMobileMenuOpen,
                toggleOpen: toggleMobileMenu,
                navItems: navItems$1
              }
            ),
            /* @__PURE__ */ jsxRuntimeExports.jsx(DesktopNav$1, { navItems: navItems$1 })
          ] }) })
        ] })
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-28" }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegisterModal,
      {
        isOpen: isRegisterModalOpen,
        onClose: () => setIsRegisterModalOpen(false),
        onCloseAll: () => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginModal,
      {
        isOpen: isLoginModalOpen,
        onClose: () => setIsLoginModalOpen(false),
        onSwitchToRegister: () => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DepositModal,
      {
        isOpen: isDepositModalOpen,
        onClose: () => setIsDepositModalOpen(false)
      }
    )
  ] });
}

const React = await importShared('react');
const {useState} = React;
const MobileNavbar = () => {
  const isAuthenticated = useSelector((state) => state?.Login?.isAuthenticated);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isDepositModalOpen, setIsDepositModalOpen] = useState(false);
  const navLinks = [];
  const handleDepositClick = () => {
    if (isAuthenticated) {
      setIsDepositModalOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };
  navLinks.push({
    label: "Deposit",
    onClick: handleDepositClick
  });
  if (!isAuthenticated) {
    navLinks.push({
      label: "Login",
      onClick: () => setIsLoginModalOpen(true)
    });
    navLinks.push({
      label: "Register",
      onClick: () => setIsRegisterModalOpen(true)
    });
  }
  return /* @__PURE__ */ jsxRuntimeExports.jsxs(jsxRuntimeExports.Fragment, { children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "max-h-[3.5rem] px-2 pb-5 fixed inset-x-0 bottom-0 rounded-t-md z-[100] bg-[#f13636]", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "flex justify-around items-center gap-2", children: navLinks.map((link) => /* @__PURE__ */ jsxRuntimeExports.jsx(
      "p",
      {
        className: "block py-2 text-white hover:text-yellow-500 cursor-pointer",
        onClick: link.onClick,
        children: link.label
      },
      link.label
    )) }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      LoginModal,
      {
        isOpen: isLoginModalOpen,
        onClose: () => setIsLoginModalOpen(false),
        onSwitchToRegister: () => {
          setIsLoginModalOpen(false);
          setIsRegisterModalOpen(true);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      RegisterModal,
      {
        isOpen: isRegisterModalOpen,
        onClose: () => setIsRegisterModalOpen(false),
        onCloseAll: () => {
          setIsRegisterModalOpen(false);
          setIsLoginModalOpen(false);
        }
      }
    ),
    /* @__PURE__ */ jsxRuntimeExports.jsx(
      DepositModal,
      {
        isOpen: isDepositModalOpen,
        onClose: () => setIsDepositModalOpen(false)
      }
    )
  ] });
};

const t = await importShared('react');
var M=(e,i,s,u,m,a,l,h)=>{let d=document.documentElement,w=["light","dark"];function p(n){(Array.isArray(e)?e:[e]).forEach(y=>{let k=y==="class",S=k&&a?m.map(f=>a[f]||f):m;k?(d.classList.remove(...S),d.classList.add(a&&a[n]?a[n]:n)):d.setAttribute(y,n);}),R(n);}function R(n){h&&w.includes(n)&&(d.style.colorScheme=n);}function c(){return window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"}if(u)p(u);else try{let n=localStorage.getItem(i)||s,y=l&&n==="system"?c():n;p(y);}catch(n){}};var x=t.createContext(void 0),U={setTheme:e=>{},themes:[]},z=()=>{var e;return (e=t.useContext(x))!=null?e:U};t.memo(({forcedTheme:e,storageKey:i,attribute:s,enableSystem:u,enableColorScheme:m,defaultTheme:a,value:l,themes:h,nonce:d,scriptProps:w})=>{let p=JSON.stringify([s,i,a,e,h,l,u,m]).slice(1,-1);return t.createElement("script",{...w,suppressHydrationWarning:true,nonce:typeof window=="undefined"?d:"",dangerouslySetInnerHTML:{__html:`(${M.toString()})(${p})`}})});

const Toaster = ({
  ...props
}) => {
  const { theme = "system" } = z();
  return /* @__PURE__ */ jsxRuntimeExports.jsx(
    Toaster$1,
    {
      theme,
      className: "toaster group",
      style: {
        "--normal-bg": "var(--popover)",
        "--normal-text": "var(--popover-foreground)",
        "--normal-border": "var(--border)"
      },
      ...props
    }
  );
};

await importShared('react');
const navItems = [
  { label: "Event View", to: "/live_events/event-view" },
  { label: "Live Calendar", to: "/live_events/live-calendar" },
  { label: "Results", to: "/live_events/results" },
  { label: "Statistics", to: "/live_events/statistics" }
];
function SecondaryLiveNavbar() {
  return /* @__PURE__ */ jsxRuntimeExports.jsx("nav", { className: "flex bg-live-secondary border-b border-live px-6 h-12 items-center gap-2", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsx(
    NavLink,
    {
      to: item.to,
      className: ({ isActive }) => `h-full flex items-center px-5 text-base font-semibold transition-colors duration-200 border-b-2 ${isActive ? "text-live-primary border-live-accent bg-live-secondary font-bold" : "text-live-muted border-transparent hover:text-live-primary hover:border-live-accent"}`,
      end: true,
      children: item.label
    },
    item.to
  )) });
}

await importShared('react');
const Layout = () => {
  const location = useLocation();
  const showLiveNavbar = location.pathname === "/live_events" || location.pathname.startsWith("/live_events/");
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MainNavbar, {}),
    showLiveNavbar && /* @__PURE__ */ jsxRuntimeExports.jsx(SecondaryLiveNavbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "min-h-screen", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Toaster, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "mx-auto px-6 lg:hidden", children: /* @__PURE__ */ jsxRuntimeExports.jsx(MobileNavbar, {}) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "h-20 lg:hidden" })
  ] });
};

export { Layout as default };
