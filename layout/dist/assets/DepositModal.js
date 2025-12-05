import { r as reactExports } from './index2.js';
import { importShared } from './__federation_fn_import.js';
import { e as createLucideIcon, f as createContextScope, u as useComposedRefs, j as jsxRuntimeExports, g as createSlot, R as Root, C as Content, h as cn, i as Close, X, P as Portal, O as Overlay, k as getLocalStorageItem, E as Eye, B as Button, A as ArrowRight, U as User, I as Input } from './__federation_expose_LayoutApp.js';

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

var build = {exports: {}};

(()=>{var e={296:(e,t,r)=>{var o=/^\s+|\s+$/g,n=/^[-+]0x[0-9a-f]+$/i,i=/^0b[01]+$/i,c=/^0o[0-7]+$/i,u=parseInt,s="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g,l="object"==typeof self&&self&&self.Object===Object&&self,a=s||l||Function("return this")(),f=Object.prototype.toString,p=Math.max,y=Math.min,b=function(){return a.Date.now()};function d(e){var t=typeof e;return !!e&&("object"==t||"function"==t)}function h(e){if("number"==typeof e)return e;if(function(e){return "symbol"==typeof e||function(e){return !!e&&"object"==typeof e}(e)&&"[object Symbol]"==f.call(e)}(e))return NaN;if(d(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=d(t)?t+"":t;}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(o,"");var r=i.test(e);return r||c.test(e)?u(e.slice(2),r?2:8):n.test(e)?NaN:+e}e.exports=function(e,t,r){var o,n,i,c,u,s,l=0,a=false,f=false,v=true;if("function"!=typeof e)throw new TypeError("Expected a function");function m(t){var r=o,i=n;return o=n=void 0,l=t,c=e.apply(i,r)}function O(e){var r=e-s;return void 0===s||r>=t||r<0||f&&e-l>=i}function w(){var e=b();if(O(e))return g(e);u=setTimeout(w,function(e){var r=t-(e-s);return f?y(r,i-(e-l)):r}(e));}function g(e){return u=void 0,v&&o?m(e):(o=n=void 0,c)}function P(){var e=b(),r=O(e);if(o=arguments,n=this,s=e,r){if(void 0===u)return function(e){return l=e,u=setTimeout(w,t),a?m(e):c}(s);if(f)return u=setTimeout(w,t),m(s)}return void 0===u&&(u=setTimeout(w,t)),c}return t=h(t)||0,d(r)&&(a=!!r.leading,i=(f="maxWait"in r)?p(h(r.maxWait)||0,t):i,v="trailing"in r?!!r.trailing:v),P.cancel=function(){ void 0!==u&&clearTimeout(u),l=0,o=s=n=u=void 0;},P.flush=function(){return void 0===u?c:g(b())},P};},96:(e,t,r)=>{var o="Expected a function",n=NaN,i="[object Symbol]",c=/^\s+|\s+$/g,u=/^[-+]0x[0-9a-f]+$/i,s=/^0b[01]+$/i,l=/^0o[0-7]+$/i,a=parseInt,f="object"==typeof r.g&&r.g&&r.g.Object===Object&&r.g,p="object"==typeof self&&self&&self.Object===Object&&self,y=f||p||Function("return this")(),b=Object.prototype.toString,d=Math.max,h=Math.min,v=function(){return y.Date.now()};function m(e){var t=typeof e;return !!e&&("object"==t||"function"==t)}function O(e){if("number"==typeof e)return e;if(function(e){return "symbol"==typeof e||function(e){return !!e&&"object"==typeof e}(e)&&b.call(e)==i}(e))return n;if(m(e)){var t="function"==typeof e.valueOf?e.valueOf():e;e=m(t)?t+"":t;}if("string"!=typeof e)return 0===e?e:+e;e=e.replace(c,"");var r=s.test(e);return r||l.test(e)?a(e.slice(2),r?2:8):u.test(e)?n:+e}e.exports=function(e,t,r){var n=true,i=true;if("function"!=typeof e)throw new TypeError(o);return m(r)&&(n="leading"in r?!!r.leading:n,i="trailing"in r?!!r.trailing:i),function(e,t,r){var n,i,c,u,s,l,a=0,f=false,p=false,y=true;if("function"!=typeof e)throw new TypeError(o);function b(t){var r=n,o=i;return n=i=void 0,a=t,u=e.apply(o,r)}function w(e){var r=e-l;return void 0===l||r>=t||r<0||p&&e-a>=c}function g(){var e=v();if(w(e))return P(e);s=setTimeout(g,function(e){var r=t-(e-l);return p?h(r,c-(e-a)):r}(e));}function P(e){return s=void 0,y&&n?b(e):(n=i=void 0,u)}function j(){var e=v(),r=w(e);if(n=arguments,i=this,l=e,r){if(void 0===s)return function(e){return a=e,s=setTimeout(g,t),f?b(e):u}(l);if(p)return s=setTimeout(g,t),b(l)}return void 0===s&&(s=setTimeout(g,t)),u}return t=O(t)||0,m(r)&&(f=!!r.leading,c=(p="maxWait"in r)?d(O(r.maxWait)||0,t):c,y="trailing"in r?!!r.trailing:y),j.cancel=function(){ void 0!==s&&clearTimeout(s),a=0,n=l=i=s=void 0;},j.flush=function(){return void 0===s?u:P(v())},j}(e,t,{leading:n,maxWait:t,trailing:i})};},703:(e,t,r)=>{var o=r(414);function n(){}function i(){}i.resetWarningCache=n,e.exports=function(){function e(e,t,r,n,i,c){if(c!==o){var u=new Error("Calling PropTypes validators directly is not supported by the `prop-types` package. Use PropTypes.checkPropTypes() to call them. Read more at http://fb.me/use-check-prop-types");throw u.name="Invariant Violation",u}}function t(){return e}e.isRequired=e;var r={array:e,bigint:e,bool:e,func:e,number:e,object:e,string:e,symbol:e,any:e,arrayOf:t,element:e,elementType:e,instanceOf:t,node:e,objectOf:t,oneOf:t,oneOfType:t,shape:t,exact:t,checkPropTypes:i,resetWarningCache:n};return r.PropTypes=r,r};},697:(e,t,r)=>{e.exports=r(703)();},414:e=>{e.exports="SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED";}},t={};function r(o){var n=t[o];if(void 0!==n)return n.exports;var i=t[o]={exports:{}};return e[o](i,i.exports,r),i.exports}r.n=e=>{var t=e&&e.__esModule?()=>e.default:()=>e;return r.d(t,{a:t}),t},r.d=(e,t)=>{for(var o in t)r.o(t,o)&&!r.o(e,o)&&Object.defineProperty(e,o,{enumerable:true,get:t[o]});},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:true});};var o={};(()=>{r.r(o),r.d(o,{LazyLoadComponent:()=>Y,LazyLoadImage:()=>ne,trackWindowScroll:()=>D});const e=reactExports;var t=r.n(e),n=r(697);function i(){return "undefined"!=typeof window&&"IntersectionObserver"in window&&"isIntersecting"in window.IntersectionObserverEntry.prototype}function c(e){return c="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},c(e)}function u(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o);}return r}function s(e,t,r){return (t=a(t))in e?Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true}):e[t]=r,e}function l(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false,o.configurable=true,"value"in o&&(o.writable=true),Object.defineProperty(e,a(o.key),o);}}function a(e){var t=function(e,t){if("object"!==c(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==c(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return "symbol"===c(t)?t:String(t)}function f(e,t){return f=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},f(e,t)}function p(e){return p=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},p(e)}var y=function(e){e.forEach((function(e){e.isIntersecting&&e.target.onVisible();}));},b={},d=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),Object.defineProperty(e,"prototype",{writable:false}),t&&f(e,t);}(h,e);var r,o,n,a,d=(n=h,a=function(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return  false}}(),function(){var e,t=p(n);if(a){var r=p(this).constructor;e=Reflect.construct(t,arguments,r);}else e=t.apply(this,arguments);return function(e,t){if(t&&("object"===c(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(this,e)});function h(e){var t;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,h),(t=d.call(this,e)).supportsObserver=!e.scrollPosition&&e.useIntersectionObserver&&i(),t.supportsObserver){var r=e.threshold;t.observer=function(e){return b[e]=b[e]||new IntersectionObserver(y,{rootMargin:e+"px"}),b[e]}(r);}return t}return r=h,o=[{key:"componentDidMount",value:function(){this.placeholder&&this.observer&&(this.placeholder.onVisible=this.props.onVisible,this.observer.observe(this.placeholder)),this.supportsObserver||this.updateVisibility();}},{key:"componentWillUnmount",value:function(){this.observer&&this.placeholder&&this.observer.unobserve(this.placeholder);}},{key:"componentDidUpdate",value:function(){this.supportsObserver||this.updateVisibility();}},{key:"getPlaceholderBoundingBox",value:function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:this.props.scrollPosition,t=this.placeholder.getBoundingClientRect(),r=this.placeholder.style,o=parseInt(r.getPropertyValue("margin-left"),10)||0,n=parseInt(r.getPropertyValue("margin-top"),10)||0;return {bottom:e.y+t.bottom+n,left:e.x+t.left+o,right:e.x+t.right+o,top:e.y+t.top+n}}},{key:"isPlaceholderInViewport",value:function(){if("undefined"==typeof window||!this.placeholder)return  false;var e=this.props,t=e.scrollPosition,r=e.threshold,o=this.getPlaceholderBoundingBox(t),n=t.y+window.innerHeight,i=t.x,c=t.x+window.innerWidth,u=t.y;return Boolean(u-r<=o.bottom&&n+r>=o.top&&i-r<=o.right&&c+r>=o.left)}},{key:"updateVisibility",value:function(){this.isPlaceholderInViewport()&&this.props.onVisible();}},{key:"render",value:function(){var e=this,r=this.props,o=r.className,n=r.height,i=r.placeholder,c=r.style,l=r.width;if(i&&"function"!=typeof i.type)return t().cloneElement(i,{ref:function(t){return e.placeholder=t}});var a=function(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?u(Object(r),true).forEach((function(t){s(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):u(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}({display:"inline-block"},c);return void 0!==l&&(a.width=l),void 0!==n&&(a.height=n),t().createElement("span",{className:o,ref:function(t){return e.placeholder=t},style:a},i)}}],o&&l(r.prototype,o),Object.defineProperty(r,"prototype",{writable:false}),h}(t().Component);d.propTypes={onVisible:n.PropTypes.func.isRequired,className:n.PropTypes.string,height:n.PropTypes.oneOfType([n.PropTypes.number,n.PropTypes.string]),placeholder:n.PropTypes.element,threshold:n.PropTypes.number,useIntersectionObserver:n.PropTypes.bool,scrollPosition:n.PropTypes.shape({x:n.PropTypes.number.isRequired,y:n.PropTypes.number.isRequired}),width:n.PropTypes.oneOfType([n.PropTypes.number,n.PropTypes.string])},d.defaultProps={className:"",placeholder:null,threshold:100,useIntersectionObserver:true};const h=d;var v=r(296),m=r.n(v),O=r(96),w=r.n(O),g=function(e){var t=getComputedStyle(e,null);return t.getPropertyValue("overflow")+t.getPropertyValue("overflow-y")+t.getPropertyValue("overflow-x")};const P=function(e){if(!(e instanceof HTMLElement))return window;for(var t=e;t&&t instanceof HTMLElement;){if(/(scroll|auto)/.test(g(t)))return t;t=t.parentNode;}return window};function j(e){return j="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},j(e)}var T=["delayMethod","delayTime"];function S(){return S=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);}return e},S.apply(this,arguments)}function E(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false,o.configurable=true,"value"in o&&(o.writable=true),Object.defineProperty(e,(n=function(e,t){if("object"!==j(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==j(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(o.key),"symbol"===j(n)?n:String(n)),o);}var n;}function L(e,t){return L=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},L(e,t)}function _(e,t){if(t&&("object"===j(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return I(e)}function I(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function x(e){return x=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},x(e)}var R=function(){return "undefined"==typeof window?0:window.scrollX||window.pageXOffset},k=function(){return "undefined"==typeof window?0:window.scrollY||window.pageYOffset};const D=function(e){var r=function(r){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),Object.defineProperty(e,"prototype",{writable:false}),t&&L(e,t);}(l,r);var o,n,c,u,s=(c=l,u=function(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return  false}}(),function(){var e,t=x(c);if(u){var r=x(this).constructor;e=Reflect.construct(t,arguments,r);}else e=t.apply(this,arguments);return _(this,e)});function l(e){var r;if(function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,l),(r=s.call(this,e)).useIntersectionObserver=e.useIntersectionObserver&&i(),r.useIntersectionObserver)return _(r);var o=r.onChangeScroll.bind(I(r));return "debounce"===e.delayMethod?r.delayedScroll=m()(o,e.delayTime):"throttle"===e.delayMethod&&(r.delayedScroll=w()(o,e.delayTime)),r.state={scrollPosition:{x:R(),y:k()}},r.baseComponentRef=t().createRef(),r}return o=l,(n=[{key:"componentDidMount",value:function(){this.addListeners();}},{key:"componentWillUnmount",value:function(){this.removeListeners();}},{key:"componentDidUpdate",value:function(){"undefined"==typeof window||this.useIntersectionObserver||P(this.baseComponentRef.current)!==this.scrollElement&&(this.removeListeners(),this.addListeners());}},{key:"addListeners",value:function(){"undefined"==typeof window||this.useIntersectionObserver||(this.scrollElement=P(this.baseComponentRef.current),this.scrollElement.addEventListener("scroll",this.delayedScroll,{passive:true}),window.addEventListener("resize",this.delayedScroll,{passive:true}),this.scrollElement!==window&&window.addEventListener("scroll",this.delayedScroll,{passive:true}));}},{key:"removeListeners",value:function(){"undefined"==typeof window||this.useIntersectionObserver||(this.scrollElement.removeEventListener("scroll",this.delayedScroll),window.removeEventListener("resize",this.delayedScroll),this.scrollElement!==window&&window.removeEventListener("scroll",this.delayedScroll));}},{key:"onChangeScroll",value:function(){this.useIntersectionObserver||this.setState({scrollPosition:{x:R(),y:k()}});}},{key:"render",value:function(){var r=this.props,o=(r.delayMethod,r.delayTime,function(e,t){if(null==e)return {};var r,o,n=function(e,t){if(null==e)return {};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r]);}return n}(r,T)),n=this.useIntersectionObserver?null:this.state.scrollPosition;return t().createElement(e,S({forwardRef:this.baseComponentRef,scrollPosition:n},o))}}])&&E(o.prototype,n),Object.defineProperty(o,"prototype",{writable:false}),l}(t().Component);return r.propTypes={delayMethod:n.PropTypes.oneOf(["debounce","throttle"]),delayTime:n.PropTypes.number,useIntersectionObserver:n.PropTypes.bool},r.defaultProps={delayMethod:"throttle",delayTime:300,useIntersectionObserver:true},r};function C(e){return C="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},C(e)}function B(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false,o.configurable=true,"value"in o&&(o.writable=true),Object.defineProperty(e,(n=function(e,t){if("object"!==C(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==C(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(o.key),"symbol"===C(n)?n:String(n)),o);}var n;}function M(e,t){return M=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},M(e,t)}function N(e){return N=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},N(e)}var V=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),Object.defineProperty(e,"prototype",{writable:false}),t&&M(e,t);}(u,e);var r,o,n,i,c=(n=u,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return  false}}(),function(){var e,t=N(n);if(i){var r=N(this).constructor;e=Reflect.construct(t,arguments,r);}else e=t.apply(this,arguments);return function(e,t){if(t&&("object"===C(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(this,e)});function u(e){return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),c.call(this,e)}return r=u,(o=[{key:"render",value:function(){return t().createElement(h,this.props)}}])&&B(r.prototype,o),Object.defineProperty(r,"prototype",{writable:false}),u}(t().Component);const W=D(V);function z(e){return z="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},z(e)}function $(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false,o.configurable=true,"value"in o&&(o.writable=true),Object.defineProperty(e,(n=function(e,t){if("object"!==z(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==z(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(o.key),"symbol"===z(n)?n:String(n)),o);}var n;}function U(e,t){return U=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},U(e,t)}function F(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}function q(e){return q=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},q(e)}var H=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),Object.defineProperty(e,"prototype",{writable:false}),t&&U(e,t);}(s,e);var r,o,n,c,u=(n=s,c=function(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return  false}}(),function(){var e,t=q(n);if(c){var r=q(this).constructor;e=Reflect.construct(t,arguments,r);}else e=t.apply(this,arguments);return function(e,t){if(t&&("object"===z(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return F(e)}(this,e)});function s(e){var t;!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,s),t=u.call(this,e);var r=e.afterLoad,o=e.beforeLoad,n=e.scrollPosition,i=e.visibleByDefault;return t.state={visible:i},i&&(o(),r()),t.onVisible=t.onVisible.bind(F(t)),t.isScrollTracked=Boolean(n&&Number.isFinite(n.x)&&n.x>=0&&Number.isFinite(n.y)&&n.y>=0),t}return r=s,(o=[{key:"componentDidUpdate",value:function(e,t){t.visible!==this.state.visible&&this.props.afterLoad();}},{key:"onVisible",value:function(){this.props.beforeLoad(),this.setState({visible:true});}},{key:"render",value:function(){if(this.state.visible)return this.props.children;var e=this.props,r=e.className,o=e.delayMethod,n=e.delayTime,c=e.height,u=e.placeholder,s=e.scrollPosition,l=e.style,a=e.threshold,f=e.useIntersectionObserver,p=e.width;return this.isScrollTracked||f&&i()?t().createElement(h,{className:r,height:c,onVisible:this.onVisible,placeholder:u,scrollPosition:s,style:l,threshold:a,useIntersectionObserver:f,width:p}):t().createElement(W,{className:r,delayMethod:o,delayTime:n,height:c,onVisible:this.onVisible,placeholder:u,style:l,threshold:a,width:p})}}])&&$(r.prototype,o),Object.defineProperty(r,"prototype",{writable:false}),s}(t().Component);H.propTypes={afterLoad:n.PropTypes.func,beforeLoad:n.PropTypes.func,useIntersectionObserver:n.PropTypes.bool,visibleByDefault:n.PropTypes.bool},H.defaultProps={afterLoad:function(){return {}},beforeLoad:function(){return {}},useIntersectionObserver:true,visibleByDefault:false};const Y=H;function X(e){return X="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},X(e)}var A=["afterLoad","beforeLoad","delayMethod","delayTime","effect","placeholder","placeholderSrc","scrollPosition","threshold","useIntersectionObserver","visibleByDefault","wrapperClassName","wrapperProps"];function G(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);t&&(o=o.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,o);}return r}function J(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?G(Object(r),true).forEach((function(t){K(e,t,r[t]);})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):G(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t));}));}return e}function K(e,t,r){return (t=ee(t))in e?Object.defineProperty(e,t,{value:r,enumerable:true,configurable:true,writable:true}):e[t]=r,e}function Q(){return Q=Object.assign?Object.assign.bind():function(e){for(var t=1;t<arguments.length;t++){var r=arguments[t];for(var o in r)Object.prototype.hasOwnProperty.call(r,o)&&(e[o]=r[o]);}return e},Q.apply(this,arguments)}function Z(e,t){for(var r=0;r<t.length;r++){var o=t[r];o.enumerable=o.enumerable||false,o.configurable=true,"value"in o&&(o.writable=true),Object.defineProperty(e,ee(o.key),o);}}function ee(e){var t=function(e,t){if("object"!==X(e)||null===e)return e;var r=e[Symbol.toPrimitive];if(void 0!==r){var o=r.call(e,"string");if("object"!==X(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return "symbol"===X(t)?t:String(t)}function te(e,t){return te=Object.setPrototypeOf?Object.setPrototypeOf.bind():function(e,t){return e.__proto__=t,e},te(e,t)}function re(e){return re=Object.setPrototypeOf?Object.getPrototypeOf.bind():function(e){return e.__proto__||Object.getPrototypeOf(e)},re(e)}var oe=function(e){!function(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Super expression must either be null or a function");e.prototype=Object.create(t&&t.prototype,{constructor:{value:e,writable:true,configurable:true}}),Object.defineProperty(e,"prototype",{writable:false}),t&&te(e,t);}(u,e);var r,o,n,i,c=(n=u,i=function(){if("undefined"==typeof Reflect||!Reflect.construct)return  false;if(Reflect.construct.sham)return  false;if("function"==typeof Proxy)return  true;try{return Boolean.prototype.valueOf.call(Reflect.construct(Boolean,[],(function(){}))),!0}catch(e){return  false}}(),function(){var e,t=re(n);if(i){var r=re(this).constructor;e=Reflect.construct(t,arguments,r);}else e=t.apply(this,arguments);return function(e,t){if(t&&("object"===X(t)||"function"==typeof t))return t;if(void 0!==t)throw new TypeError("Derived constructors may only return object or undefined");return function(e){if(void 0===e)throw new ReferenceError("this hasn't been initialised - super() hasn't been called");return e}(e)}(this,e)});function u(e){var t;return function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,u),(t=c.call(this,e)).state={loaded:false},t}return r=u,(o=[{key:"onImageLoad",value:function(){var e=this;return this.state.loaded?null:function(t){e.props.onLoad(t),e.props.afterLoad(),e.setState({loaded:true});}}},{key:"getImg",value:function(){var e=this.props,r=(e.afterLoad,e.beforeLoad,e.delayMethod,e.delayTime,e.effect,e.placeholder,e.placeholderSrc,e.scrollPosition,e.threshold,e.useIntersectionObserver,e.visibleByDefault,e.wrapperClassName,e.wrapperProps,function(e,t){if(null==e)return {};var r,o,n=function(e,t){if(null==e)return {};var r,o,n={},i=Object.keys(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||(n[r]=e[r]);return n}(e,t);if(Object.getOwnPropertySymbols){var i=Object.getOwnPropertySymbols(e);for(o=0;o<i.length;o++)r=i[o],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(n[r]=e[r]);}return n}(e,A));return t().createElement("img",Q({},r,{onLoad:this.onImageLoad()}))}},{key:"getLazyLoadImage",value:function(){var e=this.props,r=e.beforeLoad,o=e.className,n=e.delayMethod,i=e.delayTime,c=e.height,u=e.placeholder,s=e.scrollPosition,l=e.style,a=e.threshold,f=e.useIntersectionObserver,p=e.visibleByDefault,y=e.width;return t().createElement(Y,{beforeLoad:r,className:o,delayMethod:n,delayTime:i,height:c,placeholder:u,scrollPosition:s,style:l,threshold:a,useIntersectionObserver:f,visibleByDefault:p,width:y},this.getImg())}},{key:"getWrappedLazyLoadImage",value:function(e){var r=this.props,o=r.effect,n=r.height,i=r.placeholderSrc,c=r.width,u=r.wrapperClassName,s=r.wrapperProps,l=this.state.loaded,a=l?" lazy-load-image-loaded":"",f=l||!i?{}:{backgroundImage:"url(".concat(i,")"),backgroundSize:"100% 100%"};return t().createElement("span",Q({className:u+" lazy-load-image-background "+o+a,style:J(J({},f),{},{color:"transparent",display:"inline-block",height:n,width:c})},s),e)}},{key:"render",value:function(){var e=this.props,t=e.effect,r=e.placeholderSrc,o=e.visibleByDefault,n=e.wrapperClassName,i=e.wrapperProps,c=this.getLazyLoadImage();return (t||r)&&!o||n||i?this.getWrappedLazyLoadImage(c):c}}])&&Z(r.prototype,o),Object.defineProperty(r,"prototype",{writable:false}),u}(t().Component);oe.propTypes={onLoad:n.PropTypes.func,afterLoad:n.PropTypes.func,beforeLoad:n.PropTypes.func,delayMethod:n.PropTypes.string,delayTime:n.PropTypes.number,effect:n.PropTypes.string,placeholderSrc:n.PropTypes.string,threshold:n.PropTypes.number,useIntersectionObserver:n.PropTypes.bool,visibleByDefault:n.PropTypes.bool,wrapperClassName:n.PropTypes.string,wrapperProps:n.PropTypes.object},oe.defaultProps={onLoad:function(){},afterLoad:function(){return {}},beforeLoad:function(){return {}},delayMethod:"throttle",delayTime:300,effect:"",placeholderSrc:null,threshold:100,useIntersectionObserver:true,visibleByDefault:false,wrapperClassName:""};const ne=oe;})(),build.exports=o;})();

var buildExports = build.exports;

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

export { DepositModal as D, buildExports as b, createCollection as c, useDirection as u };
