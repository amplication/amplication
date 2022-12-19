var xl = Object.create;
var hn = Object.defineProperty;
var vl = Object.getOwnPropertyDescriptor;
var El = Object.getOwnPropertyNames;
var Tl = Object.getPrototypeOf,
  Al = Object.prototype.hasOwnProperty;
var u = (e, t) => hn(e, "name", { value: t, configurable: !0 }),
  yr = ((e) =>
    typeof require != "undefined"
      ? require
      : typeof Proxy != "undefined"
      ? new Proxy(e, {
          get: (t, r) => (typeof require != "undefined" ? require : t)[r],
        })
      : e)(function (e) {
    if (typeof require != "undefined") return require.apply(this, arguments);
    throw new Error('Dynamic require of "' + e + '" is not supported');
  });
var bn = (e, t) => () => (e && (t = e((e = 0))), t);
var K = (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
  fs = (e, t) => {
    for (var r in t) hn(e, r, { get: t[r], enumerable: !0 });
  },
  Pl = (e, t, r, n) => {
    if ((t && typeof t == "object") || typeof t == "function")
      for (let o of El(t))
        !Al.call(e, o) &&
          o !== r &&
          hn(e, o, {
            get: () => t[o],
            enumerable: !(n = vl(t, o)) || n.enumerable,
          });
    return e;
  };
var ee = (e, t, r) => (
  (r = e != null ? xl(Tl(e)) : {}),
  Pl(
    t || !e || !e.__esModule
      ? hn(r, "default", { value: e, enumerable: !0 })
      : r,
    e
  )
);
function q(e) {
  return () => e;
}
function Fe() {
  return w;
}
var Ml,
  w,
  p = bn(() => {
    "use strict";
    u(q, "noop");
    Ml = Promise.resolve();
    u(Fe, "getProcess");
    w = {
      abort: q(void 0),
      addListener: q(Fe()),
      allowedNodeEnvironmentFlags: new Set(),
      arch: "x64",
      argv: ["/bin/node"],
      argv0: "node",
      chdir: q(void 0),
      config: {
        target_defaults: {
          cflags: [],
          default_configuration: "",
          defines: [],
          include_dirs: [],
          libraries: [],
        },
        variables: {
          clang: 0,
          host_arch: "x64",
          node_install_npm: !1,
          node_install_waf: !1,
          node_prefix: "",
          node_shared_openssl: !1,
          node_shared_v8: !1,
          node_shared_zlib: !1,
          node_use_dtrace: !1,
          node_use_etw: !1,
          node_use_openssl: !1,
          target_arch: "x64",
          v8_no_strict_aliasing: 0,
          v8_use_snapshot: !1,
          visibility: "",
        },
      },
      connected: !1,
      cpuUsage: () => ({ user: 0, system: 0 }),
      cwd: () => "/",
      debugPort: 0,
      disconnect: q(void 0),
      domain: {
        run: q(void 0),
        add: q(void 0),
        remove: q(void 0),
        bind: q(void 0),
        intercept: q(void 0),
        ...Fe(),
      },
      emit: q(Fe()),
      emitWarning: q(void 0),
      env: {},
      eventNames: () => [],
      execArgv: [],
      execPath: "/",
      exit: q(void 0),
      features: {
        inspector: !1,
        debug: !1,
        uv: !1,
        ipv6: !1,
        tls_alpn: !1,
        tls_sni: !1,
        tls_ocsp: !1,
        tls: !1,
      },
      getMaxListeners: q(0),
      getegid: q(0),
      geteuid: q(0),
      getgid: q(0),
      getgroups: q([]),
      getuid: q(0),
      hasUncaughtExceptionCaptureCallback: q(!1),
      hrtime: q([0, 0]),
      platform: "linux",
      kill: q(!0),
      listenerCount: q(0),
      listeners: q([]),
      memoryUsage: q({
        arrayBuffers: 0,
        external: 0,
        heapTotal: 0,
        heapUsed: 0,
        rss: 0,
      }),
      nextTick: (e, ...t) => {
        Ml.then(() => e(...t)).catch((r) => {
          setTimeout(() => {
            throw r;
          }, 0);
        });
      },
      off: q(Fe()),
      on: q(Fe()),
      once: q(Fe()),
      openStdin: q({}),
      pid: 0,
      ppid: 0,
      prependListener: q(Fe()),
      prependOnceListener: q(Fe()),
      rawListeners: q([]),
      release: { name: "node" },
      removeAllListeners: q(Fe()),
      removeListener: q(Fe()),
      resourceUsage: q({
        fsRead: 0,
        fsWrite: 0,
        involuntaryContextSwitches: 0,
        ipcReceived: 0,
        ipcSent: 0,
        majorPageFault: 0,
        maxRSS: 0,
        minorPageFault: 0,
        sharedMemorySize: 0,
        signalsCount: 0,
        swappedOut: 0,
        systemCPUTime: 0,
        unsharedDataSize: 0,
        unsharedStackSize: 0,
        userCPUTime: 0,
        voluntaryContextSwitches: 0,
      }),
      setMaxListeners: q(Fe()),
      setUncaughtExceptionCaptureCallback: q(void 0),
      setegid: q(void 0),
      seteuid: q(void 0),
      setgid: q(void 0),
      setgroups: q(void 0),
      setuid: q(void 0),
      stderr: { fd: 2 },
      stdin: { fd: 0 },
      stdout: { fd: 1 },
      title: "node",
      traceDeprecation: !1,
      umask: q(0),
      uptime: q(0),
      version: "",
      versions: {
        http_parser: "",
        node: "",
        v8: "",
        ares: "",
        uv: "",
        zlib: "",
        modules: "",
        openssl: "",
      },
    };
  });
var E,
  m = bn(() => {
    "use strict";
    E = u(() => {}, "fn");
    E.prototype = E;
  });
var Cs = K((jt) => {
  "use strict";
  d();
  p();
  m();
  var ys = u(
      (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
      "q"
    ),
    Sl = ys((e) => {
      "use strict";
      (e.byteLength = c), (e.toByteArray = f), (e.fromByteArray = b);
      var t = [],
        r = [],
        n = typeof Uint8Array < "u" ? Uint8Array : Array,
        o = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
      for (i = 0, s = o.length; i < s; ++i)
        (t[i] = o[i]), (r[o.charCodeAt(i)] = i);
      var i, s;
      (r["-".charCodeAt(0)] = 62), (r["_".charCodeAt(0)] = 63);
      function a(x) {
        var h = x.length;
        if (h % 4 > 0)
          throw new Error("Invalid string. Length must be a multiple of 4");
        var A = x.indexOf("=");
        A === -1 && (A = h);
        var M = A === h ? 0 : 4 - (A % 4);
        return [A, M];
      }
      u(a, "j");
      function c(x) {
        var h = a(x),
          A = h[0],
          M = h[1];
        return ((A + M) * 3) / 4 - M;
      }
      u(c, "sr");
      function l(x, h, A) {
        return ((h + A) * 3) / 4 - A;
      }
      u(l, "lr");
      function f(x) {
        var h,
          A = a(x),
          M = A[0],
          P = A[1],
          S = new n(l(x, M, P)),
          T = 0,
          O = P > 0 ? M - 4 : M,
          R;
        for (R = 0; R < O; R += 4)
          (h =
            (r[x.charCodeAt(R)] << 18) |
            (r[x.charCodeAt(R + 1)] << 12) |
            (r[x.charCodeAt(R + 2)] << 6) |
            r[x.charCodeAt(R + 3)]),
            (S[T++] = (h >> 16) & 255),
            (S[T++] = (h >> 8) & 255),
            (S[T++] = h & 255);
        return (
          P === 2 &&
            ((h = (r[x.charCodeAt(R)] << 2) | (r[x.charCodeAt(R + 1)] >> 4)),
            (S[T++] = h & 255)),
          P === 1 &&
            ((h =
              (r[x.charCodeAt(R)] << 10) |
              (r[x.charCodeAt(R + 1)] << 4) |
              (r[x.charCodeAt(R + 2)] >> 2)),
            (S[T++] = (h >> 8) & 255),
            (S[T++] = h & 255)),
          S
        );
      }
      u(f, "ar");
      function g(x) {
        return (
          t[(x >> 18) & 63] + t[(x >> 12) & 63] + t[(x >> 6) & 63] + t[x & 63]
        );
      }
      u(g, "yr");
      function y(x, h, A) {
        for (var M, P = [], S = h; S < A; S += 3)
          (M =
            ((x[S] << 16) & 16711680) +
            ((x[S + 1] << 8) & 65280) +
            (x[S + 2] & 255)),
            P.push(g(M));
        return P.join("");
      }
      u(y, "wr");
      function b(x) {
        for (
          var h, A = x.length, M = A % 3, P = [], S = 16383, T = 0, O = A - M;
          T < O;
          T += S
        )
          P.push(y(x, T, T + S > O ? O : T + S));
        return (
          M === 1
            ? ((h = x[A - 1]), P.push(t[h >> 2] + t[(h << 4) & 63] + "=="))
            : M === 2 &&
              ((h = (x[A - 2] << 8) + x[A - 1]),
              P.push(t[h >> 10] + t[(h >> 4) & 63] + t[(h << 2) & 63] + "=")),
          P.join("")
        );
      }
      u(b, "xr");
    }),
    Ol = ys((e) => {
      (e.read = function (t, r, n, o, i) {
        var s,
          a,
          c = i * 8 - o - 1,
          l = (1 << c) - 1,
          f = l >> 1,
          g = -7,
          y = n ? i - 1 : 0,
          b = n ? -1 : 1,
          x = t[r + y];
        for (
          y += b, s = x & ((1 << -g) - 1), x >>= -g, g += c;
          g > 0;
          s = s * 256 + t[r + y], y += b, g -= 8
        );
        for (
          a = s & ((1 << -g) - 1), s >>= -g, g += o;
          g > 0;
          a = a * 256 + t[r + y], y += b, g -= 8
        );
        if (s === 0) s = 1 - f;
        else {
          if (s === l) return a ? NaN : (x ? -1 : 1) * (1 / 0);
          (a = a + Math.pow(2, o)), (s = s - f);
        }
        return (x ? -1 : 1) * a * Math.pow(2, s - o);
      }),
        (e.write = function (t, r, n, o, i, s) {
          var a,
            c,
            l,
            f = s * 8 - i - 1,
            g = (1 << f) - 1,
            y = g >> 1,
            b = i === 23 ? Math.pow(2, -24) - Math.pow(2, -77) : 0,
            x = o ? 0 : s - 1,
            h = o ? 1 : -1,
            A = r < 0 || (r === 0 && 1 / r < 0) ? 1 : 0;
          for (
            r = Math.abs(r),
              isNaN(r) || r === 1 / 0
                ? ((c = isNaN(r) ? 1 : 0), (a = g))
                : ((a = Math.floor(Math.log(r) / Math.LN2)),
                  r * (l = Math.pow(2, -a)) < 1 && (a--, (l *= 2)),
                  a + y >= 1 ? (r += b / l) : (r += b * Math.pow(2, 1 - y)),
                  r * l >= 2 && (a++, (l /= 2)),
                  a + y >= g
                    ? ((c = 0), (a = g))
                    : a + y >= 1
                    ? ((c = (r * l - 1) * Math.pow(2, i)), (a = a + y))
                    : ((c = r * Math.pow(2, y - 1) * Math.pow(2, i)), (a = 0)));
            i >= 8;
            t[n + x] = c & 255, x += h, c /= 256, i -= 8
          );
          for (
            a = (a << i) | c, f += i;
            f > 0;
            t[n + x] = a & 255, x += h, a /= 256, f -= 8
          );
          t[n + x - h] |= A * 128;
        });
    }),
    Po = Sl(),
    Nt = Ol(),
    ps =
      typeof Symbol == "function" && typeof Symbol.for == "function"
        ? Symbol.for("nodejs.util.inspect.custom")
        : null;
  jt.Buffer = _;
  jt.SlowBuffer = Dl;
  jt.INSPECT_MAX_BYTES = 50;
  var wn = 2147483647;
  jt.kMaxLength = wn;
  _.TYPED_ARRAY_SUPPORT = _l();
  !_.TYPED_ARRAY_SUPPORT &&
    typeof console < "u" &&
    typeof console.error == "function" &&
    console.error(
      "This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support."
    );
  function _l() {
    try {
      let e = new Uint8Array(1),
        t = {
          foo: function () {
            return 42;
          },
        };
      return (
        Object.setPrototypeOf(t, Uint8Array.prototype),
        Object.setPrototypeOf(e, t),
        e.foo() === 42
      );
    } catch (e) {
      return !1;
    }
  }
  u(_l, "Br");
  Object.defineProperty(_.prototype, "parent", {
    enumerable: !0,
    get: function () {
      if (_.isBuffer(this)) return this.buffer;
    },
  });
  Object.defineProperty(_.prototype, "offset", {
    enumerable: !0,
    get: function () {
      if (_.isBuffer(this)) return this.byteOffset;
    },
  });
  function He(e) {
    if (e > wn)
      throw new RangeError(
        'The value "' + e + '" is invalid for option "size"'
      );
    let t = new Uint8Array(e);
    return Object.setPrototypeOf(t, _.prototype), t;
  }
  u(He, "d");
  function _(e, t, r) {
    if (typeof e == "number") {
      if (typeof t == "string")
        throw new TypeError(
          'The "string" argument must be of type string. Received type number'
        );
      return Oo(e);
    }
    return hs(e, t, r);
  }
  u(_, "h");
  _.poolSize = 8192;
  function hs(e, t, r) {
    if (typeof e == "string") return Il(e, t);
    if (ArrayBuffer.isView(e)) return Rl(e);
    if (e == null)
      throw new TypeError(
        "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
          typeof e
      );
    if (
      Ue(e, ArrayBuffer) ||
      (e && Ue(e.buffer, ArrayBuffer)) ||
      (typeof SharedArrayBuffer < "u" &&
        (Ue(e, SharedArrayBuffer) || (e && Ue(e.buffer, SharedArrayBuffer))))
    )
      return ws(e, t, r);
    if (typeof e == "number")
      throw new TypeError(
        'The "value" argument must not be of type number. Received type number'
      );
    let n = e.valueOf && e.valueOf();
    if (n != null && n !== e) return _.from(n, t, r);
    let o = Fl(e);
    if (o) return o;
    if (
      typeof Symbol < "u" &&
      Symbol.toPrimitive != null &&
      typeof e[Symbol.toPrimitive] == "function"
    )
      return _.from(e[Symbol.toPrimitive]("string"), t, r);
    throw new TypeError(
      "The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type " +
        typeof e
    );
  }
  u(hs, "Z");
  _.from = function (e, t, r) {
    return hs(e, t, r);
  };
  Object.setPrototypeOf(_.prototype, Uint8Array.prototype);
  Object.setPrototypeOf(_, Uint8Array);
  function bs(e) {
    if (typeof e != "number")
      throw new TypeError('"size" argument must be of type number');
    if (e < 0)
      throw new RangeError(
        'The value "' + e + '" is invalid for option "size"'
      );
  }
  u(bs, "Q");
  function Cl(e, t, r) {
    return (
      bs(e),
      e <= 0
        ? He(e)
        : t !== void 0
        ? typeof r == "string"
          ? He(e).fill(t, r)
          : He(e).fill(t)
        : He(e)
    );
  }
  u(Cl, "Er");
  _.alloc = function (e, t, r) {
    return Cl(e, t, r);
  };
  function Oo(e) {
    return bs(e), He(e < 0 ? 0 : _o(e) | 0);
  }
  u(Oo, "P");
  _.allocUnsafe = function (e) {
    return Oo(e);
  };
  _.allocUnsafeSlow = function (e) {
    return Oo(e);
  };
  function Il(e, t) {
    if (((typeof t != "string" || t === "") && (t = "utf8"), !_.isEncoding(t)))
      throw new TypeError("Unknown encoding: " + t);
    let r = xs(e, t) | 0,
      n = He(r),
      o = n.write(e, t);
    return o !== r && (n = n.slice(0, o)), n;
  }
  u(Il, "dr");
  function Mo(e) {
    let t = e.length < 0 ? 0 : _o(e.length) | 0,
      r = He(t);
    for (let n = 0; n < t; n += 1) r[n] = e[n] & 255;
    return r;
  }
  u(Mo, "D");
  function Rl(e) {
    if (Ue(e, Uint8Array)) {
      let t = new Uint8Array(e);
      return ws(t.buffer, t.byteOffset, t.byteLength);
    }
    return Mo(e);
  }
  u(Rl, "gr");
  function ws(e, t, r) {
    if (t < 0 || e.byteLength < t)
      throw new RangeError('"offset" is outside of buffer bounds');
    if (e.byteLength < t + (r || 0))
      throw new RangeError('"length" is outside of buffer bounds');
    let n;
    return (
      t === void 0 && r === void 0
        ? (n = new Uint8Array(e))
        : r === void 0
        ? (n = new Uint8Array(e, t))
        : (n = new Uint8Array(e, t, r)),
      Object.setPrototypeOf(n, _.prototype),
      n
    );
  }
  u(ws, "$");
  function Fl(e) {
    if (_.isBuffer(e)) {
      let t = _o(e.length) | 0,
        r = He(t);
      return r.length === 0 || e.copy(r, 0, 0, t), r;
    }
    if (e.length !== void 0)
      return typeof e.length != "number" || Io(e.length) ? He(0) : Mo(e);
    if (e.type === "Buffer" && Array.isArray(e.data)) return Mo(e.data);
  }
  u(Fl, "mr");
  function _o(e) {
    if (e >= wn)
      throw new RangeError(
        "Attempt to allocate Buffer larger than maximum size: 0x" +
          wn.toString(16) +
          " bytes"
      );
    return e | 0;
  }
  u(_o, "O");
  function Dl(e) {
    return +e != e && (e = 0), _.alloc(+e);
  }
  u(Dl, "Ir");
  _.isBuffer = function (e) {
    return e != null && e._isBuffer === !0 && e !== _.prototype;
  };
  _.compare = function (e, t) {
    if (
      (Ue(e, Uint8Array) && (e = _.from(e, e.offset, e.byteLength)),
      Ue(t, Uint8Array) && (t = _.from(t, t.offset, t.byteLength)),
      !_.isBuffer(e) || !_.isBuffer(t))
    )
      throw new TypeError(
        'The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array'
      );
    if (e === t) return 0;
    let r = e.length,
      n = t.length;
    for (let o = 0, i = Math.min(r, n); o < i; ++o)
      if (e[o] !== t[o]) {
        (r = e[o]), (n = t[o]);
        break;
      }
    return r < n ? -1 : n < r ? 1 : 0;
  };
  _.isEncoding = function (e) {
    switch (String(e).toLowerCase()) {
      case "hex":
      case "utf8":
      case "utf-8":
      case "ascii":
      case "latin1":
      case "binary":
      case "base64":
      case "ucs2":
      case "ucs-2":
      case "utf16le":
      case "utf-16le":
        return !0;
      default:
        return !1;
    }
  };
  _.concat = function (e, t) {
    if (!Array.isArray(e))
      throw new TypeError('"list" argument must be an Array of Buffers');
    if (e.length === 0) return _.alloc(0);
    let r;
    if (t === void 0) for (t = 0, r = 0; r < e.length; ++r) t += e[r].length;
    let n = _.allocUnsafe(t),
      o = 0;
    for (r = 0; r < e.length; ++r) {
      let i = e[r];
      if (Ue(i, Uint8Array))
        o + i.length > n.length
          ? (_.isBuffer(i) || (i = _.from(i)), i.copy(n, o))
          : Uint8Array.prototype.set.call(n, i, o);
      else if (_.isBuffer(i)) i.copy(n, o);
      else throw new TypeError('"list" argument must be an Array of Buffers');
      o += i.length;
    }
    return n;
  };
  function xs(e, t) {
    if (_.isBuffer(e)) return e.length;
    if (ArrayBuffer.isView(e) || Ue(e, ArrayBuffer)) return e.byteLength;
    if (typeof e != "string")
      throw new TypeError(
        'The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type ' +
          typeof e
      );
    let r = e.length,
      n = arguments.length > 2 && arguments[2] === !0;
    if (!n && r === 0) return 0;
    let o = !1;
    for (;;)
      switch (t) {
        case "ascii":
        case "latin1":
        case "binary":
          return r;
        case "utf8":
        case "utf-8":
          return So(e).length;
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return r * 2;
        case "hex":
          return r >>> 1;
        case "base64":
          return _s(e).length;
        default:
          if (o) return n ? -1 : So(e).length;
          (t = ("" + t).toLowerCase()), (o = !0);
      }
  }
  u(xs, "v");
  _.byteLength = xs;
  function Nl(e, t, r) {
    let n = !1;
    if (
      ((t === void 0 || t < 0) && (t = 0),
      t > this.length ||
        ((r === void 0 || r > this.length) && (r = this.length), r <= 0) ||
        ((r >>>= 0), (t >>>= 0), r <= t))
    )
      return "";
    for (e || (e = "utf8"); ; )
      switch (e) {
        case "hex":
          return Jl(this, t, r);
        case "utf8":
        case "utf-8":
          return Es(this, t, r);
        case "ascii":
          return Vl(this, t, r);
        case "latin1":
        case "binary":
          return Gl(this, t, r);
        case "base64":
          return ql(this, t, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return zl(this, t, r);
        default:
          if (n) throw new TypeError("Unknown encoding: " + e);
          (e = (e + "").toLowerCase()), (n = !0);
      }
  }
  u(Nl, "Fr");
  _.prototype._isBuffer = !0;
  function Tt(e, t, r) {
    let n = e[t];
    (e[t] = e[r]), (e[r] = n);
  }
  u(Tt, "I");
  _.prototype.swap16 = function () {
    let e = this.length;
    if (e % 2 !== 0)
      throw new RangeError("Buffer size must be a multiple of 16-bits");
    for (let t = 0; t < e; t += 2) Tt(this, t, t + 1);
    return this;
  };
  _.prototype.swap32 = function () {
    let e = this.length;
    if (e % 4 !== 0)
      throw new RangeError("Buffer size must be a multiple of 32-bits");
    for (let t = 0; t < e; t += 4) Tt(this, t, t + 3), Tt(this, t + 1, t + 2);
    return this;
  };
  _.prototype.swap64 = function () {
    let e = this.length;
    if (e % 8 !== 0)
      throw new RangeError("Buffer size must be a multiple of 64-bits");
    for (let t = 0; t < e; t += 8)
      Tt(this, t, t + 7),
        Tt(this, t + 1, t + 6),
        Tt(this, t + 2, t + 5),
        Tt(this, t + 3, t + 4);
    return this;
  };
  _.prototype.toString = function () {
    let e = this.length;
    return e === 0
      ? ""
      : arguments.length === 0
      ? Es(this, 0, e)
      : Nl.apply(this, arguments);
  };
  _.prototype.toLocaleString = _.prototype.toString;
  _.prototype.equals = function (e) {
    if (!_.isBuffer(e)) throw new TypeError("Argument must be a Buffer");
    return this === e ? !0 : _.compare(this, e) === 0;
  };
  _.prototype.inspect = function () {
    let e = "",
      t = jt.INSPECT_MAX_BYTES;
    return (
      (e = this.toString("hex", 0, t)
        .replace(/(.{2})/g, "$1 ")
        .trim()),
      this.length > t && (e += " ... "),
      "<Buffer " + e + ">"
    );
  };
  ps && (_.prototype[ps] = _.prototype.inspect);
  _.prototype.compare = function (e, t, r, n, o) {
    if (
      (Ue(e, Uint8Array) && (e = _.from(e, e.offset, e.byteLength)),
      !_.isBuffer(e))
    )
      throw new TypeError(
        'The "target" argument must be one of type Buffer or Uint8Array. Received type ' +
          typeof e
      );
    if (
      (t === void 0 && (t = 0),
      r === void 0 && (r = e ? e.length : 0),
      n === void 0 && (n = 0),
      o === void 0 && (o = this.length),
      t < 0 || r > e.length || n < 0 || o > this.length)
    )
      throw new RangeError("out of range index");
    if (n >= o && t >= r) return 0;
    if (n >= o) return -1;
    if (t >= r) return 1;
    if (((t >>>= 0), (r >>>= 0), (n >>>= 0), (o >>>= 0), this === e)) return 0;
    let i = o - n,
      s = r - t,
      a = Math.min(i, s),
      c = this.slice(n, o),
      l = e.slice(t, r);
    for (let f = 0; f < a; ++f)
      if (c[f] !== l[f]) {
        (i = c[f]), (s = l[f]);
        break;
      }
    return i < s ? -1 : s < i ? 1 : 0;
  };
  function vs(e, t, r, n, o) {
    if (e.length === 0) return -1;
    if (
      (typeof r == "string"
        ? ((n = r), (r = 0))
        : r > 2147483647
        ? (r = 2147483647)
        : r < -2147483648 && (r = -2147483648),
      (r = +r),
      Io(r) && (r = o ? 0 : e.length - 1),
      r < 0 && (r = e.length + r),
      r >= e.length)
    ) {
      if (o) return -1;
      r = e.length - 1;
    } else if (r < 0)
      if (o) r = 0;
      else return -1;
    if ((typeof t == "string" && (t = _.from(t, n)), _.isBuffer(t)))
      return t.length === 0 ? -1 : ms(e, t, r, n, o);
    if (typeof t == "number")
      return (
        (t = t & 255),
        typeof Uint8Array.prototype.indexOf == "function"
          ? o
            ? Uint8Array.prototype.indexOf.call(e, t, r)
            : Uint8Array.prototype.lastIndexOf.call(e, t, r)
          : ms(e, [t], r, n, o)
      );
    throw new TypeError("val must be string, number or Buffer");
  }
  u(vs, "rr");
  function ms(e, t, r, n, o) {
    let i = 1,
      s = e.length,
      a = t.length;
    if (
      n !== void 0 &&
      ((n = String(n).toLowerCase()),
      n === "ucs2" || n === "ucs-2" || n === "utf16le" || n === "utf-16le")
    ) {
      if (e.length < 2 || t.length < 2) return -1;
      (i = 2), (s /= 2), (a /= 2), (r /= 2);
    }
    function c(f, g) {
      return i === 1 ? f[g] : f.readUInt16BE(g * i);
    }
    u(c, "c");
    let l;
    if (o) {
      let f = -1;
      for (l = r; l < s; l++)
        if (c(e, l) === c(t, f === -1 ? 0 : l - f)) {
          if ((f === -1 && (f = l), l - f + 1 === a)) return f * i;
        } else f !== -1 && (l -= l - f), (f = -1);
    } else
      for (r + a > s && (r = s - a), l = r; l >= 0; l--) {
        let f = !0;
        for (let g = 0; g < a; g++)
          if (c(e, l + g) !== c(t, g)) {
            f = !1;
            break;
          }
        if (f) return l;
      }
    return -1;
  }
  u(ms, "z");
  _.prototype.includes = function (e, t, r) {
    return this.indexOf(e, t, r) !== -1;
  };
  _.prototype.indexOf = function (e, t, r) {
    return vs(this, e, t, r, !0);
  };
  _.prototype.lastIndexOf = function (e, t, r) {
    return vs(this, e, t, r, !1);
  };
  function kl(e, t, r, n) {
    r = Number(r) || 0;
    let o = e.length - r;
    n ? ((n = Number(n)), n > o && (n = o)) : (n = o);
    let i = t.length;
    n > i / 2 && (n = i / 2);
    let s;
    for (s = 0; s < n; ++s) {
      let a = parseInt(t.substr(s * 2, 2), 16);
      if (Io(a)) return s;
      e[r + s] = a;
    }
    return s;
  }
  u(kl, "Ar");
  function jl(e, t, r, n) {
    return xn(So(t, e.length - r), e, r, n);
  }
  u(jl, "Ur");
  function $l(e, t, r, n) {
    return xn(Ql(t), e, r, n);
  }
  u($l, "Rr");
  function Ll(e, t, r, n) {
    return xn(_s(t), e, r, n);
  }
  u(Ll, "Tr");
  function Bl(e, t, r, n) {
    return xn(Yl(t, e.length - r), e, r, n);
  }
  u(Bl, "Cr");
  _.prototype.write = function (e, t, r, n) {
    if (t === void 0) (n = "utf8"), (r = this.length), (t = 0);
    else if (r === void 0 && typeof t == "string")
      (n = t), (r = this.length), (t = 0);
    else if (isFinite(t))
      (t = t >>> 0),
        isFinite(r)
          ? ((r = r >>> 0), n === void 0 && (n = "utf8"))
          : ((n = r), (r = void 0));
    else
      throw new Error(
        "Buffer.write(string, encoding, offset[, length]) is no longer supported"
      );
    let o = this.length - t;
    if (
      ((r === void 0 || r > o) && (r = o),
      (e.length > 0 && (r < 0 || t < 0)) || t > this.length)
    )
      throw new RangeError("Attempt to write outside buffer bounds");
    n || (n = "utf8");
    let i = !1;
    for (;;)
      switch (n) {
        case "hex":
          return kl(this, e, t, r);
        case "utf8":
        case "utf-8":
          return jl(this, e, t, r);
        case "ascii":
        case "latin1":
        case "binary":
          return $l(this, e, t, r);
        case "base64":
          return Ll(this, e, t, r);
        case "ucs2":
        case "ucs-2":
        case "utf16le":
        case "utf-16le":
          return Bl(this, e, t, r);
        default:
          if (i) throw new TypeError("Unknown encoding: " + n);
          (n = ("" + n).toLowerCase()), (i = !0);
      }
  };
  _.prototype.toJSON = function () {
    return {
      type: "Buffer",
      data: Array.prototype.slice.call(this._arr || this, 0),
    };
  };
  function ql(e, t, r) {
    return t === 0 && r === e.length
      ? Po.fromByteArray(e)
      : Po.fromByteArray(e.slice(t, r));
  }
  u(ql, "Sr");
  function Es(e, t, r) {
    r = Math.min(e.length, r);
    let n = [],
      o = t;
    for (; o < r; ) {
      let i = e[o],
        s = null,
        a = i > 239 ? 4 : i > 223 ? 3 : i > 191 ? 2 : 1;
      if (o + a <= r) {
        let c, l, f, g;
        switch (a) {
          case 1:
            i < 128 && (s = i);
            break;
          case 2:
            (c = e[o + 1]),
              (c & 192) === 128 &&
                ((g = ((i & 31) << 6) | (c & 63)), g > 127 && (s = g));
            break;
          case 3:
            (c = e[o + 1]),
              (l = e[o + 2]),
              (c & 192) === 128 &&
                (l & 192) === 128 &&
                ((g = ((i & 15) << 12) | ((c & 63) << 6) | (l & 63)),
                g > 2047 && (g < 55296 || g > 57343) && (s = g));
            break;
          case 4:
            (c = e[o + 1]),
              (l = e[o + 2]),
              (f = e[o + 3]),
              (c & 192) === 128 &&
                (l & 192) === 128 &&
                (f & 192) === 128 &&
                ((g =
                  ((i & 15) << 18) |
                  ((c & 63) << 12) |
                  ((l & 63) << 6) |
                  (f & 63)),
                g > 65535 && g < 1114112 && (s = g));
        }
      }
      s === null
        ? ((s = 65533), (a = 1))
        : s > 65535 &&
          ((s -= 65536),
          n.push(((s >>> 10) & 1023) | 55296),
          (s = 56320 | (s & 1023))),
        n.push(s),
        (o += a);
    }
    return Ul(n);
  }
  u(Es, "tr");
  var ds = 4096;
  function Ul(e) {
    let t = e.length;
    if (t <= ds) return String.fromCharCode.apply(String, e);
    let r = "",
      n = 0;
    for (; n < t; )
      r += String.fromCharCode.apply(String, e.slice(n, (n += ds)));
    return r;
  }
  u(Ul, "_r");
  function Vl(e, t, r) {
    let n = "";
    r = Math.min(e.length, r);
    for (let o = t; o < r; ++o) n += String.fromCharCode(e[o] & 127);
    return n;
  }
  u(Vl, "Lr");
  function Gl(e, t, r) {
    let n = "";
    r = Math.min(e.length, r);
    for (let o = t; o < r; ++o) n += String.fromCharCode(e[o]);
    return n;
  }
  u(Gl, "Nr");
  function Jl(e, t, r) {
    let n = e.length;
    (!t || t < 0) && (t = 0), (!r || r < 0 || r > n) && (r = n);
    let o = "";
    for (let i = t; i < r; ++i) o += Zl[e[i]];
    return o;
  }
  u(Jl, "Mr");
  function zl(e, t, r) {
    let n = e.slice(t, r),
      o = "";
    for (let i = 0; i < n.length - 1; i += 2)
      o += String.fromCharCode(n[i] + n[i + 1] * 256);
    return o;
  }
  u(zl, "kr");
  _.prototype.slice = function (e, t) {
    let r = this.length;
    (e = ~~e),
      (t = t === void 0 ? r : ~~t),
      e < 0 ? ((e += r), e < 0 && (e = 0)) : e > r && (e = r),
      t < 0 ? ((t += r), t < 0 && (t = 0)) : t > r && (t = r),
      t < e && (t = e);
    let n = this.subarray(e, t);
    return Object.setPrototypeOf(n, _.prototype), n;
  };
  function se(e, t, r) {
    if (e % 1 !== 0 || e < 0) throw new RangeError("offset is not uint");
    if (e + t > r)
      throw new RangeError("Trying to access beyond buffer length");
  }
  u(se, "a");
  _.prototype.readUintLE = _.prototype.readUIntLE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || se(e, t, this.length);
    let n = this[e],
      o = 1,
      i = 0;
    for (; ++i < t && (o *= 256); ) n += this[e + i] * o;
    return n;
  };
  _.prototype.readUintBE = _.prototype.readUIntBE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || se(e, t, this.length);
    let n = this[e + --t],
      o = 1;
    for (; t > 0 && (o *= 256); ) n += this[e + --t] * o;
    return n;
  };
  _.prototype.readUint8 = _.prototype.readUInt8 = function (e, t) {
    return (e = e >>> 0), t || se(e, 1, this.length), this[e];
  };
  _.prototype.readUint16LE = _.prototype.readUInt16LE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 2, this.length), this[e] | (this[e + 1] << 8)
    );
  };
  _.prototype.readUint16BE = _.prototype.readUInt16BE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 2, this.length), (this[e] << 8) | this[e + 1]
    );
  };
  _.prototype.readUint32LE = _.prototype.readUInt32LE = function (e, t) {
    return (
      (e = e >>> 0),
      t || se(e, 4, this.length),
      (this[e] | (this[e + 1] << 8) | (this[e + 2] << 16)) +
        this[e + 3] * 16777216
    );
  };
  _.prototype.readUint32BE = _.prototype.readUInt32BE = function (e, t) {
    return (
      (e = e >>> 0),
      t || se(e, 4, this.length),
      this[e] * 16777216 +
        ((this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3])
    );
  };
  _.prototype.readBigUInt64LE = ot(function (e) {
    (e = e >>> 0), kt(e, "offset");
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && hr(e, this.length - 8);
    let n = t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24,
      o = this[++e] + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + r * 2 ** 24;
    return BigInt(n) + (BigInt(o) << BigInt(32));
  });
  _.prototype.readBigUInt64BE = ot(function (e) {
    (e = e >>> 0), kt(e, "offset");
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && hr(e, this.length - 8);
    let n = t * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e],
      o = this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r;
    return (BigInt(n) << BigInt(32)) + BigInt(o);
  });
  _.prototype.readIntLE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || se(e, t, this.length);
    let n = this[e],
      o = 1,
      i = 0;
    for (; ++i < t && (o *= 256); ) n += this[e + i] * o;
    return (o *= 128), n >= o && (n -= Math.pow(2, 8 * t)), n;
  };
  _.prototype.readIntBE = function (e, t, r) {
    (e = e >>> 0), (t = t >>> 0), r || se(e, t, this.length);
    let n = t,
      o = 1,
      i = this[e + --n];
    for (; n > 0 && (o *= 256); ) i += this[e + --n] * o;
    return (o *= 128), i >= o && (i -= Math.pow(2, 8 * t)), i;
  };
  _.prototype.readInt8 = function (e, t) {
    return (
      (e = e >>> 0),
      t || se(e, 1, this.length),
      this[e] & 128 ? (255 - this[e] + 1) * -1 : this[e]
    );
  };
  _.prototype.readInt16LE = function (e, t) {
    (e = e >>> 0), t || se(e, 2, this.length);
    let r = this[e] | (this[e + 1] << 8);
    return r & 32768 ? r | 4294901760 : r;
  };
  _.prototype.readInt16BE = function (e, t) {
    (e = e >>> 0), t || se(e, 2, this.length);
    let r = this[e + 1] | (this[e] << 8);
    return r & 32768 ? r | 4294901760 : r;
  };
  _.prototype.readInt32LE = function (e, t) {
    return (
      (e = e >>> 0),
      t || se(e, 4, this.length),
      this[e] | (this[e + 1] << 8) | (this[e + 2] << 16) | (this[e + 3] << 24)
    );
  };
  _.prototype.readInt32BE = function (e, t) {
    return (
      (e = e >>> 0),
      t || se(e, 4, this.length),
      (this[e] << 24) | (this[e + 1] << 16) | (this[e + 2] << 8) | this[e + 3]
    );
  };
  _.prototype.readBigInt64LE = ot(function (e) {
    (e = e >>> 0), kt(e, "offset");
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && hr(e, this.length - 8);
    let n =
      this[e + 4] + this[e + 5] * 2 ** 8 + this[e + 6] * 2 ** 16 + (r << 24);
    return (
      (BigInt(n) << BigInt(32)) +
      BigInt(t + this[++e] * 2 ** 8 + this[++e] * 2 ** 16 + this[++e] * 2 ** 24)
    );
  });
  _.prototype.readBigInt64BE = ot(function (e) {
    (e = e >>> 0), kt(e, "offset");
    let t = this[e],
      r = this[e + 7];
    (t === void 0 || r === void 0) && hr(e, this.length - 8);
    let n = (t << 24) + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + this[++e];
    return (
      (BigInt(n) << BigInt(32)) +
      BigInt(this[++e] * 2 ** 24 + this[++e] * 2 ** 16 + this[++e] * 2 ** 8 + r)
    );
  });
  _.prototype.readFloatLE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 4, this.length), Nt.read(this, e, !0, 23, 4)
    );
  };
  _.prototype.readFloatBE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 4, this.length), Nt.read(this, e, !1, 23, 4)
    );
  };
  _.prototype.readDoubleLE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 8, this.length), Nt.read(this, e, !0, 52, 8)
    );
  };
  _.prototype.readDoubleBE = function (e, t) {
    return (
      (e = e >>> 0), t || se(e, 8, this.length), Nt.read(this, e, !1, 52, 8)
    );
  };
  function xe(e, t, r, n, o, i) {
    if (!_.isBuffer(e))
      throw new TypeError('"buffer" argument must be a Buffer instance');
    if (t > o || t < i)
      throw new RangeError('"value" argument is out of bounds');
    if (r + n > e.length) throw new RangeError("Index out of range");
  }
  u(xe, "y");
  _.prototype.writeUintLE = _.prototype.writeUIntLE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), (r = r >>> 0), !n)) {
      let s = Math.pow(2, 8 * r) - 1;
      xe(this, e, t, r, s, 0);
    }
    let o = 1,
      i = 0;
    for (this[t] = e & 255; ++i < r && (o *= 256); )
      this[t + i] = (e / o) & 255;
    return t + r;
  };
  _.prototype.writeUintBE = _.prototype.writeUIntBE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), (r = r >>> 0), !n)) {
      let s = Math.pow(2, 8 * r) - 1;
      xe(this, e, t, r, s, 0);
    }
    let o = r - 1,
      i = 1;
    for (this[t + o] = e & 255; --o >= 0 && (i *= 256); )
      this[t + o] = (e / i) & 255;
    return t + r;
  };
  _.prototype.writeUint8 = _.prototype.writeUInt8 = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 1, 255, 0),
      (this[t] = e & 255),
      t + 1
    );
  };
  _.prototype.writeUint16LE = _.prototype.writeUInt16LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 2, 65535, 0),
      (this[t] = e & 255),
      (this[t + 1] = e >>> 8),
      t + 2
    );
  };
  _.prototype.writeUint16BE = _.prototype.writeUInt16BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 2, 65535, 0),
      (this[t] = e >>> 8),
      (this[t + 1] = e & 255),
      t + 2
    );
  };
  _.prototype.writeUint32LE = _.prototype.writeUInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 4, 4294967295, 0),
      (this[t + 3] = e >>> 24),
      (this[t + 2] = e >>> 16),
      (this[t + 1] = e >>> 8),
      (this[t] = e & 255),
      t + 4
    );
  };
  _.prototype.writeUint32BE = _.prototype.writeUInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 4, 4294967295, 0),
      (this[t] = e >>> 24),
      (this[t + 1] = e >>> 16),
      (this[t + 2] = e >>> 8),
      (this[t + 3] = e & 255),
      t + 4
    );
  };
  function Ts(e, t, r, n, o) {
    Os(t, n, o, e, r, 7);
    let i = Number(t & BigInt(4294967295));
    (e[r++] = i),
      (i = i >> 8),
      (e[r++] = i),
      (i = i >> 8),
      (e[r++] = i),
      (i = i >> 8),
      (e[r++] = i);
    let s = Number((t >> BigInt(32)) & BigInt(4294967295));
    return (
      (e[r++] = s),
      (s = s >> 8),
      (e[r++] = s),
      (s = s >> 8),
      (e[r++] = s),
      (s = s >> 8),
      (e[r++] = s),
      r
    );
  }
  u(Ts, "ir");
  function As(e, t, r, n, o) {
    Os(t, n, o, e, r, 7);
    let i = Number(t & BigInt(4294967295));
    (e[r + 7] = i),
      (i = i >> 8),
      (e[r + 6] = i),
      (i = i >> 8),
      (e[r + 5] = i),
      (i = i >> 8),
      (e[r + 4] = i);
    let s = Number((t >> BigInt(32)) & BigInt(4294967295));
    return (
      (e[r + 3] = s),
      (s = s >> 8),
      (e[r + 2] = s),
      (s = s >> 8),
      (e[r + 1] = s),
      (s = s >> 8),
      (e[r] = s),
      r + 8
    );
  }
  u(As, "nr");
  _.prototype.writeBigUInt64LE = ot(function (e, t = 0) {
    return Ts(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  _.prototype.writeBigUInt64BE = ot(function (e, t = 0) {
    return As(this, e, t, BigInt(0), BigInt("0xffffffffffffffff"));
  });
  _.prototype.writeIntLE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), !n)) {
      let a = Math.pow(2, 8 * r - 1);
      xe(this, e, t, r, a - 1, -a);
    }
    let o = 0,
      i = 1,
      s = 0;
    for (this[t] = e & 255; ++o < r && (i *= 256); )
      e < 0 && s === 0 && this[t + o - 1] !== 0 && (s = 1),
        (this[t + o] = (((e / i) >> 0) - s) & 255);
    return t + r;
  };
  _.prototype.writeIntBE = function (e, t, r, n) {
    if (((e = +e), (t = t >>> 0), !n)) {
      let a = Math.pow(2, 8 * r - 1);
      xe(this, e, t, r, a - 1, -a);
    }
    let o = r - 1,
      i = 1,
      s = 0;
    for (this[t + o] = e & 255; --o >= 0 && (i *= 256); )
      e < 0 && s === 0 && this[t + o + 1] !== 0 && (s = 1),
        (this[t + o] = (((e / i) >> 0) - s) & 255);
    return t + r;
  };
  _.prototype.writeInt8 = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 1, 127, -128),
      e < 0 && (e = 255 + e + 1),
      (this[t] = e & 255),
      t + 1
    );
  };
  _.prototype.writeInt16LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 2, 32767, -32768),
      (this[t] = e & 255),
      (this[t + 1] = e >>> 8),
      t + 2
    );
  };
  _.prototype.writeInt16BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 2, 32767, -32768),
      (this[t] = e >>> 8),
      (this[t + 1] = e & 255),
      t + 2
    );
  };
  _.prototype.writeInt32LE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 4, 2147483647, -2147483648),
      (this[t] = e & 255),
      (this[t + 1] = e >>> 8),
      (this[t + 2] = e >>> 16),
      (this[t + 3] = e >>> 24),
      t + 4
    );
  };
  _.prototype.writeInt32BE = function (e, t, r) {
    return (
      (e = +e),
      (t = t >>> 0),
      r || xe(this, e, t, 4, 2147483647, -2147483648),
      e < 0 && (e = 4294967295 + e + 1),
      (this[t] = e >>> 24),
      (this[t + 1] = e >>> 16),
      (this[t + 2] = e >>> 8),
      (this[t + 3] = e & 255),
      t + 4
    );
  };
  _.prototype.writeBigInt64LE = ot(function (e, t = 0) {
    return Ts(
      this,
      e,
      t,
      -BigInt("0x8000000000000000"),
      BigInt("0x7fffffffffffffff")
    );
  });
  _.prototype.writeBigInt64BE = ot(function (e, t = 0) {
    return As(
      this,
      e,
      t,
      -BigInt("0x8000000000000000"),
      BigInt("0x7fffffffffffffff")
    );
  });
  function Ps(e, t, r, n, o, i) {
    if (r + n > e.length) throw new RangeError("Index out of range");
    if (r < 0) throw new RangeError("Index out of range");
  }
  u(Ps, "er");
  function Ms(e, t, r, n, o) {
    return (
      (t = +t),
      (r = r >>> 0),
      o || Ps(e, t, r, 4, 34028234663852886e22, -34028234663852886e22),
      Nt.write(e, t, r, n, 23, 4),
      r + 4
    );
  }
  u(Ms, "or");
  _.prototype.writeFloatLE = function (e, t, r) {
    return Ms(this, e, t, !0, r);
  };
  _.prototype.writeFloatBE = function (e, t, r) {
    return Ms(this, e, t, !1, r);
  };
  function Ss(e, t, r, n, o) {
    return (
      (t = +t),
      (r = r >>> 0),
      o || Ps(e, t, r, 8, 17976931348623157e292, -17976931348623157e292),
      Nt.write(e, t, r, n, 52, 8),
      r + 8
    );
  }
  u(Ss, "ur");
  _.prototype.writeDoubleLE = function (e, t, r) {
    return Ss(this, e, t, !0, r);
  };
  _.prototype.writeDoubleBE = function (e, t, r) {
    return Ss(this, e, t, !1, r);
  };
  _.prototype.copy = function (e, t, r, n) {
    if (!_.isBuffer(e)) throw new TypeError("argument should be a Buffer");
    if (
      (r || (r = 0),
      !n && n !== 0 && (n = this.length),
      t >= e.length && (t = e.length),
      t || (t = 0),
      n > 0 && n < r && (n = r),
      n === r || e.length === 0 || this.length === 0)
    )
      return 0;
    if (t < 0) throw new RangeError("targetStart out of bounds");
    if (r < 0 || r >= this.length) throw new RangeError("Index out of range");
    if (n < 0) throw new RangeError("sourceEnd out of bounds");
    n > this.length && (n = this.length),
      e.length - t < n - r && (n = e.length - t + r);
    let o = n - r;
    return (
      this === e && typeof Uint8Array.prototype.copyWithin == "function"
        ? this.copyWithin(t, r, n)
        : Uint8Array.prototype.set.call(e, this.subarray(r, n), t),
      o
    );
  };
  _.prototype.fill = function (e, t, r, n) {
    if (typeof e == "string") {
      if (
        (typeof t == "string"
          ? ((n = t), (t = 0), (r = this.length))
          : typeof r == "string" && ((n = r), (r = this.length)),
        n !== void 0 && typeof n != "string")
      )
        throw new TypeError("encoding must be a string");
      if (typeof n == "string" && !_.isEncoding(n))
        throw new TypeError("Unknown encoding: " + n);
      if (e.length === 1) {
        let i = e.charCodeAt(0);
        ((n === "utf8" && i < 128) || n === "latin1") && (e = i);
      }
    } else
      typeof e == "number"
        ? (e = e & 255)
        : typeof e == "boolean" && (e = Number(e));
    if (t < 0 || this.length < t || this.length < r)
      throw new RangeError("Out of range index");
    if (r <= t) return this;
    (t = t >>> 0), (r = r === void 0 ? this.length : r >>> 0), e || (e = 0);
    let o;
    if (typeof e == "number") for (o = t; o < r; ++o) this[o] = e;
    else {
      let i = _.isBuffer(e) ? e : _.from(e, n),
        s = i.length;
      if (s === 0)
        throw new TypeError(
          'The value "' + e + '" is invalid for argument "value"'
        );
      for (o = 0; o < r - t; ++o) this[o + t] = i[o % s];
    }
    return this;
  };
  var Dt = {};
  function Co(e, t, r) {
    Dt[e] = class extends r {
      constructor() {
        super(),
          Object.defineProperty(this, "message", {
            value: t.apply(this, arguments),
            writable: !0,
            configurable: !0,
          }),
          (this.name = `${this.name} [${e}]`),
          this.stack,
          delete this.name;
      }
      get code() {
        return e;
      }
      set code(n) {
        Object.defineProperty(this, "code", {
          configurable: !0,
          enumerable: !0,
          value: n,
          writable: !0,
        });
      }
      toString() {
        return `${this.name} [${e}]: ${this.message}`;
      }
    };
  }
  u(Co, "G");
  Co(
    "ERR_BUFFER_OUT_OF_BOUNDS",
    function (e) {
      return e
        ? `${e} is outside of buffer bounds`
        : "Attempt to access memory outside buffer bounds";
    },
    RangeError
  );
  Co(
    "ERR_INVALID_ARG_TYPE",
    function (e, t) {
      return `The "${e}" argument must be of type number. Received type ${typeof t}`;
    },
    TypeError
  );
  Co(
    "ERR_OUT_OF_RANGE",
    function (e, t, r) {
      let n = `The value of "${e}" is out of range.`,
        o = r;
      return (
        Number.isInteger(r) && Math.abs(r) > 2 ** 32
          ? (o = gs(String(r)))
          : typeof r == "bigint" &&
            ((o = String(r)),
            (r > BigInt(2) ** BigInt(32) || r < -(BigInt(2) ** BigInt(32))) &&
              (o = gs(o)),
            (o += "n")),
        (n += ` It must be ${t}. Received ${o}`),
        n
      );
    },
    RangeError
  );
  function gs(e) {
    let t = "",
      r = e.length,
      n = e[0] === "-" ? 1 : 0;
    for (; r >= n + 4; r -= 3) t = `_${e.slice(r - 3, r)}${t}`;
    return `${e.slice(0, r)}${t}`;
  }
  u(gs, "K");
  function Hl(e, t, r) {
    kt(t, "offset"),
      (e[t] === void 0 || e[t + r] === void 0) && hr(t, e.length - (r + 1));
  }
  u(Hl, "Dr");
  function Os(e, t, r, n, o, i) {
    if (e > r || e < t) {
      let s = typeof t == "bigint" ? "n" : "",
        a;
      throw (
        (i > 3
          ? t === 0 || t === BigInt(0)
            ? (a = `>= 0${s} and < 2${s} ** ${(i + 1) * 8}${s}`)
            : (a = `>= -(2${s} ** ${(i + 1) * 8 - 1}${s}) and < 2 ** ${
                (i + 1) * 8 - 1
              }${s}`)
          : (a = `>= ${t}${s} and <= ${r}${s}`),
        new Dt.ERR_OUT_OF_RANGE("value", a, e))
      );
    }
    Hl(n, o, i);
  }
  u(Os, "hr");
  function kt(e, t) {
    if (typeof e != "number") throw new Dt.ERR_INVALID_ARG_TYPE(t, "number", e);
  }
  u(kt, "R");
  function hr(e, t, r) {
    throw Math.floor(e) !== e
      ? (kt(e, r), new Dt.ERR_OUT_OF_RANGE(r || "offset", "an integer", e))
      : t < 0
      ? new Dt.ERR_BUFFER_OUT_OF_BOUNDS()
      : new Dt.ERR_OUT_OF_RANGE(
          r || "offset",
          `>= ${r ? 1 : 0} and <= ${t}`,
          e
        );
  }
  u(hr, "T");
  var Wl = /[^+/0-9A-Za-z-_]/g;
  function Kl(e) {
    if (((e = e.split("=")[0]), (e = e.trim().replace(Wl, "")), e.length < 2))
      return "";
    for (; e.length % 4 !== 0; ) e = e + "=";
    return e;
  }
  u(Kl, "br");
  function So(e, t) {
    t = t || 1 / 0;
    let r,
      n = e.length,
      o = null,
      i = [];
    for (let s = 0; s < n; ++s) {
      if (((r = e.charCodeAt(s)), r > 55295 && r < 57344)) {
        if (!o) {
          if (r > 56319) {
            (t -= 3) > -1 && i.push(239, 191, 189);
            continue;
          } else if (s + 1 === n) {
            (t -= 3) > -1 && i.push(239, 191, 189);
            continue;
          }
          o = r;
          continue;
        }
        if (r < 56320) {
          (t -= 3) > -1 && i.push(239, 191, 189), (o = r);
          continue;
        }
        r = (((o - 55296) << 10) | (r - 56320)) + 65536;
      } else o && (t -= 3) > -1 && i.push(239, 191, 189);
      if (((o = null), r < 128)) {
        if ((t -= 1) < 0) break;
        i.push(r);
      } else if (r < 2048) {
        if ((t -= 2) < 0) break;
        i.push((r >> 6) | 192, (r & 63) | 128);
      } else if (r < 65536) {
        if ((t -= 3) < 0) break;
        i.push((r >> 12) | 224, ((r >> 6) & 63) | 128, (r & 63) | 128);
      } else if (r < 1114112) {
        if ((t -= 4) < 0) break;
        i.push(
          (r >> 18) | 240,
          ((r >> 12) & 63) | 128,
          ((r >> 6) & 63) | 128,
          (r & 63) | 128
        );
      } else throw new Error("Invalid code point");
    }
    return i;
  }
  u(So, "b");
  function Ql(e) {
    let t = [];
    for (let r = 0; r < e.length; ++r) t.push(e.charCodeAt(r) & 255);
    return t;
  }
  u(Ql, "Pr");
  function Yl(e, t) {
    let r,
      n,
      o,
      i = [];
    for (let s = 0; s < e.length && !((t -= 2) < 0); ++s)
      (r = e.charCodeAt(s)), (n = r >> 8), (o = r % 256), i.push(o), i.push(n);
    return i;
  }
  u(Yl, "Or");
  function _s(e) {
    return Po.toByteArray(Kl(e));
  }
  u(_s, "fr");
  function xn(e, t, r, n) {
    let o;
    for (o = 0; o < n && !(o + r >= t.length || o >= e.length); ++o)
      t[o + r] = e[o];
    return o;
  }
  u(xn, "_");
  function Ue(e, t) {
    return (
      e instanceof t ||
      (e != null &&
        e.constructor != null &&
        e.constructor.name != null &&
        e.constructor.name === t.name)
    );
  }
  u(Ue, "E");
  function Io(e) {
    return e !== e;
  }
  u(Io, "Y");
  var Zl = (function () {
    let e = "0123456789abcdef",
      t = new Array(256);
    for (let r = 0; r < 16; ++r) {
      let n = r * 16;
      for (let o = 0; o < 16; ++o) t[n + o] = e[r] + e[o];
    }
    return t;
  })();
  function ot(e) {
    return typeof BigInt > "u" ? Xl : e;
  }
  u(ot, "g");
  function Xl() {
    throw new Error("BigInt not supported");
  }
  u(Xl, "Yr");
});
var v,
  d = bn(() => {
    "use strict";
    v = ee(Cs());
  });
var Is = K((ey, vn) => {
  d();
  p();
  m();
  var ef = (function () {
    var e = String.fromCharCode,
      t = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
      r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+-$",
      n = {};
    function o(s, a) {
      if (!n[s]) {
        n[s] = {};
        for (var c = 0; c < s.length; c++) n[s][s.charAt(c)] = c;
      }
      return n[s][a];
    }
    u(o, "getBaseValue");
    var i = {
      compressToBase64: function (s) {
        if (s == null) return "";
        var a = i._compress(s, 6, function (c) {
          return t.charAt(c);
        });
        switch (a.length % 4) {
          default:
          case 0:
            return a;
          case 1:
            return a + "===";
          case 2:
            return a + "==";
          case 3:
            return a + "=";
        }
      },
      decompressFromBase64: function (s) {
        return s == null
          ? ""
          : s == ""
          ? null
          : i._decompress(s.length, 32, function (a) {
              return o(t, s.charAt(a));
            });
      },
      compressToUTF16: function (s) {
        return s == null
          ? ""
          : i._compress(s, 15, function (a) {
              return e(a + 32);
            }) + " ";
      },
      decompressFromUTF16: function (s) {
        return s == null
          ? ""
          : s == ""
          ? null
          : i._decompress(s.length, 16384, function (a) {
              return s.charCodeAt(a) - 32;
            });
      },
      compressToUint8Array: function (s) {
        for (
          var a = i.compress(s),
            c = new Uint8Array(a.length * 2),
            l = 0,
            f = a.length;
          l < f;
          l++
        ) {
          var g = a.charCodeAt(l);
          (c[l * 2] = g >>> 8), (c[l * 2 + 1] = g % 256);
        }
        return c;
      },
      decompressFromUint8Array: function (s) {
        if (s == null) return i.decompress(s);
        for (var a = new Array(s.length / 2), c = 0, l = a.length; c < l; c++)
          a[c] = s[c * 2] * 256 + s[c * 2 + 1];
        var f = [];
        return (
          a.forEach(function (g) {
            f.push(e(g));
          }),
          i.decompress(f.join(""))
        );
      },
      compressToEncodedURIComponent: function (s) {
        return s == null
          ? ""
          : i._compress(s, 6, function (a) {
              return r.charAt(a);
            });
      },
      decompressFromEncodedURIComponent: function (s) {
        return s == null
          ? ""
          : s == ""
          ? null
          : ((s = s.replace(/ /g, "+")),
            i._decompress(s.length, 32, function (a) {
              return o(r, s.charAt(a));
            }));
      },
      compress: function (s) {
        return i._compress(s, 16, function (a) {
          return e(a);
        });
      },
      _compress: function (s, a, c) {
        if (s == null) return "";
        var l,
          f,
          g = {},
          y = {},
          b = "",
          x = "",
          h = "",
          A = 2,
          M = 3,
          P = 2,
          S = [],
          T = 0,
          O = 0,
          R;
        for (R = 0; R < s.length; R += 1)
          if (
            ((b = s.charAt(R)),
            Object.prototype.hasOwnProperty.call(g, b) ||
              ((g[b] = M++), (y[b] = !0)),
            (x = h + b),
            Object.prototype.hasOwnProperty.call(g, x))
          )
            h = x;
          else {
            if (Object.prototype.hasOwnProperty.call(y, h)) {
              if (h.charCodeAt(0) < 256) {
                for (l = 0; l < P; l++)
                  (T = T << 1),
                    O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++;
                for (f = h.charCodeAt(0), l = 0; l < 8; l++)
                  (T = (T << 1) | (f & 1)),
                    O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                    (f = f >> 1);
              } else {
                for (f = 1, l = 0; l < P; l++)
                  (T = (T << 1) | f),
                    O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                    (f = 0);
                for (f = h.charCodeAt(0), l = 0; l < 16; l++)
                  (T = (T << 1) | (f & 1)),
                    O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                    (f = f >> 1);
              }
              A--, A == 0 && ((A = Math.pow(2, P)), P++), delete y[h];
            } else
              for (f = g[h], l = 0; l < P; l++)
                (T = (T << 1) | (f & 1)),
                  O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                  (f = f >> 1);
            A--,
              A == 0 && ((A = Math.pow(2, P)), P++),
              (g[x] = M++),
              (h = String(b));
          }
        if (h !== "") {
          if (Object.prototype.hasOwnProperty.call(y, h)) {
            if (h.charCodeAt(0) < 256) {
              for (l = 0; l < P; l++)
                (T = T << 1),
                  O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++;
              for (f = h.charCodeAt(0), l = 0; l < 8; l++)
                (T = (T << 1) | (f & 1)),
                  O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                  (f = f >> 1);
            } else {
              for (f = 1, l = 0; l < P; l++)
                (T = (T << 1) | f),
                  O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                  (f = 0);
              for (f = h.charCodeAt(0), l = 0; l < 16; l++)
                (T = (T << 1) | (f & 1)),
                  O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                  (f = f >> 1);
            }
            A--, A == 0 && ((A = Math.pow(2, P)), P++), delete y[h];
          } else
            for (f = g[h], l = 0; l < P; l++)
              (T = (T << 1) | (f & 1)),
                O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
                (f = f >> 1);
          A--, A == 0 && ((A = Math.pow(2, P)), P++);
        }
        for (f = 2, l = 0; l < P; l++)
          (T = (T << 1) | (f & 1)),
            O == a - 1 ? ((O = 0), S.push(c(T)), (T = 0)) : O++,
            (f = f >> 1);
        for (;;)
          if (((T = T << 1), O == a - 1)) {
            S.push(c(T));
            break;
          } else O++;
        return S.join("");
      },
      decompress: function (s) {
        return s == null
          ? ""
          : s == ""
          ? null
          : i._decompress(s.length, 32768, function (a) {
              return s.charCodeAt(a);
            });
      },
      _decompress: function (s, a, c) {
        var l = [],
          f,
          g = 4,
          y = 4,
          b = 3,
          x = "",
          h = [],
          A,
          M,
          P,
          S,
          T,
          O,
          R,
          F = { val: c(0), position: a, index: 1 };
        for (A = 0; A < 3; A += 1) l[A] = A;
        for (P = 0, T = Math.pow(2, 2), O = 1; O != T; )
          (S = F.val & F.position),
            (F.position >>= 1),
            F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
            (P |= (S > 0 ? 1 : 0) * O),
            (O <<= 1);
        switch ((f = P)) {
          case 0:
            for (P = 0, T = Math.pow(2, 8), O = 1; O != T; )
              (S = F.val & F.position),
                (F.position >>= 1),
                F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
                (P |= (S > 0 ? 1 : 0) * O),
                (O <<= 1);
            R = e(P);
            break;
          case 1:
            for (P = 0, T = Math.pow(2, 16), O = 1; O != T; )
              (S = F.val & F.position),
                (F.position >>= 1),
                F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
                (P |= (S > 0 ? 1 : 0) * O),
                (O <<= 1);
            R = e(P);
            break;
          case 2:
            return "";
        }
        for (l[3] = R, M = R, h.push(R); ; ) {
          if (F.index > s) return "";
          for (P = 0, T = Math.pow(2, b), O = 1; O != T; )
            (S = F.val & F.position),
              (F.position >>= 1),
              F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
              (P |= (S > 0 ? 1 : 0) * O),
              (O <<= 1);
          switch ((R = P)) {
            case 0:
              for (P = 0, T = Math.pow(2, 8), O = 1; O != T; )
                (S = F.val & F.position),
                  (F.position >>= 1),
                  F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
                  (P |= (S > 0 ? 1 : 0) * O),
                  (O <<= 1);
              (l[y++] = e(P)), (R = y - 1), g--;
              break;
            case 1:
              for (P = 0, T = Math.pow(2, 16), O = 1; O != T; )
                (S = F.val & F.position),
                  (F.position >>= 1),
                  F.position == 0 && ((F.position = a), (F.val = c(F.index++))),
                  (P |= (S > 0 ? 1 : 0) * O),
                  (O <<= 1);
              (l[y++] = e(P)), (R = y - 1), g--;
              break;
            case 2:
              return h.join("");
          }
          if ((g == 0 && ((g = Math.pow(2, b)), b++), l[R])) x = l[R];
          else if (R === y) x = M + M.charAt(0);
          else return null;
          h.push(x),
            (l[y++] = M + x.charAt(0)),
            g--,
            (M = x),
            g == 0 && ((g = Math.pow(2, b)), b++);
        }
      },
    };
    return i;
  })();
  typeof vn != "undefined" && vn != null && (vn.exports = ef);
});
var Ns = K((Sy, Ds) => {
  "use strict";
  d();
  p();
  m();
  Ds.exports = {
    aliceblue: [240, 248, 255],
    antiquewhite: [250, 235, 215],
    aqua: [0, 255, 255],
    aquamarine: [127, 255, 212],
    azure: [240, 255, 255],
    beige: [245, 245, 220],
    bisque: [255, 228, 196],
    black: [0, 0, 0],
    blanchedalmond: [255, 235, 205],
    blue: [0, 0, 255],
    blueviolet: [138, 43, 226],
    brown: [165, 42, 42],
    burlywood: [222, 184, 135],
    cadetblue: [95, 158, 160],
    chartreuse: [127, 255, 0],
    chocolate: [210, 105, 30],
    coral: [255, 127, 80],
    cornflowerblue: [100, 149, 237],
    cornsilk: [255, 248, 220],
    crimson: [220, 20, 60],
    cyan: [0, 255, 255],
    darkblue: [0, 0, 139],
    darkcyan: [0, 139, 139],
    darkgoldenrod: [184, 134, 11],
    darkgray: [169, 169, 169],
    darkgreen: [0, 100, 0],
    darkgrey: [169, 169, 169],
    darkkhaki: [189, 183, 107],
    darkmagenta: [139, 0, 139],
    darkolivegreen: [85, 107, 47],
    darkorange: [255, 140, 0],
    darkorchid: [153, 50, 204],
    darkred: [139, 0, 0],
    darksalmon: [233, 150, 122],
    darkseagreen: [143, 188, 143],
    darkslateblue: [72, 61, 139],
    darkslategray: [47, 79, 79],
    darkslategrey: [47, 79, 79],
    darkturquoise: [0, 206, 209],
    darkviolet: [148, 0, 211],
    deeppink: [255, 20, 147],
    deepskyblue: [0, 191, 255],
    dimgray: [105, 105, 105],
    dimgrey: [105, 105, 105],
    dodgerblue: [30, 144, 255],
    firebrick: [178, 34, 34],
    floralwhite: [255, 250, 240],
    forestgreen: [34, 139, 34],
    fuchsia: [255, 0, 255],
    gainsboro: [220, 220, 220],
    ghostwhite: [248, 248, 255],
    gold: [255, 215, 0],
    goldenrod: [218, 165, 32],
    gray: [128, 128, 128],
    green: [0, 128, 0],
    greenyellow: [173, 255, 47],
    grey: [128, 128, 128],
    honeydew: [240, 255, 240],
    hotpink: [255, 105, 180],
    indianred: [205, 92, 92],
    indigo: [75, 0, 130],
    ivory: [255, 255, 240],
    khaki: [240, 230, 140],
    lavender: [230, 230, 250],
    lavenderblush: [255, 240, 245],
    lawngreen: [124, 252, 0],
    lemonchiffon: [255, 250, 205],
    lightblue: [173, 216, 230],
    lightcoral: [240, 128, 128],
    lightcyan: [224, 255, 255],
    lightgoldenrodyellow: [250, 250, 210],
    lightgray: [211, 211, 211],
    lightgreen: [144, 238, 144],
    lightgrey: [211, 211, 211],
    lightpink: [255, 182, 193],
    lightsalmon: [255, 160, 122],
    lightseagreen: [32, 178, 170],
    lightskyblue: [135, 206, 250],
    lightslategray: [119, 136, 153],
    lightslategrey: [119, 136, 153],
    lightsteelblue: [176, 196, 222],
    lightyellow: [255, 255, 224],
    lime: [0, 255, 0],
    limegreen: [50, 205, 50],
    linen: [250, 240, 230],
    magenta: [255, 0, 255],
    maroon: [128, 0, 0],
    mediumaquamarine: [102, 205, 170],
    mediumblue: [0, 0, 205],
    mediumorchid: [186, 85, 211],
    mediumpurple: [147, 112, 219],
    mediumseagreen: [60, 179, 113],
    mediumslateblue: [123, 104, 238],
    mediumspringgreen: [0, 250, 154],
    mediumturquoise: [72, 209, 204],
    mediumvioletred: [199, 21, 133],
    midnightblue: [25, 25, 112],
    mintcream: [245, 255, 250],
    mistyrose: [255, 228, 225],
    moccasin: [255, 228, 181],
    navajowhite: [255, 222, 173],
    navy: [0, 0, 128],
    oldlace: [253, 245, 230],
    olive: [128, 128, 0],
    olivedrab: [107, 142, 35],
    orange: [255, 165, 0],
    orangered: [255, 69, 0],
    orchid: [218, 112, 214],
    palegoldenrod: [238, 232, 170],
    palegreen: [152, 251, 152],
    paleturquoise: [175, 238, 238],
    palevioletred: [219, 112, 147],
    papayawhip: [255, 239, 213],
    peachpuff: [255, 218, 185],
    peru: [205, 133, 63],
    pink: [255, 192, 203],
    plum: [221, 160, 221],
    powderblue: [176, 224, 230],
    purple: [128, 0, 128],
    rebeccapurple: [102, 51, 153],
    red: [255, 0, 0],
    rosybrown: [188, 143, 143],
    royalblue: [65, 105, 225],
    saddlebrown: [139, 69, 19],
    salmon: [250, 128, 114],
    sandybrown: [244, 164, 96],
    seagreen: [46, 139, 87],
    seashell: [255, 245, 238],
    sienna: [160, 82, 45],
    silver: [192, 192, 192],
    skyblue: [135, 206, 235],
    slateblue: [106, 90, 205],
    slategray: [112, 128, 144],
    slategrey: [112, 128, 144],
    snow: [255, 250, 250],
    springgreen: [0, 255, 127],
    steelblue: [70, 130, 180],
    tan: [210, 180, 140],
    teal: [0, 128, 128],
    thistle: [216, 191, 216],
    tomato: [255, 99, 71],
    turquoise: [64, 224, 208],
    violet: [238, 130, 238],
    wheat: [245, 222, 179],
    white: [255, 255, 255],
    whitesmoke: [245, 245, 245],
    yellow: [255, 255, 0],
    yellowgreen: [154, 205, 50],
  };
});
var Fo = K((Iy, js) => {
  d();
  p();
  m();
  var br = Ns(),
    ks = {};
  for (let e of Object.keys(br)) ks[br[e]] = e;
  var N = {
    rgb: { channels: 3, labels: "rgb" },
    hsl: { channels: 3, labels: "hsl" },
    hsv: { channels: 3, labels: "hsv" },
    hwb: { channels: 3, labels: "hwb" },
    cmyk: { channels: 4, labels: "cmyk" },
    xyz: { channels: 3, labels: "xyz" },
    lab: { channels: 3, labels: "lab" },
    lch: { channels: 3, labels: "lch" },
    hex: { channels: 1, labels: ["hex"] },
    keyword: { channels: 1, labels: ["keyword"] },
    ansi16: { channels: 1, labels: ["ansi16"] },
    ansi256: { channels: 1, labels: ["ansi256"] },
    hcg: { channels: 3, labels: ["h", "c", "g"] },
    apple: { channels: 3, labels: ["r16", "g16", "b16"] },
    gray: { channels: 1, labels: ["gray"] },
  };
  js.exports = N;
  for (let e of Object.keys(N)) {
    if (!("channels" in N[e]))
      throw new Error("missing channels property: " + e);
    if (!("labels" in N[e]))
      throw new Error("missing channel labels property: " + e);
    if (N[e].labels.length !== N[e].channels)
      throw new Error("channel and label counts mismatch: " + e);
    let { channels: t, labels: r } = N[e];
    delete N[e].channels,
      delete N[e].labels,
      Object.defineProperty(N[e], "channels", { value: t }),
      Object.defineProperty(N[e], "labels", { value: r });
  }
  N.rgb.hsl = function (e) {
    let t = e[0] / 255,
      r = e[1] / 255,
      n = e[2] / 255,
      o = Math.min(t, r, n),
      i = Math.max(t, r, n),
      s = i - o,
      a,
      c;
    i === o
      ? (a = 0)
      : t === i
      ? (a = (r - n) / s)
      : r === i
      ? (a = 2 + (n - t) / s)
      : n === i && (a = 4 + (t - r) / s),
      (a = Math.min(a * 60, 360)),
      a < 0 && (a += 360);
    let l = (o + i) / 2;
    return (
      i === o ? (c = 0) : l <= 0.5 ? (c = s / (i + o)) : (c = s / (2 - i - o)),
      [a, c * 100, l * 100]
    );
  };
  N.rgb.hsv = function (e) {
    let t,
      r,
      n,
      o,
      i,
      s = e[0] / 255,
      a = e[1] / 255,
      c = e[2] / 255,
      l = Math.max(s, a, c),
      f = l - Math.min(s, a, c),
      g = u(function (y) {
        return (l - y) / 6 / f + 1 / 2;
      }, "diffc");
    return (
      f === 0
        ? ((o = 0), (i = 0))
        : ((i = f / l),
          (t = g(s)),
          (r = g(a)),
          (n = g(c)),
          s === l
            ? (o = n - r)
            : a === l
            ? (o = 1 / 3 + t - n)
            : c === l && (o = 2 / 3 + r - t),
          o < 0 ? (o += 1) : o > 1 && (o -= 1)),
      [o * 360, i * 100, l * 100]
    );
  };
  N.rgb.hwb = function (e) {
    let t = e[0],
      r = e[1],
      n = e[2],
      o = N.rgb.hsl(e)[0],
      i = (1 / 255) * Math.min(t, Math.min(r, n));
    return (
      (n = 1 - (1 / 255) * Math.max(t, Math.max(r, n))), [o, i * 100, n * 100]
    );
  };
  N.rgb.cmyk = function (e) {
    let t = e[0] / 255,
      r = e[1] / 255,
      n = e[2] / 255,
      o = Math.min(1 - t, 1 - r, 1 - n),
      i = (1 - t - o) / (1 - o) || 0,
      s = (1 - r - o) / (1 - o) || 0,
      a = (1 - n - o) / (1 - o) || 0;
    return [i * 100, s * 100, a * 100, o * 100];
  };
  function rf(e, t) {
    return (e[0] - t[0]) ** 2 + (e[1] - t[1]) ** 2 + (e[2] - t[2]) ** 2;
  }
  u(rf, "comparativeDistance");
  N.rgb.keyword = function (e) {
    let t = ks[e];
    if (t) return t;
    let r = 1 / 0,
      n;
    for (let o of Object.keys(br)) {
      let i = br[o],
        s = rf(e, i);
      s < r && ((r = s), (n = o));
    }
    return n;
  };
  N.keyword.rgb = function (e) {
    return br[e];
  };
  N.rgb.xyz = function (e) {
    let t = e[0] / 255,
      r = e[1] / 255,
      n = e[2] / 255;
    (t = t > 0.04045 ? ((t + 0.055) / 1.055) ** 2.4 : t / 12.92),
      (r = r > 0.04045 ? ((r + 0.055) / 1.055) ** 2.4 : r / 12.92),
      (n = n > 0.04045 ? ((n + 0.055) / 1.055) ** 2.4 : n / 12.92);
    let o = t * 0.4124 + r * 0.3576 + n * 0.1805,
      i = t * 0.2126 + r * 0.7152 + n * 0.0722,
      s = t * 0.0193 + r * 0.1192 + n * 0.9505;
    return [o * 100, i * 100, s * 100];
  };
  N.rgb.lab = function (e) {
    let t = N.rgb.xyz(e),
      r = t[0],
      n = t[1],
      o = t[2];
    (r /= 95.047),
      (n /= 100),
      (o /= 108.883),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116),
      (o = o > 0.008856 ? o ** (1 / 3) : 7.787 * o + 16 / 116);
    let i = 116 * n - 16,
      s = 500 * (r - n),
      a = 200 * (n - o);
    return [i, s, a];
  };
  N.hsl.rgb = function (e) {
    let t = e[0] / 360,
      r = e[1] / 100,
      n = e[2] / 100,
      o,
      i,
      s;
    if (r === 0) return (s = n * 255), [s, s, s];
    n < 0.5 ? (o = n * (1 + r)) : (o = n + r - n * r);
    let a = 2 * n - o,
      c = [0, 0, 0];
    for (let l = 0; l < 3; l++)
      (i = t + (1 / 3) * -(l - 1)),
        i < 0 && i++,
        i > 1 && i--,
        6 * i < 1
          ? (s = a + (o - a) * 6 * i)
          : 2 * i < 1
          ? (s = o)
          : 3 * i < 2
          ? (s = a + (o - a) * (2 / 3 - i) * 6)
          : (s = a),
        (c[l] = s * 255);
    return c;
  };
  N.hsl.hsv = function (e) {
    let t = e[0],
      r = e[1] / 100,
      n = e[2] / 100,
      o = r,
      i = Math.max(n, 0.01);
    (n *= 2), (r *= n <= 1 ? n : 2 - n), (o *= i <= 1 ? i : 2 - i);
    let s = (n + r) / 2,
      a = n === 0 ? (2 * o) / (i + o) : (2 * r) / (n + r);
    return [t, a * 100, s * 100];
  };
  N.hsv.rgb = function (e) {
    let t = e[0] / 60,
      r = e[1] / 100,
      n = e[2] / 100,
      o = Math.floor(t) % 6,
      i = t - Math.floor(t),
      s = 255 * n * (1 - r),
      a = 255 * n * (1 - r * i),
      c = 255 * n * (1 - r * (1 - i));
    switch (((n *= 255), o)) {
      case 0:
        return [n, c, s];
      case 1:
        return [a, n, s];
      case 2:
        return [s, n, c];
      case 3:
        return [s, a, n];
      case 4:
        return [c, s, n];
      case 5:
        return [n, s, a];
    }
  };
  N.hsv.hsl = function (e) {
    let t = e[0],
      r = e[1] / 100,
      n = e[2] / 100,
      o = Math.max(n, 0.01),
      i,
      s;
    s = (2 - r) * n;
    let a = (2 - r) * o;
    return (
      (i = r * o),
      (i /= a <= 1 ? a : 2 - a),
      (i = i || 0),
      (s /= 2),
      [t, i * 100, s * 100]
    );
  };
  N.hwb.rgb = function (e) {
    let t = e[0] / 360,
      r = e[1] / 100,
      n = e[2] / 100,
      o = r + n,
      i;
    o > 1 && ((r /= o), (n /= o));
    let s = Math.floor(6 * t),
      a = 1 - n;
    (i = 6 * t - s), (s & 1) !== 0 && (i = 1 - i);
    let c = r + i * (a - r),
      l,
      f,
      g;
    switch (s) {
      default:
      case 6:
      case 0:
        (l = a), (f = c), (g = r);
        break;
      case 1:
        (l = c), (f = a), (g = r);
        break;
      case 2:
        (l = r), (f = a), (g = c);
        break;
      case 3:
        (l = r), (f = c), (g = a);
        break;
      case 4:
        (l = c), (f = r), (g = a);
        break;
      case 5:
        (l = a), (f = r), (g = c);
        break;
    }
    return [l * 255, f * 255, g * 255];
  };
  N.cmyk.rgb = function (e) {
    let t = e[0] / 100,
      r = e[1] / 100,
      n = e[2] / 100,
      o = e[3] / 100,
      i = 1 - Math.min(1, t * (1 - o) + o),
      s = 1 - Math.min(1, r * (1 - o) + o),
      a = 1 - Math.min(1, n * (1 - o) + o);
    return [i * 255, s * 255, a * 255];
  };
  N.xyz.rgb = function (e) {
    let t = e[0] / 100,
      r = e[1] / 100,
      n = e[2] / 100,
      o,
      i,
      s;
    return (
      (o = t * 3.2406 + r * -1.5372 + n * -0.4986),
      (i = t * -0.9689 + r * 1.8758 + n * 0.0415),
      (s = t * 0.0557 + r * -0.204 + n * 1.057),
      (o = o > 0.0031308 ? 1.055 * o ** (1 / 2.4) - 0.055 : o * 12.92),
      (i = i > 0.0031308 ? 1.055 * i ** (1 / 2.4) - 0.055 : i * 12.92),
      (s = s > 0.0031308 ? 1.055 * s ** (1 / 2.4) - 0.055 : s * 12.92),
      (o = Math.min(Math.max(0, o), 1)),
      (i = Math.min(Math.max(0, i), 1)),
      (s = Math.min(Math.max(0, s), 1)),
      [o * 255, i * 255, s * 255]
    );
  };
  N.xyz.lab = function (e) {
    let t = e[0],
      r = e[1],
      n = e[2];
    (t /= 95.047),
      (r /= 100),
      (n /= 108.883),
      (t = t > 0.008856 ? t ** (1 / 3) : 7.787 * t + 16 / 116),
      (r = r > 0.008856 ? r ** (1 / 3) : 7.787 * r + 16 / 116),
      (n = n > 0.008856 ? n ** (1 / 3) : 7.787 * n + 16 / 116);
    let o = 116 * r - 16,
      i = 500 * (t - r),
      s = 200 * (r - n);
    return [o, i, s];
  };
  N.lab.xyz = function (e) {
    let t = e[0],
      r = e[1],
      n = e[2],
      o,
      i,
      s;
    (i = (t + 16) / 116), (o = r / 500 + i), (s = i - n / 200);
    let a = i ** 3,
      c = o ** 3,
      l = s ** 3;
    return (
      (i = a > 0.008856 ? a : (i - 16 / 116) / 7.787),
      (o = c > 0.008856 ? c : (o - 16 / 116) / 7.787),
      (s = l > 0.008856 ? l : (s - 16 / 116) / 7.787),
      (o *= 95.047),
      (i *= 100),
      (s *= 108.883),
      [o, i, s]
    );
  };
  N.lab.lch = function (e) {
    let t = e[0],
      r = e[1],
      n = e[2],
      o;
    (o = (Math.atan2(n, r) * 360) / 2 / Math.PI), o < 0 && (o += 360);
    let s = Math.sqrt(r * r + n * n);
    return [t, s, o];
  };
  N.lch.lab = function (e) {
    let t = e[0],
      r = e[1],
      o = (e[2] / 360) * 2 * Math.PI,
      i = r * Math.cos(o),
      s = r * Math.sin(o);
    return [t, i, s];
  };
  N.rgb.ansi16 = function (e, t = null) {
    let [r, n, o] = e,
      i = t === null ? N.rgb.hsv(e)[2] : t;
    if (((i = Math.round(i / 50)), i === 0)) return 30;
    let s =
      30 +
      ((Math.round(o / 255) << 2) |
        (Math.round(n / 255) << 1) |
        Math.round(r / 255));
    return i === 2 && (s += 60), s;
  };
  N.hsv.ansi16 = function (e) {
    return N.rgb.ansi16(N.hsv.rgb(e), e[2]);
  };
  N.rgb.ansi256 = function (e) {
    let t = e[0],
      r = e[1],
      n = e[2];
    return t === r && r === n
      ? t < 8
        ? 16
        : t > 248
        ? 231
        : Math.round(((t - 8) / 247) * 24) + 232
      : 16 +
          36 * Math.round((t / 255) * 5) +
          6 * Math.round((r / 255) * 5) +
          Math.round((n / 255) * 5);
  };
  N.ansi16.rgb = function (e) {
    let t = e % 10;
    if (t === 0 || t === 7)
      return e > 50 && (t += 3.5), (t = (t / 10.5) * 255), [t, t, t];
    let r = (~~(e > 50) + 1) * 0.5,
      n = (t & 1) * r * 255,
      o = ((t >> 1) & 1) * r * 255,
      i = ((t >> 2) & 1) * r * 255;
    return [n, o, i];
  };
  N.ansi256.rgb = function (e) {
    if (e >= 232) {
      let i = (e - 232) * 10 + 8;
      return [i, i, i];
    }
    e -= 16;
    let t,
      r = (Math.floor(e / 36) / 5) * 255,
      n = (Math.floor((t = e % 36) / 6) / 5) * 255,
      o = ((t % 6) / 5) * 255;
    return [r, n, o];
  };
  N.rgb.hex = function (e) {
    let r = (
      ((Math.round(e[0]) & 255) << 16) +
      ((Math.round(e[1]) & 255) << 8) +
      (Math.round(e[2]) & 255)
    )
      .toString(16)
      .toUpperCase();
    return "000000".substring(r.length) + r;
  };
  N.hex.rgb = function (e) {
    let t = e.toString(16).match(/[a-f0-9]{6}|[a-f0-9]{3}/i);
    if (!t) return [0, 0, 0];
    let r = t[0];
    t[0].length === 3 &&
      (r = r
        .split("")
        .map((a) => a + a)
        .join(""));
    let n = parseInt(r, 16),
      o = (n >> 16) & 255,
      i = (n >> 8) & 255,
      s = n & 255;
    return [o, i, s];
  };
  N.rgb.hcg = function (e) {
    let t = e[0] / 255,
      r = e[1] / 255,
      n = e[2] / 255,
      o = Math.max(Math.max(t, r), n),
      i = Math.min(Math.min(t, r), n),
      s = o - i,
      a,
      c;
    return (
      s < 1 ? (a = i / (1 - s)) : (a = 0),
      s <= 0
        ? (c = 0)
        : o === t
        ? (c = ((r - n) / s) % 6)
        : o === r
        ? (c = 2 + (n - t) / s)
        : (c = 4 + (t - r) / s),
      (c /= 6),
      (c %= 1),
      [c * 360, s * 100, a * 100]
    );
  };
  N.hsl.hcg = function (e) {
    let t = e[1] / 100,
      r = e[2] / 100,
      n = r < 0.5 ? 2 * t * r : 2 * t * (1 - r),
      o = 0;
    return n < 1 && (o = (r - 0.5 * n) / (1 - n)), [e[0], n * 100, o * 100];
  };
  N.hsv.hcg = function (e) {
    let t = e[1] / 100,
      r = e[2] / 100,
      n = t * r,
      o = 0;
    return n < 1 && (o = (r - n) / (1 - n)), [e[0], n * 100, o * 100];
  };
  N.hcg.rgb = function (e) {
    let t = e[0] / 360,
      r = e[1] / 100,
      n = e[2] / 100;
    if (r === 0) return [n * 255, n * 255, n * 255];
    let o = [0, 0, 0],
      i = (t % 1) * 6,
      s = i % 1,
      a = 1 - s,
      c = 0;
    switch (Math.floor(i)) {
      case 0:
        (o[0] = 1), (o[1] = s), (o[2] = 0);
        break;
      case 1:
        (o[0] = a), (o[1] = 1), (o[2] = 0);
        break;
      case 2:
        (o[0] = 0), (o[1] = 1), (o[2] = s);
        break;
      case 3:
        (o[0] = 0), (o[1] = a), (o[2] = 1);
        break;
      case 4:
        (o[0] = s), (o[1] = 0), (o[2] = 1);
        break;
      default:
        (o[0] = 1), (o[1] = 0), (o[2] = a);
    }
    return (
      (c = (1 - r) * n),
      [(r * o[0] + c) * 255, (r * o[1] + c) * 255, (r * o[2] + c) * 255]
    );
  };
  N.hcg.hsv = function (e) {
    let t = e[1] / 100,
      r = e[2] / 100,
      n = t + r * (1 - t),
      o = 0;
    return n > 0 && (o = t / n), [e[0], o * 100, n * 100];
  };
  N.hcg.hsl = function (e) {
    let t = e[1] / 100,
      n = (e[2] / 100) * (1 - t) + 0.5 * t,
      o = 0;
    return (
      n > 0 && n < 0.5
        ? (o = t / (2 * n))
        : n >= 0.5 && n < 1 && (o = t / (2 * (1 - n))),
      [e[0], o * 100, n * 100]
    );
  };
  N.hcg.hwb = function (e) {
    let t = e[1] / 100,
      r = e[2] / 100,
      n = t + r * (1 - t);
    return [e[0], (n - t) * 100, (1 - n) * 100];
  };
  N.hwb.hcg = function (e) {
    let t = e[1] / 100,
      n = 1 - e[2] / 100,
      o = n - t,
      i = 0;
    return o < 1 && (i = (n - o) / (1 - o)), [e[0], o * 100, i * 100];
  };
  N.apple.rgb = function (e) {
    return [(e[0] / 65535) * 255, (e[1] / 65535) * 255, (e[2] / 65535) * 255];
  };
  N.rgb.apple = function (e) {
    return [(e[0] / 255) * 65535, (e[1] / 255) * 65535, (e[2] / 255) * 65535];
  };
  N.gray.rgb = function (e) {
    return [(e[0] / 100) * 255, (e[0] / 100) * 255, (e[0] / 100) * 255];
  };
  N.gray.hsl = function (e) {
    return [0, 0, e[0]];
  };
  N.gray.hsv = N.gray.hsl;
  N.gray.hwb = function (e) {
    return [0, 100, e[0]];
  };
  N.gray.cmyk = function (e) {
    return [0, 0, 0, e[0]];
  };
  N.gray.lab = function (e) {
    return [e[0], 0, 0];
  };
  N.gray.hex = function (e) {
    let t = Math.round((e[0] / 100) * 255) & 255,
      n = ((t << 16) + (t << 8) + t).toString(16).toUpperCase();
    return "000000".substring(n.length) + n;
  };
  N.rgb.gray = function (e) {
    return [((e[0] + e[1] + e[2]) / 3 / 255) * 100];
  };
});
var Ls = K((ky, $s) => {
  d();
  p();
  m();
  var En = Fo();
  function nf() {
    let e = {},
      t = Object.keys(En);
    for (let r = t.length, n = 0; n < r; n++)
      e[t[n]] = { distance: -1, parent: null };
    return e;
  }
  u(nf, "buildGraph");
  function of(e) {
    let t = nf(),
      r = [e];
    for (t[e].distance = 0; r.length; ) {
      let n = r.pop(),
        o = Object.keys(En[n]);
      for (let i = o.length, s = 0; s < i; s++) {
        let a = o[s],
          c = t[a];
        c.distance === -1 &&
          ((c.distance = t[n].distance + 1), (c.parent = n), r.unshift(a));
      }
    }
    return t;
  }
  u(of, "deriveBFS");
  function sf(e, t) {
    return function (r) {
      return t(e(r));
    };
  }
  u(sf, "link");
  function af(e, t) {
    let r = [t[e].parent, e],
      n = En[t[e].parent][e],
      o = t[e].parent;
    for (; t[o].parent; )
      r.unshift(t[o].parent),
        (n = sf(En[t[o].parent][o], n)),
        (o = t[o].parent);
    return (n.conversion = r), n;
  }
  u(af, "wrapConversion");
  $s.exports = function (e) {
    let t = of(e),
      r = {},
      n = Object.keys(t);
    for (let o = n.length, i = 0; i < o; i++) {
      let s = n[i];
      t[s].parent !== null && (r[s] = af(s, t));
    }
    return r;
  };
});
var qs = K((qy, Bs) => {
  d();
  p();
  m();
  var Do = Fo(),
    uf = Ls(),
    Lt = {},
    cf = Object.keys(Do);
  function lf(e) {
    let t = u(function (...r) {
      let n = r[0];
      return n == null ? n : (n.length > 1 && (r = n), e(r));
    }, "wrappedFn");
    return "conversion" in e && (t.conversion = e.conversion), t;
  }
  u(lf, "wrapRaw");
  function ff(e) {
    let t = u(function (...r) {
      let n = r[0];
      if (n == null) return n;
      n.length > 1 && (r = n);
      let o = e(r);
      if (typeof o == "object")
        for (let i = o.length, s = 0; s < i; s++) o[s] = Math.round(o[s]);
      return o;
    }, "wrappedFn");
    return "conversion" in e && (t.conversion = e.conversion), t;
  }
  u(ff, "wrapRounded");
  cf.forEach((e) => {
    (Lt[e] = {}),
      Object.defineProperty(Lt[e], "channels", { value: Do[e].channels }),
      Object.defineProperty(Lt[e], "labels", { value: Do[e].labels });
    let t = uf(e);
    Object.keys(t).forEach((n) => {
      let o = t[n];
      (Lt[e][n] = ff(o)), (Lt[e][n].raw = lf(o));
    });
  });
  Bs.exports = Lt;
});
var Hs = K((zy, zs) => {
  "use strict";
  d();
  p();
  m();
  var Us = u(
      (e, t) =>
        (...r) =>
          `\x1B[${e(...r) + t}m`,
      "wrapAnsi16"
    ),
    Vs = u(
      (e, t) =>
        (...r) => {
          let n = e(...r);
          return `\x1B[${38 + t};5;${n}m`;
        },
      "wrapAnsi256"
    ),
    Gs = u(
      (e, t) =>
        (...r) => {
          let n = e(...r);
          return `\x1B[${38 + t};2;${n[0]};${n[1]};${n[2]}m`;
        },
      "wrapAnsi16m"
    ),
    Tn = u((e) => e, "ansi2ansi"),
    Js = u((e, t, r) => [e, t, r], "rgb2rgb"),
    Bt = u((e, t, r) => {
      Object.defineProperty(e, t, {
        get: () => {
          let n = r();
          return (
            Object.defineProperty(e, t, {
              value: n,
              enumerable: !0,
              configurable: !0,
            }),
            n
          );
        },
        enumerable: !0,
        configurable: !0,
      });
    }, "setLazyProperty"),
    No,
    qt = u((e, t, r, n) => {
      No === void 0 && (No = qs());
      let o = n ? 10 : 0,
        i = {};
      for (let [s, a] of Object.entries(No)) {
        let c = s === "ansi16" ? "ansi" : s;
        s === t
          ? (i[c] = e(r, o))
          : typeof a == "object" && (i[c] = e(a[t], o));
      }
      return i;
    }, "makeDynamicStyles");
  function pf() {
    let e = new Map(),
      t = {
        modifier: {
          reset: [0, 0],
          bold: [1, 22],
          dim: [2, 22],
          italic: [3, 23],
          underline: [4, 24],
          inverse: [7, 27],
          hidden: [8, 28],
          strikethrough: [9, 29],
        },
        color: {
          black: [30, 39],
          red: [31, 39],
          green: [32, 39],
          yellow: [33, 39],
          blue: [34, 39],
          magenta: [35, 39],
          cyan: [36, 39],
          white: [37, 39],
          blackBright: [90, 39],
          redBright: [91, 39],
          greenBright: [92, 39],
          yellowBright: [93, 39],
          blueBright: [94, 39],
          magentaBright: [95, 39],
          cyanBright: [96, 39],
          whiteBright: [97, 39],
        },
        bgColor: {
          bgBlack: [40, 49],
          bgRed: [41, 49],
          bgGreen: [42, 49],
          bgYellow: [43, 49],
          bgBlue: [44, 49],
          bgMagenta: [45, 49],
          bgCyan: [46, 49],
          bgWhite: [47, 49],
          bgBlackBright: [100, 49],
          bgRedBright: [101, 49],
          bgGreenBright: [102, 49],
          bgYellowBright: [103, 49],
          bgBlueBright: [104, 49],
          bgMagentaBright: [105, 49],
          bgCyanBright: [106, 49],
          bgWhiteBright: [107, 49],
        },
      };
    (t.color.gray = t.color.blackBright),
      (t.bgColor.bgGray = t.bgColor.bgBlackBright),
      (t.color.grey = t.color.blackBright),
      (t.bgColor.bgGrey = t.bgColor.bgBlackBright);
    for (let [r, n] of Object.entries(t)) {
      for (let [o, i] of Object.entries(n))
        (t[o] = { open: `\x1B[${i[0]}m`, close: `\x1B[${i[1]}m` }),
          (n[o] = t[o]),
          e.set(i[0], i[1]);
      Object.defineProperty(t, r, { value: n, enumerable: !1 });
    }
    return (
      Object.defineProperty(t, "codes", { value: e, enumerable: !1 }),
      (t.color.close = "\x1B[39m"),
      (t.bgColor.close = "\x1B[49m"),
      Bt(t.color, "ansi", () => qt(Us, "ansi16", Tn, !1)),
      Bt(t.color, "ansi256", () => qt(Vs, "ansi256", Tn, !1)),
      Bt(t.color, "ansi16m", () => qt(Gs, "rgb", Js, !1)),
      Bt(t.bgColor, "ansi", () => qt(Us, "ansi16", Tn, !0)),
      Bt(t.bgColor, "ansi256", () => qt(Vs, "ansi256", Tn, !0)),
      Bt(t.bgColor, "ansi16m", () => qt(Gs, "rgb", Js, !0)),
      t
    );
  }
  u(pf, "assembleStyles");
  Object.defineProperty(zs, "exports", { enumerable: !0, get: pf });
});
var ko = K(() => {
  d();
  p();
  m();
});
var Ks = K((rh, Ws) => {
  "use strict";
  d();
  p();
  m();
  var mf = u((e, t, r) => {
      let n = e.indexOf(t);
      if (n === -1) return e;
      let o = t.length,
        i = 0,
        s = "";
      do (s += e.substr(i, n - i) + t + r), (i = n + o), (n = e.indexOf(t, i));
      while (n !== -1);
      return (s += e.substr(i)), s;
    }, "stringReplaceAll"),
    df = u((e, t, r, n) => {
      let o = 0,
        i = "";
      do {
        let s = e[n - 1] === "\r";
        (i +=
          e.substr(o, (s ? n - 1 : n) - o) +
          t +
          (s
            ? `\r
`
            : `
`) +
          r),
          (o = n + 1),
          (n = e.indexOf(
            `
`,
            o
          ));
      } while (n !== -1);
      return (i += e.substr(o)), i;
    }, "stringEncaseCRLFWithFirstIndex");
  Ws.exports = { stringReplaceAll: mf, stringEncaseCRLFWithFirstIndex: df };
});
var ea = K((ah, Xs) => {
  "use strict";
  d();
  p();
  m();
  var gf =
      /(?:\\(u(?:[a-f\d]{4}|\{[a-f\d]{1,6}\})|x[a-f\d]{2}|.))|(?:\{(~)?(\w+(?:\([^)]*\))?(?:\.\w+(?:\([^)]*\))?)*)(?:[ \t]|(?=\r?\n)))|(\})|((?:.|[\r\n\f])+?)/gi,
    Qs = /(?:^|\.)(\w+)(?:\(([^)]*)\))?/g,
    yf = /^(['"])((?:\\.|(?!\1)[^\\])*)\1$/,
    hf = /\\(u(?:[a-f\d]{4}|{[a-f\d]{1,6}})|x[a-f\d]{2}|.)|([^\\])/gi,
    bf = new Map([
      [
        "n",
        `
`,
      ],
      ["r", "\r"],
      ["t", "	"],
      ["b", "\b"],
      ["f", "\f"],
      ["v", "\v"],
      ["0", "\0"],
      ["\\", "\\"],
      ["e", "\x1B"],
      ["a", "\x07"],
    ]);
  function Zs(e) {
    let t = e[0] === "u",
      r = e[1] === "{";
    return (t && !r && e.length === 5) || (e[0] === "x" && e.length === 3)
      ? String.fromCharCode(parseInt(e.slice(1), 16))
      : t && r
      ? String.fromCodePoint(parseInt(e.slice(2, -1), 16))
      : bf.get(e) || e;
  }
  u(Zs, "unescape");
  function wf(e, t) {
    let r = [],
      n = t.trim().split(/\s*,\s*/g),
      o;
    for (let i of n) {
      let s = Number(i);
      if (!Number.isNaN(s)) r.push(s);
      else if ((o = i.match(yf)))
        r.push(o[2].replace(hf, (a, c, l) => (c ? Zs(c) : l)));
      else
        throw new Error(
          `Invalid Chalk template style argument: ${i} (in style '${e}')`
        );
    }
    return r;
  }
  u(wf, "parseArguments");
  function xf(e) {
    Qs.lastIndex = 0;
    let t = [],
      r;
    for (; (r = Qs.exec(e)) !== null; ) {
      let n = r[1];
      if (r[2]) {
        let o = wf(n, r[2]);
        t.push([n].concat(o));
      } else t.push([n]);
    }
    return t;
  }
  u(xf, "parseStyle");
  function Ys(e, t) {
    let r = {};
    for (let o of t)
      for (let i of o.styles) r[i[0]] = o.inverse ? null : i.slice(1);
    let n = e;
    for (let [o, i] of Object.entries(r))
      if (!!Array.isArray(i)) {
        if (!(o in n)) throw new Error(`Unknown Chalk style: ${o}`);
        n = i.length > 0 ? n[o](...i) : n[o];
      }
    return n;
  }
  u(Ys, "buildStyle");
  Xs.exports = (e, t) => {
    let r = [],
      n = [],
      o = [];
    if (
      (t.replace(gf, (i, s, a, c, l, f) => {
        if (s) o.push(Zs(s));
        else if (c) {
          let g = o.join("");
          (o = []),
            n.push(r.length === 0 ? g : Ys(e, r)(g)),
            r.push({ inverse: a, styles: xf(c) });
        } else if (l) {
          if (r.length === 0)
            throw new Error("Found extraneous } in Chalk template literal");
          n.push(Ys(e, r)(o.join(""))), (o = []), r.pop();
        } else o.push(f);
      }),
      n.push(o.join("")),
      r.length > 0)
    ) {
      let i = `Chalk template literal is missing ${r.length} closing bracket${
        r.length === 1 ? "" : "s"
      } (\`}\`)`;
      throw new Error(i);
    }
    return n.join("");
  };
});
var At = K((ph, sa) => {
  "use strict";
  d();
  p();
  m();
  var wr = Hs(),
    { stdout: $o, stderr: Lo } = ko(),
    { stringReplaceAll: vf, stringEncaseCRLFWithFirstIndex: Ef } = Ks(),
    { isArray: Pn } = Array,
    ra = ["ansi", "ansi", "ansi256", "ansi16m"],
    Ut = Object.create(null),
    Tf = u((e, t = {}) => {
      if (
        t.level &&
        !(Number.isInteger(t.level) && t.level >= 0 && t.level <= 3)
      )
        throw new Error("The `level` option should be an integer from 0 to 3");
      let r = $o ? $o.level : 0;
      e.level = t.level === void 0 ? r : t.level;
    }, "applyOptions"),
    An = class {
      constructor(t) {
        return na(t);
      }
    };
  u(An, "ChalkClass");
  var na = u((e) => {
    let t = {};
    return (
      Tf(t, e),
      (t.template = (...r) => ia(t.template, ...r)),
      Object.setPrototypeOf(t, Mn.prototype),
      Object.setPrototypeOf(t.template, t),
      (t.template.constructor = () => {
        throw new Error(
          "`chalk.constructor()` is deprecated. Use `new chalk.Instance()` instead."
        );
      }),
      (t.template.Instance = An),
      t.template
    );
  }, "chalkFactory");
  function Mn(e) {
    return na(e);
  }
  u(Mn, "Chalk");
  for (let [e, t] of Object.entries(wr))
    Ut[e] = {
      get() {
        let r = Sn(this, Bo(t.open, t.close, this._styler), this._isEmpty);
        return Object.defineProperty(this, e, { value: r }), r;
      },
    };
  Ut.visible = {
    get() {
      let e = Sn(this, this._styler, !0);
      return Object.defineProperty(this, "visible", { value: e }), e;
    },
  };
  var oa = ["rgb", "hex", "keyword", "hsl", "hsv", "hwb", "ansi", "ansi256"];
  for (let e of oa)
    Ut[e] = {
      get() {
        let { level: t } = this;
        return function (...r) {
          let n = Bo(wr.color[ra[t]][e](...r), wr.color.close, this._styler);
          return Sn(this, n, this._isEmpty);
        };
      },
    };
  for (let e of oa) {
    let t = "bg" + e[0].toUpperCase() + e.slice(1);
    Ut[t] = {
      get() {
        let { level: r } = this;
        return function (...n) {
          let o = Bo(
            wr.bgColor[ra[r]][e](...n),
            wr.bgColor.close,
            this._styler
          );
          return Sn(this, o, this._isEmpty);
        };
      },
    };
  }
  var Af = Object.defineProperties(() => {}, {
      ...Ut,
      level: {
        enumerable: !0,
        get() {
          return this._generator.level;
        },
        set(e) {
          this._generator.level = e;
        },
      },
    }),
    Bo = u((e, t, r) => {
      let n, o;
      return (
        r === void 0
          ? ((n = e), (o = t))
          : ((n = r.openAll + e), (o = t + r.closeAll)),
        { open: e, close: t, openAll: n, closeAll: o, parent: r }
      );
    }, "createStyler"),
    Sn = u((e, t, r) => {
      let n = u(
        (...o) =>
          Pn(o[0]) && Pn(o[0].raw)
            ? ta(n, ia(n, ...o))
            : ta(n, o.length === 1 ? "" + o[0] : o.join(" ")),
        "builder"
      );
      return (
        Object.setPrototypeOf(n, Af),
        (n._generator = e),
        (n._styler = t),
        (n._isEmpty = r),
        n
      );
    }, "createBuilder"),
    ta = u((e, t) => {
      if (e.level <= 0 || !t) return e._isEmpty ? "" : t;
      let r = e._styler;
      if (r === void 0) return t;
      let { openAll: n, closeAll: o } = r;
      if (t.indexOf("\x1B") !== -1)
        for (; r !== void 0; ) (t = vf(t, r.close, r.open)), (r = r.parent);
      let i = t.indexOf(`
`);
      return i !== -1 && (t = Ef(t, o, n, i)), n + t + o;
    }, "applyStyle"),
    jo,
    ia = u((e, ...t) => {
      let [r] = t;
      if (!Pn(r) || !Pn(r.raw)) return t.join(" ");
      let n = t.slice(1),
        o = [r.raw[0]];
      for (let i = 1; i < r.length; i++)
        o.push(String(n[i - 1]).replace(/[{}\\]/g, "\\$&"), String(r.raw[i]));
      return jo === void 0 && (jo = ea()), jo(e, o.join(""));
    }, "chalkTag");
  Object.defineProperties(Mn.prototype, Ut);
  var On = Mn();
  On.supportsColor = $o;
  On.stderr = Mn({ level: Lo ? Lo.level : 0 });
  On.stderr.supportsColor = Lo;
  sa.exports = On;
});
var kn = K((Eh, va) => {
  "use strict";
  d();
  p();
  m();
  va.exports = (e, t = 1, r) => {
    if (
      ((r = { indent: " ", includeEmptyLines: !1, ...r }), typeof e != "string")
    )
      throw new TypeError(
        `Expected \`input\` to be a \`string\`, got \`${typeof e}\``
      );
    if (typeof t != "number")
      throw new TypeError(
        `Expected \`count\` to be a \`number\`, got \`${typeof t}\``
      );
    if (typeof r.indent != "string")
      throw new TypeError(
        `Expected \`options.indent\` to be a \`string\`, got \`${typeof r.indent}\``
      );
    if (t === 0) return e;
    let n = r.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
    return e.replace(n, r.indent.repeat(t));
  };
});
var Ho = K((Mh, Ea) => {
  "use strict";
  d();
  p();
  m();
  Ea.exports = (function () {
    function e(t, r, n, o, i) {
      return t < r || n < r ? (t > n ? n + 1 : t + 1) : o === i ? r : r + 1;
    }
    return (
      u(e, "_min"),
      function (t, r) {
        if (t === r) return 0;
        if (t.length > r.length) {
          var n = t;
          (t = r), (r = n);
        }
        for (
          var o = t.length, i = r.length;
          o > 0 && t.charCodeAt(o - 1) === r.charCodeAt(i - 1);

        )
          o--, i--;
        for (var s = 0; s < o && t.charCodeAt(s) === r.charCodeAt(s); ) s++;
        if (((o -= s), (i -= s), o === 0 || i < 3)) return i;
        var a = 0,
          c,
          l,
          f,
          g,
          y,
          b,
          x,
          h,
          A,
          M,
          P,
          S,
          T = [];
        for (c = 0; c < o; c++) T.push(c + 1), T.push(t.charCodeAt(s + c));
        for (var O = T.length - 1; a < i - 3; )
          for (
            A = r.charCodeAt(s + (l = a)),
              M = r.charCodeAt(s + (f = a + 1)),
              P = r.charCodeAt(s + (g = a + 2)),
              S = r.charCodeAt(s + (y = a + 3)),
              b = a += 4,
              c = 0;
            c < O;
            c += 2
          )
            (x = T[c]),
              (h = T[c + 1]),
              (l = e(x, l, f, A, h)),
              (f = e(l, f, g, M, h)),
              (g = e(f, g, y, P, h)),
              (b = e(g, y, b, S, h)),
              (T[c] = b),
              (y = g),
              (g = f),
              (f = l),
              (l = x);
        for (; a < i; )
          for (A = r.charCodeAt(s + (l = a)), b = ++a, c = 0; c < O; c += 2)
            (x = T[c]), (T[c] = b = e(x, l, b, A, T[c + 1])), (l = x);
        return b;
      }
    );
  })();
});
var $a = K((G) => {
  d();
  p();
  m();
  var re = u(
      (e, t) => () => (t || e((t = { exports: {} }).exports, t), t.exports),
      "p"
    ),
    Oa = re((e, t) => {
      "use strict";
      t.exports = function () {
        if (
          typeof Symbol != "function" ||
          typeof Object.getOwnPropertySymbols != "function"
        )
          return !1;
        if (typeof Symbol.iterator == "symbol") return !0;
        var r = {},
          n = Symbol("test"),
          o = Object(n);
        if (
          typeof n == "string" ||
          Object.prototype.toString.call(n) !== "[object Symbol]" ||
          Object.prototype.toString.call(o) !== "[object Symbol]"
        )
          return !1;
        var i = 42;
        r[n] = i;
        for (n in r) return !1;
        if (
          (typeof Object.keys == "function" && Object.keys(r).length !== 0) ||
          (typeof Object.getOwnPropertyNames == "function" &&
            Object.getOwnPropertyNames(r).length !== 0)
        )
          return !1;
        var s = Object.getOwnPropertySymbols(r);
        if (
          s.length !== 1 ||
          s[0] !== n ||
          !Object.prototype.propertyIsEnumerable.call(r, n)
        )
          return !1;
        if (typeof Object.getOwnPropertyDescriptor == "function") {
          var a = Object.getOwnPropertyDescriptor(r, n);
          if (a.value !== i || a.enumerable !== !0) return !1;
        }
        return !0;
      };
    }),
    zn = re((e, t) => {
      "use strict";
      var r = Oa();
      t.exports = function () {
        return r() && !!Symbol.toStringTag;
      };
    }),
    Ap = re((e, t) => {
      "use strict";
      var r = typeof Symbol < "u" && Symbol,
        n = Oa();
      t.exports = function () {
        return typeof r != "function" ||
          typeof Symbol != "function" ||
          typeof r("foo") != "symbol" ||
          typeof Symbol("bar") != "symbol"
          ? !1
          : n();
      };
    }),
    Pp = re((e, t) => {
      "use strict";
      var r = "Function.prototype.bind called on incompatible ",
        n = Array.prototype.slice,
        o = Object.prototype.toString,
        i = "[object Function]";
      t.exports = function (s) {
        var a = this;
        if (typeof a != "function" || o.call(a) !== i)
          throw new TypeError(r + a);
        for (
          var c = n.call(arguments, 1),
            l,
            f = function () {
              if (this instanceof l) {
                var h = a.apply(this, c.concat(n.call(arguments)));
                return Object(h) === h ? h : this;
              } else return a.apply(s, c.concat(n.call(arguments)));
            },
            g = Math.max(0, a.length - c.length),
            y = [],
            b = 0;
          b < g;
          b++
        )
          y.push("$" + b);
        if (
          ((l = E(
            "binder",
            "return function (" +
              y.join(",") +
              "){ return binder.apply(this,arguments); }"
          )(f)),
          a.prototype)
        ) {
          var x = u(function () {}, "c");
          (x.prototype = a.prototype),
            (l.prototype = new x()),
            (x.prototype = null);
        }
        return l;
      };
    }),
    ti = re((e, t) => {
      "use strict";
      var r = Pp();
      t.exports = E.prototype.bind || r;
    }),
    Mp = re((e, t) => {
      "use strict";
      var r = ti();
      t.exports = r.call(E.call, Object.prototype.hasOwnProperty);
    }),
    ri = re((e, t) => {
      "use strict";
      var r,
        n = SyntaxError,
        o = E,
        i = TypeError,
        s = u(function (J) {
          try {
            return o('"use strict"; return (' + J + ").constructor;")();
          } catch (X) {}
        }, "lr"),
        a = Object.getOwnPropertyDescriptor;
      if (a)
        try {
          a({}, "");
        } catch (J) {
          a = null;
        }
      var c = u(function () {
          throw new i();
        }, "gr"),
        l = a
          ? (function () {
              try {
                return arguments.callee, c;
              } catch (J) {
                try {
                  return a(arguments, "callee").get;
                } catch (X) {
                  return c;
                }
              }
            })()
          : c,
        f = Ap()(),
        g =
          Object.getPrototypeOf ||
          function (J) {
            return J.__proto__;
          },
        y = {},
        b = typeof Uint8Array > "u" ? r : g(Uint8Array),
        x = {
          "%AggregateError%": typeof AggregateError > "u" ? r : AggregateError,
          "%Array%": Array,
          "%ArrayBuffer%": typeof ArrayBuffer > "u" ? r : ArrayBuffer,
          "%ArrayIteratorPrototype%": f ? g([][Symbol.iterator]()) : r,
          "%AsyncFromSyncIteratorPrototype%": r,
          "%AsyncFunction%": y,
          "%AsyncGenerator%": y,
          "%AsyncGeneratorFunction%": y,
          "%AsyncIteratorPrototype%": y,
          "%Atomics%": typeof Atomics > "u" ? r : Atomics,
          "%BigInt%": typeof BigInt > "u" ? r : BigInt,
          "%Boolean%": Boolean,
          "%DataView%": typeof DataView > "u" ? r : DataView,
          "%Date%": Date,
          "%decodeURI%": decodeURI,
          "%decodeURIComponent%": decodeURIComponent,
          "%encodeURI%": encodeURI,
          "%encodeURIComponent%": encodeURIComponent,
          "%Error%": Error,
          "%eval%": void 0,
          "%EvalError%": EvalError,
          "%Float32Array%": typeof Float32Array > "u" ? r : Float32Array,
          "%Float64Array%": typeof Float64Array > "u" ? r : Float64Array,
          "%FinalizationRegistry%":
            typeof FinalizationRegistry > "u" ? r : FinalizationRegistry,
          "%Function%": o,
          "%GeneratorFunction%": y,
          "%Int8Array%": typeof Int8Array > "u" ? r : Int8Array,
          "%Int16Array%": typeof Int16Array > "u" ? r : Int16Array,
          "%Int32Array%": typeof Int32Array > "u" ? r : Int32Array,
          "%isFinite%": isFinite,
          "%isNaN%": isNaN,
          "%IteratorPrototype%": f ? g(g([][Symbol.iterator]())) : r,
          "%JSON%": typeof JSON == "object" ? JSON : r,
          "%Map%": typeof Map > "u" ? r : Map,
          "%MapIteratorPrototype%":
            typeof Map > "u" || !f ? r : g(new Map()[Symbol.iterator]()),
          "%Math%": Math,
          "%Number%": Number,
          "%Object%": Object,
          "%parseFloat%": parseFloat,
          "%parseInt%": parseInt,
          "%Promise%": typeof Promise > "u" ? r : Promise,
          "%Proxy%": typeof Proxy > "u" ? r : Proxy,
          "%RangeError%": RangeError,
          "%ReferenceError%": ReferenceError,
          "%Reflect%": typeof Reflect > "u" ? r : Reflect,
          "%RegExp%": RegExp,
          "%Set%": typeof Set > "u" ? r : Set,
          "%SetIteratorPrototype%":
            typeof Set > "u" || !f ? r : g(new Set()[Symbol.iterator]()),
          "%SharedArrayBuffer%":
            typeof SharedArrayBuffer > "u" ? r : SharedArrayBuffer,
          "%String%": String,
          "%StringIteratorPrototype%": f ? g(""[Symbol.iterator]()) : r,
          "%Symbol%": f ? Symbol : r,
          "%SyntaxError%": n,
          "%ThrowTypeError%": l,
          "%TypedArray%": b,
          "%TypeError%": i,
          "%Uint8Array%": typeof Uint8Array > "u" ? r : Uint8Array,
          "%Uint8ClampedArray%":
            typeof Uint8ClampedArray > "u" ? r : Uint8ClampedArray,
          "%Uint16Array%": typeof Uint16Array > "u" ? r : Uint16Array,
          "%Uint32Array%": typeof Uint32Array > "u" ? r : Uint32Array,
          "%URIError%": URIError,
          "%WeakMap%": typeof WeakMap > "u" ? r : WeakMap,
          "%WeakRef%": typeof WeakRef > "u" ? r : WeakRef,
          "%WeakSet%": typeof WeakSet > "u" ? r : WeakSet,
        },
        h = u(function J(X) {
          var z;
          if (X === "%AsyncFunction%") z = s("async function () {}");
          else if (X === "%GeneratorFunction%") z = s("function* () {}");
          else if (X === "%AsyncGeneratorFunction%")
            z = s("async function* () {}");
          else if (X === "%AsyncGenerator%") {
            var H = J("%AsyncGeneratorFunction%");
            H && (z = H.prototype);
          } else if (X === "%AsyncIteratorPrototype%") {
            var $ = J("%AsyncGenerator%");
            $ && (z = g($.prototype));
          }
          return (x[X] = z), z;
        }, "r"),
        A = {
          "%ArrayBufferPrototype%": ["ArrayBuffer", "prototype"],
          "%ArrayPrototype%": ["Array", "prototype"],
          "%ArrayProto_entries%": ["Array", "prototype", "entries"],
          "%ArrayProto_forEach%": ["Array", "prototype", "forEach"],
          "%ArrayProto_keys%": ["Array", "prototype", "keys"],
          "%ArrayProto_values%": ["Array", "prototype", "values"],
          "%AsyncFunctionPrototype%": ["AsyncFunction", "prototype"],
          "%AsyncGenerator%": ["AsyncGeneratorFunction", "prototype"],
          "%AsyncGeneratorPrototype%": [
            "AsyncGeneratorFunction",
            "prototype",
            "prototype",
          ],
          "%BooleanPrototype%": ["Boolean", "prototype"],
          "%DataViewPrototype%": ["DataView", "prototype"],
          "%DatePrototype%": ["Date", "prototype"],
          "%ErrorPrototype%": ["Error", "prototype"],
          "%EvalErrorPrototype%": ["EvalError", "prototype"],
          "%Float32ArrayPrototype%": ["Float32Array", "prototype"],
          "%Float64ArrayPrototype%": ["Float64Array", "prototype"],
          "%FunctionPrototype%": ["Function", "prototype"],
          "%Generator%": ["GeneratorFunction", "prototype"],
          "%GeneratorPrototype%": [
            "GeneratorFunction",
            "prototype",
            "prototype",
          ],
          "%Int8ArrayPrototype%": ["Int8Array", "prototype"],
          "%Int16ArrayPrototype%": ["Int16Array", "prototype"],
          "%Int32ArrayPrototype%": ["Int32Array", "prototype"],
          "%JSONParse%": ["JSON", "parse"],
          "%JSONStringify%": ["JSON", "stringify"],
          "%MapPrototype%": ["Map", "prototype"],
          "%NumberPrototype%": ["Number", "prototype"],
          "%ObjectPrototype%": ["Object", "prototype"],
          "%ObjProto_toString%": ["Object", "prototype", "toString"],
          "%ObjProto_valueOf%": ["Object", "prototype", "valueOf"],
          "%PromisePrototype%": ["Promise", "prototype"],
          "%PromiseProto_then%": ["Promise", "prototype", "then"],
          "%Promise_all%": ["Promise", "all"],
          "%Promise_reject%": ["Promise", "reject"],
          "%Promise_resolve%": ["Promise", "resolve"],
          "%RangeErrorPrototype%": ["RangeError", "prototype"],
          "%ReferenceErrorPrototype%": ["ReferenceError", "prototype"],
          "%RegExpPrototype%": ["RegExp", "prototype"],
          "%SetPrototype%": ["Set", "prototype"],
          "%SharedArrayBufferPrototype%": ["SharedArrayBuffer", "prototype"],
          "%StringPrototype%": ["String", "prototype"],
          "%SymbolPrototype%": ["Symbol", "prototype"],
          "%SyntaxErrorPrototype%": ["SyntaxError", "prototype"],
          "%TypedArrayPrototype%": ["TypedArray", "prototype"],
          "%TypeErrorPrototype%": ["TypeError", "prototype"],
          "%Uint8ArrayPrototype%": ["Uint8Array", "prototype"],
          "%Uint8ClampedArrayPrototype%": ["Uint8ClampedArray", "prototype"],
          "%Uint16ArrayPrototype%": ["Uint16Array", "prototype"],
          "%Uint32ArrayPrototype%": ["Uint32Array", "prototype"],
          "%URIErrorPrototype%": ["URIError", "prototype"],
          "%WeakMapPrototype%": ["WeakMap", "prototype"],
          "%WeakSetPrototype%": ["WeakSet", "prototype"],
        },
        M = ti(),
        P = Mp(),
        S = M.call(E.call, Array.prototype.concat),
        T = M.call(E.apply, Array.prototype.splice),
        O = M.call(E.call, String.prototype.replace),
        R = M.call(E.call, String.prototype.slice),
        F = M.call(E.call, RegExp.prototype.exec),
        B =
          /[^%.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|%$))/g,
        W = /\\(\\)?/g,
        te = u(function (J) {
          var X = R(J, 0, 1),
            z = R(J, -1);
          if (X === "%" && z !== "%")
            throw new n("invalid intrinsic syntax, expected closing `%`");
          if (z === "%" && X !== "%")
            throw new n("invalid intrinsic syntax, expected opening `%`");
          var H = [];
          return (
            O(J, B, function ($, tt, ie, Ft) {
              H[H.length] = ie ? O(Ft, W, "$1") : tt || $;
            }),
            H
          );
        }, "At"),
        V = u(function (J, X) {
          var z = J,
            H;
          if ((P(A, z) && ((H = A[z]), (z = "%" + H[0] + "%")), P(x, z))) {
            var $ = x[z];
            if (($ === y && ($ = h(z)), typeof $ > "u" && !X))
              throw new i(
                "intrinsic " +
                  J +
                  " exists, but is not available. Please file an issue!"
              );
            return { alias: H, name: z, value: $ };
          }
          throw new n("intrinsic " + J + " does not exist!");
        }, "ht");
      t.exports = function (J, X) {
        if (typeof J != "string" || J.length === 0)
          throw new i("intrinsic name must be a non-empty string");
        if (arguments.length > 1 && typeof X != "boolean")
          throw new i('"allowMissing" argument must be a boolean');
        if (F(/^%?[^%]*%?$/, J) === null)
          throw new n(
            "`%` may not be present anywhere but at the beginning and end of the intrinsic name"
          );
        var z = te(J),
          H = z.length > 0 ? z[0] : "",
          $ = V("%" + H + "%", X),
          tt = $.name,
          ie = $.value,
          Ft = !1,
          rt = $.alias;
        rt && ((H = rt[0]), T(z, S([0, 1], rt)));
        for (var vt = 1, Be = !0; vt < z.length; vt += 1) {
          var Se = z[vt],
            nt = R(Se, 0, 1),
            qe = R(Se, -1);
          if (
            (nt === '"' ||
              nt === "'" ||
              nt === "`" ||
              qe === '"' ||
              qe === "'" ||
              qe === "`") &&
            nt !== qe
          )
            throw new n("property names with quotes must have matching quotes");
          if (
            ((Se === "constructor" || !Be) && (Ft = !0),
            (H += "." + Se),
            (tt = "%" + H + "%"),
            P(x, tt))
          )
            ie = x[tt];
          else if (ie != null) {
            if (!(Se in ie)) {
              if (!X)
                throw new i(
                  "base intrinsic for " +
                    J +
                    " exists, but the property is not available."
                );
              return;
            }
            if (a && vt + 1 >= z.length) {
              var Et = a(ie, Se);
              (Be = !!Et),
                Be && "get" in Et && !("originalValue" in Et.get)
                  ? (ie = Et.get)
                  : (ie = ie[Se]);
            } else (Be = P(ie, Se)), (ie = ie[Se]);
            Be && !Ft && (x[tt] = ie);
          }
        }
        return ie;
      };
    }),
    Sp = re((e, t) => {
      "use strict";
      var r = ti(),
        n = ri(),
        o = n("%Function.prototype.apply%"),
        i = n("%Function.prototype.call%"),
        s = n("%Reflect.apply%", !0) || r.call(i, o),
        a = n("%Object.getOwnPropertyDescriptor%", !0),
        c = n("%Object.defineProperty%", !0),
        l = n("%Math.max%");
      if (c)
        try {
          c({}, "a", { value: 1 });
        } catch (g) {
          c = null;
        }
      t.exports = function (g) {
        var y = s(r, i, arguments);
        if (a && c) {
          var b = a(y, "length");
          b.configurable &&
            c(y, "length", {
              value: 1 + l(0, g.length - (arguments.length - 1)),
            });
        }
        return y;
      };
      var f = u(function () {
        return s(r, o, arguments);
      }, "ee");
      c ? c(t.exports, "apply", { value: f }) : (t.exports.apply = f);
    }),
    ni = re((e, t) => {
      "use strict";
      var r = ri(),
        n = Sp(),
        o = n(r("String.prototype.indexOf"));
      t.exports = function (i, s) {
        var a = r(i, !!s);
        return typeof a == "function" && o(i, ".prototype.") > -1 ? n(a) : a;
      };
    }),
    Op = re((e, t) => {
      "use strict";
      var r = zn()(),
        n = ni(),
        o = n("Object.prototype.toString"),
        i = u(function (c) {
          return r && c && typeof c == "object" && Symbol.toStringTag in c
            ? !1
            : o(c) === "[object Arguments]";
        }, "H"),
        s = u(function (c) {
          return i(c)
            ? !0
            : c !== null &&
                typeof c == "object" &&
                typeof c.length == "number" &&
                c.length >= 0 &&
                o(c) !== "[object Array]" &&
                o(c.callee) === "[object Function]";
        }, "se"),
        a = (function () {
          return i(arguments);
        })();
      (i.isLegacyArguments = s), (t.exports = a ? i : s);
    }),
    _p = re((e, t) => {
      "use strict";
      var r = Object.prototype.toString,
        n = E.prototype.toString,
        o = /^\s*(?:function)?\*/,
        i = zn()(),
        s = Object.getPrototypeOf,
        a = u(function () {
          if (!i) return !1;
          try {
            return E("return function*() {}")();
          } catch (l) {}
        }, "Ft"),
        c;
      t.exports = function (l) {
        if (typeof l != "function") return !1;
        if (o.test(n.call(l))) return !0;
        if (!i) {
          var f = r.call(l);
          return f === "[object GeneratorFunction]";
        }
        if (!s) return !1;
        if (typeof c > "u") {
          var g = a();
          c = g ? s(g) : !1;
        }
        return s(l) === c;
      };
    }),
    Cp = re((e, t) => {
      "use strict";
      var r = E.prototype.toString,
        n = typeof Reflect == "object" && Reflect !== null && Reflect.apply,
        o,
        i;
      if (typeof n == "function" && typeof Object.defineProperty == "function")
        try {
          (o = Object.defineProperty({}, "length", {
            get: function () {
              throw i;
            },
          })),
            (i = {}),
            n(
              function () {
                throw 42;
              },
              null,
              o
            );
        } catch (T) {
          T !== i && (n = null);
        }
      else n = null;
      var s = /^\s*class\b/,
        a = u(function (T) {
          try {
            var O = r.call(T);
            return s.test(O);
          } catch (R) {
            return !1;
          }
        }, "vr"),
        c = u(function (T) {
          try {
            return a(T) ? !1 : (r.call(T), !0);
          } catch (O) {
            return !1;
          }
        }, "hr"),
        l = Object.prototype.toString,
        f = "[object Object]",
        g = "[object Function]",
        y = "[object GeneratorFunction]",
        b = "[object HTMLAllCollection]",
        x = "[object HTML document.all class]",
        h = "[object HTMLCollection]",
        A = typeof Symbol == "function" && !!Symbol.toStringTag,
        M = !(0 in [,]),
        P = u(function () {
          return !1;
        }, "Or");
      typeof document == "object" &&
        ((S = document.all),
        l.call(S) === l.call(document.all) &&
          (P = u(function (T) {
            if ((M || !T) && (typeof T > "u" || typeof T == "object"))
              try {
                var O = l.call(T);
                return (
                  (O === b || O === x || O === h || O === f) && T("") == null
                );
              } catch (R) {}
            return !1;
          }, "Or")));
      var S;
      t.exports = n
        ? function (T) {
            if (P(T)) return !0;
            if (!T || (typeof T != "function" && typeof T != "object"))
              return !1;
            try {
              n(T, null, o);
            } catch (O) {
              if (O !== i) return !1;
            }
            return !a(T) && c(T);
          }
        : function (T) {
            if (P(T)) return !0;
            if (!T || (typeof T != "function" && typeof T != "object"))
              return !1;
            if (A) return c(T);
            if (a(T)) return !1;
            var O = l.call(T);
            return O !== g && O !== y && !/^\[object HTML/.test(O) ? !1 : c(T);
          };
    }),
    _a = re((e, t) => {
      "use strict";
      var r = Cp(),
        n = Object.prototype.toString,
        o = Object.prototype.hasOwnProperty,
        i = u(function (l, f, g) {
          for (var y = 0, b = l.length; y < b; y++)
            o.call(l, y) && (g == null ? f(l[y], y, l) : f.call(g, l[y], y, l));
        }, "qt"),
        s = u(function (l, f, g) {
          for (var y = 0, b = l.length; y < b; y++)
            g == null ? f(l.charAt(y), y, l) : f.call(g, l.charAt(y), y, l);
        }, "Gt"),
        a = u(function (l, f, g) {
          for (var y in l)
            o.call(l, y) && (g == null ? f(l[y], y, l) : f.call(g, l[y], y, l));
        }, "Wt"),
        c = u(function (l, f, g) {
          if (!r(f)) throw new TypeError("iterator must be a function");
          var y;
          arguments.length >= 3 && (y = g),
            n.call(l) === "[object Array]"
              ? i(l, f, y)
              : typeof l == "string"
              ? s(l, f, y)
              : a(l, f, y);
        }, "_t");
      t.exports = c;
    }),
    Ca = re((e, t) => {
      "use strict";
      var r = [
          "BigInt64Array",
          "BigUint64Array",
          "Float32Array",
          "Float64Array",
          "Int16Array",
          "Int32Array",
          "Int8Array",
          "Uint16Array",
          "Uint32Array",
          "Uint8Array",
          "Uint8ClampedArray",
        ],
        n = typeof globalThis > "u" ? global : globalThis;
      t.exports = function () {
        for (var o = [], i = 0; i < r.length; i++)
          typeof n[r[i]] == "function" && (o[o.length] = r[i]);
        return o;
      };
    }),
    Ia = re((e, t) => {
      "use strict";
      var r = ri(),
        n = r("%Object.getOwnPropertyDescriptor%", !0);
      if (n)
        try {
          n([], "length");
        } catch (o) {
          n = null;
        }
      t.exports = n;
    }),
    Ra = re((e, t) => {
      "use strict";
      var r = _a(),
        n = Ca(),
        o = ni(),
        i = o("Object.prototype.toString"),
        s = zn()(),
        a = typeof globalThis > "u" ? global : globalThis,
        c = n(),
        l =
          o("Array.prototype.indexOf", !0) ||
          function (h, A) {
            for (var M = 0; M < h.length; M += 1) if (h[M] === A) return M;
            return -1;
          },
        f = o("String.prototype.slice"),
        g = {},
        y = Ia(),
        b = Object.getPrototypeOf;
      s &&
        y &&
        b &&
        r(c, function (h) {
          var A = new a[h]();
          if (Symbol.toStringTag in A) {
            var M = b(A),
              P = y(M, Symbol.toStringTag);
            if (!P) {
              var S = b(M);
              P = y(S, Symbol.toStringTag);
            }
            g[h] = P.get;
          }
        });
      var x = u(function (h) {
        var A = !1;
        return (
          r(g, function (M, P) {
            if (!A)
              try {
                A = M.call(h) === P;
              } catch (S) {}
          }),
          A
        );
      }, "Kt");
      t.exports = function (h) {
        if (!h || typeof h != "object") return !1;
        if (!s || !(Symbol.toStringTag in h)) {
          var A = f(i(h), 8, -1);
          return l(c, A) > -1;
        }
        return y ? x(h) : !1;
      };
    }),
    Ip = re((e, t) => {
      "use strict";
      var r = _a(),
        n = Ca(),
        o = ni(),
        i = o("Object.prototype.toString"),
        s = zn()(),
        a = typeof globalThis > "u" ? global : globalThis,
        c = n(),
        l = o("String.prototype.slice"),
        f = {},
        g = Ia(),
        y = Object.getPrototypeOf;
      s &&
        g &&
        y &&
        r(c, function (h) {
          if (typeof a[h] == "function") {
            var A = new a[h]();
            if (Symbol.toStringTag in A) {
              var M = y(A),
                P = g(M, Symbol.toStringTag);
              if (!P) {
                var S = y(M);
                P = g(S, Symbol.toStringTag);
              }
              f[h] = P.get;
            }
          }
        });
      var b = u(function (h) {
          var A = !1;
          return (
            r(f, function (M, P) {
              if (!A)
                try {
                  var S = M.call(h);
                  S === P && (A = S);
                } catch (T) {}
            }),
            A
          );
        }, "tn"),
        x = Ra();
      t.exports = function (h) {
        return x(h)
          ? !s || !(Symbol.toStringTag in h)
            ? l(i(h), 8, -1)
            : b(h)
          : !1;
      };
    }),
    Rp = re((e) => {
      "use strict";
      var t = Op(),
        r = _p(),
        n = Ip(),
        o = Ra();
      function i(I) {
        return I.call.bind(I);
      }
      u(i, "R");
      var s = typeof BigInt < "u",
        a = typeof Symbol < "u",
        c = i(Object.prototype.toString),
        l = i(Number.prototype.valueOf),
        f = i(String.prototype.valueOf),
        g = i(Boolean.prototype.valueOf);
      s && (y = i(BigInt.prototype.valueOf));
      var y;
      a && (b = i(Symbol.prototype.valueOf));
      var b;
      function x(I, wl) {
        if (typeof I != "object") return !1;
        try {
          return wl(I), !0;
        } catch (qg) {
          return !1;
        }
      }
      u(x, "N"),
        (e.isArgumentsObject = t),
        (e.isGeneratorFunction = r),
        (e.isTypedArray = o);
      function h(I) {
        return (
          (typeof Promise < "u" && I instanceof Promise) ||
          (I !== null &&
            typeof I == "object" &&
            typeof I.then == "function" &&
            typeof I.catch == "function")
        );
      }
      u(h, "yn"), (e.isPromise = h);
      function A(I) {
        return typeof ArrayBuffer < "u" && ArrayBuffer.isView
          ? ArrayBuffer.isView(I)
          : o(I) || Se(I);
      }
      u(A, "cn"), (e.isArrayBufferView = A);
      function M(I) {
        return n(I) === "Uint8Array";
      }
      u(M, "pn"), (e.isUint8Array = M);
      function P(I) {
        return n(I) === "Uint8ClampedArray";
      }
      u(P, "ln"), (e.isUint8ClampedArray = P);
      function S(I) {
        return n(I) === "Uint16Array";
      }
      u(S, "gn"), (e.isUint16Array = S);
      function T(I) {
        return n(I) === "Uint32Array";
      }
      u(T, "dn"), (e.isUint32Array = T);
      function O(I) {
        return n(I) === "Int8Array";
      }
      u(O, "bn"), (e.isInt8Array = O);
      function R(I) {
        return n(I) === "Int16Array";
      }
      u(R, "mn"), (e.isInt16Array = R);
      function F(I) {
        return n(I) === "Int32Array";
      }
      u(F, "An"), (e.isInt32Array = F);
      function B(I) {
        return n(I) === "Float32Array";
      }
      u(B, "hn"), (e.isFloat32Array = B);
      function W(I) {
        return n(I) === "Float64Array";
      }
      u(W, "Sn"), (e.isFloat64Array = W);
      function te(I) {
        return n(I) === "BigInt64Array";
      }
      u(te, "vn"), (e.isBigInt64Array = te);
      function V(I) {
        return n(I) === "BigUint64Array";
      }
      u(V, "On"), (e.isBigUint64Array = V);
      function J(I) {
        return c(I) === "[object Map]";
      }
      u(J, "X"), (J.working = typeof Map < "u" && J(new Map()));
      function X(I) {
        return typeof Map > "u" ? !1 : J.working ? J(I) : I instanceof Map;
      }
      u(X, "jn"), (e.isMap = X);
      function z(I) {
        return c(I) === "[object Set]";
      }
      u(z, "rr"), (z.working = typeof Set < "u" && z(new Set()));
      function H(I) {
        return typeof Set > "u" ? !1 : z.working ? z(I) : I instanceof Set;
      }
      u(H, "Pn"), (e.isSet = H);
      function $(I) {
        return c(I) === "[object WeakMap]";
      }
      u($, "er"), ($.working = typeof WeakMap < "u" && $(new WeakMap()));
      function tt(I) {
        return typeof WeakMap > "u"
          ? !1
          : $.working
          ? $(I)
          : I instanceof WeakMap;
      }
      u(tt, "wn"), (e.isWeakMap = tt);
      function ie(I) {
        return c(I) === "[object WeakSet]";
      }
      u(ie, "Dr"), (ie.working = typeof WeakSet < "u" && ie(new WeakSet()));
      function Ft(I) {
        return ie(I);
      }
      u(Ft, "En"), (e.isWeakSet = Ft);
      function rt(I) {
        return c(I) === "[object ArrayBuffer]";
      }
      u(rt, "tr"),
        (rt.working = typeof ArrayBuffer < "u" && rt(new ArrayBuffer()));
      function vt(I) {
        return typeof ArrayBuffer > "u"
          ? !1
          : rt.working
          ? rt(I)
          : I instanceof ArrayBuffer;
      }
      u(vt, "qe"), (e.isArrayBuffer = vt);
      function Be(I) {
        return c(I) === "[object DataView]";
      }
      u(Be, "nr"),
        (Be.working =
          typeof ArrayBuffer < "u" &&
          typeof DataView < "u" &&
          Be(new DataView(new ArrayBuffer(1), 0, 1)));
      function Se(I) {
        return typeof DataView > "u"
          ? !1
          : Be.working
          ? Be(I)
          : I instanceof DataView;
      }
      u(Se, "Ge"), (e.isDataView = Se);
      var nt = typeof SharedArrayBuffer < "u" ? SharedArrayBuffer : void 0;
      function qe(I) {
        return c(I) === "[object SharedArrayBuffer]";
      }
      u(qe, "M");
      function Et(I) {
        return typeof nt > "u"
          ? !1
          : (typeof qe.working > "u" && (qe.working = qe(new nt())),
            qe.working ? qe(I) : I instanceof nt);
      }
      u(Et, "We"), (e.isSharedArrayBuffer = Et);
      function pl(I) {
        return c(I) === "[object AsyncFunction]";
      }
      u(pl, "Tn"), (e.isAsyncFunction = pl);
      function ml(I) {
        return c(I) === "[object Map Iterator]";
      }
      u(ml, "Fn"), (e.isMapIterator = ml);
      function dl(I) {
        return c(I) === "[object Set Iterator]";
      }
      u(dl, "In"), (e.isSetIterator = dl);
      function gl(I) {
        return c(I) === "[object Generator]";
      }
      u(gl, "Bn"), (e.isGeneratorObject = gl);
      function yl(I) {
        return c(I) === "[object WebAssembly.Module]";
      }
      u(yl, "Un"), (e.isWebAssemblyCompiledModule = yl);
      function ss(I) {
        return x(I, l);
      }
      u(ss, "_e"), (e.isNumberObject = ss);
      function as(I) {
        return x(I, f);
      }
      u(as, "ze"), (e.isStringObject = as);
      function us(I) {
        return x(I, g);
      }
      u(us, "Ve"), (e.isBooleanObject = us);
      function cs(I) {
        return s && x(I, y);
      }
      u(cs, "Je"), (e.isBigIntObject = cs);
      function ls(I) {
        return a && x(I, b);
      }
      u(ls, "Le"), (e.isSymbolObject = ls);
      function hl(I) {
        return ss(I) || as(I) || us(I) || cs(I) || ls(I);
      }
      u(hl, "Rn"), (e.isBoxedPrimitive = hl);
      function bl(I) {
        return typeof Uint8Array < "u" && (vt(I) || Et(I));
      }
      u(bl, "Dn"),
        (e.isAnyArrayBuffer = bl),
        ["isProxy", "isExternal", "isModuleNamespaceObject"].forEach(function (
          I
        ) {
          Object.defineProperty(e, I, {
            enumerable: !1,
            value: function () {
              throw new Error(I + " is not supported in userland");
            },
          });
        });
    }),
    Fp = re((e, t) => {
      t.exports = function (r) {
        return r instanceof v.Buffer;
      };
    }),
    Dp = re((e, t) => {
      typeof Object.create == "function"
        ? (t.exports = function (r, n) {
            n &&
              ((r.super_ = n),
              (r.prototype = Object.create(n.prototype, {
                constructor: {
                  value: r,
                  enumerable: !1,
                  writable: !0,
                  configurable: !0,
                },
              })));
          })
        : (t.exports = function (r, n) {
            if (n) {
              r.super_ = n;
              var o = u(function () {}, "n");
              (o.prototype = n.prototype),
                (r.prototype = new o()),
                (r.prototype.constructor = r);
            }
          });
    }),
    Fa =
      Object.getOwnPropertyDescriptors ||
      function (e) {
        for (var t = Object.keys(e), r = {}, n = 0; n < t.length; n++)
          r[t[n]] = Object.getOwnPropertyDescriptor(e, t[n]);
        return r;
      },
    Np = /%[sdj%]/g;
  G.format = function (e) {
    if (!Wn(e)) {
      for (var t = [], r = 0; r < arguments.length; r++)
        t.push(mt(arguments[r]));
      return t.join(" ");
    }
    for (
      var r = 1,
        n = arguments,
        o = n.length,
        i = String(e).replace(Np, function (c) {
          if (c === "%%") return "%";
          if (r >= o) return c;
          switch (c) {
            case "%s":
              return String(n[r++]);
            case "%d":
              return Number(n[r++]);
            case "%j":
              try {
                return JSON.stringify(n[r++]);
              } catch (l) {
                return "[Circular]";
              }
            default:
              return c;
          }
        }),
        s = n[r];
      r < o;
      s = n[++r]
    )
      Hn(s) || !Qt(s) ? (i += " " + s) : (i += " " + mt(s));
    return i;
  };
  G.deprecate = function (e, t) {
    if (typeof w < "u" && w.noDeprecation === !0) return e;
    if (typeof w > "u")
      return function () {
        return G.deprecate(e, t).apply(this, arguments);
      };
    var r = !1;
    function n() {
      if (!r) {
        if (w.throwDeprecation) throw new Error(t);
        w.traceDeprecation ? console.trace(t) : console.error(t), (r = !0);
      }
      return e.apply(this, arguments);
    }
    return u(n, "n"), n;
  };
  var qn = {},
    Da = /^$/;
  w.env.NODE_DEBUG &&
    ((Un = w.env.NODE_DEBUG),
    (Un = Un.replace(/[|\\{}()[\]^$+?.]/g, "\\$&")
      .replace(/\*/g, ".*")
      .replace(/,/g, "$|^")
      .toUpperCase()),
    (Da = new RegExp("^" + Un + "$", "i")));
  var Un;
  G.debuglog = function (e) {
    if (((e = e.toUpperCase()), !qn[e]))
      if (Da.test(e)) {
        var t = w.pid;
        qn[e] = function () {
          var r = G.format.apply(G, arguments);
          console.error("%s %d: %s", e, t, r);
        };
      } else qn[e] = function () {};
    return qn[e];
  };
  function mt(e, t) {
    var r = { seen: [], stylize: jp };
    return (
      arguments.length >= 3 && (r.depth = arguments[2]),
      arguments.length >= 4 && (r.colors = arguments[3]),
      oi(t) ? (r.showHidden = t) : t && G._extend(r, t),
      St(r.showHidden) && (r.showHidden = !1),
      St(r.depth) && (r.depth = 2),
      St(r.colors) && (r.colors = !1),
      St(r.customInspect) && (r.customInspect = !0),
      r.colors && (r.stylize = kp),
      Gn(r, e, r.depth)
    );
  }
  u(mt, "A");
  G.inspect = mt;
  mt.colors = {
    bold: [1, 22],
    italic: [3, 23],
    underline: [4, 24],
    inverse: [7, 27],
    white: [37, 39],
    grey: [90, 39],
    black: [30, 39],
    blue: [34, 39],
    cyan: [36, 39],
    green: [32, 39],
    magenta: [35, 39],
    red: [31, 39],
    yellow: [33, 39],
  };
  mt.styles = {
    special: "cyan",
    number: "yellow",
    boolean: "yellow",
    undefined: "grey",
    null: "bold",
    string: "green",
    date: "magenta",
    regexp: "red",
  };
  function kp(e, t) {
    var r = mt.styles[t];
    return r
      ? "\x1B[" + mt.colors[r][0] + "m" + e + "\x1B[" + mt.colors[r][1] + "m"
      : e;
  }
  u(kp, "xn");
  function jp(e, t) {
    return e;
  }
  u(jp, "Mn");
  function $p(e) {
    var t = {};
    return (
      e.forEach(function (r, n) {
        t[r] = !0;
      }),
      t
    );
  }
  u($p, "Nn");
  function Gn(e, t, r) {
    if (
      e.customInspect &&
      t &&
      Vn(t.inspect) &&
      t.inspect !== G.inspect &&
      !(t.constructor && t.constructor.prototype === t)
    ) {
      var n = t.inspect(r, e);
      return Wn(n) || (n = Gn(e, n, r)), n;
    }
    var o = Lp(e, t);
    if (o) return o;
    var i = Object.keys(t),
      s = $p(i);
    if (
      (e.showHidden && (i = Object.getOwnPropertyNames(t)),
      Cr(t) && (i.indexOf("message") >= 0 || i.indexOf("description") >= 0))
    )
      return Zo(t);
    if (i.length === 0) {
      if (Vn(t)) {
        var a = t.name ? ": " + t.name : "";
        return e.stylize("[Function" + a + "]", "special");
      }
      if (_r(t)) return e.stylize(RegExp.prototype.toString.call(t), "regexp");
      if (Jn(t)) return e.stylize(Date.prototype.toString.call(t), "date");
      if (Cr(t)) return Zo(t);
    }
    var c = "",
      l = !1,
      f = ["{", "}"];
    if ((Na(t) && ((l = !0), (f = ["[", "]"])), Vn(t))) {
      var g = t.name ? ": " + t.name : "";
      c = " [Function" + g + "]";
    }
    if (
      (_r(t) && (c = " " + RegExp.prototype.toString.call(t)),
      Jn(t) && (c = " " + Date.prototype.toUTCString.call(t)),
      Cr(t) && (c = " " + Zo(t)),
      i.length === 0 && (!l || t.length == 0))
    )
      return f[0] + c + f[1];
    if (r < 0)
      return _r(t)
        ? e.stylize(RegExp.prototype.toString.call(t), "regexp")
        : e.stylize("[Object]", "special");
    e.seen.push(t);
    var y;
    return (
      l
        ? (y = Bp(e, t, r, s, i))
        : (y = i.map(function (b) {
            return ei(e, t, r, s, b, l);
          })),
      e.seen.pop(),
      qp(y, c, f)
    );
  }
  u(Gn, "fr");
  function Lp(e, t) {
    if (St(t)) return e.stylize("undefined", "undefined");
    if (Wn(t)) {
      var r =
        "'" +
        JSON.stringify(t)
          .replace(/^"|"$/g, "")
          .replace(/'/g, "\\'")
          .replace(/\\"/g, '"') +
        "'";
      return e.stylize(r, "string");
    }
    if (ka(t)) return e.stylize("" + t, "number");
    if (oi(t)) return e.stylize("" + t, "boolean");
    if (Hn(t)) return e.stylize("null", "null");
  }
  u(Lp, "Cn");
  function Zo(e) {
    return "[" + Error.prototype.toString.call(e) + "]";
  }
  u(Zo, "xr");
  function Bp(e, t, r, n, o) {
    for (var i = [], s = 0, a = t.length; s < a; ++s)
      ja(t, String(s)) ? i.push(ei(e, t, r, n, String(s), !0)) : i.push("");
    return (
      o.forEach(function (c) {
        c.match(/^\d+$/) || i.push(ei(e, t, r, n, c, !0));
      }),
      i
    );
  }
  u(Bp, "$n");
  function ei(e, t, r, n, o, i) {
    var s, a, c;
    if (
      ((c = Object.getOwnPropertyDescriptor(t, o) || { value: t[o] }),
      c.get
        ? c.set
          ? (a = e.stylize("[Getter/Setter]", "special"))
          : (a = e.stylize("[Getter]", "special"))
        : c.set && (a = e.stylize("[Setter]", "special")),
      ja(n, o) || (s = "[" + o + "]"),
      a ||
        (e.seen.indexOf(c.value) < 0
          ? (Hn(r) ? (a = Gn(e, c.value, null)) : (a = Gn(e, c.value, r - 1)),
            a.indexOf(`
`) > -1 &&
              (i
                ? (a = a
                    .split(
                      `
`
                    )
                    .map(function (l) {
                      return "  " + l;
                    })
                    .join(
                      `
`
                    )
                    .slice(2))
                : (a =
                    `
` +
                    a
                      .split(
                        `
`
                      )
                      .map(function (l) {
                        return "   " + l;
                      }).join(`
`))))
          : (a = e.stylize("[Circular]", "special"))),
      St(s))
    ) {
      if (i && o.match(/^\d+$/)) return a;
      (s = JSON.stringify("" + o)),
        s.match(/^"([a-zA-Z_][a-zA-Z_0-9]*)"$/)
          ? ((s = s.slice(1, -1)), (s = e.stylize(s, "name")))
          : ((s = s
              .replace(/'/g, "\\'")
              .replace(/\\"/g, '"')
              .replace(/(^"|"$)/g, "'")),
            (s = e.stylize(s, "string")));
    }
    return s + ": " + a;
  }
  u(ei, "Nr");
  function qp(e, t, r) {
    var n = 0,
      o = e.reduce(function (i, s) {
        return (
          n++,
          s.indexOf(`
`) >= 0 && n++,
          i + s.replace(/\u001b\[\d\d?m/g, "").length + 1
        );
      }, 0);
    return o > 60
      ? r[0] +
          (t === ""
            ? ""
            : t +
              `
 `) +
          " " +
          e.join(`,
  `) +
          " " +
          r[1]
      : r[0] + t + " " + e.join(", ") + " " + r[1];
  }
  u(qp, "qn");
  G.types = Rp();
  function Na(e) {
    return Array.isArray(e);
  }
  u(Na, "rt");
  G.isArray = Na;
  function oi(e) {
    return typeof e == "boolean";
  }
  u(oi, "Cr");
  G.isBoolean = oi;
  function Hn(e) {
    return e === null;
  }
  u(Hn, "sr");
  G.isNull = Hn;
  function Up(e) {
    return e == null;
  }
  u(Up, "Gn");
  G.isNullOrUndefined = Up;
  function ka(e) {
    return typeof e == "number";
  }
  u(ka, "et");
  G.isNumber = ka;
  function Wn(e) {
    return typeof e == "string";
  }
  u(Wn, "yr");
  G.isString = Wn;
  function Vp(e) {
    return typeof e == "symbol";
  }
  u(Vp, "Wn");
  G.isSymbol = Vp;
  function St(e) {
    return e === void 0;
  }
  u(St, "j");
  G.isUndefined = St;
  function _r(e) {
    return Qt(e) && ii(e) === "[object RegExp]";
  }
  u(_r, "C");
  G.isRegExp = _r;
  G.types.isRegExp = _r;
  function Qt(e) {
    return typeof e == "object" && e !== null;
  }
  u(Qt, "D");
  G.isObject = Qt;
  function Jn(e) {
    return Qt(e) && ii(e) === "[object Date]";
  }
  u(Jn, "ur");
  G.isDate = Jn;
  G.types.isDate = Jn;
  function Cr(e) {
    return Qt(e) && (ii(e) === "[object Error]" || e instanceof Error);
  }
  u(Cr, "$");
  G.isError = Cr;
  G.types.isNativeError = Cr;
  function Vn(e) {
    return typeof e == "function";
  }
  u(Vn, "ar");
  G.isFunction = Vn;
  function Gp(e) {
    return (
      e === null ||
      typeof e == "boolean" ||
      typeof e == "number" ||
      typeof e == "string" ||
      typeof e == "symbol" ||
      typeof e > "u"
    );
  }
  u(Gp, "_n");
  G.isPrimitive = Gp;
  G.isBuffer = Fp();
  function ii(e) {
    return Object.prototype.toString.call(e);
  }
  u(ii, "$r");
  function Xo(e) {
    return e < 10 ? "0" + e.toString(10) : e.toString(10);
  }
  u(Xo, "Mr");
  var Jp = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];
  function zp() {
    var e = new Date(),
      t = [Xo(e.getHours()), Xo(e.getMinutes()), Xo(e.getSeconds())].join(":");
    return [e.getDate(), Jp[e.getMonth()], t].join(" ");
  }
  u(zp, "Vn");
  G.log = function () {
    console.log("%s - %s", zp(), G.format.apply(G, arguments));
  };
  G.inherits = Dp();
  G._extend = function (e, t) {
    if (!t || !Qt(t)) return e;
    for (var r = Object.keys(t), n = r.length; n--; ) e[r[n]] = t[r[n]];
    return e;
  };
  function ja(e, t) {
    return Object.prototype.hasOwnProperty.call(e, t);
  }
  u(ja, "tt");
  var Mt = typeof Symbol < "u" ? Symbol("util.promisify.custom") : void 0;
  G.promisify = function (e) {
    if (typeof e != "function")
      throw new TypeError('The "original" argument must be of type Function');
    if (Mt && e[Mt]) {
      var t = e[Mt];
      if (typeof t != "function")
        throw new TypeError(
          'The "util.promisify.custom" argument must be of type Function'
        );
      return (
        Object.defineProperty(t, Mt, {
          value: t,
          enumerable: !1,
          writable: !1,
          configurable: !0,
        }),
        t
      );
    }
    function t() {
      for (
        var r,
          n,
          o = new Promise(function (a, c) {
            (r = a), (n = c);
          }),
          i = [],
          s = 0;
        s < arguments.length;
        s++
      )
        i.push(arguments[s]);
      i.push(function (a, c) {
        a ? n(a) : r(c);
      });
      try {
        e.apply(this, i);
      } catch (a) {
        n(a);
      }
      return o;
    }
    return (
      u(t, "t"),
      Object.setPrototypeOf(t, Object.getPrototypeOf(e)),
      Mt &&
        Object.defineProperty(t, Mt, {
          value: t,
          enumerable: !1,
          writable: !1,
          configurable: !0,
        }),
      Object.defineProperties(t, Fa(e))
    );
  };
  G.promisify.custom = Mt;
  function Hp(e, t) {
    if (!e) {
      var r = new Error("Promise was rejected with a falsy value");
      (r.reason = e), (e = r);
    }
    return t(e);
  }
  u(Hp, "Jn");
  function Wp(e) {
    if (typeof e != "function")
      throw new TypeError('The "original" argument must be of type Function');
    function t() {
      for (var r = [], n = 0; n < arguments.length; n++) r.push(arguments[n]);
      var o = r.pop();
      if (typeof o != "function")
        throw new TypeError("The last argument must be of type Function");
      var i = this,
        s = u(function () {
          return o.apply(i, arguments);
        }, "a");
      e.apply(this, r).then(
        function (a) {
          w.nextTick(s.bind(null, null, a));
        },
        function (a) {
          w.nextTick(Hp.bind(null, a, s));
        }
      );
    }
    return (
      u(t, "e"),
      Object.setPrototypeOf(t, Object.getPrototypeOf(e)),
      Object.defineProperties(t, Fa(e)),
      t
    );
  }
  u(Wp, "Ln");
  G.callbackify = Wp;
});
var Ba = K((b0, La) => {
  d();
  p();
  m();
  var Yt = 1e3,
    Zt = Yt * 60,
    Xt = Zt * 60,
    Ot = Xt * 24,
    Kp = Ot * 7,
    Qp = Ot * 365.25;
  La.exports = function (e, t) {
    t = t || {};
    var r = typeof e;
    if (r === "string" && e.length > 0) return Yp(e);
    if (r === "number" && isFinite(e)) return t.long ? Xp(e) : Zp(e);
    throw new Error(
      "val is not a non-empty string or a valid number. val=" +
        JSON.stringify(e)
    );
  };
  function Yp(e) {
    if (((e = String(e)), !(e.length > 100))) {
      var t =
        /^(-?(?:\d+)?\.?\d+) *(milliseconds?|msecs?|ms|seconds?|secs?|s|minutes?|mins?|m|hours?|hrs?|h|days?|d|weeks?|w|years?|yrs?|y)?$/i.exec(
          e
        );
      if (!!t) {
        var r = parseFloat(t[1]),
          n = (t[2] || "ms").toLowerCase();
        switch (n) {
          case "years":
          case "year":
          case "yrs":
          case "yr":
          case "y":
            return r * Qp;
          case "weeks":
          case "week":
          case "w":
            return r * Kp;
          case "days":
          case "day":
          case "d":
            return r * Ot;
          case "hours":
          case "hour":
          case "hrs":
          case "hr":
          case "h":
            return r * Xt;
          case "minutes":
          case "minute":
          case "mins":
          case "min":
          case "m":
            return r * Zt;
          case "seconds":
          case "second":
          case "secs":
          case "sec":
          case "s":
            return r * Yt;
          case "milliseconds":
          case "millisecond":
          case "msecs":
          case "msec":
          case "ms":
            return r;
          default:
            return;
        }
      }
    }
  }
  u(Yp, "parse");
  function Zp(e) {
    var t = Math.abs(e);
    return t >= Ot
      ? Math.round(e / Ot) + "d"
      : t >= Xt
      ? Math.round(e / Xt) + "h"
      : t >= Zt
      ? Math.round(e / Zt) + "m"
      : t >= Yt
      ? Math.round(e / Yt) + "s"
      : e + "ms";
  }
  u(Zp, "fmtShort");
  function Xp(e) {
    var t = Math.abs(e);
    return t >= Ot
      ? Kn(e, t, Ot, "day")
      : t >= Xt
      ? Kn(e, t, Xt, "hour")
      : t >= Zt
      ? Kn(e, t, Zt, "minute")
      : t >= Yt
      ? Kn(e, t, Yt, "second")
      : e + " ms";
  }
  u(Xp, "fmtLong");
  function Kn(e, t, r, n) {
    var o = t >= r * 1.5;
    return Math.round(e / r) + " " + n + (o ? "s" : "");
  }
  u(Kn, "plural");
});
var si = K((T0, qa) => {
  d();
  p();
  m();
  function em(e) {
    (r.debug = r),
      (r.default = r),
      (r.coerce = c),
      (r.disable = i),
      (r.enable = o),
      (r.enabled = s),
      (r.humanize = Ba()),
      (r.destroy = l),
      Object.keys(e).forEach((f) => {
        r[f] = e[f];
      }),
      (r.names = []),
      (r.skips = []),
      (r.formatters = {});
    function t(f) {
      let g = 0;
      for (let y = 0; y < f.length; y++)
        (g = (g << 5) - g + f.charCodeAt(y)), (g |= 0);
      return r.colors[Math.abs(g) % r.colors.length];
    }
    u(t, "selectColor"), (r.selectColor = t);
    function r(f) {
      let g,
        y = null,
        b,
        x;
      function h(...A) {
        if (!h.enabled) return;
        let M = h,
          P = Number(new Date()),
          S = P - (g || P);
        (M.diff = S),
          (M.prev = g),
          (M.curr = P),
          (g = P),
          (A[0] = r.coerce(A[0])),
          typeof A[0] != "string" && A.unshift("%O");
        let T = 0;
        (A[0] = A[0].replace(/%([a-zA-Z%])/g, (R, F) => {
          if (R === "%%") return "%";
          T++;
          let B = r.formatters[F];
          if (typeof B == "function") {
            let W = A[T];
            (R = B.call(M, W)), A.splice(T, 1), T--;
          }
          return R;
        })),
          r.formatArgs.call(M, A),
          (M.log || r.log).apply(M, A);
      }
      return (
        u(h, "debug"),
        (h.namespace = f),
        (h.useColors = r.useColors()),
        (h.color = r.selectColor(f)),
        (h.extend = n),
        (h.destroy = r.destroy),
        Object.defineProperty(h, "enabled", {
          enumerable: !0,
          configurable: !1,
          get: () =>
            y !== null
              ? y
              : (b !== r.namespaces && ((b = r.namespaces), (x = r.enabled(f))),
                x),
          set: (A) => {
            y = A;
          },
        }),
        typeof r.init == "function" && r.init(h),
        h
      );
    }
    u(r, "createDebug");
    function n(f, g) {
      let y = r(this.namespace + (typeof g == "undefined" ? ":" : g) + f);
      return (y.log = this.log), y;
    }
    u(n, "extend");
    function o(f) {
      r.save(f), (r.namespaces = f), (r.names = []), (r.skips = []);
      let g,
        y = (typeof f == "string" ? f : "").split(/[\s,]+/),
        b = y.length;
      for (g = 0; g < b; g++)
        !y[g] ||
          ((f = y[g].replace(/\*/g, ".*?")),
          f[0] === "-"
            ? r.skips.push(new RegExp("^" + f.slice(1) + "$"))
            : r.names.push(new RegExp("^" + f + "$")));
    }
    u(o, "enable");
    function i() {
      let f = [...r.names.map(a), ...r.skips.map(a).map((g) => "-" + g)].join(
        ","
      );
      return r.enable(""), f;
    }
    u(i, "disable");
    function s(f) {
      if (f[f.length - 1] === "*") return !0;
      let g, y;
      for (g = 0, y = r.skips.length; g < y; g++)
        if (r.skips[g].test(f)) return !1;
      for (g = 0, y = r.names.length; g < y; g++)
        if (r.names[g].test(f)) return !0;
      return !1;
    }
    u(s, "enabled");
    function a(f) {
      return f
        .toString()
        .substring(2, f.toString().length - 2)
        .replace(/\.\*\?$/, "*");
    }
    u(a, "toNamespace");
    function c(f) {
      return f instanceof Error ? f.stack || f.message : f;
    }
    u(c, "coerce");
    function l() {
      console.warn(
        "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
      );
    }
    return u(l, "destroy"), r.enable(r.load()), r;
  }
  u(em, "setup");
  qa.exports = em;
});
var Ua = K((Ae, Qn) => {
  d();
  p();
  m();
  Ae.formatArgs = rm;
  Ae.save = nm;
  Ae.load = om;
  Ae.useColors = tm;
  Ae.storage = im();
  Ae.destroy = (() => {
    let e = !1;
    return () => {
      e ||
        ((e = !0),
        console.warn(
          "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`."
        ));
    };
  })();
  Ae.colors = [
    "#0000CC",
    "#0000FF",
    "#0033CC",
    "#0033FF",
    "#0066CC",
    "#0066FF",
    "#0099CC",
    "#0099FF",
    "#00CC00",
    "#00CC33",
    "#00CC66",
    "#00CC99",
    "#00CCCC",
    "#00CCFF",
    "#3300CC",
    "#3300FF",
    "#3333CC",
    "#3333FF",
    "#3366CC",
    "#3366FF",
    "#3399CC",
    "#3399FF",
    "#33CC00",
    "#33CC33",
    "#33CC66",
    "#33CC99",
    "#33CCCC",
    "#33CCFF",
    "#6600CC",
    "#6600FF",
    "#6633CC",
    "#6633FF",
    "#66CC00",
    "#66CC33",
    "#9900CC",
    "#9900FF",
    "#9933CC",
    "#9933FF",
    "#99CC00",
    "#99CC33",
    "#CC0000",
    "#CC0033",
    "#CC0066",
    "#CC0099",
    "#CC00CC",
    "#CC00FF",
    "#CC3300",
    "#CC3333",
    "#CC3366",
    "#CC3399",
    "#CC33CC",
    "#CC33FF",
    "#CC6600",
    "#CC6633",
    "#CC9900",
    "#CC9933",
    "#CCCC00",
    "#CCCC33",
    "#FF0000",
    "#FF0033",
    "#FF0066",
    "#FF0099",
    "#FF00CC",
    "#FF00FF",
    "#FF3300",
    "#FF3333",
    "#FF3366",
    "#FF3399",
    "#FF33CC",
    "#FF33FF",
    "#FF6600",
    "#FF6633",
    "#FF9900",
    "#FF9933",
    "#FFCC00",
    "#FFCC33",
  ];
  function tm() {
    return typeof window != "undefined" &&
      window.process &&
      (window.process.type === "renderer" || window.process.__nwjs)
      ? !0
      : typeof navigator != "undefined" &&
        navigator.userAgent &&
        navigator.userAgent.toLowerCase().match(/(edge|trident)\/(\d+)/)
      ? !1
      : (typeof document != "undefined" &&
          document.documentElement &&
          document.documentElement.style &&
          document.documentElement.style.WebkitAppearance) ||
        (typeof window != "undefined" &&
          window.console &&
          (window.console.firebug ||
            (window.console.exception && window.console.table))) ||
        (typeof navigator != "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/firefox\/(\d+)/) &&
          parseInt(RegExp.$1, 10) >= 31) ||
        (typeof navigator != "undefined" &&
          navigator.userAgent &&
          navigator.userAgent.toLowerCase().match(/applewebkit\/(\d+)/));
  }
  u(tm, "useColors");
  function rm(e) {
    if (
      ((e[0] =
        (this.useColors ? "%c" : "") +
        this.namespace +
        (this.useColors ? " %c" : " ") +
        e[0] +
        (this.useColors ? "%c " : " ") +
        "+" +
        Qn.exports.humanize(this.diff)),
      !this.useColors)
    )
      return;
    let t = "color: " + this.color;
    e.splice(1, 0, t, "color: inherit");
    let r = 0,
      n = 0;
    e[0].replace(/%[a-zA-Z%]/g, (o) => {
      o !== "%%" && (r++, o === "%c" && (n = r));
    }),
      e.splice(n, 0, t);
  }
  u(rm, "formatArgs");
  Ae.log = console.debug || console.log || (() => {});
  function nm(e) {
    try {
      e ? Ae.storage.setItem("debug", e) : Ae.storage.removeItem("debug");
    } catch (t) {}
  }
  u(nm, "save");
  function om() {
    let e;
    try {
      e = Ae.storage.getItem("debug");
    } catch (t) {}
    return !e && typeof w != "undefined" && "env" in w && (e = w.env.DEBUG), e;
  }
  u(om, "load");
  function im() {
    try {
      return localStorage;
    } catch (e) {}
  }
  u(im, "localstorage");
  Qn.exports = si()(Ae);
  var { formatters: sm } = Qn.exports;
  sm.j = function (e) {
    try {
      return JSON.stringify(e);
    } catch (t) {
      return "[UnexpectedJSONParseError]: " + t.message;
    }
  };
});
var Va = K((Yn) => {
  d();
  p();
  m();
  Yn.isatty = function () {
    return !1;
  };
  function am() {
    throw new Error("tty.ReadStream is not implemented");
  }
  u(am, "t");
  Yn.ReadStream = am;
  function um() {
    throw new Error("tty.WriteStream is not implemented");
  }
  u(um, "e");
  Yn.WriteStream = um;
});
var Ja = K((ue, Xn) => {
  d();
  p();
  m();
  var cm = Va(),
    Zn = $a();
  ue.init = ym;
  ue.log = mm;
  ue.formatArgs = fm;
  ue.save = dm;
  ue.load = gm;
  ue.useColors = lm;
  ue.destroy = Zn.deprecate(() => {},
  "Instance method `debug.destroy()` is deprecated and no longer does anything. It will be removed in the next major version of `debug`.");
  ue.colors = [6, 2, 3, 4, 5, 1];
  try {
    let e = ko();
    e &&
      (e.stderr || e).level >= 2 &&
      (ue.colors = [
        20, 21, 26, 27, 32, 33, 38, 39, 40, 41, 42, 43, 44, 45, 56, 57, 62, 63,
        68, 69, 74, 75, 76, 77, 78, 79, 80, 81, 92, 93, 98, 99, 112, 113, 128,
        129, 134, 135, 148, 149, 160, 161, 162, 163, 164, 165, 166, 167, 168,
        169, 170, 171, 172, 173, 178, 179, 184, 185, 196, 197, 198, 199, 200,
        201, 202, 203, 204, 205, 206, 207, 208, 209, 214, 215, 220, 221,
      ]);
  } catch (e) {}
  ue.inspectOpts = Object.keys(w.env)
    .filter((e) => /^debug_/i.test(e))
    .reduce((e, t) => {
      let r = t
          .substring(6)
          .toLowerCase()
          .replace(/_([a-z])/g, (o, i) => i.toUpperCase()),
        n = w.env[t];
      return (
        /^(yes|on|true|enabled)$/i.test(n)
          ? (n = !0)
          : /^(no|off|false|disabled)$/i.test(n)
          ? (n = !1)
          : n === "null"
          ? (n = null)
          : (n = Number(n)),
        (e[r] = n),
        e
      );
    }, {});
  function lm() {
    return "colors" in ue.inspectOpts
      ? Boolean(ue.inspectOpts.colors)
      : cm.isatty(w.stderr.fd);
  }
  u(lm, "useColors");
  function fm(e) {
    let { namespace: t, useColors: r } = this;
    if (r) {
      let n = this.color,
        o = "\x1B[3" + (n < 8 ? n : "8;5;" + n),
        i = `  ${o};1m${t} \x1B[0m`;
      (e[0] =
        i +
        e[0]
          .split(
            `
`
          )
          .join(
            `
` + i
          )),
        e.push(o + "m+" + Xn.exports.humanize(this.diff) + "\x1B[0m");
    } else e[0] = pm() + t + " " + e[0];
  }
  u(fm, "formatArgs");
  function pm() {
    return ue.inspectOpts.hideDate ? "" : new Date().toISOString() + " ";
  }
  u(pm, "getDate");
  function mm(...e) {
    return w.stderr.write(
      Zn.format(...e) +
        `
`
    );
  }
  u(mm, "log");
  function dm(e) {
    e ? (w.env.DEBUG = e) : delete w.env.DEBUG;
  }
  u(dm, "save");
  function gm() {
    return w.env.DEBUG;
  }
  u(gm, "load");
  function ym(e) {
    e.inspectOpts = {};
    let t = Object.keys(ue.inspectOpts);
    for (let r = 0; r < t.length; r++)
      e.inspectOpts[t[r]] = ue.inspectOpts[t[r]];
  }
  u(ym, "init");
  Xn.exports = si()(ue);
  var { formatters: Ga } = Xn.exports;
  Ga.o = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      Zn.inspect(e, this.inspectOpts)
        .split(
          `
`
        )
        .map((t) => t.trim())
        .join(" ")
    );
  };
  Ga.O = function (e) {
    return (
      (this.inspectOpts.colors = this.useColors),
      Zn.inspect(e, this.inspectOpts)
    );
  };
});
var za = K((q0, ai) => {
  d();
  p();
  m();
  typeof w == "undefined" ||
  w.type === "renderer" ||
  w.browser === !0 ||
  w.__nwjs
    ? (ai.exports = Ua())
    : (ai.exports = Ja());
});
var Bm,
  co,
  bi = bn(() => {
    d();
    p();
    m();
    (Bm = {
      existsSync() {
        return !1;
      },
    }),
      (co = Bm);
  });
var Ru = K((X2, Iu) => {
  "use strict";
  d();
  p();
  m();
  function ze(e) {
    if (typeof e != "string")
      throw new TypeError(
        "Path must be a string. Received " + JSON.stringify(e)
      );
  }
  u(ze, "c");
  function Cu(e, t) {
    for (var r = "", n = 0, o = -1, i = 0, s, a = 0; a <= e.length; ++a) {
      if (a < e.length) s = e.charCodeAt(a);
      else {
        if (s === 47) break;
        s = 47;
      }
      if (s === 47) {
        if (!(o === a - 1 || i === 1))
          if (o !== a - 1 && i === 2) {
            if (
              r.length < 2 ||
              n !== 2 ||
              r.charCodeAt(r.length - 1) !== 46 ||
              r.charCodeAt(r.length - 2) !== 46
            ) {
              if (r.length > 2) {
                var c = r.lastIndexOf("/");
                if (c !== r.length - 1) {
                  c === -1
                    ? ((r = ""), (n = 0))
                    : ((r = r.slice(0, c)),
                      (n = r.length - 1 - r.lastIndexOf("/"))),
                    (o = a),
                    (i = 0);
                  continue;
                }
              } else if (r.length === 2 || r.length === 1) {
                (r = ""), (n = 0), (o = a), (i = 0);
                continue;
              }
            }
            t && (r.length > 0 ? (r += "/..") : (r = ".."), (n = 2));
          } else
            r.length > 0
              ? (r += "/" + e.slice(o + 1, a))
              : (r = e.slice(o + 1, a)),
              (n = a - o - 1);
        (o = a), (i = 0);
      } else s === 46 && i !== -1 ? ++i : (i = -1);
    }
    return r;
  }
  u(Cu, "A");
  function qm(e, t) {
    var r = t.dir || t.root,
      n = t.base || (t.name || "") + (t.ext || "");
    return r ? (r === t.root ? r + n : r + e + n) : n;
  }
  u(qm, "b");
  var tr = {
    resolve: function () {
      for (
        var e = "", t = !1, r, n = arguments.length - 1;
        n >= -1 && !t;
        n--
      ) {
        var o;
        n >= 0 ? (o = arguments[n]) : (r === void 0 && (r = w.cwd()), (o = r)),
          ze(o),
          o.length !== 0 && ((e = o + "/" + e), (t = o.charCodeAt(0) === 47));
      }
      return (
        (e = Cu(e, !t)),
        t ? (e.length > 0 ? "/" + e : "/") : e.length > 0 ? e : "."
      );
    },
    normalize: function (e) {
      if ((ze(e), e.length === 0)) return ".";
      var t = e.charCodeAt(0) === 47,
        r = e.charCodeAt(e.length - 1) === 47;
      return (
        (e = Cu(e, !t)),
        e.length === 0 && !t && (e = "."),
        e.length > 0 && r && (e += "/"),
        t ? "/" + e : e
      );
    },
    isAbsolute: function (e) {
      return ze(e), e.length > 0 && e.charCodeAt(0) === 47;
    },
    join: function () {
      if (arguments.length === 0) return ".";
      for (var e, t = 0; t < arguments.length; ++t) {
        var r = arguments[t];
        ze(r), r.length > 0 && (e === void 0 ? (e = r) : (e += "/" + r));
      }
      return e === void 0 ? "." : tr.normalize(e);
    },
    relative: function (e, t) {
      if (
        (ze(e),
        ze(t),
        e === t || ((e = tr.resolve(e)), (t = tr.resolve(t)), e === t))
      )
        return "";
      for (var r = 1; r < e.length && e.charCodeAt(r) === 47; ++r);
      for (
        var n = e.length, o = n - r, i = 1;
        i < t.length && t.charCodeAt(i) === 47;
        ++i
      );
      for (
        var s = t.length, a = s - i, c = o < a ? o : a, l = -1, f = 0;
        f <= c;
        ++f
      ) {
        if (f === c) {
          if (a > c) {
            if (t.charCodeAt(i + f) === 47) return t.slice(i + f + 1);
            if (f === 0) return t.slice(i + f);
          } else
            o > c &&
              (e.charCodeAt(r + f) === 47 ? (l = f) : f === 0 && (l = 0));
          break;
        }
        var g = e.charCodeAt(r + f),
          y = t.charCodeAt(i + f);
        if (g !== y) break;
        g === 47 && (l = f);
      }
      var b = "";
      for (f = r + l + 1; f <= n; ++f)
        (f === n || e.charCodeAt(f) === 47) &&
          (b.length === 0 ? (b += "..") : (b += "/.."));
      return b.length > 0
        ? b + t.slice(i + l)
        : ((i += l), t.charCodeAt(i) === 47 && ++i, t.slice(i));
    },
    _makeLong: function (e) {
      return e;
    },
    dirname: function (e) {
      if ((ze(e), e.length === 0)) return ".";
      for (
        var t = e.charCodeAt(0), r = t === 47, n = -1, o = !0, i = e.length - 1;
        i >= 1;
        --i
      )
        if (((t = e.charCodeAt(i)), t === 47)) {
          if (!o) {
            n = i;
            break;
          }
        } else o = !1;
      return n === -1 ? (r ? "/" : ".") : r && n === 1 ? "//" : e.slice(0, n);
    },
    basename: function (e, t) {
      if (t !== void 0 && typeof t != "string")
        throw new TypeError('"ext" argument must be a string');
      ze(e);
      var r = 0,
        n = -1,
        o = !0,
        i;
      if (t !== void 0 && t.length > 0 && t.length <= e.length) {
        if (t.length === e.length && t === e) return "";
        var s = t.length - 1,
          a = -1;
        for (i = e.length - 1; i >= 0; --i) {
          var c = e.charCodeAt(i);
          if (c === 47) {
            if (!o) {
              r = i + 1;
              break;
            }
          } else
            a === -1 && ((o = !1), (a = i + 1)),
              s >= 0 &&
                (c === t.charCodeAt(s)
                  ? --s === -1 && (n = i)
                  : ((s = -1), (n = a)));
        }
        return r === n ? (n = a) : n === -1 && (n = e.length), e.slice(r, n);
      } else {
        for (i = e.length - 1; i >= 0; --i)
          if (e.charCodeAt(i) === 47) {
            if (!o) {
              r = i + 1;
              break;
            }
          } else n === -1 && ((o = !1), (n = i + 1));
        return n === -1 ? "" : e.slice(r, n);
      }
    },
    extname: function (e) {
      ze(e);
      for (
        var t = -1, r = 0, n = -1, o = !0, i = 0, s = e.length - 1;
        s >= 0;
        --s
      ) {
        var a = e.charCodeAt(s);
        if (a === 47) {
          if (!o) {
            r = s + 1;
            break;
          }
          continue;
        }
        n === -1 && ((o = !1), (n = s + 1)),
          a === 46
            ? t === -1
              ? (t = s)
              : i !== 1 && (i = 1)
            : t !== -1 && (i = -1);
      }
      return t === -1 ||
        n === -1 ||
        i === 0 ||
        (i === 1 && t === n - 1 && t === r + 1)
        ? ""
        : e.slice(t, n);
    },
    format: function (e) {
      if (e === null || typeof e != "object")
        throw new TypeError(
          'The "pathObject" argument must be of type Object. Received type ' +
            typeof e
        );
      return qm("/", e);
    },
    parse: function (e) {
      ze(e);
      var t = { root: "", dir: "", base: "", ext: "", name: "" };
      if (e.length === 0) return t;
      var r = e.charCodeAt(0),
        n = r === 47,
        o;
      n ? ((t.root = "/"), (o = 1)) : (o = 0);
      for (
        var i = -1, s = 0, a = -1, c = !0, l = e.length - 1, f = 0;
        l >= o;
        --l
      ) {
        if (((r = e.charCodeAt(l)), r === 47)) {
          if (!c) {
            s = l + 1;
            break;
          }
          continue;
        }
        a === -1 && ((c = !1), (a = l + 1)),
          r === 46
            ? i === -1
              ? (i = l)
              : f !== 1 && (f = 1)
            : i !== -1 && (f = -1);
      }
      return (
        i === -1 ||
        a === -1 ||
        f === 0 ||
        (f === 1 && i === a - 1 && i === s + 1)
          ? a !== -1 &&
            (s === 0 && n
              ? (t.base = t.name = e.slice(1, a))
              : (t.base = t.name = e.slice(s, a)))
          : (s === 0 && n
              ? ((t.name = e.slice(1, i)), (t.base = e.slice(1, a)))
              : ((t.name = e.slice(s, i)), (t.base = e.slice(s, a))),
            (t.ext = e.slice(i, a))),
        s > 0 ? (t.dir = e.slice(0, s - 1)) : n && (t.dir = "/"),
        t
      );
    },
    sep: "/",
    delimiter: ":",
    win32: null,
    posix: null,
  };
  tr.posix = tr;
  Iu.exports = tr;
});
var Du = K((oE, wi) => {
  "use strict";
  d();
  p();
  m();
  var Um = Object.prototype.hasOwnProperty,
    ye = "~";
  function kr() {}
  u(kr, "_");
  Object.create &&
    ((kr.prototype = Object.create(null)), new kr().__proto__ || (ye = !1));
  function Vm(e, t, r) {
    (this.fn = e), (this.context = t), (this.once = r || !1);
  }
  u(Vm, "g");
  function Fu(e, t, r, n, o) {
    if (typeof r != "function")
      throw new TypeError("The listener must be a function");
    var i = new Vm(r, n || e, o),
      s = ye ? ye + t : t;
    return (
      e._events[s]
        ? e._events[s].fn
          ? (e._events[s] = [e._events[s], i])
          : e._events[s].push(i)
        : ((e._events[s] = i), e._eventsCount++),
      e
    );
  }
  u(Fu, "w");
  function lo(e, t) {
    --e._eventsCount === 0 ? (e._events = new kr()) : delete e._events[t];
  }
  u(lo, "y");
  function fe() {
    (this._events = new kr()), (this._eventsCount = 0);
  }
  u(fe, "u");
  fe.prototype.eventNames = function () {
    var e = [],
      t,
      r;
    if (this._eventsCount === 0) return e;
    for (r in (t = this._events)) Um.call(t, r) && e.push(ye ? r.slice(1) : r);
    return Object.getOwnPropertySymbols
      ? e.concat(Object.getOwnPropertySymbols(t))
      : e;
  };
  fe.prototype.listeners = function (e) {
    var t = ye ? ye + e : e,
      r = this._events[t];
    if (!r) return [];
    if (r.fn) return [r.fn];
    for (var n = 0, o = r.length, i = new Array(o); n < o; n++) i[n] = r[n].fn;
    return i;
  };
  fe.prototype.listenerCount = function (e) {
    var t = ye ? ye + e : e,
      r = this._events[t];
    return r ? (r.fn ? 1 : r.length) : 0;
  };
  fe.prototype.emit = function (e, t, r, n, o, i) {
    var s = ye ? ye + e : e;
    if (!this._events[s]) return !1;
    var a = this._events[s],
      c = arguments.length,
      l,
      f;
    if (a.fn) {
      switch ((a.once && this.removeListener(e, a.fn, void 0, !0), c)) {
        case 1:
          return a.fn.call(a.context), !0;
        case 2:
          return a.fn.call(a.context, t), !0;
        case 3:
          return a.fn.call(a.context, t, r), !0;
        case 4:
          return a.fn.call(a.context, t, r, n), !0;
        case 5:
          return a.fn.call(a.context, t, r, n, o), !0;
        case 6:
          return a.fn.call(a.context, t, r, n, o, i), !0;
      }
      for (f = 1, l = new Array(c - 1); f < c; f++) l[f - 1] = arguments[f];
      a.fn.apply(a.context, l);
    } else {
      var g = a.length,
        y;
      for (f = 0; f < g; f++)
        switch ((a[f].once && this.removeListener(e, a[f].fn, void 0, !0), c)) {
          case 1:
            a[f].fn.call(a[f].context);
            break;
          case 2:
            a[f].fn.call(a[f].context, t);
            break;
          case 3:
            a[f].fn.call(a[f].context, t, r);
            break;
          case 4:
            a[f].fn.call(a[f].context, t, r, n);
            break;
          default:
            if (!l)
              for (y = 1, l = new Array(c - 1); y < c; y++)
                l[y - 1] = arguments[y];
            a[f].fn.apply(a[f].context, l);
        }
    }
    return !0;
  };
  fe.prototype.on = function (e, t, r) {
    return Fu(this, e, t, r, !1);
  };
  fe.prototype.once = function (e, t, r) {
    return Fu(this, e, t, r, !0);
  };
  fe.prototype.removeListener = function (e, t, r, n) {
    var o = ye ? ye + e : e;
    if (!this._events[o]) return this;
    if (!t) return lo(this, o), this;
    var i = this._events[o];
    if (i.fn)
      i.fn === t && (!n || i.once) && (!r || i.context === r) && lo(this, o);
    else {
      for (var s = 0, a = [], c = i.length; s < c; s++)
        (i[s].fn !== t || (n && !i[s].once) || (r && i[s].context !== r)) &&
          a.push(i[s]);
      a.length ? (this._events[o] = a.length === 1 ? a[0] : a) : lo(this, o);
    }
    return this;
  };
  fe.prototype.removeAllListeners = function (e) {
    var t;
    return (
      e
        ? ((t = ye ? ye + e : e), this._events[t] && lo(this, t))
        : ((this._events = new kr()), (this._eventsCount = 0)),
      this
    );
  };
  fe.prototype.off = fe.prototype.removeListener;
  fe.prototype.addListener = fe.prototype.on;
  fe.prefixed = ye;
  fe.EventEmitter = fe;
  typeof wi < "u" && (wi.exports = fe);
});
var ku = K((DE, Nu) => {
  "use strict";
  d();
  p();
  m();
  Nu.exports = ({ onlyFirst: e = !1 } = {}) => {
    let t = [
      "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
      "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))",
    ].join("|");
    return new RegExp(t, e ? void 0 : "g");
  };
});
var fo = K(($E, ju) => {
  "use strict";
  d();
  p();
  m();
  var Gm = ku();
  ju.exports = (e) => (typeof e == "string" ? e.replace(Gm(), "") : e);
});
var Hu = K((SS, zu) => {
  d();
  p();
  m();
  var Ci = Symbol("arg flag"),
    be = class extends Error {
      constructor(t, r) {
        super(t),
          (this.name = "ArgError"),
          (this.code = r),
          Object.setPrototypeOf(this, be.prototype);
      }
    };
  u(be, "ArgError");
  function Qr(
    e,
    {
      argv: t = w.argv.slice(2),
      permissive: r = !1,
      stopAtPositional: n = !1,
    } = {}
  ) {
    if (!e)
      throw new be(
        "argument specification object is required",
        "ARG_CONFIG_NO_SPEC"
      );
    let o = { _: [] },
      i = {},
      s = {};
    for (let a of Object.keys(e)) {
      if (!a)
        throw new be(
          "argument key cannot be an empty string",
          "ARG_CONFIG_EMPTY_KEY"
        );
      if (a[0] !== "-")
        throw new be(
          `argument key must start with '-' but found: '${a}'`,
          "ARG_CONFIG_NONOPT_KEY"
        );
      if (a.length === 1)
        throw new be(
          `argument key must have a name; singular '-' keys are not allowed: ${a}`,
          "ARG_CONFIG_NONAME_KEY"
        );
      if (typeof e[a] == "string") {
        i[a] = e[a];
        continue;
      }
      let c = e[a],
        l = !1;
      if (Array.isArray(c) && c.length === 1 && typeof c[0] == "function") {
        let [f] = c;
        (c = u(
          (g, y, b = []) => (b.push(f(g, y, b[b.length - 1])), b),
          "type"
        )),
          (l = f === Boolean || f[Ci] === !0);
      } else if (typeof c == "function") l = c === Boolean || c[Ci] === !0;
      else
        throw new be(
          `type missing or not a function or valid array type: ${a}`,
          "ARG_CONFIG_VAD_TYPE"
        );
      if (a[1] !== "-" && a.length > 2)
        throw new be(
          `short argument keys (with a single hyphen) must have only one character: ${a}`,
          "ARG_CONFIG_SHORTOPT_TOOLONG"
        );
      s[a] = [c, l];
    }
    for (let a = 0, c = t.length; a < c; a++) {
      let l = t[a];
      if (n && o._.length > 0) {
        o._ = o._.concat(t.slice(a));
        break;
      }
      if (l === "--") {
        o._ = o._.concat(t.slice(a + 1));
        break;
      }
      if (l.length > 1 && l[0] === "-") {
        let f =
          l[1] === "-" || l.length === 2
            ? [l]
            : l
                .slice(1)
                .split("")
                .map((g) => `-${g}`);
        for (let g = 0; g < f.length; g++) {
          let y = f[g],
            [b, x] = y[1] === "-" ? y.split(/=(.*)/, 2) : [y, void 0],
            h = b;
          for (; h in i; ) h = i[h];
          if (!(h in s))
            if (r) {
              o._.push(y);
              continue;
            } else
              throw new be(
                `unknown or unexpected option: ${b}`,
                "ARG_UNKNOWN_OPTION"
              );
          let [A, M] = s[h];
          if (!M && g + 1 < f.length)
            throw new be(
              `option requires argument (but was followed by another short argument): ${b}`,
              "ARG_MISSING_REQUIRED_SHORTARG"
            );
          if (M) o[h] = A(!0, h, o[h]);
          else if (x === void 0) {
            if (
              t.length < a + 2 ||
              (t[a + 1].length > 1 &&
                t[a + 1][0] === "-" &&
                !(
                  t[a + 1].match(/^-?\d*(\.(?=\d))?\d*$/) &&
                  (A === Number ||
                    (typeof BigInt != "undefined" && A === BigInt))
                ))
            ) {
              let P = b === h ? "" : ` (alias for ${h})`;
              throw new be(
                `option requires argument: ${b}${P}`,
                "ARG_MISSING_REQUIRED_LONGARG"
              );
            }
            (o[h] = A(t[a + 1], h, o[h])), ++a;
          } else o[h] = A(x, h, o[h]);
        }
      } else o._.push(l);
    }
    return o;
  }
  u(Qr, "arg");
  Qr.flag = (e) => ((e[Ci] = !0), e);
  Qr.COUNT = Qr.flag((e, t, r) => (r || 0) + 1);
  Qr.ArgError = be;
  zu.exports = Qr;
});
var Ku = K((RS, Wu) => {
  "use strict";
  d();
  p();
  m();
  Wu.exports = (e) => {
    let t = e.match(/^[ \t]*(?=\S)/gm);
    return t ? t.reduce((r, n) => Math.min(r, n.length), 1 / 0) : 0;
  };
});
var Ii = K((kS, Qu) => {
  "use strict";
  d();
  p();
  m();
  var id = Ku();
  Qu.exports = (e) => {
    let t = id(e);
    if (t === 0) return e;
    let r = new RegExp(`^[ \\t]{${t}}`, "gm");
    return e.replace(r, "");
  };
});
var ec = K(() => {
  d();
  p();
  m();
});
var nc = K((ji, $i) => {
  d();
  p();
  m();
  (function (e, t) {
    typeof yr == "function" && typeof ji == "object" && typeof $i == "object"
      ? ($i.exports = t())
      : (e.pluralize = t());
  })(ji, function () {
    var e = [],
      t = [],
      r = {},
      n = {},
      o = {};
    function i(b) {
      return typeof b == "string" ? new RegExp("^" + b + "$", "i") : b;
    }
    u(i, "sanitizeRule");
    function s(b, x) {
      return b === x
        ? x
        : b === b.toLowerCase()
        ? x.toLowerCase()
        : b === b.toUpperCase()
        ? x.toUpperCase()
        : b[0] === b[0].toUpperCase()
        ? x.charAt(0).toUpperCase() + x.substr(1).toLowerCase()
        : x.toLowerCase();
    }
    u(s, "restoreCase");
    function a(b, x) {
      return b.replace(/\$(\d{1,2})/g, function (h, A) {
        return x[A] || "";
      });
    }
    u(a, "interpolate");
    function c(b, x) {
      return b.replace(x[0], function (h, A) {
        var M = a(x[1], arguments);
        return s(h === "" ? b[A - 1] : h, M);
      });
    }
    u(c, "replace");
    function l(b, x, h) {
      if (!b.length || r.hasOwnProperty(b)) return x;
      for (var A = h.length; A--; ) {
        var M = h[A];
        if (M[0].test(x)) return c(x, M);
      }
      return x;
    }
    u(l, "sanitizeWord");
    function f(b, x, h) {
      return function (A) {
        var M = A.toLowerCase();
        return x.hasOwnProperty(M)
          ? s(A, M)
          : b.hasOwnProperty(M)
          ? s(A, b[M])
          : l(M, A, h);
      };
    }
    u(f, "replaceWord");
    function g(b, x, h, A) {
      return function (M) {
        var P = M.toLowerCase();
        return x.hasOwnProperty(P)
          ? !0
          : b.hasOwnProperty(P)
          ? !1
          : l(P, P, h) === P;
      };
    }
    u(g, "checkWord");
    function y(b, x, h) {
      var A = x === 1 ? y.singular(b) : y.plural(b);
      return (h ? x + " " : "") + A;
    }
    return (
      u(y, "pluralize"),
      (y.plural = f(o, n, e)),
      (y.isPlural = g(o, n, e)),
      (y.singular = f(n, o, t)),
      (y.isSingular = g(n, o, t)),
      (y.addPluralRule = function (b, x) {
        e.push([i(b), x]);
      }),
      (y.addSingularRule = function (b, x) {
        t.push([i(b), x]);
      }),
      (y.addUncountableRule = function (b) {
        if (typeof b == "string") {
          r[b.toLowerCase()] = !0;
          return;
        }
        y.addPluralRule(b, "$0"), y.addSingularRule(b, "$0");
      }),
      (y.addIrregularRule = function (b, x) {
        (x = x.toLowerCase()), (b = b.toLowerCase()), (o[b] = x), (n[x] = b);
      }),
      [
        ["I", "we"],
        ["me", "us"],
        ["he", "they"],
        ["she", "they"],
        ["them", "them"],
        ["myself", "ourselves"],
        ["yourself", "yourselves"],
        ["itself", "themselves"],
        ["herself", "themselves"],
        ["himself", "themselves"],
        ["themself", "themselves"],
        ["is", "are"],
        ["was", "were"],
        ["has", "have"],
        ["this", "these"],
        ["that", "those"],
        ["echo", "echoes"],
        ["dingo", "dingoes"],
        ["volcano", "volcanoes"],
        ["tornado", "tornadoes"],
        ["torpedo", "torpedoes"],
        ["genus", "genera"],
        ["viscus", "viscera"],
        ["stigma", "stigmata"],
        ["stoma", "stomata"],
        ["dogma", "dogmata"],
        ["lemma", "lemmata"],
        ["schema", "schemata"],
        ["anathema", "anathemata"],
        ["ox", "oxen"],
        ["axe", "axes"],
        ["die", "dice"],
        ["yes", "yeses"],
        ["foot", "feet"],
        ["eave", "eaves"],
        ["goose", "geese"],
        ["tooth", "teeth"],
        ["quiz", "quizzes"],
        ["human", "humans"],
        ["proof", "proofs"],
        ["carve", "carves"],
        ["valve", "valves"],
        ["looey", "looies"],
        ["thief", "thieves"],
        ["groove", "grooves"],
        ["pickaxe", "pickaxes"],
        ["passerby", "passersby"],
      ].forEach(function (b) {
        return y.addIrregularRule(b[0], b[1]);
      }),
      [
        [/s?$/i, "s"],
        [/[^\u0000-\u007F]$/i, "$0"],
        [/([^aeiou]ese)$/i, "$1"],
        [/(ax|test)is$/i, "$1es"],
        [/(alias|[^aou]us|t[lm]as|gas|ris)$/i, "$1es"],
        [/(e[mn]u)s?$/i, "$1s"],
        [/([^l]ias|[aeiou]las|[ejzr]as|[iu]am)$/i, "$1"],
        [
          /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
          "$1i",
        ],
        [/(alumn|alg|vertebr)(?:a|ae)$/i, "$1ae"],
        [/(seraph|cherub)(?:im)?$/i, "$1im"],
        [/(her|at|gr)o$/i, "$1oes"],
        [
          /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|automat|quor)(?:a|um)$/i,
          "$1a",
        ],
        [
          /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)(?:a|on)$/i,
          "$1a",
        ],
        [/sis$/i, "ses"],
        [/(?:(kni|wi|li)fe|(ar|l|ea|eo|oa|hoo)f)$/i, "$1$2ves"],
        [/([^aeiouy]|qu)y$/i, "$1ies"],
        [/([^ch][ieo][ln])ey$/i, "$1ies"],
        [/(x|ch|ss|sh|zz)$/i, "$1es"],
        [/(matr|cod|mur|sil|vert|ind|append)(?:ix|ex)$/i, "$1ices"],
        [/\b((?:tit)?m|l)(?:ice|ouse)$/i, "$1ice"],
        [/(pe)(?:rson|ople)$/i, "$1ople"],
        [/(child)(?:ren)?$/i, "$1ren"],
        [/eaux$/i, "$0"],
        [/m[ae]n$/i, "men"],
        ["thou", "you"],
      ].forEach(function (b) {
        return y.addPluralRule(b[0], b[1]);
      }),
      [
        [/s$/i, ""],
        [/(ss)$/i, "$1"],
        [
          /(wi|kni|(?:after|half|high|low|mid|non|night|[^\w]|^)li)ves$/i,
          "$1fe",
        ],
        [/(ar|(?:wo|[ae])l|[eo][ao])ves$/i, "$1f"],
        [/ies$/i, "y"],
        [
          /\b([pl]|zomb|(?:neck|cross)?t|coll|faer|food|gen|goon|group|lass|talk|goal|cut)ies$/i,
          "$1ie",
        ],
        [/\b(mon|smil)ies$/i, "$1ey"],
        [/\b((?:tit)?m|l)ice$/i, "$1ouse"],
        [/(seraph|cherub)im$/i, "$1"],
        [
          /(x|ch|ss|sh|zz|tto|go|cho|alias|[^aou]us|t[lm]as|gas|(?:her|at|gr)o|[aeiou]ris)(?:es)?$/i,
          "$1",
        ],
        [
          /(analy|diagno|parenthe|progno|synop|the|empha|cri|ne)(?:sis|ses)$/i,
          "$1sis",
        ],
        [/(movie|twelve|abuse|e[mn]u)s$/i, "$1"],
        [/(test)(?:is|es)$/i, "$1is"],
        [
          /(alumn|syllab|vir|radi|nucle|fung|cact|stimul|termin|bacill|foc|uter|loc|strat)(?:us|i)$/i,
          "$1us",
        ],
        [
          /(agend|addend|millenni|dat|extrem|bacteri|desiderat|strat|candelabr|errat|ov|symposi|curricul|quor)a$/i,
          "$1um",
        ],
        [
          /(apheli|hyperbat|periheli|asyndet|noumen|phenomen|criteri|organ|prolegomen|hedr|automat)a$/i,
          "$1on",
        ],
        [/(alumn|alg|vertebr)ae$/i, "$1a"],
        [/(cod|mur|sil|vert|ind)ices$/i, "$1ex"],
        [/(matr|append)ices$/i, "$1ix"],
        [/(pe)(rson|ople)$/i, "$1rson"],
        [/(child)ren$/i, "$1"],
        [/(eau)x?$/i, "$1"],
        [/men$/i, "man"],
      ].forEach(function (b) {
        return y.addSingularRule(b[0], b[1]);
      }),
      [
        "adulthood",
        "advice",
        "agenda",
        "aid",
        "aircraft",
        "alcohol",
        "ammo",
        "analytics",
        "anime",
        "athletics",
        "audio",
        "bison",
        "blood",
        "bream",
        "buffalo",
        "butter",
        "carp",
        "cash",
        "chassis",
        "chess",
        "clothing",
        "cod",
        "commerce",
        "cooperation",
        "corps",
        "debris",
        "diabetes",
        "digestion",
        "elk",
        "energy",
        "equipment",
        "excretion",
        "expertise",
        "firmware",
        "flounder",
        "fun",
        "gallows",
        "garbage",
        "graffiti",
        "hardware",
        "headquarters",
        "health",
        "herpes",
        "highjinks",
        "homework",
        "housework",
        "information",
        "jeans",
        "justice",
        "kudos",
        "labour",
        "literature",
        "machinery",
        "mackerel",
        "mail",
        "media",
        "mews",
        "moose",
        "music",
        "mud",
        "manga",
        "news",
        "only",
        "personnel",
        "pike",
        "plankton",
        "pliers",
        "police",
        "pollution",
        "premises",
        "rain",
        "research",
        "rice",
        "salmon",
        "scissors",
        "series",
        "sewage",
        "shambles",
        "shrimp",
        "software",
        "species",
        "staff",
        "swine",
        "tennis",
        "traffic",
        "transportation",
        "trout",
        "tuna",
        "wealth",
        "welfare",
        "whiting",
        "wildebeest",
        "wildlife",
        "you",
        /pok[eé]mon$/i,
        /[^aeiou]ese$/i,
        /deer$/i,
        /fish$/i,
        /measles$/i,
        /o[iu]s$/i,
        /pox$/i,
        /sheep$/i,
      ].forEach(y.addUncountableRule),
      y
    );
  });
});
var Pc = K((y_, Ac) => {
  "use strict";
  d();
  p();
  m();
  Ac.exports = (e) => Object.prototype.toString.call(e) === "[object RegExp]";
});
var Sc = K((x_, Mc) => {
  "use strict";
  d();
  p();
  m();
  Mc.exports = (e) => {
    let t = typeof e;
    return e !== null && (t === "object" || t === "function");
  };
});
var Oc = K((qi) => {
  "use strict";
  d();
  p();
  m();
  Object.defineProperty(qi, "__esModule", { value: !0 });
  qi.default = (e) =>
    Object.getOwnPropertySymbols(e).filter((t) =>
      Object.prototype.propertyIsEnumerable.call(e, t)
    );
});
var Zc = K((qR, Ag) => {
  Ag.exports = {
    name: "@prisma/client",
    version: "4.6.1",
    description:
      "Prisma Client is an auto-generated, type-safe and modern JavaScript/TypeScript ORM for Node.js that's tailored to your data. Supports MySQL, PostgreSQL, MariaDB, SQLite databases.",
    keywords: [
      "orm",
      "prisma2",
      "prisma",
      "client",
      "query",
      "database",
      "sql",
      "postgres",
      "postgresql",
      "mysql",
      "sqlite",
      "mariadb",
      "mssql",
      "typescript",
      "query-builder",
    ],
    main: "index.js",
    browser: "index-browser.js",
    types: "index.d.ts",
    license: "Apache-2.0",
    engines: { node: ">=14.17" },
    homepage: "https://www.prisma.io",
    repository: {
      type: "git",
      url: "https://github.com/prisma/prisma.git",
      directory: "packages/client",
    },
    author: "Tim Suchanek <suchanek@prisma.io>",
    bugs: "https://github.com/prisma/prisma/issues",
    scripts: {
      dev: "DEV=true node -r esbuild-register helpers/build.ts",
      build: "node -r esbuild-register helpers/build.ts",
      test: "jest --verbose",
      "test:functional":
        "node -r esbuild-register helpers/functional-test/run-tests.ts",
      "test:memory": "node -r esbuild-register helpers/memory-tests.ts",
      "test:functional:code":
        "node -r esbuild-register helpers/functional-test/run-tests.ts --no-types",
      "test:functional:types":
        "node -r esbuild-register helpers/functional-test/run-tests.ts --types-only",
      "test-notypes":
        "jest --verbose --testPathIgnorePatterns src/__tests__/types/types.test.ts",
      generate: "node scripts/postinstall.js",
      postinstall: "node scripts/postinstall.js",
      prepublishOnly: "pnpm run build",
      "new-test":
        "NODE_OPTIONS='-r ts-node/register' yo ./helpers/generator-test/index.ts",
    },
    files: [
      "README.md",
      "runtime",
      "scripts",
      "generator-build",
      "edge.js",
      "edge.d.ts",
      "index.js",
      "index.d.ts",
      "index-browser.js",
    ],
    devDependencies: {
      "@faker-js/faker": "7.6.0",
      "@fast-check/jest": "1.3.1",
      "@jest/globals": "28.1.3",
      "@jest/test-sequencer": "28.1.3",
      "@opentelemetry/api": "1.2.0",
      "@opentelemetry/context-async-hooks": "1.7.0",
      "@opentelemetry/instrumentation": "0.33.0",
      "@opentelemetry/resources": "1.7.0",
      "@opentelemetry/sdk-trace-base": "1.7.0",
      "@opentelemetry/semantic-conventions": "1.7.0",
      "@prisma/debug": "workspace:4.6.1",
      "@prisma/engine-core": "workspace:4.6.1",
      "@prisma/engines": "workspace:4.6.1",
      "@prisma/fetch-engine": "workspace:4.6.1",
      "@prisma/generator-helper": "workspace:4.6.1",
      "@prisma/get-platform": "workspace:4.6.1",
      "@prisma/instrumentation": "workspace:4.6.1",
      "@prisma/internals": "workspace:4.6.1",
      "@prisma/migrate": "workspace:4.6.1",
      "@prisma/mini-proxy": "0.3.0",
      "@swc-node/register": "1.5.4",
      "@swc/core": "1.3.14",
      "@swc/jest": "0.2.23",
      "@timsuchanek/copy": "1.4.5",
      "@types/debug": "4.1.7",
      "@types/fs-extra": "9.0.13",
      "@types/jest": "28.1.8",
      "@types/js-levenshtein": "1.1.1",
      "@types/mssql": "8.1.1",
      "@types/node": "14.18.33",
      "@types/pg": "8.6.5",
      "@types/yeoman-generator": "5.2.11",
      arg: "5.0.2",
      benchmark: "2.1.4",
      chalk: "4.1.2",
      cuid: "2.1.8",
      "decimal.js": "10.4.2",
      esbuild: "0.15.13",
      execa: "5.1.1",
      "expect-type": "0.15.0",
      "flat-map-polyfill": "0.3.8",
      "fs-extra": "10.1.0",
      "fs-monkey": "1.0.3",
      "get-own-enumerable-property-symbols": "3.0.2",
      globby: "11.1.0",
      "indent-string": "4.0.0",
      "is-obj": "2.0.0",
      "is-regexp": "2.1.0",
      jest: "28.1.3",
      "jest-junit": "14.0.1",
      "jest-snapshot": "28.1.3",
      "js-levenshtein": "1.1.6",
      klona: "2.0.5",
      "lz-string": "1.4.4",
      "make-dir": "3.1.0",
      mariadb: "3.0.2",
      memfs: "3.4.9",
      mssql: "9.0.1",
      "node-fetch": "2.6.7",
      pg: "8.8.0",
      "pkg-up": "3.1.0",
      pluralize: "8.0.0",
      "replace-string": "3.1.0",
      resolve: "1.22.1",
      rimraf: "3.0.2",
      "simple-statistics": "7.8.0",
      "sort-keys": "4.2.0",
      "source-map-support": "0.5.21",
      "sql-template-tag": "5.0.3",
      "stacktrace-parser": "0.1.10",
      "strip-ansi": "6.0.1",
      "strip-indent": "3.0.0",
      "ts-jest": "28.0.8",
      "ts-node": "10.9.1",
      "ts-pattern": "4.0.5",
      tsd: "0.21.0",
      typescript: "4.8.4",
      "yeoman-generator": "5.7.0",
      yo: "4.3.0",
    },
    peerDependencies: { prisma: "*" },
    peerDependenciesMeta: { prisma: { optional: !0 } },
    dependencies: {
      "@prisma/engines-version":
        "4.6.1-3.694eea289a8462c80264df36757e4fdc129b1b32",
    },
    sideEffects: !1,
  };
});
d();
p();
m();
var fl = ee(Is());
var Fs = {};
fs(Fs, { getExtensionContext: () => Rs });
d();
p();
m();
d();
p();
m();
function Rs(e) {
  return e;
}
u(Rs, "getExtensionContext");
var tf = {};
d();
p();
m();
d();
p();
m();
var $t = class {
  constructor(t) {
    this._engine = t;
  }
  prometheus(t) {
    return this._engine.metrics({ format: "prometheus", ...t });
  }
  json(t) {
    return this._engine.metrics({ format: "json", ...t });
  }
};
u($t, "MetricsClient");
d();
p();
m();
d();
p();
m();
function Ro(e, t) {
  var r;
  for (let n of t)
    for (let o of Object.getOwnPropertyNames(n.prototype))
      Object.defineProperty(
        e.prototype,
        o,
        (r = Object.getOwnPropertyDescriptor(n.prototype, o)) != null
          ? r
          : Object.create(null)
      );
}
u(Ro, "applyMixins");
d();
p();
m();
var ct = ee(At());
d();
p();
m();
var Vt = 9e15,
  ut = 1e9,
  qo = "0123456789abcdef",
  Cn =
    "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058",
  In =
    "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789",
  Uo = {
    precision: 20,
    rounding: 4,
    modulo: 1,
    toExpNeg: -7,
    toExpPos: 21,
    minE: -Vt,
    maxE: Vt,
    crypto: !1,
  },
  la,
  We,
  L = !0,
  Fn = "[DecimalError] ",
  at = Fn + "Invalid argument: ",
  fa = Fn + "Precision limit exceeded",
  pa = Fn + "crypto unavailable",
  ma = "[object Decimal]",
  ce = Math.floor,
  ne = Math.pow,
  Pf = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i,
  Mf = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i,
  Sf = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i,
  da = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i,
  Ne = 1e7,
  j = 7,
  Of = 9007199254740991,
  _f = Cn.length - 1,
  Vo = In.length - 1,
  C = { toStringTag: ma };
C.absoluteValue = C.abs = function () {
  var e = new this.constructor(this);
  return e.s < 0 && (e.s = 1), k(e);
};
C.ceil = function () {
  return k(new this.constructor(this), this.e + 1, 2);
};
C.clampedTo = C.clamp = function (e, t) {
  var r,
    n = this,
    o = n.constructor;
  if (((e = new o(e)), (t = new o(t)), !e.s || !t.s)) return new o(NaN);
  if (e.gt(t)) throw Error(at + t);
  return (r = n.cmp(e)), r < 0 ? e : n.cmp(t) > 0 ? t : new o(n);
};
C.comparedTo = C.cmp = function (e) {
  var t,
    r,
    n,
    o,
    i = this,
    s = i.d,
    a = (e = new i.constructor(e)).d,
    c = i.s,
    l = e.s;
  if (!s || !a)
    return !c || !l ? NaN : c !== l ? c : s === a ? 0 : !s ^ (c < 0) ? 1 : -1;
  if (!s[0] || !a[0]) return s[0] ? c : a[0] ? -l : 0;
  if (c !== l) return c;
  if (i.e !== e.e) return (i.e > e.e) ^ (c < 0) ? 1 : -1;
  for (n = s.length, o = a.length, t = 0, r = n < o ? n : o; t < r; ++t)
    if (s[t] !== a[t]) return (s[t] > a[t]) ^ (c < 0) ? 1 : -1;
  return n === o ? 0 : (n > o) ^ (c < 0) ? 1 : -1;
};
C.cosine = C.cos = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.d
    ? r.d[0]
      ? ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + Math.max(r.e, r.sd()) + j),
        (n.rounding = 1),
        (r = Cf(n, wa(n, r))),
        (n.precision = e),
        (n.rounding = t),
        k(We == 2 || We == 3 ? r.neg() : r, e, t, !0))
      : new n(1)
    : new n(NaN);
};
C.cubeRoot = C.cbrt = function () {
  var e,
    t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f = this,
    g = f.constructor;
  if (!f.isFinite() || f.isZero()) return new g(f);
  for (
    L = !1,
      i = f.s * ne(f.s * f, 1 / 3),
      !i || Math.abs(i) == 1 / 0
        ? ((r = ae(f.d)),
          (e = f.e),
          (i = (e - r.length + 1) % 3) && (r += i == 1 || i == -2 ? "0" : "00"),
          (i = ne(r, 1 / 3)),
          (e = ce((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2))),
          i == 1 / 0
            ? (r = "5e" + e)
            : ((r = i.toExponential()),
              (r = r.slice(0, r.indexOf("e") + 1) + e)),
          (n = new g(r)),
          (n.s = f.s))
        : (n = new g(i.toString())),
      s = (e = g.precision) + 3;
    ;

  )
    if (
      ((a = n),
      (c = a.times(a).times(a)),
      (l = c.plus(f)),
      (n = Y(l.plus(f).times(a), l.plus(c), s + 2, 1)),
      ae(a.d).slice(0, s) === (r = ae(n.d)).slice(0, s))
    )
      if (((r = r.slice(s - 3, s + 1)), r == "9999" || (!o && r == "4999"))) {
        if (!o && (k(a, e + 1, 0), a.times(a).times(a).eq(f))) {
          n = a;
          break;
        }
        (s += 4), (o = 1);
      } else {
        (!+r || (!+r.slice(1) && r.charAt(0) == "5")) &&
          (k(n, e + 1, 1), (t = !n.times(n).times(n).eq(f)));
        break;
      }
  return (L = !0), k(n, e, g.rounding, t);
};
C.decimalPlaces = C.dp = function () {
  var e,
    t = this.d,
    r = NaN;
  if (t) {
    if (((e = t.length - 1), (r = (e - ce(this.e / j)) * j), (e = t[e]), e))
      for (; e % 10 == 0; e /= 10) r--;
    r < 0 && (r = 0);
  }
  return r;
};
C.dividedBy = C.div = function (e) {
  return Y(this, new this.constructor(e));
};
C.dividedToIntegerBy = C.divToInt = function (e) {
  var t = this,
    r = t.constructor;
  return k(Y(t, new r(e), 0, 1, 1), r.precision, r.rounding);
};
C.equals = C.eq = function (e) {
  return this.cmp(e) === 0;
};
C.floor = function () {
  return k(new this.constructor(this), this.e + 1, 3);
};
C.greaterThan = C.gt = function (e) {
  return this.cmp(e) > 0;
};
C.greaterThanOrEqualTo = C.gte = function (e) {
  var t = this.cmp(e);
  return t == 1 || t === 0;
};
C.hyperbolicCosine = C.cosh = function () {
  var e,
    t,
    r,
    n,
    o,
    i = this,
    s = i.constructor,
    a = new s(1);
  if (!i.isFinite()) return new s(i.s ? 1 / 0 : NaN);
  if (i.isZero()) return a;
  (r = s.precision),
    (n = s.rounding),
    (s.precision = r + Math.max(i.e, i.sd()) + 4),
    (s.rounding = 1),
    (o = i.d.length),
    o < 32
      ? ((e = Math.ceil(o / 3)), (t = (1 / Nn(4, e)).toString()))
      : ((e = 16), (t = "2.3283064365386962890625e-10")),
    (i = Gt(s, 1, i.times(t), new s(1), !0));
  for (var c, l = e, f = new s(8); l--; )
    (c = i.times(i)), (i = a.minus(c.times(f.minus(c.times(f)))));
  return k(i, (s.precision = r), (s.rounding = n), !0);
};
C.hyperbolicSine = C.sinh = function () {
  var e,
    t,
    r,
    n,
    o = this,
    i = o.constructor;
  if (!o.isFinite() || o.isZero()) return new i(o);
  if (
    ((t = i.precision),
    (r = i.rounding),
    (i.precision = t + Math.max(o.e, o.sd()) + 4),
    (i.rounding = 1),
    (n = o.d.length),
    n < 3)
  )
    o = Gt(i, 2, o, o, !0);
  else {
    (e = 1.4 * Math.sqrt(n)),
      (e = e > 16 ? 16 : e | 0),
      (o = o.times(1 / Nn(5, e))),
      (o = Gt(i, 2, o, o, !0));
    for (var s, a = new i(5), c = new i(16), l = new i(20); e--; )
      (s = o.times(o)), (o = o.times(a.plus(s.times(c.times(s).plus(l)))));
  }
  return (i.precision = t), (i.rounding = r), k(o, t, r, !0);
};
C.hyperbolicTangent = C.tanh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + 7),
        (n.rounding = 1),
        Y(r.sinh(), r.cosh(), (n.precision = e), (n.rounding = t)))
    : new n(r.s);
};
C.inverseCosine = C.acos = function () {
  var e,
    t = this,
    r = t.constructor,
    n = t.abs().cmp(1),
    o = r.precision,
    i = r.rounding;
  return n !== -1
    ? n === 0
      ? t.isNeg()
        ? De(r, o, i)
        : new r(0)
      : new r(NaN)
    : t.isZero()
    ? De(r, o + 4, i).times(0.5)
    : ((r.precision = o + 6),
      (r.rounding = 1),
      (t = t.asin()),
      (e = De(r, o + 4, i).times(0.5)),
      (r.precision = o),
      (r.rounding = i),
      e.minus(t));
};
C.inverseHyperbolicCosine = C.acosh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.lte(1)
    ? new n(r.eq(1) ? 0 : NaN)
    : r.isFinite()
    ? ((e = n.precision),
      (t = n.rounding),
      (n.precision = e + Math.max(Math.abs(r.e), r.sd()) + 4),
      (n.rounding = 1),
      (L = !1),
      (r = r.times(r).minus(1).sqrt().plus(r)),
      (L = !0),
      (n.precision = e),
      (n.rounding = t),
      r.ln())
    : new n(r);
};
C.inverseHyperbolicSine = C.asinh = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return !r.isFinite() || r.isZero()
    ? new n(r)
    : ((e = n.precision),
      (t = n.rounding),
      (n.precision = e + 2 * Math.max(Math.abs(r.e), r.sd()) + 6),
      (n.rounding = 1),
      (L = !1),
      (r = r.times(r).plus(1).sqrt().plus(r)),
      (L = !0),
      (n.precision = e),
      (n.rounding = t),
      r.ln());
};
C.inverseHyperbolicTangent = C.atanh = function () {
  var e,
    t,
    r,
    n,
    o = this,
    i = o.constructor;
  return o.isFinite()
    ? o.e >= 0
      ? new i(o.abs().eq(1) ? o.s / 0 : o.isZero() ? o : NaN)
      : ((e = i.precision),
        (t = i.rounding),
        (n = o.sd()),
        Math.max(n, e) < 2 * -o.e - 1
          ? k(new i(o), e, t, !0)
          : ((i.precision = r = n - o.e),
            (o = Y(o.plus(1), new i(1).minus(o), r + e, 1)),
            (i.precision = e + 4),
            (i.rounding = 1),
            (o = o.ln()),
            (i.precision = e),
            (i.rounding = t),
            o.times(0.5)))
    : new i(NaN);
};
C.inverseSine = C.asin = function () {
  var e,
    t,
    r,
    n,
    o = this,
    i = o.constructor;
  return o.isZero()
    ? new i(o)
    : ((t = o.abs().cmp(1)),
      (r = i.precision),
      (n = i.rounding),
      t !== -1
        ? t === 0
          ? ((e = De(i, r + 4, n).times(0.5)), (e.s = o.s), e)
          : new i(NaN)
        : ((i.precision = r + 6),
          (i.rounding = 1),
          (o = o.div(new i(1).minus(o.times(o)).sqrt().plus(1)).atan()),
          (i.precision = r),
          (i.rounding = n),
          o.times(2)));
};
C.inverseTangent = C.atan = function () {
  var e,
    t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l = this,
    f = l.constructor,
    g = f.precision,
    y = f.rounding;
  if (l.isFinite()) {
    if (l.isZero()) return new f(l);
    if (l.abs().eq(1) && g + 4 <= Vo)
      return (s = De(f, g + 4, y).times(0.25)), (s.s = l.s), s;
  } else {
    if (!l.s) return new f(NaN);
    if (g + 4 <= Vo) return (s = De(f, g + 4, y).times(0.5)), (s.s = l.s), s;
  }
  for (
    f.precision = a = g + 10,
      f.rounding = 1,
      r = Math.min(28, (a / j + 2) | 0),
      e = r;
    e;
    --e
  )
    l = l.div(l.times(l).plus(1).sqrt().plus(1));
  for (
    L = !1, t = Math.ceil(a / j), n = 1, c = l.times(l), s = new f(l), o = l;
    e !== -1;

  )
    if (
      ((o = o.times(c)),
      (i = s.minus(o.div((n += 2)))),
      (o = o.times(c)),
      (s = i.plus(o.div((n += 2)))),
      s.d[t] !== void 0)
    )
      for (e = t; s.d[e] === i.d[e] && e--; );
  return (
    r && (s = s.times(2 << (r - 1))),
    (L = !0),
    k(s, (f.precision = g), (f.rounding = y), !0)
  );
};
C.isFinite = function () {
  return !!this.d;
};
C.isInteger = C.isInt = function () {
  return !!this.d && ce(this.e / j) > this.d.length - 2;
};
C.isNaN = function () {
  return !this.s;
};
C.isNegative = C.isNeg = function () {
  return this.s < 0;
};
C.isPositive = C.isPos = function () {
  return this.s > 0;
};
C.isZero = function () {
  return !!this.d && this.d[0] === 0;
};
C.lessThan = C.lt = function (e) {
  return this.cmp(e) < 0;
};
C.lessThanOrEqualTo = C.lte = function (e) {
  return this.cmp(e) < 1;
};
C.logarithm = C.log = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l = this,
    f = l.constructor,
    g = f.precision,
    y = f.rounding,
    b = 5;
  if (e == null) (e = new f(10)), (t = !0);
  else {
    if (((e = new f(e)), (r = e.d), e.s < 0 || !r || !r[0] || e.eq(1)))
      return new f(NaN);
    t = e.eq(10);
  }
  if (((r = l.d), l.s < 0 || !r || !r[0] || l.eq(1)))
    return new f(r && !r[0] ? -1 / 0 : l.s != 1 ? NaN : r ? 0 : 1 / 0);
  if (t)
    if (r.length > 1) i = !0;
    else {
      for (o = r[0]; o % 10 === 0; ) o /= 10;
      i = o !== 1;
    }
  if (
    ((L = !1),
    (a = g + b),
    (s = st(l, a)),
    (n = t ? Rn(f, a + 10) : st(e, a)),
    (c = Y(s, n, a, 1)),
    xr(c.d, (o = g), y))
  )
    do
      if (
        ((a += 10),
        (s = st(l, a)),
        (n = t ? Rn(f, a + 10) : st(e, a)),
        (c = Y(s, n, a, 1)),
        !i)
      ) {
        +ae(c.d).slice(o + 1, o + 15) + 1 == 1e14 && (c = k(c, g + 1, 0));
        break;
      }
    while (xr(c.d, (o += 10), y));
  return (L = !0), k(c, g, y);
};
C.minus = C.sub = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f,
    g,
    y,
    b = this,
    x = b.constructor;
  if (((e = new x(e)), !b.d || !e.d))
    return (
      !b.s || !e.s
        ? (e = new x(NaN))
        : b.d
        ? (e.s = -e.s)
        : (e = new x(e.d || b.s !== e.s ? b : NaN)),
      e
    );
  if (b.s != e.s) return (e.s = -e.s), b.plus(e);
  if (
    ((l = b.d), (y = e.d), (a = x.precision), (c = x.rounding), !l[0] || !y[0])
  ) {
    if (y[0]) e.s = -e.s;
    else if (l[0]) e = new x(b);
    else return new x(c === 3 ? -0 : 0);
    return L ? k(e, a, c) : e;
  }
  if (((r = ce(e.e / j)), (f = ce(b.e / j)), (l = l.slice()), (i = f - r), i)) {
    for (
      g = i < 0,
        g
          ? ((t = l), (i = -i), (s = y.length))
          : ((t = y), (r = f), (s = l.length)),
        n = Math.max(Math.ceil(a / j), s) + 2,
        i > n && ((i = n), (t.length = 1)),
        t.reverse(),
        n = i;
      n--;

    )
      t.push(0);
    t.reverse();
  } else {
    for (n = l.length, s = y.length, g = n < s, g && (s = n), n = 0; n < s; n++)
      if (l[n] != y[n]) {
        g = l[n] < y[n];
        break;
      }
    i = 0;
  }
  for (
    g && ((t = l), (l = y), (y = t), (e.s = -e.s)),
      s = l.length,
      n = y.length - s;
    n > 0;
    --n
  )
    l[s++] = 0;
  for (n = y.length; n > i; ) {
    if (l[--n] < y[n]) {
      for (o = n; o && l[--o] === 0; ) l[o] = Ne - 1;
      --l[o], (l[n] += Ne);
    }
    l[n] -= y[n];
  }
  for (; l[--s] === 0; ) l.pop();
  for (; l[0] === 0; l.shift()) --r;
  return l[0]
    ? ((e.d = l), (e.e = Dn(l, r)), L ? k(e, a, c) : e)
    : new x(c === 3 ? -0 : 0);
};
C.modulo = C.mod = function (e) {
  var t,
    r = this,
    n = r.constructor;
  return (
    (e = new n(e)),
    !r.d || !e.s || (e.d && !e.d[0])
      ? new n(NaN)
      : !e.d || (r.d && !r.d[0])
      ? k(new n(r), n.precision, n.rounding)
      : ((L = !1),
        n.modulo == 9
          ? ((t = Y(r, e.abs(), 0, 3, 1)), (t.s *= e.s))
          : (t = Y(r, e, 0, n.modulo, 1)),
        (t = t.times(e)),
        (L = !0),
        r.minus(t))
  );
};
C.naturalExponential = C.exp = function () {
  return Go(this);
};
C.naturalLogarithm = C.ln = function () {
  return st(this);
};
C.negated = C.neg = function () {
  var e = new this.constructor(this);
  return (e.s = -e.s), k(e);
};
C.plus = C.add = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f,
    g = this,
    y = g.constructor;
  if (((e = new y(e)), !g.d || !e.d))
    return (
      !g.s || !e.s
        ? (e = new y(NaN))
        : g.d || (e = new y(e.d || g.s === e.s ? g : NaN)),
      e
    );
  if (g.s != e.s) return (e.s = -e.s), g.minus(e);
  if (
    ((l = g.d), (f = e.d), (a = y.precision), (c = y.rounding), !l[0] || !f[0])
  )
    return f[0] || (e = new y(g)), L ? k(e, a, c) : e;
  if (((i = ce(g.e / j)), (n = ce(e.e / j)), (l = l.slice()), (o = i - n), o)) {
    for (
      o < 0
        ? ((r = l), (o = -o), (s = f.length))
        : ((r = f), (n = i), (s = l.length)),
        i = Math.ceil(a / j),
        s = i > s ? i + 1 : s + 1,
        o > s && ((o = s), (r.length = 1)),
        r.reverse();
      o--;

    )
      r.push(0);
    r.reverse();
  }
  for (
    s = l.length,
      o = f.length,
      s - o < 0 && ((o = s), (r = f), (f = l), (l = r)),
      t = 0;
    o;

  )
    (t = ((l[--o] = l[o] + f[o] + t) / Ne) | 0), (l[o] %= Ne);
  for (t && (l.unshift(t), ++n), s = l.length; l[--s] == 0; ) l.pop();
  return (e.d = l), (e.e = Dn(l, n)), L ? k(e, a, c) : e;
};
C.precision = C.sd = function (e) {
  var t,
    r = this;
  if (e !== void 0 && e !== !!e && e !== 1 && e !== 0) throw Error(at + e);
  return (
    r.d ? ((t = ga(r.d)), e && r.e + 1 > t && (t = r.e + 1)) : (t = NaN), t
  );
};
C.round = function () {
  var e = this,
    t = e.constructor;
  return k(new t(e), e.e + 1, t.rounding);
};
C.sine = C.sin = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + Math.max(r.e, r.sd()) + j),
        (n.rounding = 1),
        (r = Rf(n, wa(n, r))),
        (n.precision = e),
        (n.rounding = t),
        k(We > 2 ? r.neg() : r, e, t, !0))
    : new n(NaN);
};
C.squareRoot = C.sqrt = function () {
  var e,
    t,
    r,
    n,
    o,
    i,
    s = this,
    a = s.d,
    c = s.e,
    l = s.s,
    f = s.constructor;
  if (l !== 1 || !a || !a[0])
    return new f(!l || (l < 0 && (!a || a[0])) ? NaN : a ? s : 1 / 0);
  for (
    L = !1,
      l = Math.sqrt(+s),
      l == 0 || l == 1 / 0
        ? ((t = ae(a)),
          (t.length + c) % 2 == 0 && (t += "0"),
          (l = Math.sqrt(t)),
          (c = ce((c + 1) / 2) - (c < 0 || c % 2)),
          l == 1 / 0
            ? (t = "5e" + c)
            : ((t = l.toExponential()),
              (t = t.slice(0, t.indexOf("e") + 1) + c)),
          (n = new f(t)))
        : (n = new f(l.toString())),
      r = (c = f.precision) + 3;
    ;

  )
    if (
      ((i = n),
      (n = i.plus(Y(s, i, r + 2, 1)).times(0.5)),
      ae(i.d).slice(0, r) === (t = ae(n.d)).slice(0, r))
    )
      if (((t = t.slice(r - 3, r + 1)), t == "9999" || (!o && t == "4999"))) {
        if (!o && (k(i, c + 1, 0), i.times(i).eq(s))) {
          n = i;
          break;
        }
        (r += 4), (o = 1);
      } else {
        (!+t || (!+t.slice(1) && t.charAt(0) == "5")) &&
          (k(n, c + 1, 1), (e = !n.times(n).eq(s)));
        break;
      }
  return (L = !0), k(n, c, f.rounding, e);
};
C.tangent = C.tan = function () {
  var e,
    t,
    r = this,
    n = r.constructor;
  return r.isFinite()
    ? r.isZero()
      ? new n(r)
      : ((e = n.precision),
        (t = n.rounding),
        (n.precision = e + 10),
        (n.rounding = 1),
        (r = r.sin()),
        (r.s = 1),
        (r = Y(r, new n(1).minus(r.times(r)).sqrt(), e + 10, 0)),
        (n.precision = e),
        (n.rounding = t),
        k(We == 2 || We == 4 ? r.neg() : r, e, t, !0))
    : new n(NaN);
};
C.times = C.mul = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f = this,
    g = f.constructor,
    y = f.d,
    b = (e = new g(e)).d;
  if (((e.s *= f.s), !y || !y[0] || !b || !b[0]))
    return new g(
      !e.s || (y && !y[0] && !b) || (b && !b[0] && !y)
        ? NaN
        : !y || !b
        ? e.s / 0
        : e.s * 0
    );
  for (
    r = ce(f.e / j) + ce(e.e / j),
      c = y.length,
      l = b.length,
      c < l && ((i = y), (y = b), (b = i), (s = c), (c = l), (l = s)),
      i = [],
      s = c + l,
      n = s;
    n--;

  )
    i.push(0);
  for (n = l; --n >= 0; ) {
    for (t = 0, o = c + n; o > n; )
      (a = i[o] + b[n] * y[o - n - 1] + t),
        (i[o--] = a % Ne | 0),
        (t = (a / Ne) | 0);
    i[o] = (i[o] + t) % Ne | 0;
  }
  for (; !i[--s]; ) i.pop();
  return (
    t ? ++r : i.shift(),
    (e.d = i),
    (e.e = Dn(i, r)),
    L ? k(e, g.precision, g.rounding) : e
  );
};
C.toBinary = function (e, t) {
  return zo(this, 2, e, t);
};
C.toDecimalPlaces = C.toDP = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    (r = new n(r)),
    e === void 0
      ? r
      : (ve(e, 0, ut),
        t === void 0 ? (t = n.rounding) : ve(t, 0, 8),
        k(r, e + r.e + 1, t))
  );
};
C.toExponential = function (e, t) {
  var r,
    n = this,
    o = n.constructor;
  return (
    e === void 0
      ? (r = Ve(n, !0))
      : (ve(e, 0, ut),
        t === void 0 ? (t = o.rounding) : ve(t, 0, 8),
        (n = k(new o(n), e + 1, t)),
        (r = Ve(n, !0, e + 1))),
    n.isNeg() && !n.isZero() ? "-" + r : r
  );
};
C.toFixed = function (e, t) {
  var r,
    n,
    o = this,
    i = o.constructor;
  return (
    e === void 0
      ? (r = Ve(o))
      : (ve(e, 0, ut),
        t === void 0 ? (t = i.rounding) : ve(t, 0, 8),
        (n = k(new i(o), e + o.e + 1, t)),
        (r = Ve(n, !1, e + n.e + 1))),
    o.isNeg() && !o.isZero() ? "-" + r : r
  );
};
C.toFraction = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f,
    g,
    y,
    b = this,
    x = b.d,
    h = b.constructor;
  if (!x) return new h(b);
  if (
    ((l = r = new h(1)),
    (n = c = new h(0)),
    (t = new h(n)),
    (i = t.e = ga(x) - b.e - 1),
    (s = i % j),
    (t.d[0] = ne(10, s < 0 ? j + s : s)),
    e == null)
  )
    e = i > 0 ? t : l;
  else {
    if (((a = new h(e)), !a.isInt() || a.lt(l))) throw Error(at + a);
    e = a.gt(t) ? (i > 0 ? t : l) : a;
  }
  for (
    L = !1,
      a = new h(ae(x)),
      f = h.precision,
      h.precision = i = x.length * j * 2;
    (g = Y(a, t, 0, 1, 1)), (o = r.plus(g.times(n))), o.cmp(e) != 1;

  )
    (r = n),
      (n = o),
      (o = l),
      (l = c.plus(g.times(o))),
      (c = o),
      (o = t),
      (t = a.minus(g.times(o))),
      (a = o);
  return (
    (o = Y(e.minus(r), n, 0, 1, 1)),
    (c = c.plus(o.times(l))),
    (r = r.plus(o.times(n))),
    (c.s = l.s = b.s),
    (y =
      Y(l, n, i, 1).minus(b).abs().cmp(Y(c, r, i, 1).minus(b).abs()) < 1
        ? [l, n]
        : [c, r]),
    (h.precision = f),
    (L = !0),
    y
  );
};
C.toHexadecimal = C.toHex = function (e, t) {
  return zo(this, 16, e, t);
};
C.toNearest = function (e, t) {
  var r = this,
    n = r.constructor;
  if (((r = new n(r)), e == null)) {
    if (!r.d) return r;
    (e = new n(1)), (t = n.rounding);
  } else {
    if (((e = new n(e)), t === void 0 ? (t = n.rounding) : ve(t, 0, 8), !r.d))
      return e.s ? r : e;
    if (!e.d) return e.s && (e.s = r.s), e;
  }
  return (
    e.d[0]
      ? ((L = !1), (r = Y(r, e, 0, t, 1).times(e)), (L = !0), k(r))
      : ((e.s = r.s), (r = e)),
    r
  );
};
C.toNumber = function () {
  return +this;
};
C.toOctal = function (e, t) {
  return zo(this, 8, e, t);
};
C.toPower = C.pow = function (e) {
  var t,
    r,
    n,
    o,
    i,
    s,
    a = this,
    c = a.constructor,
    l = +(e = new c(e));
  if (!a.d || !e.d || !a.d[0] || !e.d[0]) return new c(ne(+a, l));
  if (((a = new c(a)), a.eq(1))) return a;
  if (((n = c.precision), (i = c.rounding), e.eq(1))) return k(a, n, i);
  if (((t = ce(e.e / j)), t >= e.d.length - 1 && (r = l < 0 ? -l : l) <= Of))
    return (o = ya(c, a, r, n)), e.s < 0 ? new c(1).div(o) : k(o, n, i);
  if (((s = a.s), s < 0)) {
    if (t < e.d.length - 1) return new c(NaN);
    if (
      ((e.d[t] & 1) == 0 && (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1)
    )
      return (a.s = s), a;
  }
  return (
    (r = ne(+a, l)),
    (t =
      r == 0 || !isFinite(r)
        ? ce(l * (Math.log("0." + ae(a.d)) / Math.LN10 + a.e + 1))
        : new c(r + "").e),
    t > c.maxE + 1 || t < c.minE - 1
      ? new c(t > 0 ? s / 0 : 0)
      : ((L = !1),
        (c.rounding = a.s = 1),
        (r = Math.min(12, (t + "").length)),
        (o = Go(e.times(st(a, n + r)), n)),
        o.d &&
          ((o = k(o, n + 5, 1)),
          xr(o.d, n, i) &&
            ((t = n + 10),
            (o = k(Go(e.times(st(a, t + r)), t), t + 5, 1)),
            +ae(o.d).slice(n + 1, n + 15) + 1 == 1e14 && (o = k(o, n + 1, 0)))),
        (o.s = s),
        (L = !0),
        (c.rounding = i),
        k(o, n, i))
  );
};
C.toPrecision = function (e, t) {
  var r,
    n = this,
    o = n.constructor;
  return (
    e === void 0
      ? (r = Ve(n, n.e <= o.toExpNeg || n.e >= o.toExpPos))
      : (ve(e, 1, ut),
        t === void 0 ? (t = o.rounding) : ve(t, 0, 8),
        (n = k(new o(n), e, t)),
        (r = Ve(n, e <= n.e || n.e <= o.toExpNeg, e))),
    n.isNeg() && !n.isZero() ? "-" + r : r
  );
};
C.toSignificantDigits = C.toSD = function (e, t) {
  var r = this,
    n = r.constructor;
  return (
    e === void 0
      ? ((e = n.precision), (t = n.rounding))
      : (ve(e, 1, ut), t === void 0 ? (t = n.rounding) : ve(t, 0, 8)),
    k(new n(r), e, t)
  );
};
C.toString = function () {
  var e = this,
    t = e.constructor,
    r = Ve(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
  return e.isNeg() && !e.isZero() ? "-" + r : r;
};
C.truncated = C.trunc = function () {
  return k(new this.constructor(this), this.e + 1, 1);
};
C.valueOf = C.toJSON = function () {
  var e = this,
    t = e.constructor,
    r = Ve(e, e.e <= t.toExpNeg || e.e >= t.toExpPos);
  return e.isNeg() ? "-" + r : r;
};
function ae(e) {
  var t,
    r,
    n,
    o = e.length - 1,
    i = "",
    s = e[0];
  if (o > 0) {
    for (i += s, t = 1; t < o; t++)
      (n = e[t] + ""), (r = j - n.length), r && (i += it(r)), (i += n);
    (s = e[t]), (n = s + ""), (r = j - n.length), r && (i += it(r));
  } else if (s === 0) return "0";
  for (; s % 10 === 0; ) s /= 10;
  return i + s;
}
u(ae, "digitsToString");
function ve(e, t, r) {
  if (e !== ~~e || e < t || e > r) throw Error(at + e);
}
u(ve, "checkInt32");
function xr(e, t, r, n) {
  var o, i, s, a;
  for (i = e[0]; i >= 10; i /= 10) --t;
  return (
    --t < 0 ? ((t += j), (o = 0)) : ((o = Math.ceil((t + 1) / j)), (t %= j)),
    (i = ne(10, j - t)),
    (a = e[o] % i | 0),
    n == null
      ? t < 3
        ? (t == 0 ? (a = (a / 100) | 0) : t == 1 && (a = (a / 10) | 0),
          (s =
            (r < 4 && a == 99999) ||
            (r > 3 && a == 49999) ||
            a == 5e4 ||
            a == 0))
        : (s =
            (((r < 4 && a + 1 == i) || (r > 3 && a + 1 == i / 2)) &&
              ((e[o + 1] / i / 100) | 0) == ne(10, t - 2) - 1) ||
            ((a == i / 2 || a == 0) && ((e[o + 1] / i / 100) | 0) == 0))
      : t < 4
      ? (t == 0
          ? (a = (a / 1e3) | 0)
          : t == 1
          ? (a = (a / 100) | 0)
          : t == 2 && (a = (a / 10) | 0),
        (s = ((n || r < 4) && a == 9999) || (!n && r > 3 && a == 4999)))
      : (s =
          (((n || r < 4) && a + 1 == i) || (!n && r > 3 && a + 1 == i / 2)) &&
          ((e[o + 1] / i / 1e3) | 0) == ne(10, t - 3) - 1),
    s
  );
}
u(xr, "checkRoundingDigits");
function _n(e, t, r) {
  for (var n, o = [0], i, s = 0, a = e.length; s < a; ) {
    for (i = o.length; i--; ) o[i] *= t;
    for (o[0] += qo.indexOf(e.charAt(s++)), n = 0; n < o.length; n++)
      o[n] > r - 1 &&
        (o[n + 1] === void 0 && (o[n + 1] = 0),
        (o[n + 1] += (o[n] / r) | 0),
        (o[n] %= r));
  }
  return o.reverse();
}
u(_n, "convertBase");
function Cf(e, t) {
  var r, n, o;
  if (t.isZero()) return t;
  (n = t.d.length),
    n < 32
      ? ((r = Math.ceil(n / 3)), (o = (1 / Nn(4, r)).toString()))
      : ((r = 16), (o = "2.3283064365386962890625e-10")),
    (e.precision += r),
    (t = Gt(e, 1, t.times(o), new e(1)));
  for (var i = r; i--; ) {
    var s = t.times(t);
    t = s.times(s).minus(s).times(8).plus(1);
  }
  return (e.precision -= r), t;
}
u(Cf, "cosine");
var Y = (function () {
  function e(n, o, i) {
    var s,
      a = 0,
      c = n.length;
    for (n = n.slice(); c--; )
      (s = n[c] * o + a), (n[c] = s % i | 0), (a = (s / i) | 0);
    return a && n.unshift(a), n;
  }
  u(e, "multiplyInteger");
  function t(n, o, i, s) {
    var a, c;
    if (i != s) c = i > s ? 1 : -1;
    else
      for (a = c = 0; a < i; a++)
        if (n[a] != o[a]) {
          c = n[a] > o[a] ? 1 : -1;
          break;
        }
    return c;
  }
  u(t, "compare");
  function r(n, o, i, s) {
    for (var a = 0; i--; )
      (n[i] -= a), (a = n[i] < o[i] ? 1 : 0), (n[i] = a * s + n[i] - o[i]);
    for (; !n[0] && n.length > 1; ) n.shift();
  }
  return (
    u(r, "subtract"),
    function (n, o, i, s, a, c) {
      var l,
        f,
        g,
        y,
        b,
        x,
        h,
        A,
        M,
        P,
        S,
        T,
        O,
        R,
        F,
        B,
        W,
        te,
        V,
        J,
        X = n.constructor,
        z = n.s == o.s ? 1 : -1,
        H = n.d,
        $ = o.d;
      if (!H || !H[0] || !$ || !$[0])
        return new X(
          !n.s || !o.s || (H ? $ && H[0] == $[0] : !$)
            ? NaN
            : (H && H[0] == 0) || !$
            ? z * 0
            : z / 0
        );
      for (
        c
          ? ((b = 1), (f = n.e - o.e))
          : ((c = Ne), (b = j), (f = ce(n.e / b) - ce(o.e / b))),
          V = $.length,
          W = H.length,
          M = new X(z),
          P = M.d = [],
          g = 0;
        $[g] == (H[g] || 0);
        g++
      );
      if (
        ($[g] > (H[g] || 0) && f--,
        i == null
          ? ((R = i = X.precision), (s = X.rounding))
          : a
          ? (R = i + (n.e - o.e) + 1)
          : (R = i),
        R < 0)
      )
        P.push(1), (x = !0);
      else {
        if (((R = (R / b + 2) | 0), (g = 0), V == 1)) {
          for (y = 0, $ = $[0], R++; (g < W || y) && R--; g++)
            (F = y * c + (H[g] || 0)), (P[g] = (F / $) | 0), (y = F % $ | 0);
          x = y || g < W;
        } else {
          for (
            y = (c / ($[0] + 1)) | 0,
              y > 1 &&
                (($ = e($, y, c)),
                (H = e(H, y, c)),
                (V = $.length),
                (W = H.length)),
              B = V,
              S = H.slice(0, V),
              T = S.length;
            T < V;

          )
            S[T++] = 0;
          (J = $.slice()), J.unshift(0), (te = $[0]), $[1] >= c / 2 && ++te;
          do
            (y = 0),
              (l = t($, S, V, T)),
              l < 0
                ? ((O = S[0]),
                  V != T && (O = O * c + (S[1] || 0)),
                  (y = (O / te) | 0),
                  y > 1
                    ? (y >= c && (y = c - 1),
                      (h = e($, y, c)),
                      (A = h.length),
                      (T = S.length),
                      (l = t(h, S, A, T)),
                      l == 1 && (y--, r(h, V < A ? J : $, A, c)))
                    : (y == 0 && (l = y = 1), (h = $.slice())),
                  (A = h.length),
                  A < T && h.unshift(0),
                  r(S, h, T, c),
                  l == -1 &&
                    ((T = S.length),
                    (l = t($, S, V, T)),
                    l < 1 && (y++, r(S, V < T ? J : $, T, c))),
                  (T = S.length))
                : l === 0 && (y++, (S = [0])),
              (P[g++] = y),
              l && S[0] ? (S[T++] = H[B] || 0) : ((S = [H[B]]), (T = 1));
          while ((B++ < W || S[0] !== void 0) && R--);
          x = S[0] !== void 0;
        }
        P[0] || P.shift();
      }
      if (b == 1) (M.e = f), (la = x);
      else {
        for (g = 1, y = P[0]; y >= 10; y /= 10) g++;
        (M.e = g + f * b - 1), k(M, a ? i + M.e + 1 : i, s, x);
      }
      return M;
    }
  );
})();
function k(e, t, r, n) {
  var o,
    i,
    s,
    a,
    c,
    l,
    f,
    g,
    y,
    b = e.constructor;
  e: if (t != null) {
    if (((g = e.d), !g)) return e;
    for (o = 1, a = g[0]; a >= 10; a /= 10) o++;
    if (((i = t - o), i < 0))
      (i += j),
        (s = t),
        (f = g[(y = 0)]),
        (c = (f / ne(10, o - s - 1)) % 10 | 0);
    else if (((y = Math.ceil((i + 1) / j)), (a = g.length), y >= a))
      if (n) {
        for (; a++ <= y; ) g.push(0);
        (f = c = 0), (o = 1), (i %= j), (s = i - j + 1);
      } else break e;
    else {
      for (f = a = g[y], o = 1; a >= 10; a /= 10) o++;
      (i %= j),
        (s = i - j + o),
        (c = s < 0 ? 0 : (f / ne(10, o - s - 1)) % 10 | 0);
    }
    if (
      ((n =
        n ||
        t < 0 ||
        g[y + 1] !== void 0 ||
        (s < 0 ? f : f % ne(10, o - s - 1))),
      (l =
        r < 4
          ? (c || n) && (r == 0 || r == (e.s < 0 ? 3 : 2))
          : c > 5 ||
            (c == 5 &&
              (r == 4 ||
                n ||
                (r == 6 &&
                  (i > 0 ? (s > 0 ? f / ne(10, o - s) : 0) : g[y - 1]) % 10 &
                    1) ||
                r == (e.s < 0 ? 8 : 7)))),
      t < 1 || !g[0])
    )
      return (
        (g.length = 0),
        l
          ? ((t -= e.e + 1),
            (g[0] = ne(10, (j - (t % j)) % j)),
            (e.e = -t || 0))
          : (g[0] = e.e = 0),
        e
      );
    if (
      (i == 0
        ? ((g.length = y), (a = 1), y--)
        : ((g.length = y + 1),
          (a = ne(10, j - i)),
          (g[y] = s > 0 ? ((f / ne(10, o - s)) % ne(10, s) | 0) * a : 0)),
      l)
    )
      for (;;)
        if (y == 0) {
          for (i = 1, s = g[0]; s >= 10; s /= 10) i++;
          for (s = g[0] += a, a = 1; s >= 10; s /= 10) a++;
          i != a && (e.e++, g[0] == Ne && (g[0] = 1));
          break;
        } else {
          if (((g[y] += a), g[y] != Ne)) break;
          (g[y--] = 0), (a = 1);
        }
    for (i = g.length; g[--i] === 0; ) g.pop();
  }
  return (
    L &&
      (e.e > b.maxE
        ? ((e.d = null), (e.e = NaN))
        : e.e < b.minE && ((e.e = 0), (e.d = [0]))),
    e
  );
}
u(k, "finalise");
function Ve(e, t, r) {
  if (!e.isFinite()) return ba(e);
  var n,
    o = e.e,
    i = ae(e.d),
    s = i.length;
  return (
    t
      ? (r && (n = r - s) > 0
          ? (i = i.charAt(0) + "." + i.slice(1) + it(n))
          : s > 1 && (i = i.charAt(0) + "." + i.slice(1)),
        (i = i + (e.e < 0 ? "e" : "e+") + e.e))
      : o < 0
      ? ((i = "0." + it(-o - 1) + i), r && (n = r - s) > 0 && (i += it(n)))
      : o >= s
      ? ((i += it(o + 1 - s)),
        r && (n = r - o - 1) > 0 && (i = i + "." + it(n)))
      : ((n = o + 1) < s && (i = i.slice(0, n) + "." + i.slice(n)),
        r && (n = r - s) > 0 && (o + 1 === s && (i += "."), (i += it(n)))),
    i
  );
}
u(Ve, "finiteToString");
function Dn(e, t) {
  var r = e[0];
  for (t *= j; r >= 10; r /= 10) t++;
  return t;
}
u(Dn, "getBase10Exponent");
function Rn(e, t, r) {
  if (t > _f) throw ((L = !0), r && (e.precision = r), Error(fa));
  return k(new e(Cn), t, 1, !0);
}
u(Rn, "getLn10");
function De(e, t, r) {
  if (t > Vo) throw Error(fa);
  return k(new e(In), t, r, !0);
}
u(De, "getPi");
function ga(e) {
  var t = e.length - 1,
    r = t * j + 1;
  if (((t = e[t]), t)) {
    for (; t % 10 == 0; t /= 10) r--;
    for (t = e[0]; t >= 10; t /= 10) r++;
  }
  return r;
}
u(ga, "getPrecision");
function it(e) {
  for (var t = ""; e--; ) t += "0";
  return t;
}
u(it, "getZeroString");
function ya(e, t, r, n) {
  var o,
    i = new e(1),
    s = Math.ceil(n / j + 4);
  for (L = !1; ; ) {
    if (
      (r % 2 && ((i = i.times(t)), ua(i.d, s) && (o = !0)),
      (r = ce(r / 2)),
      r === 0)
    ) {
      (r = i.d.length - 1), o && i.d[r] === 0 && ++i.d[r];
      break;
    }
    (t = t.times(t)), ua(t.d, s);
  }
  return (L = !0), i;
}
u(ya, "intPow");
function aa(e) {
  return e.d[e.d.length - 1] & 1;
}
u(aa, "isOdd");
function ha(e, t, r) {
  for (var n, o = new e(t[0]), i = 0; ++i < t.length; )
    if (((n = new e(t[i])), n.s)) o[r](n) && (o = n);
    else {
      o = n;
      break;
    }
  return o;
}
u(ha, "maxOrMin");
function Go(e, t) {
  var r,
    n,
    o,
    i,
    s,
    a,
    c,
    l = 0,
    f = 0,
    g = 0,
    y = e.constructor,
    b = y.rounding,
    x = y.precision;
  if (!e.d || !e.d[0] || e.e > 17)
    return new y(
      e.d
        ? e.d[0]
          ? e.s < 0
            ? 0
            : 1 / 0
          : 1
        : e.s
        ? e.s < 0
          ? 0
          : e
        : 0 / 0
    );
  for (
    t == null ? ((L = !1), (c = x)) : (c = t), a = new y(0.03125);
    e.e > -2;

  )
    (e = e.times(a)), (g += 5);
  for (
    n = ((Math.log(ne(2, g)) / Math.LN10) * 2 + 5) | 0,
      c += n,
      r = i = s = new y(1),
      y.precision = c;
    ;

  ) {
    if (
      ((i = k(i.times(e), c, 1)),
      (r = r.times(++f)),
      (a = s.plus(Y(i, r, c, 1))),
      ae(a.d).slice(0, c) === ae(s.d).slice(0, c))
    ) {
      for (o = g; o--; ) s = k(s.times(s), c, 1);
      if (t == null)
        if (l < 3 && xr(s.d, c - n, b, l))
          (y.precision = c += 10), (r = i = a = new y(1)), (f = 0), l++;
        else return k(s, (y.precision = x), b, (L = !0));
      else return (y.precision = x), s;
    }
    s = a;
  }
}
u(Go, "naturalExponential");
function st(e, t) {
  var r,
    n,
    o,
    i,
    s,
    a,
    c,
    l,
    f,
    g,
    y,
    b = 1,
    x = 10,
    h = e,
    A = h.d,
    M = h.constructor,
    P = M.rounding,
    S = M.precision;
  if (h.s < 0 || !A || !A[0] || (!h.e && A[0] == 1 && A.length == 1))
    return new M(A && !A[0] ? -1 / 0 : h.s != 1 ? NaN : A ? 0 : h);
  if (
    (t == null ? ((L = !1), (f = S)) : (f = t),
    (M.precision = f += x),
    (r = ae(A)),
    (n = r.charAt(0)),
    Math.abs((i = h.e)) < 15e14)
  ) {
    for (; (n < 7 && n != 1) || (n == 1 && r.charAt(1) > 3); )
      (h = h.times(e)), (r = ae(h.d)), (n = r.charAt(0)), b++;
    (i = h.e),
      n > 1 ? ((h = new M("0." + r)), i++) : (h = new M(n + "." + r.slice(1)));
  } else
    return (
      (l = Rn(M, f + 2, S).times(i + "")),
      (h = st(new M(n + "." + r.slice(1)), f - x).plus(l)),
      (M.precision = S),
      t == null ? k(h, S, P, (L = !0)) : h
    );
  for (
    g = h,
      c = s = h = Y(h.minus(1), h.plus(1), f, 1),
      y = k(h.times(h), f, 1),
      o = 3;
    ;

  ) {
    if (
      ((s = k(s.times(y), f, 1)),
      (l = c.plus(Y(s, new M(o), f, 1))),
      ae(l.d).slice(0, f) === ae(c.d).slice(0, f))
    )
      if (
        ((c = c.times(2)),
        i !== 0 && (c = c.plus(Rn(M, f + 2, S).times(i + ""))),
        (c = Y(c, new M(b), f, 1)),
        t == null)
      )
        if (xr(c.d, f - x, P, a))
          (M.precision = f += x),
            (l = s = h = Y(g.minus(1), g.plus(1), f, 1)),
            (y = k(h.times(h), f, 1)),
            (o = a = 1);
        else return k(c, (M.precision = S), P, (L = !0));
      else return (M.precision = S), c;
    (c = l), (o += 2);
  }
}
u(st, "naturalLogarithm");
function ba(e) {
  return String((e.s * e.s) / 0);
}
u(ba, "nonFiniteToString");
function Jo(e, t) {
  var r, n, o;
  for (
    (r = t.indexOf(".")) > -1 && (t = t.replace(".", "")),
      (n = t.search(/e/i)) > 0
        ? (r < 0 && (r = n), (r += +t.slice(n + 1)), (t = t.substring(0, n)))
        : r < 0 && (r = t.length),
      n = 0;
    t.charCodeAt(n) === 48;
    n++
  );
  for (o = t.length; t.charCodeAt(o - 1) === 48; --o);
  if (((t = t.slice(n, o)), t)) {
    if (
      ((o -= n),
      (e.e = r = r - n - 1),
      (e.d = []),
      (n = (r + 1) % j),
      r < 0 && (n += j),
      n < o)
    ) {
      for (n && e.d.push(+t.slice(0, n)), o -= j; n < o; )
        e.d.push(+t.slice(n, (n += j)));
      (t = t.slice(n)), (n = j - t.length);
    } else n -= o;
    for (; n--; ) t += "0";
    e.d.push(+t),
      L &&
        (e.e > e.constructor.maxE
          ? ((e.d = null), (e.e = NaN))
          : e.e < e.constructor.minE && ((e.e = 0), (e.d = [0])));
  } else (e.e = 0), (e.d = [0]);
  return e;
}
u(Jo, "parseDecimal");
function If(e, t) {
  var r, n, o, i, s, a, c, l, f;
  if (t.indexOf("_") > -1) {
    if (((t = t.replace(/(\d)_(?=\d)/g, "$1")), da.test(t))) return Jo(e, t);
  } else if (t === "Infinity" || t === "NaN")
    return +t || (e.s = NaN), (e.e = NaN), (e.d = null), e;
  if (Mf.test(t)) (r = 16), (t = t.toLowerCase());
  else if (Pf.test(t)) r = 2;
  else if (Sf.test(t)) r = 8;
  else throw Error(at + t);
  for (
    i = t.search(/p/i),
      i > 0
        ? ((c = +t.slice(i + 1)), (t = t.substring(2, i)))
        : (t = t.slice(2)),
      i = t.indexOf("."),
      s = i >= 0,
      n = e.constructor,
      s &&
        ((t = t.replace(".", "")),
        (a = t.length),
        (i = a - i),
        (o = ya(n, new n(r), i, i * 2))),
      l = _n(t, r, Ne),
      f = l.length - 1,
      i = f;
    l[i] === 0;
    --i
  )
    l.pop();
  return i < 0
    ? new n(e.s * 0)
    : ((e.e = Dn(l, f)),
      (e.d = l),
      (L = !1),
      s && (e = Y(e, o, a * 4)),
      c && (e = e.times(Math.abs(c) < 54 ? ne(2, c) : Ke.pow(2, c))),
      (L = !0),
      e);
}
u(If, "parseOther");
function Rf(e, t) {
  var r,
    n = t.d.length;
  if (n < 3) return t.isZero() ? t : Gt(e, 2, t, t);
  (r = 1.4 * Math.sqrt(n)),
    (r = r > 16 ? 16 : r | 0),
    (t = t.times(1 / Nn(5, r))),
    (t = Gt(e, 2, t, t));
  for (var o, i = new e(5), s = new e(16), a = new e(20); r--; )
    (o = t.times(t)), (t = t.times(i.plus(o.times(s.times(o).minus(a)))));
  return t;
}
u(Rf, "sine");
function Gt(e, t, r, n, o) {
  var i,
    s,
    a,
    c,
    l = 1,
    f = e.precision,
    g = Math.ceil(f / j);
  for (L = !1, c = r.times(r), a = new e(n); ; ) {
    if (
      ((s = Y(a.times(c), new e(t++ * t++), f, 1)),
      (a = o ? n.plus(s) : n.minus(s)),
      (n = Y(s.times(c), new e(t++ * t++), f, 1)),
      (s = a.plus(n)),
      s.d[g] !== void 0)
    ) {
      for (i = g; s.d[i] === a.d[i] && i--; );
      if (i == -1) break;
    }
    (i = a), (a = n), (n = s), (s = i), l++;
  }
  return (L = !0), (s.d.length = g + 1), s;
}
u(Gt, "taylorSeries");
function Nn(e, t) {
  for (var r = e; --t; ) r *= e;
  return r;
}
u(Nn, "tinyPow");
function wa(e, t) {
  var r,
    n = t.s < 0,
    o = De(e, e.precision, 1),
    i = o.times(0.5);
  if (((t = t.abs()), t.lte(i))) return (We = n ? 4 : 1), t;
  if (((r = t.divToInt(o)), r.isZero())) We = n ? 3 : 2;
  else {
    if (((t = t.minus(r.times(o))), t.lte(i)))
      return (We = aa(r) ? (n ? 2 : 3) : n ? 4 : 1), t;
    We = aa(r) ? (n ? 1 : 4) : n ? 3 : 2;
  }
  return t.minus(o).abs();
}
u(wa, "toLessThanHalfPi");
function zo(e, t, r, n) {
  var o,
    i,
    s,
    a,
    c,
    l,
    f,
    g,
    y,
    b = e.constructor,
    x = r !== void 0;
  if (
    (x
      ? (ve(r, 1, ut), n === void 0 ? (n = b.rounding) : ve(n, 0, 8))
      : ((r = b.precision), (n = b.rounding)),
    !e.isFinite())
  )
    f = ba(e);
  else {
    for (
      f = Ve(e),
        s = f.indexOf("."),
        x
          ? ((o = 2), t == 16 ? (r = r * 4 - 3) : t == 8 && (r = r * 3 - 2))
          : (o = t),
        s >= 0 &&
          ((f = f.replace(".", "")),
          (y = new b(1)),
          (y.e = f.length - s),
          (y.d = _n(Ve(y), 10, o)),
          (y.e = y.d.length)),
        g = _n(f, 10, o),
        i = c = g.length;
      g[--c] == 0;

    )
      g.pop();
    if (!g[0]) f = x ? "0p+0" : "0";
    else {
      if (
        (s < 0
          ? i--
          : ((e = new b(e)),
            (e.d = g),
            (e.e = i),
            (e = Y(e, y, r, n, 0, o)),
            (g = e.d),
            (i = e.e),
            (l = la)),
        (s = g[r]),
        (a = o / 2),
        (l = l || g[r + 1] !== void 0),
        (l =
          n < 4
            ? (s !== void 0 || l) && (n === 0 || n === (e.s < 0 ? 3 : 2))
            : s > a ||
              (s === a &&
                (n === 4 ||
                  l ||
                  (n === 6 && g[r - 1] & 1) ||
                  n === (e.s < 0 ? 8 : 7)))),
        (g.length = r),
        l)
      )
        for (; ++g[--r] > o - 1; ) (g[r] = 0), r || (++i, g.unshift(1));
      for (c = g.length; !g[c - 1]; --c);
      for (s = 0, f = ""; s < c; s++) f += qo.charAt(g[s]);
      if (x) {
        if (c > 1)
          if (t == 16 || t == 8) {
            for (s = t == 16 ? 4 : 3, --c; c % s; c++) f += "0";
            for (g = _n(f, o, t), c = g.length; !g[c - 1]; --c);
            for (s = 1, f = "1."; s < c; s++) f += qo.charAt(g[s]);
          } else f = f.charAt(0) + "." + f.slice(1);
        f = f + (i < 0 ? "p" : "p+") + i;
      } else if (i < 0) {
        for (; ++i; ) f = "0" + f;
        f = "0." + f;
      } else if (++i > c) for (i -= c; i--; ) f += "0";
      else i < c && (f = f.slice(0, i) + "." + f.slice(i));
    }
    f = (t == 16 ? "0x" : t == 2 ? "0b" : t == 8 ? "0o" : "") + f;
  }
  return e.s < 0 ? "-" + f : f;
}
u(zo, "toStringBinary");
function ua(e, t) {
  if (e.length > t) return (e.length = t), !0;
}
u(ua, "truncate");
function Ff(e) {
  return new this(e).abs();
}
u(Ff, "abs");
function Df(e) {
  return new this(e).acos();
}
u(Df, "acos");
function Nf(e) {
  return new this(e).acosh();
}
u(Nf, "acosh");
function kf(e, t) {
  return new this(e).plus(t);
}
u(kf, "add");
function jf(e) {
  return new this(e).asin();
}
u(jf, "asin");
function $f(e) {
  return new this(e).asinh();
}
u($f, "asinh");
function Lf(e) {
  return new this(e).atan();
}
u(Lf, "atan");
function Bf(e) {
  return new this(e).atanh();
}
u(Bf, "atanh");
function qf(e, t) {
  (e = new this(e)), (t = new this(t));
  var r,
    n = this.precision,
    o = this.rounding,
    i = n + 4;
  return (
    !e.s || !t.s
      ? (r = new this(NaN))
      : !e.d && !t.d
      ? ((r = De(this, i, 1).times(t.s > 0 ? 0.25 : 0.75)), (r.s = e.s))
      : !t.d || e.isZero()
      ? ((r = t.s < 0 ? De(this, n, o) : new this(0)), (r.s = e.s))
      : !e.d || t.isZero()
      ? ((r = De(this, i, 1).times(0.5)), (r.s = e.s))
      : t.s < 0
      ? ((this.precision = i),
        (this.rounding = 1),
        (r = this.atan(Y(e, t, i, 1))),
        (t = De(this, i, 1)),
        (this.precision = n),
        (this.rounding = o),
        (r = e.s < 0 ? r.minus(t) : r.plus(t)))
      : (r = this.atan(Y(e, t, i, 1))),
    r
  );
}
u(qf, "atan2");
function Uf(e) {
  return new this(e).cbrt();
}
u(Uf, "cbrt");
function Vf(e) {
  return k((e = new this(e)), e.e + 1, 2);
}
u(Vf, "ceil");
function Gf(e, t, r) {
  return new this(e).clamp(t, r);
}
u(Gf, "clamp");
function Jf(e) {
  if (!e || typeof e != "object") throw Error(Fn + "Object expected");
  var t,
    r,
    n,
    o = e.defaults === !0,
    i = [
      "precision",
      1,
      ut,
      "rounding",
      0,
      8,
      "toExpNeg",
      -Vt,
      0,
      "toExpPos",
      0,
      Vt,
      "maxE",
      0,
      Vt,
      "minE",
      -Vt,
      0,
      "modulo",
      0,
      9,
    ];
  for (t = 0; t < i.length; t += 3)
    if (((r = i[t]), o && (this[r] = Uo[r]), (n = e[r]) !== void 0))
      if (ce(n) === n && n >= i[t + 1] && n <= i[t + 2]) this[r] = n;
      else throw Error(at + r + ": " + n);
  if (((r = "crypto"), o && (this[r] = Uo[r]), (n = e[r]) !== void 0))
    if (n === !0 || n === !1 || n === 0 || n === 1)
      if (n)
        if (
          typeof crypto != "undefined" &&
          crypto &&
          (crypto.getRandomValues || crypto.randomBytes)
        )
          this[r] = !0;
        else throw Error(pa);
      else this[r] = !1;
    else throw Error(at + r + ": " + n);
  return this;
}
u(Jf, "config");
function zf(e) {
  return new this(e).cos();
}
u(zf, "cos");
function Hf(e) {
  return new this(e).cosh();
}
u(Hf, "cosh");
function xa(e) {
  var t, r, n;
  function o(i) {
    var s,
      a,
      c,
      l = this;
    if (!(l instanceof o)) return new o(i);
    if (((l.constructor = o), ca(i))) {
      (l.s = i.s),
        L
          ? !i.d || i.e > o.maxE
            ? ((l.e = NaN), (l.d = null))
            : i.e < o.minE
            ? ((l.e = 0), (l.d = [0]))
            : ((l.e = i.e), (l.d = i.d.slice()))
          : ((l.e = i.e), (l.d = i.d ? i.d.slice() : i.d));
      return;
    }
    if (((c = typeof i), c === "number")) {
      if (i === 0) {
        (l.s = 1 / i < 0 ? -1 : 1), (l.e = 0), (l.d = [0]);
        return;
      }
      if ((i < 0 ? ((i = -i), (l.s = -1)) : (l.s = 1), i === ~~i && i < 1e7)) {
        for (s = 0, a = i; a >= 10; a /= 10) s++;
        L
          ? s > o.maxE
            ? ((l.e = NaN), (l.d = null))
            : s < o.minE
            ? ((l.e = 0), (l.d = [0]))
            : ((l.e = s), (l.d = [i]))
          : ((l.e = s), (l.d = [i]));
        return;
      } else if (i * 0 !== 0) {
        i || (l.s = NaN), (l.e = NaN), (l.d = null);
        return;
      }
      return Jo(l, i.toString());
    } else if (c !== "string") throw Error(at + i);
    return (
      (a = i.charCodeAt(0)) === 45
        ? ((i = i.slice(1)), (l.s = -1))
        : (a === 43 && (i = i.slice(1)), (l.s = 1)),
      da.test(i) ? Jo(l, i) : If(l, i)
    );
  }
  if (
    (u(o, "Decimal"),
    (o.prototype = C),
    (o.ROUND_UP = 0),
    (o.ROUND_DOWN = 1),
    (o.ROUND_CEIL = 2),
    (o.ROUND_FLOOR = 3),
    (o.ROUND_HALF_UP = 4),
    (o.ROUND_HALF_DOWN = 5),
    (o.ROUND_HALF_EVEN = 6),
    (o.ROUND_HALF_CEIL = 7),
    (o.ROUND_HALF_FLOOR = 8),
    (o.EUCLID = 9),
    (o.config = o.set = Jf),
    (o.clone = xa),
    (o.isDecimal = ca),
    (o.abs = Ff),
    (o.acos = Df),
    (o.acosh = Nf),
    (o.add = kf),
    (o.asin = jf),
    (o.asinh = $f),
    (o.atan = Lf),
    (o.atanh = Bf),
    (o.atan2 = qf),
    (o.cbrt = Uf),
    (o.ceil = Vf),
    (o.clamp = Gf),
    (o.cos = zf),
    (o.cosh = Hf),
    (o.div = Wf),
    (o.exp = Kf),
    (o.floor = Qf),
    (o.hypot = Yf),
    (o.ln = Zf),
    (o.log = Xf),
    (o.log10 = tp),
    (o.log2 = ep),
    (o.max = rp),
    (o.min = np),
    (o.mod = op),
    (o.mul = ip),
    (o.pow = sp),
    (o.random = ap),
    (o.round = up),
    (o.sign = cp),
    (o.sin = lp),
    (o.sinh = fp),
    (o.sqrt = pp),
    (o.sub = mp),
    (o.sum = dp),
    (o.tan = gp),
    (o.tanh = yp),
    (o.trunc = hp),
    e === void 0 && (e = {}),
    e && e.defaults !== !0)
  )
    for (
      n = [
        "precision",
        "rounding",
        "toExpNeg",
        "toExpPos",
        "maxE",
        "minE",
        "modulo",
        "crypto",
      ],
        t = 0;
      t < n.length;

    )
      e.hasOwnProperty((r = n[t++])) || (e[r] = this[r]);
  return o.config(e), o;
}
u(xa, "clone");
function Wf(e, t) {
  return new this(e).div(t);
}
u(Wf, "div");
function Kf(e) {
  return new this(e).exp();
}
u(Kf, "exp");
function Qf(e) {
  return k((e = new this(e)), e.e + 1, 3);
}
u(Qf, "floor");
function Yf() {
  var e,
    t,
    r = new this(0);
  for (L = !1, e = 0; e < arguments.length; )
    if (((t = new this(arguments[e++])), t.d)) r.d && (r = r.plus(t.times(t)));
    else {
      if (t.s) return (L = !0), new this(1 / 0);
      r = t;
    }
  return (L = !0), r.sqrt();
}
u(Yf, "hypot");
function ca(e) {
  return e instanceof Ke || (e && e.toStringTag === ma) || !1;
}
u(ca, "isDecimalInstance");
function Zf(e) {
  return new this(e).ln();
}
u(Zf, "ln");
function Xf(e, t) {
  return new this(e).log(t);
}
u(Xf, "log");
function ep(e) {
  return new this(e).log(2);
}
u(ep, "log2");
function tp(e) {
  return new this(e).log(10);
}
u(tp, "log10");
function rp() {
  return ha(this, arguments, "lt");
}
u(rp, "max");
function np() {
  return ha(this, arguments, "gt");
}
u(np, "min");
function op(e, t) {
  return new this(e).mod(t);
}
u(op, "mod");
function ip(e, t) {
  return new this(e).mul(t);
}
u(ip, "mul");
function sp(e, t) {
  return new this(e).pow(t);
}
u(sp, "pow");
function ap(e) {
  var t,
    r,
    n,
    o,
    i = 0,
    s = new this(1),
    a = [];
  if (
    (e === void 0 ? (e = this.precision) : ve(e, 1, ut),
    (n = Math.ceil(e / j)),
    this.crypto)
  )
    if (crypto.getRandomValues)
      for (t = crypto.getRandomValues(new Uint32Array(n)); i < n; )
        (o = t[i]),
          o >= 429e7
            ? (t[i] = crypto.getRandomValues(new Uint32Array(1))[0])
            : (a[i++] = o % 1e7);
    else if (crypto.randomBytes) {
      for (t = crypto.randomBytes((n *= 4)); i < n; )
        (o =
          t[i] + (t[i + 1] << 8) + (t[i + 2] << 16) + ((t[i + 3] & 127) << 24)),
          o >= 214e7
            ? crypto.randomBytes(4).copy(t, i)
            : (a.push(o % 1e7), (i += 4));
      i = n / 4;
    } else throw Error(pa);
  else for (; i < n; ) a[i++] = (Math.random() * 1e7) | 0;
  for (
    n = a[--i],
      e %= j,
      n && e && ((o = ne(10, j - e)), (a[i] = ((n / o) | 0) * o));
    a[i] === 0;
    i--
  )
    a.pop();
  if (i < 0) (r = 0), (a = [0]);
  else {
    for (r = -1; a[0] === 0; r -= j) a.shift();
    for (n = 1, o = a[0]; o >= 10; o /= 10) n++;
    n < j && (r -= j - n);
  }
  return (s.e = r), (s.d = a), s;
}
u(ap, "random");
function up(e) {
  return k((e = new this(e)), e.e + 1, this.rounding);
}
u(up, "round");
function cp(e) {
  return (e = new this(e)), e.d ? (e.d[0] ? e.s : 0 * e.s) : e.s || NaN;
}
u(cp, "sign");
function lp(e) {
  return new this(e).sin();
}
u(lp, "sin");
function fp(e) {
  return new this(e).sinh();
}
u(fp, "sinh");
function pp(e) {
  return new this(e).sqrt();
}
u(pp, "sqrt");
function mp(e, t) {
  return new this(e).sub(t);
}
u(mp, "sub");
function dp() {
  var e = 0,
    t = arguments,
    r = new this(t[e]);
  for (L = !1; r.s && ++e < t.length; ) r = r.plus(t[e]);
  return (L = !0), k(r, this.precision, this.rounding);
}
u(dp, "sum");
function gp(e) {
  return new this(e).tan();
}
u(gp, "tan");
function yp(e) {
  return new this(e).tanh();
}
u(yp, "tanh");
function hp(e) {
  return k((e = new this(e)), e.e + 1, 1);
}
u(hp, "trunc");
C[Symbol.for("nodejs.util.inspect.custom")] = C.toString;
C[Symbol.toStringTag] = "Decimal";
var Ke = (C.constructor = xa(Uo));
Cn = new Ke(Cn);
In = new Ke(In);
var Ge = Ke;
var Qo = ee(kn()),
  Pa = ee(Ho());
d();
p();
m();
var Oe = class {
  constructor(t, r, n, o) {
    (this.modelName = t),
      (this.name = r),
      (this.typeName = n),
      (this.isList = o);
  }
  _toGraphQLInputType() {
    return `${
      this.isList ? `List${this.typeName}` : this.typeName
    }FieldRefInput<${this.modelName}>`;
  }
};
u(Oe, "FieldRefImpl");
d();
p();
m();
var Ta = [
    "JsonNullValueInput",
    "NullableJsonNullValueInput",
    "JsonNullValueFilter",
  ],
  jn = Symbol(),
  Wo = new WeakMap(),
  Te = class {
    constructor(t) {
      t === jn
        ? Wo.set(this, `Prisma.${this._getName()}`)
        : Wo.set(
            this,
            `new Prisma.${this._getNamespace()}.${this._getName()}()`
          );
    }
    _getName() {
      return this.constructor.name;
    }
    toString() {
      return Wo.get(this);
    }
  };
u(Te, "ObjectEnumValue");
var Jt = class extends Te {
  _getNamespace() {
    return "NullTypes";
  }
};
u(Jt, "NullTypesEnumValue");
var vr = class extends Jt {};
u(vr, "DbNull");
var Er = class extends Jt {};
u(Er, "JsonNull");
var Tr = class extends Jt {};
u(Tr, "AnyNull");
var Ko = {
  classes: { DbNull: vr, JsonNull: Er, AnyNull: Tr },
  instances: { DbNull: new vr(jn), JsonNull: new Er(jn), AnyNull: new Tr(jn) },
};
d();
p();
m();
function $n(e) {
  return Ke.isDecimal(e)
    ? !0
    : e !== null &&
        typeof e == "object" &&
        typeof e.s == "number" &&
        typeof e.e == "number" &&
        Array.isArray(e.d);
}
u($n, "isDecimalJsLike");
function Aa(e) {
  if (Ke.isDecimal(e)) return JSON.stringify(String(e));
  let t = new Ke(0);
  return (t.d = e.d), (t.e = e.e), (t.s = e.s), JSON.stringify(String(t));
}
u(Aa, "stringifyDecimalJsLike");
var le = u((e, t) => {
    let r = {};
    for (let n of e) {
      let o = n[t];
      r[o] = n;
    }
    return r;
  }, "keyBy"),
  zt = {
    String: !0,
    Int: !0,
    Float: !0,
    Boolean: !0,
    Long: !0,
    DateTime: !0,
    ID: !0,
    UUID: !0,
    Json: !0,
    Bytes: !0,
    Decimal: !0,
    BigInt: !0,
  };
var bp = {
  string: "String",
  boolean: "Boolean",
  object: "Json",
  symbol: "Symbol",
};
function Ht(e) {
  return typeof e == "string" ? e : e.name;
}
u(Ht, "stringifyGraphQLType");
function Pr(e, t) {
  return t ? `List<${e}>` : e;
}
u(Pr, "wrapWithList");
var wp =
    /^(\d{4}-(0[1-9]|1[012])-(0[1-9]|[12][0-9]|3[01])T([01][0-9]|2[0-3]):([0-5][0-9]):([0-5][0-9]|60))(\.\d{1,})?(([Z])|([+|-]([01][0-9]|2[0-3]):[0-5][0-9]))$/,
  xp =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
function Wt(e, t) {
  let r = t == null ? void 0 : t.type;
  if (e === null) return "null";
  if (Object.prototype.toString.call(e) === "[object BigInt]") return "BigInt";
  if (Ge.isDecimal(e) || (r === "Decimal" && $n(e))) return "Decimal";
  if (v.Buffer.isBuffer(e)) return "Bytes";
  if (vp(e, t)) return r.name;
  if (e instanceof Te) return e._getName();
  if (e instanceof Oe) return e._toGraphQLInputType();
  if (Array.isArray(e)) {
    let o = e.reduce((i, s) => {
      let a = Wt(s, t);
      return i.includes(a) || i.push(a), i;
    }, []);
    return (
      o.includes("Float") && o.includes("Int") && (o = ["Float"]),
      `List<${o.join(" | ")}>`
    );
  }
  let n = typeof e;
  if (n === "number") return Math.trunc(e) === e ? "Int" : "Float";
  if (Object.prototype.toString.call(e) === "[object Date]") return "DateTime";
  if (n === "string") {
    if (xp.test(e)) return "UUID";
    if (new Date(e).toString() === "Invalid Date") return "String";
    if (wp.test(e)) return "DateTime";
  }
  return bp[n];
}
u(Wt, "getGraphQLType");
function vp(e, t) {
  var n;
  let r = t == null ? void 0 : t.type;
  if (!Tp(r)) return !1;
  if ((t == null ? void 0 : t.namespace) === "prisma" && Ta.includes(r.name)) {
    let o = (n = e == null ? void 0 : e.constructor) == null ? void 0 : n.name;
    return (
      typeof o == "string" && Ko.instances[o] === e && r.values.includes(o)
    );
  }
  return typeof e == "string" && r.values.includes(e);
}
u(vp, "isValidEnumValue");
function Ln(e, t) {
  return t.reduce(
    (n, o) => {
      let i = (0, Pa.default)(e, o);
      return i < n.distance ? { distance: i, str: o } : n;
    },
    {
      distance: Math.min(
        Math.floor(e.length) * 1.1,
        ...t.map((n) => n.length * 3)
      ),
      str: null,
    }
  ).str;
}
u(Ln, "getSuggestion");
function Kt(e, t = !1) {
  if (typeof e == "string") return e;
  if (e.values)
    return `enum ${e.name} {
${(0, Qo.default)(e.values.join(", "), 2)}
}`;
  {
    let r = (0, Qo.default)(
      e.fields.map((n) => {
        let o = `${n.name}`,
          i = `${t ? ct.default.green(o) : o}${
            n.isRequired ? "" : "?"
          }: ${ct.default.white(
            n.inputTypes
              .map((s) => Pr(Ep(s.type) ? s.type.name : Ht(s.type), s.isList))
              .join(" | ")
          )}`;
        return n.isRequired ? i : ct.default.dim(i);
      }).join(`
`),
      2
    );
    return `${ct.default.dim("type")} ${ct.default.bold.dim(
      e.name
    )} ${ct.default.dim("{")}
${r}
${ct.default.dim("}")}`;
  }
}
u(Kt, "stringifyInputType");
function Ep(e) {
  return typeof e != "string";
}
u(Ep, "argIsInputType");
function Ar(e) {
  return typeof e == "string" ? (e === "Null" ? "null" : e) : e.name;
}
u(Ar, "getInputTypeName");
function Pt(e) {
  return typeof e == "string" ? e : e.name;
}
u(Pt, "getOutputTypeName");
function Yo(e, t, r = !1) {
  if (typeof e == "string") return e === "Null" ? "null" : e;
  if (e.values) return e.values.join(" | ");
  let n = e,
    o =
      t &&
      n.fields.every((i) => {
        var s;
        return (
          i.inputTypes[0].location === "inputObjectTypes" ||
          ((s = i.inputTypes[1]) == null ? void 0 : s.location) ===
            "inputObjectTypes"
        );
      });
  return r
    ? Ar(e)
    : n.fields.reduce((i, s) => {
        let a = "";
        return (
          !o && !s.isRequired
            ? (a = s.inputTypes.map((c) => Ar(c.type)).join(" | "))
            : (a = s.inputTypes
                .map((c) => Yo(c.type, s.isRequired, !0))
                .join(" | ")),
          (i[s.name + (s.isRequired ? "" : "?")] = a),
          i
        );
      }, {});
}
u(Yo, "inputTypeToJson");
function Ma(e, t, r) {
  let n = {};
  for (let o of e) n[r(o)] = o;
  for (let o of t) {
    let i = r(o);
    n[i] || (n[i] = o);
  }
  return Object.values(n);
}
u(Ma, "unionBy");
function Bn(e) {
  return e.substring(0, 1).toLowerCase() + e.substring(1);
}
u(Bn, "lowerCase");
function Sa(e) {
  return e.endsWith("GroupByOutputType");
}
u(Sa, "isGroupByOutputName");
function Tp(e) {
  return (
    typeof e == "object" &&
    e !== null &&
    typeof e.name == "string" &&
    Array.isArray(e.values)
  );
}
u(Tp, "isSchemaEnum");
var Mr = class {
  constructor({ datamodel: t }) {
    (this.datamodel = t),
      (this.datamodelEnumMap = this.getDatamodelEnumMap()),
      (this.modelMap = this.getModelMap()),
      (this.typeMap = this.getTypeMap()),
      (this.typeAndModelMap = this.getTypeModelMap());
  }
  getDatamodelEnumMap() {
    return le(this.datamodel.enums, "name");
  }
  getModelMap() {
    return { ...le(this.datamodel.models, "name") };
  }
  getTypeMap() {
    return { ...le(this.datamodel.types, "name") };
  }
  getTypeModelMap() {
    return { ...this.getTypeMap(), ...this.getModelMap() };
  }
};
u(Mr, "DMMFDatamodelHelper");
var Sr = class {
  constructor({ mappings: t }) {
    (this.mappings = t), (this.mappingsMap = this.getMappingsMap());
  }
  getMappingsMap() {
    return le(this.mappings.modelOperations, "model");
  }
};
u(Sr, "DMMFMappingsHelper");
var Or = class {
  constructor({ schema: t }) {
    this.outputTypeToMergedOutputType = u(
      (t) => ({ ...t, fields: t.fields }),
      "outputTypeToMergedOutputType"
    );
    (this.schema = t),
      (this.enumMap = this.getEnumMap()),
      (this.queryType = this.getQueryType()),
      (this.mutationType = this.getMutationType()),
      (this.outputTypes = this.getOutputTypes()),
      (this.outputTypeMap = this.getMergedOutputTypeMap()),
      this.resolveOutputTypes(),
      (this.inputObjectTypes = this.schema.inputObjectTypes),
      (this.inputTypeMap = this.getInputTypeMap()),
      this.resolveInputTypes(),
      this.resolveFieldArgumentTypes(),
      (this.queryType = this.outputTypeMap.Query),
      (this.mutationType = this.outputTypeMap.Mutation),
      (this.rootFieldMap = this.getRootFieldMap());
  }
  get [Symbol.toStringTag]() {
    return "DMMFClass";
  }
  resolveOutputTypes() {
    for (let t of this.outputTypes.model) {
      for (let r of t.fields)
        typeof r.outputType.type == "string" &&
          !zt[r.outputType.type] &&
          (r.outputType.type =
            this.outputTypeMap[r.outputType.type] ||
            this.outputTypeMap[r.outputType.type] ||
            this.enumMap[r.outputType.type] ||
            r.outputType.type);
      t.fieldMap = le(t.fields, "name");
    }
    for (let t of this.outputTypes.prisma) {
      for (let r of t.fields)
        typeof r.outputType.type == "string" &&
          !zt[r.outputType.type] &&
          (r.outputType.type =
            this.outputTypeMap[r.outputType.type] ||
            this.outputTypeMap[r.outputType.type] ||
            this.enumMap[r.outputType.type] ||
            r.outputType.type);
      t.fieldMap = le(t.fields, "name");
    }
  }
  resolveInputTypes() {
    let t = this.inputObjectTypes.prisma;
    this.inputObjectTypes.model && t.push(...this.inputObjectTypes.model);
    for (let r of t) {
      for (let n of r.fields)
        for (let o of n.inputTypes) {
          let i = o.type;
          typeof i == "string" &&
            !zt[i] &&
            (this.inputTypeMap[i] || this.enumMap[i]) &&
            (o.type = this.inputTypeMap[i] || this.enumMap[i] || i);
        }
      r.fieldMap = le(r.fields, "name");
    }
  }
  resolveFieldArgumentTypes() {
    for (let t of this.outputTypes.prisma)
      for (let r of t.fields)
        for (let n of r.args)
          for (let o of n.inputTypes) {
            let i = o.type;
            typeof i == "string" &&
              !zt[i] &&
              (o.type = this.inputTypeMap[i] || this.enumMap[i] || i);
          }
    for (let t of this.outputTypes.model)
      for (let r of t.fields)
        for (let n of r.args)
          for (let o of n.inputTypes) {
            let i = o.type;
            typeof i == "string" &&
              !zt[i] &&
              (o.type = this.inputTypeMap[i] || this.enumMap[i] || o.type);
          }
  }
  getQueryType() {
    return this.schema.outputObjectTypes.prisma.find((t) => t.name === "Query");
  }
  getMutationType() {
    return this.schema.outputObjectTypes.prisma.find(
      (t) => t.name === "Mutation"
    );
  }
  getOutputTypes() {
    return {
      model: this.schema.outputObjectTypes.model.map(
        this.outputTypeToMergedOutputType
      ),
      prisma: this.schema.outputObjectTypes.prisma.map(
        this.outputTypeToMergedOutputType
      ),
    };
  }
  getEnumMap() {
    return {
      ...le(this.schema.enumTypes.prisma, "name"),
      ...(this.schema.enumTypes.model
        ? le(this.schema.enumTypes.model, "name")
        : void 0),
    };
  }
  hasEnumInNamespace(t, r) {
    var n;
    return (
      ((n = this.schema.enumTypes[r]) == null
        ? void 0
        : n.find((o) => o.name === t)) !== void 0
    );
  }
  getMergedOutputTypeMap() {
    return {
      ...le(this.outputTypes.model, "name"),
      ...le(this.outputTypes.prisma, "name"),
    };
  }
  getInputTypeMap() {
    return {
      ...(this.schema.inputObjectTypes.model
        ? le(this.schema.inputObjectTypes.model, "name")
        : void 0),
      ...le(this.schema.inputObjectTypes.prisma, "name"),
    };
  }
  getRootFieldMap() {
    return {
      ...le(this.queryType.fields, "name"),
      ...le(this.mutationType.fields, "name"),
    };
  }
};
u(Or, "DMMFSchemaHelper");
var lt = class {
  constructor(t) {
    return Object.assign(this, new Mr(t), new Sr(t));
  }
};
u(lt, "BaseDMMFHelper");
Ro(lt, [Mr, Sr]);
var ft = class {
  constructor(t) {
    return Object.assign(this, new lt(t), new Or(t));
  }
};
u(ft, "DMMFHelper");
Ro(ft, [lt, Or]);
d();
p();
m();
d();
p();
m();
var pt;
((t) => {
  let e;
  ((M) => (
    (M.findUnique = "findUnique"),
    (M.findFirst = "findFirst"),
    (M.findMany = "findMany"),
    (M.create = "create"),
    (M.createMany = "createMany"),
    (M.update = "update"),
    (M.updateMany = "updateMany"),
    (M.upsert = "upsert"),
    (M.delete = "delete"),
    (M.deleteMany = "deleteMany"),
    (M.groupBy = "groupBy"),
    (M.count = "count"),
    (M.aggregate = "aggregate"),
    (M.findRaw = "findRaw"),
    (M.aggregateRaw = "aggregateRaw")
  ))((e = t.ModelAction || (t.ModelAction = {})));
})(pt || (pt = {}));
d();
p();
m();
var eo = ee(za());
var hm = 100,
  ui = [],
  Ha,
  Wa;
typeof w != "undefined" &&
  typeof ((Ha = w.stderr) == null ? void 0 : Ha.write) != "function" &&
  (eo.default.log = (Wa = console.debug) != null ? Wa : console.log);
function bm(e) {
  let t = (0, eo.default)(e),
    r = Object.assign(
      (...n) => (
        (t.log = r.log),
        n.length !== 0 && ui.push([e, ...n]),
        ui.length > hm && ui.shift(),
        t("", ...n)
      ),
      t
    );
  return r;
}
u(bm, "debugCall");
var Ka = Object.assign(bm, eo.default);
var Je = Ka;
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var Qa = typeof globalThis == "object" ? globalThis : global;
d();
p();
m();
var dt = "1.2.0";
d();
p();
m();
var Ya = /^(\d+)\.(\d+)\.(\d+)(-(.+))?$/;
function wm(e) {
  var t = new Set([e]),
    r = new Set(),
    n = e.match(Ya);
  if (!n)
    return function () {
      return !1;
    };
  var o = { major: +n[1], minor: +n[2], patch: +n[3], prerelease: n[4] };
  if (o.prerelease != null)
    return u(function (c) {
      return c === e;
    }, "isExactmatch");
  function i(a) {
    return r.add(a), !1;
  }
  u(i, "_reject");
  function s(a) {
    return t.add(a), !0;
  }
  return (
    u(s, "_accept"),
    u(function (c) {
      if (t.has(c)) return !0;
      if (r.has(c)) return !1;
      var l = c.match(Ya);
      if (!l) return i(c);
      var f = { major: +l[1], minor: +l[2], patch: +l[3], prerelease: l[4] };
      return f.prerelease != null || o.major !== f.major
        ? i(c)
        : o.major === 0
        ? o.minor === f.minor && o.patch <= f.patch
          ? s(c)
          : i(c)
        : o.minor <= f.minor
        ? s(c)
        : i(c);
    }, "isCompatible")
  );
}
u(wm, "_makeCompatibilityCheck");
var Za = wm(dt);
var xm = dt.split(".")[0],
  Ir = Symbol.for("opentelemetry.js.api." + xm),
  Rr = Qa;
function gt(e, t, r, n) {
  var o;
  n === void 0 && (n = !1);
  var i = (Rr[Ir] =
    (o = Rr[Ir]) !== null && o !== void 0 ? o : { version: dt });
  if (!n && i[e]) {
    var s = new Error(
      "@opentelemetry/api: Attempted duplicate registration of API: " + e
    );
    return r.error(s.stack || s.message), !1;
  }
  if (i.version !== dt) {
    var s = new Error(
      "@opentelemetry/api: All API registration versions must match"
    );
    return r.error(s.stack || s.message), !1;
  }
  return (
    (i[e] = t),
    r.debug(
      "@opentelemetry/api: Registered a global for " + e + " v" + dt + "."
    ),
    !0
  );
}
u(gt, "registerGlobal");
function ke(e) {
  var t,
    r,
    n = (t = Rr[Ir]) === null || t === void 0 ? void 0 : t.version;
  if (!(!n || !Za(n)))
    return (r = Rr[Ir]) === null || r === void 0 ? void 0 : r[e];
}
u(ke, "getGlobal");
function yt(e, t) {
  t.debug(
    "@opentelemetry/api: Unregistering a global for " + e + " v" + dt + "."
  );
  var r = Rr[Ir];
  r && delete r[e];
}
u(yt, "unregisterGlobal");
var Xa = (function () {
  function e(t) {
    this._namespace = t.namespace || "DiagComponentLogger";
  }
  return (
    u(e, "DiagComponentLogger"),
    (e.prototype.debug = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return Fr("debug", this._namespace, t);
    }),
    (e.prototype.error = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return Fr("error", this._namespace, t);
    }),
    (e.prototype.info = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return Fr("info", this._namespace, t);
    }),
    (e.prototype.warn = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return Fr("warn", this._namespace, t);
    }),
    (e.prototype.verbose = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      return Fr("verbose", this._namespace, t);
    }),
    e
  );
})();
function Fr(e, t, r) {
  var n = ke("diag");
  if (!!n) return r.unshift(t), n[e].apply(n, r);
}
u(Fr, "logProxy");
d();
p();
m();
d();
p();
m();
var Ee;
(function (e) {
  (e[(e.NONE = 0)] = "NONE"),
    (e[(e.ERROR = 30)] = "ERROR"),
    (e[(e.WARN = 50)] = "WARN"),
    (e[(e.INFO = 60)] = "INFO"),
    (e[(e.DEBUG = 70)] = "DEBUG"),
    (e[(e.VERBOSE = 80)] = "VERBOSE"),
    (e[(e.ALL = 9999)] = "ALL");
})(Ee || (Ee = {}));
function eu(e, t) {
  e < Ee.NONE ? (e = Ee.NONE) : e > Ee.ALL && (e = Ee.ALL), (t = t || {});
  function r(n, o) {
    var i = t[n];
    return typeof i == "function" && e >= o ? i.bind(t) : function () {};
  }
  return (
    u(r, "_filterFunc"),
    {
      error: r("error", Ee.ERROR),
      warn: r("warn", Ee.WARN),
      info: r("info", Ee.INFO),
      debug: r("debug", Ee.DEBUG),
      verbose: r("verbose", Ee.VERBOSE),
    }
  );
}
u(eu, "createLogLevelDiagLogger");
var vm = "diag",
  Pe = (function () {
    function e() {
      function t(n) {
        return function () {
          for (var o = [], i = 0; i < arguments.length; i++)
            o[i] = arguments[i];
          var s = ke("diag");
          if (!!s) return s[n].apply(s, o);
        };
      }
      u(t, "_logProxy");
      var r = this;
      (r.setLogger = function (n, o) {
        var i, s;
        if ((o === void 0 && (o = Ee.INFO), n === r)) {
          var a = new Error(
            "Cannot use diag as the logger for itself. Please use a DiagLogger implementation like ConsoleDiagLogger or a custom implementation"
          );
          return (
            r.error((i = a.stack) !== null && i !== void 0 ? i : a.message), !1
          );
        }
        var c = ke("diag"),
          l = eu(o, n);
        if (c) {
          var f =
            (s = new Error().stack) !== null && s !== void 0
              ? s
              : "<failed to generate stacktrace>";
          c.warn("Current logger will be overwritten from " + f),
            l.warn(
              "Current logger will overwrite one already registered from " + f
            );
        }
        return gt("diag", l, r, !0);
      }),
        (r.disable = function () {
          yt(vm, r);
        }),
        (r.createComponentLogger = function (n) {
          return new Xa(n);
        }),
        (r.verbose = t("verbose")),
        (r.debug = t("debug")),
        (r.info = t("info")),
        (r.warn = t("warn")),
        (r.error = t("error"));
    }
    return (
      u(e, "DiagAPI"),
      (e.instance = function () {
        return this._instance || (this._instance = new e()), this._instance;
      }),
      e
    );
  })();
d();
p();
m();
var tu = (function () {
  function e(t) {
    this._entries = t ? new Map(t) : new Map();
  }
  return (
    u(e, "BaggageImpl"),
    (e.prototype.getEntry = function (t) {
      var r = this._entries.get(t);
      if (!!r) return Object.assign({}, r);
    }),
    (e.prototype.getAllEntries = function () {
      return Array.from(this._entries.entries()).map(function (t) {
        var r = t[0],
          n = t[1];
        return [r, n];
      });
    }),
    (e.prototype.setEntry = function (t, r) {
      var n = new e(this._entries);
      return n._entries.set(t, r), n;
    }),
    (e.prototype.removeEntry = function (t) {
      var r = new e(this._entries);
      return r._entries.delete(t), r;
    }),
    (e.prototype.removeEntries = function () {
      for (var t = [], r = 0; r < arguments.length; r++) t[r] = arguments[r];
      for (var n = new e(this._entries), o = 0, i = t; o < i.length; o++) {
        var s = i[o];
        n._entries.delete(s);
      }
      return n;
    }),
    (e.prototype.clear = function () {
      return new e();
    }),
    e
  );
})();
d();
p();
m();
var Em = Symbol("BaggageEntryMetadata");
var wb = Pe.instance();
function ru(e) {
  return e === void 0 && (e = {}), new tu(new Map(Object.entries(e)));
}
u(ru, "createBaggage");
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var ci = [
    { n: "error", c: "error" },
    { n: "warn", c: "warn" },
    { n: "info", c: "info" },
    { n: "debug", c: "debug" },
    { n: "verbose", c: "trace" },
  ],
  Db = (function () {
    function e() {
      function t(n) {
        return function () {
          for (var o = [], i = 0; i < arguments.length; i++)
            o[i] = arguments[i];
          if (console) {
            var s = console[n];
            if (
              (typeof s != "function" && (s = console.log),
              typeof s == "function")
            )
              return s.apply(console, o);
          }
        };
      }
      u(t, "_consoleFunc");
      for (var r = 0; r < ci.length; r++) this[ci[r].n] = t(ci[r].c);
    }
    return u(e, "DiagConsoleLogger"), e;
  })();
d();
p();
m();
var nu = {
    get: function (e, t) {
      if (e != null) return e[t];
    },
    keys: function (e) {
      return e == null ? [] : Object.keys(e);
    },
  },
  ou = {
    set: function (e, t, r) {
      e != null && (e[t] = r);
    },
  };
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
function to(e) {
  return Symbol.for(e);
}
u(to, "createContextKey");
var Tm = (function () {
    function e(t) {
      var r = this;
      (r._currentContext = t ? new Map(t) : new Map()),
        (r.getValue = function (n) {
          return r._currentContext.get(n);
        }),
        (r.setValue = function (n, o) {
          var i = new e(r._currentContext);
          return i._currentContext.set(n, o), i;
        }),
        (r.deleteValue = function (n) {
          var o = new e(r._currentContext);
          return o._currentContext.delete(n), o;
        });
    }
    return u(e, "BaseContext"), e;
  })(),
  iu = new Tm();
var Am = function (e, t) {
    for (var r = 0, n = t.length, o = e.length; r < n; r++, o++) e[o] = t[r];
    return e;
  },
  su = (function () {
    function e() {}
    return (
      u(e, "NoopContextManager"),
      (e.prototype.active = function () {
        return iu;
      }),
      (e.prototype.with = function (t, r, n) {
        for (var o = [], i = 3; i < arguments.length; i++)
          o[i - 3] = arguments[i];
        return r.call.apply(r, Am([n], o));
      }),
      (e.prototype.bind = function (t, r) {
        return r;
      }),
      (e.prototype.enable = function () {
        return this;
      }),
      (e.prototype.disable = function () {
        return this;
      }),
      e
    );
  })();
var Pm = function (e, t) {
    for (var r = 0, n = t.length, o = e.length; r < n; r++, o++) e[o] = t[r];
    return e;
  },
  li = "context",
  Mm = new su(),
  er = (function () {
    function e() {}
    return (
      u(e, "ContextAPI"),
      (e.getInstance = function () {
        return this._instance || (this._instance = new e()), this._instance;
      }),
      (e.prototype.setGlobalContextManager = function (t) {
        return gt(li, t, Pe.instance());
      }),
      (e.prototype.active = function () {
        return this._getContextManager().active();
      }),
      (e.prototype.with = function (t, r, n) {
        for (var o, i = [], s = 3; s < arguments.length; s++)
          i[s - 3] = arguments[s];
        return (o = this._getContextManager()).with.apply(o, Pm([t, r, n], i));
      }),
      (e.prototype.bind = function (t, r) {
        return this._getContextManager().bind(t, r);
      }),
      (e.prototype._getContextManager = function () {
        return ke(li) || Mm;
      }),
      (e.prototype.disable = function () {
        this._getContextManager().disable(), yt(li, Pe.instance());
      }),
      e
    );
  })();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var ro;
(function (e) {
  (e[(e.NONE = 0)] = "NONE"), (e[(e.SAMPLED = 1)] = "SAMPLED");
})(ro || (ro = {}));
var no = "0000000000000000",
  oo = "00000000000000000000000000000000",
  fi = { traceId: oo, spanId: no, traceFlags: ro.NONE };
var ht = (function () {
  function e(t) {
    t === void 0 && (t = fi), (this._spanContext = t);
  }
  return (
    u(e, "NonRecordingSpan"),
    (e.prototype.spanContext = function () {
      return this._spanContext;
    }),
    (e.prototype.setAttribute = function (t, r) {
      return this;
    }),
    (e.prototype.setAttributes = function (t) {
      return this;
    }),
    (e.prototype.addEvent = function (t, r) {
      return this;
    }),
    (e.prototype.setStatus = function (t) {
      return this;
    }),
    (e.prototype.updateName = function (t) {
      return this;
    }),
    (e.prototype.end = function (t) {}),
    (e.prototype.isRecording = function () {
      return !1;
    }),
    (e.prototype.recordException = function (t, r) {}),
    e
  );
})();
var pi = to("OpenTelemetry Context Key SPAN");
function io(e) {
  return e.getValue(pi) || void 0;
}
u(io, "getSpan");
function au() {
  return io(er.getInstance().active());
}
u(au, "getActiveSpan");
function Dr(e, t) {
  return e.setValue(pi, t);
}
u(Dr, "setSpan");
function uu(e) {
  return e.deleteValue(pi);
}
u(uu, "deleteSpan");
function cu(e, t) {
  return Dr(e, new ht(t));
}
u(cu, "setSpanContext");
function so(e) {
  var t;
  return (t = io(e)) === null || t === void 0 ? void 0 : t.spanContext();
}
u(so, "getSpanContext");
d();
p();
m();
var Sm = /^([0-9a-f]{32})$/i,
  Om = /^[0-9a-f]{16}$/i;
function lu(e) {
  return Sm.test(e) && e !== oo;
}
u(lu, "isValidTraceId");
function fu(e) {
  return Om.test(e) && e !== no;
}
u(fu, "isValidSpanId");
function Nr(e) {
  return lu(e.traceId) && fu(e.spanId);
}
u(Nr, "isSpanContextValid");
function pu(e) {
  return new ht(e);
}
u(pu, "wrapSpanContext");
var mu = er.getInstance(),
  ao = (function () {
    function e() {}
    return (
      u(e, "NoopTracer"),
      (e.prototype.startSpan = function (t, r, n) {
        var o = Boolean(r == null ? void 0 : r.root);
        if (o) return new ht();
        var i = n && so(n);
        return _m(i) && Nr(i) ? new ht(i) : new ht();
      }),
      (e.prototype.startActiveSpan = function (t, r, n, o) {
        var i, s, a;
        if (!(arguments.length < 2)) {
          arguments.length === 2
            ? (a = r)
            : arguments.length === 3
            ? ((i = r), (a = n))
            : ((i = r), (s = n), (a = o));
          var c = s != null ? s : mu.active(),
            l = this.startSpan(t, i, c),
            f = Dr(c, l);
          return mu.with(f, a, void 0, l);
        }
      }),
      e
    );
  })();
function _m(e) {
  return (
    typeof e == "object" &&
    typeof e.spanId == "string" &&
    typeof e.traceId == "string" &&
    typeof e.traceFlags == "number"
  );
}
u(_m, "isSpanContext");
var Cm = new ao(),
  du = (function () {
    function e(t, r, n, o) {
      (this._provider = t),
        (this.name = r),
        (this.version = n),
        (this.options = o);
    }
    return (
      u(e, "ProxyTracer"),
      (e.prototype.startSpan = function (t, r, n) {
        return this._getTracer().startSpan(t, r, n);
      }),
      (e.prototype.startActiveSpan = function (t, r, n, o) {
        var i = this._getTracer();
        return Reflect.apply(i.startActiveSpan, i, arguments);
      }),
      (e.prototype._getTracer = function () {
        if (this._delegate) return this._delegate;
        var t = this._provider.getDelegateTracer(
          this.name,
          this.version,
          this.options
        );
        return t ? ((this._delegate = t), this._delegate) : Cm;
      }),
      e
    );
  })();
d();
p();
m();
d();
p();
m();
var gu = (function () {
  function e() {}
  return (
    u(e, "NoopTracerProvider"),
    (e.prototype.getTracer = function (t, r, n) {
      return new ao();
    }),
    e
  );
})();
var Im = new gu(),
  mi = (function () {
    function e() {}
    return (
      u(e, "ProxyTracerProvider"),
      (e.prototype.getTracer = function (t, r, n) {
        var o;
        return (o = this.getDelegateTracer(t, r, n)) !== null && o !== void 0
          ? o
          : new du(this, t, r, n);
      }),
      (e.prototype.getDelegate = function () {
        var t;
        return (t = this._delegate) !== null && t !== void 0 ? t : Im;
      }),
      (e.prototype.setDelegate = function (t) {
        this._delegate = t;
      }),
      (e.prototype.getDelegateTracer = function (t, r, n) {
        var o;
        return (o = this._delegate) === null || o === void 0
          ? void 0
          : o.getTracer(t, r, n);
      }),
      e
    );
  })();
d();
p();
m();
d();
p();
m();
var yu;
(function (e) {
  (e[(e.NOT_RECORD = 0)] = "NOT_RECORD"),
    (e[(e.RECORD = 1)] = "RECORD"),
    (e[(e.RECORD_AND_SAMPLED = 2)] = "RECORD_AND_SAMPLED");
})(yu || (yu = {}));
d();
p();
m();
d();
p();
m();
var hu;
(function (e) {
  (e[(e.INTERNAL = 0)] = "INTERNAL"),
    (e[(e.SERVER = 1)] = "SERVER"),
    (e[(e.CLIENT = 2)] = "CLIENT"),
    (e[(e.PRODUCER = 3)] = "PRODUCER"),
    (e[(e.CONSUMER = 4)] = "CONSUMER");
})(hu || (hu = {}));
d();
p();
m();
d();
p();
m();
d();
p();
m();
var bu;
(function (e) {
  (e[(e.UNSET = 0)] = "UNSET"),
    (e[(e.OK = 1)] = "OK"),
    (e[(e.ERROR = 2)] = "ERROR");
})(bu || (bu = {}));
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var di = "[_0-9a-z-*/]",
  Rm = "[a-z]" + di + "{0,255}",
  Fm = "[a-z0-9]" + di + "{0,240}@[a-z]" + di + "{0,13}",
  Dm = new RegExp("^(?:" + Rm + "|" + Fm + ")$"),
  Nm = /^[ -~]{0,255}[!-~]$/,
  km = /,|=/;
function wu(e) {
  return Dm.test(e);
}
u(wu, "validateKey");
function xu(e) {
  return Nm.test(e) && !km.test(e);
}
u(xu, "validateValue");
var vu = 32,
  jm = 512,
  Eu = ",",
  Tu = "=",
  $m = (function () {
    function e(t) {
      (this._internalState = new Map()), t && this._parse(t);
    }
    return (
      u(e, "TraceStateImpl"),
      (e.prototype.set = function (t, r) {
        var n = this._clone();
        return (
          n._internalState.has(t) && n._internalState.delete(t),
          n._internalState.set(t, r),
          n
        );
      }),
      (e.prototype.unset = function (t) {
        var r = this._clone();
        return r._internalState.delete(t), r;
      }),
      (e.prototype.get = function (t) {
        return this._internalState.get(t);
      }),
      (e.prototype.serialize = function () {
        var t = this;
        return this._keys()
          .reduce(function (r, n) {
            return r.push(n + Tu + t.get(n)), r;
          }, [])
          .join(Eu);
      }),
      (e.prototype._parse = function (t) {
        t.length > jm ||
          ((this._internalState = t
            .split(Eu)
            .reverse()
            .reduce(function (r, n) {
              var o = n.trim(),
                i = o.indexOf(Tu);
              if (i !== -1) {
                var s = o.slice(0, i),
                  a = o.slice(i + 1, n.length);
                wu(s) && xu(a) && r.set(s, a);
              }
              return r;
            }, new Map())),
          this._internalState.size > vu &&
            (this._internalState = new Map(
              Array.from(this._internalState.entries()).reverse().slice(0, vu)
            )));
      }),
      (e.prototype._keys = function () {
        return Array.from(this._internalState.keys()).reverse();
      }),
      (e.prototype._clone = function () {
        var t = new e();
        return (t._internalState = new Map(this._internalState)), t;
      }),
      e
    );
  })();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var gi = "trace",
  Au = (function () {
    function e() {
      (this._proxyTracerProvider = new mi()),
        (this.wrapSpanContext = pu),
        (this.isSpanContextValid = Nr),
        (this.deleteSpan = uu),
        (this.getSpan = io),
        (this.getActiveSpan = au),
        (this.getSpanContext = so),
        (this.setSpan = Dr),
        (this.setSpanContext = cu);
    }
    return (
      u(e, "TraceAPI"),
      (e.getInstance = function () {
        return this._instance || (this._instance = new e()), this._instance;
      }),
      (e.prototype.setGlobalTracerProvider = function (t) {
        var r = gt(gi, this._proxyTracerProvider, Pe.instance());
        return r && this._proxyTracerProvider.setDelegate(t), r;
      }),
      (e.prototype.getTracerProvider = function () {
        return ke(gi) || this._proxyTracerProvider;
      }),
      (e.prototype.getTracer = function (t, r) {
        return this.getTracerProvider().getTracer(t, r);
      }),
      (e.prototype.disable = function () {
        yt(gi, Pe.instance()), (this._proxyTracerProvider = new mi());
      }),
      e
    );
  })();
d();
p();
m();
d();
p();
m();
var Pu = (function () {
  function e() {}
  return (
    u(e, "NoopTextMapPropagator"),
    (e.prototype.inject = function (t, r) {}),
    (e.prototype.extract = function (t, r) {
      return t;
    }),
    (e.prototype.fields = function () {
      return [];
    }),
    e
  );
})();
d();
p();
m();
var yi = to("OpenTelemetry Baggage Key");
function Mu(e) {
  return e.getValue(yi) || void 0;
}
u(Mu, "getBaggage");
function Su(e, t) {
  return e.setValue(yi, t);
}
u(Su, "setBaggage");
function Ou(e) {
  return e.deleteValue(yi);
}
u(Ou, "deleteBaggage");
var hi = "propagation",
  Lm = new Pu(),
  _u = (function () {
    function e() {
      (this.createBaggage = ru),
        (this.getBaggage = Mu),
        (this.setBaggage = Su),
        (this.deleteBaggage = Ou);
    }
    return (
      u(e, "PropagationAPI"),
      (e.getInstance = function () {
        return this._instance || (this._instance = new e()), this._instance;
      }),
      (e.prototype.setGlobalPropagator = function (t) {
        return gt(hi, t, Pe.instance());
      }),
      (e.prototype.inject = function (t, r, n) {
        return (
          n === void 0 && (n = ou), this._getGlobalPropagator().inject(t, r, n)
        );
      }),
      (e.prototype.extract = function (t, r, n) {
        return (
          n === void 0 && (n = nu), this._getGlobalPropagator().extract(t, r, n)
        );
      }),
      (e.prototype.fields = function () {
        return this._getGlobalPropagator().fields();
      }),
      (e.prototype.disable = function () {
        yt(hi, Pe.instance());
      }),
      (e.prototype._getGlobalPropagator = function () {
        return ke(hi) || Lm;
      }),
      e
    );
  })();
var bt = er.getInstance(),
  uo = Au.getInstance(),
  l2 = _u.getInstance(),
  p2 = Pe.instance();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var _t = class {};
u(_t, "Engine");
d();
p();
m();
var _e = class extends Error {
  constructor(r, n, o) {
    super(r);
    (this.clientVersion = n), (this.errorCode = o), Error.captureStackTrace(_e);
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientInitializationError";
  }
};
u(_e, "PrismaClientInitializationError");
d();
p();
m();
var je = class extends Error {
  constructor(r, n, o, i) {
    super(r);
    (this.code = n), (this.clientVersion = o), (this.meta = i);
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientKnownRequestError";
  }
};
u(je, "PrismaClientKnownRequestError");
d();
p();
m();
var Qe = class extends Error {
  constructor(r, n) {
    super(r);
    this.clientVersion = n;
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientRustPanicError";
  }
};
u(Qe, "PrismaClientRustPanicError");
d();
p();
m();
var Ce = class extends Error {
  constructor(r, n) {
    super(r);
    this.clientVersion = n;
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientUnknownRequestError";
  }
};
u(Ce, "PrismaClientUnknownRequestError");
d();
p();
m();
function $u(e, t) {
  return e.user_facing_error.error_code
    ? new je(
        e.user_facing_error.message,
        e.user_facing_error.error_code,
        t,
        e.user_facing_error.meta
      )
    : new Ce(e.error, t);
}
u($u, "prismaGraphQLToJSError");
d();
p();
m();
function po(e) {
  if (e.transactionId) {
    let { transactionId: t, ...r } = e;
    return (r["X-transaction-id"] = t), r;
  }
  return e;
}
u(po, "runtimeHeadersToHttpHeaders");
d();
p();
m();
d();
p();
m();
function rr({ context: e, tracingConfig: t }) {
  let r = uo.getSpanContext(e != null ? e : bt.active());
  return (t == null ? void 0 : t.enabled) && r
    ? `00-${r.traceId}-${r.spanId}-0${r.traceFlags}`
    : "00-10-10-00";
}
u(rr, "getTraceParent");
d();
p();
m();
function xi(e) {
  let t = e.includes("tracing");
  return {
    get enabled() {
      return Boolean(globalThis.PRISMA_INSTRUMENTATION && t);
    },
    get middleware() {
      return Boolean(
        globalThis.PRISMA_INSTRUMENTATION &&
          globalThis.PRISMA_INSTRUMENTATION.middleware
      );
    },
  };
}
u(xi, "getTracingConfig");
d();
p();
m();
async function nr(e, t) {
  var o;
  if (e.enabled === !1) return t();
  let r = uo.getTracer("prisma"),
    n = (o = e.context) != null ? o : bt.active();
  if (e.active === !1) {
    let i = r.startSpan(`prisma:client:${e.name}`, e, n);
    try {
      return await t(i, n);
    } finally {
      i.end();
    }
  }
  return r.startActiveSpan(`prisma:client:${e.name}`, e, n, async (i) => {
    try {
      return await t(i, bt.active());
    } finally {
      i.end();
    }
  });
}
u(nr, "runInChildSpan");
d();
p();
m();
var Gu = ee(Du());
d();
p();
m();
d();
p();
m();
var jr = class extends Error {
  constructor(r, n) {
    super(r);
    (this.clientVersion = n.clientVersion), (this.cause = n.cause);
  }
  get [Symbol.toStringTag]() {
    return this.name;
  }
};
u(jr, "PrismaClientError");
var he = class extends jr {
  constructor(r, n) {
    var o;
    super(r, n);
    this.isRetryable = (o = n.isRetryable) != null ? o : !0;
  }
};
u(he, "DataProxyError");
d();
p();
m();
d();
p();
m();
function Q(e, t) {
  return { ...e, isRetryable: t };
}
u(Q, "setRetryable");
var or = class extends he {
  constructor(r) {
    super("This request must be retried", Q(r, !0));
    this.name = "ForcedRetryError";
    this.code = "P5001";
  }
};
u(or, "ForcedRetryError");
d();
p();
m();
var Ye = class extends he {
  constructor(r, n) {
    super(r, Q(n, !1));
    this.name = "InvalidDatasourceError";
    this.code = "P5002";
  }
};
u(Ye, "InvalidDatasourceError");
d();
p();
m();
var Ze = class extends he {
  constructor(r, n) {
    super(r, Q(n, !1));
    this.name = "NotImplementedYetError";
    this.code = "P5004";
  }
};
u(Ze, "NotImplementedYetError");
d();
p();
m();
d();
p();
m();
var Z = class extends he {
  constructor(r, n) {
    var i;
    super(r, n);
    this.response = n.response;
    let o =
      (i = this.response.headers) == null ? void 0 : i["Prisma-Request-Id"];
    if (o) {
      let s = `(The request id was: ${o})`;
      this.message = this.message + " " + s;
    }
  }
};
u(Z, "DataProxyAPIError");
var Ct = class extends Z {
  constructor(r) {
    super("Schema needs to be uploaded", Q(r, !0));
    this.name = "SchemaMissingError";
    this.code = "P5005";
  }
};
u(Ct, "SchemaMissingError");
d();
p();
m();
d();
p();
m();
var vi = "This request could not be understood by the server",
  $r = class extends Z {
    constructor(r, n, o) {
      super(n || vi, Q(r, !1));
      this.name = "BadRequestError";
      this.code = "P5000";
      o && (this.code = o);
    }
  };
u($r, "BadRequestError");
d();
p();
m();
var Lr = class extends Z {
  constructor(r, n) {
    super("Engine not started: healthcheck timeout", Q(r, !0));
    this.name = "HealthcheckTimeoutError";
    this.code = "P5013";
    this.logs = n;
  }
};
u(Lr, "HealthcheckTimeoutError");
d();
p();
m();
var Br = class extends Z {
  constructor(r, n, o) {
    super(n, Q(r, !0));
    this.name = "EngineStartupError";
    this.code = "P5014";
    this.logs = o;
  }
};
u(Br, "EngineStartupError");
d();
p();
m();
var qr = class extends Z {
  constructor(r) {
    super("Engine version is not supported", Q(r, !1));
    this.name = "EngineVersionNotSupportedError";
    this.code = "P5012";
  }
};
u(qr, "EngineVersionNotSupportedError");
d();
p();
m();
var Ei = "Request timed out",
  Ur = class extends Z {
    constructor(r, n = Ei) {
      super(n, Q(r, !1));
      this.name = "GatewayTimeoutError";
      this.code = "P5009";
    }
  };
u(Ur, "GatewayTimeoutError");
d();
p();
m();
var Jm = "Interactive transaction error",
  Vr = class extends Z {
    constructor(r, n = Jm) {
      super(n, Q(r, !1));
      this.name = "InteractiveTransactionError";
      this.code = "P5015";
    }
  };
u(Vr, "InteractiveTransactionError");
d();
p();
m();
var zm = "Request parameters are invalid",
  Gr = class extends Z {
    constructor(r, n = zm) {
      super(n, Q(r, !1));
      this.name = "InvalidRequestError";
      this.code = "P5011";
    }
  };
u(Gr, "InvalidRequestError");
d();
p();
m();
var Ti = "Requested resource does not exist",
  Jr = class extends Z {
    constructor(r, n = Ti) {
      super(n, Q(r, !1));
      this.name = "NotFoundError";
      this.code = "P5003";
    }
  };
u(Jr, "NotFoundError");
d();
p();
m();
var Ai = "Unknown server error",
  ir = class extends Z {
    constructor(r, n, o) {
      super(n || Ai, Q(r, !0));
      this.name = "ServerError";
      this.code = "P5006";
      this.logs = o;
    }
  };
u(ir, "ServerError");
d();
p();
m();
var Pi = "Unauthorized, check your connection string",
  zr = class extends Z {
    constructor(r, n = Pi) {
      super(n, Q(r, !1));
      this.name = "UnauthorizedError";
      this.code = "P5007";
    }
  };
u(zr, "UnauthorizedError");
d();
p();
m();
var Mi = "Usage exceeded, retry again later",
  Hr = class extends Z {
    constructor(r, n = Mi) {
      super(n, Q(r, !0));
      this.name = "UsageExceededError";
      this.code = "P5008";
    }
  };
u(Hr, "UsageExceededError");
async function Hm(e) {
  let t;
  try {
    t = await e.text();
  } catch (r) {
    return { type: "EmptyError" };
  }
  try {
    let r = JSON.parse(t);
    if (typeof r == "string")
      switch (r) {
        case "InternalDataProxyError":
          return { type: "DataProxyError", body: r };
        default:
          return { type: "UnknownTextError", body: r };
      }
    if (typeof r == "object" && r !== null) {
      if ("is_panic" in r && "message" in r && "error_code" in r)
        return { type: "QueryEngineError", body: r };
      if (
        "EngineNotStarted" in r ||
        "InteractiveTransactionMisrouted" in r ||
        "InvalidRequestError" in r
      ) {
        let n = Object.values(r)[0].reason;
        return typeof n == "string" &&
          !["SchemaMissing", "EngineVersionNotSupported"].includes(n)
          ? { type: "UnknownJsonError", body: r }
          : { type: "DataProxyError", body: r };
      }
    }
    return { type: "UnknownJsonError", body: r };
  } catch (r) {
    return t === ""
      ? { type: "EmptyError" }
      : { type: "UnknownTextError", body: t };
  }
}
u(Hm, "getResponseErrorBody");
async function Wr(e, t) {
  if (e.ok) return;
  let r = { clientVersion: t, response: e },
    n = await Hm(e);
  if (n.type === "QueryEngineError")
    throw new je(n.body.message, n.body.error_code, t);
  if (n.type === "DataProxyError") {
    if (n.body === "InternalDataProxyError")
      throw new ir(r, "Internal Data Proxy error");
    if ("EngineNotStarted" in n.body) {
      if (n.body.EngineNotStarted.reason === "SchemaMissing") return new Ct(r);
      if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported")
        throw new qr(r);
      if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
        let { msg: o, logs: i } =
          n.body.EngineNotStarted.reason.EngineStartupError;
        throw new Br(r, o, i);
      }
      if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
        let { msg: o, error_code: i } =
          n.body.EngineNotStarted.reason.KnownEngineStartupError;
        throw new _e(o, t, i);
      }
      if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
        let { logs: o } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
        throw new Lr(r, o);
      }
    }
    if ("InteractiveTransactionMisrouted" in n.body) {
      let o = {
        IDParseError: "Could not parse interactive transaction ID",
        NoQueryEngineFoundError:
          "Could not find Query Engine for the specified host and transaction ID",
        TransactionStartError: "Could not start interactive transaction",
      };
      throw new Vr(r, o[n.body.InteractiveTransactionMisrouted.reason]);
    }
    if ("InvalidRequestError" in n.body)
      throw new Gr(r, n.body.InvalidRequestError.reason);
  }
  if (e.status === 401 || e.status === 403) throw new zr(r, sr(Pi, n));
  if (e.status === 404) return new Jr(r, sr(Ti, n));
  if (e.status === 429) throw new Hr(r, sr(Mi, n));
  if (e.status === 504) throw new Ur(r, sr(Ei, n));
  if (e.status >= 500) throw new ir(r, sr(Ai, n));
  if (e.status >= 400) throw new $r(r, sr(vi, n));
}
u(Wr, "responseToError");
function sr(e, t) {
  return t.type === "EmptyError" ? e : `${e}: ${JSON.stringify(t)}`;
}
u(sr, "buildErrorMessage");
d();
p();
m();
function Lu(e) {
  let t = Math.pow(2, e) * 50,
    r = Math.ceil(Math.random() * t) - Math.ceil(t / 2),
    n = t + r;
  return new Promise((o) => setTimeout(() => o(n), n));
}
u(Lu, "backOff");
d();
p();
m();
var Bu = {
  "@prisma/debug": "workspace:4.6.1",
  "@prisma/engines-version": "4.6.1-3.694eea289a8462c80264df36757e4fdc129b1b32",
  "@prisma/fetch-engine": "workspace:4.6.1",
  "@prisma/get-platform": "workspace:4.6.1",
  "@swc/core": "1.3.14",
  "@swc/jest": "0.2.23",
  "@types/jest": "28.1.8",
  "@types/node": "16.18.3",
  execa: "5.1.1",
  jest: "28.1.3",
  typescript: "4.8.4",
};
d();
p();
m();
d();
p();
m();
var Kr = class extends he {
  constructor(r, n) {
    super(
      `Cannot fetch data from service:
${r}`,
      Q(n, !0)
    );
    this.name = "RequestError";
    this.code = "P5010";
  }
};
u(Kr, "RequestError");
d();
p();
m();
function qu() {
  return typeof self == "undefined" ? "node" : "browser";
}
u(qu, "getJSRuntimeName");
async function It(e, t) {
  var o;
  let r = t.clientVersion,
    n = qu();
  try {
    return n === "browser" ? await fetch(e, t) : await Si(e, t);
  } catch (i) {
    let s = (o = i.message) != null ? o : "Unknown error";
    throw new Kr(s, { clientVersion: r });
  }
}
u(It, "request");
function Km(e) {
  return { ...e.headers, "Content-Type": "application/json" };
}
u(Km, "buildHeaders");
function Qm(e) {
  return { method: e.method, headers: Km(e) };
}
u(Qm, "buildOptions");
function Ym(e, t) {
  return {
    text: () => v.Buffer.concat(e).toString(),
    json: () => JSON.parse(v.Buffer.concat(e).toString()),
    ok: t.statusCode >= 200 && t.statusCode <= 299,
    status: t.statusCode,
    url: t.url,
    headers: t.headers,
  };
}
u(Ym, "buildResponse");
async function Si(e, t = {}) {
  let r = Zm("https"),
    n = Qm(t),
    o = [],
    { origin: i } = new URL(e);
  return new Promise((s, a) => {
    var l;
    let c = r.request(e, n, (f) => {
      let {
        statusCode: g,
        headers: { location: y },
      } = f;
      g >= 301 &&
        g <= 399 &&
        y &&
        (y.startsWith("http") === !1 ? s(Si(`${i}${y}`, t)) : s(Si(y, t))),
        f.on("data", (b) => o.push(b)),
        f.on("end", () => s(Ym(o, f))),
        f.on("error", a);
    });
    c.on("error", a), c.end((l = t.body) != null ? l : "");
  });
}
u(Si, "nodeFetch");
var Zm = typeof yr != "undefined" ? yr : () => {};
var Xm = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/,
  Uu = Je("prisma:client:dataproxyEngine");
async function ed(e) {
  var i, s, a;
  let t = Bu["@prisma/engines-version"],
    r = (i = e.clientVersion) != null ? i : "unknown";
  if (w.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION)
    return w.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
  let [n, o] = (s = r == null ? void 0 : r.split("-")) != null ? s : [];
  if (o === void 0 && Xm.test(n)) return n;
  if (o !== void 0 || r === "0.0.0") {
    let [c] = (a = t.split("-")) != null ? a : [],
      [l, f, g] = c.split("."),
      y = td(`<=${l}.${f}.${g}`),
      b = await It(y, { clientVersion: r });
    if (!b.ok)
      throw new Error(
        `Failed to fetch stable Prisma version, unpkg.com status ${b.status} ${
          b.statusText
        }, response body: ${(await b.text()) || "<empty body>"}`
      );
    let x = await b.text();
    Uu("length of body fetched from unpkg.com", x.length);
    let h;
    try {
      h = JSON.parse(x);
    } catch (A) {
      throw (
        (console.error("JSON.parse error: body fetched from unpkg.com: ", x), A)
      );
    }
    return h.version;
  }
  throw new Ze(
    "Only `major.minor.patch` versions are supported by Prisma Data Proxy.",
    { clientVersion: r }
  );
}
u(ed, "_getClientVersion");
async function Vu(e) {
  let t = await ed(e);
  return Uu("version", t), t;
}
u(Vu, "getClientVersion");
function td(e) {
  return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
}
u(td, "prismaPkgURL");
var rd = 10,
  nd = Promise.resolve(),
  Oi = Je("prisma:client:dataproxyEngine"),
  ar = class extends _t {
    constructor(r) {
      var i, s, a, c;
      super();
      (this.config = r),
        (this.env = { ...this.config.env, ...w.env }),
        (this.inlineSchema = (i = r.inlineSchema) != null ? i : ""),
        (this.inlineDatasources = (s = r.inlineDatasources) != null ? s : {}),
        (this.inlineSchemaHash = (a = r.inlineSchemaHash) != null ? a : ""),
        (this.clientVersion = (c = r.clientVersion) != null ? c : "unknown"),
        (this.logEmitter = new Gu.default()),
        this.logEmitter.on("error", () => {});
      let [n, o] = this.extractHostAndApiKey();
      (this.remoteClientVersion = nd.then(() => Vu(this.config))),
        (this.headers = { Authorization: `Bearer ${o}` }),
        (this.host = n),
        Oi("host", this.host);
    }
    version() {
      return "unknown";
    }
    async start() {}
    async stop() {}
    on(r, n) {
      if (r === "beforeExit")
        throw new Ze("beforeExit event is not yet supported", {
          clientVersion: this.clientVersion,
        });
      this.logEmitter.on(r, n);
    }
    async url(r) {
      return `https://${this.host}/${await this.remoteClientVersion}/${
        this.inlineSchemaHash
      }/${r}`;
    }
    async getConfig() {
      return Promise.resolve({
        datasources: [{ activeProvider: this.config.activeProvider }],
      });
    }
    getDmmf() {
      throw new Ze("getDmmf is not yet supported", {
        clientVersion: this.clientVersion,
      });
    }
    async uploadSchema() {
      let r = await It(await this.url("schema"), {
        method: "PUT",
        headers: this.headers,
        body: this.inlineSchema,
        clientVersion: this.clientVersion,
      });
      r.ok || Oi("schema response status", r.status);
      let n = await Wr(r, this.clientVersion);
      if (n)
        throw (
          (this.logEmitter.emit("warn", {
            message: `Error while uploading schema: ${n.message}`,
          }),
          n)
        );
      this.logEmitter.emit("info", {
        message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`,
      });
    }
    request(r, n = {}, o) {
      return (
        this.logEmitter.emit("query", { query: r }),
        this.requestInternal({ query: r, variables: {} }, n, o)
      );
    }
    async requestBatch(r, n = {}, o) {
      let i = Boolean(o);
      this.logEmitter.emit("query", {
        query: `Batch${i ? " in transaction" : ""} (${r.length}):
${r.join(`
`)}`,
      });
      let s = {
          batch: r.map((c) => ({ query: c, variables: {} })),
          transaction: i,
          isolationLevel: o == null ? void 0 : o.isolationLevel,
        },
        { batchResult: a } = await this.requestInternal(s, n);
      return a;
    }
    requestInternal(r, n, o) {
      return this.withRetry({
        actionGerund: "querying",
        callback: async ({ logHttpCall: i }) => {
          let s = o
            ? `${o.payload.endpoint}/graphql`
            : await this.url("graphql");
          i(s);
          let a = await It(s, {
            method: "POST",
            headers: { ...po(n), ...this.headers },
            body: JSON.stringify(r),
            clientVersion: this.clientVersion,
          });
          a.ok || Oi("graphql response status", a.status);
          let c = await Wr(a, this.clientVersion);
          await this.handleError(c);
          let l = await a.json();
          if (l.errors)
            throw l.errors.length === 1
              ? $u(l.errors[0], this.config.clientVersion)
              : new Ce(l.errors, this.config.clientVersion);
          return l;
        },
      });
    }
    async transaction(r, n, o) {
      let i = {
        start: "starting",
        commit: "committing",
        rollback: "rolling back",
      };
      return this.withRetry({
        actionGerund: `${i[r]} transaction`,
        callback: async ({ logHttpCall: s }) => {
          var a, c;
          if (r === "start") {
            let l = JSON.stringify({
                max_wait:
                  (a = o == null ? void 0 : o.maxWait) != null ? a : 2e3,
                timeout: (c = o == null ? void 0 : o.timeout) != null ? c : 5e3,
                isolation_level: o == null ? void 0 : o.isolationLevel,
              }),
              f = await this.url("transaction/start");
            s(f);
            let g = await It(f, {
                method: "POST",
                headers: { ...po(n), ...this.headers },
                body: l,
                clientVersion: this.clientVersion,
              }),
              y = await Wr(g, this.clientVersion);
            await this.handleError(y);
            let b = await g.json(),
              x = b.id,
              h = b["data-proxy"].endpoint;
            return { id: x, payload: { endpoint: h } };
          } else {
            let l = `${o.payload.endpoint}/${r}`;
            s(l);
            let f = await It(l, {
                method: "POST",
                headers: { ...po(n), ...this.headers },
                clientVersion: this.clientVersion,
              }),
              g = await Wr(f, this.clientVersion);
            await this.handleError(g);
            return;
          }
        },
      });
    }
    extractHostAndApiKey() {
      let r = this.mergeOverriddenDatasources(),
        n = Object.keys(r)[0],
        o = r[n],
        i = this.resolveDatasourceURL(n, o),
        s;
      try {
        s = new URL(i);
      } catch (g) {
        throw new Ye("Could not parse URL of the datasource", {
          clientVersion: this.clientVersion,
        });
      }
      let { protocol: a, host: c, searchParams: l } = s;
      if (a !== "prisma:")
        throw new Ye(
          "Datasource URL must use prisma:// protocol when --data-proxy is used",
          { clientVersion: this.clientVersion }
        );
      let f = l.get("api_key");
      if (f === null || f.length < 1)
        throw new Ye("No valid API key found in the datasource URL", {
          clientVersion: this.clientVersion,
        });
      return [c, f];
    }
    mergeOverriddenDatasources() {
      if (this.config.datasources === void 0) return this.inlineDatasources;
      let r = { ...this.inlineDatasources };
      for (let n of this.config.datasources) {
        if (!this.inlineDatasources[n.name])
          throw new Error(`Unknown datasource: ${n.name}`);
        r[n.name] = { url: { fromEnvVar: null, value: n.url } };
      }
      return r;
    }
    resolveDatasourceURL(r, n) {
      if (n.url.value) return n.url.value;
      if (n.url.fromEnvVar) {
        let o = n.url.fromEnvVar,
          i = this.env[o];
        if (i === void 0)
          throw new Ye(
            `Datasource "${r}" references an environment variable "${o}" that is not set`,
            { clientVersion: this.clientVersion }
          );
        return i;
      }
      throw new Ye(
        `Datasource "${r}" specification is invalid: both value and fromEnvVar are null`,
        { clientVersion: this.clientVersion }
      );
    }
    metrics(r) {
      throw new Ze("Metric are not yet supported for Data Proxy", {
        clientVersion: this.clientVersion,
      });
    }
    async withRetry(r) {
      var n;
      for (let o = 0; ; o++) {
        let i = u((s) => {
          this.logEmitter.emit("info", { message: `Calling ${s} (n=${o})` });
        }, "logHttpCall");
        try {
          return await r.callback({ logHttpCall: i });
        } catch (s) {
          if (
            (this.logEmitter.emit("error", {
              message: `Error while ${r.actionGerund}: ${
                (n = s.message) != null ? n : "(unknown)"
              }`,
            }),
            !(s instanceof he) || !s.isRetryable)
          )
            throw s;
          if (o >= rd) throw s instanceof or ? s.cause : s;
          this.logEmitter.emit("warn", {
            message: "This request can be retried",
          });
          let a = await Lu(o);
          this.logEmitter.emit("warn", { message: `Retrying after ${a}ms` });
        }
      }
    }
    async handleError(r) {
      if (r instanceof Ct)
        throw (
          (await this.uploadSchema(),
          new or({ clientVersion: this.clientVersion, cause: r }))
        );
      if (r) throw r;
    }
  };
u(ar, "DataProxyEngine");
d();
p();
m();
d();
p();
m();
var Ju = "library";
function _i(e) {
  let t = od();
  return (
    t ||
    ((e == null ? void 0 : e.config.engineType) === "library"
      ? "library"
      : (e == null ? void 0 : e.config.engineType) === "binary"
      ? "binary"
      : Ju)
  );
}
u(_i, "getClientEngineType");
function od() {
  let e = w.env.PRISMA_CLIENT_ENGINE_TYPE;
  return e === "library" ? "library" : e === "binary" ? "binary" : void 0;
}
u(od, "getEngineTypeFromEnvVar");
d();
p();
m();
var sd = ee(Hu()),
  ad = ee(Ii());
function Yr(e) {
  return e instanceof Error;
}
u(Yr, "isError");
var ur = {};
fs(ur, {
  error: () => ld,
  info: () => cd,
  log: () => ud,
  query: () => fd,
  should: () => Yu,
  tags: () => Xr,
  warn: () => Ri,
});
d();
p();
m();
var Zr = ee(At());
var Xr = {
    error: Zr.default.red("prisma:error"),
    warn: Zr.default.yellow("prisma:warn"),
    info: Zr.default.cyan("prisma:info"),
    query: Zr.default.blue("prisma:query"),
  },
  Yu = { warn: !w.env.PRISMA_DISABLE_WARNINGS };
function ud(...e) {
  console.log(...e);
}
u(ud, "log");
function Ri(e, ...t) {
  Yu.warn && console.warn(`${Xr.warn} ${e}`, ...t);
}
u(Ri, "warn");
function cd(e, ...t) {
  console.info(`${Xr.info} ${e}`, ...t);
}
u(cd, "info");
function ld(e, ...t) {
  console.error(`${Xr.error} ${e}`, ...t);
}
u(ld, "error");
function fd(e, ...t) {
  console.log(`${Xr.query} ${e}`, ...t);
}
u(fd, "query");
d();
p();
m();
function Fi(e, t) {
  throw new Error(t);
}
u(Fi, "assertNever");
d();
p();
m();
function Di(e) {
  let t;
  return (...r) => (t != null ? t : (t = e(...r)));
}
u(Di, "callOnce");
d();
p();
m();
var Ni = u((e, t) => e.reduce((r, n) => ((r[t(n)] = n), r), {}), "keyBy");
d();
p();
m();
var Zu = new Set(),
  ki = u((e, t, ...r) => {
    Zu.has(e) || (Zu.add(e), Ri(t, ...r));
  }, "warnOnce");
var RF = ee(ec());
bi();
var yn = ee(Ru());
d();
p();
m();
var pe = class {
  constructor(t, r) {
    if (t.length - 1 !== r.length)
      throw t.length === 0
        ? new TypeError("Expected at least 1 string")
        : new TypeError(
            `Expected ${t.length} strings to have ${t.length - 1} values`
          );
    let n = r.reduce((s, a) => s + (a instanceof pe ? a.values.length : 1), 0);
    (this.values = new Array(n)),
      (this.strings = new Array(n + 1)),
      (this.strings[0] = t[0]);
    let o = 0,
      i = 0;
    for (; o < r.length; ) {
      let s = r[o++],
        a = t[o];
      if (s instanceof pe) {
        this.strings[i] += s.strings[0];
        let c = 0;
        for (; c < s.values.length; )
          (this.values[i++] = s.values[c++]), (this.strings[i] = s.strings[c]);
        this.strings[i] += a;
      } else (this.values[i++] = s), (this.strings[i] = a);
    }
  }
  get text() {
    let t = 1,
      r = this.strings[0];
    for (; t < this.strings.length; ) r += `$${t}${this.strings[t++]}`;
    return r;
  }
  get sql() {
    let t = 1,
      r = this.strings[0];
    for (; t < this.strings.length; ) r += `?${this.strings[t++]}`;
    return r;
  }
  inspect() {
    return { text: this.text, sql: this.sql, values: this.values };
  }
};
u(pe, "Sql");
function md(e, t = ",", r = "", n = "") {
  if (e.length === 0)
    throw new TypeError(
      "Expected `join([])` to be called with an array of multiple elements, but got an empty array"
    );
  return new pe([r, ...Array(e.length - 1).fill(t), n], e);
}
u(md, "join");
function tc(e) {
  return new pe([e], []);
}
u(tc, "raw");
var dd = tc("");
function rc(e, ...t) {
  return new pe(e, t);
}
u(rc, "sql");
d();
p();
m();
d();
p();
m();
var oc = ee(nc());
function ic(e) {
  return { ...e, mappings: gd(e.mappings, e.datamodel) };
}
u(ic, "externalToInternalDmmf");
function gd(e, t) {
  return {
    modelOperations: e.modelOperations
      .filter((n) => {
        let o = t.models.find((i) => i.name === n.model);
        if (!o) throw new Error(`Mapping without model ${n.model}`);
        return o.fields.some((i) => i.kind !== "object");
      })
      .map((n) => ({
        model: n.model,
        plural: (0, oc.default)(Bn(n.model)),
        findUnique: n.findUnique || n.findSingle,
        findFirst: n.findFirst,
        findMany: n.findMany,
        create: n.createOne || n.createSingle || n.create,
        createMany: n.createMany,
        delete: n.deleteOne || n.deleteSingle || n.delete,
        update: n.updateOne || n.updateSingle || n.update,
        deleteMany: n.deleteMany,
        updateMany: n.updateMany,
        upsert: n.upsertOne || n.upsertSingle || n.upsert,
        aggregate: n.aggregate,
        groupBy: n.groupBy,
        findRaw: n.findRaw,
        aggregateRaw: n.aggregateRaw,
      })),
    otherOperations: e.otherOperations,
  };
}
u(gd, "getMappings");
function sc(e) {
  return ic(e);
}
u(sc, "getPrismaClientDMMF");
d();
p();
m();
d();
p();
m();
var D = ee(At());
var Rt = ee(kn()),
  zi = ee(fo());
d();
p();
m();
var lr = ee(At()),
  gc = ee(kn());
d();
p();
m();
var cr = {
  findUniqueOrThrow: { wrappedAction: pt.ModelAction.findUnique },
  findFirstOrThrow: { wrappedAction: pt.ModelAction.findFirst },
};
function ac(e) {
  return Li(e) ? cr[e].wrappedAction : e;
}
u(ac, "getDmmfActionName");
function Li(e) {
  return Object.prototype.hasOwnProperty.call(cr, e);
}
u(Li, "isClientOnlyAction");
var uc = Object.keys(pt.ModelAction).concat(Object.keys(cr));
d();
p();
m();
bi();
d();
p();
m();
d();
p();
m();
d();
p();
m();
var wt = ee(At());
var yd = wt.default.rgb(246, 145, 95),
  hd = wt.default.rgb(107, 139, 140),
  mo = wt.default.cyan,
  cc = wt.default.rgb(127, 155, 155),
  lc = u((e) => e, "identity"),
  fc = {
    keyword: mo,
    entity: mo,
    value: cc,
    punctuation: hd,
    directive: mo,
    function: mo,
    variable: cc,
    string: wt.default.greenBright,
    boolean: yd,
    number: wt.default.cyan,
    comment: wt.default.grey,
  };
var go = {},
  bd = 0,
  U = {
    manual: go.Prism && go.Prism.manual,
    disableWorkerMessageHandler:
      go.Prism && go.Prism.disableWorkerMessageHandler,
    util: {
      encode: function (e) {
        if (e instanceof $e) {
          let t = e;
          return new $e(t.type, U.util.encode(t.content), t.alias);
        } else
          return Array.isArray(e)
            ? e.map(U.util.encode)
            : e
                .replace(/&/g, "&amp;")
                .replace(/</g, "&lt;")
                .replace(/\u00a0/g, " ");
      },
      type: function (e) {
        return Object.prototype.toString.call(e).slice(8, -1);
      },
      objId: function (e) {
        return (
          e.__id || Object.defineProperty(e, "__id", { value: ++bd }), e.__id
        );
      },
      clone: u(function e(t, r) {
        let n,
          o,
          i = U.util.type(t);
        switch (((r = r || {}), i)) {
          case "Object":
            if (((o = U.util.objId(t)), r[o])) return r[o];
            (n = {}), (r[o] = n);
            for (let s in t) t.hasOwnProperty(s) && (n[s] = e(t[s], r));
            return n;
          case "Array":
            return (
              (o = U.util.objId(t)),
              r[o]
                ? r[o]
                : ((n = []),
                  (r[o] = n),
                  t.forEach(function (s, a) {
                    n[a] = e(s, r);
                  }),
                  n)
            );
          default:
            return t;
        }
      }, "deepClone"),
    },
    languages: {
      extend: function (e, t) {
        let r = U.util.clone(U.languages[e]);
        for (let n in t) r[n] = t[n];
        return r;
      },
      insertBefore: function (e, t, r, n) {
        n = n || U.languages;
        let o = n[e],
          i = {};
        for (let a in o)
          if (o.hasOwnProperty(a)) {
            if (a == t) for (let c in r) r.hasOwnProperty(c) && (i[c] = r[c]);
            r.hasOwnProperty(a) || (i[a] = o[a]);
          }
        let s = n[e];
        return (
          (n[e] = i),
          U.languages.DFS(U.languages, function (a, c) {
            c === s && a != e && (this[a] = i);
          }),
          i
        );
      },
      DFS: u(function e(t, r, n, o) {
        o = o || {};
        let i = U.util.objId;
        for (let s in t)
          if (t.hasOwnProperty(s)) {
            r.call(t, s, t[s], n || s);
            let a = t[s],
              c = U.util.type(a);
            c === "Object" && !o[i(a)]
              ? ((o[i(a)] = !0), e(a, r, null, o))
              : c === "Array" && !o[i(a)] && ((o[i(a)] = !0), e(a, r, s, o));
          }
      }, "DFS"),
    },
    plugins: {},
    highlight: function (e, t, r) {
      let n = { code: e, grammar: t, language: r };
      return (
        U.hooks.run("before-tokenize", n),
        (n.tokens = U.tokenize(n.code, n.grammar)),
        U.hooks.run("after-tokenize", n),
        $e.stringify(U.util.encode(n.tokens), n.language)
      );
    },
    matchGrammar: function (e, t, r, n, o, i, s) {
      for (let h in r) {
        if (!r.hasOwnProperty(h) || !r[h]) continue;
        if (h == s) return;
        let A = r[h];
        A = U.util.type(A) === "Array" ? A : [A];
        for (let M = 0; M < A.length; ++M) {
          let P = A[M],
            S = P.inside,
            T = !!P.lookbehind,
            O = !!P.greedy,
            R = 0,
            F = P.alias;
          if (O && !P.pattern.global) {
            let B = P.pattern.toString().match(/[imuy]*$/)[0];
            P.pattern = RegExp(P.pattern.source, B + "g");
          }
          P = P.pattern || P;
          for (let B = n, W = o; B < t.length; W += t[B].length, ++B) {
            let te = t[B];
            if (t.length > e.length) return;
            if (te instanceof $e) continue;
            if (O && B != t.length - 1) {
              P.lastIndex = W;
              var g = P.exec(e);
              if (!g) break;
              var f = g.index + (T ? g[1].length : 0),
                y = g.index + g[0].length,
                a = B,
                c = W;
              for (
                let $ = t.length;
                a < $ && (c < y || (!t[a].type && !t[a - 1].greedy));
                ++a
              )
                (c += t[a].length), f >= c && (++B, (W = c));
              if (t[B] instanceof $e) continue;
              (l = a - B), (te = e.slice(W, c)), (g.index -= W);
            } else {
              P.lastIndex = 0;
              var g = P.exec(te),
                l = 1;
            }
            if (!g) {
              if (i) break;
              continue;
            }
            T && (R = g[1] ? g[1].length : 0);
            var f = g.index + R,
              g = g[0].slice(R),
              y = f + g.length,
              b = te.slice(0, f),
              x = te.slice(y);
            let V = [B, l];
            b && (++B, (W += b.length), V.push(b));
            let J = new $e(h, S ? U.tokenize(g, S) : g, F, g, O);
            if (
              (V.push(J),
              x && V.push(x),
              Array.prototype.splice.apply(t, V),
              l != 1 && U.matchGrammar(e, t, r, B, W, !0, h),
              i)
            )
              break;
          }
        }
      }
    },
    tokenize: function (e, t) {
      let r = [e],
        n = t.rest;
      if (n) {
        for (let o in n) t[o] = n[o];
        delete t.rest;
      }
      return U.matchGrammar(e, r, t, 0, 0, !1), r;
    },
    hooks: {
      all: {},
      add: function (e, t) {
        let r = U.hooks.all;
        (r[e] = r[e] || []), r[e].push(t);
      },
      run: function (e, t) {
        let r = U.hooks.all[e];
        if (!(!r || !r.length)) for (var n = 0, o; (o = r[n++]); ) o(t);
      },
    },
    Token: $e,
  };
U.languages.clike = {
  comment: [
    { pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: !0 },
    { pattern: /(^|[^\\:])\/\/.*/, lookbehind: !0, greedy: !0 },
  ],
  string: {
    pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    greedy: !0,
  },
  "class-name": {
    pattern:
      /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i,
    lookbehind: !0,
    inside: { punctuation: /[.\\]/ },
  },
  keyword:
    /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
  boolean: /\b(?:true|false)\b/,
  function: /\w+(?=\()/,
  number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i,
  operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/,
  punctuation: /[{}[\];(),.:]/,
};
U.languages.javascript = U.languages.extend("clike", {
  "class-name": [
    U.languages.clike["class-name"],
    {
      pattern:
        /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/,
      lookbehind: !0,
    },
  ],
  keyword: [
    { pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: !0 },
    {
      pattern:
        /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
      lookbehind: !0,
    },
  ],
  number:
    /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
  function:
    /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
  operator:
    /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/,
});
U.languages.javascript["class-name"][0].pattern =
  /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
U.languages.insertBefore("javascript", "keyword", {
  regex: {
    pattern:
      /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/,
    lookbehind: !0,
    greedy: !0,
  },
  "function-variable": {
    pattern:
      /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/,
    alias: "function",
  },
  parameter: [
    {
      pattern:
        /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/,
      lookbehind: !0,
      inside: U.languages.javascript,
    },
    {
      pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i,
      inside: U.languages.javascript,
    },
    {
      pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/,
      lookbehind: !0,
      inside: U.languages.javascript,
    },
    {
      pattern:
        /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/,
      lookbehind: !0,
      inside: U.languages.javascript,
    },
  ],
  constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/,
});
U.languages.markup && U.languages.markup.tag.addInlined("script", "javascript");
U.languages.js = U.languages.javascript;
U.languages.typescript = U.languages.extend("javascript", {
  keyword:
    /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/,
  builtin:
    /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/,
});
U.languages.ts = U.languages.typescript;
function $e(e, t, r, n, o) {
  (this.type = e),
    (this.content = t),
    (this.alias = r),
    (this.length = (n || "").length | 0),
    (this.greedy = !!o);
}
u($e, "Token");
$e.stringify = function (e, t) {
  return typeof e == "string"
    ? e
    : Array.isArray(e)
    ? e
        .map(function (r) {
          return $e.stringify(r, t);
        })
        .join("")
    : wd(e.type)(e.content);
};
function wd(e) {
  return fc[e] || lc;
}
u(wd, "getColorForSyntaxKind");
function pc(e) {
  return xd(e, U.languages.javascript);
}
u(pc, "highlightTS");
function xd(e, t) {
  return U.tokenize(e, t)
    .map((n) => $e.stringify(n))
    .join("");
}
u(xd, "highlight");
d();
p();
m();
var mc = ee(Ii());
function dc(e) {
  return (0, mc.default)(e);
}
u(dc, "dedent");
var Ie = class {
  static read(t) {
    let r;
    try {
      r = co.readFileSync(t, "utf-8");
    } catch (n) {
      return null;
    }
    return Ie.fromContent(r);
  }
  static fromContent(t) {
    let r = t.split(/\r?\n/);
    return new Ie(1, r);
  }
  constructor(t, r) {
    (this.firstLineNumber = t), (this.lines = r);
  }
  get lastLineNumber() {
    return this.firstLineNumber + this.lines.length - 1;
  }
  mapLineAt(t, r) {
    if (
      t < this.firstLineNumber ||
      t > this.lines.length + this.firstLineNumber
    )
      return this;
    let n = t - this.firstLineNumber,
      o = [...this.lines];
    return (o[n] = r(o[n])), new Ie(this.firstLineNumber, o);
  }
  mapLines(t) {
    return new Ie(
      this.firstLineNumber,
      this.lines.map((r, n) => t(r, this.firstLineNumber + n))
    );
  }
  lineAt(t) {
    return this.lines[t - this.firstLineNumber];
  }
  prependSymbolAt(t, r) {
    return this.mapLines((n, o) => (o === t ? `${r} ${n}` : `  ${n}`));
  }
  slice(t, r) {
    let n = this.lines.slice(t - 1, r).join(`
`);
    return new Ie(
      t,
      dc(n).split(`
`)
    );
  }
  highlight() {
    let t = pc(this.toString());
    return new Ie(
      this.firstLineNumber,
      t.split(`
`)
    );
  }
  toString() {
    return this.lines.join(`
`);
  }
};
u(Ie, "SourceFileSlice");
var vd = {
    red: (e) => lr.default.red(e),
    gray: (e) => lr.default.gray(e),
    dim: (e) => lr.default.dim(e),
    bold: (e) => lr.default.bold(e),
    underline: (e) => lr.default.underline(e),
    highlightSource: (e) => e.highlight(),
  },
  Ed = {
    red: (e) => e,
    gray: (e) => e,
    dim: (e) => e,
    bold: (e) => e,
    underline: (e) => e,
    highlightSource: (e) => e,
  };
function Td(
  { callsite: e, message: t, originalMethod: r, isPanic: n, callArguments: o },
  i
) {
  var g;
  let s = {
    functionName: `prisma.${r}()`,
    message: t,
    isPanic: n != null ? n : !1,
    callArguments: o,
  };
  if (!e || typeof window != "undefined" || w.env.NODE_ENV === "production")
    return s;
  let a = e.getLocation();
  if (!a || !a.lineNumber || !a.columnNumber) return s;
  let c = Math.max(1, a.lineNumber - 3),
    l = (g = Ie.read(a.fileName)) == null ? void 0 : g.slice(c, a.lineNumber),
    f = l == null ? void 0 : l.lineAt(a.lineNumber);
  if (l && f) {
    let y = Pd(f),
      b = Ad(f);
    if (!b) return s;
    (s.functionName = `${b.code})`),
      (s.location = a),
      n ||
        (l = l.mapLineAt(a.lineNumber, (h) => h.slice(0, b.openingBraceIndex))),
      (l = i.highlightSource(l));
    let x = String(l.lastLineNumber).length;
    if (
      ((s.contextLines = l
        .mapLines((h, A) => i.gray(String(A).padStart(x)) + " " + h)
        .mapLines((h) => i.dim(h))
        .prependSymbolAt(a.lineNumber, i.bold(i.red("\u2192")))),
      o)
    ) {
      let h = y + x + 1;
      (h += 2), (s.callArguments = (0, gc.default)(o, h).slice(h));
    }
  }
  return s;
}
u(Td, "getTemplateParameters");
function Ad(e) {
  let t = uc.join("|"),
    n = new RegExp(String.raw`\S+(${t})\(`).exec(e);
  return n ? { code: n[0], openingBraceIndex: n.index + n[0].length } : null;
}
u(Ad, "findPrismaActionCall");
function Pd(e) {
  let t = 0;
  for (let r = 0; r < e.length; r++) {
    if (e.charAt(r) !== " ") return t;
    t++;
  }
  return t;
}
u(Pd, "getIndent");
function Md(
  {
    functionName: e,
    location: t,
    message: r,
    isPanic: n,
    contextLines: o,
    callArguments: i,
  },
  s
) {
  let a = [""],
    c = t ? " in" : ":";
  if (
    (n
      ? (a.push(
          s.red(
            `Oops, an unknown error occurred! This is ${s.bold(
              "on us"
            )}, you did nothing wrong.`
          )
        ),
        a.push(
          s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${c}`)
        ))
      : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${c}`)),
    t && a.push(s.underline(Sd(t))),
    o)
  ) {
    a.push("");
    let l = [o.toString()];
    i && (l.push(i), l.push(s.dim(")"))), a.push(l.join("")), i && a.push("");
  } else a.push(""), i && a.push(i), a.push("");
  return (
    a.push(r),
    a.join(`
`)
  );
}
u(Md, "stringifyErrorMessage");
function Sd(e) {
  let t = [e.fileName];
  return (
    e.lineNumber && t.push(String(e.lineNumber)),
    e.columnNumber && t.push(String(e.columnNumber)),
    t.join(":")
  );
}
u(Sd, "stringifyLocationInFile");
function fr(e) {
  let t = e.showColors ? vd : Ed,
    r = Td(e, t);
  return Md(r, t);
}
u(fr, "createErrorMessageWithContext");
d();
p();
m();
function hc(e) {
  return e instanceof v.Buffer || e instanceof Date || e instanceof RegExp;
}
u(hc, "isSpecificValue");
function bc(e) {
  if (e instanceof v.Buffer) {
    let t = v.Buffer.alloc ? v.Buffer.alloc(e.length) : new v.Buffer(e.length);
    return e.copy(t), t;
  } else {
    if (e instanceof Date) return new Date(e.getTime());
    if (e instanceof RegExp) return new RegExp(e);
    throw new Error("Unexpected situation");
  }
}
u(bc, "cloneSpecificValue");
function wc(e) {
  let t = [];
  return (
    e.forEach(function (r, n) {
      typeof r == "object" && r !== null
        ? Array.isArray(r)
          ? (t[n] = wc(r))
          : hc(r)
          ? (t[n] = bc(r))
          : (t[n] = en({}, r))
        : (t[n] = r);
    }),
    t
  );
}
u(wc, "deepCloneArray");
function yc(e, t) {
  return t === "__proto__" ? void 0 : e[t];
}
u(yc, "safeGetProperty");
var en = u(function (e, ...t) {
  if (!e || typeof e != "object") return !1;
  if (t.length === 0) return e;
  let r, n;
  for (let o of t)
    if (!(typeof o != "object" || o === null || Array.isArray(o))) {
      for (let i of Object.keys(o))
        if (((n = yc(e, i)), (r = yc(o, i)), r !== e))
          if (typeof r != "object" || r === null) {
            e[i] = r;
            continue;
          } else if (Array.isArray(r)) {
            e[i] = wc(r);
            continue;
          } else if (hc(r)) {
            e[i] = bc(r);
            continue;
          } else if (typeof n != "object" || n === null || Array.isArray(n)) {
            e[i] = en({}, r);
            continue;
          } else {
            e[i] = en(n, r);
            continue;
          }
    }
  return e;
}, "deepExtend");
d();
p();
m();
var xc = u((e) => (Array.isArray(e) ? e : e.split(".")), "keys"),
  Bi = u((e, t) => xc(t).reduce((r, n) => r && r[n], e), "deepGet"),
  yo = u(
    (e, t, r) =>
      xc(t).reduceRight(
        (n, o, i, s) => Object.assign({}, Bi(e, s.slice(0, i)), { [o]: n }),
        r
      ),
    "deepSet"
  );
d();
p();
m();
function vc(e, t) {
  if (!e || typeof e != "object" || typeof e.hasOwnProperty != "function")
    return e;
  let r = {};
  for (let n in e) {
    let o = e[n];
    Object.hasOwnProperty.call(e, n) && t(n, o) && (r[n] = o);
  }
  return r;
}
u(vc, "filterObject");
d();
p();
m();
var Od = {
  "[object Date]": !0,
  "[object Uint8Array]": !0,
  "[object Decimal]": !0,
};
function Ec(e) {
  return e
    ? typeof e == "object" && !Od[Object.prototype.toString.call(e)]
    : !1;
}
u(Ec, "isObject");
d();
p();
m();
function Tc(e, t) {
  let r = {},
    n = Array.isArray(t) ? t : [t];
  for (let o in e)
    Object.hasOwnProperty.call(e, o) && !n.includes(o) && (r[o] = e[o]);
  return r;
}
u(Tc, "omit");
d();
p();
m();
var Me = ee(At()),
  Vi = ee(fo());
d();
p();
m();
var _d = Pc(),
  Cd = Sc(),
  Id = Oc().default,
  Rd = u((e, t, r) => {
    let n = [];
    return u(function o(i, s = {}, a = "", c = []) {
      s.indent = s.indent || "	";
      let l;
      s.inlineCharacterLimit === void 0
        ? (l = {
            newLine: `
`,
            newLineOrSpace: `
`,
            pad: a,
            indent: a + s.indent,
          })
        : (l = {
            newLine: "@@__STRINGIFY_OBJECT_NEW_LINE__@@",
            newLineOrSpace: "@@__STRINGIFY_OBJECT_NEW_LINE_OR_SPACE__@@",
            pad: "@@__STRINGIFY_OBJECT_PAD__@@",
            indent: "@@__STRINGIFY_OBJECT_INDENT__@@",
          });
      let f = u((g) => {
        if (s.inlineCharacterLimit === void 0) return g;
        let y = g
          .replace(new RegExp(l.newLine, "g"), "")
          .replace(new RegExp(l.newLineOrSpace, "g"), " ")
          .replace(new RegExp(l.pad + "|" + l.indent, "g"), "");
        return y.length <= s.inlineCharacterLimit
          ? y
          : g
              .replace(
                new RegExp(l.newLine + "|" + l.newLineOrSpace, "g"),
                `
`
              )
              .replace(new RegExp(l.pad, "g"), a)
              .replace(new RegExp(l.indent, "g"), a + s.indent);
      }, "expandWhiteSpace");
      if (n.indexOf(i) !== -1) return '"[Circular]"';
      if (v.Buffer.isBuffer(i)) return `Buffer(${v.Buffer.length})`;
      if (
        i == null ||
        typeof i == "number" ||
        typeof i == "boolean" ||
        typeof i == "function" ||
        typeof i == "symbol" ||
        i instanceof Te ||
        _d(i)
      )
        return String(i);
      if (i instanceof Date) return `new Date('${i.toISOString()}')`;
      if (i instanceof Oe) return `prisma.${Bn(i.modelName)}.fields.${i.name}`;
      if (Array.isArray(i)) {
        if (i.length === 0) return "[]";
        n.push(i);
        let g =
          "[" +
          l.newLine +
          i
            .map((y, b) => {
              let x = i.length - 1 === b ? l.newLine : "," + l.newLineOrSpace,
                h = o(y, s, a + s.indent, [...c, b]);
              return (
                s.transformValue && (h = s.transformValue(i, b, h)),
                l.indent + h + x
              );
            })
            .join("") +
          l.pad +
          "]";
        return n.pop(), f(g);
      }
      if (Cd(i)) {
        let g = Object.keys(i).concat(Id(i));
        if ((s.filter && (g = g.filter((b) => s.filter(i, b))), g.length === 0))
          return "{}";
        n.push(i);
        let y =
          "{" +
          l.newLine +
          g
            .map((b, x) => {
              let h = g.length - 1 === x ? l.newLine : "," + l.newLineOrSpace,
                A = typeof b == "symbol",
                M = !A && /^[a-z$_][a-z$_0-9]*$/i.test(b),
                P = A || M ? b : o(b, s, void 0, [...c, b]),
                S = o(i[b], s, a + s.indent, [...c, b]);
              s.transformValue && (S = s.transformValue(i, b, S));
              let T = l.indent + String(P) + ": " + S + h;
              return (
                s.transformLine &&
                  (T = s.transformLine({
                    obj: i,
                    indent: l.indent,
                    key: P,
                    stringifiedValue: S,
                    value: i[b],
                    eol: h,
                    originalLine: T,
                    path: c.concat(P),
                  })),
                T
              );
            })
            .join("") +
          l.pad +
          "}";
        return n.pop(), f(y);
      }
      return (
        (i = String(i).replace(/[\r\n]/g, (g) =>
          g ===
          `
`
            ? "\\n"
            : "\\r"
        )),
        s.singleQuotes === !1
          ? ((i = i.replace(/"/g, '\\"')), `"${i}"`)
          : ((i = i.replace(/\\?'/g, "\\'")), `'${i}'`)
      );
    }, "stringifyObject")(e, t, r);
  }, "stringifyObject"),
  tn = Rd;
var Ui = "@@__DIM_POINTER__@@";
function ho({ ast: e, keyPaths: t, valuePaths: r, missingItems: n }) {
  let o = e;
  for (let { path: i, type: s } of n) o = yo(o, i, s);
  return tn(o, {
    indent: "  ",
    transformLine: ({
      indent: i,
      key: s,
      value: a,
      stringifiedValue: c,
      eol: l,
      path: f,
    }) => {
      let g = f.join("."),
        y = t.includes(g),
        b = r.includes(g),
        x = n.find((A) => A.path === g),
        h = c;
      if (x) {
        typeof a == "string" && (h = h.slice(1, h.length - 1));
        let A = x.isRequired ? "" : "?",
          M = x.isRequired ? "+" : "?",
          S = (x.isRequired ? Me.default.greenBright : Me.default.green)(
            Nd(s + A + ": " + h + l, i, M)
          );
        return x.isRequired || (S = Me.default.dim(S)), S;
      } else {
        let A = n.some((T) => g.startsWith(T.path)),
          M = s[s.length - 2] === "?";
        M && (s = s.slice(1, s.length - 1)),
          M &&
            typeof a == "object" &&
            a !== null &&
            (h = h
              .split(
                `
`
              )
              .map((T, O, R) => (O === R.length - 1 ? T + Ui : T)).join(`
`)),
          A &&
            typeof a == "string" &&
            ((h = h.slice(1, h.length - 1)), M || (h = Me.default.bold(h))),
          (typeof a != "object" || a === null) &&
            !b &&
            !A &&
            (h = Me.default.dim(h));
        let P = y ? Me.default.redBright(s) : s;
        h = b ? Me.default.redBright(h) : h;
        let S = i + P + ": " + h + (A ? l : Me.default.dim(l));
        if (y || b) {
          let T = S.split(`
`),
            O = String(s).length,
            R = y ? Me.default.redBright("~".repeat(O)) : " ".repeat(O),
            F = b ? Fd(i, s, a, c) : 0,
            B = b && _c(a),
            W = b ? "  " + Me.default.redBright("~".repeat(F)) : "";
          R && R.length > 0 && !B && T.splice(1, 0, i + R + W),
            R &&
              R.length > 0 &&
              B &&
              T.splice(T.length - 1, 0, i.slice(0, i.length - 2) + W),
            (S = T.join(`
`));
        }
        return S;
      }
    },
  });
}
u(ho, "printJsonWithErrors");
function Fd(e, t, r, n) {
  return r === null
    ? 4
    : typeof r == "string"
    ? r.length + 2
    : _c(r)
    ? Math.abs(Dd(`${t}: ${(0, Vi.default)(n)}`) - e.length)
    : String(r).length;
}
u(Fd, "getValueLength");
function _c(e) {
  return typeof e == "object" && e !== null && !(e instanceof Te);
}
u(_c, "isRenderedAsObject");
function Dd(e) {
  return e
    .split(
      `
`
    )
    .reduce((t, r) => (r.length > t ? r.length : t), 0);
}
u(Dd, "getLongestLine");
function Nd(e, t, r) {
  return e
    .split(
      `
`
    )
    .map((n, o, i) =>
      o === 0 ? r + t.slice(1) + n : o < i.length - 1 ? r + n.slice(1) : n
    )
    .map((n) =>
      (0, Vi.default)(n).includes(Ui)
        ? Me.default.dim(n.replace(Ui, ""))
        : n.includes("?")
        ? Me.default.dim(n)
        : n
    ).join(`
`);
}
u(Nd, "prefixLines");
var rn = 2,
  bo = class {
    constructor(t, r) {
      this.type = t;
      this.children = r;
      this.printFieldError = u(({ error: t }, r, n) => {
        if (t.type === "emptySelect") {
          let o = n
            ? ""
            : ` Available options are listed in ${D.default.greenBright.dim(
                "green"
              )}.`;
          return `The ${D.default.redBright(
            "`select`"
          )} statement for type ${D.default.bold(
            Pt(t.field.outputType.type)
          )} must not be empty.${o}`;
        }
        if (t.type === "emptyInclude") {
          if (r.length === 0)
            return `${D.default.bold(
              Pt(t.field.outputType.type)
            )} does not have any relation and therefore can't have an ${D.default.redBright(
              "`include`"
            )} statement.`;
          let o = n
            ? ""
            : ` Available options are listed in ${D.default.greenBright.dim(
                "green"
              )}.`;
          return `The ${D.default.redBright(
            "`include`"
          )} statement for type ${D.default.bold(
            Pt(t.field.outputType.type)
          )} must not be empty.${o}`;
        }
        if (t.type === "noTrueSelect")
          return `The ${D.default.redBright(
            "`select`"
          )} statement for type ${D.default.bold(
            Pt(t.field.outputType.type)
          )} needs ${D.default.bold("at least one truthy value")}.`;
        if (t.type === "includeAndSelect")
          return `Please ${D.default.bold(
            "either"
          )} use ${D.default.greenBright(
            "`include`"
          )} or ${D.default.greenBright("`select`")}, but ${D.default.redBright(
            "not both"
          )} at the same time.`;
        if (t.type === "invalidFieldName") {
          let o = t.isInclude ? "include" : "select",
            i = t.isIncludeScalar ? "Invalid scalar" : "Unknown",
            s = n
              ? ""
              : t.isInclude && r.length === 0
              ? `
This model has no relations, so you can't use ${D.default.redBright(
                  "include"
                )} with it.`
              : ` Available options are listed in ${D.default.greenBright.dim(
                  "green"
                )}.`,
            a = `${i} field ${D.default.redBright(
              `\`${t.providedName}\``
            )} for ${D.default.bold(
              o
            )} statement on model ${D.default.bold.white(t.modelName)}.${s}`;
          return (
            t.didYouMean &&
              (a += ` Did you mean ${D.default.greenBright(
                `\`${t.didYouMean}\``
              )}?`),
            t.isIncludeScalar &&
              (a += `
Note, that ${D.default.bold(
                "include"
              )} statements only accept relation fields.`),
            a
          );
        }
        if (t.type === "invalidFieldType")
          return `Invalid value ${D.default.redBright(
            `${tn(t.providedValue)}`
          )} of type ${D.default.redBright(
            Wt(t.providedValue, void 0)
          )} for field ${D.default.bold(
            `${t.fieldName}`
          )} on model ${D.default.bold.white(
            t.modelName
          )}. Expected either ${D.default.greenBright(
            "true"
          )} or ${D.default.greenBright("false")}.`;
      }, "printFieldError");
      this.printArgError = u(({ error: t, path: r, id: n }, o, i) => {
        if (t.type === "invalidName") {
          let s = `Unknown arg ${D.default.redBright(
            `\`${t.providedName}\``
          )} in ${D.default.bold(r.join("."))} for type ${D.default.bold(
            t.outputType ? t.outputType.name : Ar(t.originalType)
          )}.`;
          return (
            t.didYouMeanField
              ? (s += `
\u2192 Did you forget to wrap it with \`${D.default.greenBright(
                  "select"
                )}\`? ${D.default.dim(
                  "e.g. " +
                    D.default.greenBright(
                      `{ select: { ${t.providedName}: ${t.providedValue} } }`
                    )
                )}`)
              : t.didYouMeanArg
              ? ((s += ` Did you mean \`${D.default.greenBright(
                  t.didYouMeanArg
                )}\`?`),
                !o &&
                  !i &&
                  (s +=
                    ` ${D.default.dim("Available args:")}
` + Kt(t.originalType, !0)))
              : t.originalType.fields.length === 0
              ? (s += ` The field ${D.default.bold(
                  t.originalType.name
                )} has no arguments.`)
              : !o &&
                !i &&
                (s +=
                  ` Available args:

` + Kt(t.originalType, !0)),
            s
          );
        }
        if (t.type === "invalidType") {
          let s = tn(t.providedValue, { indent: "  " }),
            a =
              s.split(`
`).length > 1;
          if (
            (a &&
              (s = `
${s}
`),
            t.requiredType.bestFittingType.location === "enumTypes")
          )
            return `Argument ${D.default.bold(
              t.argName
            )}: Provided value ${D.default.redBright(s)}${
              a ? "" : " "
            }of type ${D.default.redBright(
              Wt(t.providedValue)
            )} on ${D.default.bold(
              `prisma.${this.children[0].name}`
            )} is not a ${D.default.greenBright(
              Pr(
                Ht(t.requiredType.bestFittingType.type),
                t.requiredType.bestFittingType.isList
              )
            )}.
\u2192 Possible values: ${t.requiredType.bestFittingType.type.values
              .map((g) =>
                D.default.greenBright(
                  `${Ht(t.requiredType.bestFittingType.type)}.${g}`
                )
              )
              .join(", ")}`;
          let c = ".";
          pr(t.requiredType.bestFittingType.type) &&
            (c =
              `:
` + Kt(t.requiredType.bestFittingType.type));
          let l = `${t.requiredType.inputType
              .map((g) =>
                D.default.greenBright(
                  Pr(Ht(g.type), t.requiredType.bestFittingType.isList)
                )
              )
              .join(" or ")}${c}`,
            f =
              (t.requiredType.inputType.length === 2 &&
                t.requiredType.inputType.find((g) => pr(g.type))) ||
              null;
          return (
            f &&
              (l +=
                `
` + Kt(f.type, !0)),
            `Argument ${D.default.bold(
              t.argName
            )}: Got invalid value ${D.default.redBright(s)}${
              a ? "" : " "
            }on ${D.default.bold(
              `prisma.${this.children[0].name}`
            )}. Provided ${D.default.redBright(
              Wt(t.providedValue)
            )}, expected ${l}`
          );
        }
        if (t.type === "invalidNullArg") {
          let s =
              r.length === 1 && r[0] === t.name
                ? ""
                : ` for ${D.default.bold(`${r.join(".")}`)}`,
            a = ` Please use ${D.default.bold.greenBright(
              "undefined"
            )} instead.`;
          return `Argument ${D.default.greenBright(
            t.name
          )}${s} must not be ${D.default.bold("null")}.${a}`;
        }
        if (t.type === "missingArg") {
          let s =
            r.length === 1 && r[0] === t.missingName
              ? ""
              : ` for ${D.default.bold(`${r.join(".")}`)}`;
          return `Argument ${D.default.greenBright(
            t.missingName
          )}${s} is missing.`;
        }
        if (t.type === "atLeastOne") {
          let s = i
              ? ""
              : ` Available args are listed in ${D.default.dim.green(
                  "green"
                )}.`,
            a = t.atLeastFields
              ? ` and at least one argument for ${t.atLeastFields
                  .map((c) => D.default.bold(c))
                  .join(", or ")}`
              : "";
          return `Argument ${D.default.bold(
            r.join(".")
          )} of type ${D.default.bold(
            t.inputType.name
          )} needs ${D.default.greenBright(
            "at least one"
          )} argument${D.default.bold(a)}.${s}`;
        }
        if (t.type === "atMostOne") {
          let s = i
            ? ""
            : ` Please choose one. ${D.default.dim("Available args:")} 
${Kt(t.inputType, !0)}`;
          return `Argument ${D.default.bold(
            r.join(".")
          )} of type ${D.default.bold(
            t.inputType.name
          )} needs ${D.default.greenBright(
            "exactly one"
          )} argument, but you provided ${t.providedKeys
            .map((a) => D.default.redBright(a))
            .join(" and ")}.${s}`;
        }
      }, "printArgError");
      (this.type = t), (this.children = r);
    }
    get [Symbol.toStringTag]() {
      return "Document";
    }
    toString() {
      return `${this.type} {
${(0, Rt.default)(
  this.children.map(String).join(`
`),
  rn
)}
}`;
    }
    validate(t, r = !1, n, o, i) {
      var M;
      t || (t = {});
      let s = this.children.filter((P) => P.hasInvalidChild || P.hasInvalidArg);
      if (s.length === 0) return;
      let a = [],
        c = [],
        l = t && t.select ? "select" : t.include ? "include" : void 0;
      for (let P of s) {
        let S = P.collectErrors(l);
        a.push(
          ...S.fieldErrors.map((T) => ({
            ...T,
            path: r ? T.path : T.path.slice(1),
          }))
        ),
          c.push(
            ...S.argErrors.map((T) => ({
              ...T,
              path: r ? T.path : T.path.slice(1),
            }))
          );
      }
      let f = this.children[0].name,
        g = r ? this.type : f,
        y = [],
        b = [],
        x = [];
      for (let P of a) {
        let S = this.normalizePath(P.path, t).join(".");
        if (P.error.type === "invalidFieldName") {
          y.push(S);
          let T = P.error.outputType,
            { isInclude: O } = P.error;
          T.fields
            .filter((R) =>
              O ? R.outputType.location === "outputObjectTypes" : !0
            )
            .forEach((R) => {
              let F = S.split(".");
              x.push({
                path: `${F.slice(0, F.length - 1).join(".")}.${R.name}`,
                type: "true",
                isRequired: !1,
              });
            });
        } else
          P.error.type === "includeAndSelect"
            ? (y.push("select"), y.push("include"))
            : b.push(S);
        if (
          P.error.type === "emptySelect" ||
          P.error.type === "noTrueSelect" ||
          P.error.type === "emptyInclude"
        ) {
          let T = this.normalizePath(P.path, t),
            O = T.slice(0, T.length - 1).join(".");
          (M = P.error.field.outputType.type.fields) == null ||
            M.filter((F) =>
              P.error.type === "emptyInclude"
                ? F.outputType.location === "outputObjectTypes"
                : !0
            ).forEach((F) => {
              x.push({ path: `${O}.${F.name}`, type: "true", isRequired: !1 });
            });
        }
      }
      for (let P of c) {
        let S = this.normalizePath(P.path, t).join(".");
        if (P.error.type === "invalidName") y.push(S);
        else if (P.error.type !== "missingArg" && P.error.type !== "atLeastOne")
          b.push(S);
        else if (P.error.type === "missingArg") {
          let T =
            P.error.missingArg.inputTypes.length === 1
              ? P.error.missingArg.inputTypes[0].type
              : P.error.missingArg.inputTypes
                  .map((O) => {
                    let R = Ar(O.type);
                    return R === "Null" ? "null" : O.isList ? R + "[]" : R;
                  })
                  .join(" | ");
          x.push({
            path: S,
            type: Yo(T, !0, S.split("where.").length === 2),
            isRequired: P.error.missingArg.isRequired,
          });
        }
      }
      let h = u((P) => {
          let S = c.some(
              (V) =>
                V.error.type === "missingArg" && V.error.missingArg.isRequired
            ),
            T = Boolean(
              c.find(
                (V) =>
                  V.error.type === "missingArg" &&
                  !V.error.missingArg.isRequired
              )
            ),
            O = T || S,
            R = "";
          S &&
            (R += `
${D.default.dim("Note: Lines with ")}${D.default.reset.greenBright(
              "+"
            )} ${D.default.dim("are required")}`),
            T &&
              (R.length === 0 &&
                (R = `
`),
              S
                ? (R += D.default.dim(
                    `, lines with ${D.default.green("?")} are optional`
                  ))
                : (R += D.default.dim(
                    `Note: Lines with ${D.default.green("?")} are optional`
                  )),
              (R += D.default.dim(".")));
          let B = c
            .filter(
              (V) =>
                V.error.type !== "missingArg" || V.error.missingArg.isRequired
            )
            .map((V) => this.printArgError(V, O, o === "minimal")).join(`
`);
          if (
            ((B += `
${a.map((V) => this.printFieldError(V, x, o === "minimal")).join(`
`)}`),
            o === "minimal")
          )
            return (0, zi.default)(B);
          let W = {
            ast: r ? { [f]: t } : t,
            keyPaths: y,
            valuePaths: b,
            missingItems: x,
          };
          n != null && n.endsWith("aggregate") && (W = Gd(W));
          let te = fr({
            callsite: P,
            originalMethod: n || g,
            showColors: o && o === "pretty",
            callArguments: ho(W),
            message: `${B}${R}
`,
          });
          return w.env.NO_COLOR || o === "colorless" ? (0, zi.default)(te) : te;
        }, "renderErrorStr"),
        A = new we(h(i));
      throw (
        (w.env.NODE_ENV !== "production" &&
          Object.defineProperty(A, "render", { get: () => h, enumerable: !1 }),
        A)
      );
    }
    normalizePath(t, r) {
      let n = t.slice(),
        o = [],
        i,
        s = r;
      for (; (i = n.shift()) !== void 0; )
        (!Array.isArray(s) && i === 0) ||
          (i === "select"
            ? s[i]
              ? (s = s[i])
              : (s = s.include)
            : s && s[i] && (s = s[i]),
          o.push(i));
      return o;
    }
  };
u(bo, "Document");
var we = class extends Error {
  get [Symbol.toStringTag]() {
    return "PrismaClientValidationError";
  }
};
u(we, "PrismaClientValidationError");
var oe = class extends Error {
  constructor(t) {
    super(
      t +
        `
Read more at https://pris.ly/d/client-constructor`
    );
  }
  get [Symbol.toStringTag]() {
    return "PrismaClientConstructorValidationError";
  }
};
u(oe, "PrismaClientConstructorValidationError");
var me = class {
  constructor({ name: t, args: r, children: n, error: o, schemaField: i }) {
    (this.name = t),
      (this.args = r),
      (this.children = n),
      (this.error = o),
      (this.schemaField = i),
      (this.hasInvalidChild = n
        ? n.some((s) =>
            Boolean(s.error || s.hasInvalidArg || s.hasInvalidChild)
          )
        : !1),
      (this.hasInvalidArg = r ? r.hasInvalidArg : !1);
  }
  get [Symbol.toStringTag]() {
    return "Field";
  }
  toString() {
    let t = this.name;
    return this.error
      ? t + " # INVALID_FIELD"
      : (this.args &&
          this.args.args &&
          this.args.args.length > 0 &&
          (this.args.args.length === 1
            ? (t += `(${this.args.toString()})`)
            : (t += `(
${(0, Rt.default)(this.args.toString(), rn)}
)`)),
        this.children &&
          (t += ` {
${(0, Rt.default)(
  this.children.map(String).join(`
`),
  rn
)}
}`),
        t);
  }
  collectErrors(t = "select") {
    let r = [],
      n = [];
    if (
      (this.error && r.push({ path: [this.name], error: this.error }),
      this.children)
    )
      for (let o of this.children) {
        let i = o.collectErrors(t);
        r.push(
          ...i.fieldErrors.map((s) => ({
            ...s,
            path: [this.name, t, ...s.path],
          }))
        ),
          n.push(
            ...i.argErrors.map((s) => ({
              ...s,
              path: [this.name, t, ...s.path],
            }))
          );
      }
    return (
      this.args &&
        n.push(
          ...this.args
            .collectErrors()
            .map((o) => ({ ...o, path: [this.name, ...o.path] }))
        ),
      { fieldErrors: r, argErrors: n }
    );
  }
};
u(me, "Field");
var de = class {
  constructor(t = []) {
    (this.args = t),
      (this.hasInvalidArg = t ? t.some((r) => Boolean(r.hasError)) : !1);
  }
  get [Symbol.toStringTag]() {
    return "Args";
  }
  toString() {
    return this.args.length === 0
      ? ""
      : `${this.args.map((t) => t.toString()).filter((t) => t).join(`
`)}`;
  }
  collectErrors() {
    return this.hasInvalidArg
      ? this.args.flatMap((t) => t.collectErrors())
      : [];
  }
};
u(de, "Args");
function Gi(e, t) {
  return v.Buffer.isBuffer(e)
    ? JSON.stringify(e.toString("base64"))
    : e instanceof Oe
    ? `{ _ref: ${JSON.stringify(e.name)}}`
    : Object.prototype.toString.call(e) === "[object BigInt]"
    ? e.toString()
    : typeof (t == null ? void 0 : t.type) == "string" && t.type === "Json"
    ? e === null
      ? "null"
      : e && e.values && e.__prismaRawParameters__
      ? JSON.stringify(e.values)
      : (t == null ? void 0 : t.isList) && Array.isArray(e)
      ? JSON.stringify(e.map((r) => JSON.stringify(r)))
      : JSON.stringify(JSON.stringify(e))
    : e === void 0
    ? null
    : e === null
    ? "null"
    : Ge.isDecimal(e) || ((t == null ? void 0 : t.type) === "Decimal" && $n(e))
    ? Aa(e)
    : (t == null ? void 0 : t.location) === "enumTypes" && typeof e == "string"
    ? Array.isArray(e)
      ? `[${e.join(", ")}]`
      : e
    : typeof e == "number" && (t == null ? void 0 : t.type) === "Float"
    ? e.toExponential()
    : JSON.stringify(e, null, 2);
}
u(Gi, "stringify");
var Re = class {
  constructor({
    key: t,
    value: r,
    isEnum: n = !1,
    error: o,
    schemaArg: i,
    inputType: s,
  }) {
    (this.inputType = s),
      (this.key = t),
      (this.value = r instanceof Te ? r._getName() : r),
      (this.isEnum = n),
      (this.error = o),
      (this.schemaArg = i),
      (this.isNullable =
        (i == null
          ? void 0
          : i.inputTypes.reduce((a) => a && i.isNullable, !0)) || !1),
      (this.hasError =
        Boolean(o) ||
        (r instanceof de ? r.hasInvalidArg : !1) ||
        (Array.isArray(r) &&
          r.some((a) => (a instanceof de ? a.hasInvalidArg : !1))));
  }
  get [Symbol.toStringTag]() {
    return "Arg";
  }
  _toString(t, r) {
    var n;
    if (typeof t != "undefined") {
      if (t instanceof de)
        return `${r}: {
${(0, Rt.default)(t.toString(), 2)}
}`;
      if (Array.isArray(t)) {
        if (((n = this.inputType) == null ? void 0 : n.type) === "Json")
          return `${r}: ${Gi(t, this.inputType)}`;
        let o = !t.some((i) => typeof i == "object");
        return `${r}: [${
          o
            ? ""
            : `
`
        }${(0, Rt.default)(
          t
            .map((i) =>
              i instanceof de
                ? `{
${(0, Rt.default)(i.toString(), rn)}
}`
                : Gi(i, this.inputType)
            )
            .join(
              `,${
                o
                  ? " "
                  : `
`
              }`
            ),
          o ? 0 : rn
        )}${
          o
            ? ""
            : `
`
        }]`;
      }
      return `${r}: ${Gi(t, this.inputType)}`;
    }
  }
  toString() {
    return this._toString(this.value, this.key);
  }
  collectErrors() {
    var r;
    if (!this.hasError) return [];
    let t = [];
    if (this.error) {
      let n =
        typeof ((r = this.inputType) == null ? void 0 : r.type) == "object"
          ? `${this.inputType.type.name}${this.inputType.isList ? "[]" : ""}`
          : void 0;
      t.push({ error: this.error, path: [this.key], id: n });
    }
    return Array.isArray(this.value)
      ? t.concat(
          this.value.flatMap((n, o) =>
            n != null && n.collectErrors
              ? n
                  .collectErrors()
                  .map((i) => ({ ...i, path: [this.key, o, ...i.path] }))
              : []
          )
        )
      : this.value instanceof de
      ? t.concat(
          this.value
            .collectErrors()
            .map((n) => ({ ...n, path: [this.key, ...n.path] }))
        )
      : t;
  }
};
u(Re, "Arg");
function Qi({
  dmmf: e,
  rootTypeName: t,
  rootField: r,
  select: n,
  modelName: o,
}) {
  n || (n = {});
  let i = t === "query" ? e.queryType : e.mutationType,
    s = {
      args: [],
      outputType: { isList: !1, type: i, location: "outputObjectTypes" },
      name: t,
    },
    a = { modelName: o },
    c = Rc(e, { [r]: n }, s, [t], a);
  return new bo(t, c);
}
u(Qi, "makeDocument");
function Ic(e) {
  return e;
}
u(Ic, "transformDocument");
function Rc(e, t, r, n, o) {
  let i = r.outputType.type;
  return Object.entries(t).reduce((s, [a, c]) => {
    let l = i.fieldMap ? i.fieldMap[a] : i.fields.find((M) => M.name === a);
    if (!l)
      return (
        s.push(
          new me({
            name: a,
            children: [],
            error: {
              type: "invalidFieldName",
              modelName: i.name,
              providedName: a,
              didYouMean: Ln(
                a,
                i.fields.map((M) => M.name)
              ),
              outputType: i,
            },
          })
        ),
        s
      );
    if (
      l.outputType.location === "scalar" &&
      l.args.length === 0 &&
      typeof c != "boolean"
    )
      return (
        s.push(
          new me({
            name: a,
            children: [],
            error: {
              type: "invalidFieldType",
              modelName: i.name,
              fieldName: a,
              providedValue: c,
            },
          })
        ),
        s
      );
    if (c === !1) return s;
    let f = {
        name: l.name,
        fields: l.args,
        constraints: { minNumFields: null, maxNumFields: null },
      },
      g = typeof c == "object" ? Tc(c, ["include", "select"]) : void 0,
      y = g
        ? xo(g, f, o, [], typeof l == "string" ? void 0 : l.outputType.type)
        : void 0,
      b = l.outputType.location === "outputObjectTypes";
    if (c) {
      if (c.select && c.include)
        s.push(
          new me({
            name: a,
            children: [
              new me({
                name: "include",
                args: new de(),
                error: { type: "includeAndSelect", field: l },
              }),
            ],
          })
        );
      else if (c.include) {
        let M = Object.keys(c.include);
        if (M.length === 0)
          return (
            s.push(
              new me({
                name: a,
                children: [
                  new me({
                    name: "include",
                    args: new de(),
                    error: { type: "emptyInclude", field: l },
                  }),
                ],
              })
            ),
            s
          );
        if (l.outputType.location === "outputObjectTypes") {
          let P = l.outputType.type,
            S = P.fields
              .filter((O) => O.outputType.location === "outputObjectTypes")
              .map((O) => O.name),
            T = M.filter((O) => !S.includes(O));
          if (T.length > 0)
            return (
              s.push(
                ...T.map(
                  (O) =>
                    new me({
                      name: O,
                      children: [
                        new me({
                          name: O,
                          args: new de(),
                          error: {
                            type: "invalidFieldName",
                            modelName: P.name,
                            outputType: P,
                            providedName: O,
                            didYouMean: Ln(O, S) || void 0,
                            isInclude: !0,
                            isIncludeScalar: P.fields.some((R) => R.name === O),
                          },
                        }),
                      ],
                    })
                )
              ),
              s
            );
        }
      } else if (c.select) {
        let M = Object.values(c.select);
        if (M.length === 0)
          return (
            s.push(
              new me({
                name: a,
                children: [
                  new me({
                    name: "select",
                    args: new de(),
                    error: { type: "emptySelect", field: l },
                  }),
                ],
              })
            ),
            s
          );
        if (M.filter((S) => S).length === 0)
          return (
            s.push(
              new me({
                name: a,
                children: [
                  new me({
                    name: "select",
                    args: new de(),
                    error: { type: "noTrueSelect", field: l },
                  }),
                ],
              })
            ),
            s
          );
      }
    }
    let x = b ? jd(e, l.outputType.type) : null,
      h = x;
    c &&
      (c.select
        ? (h = c.select)
        : c.include
        ? (h = en(x, c.include))
        : c.by &&
          Array.isArray(c.by) &&
          l.outputType.namespace === "prisma" &&
          l.outputType.location === "outputObjectTypes" &&
          Sa(l.outputType.type.name) &&
          (h = kd(c.by)));
    let A = h !== !1 && b ? Rc(e, h, l, [...n, a], o) : void 0;
    return s.push(new me({ name: a, args: y, children: A, schemaField: l })), s;
  }, []);
}
u(Rc, "selectionToFields");
function kd(e) {
  let t = Object.create(null);
  for (let r of e) t[r] = !0;
  return t;
}
u(kd, "byToSelect");
function jd(e, t) {
  let r = Object.create(null);
  for (let n of t.fields)
    e.typeMap[n.outputType.type.name] !== void 0 && (r[n.name] = !0),
      (n.outputType.location === "scalar" ||
        n.outputType.location === "enumTypes") &&
        (r[n.name] = !0);
  return r;
}
u(jd, "getDefaultSelection");
function Hi(e, t, r, n) {
  return new Re({
    key: e,
    value: t,
    isEnum: n.location === "enumTypes",
    inputType: n,
    error: {
      type: "invalidType",
      providedValue: t,
      argName: e,
      requiredType: { inputType: r.inputTypes, bestFittingType: n },
    },
  });
}
u(Hi, "getInvalidTypeArg");
function Fc(e, t, r) {
  let { isList: n } = t,
    o = $d(t, r),
    i = Wt(e, t);
  return i === o ||
    (n && i === "List<>") ||
    (o === "Json" &&
      i !== "Symbol" &&
      !(e instanceof Te) &&
      !(e instanceof Oe)) ||
    (i === "Int" && o === "BigInt") ||
    ((i === "Int" || i === "Float") && o === "Decimal") ||
    (i === "DateTime" && o === "String") ||
    (i === "UUID" && o === "String") ||
    (i === "String" && o === "ID") ||
    (i === "Int" && o === "Float") ||
    (i === "Int" && o === "Long") ||
    (i === "String" && o === "Decimal" && Ld(e)) ||
    e === null
    ? !0
    : t.isList && Array.isArray(e)
    ? e.every((s) => Fc(s, { ...t, isList: !1 }, r))
    : !1;
}
u(Fc, "hasCorrectScalarType");
function $d(e, t, r = e.isList) {
  let n = Ht(e.type);
  return (
    e.location === "fieldRefTypes" && t.modelName && (n += `<${t.modelName}>`),
    Pr(n, r)
  );
}
u($d, "getExpectedType");
var wo = u((e) => vc(e, (t, r) => r !== void 0), "cleanObject");
function Ld(e) {
  return /^\-?(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i.test(e);
}
u(Ld, "isDecimalString");
function Bd(e, t, r, n) {
  let o = null,
    i = [];
  for (let s of r.inputTypes) {
    if (
      ((o = Ud(e, t, r, s, n)),
      (o == null ? void 0 : o.collectErrors().length) === 0)
    )
      return o;
    if (o && (o == null ? void 0 : o.collectErrors())) {
      let a = o == null ? void 0 : o.collectErrors();
      a && a.length > 0 && i.push({ arg: o, errors: a });
    }
  }
  if ((o == null ? void 0 : o.hasError) && i.length > 0) {
    let s = i.map(({ arg: a, errors: c }) => {
      let l = c.map((f) => {
        let g = 1;
        return (
          f.error.type === "invalidType" &&
            (g = 2 * Math.exp(Dc(f.error.providedValue)) + 1),
          (g += Math.log(f.path.length)),
          f.error.type === "missingArg" &&
            a.inputType &&
            pr(a.inputType.type) &&
            a.inputType.type.name.includes("Unchecked") &&
            (g *= 2),
          f.error.type === "invalidName" &&
            pr(f.error.originalType) &&
            f.error.originalType.name.includes("Unchecked") &&
            (g *= 2),
          g
        );
      });
      return { score: c.length + qd(l), arg: a, errors: c };
    });
    return s.sort((a, c) => (a.score < c.score ? -1 : 1)), s[0].arg;
  }
  return o;
}
u(Bd, "valueToArg");
function Dc(e) {
  let t = 1;
  if (!e || typeof e != "object") return t;
  for (let r in e)
    if (
      !!Object.prototype.hasOwnProperty.call(e, r) &&
      typeof e[r] == "object"
    ) {
      let n = Dc(e[r]) + 1;
      t = Math.max(n, t);
    }
  return t;
}
u(Dc, "getDepth");
function qd(e) {
  return e.reduce((t, r) => t + r, 0);
}
u(qd, "sum");
function Ud(e, t, r, n, o) {
  var f, g, y, b, x;
  if (typeof t == "undefined")
    return r.isRequired
      ? new Re({
          key: e,
          value: t,
          isEnum: n.location === "enumTypes",
          inputType: n,
          error: {
            type: "missingArg",
            missingName: e,
            missingArg: r,
            atLeastOne: !1,
            atMostOne: !1,
          },
        })
      : null;
  let { isNullable: i, isRequired: s } = r;
  if (
    t === null &&
    !i &&
    !s &&
    !(pr(n.type)
      ? n.type.constraints.minNumFields !== null &&
        n.type.constraints.minNumFields > 0
      : !1)
  )
    return new Re({
      key: e,
      value: t,
      isEnum: n.location === "enumTypes",
      inputType: n,
      error: {
        type: "invalidNullArg",
        name: e,
        invalidType: r.inputTypes,
        atLeastOne: !1,
        atMostOne: !1,
      },
    });
  if (!n.isList)
    if (pr(n.type)) {
      if (
        typeof t != "object" ||
        Array.isArray(t) ||
        (n.location === "inputObjectTypes" && !Ec(t))
      )
        return Hi(e, t, r, n);
      {
        let h = wo(t),
          A,
          M = Object.keys(h || {}),
          P = M.length;
        return (
          (P === 0 &&
            typeof n.type.constraints.minNumFields == "number" &&
            n.type.constraints.minNumFields > 0) ||
          ((f = n.type.constraints.fields) == null
            ? void 0
            : f.some((S) => M.includes(S))) === !1
            ? (A = {
                type: "atLeastOne",
                key: e,
                inputType: n.type,
                atLeastFields: n.type.constraints.fields,
              })
            : P > 1 &&
              typeof n.type.constraints.maxNumFields == "number" &&
              n.type.constraints.maxNumFields < 2 &&
              (A = {
                type: "atMostOne",
                key: e,
                inputType: n.type,
                providedKeys: M,
              }),
          new Re({
            key: e,
            value: h === null ? null : xo(h, n.type, o, r.inputTypes),
            isEnum: n.location === "enumTypes",
            error: A,
            inputType: n,
            schemaArg: r,
          })
        );
      }
    } else return Cc(e, t, r, n, o);
  if (
    (!Array.isArray(t) && n.isList && e !== "updateMany" && (t = [t]),
    n.location === "enumTypes" || n.location === "scalar")
  )
    return Cc(e, t, r, n, o);
  let a = n.type,
    l = (
      typeof ((g = a.constraints) == null ? void 0 : g.minNumFields) ==
        "number" && ((y = a.constraints) == null ? void 0 : y.minNumFields) > 0
        ? Array.isArray(t) &&
          t.some((h) => !h || Object.keys(wo(h)).length === 0)
        : !1
    )
      ? { inputType: a, key: e, type: "atLeastOne" }
      : void 0;
  if (!l) {
    let h =
      typeof ((b = a.constraints) == null ? void 0 : b.maxNumFields) ==
        "number" && ((x = a.constraints) == null ? void 0 : x.maxNumFields) < 2
        ? Array.isArray(t) &&
          t.find((A) => !A || Object.keys(wo(A)).length !== 1)
        : !1;
    h &&
      (l = {
        inputType: a,
        key: e,
        type: "atMostOne",
        providedKeys: Object.keys(h),
      });
  }
  if (!Array.isArray(t))
    for (let h of r.inputTypes) {
      let A = xo(t, h.type, o);
      if (A.collectErrors().length === 0)
        return new Re({
          key: e,
          value: A,
          isEnum: !1,
          schemaArg: r,
          inputType: h,
        });
    }
  return new Re({
    key: e,
    value: t.map((h) =>
      n.isList && typeof h != "object"
        ? h
        : typeof h != "object" || !t
        ? Hi(e, h, r, n)
        : xo(h, a, o)
    ),
    isEnum: !1,
    inputType: n,
    schemaArg: r,
    error: l,
  });
}
u(Ud, "tryInferArgs");
function pr(e) {
  return !(typeof e == "string" || Object.hasOwnProperty.call(e, "values"));
}
u(pr, "isInputArgType");
function Cc(e, t, r, n, o) {
  return Fc(t, n, o)
    ? new Re({
        key: e,
        value: t,
        isEnum: n.location === "enumTypes",
        schemaArg: r,
        inputType: n,
      })
    : Hi(e, t, r, n);
}
u(Cc, "scalarToArg");
function xo(e, t, r, n, o) {
  var y;
  (y = t.meta) != null && y.source && (r = { modelName: t.meta.source });
  let i = wo(e),
    { fields: s, fieldMap: a } = t,
    c = s.map((b) => [b.name, void 0]),
    l = Object.entries(i || {}),
    g = Ma(l, c, (b) => b[0]).reduce((b, [x, h]) => {
      let A = a ? a[x] : s.find((P) => P.name === x);
      if (!A) {
        let P =
          typeof h == "boolean" && o && o.fields.some((S) => S.name === x)
            ? x
            : null;
        return (
          b.push(
            new Re({
              key: x,
              value: h,
              error: {
                type: "invalidName",
                providedName: x,
                providedValue: h,
                didYouMeanField: P,
                didYouMeanArg:
                  (!P && Ln(x, [...s.map((S) => S.name), "select"])) || void 0,
                originalType: t,
                possibilities: n,
                outputType: o,
              },
            })
          ),
          b
        );
      }
      let M = Bd(x, h, A, r);
      return M && b.push(M), b;
    }, []);
  if (
    (typeof t.constraints.minNumFields == "number" &&
      l.length < t.constraints.minNumFields) ||
    g.find((b) => {
      var x, h;
      return (
        ((x = b.error) == null ? void 0 : x.type) === "missingArg" ||
        ((h = b.error) == null ? void 0 : h.type) === "atLeastOne"
      );
    })
  ) {
    let b = t.fields.filter(
      (x) =>
        !x.isRequired &&
        i &&
        (typeof i[x.name] == "undefined" || i[x.name] === null)
    );
    g.push(
      ...b.map((x) => {
        let h = x.inputTypes[0];
        return new Re({
          key: x.name,
          value: void 0,
          isEnum: h.location === "enumTypes",
          error: {
            type: "missingArg",
            missingName: x.name,
            missingArg: x,
            atLeastOne: Boolean(t.constraints.minNumFields) || !1,
            atMostOne: t.constraints.maxNumFields === 1 || !1,
          },
          inputType: h,
        });
      })
    );
  }
  return new de(g);
}
u(xo, "objectToArgs");
function Yi({ document: e, path: t, data: r }) {
  let n = Bi(r, t);
  if (n === "undefined") return null;
  if (typeof n != "object") return n;
  let o = Vd(e, t);
  return Wi({ field: o, data: n });
}
u(Yi, "unpack");
function Wi({ field: e, data: t }) {
  var n;
  if (!t || typeof t != "object" || !e.children || !e.schemaField) return t;
  let r = {
    DateTime: (o) => new Date(o),
    Json: (o) => JSON.parse(o),
    Bytes: (o) => v.Buffer.from(o, "base64"),
    Decimal: (o) => new Ge(o),
    BigInt: (o) => BigInt(o),
  };
  for (let o of e.children) {
    let i = (n = o.schemaField) == null ? void 0 : n.outputType.type;
    if (i && typeof i == "string") {
      let s = r[i];
      if (s)
        if (Array.isArray(t))
          for (let a of t)
            typeof a[o.name] != "undefined" &&
              a[o.name] !== null &&
              (Array.isArray(a[o.name])
                ? (a[o.name] = a[o.name].map(s))
                : (a[o.name] = s(a[o.name])));
        else
          typeof t[o.name] != "undefined" &&
            t[o.name] !== null &&
            (Array.isArray(t[o.name])
              ? (t[o.name] = t[o.name].map(s))
              : (t[o.name] = s(t[o.name])));
    }
    if (
      o.schemaField &&
      o.schemaField.outputType.location === "outputObjectTypes"
    )
      if (Array.isArray(t)) for (let s of t) Wi({ field: o, data: s[o.name] });
      else Wi({ field: o, data: t[o.name] });
  }
  return t;
}
u(Wi, "mapScalars");
function Vd(e, t) {
  let r = t.slice(),
    n = r.shift(),
    o = e.children.find((i) => i.name === n);
  if (!o) throw new Error(`Could not find field ${n} in document ${e}`);
  for (; r.length > 0; ) {
    let i = r.shift();
    if (!o.children)
      throw new Error(`Can't get children for field ${o} with child ${i}`);
    let s = o.children.find((a) => a.name === i);
    if (!s) throw new Error(`Can't find child ${i} of field ${o}`);
    o = s;
  }
  return o;
}
u(Vd, "getField");
function Ji(e) {
  return e
    .split(".")
    .filter((t) => t !== "select")
    .join(".");
}
u(Ji, "removeSelectFromPath");
function Ki(e) {
  if (Object.prototype.toString.call(e) === "[object Object]") {
    let r = {};
    for (let n in e)
      if (n === "select") for (let o in e.select) r[o] = Ki(e.select[o]);
      else r[n] = Ki(e[n]);
    return r;
  }
  return e;
}
u(Ki, "removeSelectFromObject");
function Gd({ ast: e, keyPaths: t, missingItems: r, valuePaths: n }) {
  let o = t.map(Ji),
    i = n.map(Ji),
    s = r.map((c) => ({
      path: Ji(c.path),
      isRequired: c.isRequired,
      type: c.type,
    }));
  return { ast: Ki(e), keyPaths: o, missingItems: s, valuePaths: i };
}
u(Gd, "transformAggregatePrintJsonArgs");
d();
p();
m();
d();
p();
m();
d();
p();
m();
function mr(e) {
  return {
    getKeys() {
      return Object.keys(e);
    },
    getPropertyValue(t) {
      return e[t];
    },
  };
}
u(mr, "addObjectProperties");
d();
p();
m();
function nn(e, t) {
  return {
    getKeys() {
      return [e];
    },
    getPropertyValue() {
      return t();
    },
  };
}
u(nn, "addProperty");
d();
p();
m();
d();
p();
m();
var on = class {
  constructor() {
    this._map = new Map();
  }
  get(t) {
    var r;
    return (r = this._map.get(t)) == null ? void 0 : r.value;
  }
  set(t, r) {
    this._map.set(t, { value: r });
  }
  getOrCreate(t, r) {
    let n = this._map.get(t);
    if (n) return n.value;
    let o = r();
    return this.set(t, o), o;
  }
};
u(on, "Cache");
function sn(e) {
  let t = new on();
  return {
    getKeys() {
      return e.getKeys();
    },
    getPropertyValue(r) {
      return t.getOrCreate(r, () => e.getPropertyValue(r));
    },
    getPropertyDescriptor(r) {
      var n;
      return (n = e.getPropertyDescriptor) == null ? void 0 : n.call(e, r);
    },
  };
}
u(sn, "cacheProperties");
d();
p();
m();
d();
p();
m();
var vo = { enumerable: !0, configurable: !0, writable: !0 };
function dr(e) {
  let t = new Set(e);
  return {
    getOwnPropertyDescriptor: () => vo,
    has: (r, n) => t.has(n),
    set: (r, n, o) => t.add(n) && Reflect.set(r, n, o),
    ownKeys: () => [...t],
  };
}
u(dr, "defaultProxyHandlers");
function an(e, t) {
  let r = Jd(t),
    n = zd(e, Array.from(r.keys())),
    o = new Set(),
    i = dr(n);
  return new Proxy(e, {
    ...i,
    get(s, a) {
      if (o.has(a)) return s[a];
      let c = r.get(a);
      return c ? c.getPropertyValue(a) : s[a];
    },
    set(s, a, c) {
      var f, g;
      let l = r.get(a);
      return ((g =
        (f = l == null ? void 0 : l.getPropertyDescriptor) == null
          ? void 0
          : f.call(l, a)) == null
        ? void 0
        : g.writable) === !1
        ? !1
        : (o.add(a), i.set(s, a, c));
    },
    getOwnPropertyDescriptor(s, a) {
      let c = r.get(a);
      return c && c.getPropertyDescriptor
        ? { ...vo, ...c.getPropertyDescriptor(a) }
        : vo;
    },
  });
}
u(an, "createCompositeProxy");
function Jd(e) {
  let t = new Map();
  for (let r of e) {
    let n = r.getKeys();
    for (let o of n) t.set(o, r);
  }
  return t;
}
u(Jd, "mapKeysToLayers");
function zd(e, t) {
  return [...new Set([...Object.keys(e), ...t])];
}
u(zd, "getOwnKeys");
d();
p();
m();
d();
p();
m();
d();
p();
m();
var un = "<unknown>";
function Nc(e) {
  var t = e.split(`
`);
  return t.reduce(function (r, n) {
    var o = Kd(n) || Yd(n) || eg(n) || og(n) || rg(n);
    return o && r.push(o), r;
  }, []);
}
u(Nc, "parse");
var Hd =
    /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i,
  Wd = /\((\S*)(?::(\d+))(?::(\d+))\)/;
function Kd(e) {
  var t = Hd.exec(e);
  if (!t) return null;
  var r = t[2] && t[2].indexOf("native") === 0,
    n = t[2] && t[2].indexOf("eval") === 0,
    o = Wd.exec(t[2]);
  return (
    n && o != null && ((t[2] = o[1]), (t[3] = o[2]), (t[4] = o[3])),
    {
      file: r ? null : t[2],
      methodName: t[1] || un,
      arguments: r ? [t[2]] : [],
      lineNumber: t[3] ? +t[3] : null,
      column: t[4] ? +t[4] : null,
    }
  );
}
u(Kd, "parseChrome");
var Qd =
  /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function Yd(e) {
  var t = Qd.exec(e);
  return t
    ? {
        file: t[2],
        methodName: t[1] || un,
        arguments: [],
        lineNumber: +t[3],
        column: t[4] ? +t[4] : null,
      }
    : null;
}
u(Yd, "parseWinjs");
var Zd =
    /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i,
  Xd = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
function eg(e) {
  var t = Zd.exec(e);
  if (!t) return null;
  var r = t[3] && t[3].indexOf(" > eval") > -1,
    n = Xd.exec(t[3]);
  return (
    r && n != null && ((t[3] = n[1]), (t[4] = n[2]), (t[5] = null)),
    {
      file: t[3],
      methodName: t[1] || un,
      arguments: t[2] ? t[2].split(",") : [],
      lineNumber: t[4] ? +t[4] : null,
      column: t[5] ? +t[5] : null,
    }
  );
}
u(eg, "parseGecko");
var tg = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
function rg(e) {
  var t = tg.exec(e);
  return t
    ? {
        file: t[3],
        methodName: t[1] || un,
        arguments: [],
        lineNumber: +t[4],
        column: t[5] ? +t[5] : null,
      }
    : null;
}
u(rg, "parseJSC");
var ng =
  /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
function og(e) {
  var t = ng.exec(e);
  return t
    ? {
        file: t[2],
        methodName: t[1] || un,
        arguments: [],
        lineNumber: +t[3],
        column: t[4] ? +t[4] : null,
      }
    : null;
}
u(og, "parseNode");
var Eo = class {
  getLocation() {
    return null;
  }
};
u(Eo, "DisabledCallSite");
var To = class {
  constructor() {
    this._error = new Error();
  }
  getLocation() {
    let t = this._error.stack;
    if (!t) return null;
    let n = Nc(t).find(
      (o) =>
        o.file &&
        o.file !== "<anonymous>" &&
        !o.file.includes("@prisma") &&
        !o.file.includes("getPrismaClient") &&
        !o.file.startsWith("internal/") &&
        !o.methodName.includes("new ") &&
        !o.methodName.includes("getCallSite") &&
        !o.methodName.includes("Proxy.") &&
        o.methodName.split(".").length < 4
    );
    return !n || !n.file
      ? null
      : { fileName: n.file, lineNumber: n.lineNumber, columnNumber: n.column };
  }
};
u(To, "EnabledCallSite");
function Xe(e) {
  return e === "minimal" ? new Eo() : new To();
}
u(Xe, "getCallSite");
d();
p();
m();
function xt(e) {
  let t,
    r = u((n, o, i = !0) => {
      try {
        return i === !0 ? (t != null ? t : (t = e(n, o))) : e(n, o);
      } catch (s) {
        return Promise.reject(s);
      }
    }, "_callback");
  return {
    then(n, o, i) {
      return r(Zi(i), void 0).then(n, o, i);
    },
    catch(n, o) {
      return r(Zi(o), void 0).catch(n, o);
    },
    finally(n, o) {
      return r(Zi(o), void 0).finally(n, o);
    },
    requestTransaction(n, o) {
      let i = { kind: "batch", ...n },
        s = r(i, o, !1);
      return s.requestTransaction ? s.requestTransaction(i, o) : s;
    },
    [Symbol.toStringTag]: "PrismaPromise",
  };
}
u(xt, "createPrismaPromise");
function Zi(e) {
  if (e) return { kind: "itx", ...e };
}
u(Zi, "createItx");
d();
p();
m();
d();
p();
m();
d();
p();
m();
var kc = { _avg: !0, _count: !0, _sum: !0, _min: !0, _max: !0 };
function Xi(e) {
  let t = sg(e);
  return Object.entries(t).reduce(
    (n, [o, i]) => (
      kc[o] !== void 0 ? (n.select[o] = { select: i }) : (n[o] = i), n
    ),
    { select: {} }
  );
}
u(Xi, "desugarUserArgs");
function sg(e) {
  return typeof e._count == "boolean"
    ? { ...e, _count: { _all: e._count } }
    : e;
}
u(sg, "desugarCountInUserArgs");
function ag(e) {
  return (t) => (typeof e._count == "boolean" && (t._count = t._count._all), t);
}
u(ag, "createUnpacker");
function cn(e, t, r) {
  let n = Xi(t != null ? t : {}),
    o = ag(t != null ? t : {});
  return r({ action: "aggregate", unpacker: o })(n);
}
u(cn, "aggregate");
d();
p();
m();
function jc(e, t, r) {
  let { select: n, ...o } = t != null ? t : {};
  return typeof n == "object"
    ? cn(e, { ...o, _count: n }, (i) =>
        r({
          ...i,
          action: "count",
          unpacker: (s) => {
            var a;
            return (a = i.unpacker) == null ? void 0 : a.call(i, s)._count;
          },
        })
      )
    : cn(e, { ...o, _count: { _all: !0 } }, (i) =>
        r({
          ...i,
          action: "count",
          unpacker: (s) => {
            var a;
            return (a = i.unpacker) == null ? void 0 : a.call(i, s)._count._all;
          },
        })
      );
}
u(jc, "count");
d();
p();
m();
function ug(e) {
  let t = Xi(e);
  if (Array.isArray(e.by))
    for (let r of e.by) typeof r == "string" && (t.select[r] = !0);
  return t;
}
u(ug, "desugarUserArgs");
function cg(e) {
  return (t) => (
    typeof e._count == "boolean" &&
      t.forEach((r) => {
        r._count = r._count._all;
      }),
    t
  );
}
u(cg, "createUnpacker");
function $c(e, t, r) {
  let n = ug(t != null ? t : {}),
    o = cg(t != null ? t : {});
  return r({ action: "groupBy", unpacker: o })(n);
}
u($c, "groupBy");
function Lc(e, t, r) {
  if (t === "aggregate") return (n) => cn(e, n, r);
  if (t === "count") return (n) => jc(e, n, r);
  if (t === "groupBy") return (n) => $c(e, n, r);
}
u(Lc, "applyAggregates");
d();
p();
m();
d();
p();
m();
var et = class extends Error {
  constructor(t) {
    super(t), (this.name = "NotFoundError");
  }
};
u(et, "NotFoundError");
function es(e, t, r, n) {
  let o;
  if (
    r &&
    typeof r == "object" &&
    "rejectOnNotFound" in r &&
    r.rejectOnNotFound !== void 0
  )
    (o = r.rejectOnNotFound), delete r.rejectOnNotFound;
  else if (typeof n == "boolean") o = n;
  else if (n && typeof n == "object" && e in n) {
    let i = n[e];
    if (i && typeof i == "object") return t in i ? i[t] : void 0;
    o = es(e, t, r, i);
  } else typeof n == "function" ? (o = n) : (o = !1);
  return o;
}
u(es, "getRejectOnNotFound");
var lg = /(findUnique|findFirst)/;
function Bc(e, t, r, n) {
  if (n && !e && lg.exec(t))
    throw typeof n == "boolean" && n
      ? new et(`No ${r} found`)
      : typeof n == "function"
      ? n(new et(`No ${r} found`))
      : Yr(n)
      ? n
      : new et(`No ${r} found`);
}
u(Bc, "throwIfNotFound");
function qc(e, t, r) {
  if (e === "findFirstOrThrow" || e === "findUniqueOrThrow") return fg(t, r);
  Fi(e, "Unknown wrapper name");
}
u(qc, "wrapRequest");
function fg(e, t) {
  return async (r) => {
    if ("rejectOnNotFound" in r.args) {
      let o = fr({
        originalMethod: r.clientMethod,
        callsite: r.callsite,
        message: "'rejectOnNotFound' option is not supported",
      });
      throw new we(o);
    }
    let n = await t(r);
    if (n == null) throw new et(`No ${e} found`);
    return n;
  };
}
u(fg, "applyOrThrowWrapper");
d();
p();
m();
function Uc(e) {
  let t = e.fields.filter((n) => !n.relationName),
    r = Ni(t, (n) => n.name);
  return new Proxy(
    {},
    {
      get(n, o) {
        if (o in n || typeof o == "symbol") return n[o];
        let i = r[o];
        if (i) return new Oe(e.name, o, i.type, i.isList);
      },
      ...dr(Object.keys(r)),
    }
  );
}
u(Uc, "applyFieldsProxy");
d();
p();
m();
function pg(e, t) {
  return e === void 0 || t === void 0 ? [] : [...t, "select", e];
}
u(pg, "getNextDataPath");
function mg(e, t, r) {
  return t === void 0 ? (e != null ? e : {}) : yo(t, r, e || !0);
}
u(mg, "getNextUserArgs");
function ts(e, t, r, n, o, i) {
  let a = e._baseDmmf.modelMap[t].fields.reduce(
    (c, l) => ({ ...c, [l.name]: l }),
    {}
  );
  return (c) => {
    let l = Xe(e._errorFormat),
      f = pg(n, o),
      g = mg(c, i, f),
      y = r({ dataPath: f, callsite: l })(g),
      b = dg(e, t);
    return new Proxy(y, {
      get(x, h) {
        if (!b.includes(h)) return x[h];
        let M = [a[h].type, r, h],
          P = [f, g];
        return ts(e, ...M, ...P);
      },
      ...dr([...b, ...Object.getOwnPropertyNames(y)]),
    });
  };
}
u(ts, "applyFluent");
function dg(e, t) {
  return e._baseDmmf.modelMap[t].fields
    .filter((r) => r.kind === "object")
    .map((r) => r.name);
}
u(dg, "getOwnKeys");
d();
p();
m();
function ln(e) {
  return e.replace(/^./, (t) => t.toLowerCase());
}
u(ln, "dmmfToJSModelName");
var gg = ["findUnique", "findFirst", "create", "update", "upsert", "delete"],
  yg = ["aggregate", "count", "groupBy"];
function rs(e, t) {
  var o;
  let r = [hg(e, t)];
  (o = e._engineConfig.previewFeatures) != null &&
    o.includes("fieldReference") &&
    r.push(xg(e, t));
  let n = ln(t);
  for (let { model: i } of e._extensions)
    !i || (i.$allModels && r.push(mr(i.$allModels)), i[n] && r.push(mr(i[n])));
  return an({}, r);
}
u(rs, "applyModel");
function hg(e, t) {
  let r = ln(t),
    n = bg(e, t);
  return {
    getKeys() {
      return n;
    },
    getPropertyValue(o) {
      let i = ac(o),
        s = u((c) => e._request(c), "requestFn");
      Li(o) && (s = qc(o, t, s));
      let a = u(
        (c) => (l) => {
          let f = Xe(e._errorFormat);
          return xt((g, y) => {
            let b = {
              args: l,
              dataPath: [],
              action: i,
              model: t,
              clientMethod: `${r}.${o}`,
              jsModelName: r,
              transaction: g,
              lock: y,
              callsite: f,
            };
            return s({ ...b, ...c });
          });
        },
        "action"
      );
      return gg.includes(i) ? ts(e, t, a) : wg(o) ? Lc(e, o, a) : a({});
    },
  };
}
u(hg, "modelActionsLayer");
function bg(e, t) {
  let r = Object.keys(e._baseDmmf.mappingsMap[t]).filter(
    (o) => o !== "model" && o !== "plural"
  );
  r.push("count");
  let n = Object.keys(cr).filter((o) => r.includes(cr[o].wrappedAction));
  return r.concat(n);
}
u(bg, "getOwnKeys");
function wg(e) {
  return yg.includes(e);
}
u(wg, "isValidAggregateName");
function xg(e, t) {
  return sn(
    nn("fields", () => {
      let r = e._baseDmmf.modelMap[t];
      return Uc(r);
    })
  );
}
u(xg, "fieldsPropertyLayer");
d();
p();
m();
function Vc(e) {
  return e.replace(/^./, (t) => t.toUpperCase());
}
u(Vc, "jsToDMMFModelName");
var ns = Symbol();
function Ao(e) {
  let t = [vg(e), nn(ns, () => e)];
  for (let r of e._extensions) r.client && t.push(mr(r.client));
  return an(e, t);
}
u(Ao, "applyModelsAndClientExtensions");
function vg(e) {
  let t = Object.keys(e._baseDmmf.modelMap),
    r = t.map(ln),
    n = [...new Set(t.concat(r))];
  return sn({
    getKeys() {
      return n;
    },
    getPropertyValue(o) {
      let i = Vc(o);
      if (e._baseDmmf.modelMap[i] !== void 0) return rs(e, i);
      if (e._baseDmmf.modelMap[o] !== void 0) return rs(e, o);
    },
    getPropertyDescriptor(o) {
      if (!r.includes(o)) return { enumerable: !1 };
    },
  });
}
u(vg, "modelsLayer");
function Gc(e) {
  return e[ns] ? e[ns] : e;
}
u(Gc, "unapplyModelsAndClientExtensions");
function Jc(e) {
  if (!this._hasPreviewFlag("clientExtensions"))
    throw new we("Extensions are not yet available");
  let t = Gc(this),
    r = Object.create(t, {
      _extensions: {
        get: () =>
          typeof e == "function"
            ? this._extensions.concat(e())
            : this._extensions.concat(e),
      },
    });
  return Ao(r);
}
u(Jc, "$extends");
d();
p();
m();
function zc(e, t = () => {}) {
  let r,
    n = new Promise((o) => (r = o));
  return {
    then(o) {
      return --e === 0 && r(t()), o == null ? void 0 : o(n);
    },
  };
}
u(zc, "getLockCountPromise");
d();
p();
m();
function Hc(e) {
  return typeof e == "string"
    ? e
    : e.reduce((t, r) => {
        let n = typeof r == "string" ? r : r.level;
        return n === "query"
          ? t
          : t && (r === "info" || t === "info")
          ? "info"
          : n;
      }, void 0);
}
u(Hc, "getLogLevel");
d();
p();
m();
function Kc(e, t, r) {
  let n = Wc(e, r),
    o = Wc(t, r),
    i = Object.values(o).map((a) => a[a.length - 1]),
    s = Object.keys(o);
  return (
    Object.entries(n).forEach(([a, c]) => {
      s.includes(a) || i.push(c[c.length - 1]);
    }),
    i
  );
}
u(Kc, "mergeBy");
var Wc = u(
  (e, t) =>
    e.reduce((r, n) => {
      let o = t(n);
      return r[o] || (r[o] = []), r[o].push(n), r;
    }, {}),
  "groupBy"
);
d();
p();
m();
var fn = class {
  constructor() {
    this._middlewares = [];
  }
  use(t) {
    this._middlewares.push(t);
  }
  get(t) {
    return this._middlewares[t];
  }
  has(t) {
    return !!this._middlewares[t];
  }
  length() {
    return this._middlewares.length;
  }
};
u(fn, "MiddlewareHandler");
var pn = class {
  constructor() {
    this.query = new fn();
    this.engine = new fn();
  }
};
u(pn, "Middlewares");
d();
p();
m();
var Yc = ee(fo());
d();
p();
m();
var mn = class {
  constructor(t) {
    this.options = t;
    this.tickActive = !1;
    this.batches = {};
  }
  request(t) {
    let r = this.options.batchBy(t);
    return r
      ? (this.batches[r] ||
          ((this.batches[r] = []),
          this.tickActive ||
            ((this.tickActive = !0),
            w.nextTick(() => {
              this.dispatchBatches(), (this.tickActive = !1);
            }))),
        new Promise((n, o) => {
          this.batches[r].push({ request: t, resolve: n, reject: o });
        }))
      : this.options.singleLoader(t);
  }
  dispatchBatches() {
    for (let t in this.batches) {
      let r = this.batches[t];
      delete this.batches[t],
        r.length === 1
          ? this.options
              .singleLoader(r[0].request)
              .then((n) => {
                n instanceof Error ? r[0].reject(n) : r[0].resolve(n);
              })
              .catch((n) => {
                r[0].reject(n);
              })
          : this.options
              .batchLoader(r.map((n) => n.request))
              .then((n) => {
                if (n instanceof Error)
                  for (let o = 0; o < r.length; o++) r[o].reject(n);
                else
                  for (let o = 0; o < r.length; o++) {
                    let i = n[o];
                    i instanceof Error ? r[o].reject(i) : r[o].resolve(i);
                  }
              })
              .catch((n) => {
                for (let o = 0; o < r.length; o++) r[o].reject(n);
              });
    }
  }
  get [Symbol.toStringTag]() {
    return "DataLoader";
  }
};
u(mn, "DataLoader");
var Eg = Je("prisma:client:request_handler");
function Qc(e) {
  var o;
  let t = e.transaction,
    r = (o = e.headers) != null ? o : {},
    n = rr({ tracingConfig: e.tracingConfig });
  return (
    (t == null ? void 0 : t.kind) === "itx" && (r.transactionId = t.id),
    n !== void 0 && (r.traceparent = n),
    { transaction: t, headers: r }
  );
}
u(Qc, "getRequestInfo");
var dn = class {
  constructor(t, r) {
    (this.client = t),
      (this.hooks = r),
      (this.dataloader = new mn({
        batchLoader: (n) => {
          var c;
          let o = Qc(n[0]),
            i = n.map((l) => String(l.document)),
            s = rr({
              context: n[0].otelParentCtx,
              tracingConfig: t._tracingConfig,
            });
          s && (o.headers.traceparent = s);
          let a =
            ((c = o.transaction) == null ? void 0 : c.kind) === "batch"
              ? o.transaction
              : void 0;
          return this.client._engine.requestBatch(i, o.headers, a);
        },
        singleLoader: (n) => {
          var a;
          let o = Qc(n),
            i = String(n.document),
            s =
              ((a = o.transaction) == null ? void 0 : a.kind) === "itx"
                ? o.transaction
                : void 0;
          return this.client._engine.request(i, o.headers, s);
        },
        batchBy: (n) => {
          var o;
          return (o = n.transaction) != null && o.id
            ? `transaction-${n.transaction.id}`
            : Tg(n);
        },
      }));
  }
  async request({
    document: t,
    dataPath: r = [],
    rootField: n,
    typeName: o,
    isList: i,
    callsite: s,
    rejectOnNotFound: a,
    clientMethod: c,
    engineHook: l,
    args: f,
    headers: g,
    transaction: y,
    unpacker: b,
    otelParentCtx: x,
    otelChildCtx: h,
  }) {
    if (this.hooks && this.hooks.beforeRequest) {
      let A = String(t);
      this.hooks.beforeRequest({
        query: A,
        path: r,
        rootField: n,
        typeName: o,
        document: t,
        isList: i,
        clientMethod: c,
        args: f,
      });
    }
    try {
      let A, M;
      if (l) {
        let S = await l({ document: t, runInTransaction: Boolean(y) }, (T) =>
          this.dataloader.request({
            ...T,
            tracingConfig: this.client._tracingConfig,
          })
        );
        (A = S.data), (M = S.elapsed);
      } else {
        let S = await this.dataloader.request({
          document: t,
          headers: g,
          transaction: y,
          otelParentCtx: x,
          otelChildCtx: h,
          tracingConfig: this.client._tracingConfig,
        });
        (A = S == null ? void 0 : S.data), (M = S == null ? void 0 : S.elapsed);
      }
      let P = this.unpack(t, A, r, n, b);
      return (
        Bc(P, c, o, a),
        w.env.PRISMA_CLIENT_GET_TIME ? { data: P, elapsed: M } : P
      );
    } catch (A) {
      this.handleRequestError({ error: A, clientMethod: c, callsite: s });
    }
  }
  handleRequestError({ error: t, clientMethod: r, callsite: n }) {
    Eg(t);
    let o = t.message;
    throw (
      (n &&
        (o = fr({
          callsite: n,
          originalMethod: r,
          isPanic: t.isPanic,
          showColors: this.client._errorFormat === "pretty",
          message: o,
        })),
      (o = this.sanitizeMessage(o)),
      t.code
        ? new je(o, t.code, this.client._clientVersion, t.meta)
        : t.isPanic
        ? new Qe(o, this.client._clientVersion)
        : t instanceof Ce
        ? new Ce(o, this.client._clientVersion)
        : t instanceof _e
        ? new _e(o, this.client._clientVersion)
        : t instanceof Qe
        ? new Qe(o, this.client._clientVersion)
        : ((t.clientVersion = this.client._clientVersion), t))
    );
  }
  sanitizeMessage(t) {
    return this.client._errorFormat && this.client._errorFormat !== "pretty"
      ? (0, Yc.default)(t)
      : t;
  }
  unpack(t, r, n, o, i) {
    r != null && r.data && (r = r.data), i && (r[o] = i(r[o]));
    let s = [];
    return (
      o && s.push(o),
      s.push(...n.filter((a) => a !== "select" && a !== "include")),
      Yi({ document: t, data: r, path: s })
    );
  }
  get [Symbol.toStringTag]() {
    return "RequestHandler";
  }
};
u(dn, "RequestHandler");
function Tg(e) {
  var n;
  if (!e.document.children[0].name.startsWith("findUnique")) return;
  let t =
      (n = e.document.children[0].args) == null
        ? void 0
        : n.args
            .map((o) =>
              o.value instanceof de
                ? `${o.key}-${o.value.args.map((i) => i.key).join(",")}`
                : o.key
            )
            .join(","),
    r = e.document.children[0].children.join(",");
  return `${e.document.children[0].name}|${t}|${r}`;
}
u(Tg, "batchFindUniqueBy");
d();
p();
m();
var Xc = Zc().version;
d();
p();
m();
function el(e) {
  return e.map((t) => {
    let r = {};
    for (let n of Object.keys(t)) r[n] = tl(t[n]);
    return r;
  });
}
u(el, "deserializeRawResults");
function tl({ prisma__type: e, prisma__value: t }) {
  switch (e) {
    case "bigint":
      return BigInt(t);
    case "bytes":
      return v.Buffer.from(t, "base64");
    case "decimal":
      return new Ge(t);
    case "datetime":
    case "date":
      return new Date(t);
    case "time":
      return new Date(`1970-01-01T${t}Z`);
    case "array":
      return t.map(tl);
    default:
      return t;
  }
}
u(tl, "deserializeValue");
d();
p();
m();
var gn = u(
  (e) => e.reduce((t, r, n) => `${t}@P${n}${r}`),
  "mssqlPreparedStatement"
);
d();
p();
m();
function Le(e) {
  try {
    return rl(e, "fast");
  } catch (t) {
    return rl(e, "slow");
  }
}
u(Le, "serializeRawParameters");
function rl(e, t) {
  return JSON.stringify(e.map((r) => Pg(r, t)));
}
u(rl, "serializeRawParametersInternal");
function Pg(e, t) {
  return typeof e == "bigint"
    ? { prisma__type: "bigint", prisma__value: e.toString() }
    : Mg(e)
    ? { prisma__type: "date", prisma__value: e.toJSON() }
    : Ge.isDecimal(e)
    ? { prisma__type: "decimal", prisma__value: e.toJSON() }
    : v.Buffer.isBuffer(e)
    ? { prisma__type: "bytes", prisma__value: e.toString("base64") }
    : Sg(e) || ArrayBuffer.isView(e)
    ? {
        prisma__type: "bytes",
        prisma__value: v.Buffer.from(e).toString("base64"),
      }
    : typeof e == "object" && t === "slow"
    ? ol(e)
    : e;
}
u(Pg, "encodeParameter");
function Mg(e) {
  return e instanceof Date
    ? !0
    : Object.prototype.toString.call(e) === "[object Date]" &&
        typeof e.toJSON == "function";
}
u(Mg, "isDate");
function Sg(e) {
  return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer
    ? !0
    : typeof e == "object" && e !== null
    ? e[Symbol.toStringTag] === "ArrayBuffer" ||
      e[Symbol.toStringTag] === "SharedArrayBuffer"
    : !1;
}
u(Sg, "isArrayBufferLike");
function ol(e) {
  if (typeof e != "object" || e === null) return e;
  if (typeof e.toJSON == "function") return e.toJSON();
  if (Array.isArray(e)) return e.map(nl);
  let t = {};
  for (let r of Object.keys(e)) t[r] = nl(e[r]);
  return t;
}
u(ol, "preprocessObject");
function nl(e) {
  return typeof e == "bigint" ? e.toString() : ol(e);
}
u(nl, "preprocessValueInObject");
d();
p();
m();
var ul = ee(Ho());
var il = [
    "datasources",
    "errorFormat",
    "log",
    "__internal",
    "rejectOnNotFound",
  ],
  sl = ["pretty", "colorless", "minimal"],
  al = ["info", "query", "warn", "error"],
  Og = {
    datasources: (e, t) => {
      if (!!e) {
        if (typeof e != "object" || Array.isArray(e))
          throw new oe(
            `Invalid value ${JSON.stringify(
              e
            )} for "datasources" provided to PrismaClient constructor`
          );
        for (let [r, n] of Object.entries(e)) {
          if (!t.includes(r)) {
            let o = gr(r, t) || `Available datasources: ${t.join(", ")}`;
            throw new oe(
              `Unknown datasource ${r} provided to PrismaClient constructor.${o}`
            );
          }
          if (typeof n != "object" || Array.isArray(n))
            throw new oe(`Invalid value ${JSON.stringify(
              e
            )} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          if (n && typeof n == "object")
            for (let [o, i] of Object.entries(n)) {
              if (o !== "url")
                throw new oe(`Invalid value ${JSON.stringify(
                  e
                )} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
              if (typeof i != "string")
                throw new oe(`Invalid value ${JSON.stringify(
                  i
                )} for datasource "${r}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            }
        }
      }
    },
    errorFormat: (e) => {
      if (!!e) {
        if (typeof e != "string")
          throw new oe(
            `Invalid value ${JSON.stringify(
              e
            )} for "errorFormat" provided to PrismaClient constructor.`
          );
        if (!sl.includes(e)) {
          let t = gr(e, sl);
          throw new oe(
            `Invalid errorFormat ${e} provided to PrismaClient constructor.${t}`
          );
        }
      }
    },
    log: (e) => {
      if (!e) return;
      if (!Array.isArray(e))
        throw new oe(
          `Invalid value ${JSON.stringify(
            e
          )} for "log" provided to PrismaClient constructor.`
        );
      function t(r) {
        if (typeof r == "string" && !al.includes(r)) {
          let n = gr(r, al);
          throw new oe(
            `Invalid log level "${r}" provided to PrismaClient constructor.${n}`
          );
        }
      }
      u(t, "validateLogLevel");
      for (let r of e) {
        t(r);
        let n = {
          level: t,
          emit: (o) => {
            let i = ["stdout", "event"];
            if (!i.includes(o)) {
              let s = gr(o, i);
              throw new oe(
                `Invalid value ${JSON.stringify(
                  o
                )} for "emit" in logLevel provided to PrismaClient constructor.${s}`
              );
            }
          },
        };
        if (r && typeof r == "object")
          for (let [o, i] of Object.entries(r))
            if (n[o]) n[o](i);
            else
              throw new oe(
                `Invalid property ${o} for "log" provided to PrismaClient constructor`
              );
      }
    },
    __internal: (e) => {
      if (!e) return;
      let t = ["debug", "hooks", "engine", "measurePerformance"];
      if (typeof e != "object")
        throw new oe(
          `Invalid value ${JSON.stringify(
            e
          )} for "__internal" to PrismaClient constructor`
        );
      for (let [r] of Object.entries(e))
        if (!t.includes(r)) {
          let n = gr(r, t);
          throw new oe(
            `Invalid property ${JSON.stringify(
              r
            )} for "__internal" provided to PrismaClient constructor.${n}`
          );
        }
    },
    rejectOnNotFound: (e) => {
      if (!!e) {
        if (
          Yr(e) ||
          typeof e == "boolean" ||
          typeof e == "object" ||
          typeof e == "function"
        )
          return e;
        throw new oe(
          `Invalid rejectOnNotFound expected a boolean/Error/{[modelName: Error | boolean]} but received ${JSON.stringify(
            e
          )}`
        );
      }
    },
  };
function cl(e, t) {
  for (let [r, n] of Object.entries(e)) {
    if (!il.includes(r)) {
      let o = gr(r, il);
      throw new oe(
        `Unknown property ${r} provided to PrismaClient constructor.${o}`
      );
    }
    Og[r](n, t);
  }
}
u(cl, "validatePrismaClientOptions");
function gr(e, t) {
  if (t.length === 0 || typeof e != "string") return "";
  let r = _g(e, t);
  return r ? ` Did you mean "${r}"?` : "";
}
u(gr, "getDidYouMean");
function _g(e, t) {
  if (t.length === 0) return null;
  let r = t.map((o) => ({ value: o, distance: (0, ul.default)(e, o) }));
  r.sort((o, i) => (o.distance < i.distance ? -1 : 1));
  let n = r[0];
  return n.distance < 3 ? n.value : null;
}
u(_g, "getAlternative");
var ge = Je("prisma:client"),
  Cg = /^(\s*alter\s)/i;
typeof globalThis == "object" && (globalThis.NODE_CLIENT = !0);
function ll(e) {
  return Array.isArray(e);
}
u(ll, "isReadonlyArray");
function os(e, t, r) {
  if (t.length > 0 && Cg.exec(e))
    throw new Error(`Running ALTER using ${r} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
}
u(os, "checkAlter");
var Ig = {
    findUnique: "query",
    findFirst: "query",
    findMany: "query",
    count: "query",
    create: "mutation",
    createMany: "mutation",
    update: "mutation",
    updateMany: "mutation",
    upsert: "mutation",
    delete: "mutation",
    deleteMany: "mutation",
    executeRaw: "mutation",
    queryRaw: "mutation",
    aggregate: "query",
    groupBy: "query",
    runCommandRaw: "mutation",
    findRaw: "query",
    aggregateRaw: "query",
  },
  Rg = Symbol.for("prisma.client.transaction.id");
function Fg(e) {
  class t {
    constructor(n) {
      this._middlewares = new pn();
      this._transactionId = 1;
      this._getDmmf = Di(async (n) => {
        try {
          let o = await this._engine.getDmmf();
          return new ft(sc(o));
        } catch (o) {
          this._fetcher.handleRequestError({ ...n, error: o });
        }
      });
      this.$extends = Jc;
      var s, a, c, l, f, g, y, b, x;
      n && cl(n, e.datasourceNames),
        (this._extensions = []),
        (this._previewFeatures =
          (a = (s = e.generator) == null ? void 0 : s.previewFeatures) != null
            ? a
            : []),
        (this._rejectOnNotFound = n == null ? void 0 : n.rejectOnNotFound),
        (this._clientVersion = (c = e.clientVersion) != null ? c : Xc),
        (this._activeProvider = e.activeProvider),
        (this._dataProxy = e.dataProxy),
        (this._tracingConfig = xi(this._previewFeatures)),
        (this._clientEngineType = _i(e.generator));
      let o = {
          rootEnvPath:
            e.relativeEnvPaths.rootEnvPath &&
            yn.default.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath),
          schemaEnvPath:
            e.relativeEnvPaths.schemaEnvPath &&
            yn.default.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath),
        },
        i = !1;
      try {
        let h = n != null ? n : {},
          A = (l = h.__internal) != null ? l : {},
          M = A.debug === !0;
        M && Je.enable("prisma:client"), A.hooks && (this._hooks = A.hooks);
        let P = yn.default.resolve(e.dirname, e.relativePath);
        co.existsSync(P) || (P = e.dirname),
          ge("dirname", e.dirname),
          ge("relativePath", e.relativePath),
          ge("cwd", P);
        let S = h.datasources || {},
          T = Object.entries(S)
            .filter(([F, B]) => B && B.url)
            .map(([F, { url: B }]) => ({ name: F, url: B })),
          O = Kc([], T, (F) => F.name),
          R = A.engine || {};
        if (
          (h.errorFormat
            ? (this._errorFormat = h.errorFormat)
            : w.env.NODE_ENV === "production"
            ? (this._errorFormat = "minimal")
            : w.env.NO_COLOR
            ? (this._errorFormat = "colorless")
            : (this._errorFormat = "colorless"),
          (this._baseDmmf = new lt(e.document)),
          this._dataProxy)
        ) {
          let F = e.document;
          this._dmmf = new ft(F);
        }
        if (
          ((this._engineConfig = {
            cwd: P,
            dirname: e.dirname,
            enableDebugLogs: M,
            allowTriggerPanic: R.allowTriggerPanic,
            datamodelPath: yn.default.join(
              e.dirname,
              (f = e.filename) != null ? f : "schema.prisma"
            ),
            prismaPath: (g = R.binaryPath) != null ? g : void 0,
            engineEndpoint: R.endpoint,
            datasources: O,
            generator: e.generator,
            showColors: this._errorFormat === "pretty",
            logLevel: h.log && Hc(h.log),
            logQueries:
              h.log &&
              Boolean(
                typeof h.log == "string"
                  ? h.log === "query"
                  : h.log.find((F) =>
                      typeof F == "string" ? F === "query" : F.level === "query"
                    )
              ),
            env:
              (x =
                (b = i == null ? void 0 : i.parsed) != null
                  ? b
                  : (y = e.injectableEdgeEnv) == null
                  ? void 0
                  : y.parsed) != null
                ? x
                : {},
            flags: [],
            clientVersion: e.clientVersion,
            previewFeatures: this._previewFeatures,
            activeProvider: e.activeProvider,
            inlineSchema: e.inlineSchema,
            inlineDatasources: e.inlineDatasources,
            inlineSchemaHash: e.inlineSchemaHash,
            tracingConfig: this._tracingConfig,
          }),
          ge("clientVersion", e.clientVersion),
          ge(
            "clientEngineType",
            this._dataProxy ? "dataproxy" : this._clientEngineType
          ),
          this._dataProxy && ge("using Data Proxy with edge runtime"),
          (this._engine = this.getEngine()),
          this._getActiveProvider(),
          (this._fetcher = new dn(this, this._hooks)),
          h.log)
        )
          for (let F of h.log) {
            let B =
              typeof F == "string" ? F : F.emit === "stdout" ? F.level : null;
            B &&
              this.$on(B, (W) => {
                var te;
                ur.log(
                  `${(te = ur.tags[B]) != null ? te : ""}`,
                  W.message || W.query
                );
              });
          }
        this._metrics = new $t(this._engine);
      } catch (h) {
        throw ((h.clientVersion = this._clientVersion), h);
      }
      return Ao(this);
    }
    get [Symbol.toStringTag]() {
      return "PrismaClient";
    }
    getEngine() {
      if (this._dataProxy === !0) return new ar(this._engineConfig);
      if (this._clientEngineType === "library") return !1;
      if (this._clientEngineType === "binary") return !1;
      throw new we(
        "Invalid client engine type, please use `library` or `binary`"
      );
    }
    $use(n, o) {
      if (typeof n == "function") this._middlewares.query.use(n);
      else if (n === "all") this._middlewares.query.use(o);
      else if (n === "engine") this._middlewares.engine.use(o);
      else throw new Error(`Invalid middleware ${n}`);
    }
    $on(n, o) {
      n === "beforeExit"
        ? this._engine.on("beforeExit", o)
        : this._engine.on(n, (i) => {
            var a, c, l, f;
            let s = i.fields;
            return o(
              n === "query"
                ? {
                    timestamp: i.timestamp,
                    query:
                      (a = s == null ? void 0 : s.query) != null ? a : i.query,
                    params:
                      (c = s == null ? void 0 : s.params) != null
                        ? c
                        : i.params,
                    duration:
                      (l = s == null ? void 0 : s.duration_ms) != null
                        ? l
                        : i.duration,
                    target: i.target,
                  }
                : {
                    timestamp: i.timestamp,
                    message:
                      (f = s == null ? void 0 : s.message) != null
                        ? f
                        : i.message,
                    target: i.target,
                  }
            );
          });
    }
    $connect() {
      try {
        return this._engine.start();
      } catch (n) {
        throw ((n.clientVersion = this._clientVersion), n);
      }
    }
    async _runDisconnect() {
      await this._engine.stop(),
        delete this._connectionPromise,
        (this._engine = this.getEngine()),
        delete this._disconnectionPromise,
        delete this._getConfigPromise;
    }
    async $disconnect() {
      try {
        await this._engine.stop();
      } catch (n) {
        throw ((n.clientVersion = this._clientVersion), n);
      } finally {
        this._dataProxy || (this._dmmf = void 0);
      }
    }
    async _getActiveProvider() {
      try {
        let n = await this._engine.getConfig();
        this._activeProvider = n.datasources[0].activeProvider;
      } catch (n) {}
    }
    $executeRawInternal(n, o, i, ...s) {
      let a = "",
        c;
      if (typeof i == "string")
        (a = i),
          (c = { values: Le(s || []), __prismaRawParameters__: !0 }),
          os(a, s, "prisma.$executeRawUnsafe(<SQL>, [...values])");
      else if (ll(i))
        switch (this._activeProvider) {
          case "sqlite":
          case "mysql": {
            let f = new pe(i, s);
            (a = f.sql),
              (c = { values: Le(f.values), __prismaRawParameters__: !0 });
            break;
          }
          case "cockroachdb":
          case "postgresql": {
            let f = new pe(i, s);
            (a = f.text),
              os(a, f.values, "prisma.$executeRaw`<SQL>`"),
              (c = { values: Le(f.values), __prismaRawParameters__: !0 });
            break;
          }
          case "sqlserver": {
            (a = gn(i)), (c = { values: Le(s), __prismaRawParameters__: !0 });
            break;
          }
          default:
            throw new Error(
              `The ${this._activeProvider} provider does not support $executeRaw`
            );
        }
      else {
        switch (this._activeProvider) {
          case "sqlite":
          case "mysql":
            a = i.sql;
            break;
          case "cockroachdb":
          case "postgresql":
            (a = i.text), os(a, i.values, "prisma.$executeRaw(sql`<SQL>`)");
            break;
          case "sqlserver":
            a = gn(i.strings);
            break;
          default:
            throw new Error(
              `The ${this._activeProvider} provider does not support $executeRaw`
            );
        }
        c = { values: Le(i.values), __prismaRawParameters__: !0 };
      }
      c != null && c.values
        ? ge(`prisma.$executeRaw(${a}, ${c.values})`)
        : ge(`prisma.$executeRaw(${a})`);
      let l = { query: a, parameters: c };
      return (
        ge("Prisma Client call:"),
        this._request({
          args: l,
          clientMethod: "$executeRaw",
          dataPath: [],
          action: "executeRaw",
          callsite: Xe(this._errorFormat),
          transaction: n,
          lock: o,
        })
      );
    }
    $executeRaw(n, ...o) {
      return xt((i, s) => {
        if (n.raw !== void 0 || n.sql !== void 0)
          return this.$executeRawInternal(i, s, n, ...o);
        throw new we(
          "`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n"
        );
      });
    }
    $executeRawUnsafe(n, ...o) {
      return xt((i, s) => this.$executeRawInternal(i, s, n, ...o));
    }
    $runCommandRaw(n) {
      if (e.activeProvider !== "mongodb")
        throw new we(
          `The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`
        );
      return xt((o, i) =>
        this._request({
          args: { command: n },
          clientMethod: "$runCommandRaw",
          dataPath: [],
          action: "runCommandRaw",
          callsite: Xe(this._errorFormat),
          transaction: o,
          lock: i,
        })
      );
    }
    async $queryRawInternal(n, o, i, ...s) {
      let a = "",
        c;
      if (typeof i == "string")
        (a = i), (c = { values: Le(s || []), __prismaRawParameters__: !0 });
      else if (ll(i))
        switch (this._activeProvider) {
          case "sqlite":
          case "mysql": {
            let f = new pe(i, s);
            (a = f.sql),
              (c = { values: Le(f.values), __prismaRawParameters__: !0 });
            break;
          }
          case "cockroachdb":
          case "postgresql": {
            let f = new pe(i, s);
            (a = f.text),
              (c = { values: Le(f.values), __prismaRawParameters__: !0 });
            break;
          }
          case "sqlserver": {
            let f = new pe(i, s);
            (a = gn(f.strings)),
              (c = { values: Le(f.values), __prismaRawParameters__: !0 });
            break;
          }
          default:
            throw new Error(
              `The ${this._activeProvider} provider does not support $queryRaw`
            );
        }
      else {
        switch (this._activeProvider) {
          case "sqlite":
          case "mysql":
            a = i.sql;
            break;
          case "cockroachdb":
          case "postgresql":
            a = i.text;
            break;
          case "sqlserver":
            a = gn(i.strings);
            break;
          default:
            throw new Error(
              `The ${this._activeProvider} provider does not support $queryRaw`
            );
        }
        c = { values: Le(i.values), __prismaRawParameters__: !0 };
      }
      c != null && c.values
        ? ge(`prisma.queryRaw(${a}, ${c.values})`)
        : ge(`prisma.queryRaw(${a})`);
      let l = { query: a, parameters: c };
      return (
        ge("Prisma Client call:"),
        this._request({
          args: l,
          clientMethod: "$queryRaw",
          dataPath: [],
          action: "queryRaw",
          callsite: Xe(this._errorFormat),
          transaction: n,
          lock: o,
        }).then(el)
      );
    }
    $queryRaw(n, ...o) {
      return xt((i, s) => {
        if (n.raw !== void 0 || n.sql !== void 0)
          return this.$queryRawInternal(i, s, n, ...o);
        throw new we(
          "`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n"
        );
      });
    }
    $queryRawUnsafe(n, ...o) {
      return xt((i, s) => this.$queryRawInternal(i, s, n, ...o));
    }
    __internal_triggerPanic(n) {
      if (!this._engineConfig.allowTriggerPanic)
        throw new Error(`In order to use .__internal_triggerPanic(), please enable it like so:
new PrismaClient({
  __internal: {
    engine: {
      allowTriggerPanic: true
    }
  }
})`);
      let o = n ? { "X-DEBUG-FATAL": "1" } : { "X-DEBUG-NON-FATAL": "1" };
      return this._request({
        action: "queryRaw",
        args: { query: "SELECT 1", parameters: void 0 },
        clientMethod: "queryRaw",
        dataPath: [],
        headers: o,
        callsite: Xe(this._errorFormat),
      });
    }
    _transactionWithArray({ promises: n, options: o }) {
      let i = this._transactionId++,
        s = zc(n.length),
        a = n.map((c) => {
          var l;
          if ((c == null ? void 0 : c[Symbol.toStringTag]) !== "PrismaPromise")
            throw new Error(
              "All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function."
            );
          return (l = c.requestTransaction) == null
            ? void 0
            : l.call(
                c,
                {
                  id: i,
                  isolationLevel: o == null ? void 0 : o.isolationLevel,
                },
                s
              );
        });
      return Promise.all(a);
    }
    async _transactionWithCallback({ callback: n, options: o }) {
      let i = { traceparent: rr({ tracingConfig: this._tracingConfig }) },
        s = await this._engine.transaction("start", i, o),
        a;
      try {
        (a = await n(is(this, { id: s.id, payload: s.payload }))),
          await this._engine.transaction("commit", i, s);
      } catch (c) {
        throw (
          (await this._engine.transaction("rollback", i, s).catch(() => {}), c)
        );
      }
      return a;
    }
    $transaction(n, o) {
      let i;
      typeof n == "function" && this._hasPreviewFlag("interactiveTransactions")
        ? (i = u(
            () => this._transactionWithCallback({ callback: n, options: o }),
            "callback"
          ))
        : (i = u(
            () => this._transactionWithArray({ promises: n, options: o }),
            "callback"
          ));
      let s = {
        name: "transaction",
        enabled: this._tracingConfig.enabled,
        attributes: { method: "$transaction" },
      };
      return nr(s, i);
    }
    async _request(n) {
      n.otelParentCtx = bt.active();
      try {
        let o = {
            args: n.args,
            dataPath: n.dataPath,
            runInTransaction: Boolean(n.transaction),
            action: n.action,
            model: n.model,
          },
          i = {
            middleware: {
              name: "middleware",
              enabled: this._tracingConfig.middleware,
              attributes: { method: "$use" },
              active: !1,
            },
            operation: {
              name: "operation",
              enabled: this._tracingConfig.enabled,
              attributes: {
                method: o.action,
                model: o.model,
                name: `${o.model}.${o.action}`,
              },
            },
          },
          s = -1,
          a = u((c) => {
            let l = this._middlewares.query.get(++s);
            if (l)
              return nr(i.middleware, async (b) =>
                l(c, (x) => (b == null || b.end(), a(x)))
              );
            let { runInTransaction: f, ...g } = c,
              y = { ...n, ...g };
            return f || (y.transaction = void 0), this._executeRequest(y);
          }, "consumer");
        return await nr(i.operation, () => a(o));
      } catch (o) {
        throw ((o.clientVersion = this._clientVersion), o);
      }
    }
    async _executeRequest({
      args: n,
      clientMethod: o,
      jsModelName: i,
      dataPath: s,
      callsite: a,
      action: c,
      model: l,
      headers: f,
      transaction: g,
      lock: y,
      unpacker: b,
      otelParentCtx: x,
    }) {
      var W, te;
      this._dmmf === void 0 &&
        (this._dmmf = await this._getDmmf({ clientMethod: o, callsite: a }));
      let h,
        A = Ig[c];
      (c === "executeRaw" || c === "queryRaw" || c === "runCommandRaw") &&
        (h = c);
      let M;
      if (l !== void 0) {
        if (
          ((M = (W = this._dmmf) == null ? void 0 : W.mappingsMap[l]),
          M === void 0)
        )
          throw new Error(`Could not find mapping for model ${l}`);
        h = M[c === "count" ? "aggregate" : c];
      }
      if (A !== "query" && A !== "mutation")
        throw new Error(`Invalid operation ${A} for action ${c}`);
      let P = (te = this._dmmf) == null ? void 0 : te.rootFieldMap[h];
      if (P === void 0)
        throw new Error(
          `Could not find rootField ${h} for action ${c} for model ${l} on rootType ${A}`
        );
      let { isList: S } = P.outputType,
        T = Pt(P.outputType.type),
        O = es(c, T, n, this._rejectOnNotFound);
      kg(O, i, c);
      let R = u(() => {
          let V = Qi({
            dmmf: this._dmmf,
            rootField: h,
            rootTypeName: A,
            select: n,
            modelName: l,
          });
          return V.validate(n, !1, o, this._errorFormat, a), V;
        }, "serializationFn"),
        F = { name: "serialize", enabled: this._tracingConfig.enabled },
        B = await nr(F, R);
      if (Je.enabled("prisma:client")) {
        let V = String(B);
        ge("Prisma Client call:"),
          ge(
            `prisma.${o}(${ho({
              ast: n,
              keyPaths: [],
              valuePaths: [],
              missingItems: [],
            })})`
          ),
          ge("Generated request:"),
          ge(
            V +
              `
`
          );
      }
      return (
        await y,
        this._fetcher.request({
          document: B,
          clientMethod: o,
          typeName: T,
          dataPath: s,
          rejectOnNotFound: O,
          isList: S,
          rootField: h,
          callsite: a,
          args: n,
          engineHook: this._middlewares.engine.get(0),
          headers: f,
          transaction: g,
          unpacker: b,
          otelParentCtx: x,
          otelChildCtx: bt.active(),
        })
      );
    }
    get $metrics() {
      if (!this._hasPreviewFlag("metrics"))
        throw new we(
          "`metrics` preview feature must be enabled in order to access metrics API"
        );
      return this._metrics;
    }
    _hasPreviewFlag(n) {
      var o;
      return !!(
        (o = this._engineConfig.previewFeatures) != null && o.includes(n)
      );
    }
  }
  return u(t, "PrismaClient"), t;
}
u(Fg, "getPrismaClient");
var Dg = ["$connect", "$disconnect", "$on", "$transaction", "$use", "$extends"];
function is(e, t) {
  return typeof e != "object"
    ? e
    : new Proxy(e, {
        get: (r, n) => {
          if (!Dg.includes(n))
            return n === Rg
              ? t == null
                ? void 0
                : t.id
              : typeof r[n] == "function"
              ? (...o) =>
                  n === "then"
                    ? r[n](o[0], o[1], t)
                    : n === "catch" || n === "finally"
                    ? r[n](o[0], t)
                    : is(r[n](...o), t)
              : is(r[n], t);
        },
      });
}
u(is, "transactionProxy");
var Ng = { findUnique: "findUniqueOrThrow", findFirst: "findFirstOrThrow" };
function kg(e, t, r) {
  if (e) {
    let n = Ng[r],
      o = t ? `prisma.${t}.${n}` : `prisma.${n}`,
      i = `rejectOnNotFound.${t != null ? t : ""}.${r}`;
    ki(
      i,
      `\`rejectOnNotFound\` option is deprecated and will be removed in Prisma 5. Please use \`${o}\` method instead`
    );
  }
}
u(kg, "warnAboutRejectOnNotFound");
d();
p();
m();
var jg = new Set([
  "toJSON",
  "asymmetricMatch",
  Symbol.iterator,
  Symbol.toStringTag,
  Symbol.isConcatSpreadable,
  Symbol.toPrimitive,
]);
function $g(e) {
  return new Proxy(e, {
    get(t, r) {
      if (r in t) return t[r];
      if (!jg.has(r)) throw new TypeError(`Invalid enum value: ${String(r)}`);
    },
  });
}
u($g, "makeStrictEnum");
d();
p();
m();
d();
p();
m();
var TD = fl.decompressFromBase64;
var export_findSync = void 0;
var export_warnEnvConflicts = void 0;
export {
  pt as DMMF,
  ft as DMMFClass,
  Ka as Debug,
  Ge as Decimal,
  _t as Engine,
  Fs as Extensions,
  $t as MetricsClient,
  et as NotFoundError,
  _e as PrismaClientInitializationError,
  je as PrismaClientKnownRequestError,
  Qe as PrismaClientRustPanicError,
  Ce as PrismaClientUnknownRequestError,
  we as PrismaClientValidationError,
  pe as Sql,
  tf as Types,
  TD as decompressFromBase64,
  dd as empty,
  export_findSync as findSync,
  Fg as getPrismaClient,
  md as join,
  Qi as makeDocument,
  $g as makeStrictEnum,
  Ko as objectEnumValues,
  tc as raw,
  rc as sqltag,
  Ic as transformDocument,
  Yi as unpack,
  export_warnEnvConflicts as warnEnvConflicts,
};
