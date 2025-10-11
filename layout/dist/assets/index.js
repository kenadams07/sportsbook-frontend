import { importShared } from './__federation_fn_import.js';
import LayoutApp, { k as getLocalStorageItem, $ as SIGNUP_FAILURE, a0 as SIGNUP_SUCCESS, a1 as SIGNUP, c as GET_USER_DATA_SUCCESS, a2 as UPDATE_USER_BALANCE_EXPOSURE_SUCCESS, a3 as UPDATE_USER_BALANCE_EXPOSURE, a as LOGOUT_SUCCESS, a4 as LOGIN_FAILURE, a5 as LOGIN_SUCCESS, a6 as LOGIN, a7 as VERIFY_EMAIL_FAILURE, a8 as VERIFY_EMAIL_SUCCESS, a9 as VERIFY_EMAIL, d as GET_USER_DATA_FAILURE, G as GET_USER_DATA, aa as UPDATE_USER_BALANCE_EXPOSURE_FAILURE, ab as notifyPromise, ac as api, ad as setLocalStorageItem, ae as signupSuccess, af as loginSuccess, ag as signupFailure, ah as loginFailure, ai as verifyEmailSuccess, aj as verifyEmailFailure, L as LOGOUT, ak as removeLocalStorageItem, al as updateUserBalanceExposureFailure, am as updateUserBalanceExposureSuccess, j as jsxRuntimeExports, an as Provider_default } from './__federation_expose_LayoutApp.js';
import { r as reactDomExports } from './index2.js';
import { a as logoutSuccess, b as logoutFailure, c as getUserDataSuccess, d as getUserDataFailure } from './getUserDataAction.js';

var client = {};

var m = reactDomExports;
{
  client.createRoot = m.createRoot;
  client.hydrateRoot = m.hydrateRoot;
}

var createSymbol = function createSymbol(name) {
  return "@@redux-saga/" + name;
};

var CANCEL$1 =
/*#__PURE__*/
createSymbol('CANCEL_PROMISE');
var CHANNEL_END_TYPE =
/*#__PURE__*/
createSymbol('CHANNEL_END');
var IO =
/*#__PURE__*/
createSymbol('IO');
var MATCH =
/*#__PURE__*/
createSymbol('MATCH');
var MULTICAST =
/*#__PURE__*/
createSymbol('MULTICAST');
var SAGA_ACTION =
/*#__PURE__*/
createSymbol('SAGA_ACTION');
var SELF_CANCELLATION =
/*#__PURE__*/
createSymbol('SELF_CANCELLATION');
var TASK =
/*#__PURE__*/
createSymbol('TASK');
var TASK_CANCEL =
/*#__PURE__*/
createSymbol('TASK_CANCEL');
var TERMINATE =
/*#__PURE__*/
createSymbol('TERMINATE');
var SAGA_LOCATION =
/*#__PURE__*/
createSymbol('LOCATION');

function _extends() {
  return _extends = Object.assign ? Object.assign.bind() : function (n) {
    for (var e = 1; e < arguments.length; e++) {
      var t = arguments[e];
      for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]);
    }
    return n;
  }, _extends.apply(null, arguments);
}

function _objectWithoutPropertiesLoose$1(r, e) {
  if (null == r) return {};
  var t = {};
  for (var n in r) if ({}.hasOwnProperty.call(r, n)) {
    if (-1 !== e.indexOf(n)) continue;
    t[n] = r[n];
  }
  return t;
}

var undef = function undef(v) {
  return v === null || v === undefined;
};
var notUndef = function notUndef(v) {
  return v !== null && v !== undefined;
};
var func = function func(f) {
  return typeof f === 'function';
};
var string$1 = function string(s) {
  return typeof s === 'string';
};
var array$1 = Array.isArray;
var promise = function promise(p) {
  return p && func(p.then);
};
var iterator = function iterator(it) {
  return it && func(it.next) && func(it.throw);
};
var pattern = function pattern(pat) {
  return pat && (string$1(pat) || symbol$1(pat) || func(pat) || array$1(pat) && pat.every(pattern));
};
var channel$1 = function channel(ch) {
  return ch && func(ch.take) && func(ch.close);
};
var stringableFunc = function stringableFunc(f) {
  return func(f) && f.hasOwnProperty('toString');
};
var symbol$1 = function symbol(sym) {
  return Boolean(sym) && typeof Symbol === 'function' && sym.constructor === Symbol && sym !== Symbol.prototype;
};
var multicast = function multicast(ch) {
  return channel$1(ch) && ch[MULTICAST];
};

var konst = function konst2(v) {
  return function() {
    return v;
  };
};
var kTrue = /* @__PURE__ */ konst(true);
var noop$1 = function noop2() {
};
var identity = function identity2(v) {
  return v;
};
var assignWithSymbols = function assignWithSymbols2(target, source) {
  _extends(target, source);
  if (Object.getOwnPropertySymbols) {
    Object.getOwnPropertySymbols(source).forEach(function(s) {
      target[s] = source[s];
    });
  }
};
var flatMap = function flatMap2(mapper, arr) {
  var _ref;
  return (_ref = []).concat.apply(_ref, arr.map(mapper));
};
function remove(array2, item) {
  var index = array2.indexOf(item);
  if (index >= 0) {
    array2.splice(index, 1);
  }
}
function once(fn) {
  var called = false;
  return function() {
    if (called) {
      return;
    }
    called = true;
    fn();
  };
}
var kThrow = function kThrow2(err) {
  throw err;
};
var kReturn = function kReturn2(value) {
  return {
    value,
    done: true
  };
};
function makeIterator(next, thro, name) {
  if (thro === void 0) {
    thro = kThrow;
  }
  if (name === void 0) {
    name = "iterator";
  }
  var iterator = {
    meta: {
      name
    },
    next,
    throw: thro,
    return: kReturn,
    isSagaIterator: true
  };
  if (typeof Symbol !== "undefined") {
    iterator[Symbol.iterator] = function() {
      return iterator;
    };
  }
  return iterator;
}
function logError(error, _ref2) {
  var sagaStack = _ref2.sagaStack;
  console.error(error);
  console.error(sagaStack);
}
var createEmptyArray = function createEmptyArray2(n) {
  return Array.apply(null, new Array(n));
};
var wrapSagaDispatch = function wrapSagaDispatch2(dispatch) {
  return function(action) {
    return dispatch(Object.defineProperty(action, SAGA_ACTION, {
      value: true
    }));
  };
};
var shouldTerminate = function shouldTerminate2(res) {
  return res === TERMINATE;
};
var shouldCancel = function shouldCancel2(res) {
  return res === TASK_CANCEL;
};
var shouldComplete = function shouldComplete2(res) {
  return shouldTerminate(res) || shouldCancel(res);
};
function createAllStyleChildCallbacks(shape, parentCallback) {
  var keys = Object.keys(shape);
  var totalCount = keys.length;
  var completedCount = 0;
  var completed;
  var results = array$1(shape) ? createEmptyArray(totalCount) : {};
  var childCallbacks = {};
  function checkEnd() {
    if (completedCount === totalCount) {
      completed = true;
      parentCallback(results);
    }
  }
  keys.forEach(function(key) {
    var chCbAtKey = function chCbAtKey2(res, isErr) {
      if (completed) {
        return;
      }
      if (isErr || shouldComplete(res)) {
        parentCallback.cancel();
        parentCallback(res, isErr);
      } else {
        results[key] = res;
        completedCount++;
        checkEnd();
      }
    };
    chCbAtKey.cancel = noop$1;
    childCallbacks[key] = chCbAtKey;
  });
  parentCallback.cancel = function() {
    if (!completed) {
      completed = true;
      keys.forEach(function(key) {
        return childCallbacks[key].cancel();
      });
    }
  };
  return childCallbacks;
}
function getMetaInfo(fn) {
  return {
    name: fn.name || "anonymous",
    location: getLocation(fn)
  };
}
function getLocation(instrumented) {
  return instrumented[SAGA_LOCATION];
}
function compose$1() {
  for (var _len = arguments.length, funcs = new Array(_len), _key = 0; _key < _len; _key++) {
    funcs[_key] = arguments[_key];
  }
  if (funcs.length === 0) {
    return function(arg) {
      return arg;
    };
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce(function(a, b) {
    return function() {
      return a(b.apply(void 0, arguments));
    };
  });
}
var BUFFER_OVERFLOW = "Channel's Buffer overflow!";
var ON_OVERFLOW_THROW = 1;
var ON_OVERFLOW_SLIDE = 3;
var ON_OVERFLOW_EXPAND = 4;
function ringBuffer(limit, overflowAction) {
  if (limit === void 0) {
    limit = 10;
  }
  var arr = new Array(limit);
  var length = 0;
  var pushIndex = 0;
  var popIndex = 0;
  var push = function push2(it) {
    arr[pushIndex] = it;
    pushIndex = (pushIndex + 1) % limit;
    length++;
  };
  var take2 = function take3() {
    if (length != 0) {
      var it = arr[popIndex];
      arr[popIndex] = null;
      length--;
      popIndex = (popIndex + 1) % limit;
      return it;
    }
  };
  var flush2 = function flush3() {
    var items = [];
    while (length) {
      items.push(take2());
    }
    return items;
  };
  return {
    isEmpty: function isEmpty() {
      return length == 0;
    },
    put: function put2(it) {
      if (length < limit) {
        push(it);
      } else {
        var doubledLimit;
        switch (overflowAction) {
          case ON_OVERFLOW_THROW:
            throw new Error(BUFFER_OVERFLOW);
          case ON_OVERFLOW_SLIDE:
            arr[pushIndex] = it;
            pushIndex = (pushIndex + 1) % limit;
            popIndex = pushIndex;
            break;
          case ON_OVERFLOW_EXPAND:
            doubledLimit = 2 * limit;
            arr = flush2();
            length = arr.length;
            pushIndex = arr.length;
            popIndex = 0;
            arr.length = doubledLimit;
            limit = doubledLimit;
            push(it);
            break;
        }
      }
    },
    take: take2,
    flush: flush2
  };
}
var expanding = function expanding2(initialSize) {
  return ringBuffer(initialSize, ON_OVERFLOW_EXPAND);
};
var TAKE = "TAKE";
var PUT = "PUT";
var ALL = "ALL";
var RACE = "RACE";
var CALL = "CALL";
var CPS = "CPS";
var FORK = "FORK";
var JOIN = "JOIN";
var CANCEL = "CANCEL";
var SELECT = "SELECT";
var ACTION_CHANNEL = "ACTION_CHANNEL";
var CANCELLED$1 = "CANCELLED";
var FLUSH$1 = "FLUSH";
var GET_CONTEXT = "GET_CONTEXT";
var SET_CONTEXT = "SET_CONTEXT";
var makeEffect = function makeEffect2(type, payload) {
  var _ref;
  return _ref = {}, _ref[IO] = true, _ref.combinator = false, _ref.type = type, _ref.payload = payload, _ref;
};
function take(patternOrChannel, multicastPattern) {
  if (patternOrChannel === void 0) {
    patternOrChannel = "*";
  }
  if (pattern(patternOrChannel)) {
    if (notUndef(multicastPattern)) {
      console.warn("take(pattern) takes one argument but two were provided. Consider passing an array for listening to several action types");
    }
    return makeEffect(TAKE, {
      pattern: patternOrChannel
    });
  }
  if (multicast(patternOrChannel) && notUndef(multicastPattern) && pattern(multicastPattern)) {
    return makeEffect(TAKE, {
      channel: patternOrChannel,
      pattern: multicastPattern
    });
  }
  if (channel$1(patternOrChannel)) {
    if (notUndef(multicastPattern)) {
      console.warn("take(channel) takes one argument but two were provided. Second argument is ignored.");
    }
    return makeEffect(TAKE, {
      channel: patternOrChannel
    });
  }
}
function put(channel$1$1, action) {
  if (undef(action)) {
    action = channel$1$1;
    channel$1$1 = void 0;
  }
  return makeEffect(PUT, {
    channel: channel$1$1,
    action
  });
}
function all(effects) {
  var eff = makeEffect(ALL, effects);
  eff.combinator = true;
  return eff;
}
function getFnCallDescriptor(fnDescriptor, args) {
  var context = null;
  var fn;
  if (func(fnDescriptor)) {
    fn = fnDescriptor;
  } else {
    if (array$1(fnDescriptor)) {
      context = fnDescriptor[0];
      fn = fnDescriptor[1];
    } else {
      context = fnDescriptor.context;
      fn = fnDescriptor.fn;
    }
    if (context && string$1(fn) && func(context[fn])) {
      fn = context[fn];
    }
  }
  return {
    context,
    fn,
    args
  };
}
function call(fnDescriptor) {
  for (var _len = arguments.length, args = new Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }
  return makeEffect(CALL, getFnCallDescriptor(fnDescriptor, args));
}
function fork(fnDescriptor) {
  for (var _len3 = arguments.length, args = new Array(_len3 > 1 ? _len3 - 1 : 0), _key3 = 1; _key3 < _len3; _key3++) {
    args[_key3 - 1] = arguments[_key3];
  }
  return makeEffect(FORK, getFnCallDescriptor(fnDescriptor, args));
}

function deferred() {
  var def = {};
  def.promise = new Promise(function (resolve, reject) {
    def.resolve = resolve;
    def.reject = reject;
  });
  return def;
}

var queue = [];
var semaphore = 0;
function exec(task) {
  try {
    suspend();
    task();
  } finally {
    release();
  }
}
function asap(task) {
  queue.push(task);
  if (!semaphore) {
    suspend();
    flush();
  }
}
function immediately(task) {
  try {
    suspend();
    return task();
  } finally {
    flush();
  }
}
function suspend() {
  semaphore++;
}
function release() {
  semaphore--;
}
function flush() {
  release();
  var task;
  while (!semaphore && (task = queue.shift()) !== void 0) {
    exec(task);
  }
}
var array = function array2(patterns) {
  return function(input) {
    return patterns.some(function(p) {
      return matcher(p)(input);
    });
  };
};
var predicate = function predicate2(_predicate) {
  return function(input) {
    return _predicate(input);
  };
};
var string = function string2(pattern) {
  return function(input) {
    return input.type === String(pattern);
  };
};
var symbol = function symbol2(pattern) {
  return function(input) {
    return input.type === pattern;
  };
};
var wildcard = function wildcard2() {
  return kTrue;
};
function matcher(pattern) {
  var matcherCreator = pattern === "*" ? wildcard : string$1(pattern) ? string : array$1(pattern) ? array : stringableFunc(pattern) ? string : func(pattern) ? predicate : symbol$1(pattern) ? symbol : null;
  if (matcherCreator === null) {
    throw new Error("invalid pattern: " + pattern);
  }
  return matcherCreator(pattern);
}
var END = {
  type: CHANNEL_END_TYPE
};
var isEnd = function isEnd2(a) {
  return a && a.type === CHANNEL_END_TYPE;
};
function channel(buffer$1) {
  if (buffer$1 === void 0) {
    buffer$1 = expanding();
  }
  var closed = false;
  var takers = [];
  function put(input) {
    if (closed) {
      return;
    }
    if (takers.length === 0) {
      return buffer$1.put(input);
    }
    var cb = takers.shift();
    cb(input);
  }
  function take(cb) {
    if (closed && buffer$1.isEmpty()) {
      cb(END);
    } else if (!buffer$1.isEmpty()) {
      cb(buffer$1.take());
    } else {
      takers.push(cb);
      cb.cancel = function() {
        remove(takers, cb);
      };
    }
  }
  function flush2(cb) {
    if (closed && buffer$1.isEmpty()) {
      cb(END);
      return;
    }
    cb(buffer$1.flush());
  }
  function close() {
    if (closed) {
      return;
    }
    closed = true;
    var arr = takers;
    takers = [];
    for (var i = 0, len = arr.length; i < len; i++) {
      var taker = arr[i];
      taker(END);
    }
  }
  return {
    take,
    put,
    flush: flush2,
    close
  };
}
function multicastChannel() {
  var _ref;
  var closed = false;
  var currentTakers = [];
  var nextTakers = currentTakers;
  var ensureCanMutateNextTakers = function ensureCanMutateNextTakers2() {
    if (nextTakers !== currentTakers) {
      return;
    }
    nextTakers = currentTakers.slice();
  };
  var close = function close2() {
    closed = true;
    var takers = currentTakers = nextTakers;
    nextTakers = [];
    takers.forEach(function(taker) {
      taker(END);
    });
  };
  return _ref = {}, _ref[MULTICAST] = true, _ref.put = function put(input) {
    if (closed) {
      return;
    }
    if (isEnd(input)) {
      close();
      return;
    }
    var takers = currentTakers = nextTakers;
    for (var i = 0, len = takers.length; i < len; i++) {
      var taker = takers[i];
      if (taker[MATCH](input)) {
        taker.cancel();
        taker(input);
      }
    }
  }, _ref.take = function take(cb, matcher2) {
    if (matcher2 === void 0) {
      matcher2 = wildcard;
    }
    if (closed) {
      cb(END);
      return;
    }
    cb[MATCH] = matcher2;
    ensureCanMutateNextTakers();
    nextTakers.push(cb);
    cb.cancel = once(function() {
      ensureCanMutateNextTakers();
      remove(nextTakers, cb);
    });
  }, _ref.close = close, _ref;
}
function stdChannel() {
  var chan = multicastChannel();
  var put = chan.put;
  chan.put = function(input) {
    if (input[SAGA_ACTION]) {
      put(input);
      return;
    }
    asap(function() {
      put(input);
    });
  };
  return chan;
}
var RUNNING = 0;
var CANCELLED = 1;
var ABORTED = 2;
var DONE = 3;
function resolvePromise(promise2, cb) {
  var cancelPromise = promise2[CANCEL$1];
  if (func(cancelPromise)) {
    cb.cancel = cancelPromise;
  }
  promise2.then(cb, function(error) {
    cb(error, true);
  });
}
var current = 0;
var nextSagaId = function() {
  return ++current;
};
var _effectRunnerMap;
function getIteratorMetaInfo(iterator2, fn) {
  if (iterator2.isSagaIterator) {
    return {
      name: iterator2.meta.name
    };
  }
  return getMetaInfo(fn);
}
function createTaskIterator(_ref) {
  var context = _ref.context, fn = _ref.fn, args = _ref.args;
  try {
    var result = fn.apply(context, args);
    if (iterator(result)) {
      return result;
    }
    var resolved = false;
    var next = function next2(arg) {
      if (!resolved) {
        resolved = true;
        return {
          value: result,
          done: !promise(result)
        };
      } else {
        return {
          value: arg,
          done: true
        };
      }
    };
    return makeIterator(next);
  } catch (err) {
    return makeIterator(function() {
      throw err;
    });
  }
}
function runPutEffect(env, _ref2, cb) {
  var channel2 = _ref2.channel, action = _ref2.action, resolve = _ref2.resolve;
  asap(function() {
    var result;
    try {
      result = (channel2 ? channel2.put : env.dispatch)(action);
    } catch (error) {
      cb(error, true);
      return;
    }
    if (resolve && promise(result)) {
      resolvePromise(result, cb);
    } else {
      cb(result);
    }
  });
}
function runTakeEffect(env, _ref3, cb) {
  var _ref3$channel = _ref3.channel, channel2 = _ref3$channel === void 0 ? env.channel : _ref3$channel, pattern = _ref3.pattern, maybe = _ref3.maybe;
  var takeCb = function takeCb2(input) {
    if (input instanceof Error) {
      cb(input, true);
      return;
    }
    if (isEnd(input) && !maybe) {
      cb(TERMINATE);
      return;
    }
    cb(input);
  };
  try {
    channel2.take(takeCb, notUndef(pattern) ? matcher(pattern) : null);
  } catch (err) {
    cb(err, true);
    return;
  }
  cb.cancel = takeCb.cancel;
}
function runCallEffect(env, _ref4, cb, _ref5) {
  var context = _ref4.context, fn = _ref4.fn, args = _ref4.args;
  var task = _ref5.task;
  try {
    var result = fn.apply(context, args);
    if (promise(result)) {
      resolvePromise(result, cb);
      return;
    }
    if (iterator(result)) {
      proc(
        env,
        result,
        task.context,
        current,
        getMetaInfo(fn),
        /* isRoot */
        false,
        cb
      );
      return;
    }
    cb(result);
  } catch (error) {
    cb(error, true);
  }
}
function runCPSEffect(env, _ref6, cb) {
  var context = _ref6.context, fn = _ref6.fn, args = _ref6.args;
  try {
    var cpsCb = function cpsCb2(err, res) {
      if (undef(err)) {
        cb(res);
      } else {
        cb(err, true);
      }
    };
    fn.apply(context, args.concat(cpsCb));
    if (cpsCb.cancel) {
      cb.cancel = cpsCb.cancel;
    }
  } catch (error) {
    cb(error, true);
  }
}
function runForkEffect(env, _ref7, cb, _ref8) {
  var context = _ref7.context, fn = _ref7.fn, args = _ref7.args, detached = _ref7.detached;
  var parent = _ref8.task;
  var taskIterator = createTaskIterator({
    context,
    fn,
    args
  });
  var meta = getIteratorMetaInfo(taskIterator, fn);
  immediately(function() {
    var child = proc(env, taskIterator, parent.context, current, meta, detached, void 0);
    if (detached) {
      cb(child);
    } else {
      if (child.isRunning()) {
        parent.queue.addTask(child);
        cb(child);
      } else if (child.isAborted()) {
        parent.queue.abort(child.error());
      } else {
        cb(child);
      }
    }
  });
}
function runJoinEffect(env, taskOrTasks, cb, _ref9) {
  var task = _ref9.task;
  var joinSingleTask = function joinSingleTask2(taskToJoin, cb2) {
    if (taskToJoin.isRunning()) {
      var joiner = {
        task,
        cb: cb2
      };
      cb2.cancel = function() {
        if (taskToJoin.isRunning()) remove(taskToJoin.joiners, joiner);
      };
      taskToJoin.joiners.push(joiner);
    } else {
      if (taskToJoin.isAborted()) {
        cb2(taskToJoin.error(), true);
      } else {
        cb2(taskToJoin.result());
      }
    }
  };
  if (array$1(taskOrTasks)) {
    if (taskOrTasks.length === 0) {
      cb([]);
      return;
    }
    var childCallbacks = createAllStyleChildCallbacks(taskOrTasks, cb);
    taskOrTasks.forEach(function(t, i) {
      joinSingleTask(t, childCallbacks[i]);
    });
  } else {
    joinSingleTask(taskOrTasks, cb);
  }
}
function cancelSingleTask(taskToCancel) {
  if (taskToCancel.isRunning()) {
    taskToCancel.cancel();
  }
}
function runCancelEffect(env, taskOrTasks, cb, _ref10) {
  var task = _ref10.task;
  if (taskOrTasks === SELF_CANCELLATION) {
    cancelSingleTask(task);
  } else if (array$1(taskOrTasks)) {
    taskOrTasks.forEach(cancelSingleTask);
  } else {
    cancelSingleTask(taskOrTasks);
  }
  cb();
}
function runAllEffect(env, effects, cb, _ref11) {
  var digestEffect = _ref11.digestEffect;
  var effectId = current;
  var keys = Object.keys(effects);
  if (keys.length === 0) {
    cb(array$1(effects) ? [] : {});
    return;
  }
  var childCallbacks = createAllStyleChildCallbacks(effects, cb);
  keys.forEach(function(key) {
    digestEffect(effects[key], effectId, childCallbacks[key], key);
  });
}
function runRaceEffect(env, effects, cb, _ref12) {
  var digestEffect = _ref12.digestEffect;
  var effectId = current;
  var keys = Object.keys(effects);
  var response = array$1(effects) ? createEmptyArray(keys.length) : {};
  var childCbs = {};
  var completed = false;
  keys.forEach(function(key) {
    var chCbAtKey = function chCbAtKey2(res, isErr) {
      if (completed) {
        return;
      }
      if (isErr || shouldComplete(res)) {
        cb.cancel();
        cb(res, isErr);
      } else {
        cb.cancel();
        completed = true;
        response[key] = res;
        cb(response);
      }
    };
    chCbAtKey.cancel = noop$1;
    childCbs[key] = chCbAtKey;
  });
  cb.cancel = function() {
    if (!completed) {
      completed = true;
      keys.forEach(function(key) {
        return childCbs[key].cancel();
      });
    }
  };
  keys.forEach(function(key) {
    if (completed) {
      return;
    }
    digestEffect(effects[key], effectId, childCbs[key], key);
  });
}
function runSelectEffect(env, _ref13, cb) {
  var selector = _ref13.selector, args = _ref13.args;
  try {
    var state = selector.apply(void 0, [env.getState()].concat(args));
    cb(state);
  } catch (error) {
    cb(error, true);
  }
}
function runChannelEffect(env, _ref14, cb) {
  var pattern = _ref14.pattern, buffer2 = _ref14.buffer;
  var chan = channel(buffer2);
  var match = matcher(pattern);
  var taker = function taker2(action) {
    if (!isEnd(action)) {
      env.channel.take(taker2, match);
    }
    chan.put(action);
  };
  var close = chan.close;
  chan.close = function() {
    taker.cancel();
    close();
  };
  env.channel.take(taker, match);
  cb(chan);
}
function runCancelledEffect(env, data, cb, _ref15) {
  var task = _ref15.task;
  cb(task.isCancelled());
}
function runFlushEffect(env, channel2, cb) {
  channel2.flush(cb);
}
function runGetContextEffect(env, prop, cb, _ref16) {
  var task = _ref16.task;
  cb(task.context[prop]);
}
function runSetContextEffect(env, props, cb, _ref17) {
  var task = _ref17.task;
  assignWithSymbols(task.context, props);
  cb();
}
var effectRunnerMap = (_effectRunnerMap = {}, _effectRunnerMap[TAKE] = runTakeEffect, _effectRunnerMap[PUT] = runPutEffect, _effectRunnerMap[ALL] = runAllEffect, _effectRunnerMap[RACE] = runRaceEffect, _effectRunnerMap[CALL] = runCallEffect, _effectRunnerMap[CPS] = runCPSEffect, _effectRunnerMap[FORK] = runForkEffect, _effectRunnerMap[JOIN] = runJoinEffect, _effectRunnerMap[CANCEL] = runCancelEffect, _effectRunnerMap[SELECT] = runSelectEffect, _effectRunnerMap[ACTION_CHANNEL] = runChannelEffect, _effectRunnerMap[CANCELLED$1] = runCancelledEffect, _effectRunnerMap[FLUSH$1] = runFlushEffect, _effectRunnerMap[GET_CONTEXT] = runGetContextEffect, _effectRunnerMap[SET_CONTEXT] = runSetContextEffect, _effectRunnerMap);
function forkQueue(mainTask, onAbort, cont) {
  var tasks = [];
  var result;
  var completed = false;
  addTask(mainTask);
  var getTasks = function getTasks2() {
    return tasks;
  };
  function abort(err) {
    onAbort();
    cancelAll();
    cont(err, true);
  }
  function addTask(task) {
    tasks.push(task);
    task.cont = function(res, isErr) {
      if (completed) {
        return;
      }
      remove(tasks, task);
      task.cont = noop$1;
      if (isErr) {
        abort(res);
      } else {
        if (task === mainTask) {
          result = res;
        }
        if (!tasks.length) {
          completed = true;
          cont(result);
        }
      }
    };
  }
  function cancelAll() {
    if (completed) {
      return;
    }
    completed = true;
    tasks.forEach(function(t) {
      t.cont = noop$1;
      t.cancel();
    });
    tasks = [];
  }
  return {
    addTask,
    cancelAll,
    abort,
    getTasks
  };
}
function formatLocation(fileName, lineNumber) {
  return fileName + "?" + lineNumber;
}
function effectLocationAsString(effect) {
  var location = getLocation(effect);
  if (location) {
    var code = location.code, fileName = location.fileName, lineNumber = location.lineNumber;
    var source = code + "  " + formatLocation(fileName, lineNumber);
    return source;
  }
  return "";
}
function sagaLocationAsString(sagaMeta) {
  var name = sagaMeta.name, location = sagaMeta.location;
  if (location) {
    return name + "  " + formatLocation(location.fileName, location.lineNumber);
  }
  return name;
}
function cancelledTasksAsString(sagaStack2) {
  var cancelledTasks = flatMap(function(i) {
    return i.cancelledTasks;
  }, sagaStack2);
  if (!cancelledTasks.length) {
    return "";
  }
  return ["Tasks cancelled due to error:"].concat(cancelledTasks).join("\n");
}
var crashedEffect = null;
var sagaStack = [];
var addSagaFrame = function addSagaFrame2(frame) {
  frame.crashedEffect = crashedEffect;
  sagaStack.push(frame);
};
var clear = function clear2() {
  crashedEffect = null;
  sagaStack.length = 0;
};
var setCrashedEffect = function setCrashedEffect2(effect) {
  crashedEffect = effect;
};
var toString = function toString2() {
  var firstSaga = sagaStack[0], otherSagas = sagaStack.slice(1);
  var crashedEffectLocation = firstSaga.crashedEffect ? effectLocationAsString(firstSaga.crashedEffect) : null;
  var errorMessage = "The above error occurred in task " + sagaLocationAsString(firstSaga.meta) + (crashedEffectLocation ? " \n when executing effect " + crashedEffectLocation : "");
  return [errorMessage].concat(otherSagas.map(function(s) {
    return "    created by " + sagaLocationAsString(s.meta);
  }), [cancelledTasksAsString(sagaStack)]).join("\n");
};
function newTask(env, mainTask, parentContext, parentEffectId, meta, isRoot, cont) {
  var _task;
  if (cont === void 0) {
    cont = noop$1;
  }
  var status = RUNNING;
  var taskResult;
  var taskError;
  var deferredEnd = null;
  var cancelledDueToErrorTasks = [];
  var context = Object.create(parentContext);
  var queue2 = forkQueue(mainTask, function onAbort() {
    cancelledDueToErrorTasks.push.apply(cancelledDueToErrorTasks, queue2.getTasks().map(function(t) {
      return t.meta.name;
    }));
  }, end);
  function cancel() {
    if (status === RUNNING) {
      status = CANCELLED;
      queue2.cancelAll();
      end(TASK_CANCEL, false);
    }
  }
  function end(result, isErr) {
    if (!isErr) {
      if (result === TASK_CANCEL) {
        status = CANCELLED;
      } else if (status !== CANCELLED) {
        status = DONE;
      }
      taskResult = result;
      deferredEnd && deferredEnd.resolve(result);
    } else {
      status = ABORTED;
      addSagaFrame({
        meta,
        cancelledTasks: cancelledDueToErrorTasks
      });
      if (task.isRoot) {
        var sagaStack2 = toString();
        clear();
        env.onError(result, {
          sagaStack: sagaStack2
        });
      }
      taskError = result;
      deferredEnd && deferredEnd.reject(result);
    }
    task.cont(result, isErr);
    task.joiners.forEach(function(joiner) {
      joiner.cb(result, isErr);
    });
    task.joiners = null;
  }
  function setContext(props) {
    assignWithSymbols(context, props);
  }
  function toPromise() {
    if (deferredEnd) {
      return deferredEnd.promise;
    }
    deferredEnd = deferred();
    if (status === ABORTED) {
      deferredEnd.reject(taskError);
    } else if (status !== RUNNING) {
      deferredEnd.resolve(taskResult);
    }
    return deferredEnd.promise;
  }
  var task = (_task = {}, _task[TASK] = true, _task.id = parentEffectId, _task.meta = meta, _task.isRoot = isRoot, _task.context = context, _task.joiners = [], _task.queue = queue2, _task.cancel = cancel, _task.cont = cont, _task.end = end, _task.setContext = setContext, _task.toPromise = toPromise, _task.isRunning = function isRunning() {
    return status === RUNNING;
  }, _task.isCancelled = function isCancelled() {
    return status === CANCELLED || status === RUNNING && mainTask.status === CANCELLED;
  }, _task.isAborted = function isAborted() {
    return status === ABORTED;
  }, _task.result = function result() {
    return taskResult;
  }, _task.error = function error() {
    return taskError;
  }, _task);
  return task;
}
function proc(env, iterator$1, parentContext, parentEffectId, meta, isRoot, cont) {
  var finalRunEffect = env.finalizeRunEffect(runEffect);
  next.cancel = noop$1;
  var mainTask = {
    meta,
    cancel: cancelMain,
    status: RUNNING
  };
  var task = newTask(env, mainTask, parentContext, parentEffectId, meta, isRoot, cont);
  var executingContext = {
    task,
    digestEffect
  };
  function cancelMain() {
    if (mainTask.status === RUNNING) {
      mainTask.status = CANCELLED;
      next(TASK_CANCEL);
    }
  }
  if (cont) {
    cont.cancel = task.cancel;
  }
  next();
  return task;
  function next(arg, isErr) {
    try {
      var result;
      if (isErr) {
        result = iterator$1.throw(arg);
        clear();
      } else if (shouldCancel(arg)) {
        mainTask.status = CANCELLED;
        next.cancel();
        result = func(iterator$1.return) ? iterator$1.return(TASK_CANCEL) : {
          done: true,
          value: TASK_CANCEL
        };
      } else if (shouldTerminate(arg)) {
        result = func(iterator$1.return) ? iterator$1.return() : {
          done: true
        };
      } else {
        result = iterator$1.next(arg);
      }
      if (!result.done) {
        digestEffect(result.value, parentEffectId, next);
      } else {
        if (mainTask.status !== CANCELLED) {
          mainTask.status = DONE;
        }
        mainTask.cont(result.value);
      }
    } catch (error) {
      if (mainTask.status === CANCELLED) {
        throw error;
      }
      mainTask.status = ABORTED;
      mainTask.cont(error, true);
    }
  }
  function runEffect(effect, effectId, currCb) {
    if (promise(effect)) {
      resolvePromise(effect, currCb);
    } else if (iterator(effect)) {
      proc(
        env,
        effect,
        task.context,
        effectId,
        meta,
        /* isRoot */
        false,
        currCb
      );
    } else if (effect && effect[IO]) {
      var effectRunner = effectRunnerMap[effect.type];
      effectRunner(env, effect.payload, currCb, executingContext);
    } else {
      currCb(effect);
    }
  }
  function digestEffect(effect, parentEffectId2, cb, label) {
    if (label === void 0) {
      label = "";
    }
    var effectId = nextSagaId();
    env.sagaMonitor && env.sagaMonitor.effectTriggered({
      effectId,
      parentEffectId: parentEffectId2,
      label,
      effect
    });
    var effectSettled;
    function currCb(res, isErr) {
      if (effectSettled) {
        return;
      }
      effectSettled = true;
      cb.cancel = noop$1;
      if (env.sagaMonitor) {
        if (isErr) {
          env.sagaMonitor.effectRejected(effectId, res);
        } else {
          env.sagaMonitor.effectResolved(effectId, res);
        }
      }
      if (isErr) {
        setCrashedEffect(effect);
      }
      cb(res, isErr);
    }
    currCb.cancel = noop$1;
    cb.cancel = function() {
      if (effectSettled) {
        return;
      }
      effectSettled = true;
      currCb.cancel();
      currCb.cancel = noop$1;
      env.sagaMonitor && env.sagaMonitor.effectCancelled(effectId);
    };
    finalRunEffect(effect, effectId, currCb);
  }
}
function runSaga(_ref, saga) {
  var _ref$channel = _ref.channel, channel2 = _ref$channel === void 0 ? stdChannel() : _ref$channel, dispatch = _ref.dispatch, getState = _ref.getState, _ref$context = _ref.context, context = _ref$context === void 0 ? {} : _ref$context, sagaMonitor = _ref.sagaMonitor, effectMiddlewares = _ref.effectMiddlewares, _ref$onError = _ref.onError, onError = _ref$onError === void 0 ? logError : _ref$onError;
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var iterator$1 = saga.apply(void 0, args);
  var effectId = nextSagaId();
  if (sagaMonitor) {
    sagaMonitor.rootSagaStarted = sagaMonitor.rootSagaStarted || noop$1;
    sagaMonitor.effectTriggered = sagaMonitor.effectTriggered || noop$1;
    sagaMonitor.effectResolved = sagaMonitor.effectResolved || noop$1;
    sagaMonitor.effectRejected = sagaMonitor.effectRejected || noop$1;
    sagaMonitor.effectCancelled = sagaMonitor.effectCancelled || noop$1;
    sagaMonitor.actionDispatched = sagaMonitor.actionDispatched || noop$1;
    sagaMonitor.rootSagaStarted({
      effectId,
      saga,
      args
    });
  }
  var finalizeRunEffect;
  if (effectMiddlewares) {
    var middleware = compose$1.apply(void 0, effectMiddlewares);
    finalizeRunEffect = function finalizeRunEffect2(runEffect) {
      return function(effect, effectId2, currCb) {
        var plainRunEffect = function plainRunEffect2(eff) {
          return runEffect(eff, effectId2, currCb);
        };
        return middleware(plainRunEffect)(effect);
      };
    };
  } else {
    finalizeRunEffect = identity;
  }
  var env = {
    channel: channel2,
    dispatch: wrapSagaDispatch(dispatch),
    getState,
    sagaMonitor,
    onError,
    finalizeRunEffect
  };
  return immediately(function() {
    var task = proc(
      env,
      iterator$1,
      context,
      effectId,
      getMetaInfo(saga),
      /* isRoot */
      true,
      void 0
    );
    if (sagaMonitor) {
      sagaMonitor.effectResolved(effectId, task);
    }
    return task;
  });
}
function sagaMiddlewareFactory(_temp) {
  var _ref = {} , _ref$context = _ref.context, context = _ref$context === void 0 ? {} : _ref$context, _ref$channel = _ref.channel, channel2 = _ref$channel === void 0 ? stdChannel() : _ref$channel, sagaMonitor = _ref.sagaMonitor, options = _objectWithoutPropertiesLoose$1(_ref, ["context", "channel", "sagaMonitor"]);
  var boundRunSaga;
  function sagaMiddleware(_ref2) {
    var getState = _ref2.getState, dispatch = _ref2.dispatch;
    boundRunSaga = runSaga.bind(null, _extends({}, options, {
      context,
      channel: channel2,
      dispatch,
      getState,
      sagaMonitor
    }));
    return function(next) {
      return function(action) {
        if (sagaMonitor && sagaMonitor.actionDispatched) {
          sagaMonitor.actionDispatched(action);
        }
        var result = next(action);
        channel2.put(action);
        return result;
      };
    };
  }
  sagaMiddleware.run = function() {
    return boundRunSaga.apply(void 0, arguments);
  };
  sagaMiddleware.setContext = function(props) {
    assignWithSymbols(context, props);
  };
  return sagaMiddleware;
}

function formatProdErrorMessage$1(code) {
  return `Minified Redux error #${code}; visit https://redux.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}
var $$observable = /* @__PURE__ */ (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
var symbol_observable_default = $$observable;
var randomString = () => Math.random().toString(36).substring(7).split("").join(".");
var ActionTypes = {
  INIT: `@@redux/INIT${/* @__PURE__ */ randomString()}`,
  REPLACE: `@@redux/REPLACE${/* @__PURE__ */ randomString()}`,
  PROBE_UNKNOWN_ACTION: () => `@@redux/PROBE_UNKNOWN_ACTION${randomString()}`
};
var actionTypes_default = ActionTypes;
function isPlainObject(obj) {
  if (typeof obj !== "object" || obj === null)
    return false;
  let proto = obj;
  while (Object.getPrototypeOf(proto) !== null) {
    proto = Object.getPrototypeOf(proto);
  }
  return Object.getPrototypeOf(obj) === proto || Object.getPrototypeOf(obj) === null;
}
function createStore(reducer, preloadedState, enhancer) {
  if (typeof reducer !== "function") {
    throw new Error(formatProdErrorMessage$1(2) );
  }
  if (typeof preloadedState === "function" && typeof enhancer === "function" || typeof enhancer === "function" && typeof arguments[3] === "function") {
    throw new Error(formatProdErrorMessage$1(0) );
  }
  if (typeof preloadedState === "function" && typeof enhancer === "undefined") {
    enhancer = preloadedState;
    preloadedState = void 0;
  }
  if (typeof enhancer !== "undefined") {
    if (typeof enhancer !== "function") {
      throw new Error(formatProdErrorMessage$1(1) );
    }
    return enhancer(createStore)(reducer, preloadedState);
  }
  let currentReducer = reducer;
  let currentState = preloadedState;
  let currentListeners = /* @__PURE__ */ new Map();
  let nextListeners = currentListeners;
  let listenerIdCounter = 0;
  let isDispatching = false;
  function ensureCanMutateNextListeners() {
    if (nextListeners === currentListeners) {
      nextListeners = /* @__PURE__ */ new Map();
      currentListeners.forEach((listener, key) => {
        nextListeners.set(key, listener);
      });
    }
  }
  function getState() {
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(3) );
    }
    return currentState;
  }
  function subscribe(listener) {
    if (typeof listener !== "function") {
      throw new Error(formatProdErrorMessage$1(4) );
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(5) );
    }
    let isSubscribed = true;
    ensureCanMutateNextListeners();
    const listenerId = listenerIdCounter++;
    nextListeners.set(listenerId, listener);
    return function unsubscribe() {
      if (!isSubscribed) {
        return;
      }
      if (isDispatching) {
        throw new Error(formatProdErrorMessage$1(6) );
      }
      isSubscribed = false;
      ensureCanMutateNextListeners();
      nextListeners.delete(listenerId);
      currentListeners = null;
    };
  }
  function dispatch(action) {
    if (!isPlainObject(action)) {
      throw new Error(formatProdErrorMessage$1(7) );
    }
    if (typeof action.type === "undefined") {
      throw new Error(formatProdErrorMessage$1(8) );
    }
    if (typeof action.type !== "string") {
      throw new Error(formatProdErrorMessage$1(17) );
    }
    if (isDispatching) {
      throw new Error(formatProdErrorMessage$1(9) );
    }
    try {
      isDispatching = true;
      currentState = currentReducer(currentState, action);
    } finally {
      isDispatching = false;
    }
    const listeners = currentListeners = nextListeners;
    listeners.forEach((listener) => {
      listener();
    });
    return action;
  }
  function replaceReducer(nextReducer) {
    if (typeof nextReducer !== "function") {
      throw new Error(formatProdErrorMessage$1(10) );
    }
    currentReducer = nextReducer;
    dispatch({
      type: actionTypes_default.REPLACE
    });
  }
  function observable() {
    const outerSubscribe = subscribe;
    return {
      /**
       * The minimal observable subscription method.
       * @param observer Any object that can be used as an observer.
       * The observer object should have a `next` method.
       * @returns An object with an `unsubscribe` method that can
       * be used to unsubscribe the observable from the store, and prevent further
       * emission of values from the observable.
       */
      subscribe(observer) {
        if (typeof observer !== "object" || observer === null) {
          throw new Error(formatProdErrorMessage$1(11) );
        }
        function observeState() {
          const observerAsObserver = observer;
          if (observerAsObserver.next) {
            observerAsObserver.next(getState());
          }
        }
        observeState();
        const unsubscribe = outerSubscribe(observeState);
        return {
          unsubscribe
        };
      },
      [symbol_observable_default]() {
        return this;
      }
    };
  }
  dispatch({
    type: actionTypes_default.INIT
  });
  const store = {
    dispatch,
    subscribe,
    getState,
    replaceReducer,
    [symbol_observable_default]: observable
  };
  return store;
}
function assertReducerShape(reducers) {
  Object.keys(reducers).forEach((key) => {
    const reducer = reducers[key];
    const initialState = reducer(void 0, {
      type: actionTypes_default.INIT
    });
    if (typeof initialState === "undefined") {
      throw new Error(formatProdErrorMessage$1(12) );
    }
    if (typeof reducer(void 0, {
      type: actionTypes_default.PROBE_UNKNOWN_ACTION()
    }) === "undefined") {
      throw new Error(formatProdErrorMessage$1(13) );
    }
  });
}
function combineReducers(reducers) {
  const reducerKeys = Object.keys(reducers);
  const finalReducers = {};
  for (let i = 0; i < reducerKeys.length; i++) {
    const key = reducerKeys[i];
    if (typeof reducers[key] === "function") {
      finalReducers[key] = reducers[key];
    }
  }
  const finalReducerKeys = Object.keys(finalReducers);
  let shapeAssertionError;
  try {
    assertReducerShape(finalReducers);
  } catch (e) {
    shapeAssertionError = e;
  }
  return function combination(state = {}, action) {
    if (shapeAssertionError) {
      throw shapeAssertionError;
    }
    let hasChanged = false;
    const nextState = {};
    for (let i = 0; i < finalReducerKeys.length; i++) {
      const key = finalReducerKeys[i];
      const reducer = finalReducers[key];
      const previousStateForKey = state[key];
      const nextStateForKey = reducer(previousStateForKey, action);
      if (typeof nextStateForKey === "undefined") {
        action && action.type;
        throw new Error(formatProdErrorMessage$1(14) );
      }
      nextState[key] = nextStateForKey;
      hasChanged = hasChanged || nextStateForKey !== previousStateForKey;
    }
    hasChanged = hasChanged || finalReducerKeys.length !== Object.keys(state).length;
    return hasChanged ? nextState : state;
  };
}
function compose(...funcs) {
  if (funcs.length === 0) {
    return (arg) => arg;
  }
  if (funcs.length === 1) {
    return funcs[0];
  }
  return funcs.reduce((a, b) => (...args) => a(b(...args)));
}
function applyMiddleware(...middlewares) {
  return (createStore2) => (reducer, preloadedState) => {
    const store = createStore2(reducer, preloadedState);
    let dispatch = () => {
      throw new Error(formatProdErrorMessage$1(15) );
    };
    const middlewareAPI = {
      getState: store.getState,
      dispatch: (action, ...args) => dispatch(action, ...args)
    };
    const chain = middlewares.map((middleware) => middleware(middlewareAPI));
    dispatch = compose(...chain)(store.dispatch);
    return {
      ...store,
      dispatch
    };
  };
}

const INIT_STATE$3 = {
  loading: false,
  userData: getLocalStorageItem("userData") || {},
};

const signupReducer = (state = INIT_STATE$3, action) => {
  switch (action.type) {
    case SIGNUP:
      return { ...state, loading: true, isAuthenticated: false };
    case SIGNUP_SUCCESS:
      return {
        ...state,
        userData: action?.payload,
        loading: false,
      };
    case SIGNUP_FAILURE:
      return { ...state, loading: false, isAuthenticated: false };
    default:
      return state;
  }
};

const INIT_STATE$2 = {
  loading: false,
  userData: getLocalStorageItem("userData") || {},
  isAuthenticated: !!getLocalStorageItem("token"),
};

const loginReducer = (state = INIT_STATE$2, action) => {
  switch (action.type) {
    case LOGIN:
      return { ...state, loading: true, isAuthenticated: false, error: null };
    case LOGIN_SUCCESS:
      return {
        ...state,
        userData: action.payload,
        loading: false,
        isAuthenticated: true,
        error: null
      };
    case LOGIN_FAILURE:
      return { 
        ...state, 
        loading: false, 
        isAuthenticated: false,
        error: action.error
      };
    case LOGOUT_SUCCESS:
      return { ...state, userData: {}, loading: false, isAuthenticated: false, error: null };
    case UPDATE_USER_BALANCE_EXPOSURE:
      return {
        ...state,
        loading: true,
      };
    case UPDATE_USER_BALANCE_EXPOSURE_SUCCESS:
      return {
        ...state,
        loading: false,
        userData: {
          ...state.userData,
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        },
      };
    case GET_USER_DATA_SUCCESS:
      // Update the userData in the login reducer when getUserData is successful
      // Replace the entire userData object to ensure consistency
      return {
        ...state,
        userData: action.payload,
      };

    default:
      return state;
  }
};

const initialState$1 = {
  loading: false,
  data: null,
  error: null,
  success: false,
};

const verifyEmailReducer = (state = initialState$1, action) => {
  switch (action.type) {
    case VERIFY_EMAIL:
      return {
        ...state,
        loading: true,
        error: null,
        success: false,
      };
    case VERIFY_EMAIL_SUCCESS:
      return {
        ...state,
        loading: false,
        data: action.payload,
        error: null,
        success: true,
      };
    case VERIFY_EMAIL_FAILURE:
      // Use the error message from the action payload if available
      const errorMessage = action.payload?.message || action.payload || "Verification failed";
      return {
        ...state,
        loading: false,
        data: action.payload?.data || null,
        error: errorMessage,
        success: false,
      };
    default:
      return state;
  }
};

const INIT_STATE$1 = {
  loading: false,
  userData: {},
  error: null,
};

const getUserDataReducer = (state = INIT_STATE$1, action) => {
  switch (action.type) {
    case GET_USER_DATA:
      
      return { ...state, loading: true, error: null };
    case GET_USER_DATA_SUCCESS:
     
      return {
        ...state,
        userData: action?.payload,
        loading: false,
        error: null,
      };
    case GET_USER_DATA_FAILURE:
     
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

const INIT_STATE = {
  loading: false,
  error: null,
};

const updateUserBalanceExposureReducer = (state = INIT_STATE, action) => {
  switch (action.type) {
    case UPDATE_USER_BALANCE_EXPOSURE:
      return { ...state, loading: true, error: null };
    case UPDATE_USER_BALANCE_EXPOSURE_SUCCESS:
      return {
        ...state,
        loading: false,
        error: null,
      };
    case UPDATE_USER_BALANCE_EXPOSURE_FAILURE:
      return { ...state, loading: false, error: true };
    default:
      return state;
  }
};

const appReducer = combineReducers({
  Signup: signupReducer,
  Login: loginReducer,
  VerifyEmail: verifyEmailReducer,
  GetUserData: getUserDataReducer,
  UpdateUserBalanceExposure: updateUserBalanceExposureReducer,
});

const reducers = (state, action) => {
  return appReducer(state, action);
};

var done = function done2(value) {
  return {
    done: true,
    value
  };
};
var qEnd = {};
function safeName(patternOrChannel) {
  if (channel$1(patternOrChannel)) {
    return "channel";
  }
  if (stringableFunc(patternOrChannel)) {
    return String(patternOrChannel);
  }
  if (func(patternOrChannel)) {
    return patternOrChannel.name;
  }
  return String(patternOrChannel);
}
function fsmIterator(fsm, startState, name) {
  var stateUpdater, errorState, effect, nextState = startState;
  function next(arg, error) {
    if (nextState === qEnd) {
      return done(arg);
    }
    if (error && !errorState) {
      nextState = qEnd;
      throw error;
    } else {
      stateUpdater && stateUpdater(arg);
      var currentState = error ? fsm[errorState](error) : fsm[nextState]();
      nextState = currentState.nextState;
      effect = currentState.effect;
      stateUpdater = currentState.stateUpdater;
      errorState = currentState.errorState;
      return nextState === qEnd ? done(arg) : effect;
    }
  }
  return makeIterator(next, function(error) {
    return next(null, error);
  }, name);
}
function takeEvery(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  var yTake = {
    done: false,
    value: take(patternOrChannel)
  };
  var yFork = function yFork2(ac) {
    return {
      done: false,
      value: fork.apply(void 0, [worker].concat(args, [ac]))
    };
  };
  var action, setAction = function setAction2(ac) {
    return action = ac;
  };
  return fsmIterator({
    q1: function q1() {
      return {
        nextState: "q2",
        effect: yTake,
        stateUpdater: setAction
      };
    },
    q2: function q2() {
      return {
        nextState: "q1",
        effect: yFork(action)
      };
    }
  }, "q1", "takeEvery(" + safeName(patternOrChannel) + ", " + worker.name + ")");
}
function takeEvery$1(patternOrChannel, worker) {
  for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    args[_key - 2] = arguments[_key];
  }
  return fork.apply(void 0, [takeEvery, patternOrChannel, worker].concat(args));
}

function* signupRequest(action) {
  try {
    // Extract the actual payload from the action
    const  payload  = action.payload || action;

    
    const data = yield call(() =>
      notifyPromise(() => api.post("/users/signup", payload), {
        loadingText: "On Boarding...",
        getSuccessMessage: (res) => {
          if (res?.data?.success) return res.data.message || "On Boarding...";
          return null; // null prevents success notification if success !== true
        },
        getErrorMessage: (err) => {
          // Handle timeout errors specifically
          if (err?.code === 'ECONNABORTED') {
            return 'Request timeout. Please check your connection and try again.';
          }
          // More detailed error handling
          if (err?.response?.data?.message) {
            return err.response.data.message;
          }
          if (err?.response?.data?.error) {
            return err.response.data.error;
          }
          return err?.message || "Signup failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
          // Handle success callback
        },
        onError: (err) => {
      
        }
      })
    );

    if (data?.data?.success) {
      yield call(setLocalStorageItem, "token", data.data.token);
      yield call(setLocalStorageItem, "userData", data.data.data);
      yield put(signupSuccess(data.data.data));
      yield put(loginSuccess(data.data.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data.data);
      }
    } else {
      yield put(signupFailure());
    }

  } catch (error) {
    console.error("Signup error caught in saga:", error);
    yield put(signupFailure());
  }
}

function* watchSignupAPI() {
  yield takeEvery$1(SIGNUP, signupRequest);
}

function* rootSaga$6() {
  yield all([watchSignupAPI()]);
}

function* loginRequest(action) {
  try {
    // Extract the actual payload from the action
    const { payload } = action;
    const data = yield call(() =>
      notifyPromise(() => api.post("/users/login", payload), {
        loadingText: "Logging in...",
        getSuccessMessage: (res) => {
          // Handle the login response structure (success: true)
          if (res?.data?.success === true) {
            return res.data.message || "Login successful";
          }
          // Also handle the existing structure for backward compatibility
          else if (res?.data?.meta?.code === 200 || res?.data?.code === 200) {
            return res?.data?.meta?.message || res?.data?.message || "Login successful";
          }
          return null; // null prevents success notification if not successful
        },
        getErrorMessage: (err) => {
          return err?.response?.data?.message || err?.message || "Login failed";
        },
        successDuration: 4000,
        onSuccess: (res) => {
  
        },
        onError: (err) => {
       
        }
      })
    );

    if (data?.data?.success === true || data?.data?.meta?.code === 200 || data?.data?.code === 200) {
      yield put(loginSuccess(data?.data?.data));
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data?.data));
      yield call(setLocalStorageItem, "token", data?.data?.token || data?.data?.meta?.token);
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
        yield call(action.callback, data?.data);
      }
    } else {
      yield put(loginFailure());
    }
  } catch (error) {
    yield put(loginFailure());
  }
}

function* watchLoginAPI() {
  yield takeEvery$1(LOGIN, loginRequest);
}

function* rootSaga$5() {
  yield all([watchLoginAPI()]);
}

function* verifyEmailRequest(action) {
    try {
        // Extract the actual payload and route from the action
        const { payload, route } = action.payload || action;
     
        let endpoint = "";
        let notificationOptions = {};

        // Check route first to handle special cases like forgot password
        if (route === "FP") {
           
            endpoint = "/users/forget-password";
            notificationOptions = {
                loadingText: "Processing...",
                getSuccessMessage: (res) => {
                    if (res?.data?.code === 200) {
                        return res?.data?.message || "Request processed successfully";
                    }
                    return null;
                },
                getErrorMessage: (err) => {
                    return err?.response?.data?.message || err?.message || "Failed to process request";
                }
            };
        } else if (payload.hasOwnProperty('otp')) {
           
            // This is for verifying the OTP
            endpoint = "/users/verify-otp";
            notificationOptions = {
                loadingText: "Verifying OTP...",
                getSuccessMessage: (res) => {
                    if (res?.data?.code === 200) {
                        return res?.data?.message || "OTP verified successfully";
                    }
                    return null;
                },
                getErrorMessage: (err) => {
                    return err?.response?.data?.message || err?.message || "Failed to verify OTP";
                },
                successTitle: "OTP Verification",
                errorTitle: "OTP Verification Failed"
            };
        } else if (payload.hasOwnProperty('email') && !payload.hasOwnProperty('otp')) {
         
            // This is for sending OTP
            endpoint = "/users/verifyemail";
            notificationOptions = {
                loadingText: "Sending OTP...",
                getSuccessMessage: (res) => {
                    if (res?.data?.code === 200) {
                        return res?.data?.message || "OTP sent to your email";
                    }
                    return null;
                },
                getErrorMessage: (err) => {
                    return err?.response?.data?.message || err?.message || "Failed to send OTP";
                },
                successTitle: "OTP Sent",
                errorTitle: "OTP Sending Failed"
            };
        }

        try {
            const { data } = yield call(() =>
                notifyPromise(() => api.post(endpoint, payload), notificationOptions)
            );

            if (data?.code === 200) {
                yield put(verifyEmailSuccess(data?.data));

                if (action.callback && typeof action.callback === 'function') {
                    yield call(action.callback, data);
                }

            } else {
                // Pass the error data to the failure action
                yield put(verifyEmailFailure(data));
            }
        } catch (apiError) {
            console.error("API Error:", apiError);
            // Pass the error to the failure action
            yield put(verifyEmailFailure(apiError?.response?.data || apiError?.message || "Verification failed"));
        }
    } catch (error) {
        console.error("Saga Error:", error);
        yield put(verifyEmailFailure(error?.message || "Verification failed"));
    }
}

function* watchVerifyEmailAPI() {
    yield takeEvery$1(VERIFY_EMAIL, verifyEmailRequest);
}

function* rootSaga$4() {
    yield all([watchVerifyEmailAPI()]);
}

function* logoutRequest(action) {
  try {
    // Remove token and userData from localStorage
    removeLocalStorageItem("token");
    removeLocalStorageItem("userData");
    
    // Store logout success message in localStorage
    setLocalStorageItem("logoutMessage", "Logout successful");
    
    // Dispatch logout success action
    yield put(logoutSuccess());
    
    // Execute callback if provided
    if (action.callback && typeof action.callback === 'function') {
      action.callback();
    }
    
    // Redirect to home page immediately
    window.location.href = "/home";
  } catch (error) {
    console.error("Logout error:", error);
    yield put(logoutFailure());
  }
}

function* watchLogoutAPI() {
  yield takeEvery$1(LOGOUT, logoutRequest);
}

function* rootSaga$3() {
  yield all([watchLogoutAPI()]);
}

function* getUserDataRequest(action) {
  try {
   
    const response = yield call(api.get, "/users/profile");
    const data = response.data;
 

    // Handle the response structure with success field
    if (data?.success === true) {
  
      yield put(getUserDataSuccess(data?.data));
      
  
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
    
        yield call(action.callback, data);
      }
    } 
    // Handle the previous response structure with code field
    else if (data?.meta?.code === 200 || data?.code === 200) {
    
      yield put(getUserDataSuccess(data?.data));
      
      // Update localStorage with the new user data
     
      yield call(setLocalStorageItem, "userData", JSON.stringify(data?.data));
      
      // Execute callback if provided
      if (action.callback && typeof action.callback === 'function') {
      
        yield call(action.callback, data);
      }
    } else {
      console.log("getUserData failed");
      yield put(getUserDataFailure());
    }
  } catch (error) {
    console.error("Error in getUserDataRequest:", error);
    yield put(getUserDataFailure());
  }
}

function* watchGetUserDataAPI() {
  yield takeEvery$1(GET_USER_DATA, getUserDataRequest);
}

function* rootSaga$2() {
  yield all([watchGetUserDataAPI()]);
}

function* updateUserBalanceExposureRequest(action) {
  try {
    const userData = getLocalStorageItem("userData");
    const userId = userData?._id;
    
    if (!userId) {
      yield put(updateUserBalanceExposureFailure());
      return;
    }

    // Create payload by combining all fields from action.payload with userId
    // We preserve all fields as sent from the component, including stake
    const payload = {
      ...action.payload,
      userId: userId,
    };
    
    const response = yield call(() =>
      notifyPromise(
        () => api.post("/sportBets/place-bet", payload),
        {
          loadingText: "Updating exposure...",
          getSuccessMessage: (res) => {
            if (res?.data?.success === true) {
              return res.data.message || "Bet Placed successfully";
            } else if (
              res?.data?.meta?.code === 200 ||
              res?.data?.code === 200
            ) {
              return (
                res?.data?.meta?.message ||
                res?.data?.message ||
                "Bet Placed successfully"
              );
            }
            else if (res?.data && (res?.status === 200 || res?.status === 201)) {
              return "Bet Placed successfully";
            }
            return null;
          },
          getErrorMessage: (err) => {
            return (
              err?.response?.data?.message ||
              err?.response?.data?.error ||
              err?.message ||
              "Failed to place bet"
            );
          },
          successDuration: 4000,
        }
      )
    );

    const isSuccess = response?.data?.success === true || 
                     response?.data?.meta?.code === 200 || 
                     response?.data?.code === 200 ||
                     (response?.status >= 200 && response?.status < 300) ||
                     (response?.data && response?.status === 200);

    if (isSuccess) {
      const responseData = response.data?.data || response.data;
      
      yield new Promise(resolve => setTimeout(resolve, 500));
      
      const userResponse = yield call(api.get, "/users/profile");
      
      if (userResponse?.data?.success === true || 
          userResponse?.data?.meta?.code === 200 || 
          userResponse?.data?.code === 200 ||
          (userResponse?.status >= 200 && userResponse?.status < 300)) {
        
        const updatedUserData = userResponse.data?.data || userResponse.data;
        
        yield put(updateUserBalanceExposureSuccess({
          balance: updatedUserData?.balance,
          exposure: updatedUserData?.exposure,
        }));
        
        yield put(getUserDataSuccess(updatedUserData));
        
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      } else {
        yield put(updateUserBalanceExposureSuccess({
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        }));
        
        const updatedUserData = {
          ...userData,
          balance: action.payload.balance,
          exposure: action.payload.exposure,
        };
        yield call(setLocalStorageItem, "userData", JSON.stringify(updatedUserData));
      }
    } else {
      yield put(updateUserBalanceExposureFailure());
    }
  } catch (error) {
    yield put(updateUserBalanceExposureFailure());
  }
}

function* watchUpdateUserBalanceExposureAPI() {
  yield takeEvery$1(UPDATE_USER_BALANCE_EXPOSURE, updateUserBalanceExposureRequest);
}

function* rootSaga$1() {
  yield all([watchUpdateUserBalanceExposureAPI()]);
}

function* rootSaga() {
  yield all([
    rootSaga$6(),
    rootSaga$5(),
    rootSaga$4(),
    rootSaga$3(),
    rootSaga$2(),
    rootSaga$1(),
  ]);
}

// src/index.ts
function createThunkMiddleware(extraArgument) {
  const middleware = ({ dispatch, getState }) => (next) => (action) => {
    if (typeof action === "function") {
      return action(dispatch, getState, extraArgument);
    }
    return next(action);
  };
  return middleware;
}
var thunk = createThunkMiddleware();
var withExtraArgument = createThunkMiddleware;

var composeWithDevTools = typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ? window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ : function() {
  if (arguments.length === 0) return void 0;
  if (typeof arguments[0] === "object") return compose;
  return compose.apply(null, arguments);
};
var Tuple = class _Tuple extends Array {
  constructor(...items) {
    super(...items);
    Object.setPrototypeOf(this, _Tuple.prototype);
  }
  static get [Symbol.species]() {
    return _Tuple;
  }
  concat(...arr) {
    return super.concat.apply(this, arr);
  }
  prepend(...arr) {
    if (arr.length === 1 && Array.isArray(arr[0])) {
      return new _Tuple(...arr[0].concat(this));
    }
    return new _Tuple(...arr.concat(this));
  }
};
function isBoolean(x) {
  return typeof x === "boolean";
}
var buildGetDefaultMiddleware = () => function getDefaultMiddleware(options) {
  const {
    thunk: thunk$1 = true,
    immutableCheck = true,
    serializableCheck = true,
    actionCreatorCheck = true
  } = options ?? {};
  let middlewareArray = new Tuple();
  if (thunk$1) {
    if (isBoolean(thunk$1)) {
      middlewareArray.push(thunk);
    } else {
      middlewareArray.push(withExtraArgument(thunk$1.extraArgument));
    }
  }
  return middlewareArray;
};
var SHOULD_AUTOBATCH = "RTK_autoBatch";
var createQueueWithTimer = (timeout) => {
  return (notify) => {
    setTimeout(notify, timeout);
  };
};
var autoBatchEnhancer = (options = {
  type: "raf"
}) => (next) => (...args) => {
  const store = next(...args);
  let notifying = true;
  let shouldNotifyAtEndOfTick = false;
  let notificationQueued = false;
  const listeners = /* @__PURE__ */ new Set();
  const queueCallback = options.type === "tick" ? queueMicrotask : options.type === "raf" ? (
    // requestAnimationFrame won't exist in SSR environments. Fall back to a vague approximation just to keep from erroring.
    typeof window !== "undefined" && window.requestAnimationFrame ? window.requestAnimationFrame : createQueueWithTimer(10)
  ) : options.type === "callback" ? options.queueNotification : createQueueWithTimer(options.timeout);
  const notifyListeners = () => {
    notificationQueued = false;
    if (shouldNotifyAtEndOfTick) {
      shouldNotifyAtEndOfTick = false;
      listeners.forEach((l) => l());
    }
  };
  return Object.assign({}, store, {
    // Override the base `store.subscribe` method to keep original listeners
    // from running if we're delaying notifications
    subscribe(listener2) {
      const wrappedListener = () => notifying && listener2();
      const unsubscribe = store.subscribe(wrappedListener);
      listeners.add(listener2);
      return () => {
        unsubscribe();
        listeners.delete(listener2);
      };
    },
    // Override the base `store.dispatch` method so that we can check actions
    // for the `shouldAutoBatch` flag and determine if batching is active
    dispatch(action) {
      try {
        notifying = !action?.meta?.[SHOULD_AUTOBATCH];
        shouldNotifyAtEndOfTick = !notifying;
        if (shouldNotifyAtEndOfTick) {
          if (!notificationQueued) {
            notificationQueued = true;
            queueCallback(notifyListeners);
          }
        }
        return store.dispatch(action);
      } finally {
        notifying = true;
      }
    }
  });
};
var buildGetDefaultEnhancers = (middlewareEnhancer) => function getDefaultEnhancers(options) {
  const {
    autoBatch = true
  } = options ?? {};
  let enhancerArray = new Tuple(middlewareEnhancer);
  if (autoBatch) {
    enhancerArray.push(autoBatchEnhancer(typeof autoBatch === "object" ? autoBatch : void 0));
  }
  return enhancerArray;
};
function configureStore(options) {
  const getDefaultMiddleware = buildGetDefaultMiddleware();
  const {
    reducer = void 0,
    middleware,
    devTools = true,
    preloadedState = void 0,
    enhancers = void 0
  } = options || {};
  let rootReducer;
  if (typeof reducer === "function") {
    rootReducer = reducer;
  } else if (isPlainObject(reducer)) {
    rootReducer = combineReducers(reducer);
  } else {
    throw new Error(formatProdErrorMessage(1) );
  }
  let finalMiddleware;
  if (typeof middleware === "function") {
    finalMiddleware = middleware(getDefaultMiddleware);
  } else {
    finalMiddleware = getDefaultMiddleware();
  }
  let finalCompose = compose;
  if (devTools) {
    finalCompose = composeWithDevTools({
      // Enable capture of stack traces for dispatched Redux actions
      trace: false,
      ...typeof devTools === "object" && devTools
    });
  }
  const middlewareEnhancer = applyMiddleware(...finalMiddleware);
  const getDefaultEnhancers = buildGetDefaultEnhancers(middlewareEnhancer);
  let storeEnhancers = typeof enhancers === "function" ? enhancers(getDefaultEnhancers) : getDefaultEnhancers();
  const composedEnhancer = finalCompose(...storeEnhancers);
  return createStore(rootReducer, preloadedState, composedEnhancer);
}
function formatProdErrorMessage(code) {
  return `Minified Redux Toolkit error #${code}; visit https://redux-toolkit.js.org/Errors?code=${code} for the full message or use the non-minified dev environment for full errors. `;
}

var KEY_PREFIX = 'persist:';
var FLUSH = 'persist/FLUSH';
var REHYDRATE = 'persist/REHYDRATE';
var PAUSE = 'persist/PAUSE';
var PERSIST = 'persist/PERSIST';
var PURGE = 'persist/PURGE';
var REGISTER = 'persist/REGISTER';
var DEFAULT_VERSION = -1;

function _typeof$2(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$2 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$2 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$2(obj);
}
function ownKeys$2(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$2(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$2(source, true).forEach(function(key) {
        _defineProperty$3(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$2(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty$3(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function autoMergeLevel1(inboundState, originalState, reducedState, _ref) {
  _ref.debug;
  var newState = _objectSpread$2({}, reducedState);
  if (inboundState && _typeof$2(inboundState) === "object") {
    Object.keys(inboundState).forEach(function(key) {
      if (key === "_persist") return;
      if (originalState[key] !== reducedState[key]) {
        return;
      }
      newState[key] = inboundState[key];
    });
  }
  return newState;
}

function createPersistoid(config) {
  var blacklist = config.blacklist || null;
  var whitelist = config.whitelist || null;
  var transforms = config.transforms || [];
  var throttle = config.throttle || 0;
  var storageKey = "".concat(config.keyPrefix !== void 0 ? config.keyPrefix : KEY_PREFIX).concat(config.key);
  var storage = config.storage;
  var serialize;
  if (config.serialize === false) {
    serialize = function serialize2(x) {
      return x;
    };
  } else if (typeof config.serialize === "function") {
    serialize = config.serialize;
  } else {
    serialize = defaultSerialize;
  }
  var writeFailHandler = config.writeFailHandler || null;
  var lastState = {};
  var stagedState = {};
  var keysToProcess = [];
  var timeIterator = null;
  var writePromise = null;
  var update = function update2(state) {
    Object.keys(state).forEach(function(key) {
      if (!passWhitelistBlacklist(key)) return;
      if (lastState[key] === state[key]) return;
      if (keysToProcess.indexOf(key) !== -1) return;
      keysToProcess.push(key);
    });
    Object.keys(lastState).forEach(function(key) {
      if (state[key] === void 0 && passWhitelistBlacklist(key) && keysToProcess.indexOf(key) === -1 && lastState[key] !== void 0) {
        keysToProcess.push(key);
      }
    });
    if (timeIterator === null) {
      timeIterator = setInterval(processNextKey, throttle);
    }
    lastState = state;
  };
  function processNextKey() {
    if (keysToProcess.length === 0) {
      if (timeIterator) clearInterval(timeIterator);
      timeIterator = null;
      return;
    }
    var key = keysToProcess.shift();
    var endState = transforms.reduce(function(subState, transformer) {
      return transformer.in(subState, key, lastState);
    }, lastState[key]);
    if (endState !== void 0) {
      try {
        stagedState[key] = serialize(endState);
      } catch (err) {
        console.error("redux-persist/createPersistoid: error serializing state", err);
      }
    } else {
      delete stagedState[key];
    }
    if (keysToProcess.length === 0) {
      writeStagedState();
    }
  }
  function writeStagedState() {
    Object.keys(stagedState).forEach(function(key) {
      if (lastState[key] === void 0) {
        delete stagedState[key];
      }
    });
    writePromise = storage.setItem(storageKey, serialize(stagedState)).catch(onWriteFail);
  }
  function passWhitelistBlacklist(key) {
    if (whitelist && whitelist.indexOf(key) === -1 && key !== "_persist") return false;
    if (blacklist && blacklist.indexOf(key) !== -1) return false;
    return true;
  }
  function onWriteFail(err) {
    if (writeFailHandler) writeFailHandler(err);
  }
  var flush = function flush2() {
    while (keysToProcess.length !== 0) {
      processNextKey();
    }
    return writePromise || Promise.resolve();
  };
  return {
    update,
    flush
  };
}
function defaultSerialize(data) {
  return JSON.stringify(data);
}

function getStoredState(config) {
  var transforms = config.transforms || [];
  var storageKey = "".concat(config.keyPrefix !== void 0 ? config.keyPrefix : KEY_PREFIX).concat(config.key);
  var storage = config.storage;
  config.debug;
  var deserialize;
  if (config.deserialize === false) {
    deserialize = function deserialize2(x) {
      return x;
    };
  } else if (typeof config.deserialize === "function") {
    deserialize = config.deserialize;
  } else {
    deserialize = defaultDeserialize;
  }
  return storage.getItem(storageKey).then(function(serialized) {
    if (!serialized) return void 0;
    else {
      try {
        var state = {};
        var rawState = deserialize(serialized);
        Object.keys(rawState).forEach(function(key) {
          state[key] = transforms.reduceRight(function(subState, transformer) {
            return transformer.out(subState, key, rawState);
          }, deserialize(rawState[key]));
        });
        return state;
      } catch (err) {
        throw err;
      }
    }
  });
}
function defaultDeserialize(serial) {
  return JSON.parse(serial);
}

function purgeStoredState(config) {
  var storage = config.storage;
  var storageKey = "".concat(config.keyPrefix !== void 0 ? config.keyPrefix : KEY_PREFIX).concat(config.key);
  return storage.removeItem(storageKey, warnIfRemoveError);
}
function warnIfRemoveError(err) {
}

function ownKeys$1(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread$1(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys$1(source, true).forEach(function(key) {
        _defineProperty$2(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys$1(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty$2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
function _objectWithoutProperties(source, excluded) {
  if (source == null) return {};
  var target = _objectWithoutPropertiesLoose(source, excluded);
  var key, i;
  if (Object.getOwnPropertySymbols) {
    var sourceSymbolKeys = Object.getOwnPropertySymbols(source);
    for (i = 0; i < sourceSymbolKeys.length; i++) {
      key = sourceSymbolKeys[i];
      if (excluded.indexOf(key) >= 0) continue;
      if (!Object.prototype.propertyIsEnumerable.call(source, key)) continue;
      target[key] = source[key];
    }
  }
  return target;
}
function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;
  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }
  return target;
}
var DEFAULT_TIMEOUT = 5e3;
function persistReducer(config, baseReducer) {
  var version = config.version !== void 0 ? config.version : DEFAULT_VERSION;
  config.debug || false;
  var stateReconciler = config.stateReconciler === void 0 ? autoMergeLevel1 : config.stateReconciler;
  var getStoredState$1 = config.getStoredState || getStoredState;
  var timeout = config.timeout !== void 0 ? config.timeout : DEFAULT_TIMEOUT;
  var _persistoid = null;
  var _purge = false;
  var _paused = true;
  var conditionalUpdate = function conditionalUpdate2(state) {
    state._persist.rehydrated && _persistoid && !_paused && _persistoid.update(state);
    return state;
  };
  return function(state, action) {
    var _ref = state || {}, _persist = _ref._persist, rest = _objectWithoutProperties(_ref, ["_persist"]);
    var restState = rest;
    if (action.type === PERSIST) {
      var _sealed = false;
      var _rehydrate = function _rehydrate2(payload, err) {
        if (!_sealed) {
          action.rehydrate(config.key, payload, err);
          _sealed = true;
        }
      };
      timeout && setTimeout(function() {
        !_sealed && _rehydrate(void 0, new Error('redux-persist: persist timed out for persist key "'.concat(config.key, '"')));
      }, timeout);
      _paused = false;
      if (!_persistoid) _persistoid = createPersistoid(config);
      if (_persist) {
        return _objectSpread$1({}, baseReducer(restState, action), {
          _persist
        });
      }
      if (typeof action.rehydrate !== "function" || typeof action.register !== "function") throw new Error("redux-persist: either rehydrate or register is not a function on the PERSIST action. This can happen if the action is being replayed. This is an unexplored use case, please open an issue and we will figure out a resolution.");
      action.register(config.key);
      getStoredState$1(config).then(function(restoredState) {
        var migrate = config.migrate || function(s, v) {
          return Promise.resolve(s);
        };
        migrate(restoredState, version).then(function(migratedState) {
          _rehydrate(migratedState);
        }, function(migrateErr) {
          _rehydrate(void 0, migrateErr);
        });
      }, function(err) {
        _rehydrate(void 0, err);
      });
      return _objectSpread$1({}, baseReducer(restState, action), {
        _persist: {
          version,
          rehydrated: false
        }
      });
    } else if (action.type === PURGE) {
      _purge = true;
      action.result(purgeStoredState(config));
      return _objectSpread$1({}, baseReducer(restState, action), {
        _persist
      });
    } else if (action.type === FLUSH) {
      action.result(_persistoid && _persistoid.flush());
      return _objectSpread$1({}, baseReducer(restState, action), {
        _persist
      });
    } else if (action.type === PAUSE) {
      _paused = true;
    } else if (action.type === REHYDRATE) {
      if (_purge) return _objectSpread$1({}, restState, {
        _persist: _objectSpread$1({}, _persist, {
          rehydrated: true
        })
        // @NOTE if key does not match, will continue to default else below
      });
      if (action.key === config.key) {
        var reducedState = baseReducer(restState, action);
        var inboundState = action.payload;
        var reconciledRest = stateReconciler !== false && inboundState !== void 0 ? stateReconciler(inboundState, state, reducedState, config) : reducedState;
        var _newState = _objectSpread$1({}, reconciledRest, {
          _persist: _objectSpread$1({}, _persist, {
            rehydrated: true
          })
        });
        return conditionalUpdate(_newState);
      }
    }
    if (!_persist) return baseReducer(state, action);
    var newState = baseReducer(restState, action);
    if (newState === restState) return state;
    return conditionalUpdate(_objectSpread$1({}, newState, {
      _persist
    }));
  };
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}
function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}
function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}
function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }
    return arr2;
  }
}
function ownKeys(object, enumerableOnly) {
  var keys = Object.keys(object);
  if (Object.getOwnPropertySymbols) {
    var symbols = Object.getOwnPropertySymbols(object);
    if (enumerableOnly) symbols = symbols.filter(function(sym) {
      return Object.getOwnPropertyDescriptor(object, sym).enumerable;
    });
    keys.push.apply(keys, symbols);
  }
  return keys;
}
function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    if (i % 2) {
      ownKeys(source, true).forEach(function(key) {
        _defineProperty$1(target, key, source[key]);
      });
    } else if (Object.getOwnPropertyDescriptors) {
      Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
    } else {
      ownKeys(source).forEach(function(key) {
        Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
      });
    }
  }
  return target;
}
function _defineProperty$1(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
var initialState = {
  registry: [],
  bootstrapped: false
};
var persistorReducer = function persistorReducer2() {
  var state = arguments.length > 0 && arguments[0] !== void 0 ? arguments[0] : initialState;
  var action = arguments.length > 1 ? arguments[1] : void 0;
  switch (action.type) {
    case REGISTER:
      return _objectSpread({}, state, {
        registry: [].concat(_toConsumableArray(state.registry), [action.key])
      });
    case REHYDRATE:
      var firstIndex = state.registry.indexOf(action.key);
      var registry = _toConsumableArray(state.registry);
      registry.splice(firstIndex, 1);
      return _objectSpread({}, state, {
        registry,
        bootstrapped: registry.length === 0
      });
    default:
      return state;
  }
};
function persistStore(store, options, cb) {
  var _pStore = createStore(persistorReducer, initialState, void 0);
  var register = function register2(key) {
    _pStore.dispatch({
      type: REGISTER,
      key
    });
  };
  var rehydrate = function rehydrate2(key, payload, err) {
    var rehydrateAction = {
      type: REHYDRATE,
      payload,
      err,
      key
      // dispatch to `store` to rehydrate and `persistor` to track result
    };
    store.dispatch(rehydrateAction);
    _pStore.dispatch(rehydrateAction);
  };
  var persistor = _objectSpread({}, _pStore, {
    purge: function purge() {
      var results = [];
      store.dispatch({
        type: PURGE,
        result: function result(purgeResult) {
          results.push(purgeResult);
        }
      });
      return Promise.all(results);
    },
    flush: function flush() {
      var results = [];
      store.dispatch({
        type: FLUSH,
        result: function result(flushResult) {
          results.push(flushResult);
        }
      });
      return Promise.all(results);
    },
    pause: function pause() {
      store.dispatch({
        type: PAUSE
      });
    },
    persist: function persist() {
      store.dispatch({
        type: PERSIST,
        register,
        rehydrate
      });
    }
  });
  {
    persistor.persist();
  }
  return persistor;
}

var createWebStorage$1 = {};

var getStorage$1 = {};

getStorage$1.__esModule = true;
getStorage$1.default = getStorage;
function _typeof$1(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof$1 = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof$1 = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof$1(obj);
}
function noop() {
}
var noopStorage = {
  getItem: noop,
  setItem: noop,
  removeItem: noop
};
function hasStorage(storageType) {
  if ((typeof self === "undefined" ? "undefined" : _typeof$1(self)) !== "object" || !(storageType in self)) {
    return false;
  }
  try {
    var storage = self[storageType];
    var testKey = "redux-persist ".concat(storageType, " test");
    storage.setItem(testKey, "test");
    storage.getItem(testKey);
    storage.removeItem(testKey);
  } catch (e) {
    return false;
  }
  return true;
}
function getStorage(type) {
  var storageType = "".concat(type, "Storage");
  if (hasStorage(storageType)) return self[storageType];
  else {
    return noopStorage;
  }
}

createWebStorage$1.__esModule = true;
createWebStorage$1.default = createWebStorage;

var _getStorage = _interopRequireDefault$1(getStorage$1);

function _interopRequireDefault$1(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function createWebStorage(type) {
  var storage = (0, _getStorage.default)(type);
  return {
    getItem: function getItem(key) {
      return new Promise(function (resolve, reject) {
        resolve(storage.getItem(key));
      });
    },
    setItem: function setItem(key, item) {
      return new Promise(function (resolve, reject) {
        resolve(storage.setItem(key, item));
      });
    },
    removeItem: function removeItem(key) {
      return new Promise(function (resolve, reject) {
        resolve(storage.removeItem(key));
      });
    }
  };
}

var default_1 = void 0;

var _createWebStorage = _interopRequireDefault(createWebStorage$1);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _createWebStorage.default)('local');

default_1 = _default;

const sagaMiddleware = sagaMiddlewareFactory();

// Configure persist
const persistConfig = {
  key: "root",
  storage: default_1,
  whitelist: [], // add names of reducers you want to persist, e.g. ['auth']
};

// Create a persisted reducer
const persistedReducer = persistReducer(persistConfig, reducers);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Ignore these redux-persist action types in serializable check
        ignoredActions: [
          FLUSH, 
          REHYDRATE, 
          PAUSE, 
          PERSIST, 
          PURGE, 
          REGISTER, 
          VERIFY_EMAIL,
          UPDATE_USER_BALANCE_EXPOSURE,
          UPDATE_USER_BALANCE_EXPOSURE_SUCCESS,
          UPDATE_USER_BALANCE_EXPOSURE_FAILURE
        ],
      },
    }).concat(sagaMiddleware),
});

sagaMiddleware.run(rootSaga);

// Create persistor
const persistor = persistStore(store);

function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function _typeof2(obj2) {
      return typeof obj2;
    };
  } else {
    _typeof = function _typeof2(obj2) {
      return obj2 && typeof Symbol === "function" && obj2.constructor === Symbol && obj2 !== Symbol.prototype ? "symbol" : typeof obj2;
    };
  }
  return _typeof(obj);
}
function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}
function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}
function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  return Constructor;
}
function _possibleConstructorReturn(self, call) {
  if (call && (_typeof(call) === "object" || typeof call === "function")) {
    return call;
  }
  return _assertThisInitialized(self);
}
function _getPrototypeOf(o) {
  _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf2(o2) {
    return o2.__proto__ || Object.getPrototypeOf(o2);
  };
  return _getPrototypeOf(o);
}
function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }
  return self;
}
function _inherits(subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function");
  }
  subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } });
  if (superClass) _setPrototypeOf(subClass, superClass);
}
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf2(o2, p2) {
    o2.__proto__ = p2;
    return o2;
  };
  return _setPrototypeOf(o, p);
}
function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, { value, enumerable: true, configurable: true, writable: true });
  } else {
    obj[key] = value;
  }
  return obj;
}
const React = await importShared('react');
const {PureComponent} = React;

var PersistGate = /* @__PURE__ */ function(_PureComponent) {
  _inherits(PersistGate2, _PureComponent);
  function PersistGate2() {
    var _getPrototypeOf2;
    var _this;
    _classCallCheck(this, PersistGate2);
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
      args[_key] = arguments[_key];
    }
    _this = _possibleConstructorReturn(this, (_getPrototypeOf2 = _getPrototypeOf(PersistGate2)).call.apply(_getPrototypeOf2, [this].concat(args)));
    _defineProperty(_assertThisInitialized(_this), "state", {
      bootstrapped: false
    });
    _defineProperty(_assertThisInitialized(_this), "_unsubscribe", void 0);
    _defineProperty(_assertThisInitialized(_this), "handlePersistorState", function() {
      var persistor = _this.props.persistor;
      var _persistor$getState = persistor.getState(), bootstrapped = _persistor$getState.bootstrapped;
      if (bootstrapped) {
        if (_this.props.onBeforeLift) {
          Promise.resolve(_this.props.onBeforeLift()).finally(function() {
            return _this.setState({
              bootstrapped: true
            });
          });
        } else {
          _this.setState({
            bootstrapped: true
          });
        }
        _this._unsubscribe && _this._unsubscribe();
      }
    });
    return _this;
  }
  _createClass(PersistGate2, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this._unsubscribe = this.props.persistor.subscribe(this.handlePersistorState);
      this.handlePersistorState();
    }
  }, {
    key: "componentWillUnmount",
    value: function componentWillUnmount() {
      this._unsubscribe && this._unsubscribe();
    }
  }, {
    key: "render",
    value: function render() {
      if (typeof this.props.children === "function") {
        return this.props.children(this.state.bootstrapped);
      }
      return this.state.bootstrapped ? this.props.children : this.props.loading;
    }
  }]);
  return PersistGate2;
}(PureComponent);
_defineProperty(PersistGate, "defaultProps", {
  children: null,
  loading: null
});

await importShared('react');
client.createRoot(document.getElementById("root")).render(
  /* @__PURE__ */ jsxRuntimeExports.jsx(Provider_default, { store, children: /* @__PURE__ */ jsxRuntimeExports.jsx(PersistGate, { loading: null, persistor, children: /* @__PURE__ */ jsxRuntimeExports.jsx(LayoutApp, {}) }) })
);
