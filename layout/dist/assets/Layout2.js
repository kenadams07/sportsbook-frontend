import { importShared } from './__federation_fn_import.js';
import { j as jsxRuntimeExports, u as useNavigate, O as Outlet } from './__federation_expose_LayoutApp.js';
import { c as createLucideIcon, u as useComposedRefs, a as useLayoutEffect2, b as createContextScope, d as createCollection, e as useId, P as Primitive, f as composeEventHandlers, g as useDirection, h as useControllableState, i as useCallbackRef, j as createPopperScope, R as Root2, A as Anchor, k as Portal$1, l as hideOthers, m as dispatchDiscreteCustomEvent, n as ReactRemoveScroll, o as useFocusGuards, p as createSlot, F as FocusScope, D as DismissableLayer, C as Content, q as Arrow, r as composeRefs, s as cn, t as buildExports, v as ChevronDown } from './Combination.js';

/**
 * @license lucide-react v0.525.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */


const __iconNode = [
  ["circle", { cx: "12", cy: "12", r: "1", key: "41hilf" }],
  ["circle", { cx: "12", cy: "5", r: "1", key: "gxeob9" }],
  ["circle", { cx: "12", cy: "19", r: "1", key: "lyex9k" }]
];
const EllipsisVertical = createLucideIcon("ellipsis-vertical", __iconNode);

// src/presence.tsx
const React2 = await importShared('react');

// src/use-state-machine.tsx
const React$4 = await importShared('react');

function useStateMachine(initialState, machine) {
  return React$4.useReducer((state, event) => {
    const nextState = machine[state][event];
    return nextState ?? state;
  }, initialState);
}

// src/presence.tsx
var Presence = (props) => {
  const { present, children } = props;
  const presence = usePresence(present);
  const child = typeof children === "function" ? children({ present: presence.isPresent }) : React2.Children.only(children);
  const ref = useComposedRefs(presence.ref, getElementRef(child));
  const forceMount = typeof children === "function";
  return forceMount || presence.isPresent ? React2.cloneElement(child, { ref }) : null;
};
Presence.displayName = "Presence";
function usePresence(present) {
  const [node, setNode] = React2.useState();
  const stylesRef = React2.useRef(null);
  const prevPresentRef = React2.useRef(present);
  const prevAnimationNameRef = React2.useRef("none");
  const initialState = present ? "mounted" : "unmounted";
  const [state, send] = useStateMachine(initialState, {
    mounted: {
      UNMOUNT: "unmounted",
      ANIMATION_OUT: "unmountSuspended"
    },
    unmountSuspended: {
      MOUNT: "mounted",
      ANIMATION_END: "unmounted"
    },
    unmounted: {
      MOUNT: "mounted"
    }
  });
  React2.useEffect(() => {
    const currentAnimationName = getAnimationName(stylesRef.current);
    prevAnimationNameRef.current = state === "mounted" ? currentAnimationName : "none";
  }, [state]);
  useLayoutEffect2(() => {
    const styles = stylesRef.current;
    const wasPresent = prevPresentRef.current;
    const hasPresentChanged = wasPresent !== present;
    if (hasPresentChanged) {
      const prevAnimationName = prevAnimationNameRef.current;
      const currentAnimationName = getAnimationName(styles);
      if (present) {
        send("MOUNT");
      } else if (currentAnimationName === "none" || styles?.display === "none") {
        send("UNMOUNT");
      } else {
        const isAnimating = prevAnimationName !== currentAnimationName;
        if (wasPresent && isAnimating) {
          send("ANIMATION_OUT");
        } else {
          send("UNMOUNT");
        }
      }
      prevPresentRef.current = present;
    }
  }, [present, send]);
  useLayoutEffect2(() => {
    if (node) {
      let timeoutId;
      const ownerWindow = node.ownerDocument.defaultView ?? window;
      const handleAnimationEnd = (event) => {
        const currentAnimationName = getAnimationName(stylesRef.current);
        const isCurrentAnimation = currentAnimationName.includes(event.animationName);
        if (event.target === node && isCurrentAnimation) {
          send("ANIMATION_END");
          if (!prevPresentRef.current) {
            const currentFillMode = node.style.animationFillMode;
            node.style.animationFillMode = "forwards";
            timeoutId = ownerWindow.setTimeout(() => {
              if (node.style.animationFillMode === "forwards") {
                node.style.animationFillMode = currentFillMode;
              }
            });
          }
        }
      };
      const handleAnimationStart = (event) => {
        if (event.target === node) {
          prevAnimationNameRef.current = getAnimationName(stylesRef.current);
        }
      };
      node.addEventListener("animationstart", handleAnimationStart);
      node.addEventListener("animationcancel", handleAnimationEnd);
      node.addEventListener("animationend", handleAnimationEnd);
      return () => {
        ownerWindow.clearTimeout(timeoutId);
        node.removeEventListener("animationstart", handleAnimationStart);
        node.removeEventListener("animationcancel", handleAnimationEnd);
        node.removeEventListener("animationend", handleAnimationEnd);
      };
    } else {
      send("ANIMATION_END");
    }
  }, [node, send]);
  return {
    isPresent: ["mounted", "unmountSuspended"].includes(state),
    ref: React2.useCallback((node2) => {
      stylesRef.current = node2 ? getComputedStyle(node2) : null;
      setNode(node2);
    }, [])
  };
}
function getAnimationName(styles) {
  return styles?.animationName || "none";
}
function getElementRef(element) {
  let getter = Object.getOwnPropertyDescriptor(element.props, "ref")?.get;
  let mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.ref;
  }
  getter = Object.getOwnPropertyDescriptor(element, "ref")?.get;
  mayWarn = getter && "isReactWarning" in getter && getter.isReactWarning;
  if (mayWarn) {
    return element.props.ref;
  }
  return element.props.ref || element.ref;
}

// src/roving-focus-group.tsx
const React$3 = await importShared('react');
var ENTRY_FOCUS = "rovingFocusGroup.onEntryFocus";
var EVENT_OPTIONS = { bubbles: false, cancelable: true };
var GROUP_NAME$2 = "RovingFocusGroup";
var [Collection$2, useCollection$2, createCollectionScope$2] = createCollection(GROUP_NAME$2);
var [createRovingFocusGroupContext, createRovingFocusGroupScope] = createContextScope(
  GROUP_NAME$2,
  [createCollectionScope$2]
);
var [RovingFocusProvider, useRovingFocusContext] = createRovingFocusGroupContext(GROUP_NAME$2);
var RovingFocusGroup = React$3.forwardRef(
  (props, forwardedRef) => {
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Provider, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$2.Slot, { scope: props.__scopeRovingFocusGroup, children: /* @__PURE__ */ jsxRuntimeExports.jsx(RovingFocusGroupImpl, { ...props, ref: forwardedRef }) }) });
  }
);
RovingFocusGroup.displayName = GROUP_NAME$2;
var RovingFocusGroupImpl = React$3.forwardRef((props, forwardedRef) => {
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
  const ref = React$3.useRef(null);
  const composedRefs = useComposedRefs(forwardedRef, ref);
  const direction = useDirection(dir);
  const [currentTabStopId, setCurrentTabStopId] = useControllableState({
    prop: currentTabStopIdProp,
    defaultProp: defaultCurrentTabStopId ?? null,
    onChange: onCurrentTabStopIdChange,
    caller: GROUP_NAME$2
  });
  const [isTabbingBackOut, setIsTabbingBackOut] = React$3.useState(false);
  const handleEntryFocus = useCallbackRef(onEntryFocus);
  const getItems = useCollection$2(__scopeRovingFocusGroup);
  const isClickFocusRef = React$3.useRef(false);
  const [focusableItemsCount, setFocusableItemsCount] = React$3.useState(0);
  React$3.useEffect(() => {
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
      onItemFocus: React$3.useCallback(
        (tabStopId) => setCurrentTabStopId(tabStopId),
        [setCurrentTabStopId]
      ),
      onItemShiftTab: React$3.useCallback(() => setIsTabbingBackOut(true), []),
      onFocusableItemAdd: React$3.useCallback(
        () => setFocusableItemsCount((prevCount) => prevCount + 1),
        []
      ),
      onFocusableItemRemove: React$3.useCallback(
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
var RovingFocusGroupItem = React$3.forwardRef(
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
    React$3.useEffect(() => {
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
const React$2 = await importShared('react');
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
  const [content, setContent] = React$2.useState(null);
  const isUsingKeyboardRef = React$2.useRef(false);
  const handleOpenChange = useCallbackRef(onOpenChange);
  const direction = useDirection(dir);
  React$2.useEffect(() => {
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
          onClose: React$2.useCallback(() => handleOpenChange(false), [handleOpenChange]),
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
var MenuAnchor = React$2.forwardRef(
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
var MenuContent = React$2.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...contentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Provider, { scope: props.__scopeMenu, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Presence, { present: forceMount || context.open, children: /* @__PURE__ */ jsxRuntimeExports.jsx(Collection$1.Slot, { scope: props.__scopeMenu, children: rootContext.modal ? /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentModal, { ...contentProps, ref: forwardedRef }) : /* @__PURE__ */ jsxRuntimeExports.jsx(MenuRootContentNonModal, { ...contentProps, ref: forwardedRef }) }) }) });
  }
);
var MenuRootContentModal = React$2.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const ref = React$2.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    React$2.useEffect(() => {
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
var MenuRootContentNonModal = React$2.forwardRef((props, forwardedRef) => {
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
var MenuContentImpl = React$2.forwardRef(
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
    const [currentItemId, setCurrentItemId] = React$2.useState(null);
    const contentRef = React$2.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, contentRef, context.onContentChange);
    const timerRef = React$2.useRef(0);
    const searchRef = React$2.useRef("");
    const pointerGraceTimerRef = React$2.useRef(0);
    const pointerGraceIntentRef = React$2.useRef(null);
    const pointerDirRef = React$2.useRef("right");
    const lastPointerXRef = React$2.useRef(0);
    const ScrollLockWrapper = disableOutsideScroll ? ReactRemoveScroll : React$2.Fragment;
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
    React$2.useEffect(() => {
      return () => window.clearTimeout(timerRef.current);
    }, []);
    useFocusGuards();
    const isPointerMovingToSubmenu = React$2.useCallback((event) => {
      const isMovingTowards = pointerDirRef.current === pointerGraceIntentRef.current?.side;
      return isMovingTowards && isPointerInGraceArea(event, pointerGraceIntentRef.current?.area);
    }, []);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenuContentProvider,
      {
        scope: __scopeMenu,
        searchRef,
        onItemEnter: React$2.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        onItemLeave: React$2.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) return;
            contentRef.current?.focus();
            setCurrentItemId(null);
          },
          [isPointerMovingToSubmenu]
        ),
        onTriggerLeave: React$2.useCallback(
          (event) => {
            if (isPointerMovingToSubmenu(event)) event.preventDefault();
          },
          [isPointerMovingToSubmenu]
        ),
        pointerGraceTimerRef,
        onPointerGraceIntentChange: React$2.useCallback((intent) => {
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
var MenuGroup = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...groupProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { role: "group", ...groupProps, ref: forwardedRef });
  }
);
MenuGroup.displayName = GROUP_NAME$1;
var LABEL_NAME$1 = "MenuLabel";
var MenuLabel = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, ...labelProps } = props;
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Primitive.div, { ...labelProps, ref: forwardedRef });
  }
);
MenuLabel.displayName = LABEL_NAME$1;
var ITEM_NAME$1 = "MenuItem";
var ITEM_SELECT = "menu.itemSelect";
var MenuItem = React$2.forwardRef(
  (props, forwardedRef) => {
    const { disabled = false, onSelect, ...itemProps } = props;
    const ref = React$2.useRef(null);
    const rootContext = useMenuRootContext(ITEM_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(ITEM_NAME$1, props.__scopeMenu);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const isPointerDownRef = React$2.useRef(false);
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
var MenuItemImpl = React$2.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenu, disabled = false, textValue, ...itemProps } = props;
    const contentContext = useMenuContentContext(ITEM_NAME$1, __scopeMenu);
    const rovingFocusGroupScope = useRovingFocusGroupScope$1(__scopeMenu);
    const ref = React$2.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref);
    const [isFocused, setIsFocused] = React$2.useState(false);
    const [textContent, setTextContent] = React$2.useState("");
    React$2.useEffect(() => {
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
var MenuCheckboxItem = React$2.forwardRef(
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
var MenuRadioGroup = React$2.forwardRef(
  (props, forwardedRef) => {
    const { value, onValueChange, ...groupProps } = props;
    const handleValueChange = useCallbackRef(onValueChange);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroupProvider, { scope: props.__scopeMenu, value, onValueChange: handleValueChange, children: /* @__PURE__ */ jsxRuntimeExports.jsx(MenuGroup, { ...groupProps, ref: forwardedRef }) });
  }
);
MenuRadioGroup.displayName = RADIO_GROUP_NAME$1;
var RADIO_ITEM_NAME$1 = "MenuRadioItem";
var MenuRadioItem = React$2.forwardRef(
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
var MenuItemIndicator = React$2.forwardRef(
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
var MenuSeparator = React$2.forwardRef(
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
var MenuArrow = React$2.forwardRef(
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
var MenuSubTrigger = React$2.forwardRef(
  (props, forwardedRef) => {
    const context = useMenuContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const contentContext = useMenuContentContext(SUB_TRIGGER_NAME$1, props.__scopeMenu);
    const openTimerRef = React$2.useRef(null);
    const { pointerGraceTimerRef, onPointerGraceIntentChange } = contentContext;
    const scope = { __scopeMenu: props.__scopeMenu };
    const clearOpenTimer = React$2.useCallback(() => {
      if (openTimerRef.current) window.clearTimeout(openTimerRef.current);
      openTimerRef.current = null;
    }, []);
    React$2.useEffect(() => clearOpenTimer, [clearOpenTimer]);
    React$2.useEffect(() => {
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
var MenuSubContent = React$2.forwardRef(
  (props, forwardedRef) => {
    const portalContext = usePortalContext(CONTENT_NAME$1, props.__scopeMenu);
    const { forceMount = portalContext.forceMount, ...subContentProps } = props;
    const context = useMenuContext(CONTENT_NAME$1, props.__scopeMenu);
    const rootContext = useMenuRootContext(CONTENT_NAME$1, props.__scopeMenu);
    const subContext = useMenuSubContext(SUB_CONTENT_NAME$1, props.__scopeMenu);
    const ref = React$2.useRef(null);
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
const React$1 = await importShared('react');
var MENUBAR_NAME = "Menubar";
var [Collection, useCollection, createCollectionScope] = createCollection(MENUBAR_NAME);
var [createMenubarContext, createMenubarScope] = createContextScope(MENUBAR_NAME, [
  createCollectionScope,
  createRovingFocusGroupScope
]);
var useMenuScope = createMenuScope();
var useRovingFocusGroupScope = createRovingFocusGroupScope();
var [MenubarContextProvider, useMenubarContext] = createMenubarContext(MENUBAR_NAME);
var Menubar$1 = React$1.forwardRef(
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
    const [currentTabStopId, setCurrentTabStopId] = React$1.useState(null);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(
      MenubarContextProvider,
      {
        scope: __scopeMenubar,
        value,
        onMenuOpen: React$1.useCallback(
          (value2) => {
            setValue(value2);
            setCurrentTabStopId(value2);
          },
          [setValue]
        ),
        onMenuClose: React$1.useCallback(() => setValue(""), [setValue]),
        onMenuToggle: React$1.useCallback(
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
  const triggerRef = React$1.useRef(null);
  const wasKeyboardTriggerOpenRef = React$1.useRef(false);
  const open = context.value === value;
  React$1.useEffect(() => {
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
var MenubarTrigger$1 = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, disabled = false, ...triggerProps } = props;
    const rovingFocusGroupScope = useRovingFocusGroupScope(__scopeMenubar);
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(TRIGGER_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(TRIGGER_NAME, __scopeMenubar);
    const ref = React$1.useRef(null);
    const composedRefs = useComposedRefs(forwardedRef, ref, menuContext.triggerRef);
    const [isFocused, setIsFocused] = React$1.useState(false);
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
var MenubarContent$1 = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, align = "start", ...contentProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    const context = useMenubarContext(CONTENT_NAME, __scopeMenubar);
    const menuContext = useMenubarMenuContext(CONTENT_NAME, __scopeMenubar);
    const getItems = useCollection(__scopeMenubar);
    const hasInteractedOutsideRef = React$1.useRef(false);
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
var MenubarGroup = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...groupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Group, { ...menuScope, ...groupProps, ref: forwardedRef });
  }
);
MenubarGroup.displayName = GROUP_NAME;
var LABEL_NAME = "MenubarLabel";
var MenubarLabel = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...labelProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Label, { ...menuScope, ...labelProps, ref: forwardedRef });
  }
);
MenubarLabel.displayName = LABEL_NAME;
var ITEM_NAME = "MenubarItem";
var MenubarItem$1 = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...itemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Item2, { ...menuScope, ...itemProps, ref: forwardedRef });
  }
);
MenubarItem$1.displayName = ITEM_NAME;
var CHECKBOX_ITEM_NAME = "MenubarCheckboxItem";
var MenubarCheckboxItem = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...checkboxItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(CheckboxItem, { ...menuScope, ...checkboxItemProps, ref: forwardedRef });
  }
);
MenubarCheckboxItem.displayName = CHECKBOX_ITEM_NAME;
var RADIO_GROUP_NAME = "MenubarRadioGroup";
var MenubarRadioGroup = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioGroupProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioGroup, { ...menuScope, ...radioGroupProps, ref: forwardedRef });
  }
);
MenubarRadioGroup.displayName = RADIO_GROUP_NAME;
var RADIO_ITEM_NAME = "MenubarRadioItem";
var MenubarRadioItem = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...radioItemProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(RadioItem, { ...menuScope, ...radioItemProps, ref: forwardedRef });
  }
);
MenubarRadioItem.displayName = RADIO_ITEM_NAME;
var INDICATOR_NAME = "MenubarItemIndicator";
var MenubarItemIndicator = React$1.forwardRef((props, forwardedRef) => {
  const { __scopeMenubar, ...itemIndicatorProps } = props;
  const menuScope = useMenuScope(__scopeMenubar);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(ItemIndicator, { ...menuScope, ...itemIndicatorProps, ref: forwardedRef });
});
MenubarItemIndicator.displayName = INDICATOR_NAME;
var SEPARATOR_NAME = "MenubarSeparator";
var MenubarSeparator = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...separatorProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Separator, { ...menuScope, ...separatorProps, ref: forwardedRef });
  }
);
MenubarSeparator.displayName = SEPARATOR_NAME;
var ARROW_NAME = "MenubarArrow";
var MenubarArrow = React$1.forwardRef(
  (props, forwardedRef) => {
    const { __scopeMenubar, ...arrowProps } = props;
    const menuScope = useMenuScope(__scopeMenubar);
    return /* @__PURE__ */ jsxRuntimeExports.jsx(Arrow2, { ...menuScope, ...arrowProps, ref: forwardedRef });
  }
);
MenubarArrow.displayName = ARROW_NAME;
var SUB_TRIGGER_NAME = "MenubarSubTrigger";
var MenubarSubTrigger = React$1.forwardRef(
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
var MenubarSubContent = React$1.forwardRef(
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

const React = await importShared('react');
const {useState,useEffect} = React;
const navItems = [
  {
    label: "Sports",
    items: [
      { label: "Football", href: "/sports/football" },
      { label: "Basketball", href: "/sports/basketball" },
      { label: "Tennis", href: "/sports/tennis" },
      { label: "Cricket", href: "/sports/cricket" },
      { label: "All Sports", href: "/sports/all" }
    ]
  },
  {
    label: "Live",
    items: [
      { label: "In-Play", href: "/live/in-play" },
      { label: "Live Streaming", href: "/live/streaming" },
      { label: "Live Scores", href: "/live/scores" }
    ]
  },
  {
    label: "Casino",
    items: [
      { label: "Slots", href: "/casino/slots" },
      { label: "Live Casino", href: "/casino/live" },
      { label: "Table Games", href: "/casino/table-games" },
      { label: "Jackpots", href: "/casino/jackpots" }
    ]
  },
  {
    label: "Promotions",
    items: [
      { label: "Welcome Bonus", href: "/promotions/welcome" },
      { label: "Free Bets", href: "/promotions/free-bets" },
      { label: "Reload Bonus", href: "/promotions/reload" },
      { label: "VIP Program", href: "/promotions/vip" }
    ]
  },
  {
    label: "Virtual Sports",
    items: [
      { label: "Virtual Football", href: "/virtual/football" },
      { label: "Virtual Horse Racing", href: "/virtual/horse-racing" },
      { label: "Virtual Tennis", href: "/virtual/tennis" }
    ]
  },
  {
    label: "Esports",
    items: [
      { label: "CS:GO", href: "/esports/csgo" },
      { label: "Dota 2", href: "/esports/dota2" },
      { label: "League of Legends", href: "/esports/lol" },
      { label: "Valorant", href: "/esports/valorant" }
    ]
  }
];
const MainNavbar = () => {
  const navigate = useNavigate();
  const [currentTime, setCurrentTime] = useState((/* @__PURE__ */ new Date()).toLocaleTimeString());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime((/* @__PURE__ */ new Date()).toLocaleTimeString());
    }, 1e3);
    return () => clearInterval(timer);
  }, []);
  return /* @__PURE__ */ jsxRuntimeExports.jsx(jsxRuntimeExports.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "bg-[#AF0000] text-white h-28 relative w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full mx-auto px-4 py-2", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center justify-between h-full w-full", children: [
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx(
          buildExports.LazyLoadImage,
          {
            src: "https://myxxexchbucket.s3.ap-south-1.amazonaws.com/Logo/betxasia.co/betxasia.co-light.jpeg",
            alt: "Logo",
            className: "rounded-full w-20 h-12 bg-yellow-500 p-1"
          }
        ),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-black md:text-white text-xl font-bold cursor-pointer  hover:text-yellow-500", children: "Sportsboo" })
      ] }),
      /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-4", children: [
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-yellow-500 text-black font-bold h-10 py-2 px-6 rounded-md text-sm", children: "DEPOSIT" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("p", { className: "text-white text-sm underline hover:no-underline", children: "SIGN IN" }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("button", { className: "bg-yellow-500 text-black font-bold h-10 py-2 px-6 rounded-md text-sm", children: "REGISTER" }),
        /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center space-x-1 cursor-pointer", children: [
          /* @__PURE__ */ jsxRuntimeExports.jsx("span", { className: "text-sm", children: "ENG" }),
          /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
        ] }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-700 text-white text-sm py-1 px-3 rounded-md", children: currentTime }),
        /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-red-700 p-2 rounded-md cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsx(EllipsisVertical, { className: "h-5 w-5 text-white" }) })
      ] })
    ] }) }),
    /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "bg-[#505050] h-10 w-[95%] rounded-t-sm mt-2 mx-auto absolute bottom-0 left-1/2 transform -translate-x-1/2", children: /* @__PURE__ */ jsxRuntimeExports.jsx("div", { className: "w-full h-full ", children: /* @__PURE__ */ jsxRuntimeExports.jsx(Menubar, { className: "bg-transparent flex justify-start gap-5 border-none text-white h-full", children: navItems.map((item) => /* @__PURE__ */ jsxRuntimeExports.jsxs(MenubarMenu, { children: [
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenubarTrigger, { className: "h-full rounded-none text-white hover:bg-gray-900 data-[state=open]:bg-gray-900 data-[state=open]:text-white data-[state=open]:border-t-2 data-[state=open]:border-t-amber-400 cursor-pointer", children: /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "flex items-center gap-1 ", children: [
        item.label,
        /* @__PURE__ */ jsxRuntimeExports.jsx(ChevronDown, { className: "h-4 w-4" })
      ] }) }),
      /* @__PURE__ */ jsxRuntimeExports.jsx(MenubarContent, { className: "min-w-[200px] hover:text-white bg-gray-900 border-gray-700 rounded-sm", children: item.items.map((subItem) => /* @__PURE__ */ jsxRuntimeExports.jsx(React.Fragment, { children: /* @__PURE__ */ jsxRuntimeExports.jsx(
        MenubarItem,
        {
          className: "text-white rounded-sm bg-[#424242] my-2 hover:bg-gray-700 hover:border-l-amber-400 hover:border-l-2 cursor-pointer",
          onClick: () => navigate(subItem.href),
          children: subItem.label
        }
      ) }, subItem.href)) })
    ] }, item.label)) }) }) })
  ] }) });
};

await importShared('react');
const Layout = () => {
  return /* @__PURE__ */ jsxRuntimeExports.jsxs("div", { className: "w-full", children: [
    /* @__PURE__ */ jsxRuntimeExports.jsx(MainNavbar, {}),
    /* @__PURE__ */ jsxRuntimeExports.jsx(Outlet, {})
  ] });
};

export { Layout as default };
