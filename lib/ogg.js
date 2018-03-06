! function e(r, n, t) {
    function o(a, u) {
        if (!n[a]) {
            if (!r[a]) {
                var s = "function" == typeof require && require;
                if (!u && s) return s(a, !0);
                if (i) return i(a, !0);
                throw new Error("Cannot find module '" + a + "'")
            }
            var l = n[a] = {
                exports: {}
            };
            r[a][0].call(l.exports, function (e) {
                var n = r[a][1][e];
                return o(n ? n : e)
            }, l, l.exports, e, r, n, t)
        }
        return n[a].exports
    }
    for (var i = "function" == typeof require && require, a = 0; a < t.length; a++) o(t[a]);
    return o
}({
    1: [function (require, module, exports) {
        function globalEval(e) {
            eval.call(null, e)
        }

        function assert(e, r) {
            e || abort("Assertion failed: " + r)
        }

        function getCFunc(ident) {
            var func = Module["_" + ident];
            if (!func) try {
                func = eval("_" + ident)
            } catch (e) {}
            return assert(func, "Cannot call unknown function " + ident + " (perhaps LLVM optimizations or closure removed it?)"), func
        }

        function setValue(e, r, n, t) {
            switch (n = n || "i8", "*" === n.charAt(n.length - 1) && (n = "i32"), n) {
                case "i1":
                    HEAP8[e >> 0] = r;
                    break;
                case "i8":
                    HEAP8[e >> 0] = r;
                    break;
                case "i16":
                    HEAP16[e >> 1] = r;
                    break;
                case "i32":
                    HEAP32[e >> 2] = r;
                    break;
                case "i64":
                    tempI64 = [r >>> 0, (tempDouble = r, +Math_abs(tempDouble) >= 1 ? tempDouble > 0 ? (0 | Math_min(+Math_floor(tempDouble / 4294967296), 4294967295)) >>> 0 : ~~+Math_ceil((tempDouble - +(~~tempDouble >>> 0)) / 4294967296) >>> 0 : 0)], HEAP32[e >> 2] = tempI64[0], HEAP32[e + 4 >> 2] = tempI64[1];
                    break;
                case "float":
                    HEAPF32[e >> 2] = r;
                    break;
                case "double":
                    HEAPF64[e >> 3] = r;
                    break;
                default:
                    abort("invalid type for setValue: " + n)
            }
        }

        function getValue(e, r, n) {
            switch (r = r || "i8", "*" === r.charAt(r.length - 1) && (r = "i32"), r) {
                case "i1":
                    return HEAP8[e >> 0];
                case "i8":
                    return HEAP8[e >> 0];
                case "i16":
                    return HEAP16[e >> 1];
                case "i32":
                    return HEAP32[e >> 2];
                case "i64":
                    return HEAP32[e >> 2];
                case "float":
                    return HEAPF32[e >> 2];
                case "double":
                    return HEAPF64[e >> 3];
                default:
                    abort("invalid type for setValue: " + r)
            }
            return null
        }

        function allocate(e, r, n, t) {
            var o, i;
            "number" == typeof e ? (o = !0, i = e) : (o = !1, i = e.length);
            var a, u = "string" == typeof r ? r : null;
            if (a = n == ALLOC_NONE ? t : [_malloc, Runtime.stackAlloc, Runtime.staticAlloc, Runtime.dynamicAlloc][void 0 === n ? ALLOC_STATIC : n](Math.max(i, u ? 1 : r.length)), o) {
                var s, t = a;
                for (assert(0 == (3 & a)), s = a + (i & -4); t < s; t += 4) HEAP32[t >> 2] = 0;
                for (s = a + i; t < s;) HEAP8[t++ >> 0] = 0;
                return a
            }
            if ("i8" === u) return e.subarray || e.slice ? HEAPU8.set(e, a) : HEAPU8.set(new Uint8Array(e), a), a;
            for (var l, c, f, d = 0; d < i;) {
                var m = e[d];
                "function" == typeof m && (m = Runtime.getFunctionIndex(m)), l = u || r[d], 0 !== l ? ("i64" == l && (l = "i32"), setValue(a + d, m, l), f !== l && (c = Runtime.getNativeTypeSize(l), f = l), d += c) : d++
            }
            return a
        }

        function getMemory(e) {
            return staticSealed ? "undefined" != typeof _sbrk && !_sbrk.called || !runtimeInitialized ? Runtime.dynamicAlloc(e) : _malloc(e) : Runtime.staticAlloc(e)
        }

        function Pointer_stringify(e, r) {
            if (0 === r || !e) return "";
            for (var n, t = 0, o = 0;;) {
                if (n = HEAPU8[e + o >> 0], t |= n, 0 == n && !r) break;
                if (o++, r && o == r) break
            }
            r || (r = o);
            var i = "";
            if (t < 128) {
                for (var a, u = 1024; r > 0;) a = String.fromCharCode.apply(String, HEAPU8.subarray(e, e + Math.min(r, u))), i = i ? i + a : a, e += u, r -= u;
                return i
            }
            return Module.UTF8ToString(e)
        }

        function AsciiToString(e) {
            for (var r = "";;) {
                var n = HEAP8[e++ >> 0];
                if (!n) return r;
                r += String.fromCharCode(n)
            }
        }

        function stringToAscii(e, r) {
            return writeAsciiToMemory(e, r, !1)
        }

        function UTF8ArrayToString(e, r) {
            for (var n, t, o, i, a, u, s = "";;) {
                if (n = e[r++], !n) return s;
                if (128 & n)
                    if (t = 63 & e[r++], 192 != (224 & n))
                        if (o = 63 & e[r++], 224 == (240 & n) ? n = (15 & n) << 12 | t << 6 | o : (i = 63 & e[r++], 240 == (248 & n) ? n = (7 & n) << 18 | t << 12 | o << 6 | i : (a = 63 & e[r++], 248 == (252 & n) ? n = (3 & n) << 24 | t << 18 | o << 12 | i << 6 | a : (u = 63 & e[r++], n = (1 & n) << 30 | t << 24 | o << 18 | i << 12 | a << 6 | u))), n < 65536) s += String.fromCharCode(n);
                        else {
                            var l = n - 65536;
                            s += String.fromCharCode(55296 | l >> 10, 56320 | 1023 & l)
                        }
                else s += String.fromCharCode((31 & n) << 6 | t);
                else s += String.fromCharCode(n)
            }
        }

        function UTF8ToString(e) {
            return UTF8ArrayToString(HEAPU8, e)
        }

        function stringToUTF8Array(e, r, n, t) {
            if (!(t > 0)) return 0;
            for (var o = n, i = n + t - 1, a = 0; a < e.length; ++a) {
                var u = e.charCodeAt(a);
                if (u >= 55296 && u <= 57343 && (u = 65536 + ((1023 & u) << 10) | 1023 & e.charCodeAt(++a)), u <= 127) {
                    if (n >= i) break;
                    r[n++] = u
                } else if (u <= 2047) {
                    if (n + 1 >= i) break;
                    r[n++] = 192 | u >> 6, r[n++] = 128 | 63 & u
                } else if (u <= 65535) {
                    if (n + 2 >= i) break;
                    r[n++] = 224 | u >> 12, r[n++] = 128 | u >> 6 & 63, r[n++] = 128 | 63 & u
                } else if (u <= 2097151) {
                    if (n + 3 >= i) break;
                    r[n++] = 240 | u >> 18, r[n++] = 128 | u >> 12 & 63, r[n++] = 128 | u >> 6 & 63, r[n++] = 128 | 63 & u
                } else if (u <= 67108863) {
                    if (n + 4 >= i) break;
                    r[n++] = 248 | u >> 24, r[n++] = 128 | u >> 18 & 63, r[n++] = 128 | u >> 12 & 63, r[n++] = 128 | u >> 6 & 63, r[n++] = 128 | 63 & u
                } else {
                    if (n + 5 >= i) break;
                    r[n++] = 252 | u >> 30, r[n++] = 128 | u >> 24 & 63, r[n++] = 128 | u >> 18 & 63, r[n++] = 128 | u >> 12 & 63, r[n++] = 128 | u >> 6 & 63, r[n++] = 128 | 63 & u
                }
            }
            return r[n] = 0, n - o
        }

        function stringToUTF8(e, r, n) {
            return stringToUTF8Array(e, HEAPU8, r, n)
        }

        function lengthBytesUTF8(e) {
            for (var r = 0, n = 0; n < e.length; ++n) {
                var t = e.charCodeAt(n);
                t >= 55296 && t <= 57343 && (t = 65536 + ((1023 & t) << 10) | 1023 & e.charCodeAt(++n)), t <= 127 ? ++r : r += t <= 2047 ? 2 : t <= 65535 ? 3 : t <= 2097151 ? 4 : t <= 67108863 ? 5 : 6
            }
            return r
        }

        function UTF16ToString(e) {
            for (var r = 0, n = "";;) {
                var t = HEAP16[e + 2 * r >> 1];
                if (0 == t) return n;
                ++r, n += String.fromCharCode(t)
            }
        }

        function stringToUTF16(e, r, n) {
            if (void 0 === n && (n = 2147483647), n < 2) return 0;
            n -= 2;
            for (var t = r, o = n < 2 * e.length ? n / 2 : e.length, i = 0; i < o; ++i) {
                var a = e.charCodeAt(i);
                HEAP16[r >> 1] = a, r += 2
            }
            return HEAP16[r >> 1] = 0, r - t
        }

        function lengthBytesUTF16(e) {
            return 2 * e.length
        }

        function UTF32ToString(e) {
            for (var r = 0, n = "";;) {
                var t = HEAP32[e + 4 * r >> 2];
                if (0 == t) return n;
                if (++r, t >= 65536) {
                    var o = t - 65536;
                    n += String.fromCharCode(55296 | o >> 10, 56320 | 1023 & o)
                } else n += String.fromCharCode(t)
            }
        }

        function stringToUTF32(e, r, n) {
            if (void 0 === n && (n = 2147483647), n < 4) return 0;
            for (var t = r, o = t + n - 4, i = 0; i < e.length; ++i) {
                var a = e.charCodeAt(i);
                if (a >= 55296 && a <= 57343) {
                    var u = e.charCodeAt(++i);
                    a = 65536 + ((1023 & a) << 10) | 1023 & u
                }
                if (HEAP32[r >> 2] = a, r += 4, r + 4 > o) break
            }
            return HEAP32[r >> 2] = 0, r - t
        }

        function lengthBytesUTF32(e) {
            for (var r = 0, n = 0; n < e.length; ++n) {
                var t = e.charCodeAt(n);
                t >= 55296 && t <= 57343 && ++n, r += 4
            }
            return r
        }

        function demangle(e) {
            function r() {
                s++, "K" === e[s] && s++;
                for (var r = [];
                    "E" !== e[s];)
                    if ("S" !== e[s])
                        if ("C" !== e[s]) {
                            var n = parseInt(e.substr(s)),
                                t = n.toString().length;
                            if (!n || !t) {
                                s--;
                                break
                            }
                            var o = e.substr(s + t, n);
                            r.push(o), c.push(o), s += t + n
                        } else r.push(r[r.length - 1]), s += 2;
                else {
                    s++;
                    var i = e.indexOf("_", s),
                        a = e.substring(s, i) || 0;
                    r.push(c[a] || "?"), s = i + 1
                }
                return s++, r
            }

            function n(t, o, i) {
                function a() {
                    return "(" + d.join(", ") + ")"
                }
                o = o || 1 / 0;
                var u, c = "",
                    d = [];
                if ("N" === e[s]) {
                    if (u = r().join("::"), o--, 0 === o) return t ? [u] : u
                } else {
                    ("K" === e[s] || f && "L" === e[s]) && s++;
                    var m = parseInt(e.substr(s));
                    if (m) {
                        var E = m.toString().length;
                        u = e.substr(s + E, m), s += E + m
                    }
                }
                if (f = !1, "I" === e[s]) {
                    s++;
                    var S = n(!0),
                        p = n(!0, 1, !0);
                    c += p[0] + " " + u + "<" + S.join(", ") + ">"
                } else c = u;
                e: for (; s < e.length && o-- > 0;) {
                    var h = e[s++];
                    if (h in l) d.push(l[h]);
                    else switch (h) {
                        case "P":
                            d.push(n(!0, 1, !0)[0] + "*");
                            break;
                        case "R":
                            d.push(n(!0, 1, !0)[0] + "&");
                            break;
                        case "L":
                            s++;
                            var _ = e.indexOf("E", s),
                                m = _ - s;
                            d.push(e.substr(s, m)), s += m + 2;
                            break;
                        case "A":
                            var m = parseInt(e.substr(s));
                            if (s += m.toString().length, "_" !== e[s]) throw "?";
                            s++, d.push(n(!0, 1, !0)[0] + " [" + m + "]");
                            break;
                        case "E":
                            break e;
                        default:
                            c += "?" + h;
                            break e
                    }
                }
                return i || 1 !== d.length || "void" !== d[0] || (d = []), t ? (c && d.push(c + "?"), d) : c + a()
            }
            var t = !!Module.___cxa_demangle;
            if (t) try {
                var o = _malloc(e.length);
                writeStringToMemory(e.substr(1), o);
                var i = _malloc(4),
                    a = Module.___cxa_demangle(o, 0, 0, i);
                if (0 === getValue(i, "i32") && a) return Pointer_stringify(a)
            } catch (u) {} finally {
                o && _free(o), i && _free(i), a && _free(a)
            }
            var s = 3,
                l = {
                    v: "void",
                    b: "bool",
                    c: "char",
                    s: "short",
                    i: "int",
                    l: "long",
                    f: "float",
                    d: "double",
                    w: "wchar_t",
                    a: "signed char",
                    h: "unsigned char",
                    t: "unsigned short",
                    j: "unsigned int",
                    m: "unsigned long",
                    x: "long long",
                    y: "unsigned long long",
                    z: "..."
                },
                c = [],
                f = !0,
                d = e;
            try {
                if ("Object._main" == e || "_main" == e) return "main()";
                if ("number" == typeof e && (e = Pointer_stringify(e)), "_" !== e[0]) return e;
                if ("_" !== e[1]) return e;
                if ("Z" !== e[2]) return e;
                switch (e[3]) {
                    case "n":
                        return "operator new()";
                    case "d":
                        return "operator delete()"
                }
                d = n()
            } catch (u) {
                d += "?"
            }
            return d.indexOf("?") >= 0 && !t && Runtime.warnOnce("warning: a problem occurred in builtin C++ name demangling; build with  -s DEMANGLE_SUPPORT=1  to link in libcxxabi demangling"), d
        }

        function demangleAll(e) {
            return e.replace(/__Z[\w\d_]+/g, function (e) {
                var r = demangle(e);
                return e === r ? e : e + " [" + r + "]"
            })
        }

        function jsStackTrace() {
            var e = new Error;
            if (!e.stack) {
                try {
                    throw new Error(0)
                } catch (r) {
                    e = r
                }
                if (!e.stack) return "(no stack trace available)"
            }
            return e.stack.toString()
        }

        function stackTrace() {
            return demangleAll(jsStackTrace())
        }

        function alignMemoryPage(e) {
            return e % 4096 > 0 && (e += 4096 - e % 4096), e
        }

        function abortOnCannotGrowMemory() {
            abort("Cannot enlarge memory arrays. Either (1) compile with  -s TOTAL_MEMORY=X  with X higher than the current value " + TOTAL_MEMORY + ", (2) compile with  -s ALLOW_MEMORY_GROWTH=1  which adjusts the size at runtime but prevents some optimizations, (3) set Module.TOTAL_MEMORY to a higher value before the program runs, or if you want malloc to return NULL (0) instead of this abort, compile with  -s ABORTING_MALLOC=0 ")
        }

        function enlargeMemory() {
            abortOnCannotGrowMemory()
        }

        function callRuntimeCallbacks(e) {
            for (; e.length > 0;) {
                var r = e.shift();
                if ("function" != typeof r) {
                    var n = r.func;
                    "number" == typeof n ? void 0 === r.arg ? Runtime.dynCall("v", n) : Runtime.dynCall("vi", n, [r.arg]) : n(void 0 === r.arg ? null : r.arg)
                } else r()
            }
        }

        function preRun() {
            if (Module.preRun)
                for ("function" == typeof Module.preRun && (Module.preRun = [Module.preRun]); Module.preRun.length;) addOnPreRun(Module.preRun.shift());
            callRuntimeCallbacks(__ATPRERUN__)
        }

        function ensureInitRuntime() {
            runtimeInitialized || (runtimeInitialized = !0, callRuntimeCallbacks(__ATINIT__))
        }

        function preMain() {
            callRuntimeCallbacks(__ATMAIN__)
        }

        function exitRuntime() {
            callRuntimeCallbacks(__ATEXIT__), runtimeExited = !0
        }

        function postRun() {
            if (Module.postRun)
                for ("function" == typeof Module.postRun && (Module.postRun = [Module.postRun]); Module.postRun.length;) addOnPostRun(Module.postRun.shift());
            callRuntimeCallbacks(__ATPOSTRUN__)
        }

        function addOnPreRun(e) {
            __ATPRERUN__.unshift(e)
        }

        function addOnInit(e) {
            __ATINIT__.unshift(e)
        }

        function addOnPreMain(e) {
            __ATMAIN__.unshift(e)
        }

        function addOnExit(e) {
            __ATEXIT__.unshift(e)
        }

        function addOnPostRun(e) {
            __ATPOSTRUN__.unshift(e)
        }

        function intArrayFromString(e, r, n) {
            var t = n > 0 ? n : lengthBytesUTF8(e) + 1,
                o = new Array(t),
                i = stringToUTF8Array(e, o, 0, o.length);
            return r && (o.length = i), o
        }

        function intArrayToString(e) {
            for (var r = [], n = 0; n < e.length; n++) {
                var t = e[n];
                t > 255 && (t &= 255), r.push(String.fromCharCode(t))
            }
            return r.join("")
        }

        function writeStringToMemory(e, r, n) {
            for (var t = intArrayFromString(e, n), o = 0; o < t.length;) {
                var i = t[o];
                HEAP8[r + o >> 0] = i, o += 1
            }
        }

        function writeArrayToMemory(e, r) {
            for (var n = 0; n < e.length; n++) HEAP8[r++ >> 0] = e[n]
        }

        function writeAsciiToMemory(e, r, n) {
            for (var t = 0; t < e.length; ++t) HEAP8[r++ >> 0] = e.charCodeAt(t);
            n || (HEAP8[r >> 0] = 0)
        }

        function unSign(e, r, n) {
            return e >= 0 ? e : r <= 32 ? 2 * Math.abs(1 << r - 1) + e : Math.pow(2, r) + e
        }

        function reSign(e, r, n) {
            if (e <= 0) return e;
            var t = r <= 32 ? Math.abs(1 << r - 1) : Math.pow(2, r - 1);
            return e >= t && (r <= 32 || e > t) && (e = -2 * t + e), e
        }

        function getUniqueRunDependency(e) {
            return e
        }

        function addRunDependency(e) {
            runDependencies++, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies)
        }

        function removeRunDependency(e) {
            if (runDependencies--, Module.monitorRunDependencies && Module.monitorRunDependencies(runDependencies), 0 == runDependencies && (null !== runDependencyWatcher && (clearInterval(runDependencyWatcher), runDependencyWatcher = null), dependenciesFulfilled)) {
                var r = dependenciesFulfilled;
                dependenciesFulfilled = null, r()
            }
        }

        function copyTempFloat(e) {
            HEAP8[tempDoublePtr] = HEAP8[e], HEAP8[tempDoublePtr + 1] = HEAP8[e + 1], HEAP8[tempDoublePtr + 2] = HEAP8[e + 2], HEAP8[tempDoublePtr + 3] = HEAP8[e + 3]
        }

        function copyTempDouble(e) {
            HEAP8[tempDoublePtr] = HEAP8[e], HEAP8[tempDoublePtr + 1] = HEAP8[e + 1], HEAP8[tempDoublePtr + 2] = HEAP8[e + 2], HEAP8[tempDoublePtr + 3] = HEAP8[e + 3], HEAP8[tempDoublePtr + 4] = HEAP8[e + 4], HEAP8[tempDoublePtr + 5] = HEAP8[e + 5], HEAP8[tempDoublePtr + 6] = HEAP8[e + 6], HEAP8[tempDoublePtr + 7] = HEAP8[e + 7]
        }

        function ___setErrNo(e) {
            return Module.___errno_location && (HEAP32[Module.___errno_location() >> 2] = e), e
        }

        function _sysconf(e) {
            switch (e) {
                case 30:
                    return PAGE_SIZE;
                case 85:
                    return totalMemory / PAGE_SIZE;
                case 132:
                case 133:
                case 12:
                case 137:
                case 138:
                case 15:
                case 235:
                case 16:
                case 17:
                case 18:
                case 19:
                case 20:
                case 149:
                case 13:
                case 10:
                case 236:
                case 153:
                case 9:
                case 21:
                case 22:
                case 159:
                case 154:
                case 14:
                case 77:
                case 78:
                case 139:
                case 80:
                case 81:
                case 82:
                case 68:
                case 67:
                case 164:
                case 11:
                case 29:
                case 47:
                case 48:
                case 95:
                case 52:
                case 51:
                case 46:
                    return 200809;
                case 79:
                    return 0;
                case 27:
                case 246:
                case 127:
                case 128:
                case 23:
                case 24:
                case 160:
                case 161:
                case 181:
                case 182:
                case 242:
                case 183:
                case 184:
                case 243:
                case 244:
                case 245:
                case 165:
                case 178:
                case 179:
                case 49:
                case 50:
                case 168:
                case 169:
                case 175:
                case 170:
                case 171:
                case 172:
                case 97:
                case 76:
                case 32:
                case 173:
                case 35:
                    return -1;
                case 176:
                case 177:
                case 7:
                case 155:
                case 8:
                case 157:
                case 125:
                case 126:
                case 92:
                case 93:
                case 129:
                case 130:
                case 131:
                case 94:
                case 91:
                    return 1;
                case 74:
                case 60:
                case 69:
                case 70:
                case 4:
                    return 1024;
                case 31:
                case 42:
                case 72:
                    return 32;
                case 87:
                case 26:
                case 33:
                    return 2147483647;
                case 34:
                case 1:
                    return 47839;
                case 38:
                case 36:
                    return 99;
                case 43:
                case 37:
                    return 2048;
                case 0:
                    return 2097152;
                case 3:
                    return 65536;
                case 28:
                    return 32768;
                case 44:
                    return 32767;
                case 75:
                    return 16384;
                case 39:
                    return 1e3;
                case 89:
                    return 700;
                case 71:
                    return 256;
                case 40:
                    return 255;
                case 2:
                    return 100;
                case 180:
                    return 64;
                case 25:
                    return 20;
                case 5:
                    return 16;
                case 6:
                    return 6;
                case 73:
                    return 4;
                case 84:
                    return "object" == typeof navigator ? navigator.hardwareConcurrency || 1 : 1
            }
            return ___setErrNo(ERRNO_CODES.EINVAL), -1
        }

        function _pthread_cleanup_push(e, r) {
            __ATEXIT__.push(function () {
                Runtime.dynCall("vi", e, [r])
            }), _pthread_cleanup_push.level = __ATEXIT__.length
        }

        function _pthread_cleanup_pop() {
            assert(_pthread_cleanup_push.level == __ATEXIT__.length, "cannot pop if something else added meanwhile!"), __ATEXIT__.pop(), _pthread_cleanup_push.level = __ATEXIT__.length
        }

        function _abort() {
            Module.abort()
        }

        function ___assert_fail(e, r, n, t) {
            throw ABORT = !0, "Assertion failed: " + Pointer_stringify(e) + ", at: " + [r ? Pointer_stringify(r) : "unknown filename", n, t ? Pointer_stringify(t) : "unknown function"] + " at " + stackTrace()
        }

        function ___lock() {}

        function ___unlock() {}

        function ___syscall6(e, r) {
            SYSCALLS.varargs = r;
            try {
                var n = SYSCALLS.getStreamFromFD();
                return FS.close(n), 0
            } catch (t) {
                return "undefined" != typeof FS && t instanceof FS.ErrnoError || abort(t), -t.errno
            }
        }

        function _sbrk(e) {
            var r = _sbrk;
            r.called || (DYNAMICTOP = alignMemoryPage(DYNAMICTOP), r.called = !0, assert(Runtime.dynamicAlloc), r.alloc = Runtime.dynamicAlloc, Runtime.dynamicAlloc = function () {
                abort("cannot dynamically allocate, sbrk now has control")
            });
            var n = DYNAMICTOP;
            if (0 != e) {
                var t = r.alloc(e);
                if (!t) return -1 >>> 0
            }
            return n
        }

        function _emscripten_memcpy_big(e, r, n) {
            return HEAPU8.set(HEAPU8.subarray(r, r + n), e), e
        }

        function _emscripten_set_main_loop_timing(e, r) {
            function n(e) {
                e.source === window && e.data === o && (e.stopPropagation(), t.shift()())
            }
            if (Browser.mainLoop.timingMode = e, Browser.mainLoop.timingValue = r, !Browser.mainLoop.func) return 1;
            if (0 == e) Browser.mainLoop.scheduler = function () {
                setTimeout(Browser.mainLoop.runner, r)
            }, Browser.mainLoop.method = "timeout";
            else if (1 == e) Browser.mainLoop.scheduler = function () {
                Browser.requestAnimationFrame(Browser.mainLoop.runner)
            }, Browser.mainLoop.method = "rAF";
            else if (2 == e) {
                if (!window.setImmediate) {
                    var t = [],
                        o = "__emcc";
                    window.addEventListener("message", n, !0), window.setImmediate = function (e) {
                        t.push(e), window.postMessage(o, "*")
                    }
                }
                Browser.mainLoop.scheduler = function () {
                    window.setImmediate(Browser.mainLoop.runner)
                }, Browser.mainLoop.method = "immediate"
            }
            return 0
        }

        function _emscripten_set_main_loop(e, r, n, t, o) {
            Module.noExitRuntime = !0, assert(!Browser.mainLoop.func, "emscripten_set_main_loop: there can only be one main loop function at once: call emscripten_cancel_main_loop to cancel the previous one before setting a new one with different parameters."), Browser.mainLoop.func = e, Browser.mainLoop.arg = t;
            var i = Browser.mainLoop.currentlyRunningMainloop;
            if (Browser.mainLoop.runner = function () {
                    if (!ABORT) {
                        if (Browser.mainLoop.queue.length > 0) {
                            var r = Date.now(),
                                n = Browser.mainLoop.queue.shift();
                            if (n.func(n.arg), Browser.mainLoop.remainingBlockers) {
                                var o = Browser.mainLoop.remainingBlockers,
                                    a = o % 1 == 0 ? o - 1 : Math.floor(o);
                                n.counted ? Browser.mainLoop.remainingBlockers = a : (a += .5, Browser.mainLoop.remainingBlockers = (8 * o + a) / 9)
                            }
                            return console.log('main loop blocker "' + n.name + '" took ' + (Date.now() - r) + " ms"), Browser.mainLoop.updateStatus(), void setTimeout(Browser.mainLoop.runner, 0)
                        }
                        if (!(i < Browser.mainLoop.currentlyRunningMainloop)) {
                            if (Browser.mainLoop.currentFrameNumber = Browser.mainLoop.currentFrameNumber + 1 | 0, 1 == Browser.mainLoop.timingMode && Browser.mainLoop.timingValue > 1 && Browser.mainLoop.currentFrameNumber % Browser.mainLoop.timingValue != 0) return void Browser.mainLoop.scheduler();
                            "timeout" === Browser.mainLoop.method && Module.ctx && (Module.printErr("Looks like you are rendering without using requestAnimationFrame for the main loop. You should use 0 for the frame rate in emscripten_set_main_loop in order to use requestAnimationFrame, as that can greatly improve your frame rates!"), Browser.mainLoop.method = ""), Browser.mainLoop.runIter(function () {
                                "undefined" != typeof t ? Runtime.dynCall("vi", e, [t]) : Runtime.dynCall("v", e)
                            }), i < Browser.mainLoop.currentlyRunningMainloop || ("object" == typeof SDL && SDL.audio && SDL.audio.queueNewAudioData && SDL.audio.queueNewAudioData(), Browser.mainLoop.scheduler())
                        }
                    }
                }, o || (r && r > 0 ? _emscripten_set_main_loop_timing(0, 1e3 / r) : _emscripten_set_main_loop_timing(1, 1), Browser.mainLoop.scheduler()), n) throw "SimulateInfiniteLoop"
        }

        function _time(e) {
            var r = Date.now() / 1e3 | 0;
            return e && (HEAP32[e >> 2] = r), r
        }

        function _pthread_self() {
            return 0
        }

        function ___syscall140(e, r) {
            SYSCALLS.varargs = r;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    o = SYSCALLS.get(),
                    i = SYSCALLS.get(),
                    a = SYSCALLS.get(),
                    u = o;
                return assert(0 === t), FS.llseek(n, u, a), HEAP32[i >> 2] = n.position, n.getdents && 0 === u && 0 === a && (n.getdents = null), 0
            } catch (s) {
                return "undefined" != typeof FS && s instanceof FS.ErrnoError || abort(s), -s.errno
            }
        }

        function ___syscall146(e, r) {
            SYSCALLS.varargs = r;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get(),
                    o = SYSCALLS.get();
                return SYSCALLS.doWritev(n, t, o)
            } catch (i) {
                return "undefined" != typeof FS && i instanceof FS.ErrnoError || abort(i), -i.errno
            }
        }

        function ___syscall54(e, r) {
            SYSCALLS.varargs = r;
            try {
                var n = SYSCALLS.getStreamFromFD(),
                    t = SYSCALLS.get();
                switch (t) {
                    case 21505:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    case 21506:
                        return n.tty ? 0 : -ERRNO_CODES.ENOTTY;
                    case 21519:
                        if (!n.tty) return -ERRNO_CODES.ENOTTY;
                        var o = SYSCALLS.get();
                        return HEAP32[o >> 2] = 0, 0;
                    case 21520:
                        return n.tty ? -ERRNO_CODES.EINVAL : -ERRNO_CODES.ENOTTY;
                    case 21531:
                        var o = SYSCALLS.get();
                        return FS.ioctl(n, t, o);
                    default:
                        abort("bad ioctl syscall " + t)
                }
            } catch (i) {
                return "undefined" != typeof FS && i instanceof FS.ErrnoError || abort(i), -i.errno
            }
        }

        function invoke_ii(e, r) {
            try {
                return Module.dynCall_ii(e, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n) throw n;
                asm.setThrew(1, 0)
            }
        }

        function jsCall_ii(e, r) {
            return Runtime.functionPointers[e](r)
        }

        function invoke_iiii(e, r, n, t) {
            try {
                return Module.dynCall_iiii(e, r, n, t)
            } catch (o) {
                if ("number" != typeof o && "longjmp" !== o) throw o;
                asm.setThrew(1, 0)
            }
        }

        function jsCall_iiii(e, r, n, t) {
            return Runtime.functionPointers[e](r, n, t)
        }

        function invoke_viiii(e, r, n, t, o) {
            try {
                Module.dynCall_viiii(e, r, n, t, o)
            } catch (i) {
                if ("number" != typeof i && "longjmp" !== i) throw i;
                asm.setThrew(1, 0)
            }
        }

        function jsCall_viiii(e, r, n, t, o) {
            Runtime.functionPointers[e](r, n, t, o)
        }

        function invoke_vi(e, r) {
            try {
                Module.dynCall_vi(e, r)
            } catch (n) {
                if ("number" != typeof n && "longjmp" !== n) throw n;
                asm.setThrew(1, 0)
            }
        }

        function jsCall_vi(e, r) {
            Runtime.functionPointers[e](r)
        }

        function ExitStatus(e) {
            this.name = "ExitStatus", this.message = "Program terminated with exit(" + e + ")", this.status = e
        }

        function run(e) {
            function r() {
                Module.calledRun || (Module.calledRun = !0, ABORT || (ensureInitRuntime(), preMain(), Module.onRuntimeInitialized && Module.onRuntimeInitialized(), Module._main && shouldRunNow && Module.callMain(e), postRun()))
            }
            e = e || Module.arguments, null === preloadStartTime && (preloadStartTime = Date.now()), runDependencies > 0 || (preRun(), runDependencies > 0 || Module.calledRun || (Module.setStatus ? (Module.setStatus("Running..."), setTimeout(function () {
                setTimeout(function () {
                    Module.setStatus("")
                }, 1), r()
            }, 1)) : r()))
        }

        function exit(e, r) {
            if (!r || !Module.noExitRuntime) throw Module.noExitRuntime || (ABORT = !0, EXITSTATUS = e, STACKTOP = initialStackTop, exitRuntime(), Module.onExit && Module.onExit(e)), ENVIRONMENT_IS_NODE ? (process.stdout.once("drain", function () {
                process.exit(e)
            }), console.log(" "), setTimeout(function () {
                process.exit(e)
            }, 500)) : ENVIRONMENT_IS_SHELL && "function" == typeof quit && quit(e), new ExitStatus(e)
        }

        function abort(e) {
            void 0 !== e ? (Module.print(e), Module.printErr(e), e = JSON.stringify(e)) : e = "", ABORT = !0, EXITSTATUS = 1;
            var r = "\nIf this abort() is unexpected, build with -s ASSERTIONS=1 which can give more information.",
                n = "abort(" + e + ") at " + stackTrace() + r;
            throw abortDecorators && abortDecorators.forEach(function (r) {
                n = r(n, e)
            }), n
        }
        var Module;
        Module || (Module = ("undefined" != typeof Module ? Module : null) || {});
        var moduleOverrides = {};
        for (var key in Module) Module.hasOwnProperty(key) && (moduleOverrides[key] = Module[key]);
        var ENVIRONMENT_IS_WEB = "object" == typeof window,
            ENVIRONMENT_IS_WORKER = "function" == typeof importScripts,
            ENVIRONMENT_IS_NODE = "object" == typeof process && "function" == typeof require && !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER,
            ENVIRONMENT_IS_SHELL = !ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_NODE && !ENVIRONMENT_IS_WORKER;
        if (ENVIRONMENT_IS_NODE) {
            Module.print || (Module.print = function (e) {
                process.stdout.write(e + "\n")
            }), Module.printErr || (Module.printErr = function (e) {
                process.stderr.write(e + "\n")
            });
            var nodeFS = require("fs"),
                nodePath = require("path");
            Module.read = function (e, r) {
                e = nodePath.normalize(e);
                var n = nodeFS.readFileSync(e);
                return n || e == nodePath.resolve(e) || (e = path.join(__dirname, "..", "src", e), n = nodeFS.readFileSync(e)), n && !r && (n = n.toString()), n
            }, Module.readBinary = function (e) {
                var r = Module.read(e, !0);
                return r.buffer || (r = new Uint8Array(r)), assert(r.buffer), r
            }, Module.load = function (e) {
                globalEval(read(e))
            }, Module.thisProgram || (process.argv.length > 1 ? Module.thisProgram = process.argv[1].replace(/\\/g, "/") : Module.thisProgram = "unknown-program"), Module.arguments = process.argv.slice(2), "undefined" != typeof module && (module.exports = Module), process.on("uncaughtException", function (e) {
                if (!(e instanceof ExitStatus)) throw e
            }), Module.inspect = function () {
                return "[Emscripten Module object]"
            }
        } else if (ENVIRONMENT_IS_SHELL) Module.print || (Module.print = print), "undefined" != typeof printErr && (Module.printErr = printErr), "undefined" != typeof read ? Module.read = read : Module.read = function () {
            throw "no read() available (jsc?)"
        }, Module.readBinary = function (e) {
            if ("function" == typeof readbuffer) return new Uint8Array(readbuffer(e));
            var r = read(e, "binary");
            return assert("object" == typeof r), r
        }, "undefined" != typeof scriptArgs ? Module.arguments = scriptArgs : "undefined" != typeof arguments && (Module.arguments = arguments);
        else {
            if (!ENVIRONMENT_IS_WEB && !ENVIRONMENT_IS_WORKER) throw "Unknown runtime environment. Where are we?";
            if (Module.read = function (e) {
                    var r = new XMLHttpRequest;
                    return r.open("GET", e, !1), r.send(null), r.responseText
                }, "undefined" != typeof arguments && (Module.arguments = arguments), "undefined" != typeof console) Module.print || (Module.print = function (e) {
                console.log(e)
            }), Module.printErr || (Module.printErr = function (e) {
                console.log(e)
            });
            else {
                var TRY_USE_DUMP = !1;
                Module.print || (Module.print = TRY_USE_DUMP && "undefined" != typeof dump ? function (e) {
                    dump(e)
                } : function (e) {})
            }
            ENVIRONMENT_IS_WORKER && (Module.load = importScripts), "undefined" == typeof Module.setWindowTitle && (Module.setWindowTitle = function (e) {
                document.title = e
            })
        }!Module.load && Module.read && (Module.load = function (e) {
            globalEval(Module.read(e))
        }), Module.print || (Module.print = function () {}), Module.printErr || (Module.printErr = Module.print), Module.arguments || (Module.arguments = []), Module.thisProgram || (Module.thisProgram = "./this.program"), Module.print = Module.print, Module.printErr = Module.printErr, Module.preRun = [], Module.postRun = [];
        for (var key in moduleOverrides) moduleOverrides.hasOwnProperty(key) && (Module[key] = moduleOverrides[key]);
        var Runtime = {
            setTempRet0: function (e) {
                tempRet0 = e
            },
            getTempRet0: function () {
                return tempRet0
            },
            stackSave: function () {
                return STACKTOP
            },
            stackRestore: function (e) {
                STACKTOP = e
            },
            getNativeTypeSize: function (e) {
                switch (e) {
                    case "i1":
                    case "i8":
                        return 1;
                    case "i16":
                        return 2;
                    case "i32":
                        return 4;
                    case "i64":
                        return 8;
                    case "float":
                        return 4;
                    case "double":
                        return 8;
                    default:
                        if ("*" === e[e.length - 1]) return Runtime.QUANTUM_SIZE;
                        if ("i" === e[0]) {
                            var r = parseInt(e.substr(1));
                            return assert(r % 8 === 0), r / 8
                        }
                        return 0
                }
            },
            getNativeFieldSize: function (e) {
                return Math.max(Runtime.getNativeTypeSize(e), Runtime.QUANTUM_SIZE)
            },
            STACK_ALIGN: 16,
            prepVararg: function (e, r) {
                return "double" === r || "i64" === r ? 7 & e && (assert(4 === (7 & e)), e += 4) : assert(0 === (3 & e)), e
            },
            getAlignSize: function (e, r, n) {
                return n || "i64" != e && "double" != e ? e ? Math.min(r || (e ? Runtime.getNativeFieldSize(e) : 0), Runtime.QUANTUM_SIZE) : Math.min(r, 8) : 8
            },
            dynCall: function (e, r, n) {
                return n && n.length ? (n.splice || (n = Array.prototype.slice.call(n)), n.splice(0, 0, r), Module["dynCall_" + e].apply(null, n)) : Module["dynCall_" + e].call(null, r)
            },
            functionPointers: [null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null, null],
            addFunction: function (e) {
                for (var r = 0; r < Runtime.functionPointers.length; r++)
                    if (!Runtime.functionPointers[r]) return Runtime.functionPointers[r] = e, 2 * (1 + r);
                throw "Finished up all reserved function pointers. Use a higher value for RESERVED_FUNCTION_POINTERS."
            },
            removeFunction: function (e) {
                Runtime.functionPointers[(e - 2) / 2] = null
            },
            warnOnce: function (e) {
                Runtime.warnOnce.shown || (Runtime.warnOnce.shown = {}), Runtime.warnOnce.shown[e] || (Runtime.warnOnce.shown[e] = 1, Module.printErr(e))
            },
            funcWrappers: {},
            getFuncWrapper: function (e, r) {
                assert(r), Runtime.funcWrappers[r] || (Runtime.funcWrappers[r] = {});
                var n = Runtime.funcWrappers[r];
                return n[e] || (n[e] = function () {
                    return Runtime.dynCall(r, e, arguments)
                }), n[e]
            },
            getCompilerSetting: function (e) {
                throw "You must build with -s RETAIN_COMPILER_SETTINGS=1 for Runtime.getCompilerSetting or emscripten_get_compiler_setting to work"
            },
            stackAlloc: function (e) {
                var r = STACKTOP;
                return STACKTOP = STACKTOP + e | 0, STACKTOP = STACKTOP + 15 & -16, r
            },
            staticAlloc: function (e) {
                var r = STATICTOP;
                return STATICTOP = STATICTOP + e | 0, STATICTOP = STATICTOP + 15 & -16, r
            },
            dynamicAlloc: function (e) {
                var r = DYNAMICTOP;
                if (DYNAMICTOP = DYNAMICTOP + e | 0, DYNAMICTOP = DYNAMICTOP + 15 & -16, DYNAMICTOP >= TOTAL_MEMORY) {
                    var n = enlargeMemory();
                    if (!n) return DYNAMICTOP = r, 0
                }
                return r
            },
            alignMemory: function (e, r) {
                var n = e = Math.ceil(e / (r ? r : 16)) * (r ? r : 16);
                return n
            },
            makeBigInt: function (e, r, n) {
                var t = n ? +(e >>> 0) + 4294967296 * +(r >>> 0) : +(e >>> 0) + 4294967296 * +(0 | r);
                return t
            },
            GLOBAL_BASE: 8,
            QUANTUM_SIZE: 4,
            __dummy__: 0
        };
        Module.Runtime = Runtime;
        var __THREW__ = 0,
            ABORT = !1,
            EXITSTATUS = 0,
            undef = 0,
            tempValue, tempInt, tempBigInt, tempInt2, tempBigInt2, tempPair, tempBigIntI, tempBigIntR, tempBigIntS, tempBigIntP, tempBigIntD, tempDouble, tempFloat, tempI64, tempI64b, tempRet0, tempRet1, tempRet2, tempRet3, tempRet4, tempRet5, tempRet6, tempRet7, tempRet8, tempRet9, globalScope = this,
            cwrap, ccall;
        ! function () {
            function parseJSFunc(e) {
                var r = e.toString().match(sourceRegex).slice(1);
                return {
                    arguments: r[0],
                    body: r[1],
                    returnValue: r[2]
                }
            }
            var JSfuncs = {
                    stackSave: function () {
                        Runtime.stackSave()
                    },
                    stackRestore: function () {
                        Runtime.stackRestore()
                    },
                    arrayToC: function (e) {
                        var r = Runtime.stackAlloc(e.length);
                        return writeArrayToMemory(e, r), r
                    },
                    stringToC: function (e) {
                        var r = 0;
                        return null !== e && void 0 !== e && 0 !== e && (r = Runtime.stackAlloc((e.length << 2) + 1), writeStringToMemory(e, r)), r
                    }
                },
                toC = {
                    string: JSfuncs.stringToC,
                    array: JSfuncs.arrayToC
                };
            ccall = function (e, r, n, t, o) {
                var i = getCFunc(e),
                    a = [],
                    u = 0;
                if (t)
                    for (var s = 0; s < t.length; s++) {
                        var l = toC[n[s]];
                        l ? (0 === u && (u = Runtime.stackSave()), a[s] = l(t[s])) : a[s] = t[s]
                    }
                var c = i.apply(null, a);
                if ("string" === r && (c = Pointer_stringify(c)), 0 !== u) {
                    if (o && o.async) return void EmterpreterAsync.asyncFinalizers.push(function () {
                        Runtime.stackRestore(u)
                    });
                    Runtime.stackRestore(u)
                }
                return c
            };
            var sourceRegex = /^function\s*\(([^)]*)\)\s*{\s*([^*]*?)[\s;]*(?:return\s*(.*?)[;\s]*)?}$/,
                JSsource = {};
            for (var fun in JSfuncs) JSfuncs.hasOwnProperty(fun) && (JSsource[fun] = parseJSFunc(JSfuncs[fun]));
            cwrap = function cwrap(ident, returnType, argTypes) {
                argTypes = argTypes || [];
                var cfunc = getCFunc(ident),
                    numericArgs = argTypes.every(function (e) {
                        return "number" === e
                    }),
                    numericRet = "string" !== returnType;
                if (numericRet && numericArgs) return cfunc;
                var argNames = argTypes.map(function (e, r) {
                        return "$" + r
                    }),
                    funcstr = "(function(" + argNames.join(",") + ") {",
                    nargs = argTypes.length;
                if (!numericArgs) {
                    funcstr += "var stack = " + JSsource.stackSave.body + ";";
                    for (var i = 0; i < nargs; i++) {
                        var arg = argNames[i],
                            type = argTypes[i];
                        if ("number" !== type) {
                            var convertCode = JSsource[type + "ToC"];
                            funcstr += "var " + convertCode.arguments + " = " + arg + ";", funcstr += convertCode.body + ";", funcstr += arg + "=" + convertCode.returnValue + ";"
                        }
                    }
                }
                var cfuncname = parseJSFunc(function () {
                    return cfunc
                }).returnValue;
                if (funcstr += "var ret = " + cfuncname + "(" + argNames.join(",") + ");", !numericRet) {
                    var strgfy = parseJSFunc(function () {
                        return Pointer_stringify
                    }).returnValue;
                    funcstr += "ret = " + strgfy + "(ret);"
                }
                return numericArgs || (funcstr += JSsource.stackRestore.body.replace("()", "(stack)") + ";"), funcstr += "return ret})", eval(funcstr)
            }
        }(), Module.ccall = ccall, Module.cwrap = cwrap, Module.setValue = setValue, Module.getValue = getValue;
        var ALLOC_NORMAL = 0,
            ALLOC_STACK = 1,
            ALLOC_STATIC = 2,
            ALLOC_DYNAMIC = 3,
            ALLOC_NONE = 4;
        Module.ALLOC_NORMAL = ALLOC_NORMAL, Module.ALLOC_STACK = ALLOC_STACK, Module.ALLOC_STATIC = ALLOC_STATIC, Module.ALLOC_DYNAMIC = ALLOC_DYNAMIC, Module.ALLOC_NONE = ALLOC_NONE, Module.allocate = allocate, Module.getMemory = getMemory, Module.Pointer_stringify = Pointer_stringify, Module.AsciiToString = AsciiToString, Module.stringToAscii = stringToAscii, Module.UTF8ArrayToString = UTF8ArrayToString, Module.UTF8ToString = UTF8ToString, Module.stringToUTF8Array = stringToUTF8Array, Module.stringToUTF8 = stringToUTF8, Module.lengthBytesUTF8 = lengthBytesUTF8, Module.UTF16ToString = UTF16ToString, Module.stringToUTF16 = stringToUTF16, Module.lengthBytesUTF16 = lengthBytesUTF16, Module.UTF32ToString = UTF32ToString, Module.stringToUTF32 = stringToUTF32, Module.lengthBytesUTF32 = lengthBytesUTF32, Module.stackTrace = stackTrace;
        for (var PAGE_SIZE = 4096, HEAP, HEAP8, HEAPU8, HEAP16, HEAPU16, HEAP32, HEAPU32, HEAPF32, HEAPF64, STATIC_BASE = 0, STATICTOP = 0, staticSealed = !1, STACK_BASE = 0, STACKTOP = 0, STACK_MAX = 0, DYNAMIC_BASE = 0, DYNAMICTOP = 0, TOTAL_STACK = Module.TOTAL_STACK || 5242880, TOTAL_MEMORY = Module.TOTAL_MEMORY || 16777216, totalMemory = 65536; totalMemory < TOTAL_MEMORY || totalMemory < 2 * TOTAL_STACK;) totalMemory < 16777216 ? totalMemory *= 2 : totalMemory += 16777216;
        totalMemory !== TOTAL_MEMORY && (TOTAL_MEMORY = totalMemory), assert("undefined" != typeof Int32Array && "undefined" != typeof Float64Array && !!new Int32Array(1).subarray && !!new Int32Array(1).set, "JS engine does not provide full typed array support");
        var buffer;
        buffer = new ArrayBuffer(TOTAL_MEMORY), HEAP8 = new Int8Array(buffer), HEAP16 = new Int16Array(buffer), HEAP32 = new Int32Array(buffer), HEAPU8 = new Uint8Array(buffer), HEAPU16 = new Uint16Array(buffer), HEAPU32 = new Uint32Array(buffer), HEAPF32 = new Float32Array(buffer), HEAPF64 = new Float64Array(buffer), HEAP32[0] = 255, assert(255 === HEAPU8[0] && 0 === HEAPU8[3], "Typed arrays 2 must be run on a little-endian system"), Module.HEAP = HEAP, Module.buffer = buffer, Module.HEAP8 = HEAP8, Module.HEAP16 = HEAP16, Module.HEAP32 = HEAP32, Module.HEAPU8 = HEAPU8, Module.HEAPU16 = HEAPU16, Module.HEAPU32 = HEAPU32, Module.HEAPF32 = HEAPF32, Module.HEAPF64 = HEAPF64;
        var __ATPRERUN__ = [],
            __ATINIT__ = [],
            __ATMAIN__ = [],
            __ATEXIT__ = [],
            __ATPOSTRUN__ = [],
            runtimeInitialized = !1,
            runtimeExited = !1;
        Module.addOnPreRun = addOnPreRun, Module.addOnInit = addOnInit, Module.addOnPreMain = addOnPreMain, Module.addOnExit = addOnExit, Module.addOnPostRun = addOnPostRun, Module.intArrayFromString = intArrayFromString, Module.intArrayToString = intArrayToString, Module.writeStringToMemory = writeStringToMemory, Module.writeArrayToMemory = writeArrayToMemory, Module.writeAsciiToMemory = writeAsciiToMemory, Math.imul && Math.imul(4294967295, 5) === -5 || (Math.imul = function (e, r) {
            var n = e >>> 16,
                t = 65535 & e,
                o = r >>> 16,
                i = 65535 & r;
            return t * i + (n * i + t * o << 16) | 0
        }), Math.imul = Math.imul, Math.clz32 || (Math.clz32 = function (e) {
            e >>>= 0;
            for (var r = 0; r < 32; r++)
                if (e & 1 << 31 - r) return r;
            return 32
        }), Math.clz32 = Math.clz32;
        var Math_abs = Math.abs,
            Math_cos = Math.cos,
            Math_sin = Math.sin,
            Math_tan = Math.tan,
            Math_acos = Math.acos,
            Math_asin = Math.asin,
            Math_atan = Math.atan,
            Math_atan2 = Math.atan2,
            Math_exp = Math.exp,
            Math_log = Math.log,
            Math_sqrt = Math.sqrt,
            Math_ceil = Math.ceil,
            Math_floor = Math.floor,
            Math_pow = Math.pow,
            Math_imul = Math.imul,
            Math_fround = Math.fround,
            Math_min = Math.min,
            Math_clz32 = Math.clz32,
            runDependencies = 0,
            runDependencyWatcher = null,
            dependenciesFulfilled = null;
        Module.addRunDependency = addRunDependency, Module.removeRunDependency = removeRunDependency, Module.preloadedImages = {}, Module.preloadedAudios = {};
        var memoryInitializer = null,
            ASM_CONSTS = [];
        STATIC_BASE = 8, STATICTOP = STATIC_BASE + 2960, __ATINIT__.push(), allocate([0, 0, 0, 0, 183, 29, 193, 4, 110, 59, 130, 9, 217, 38, 67, 13, 220, 118, 4, 19, 107, 107, 197, 23, 178, 77, 134, 26, 5, 80, 71, 30, 184, 237, 8, 38, 15, 240, 201, 34, 214, 214, 138, 47, 97, 203, 75, 43, 100, 155, 12, 53, 211, 134, 205, 49, 10, 160, 142, 60, 189, 189, 79, 56, 112, 219, 17, 76, 199, 198, 208, 72, 30, 224, 147, 69, 169, 253, 82, 65, 172, 173, 21, 95, 27, 176, 212, 91, 194, 150, 151, 86, 117, 139, 86, 82, 200, 54, 25, 106, 127, 43, 216, 110, 166, 13, 155, 99, 17, 16, 90, 103, 20, 64, 29, 121, 163, 93, 220, 125, 122, 123, 159, 112, 205, 102, 94, 116, 224, 182, 35, 152, 87, 171, 226, 156, 142, 141, 161, 145, 57, 144, 96, 149, 60, 192, 39, 139, 139, 221, 230, 143, 82, 251, 165, 130, 229, 230, 100, 134, 88, 91, 43, 190, 239, 70, 234, 186, 54, 96, 169, 183, 129, 125, 104, 179, 132, 45, 47, 173, 51, 48, 238, 169, 234, 22, 173, 164, 93, 11, 108, 160, 144, 109, 50, 212, 39, 112, 243, 208, 254, 86, 176, 221, 73, 75, 113, 217, 76, 27, 54, 199, 251, 6, 247, 195, 34, 32, 180, 206, 149, 61, 117, 202, 40, 128, 58, 242, 159, 157, 251, 246, 70, 187, 184, 251, 241, 166, 121, 255, 244, 246, 62, 225, 67, 235, 255, 229, 154, 205, 188, 232, 45, 208, 125, 236, 119, 112, 134, 52, 192, 109, 71, 48, 25, 75, 4, 61, 174, 86, 197, 57, 171, 6, 130, 39, 28, 27, 67, 35, 197, 61, 0, 46, 114, 32, 193, 42, 207, 157, 142, 18, 120, 128, 79, 22, 161, 166, 12, 27, 22, 187, 205, 31, 19, 235, 138, 1, 164, 246, 75, 5, 125, 208, 8, 8, 202, 205, 201, 12, 7, 171, 151, 120, 176, 182, 86, 124, 105, 144, 21, 113, 222, 141, 212, 117, 219, 221, 147, 107, 108, 192, 82, 111, 181, 230, 17, 98, 2, 251, 208, 102, 191, 70, 159, 94, 8, 91, 94, 90, 209, 125, 29, 87, 102, 96, 220, 83, 99, 48, 155, 77, 212, 45, 90, 73, 13, 11, 25, 68, 186, 22, 216, 64, 151, 198, 165, 172, 32, 219, 100, 168, 249, 253, 39, 165, 78, 224, 230, 161, 75, 176, 161, 191, 252, 173, 96, 187, 37, 139, 35, 182, 146, 150, 226, 178, 47, 43, 173, 138, 152, 54, 108, 142, 65, 16, 47, 131, 246, 13, 238, 135, 243, 93, 169, 153, 68, 64, 104, 157, 157, 102, 43, 144, 42, 123, 234, 148, 231, 29, 180, 224, 80, 0, 117, 228, 137, 38, 54, 233, 62, 59, 247, 237, 59, 107, 176, 243, 140, 118, 113, 247, 85, 80, 50, 250, 226, 77, 243, 254, 95, 240, 188, 198, 232, 237, 125, 194, 49, 203, 62, 207, 134, 214, 255, 203, 131, 134, 184, 213, 52, 155, 121, 209, 237, 189, 58, 220, 90, 160, 251, 216, 238, 224, 12, 105, 89, 253, 205, 109, 128, 219, 142, 96, 55, 198, 79, 100, 50, 150, 8, 122, 133, 139, 201, 126, 92, 173, 138, 115, 235, 176, 75, 119, 86, 13, 4, 79, 225, 16, 197, 75, 56, 54, 134, 70, 143, 43, 71, 66, 138, 123, 0, 92, 61, 102, 193, 88, 228, 64, 130, 85, 83, 93, 67, 81, 158, 59, 29, 37, 41, 38, 220, 33, 240, 0, 159, 44, 71, 29, 94, 40, 66, 77, 25, 54, 245, 80, 216, 50, 44, 118, 155, 63, 155, 107, 90, 59, 38, 214, 21, 3, 145, 203, 212, 7, 72, 237, 151, 10, 255, 240, 86, 14, 250, 160, 17, 16, 77, 189, 208, 20, 148, 155, 147, 25, 35, 134, 82, 29, 14, 86, 47, 241, 185, 75, 238, 245, 96, 109, 173, 248, 215, 112, 108, 252, 210, 32, 43, 226, 101, 61, 234, 230, 188, 27, 169, 235, 11, 6, 104, 239, 182, 187, 39, 215, 1, 166, 230, 211, 216, 128, 165, 222, 111, 157, 100, 218, 106, 205, 35, 196, 221, 208, 226, 192, 4, 246, 161, 205, 179, 235, 96, 201, 126, 141, 62, 189, 201, 144, 255, 185, 16, 182, 188, 180, 167, 171, 125, 176, 162, 251, 58, 174, 21, 230, 251, 170, 204, 192, 184, 167, 123, 221, 121, 163, 198, 96, 54, 155, 113, 125, 247, 159, 168, 91, 180, 146, 31, 70, 117, 150, 26, 22, 50, 136, 173, 11, 243, 140, 116, 45, 176, 129, 195, 48, 113, 133, 153, 144, 138, 93, 46, 141, 75, 89, 247, 171, 8, 84, 64, 182, 201, 80, 69, 230, 142, 78, 242, 251, 79, 74, 43, 221, 12, 71, 156, 192, 205, 67, 33, 125, 130, 123, 150, 96, 67, 127, 79, 70, 0, 114, 248, 91, 193, 118, 253, 11, 134, 104, 74, 22, 71, 108, 147, 48, 4, 97, 36, 45, 197, 101, 233, 75, 155, 17, 94, 86, 90, 21, 135, 112, 25, 24, 48, 109, 216, 28, 53, 61, 159, 2, 130, 32, 94, 6, 91, 6, 29, 11, 236, 27, 220, 15, 81, 166, 147, 55, 230, 187, 82, 51, 63, 157, 17, 62, 136, 128, 208, 58, 141, 208, 151, 36, 58, 205, 86, 32, 227, 235, 21, 45, 84, 246, 212, 41, 121, 38, 169, 197, 206, 59, 104, 193, 23, 29, 43, 204, 160, 0, 234, 200, 165, 80, 173, 214, 18, 77, 108, 210, 203, 107, 47, 223, 124, 118, 238, 219, 193, 203, 161, 227, 118, 214, 96, 231, 175, 240, 35, 234, 24, 237, 226, 238, 29, 189, 165, 240, 170, 160, 100, 244, 115, 134, 39, 249, 196, 155, 230, 253, 9, 253, 184, 137, 190, 224, 121, 141, 103, 198, 58, 128, 208, 219, 251, 132, 213, 139, 188, 154, 98, 150, 125, 158, 187, 176, 62, 147, 12, 173, 255, 151, 177, 16, 176, 175, 6, 13, 113, 171, 223, 43, 50, 166, 104, 54, 243, 162, 109, 102, 180, 188, 218, 123, 117, 184, 3, 93, 54, 181, 180, 64, 247, 177, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 60, 4, 0, 0, 0, 0, 0, 0, 5, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 102, 0, 0, 0, 103, 0, 0, 0, 134, 7, 0, 0, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 10, 255, 255, 255, 255, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 79, 103, 103, 83, 0, 33, 111, 103, 103, 95, 115, 121, 110, 99, 95, 105, 110, 105, 116, 40, 111, 103, 103, 45, 62, 115, 116, 97, 116, 101, 41, 0, 115, 114, 99, 47, 111, 103, 103, 46, 99, 0, 65, 86, 79, 103, 103, 73, 110, 105, 116, 0, 111, 103, 103, 95, 115, 121, 110, 99, 95, 112, 97, 103, 101, 111, 117, 116, 40, 111, 103, 103, 45, 62, 115, 116, 97, 116, 101, 44, 32, 38, 111, 103, 103, 45, 62, 112, 97, 103, 101, 41, 32, 33, 61, 32, 49, 0, 33, 111, 103, 103, 95, 115, 121, 110, 99, 95, 119, 114, 111, 116, 101, 40, 111, 103, 103, 45, 62, 115, 116, 97, 116, 101, 44, 32, 98, 117, 102, 108, 101, 110, 41, 0, 65, 86, 79, 103, 103, 82, 101, 97, 100, 0, 33, 111, 103, 103, 95, 115, 116, 114, 101, 97, 109, 95, 105, 110, 105, 116, 40, 111, 103, 103, 45, 62, 115, 116, 114, 101, 97, 109, 44, 32, 115, 101, 114, 105, 97, 108, 41, 0, 33, 111, 103, 103, 95, 115, 116, 114, 101, 97, 109, 95, 112, 97, 103, 101, 105, 110, 40, 111, 103, 103, 45, 62, 115, 116, 114, 101, 97, 109, 44, 32, 38, 111, 103, 103, 45, 62, 112, 97, 103, 101, 41, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], "i8", ALLOC_NONE, Runtime.GLOBAL_BASE);
        var tempDoublePtr = Runtime.alignMemory(allocate(12, "i8", ALLOC_STATIC), 8);
        assert(tempDoublePtr % 8 == 0);
        var ERRNO_CODES = {
            EPERM: 1,
            ENOENT: 2,
            ESRCH: 3,
            EINTR: 4,
            EIO: 5,
            ENXIO: 6,
            E2BIG: 7,
            ENOEXEC: 8,
            EBADF: 9,
            ECHILD: 10,
            EAGAIN: 11,
            EWOULDBLOCK: 11,
            ENOMEM: 12,
            EACCES: 13,
            EFAULT: 14,
            ENOTBLK: 15,
            EBUSY: 16,
            EEXIST: 17,
            EXDEV: 18,
            ENODEV: 19,
            ENOTDIR: 20,
            EISDIR: 21,
            EINVAL: 22,
            ENFILE: 23,
            EMFILE: 24,
            ENOTTY: 25,
            ETXTBSY: 26,
            EFBIG: 27,
            ENOSPC: 28,
            ESPIPE: 29,
            EROFS: 30,
            EMLINK: 31,
            EPIPE: 32,
            EDOM: 33,
            ERANGE: 34,
            ENOMSG: 42,
            EIDRM: 43,
            ECHRNG: 44,
            EL2NSYNC: 45,
            EL3HLT: 46,
            EL3RST: 47,
            ELNRNG: 48,
            EUNATCH: 49,
            ENOCSI: 50,
            EL2HLT: 51,
            EDEADLK: 35,
            ENOLCK: 37,
            EBADE: 52,
            EBADR: 53,
            EXFULL: 54,
            ENOANO: 55,
            EBADRQC: 56,
            EBADSLT: 57,
            EDEADLOCK: 35,
            EBFONT: 59,
            ENOSTR: 60,
            ENODATA: 61,
            ETIME: 62,
            ENOSR: 63,
            ENONET: 64,
            ENOPKG: 65,
            EREMOTE: 66,
            ENOLINK: 67,
            EADV: 68,
            ESRMNT: 69,
            ECOMM: 70,
            EPROTO: 71,
            EMULTIHOP: 72,
            EDOTDOT: 73,
            EBADMSG: 74,
            ENOTUNIQ: 76,
            EBADFD: 77,
            EREMCHG: 78,
            ELIBACC: 79,
            ELIBBAD: 80,
            ELIBSCN: 81,
            ELIBMAX: 82,
            ELIBEXEC: 83,
            ENOSYS: 38,
            ENOTEMPTY: 39,
            ENAMETOOLONG: 36,
            ELOOP: 40,
            EOPNOTSUPP: 95,
            EPFNOSUPPORT: 96,
            ECONNRESET: 104,
            ENOBUFS: 105,
            EAFNOSUPPORT: 97,
            EPROTOTYPE: 91,
            ENOTSOCK: 88,
            ENOPROTOOPT: 92,
            ESHUTDOWN: 108,
            ECONNREFUSED: 111,
            EADDRINUSE: 98,
            ECONNABORTED: 103,
            ENETUNREACH: 101,
            ENETDOWN: 100,
            ETIMEDOUT: 110,
            EHOSTDOWN: 112,
            EHOSTUNREACH: 113,
            EINPROGRESS: 115,
            EALREADY: 114,
            EDESTADDRREQ: 89,
            EMSGSIZE: 90,
            EPROTONOSUPPORT: 93,
            ESOCKTNOSUPPORT: 94,
            EADDRNOTAVAIL: 99,
            ENETRESET: 102,
            EISCONN: 106,
            ENOTCONN: 107,
            ETOOMANYREFS: 109,
            EUSERS: 87,
            EDQUOT: 122,
            ESTALE: 116,
            ENOTSUP: 95,
            ENOMEDIUM: 123,
            EILSEQ: 84,
            EOVERFLOW: 75,
            ECANCELED: 125,
            ENOTRECOVERABLE: 131,
            EOWNERDEAD: 130,
            ESTRPIPE: 86
        };
        Module._memset = _memset, Module._bitshift64Shl = _bitshift64Shl;
        var ERRNO_MESSAGES = {
                0: "Success",
                1: "Not super-user",
                2: "No such file or directory",
                3: "No such process",
                4: "Interrupted system call",
                5: "I/O error",
                6: "No such device or address",
                7: "Arg list too long",
                8: "Exec format error",
                9: "Bad file number",
                10: "No children",
                11: "No more processes",
                12: "Not enough core",
                13: "Permission denied",
                14: "Bad address",
                15: "Block device required",
                16: "Mount device busy",
                17: "File exists",
                18: "Cross-device link",
                19: "No such device",
                20: "Not a directory",
                21: "Is a directory",
                22: "Invalid argument",
                23: "Too many open files in system",
                24: "Too many open files",
                25: "Not a typewriter",
                26: "Text file busy",
                27: "File too large",
                28: "No space left on device",
                29: "Illegal seek",
                30: "Read only file system",
                31: "Too many links",
                32: "Broken pipe",
                33: "Math arg out of domain of func",
                34: "Math result not representable",
                35: "File locking deadlock error",
                36: "File or path name too long",
                37: "No record locks available",
                38: "Function not implemented",
                39: "Directory not empty",
                40: "Too many symbolic links",
                42: "No message of desired type",
                43: "Identifier removed",
                44: "Channel number out of range",
                45: "Level 2 not synchronized",
                46: "Level 3 halted",
                47: "Level 3 reset",
                48: "Link number out of range",
                49: "Protocol driver not attached",
                50: "No CSI structure available",
                51: "Level 2 halted",
                52: "Invalid exchange",
                53: "Invalid request descriptor",
                54: "Exchange full",
                55: "No anode",
                56: "Invalid request code",
                57: "Invalid slot",
                59: "Bad font file fmt",
                60: "Device not a stream",
                61: "No data (for no delay io)",
                62: "Timer expired",
                63: "Out of streams resources",
                64: "Machine is not on the network",
                65: "Package not installed",
                66: "The object is remote",
                67: "The link has been severed",
                68: "Advertise error",
                69: "Srmount error",
                70: "Communication error on send",
                71: "Protocol error",
                72: "Multihop attempted",
                73: "Cross mount point (not really error)",
                74: "Trying to read unreadable message",
                75: "Value too large for defined data type",
                76: "Given log. name not unique",
                77: "f.d. invalid for this operation",
                78: "Remote address changed",
                79: "Can   access a needed shared lib",
                80: "Accessing a corrupted shared lib",
                81: ".lib section in a.out corrupted",
                82: "Attempting to link in too many libs",
                83: "Attempting to exec a shared library",
                84: "Illegal byte sequence",
                86: "Streams pipe error",
                87: "Too many users",
                88: "Socket operation on non-socket",
                89: "Destination address required",
                90: "Message too long",
                91: "Protocol wrong type for socket",
                92: "Protocol not available",
                93: "Unknown protocol",
                94: "Socket type not supported",
                95: "Not supported",
                96: "Protocol family not supported",
                97: "Address family not supported by protocol family",
                98: "Address already in use",
                99: "Address not available",
                100: "Network interface is not configured",
                101: "Network is unreachable",
                102: "Connection reset by network",
                103: "Connection aborted",
                104: "Connection reset by peer",
                105: "No buffer space available",
                106: "Socket is already connected",
                107: "Socket is not connected",
                108: "Can't send after socket shutdown",
                109: "Too many references",
                110: "Connection timed out",
                111: "Connection refused",
                112: "Host is down",
                113: "Host is unreachable",
                114: "Socket already connected",
                115: "Connection already in progress",
                116: "Stale file handle",
                122: "Quota exceeded",
                123: "No medium (in tape drive)",
                125: "Operation canceled",
                130: "Previous owner died",
                131: "State not recoverable"
            },
            PATH = {
                splitPath: function (e) {
                    var r = /^(\/?|)([\s\S]*?)((?:\.{1,2}|[^\/]+?|)(\.[^.\/]*|))(?:[\/]*)$/;
                    return r.exec(e).slice(1)
                },
                normalizeArray: function (e, r) {
                    for (var n = 0, t = e.length - 1; t >= 0; t--) {
                        var o = e[t];
                        "." === o ? e.splice(t, 1) : ".." === o ? (e.splice(t, 1), n++) : n && (e.splice(t, 1), n--)
                    }
                    if (r)
                        for (; n--; n) e.unshift("..");
                    return e
                },
                normalize: function (e) {
                    var r = "/" === e.charAt(0),
                        n = "/" === e.substr(-1);
                    return e = PATH.normalizeArray(e.split("/").filter(function (e) {
                        return !!e
                    }), !r).join("/"), e || r || (e = "."), e && n && (e += "/"), (r ? "/" : "") + e
                },
                dirname: function (e) {
                    var r = PATH.splitPath(e),
                        n = r[0],
                        t = r[1];
                    return n || t ? (t && (t = t.substr(0, t.length - 1)), n + t) : "."
                },
                basename: function (e) {
                    if ("/" === e) return "/";
                    var r = e.lastIndexOf("/");
                    return r === -1 ? e : e.substr(r + 1)
                },
                extname: function (e) {
                    return PATH.splitPath(e)[3]
                },
                join: function () {
                    var e = Array.prototype.slice.call(arguments, 0);
                    return PATH.normalize(e.join("/"))
                },
                join2: function (e, r) {
                    return PATH.normalize(e + "/" + r)
                },
                resolve: function () {
                    for (var e = "", r = !1, n = arguments.length - 1; n >= -1 && !r; n--) {
                        var t = n >= 0 ? arguments[n] : FS.cwd();
                        if ("string" != typeof t) throw new TypeError("Arguments to path.resolve must be strings");
                        if (!t) return "";
                        e = t + "/" + e, r = "/" === t.charAt(0)
                    }
                    return e = PATH.normalizeArray(e.split("/").filter(function (e) {
                        return !!e
                    }), !r).join("/"), (r ? "/" : "") + e || "."
                },
                relative: function (e, r) {
                    function n(e) {
                        for (var r = 0; r < e.length && "" === e[r]; r++);
                        for (var n = e.length - 1; n >= 0 && "" === e[n]; n--);
                        return r > n ? [] : e.slice(r, n - r + 1)
                    }
                    e = PATH.resolve(e).substr(1), r = PATH.resolve(r).substr(1);
                    for (var t = n(e.split("/")), o = n(r.split("/")), i = Math.min(t.length, o.length), a = i, u = 0; u < i; u++)
                        if (t[u] !== o[u]) {
                            a = u;
                            break
                        }
                    for (var s = [], u = a; u < t.length; u++) s.push("..");
                    return s = s.concat(o.slice(a)), s.join("/")
                }
            },
            TTY = {
                ttys: [],
                init: function () {},
                shutdown: function () {},
                register: function (e, r) {
                    TTY.ttys[e] = {
                        input: [],
                        output: [],
                        ops: r
                    }, FS.registerDevice(e, TTY.stream_ops)
                },
                stream_ops: {
                    open: function (e) {
                        var r = TTY.ttys[e.node.rdev];
                        if (!r) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        e.tty = r, e.seekable = !1
                    },
                    close: function (e) {
                        e.tty.ops.flush(e.tty)
                    },
                    flush: function (e) {
                        e.tty.ops.flush(e.tty)
                    },
                    read: function (e, r, n, t, o) {
                        if (!e.tty || !e.tty.ops.get_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                        for (var i = 0, a = 0; a < t; a++) {
                            var u;
                            try {
                                u = e.tty.ops.get_char(e.tty)
                            } catch (s) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            if (void 0 === u && 0 === i) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                            if (null === u || void 0 === u) break;
                            i++, r[n + a] = u
                        }
                        return i && (e.node.timestamp = Date.now()), i
                    },
                    write: function (e, r, n, t, o) {
                        if (!e.tty || !e.tty.ops.put_char) throw new FS.ErrnoError(ERRNO_CODES.ENXIO);
                        for (var i = 0; i < t; i++) try {
                            e.tty.ops.put_char(e.tty, r[n + i])
                        } catch (a) {
                            throw new FS.ErrnoError(ERRNO_CODES.EIO)
                        }
                        return t && (e.node.timestamp = Date.now()), i
                    }
                },
                default_tty_ops: {
                    get_char: function (e) {
                        if (!e.input.length) {
                            var r = null;
                            if (ENVIRONMENT_IS_NODE) {
                                var n = 256,
                                    t = new Buffer(n),
                                    o = 0,
                                    i = process.stdin.fd,
                                    a = !1;
                                try {
                                    i = fs.openSync("/dev/stdin", "r"), a = !0
                                } catch (u) {}
                                o = fs.readSync(i, t, 0, n, null), a && fs.closeSync(i), r = o > 0 ? t.slice(0, o).toString("utf-8") : null
                            } else "undefined" != typeof window && "function" == typeof window.prompt ? (r = window.prompt("Input: "), null !== r && (r += "\n")) : "function" == typeof readline && (r = readline(), null !== r && (r += "\n"));
                            if (!r) return null;
                            e.input = intArrayFromString(r, !0)
                        }
                        return e.input.shift()
                    },
                    put_char: function (e, r) {
                        null === r || 10 === r ? (Module.print(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
                    },
                    flush: function (e) {
                        e.output && e.output.length > 0 && (Module.print(UTF8ArrayToString(e.output, 0)), e.output = [])
                    }
                },
                default_tty1_ops: {
                    put_char: function (e, r) {
                        null === r || 10 === r ? (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = []) : 0 != r && e.output.push(r)
                    },
                    flush: function (e) {
                        e.output && e.output.length > 0 && (Module.printErr(UTF8ArrayToString(e.output, 0)), e.output = [])
                    }
                }
            },
            MEMFS = {
                ops_table: null,
                mount: function (e) {
                    return MEMFS.createNode(null, "/", 16895, 0)
                },
                createNode: function (e, r, n, t) {
                    if (FS.isBlkdev(n) || FS.isFIFO(n)) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    MEMFS.ops_table || (MEMFS.ops_table = {
                        dir: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                lookup: MEMFS.node_ops.lookup,
                                mknod: MEMFS.node_ops.mknod,
                                rename: MEMFS.node_ops.rename,
                                unlink: MEMFS.node_ops.unlink,
                                rmdir: MEMFS.node_ops.rmdir,
                                readdir: MEMFS.node_ops.readdir,
                                symlink: MEMFS.node_ops.symlink
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek
                            }
                        },
                        file: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: {
                                llseek: MEMFS.stream_ops.llseek,
                                read: MEMFS.stream_ops.read,
                                write: MEMFS.stream_ops.write,
                                allocate: MEMFS.stream_ops.allocate,
                                mmap: MEMFS.stream_ops.mmap,
                                msync: MEMFS.stream_ops.msync
                            }
                        },
                        link: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr,
                                readlink: MEMFS.node_ops.readlink
                            },
                            stream: {}
                        },
                        chrdev: {
                            node: {
                                getattr: MEMFS.node_ops.getattr,
                                setattr: MEMFS.node_ops.setattr
                            },
                            stream: FS.chrdev_stream_ops
                        }
                    });
                    var o = FS.createNode(e, r, n, t);
                    return FS.isDir(o.mode) ? (o.node_ops = MEMFS.ops_table.dir.node, o.stream_ops = MEMFS.ops_table.dir.stream, o.contents = {}) : FS.isFile(o.mode) ? (o.node_ops = MEMFS.ops_table.file.node, o.stream_ops = MEMFS.ops_table.file.stream, o.usedBytes = 0, o.contents = null) : FS.isLink(o.mode) ? (o.node_ops = MEMFS.ops_table.link.node, o.stream_ops = MEMFS.ops_table.link.stream) : FS.isChrdev(o.mode) && (o.node_ops = MEMFS.ops_table.chrdev.node, o.stream_ops = MEMFS.ops_table.chrdev.stream), o.timestamp = Date.now(), e && (e.contents[r] = o), o
                },
                getFileDataAsRegularArray: function (e) {
                    if (e.contents && e.contents.subarray) {
                        for (var r = [], n = 0; n < e.usedBytes; ++n) r.push(e.contents[n]);
                        return r
                    }
                    return e.contents
                },
                getFileDataAsTypedArray: function (e) {
                    return e.contents ? e.contents.subarray ? e.contents.subarray(0, e.usedBytes) : new Uint8Array(e.contents) : new Uint8Array
                },
                expandFileStorage: function (e, r) {
                    if (e.contents && e.contents.subarray && r > e.contents.length && (e.contents = MEMFS.getFileDataAsRegularArray(e), e.usedBytes = e.contents.length), !e.contents || e.contents.subarray) {
                        var n = e.contents ? e.contents.buffer.byteLength : 0;
                        if (n >= r) return;
                        var t = 1048576;
                        r = Math.max(r, n * (n < t ? 2 : 1.125) | 0), 0 != n && (r = Math.max(r, 256));
                        var o = e.contents;
                        return e.contents = new Uint8Array(r), void(e.usedBytes > 0 && e.contents.set(o.subarray(0, e.usedBytes), 0))
                    }
                    for (!e.contents && r > 0 && (e.contents = []); e.contents.length < r;) e.contents.push(0)
                },
                resizeFileStorage: function (e, r) {
                    if (e.usedBytes != r) {
                        if (0 == r) return e.contents = null, void(e.usedBytes = 0);
                        if (!e.contents || e.contents.subarray) {
                            var n = e.contents;
                            return e.contents = new Uint8Array(new ArrayBuffer(r)), n && e.contents.set(n.subarray(0, Math.min(r, e.usedBytes))), void(e.usedBytes = r)
                        }
                        if (e.contents || (e.contents = []), e.contents.length > r) e.contents.length = r;
                        else
                            for (; e.contents.length < r;) e.contents.push(0);
                        e.usedBytes = r
                    }
                },
                node_ops: {
                    getattr: function (e) {
                        var r = {};
                        return r.dev = FS.isChrdev(e.mode) ? e.id : 1, r.ino = e.id, r.mode = e.mode, r.nlink = 1, r.uid = 0, r.gid = 0, r.rdev = e.rdev, FS.isDir(e.mode) ? r.size = 4096 : FS.isFile(e.mode) ? r.size = e.usedBytes : FS.isLink(e.mode) ? r.size = e.link.length : r.size = 0, r.atime = new Date(e.timestamp), r.mtime = new Date(e.timestamp), r.ctime = new Date(e.timestamp), r.blksize = 4096, r.blocks = Math.ceil(r.size / r.blksize), r
                    },
                    setattr: function (e, r) {
                        void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp), void 0 !== r.size && MEMFS.resizeFileStorage(e, r.size)
                    },
                    lookup: function (e, r) {
                        throw FS.genericErrors[ERRNO_CODES.ENOENT]
                    },
                    mknod: function (e, r, n, t) {
                        return MEMFS.createNode(e, r, n, t)
                    },
                    rename: function (e, r, n) {
                        if (FS.isDir(e.mode)) {
                            var t;
                            try {
                                t = FS.lookupNode(r, n)
                            } catch (o) {}
                            if (t)
                                for (var i in t.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY)
                        }
                        delete e.parent.contents[e.name], e.name = n, r.contents[n] = e, e.parent = r
                    },
                    unlink: function (e, r) {
                        delete e.contents[r]
                    },
                    rmdir: function (e, r) {
                        var n = FS.lookupNode(e, r);
                        for (var t in n.contents) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                        delete e.contents[r]
                    },
                    readdir: function (e) {
                        var r = [".", ".."];
                        for (var n in e.contents) e.contents.hasOwnProperty(n) && r.push(n);
                        return r
                    },
                    symlink: function (e, r, n) {
                        var t = MEMFS.createNode(e, r, 41471, 0);
                        return t.link = n, t
                    },
                    readlink: function (e) {
                        if (!FS.isLink(e.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return e.link
                    }
                },
                stream_ops: {
                    read: function (e, r, n, t, o) {
                        var i = e.node.contents;
                        if (o >= e.node.usedBytes) return 0;
                        var a = Math.min(e.node.usedBytes - o, t);
                        if (assert(a >= 0), a > 8 && i.subarray) r.set(i.subarray(o, o + a), n);
                        else
                            for (var u = 0; u < a; u++) r[n + u] = i[o + u];
                        return a
                    },
                    write: function (e, r, n, t, o, i) {
                        if (!t) return 0;
                        var a = e.node;
                        if (a.timestamp = Date.now(), r.subarray && (!a.contents || a.contents.subarray)) {
                            if (i) return a.contents = r.subarray(n, n + t), a.usedBytes = t, t;
                            if (0 === a.usedBytes && 0 === o) return a.contents = new Uint8Array(r.subarray(n, n + t)), a.usedBytes = t, t;
                            if (o + t <= a.usedBytes) return a.contents.set(r.subarray(n, n + t), o), t
                        }
                        if (MEMFS.expandFileStorage(a, o + t), a.contents.subarray && r.subarray) a.contents.set(r.subarray(n, n + t), o);
                        else
                            for (var u = 0; u < t; u++) a.contents[o + u] = r[n + u];
                        return a.usedBytes = Math.max(a.usedBytes, o + t), t
                    },
                    llseek: function (e, r, n) {
                        var t = r;
                        if (1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.usedBytes), t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return t
                    },
                    allocate: function (e, r, n) {
                        MEMFS.expandFileStorage(e.node, r + n), e.node.usedBytes = Math.max(e.node.usedBytes, r + n)
                    },
                    mmap: function (e, r, n, t, o, i, a) {
                        if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        var u, s, l = e.node.contents;
                        if (2 & a || l.buffer !== r && l.buffer !== r.buffer) {
                            if ((o > 0 || o + t < e.node.usedBytes) && (l = l.subarray ? l.subarray(o, o + t) : Array.prototype.slice.call(l, o, o + t)), s = !0, u = _malloc(t), !u) throw new FS.ErrnoError(ERRNO_CODES.ENOMEM);
                            r.set(l, u)
                        } else s = !1, u = l.byteOffset;
                        return {
                            ptr: u,
                            allocated: s
                        }
                    },
                    msync: function (e, r, n, t, o) {
                        if (!FS.isFile(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                        if (2 & o) return 0;
                        MEMFS.stream_ops.write(e, r, 0, t, n, !1);
                        return 0
                    }
                }
            },
            IDBFS = {
                dbs: {},
                indexedDB: function () {
                    if ("undefined" != typeof indexedDB) return indexedDB;
                    var e = null;
                    return "object" == typeof window && (e = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB), assert(e, "IDBFS used, but indexedDB not supported"), e
                },
                DB_VERSION: 21,
                DB_STORE_NAME: "FILE_DATA",
                mount: function (e) {
                    return MEMFS.mount.apply(null, arguments)
                },
                syncfs: function (e, r, n) {
                    IDBFS.getLocalSet(e, function (t, o) {
                        return t ? n(t) : void IDBFS.getRemoteSet(e, function (e, t) {
                            if (e) return n(e);
                            var i = r ? t : o,
                                a = r ? o : t;
                            IDBFS.reconcile(i, a, n)
                        })
                    })
                },
                getDB: function (e, r) {
                    var n = IDBFS.dbs[e];
                    if (n) return r(null, n);
                    var t;
                    try {
                        t = IDBFS.indexedDB().open(e, IDBFS.DB_VERSION)
                    } catch (o) {
                        return r(o)
                    }
                    t.onupgradeneeded = function (e) {
                        var r, n = e.target.result,
                            t = e.target.transaction;
                        r = n.objectStoreNames.contains(IDBFS.DB_STORE_NAME) ? t.objectStore(IDBFS.DB_STORE_NAME) : n.createObjectStore(IDBFS.DB_STORE_NAME), r.indexNames.contains("timestamp") || r.createIndex("timestamp", "timestamp", {
                            unique: !1
                        })
                    }, t.onsuccess = function () {
                        n = t.result, IDBFS.dbs[e] = n, r(null, n)
                    }, t.onerror = function (e) {
                        r(this.error), e.preventDefault()
                    }
                },
                getLocalSet: function (e, r) {
                    function n(e) {
                        return "." !== e && ".." !== e
                    }

                    function t(e) {
                        return function (r) {
                            return PATH.join2(e, r)
                        }
                    }
                    for (var o = {}, i = FS.readdir(e.mountpoint).filter(n).map(t(e.mountpoint)); i.length;) {
                        var a, u = i.pop();
                        try {
                            a = FS.stat(u)
                        } catch (s) {
                            return r(s)
                        }
                        FS.isDir(a.mode) && i.push.apply(i, FS.readdir(u).filter(n).map(t(u))), o[u] = {
                            timestamp: a.mtime
                        }
                    }
                    return r(null, {
                        type: "local",
                        entries: o
                    })
                },
                getRemoteSet: function (e, r) {
                    var n = {};
                    IDBFS.getDB(e.mountpoint, function (e, t) {
                        if (e) return r(e);
                        var o = t.transaction([IDBFS.DB_STORE_NAME], "readonly");
                        o.onerror = function (e) {
                            r(this.error), e.preventDefault()
                        };
                        var i = o.objectStore(IDBFS.DB_STORE_NAME),
                            a = i.index("timestamp");
                        a.openKeyCursor().onsuccess = function (e) {
                            var o = e.target.result;
                            return o ? (n[o.primaryKey] = {
                                timestamp: o.key
                            }, void o["continue"]()) : r(null, {
                                type: "remote",
                                db: t,
                                entries: n
                            })
                        }
                    })
                },
                loadLocalEntry: function (e, r) {
                    var n, t;
                    try {
                        var o = FS.lookupPath(e);
                        t = o.node, n = FS.stat(e)
                    } catch (i) {
                        return r(i)
                    }
                    return FS.isDir(n.mode) ? r(null, {
                        timestamp: n.mtime,
                        mode: n.mode
                    }) : FS.isFile(n.mode) ? (t.contents = MEMFS.getFileDataAsTypedArray(t), r(null, {
                        timestamp: n.mtime,
                        mode: n.mode,
                        contents: t.contents
                    })) : r(new Error("node type not supported"))
                },
                storeLocalEntry: function (e, r, n) {
                    try {
                        if (FS.isDir(r.mode)) FS.mkdir(e, r.mode);
                        else {
                            if (!FS.isFile(r.mode)) return n(new Error("node type not supported"));
                            FS.writeFile(e, r.contents, {
                                encoding: "binary",
                                canOwn: !0
                            })
                        }
                        FS.chmod(e, r.mode), FS.utime(e, r.timestamp, r.timestamp)
                    } catch (t) {
                        return n(t)
                    }
                    n(null)
                },
                removeLocalEntry: function (e, r) {
                    try {
                        var n = (FS.lookupPath(e), FS.stat(e));
                        FS.isDir(n.mode) ? FS.rmdir(e) : FS.isFile(n.mode) && FS.unlink(e)
                    } catch (t) {
                        return r(t)
                    }
                    r(null)
                },
                loadRemoteEntry: function (e, r, n) {
                    var t = e.get(r);
                    t.onsuccess = function (e) {
                        n(null, e.target.result)
                    }, t.onerror = function (e) {
                        n(this.error), e.preventDefault()
                    }
                },
                storeRemoteEntry: function (e, r, n, t) {
                    var o = e.put(n, r);
                    o.onsuccess = function () {
                        t(null)
                    }, o.onerror = function (e) {
                        t(this.error), e.preventDefault()
                    }
                },
                removeRemoteEntry: function (e, r, n) {
                    var t = e["delete"](r);
                    t.onsuccess = function () {
                        n(null)
                    }, t.onerror = function (e) {
                        n(this.error), e.preventDefault()
                    }
                },
                reconcile: function (e, r, n) {
                    function t(e) {
                        if (e) {
                            if (!t.errored) return t.errored = !0, n(e)
                        } else if (++u >= o) return n(null)
                    }
                    var o = 0,
                        i = [];
                    Object.keys(e.entries).forEach(function (n) {
                        var t = e.entries[n],
                            a = r.entries[n];
                        (!a || t.timestamp > a.timestamp) && (i.push(n), o++)
                    });
                    var a = [];
                    if (Object.keys(r.entries).forEach(function (n) {
                            var t = (r.entries[n], e.entries[n]);
                            t || (a.push(n), o++)
                        }), !o) return n(null);
                    var u = 0,
                        s = "remote" === e.type ? e.db : r.db,
                        l = s.transaction([IDBFS.DB_STORE_NAME], "readwrite"),
                        c = l.objectStore(IDBFS.DB_STORE_NAME);
                    l.onerror = function (e) {
                        t(this.error), e.preventDefault()
                    }, i.sort().forEach(function (e) {
                        "local" === r.type ? IDBFS.loadRemoteEntry(c, e, function (r, n) {
                            return r ? t(r) : void IDBFS.storeLocalEntry(e, n, t)
                        }) : IDBFS.loadLocalEntry(e, function (r, n) {
                            return r ? t(r) : void IDBFS.storeRemoteEntry(c, e, n, t)
                        })
                    }), a.sort().reverse().forEach(function (e) {
                        "local" === r.type ? IDBFS.removeLocalEntry(e, t) : IDBFS.removeRemoteEntry(c, e, t)
                    })
                }
            },
            NODEFS = {
                isWindows: !1,
                staticInit: function () {
                    NODEFS.isWindows = !!process.platform.match(/^win/)
                },
                mount: function (e) {
                    return assert(ENVIRONMENT_IS_NODE), NODEFS.createNode(null, "/", NODEFS.getMode(e.opts.root), 0)
                },
                createNode: function (e, r, n, t) {
                    if (!FS.isDir(n) && !FS.isFile(n) && !FS.isLink(n)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var o = FS.createNode(e, r, n);
                    return o.node_ops = NODEFS.node_ops, o.stream_ops = NODEFS.stream_ops, o
                },
                getMode: function (e) {
                    var r;
                    try {
                        r = fs.lstatSync(e), NODEFS.isWindows && (r.mode = r.mode | (146 & r.mode) >> 1)
                    } catch (n) {
                        if (!n.code) throw n;
                        throw new FS.ErrnoError(ERRNO_CODES[n.code])
                    }
                    return r.mode
                },
                realPath: function (e) {
                    for (var r = []; e.parent !== e;) r.push(e.name), e = e.parent;
                    return r.push(e.mount.opts.root), r.reverse(), PATH.join.apply(null, r)
                },
                flagsToPermissionStringMap: {
                    0: "r",
                    1: "r+",
                    2: "r+",
                    64: "r",
                    65: "r+",
                    66: "r+",
                    129: "rx+",
                    193: "rx+",
                    514: "w+",
                    577: "w",
                    578: "w+",
                    705: "wx",
                    706: "wx+",
                    1024: "a",
                    1025: "a",
                    1026: "a+",
                    1089: "a",
                    1090: "a+",
                    1153: "ax",
                    1154: "ax+",
                    1217: "ax",
                    1218: "ax+",
                    4096: "rs",
                    4098: "rs+"
                },
                flagsToPermissionString: function (e) {
                    if (e &= -32769, e in NODEFS.flagsToPermissionStringMap) return NODEFS.flagsToPermissionStringMap[e];
                    throw new FS.ErrnoError(ERRNO_CODES.EINVAL)
                },
                node_ops: {
                    getattr: function (e) {
                        var r, n = NODEFS.realPath(e);
                        try {
                            r = fs.lstatSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                        return NODEFS.isWindows && !r.blksize && (r.blksize = 4096), NODEFS.isWindows && !r.blocks && (r.blocks = (r.size + r.blksize - 1) / r.blksize | 0), {
                            dev: r.dev,
                            ino: r.ino,
                            mode: r.mode,
                            nlink: r.nlink,
                            uid: r.uid,
                            gid: r.gid,
                            rdev: r.rdev,
                            size: r.size,
                            atime: r.atime,
                            mtime: r.mtime,
                            ctime: r.ctime,
                            blksize: r.blksize,
                            blocks: r.blocks
                        }
                    },
                    setattr: function (e, r) {
                        var n = NODEFS.realPath(e);
                        try {
                            if (void 0 !== r.mode && (fs.chmodSync(n, r.mode), e.mode = r.mode), void 0 !== r.timestamp) {
                                var t = new Date(r.timestamp);
                                fs.utimesSync(n, t, t)
                            }
                            void 0 !== r.size && fs.truncateSync(n, r.size)
                        } catch (o) {
                            if (!o.code) throw o;
                            throw new FS.ErrnoError(ERRNO_CODES[o.code])
                        }
                    },
                    lookup: function (e, r) {
                        var n = PATH.join2(NODEFS.realPath(e), r),
                            t = NODEFS.getMode(n);
                        return NODEFS.createNode(e, r, t)
                    },
                    mknod: function (e, r, n, t) {
                        var o = NODEFS.createNode(e, r, n, t),
                            i = NODEFS.realPath(o);
                        try {
                            FS.isDir(o.mode) ? fs.mkdirSync(i, o.mode) : fs.writeFileSync(i, "", {
                                mode: o.mode
                            })
                        } catch (a) {
                            if (!a.code) throw a;
                            throw new FS.ErrnoError(ERRNO_CODES[a.code])
                        }
                        return o
                    },
                    rename: function (e, r, n) {
                        var t = NODEFS.realPath(e),
                            o = PATH.join2(NODEFS.realPath(r), n);
                        try {
                            fs.renameSync(t, o)
                        } catch (i) {
                            if (!i.code) throw i;
                            throw new FS.ErrnoError(ERRNO_CODES[i.code])
                        }
                    },
                    unlink: function (e, r) {
                        var n = PATH.join2(NODEFS.realPath(e), r);
                        try {
                            fs.unlinkSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                    },
                    rmdir: function (e, r) {
                        var n = PATH.join2(NODEFS.realPath(e), r);
                        try {
                            fs.rmdirSync(n)
                        } catch (t) {
                            if (!t.code) throw t;
                            throw new FS.ErrnoError(ERRNO_CODES[t.code])
                        }
                    },
                    readdir: function (e) {
                        var r = NODEFS.realPath(e);
                        try {
                            return fs.readdirSync(r)
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    },
                    symlink: function (e, r, n) {
                        var t = PATH.join2(NODEFS.realPath(e), r);
                        try {
                            fs.symlinkSync(n, t)
                        } catch (o) {
                            if (!o.code) throw o;
                            throw new FS.ErrnoError(ERRNO_CODES[o.code])
                        }
                    },
                    readlink: function (e) {
                        var r = NODEFS.realPath(e);
                        try {
                            return r = fs.readlinkSync(r), r = NODEJS_PATH.relative(NODEJS_PATH.resolve(e.mount.opts.root), r)
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    }
                },
                stream_ops: {
                    open: function (e) {
                        var r = NODEFS.realPath(e.node);
                        try {
                            FS.isFile(e.node.mode) && (e.nfd = fs.openSync(r, NODEFS.flagsToPermissionString(e.flags)))
                        } catch (n) {
                            if (!n.code) throw n;
                            throw new FS.ErrnoError(ERRNO_CODES[n.code])
                        }
                    },
                    close: function (e) {
                        try {
                            FS.isFile(e.node.mode) && e.nfd && fs.closeSync(e.nfd)
                        } catch (r) {
                            if (!r.code) throw r;
                            throw new FS.ErrnoError(ERRNO_CODES[r.code])
                        }
                    },
                    read: function (e, r, n, t, o) {
                        if (0 === t) return 0;
                        var i, a = new Buffer(t);
                        try {
                            i = fs.readSync(e.nfd, a, 0, t, o)
                        } catch (u) {
                            throw new FS.ErrnoError(ERRNO_CODES[u.code])
                        }
                        if (i > 0)
                            for (var s = 0; s < i; s++) r[n + s] = a[s];
                        return i
                    },
                    write: function (e, r, n, t, o) {
                        var i, a = new Buffer(r.subarray(n, n + t));
                        try {
                            i = fs.writeSync(e.nfd, a, 0, t, o)
                        } catch (u) {
                            throw new FS.ErrnoError(ERRNO_CODES[u.code])
                        }
                        return i
                    },
                    llseek: function (e, r, n) {
                        var t = r;
                        if (1 === n) t += e.position;
                        else if (2 === n && FS.isFile(e.node.mode)) try {
                            var o = fs.fstatSync(e.nfd);
                            t += o.size
                        } catch (i) {
                            throw new FS.ErrnoError(ERRNO_CODES[i.code])
                        }
                        if (t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return t
                    }
                }
            },
            WORKERFS = {
                DIR_MODE: 16895,
                FILE_MODE: 33279,
                reader: null,
                mount: function (e) {
                    function r(e) {
                        for (var r = e.split("/"), n = t, i = 0; i < r.length - 1; i++) {
                            var a = r.slice(0, i + 1).join("/");
                            o[a] || (o[a] = WORKERFS.createNode(n, a, WORKERFS.DIR_MODE, 0)), n = o[a]
                        }
                        return n
                    }

                    function n(e) {
                        var r = e.split("/");
                        return r[r.length - 1]
                    }
                    assert(ENVIRONMENT_IS_WORKER), WORKERFS.reader || (WORKERFS.reader = new FileReaderSync);
                    var t = WORKERFS.createNode(null, "/", WORKERFS.DIR_MODE, 0),
                        o = {};
                    return Array.prototype.forEach.call(e.opts.files || [], function (e) {
                        WORKERFS.createNode(r(e.name), n(e.name), WORKERFS.FILE_MODE, 0, e, e.lastModifiedDate)
                    }), (e.opts.blobs || []).forEach(function (e) {
                        WORKERFS.createNode(r(e.name), n(e.name), WORKERFS.FILE_MODE, 0, e.data)
                    }), (e.opts.packages || []).forEach(function (e) {
                        e.metadata.files.forEach(function (t) {
                            var o = t.filename.substr(1);
                            WORKERFS.createNode(r(o), n(o), WORKERFS.FILE_MODE, 0, e.blob.slice(t.start, t.end))
                        })
                    }), t
                },
                createNode: function (e, r, n, t, o, i) {
                    var a = FS.createNode(e, r, n);
                    return a.mode = n, a.node_ops = WORKERFS.node_ops, a.stream_ops = WORKERFS.stream_ops, a.timestamp = (i || new Date).getTime(), assert(WORKERFS.FILE_MODE !== WORKERFS.DIR_MODE), n === WORKERFS.FILE_MODE ? (a.size = o.size, a.contents = o) : (a.size = 4096, a.contents = {}),
                        e && (e.contents[r] = a), a
                },
                node_ops: {
                    getattr: function (e) {
                        return {
                            dev: 1,
                            ino: void 0,
                            mode: e.mode,
                            nlink: 1,
                            uid: 0,
                            gid: 0,
                            rdev: void 0,
                            size: e.size,
                            atime: new Date(e.timestamp),
                            mtime: new Date(e.timestamp),
                            ctime: new Date(e.timestamp),
                            blksize: 4096,
                            blocks: Math.ceil(e.size / 4096)
                        }
                    },
                    setattr: function (e, r) {
                        void 0 !== r.mode && (e.mode = r.mode), void 0 !== r.timestamp && (e.timestamp = r.timestamp)
                    },
                    lookup: function (e, r) {
                        throw new FS.ErrnoError(ERRNO_CODES.ENOENT)
                    },
                    mknod: function (e, r, n, t) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    rename: function (e, r, n) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    unlink: function (e, r) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    rmdir: function (e, r) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    readdir: function (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    symlink: function (e, r, n) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    },
                    readlink: function (e) {
                        throw new FS.ErrnoError(ERRNO_CODES.EPERM)
                    }
                },
                stream_ops: {
                    read: function (e, r, n, t, o) {
                        if (o >= e.node.size) return 0;
                        var i = e.node.contents.slice(o, o + t),
                            a = WORKERFS.reader.readAsArrayBuffer(i);
                        return r.set(new Uint8Array(a), n), i.size
                    },
                    write: function (e, r, n, t, o) {
                        throw new FS.ErrnoError(ERRNO_CODES.EIO)
                    },
                    llseek: function (e, r, n) {
                        var t = r;
                        if (1 === n ? t += e.position : 2 === n && FS.isFile(e.node.mode) && (t += e.node.size), t < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                        return t
                    }
                }
            },
            _stdin = allocate(1, "i32*", ALLOC_STATIC),
            _stdout = allocate(1, "i32*", ALLOC_STATIC),
            _stderr = allocate(1, "i32*", ALLOC_STATIC),
            FS = {
                root: null,
                mounts: [],
                devices: [null],
                streams: [],
                nextInode: 1,
                nameTable: null,
                currentPath: "/",
                initialized: !1,
                ignorePermissions: !0,
                trackingDelegate: {},
                tracking: {
                    openFlags: {
                        READ: 1,
                        WRITE: 2
                    }
                },
                ErrnoError: null,
                genericErrors: {},
                filesystems: null,
                handleFSError: function (e) {
                    if (!(e instanceof FS.ErrnoError)) throw e + " : " + stackTrace();
                    return ___setErrNo(e.errno)
                },
                lookupPath: function (e, r) {
                    if (e = PATH.resolve(FS.cwd(), e), r = r || {}, !e) return {
                        path: "",
                        node: null
                    };
                    var n = {
                        follow_mount: !0,
                        recurse_count: 0
                    };
                    for (var t in n) void 0 === r[t] && (r[t] = n[t]);
                    if (r.recurse_count > 8) throw new FS.ErrnoError(ERRNO_CODES.ELOOP);
                    for (var o = PATH.normalizeArray(e.split("/").filter(function (e) {
                            return !!e
                        }), !1), i = FS.root, a = "/", u = 0; u < o.length; u++) {
                        var s = u === o.length - 1;
                        if (s && r.parent) break;
                        if (i = FS.lookupNode(i, o[u]), a = PATH.join2(a, o[u]), FS.isMountpoint(i) && (!s || s && r.follow_mount) && (i = i.mounted.root), !s || r.follow)
                            for (var l = 0; FS.isLink(i.mode);) {
                                var c = FS.readlink(a);
                                a = PATH.resolve(PATH.dirname(a), c);
                                var f = FS.lookupPath(a, {
                                    recurse_count: r.recurse_count
                                });
                                if (i = f.node, l++ > 40) throw new FS.ErrnoError(ERRNO_CODES.ELOOP)
                            }
                    }
                    return {
                        path: a,
                        node: i
                    }
                },
                getPath: function (e) {
                    for (var r;;) {
                        if (FS.isRoot(e)) {
                            var n = e.mount.mountpoint;
                            return r ? "/" !== n[n.length - 1] ? n + "/" + r : n + r : n
                        }
                        r = r ? e.name + "/" + r : e.name, e = e.parent
                    }
                },
                hashName: function (e, r) {
                    for (var n = 0, t = 0; t < r.length; t++) n = (n << 5) - n + r.charCodeAt(t) | 0;
                    return (e + n >>> 0) % FS.nameTable.length
                },
                hashAddNode: function (e) {
                    var r = FS.hashName(e.parent.id, e.name);
                    e.name_next = FS.nameTable[r], FS.nameTable[r] = e
                },
                hashRemoveNode: function (e) {
                    var r = FS.hashName(e.parent.id, e.name);
                    if (FS.nameTable[r] === e) FS.nameTable[r] = e.name_next;
                    else
                        for (var n = FS.nameTable[r]; n;) {
                            if (n.name_next === e) {
                                n.name_next = e.name_next;
                                break
                            }
                            n = n.name_next
                        }
                },
                lookupNode: function (e, r) {
                    var n = FS.mayLookup(e);
                    if (n) throw new FS.ErrnoError(n, e);
                    for (var t = FS.hashName(e.id, r), o = FS.nameTable[t]; o; o = o.name_next) {
                        var i = o.name;
                        if (o.parent.id === e.id && i === r) return o
                    }
                    return FS.lookup(e, r)
                },
                createNode: function (e, r, n, t) {
                    if (!FS.FSNode) {
                        FS.FSNode = function (e, r, n, t) {
                            e || (e = this), this.parent = e, this.mount = e.mount, this.mounted = null, this.id = FS.nextInode++, this.name = r, this.mode = n, this.node_ops = {}, this.stream_ops = {}, this.rdev = t
                        }, FS.FSNode.prototype = {};
                        var o = 365,
                            i = 146;
                        Object.defineProperties(FS.FSNode.prototype, {
                            read: {
                                get: function () {
                                    return (this.mode & o) === o
                                },
                                set: function (e) {
                                    e ? this.mode |= o : this.mode &= ~o
                                }
                            },
                            write: {
                                get: function () {
                                    return (this.mode & i) === i
                                },
                                set: function (e) {
                                    e ? this.mode |= i : this.mode &= ~i
                                }
                            },
                            isFolder: {
                                get: function () {
                                    return FS.isDir(this.mode)
                                }
                            },
                            isDevice: {
                                get: function () {
                                    return FS.isChrdev(this.mode)
                                }
                            }
                        })
                    }
                    var a = new FS.FSNode(e, r, n, t);
                    return FS.hashAddNode(a), a
                },
                destroyNode: function (e) {
                    FS.hashRemoveNode(e)
                },
                isRoot: function (e) {
                    return e === e.parent
                },
                isMountpoint: function (e) {
                    return !!e.mounted
                },
                isFile: function (e) {
                    return 32768 === (61440 & e)
                },
                isDir: function (e) {
                    return 16384 === (61440 & e)
                },
                isLink: function (e) {
                    return 40960 === (61440 & e)
                },
                isChrdev: function (e) {
                    return 8192 === (61440 & e)
                },
                isBlkdev: function (e) {
                    return 24576 === (61440 & e)
                },
                isFIFO: function (e) {
                    return 4096 === (61440 & e)
                },
                isSocket: function (e) {
                    return 49152 === (49152 & e)
                },
                flagModes: {
                    r: 0,
                    rs: 1052672,
                    "r+": 2,
                    w: 577,
                    wx: 705,
                    xw: 705,
                    "w+": 578,
                    "wx+": 706,
                    "xw+": 706,
                    a: 1089,
                    ax: 1217,
                    xa: 1217,
                    "a+": 1090,
                    "ax+": 1218,
                    "xa+": 1218
                },
                modeStringToFlags: function (e) {
                    var r = FS.flagModes[e];
                    if ("undefined" == typeof r) throw new Error("Unknown file open mode: " + e);
                    return r
                },
                flagsToPermissionString: function (e) {
                    var r = ["r", "w", "rw"][3 & e];
                    return 512 & e && (r += "w"), r
                },
                nodePermissions: function (e, r) {
                    return FS.ignorePermissions ? 0 : (r.indexOf("r") === -1 || 292 & e.mode) && (r.indexOf("w") === -1 || 146 & e.mode) && (r.indexOf("x") === -1 || 73 & e.mode) ? 0 : ERRNO_CODES.EACCES
                },
                mayLookup: function (e) {
                    var r = FS.nodePermissions(e, "x");
                    return r ? r : e.node_ops.lookup ? 0 : ERRNO_CODES.EACCES
                },
                mayCreate: function (e, r) {
                    try {
                        FS.lookupNode(e, r);
                        return ERRNO_CODES.EEXIST
                    } catch (n) {}
                    return FS.nodePermissions(e, "wx")
                },
                mayDelete: function (e, r, n) {
                    var t;
                    try {
                        t = FS.lookupNode(e, r)
                    } catch (o) {
                        return o.errno
                    }
                    var i = FS.nodePermissions(e, "wx");
                    if (i) return i;
                    if (n) {
                        if (!FS.isDir(t.mode)) return ERRNO_CODES.ENOTDIR;
                        if (FS.isRoot(t) || FS.getPath(t) === FS.cwd()) return ERRNO_CODES.EBUSY
                    } else if (FS.isDir(t.mode)) return ERRNO_CODES.EISDIR;
                    return 0
                },
                mayOpen: function (e, r) {
                    return e ? FS.isLink(e.mode) ? ERRNO_CODES.ELOOP : FS.isDir(e.mode) && (0 !== (2097155 & r) || 512 & r) ? ERRNO_CODES.EISDIR : FS.nodePermissions(e, FS.flagsToPermissionString(r)) : ERRNO_CODES.ENOENT
                },
                MAX_OPEN_FDS: 4096,
                nextfd: function (e, r) {
                    e = e || 0, r = r || FS.MAX_OPEN_FDS;
                    for (var n = e; n <= r; n++)
                        if (!FS.streams[n]) return n;
                    throw new FS.ErrnoError(ERRNO_CODES.EMFILE)
                },
                getStream: function (e) {
                    return FS.streams[e]
                },
                createStream: function (e, r, n) {
                    FS.FSStream || (FS.FSStream = function () {}, FS.FSStream.prototype = {}, Object.defineProperties(FS.FSStream.prototype, {
                        object: {
                            get: function () {
                                return this.node
                            },
                            set: function (e) {
                                this.node = e
                            }
                        },
                        isRead: {
                            get: function () {
                                return 1 !== (2097155 & this.flags)
                            }
                        },
                        isWrite: {
                            get: function () {
                                return 0 !== (2097155 & this.flags)
                            }
                        },
                        isAppend: {
                            get: function () {
                                return 1024 & this.flags
                            }
                        }
                    }));
                    var t = new FS.FSStream;
                    for (var o in e) t[o] = e[o];
                    e = t;
                    var i = FS.nextfd(r, n);
                    return e.fd = i, FS.streams[i] = e, e
                },
                closeStream: function (e) {
                    FS.streams[e] = null
                },
                chrdev_stream_ops: {
                    open: function (e) {
                        var r = FS.getDevice(e.node.rdev);
                        e.stream_ops = r.stream_ops, e.stream_ops.open && e.stream_ops.open(e)
                    },
                    llseek: function () {
                        throw new FS.ErrnoError(ERRNO_CODES.ESPIPE)
                    }
                },
                major: function (e) {
                    return e >> 8
                },
                minor: function (e) {
                    return 255 & e
                },
                makedev: function (e, r) {
                    return e << 8 | r
                },
                registerDevice: function (e, r) {
                    FS.devices[e] = {
                        stream_ops: r
                    }
                },
                getDevice: function (e) {
                    return FS.devices[e]
                },
                getMounts: function (e) {
                    for (var r = [], n = [e]; n.length;) {
                        var t = n.pop();
                        r.push(t), n.push.apply(n, t.mounts)
                    }
                    return r
                },
                syncfs: function (e, r) {
                    function n(e) {
                        if (e) {
                            if (!n.errored) return n.errored = !0, r(e)
                        } else ++o >= t.length && r(null)
                    }
                    "function" == typeof e && (r = e, e = !1);
                    var t = FS.getMounts(FS.root.mount),
                        o = 0;
                    t.forEach(function (r) {
                        return r.type.syncfs ? void r.type.syncfs(r, e, n) : n(null)
                    })
                },
                mount: function (e, r, n) {
                    var t, o = "/" === n,
                        i = !n;
                    if (o && FS.root) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    if (!o && !i) {
                        var a = FS.lookupPath(n, {
                            follow_mount: !1
                        });
                        if (n = a.path, t = a.node, FS.isMountpoint(t)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                        if (!FS.isDir(t.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR)
                    }
                    var u = {
                            type: e,
                            opts: r,
                            mountpoint: n,
                            mounts: []
                        },
                        s = e.mount(u);
                    return s.mount = u, u.root = s, o ? FS.root = s : t && (t.mounted = u, t.mount && t.mount.mounts.push(u)), s
                },
                unmount: function (e) {
                    var r = FS.lookupPath(e, {
                        follow_mount: !1
                    });
                    if (!FS.isMountpoint(r.node)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var n = r.node,
                        t = n.mounted,
                        o = FS.getMounts(t);
                    Object.keys(FS.nameTable).forEach(function (e) {
                        for (var r = FS.nameTable[e]; r;) {
                            var n = r.name_next;
                            o.indexOf(r.mount) !== -1 && FS.destroyNode(r), r = n
                        }
                    }), n.mounted = null;
                    var i = n.mount.mounts.indexOf(t);
                    assert(i !== -1), n.mount.mounts.splice(i, 1)
                },
                lookup: function (e, r) {
                    return e.node_ops.lookup(e, r)
                },
                mknod: function (e, r, n) {
                    var t = FS.lookupPath(e, {
                            parent: !0
                        }),
                        o = t.node,
                        i = PATH.basename(e);
                    if (!i || "." === i || ".." === i) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var a = FS.mayCreate(o, i);
                    if (a) throw new FS.ErrnoError(a);
                    if (!o.node_ops.mknod) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return o.node_ops.mknod(o, i, r, n)
                },
                create: function (e, r) {
                    return r = void 0 !== r ? r : 438, r &= 4095, r |= 32768, FS.mknod(e, r, 0)
                },
                mkdir: function (e, r) {
                    return r = void 0 !== r ? r : 511, r &= 1023, r |= 16384, FS.mknod(e, r, 0)
                },
                mkdev: function (e, r, n) {
                    return "undefined" == typeof n && (n = r, r = 438), r |= 8192, FS.mknod(e, r, n)
                },
                symlink: function (e, r) {
                    if (!PATH.resolve(e)) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    var n = FS.lookupPath(r, {
                            parent: !0
                        }),
                        t = n.node;
                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    var o = PATH.basename(r),
                        i = FS.mayCreate(t, o);
                    if (i) throw new FS.ErrnoError(i);
                    if (!t.node_ops.symlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return t.node_ops.symlink(t, o, e)
                },
                rename: function (e, r) {
                    var n, t, o, i = PATH.dirname(e),
                        a = PATH.dirname(r),
                        u = PATH.basename(e),
                        s = PATH.basename(r);
                    try {
                        n = FS.lookupPath(e, {
                            parent: !0
                        }), t = n.node, n = FS.lookupPath(r, {
                            parent: !0
                        }), o = n.node
                    } catch (l) {
                        throw new FS.ErrnoError(ERRNO_CODES.EBUSY)
                    }
                    if (!t || !o) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (t.mount !== o.mount) throw new FS.ErrnoError(ERRNO_CODES.EXDEV);
                    var c = FS.lookupNode(t, u),
                        f = PATH.relative(e, a);
                    if ("." !== f.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (f = PATH.relative(r, i), "." !== f.charAt(0)) throw new FS.ErrnoError(ERRNO_CODES.ENOTEMPTY);
                    var d;
                    try {
                        d = FS.lookupNode(o, s)
                    } catch (l) {}
                    if (c !== d) {
                        var m = FS.isDir(c.mode),
                            E = FS.mayDelete(t, u, m);
                        if (E) throw new FS.ErrnoError(E);
                        if (E = d ? FS.mayDelete(o, s, m) : FS.mayCreate(o, s)) throw new FS.ErrnoError(E);
                        if (!t.node_ops.rename) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                        if (FS.isMountpoint(c) || d && FS.isMountpoint(d)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                        if (o !== t && (E = FS.nodePermissions(t, "w"))) throw new FS.ErrnoError(E);
                        try {
                            FS.trackingDelegate.willMovePath && FS.trackingDelegate.willMovePath(e, r)
                        } catch (l) {
                            console.log("FS.trackingDelegate['willMovePath']('" + e + "', '" + r + "') threw an exception: " + l.message)
                        }
                        FS.hashRemoveNode(c);
                        try {
                            t.node_ops.rename(c, o, s)
                        } catch (l) {
                            throw l
                        } finally {
                            FS.hashAddNode(c)
                        }
                        try {
                            FS.trackingDelegate.onMovePath && FS.trackingDelegate.onMovePath(e, r)
                        } catch (l) {
                            console.log("FS.trackingDelegate['onMovePath']('" + e + "', '" + r + "') threw an exception: " + l.message)
                        }
                    }
                },
                rmdir: function (e) {
                    var r = FS.lookupPath(e, {
                            parent: !0
                        }),
                        n = r.node,
                        t = PATH.basename(e),
                        o = FS.lookupNode(n, t),
                        i = FS.mayDelete(n, t, !0);
                    if (i) throw new FS.ErrnoError(i);
                    if (!n.node_ops.rmdir) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isMountpoint(o)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    try {
                        FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
                    } catch (a) {
                        console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + a.message)
                    }
                    n.node_ops.rmdir(n, t), FS.destroyNode(o);
                    try {
                        FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
                    } catch (a) {
                        console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + a.message)
                    }
                },
                readdir: function (e) {
                    var r = FS.lookupPath(e, {
                            follow: !0
                        }),
                        n = r.node;
                    if (!n.node_ops.readdir) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    return n.node_ops.readdir(n)
                },
                unlink: function (e) {
                    var r = FS.lookupPath(e, {
                            parent: !0
                        }),
                        n = r.node,
                        t = PATH.basename(e),
                        o = FS.lookupNode(n, t),
                        i = FS.mayDelete(n, t, !1);
                    if (i) throw i === ERRNO_CODES.EISDIR && (i = ERRNO_CODES.EPERM), new FS.ErrnoError(i);
                    if (!n.node_ops.unlink) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isMountpoint(o)) throw new FS.ErrnoError(ERRNO_CODES.EBUSY);
                    try {
                        FS.trackingDelegate.willDeletePath && FS.trackingDelegate.willDeletePath(e)
                    } catch (a) {
                        console.log("FS.trackingDelegate['willDeletePath']('" + e + "') threw an exception: " + a.message)
                    }
                    n.node_ops.unlink(n, t), FS.destroyNode(o);
                    try {
                        FS.trackingDelegate.onDeletePath && FS.trackingDelegate.onDeletePath(e)
                    } catch (a) {
                        console.log("FS.trackingDelegate['onDeletePath']('" + e + "') threw an exception: " + a.message)
                    }
                },
                readlink: function (e) {
                    var r = FS.lookupPath(e),
                        n = r.node;
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (!n.node_ops.readlink) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    return PATH.resolve(FS.getPath(n.parent), n.node_ops.readlink(n))
                },
                stat: function (e, r) {
                    var n = FS.lookupPath(e, {
                            follow: !r
                        }),
                        t = n.node;
                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (!t.node_ops.getattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    return t.node_ops.getattr(t)
                },
                lstat: function (e) {
                    return FS.stat(e, !0)
                },
                chmod: function (e, r, n) {
                    var t;
                    if ("string" == typeof e) {
                        var o = FS.lookupPath(e, {
                            follow: !n
                        });
                        t = o.node
                    } else t = e;
                    if (!t.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    t.node_ops.setattr(t, {
                        mode: 4095 & r | t.mode & -4096,
                        timestamp: Date.now()
                    })
                },
                lchmod: function (e, r) {
                    FS.chmod(e, r, !0)
                },
                fchmod: function (e, r) {
                    var n = FS.getStream(e);
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    FS.chmod(n.node, r)
                },
                chown: function (e, r, n, t) {
                    var o;
                    if ("string" == typeof e) {
                        var i = FS.lookupPath(e, {
                            follow: !t
                        });
                        o = i.node
                    } else o = e;
                    if (!o.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    o.node_ops.setattr(o, {
                        timestamp: Date.now()
                    })
                },
                lchown: function (e, r, n) {
                    FS.chown(e, r, n, !0)
                },
                fchown: function (e, r, n) {
                    var t = FS.getStream(e);
                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    FS.chown(t.node, r, n)
                },
                truncate: function (e, r) {
                    if (r < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var n;
                    if ("string" == typeof e) {
                        var t = FS.lookupPath(e, {
                            follow: !0
                        });
                        n = t.node
                    } else n = e;
                    if (!n.node_ops.setattr) throw new FS.ErrnoError(ERRNO_CODES.EPERM);
                    if (FS.isDir(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!FS.isFile(n.mode)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var o = FS.nodePermissions(n, "w");
                    if (o) throw new FS.ErrnoError(o);
                    n.node_ops.setattr(n, {
                        size: r,
                        timestamp: Date.now()
                    })
                },
                ftruncate: function (e, r) {
                    var n = FS.getStream(e);
                    if (!n) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (0 === (2097155 & n.flags)) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    FS.truncate(n.node, r)
                },
                utime: function (e, r, n) {
                    var t = FS.lookupPath(e, {
                            follow: !0
                        }),
                        o = t.node;
                    o.node_ops.setattr(o, {
                        timestamp: Math.max(r, n)
                    })
                },
                open: function (e, r, n, t, o) {
                    if ("" === e) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    r = "string" == typeof r ? FS.modeStringToFlags(r) : r, n = "undefined" == typeof n ? 438 : n, n = 64 & r ? 4095 & n | 32768 : 0;
                    var i;
                    if ("object" == typeof e) i = e;
                    else {
                        e = PATH.normalize(e);
                        try {
                            var a = FS.lookupPath(e, {
                                follow: !(131072 & r)
                            });
                            i = a.node
                        } catch (u) {}
                    }
                    var s = !1;
                    if (64 & r)
                        if (i) {
                            if (128 & r) throw new FS.ErrnoError(ERRNO_CODES.EEXIST)
                        } else i = FS.mknod(e, n, 0), s = !0;
                    if (!i) throw new FS.ErrnoError(ERRNO_CODES.ENOENT);
                    if (FS.isChrdev(i.mode) && (r &= -513), 65536 & r && !FS.isDir(i.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    if (!s) {
                        var l = FS.mayOpen(i, r);
                        if (l) throw new FS.ErrnoError(l)
                    }
                    512 & r && FS.truncate(i, 0), r &= -641;
                    var c = FS.createStream({
                        node: i,
                        path: FS.getPath(i),
                        flags: r,
                        seekable: !0,
                        position: 0,
                        stream_ops: i.stream_ops,
                        ungotten: [],
                        error: !1
                    }, t, o);
                    c.stream_ops.open && c.stream_ops.open(c), !Module.logReadFiles || 1 & r || (FS.readFiles || (FS.readFiles = {}), e in FS.readFiles || (FS.readFiles[e] = 1, Module.printErr("read file: " + e)));
                    try {
                        if (FS.trackingDelegate.onOpenFile) {
                            var f = 0;
                            1 !== (2097155 & r) && (f |= FS.tracking.openFlags.READ), 0 !== (2097155 & r) && (f |= FS.tracking.openFlags.WRITE), FS.trackingDelegate.onOpenFile(e, f)
                        }
                    } catch (u) {
                        console.log("FS.trackingDelegate['onOpenFile']('" + e + "', flags) threw an exception: " + u.message)
                    }
                    return c
                },
                close: function (e) {
                    e.getdents && (e.getdents = null);
                    try {
                        e.stream_ops.close && e.stream_ops.close(e)
                    } catch (r) {
                        throw r
                    } finally {
                        FS.closeStream(e.fd)
                    }
                },
                llseek: function (e, r, n) {
                    if (!e.seekable || !e.stream_ops.llseek) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
                    return e.position = e.stream_ops.llseek(e, r, n), e.ungotten = [], e.position
                },
                read: function (e, r, n, t, o) {
                    if (t < 0 || o < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!e.stream_ops.read) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    var i = !0;
                    if ("undefined" == typeof o) o = e.position, i = !1;
                    else if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
                    var a = e.stream_ops.read(e, r, n, t, o);
                    return i || (e.position += a), a
                },
                write: function (e, r, n, t, o, i) {
                    if (t < 0 || o < 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (FS.isDir(e.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.EISDIR);
                    if (!e.stream_ops.write) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    1024 & e.flags && FS.llseek(e, 0, 2);
                    var a = !0;
                    if ("undefined" == typeof o) o = e.position, a = !1;
                    else if (!e.seekable) throw new FS.ErrnoError(ERRNO_CODES.ESPIPE);
                    var u = e.stream_ops.write(e, r, n, t, o, i);
                    a || (e.position += u);
                    try {
                        e.path && FS.trackingDelegate.onWriteToFile && FS.trackingDelegate.onWriteToFile(e.path)
                    } catch (s) {
                        console.log("FS.trackingDelegate['onWriteToFile']('" + path + "') threw an exception: " + s.message)
                    }
                    return u
                },
                allocate: function (e, r, n) {
                    if (r < 0 || n <= 0) throw new FS.ErrnoError(ERRNO_CODES.EINVAL);
                    if (0 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    if (!FS.isFile(e.node.mode) && !FS.isDir(node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                    if (!e.stream_ops.allocate) throw new FS.ErrnoError(ERRNO_CODES.EOPNOTSUPP);
                    e.stream_ops.allocate(e, r, n)
                },
                mmap: function (e, r, n, t, o, i, a) {
                    if (1 === (2097155 & e.flags)) throw new FS.ErrnoError(ERRNO_CODES.EACCES);
                    if (!e.stream_ops.mmap) throw new FS.ErrnoError(ERRNO_CODES.ENODEV);
                    return e.stream_ops.mmap(e, r, n, t, o, i, a)
                },
                msync: function (e, r, n, t, o) {
                    return e && e.stream_ops.msync ? e.stream_ops.msync(e, r, n, t, o) : 0
                },
                munmap: function (e) {
                    return 0
                },
                ioctl: function (e, r, n) {
                    if (!e.stream_ops.ioctl) throw new FS.ErrnoError(ERRNO_CODES.ENOTTY);
                    return e.stream_ops.ioctl(e, r, n)
                },
                readFile: function (e, r) {
                    if (r = r || {}, r.flags = r.flags || "r", r.encoding = r.encoding || "binary", "utf8" !== r.encoding && "binary" !== r.encoding) throw new Error('Invalid encoding type "' + r.encoding + '"');
                    var n, t = FS.open(e, r.flags),
                        o = FS.stat(e),
                        i = o.size,
                        a = new Uint8Array(i);
                    return FS.read(t, a, 0, i, 0), "utf8" === r.encoding ? n = UTF8ArrayToString(a, 0) : "binary" === r.encoding && (n = a), FS.close(t), n
                },
                writeFile: function (e, r, n) {
                    if (n = n || {}, n.flags = n.flags || "w", n.encoding = n.encoding || "utf8", "utf8" !== n.encoding && "binary" !== n.encoding) throw new Error('Invalid encoding type "' + n.encoding + '"');
                    var t = FS.open(e, n.flags, n.mode);
                    if ("utf8" === n.encoding) {
                        var o = new Uint8Array(lengthBytesUTF8(r) + 1),
                            i = stringToUTF8Array(r, o, 0, o.length);
                        FS.write(t, o, 0, i, 0, n.canOwn)
                    } else "binary" === n.encoding && FS.write(t, r, 0, r.length, 0, n.canOwn);
                    FS.close(t)
                },
                cwd: function () {
                    return FS.currentPath
                },
                chdir: function (e) {
                    var r = FS.lookupPath(e, {
                        follow: !0
                    });
                    if (!FS.isDir(r.node.mode)) throw new FS.ErrnoError(ERRNO_CODES.ENOTDIR);
                    var n = FS.nodePermissions(r.node, "x");
                    if (n) throw new FS.ErrnoError(n);
                    FS.currentPath = r.path
                },
                createDefaultDirectories: function () {
                    FS.mkdir("/tmp"), FS.mkdir("/home"), FS.mkdir("/home/web_user")
                },
                createDefaultDevices: function () {
                    FS.mkdir("/dev"), FS.registerDevice(FS.makedev(1, 3), {
                        read: function () {
                            return 0
                        },
                        write: function (e, r, n, t, o) {
                            return t
                        }
                    }), FS.mkdev("/dev/null", FS.makedev(1, 3)), TTY.register(FS.makedev(5, 0), TTY.default_tty_ops), TTY.register(FS.makedev(6, 0), TTY.default_tty1_ops), FS.mkdev("/dev/tty", FS.makedev(5, 0)), FS.mkdev("/dev/tty1", FS.makedev(6, 0));
                    var e;
                    if ("undefined" != typeof crypto) {
                        var r = new Uint8Array(1);
                        e = function () {
                            return crypto.getRandomValues(r), r[0]
                        }
                    } else e = ENVIRONMENT_IS_NODE ? function () {
                        return require("crypto").randomBytes(1)[0]
                    } : function () {
                        return 256 * Math.random() | 0
                    };
                    FS.createDevice("/dev", "random", e), FS.createDevice("/dev", "urandom", e), FS.mkdir("/dev/shm"), FS.mkdir("/dev/shm/tmp")
                },
                createSpecialDirectories: function () {
                    FS.mkdir("/proc"), FS.mkdir("/proc/self"), FS.mkdir("/proc/self/fd"), FS.mount({
                        mount: function () {
                            var e = FS.createNode("/proc/self", "fd", 16895, 73);
                            return e.node_ops = {
                                lookup: function (e, r) {
                                    var n = +r,
                                        t = FS.getStream(n);
                                    if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                                    var o = {
                                        parent: null,
                                        mount: {
                                            mountpoint: "fake"
                                        },
                                        node_ops: {
                                            readlink: function () {
                                                return t.path
                                            }
                                        }
                                    };
                                    return o.parent = o, o
                                }
                            }, e
                        }
                    }, {}, "/proc/self/fd")
                },
                createStandardStreams: function () {
                    Module.stdin ? FS.createDevice("/dev", "stdin", Module.stdin) : FS.symlink("/dev/tty", "/dev/stdin"), Module.stdout ? FS.createDevice("/dev", "stdout", null, Module.stdout) : FS.symlink("/dev/tty", "/dev/stdout"), Module.stderr ? FS.createDevice("/dev", "stderr", null, Module.stderr) : FS.symlink("/dev/tty1", "/dev/stderr");
                    var e = FS.open("/dev/stdin", "r");
                    assert(0 === e.fd, "invalid handle for stdin (" + e.fd + ")");
                    var r = FS.open("/dev/stdout", "w");
                    assert(1 === r.fd, "invalid handle for stdout (" + r.fd + ")");
                    var n = FS.open("/dev/stderr", "w");
                    assert(2 === n.fd, "invalid handle for stderr (" + n.fd + ")")
                },
                ensureErrnoError: function () {
                    FS.ErrnoError || (FS.ErrnoError = function (e, r) {
                        this.node = r, this.setErrno = function (e) {
                            this.errno = e;
                            for (var r in ERRNO_CODES)
                                if (ERRNO_CODES[r] === e) {
                                    this.code = r;
                                    break
                                }
                        }, this.setErrno(e), this.message = ERRNO_MESSAGES[e]
                    }, FS.ErrnoError.prototype = new Error, FS.ErrnoError.prototype.constructor = FS.ErrnoError, [ERRNO_CODES.ENOENT].forEach(function (e) {
                        FS.genericErrors[e] = new FS.ErrnoError(e), FS.genericErrors[e].stack = "<generic error, no stack>"
                    }))
                },
                staticInit: function () {
                    FS.ensureErrnoError(), FS.nameTable = new Array(4096), FS.mount(MEMFS, {}, "/"), FS.createDefaultDirectories(), FS.createDefaultDevices(), FS.createSpecialDirectories(), FS.filesystems = {
                        MEMFS: MEMFS,
                        IDBFS: IDBFS,
                        NODEFS: NODEFS,
                        WORKERFS: WORKERFS
                    }
                },
                init: function (e, r, n) {
                    assert(!FS.init.initialized, "FS.init was previously called. If you want to initialize later with custom parameters, remove any earlier calls (note that one is automatically added to the generated code)"), FS.init.initialized = !0, FS.ensureErrnoError(), Module.stdin = e || Module.stdin, Module.stdout = r || Module.stdout, Module.stderr = n || Module.stderr, FS.createStandardStreams()
                },
                quit: function () {
                    FS.init.initialized = !1;
                    var e = Module._fflush;
                    e && e(0);
                    for (var r = 0; r < FS.streams.length; r++) {
                        var n = FS.streams[r];
                        n && FS.close(n)
                    }
                },
                getMode: function (e, r) {
                    var n = 0;
                    return e && (n |= 365), r && (n |= 146), n
                },
                joinPath: function (e, r) {
                    var n = PATH.join.apply(null, e);
                    return r && "/" == n[0] && (n = n.substr(1)), n
                },
                absolutePath: function (e, r) {
                    return PATH.resolve(r, e)
                },
                standardizePath: function (e) {
                    return PATH.normalize(e)
                },
                findObject: function (e, r) {
                    var n = FS.analyzePath(e, r);
                    return n.exists ? n.object : (___setErrNo(n.error), null)
                },
                analyzePath: function (e, r) {
                    try {
                        var n = FS.lookupPath(e, {
                            follow: !r
                        });
                        e = n.path
                    } catch (t) {}
                    var o = {
                        isRoot: !1,
                        exists: !1,
                        error: 0,
                        name: null,
                        path: null,
                        object: null,
                        parentExists: !1,
                        parentPath: null,
                        parentObject: null
                    };
                    try {
                        var n = FS.lookupPath(e, {
                            parent: !0
                        });
                        o.parentExists = !0, o.parentPath = n.path, o.parentObject = n.node, o.name = PATH.basename(e), n = FS.lookupPath(e, {
                            follow: !r
                        }), o.exists = !0, o.path = n.path, o.object = n.node, o.name = n.node.name, o.isRoot = "/" === n.path
                    } catch (t) {
                        o.error = t.errno
                    }
                    return o
                },
                createFolder: function (e, r, n, t) {
                    var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                        i = FS.getMode(n, t);
                    return FS.mkdir(o, i)
                },
                createPath: function (e, r, n, t) {
                    e = "string" == typeof e ? e : FS.getPath(e);
                    for (var o = r.split("/").reverse(); o.length;) {
                        var i = o.pop();
                        if (i) {
                            var a = PATH.join2(e, i);
                            try {
                                FS.mkdir(a)
                            } catch (u) {}
                            e = a
                        }
                    }
                    return a
                },
                createFile: function (e, r, n, t, o) {
                    var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                        a = FS.getMode(t, o);
                    return FS.create(i, a)
                },
                createDataFile: function (e, r, n, t, o, i) {
                    var a = r ? PATH.join2("string" == typeof e ? e : FS.getPath(e), r) : e,
                        u = FS.getMode(t, o),
                        s = FS.create(a, u);
                    if (n) {
                        if ("string" == typeof n) {
                            for (var l = new Array(n.length), c = 0, f = n.length; c < f; ++c) l[c] = n.charCodeAt(c);
                            n = l
                        }
                        FS.chmod(s, 146 | u);
                        var d = FS.open(s, "w");
                        FS.write(d, n, 0, n.length, 0, i), FS.close(d), FS.chmod(s, u)
                    }
                    return s
                },
                createDevice: function (e, r, n, t) {
                    var o = PATH.join2("string" == typeof e ? e : FS.getPath(e), r),
                        i = FS.getMode(!!n, !!t);
                    FS.createDevice.major || (FS.createDevice.major = 64);
                    var a = FS.makedev(FS.createDevice.major++, 0);
                    return FS.registerDevice(a, {
                        open: function (e) {
                            e.seekable = !1
                        },
                        close: function (e) {
                            t && t.buffer && t.buffer.length && t(10)
                        },
                        read: function (e, r, t, o, i) {
                            for (var a = 0, u = 0; u < o; u++) {
                                var s;
                                try {
                                    s = n()
                                } catch (l) {
                                    throw new FS.ErrnoError(ERRNO_CODES.EIO)
                                }
                                if (void 0 === s && 0 === a) throw new FS.ErrnoError(ERRNO_CODES.EAGAIN);
                                if (null === s || void 0 === s) break;
                                a++, r[t + u] = s
                            }
                            return a && (e.node.timestamp = Date.now()), a
                        },
                        write: function (e, r, n, o, i) {
                            for (var a = 0; a < o; a++) try {
                                t(r[n + a])
                            } catch (u) {
                                throw new FS.ErrnoError(ERRNO_CODES.EIO)
                            }
                            return o && (e.node.timestamp = Date.now()), a
                        }
                    }), FS.mkdev(o, i, a)
                },
                createLink: function (e, r, n, t, o) {
                    var i = PATH.join2("string" == typeof e ? e : FS.getPath(e), r);
                    return FS.symlink(n, i)
                },
                forceLoadFile: function (e) {
                    if (e.isDevice || e.isFolder || e.link || e.contents) return !0;
                    var r = !0;
                    if ("undefined" != typeof XMLHttpRequest) throw new Error("Lazy loading should have been performed (contents set) in createLazyFile, but it was not. Lazy loading only works in web workers. Use --embed-file or --preload-file in emcc on the main thread.");
                    if (!Module.read) throw new Error("Cannot load without read() or XMLHttpRequest.");
                    try {
                        e.contents = intArrayFromString(Module.read(e.url), !0), e.usedBytes = e.contents.length
                    } catch (n) {
                        r = !1
                    }
                    return r || ___setErrNo(ERRNO_CODES.EIO), r
                },
                createLazyFile: function (e, r, n, t, o) {
                    function i() {
                        this.lengthKnown = !1, this.chunks = []
                    }
                    if (i.prototype.get = function (e) {
                            if (!(e > this.length - 1 || e < 0)) {
                                var r = e % this.chunkSize,
                                    n = e / this.chunkSize | 0;
                                return this.getter(n)[r]
                            }
                        }, i.prototype.setDataGetter = function (e) {
                            this.getter = e
                        }, i.prototype.cacheLength = function () {
                            var e = new XMLHttpRequest;
                            if (e.open("HEAD", n, !1), e.send(null), !(e.status >= 200 && e.status < 300 || 304 === e.status)) throw new Error("Couldn't load " + n + ". Status: " + e.status);
                            var r, t = Number(e.getResponseHeader("Content-length")),
                                o = (r = e.getResponseHeader("Accept-Ranges")) && "bytes" === r,
                                i = 1048576;
                            o || (i = t);
                            var a = function (e, r) {
                                    if (e > r) throw new Error("invalid range (" + e + ", " + r + ") or no bytes requested!");
                                    if (r > t - 1) throw new Error("only " + t + " bytes available! programmer error!");
                                    var o = new XMLHttpRequest;
                                    if (o.open("GET", n, !1), t !== i && o.setRequestHeader("Range", "bytes=" + e + "-" + r), "undefined" != typeof Uint8Array && (o.responseType = "arraybuffer"), o.overrideMimeType && o.overrideMimeType("text/plain; charset=x-user-defined"), o.send(null), !(o.status >= 200 && o.status < 300 || 304 === o.status)) throw new Error("Couldn't load " + n + ". Status: " + o.status);
                                    return void 0 !== o.response ? new Uint8Array(o.response || []) : intArrayFromString(o.responseText || "", !0)
                                },
                                u = this;
                            u.setDataGetter(function (e) {
                                var r = e * i,
                                    n = (e + 1) * i - 1;
                                if (n = Math.min(n, t - 1), "undefined" == typeof u.chunks[e] && (u.chunks[e] = a(r, n)), "undefined" == typeof u.chunks[e]) throw new Error("doXHR failed!");
                                return u.chunks[e]
                            }), this._length = t, this._chunkSize = i, this.lengthKnown = !0
                        }, "undefined" != typeof XMLHttpRequest) {
                        if (!ENVIRONMENT_IS_WORKER) throw "Cannot do synchronous binary XHRs outside webworkers in modern browsers. Use --embed-file or --preload-file in emcc";
                        var a = new i;
                        Object.defineProperty(a, "length", {
                            get: function () {
                                return this.lengthKnown || this.cacheLength(), this._length
                            }
                        }), Object.defineProperty(a, "chunkSize", {
                            get: function () {
                                return this.lengthKnown || this.cacheLength(), this._chunkSize
                            }
                        });
                        var u = {
                            isDevice: !1,
                            contents: a
                        }
                    } else var u = {
                        isDevice: !1,
                        url: n
                    };
                    var s = FS.createFile(e, r, u, t, o);
                    u.contents ? s.contents = u.contents : u.url && (s.contents = null, s.url = u.url), Object.defineProperty(s, "usedBytes", {
                        get: function () {
                            return this.contents.length
                        }
                    });
                    var l = {},
                        c = Object.keys(s.stream_ops);
                    return c.forEach(function (e) {
                        var r = s.stream_ops[e];
                        l[e] = function () {
                            if (!FS.forceLoadFile(s)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                            return r.apply(null, arguments)
                        }
                    }), l.read = function (e, r, n, t, o) {
                        if (!FS.forceLoadFile(s)) throw new FS.ErrnoError(ERRNO_CODES.EIO);
                        var i = e.node.contents;
                        if (o >= i.length) return 0;
                        var a = Math.min(i.length - o, t);
                        if (assert(a >= 0), i.slice)
                            for (var u = 0; u < a; u++) r[n + u] = i[o + u];
                        else
                            for (var u = 0; u < a; u++) r[n + u] = i.get(o + u);
                        return a
                    }, s.stream_ops = l, s
                },
                createPreloadedFile: function (e, r, n, t, o, i, a, u, s, l) {
                    function c(n) {
                        function c(n) {
                            l && l(), u || FS.createDataFile(e, r, n, t, o, s), i && i(), removeRunDependency(d)
                        }
                        var m = !1;
                        Module.preloadPlugins.forEach(function (e) {
                            m || e.canHandle(f) && (e.handle(n, f, c, function () {
                                a && a(), removeRunDependency(d)
                            }), m = !0)
                        }), m || c(n)
                    }
                    Browser.init();
                    var f = r ? PATH.resolve(PATH.join2(e, r)) : e,
                        d = getUniqueRunDependency("cp " + f);
                    addRunDependency(d), "string" == typeof n ? Browser.asyncLoad(n, function (e) {
                        c(e)
                    }, a) : c(n)
                },
                indexedDB: function () {
                    return window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB
                },
                DB_NAME: function () {
                    return "EM_FS_" + window.location.pathname
                },
                DB_VERSION: 20,
                DB_STORE_NAME: "FILE_DATA",
                saveFilesToDB: function (e, r, n) {
                    r = r || function () {}, n = n || function () {};
                    var t = FS.indexedDB();
                    try {
                        var o = t.open(FS.DB_NAME(), FS.DB_VERSION)
                    } catch (i) {
                        return n(i)
                    }
                    o.onupgradeneeded = function () {
                        console.log("creating db");
                        var e = o.result;
                        e.createObjectStore(FS.DB_STORE_NAME)
                    }, o.onsuccess = function () {
                        function t() {
                            0 == l ? r() : n()
                        }
                        var i = o.result,
                            a = i.transaction([FS.DB_STORE_NAME], "readwrite"),
                            u = a.objectStore(FS.DB_STORE_NAME),
                            s = 0,
                            l = 0,
                            c = e.length;
                        e.forEach(function (e) {
                            var r = u.put(FS.analyzePath(e).object.contents, e);
                            r.onsuccess = function () {
                                s++, s + l == c && t()
                            }, r.onerror = function () {
                                l++, s + l == c && t()
                            }
                        }), a.onerror = n
                    }, o.onerror = n
                },
                loadFilesFromDB: function (e, r, n) {
                    r = r || function () {}, n = n || function () {};
                    var t = FS.indexedDB();
                    try {
                        var o = t.open(FS.DB_NAME(), FS.DB_VERSION)
                    } catch (i) {
                        return n(i)
                    }
                    o.onupgradeneeded = n, o.onsuccess = function () {
                        function t() {
                            0 == c ? r() : n()
                        }
                        var i = o.result;
                        try {
                            var a = i.transaction([FS.DB_STORE_NAME], "readonly")
                        } catch (u) {
                            return void n(u)
                        }
                        var s = a.objectStore(FS.DB_STORE_NAME),
                            l = 0,
                            c = 0,
                            f = e.length;
                        e.forEach(function (e) {
                            var r = s.get(e);
                            r.onsuccess = function () {
                                FS.analyzePath(e).exists && FS.unlink(e), FS.createDataFile(PATH.dirname(e), PATH.basename(e), r.result, !0, !0, !0), l++, l + c == f && t()
                            }, r.onerror = function () {
                                c++, l + c == f && t()
                            }
                        }), a.onerror = n
                    }, o.onerror = n
                }
            },
            SYSCALLS = {
                DEFAULT_POLLMASK: 5,
                mappings: {},
                umask: 511,
                calculateAt: function (e, r) {
                    if ("/" !== r[0]) {
                        var n;
                        if (e === -100) n = FS.cwd();
                        else {
                            var t = FS.getStream(e);
                            if (!t) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                            n = t.path
                        }
                        r = PATH.join2(n, r)
                    }
                    return r
                },
                doStat: function (e, r, n) {
                    try {
                        var t = e(r)
                    } catch (o) {
                        if (o && o.node && PATH.normalize(r) !== PATH.normalize(FS.getPath(o.node))) return -ERRNO_CODES.ENOTDIR;
                        throw o
                    }
                    return HEAP32[n >> 2] = t.dev, HEAP32[n + 4 >> 2] = 0, HEAP32[n + 8 >> 2] = t.ino, HEAP32[n + 12 >> 2] = t.mode, HEAP32[n + 16 >> 2] = t.nlink, HEAP32[n + 20 >> 2] = t.uid, HEAP32[n + 24 >> 2] = t.gid, HEAP32[n + 28 >> 2] = t.rdev, HEAP32[n + 32 >> 2] = 0, HEAP32[n + 36 >> 2] = t.size, HEAP32[n + 40 >> 2] = 4096, HEAP32[n + 44 >> 2] = t.blocks, HEAP32[n + 48 >> 2] = t.atime.getTime() / 1e3 | 0, HEAP32[n + 52 >> 2] = 0, HEAP32[n + 56 >> 2] = t.mtime.getTime() / 1e3 | 0, HEAP32[n + 60 >> 2] = 0, HEAP32[n + 64 >> 2] = t.ctime.getTime() / 1e3 | 0, HEAP32[n + 68 >> 2] = 0, HEAP32[n + 72 >> 2] = t.ino, 0
                },
                doMsync: function (e, r, n, t) {
                    var o = new Uint8Array(HEAPU8.subarray(e, e + n));
                    FS.msync(r, o, 0, n, t)
                },
                doMkdir: function (e, r) {
                    return e = PATH.normalize(e), "/" === e[e.length - 1] && (e = e.substr(0, e.length - 1)), FS.mkdir(e, r, 0), 0
                },
                doMknod: function (e, r, n) {
                    switch (61440 & r) {
                        case 32768:
                        case 8192:
                        case 24576:
                        case 4096:
                        case 49152:
                            break;
                        default:
                            return -ERRNO_CODES.EINVAL
                    }
                    return FS.mknod(e, r, n), 0
                },
                doReadlink: function (e, r, n) {
                    if (n <= 0) return -ERRNO_CODES.EINVAL;
                    var t = FS.readlink(e);
                    return t = t.slice(0, Math.max(0, n)), writeStringToMemory(t, r, !0), t.length
                },
                doAccess: function (e, r) {
                    if (r & -8) return -ERRNO_CODES.EINVAL;
                    var n, t = FS.lookupPath(e, {
                        follow: !0
                    });
                    n = t.node;
                    var o = "";
                    return 4 & r && (o += "r"), 2 & r && (o += "w"), 1 & r && (o += "x"), o && FS.nodePermissions(n, o) ? -ERRNO_CODES.EACCES : 0
                },
                doDup: function (e, r, n) {
                    var t = FS.getStream(n);
                    return t && FS.close(t), FS.open(e, r, 0, n, n).fd
                },
                doReadv: function (e, r, n, t) {
                    for (var o = 0, i = 0; i < n; i++) {
                        var a = HEAP32[r + 8 * i >> 2],
                            u = HEAP32[r + (8 * i + 4) >> 2],
                            s = FS.read(e, HEAP8, a, u, t);
                        if (s < 0) return -1;
                        if (o += s, s < u) break
                    }
                    return o
                },
                doWritev: function (e, r, n, t) {
                    for (var o = 0, i = 0; i < n; i++) {
                        var a = HEAP32[r + 8 * i >> 2],
                            u = HEAP32[r + (8 * i + 4) >> 2],
                            s = FS.write(e, HEAP8, a, u, t);
                        if (s < 0) return -1;
                        o += s
                    }
                    return o
                },
                varargs: 0,
                get: function (e) {
                    SYSCALLS.varargs += 4;
                    var r = HEAP32[SYSCALLS.varargs - 4 >> 2];
                    return r
                },
                getStr: function () {
                    var e = Pointer_stringify(SYSCALLS.get());
                    return e
                },
                getStreamFromFD: function () {
                    var e = FS.getStream(SYSCALLS.get());
                    if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    return e
                },
                getSocketFromFD: function () {
                    var e = SOCKFS.getSocket(SYSCALLS.get());
                    if (!e) throw new FS.ErrnoError(ERRNO_CODES.EBADF);
                    return e
                },
                getSocketAddress: function (e) {
                    var r = SYSCALLS.get(),
                        n = SYSCALLS.get();
                    if (e && 0 === r) return null;
                    var t = __read_sockaddr(r, n);
                    if (t.errno) throw new FS.ErrnoError(t.errno);
                    return t.addr = DNS.lookup_addr(t.addr) || t.addr,
                        t
                },
                get64: function () {
                    var e = SYSCALLS.get(),
                        r = SYSCALLS.get();
                    return assert(e >= 0 ? 0 === r : r === -1), e
                },
                getZero: function () {
                    assert(0 === SYSCALLS.get())
                }
            };
        Module._i64Add = _i64Add, Module._memcpy = _memcpy, Module._memmove = _memmove;
        var Browser = {
            mainLoop: {
                scheduler: null,
                method: "",
                currentlyRunningMainloop: 0,
                func: null,
                arg: 0,
                timingMode: 0,
                timingValue: 0,
                currentFrameNumber: 0,
                queue: [],
                pause: function () {
                    Browser.mainLoop.scheduler = null, Browser.mainLoop.currentlyRunningMainloop++
                },
                resume: function () {
                    Browser.mainLoop.currentlyRunningMainloop++;
                    var e = Browser.mainLoop.timingMode,
                        r = Browser.mainLoop.timingValue,
                        n = Browser.mainLoop.func;
                    Browser.mainLoop.func = null, _emscripten_set_main_loop(n, 0, !1, Browser.mainLoop.arg, !0), _emscripten_set_main_loop_timing(e, r), Browser.mainLoop.scheduler()
                },
                updateStatus: function () {
                    if (Module.setStatus) {
                        var e = Module.statusMessage || "Please wait...",
                            r = Browser.mainLoop.remainingBlockers,
                            n = Browser.mainLoop.expectedBlockers;
                        r ? r < n ? Module.setStatus(e + " (" + (n - r) + "/" + n + ")") : Module.setStatus(e) : Module.setStatus("")
                    }
                },
                runIter: function (e) {
                    if (!ABORT) {
                        if (Module.preMainLoop) {
                            var r = Module.preMainLoop();
                            if (r === !1) return
                        }
                        try {
                            e()
                        } catch (n) {
                            if (n instanceof ExitStatus) return;
                            throw n && "object" == typeof n && n.stack && Module.printErr("exception thrown: " + [n, n.stack]), n
                        }
                        Module.postMainLoop && Module.postMainLoop()
                    }
                }
            },
            isFullScreen: !1,
            pointerLock: !1,
            moduleContextCreatedCallbacks: [],
            workers: [],
            init: function () {
                function e() {
                    Browser.pointerLock = document.pointerLockElement === o || document.mozPointerLockElement === o || document.webkitPointerLockElement === o || document.msPointerLockElement === o
                }
                if (Module.preloadPlugins || (Module.preloadPlugins = []), !Browser.initted) {
                    Browser.initted = !0;
                    try {
                        new Blob, Browser.hasBlobConstructor = !0
                    } catch (r) {
                        Browser.hasBlobConstructor = !1, console.log("warning: no blob constructor, cannot create blobs with mimetypes")
                    }
                    Browser.BlobBuilder = "undefined" != typeof MozBlobBuilder ? MozBlobBuilder : "undefined" != typeof WebKitBlobBuilder ? WebKitBlobBuilder : Browser.hasBlobConstructor ? null : console.log("warning: no BlobBuilder"), Browser.URLObject = "undefined" != typeof window ? window.URL ? window.URL : window.webkitURL : void 0, Module.noImageDecoding || "undefined" != typeof Browser.URLObject || (console.log("warning: Browser does not support creating object URLs. Built-in browser image decoding will not be available."), Module.noImageDecoding = !0);
                    var n = {};
                    n.canHandle = function (e) {
                        return !Module.noImageDecoding && /\.(jpg|jpeg|png|bmp)$/i.test(e)
                    }, n.handle = function (e, r, n, t) {
                        var o = null;
                        if (Browser.hasBlobConstructor) try {
                            o = new Blob([e], {
                                type: Browser.getMimetype(r)
                            }), o.size !== e.length && (o = new Blob([new Uint8Array(e).buffer], {
                                type: Browser.getMimetype(r)
                            }))
                        } catch (i) {
                            Runtime.warnOnce("Blob constructor present but fails: " + i + "; falling back to blob builder")
                        }
                        if (!o) {
                            var a = new Browser.BlobBuilder;
                            a.append(new Uint8Array(e).buffer), o = a.getBlob()
                        }
                        var u = Browser.URLObject.createObjectURL(o),
                            s = new Image;
                        s.onload = function () {
                            assert(s.complete, "Image " + r + " could not be decoded");
                            var t = document.createElement("canvas");
                            t.width = s.width, t.height = s.height;
                            var o = t.getContext("2d");
                            o.drawImage(s, 0, 0), Module.preloadedImages[r] = t, Browser.URLObject.revokeObjectURL(u), n && n(e)
                        }, s.onerror = function (e) {
                            console.log("Image " + u + " could not be decoded"), t && t()
                        }, s.src = u
                    }, Module.preloadPlugins.push(n);
                    var t = {};
                    t.canHandle = function (e) {
                        return !Module.noAudioDecoding && e.substr(-4) in {
                            ".ogg": 1,
                            ".wav": 1,
                            ".mp3": 1
                        }
                    }, t.handle = function (e, r, n, t) {
                        function o(t) {
                            a || (a = !0, Module.preloadedAudios[r] = t, n && n(e))
                        }

                        function i() {
                            a || (a = !0, Module.preloadedAudios[r] = new Audio, t && t())
                        }
                        var a = !1;
                        if (!Browser.hasBlobConstructor) return i();
                        try {
                            var u = new Blob([e], {
                                type: Browser.getMimetype(r)
                            })
                        } catch (s) {
                            return i()
                        }
                        var l = Browser.URLObject.createObjectURL(u),
                            c = new Audio;
                        c.addEventListener("canplaythrough", function () {
                            o(c)
                        }, !1), c.onerror = function (n) {
                            function t(e) {
                                for (var r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/", n = "=", t = "", o = 0, i = 0, a = 0; a < e.length; a++)
                                    for (o = o << 8 | e[a], i += 8; i >= 6;) {
                                        var u = o >> i - 6 & 63;
                                        i -= 6, t += r[u]
                                    }
                                return 2 == i ? (t += r[(3 & o) << 4], t += n + n) : 4 == i && (t += r[(15 & o) << 2], t += n), t
                            }
                            a || (console.log("warning: browser could not fully decode audio " + r + ", trying slower base64 approach"), c.src = "data:audio/x-" + r.substr(-3) + ";base64," + t(e), o(c))
                        }, c.src = l, Browser.safeSetTimeout(function () {
                            o(c)
                        }, 1e4)
                    }, Module.preloadPlugins.push(t);
                    var o = Module.canvas;
                    o && (o.requestPointerLock = o.requestPointerLock || o.mozRequestPointerLock || o.webkitRequestPointerLock || o.msRequestPointerLock || function () {}, o.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock || document.webkitExitPointerLock || document.msExitPointerLock || function () {}, o.exitPointerLock = o.exitPointerLock.bind(document), document.addEventListener("pointerlockchange", e, !1), document.addEventListener("mozpointerlockchange", e, !1), document.addEventListener("webkitpointerlockchange", e, !1), document.addEventListener("mspointerlockchange", e, !1), Module.elementPointerLock && o.addEventListener("click", function (e) {
                        !Browser.pointerLock && o.requestPointerLock && (o.requestPointerLock(), e.preventDefault())
                    }, !1))
                }
            },
            createContext: function (e, r, n, t) {
                if (r && Module.ctx && e == Module.canvas) return Module.ctx;
                var o, i;
                if (r) {
                    var a = {
                        antialias: !1,
                        alpha: !1
                    };
                    if (t)
                        for (var u in t) a[u] = t[u];
                    i = GL.createContext(e, a), i && (o = GL.getContext(i).GLctx), e.style.backgroundColor = "black"
                } else o = e.getContext("2d");
                return o ? (n && (r || assert("undefined" == typeof GLctx, "cannot set in module if GLctx is used, but we are a non-GL context that would replace it"), Module.ctx = o, r && GL.makeContextCurrent(i), Module.useWebGL = r, Browser.moduleContextCreatedCallbacks.forEach(function (e) {
                    e()
                }), Browser.init()), o) : null
            },
            destroyContext: function (e, r, n) {},
            fullScreenHandlersInstalled: !1,
            lockPointer: void 0,
            resizeCanvas: void 0,
            requestFullScreen: function (e, r, n) {
                function t() {
                    Browser.isFullScreen = !1;
                    var e = o.parentNode;
                    (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === e ? (o.cancelFullScreen = document.cancelFullScreen || document.mozCancelFullScreen || document.webkitCancelFullScreen || document.msExitFullscreen || document.exitFullscreen || function () {}, o.cancelFullScreen = o.cancelFullScreen.bind(document), Browser.lockPointer && o.requestPointerLock(), Browser.isFullScreen = !0, Browser.resizeCanvas && Browser.setFullScreenCanvasSize()) : (e.parentNode.insertBefore(o, e), e.parentNode.removeChild(e), Browser.resizeCanvas && Browser.setWindowedCanvasSize()), Module.onFullScreen && Module.onFullScreen(Browser.isFullScreen), Browser.updateCanvasDimensions(o)
                }
                Browser.lockPointer = e, Browser.resizeCanvas = r, Browser.vrDevice = n, "undefined" == typeof Browser.lockPointer && (Browser.lockPointer = !0), "undefined" == typeof Browser.resizeCanvas && (Browser.resizeCanvas = !1), "undefined" == typeof Browser.vrDevice && (Browser.vrDevice = null);
                var o = Module.canvas;
                Browser.fullScreenHandlersInstalled || (Browser.fullScreenHandlersInstalled = !0, document.addEventListener("fullscreenchange", t, !1), document.addEventListener("mozfullscreenchange", t, !1), document.addEventListener("webkitfullscreenchange", t, !1), document.addEventListener("MSFullscreenChange", t, !1));
                var i = document.createElement("div");
                o.parentNode.insertBefore(i, o), i.appendChild(o), i.requestFullScreen = i.requestFullScreen || i.mozRequestFullScreen || i.msRequestFullscreen || (i.webkitRequestFullScreen ? function () {
                    i.webkitRequestFullScreen(Element.ALLOW_KEYBOARD_INPUT)
                } : null), n ? i.requestFullScreen({
                    vrDisplay: n
                }) : i.requestFullScreen()
            },
            nextRAF: 0,
            fakeRequestAnimationFrame: function (e) {
                var r = Date.now();
                if (0 === Browser.nextRAF) Browser.nextRAF = r + 1e3 / 60;
                else
                    for (; r + 2 >= Browser.nextRAF;) Browser.nextRAF += 1e3 / 60;
                var n = Math.max(Browser.nextRAF - r, 0);
                setTimeout(e, n)
            },
            requestAnimationFrame: function (e) {
                "undefined" == typeof window ? Browser.fakeRequestAnimationFrame(e) : (window.requestAnimationFrame || (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || window.oRequestAnimationFrame || Browser.fakeRequestAnimationFrame), window.requestAnimationFrame(e))
            },
            safeCallback: function (e) {
                return function () {
                    if (!ABORT) return e.apply(null, arguments)
                }
            },
            allowAsyncCallbacks: !0,
            queuedAsyncCallbacks: [],
            pauseAsyncCallbacks: function () {
                Browser.allowAsyncCallbacks = !1
            },
            resumeAsyncCallbacks: function () {
                if (Browser.allowAsyncCallbacks = !0, Browser.queuedAsyncCallbacks.length > 0) {
                    var e = Browser.queuedAsyncCallbacks;
                    Browser.queuedAsyncCallbacks = [], e.forEach(function (e) {
                        e()
                    })
                }
            },
            safeRequestAnimationFrame: function (e) {
                return Browser.requestAnimationFrame(function () {
                    ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
                })
            },
            safeSetTimeout: function (e, r) {
                return Module.noExitRuntime = !0, setTimeout(function () {
                    ABORT || (Browser.allowAsyncCallbacks ? e() : Browser.queuedAsyncCallbacks.push(e))
                }, r)
            },
            safeSetInterval: function (e, r) {
                return Module.noExitRuntime = !0, setInterval(function () {
                    ABORT || Browser.allowAsyncCallbacks && e()
                }, r)
            },
            getMimetype: function (e) {
                return {
                    jpg: "image/jpeg",
                    jpeg: "image/jpeg",
                    png: "image/png",
                    bmp: "image/bmp",
                    ogg: "audio/ogg",
                    wav: "audio/wav",
                    mp3: "audio/mpeg"
                }[e.substr(e.lastIndexOf(".") + 1)]
            },
            getUserMedia: function (e) {
                window.getUserMedia || (window.getUserMedia = navigator.getUserMedia || navigator.mozGetUserMedia), window.getUserMedia(e)
            },
            getMovementX: function (e) {
                return e.movementX || e.mozMovementX || e.webkitMovementX || 0
            },
            getMovementY: function (e) {
                return e.movementY || e.mozMovementY || e.webkitMovementY || 0
            },
            getMouseWheelDelta: function (e) {
                var r = 0;
                switch (e.type) {
                    case "DOMMouseScroll":
                        r = e.detail;
                        break;
                    case "mousewheel":
                        r = e.wheelDelta;
                        break;
                    case "wheel":
                        r = e.deltaY;
                        break;
                    default:
                        throw "unrecognized mouse wheel event: " + e.type
                }
                return r
            },
            mouseX: 0,
            mouseY: 0,
            mouseMovementX: 0,
            mouseMovementY: 0,
            touches: {},
            lastTouches: {},
            calculateMouseEvent: function (e) {
                if (Browser.pointerLock) "mousemove" != e.type && "mozMovementX" in e ? Browser.mouseMovementX = Browser.mouseMovementY = 0 : (Browser.mouseMovementX = Browser.getMovementX(e), Browser.mouseMovementY = Browser.getMovementY(e)), "undefined" != typeof SDL ? (Browser.mouseX = SDL.mouseX + Browser.mouseMovementX, Browser.mouseY = SDL.mouseY + Browser.mouseMovementY) : (Browser.mouseX += Browser.mouseMovementX, Browser.mouseY += Browser.mouseMovementY);
                else {
                    var r = Module.canvas.getBoundingClientRect(),
                        n = Module.canvas.width,
                        t = Module.canvas.height,
                        o = "undefined" != typeof window.scrollX ? window.scrollX : window.pageXOffset,
                        i = "undefined" != typeof window.scrollY ? window.scrollY : window.pageYOffset;
                    if ("touchstart" === e.type || "touchend" === e.type || "touchmove" === e.type) {
                        var a = e.touch;
                        if (void 0 === a) return;
                        var u = a.pageX - (o + r.left),
                            s = a.pageY - (i + r.top);
                        u *= n / r.width, s *= t / r.height;
                        var l = {
                            x: u,
                            y: s
                        };
                        if ("touchstart" === e.type) Browser.lastTouches[a.identifier] = l, Browser.touches[a.identifier] = l;
                        else if ("touchend" === e.type || "touchmove" === e.type) {
                            var c = Browser.touches[a.identifier];
                            c || (c = l), Browser.lastTouches[a.identifier] = c, Browser.touches[a.identifier] = l
                        }
                        return
                    }
                    var f = e.pageX - (o + r.left),
                        d = e.pageY - (i + r.top);
                    f *= n / r.width, d *= t / r.height, Browser.mouseMovementX = f - Browser.mouseX, Browser.mouseMovementY = d - Browser.mouseY, Browser.mouseX = f, Browser.mouseY = d
                }
            },
            xhrLoad: function (e, r, n) {
                var t = new XMLHttpRequest;
                t.open("GET", e, !0), t.responseType = "arraybuffer", t.onload = function () {
                    200 == t.status || 0 == t.status && t.response ? r(t.response) : n()
                }, t.onerror = n, t.send(null)
            },
            asyncLoad: function (e, r, n, t) {
                Browser.xhrLoad(e, function (n) {
                    assert(n, 'Loading data file "' + e + '" failed (no arrayBuffer).'), r(new Uint8Array(n)), t || removeRunDependency("al " + e)
                }, function (r) {
                    if (!n) throw 'Loading data file "' + e + '" failed.';
                    n()
                }), t || addRunDependency("al " + e)
            },
            resizeListeners: [],
            updateResizeListeners: function () {
                var e = Module.canvas;
                Browser.resizeListeners.forEach(function (r) {
                    r(e.width, e.height)
                })
            },
            setCanvasSize: function (e, r, n) {
                var t = Module.canvas;
                Browser.updateCanvasDimensions(t, e, r), n || Browser.updateResizeListeners()
            },
            windowedWidth: 0,
            windowedHeight: 0,
            setFullScreenCanvasSize: function () {
                if ("undefined" != typeof SDL) {
                    var e = HEAPU32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2];
                    e = 8388608 | e, HEAP32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2] = e
                }
                Browser.updateResizeListeners()
            },
            setWindowedCanvasSize: function () {
                if ("undefined" != typeof SDL) {
                    var e = HEAPU32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2];
                    e &= -8388609, HEAP32[SDL.screen + 0 * Runtime.QUANTUM_SIZE >> 2] = e
                }
                Browser.updateResizeListeners()
            },
            updateCanvasDimensions: function (e, r, n) {
                r && n ? (e.widthNative = r, e.heightNative = n) : (r = e.widthNative, n = e.heightNative);
                var t = r,
                    o = n;
                if (Module.forcedAspectRatio && Module.forcedAspectRatio > 0 && (t / o < Module.forcedAspectRatio ? t = Math.round(o * Module.forcedAspectRatio) : o = Math.round(t / Module.forcedAspectRatio)), (document.webkitFullScreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.mozFullscreenElement || document.fullScreenElement || document.fullscreenElement || document.msFullScreenElement || document.msFullscreenElement || document.webkitCurrentFullScreenElement) === e.parentNode && "undefined" != typeof screen) {
                    var i = Math.min(screen.width / t, screen.height / o);
                    t = Math.round(t * i), o = Math.round(o * i)
                }
                Browser.resizeCanvas ? (e.width != t && (e.width = t), e.height != o && (e.height = o), "undefined" != typeof e.style && (e.style.removeProperty("width"), e.style.removeProperty("height"))) : (e.width != r && (e.width = r), e.height != n && (e.height = n), "undefined" != typeof e.style && (t != r || o != n ? (e.style.setProperty("width", t + "px", "important"), e.style.setProperty("height", o + "px", "important")) : (e.style.removeProperty("width"), e.style.removeProperty("height"))))
            },
            wgetRequests: {},
            nextWgetRequestHandle: 0,
            getNextWgetRequestHandle: function () {
                var e = Browser.nextWgetRequestHandle;
                return Browser.nextWgetRequestHandle++, e
            }
        };
        if (FS.staticInit(), __ATINIT__.unshift(function () {
                Module.noFSInit || FS.init.initialized || FS.init()
            }), __ATMAIN__.push(function () {
                FS.ignorePermissions = !1
            }), __ATEXIT__.push(function () {
                FS.quit()
            }), Module.FS_createFolder = FS.createFolder, Module.FS_createPath = FS.createPath, Module.FS_createDataFile = FS.createDataFile, Module.FS_createPreloadedFile = FS.createPreloadedFile, Module.FS_createLazyFile = FS.createLazyFile, Module.FS_createLink = FS.createLink, Module.FS_createDevice = FS.createDevice, Module.FS_unlink = FS.unlink, __ATINIT__.unshift(function () {
                TTY.init()
            }), __ATEXIT__.push(function () {
                TTY.shutdown()
            }), ENVIRONMENT_IS_NODE) {
            var fs = require("fs"),
                NODEJS_PATH = require("path");
            NODEFS.staticInit()
        }
        Module.requestFullScreen = function (e, r, n) {
            Browser.requestFullScreen(e, r, n)
        }, Module.requestAnimationFrame = function (e) {
            Browser.requestAnimationFrame(e)
        }, Module.setCanvasSize = function (e, r, n) {
            Browser.setCanvasSize(e, r, n)
        }, Module.pauseMainLoop = function () {
            Browser.mainLoop.pause()
        }, Module.resumeMainLoop = function () {
            Browser.mainLoop.resume()
        }, Module.getUserMedia = function () {
            Browser.getUserMedia()
        }, Module.createContext = function (e, r, n, t) {
            return Browser.createContext(e, r, n, t)
        }, STACK_BASE = STACKTOP = Runtime.alignMemory(STATICTOP), staticSealed = !0, STACK_MAX = STACK_BASE + TOTAL_STACK, DYNAMIC_BASE = DYNAMICTOP = Runtime.alignMemory(STACK_MAX), assert(DYNAMIC_BASE < TOTAL_MEMORY, "TOTAL_MEMORY not big enough for stack");
        var cttz_i8 = allocate([8, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 7, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 6, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 5, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0, 4, 0, 1, 0, 2, 0, 1, 0, 3, 0, 1, 0, 2, 0, 1, 0], "i8", ALLOC_DYNAMIC);
        Module.asmGlobalArg = {
            Math: Math,
            Int8Array: Int8Array,
            Int16Array: Int16Array,
            Int32Array: Int32Array,
            Uint8Array: Uint8Array,
            Uint16Array: Uint16Array,
            Uint32Array: Uint32Array,
            Float32Array: Float32Array,
            Float64Array: Float64Array,
            NaN: NaN,
            Infinity: 1 / 0
        }, Module.asmLibraryArg = {
            abort: abort,
            assert: assert,
            invoke_ii: invoke_ii,
            jsCall_ii: jsCall_ii,
            invoke_iiii: invoke_iiii,
            jsCall_iiii: jsCall_iiii,
            invoke_viiii: invoke_viiii,
            jsCall_viiii: jsCall_viiii,
            invoke_vi: invoke_vi,
            jsCall_vi: jsCall_vi,
            _pthread_cleanup_pop: _pthread_cleanup_pop,
            ___lock: ___lock,
            ___assert_fail: ___assert_fail,
            _pthread_self: _pthread_self,
            _emscripten_set_main_loop: _emscripten_set_main_loop,
            _abort: _abort,
            _emscripten_set_main_loop_timing: _emscripten_set_main_loop_timing,
            ___syscall6: ___syscall6,
            _sbrk: _sbrk,
            _time: _time,
            ___setErrNo: ___setErrNo,
            _emscripten_memcpy_big: _emscripten_memcpy_big,
            ___syscall54: ___syscall54,
            ___unlock: ___unlock,
            ___syscall140: ___syscall140,
            _pthread_cleanup_push: _pthread_cleanup_push,
            _sysconf: _sysconf,
            ___syscall146: ___syscall146,
            STACKTOP: STACKTOP,
            STACK_MAX: STACK_MAX,
            tempDoublePtr: tempDoublePtr,
            ABORT: ABORT,
            cttz_i8: cttz_i8
        };
        var asm = function (e, r, n) {
                "use asm";
                var t = new e.Int8Array(n);
                var o = new e.Int16Array(n);
                var i = new e.Int32Array(n);
                var a = new e.Uint8Array(n);
                var u = new e.Uint16Array(n);
                var s = new e.Uint32Array(n);
                var l = new e.Float32Array(n);
                var c = new e.Float64Array(n);
                var f = r.STACKTOP | 0;
                var d = r.STACK_MAX | 0;
                var m = r.tempDoublePtr | 0;
                var E = r.ABORT | 0;
                var S = r.cttz_i8 | 0;
                var p = 0;
                var h = 0;
                var _ = 0;
                var w = 0;
                var v = e.NaN,
                    F = e.Infinity;
                var g = 0,
                    y = 0,
                    M = 0,
                    A = 0,
                    R = 0,
                    O = 0,
                    b = 0,
                    k = 0,
                    T = 0;
                var N = 0;
                var D = 0;
                var P = 0;
                var C = 0;
                var L = 0;
                var B = 0;
                var I = 0;
                var H = 0;
                var x = 0;
                var U = 0;
                var z = e.Math.floor;
                var Y = e.Math.abs;
                var j = e.Math.sqrt;
                var V = e.Math.pow;
                var q = e.Math.cos;
                var K = e.Math.sin;
                var W = e.Math.tan;
                var X = e.Math.acos;
                var G = e.Math.asin;
                var J = e.Math.atan;
                var Z = e.Math.atan2;
                var Q = e.Math.exp;
                var $ = e.Math.log;
                var ee = e.Math.ceil;
                var re = e.Math.imul;
                var ne = e.Math.min;
                var te = e.Math.clz32;
                var oe = r.abort;
                var ie = r.assert;
                var ae = r.invoke_ii;
                var ue = r.jsCall_ii;
                var se = r.invoke_iiii;
                var le = r.jsCall_iiii;
                var ce = r.invoke_viiii;
                var fe = r.jsCall_viiii;
                var de = r.invoke_vi;
                var me = r.jsCall_vi;
                var Ee = r._pthread_cleanup_pop;
                var Se = r.___lock;
                var pe = r.___assert_fail;
                var he = r._pthread_self;
                var _e = r._emscripten_set_main_loop;
                var we = r._abort;
                var ve = r._emscripten_set_main_loop_timing;
                var Fe = r.___syscall6;
                var ge = r._sbrk;
                var ye = r._time;
                var Me = r.___setErrNo;
                var Ae = r._emscripten_memcpy_big;
                var Re = r.___syscall54;
                var Oe = r.___unlock;
                var be = r.___syscall140;
                var ke = r._pthread_cleanup_push;
                var Te = r._sysconf;
                var Ne = r.___syscall146;
                var De = 0;

                function Pe(e) {
                    e = e | 0;
                    var r = 0;
                    r = f;
                    f = f + e | 0;
                    f = f + 15 & -16;
                    return r | 0
                }

                function Ce() {
                    return f | 0
                }

                function Le(e) {
                    e = e | 0;
                    f = e
                }

                function Be(e, r) {
                    e = e | 0;
                    r = r | 0;
                    f = e;
                    d = r
                }

                function Ie(e, r) {
                    e = e | 0;
                    r = r | 0;
                    if (!p) {
                        p = e;
                        h = r
                    }
                }

                function He(e) {
                    e = e | 0;
                    t[m >> 0] = t[e >> 0];
                    t[m + 1 >> 0] = t[e + 1 >> 0];
                    t[m + 2 >> 0] = t[e + 2 >> 0];
                    t[m + 3 >> 0] = t[e + 3 >> 0]
                }

                function xe(e) {
                    e = e | 0;
                    t[m >> 0] = t[e >> 0];
                    t[m + 1 >> 0] = t[e + 1 >> 0];
                    t[m + 2 >> 0] = t[e + 2 >> 0];
                    t[m + 3 >> 0] = t[e + 3 >> 0];
                    t[m + 4 >> 0] = t[e + 4 >> 0];
                    t[m + 5 >> 0] = t[e + 5 >> 0];
                    t[m + 6 >> 0] = t[e + 6 >> 0];
                    t[m + 7 >> 0] = t[e + 7 >> 0]
                }

                function Ue(e) {
                    e = e | 0;
                    N = e
                }

                function ze() {
                    return N | 0
                }

                function Ye(e) {
                    e = e | 0;
                    return (a[(i[e >> 2] | 0) + 5 >> 0] | 0) & 2 | 0
                }

                function je(e) {
                    e = e | 0;
                    e = i[e >> 2] | 0;
                    return (a[e + 15 >> 0] | 0) << 8 | (a[e + 14 >> 0] | 0) | (a[e + 16 >> 0] | 0) << 16 | (a[e + 17 >> 0] | 0) << 24 | 0
                }

                function Ve(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0;
                    if (!e) {
                        e = -1;
                        return e | 0
                    }
                    Mr(e | 0, 0, 360) | 0;
                    i[e + 4 >> 2] = 16384;
                    i[e + 24 >> 2] = 1024;
                    t = hr(16384) | 0;
                    i[e >> 2] = t;
                    n = hr(4096) | 0;
                    o = e + 16 | 0;
                    i[o >> 2] = n;
                    a = hr(8192) | 0;
                    u = e + 20 | 0;
                    i[u >> 2] = a;
                    do
                        if (t) {
                            if ((a | 0) == 0 | (n | 0) == 0) {
                                _r(t);
                                n = i[o >> 2] | 0;
                                break
                            }
                            i[e + 336 >> 2] = r;
                            e = 0;
                            return e | 0
                        }
                    while (0);
                    if (n) _r(n);
                    n = i[u >> 2] | 0;
                    if (n) _r(n);
                    Mr(e | 0, 0, 360) | 0;
                    e = -1;
                    return e | 0
                }

                function qe(e) {
                    e = e | 0;
                    var r = 0;
                    if (!e) return 0;
                    r = i[e >> 2] | 0;
                    if (r) _r(r);
                    r = i[e + 16 >> 2] | 0;
                    if (r) _r(r);
                    r = i[e + 20 >> 2] | 0;
                    if (r) _r(r);
                    _r(e);
                    return 0
                }

                function Ke(e) {
                    e = e | 0;
                    if (!e) return 0;
                    i[e >> 2] = 0;
                    i[e + 4 >> 2] = 0;
                    i[e + 8 >> 2] = 0;
                    i[e + 12 >> 2] = 0;
                    i[e + 16 >> 2] = 0;
                    i[e + 20 >> 2] = 0;
                    i[e + 24 >> 2] = 0;
                    return 0
                }

                function We(e) {
                    e = e | 0;
                    var r = 0;
                    if (!e) return 0;
                    r = i[e >> 2] | 0;
                    if (r) _r(r);
                    _r(e);
                    return 0
                }

                function Xe(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0;
                    u = e + 4 | 0;
                    n = i[u >> 2] | 0;
                    if ((n | 0) <= -1) {
                        e = 0;
                        return e | 0
                    }
                    a = e + 12 | 0;
                    t = i[a >> 2] | 0;
                    s = e + 8 | 0;
                    if (!t) t = n;
                    else {
                        o = (i[s >> 2] | 0) - t | 0;
                        i[s >> 2] = o;
                        if ((o | 0) > 0) {
                            n = i[e >> 2] | 0;
                            br(n | 0, n + t | 0, o | 0) | 0;
                            n = i[u >> 2] | 0
                        }
                        i[a >> 2] = 0;
                        t = n
                    }
                    n = i[s >> 2] | 0;
                    do
                        if ((t - n | 0) < (r | 0)) {
                            o = r + 4096 + n | 0;
                            n = i[e >> 2] | 0;
                            if (!n) t = hr(o) | 0;
                            else t = vr(n, o) | 0;
                            if (t) {
                                i[e >> 2] = t;
                                i[u >> 2] = o;
                                n = i[s >> 2] | 0;
                                break
                            }
                            n = i[e >> 2] | 0;
                            if (n) _r(n);
                            i[e >> 2] = 0;
                            i[e + 4 >> 2] = 0;
                            i[e + 8 >> 2] = 0;
                            i[e + 12 >> 2] = 0;
                            i[e + 16 >> 2] = 0;
                            i[e + 20 >> 2] = 0;
                            i[e + 24 >> 2] = 0;
                            e = 0;
                            return e | 0
                        } else t = i[e >> 2] | 0; while (0);
                    e = t + n | 0;
                    return e | 0
                }

                function Ge(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0;
                    t = i[e + 4 >> 2] | 0;
                    if ((t | 0) <= -1) {
                        t = -1;
                        return t | 0
                    }
                    n = e + 8 | 0;
                    e = (i[n >> 2] | 0) + r | 0;
                    if ((e | 0) > (t | 0)) {
                        t = -1;
                        return t | 0
                    }
                    i[n >> 2] = e;
                    t = 0;
                    return t | 0
                }

                function Je(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        o = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0,
                        h = 0,
                        _ = 0,
                        w = 0,
                        v = 0,
                        F = 0,
                        g = 0,
                        y = 0,
                        M = 0,
                        A = 0;
                    A = f;
                    f = f + 16 | 0;
                    h = A;
                    _ = i[e >> 2] | 0;
                    M = e + 12 | 0;
                    w = i[M >> 2] | 0;
                    g = _ + w | 0;
                    F = e + 8 | 0;
                    v = (i[F >> 2] | 0) - w | 0;
                    if ((i[e + 4 >> 2] | 0) <= -1) {
                        M = 0;
                        f = A;
                        return M | 0
                    }
                    y = e + 20 | 0;
                    n = i[y >> 2] | 0;
                    do
                        if (!n) {
                            if ((v | 0) < 27) {
                                M = 0;
                                f = A;
                                return M | 0
                            }
                            if (Er(g, 1692, 4) | 0) {
                                n = e + 24 | 0;
                                break
                            }
                            c = _ + (w + 26) | 0;
                            o = t[c >> 0] | 0;
                            n = (o & 255) + 27 | 0;
                            if ((v | 0) < (n | 0)) {
                                M = 0;
                                f = A;
                                return M | 0
                            }
                            if (o << 24 >> 24) {
                                o = w + 27 | 0;
                                u = e + 24 | 0;
                                s = i[u >> 2] | 0;
                                l = 0;
                                do {
                                    s = s + (a[_ + (o + l) >> 0] | 0) | 0;
                                    i[u >> 2] = s;
                                    l = l + 1 | 0
                                } while ((l | 0) < (a[c >> 0] | 0 | 0))
                            }
                            i[y >> 2] = n;
                            o = 11
                        } else o = 11; while (0);
                    do
                        if ((o | 0) == 11) {
                            p = e + 24 | 0;
                            if ((n + (i[p >> 2] | 0) | 0) > (v | 0)) {
                                M = 0;
                                f = A;
                                return M | 0
                            }
                            c = _ + (w + 22) | 0;
                            d = a[c >> 0] | a[c + 1 >> 0] << 8 | a[c + 2 >> 0] << 16 | a[c + 3 >> 0] << 24;
                            i[h >> 2] = d;
                            t[c >> 0] = 0;
                            t[c + 1 >> 0] = 0;
                            t[c + 2 >> 0] = 0;
                            t[c + 3 >> 0] = 0;
                            o = i[y >> 2] | 0;
                            s = o + w | 0;
                            l = i[p >> 2] | 0;
                            t[c >> 0] = 0;
                            m = _ + (w + 23) | 0;
                            t[m >> 0] = 0;
                            E = _ + (w + 24) | 0;
                            t[E >> 0] = 0;
                            S = _ + (w + 25) | 0;
                            t[S >> 0] = 0;
                            if ((o | 0) > 0) {
                                n = 0;
                                u = 0;
                                do {
                                    n = i[8 + (((a[_ + (u + w) >> 0] | 0) ^ n >>> 24) << 2) >> 2] ^ n << 8;
                                    u = u + 1 | 0
                                } while ((u | 0) != (o | 0))
                            } else n = 0;
                            if ((l | 0) > 0) {
                                o = 0;
                                do {
                                    n = i[8 + (((a[_ + (s + o) >> 0] | 0) ^ n >>> 24) << 2) >> 2] ^ n << 8;
                                    o = o + 1 | 0
                                } while ((o | 0) != (l | 0))
                            }
                            t[c >> 0] = n;
                            t[m >> 0] = n >>> 8;
                            t[E >> 0] = n >>> 16;
                            t[S >> 0] = n >>> 24;
                            if (Er(h, c, 4) | 0) {
                                t[c >> 0] = d;
                                t[c + 1 >> 0] = d >> 8;
                                t[c + 2 >> 0] = d >> 16;
                                t[c + 3 >> 0] = d >> 24;
                                n = p;
                                break
                            }
                            n = i[e >> 2] | 0;
                            u = i[M >> 2] | 0;
                            if (!r) {
                                n = i[y >> 2] | 0;
                                o = i[p >> 2] | 0
                            } else {
                                i[r >> 2] = n + u;
                                g = i[y >> 2] | 0;
                                i[r + 4 >> 2] = g;
                                i[r + 8 >> 2] = n + (g + u);
                                o = i[p >> 2] | 0;
                                i[r + 12 >> 2] = o;
                                n = g
                            }
                            i[e + 16 >> 2] = 0;
                            e = o + n | 0;
                            i[M >> 2] = u + e;
                            i[y >> 2] = 0;
                            i[p >> 2] = 0;
                            M = e;
                            f = A;
                            return M | 0
                        }
                    while (0);
                    i[y >> 2] = 0;
                    i[n >> 2] = 0;
                    n = mr(_ + (w + 1) | 0, 79, v + -1 | 0) | 0;
                    o = i[e >> 2] | 0;
                    if (!n) n = o + (i[F >> 2] | 0) | 0;
                    e = n;
                    i[M >> 2] = e - o;
                    M = g - e | 0;
                    f = A;
                    return M | 0
                }

                function Ze(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0;
                    e: do
                        if ((i[e + 4 >> 2] | 0) > -1) {
                            n = e + 16 | 0;
                            do {
                                t = Je(e, r) | 0;
                                if ((t | 0) > 0) {
                                    n = 1;
                                    break e
                                }
                                if (!t) {
                                    n = 0;
                                    break e
                                }
                            } while ((i[n >> 2] | 0) != 0);
                            i[n >> 2] = 1;
                            n = -1
                        } else n = 0; while (0);
                    return n | 0
                }

                function Qe(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        o = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0,
                        h = 0,
                        _ = 0,
                        w = 0,
                        v = 0,
                        F = 0,
                        g = 0,
                        y = 0,
                        M = 0;
                    w = i[r >> 2] | 0;
                    S = i[r + 8 >> 2] | 0;
                    n = i[r + 12 >> 2] | 0;
                    f = t[w + 4 >> 0] | 0;
                    v = a[w + 5 >> 0] | 0;
                    E = v & 1;
                    p = v & 2;
                    v = v & 4;
                    g = Ar(a[w + 13 >> 0] | 0 | 0, 0, 8) | 0;
                    g = Ar(g | (a[w + 12 >> 0] | 0) | 0, N | 0, 8) | 0;
                    g = Ar(g | (a[w + 11 >> 0] | 0) | 0, N | 0, 8) | 0;
                    g = Ar(g | (a[w + 10 >> 0] | 0) | 0, N | 0, 8) | 0;
                    g = Ar(g | (a[w + 9 >> 0] | 0) | 0, N | 0, 8) | 0;
                    g = Ar(g | (a[w + 8 >> 0] | 0) | 0, N | 0, 8) | 0;
                    g = Ar(g | (a[w + 7 >> 0] | 0) | 0, N | 0, 8) | 0;
                    F = N;
                    g = g | (a[w + 6 >> 0] | 0);
                    d = (a[w + 15 >> 0] | 0) << 8 | (a[w + 14 >> 0] | 0) | (a[w + 16 >> 0] | 0) << 16 | (a[w + 17 >> 0] | 0) << 24;
                    y = (a[w + 19 >> 0] | 0) << 8 | (a[w + 18 >> 0] | 0) | (a[w + 20 >> 0] | 0) << 16 | (a[w + 21 >> 0] | 0) << 24;
                    _ = a[w + 26 >> 0] | 0;
                    if (!e) {
                        e = -1;
                        return e | 0
                    }
                    s = i[e >> 2] | 0;
                    if (!s) {
                        e = -1;
                        return e | 0
                    }
                    l = e + 36 | 0;
                    c = i[l >> 2] | 0;
                    r = e + 12 | 0;
                    o = i[r >> 2] | 0;
                    if (o) {
                        m = e + 8 | 0;
                        h = i[m >> 2] | 0;
                        u = h - o | 0;
                        i[m >> 2] = u;
                        if ((h | 0) != (o | 0)) br(s | 0, s + o | 0, u | 0) | 0;
                        i[r >> 2] = 0
                    }
                    if (c) {
                        o = e + 28 | 0;
                        r = i[o >> 2] | 0;
                        if ((r | 0) == (c | 0)) r = c;
                        else {
                            h = i[e + 16 >> 2] | 0;
                            br(h | 0, h + (c << 2) | 0, r - c << 2 | 0) | 0;
                            r = i[e + 20 >> 2] | 0;
                            br(r | 0, r + (c << 3) | 0, (i[o >> 2] | 0) - c << 3 | 0) | 0;
                            r = i[o >> 2] | 0
                        }
                        i[o >> 2] = r - c;
                        h = e + 32 | 0;
                        i[h >> 2] = (i[h >> 2] | 0) - c;
                        i[l >> 2] = 0
                    }
                    if (f << 24 >> 24 != 0 ? 1 : (d | 0) != (i[e + 336 >> 2] | 0)) {
                        e = -1;
                        return e | 0
                    }
                    if (er(e, _ + 1 | 0) | 0) {
                        e = -1;
                        return e | 0
                    }
                    h = e + 340 | 0;
                    l = i[h >> 2] | 0;
                    if ((y | 0) != (l | 0)) {
                        c = e + 32 | 0;
                        f = i[c >> 2] | 0;
                        d = e + 28 | 0;
                        o = i[d >> 2] | 0;
                        if ((f | 0) < (o | 0)) {
                            u = i[e + 16 >> 2] | 0;
                            m = e + 8 | 0;
                            r = i[m >> 2] | 0;
                            s = f;
                            do {
                                r = r - (i[u + (s << 2) >> 2] & 255) | 0;
                                s = s + 1 | 0
                            } while ((s | 0) < (o | 0));
                            i[m >> 2] = r
                        }
                        i[d >> 2] = f;
                        if ((l | 0) != -1) {
                            m = f + 1 | 0;
                            i[d >> 2] = m;
                            i[(i[e + 16 >> 2] | 0) + (f << 2) >> 2] = 1024;
                            i[c >> 2] = m
                        }
                    }
                    e: do
                        if (!E) {
                            r = S;
                            c = p;
                            f = 0
                        } else {
                            E = i[e + 28 >> 2] | 0;
                            if ((E | 0) >= 1 ? (i[(i[e + 16 >> 2] | 0) + (E + -1 << 2) >> 2] | 0) != 1024 : 0) {
                                r = S;
                                c = p;
                                f = 0;
                                break
                            } else {
                                r = S;
                                o = 0
                            }
                            while (1) {
                                if ((o | 0) >= (_ | 0)) {
                                    c = 0;
                                    f = o;
                                    break e
                                }
                                p = t[w + (o + 27) >> 0] | 0;
                                S = p & 255;
                                r = r + S | 0;
                                n = n - S | 0;
                                o = o + 1 | 0;
                                if (p << 24 >> 24 != -1) {
                                    c = 0;
                                    f = o;
                                    break
                                }
                            }
                        }
                    while (0);
                    if (n) {
                        s = e + 4 | 0;
                        u = i[s >> 2] | 0;
                        l = e + 8 | 0;
                        o = i[l >> 2] | 0;
                        do
                            if ((u - n | 0) > (o | 0)) u = i[e >> 2] | 0;
                            else {
                                if ((u | 0) > (2147483647 - n | 0)) {
                                    r = i[e >> 2] | 0;
                                    if (r) _r(r);
                                    r = i[e + 16 >> 2] | 0;
                                    if (r) _r(r);
                                    r = i[e + 20 >> 2] | 0;
                                    if (r) _r(r);
                                    Mr(e | 0, 0, 360) | 0;
                                    e = -1;
                                    return e | 0
                                }
                                o = u + n | 0;
                                o = (o | 0) < 2147482623 ? o + 1024 | 0 : o;
                                u = vr(i[e >> 2] | 0, o) | 0;
                                if (u) {
                                    i[s >> 2] = o;
                                    i[e >> 2] = u;
                                    o = i[l >> 2] | 0;
                                    break
                                }
                                r = i[e >> 2] | 0;
                                if (r) _r(r);
                                r = i[e + 16 >> 2] | 0;
                                if (r) _r(r);
                                r = i[e + 20 >> 2] | 0;
                                if (r) _r(r);
                                Mr(e | 0, 0, 360) | 0;
                                e = -1;
                                return e | 0
                            }
                        while (0);
                        Or(u + o | 0, r | 0, n | 0) | 0;
                        i[l >> 2] = (i[l >> 2] | 0) + n
                    }
                    if ((f | 0) < (_ | 0)) {
                        E = e + 28 | 0;
                        S = e + 32 | 0;
                        d = i[e + 16 >> 2] | 0;
                        m = i[e + 20 >> 2] | 0;
                        n = i[E >> 2] | 0;
                        u = c;
                        c = -1;
                        o = f;
                        e: while (1) {
                            l = u;
                            while (1) {
                                s = t[w + (o + 27) >> 0] | 0;
                                r = s & 255;
                                u = d + (n << 2) | 0;
                                i[u >> 2] = r;
                                p = m + (n << 3) | 0;
                                i[p >> 2] = -1;
                                i[p + 4 >> 2] = -1;
                                if (l) i[u >> 2] = r | 256;
                                r = n;
                                n = n + 1 | 0;
                                i[E >> 2] = n;
                                o = o + 1 | 0;
                                if (s << 24 >> 24 != -1) break;
                                if ((o | 0) >= (_ | 0)) {
                                    r = c;
                                    break e
                                } else l = 0
                            }
                            i[S >> 2] = n;
                            if ((o | 0) < (_ | 0)) {
                                u = 0;
                                c = r
                            } else break
                        }
                        if ((r | 0) != -1) {
                            w = (i[e + 20 >> 2] | 0) + (r << 3) | 0;
                            i[w >> 2] = g;
                            i[w + 4 >> 2] = F
                        }
                    }
                    if ((v | 0) != 0 ? (i[e + 328 >> 2] = 1, M = i[e + 28 >> 2] | 0, (M | 0) > 0) : 0) {
                        e = (i[e + 16 >> 2] | 0) + (M + -1 << 2) | 0;
                        i[e >> 2] = i[e >> 2] | 512
                    }
                    i[h >> 2] = y + 1;
                    e = 0;
                    return e | 0
                }

                function $e(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0;
                    if (!e) {
                        m = 0;
                        return m | 0
                    }
                    f = i[e >> 2] | 0;
                    if (!f) {
                        m = 0;
                        return m | 0
                    }
                    m = e + 36 | 0;
                    t = i[m >> 2] | 0;
                    if ((i[e + 32 >> 2] | 0) <= (t | 0)) {
                        m = 0;
                        return m | 0
                    }
                    u = i[e + 16 >> 2] | 0;
                    n = i[u + (t << 2) >> 2] | 0;
                    if (n & 1024) {
                        i[m >> 2] = t + 1;
                        m = e + 344 | 0;
                        e = m;
                        e = Rr(i[e >> 2] | 0, i[e + 4 >> 2] | 0, 1, 0) | 0;
                        i[m >> 2] = e;
                        i[m + 4 >> 2] = N;
                        m = -1;
                        return m | 0
                    }
                    d = (r | 0) == 0;
                    o = n & 255;
                    a = n & 512;
                    c = n & 256;
                    if ((o | 0) == 255) {
                        n = 255;
                        o = a;
                        do {
                            t = t + 1 | 0;
                            s = i[u + (t << 2) >> 2] | 0;
                            l = s & 255;
                            o = (s & 512 | 0) == 0 ? o : 512;
                            n = l + n | 0
                        } while ((l | 0) == 255);
                        l = n;
                        n = o;
                        s = t
                    } else {
                        l = o;
                        n = a;
                        s = t
                    }
                    if (d) {
                        o = e + 12 | 0;
                        n = e + 344 | 0;
                        u = n;
                        t = o;
                        o = i[o >> 2] | 0;
                        a = i[u >> 2] | 0;
                        u = i[u + 4 >> 2] | 0
                    } else {
                        i[r + 12 >> 2] = n;
                        i[r + 8 >> 2] = c;
                        t = e + 12 | 0;
                        o = i[t >> 2] | 0;
                        i[r >> 2] = f + o;
                        n = e + 344 | 0;
                        u = n;
                        a = i[u >> 2] | 0;
                        u = i[u + 4 >> 2] | 0;
                        f = r + 24 | 0;
                        i[f >> 2] = a;
                        i[f + 4 >> 2] = u;
                        f = (i[e + 20 >> 2] | 0) + (s << 3) | 0;
                        d = i[f + 4 >> 2] | 0;
                        e = r + 16 | 0;
                        i[e >> 2] = i[f >> 2];
                        i[e + 4 >> 2] = d;
                        i[r + 4 >> 2] = l
                    }
                    i[t >> 2] = o + l;
                    i[m >> 2] = s + 1;
                    e = Rr(a | 0, u | 0, 1, 0) | 0;
                    m = n;
                    i[m >> 2] = e;
                    i[m + 4 >> 2] = N;
                    m = 1;
                    return m | 0
                }

                function er(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0;
                    o = e + 24 | 0;
                    n = i[o >> 2] | 0;
                    if ((n - r | 0) > (i[e + 28 >> 2] | 0)) {
                        e = 0;
                        return e | 0
                    }
                    if ((n | 0) > (2147483647 - r | 0)) {
                        n = i[e >> 2] | 0;
                        if (n) _r(n);
                        n = i[e + 16 >> 2] | 0;
                        if (n) _r(n);
                        n = i[e + 20 >> 2] | 0;
                        if (n) _r(n);
                        Mr(e | 0, 0, 360) | 0;
                        e = -1;
                        return e | 0
                    }
                    r = n + r | 0;
                    r = (r | 0) < 2147483615 ? r + 32 | 0 : r;
                    a = e + 16 | 0;
                    n = vr(i[a >> 2] | 0, r << 2) | 0;
                    if (!n) {
                        n = i[e >> 2] | 0;
                        if (n) _r(n);
                        n = i[a >> 2] | 0;
                        if (n) _r(n);
                        n = i[e + 20 >> 2] | 0;
                        if (n) _r(n);
                        Mr(e | 0, 0, 360) | 0;
                        e = -1;
                        return e | 0
                    }
                    i[a >> 2] = n;
                    t = e + 20 | 0;
                    n = vr(i[t >> 2] | 0, r << 3) | 0;
                    if (n) {
                        i[t >> 2] = n;
                        i[o >> 2] = r;
                        e = 0;
                        return e | 0
                    }
                    n = i[e >> 2] | 0;
                    if (n) _r(n);
                    n = i[a >> 2] | 0;
                    if (n) _r(n);
                    n = i[t >> 2] | 0;
                    if (n) _r(n);
                    Mr(e | 0, 0, 360) | 0;
                    e = -1;
                    return e | 0
                }

                function rr() {
                    var e = 0,
                        r = 0;
                    e = wr(1, 56) | 0;
                    r = wr(1, 28) | 0;
                    i[e >> 2] = r;
                    i[e + 20 >> 2] = wr(1, 360) | 0;
                    if (Ke(r) | 0) pe(1697, 1724, 19, 1734);
                    if ((Ze(r, e + 4 | 0) | 0) == 1) pe(1744, 1724, 20, 1734);
                    else return e | 0;
                    return 0
                }

                function nr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    var o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0;
                    Or(Xe(i[e >> 2] | 0, n) | 0, r | 0, n | 0) | 0;
                    if (Ge(i[e >> 2] | 0, n) | 0) pe(1790, 1724, 28, 1826);
                    s = e + 4 | 0;
                    if ((Ze(i[e >> 2] | 0, s) | 0) != 1) return 0;
                    l = e + 20 | 0;
                    r = e + 24 | 0;
                    n = e + 28 | 0;
                    o = e + 36 | 0;
                    a = e + 40 | 0;
                    while (1) {
                        u = je(s) | 0;
                        if ((Ye(s) | 0) != 0 ? (Ve(i[l >> 2] | 0, u) | 0) != 0 : 0) {
                            r = 8;
                            break
                        }
                        if (Qe(i[l >> 2] | 0, s) | 0) {
                            r = 11;
                            break
                        }
                        if (($e(i[l >> 2] | 0, r) | 0) == 1)
                            do Bi[t & 127](i[r >> 2] | 0, i[n >> 2] | 0, i[o >> 2] | 0, i[a >> 2] | 0); while (($e(i[l >> 2] | 0, r) | 0) == 1);
                        if ((Ze(i[e >> 2] | 0, s) | 0) != 1) {
                            r = 13;
                            break
                        }
                    }
                    if ((r | 0) == 8) pe(1836, 1724, 35, 1826);
                    else if ((r | 0) == 11) pe(1874, 1724, 37, 1826);
                    else if ((r | 0) == 13) return 0;
                    return 0
                }

                function tr(e) {
                    e = e | 0;
                    We(i[e >> 2] | 0) | 0;
                    qe(i[e + 20 >> 2] | 0) | 0;
                    _r(e);
                    return
                }

                function or(e) {
                    e = e | 0;
                    if (e >>> 0 > 4294963200) {
                        i[(dr() | 0) >> 2] = 0 - e;
                        e = -1
                    }
                    return e | 0
                }

                function ir(e) {
                    e = e | 0;
                    var r = 0,
                        n = 0;
                    do
                        if (e) {
                            if ((i[e + 76 >> 2] | 0) <= -1) {
                                r = Sr(e) | 0;
                                break
                            }
                            n = (sr(e) | 0) == 0;
                            r = Sr(e) | 0;
                            if (!n) lr(e)
                        } else {
                            if (!(i[269] | 0)) r = 0;
                            else r = ir(i[269] | 0) | 0;
                            Se(1060);
                            e = i[264] | 0;
                            if (e)
                                do {
                                    if ((i[e + 76 >> 2] | 0) > -1) n = sr(e) | 0;
                                    else n = 0;
                                    if ((i[e + 20 >> 2] | 0) >>> 0 > (i[e + 28 >> 2] | 0) >>> 0) r = Sr(e) | 0 | r;
                                    if (n) lr(e);
                                    e = i[e + 56 >> 2] | 0
                                } while ((e | 0) != 0);
                            Oe(1060)
                        }
                    while (0);
                    return r | 0
                }

                function ar(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0,
                        a = 0;
                    a = f;
                    f = f + 80 | 0;
                    o = a;
                    i[e + 36 >> 2] = 104;
                    if ((i[e >> 2] & 64 | 0) == 0 ? (i[o >> 2] = i[e + 60 >> 2], i[o + 4 >> 2] = 21505, i[o + 8 >> 2] = a + 12, (Re(54, o | 0) | 0) != 0) : 0) t[e + 75 >> 0] = -1;
                    o = fr(e, r, n) | 0;
                    f = a;
                    return o | 0
                }

                function ur(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var t = 0,
                        o = 0,
                        a = 0;
                    o = f;
                    f = f + 32 | 0;
                    a = o;
                    t = o + 20 | 0;
                    i[a >> 2] = i[e + 60 >> 2];
                    i[a + 4 >> 2] = 0;
                    i[a + 8 >> 2] = r;
                    i[a + 12 >> 2] = t;
                    i[a + 16 >> 2] = n;
                    if ((or(be(140, a | 0) | 0) | 0) < 0) {
                        i[t >> 2] = -1;
                        e = -1
                    } else e = i[t >> 2] | 0;
                    f = o;
                    return e | 0
                }

                function sr(e) {
                    e = e | 0;
                    return 0
                }

                function lr(e) {
                    e = e | 0;
                    return
                }

                function cr(e) {
                    e = e | 0;
                    var r = 0,
                        n = 0;
                    r = f;
                    f = f + 16 | 0;
                    n = r;
                    i[n >> 2] = i[e + 60 >> 2];
                    e = or(Fe(6, n | 0) | 0) | 0;
                    f = r;
                    return e | 0
                }

                function fr(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0;
                    p = f;
                    f = f + 48 | 0;
                    m = p + 16 | 0;
                    d = p;
                    t = p + 32 | 0;
                    E = e + 28 | 0;
                    o = i[E >> 2] | 0;
                    i[t >> 2] = o;
                    S = e + 20 | 0;
                    o = (i[S >> 2] | 0) - o | 0;
                    i[t + 4 >> 2] = o;
                    i[t + 8 >> 2] = r;
                    i[t + 12 >> 2] = n;
                    l = e + 60 | 0;
                    c = e + 44 | 0;
                    r = 2;
                    o = o + n | 0;
                    while (1) {
                        if (!(i[258] | 0)) {
                            i[m >> 2] = i[l >> 2];
                            i[m + 4 >> 2] = t;
                            i[m + 8 >> 2] = r;
                            u = or(Ne(146, m | 0) | 0) | 0
                        } else {
                            ke(102, e | 0);
                            i[d >> 2] = i[l >> 2];
                            i[d + 4 >> 2] = t;
                            i[d + 8 >> 2] = r;
                            u = or(Ne(146, d | 0) | 0) | 0;
                            Ee(0)
                        }
                        if ((o | 0) == (u | 0)) {
                            o = 6;
                            break
                        }
                        if ((u | 0) < 0) {
                            o = 8;
                            break
                        }
                        o = o - u | 0;
                        a = i[t + 4 >> 2] | 0;
                        if (u >>> 0 <= a >>> 0)
                            if ((r | 0) == 2) {
                                i[E >> 2] = (i[E >> 2] | 0) + u;
                                s = a;
                                r = 2
                            } else s = a;
                        else {
                            s = i[c >> 2] | 0;
                            i[E >> 2] = s;
                            i[S >> 2] = s;
                            s = i[t + 12 >> 2] | 0;
                            u = u - a | 0;
                            t = t + 8 | 0;
                            r = r + -1 | 0
                        }
                        i[t >> 2] = (i[t >> 2] | 0) + u;
                        i[t + 4 >> 2] = s - u
                    }
                    if ((o | 0) == 6) {
                        m = i[c >> 2] | 0;
                        i[e + 16 >> 2] = m + (i[e + 48 >> 2] | 0);
                        e = m;
                        i[E >> 2] = e;
                        i[S >> 2] = e
                    } else if ((o | 0) == 8) {
                        i[e + 16 >> 2] = 0;
                        i[E >> 2] = 0;
                        i[S >> 2] = 0;
                        i[e >> 2] = i[e >> 2] | 32;
                        if ((r | 0) == 2) n = 0;
                        else n = n - (i[t + 4 >> 2] | 0) | 0
                    }
                    f = p;
                    return n | 0
                }

                function dr() {
                    var e = 0;
                    if (!(i[258] | 0)) e = 1080;
                    else e = i[(he() | 0) + 60 >> 2] | 0;
                    return e | 0
                }

                function mr(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0,
                        a = 0,
                        u = 0,
                        s = 0;
                    u = r & 255;
                    o = (n | 0) != 0;
                    e: do
                        if (o & (e & 3 | 0) != 0) {
                            a = r & 255;
                            while (1) {
                                if ((t[e >> 0] | 0) == a << 24 >> 24) {
                                    s = 6;
                                    break e
                                }
                                e = e + 1 | 0;
                                n = n + -1 | 0;
                                o = (n | 0) != 0;
                                if (!(o & (e & 3 | 0) != 0)) {
                                    s = 5;
                                    break
                                }
                            }
                        } else s = 5; while (0);
                    if ((s | 0) == 5)
                        if (o) s = 6;
                        else n = 0;
                    e: do
                        if ((s | 0) == 6) {
                            a = r & 255;
                            if ((t[e >> 0] | 0) != a << 24 >> 24) {
                                o = re(u, 16843009) | 0;
                                r: do
                                    if (n >>> 0 > 3)
                                        while (1) {
                                            u = i[e >> 2] ^ o;
                                            if ((u & -2139062144 ^ -2139062144) & u + -16843009) break;
                                            e = e + 4 | 0;
                                            n = n + -4 | 0;
                                            if (n >>> 0 <= 3) {
                                                s = 11;
                                                break r
                                            }
                                        } else s = 11; while (0);
                                if ((s | 0) == 11)
                                    if (!n) {
                                        n = 0;
                                        break
                                    }
                                while (1) {
                                    if ((t[e >> 0] | 0) == a << 24 >> 24) break e;
                                    e = e + 1 | 0;
                                    n = n + -1 | 0;
                                    if (!n) {
                                        n = 0;
                                        break
                                    }
                                }
                            }
                        }
                    while (0);
                    return ((n | 0) != 0 ? e : 0) | 0
                }

                function Er(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0,
                        i = 0;
                    e: do
                        if (!n) n = 0;
                        else {
                            i = n;
                            o = e;
                            while (1) {
                                e = t[o >> 0] | 0;
                                n = t[r >> 0] | 0;
                                if (e << 24 >> 24 != n << 24 >> 24) break;
                                i = i + -1 | 0;
                                if (!i) {
                                    n = 0;
                                    break e
                                } else {
                                    o = o + 1 | 0;
                                    r = r + 1 | 0
                                }
                            }
                            n = (e & 255) - (n & 255) | 0
                        }
                    while (0);
                    return n | 0
                }

                function Sr(e) {
                    e = e | 0;
                    var r = 0,
                        n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0;
                    r = e + 20 | 0;
                    a = e + 28 | 0;
                    if ((i[r >> 2] | 0) >>> 0 > (i[a >> 2] | 0) >>> 0 ? (Li[i[e + 36 >> 2] & 127](e, 0, 0) | 0, (i[r >> 2] | 0) == 0) : 0) r = -1;
                    else {
                        u = e + 4 | 0;
                        n = i[u >> 2] | 0;
                        t = e + 8 | 0;
                        o = i[t >> 2] | 0;
                        if (n >>> 0 < o >>> 0) Li[i[e + 40 >> 2] & 127](e, n - o | 0, 1) | 0;
                        i[e + 16 >> 2] = 0;
                        i[a >> 2] = 0;
                        i[r >> 2] = 0;
                        i[t >> 2] = 0;
                        i[u >> 2] = 0;
                        r = 0
                    }
                    return r | 0
                }

                function pr(e) {
                    e = e | 0;
                    if (!(i[e + 68 >> 2] | 0)) lr(e);
                    return
                }

                function hr(e) {
                    e = e | 0;
                    var r = 0,
                        n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0,
                        h = 0,
                        _ = 0,
                        w = 0,
                        v = 0,
                        F = 0,
                        g = 0,
                        y = 0,
                        M = 0,
                        A = 0,
                        R = 0,
                        O = 0,
                        b = 0,
                        k = 0,
                        T = 0,
                        N = 0,
                        D = 0,
                        P = 0,
                        C = 0,
                        L = 0,
                        B = 0,
                        I = 0,
                        H = 0;
                    do
                        if (e >>> 0 < 245) {
                            E = e >>> 0 < 11 ? 16 : e + 11 & -8;
                            e = E >>> 3;
                            s = i[299] | 0;
                            n = s >>> e;
                            if (n & 3) {
                                e = (n & 1 ^ 1) + e | 0;
                                t = e << 1;
                                n = 1236 + (t << 2) | 0;
                                t = 1236 + (t + 2 << 2) | 0;
                                o = i[t >> 2] | 0;
                                a = o + 8 | 0;
                                u = i[a >> 2] | 0;
                                do
                                    if ((n | 0) != (u | 0)) {
                                        if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                        r = u + 12 | 0;
                                        if ((i[r >> 2] | 0) == (o | 0)) {
                                            i[r >> 2] = n;
                                            i[t >> 2] = u;
                                            break
                                        } else we()
                                    } else i[299] = s & ~(1 << e); while (0);
                                H = e << 3;
                                i[o + 4 >> 2] = H | 3;
                                H = o + (H | 4) | 0;
                                i[H >> 2] = i[H >> 2] | 1;
                                H = a;
                                return H | 0
                            }
                            u = i[301] | 0;
                            if (E >>> 0 > u >>> 0) {
                                if (n) {
                                    t = 2 << e;
                                    t = n << e & (t | 0 - t);
                                    t = (t & 0 - t) + -1 | 0;
                                    l = t >>> 12 & 16;
                                    t = t >>> l;
                                    o = t >>> 5 & 8;
                                    t = t >>> o;
                                    a = t >>> 2 & 4;
                                    t = t >>> a;
                                    n = t >>> 1 & 2;
                                    t = t >>> n;
                                    e = t >>> 1 & 1;
                                    e = (o | l | a | n | e) + (t >>> e) | 0;
                                    t = e << 1;
                                    n = 1236 + (t << 2) | 0;
                                    t = 1236 + (t + 2 << 2) | 0;
                                    a = i[t >> 2] | 0;
                                    l = a + 8 | 0;
                                    o = i[l >> 2] | 0;
                                    do
                                        if ((n | 0) != (o | 0)) {
                                            if (o >>> 0 < (i[303] | 0) >>> 0) we();
                                            r = o + 12 | 0;
                                            if ((i[r >> 2] | 0) == (a | 0)) {
                                                i[r >> 2] = n;
                                                i[t >> 2] = o;
                                                c = i[301] | 0;
                                                break
                                            } else we()
                                        } else {
                                            i[299] = s & ~(1 << e);
                                            c = u
                                        }
                                    while (0);
                                    H = e << 3;
                                    u = H - E | 0;
                                    i[a + 4 >> 2] = E | 3;
                                    s = a + E | 0;
                                    i[a + (E | 4) >> 2] = u | 1;
                                    i[a + H >> 2] = u;
                                    if (c) {
                                        o = i[304] | 0;
                                        n = c >>> 3;
                                        r = n << 1;
                                        t = 1236 + (r << 2) | 0;
                                        e = i[299] | 0;
                                        n = 1 << n;
                                        if (e & n) {
                                            e = 1236 + (r + 2 << 2) | 0;
                                            r = i[e >> 2] | 0;
                                            if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                            else {
                                                f = e;
                                                d = r
                                            }
                                        } else {
                                            i[299] = e | n;
                                            f = 1236 + (r + 2 << 2) | 0;
                                            d = t
                                        }
                                        i[f >> 2] = o;
                                        i[d + 12 >> 2] = o;
                                        i[o + 8 >> 2] = d;
                                        i[o + 12 >> 2] = t
                                    }
                                    i[301] = u;
                                    i[304] = s;
                                    H = l;
                                    return H | 0
                                }
                                e = i[300] | 0;
                                if (e) {
                                    n = (e & 0 - e) + -1 | 0;
                                    I = n >>> 12 & 16;
                                    n = n >>> I;
                                    B = n >>> 5 & 8;
                                    n = n >>> B;
                                    H = n >>> 2 & 4;
                                    n = n >>> H;
                                    e = n >>> 1 & 2;
                                    n = n >>> e;
                                    t = n >>> 1 & 1;
                                    t = i[1500 + ((B | I | H | e | t) + (n >>> t) << 2) >> 2] | 0;
                                    n = (i[t + 4 >> 2] & -8) - E | 0;
                                    e = t;
                                    while (1) {
                                        r = i[e + 16 >> 2] | 0;
                                        if (!r) {
                                            r = i[e + 20 >> 2] | 0;
                                            if (!r) {
                                                l = n;
                                                break
                                            }
                                        }
                                        e = (i[r + 4 >> 2] & -8) - E | 0;
                                        H = e >>> 0 < n >>> 0;
                                        n = H ? e : n;
                                        e = r;
                                        t = H ? r : t
                                    }
                                    a = i[303] | 0;
                                    if (t >>> 0 < a >>> 0) we();
                                    s = t + E | 0;
                                    if (t >>> 0 >= s >>> 0) we();
                                    u = i[t + 24 >> 2] | 0;
                                    n = i[t + 12 >> 2] | 0;
                                    do
                                        if ((n | 0) == (t | 0)) {
                                            e = t + 20 | 0;
                                            r = i[e >> 2] | 0;
                                            if (!r) {
                                                e = t + 16 | 0;
                                                r = i[e >> 2] | 0;
                                                if (!r) {
                                                    m = 0;
                                                    break
                                                }
                                            }
                                            while (1) {
                                                n = r + 20 | 0;
                                                o = i[n >> 2] | 0;
                                                if (o) {
                                                    r = o;
                                                    e = n;
                                                    continue
                                                }
                                                n = r + 16 | 0;
                                                o = i[n >> 2] | 0;
                                                if (!o) break;
                                                else {
                                                    r = o;
                                                    e = n
                                                }
                                            }
                                            if (e >>> 0 < a >>> 0) we();
                                            else {
                                                i[e >> 2] = 0;
                                                m = r;
                                                break
                                            }
                                        } else {
                                            o = i[t + 8 >> 2] | 0;
                                            if (o >>> 0 < a >>> 0) we();
                                            r = o + 12 | 0;
                                            if ((i[r >> 2] | 0) != (t | 0)) we();
                                            e = n + 8 | 0;
                                            if ((i[e >> 2] | 0) == (t | 0)) {
                                                i[r >> 2] = n;
                                                i[e >> 2] = o;
                                                m = n;
                                                break
                                            } else we()
                                        }
                                    while (0);
                                    do
                                        if (u) {
                                            r = i[t + 28 >> 2] | 0;
                                            e = 1500 + (r << 2) | 0;
                                            if ((t | 0) == (i[e >> 2] | 0)) {
                                                i[e >> 2] = m;
                                                if (!m) {
                                                    i[300] = i[300] & ~(1 << r);
                                                    break
                                                }
                                            } else {
                                                if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                                r = u + 16 | 0;
                                                if ((i[r >> 2] | 0) == (t | 0)) i[r >> 2] = m;
                                                else i[u + 20 >> 2] = m;
                                                if (!m) break
                                            }
                                            e = i[303] | 0;
                                            if (m >>> 0 < e >>> 0) we();
                                            i[m + 24 >> 2] = u;
                                            r = i[t + 16 >> 2] | 0;
                                            do
                                                if (r)
                                                    if (r >>> 0 < e >>> 0) we();
                                                    else {
                                                        i[m + 16 >> 2] = r;
                                                        i[r + 24 >> 2] = m;
                                                        break
                                                    }
                                            while (0);
                                            r = i[t + 20 >> 2] | 0;
                                            if (r)
                                                if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                                else {
                                                    i[m + 20 >> 2] = r;
                                                    i[r + 24 >> 2] = m;
                                                    break
                                                }
                                        }
                                    while (0);
                                    if (l >>> 0 < 16) {
                                        H = l + E | 0;
                                        i[t + 4 >> 2] = H | 3;
                                        H = t + (H + 4) | 0;
                                        i[H >> 2] = i[H >> 2] | 1
                                    } else {
                                        i[t + 4 >> 2] = E | 3;
                                        i[t + (E | 4) >> 2] = l | 1;
                                        i[t + (l + E) >> 2] = l;
                                        r = i[301] | 0;
                                        if (r) {
                                            a = i[304] | 0;
                                            n = r >>> 3;
                                            r = n << 1;
                                            o = 1236 + (r << 2) | 0;
                                            e = i[299] | 0;
                                            n = 1 << n;
                                            if (e & n) {
                                                r = 1236 + (r + 2 << 2) | 0;
                                                e = i[r >> 2] | 0;
                                                if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                                else {
                                                    S = r;
                                                    p = e
                                                }
                                            } else {
                                                i[299] = e | n;
                                                S = 1236 + (r + 2 << 2) | 0;
                                                p = o
                                            }
                                            i[S >> 2] = a;
                                            i[p + 12 >> 2] = a;
                                            i[a + 8 >> 2] = p;
                                            i[a + 12 >> 2] = o
                                        }
                                        i[301] = l;
                                        i[304] = s
                                    }
                                    H = t + 8 | 0;
                                    return H | 0
                                } else p = E
                            } else p = E
                        } else if (e >>> 0 <= 4294967231) {
                        e = e + 11 | 0;
                        d = e & -8;
                        f = i[300] | 0;
                        if (f) {
                            n = 0 - d | 0;
                            e = e >>> 8;
                            if (e)
                                if (d >>> 0 > 16777215) c = 31;
                                else {
                                    p = (e + 1048320 | 0) >>> 16 & 8;
                                    F = e << p;
                                    S = (F + 520192 | 0) >>> 16 & 4;
                                    F = F << S;
                                    c = (F + 245760 | 0) >>> 16 & 2;
                                    c = 14 - (S | p | c) + (F << c >>> 15) | 0;
                                    c = d >>> (c + 7 | 0) & 1 | c << 1
                                }
                            else c = 0;
                            e = i[1500 + (c << 2) >> 2] | 0;
                            e: do
                                if (!e) {
                                    o = 0;
                                    e = 0;
                                    F = 86
                                } else {
                                    u = n;
                                    o = 0;
                                    s = d << ((c | 0) == 31 ? 0 : 25 - (c >>> 1) | 0);
                                    l = e;
                                    e = 0;
                                    while (1) {
                                        a = i[l + 4 >> 2] & -8;
                                        n = a - d | 0;
                                        if (n >>> 0 < u >>> 0)
                                            if ((a | 0) == (d | 0)) {
                                                a = l;
                                                e = l;
                                                F = 90;
                                                break e
                                            } else e = l;
                                        else n = u;
                                        F = i[l + 20 >> 2] | 0;
                                        l = i[l + 16 + (s >>> 31 << 2) >> 2] | 0;
                                        o = (F | 0) == 0 | (F | 0) == (l | 0) ? o : F;
                                        if (!l) {
                                            F = 86;
                                            break
                                        } else {
                                            u = n;
                                            s = s << 1
                                        }
                                    }
                                }
                            while (0);
                            if ((F | 0) == 86) {
                                if ((o | 0) == 0 & (e | 0) == 0) {
                                    e = 2 << c;
                                    e = f & (e | 0 - e);
                                    if (!e) {
                                        p = d;
                                        break
                                    }
                                    e = (e & 0 - e) + -1 | 0;
                                    m = e >>> 12 & 16;
                                    e = e >>> m;
                                    f = e >>> 5 & 8;
                                    e = e >>> f;
                                    S = e >>> 2 & 4;
                                    e = e >>> S;
                                    p = e >>> 1 & 2;
                                    e = e >>> p;
                                    o = e >>> 1 & 1;
                                    o = i[1500 + ((f | m | S | p | o) + (e >>> o) << 2) >> 2] | 0;
                                    e = 0
                                }
                                if (!o) {
                                    s = n;
                                    l = e
                                } else {
                                    a = o;
                                    F = 90
                                }
                            }
                            if ((F | 0) == 90)
                                while (1) {
                                    F = 0;
                                    p = (i[a + 4 >> 2] & -8) - d | 0;
                                    o = p >>> 0 < n >>> 0;
                                    n = o ? p : n;
                                    e = o ? a : e;
                                    o = i[a + 16 >> 2] | 0;
                                    if (o) {
                                        a = o;
                                        F = 90;
                                        continue
                                    }
                                    a = i[a + 20 >> 2] | 0;
                                    if (!a) {
                                        s = n;
                                        l = e;
                                        break
                                    } else F = 90
                                }
                            if ((l | 0) != 0 ? s >>> 0 < ((i[301] | 0) - d | 0) >>> 0 : 0) {
                                o = i[303] | 0;
                                if (l >>> 0 < o >>> 0) we();
                                u = l + d | 0;
                                if (l >>> 0 >= u >>> 0) we();
                                a = i[l + 24 >> 2] | 0;
                                n = i[l + 12 >> 2] | 0;
                                do
                                    if ((n | 0) == (l | 0)) {
                                        e = l + 20 | 0;
                                        r = i[e >> 2] | 0;
                                        if (!r) {
                                            e = l + 16 | 0;
                                            r = i[e >> 2] | 0;
                                            if (!r) {
                                                E = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            n = r + 20 | 0;
                                            t = i[n >> 2] | 0;
                                            if (t) {
                                                r = t;
                                                e = n;
                                                continue
                                            }
                                            n = r + 16 | 0;
                                            t = i[n >> 2] | 0;
                                            if (!t) break;
                                            else {
                                                r = t;
                                                e = n
                                            }
                                        }
                                        if (e >>> 0 < o >>> 0) we();
                                        else {
                                            i[e >> 2] = 0;
                                            E = r;
                                            break
                                        }
                                    } else {
                                        t = i[l + 8 >> 2] | 0;
                                        if (t >>> 0 < o >>> 0) we();
                                        r = t + 12 | 0;
                                        if ((i[r >> 2] | 0) != (l | 0)) we();
                                        e = n + 8 | 0;
                                        if ((i[e >> 2] | 0) == (l | 0)) {
                                            i[r >> 2] = n;
                                            i[e >> 2] = t;
                                            E = n;
                                            break
                                        } else we()
                                    }
                                while (0);
                                do
                                    if (a) {
                                        r = i[l + 28 >> 2] | 0;
                                        e = 1500 + (r << 2) | 0;
                                        if ((l | 0) == (i[e >> 2] | 0)) {
                                            i[e >> 2] = E;
                                            if (!E) {
                                                i[300] = i[300] & ~(1 << r);
                                                break
                                            }
                                        } else {
                                            if (a >>> 0 < (i[303] | 0) >>> 0) we();
                                            r = a + 16 | 0;
                                            if ((i[r >> 2] | 0) == (l | 0)) i[r >> 2] = E;
                                            else i[a + 20 >> 2] = E;
                                            if (!E) break
                                        }
                                        e = i[303] | 0;
                                        if (E >>> 0 < e >>> 0) we();
                                        i[E + 24 >> 2] = a;
                                        r = i[l + 16 >> 2] | 0;
                                        do
                                            if (r)
                                                if (r >>> 0 < e >>> 0) we();
                                                else {
                                                    i[E + 16 >> 2] = r;
                                                    i[r + 24 >> 2] = E;
                                                    break
                                                }
                                        while (0);
                                        r = i[l + 20 >> 2] | 0;
                                        if (r)
                                            if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                            else {
                                                i[E + 20 >> 2] = r;
                                                i[r + 24 >> 2] = E;
                                                break
                                            }
                                    }
                                while (0);
                                e: do
                                    if (s >>> 0 >= 16) {
                                        i[l + 4 >> 2] = d | 3;
                                        i[l + (d | 4) >> 2] = s | 1;
                                        i[l + (s + d) >> 2] = s;
                                        r = s >>> 3;
                                        if (s >>> 0 < 256) {
                                            e = r << 1;
                                            t = 1236 + (e << 2) | 0;
                                            n = i[299] | 0;
                                            r = 1 << r;
                                            if (n & r) {
                                                r = 1236 + (e + 2 << 2) | 0;
                                                e = i[r >> 2] | 0;
                                                if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                                else {
                                                    _ = r;
                                                    w = e
                                                }
                                            } else {
                                                i[299] = n | r;
                                                _ = 1236 + (e + 2 << 2) | 0;
                                                w = t
                                            }
                                            i[_ >> 2] = u;
                                            i[w + 12 >> 2] = u;
                                            i[l + (d + 8) >> 2] = w;
                                            i[l + (d + 12) >> 2] = t;
                                            break
                                        }
                                        r = s >>> 8;
                                        if (r)
                                            if (s >>> 0 > 16777215) t = 31;
                                            else {
                                                I = (r + 1048320 | 0) >>> 16 & 8;
                                                H = r << I;
                                                B = (H + 520192 | 0) >>> 16 & 4;
                                                H = H << B;
                                                t = (H + 245760 | 0) >>> 16 & 2;
                                                t = 14 - (B | I | t) + (H << t >>> 15) | 0;
                                                t = s >>> (t + 7 | 0) & 1 | t << 1
                                            }
                                        else t = 0;
                                        r = 1500 + (t << 2) | 0;
                                        i[l + (d + 28) >> 2] = t;
                                        i[l + (d + 20) >> 2] = 0;
                                        i[l + (d + 16) >> 2] = 0;
                                        e = i[300] | 0;
                                        n = 1 << t;
                                        if (!(e & n)) {
                                            i[300] = e | n;
                                            i[r >> 2] = u;
                                            i[l + (d + 24) >> 2] = r;
                                            i[l + (d + 12) >> 2] = u;
                                            i[l + (d + 8) >> 2] = u;
                                            break
                                        }
                                        r = i[r >> 2] | 0;
                                        r: do
                                            if ((i[r + 4 >> 2] & -8 | 0) != (s | 0)) {
                                                t = s << ((t | 0) == 31 ? 0 : 25 - (t >>> 1) | 0);
                                                while (1) {
                                                    e = r + 16 + (t >>> 31 << 2) | 0;
                                                    n = i[e >> 2] | 0;
                                                    if (!n) break;
                                                    if ((i[n + 4 >> 2] & -8 | 0) == (s | 0)) {
                                                        M = n;
                                                        break r
                                                    } else {
                                                        t = t << 1;
                                                        r = n
                                                    }
                                                }
                                                if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                                else {
                                                    i[e >> 2] = u;
                                                    i[l + (d + 24) >> 2] = r;
                                                    i[l + (d + 12) >> 2] = u;
                                                    i[l + (d + 8) >> 2] = u;
                                                    break e
                                                }
                                            } else M = r; while (0);
                                        r = M + 8 | 0;
                                        e = i[r >> 2] | 0;
                                        H = i[303] | 0;
                                        if (e >>> 0 >= H >>> 0 & M >>> 0 >= H >>> 0) {
                                            i[e + 12 >> 2] = u;
                                            i[r >> 2] = u;
                                            i[l + (d + 8) >> 2] = e;
                                            i[l + (d + 12) >> 2] = M;
                                            i[l + (d + 24) >> 2] = 0;
                                            break
                                        } else we()
                                    } else {
                                        H = s + d | 0;
                                        i[l + 4 >> 2] = H | 3;
                                        H = l + (H + 4) | 0;
                                        i[H >> 2] = i[H >> 2] | 1
                                    }
                                while (0);
                                H = l + 8 | 0;
                                return H | 0
                            } else p = d
                        } else p = d
                    } else p = -1;
                    while (0);
                    n = i[301] | 0;
                    if (n >>> 0 >= p >>> 0) {
                        r = n - p | 0;
                        e = i[304] | 0;
                        if (r >>> 0 > 15) {
                            i[304] = e + p;
                            i[301] = r;
                            i[e + (p + 4) >> 2] = r | 1;
                            i[e + n >> 2] = r;
                            i[e + 4 >> 2] = p | 3
                        } else {
                            i[301] = 0;
                            i[304] = 0;
                            i[e + 4 >> 2] = n | 3;
                            H = e + (n + 4) | 0;
                            i[H >> 2] = i[H >> 2] | 1
                        }
                        H = e + 8 | 0;
                        return H | 0
                    }
                    e = i[302] | 0;
                    if (e >>> 0 > p >>> 0) {
                        I = e - p | 0;
                        i[302] = I;
                        H = i[305] | 0;
                        i[305] = H + p;
                        i[H + (p + 4) >> 2] = I | 1;
                        i[H + 4 >> 2] = p | 3;
                        H = H + 8 | 0;
                        return H | 0
                    }
                    do
                        if (!(i[417] | 0)) {
                            e = Te(30) | 0;
                            if (!(e + -1 & e)) {
                                i[419] = e;
                                i[418] = e;
                                i[420] = -1;
                                i[421] = -1;
                                i[422] = 0;
                                i[410] = 0;
                                i[417] = (ye(0) | 0) & -16 ^ 1431655768;
                                break
                            } else we()
                        }
                    while (0);
                    l = p + 48 | 0;
                    s = i[419] | 0;
                    c = p + 47 | 0;
                    u = s + c | 0;
                    s = 0 - s | 0;
                    f = u & s;
                    if (f >>> 0 <= p >>> 0) {
                        H = 0;
                        return H | 0
                    }
                    e = i[409] | 0;
                    if ((e | 0) != 0 ? (w = i[407] | 0, M = w + f | 0, M >>> 0 <= w >>> 0 | M >>> 0 > e >>> 0) : 0) {
                        H = 0;
                        return H | 0
                    }
                    e: do
                        if (!(i[410] & 4)) {
                            e = i[305] | 0;
                            r: do
                                if (e) {
                                    o = 1644;
                                    while (1) {
                                        n = i[o >> 2] | 0;
                                        if (n >>> 0 <= e >>> 0 ? (h = o + 4 | 0, (n + (i[h >> 2] | 0) | 0) >>> 0 > e >>> 0) : 0) {
                                            a = o;
                                            e = h;
                                            break
                                        }
                                        o = i[o + 8 >> 2] | 0;
                                        if (!o) {
                                            F = 174;
                                            break r
                                        }
                                    }
                                    n = u - (i[302] | 0) & s;
                                    if (n >>> 0 < 2147483647) {
                                        o = ge(n | 0) | 0;
                                        M = (o | 0) == ((i[a >> 2] | 0) + (i[e >> 2] | 0) | 0);
                                        e = M ? n : 0;
                                        if (M) {
                                            if ((o | 0) != (-1 | 0)) {
                                                g = o;
                                                S = e;
                                                F = 194;
                                                break e
                                            }
                                        } else F = 184
                                    } else e = 0
                                } else F = 174; while (0);
                            do
                                if ((F | 0) == 174) {
                                    a = ge(0) | 0;
                                    if ((a | 0) != (-1 | 0)) {
                                        e = a;
                                        n = i[418] | 0;
                                        o = n + -1 | 0;
                                        if (!(o & e)) n = f;
                                        else n = f - e + (o + e & 0 - n) | 0;
                                        e = i[407] | 0;
                                        o = e + n | 0;
                                        if (n >>> 0 > p >>> 0 & n >>> 0 < 2147483647) {
                                            M = i[409] | 0;
                                            if ((M | 0) != 0 ? o >>> 0 <= e >>> 0 | o >>> 0 > M >>> 0 : 0) {
                                                e = 0;
                                                break
                                            }
                                            o = ge(n | 0) | 0;
                                            M = (o | 0) == (a | 0);
                                            e = M ? n : 0;
                                            if (M) {
                                                g = a;
                                                S = e;
                                                F = 194;
                                                break e
                                            } else F = 184
                                        } else e = 0
                                    } else e = 0
                                }
                            while (0);
                            r: do
                                if ((F | 0) == 184) {
                                    a = 0 - n | 0;
                                    do
                                        if (l >>> 0 > n >>> 0 & (n >>> 0 < 2147483647 & (o | 0) != (-1 | 0)) ? (v = i[419] | 0, v = c - n + v & 0 - v, v >>> 0 < 2147483647) : 0)
                                            if ((ge(v | 0) | 0) == (-1 | 0)) {
                                                ge(a | 0) | 0;
                                                break r
                                            } else {
                                                n = v + n | 0;
                                                break
                                            }
                                    while (0);
                                    if ((o | 0) != (-1 | 0)) {
                                        g = o;
                                        S = n;
                                        F = 194;
                                        break e
                                    }
                                }
                            while (0);
                            i[410] = i[410] | 4;
                            F = 191
                        } else {
                            e = 0;
                            F = 191
                        }
                    while (0);
                    if ((((F | 0) == 191 ? f >>> 0 < 2147483647 : 0) ? (g = ge(f | 0) | 0, y = ge(0) | 0, g >>> 0 < y >>> 0 & ((g | 0) != (-1 | 0) & (y | 0) != (-1 | 0))) : 0) ? (A = y - g | 0, R = A >>> 0 > (p + 40 | 0) >>> 0, R) : 0) {
                        S = R ? A : e;
                        F = 194
                    }
                    if ((F | 0) == 194) {
                        e = (i[407] | 0) + S | 0;
                        i[407] = e;
                        if (e >>> 0 > (i[408] | 0) >>> 0) i[408] = e;
                        u = i[305] | 0;
                        e: do
                            if (u) {
                                a = 1644;
                                do {
                                    e = i[a >> 2] | 0;
                                    n = a + 4 | 0;
                                    o = i[n >> 2] | 0;
                                    if ((g | 0) == (e + o | 0)) {
                                        O = e;
                                        b = n;
                                        k = o;
                                        T = a;
                                        F = 204;
                                        break
                                    }
                                    a = i[a + 8 >> 2] | 0
                                } while ((a | 0) != 0);
                                if (((F | 0) == 204 ? (i[T + 12 >> 2] & 8 | 0) == 0 : 0) ? u >>> 0 < g >>> 0 & u >>> 0 >= O >>> 0 : 0) {
                                    i[b >> 2] = k + S;
                                    H = (i[302] | 0) + S | 0;
                                    I = u + 8 | 0;
                                    I = (I & 7 | 0) == 0 ? 0 : 0 - I & 7;
                                    B = H - I | 0;
                                    i[305] = u + I;
                                    i[302] = B;
                                    i[u + (I + 4) >> 2] = B | 1;
                                    i[u + (H + 4) >> 2] = 40;
                                    i[306] = i[421];
                                    break
                                }
                                e = i[303] | 0;
                                if (g >>> 0 < e >>> 0) {
                                    i[303] = g;
                                    e = g
                                }
                                n = g + S | 0;
                                a = 1644;
                                while (1) {
                                    if ((i[a >> 2] | 0) == (n | 0)) {
                                        o = a;
                                        n = a;
                                        F = 212;
                                        break
                                    }
                                    a = i[a + 8 >> 2] | 0;
                                    if (!a) {
                                        n = 1644;
                                        break
                                    }
                                }
                                if ((F | 0) == 212)
                                    if (!(i[n + 12 >> 2] & 8)) {
                                        i[o >> 2] = g;
                                        m = n + 4 | 0;
                                        i[m >> 2] = (i[m >> 2] | 0) + S;
                                        m = g + 8 | 0;
                                        m = (m & 7 | 0) == 0 ? 0 : 0 - m & 7;
                                        c = g + (S + 8) | 0;
                                        c = (c & 7 | 0) == 0 ? 0 : 0 - c & 7;
                                        r = g + (c + S) | 0;
                                        d = m + p | 0;
                                        E = g + d | 0;
                                        f = r - (g + m) - p | 0;
                                        i[g + (m + 4) >> 2] = p | 3;
                                        r: do
                                            if ((r | 0) != (u | 0)) {
                                                if ((r | 0) == (i[304] | 0)) {
                                                    H = (i[301] | 0) + f | 0;
                                                    i[301] = H;
                                                    i[304] = E;
                                                    i[g + (d + 4) >> 2] = H | 1;
                                                    i[g + (H + d) >> 2] = H;
                                                    break
                                                }
                                                s = S + 4 | 0;
                                                n = i[g + (s + c) >> 2] | 0;
                                                if ((n & 3 | 0) == 1) {
                                                    l = n & -8;
                                                    a = n >>> 3;
                                                    n: do
                                                        if (n >>> 0 >= 256) {
                                                            u = i[g + ((c | 24) + S) >> 2] | 0;
                                                            t = i[g + (S + 12 + c) >> 2] | 0;
                                                            do
                                                                if ((t | 0) == (r | 0)) {
                                                                    o = c | 16;
                                                                    t = g + (s + o) | 0;
                                                                    n = i[t >> 2] | 0;
                                                                    if (!n) {
                                                                        t = g + (o + S) | 0;
                                                                        n = i[t >> 2] | 0;
                                                                        if (!n) {
                                                                            L = 0;
                                                                            break
                                                                        }
                                                                    }
                                                                    while (1) {
                                                                        o = n + 20 | 0;
                                                                        a = i[o >> 2] | 0;
                                                                        if (a) {
                                                                            n = a;
                                                                            t = o;
                                                                            continue
                                                                        }
                                                                        o = n + 16 | 0;
                                                                        a = i[o >> 2] | 0;
                                                                        if (!a) break;
                                                                        else {
                                                                            n = a;
                                                                            t = o
                                                                        }
                                                                    }
                                                                    if (t >>> 0 < e >>> 0) we();
                                                                    else {
                                                                        i[t >> 2] = 0;
                                                                        L = n;
                                                                        break
                                                                    }
                                                                } else {
                                                                    o = i[g + ((c | 8) + S) >> 2] | 0;
                                                                    if (o >>> 0 < e >>> 0) we();
                                                                    e = o + 12 | 0;
                                                                    if ((i[e >> 2] | 0) != (r | 0)) we();
                                                                    n = t + 8 | 0;
                                                                    if ((i[n >> 2] | 0) == (r | 0)) {
                                                                        i[e >> 2] = t;
                                                                        i[n >> 2] = o;
                                                                        L = t;
                                                                        break
                                                                    } else we()
                                                                }
                                                            while (0);
                                                            if (!u) break;
                                                            e = i[g + (S + 28 + c) >> 2] | 0;
                                                            n = 1500 + (e << 2) | 0;
                                                            do
                                                                if ((r | 0) != (i[n >> 2] | 0)) {
                                                                    if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                                                    e = u + 16 | 0;
                                                                    if ((i[e >> 2] | 0) == (r | 0)) i[e >> 2] = L;
                                                                    else i[u + 20 >> 2] = L;
                                                                    if (!L) break n
                                                                } else {
                                                                    i[n >> 2] = L;
                                                                    if (L) break;
                                                                    i[300] = i[300] & ~(1 << e);
                                                                    break n
                                                                }
                                                            while (0);
                                                            n = i[303] | 0;
                                                            if (L >>> 0 < n >>> 0) we();
                                                            i[L + 24 >> 2] = u;
                                                            r = c | 16;
                                                            e = i[g + (r + S) >> 2] | 0;
                                                            do
                                                                if (e)
                                                                    if (e >>> 0 < n >>> 0) we();
                                                                    else {
                                                                        i[L + 16 >> 2] = e;
                                                                        i[e + 24 >> 2] = L;
                                                                        break
                                                                    }
                                                            while (0);
                                                            r = i[g + (s + r) >> 2] | 0;
                                                            if (!r) break;
                                                            if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                                            else {
                                                                i[L + 20 >> 2] = r;
                                                                i[r + 24 >> 2] = L;
                                                                break
                                                            }
                                                        } else {
                                                            t = i[g + ((c | 8) + S) >> 2] | 0;
                                                            o = i[g + (S + 12 + c) >> 2] | 0;
                                                            n = 1236 + (a << 1 << 2) | 0;
                                                            do
                                                                if ((t | 0) != (n | 0)) {
                                                                    if (t >>> 0 < e >>> 0) we();
                                                                    if ((i[t + 12 >> 2] | 0) == (r | 0)) break;
                                                                    we()
                                                                }
                                                            while (0);
                                                            if ((o | 0) == (t | 0)) {
                                                                i[299] = i[299] & ~(1 << a);
                                                                break
                                                            }
                                                            do
                                                                if ((o | 0) == (n | 0)) N = o + 8 | 0;
                                                                else {
                                                                    if (o >>> 0 < e >>> 0) we();
                                                                    e = o + 8 | 0;
                                                                    if ((i[e >> 2] | 0) == (r | 0)) {
                                                                        N = e;
                                                                        break
                                                                    }
                                                                    we()
                                                                }
                                                            while (0);
                                                            i[t + 12 >> 2] = o;
                                                            i[N >> 2] = t
                                                        }
                                                    while (0);
                                                    r = g + ((l | c) + S) | 0;
                                                    o = l + f | 0
                                                } else o = f;
                                                r = r + 4 | 0;
                                                i[r >> 2] = i[r >> 2] & -2;
                                                i[g + (d + 4) >> 2] = o | 1;
                                                i[g + (o + d) >> 2] = o;
                                                r = o >>> 3;
                                                if (o >>> 0 < 256) {
                                                    e = r << 1;
                                                    t = 1236 + (e << 2) | 0;
                                                    n = i[299] | 0;
                                                    r = 1 << r;
                                                    do
                                                        if (!(n & r)) {
                                                            i[299] = n | r;
                                                            B = 1236 + (e + 2 << 2) | 0;
                                                            I = t
                                                        } else {
                                                            r = 1236 + (e + 2 << 2) | 0;
                                                            e = i[r >> 2] | 0;
                                                            if (e >>> 0 >= (i[303] | 0) >>> 0) {
                                                                B = r;
                                                                I = e;
                                                                break
                                                            }
                                                            we()
                                                        }
                                                    while (0);
                                                    i[B >> 2] = E;
                                                    i[I + 12 >> 2] = E;
                                                    i[g + (d + 8) >> 2] = I;
                                                    i[g + (d + 12) >> 2] = t;
                                                    break
                                                }
                                                r = o >>> 8;
                                                do
                                                    if (!r) t = 0;
                                                    else {
                                                        if (o >>> 0 > 16777215) {
                                                            t = 31;
                                                            break
                                                        }
                                                        B = (r + 1048320 | 0) >>> 16 & 8;
                                                        I = r << B;
                                                        L = (I + 520192 | 0) >>> 16 & 4;
                                                        I = I << L;
                                                        t = (I + 245760 | 0) >>> 16 & 2;
                                                        t = 14 - (L | B | t) + (I << t >>> 15) | 0;
                                                        t = o >>> (t + 7 | 0) & 1 | t << 1
                                                    }
                                                while (0);
                                                r = 1500 + (t << 2) | 0;
                                                i[g + (d + 28) >> 2] = t;
                                                i[g + (d + 20) >> 2] = 0;
                                                i[g + (d + 16) >> 2] = 0;
                                                e = i[300] | 0;
                                                n = 1 << t;
                                                if (!(e & n)) {
                                                    i[300] = e | n;
                                                    i[r >> 2] = E;
                                                    i[g + (d + 24) >> 2] = r;
                                                    i[g + (d + 12) >> 2] = E;
                                                    i[g + (d + 8) >> 2] = E;
                                                    break
                                                }
                                                r = i[r >> 2] | 0;
                                                n: do
                                                    if ((i[r + 4 >> 2] & -8 | 0) != (o | 0)) {
                                                        t = o << ((t | 0) == 31 ? 0 : 25 - (t >>> 1) | 0);
                                                        while (1) {
                                                            e = r + 16 + (t >>> 31 << 2) | 0;
                                                            n = i[e >> 2] | 0;
                                                            if (!n) break;
                                                            if ((i[n + 4 >> 2] & -8 | 0) == (o | 0)) {
                                                                H = n;
                                                                break n
                                                            } else {
                                                                t = t << 1;
                                                                r = n
                                                            }
                                                        }
                                                        if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                                        else {
                                                            i[e >> 2] = E;
                                                            i[g + (d + 24) >> 2] = r;
                                                            i[g + (d + 12) >> 2] = E;
                                                            i[g + (d + 8) >> 2] = E;
                                                            break r
                                                        }
                                                    } else H = r; while (0);
                                                r = H + 8 | 0;
                                                e = i[r >> 2] | 0;
                                                I = i[303] | 0;
                                                if (e >>> 0 >= I >>> 0 & H >>> 0 >= I >>> 0) {
                                                    i[e + 12 >> 2] = E;
                                                    i[r >> 2] = E;
                                                    i[g + (d + 8) >> 2] = e;
                                                    i[g + (d + 12) >> 2] = H;
                                                    i[g + (d + 24) >> 2] = 0;
                                                    break
                                                } else we()
                                            } else {
                                                H = (i[302] | 0) + f | 0;
                                                i[302] = H;
                                                i[305] = E;
                                                i[g + (d + 4) >> 2] = H | 1
                                            }
                                        while (0);
                                        H = g + (m | 8) | 0;
                                        return H | 0
                                    } else n = 1644;
                                while (1) {
                                    e = i[n >> 2] | 0;
                                    if (e >>> 0 <= u >>> 0 ? (r = i[n + 4 >> 2] | 0, t = e + r | 0, t >>> 0 > u >>> 0) : 0) break;
                                    n = i[n + 8 >> 2] | 0
                                }
                                o = e + (r + -39) | 0;
                                e = e + (r + -47 + ((o & 7 | 0) == 0 ? 0 : 0 - o & 7)) | 0;
                                o = u + 16 | 0;
                                e = e >>> 0 < o >>> 0 ? u : e;
                                r = e + 8 | 0;
                                n = g + 8 | 0;
                                n = (n & 7 | 0) == 0 ? 0 : 0 - n & 7;
                                H = S + -40 - n | 0;
                                i[305] = g + n;
                                i[302] = H;
                                i[g + (n + 4) >> 2] = H | 1;
                                i[g + (S + -36) >> 2] = 40;
                                i[306] = i[421];
                                n = e + 4 | 0;
                                i[n >> 2] = 27;
                                i[r >> 2] = i[411];
                                i[r + 4 >> 2] = i[412];
                                i[r + 8 >> 2] = i[413];
                                i[r + 12 >> 2] = i[414];
                                i[411] = g;
                                i[412] = S;
                                i[414] = 0;
                                i[413] = r;
                                r = e + 28 | 0;
                                i[r >> 2] = 7;
                                if ((e + 32 | 0) >>> 0 < t >>> 0)
                                    do {
                                        H = r;
                                        r = r + 4 | 0;
                                        i[r >> 2] = 7
                                    } while ((H + 8 | 0) >>> 0 < t >>> 0);
                                if ((e | 0) != (u | 0)) {
                                    a = e - u | 0;
                                    i[n >> 2] = i[n >> 2] & -2;
                                    i[u + 4 >> 2] = a | 1;
                                    i[e >> 2] = a;
                                    r = a >>> 3;
                                    if (a >>> 0 < 256) {
                                        e = r << 1;
                                        t = 1236 + (e << 2) | 0;
                                        n = i[299] | 0;
                                        r = 1 << r;
                                        if (n & r) {
                                            r = 1236 + (e + 2 << 2) | 0;
                                            e = i[r >> 2] | 0;
                                            if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                            else {
                                                D = r;
                                                P = e
                                            }
                                        } else {
                                            i[299] = n | r;
                                            D = 1236 + (e + 2 << 2) | 0;
                                            P = t
                                        }
                                        i[D >> 2] = u;
                                        i[P + 12 >> 2] = u;
                                        i[u + 8 >> 2] = P;
                                        i[u + 12 >> 2] = t;
                                        break
                                    }
                                    r = a >>> 8;
                                    if (r)
                                        if (a >>> 0 > 16777215) t = 31;
                                        else {
                                            I = (r + 1048320 | 0) >>> 16 & 8;
                                            H = r << I;
                                            B = (H + 520192 | 0) >>> 16 & 4;
                                            H = H << B;
                                            t = (H + 245760 | 0) >>> 16 & 2;
                                            t = 14 - (B | I | t) + (H << t >>> 15) | 0;
                                            t = a >>> (t + 7 | 0) & 1 | t << 1
                                        }
                                    else t = 0;
                                    n = 1500 + (t << 2) | 0;
                                    i[u + 28 >> 2] = t;
                                    i[u + 20 >> 2] = 0;
                                    i[o >> 2] = 0;
                                    r = i[300] | 0;
                                    e = 1 << t;
                                    if (!(r & e)) {
                                        i[300] = r | e;
                                        i[n >> 2] = u;
                                        i[u + 24 >> 2] = n;
                                        i[u + 12 >> 2] = u;
                                        i[u + 8 >> 2] = u;
                                        break
                                    }
                                    r = i[n >> 2] | 0;
                                    r: do
                                        if ((i[r + 4 >> 2] & -8 | 0) != (a | 0)) {
                                            t = a << ((t | 0) == 31 ? 0 : 25 - (t >>> 1) | 0);
                                            while (1) {
                                                e = r + 16 + (t >>> 31 << 2) | 0;
                                                n = i[e >> 2] | 0;
                                                if (!n) break;
                                                if ((i[n + 4 >> 2] & -8 | 0) == (a | 0)) {
                                                    C = n;
                                                    break r
                                                } else {
                                                    t = t << 1;
                                                    r = n
                                                }
                                            }
                                            if (e >>> 0 < (i[303] | 0) >>> 0) we();
                                            else {
                                                i[e >> 2] = u;
                                                i[u + 24 >> 2] = r;
                                                i[u + 12 >> 2] = u;
                                                i[u + 8 >> 2] = u;
                                                break e
                                            }
                                        } else C = r; while (0);
                                    r = C + 8 | 0;
                                    e = i[r >> 2] | 0;
                                    H = i[303] | 0;
                                    if (e >>> 0 >= H >>> 0 & C >>> 0 >= H >>> 0) {
                                        i[e + 12 >> 2] = u;
                                        i[r >> 2] = u;
                                        i[u + 8 >> 2] = e;
                                        i[u + 12 >> 2] = C;
                                        i[u + 24 >> 2] = 0;
                                        break
                                    } else we()
                                }
                            } else {
                                H = i[303] | 0;
                                if ((H | 0) == 0 | g >>> 0 < H >>> 0) i[303] = g;
                                i[411] = g;
                                i[412] = S;
                                i[414] = 0;
                                i[308] = i[417];
                                i[307] = -1;
                                r = 0;
                                do {
                                    H = r << 1;
                                    I = 1236 + (H << 2) | 0;
                                    i[1236 + (H + 3 << 2) >> 2] = I;
                                    i[1236 + (H + 2 << 2) >> 2] = I;
                                    r = r + 1 | 0
                                } while ((r | 0) != 32);
                                H = g + 8 | 0;
                                H = (H & 7 | 0) == 0 ? 0 : 0 - H & 7;
                                I = S + -40 - H | 0;
                                i[305] = g + H;
                                i[302] = I;
                                i[g + (H + 4) >> 2] = I | 1;
                                i[g + (S + -36) >> 2] = 40;
                                i[306] = i[421]
                            }
                        while (0);
                        r = i[302] | 0;
                        if (r >>> 0 > p >>> 0) {
                            I = r - p | 0;
                            i[302] = I;
                            H = i[305] | 0;
                            i[305] = H + p;
                            i[H + (p + 4) >> 2] = I | 1;
                            i[H + 4 >> 2] = p | 3;
                            H = H + 8 | 0;
                            return H | 0
                        }
                    }
                    i[(dr() | 0) >> 2] = 12;
                    H = 0;
                    return H | 0
                }

                function _r(e) {
                    e = e | 0;
                    var r = 0,
                        n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0,
                        h = 0,
                        _ = 0,
                        w = 0,
                        v = 0;
                    if (!e) return;
                    r = e + -8 | 0;
                    s = i[303] | 0;
                    if (r >>> 0 < s >>> 0) we();
                    n = i[e + -4 >> 2] | 0;
                    t = n & 3;
                    if ((t | 0) == 1) we();
                    E = n & -8;
                    p = e + (E + -8) | 0;
                    do
                        if (!(n & 1)) {
                            r = i[r >> 2] | 0;
                            if (!t) return;
                            l = -8 - r | 0;
                            f = e + l | 0;
                            d = r + E | 0;
                            if (f >>> 0 < s >>> 0) we();
                            if ((f | 0) == (i[304] | 0)) {
                                r = e + (E + -4) | 0;
                                n = i[r >> 2] | 0;
                                if ((n & 3 | 0) != 3) {
                                    v = f;
                                    a = d;
                                    break
                                }
                                i[301] = d;
                                i[r >> 2] = n & -2;
                                i[e + (l + 4) >> 2] = d | 1;
                                i[p >> 2] = d;
                                return
                            }
                            o = r >>> 3;
                            if (r >>> 0 < 256) {
                                t = i[e + (l + 8) >> 2] | 0;
                                n = i[e + (l + 12) >> 2] | 0;
                                r = 1236 + (o << 1 << 2) | 0;
                                if ((t | 0) != (r | 0)) {
                                    if (t >>> 0 < s >>> 0) we();
                                    if ((i[t + 12 >> 2] | 0) != (f | 0)) we()
                                }
                                if ((n | 0) == (t | 0)) {
                                    i[299] = i[299] & ~(1 << o);
                                    v = f;
                                    a = d;
                                    break
                                }
                                if ((n | 0) != (r | 0)) {
                                    if (n >>> 0 < s >>> 0) we();
                                    r = n + 8 | 0;
                                    if ((i[r >> 2] | 0) == (f | 0)) u = r;
                                    else we()
                                } else u = n + 8 | 0;
                                i[t + 12 >> 2] = n;
                                i[u >> 2] = t;
                                v = f;
                                a = d;
                                break
                            }
                            u = i[e + (l + 24) >> 2] | 0;
                            t = i[e + (l + 12) >> 2] | 0;
                            do
                                if ((t | 0) == (f | 0)) {
                                    n = e + (l + 20) | 0;
                                    r = i[n >> 2] | 0;
                                    if (!r) {
                                        n = e + (l + 16) | 0;
                                        r = i[n >> 2] | 0;
                                        if (!r) {
                                            c = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        t = r + 20 | 0;
                                        o = i[t >> 2] | 0;
                                        if (o) {
                                            r = o;
                                            n = t;
                                            continue
                                        }
                                        t = r + 16 | 0;
                                        o = i[t >> 2] | 0;
                                        if (!o) break;
                                        else {
                                            r = o;
                                            n = t
                                        }
                                    }
                                    if (n >>> 0 < s >>> 0) we();
                                    else {
                                        i[n >> 2] = 0;
                                        c = r;
                                        break
                                    }
                                } else {
                                    o = i[e + (l + 8) >> 2] | 0;
                                    if (o >>> 0 < s >>> 0) we();
                                    r = o + 12 | 0;
                                    if ((i[r >> 2] | 0) != (f | 0)) we();
                                    n = t + 8 | 0;
                                    if ((i[n >> 2] | 0) == (f | 0)) {
                                        i[r >> 2] = t;
                                        i[n >> 2] = o;
                                        c = t;
                                        break
                                    } else we()
                                }
                            while (0);
                            if (u) {
                                r = i[e + (l + 28) >> 2] | 0;
                                n = 1500 + (r << 2) | 0;
                                if ((f | 0) == (i[n >> 2] | 0)) {
                                    i[n >> 2] = c;
                                    if (!c) {
                                        i[300] = i[300] & ~(1 << r);
                                        v = f;
                                        a = d;
                                        break
                                    }
                                } else {
                                    if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                    r = u + 16 | 0;
                                    if ((i[r >> 2] | 0) == (f | 0)) i[r >> 2] = c;
                                    else i[u + 20 >> 2] = c;
                                    if (!c) {
                                        v = f;
                                        a = d;
                                        break
                                    }
                                }
                                n = i[303] | 0;
                                if (c >>> 0 < n >>> 0) we();
                                i[c + 24 >> 2] = u;
                                r = i[e + (l + 16) >> 2] | 0;
                                do
                                    if (r)
                                        if (r >>> 0 < n >>> 0) we();
                                        else {
                                            i[c + 16 >> 2] = r;
                                            i[r + 24 >> 2] = c;
                                            break
                                        }
                                while (0);
                                r = i[e + (l + 20) >> 2] | 0;
                                if (r)
                                    if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                    else {
                                        i[c + 20 >> 2] = r;
                                        i[r + 24 >> 2] = c;
                                        v = f;
                                        a = d;
                                        break
                                    }
                                else {
                                    v = f;
                                    a = d
                                }
                            } else {
                                v = f;
                                a = d
                            }
                        } else {
                            v = r;
                            a = E
                        }
                    while (0);
                    if (v >>> 0 >= p >>> 0) we();
                    r = e + (E + -4) | 0;
                    n = i[r >> 2] | 0;
                    if (!(n & 1)) we();
                    if (!(n & 2)) {
                        if ((p | 0) == (i[305] | 0)) {
                            w = (i[302] | 0) + a | 0;
                            i[302] = w;
                            i[305] = v;
                            i[v + 4 >> 2] = w | 1;
                            if ((v | 0) != (i[304] | 0)) return;
                            i[304] = 0;
                            i[301] = 0;
                            return
                        }
                        if ((p | 0) == (i[304] | 0)) {
                            w = (i[301] | 0) + a | 0;
                            i[301] = w;
                            i[304] = v;
                            i[v + 4 >> 2] = w | 1;
                            i[v + w >> 2] = w;
                            return
                        }
                        a = (n & -8) + a | 0;
                        o = n >>> 3;
                        do
                            if (n >>> 0 >= 256) {
                                u = i[e + (E + 16) >> 2] | 0;
                                r = i[e + (E | 4) >> 2] | 0;
                                do
                                    if ((r | 0) == (p | 0)) {
                                        n = e + (E + 12) | 0;
                                        r = i[n >> 2] | 0;
                                        if (!r) {
                                            n = e + (E + 8) | 0;
                                            r = i[n >> 2] | 0;
                                            if (!r) {
                                                S = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            t = r + 20 | 0;
                                            o = i[t >> 2] | 0;
                                            if (o) {
                                                r = o;
                                                n = t;
                                                continue
                                            }
                                            t = r + 16 | 0;
                                            o = i[t >> 2] | 0;
                                            if (!o) break;
                                            else {
                                                r = o;
                                                n = t
                                            }
                                        }
                                        if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                        else {
                                            i[n >> 2] = 0;
                                            S = r;
                                            break
                                        }
                                    } else {
                                        n = i[e + E >> 2] | 0;
                                        if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                        t = n + 12 | 0;
                                        if ((i[t >> 2] | 0) != (p | 0)) we();
                                        o = r + 8 | 0;
                                        if ((i[o >> 2] | 0) == (p | 0)) {
                                            i[t >> 2] = r;
                                            i[o >> 2] = n;
                                            S = r;
                                            break
                                        } else we()
                                    }
                                while (0);
                                if (u) {
                                    r = i[e + (E + 20) >> 2] | 0;
                                    n = 1500 + (r << 2) | 0;
                                    if ((p | 0) == (i[n >> 2] | 0)) {
                                        i[n >> 2] = S;
                                        if (!S) {
                                            i[300] = i[300] & ~(1 << r);
                                            break
                                        }
                                    } else {
                                        if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                        r = u + 16 | 0;
                                        if ((i[r >> 2] | 0) == (p | 0)) i[r >> 2] = S;
                                        else i[u + 20 >> 2] = S;
                                        if (!S) break
                                    }
                                    n = i[303] | 0;
                                    if (S >>> 0 < n >>> 0) we();
                                    i[S + 24 >> 2] = u;
                                    r = i[e + (E + 8) >> 2] | 0;
                                    do
                                        if (r)
                                            if (r >>> 0 < n >>> 0) we();
                                            else {
                                                i[S + 16 >> 2] = r;
                                                i[r + 24 >> 2] = S;
                                                break
                                            }
                                    while (0);
                                    r = i[e + (E + 12) >> 2] | 0;
                                    if (r)
                                        if (r >>> 0 < (i[303] | 0) >>> 0) we();
                                        else {
                                            i[S + 20 >> 2] = r;
                                            i[r + 24 >> 2] = S;
                                            break
                                        }
                                }
                            } else {
                                t = i[e + E >> 2] | 0;
                                n = i[e + (E | 4) >> 2] | 0;
                                r = 1236 + (o << 1 << 2) | 0;
                                if ((t | 0) != (r | 0)) {
                                    if (t >>> 0 < (i[303] | 0) >>> 0) we();
                                    if ((i[t + 12 >> 2] | 0) != (p | 0)) we()
                                }
                                if ((n | 0) == (t | 0)) {
                                    i[299] = i[299] & ~(1 << o);
                                    break
                                }
                                if ((n | 0) != (r | 0)) {
                                    if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                    r = n + 8 | 0;
                                    if ((i[r >> 2] | 0) == (p | 0)) m = r;
                                    else we()
                                } else m = n + 8 | 0;
                                i[t + 12 >> 2] = n;
                                i[m >> 2] = t
                            }
                        while (0);
                        i[v + 4 >> 2] = a | 1;
                        i[v + a >> 2] = a;
                        if ((v | 0) == (i[304] | 0)) {
                            i[301] = a;
                            return
                        }
                    } else {
                        i[r >> 2] = n & -2;
                        i[v + 4 >> 2] = a | 1;
                        i[v + a >> 2] = a
                    }
                    r = a >>> 3;
                    if (a >>> 0 < 256) {
                        n = r << 1;
                        o = 1236 + (n << 2) | 0;
                        t = i[299] | 0;
                        r = 1 << r;
                        if (t & r) {
                            r = 1236 + (n + 2 << 2) | 0;
                            n = i[r >> 2] | 0;
                            if (n >>> 0 < (i[303] | 0) >>> 0) we();
                            else {
                                h = r;
                                _ = n
                            }
                        } else {
                            i[299] = t | r;
                            h = 1236 + (n + 2 << 2) | 0;
                            _ = o
                        }
                        i[h >> 2] = v;
                        i[_ + 12 >> 2] = v;
                        i[v + 8 >> 2] = _;
                        i[v + 12 >> 2] = o;
                        return
                    }
                    r = a >>> 8;
                    if (r)
                        if (a >>> 0 > 16777215) o = 31;
                        else {
                            h = (r + 1048320 | 0) >>> 16 & 8;
                            _ = r << h;
                            p = (_ + 520192 | 0) >>> 16 & 4;
                            _ = _ << p;
                            o = (_ + 245760 | 0) >>> 16 & 2;
                            o = 14 - (p | h | o) + (_ << o >>> 15) | 0;
                            o = a >>> (o + 7 | 0) & 1 | o << 1
                        }
                    else o = 0;
                    r = 1500 + (o << 2) | 0;
                    i[v + 28 >> 2] = o;
                    i[v + 20 >> 2] = 0;
                    i[v + 16 >> 2] = 0;
                    n = i[300] | 0;
                    t = 1 << o;
                    e: do
                        if (n & t) {
                            r = i[r >> 2] | 0;
                            r: do
                                if ((i[r + 4 >> 2] & -8 | 0) != (a | 0)) {
                                    o = a << ((o | 0) == 31 ? 0 : 25 - (o >>> 1) | 0);
                                    while (1) {
                                        n = r + 16 + (o >>> 31 << 2) | 0;
                                        t = i[n >> 2] | 0;
                                        if (!t) break;
                                        if ((i[t + 4 >> 2] & -8 | 0) == (a | 0)) {
                                            w = t;
                                            break r
                                        } else {
                                            o = o << 1;
                                            r = t
                                        }
                                    }
                                    if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                    else {
                                        i[n >> 2] = v;
                                        i[v + 24 >> 2] = r;
                                        i[v + 12 >> 2] = v;
                                        i[v + 8 >> 2] = v;
                                        break e
                                    }
                                } else w = r; while (0);
                            r = w + 8 | 0;
                            n = i[r >> 2] | 0;
                            _ = i[303] | 0;
                            if (n >>> 0 >= _ >>> 0 & w >>> 0 >= _ >>> 0) {
                                i[n + 12 >> 2] = v;
                                i[r >> 2] = v;
                                i[v + 8 >> 2] = n;
                                i[v + 12 >> 2] = w;
                                i[v + 24 >> 2] = 0;
                                break
                            } else we()
                        } else {
                            i[300] = n | t;
                            i[r >> 2] = v;
                            i[v + 24 >> 2] = r;
                            i[v + 12 >> 2] = v;
                            i[v + 8 >> 2] = v
                        }
                    while (0);
                    v = (i[307] | 0) + -1 | 0;
                    i[307] = v;
                    if (!v) r = 1652;
                    else return;
                    while (1) {
                        r = i[r >> 2] | 0;
                        if (!r) break;
                        else r = r + 8 | 0
                    }
                    i[307] = -1;
                    return
                }

                function wr(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0;
                    if (e) {
                        n = re(r, e) | 0;
                        if ((r | e) >>> 0 > 65535) n = ((n >>> 0) / (e >>> 0) | 0 | 0) == (r | 0) ? n : -1
                    } else n = 0;
                    r = hr(n) | 0;
                    if (!r) return r | 0;
                    if (!(i[r + -4 >> 2] & 3)) return r | 0;
                    Mr(r | 0, 0, n | 0) | 0;
                    return r | 0
                }

                function vr(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0;
                    if (!e) {
                        e = hr(r) | 0;
                        return e | 0
                    }
                    if (r >>> 0 > 4294967231) {
                        i[(dr() | 0) >> 2] = 12;
                        e = 0;
                        return e | 0
                    }
                    n = Fr(e + -8 | 0, r >>> 0 < 11 ? 16 : r + 11 & -8) | 0;
                    if (n) {
                        e = n + 8 | 0;
                        return e | 0
                    }
                    n = hr(r) | 0;
                    if (!n) {
                        e = 0;
                        return e | 0
                    }
                    t = i[e + -4 >> 2] | 0;
                    t = (t & -8) - ((t & 3 | 0) == 0 ? 8 : 4) | 0;
                    Or(n | 0, e | 0, (t >>> 0 < r >>> 0 ? t : r) | 0) | 0;
                    _r(e);
                    e = n;
                    return e | 0
                }

                function Fr(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0;
                    E = e + 4 | 0;
                    S = i[E >> 2] | 0;
                    l = S & -8;
                    f = e + l | 0;
                    s = i[303] | 0;
                    n = S & 3;
                    if (!((n | 0) != 1 & e >>> 0 >= s >>> 0 & e >>> 0 < f >>> 0)) we();
                    t = e + (l | 4) | 0;
                    o = i[t >> 2] | 0;
                    if (!(o & 1)) we();
                    if (!n) {
                        if (r >>> 0 < 256) {
                            e = 0;
                            return e | 0
                        }
                        if (l >>> 0 >= (r + 4 | 0) >>> 0 ? (l - r | 0) >>> 0 <= i[419] << 1 >>> 0 : 0) return e | 0;
                        e = 0;
                        return e | 0
                    }
                    if (l >>> 0 >= r >>> 0) {
                        n = l - r | 0;
                        if (n >>> 0 <= 15) return e | 0;
                        i[E >> 2] = S & 1 | r | 2;
                        i[e + (r + 4) >> 2] = n | 3;
                        i[t >> 2] = i[t >> 2] | 1;
                        gr(e + r | 0, n);
                        return e | 0
                    }
                    if ((f | 0) == (i[305] | 0)) {
                        n = (i[302] | 0) + l | 0;
                        if (n >>> 0 <= r >>> 0) {
                            e = 0;
                            return e | 0
                        }
                        m = n - r | 0;
                        i[E >> 2] = S & 1 | r | 2;
                        i[e + (r + 4) >> 2] = m | 1;
                        i[305] = e + r;
                        i[302] = m;
                        return e | 0
                    }
                    if ((f | 0) == (i[304] | 0)) {
                        t = (i[301] | 0) + l | 0;
                        if (t >>> 0 < r >>> 0) {
                            e = 0;
                            return e | 0
                        }
                        n = t - r | 0;
                        if (n >>> 0 > 15) {
                            i[E >> 2] = S & 1 | r | 2;
                            i[e + (r + 4) >> 2] = n | 1;
                            i[e + t >> 2] = n;
                            t = e + (t + 4) | 0;
                            i[t >> 2] = i[t >> 2] & -2;
                            t = e + r | 0
                        } else {
                            i[E >> 2] = S & 1 | t | 2;
                            t = e + (t + 4) | 0;
                            i[t >> 2] = i[t >> 2] | 1;
                            t = 0;
                            n = 0
                        }
                        i[301] = n;
                        i[304] = t;
                        return e | 0
                    }
                    if (o & 2) {
                        e = 0;
                        return e | 0
                    }
                    d = (o & -8) + l | 0;
                    if (d >>> 0 < r >>> 0) {
                        e = 0;
                        return e | 0
                    }
                    m = d - r | 0;
                    a = o >>> 3;
                    do
                        if (o >>> 0 >= 256) {
                            u = i[e + (l + 24) >> 2] | 0;
                            a = i[e + (l + 12) >> 2] | 0;
                            do
                                if ((a | 0) == (f | 0)) {
                                    t = e + (l + 20) | 0;
                                    n = i[t >> 2] | 0;
                                    if (!n) {
                                        t = e + (l + 16) | 0;
                                        n = i[t >> 2] | 0;
                                        if (!n) {
                                            c = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        o = n + 20 | 0;
                                        a = i[o >> 2] | 0;
                                        if (a) {
                                            n = a;
                                            t = o;
                                            continue
                                        }
                                        o = n + 16 | 0;
                                        a = i[o >> 2] | 0;
                                        if (!a) break;
                                        else {
                                            n = a;
                                            t = o
                                        }
                                    }
                                    if (t >>> 0 < s >>> 0) we();
                                    else {
                                        i[t >> 2] = 0;
                                        c = n;
                                        break
                                    }
                                } else {
                                    o = i[e + (l + 8) >> 2] | 0;
                                    if (o >>> 0 < s >>> 0) we();
                                    n = o + 12 | 0;
                                    if ((i[n >> 2] | 0) != (f | 0)) we();
                                    t = a + 8 | 0;
                                    if ((i[t >> 2] | 0) == (f | 0)) {
                                        i[n >> 2] = a;
                                        i[t >> 2] = o;
                                        c = a;
                                        break
                                    } else we()
                                }
                            while (0);
                            if (u) {
                                n = i[e + (l + 28) >> 2] | 0;
                                t = 1500 + (n << 2) | 0;
                                if ((f | 0) == (i[t >> 2] | 0)) {
                                    i[t >> 2] = c;
                                    if (!c) {
                                        i[300] = i[300] & ~(1 << n);
                                        break
                                    }
                                } else {
                                    if (u >>> 0 < (i[303] | 0) >>> 0) we();
                                    n = u + 16 | 0;
                                    if ((i[n >> 2] | 0) == (f | 0)) i[n >> 2] = c;
                                    else i[u + 20 >> 2] = c;
                                    if (!c) break
                                }
                                t = i[303] | 0;
                                if (c >>> 0 < t >>> 0) we();
                                i[c + 24 >> 2] = u;
                                n = i[e + (l + 16) >> 2] | 0;
                                do
                                    if (n)
                                        if (n >>> 0 < t >>> 0) we();
                                        else {
                                            i[c + 16 >> 2] = n;
                                            i[n + 24 >> 2] = c;
                                            break
                                        }
                                while (0);
                                n = i[e + (l + 20) >> 2] | 0;
                                if (n)
                                    if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                    else {
                                        i[c + 20 >> 2] = n;
                                        i[n + 24 >> 2] = c;
                                        break
                                    }
                            }
                        } else {
                            o = i[e + (l + 8) >> 2] | 0;
                            t = i[e + (l + 12) >> 2] | 0;
                            n = 1236 + (a << 1 << 2) | 0;
                            if ((o | 0) != (n | 0)) {
                                if (o >>> 0 < s >>> 0) we();
                                if ((i[o + 12 >> 2] | 0) != (f | 0)) we()
                            }
                            if ((t | 0) == (o | 0)) {
                                i[299] = i[299] & ~(1 << a);
                                break
                            }
                            if ((t | 0) != (n | 0)) {
                                if (t >>> 0 < s >>> 0) we();
                                n = t + 8 | 0;
                                if ((i[n >> 2] | 0) == (f | 0)) u = n;
                                else we()
                            } else u = t + 8 | 0;
                            i[o + 12 >> 2] = t;
                            i[u >> 2] = o
                        }
                    while (0);
                    if (m >>> 0 < 16) {
                        i[E >> 2] = d | S & 1 | 2;
                        r = e + (d | 4) | 0;
                        i[r >> 2] = i[r >> 2] | 1;
                        return e | 0
                    } else {
                        i[E >> 2] = S & 1 | r | 2;
                        i[e + (r + 4) >> 2] = m | 3;
                        S = e + (d | 4) | 0;
                        i[S >> 2] = i[S >> 2] | 1;
                        gr(e + r | 0, m);
                        return e | 0
                    }
                    return 0
                }

                function gr(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0,
                        p = 0,
                        h = 0,
                        _ = 0,
                        w = 0;
                    p = e + r | 0;
                    n = i[e + 4 >> 2] | 0;
                    do
                        if (!(n & 1)) {
                            c = i[e >> 2] | 0;
                            if (!(n & 3)) return;
                            m = e + (0 - c) | 0;
                            d = c + r | 0;
                            l = i[303] | 0;
                            if (m >>> 0 < l >>> 0) we();
                            if ((m | 0) == (i[304] | 0)) {
                                t = e + (r + 4) | 0;
                                n = i[t >> 2] | 0;
                                if ((n & 3 | 0) != 3) {
                                    w = m;
                                    u = d;
                                    break
                                }
                                i[301] = d;
                                i[t >> 2] = n & -2;
                                i[e + (4 - c) >> 2] = d | 1;
                                i[p >> 2] = d;
                                return
                            }
                            a = c >>> 3;
                            if (c >>> 0 < 256) {
                                o = i[e + (8 - c) >> 2] | 0;
                                t = i[e + (12 - c) >> 2] | 0;
                                n = 1236 + (a << 1 << 2) | 0;
                                if ((o | 0) != (n | 0)) {
                                    if (o >>> 0 < l >>> 0) we();
                                    if ((i[o + 12 >> 2] | 0) != (m | 0)) we()
                                }
                                if ((t | 0) == (o | 0)) {
                                    i[299] = i[299] & ~(1 << a);
                                    w = m;
                                    u = d;
                                    break
                                }
                                if ((t | 0) != (n | 0)) {
                                    if (t >>> 0 < l >>> 0) we();
                                    n = t + 8 | 0;
                                    if ((i[n >> 2] | 0) == (m | 0)) s = n;
                                    else we()
                                } else s = t + 8 | 0;
                                i[o + 12 >> 2] = t;
                                i[s >> 2] = o;
                                w = m;
                                u = d;
                                break
                            }
                            s = i[e + (24 - c) >> 2] | 0;
                            o = i[e + (12 - c) >> 2] | 0;
                            do
                                if ((o | 0) == (m | 0)) {
                                    o = 16 - c | 0;
                                    t = e + (o + 4) | 0;
                                    n = i[t >> 2] | 0;
                                    if (!n) {
                                        t = e + o | 0;
                                        n = i[t >> 2] | 0;
                                        if (!n) {
                                            f = 0;
                                            break
                                        }
                                    }
                                    while (1) {
                                        o = n + 20 | 0;
                                        a = i[o >> 2] | 0;
                                        if (a) {
                                            n = a;
                                            t = o;
                                            continue
                                        }
                                        o = n + 16 | 0;
                                        a = i[o >> 2] | 0;
                                        if (!a) break;
                                        else {
                                            n = a;
                                            t = o
                                        }
                                    }
                                    if (t >>> 0 < l >>> 0) we();
                                    else {
                                        i[t >> 2] = 0;
                                        f = n;
                                        break
                                    }
                                } else {
                                    a = i[e + (8 - c) >> 2] | 0;
                                    if (a >>> 0 < l >>> 0) we();
                                    n = a + 12 | 0;
                                    if ((i[n >> 2] | 0) != (m | 0)) we();
                                    t = o + 8 | 0;
                                    if ((i[t >> 2] | 0) == (m | 0)) {
                                        i[n >> 2] = o;
                                        i[t >> 2] = a;
                                        f = o;
                                        break
                                    } else we()
                                }
                            while (0);
                            if (s) {
                                n = i[e + (28 - c) >> 2] | 0;
                                t = 1500 + (n << 2) | 0;
                                if ((m | 0) == (i[t >> 2] | 0)) {
                                    i[t >> 2] = f;
                                    if (!f) {
                                        i[300] = i[300] & ~(1 << n);
                                        w = m;
                                        u = d;
                                        break
                                    }
                                } else {
                                    if (s >>> 0 < (i[303] | 0) >>> 0) we();
                                    n = s + 16 | 0;
                                    if ((i[n >> 2] | 0) == (m | 0)) i[n >> 2] = f;
                                    else i[s + 20 >> 2] = f;
                                    if (!f) {
                                        w = m;
                                        u = d;
                                        break
                                    }
                                }
                                o = i[303] | 0;
                                if (f >>> 0 < o >>> 0) we();
                                i[f + 24 >> 2] = s;
                                n = 16 - c | 0;
                                t = i[e + n >> 2] | 0;
                                do
                                    if (t)
                                        if (t >>> 0 < o >>> 0) we();
                                        else {
                                            i[f + 16 >> 2] = t;
                                            i[t + 24 >> 2] = f;
                                            break
                                        }
                                while (0);
                                n = i[e + (n + 4) >> 2] | 0;
                                if (n)
                                    if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                    else {
                                        i[f + 20 >> 2] = n;
                                        i[n + 24 >> 2] = f;
                                        w = m;
                                        u = d;
                                        break
                                    }
                                else {
                                    w = m;
                                    u = d
                                }
                            } else {
                                w = m;
                                u = d
                            }
                        } else {
                            w = e;
                            u = r
                        }
                    while (0);
                    l = i[303] | 0;
                    if (p >>> 0 < l >>> 0) we();
                    n = e + (r + 4) | 0;
                    t = i[n >> 2] | 0;
                    if (!(t & 2)) {
                        if ((p | 0) == (i[305] | 0)) {
                            _ = (i[302] | 0) + u | 0;
                            i[302] = _;
                            i[305] = w;
                            i[w + 4 >> 2] = _ | 1;
                            if ((w | 0) != (i[304] | 0)) return;
                            i[304] = 0;
                            i[301] = 0;
                            return
                        }
                        if ((p | 0) == (i[304] | 0)) {
                            _ = (i[301] | 0) + u | 0;
                            i[301] = _;
                            i[304] = w;
                            i[w + 4 >> 2] = _ | 1;
                            i[w + _ >> 2] = _;
                            return
                        }
                        u = (t & -8) + u | 0;
                        a = t >>> 3;
                        do
                            if (t >>> 0 >= 256) {
                                s = i[e + (r + 24) >> 2] | 0;
                                o = i[e + (r + 12) >> 2] | 0;
                                do
                                    if ((o | 0) == (p | 0)) {
                                        t = e + (r + 20) | 0;
                                        n = i[t >> 2] | 0;
                                        if (!n) {
                                            t = e + (r + 16) | 0;
                                            n = i[t >> 2] | 0;
                                            if (!n) {
                                                S = 0;
                                                break
                                            }
                                        }
                                        while (1) {
                                            o = n + 20 | 0;
                                            a = i[o >> 2] | 0;
                                            if (a) {
                                                n = a;
                                                t = o;
                                                continue
                                            }
                                            o = n + 16 | 0;
                                            a = i[o >> 2] | 0;
                                            if (!a) break;
                                            else {
                                                n = a;
                                                t = o
                                            }
                                        }
                                        if (t >>> 0 < l >>> 0) we();
                                        else {
                                            i[t >> 2] = 0;
                                            S = n;
                                            break
                                        }
                                    } else {
                                        a = i[e + (r + 8) >> 2] | 0;
                                        if (a >>> 0 < l >>> 0) we();
                                        n = a + 12 | 0;
                                        if ((i[n >> 2] | 0) != (p | 0)) we();
                                        t = o + 8 | 0;
                                        if ((i[t >> 2] | 0) == (p | 0)) {
                                            i[n >> 2] = o;
                                            i[t >> 2] = a;
                                            S = o;
                                            break
                                        } else we()
                                    }
                                while (0);
                                if (s) {
                                    n = i[e + (r + 28) >> 2] | 0;
                                    t = 1500 + (n << 2) | 0;
                                    if ((p | 0) == (i[t >> 2] | 0)) {
                                        i[t >> 2] = S;
                                        if (!S) {
                                            i[300] = i[300] & ~(1 << n);
                                            break
                                        }
                                    } else {
                                        if (s >>> 0 < (i[303] | 0) >>> 0) we();
                                        n = s + 16 | 0;
                                        if ((i[n >> 2] | 0) == (p | 0)) i[n >> 2] = S;
                                        else i[s + 20 >> 2] = S;
                                        if (!S) break
                                    }
                                    t = i[303] | 0;
                                    if (S >>> 0 < t >>> 0) we();
                                    i[S + 24 >> 2] = s;
                                    n = i[e + (r + 16) >> 2] | 0;
                                    do
                                        if (n)
                                            if (n >>> 0 < t >>> 0) we();
                                            else {
                                                i[S + 16 >> 2] = n;
                                                i[n + 24 >> 2] = S;
                                                break
                                            }
                                    while (0);
                                    n = i[e + (r + 20) >> 2] | 0;
                                    if (n)
                                        if (n >>> 0 < (i[303] | 0) >>> 0) we();
                                        else {
                                            i[S + 20 >> 2] = n;
                                            i[n + 24 >> 2] = S;
                                            break
                                        }
                                }
                            } else {
                                o = i[e + (r + 8) >> 2] | 0;
                                t = i[e + (r + 12) >> 2] | 0;
                                n = 1236 + (a << 1 << 2) | 0;
                                if ((o | 0) != (n | 0)) {
                                    if (o >>> 0 < l >>> 0) we();
                                    if ((i[o + 12 >> 2] | 0) != (p | 0)) we()
                                }
                                if ((t | 0) == (o | 0)) {
                                    i[299] = i[299] & ~(1 << a);
                                    break
                                }
                                if ((t | 0) != (n | 0)) {
                                    if (t >>> 0 < l >>> 0) we();
                                    n = t + 8 | 0;
                                    if ((i[n >> 2] | 0) == (p | 0)) E = n;
                                    else we()
                                } else E = t + 8 | 0;
                                i[o + 12 >> 2] = t;
                                i[E >> 2] = o
                            }
                        while (0);
                        i[w + 4 >> 2] = u | 1;
                        i[w + u >> 2] = u;
                        if ((w | 0) == (i[304] | 0)) {
                            i[301] = u;
                            return
                        }
                    } else {
                        i[n >> 2] = t & -2;
                        i[w + 4 >> 2] = u | 1;
                        i[w + u >> 2] = u
                    }
                    n = u >>> 3;
                    if (u >>> 0 < 256) {
                        t = n << 1;
                        a = 1236 + (t << 2) | 0;
                        o = i[299] | 0;
                        n = 1 << n;
                        if (o & n) {
                            n = 1236 + (t + 2 << 2) | 0;
                            t = i[n >> 2] | 0;
                            if (t >>> 0 < (i[303] | 0) >>> 0) we();
                            else {
                                h = n;
                                _ = t
                            }
                        } else {
                            i[299] = o | n;
                            h = 1236 + (t + 2 << 2) | 0;
                            _ = a
                        }
                        i[h >> 2] = w;
                        i[_ + 12 >> 2] = w;
                        i[w + 8 >> 2] = _;
                        i[w + 12 >> 2] = a;
                        return
                    }
                    n = u >>> 8;
                    if (n)
                        if (u >>> 0 > 16777215) a = 31;
                        else {
                            h = (n + 1048320 | 0) >>> 16 & 8;
                            _ = n << h;
                            p = (_ + 520192 | 0) >>> 16 & 4;
                            _ = _ << p;
                            a = (_ + 245760 | 0) >>> 16 & 2;
                            a = 14 - (p | h | a) + (_ << a >>> 15) | 0;
                            a = u >>> (a + 7 | 0) & 1 | a << 1
                        }
                    else a = 0;
                    n = 1500 + (a << 2) | 0;
                    i[w + 28 >> 2] = a;
                    i[w + 20 >> 2] = 0;
                    i[w + 16 >> 2] = 0;
                    t = i[300] | 0;
                    o = 1 << a;
                    if (!(t & o)) {
                        i[300] = t | o;
                        i[n >> 2] = w;
                        i[w + 24 >> 2] = n;
                        i[w + 12 >> 2] = w;
                        i[w + 8 >> 2] = w;
                        return
                    }
                    n = i[n >> 2] | 0;
                    e: do
                        if ((i[n + 4 >> 2] & -8 | 0) != (u | 0)) {
                            a = u << ((a | 0) == 31 ? 0 : 25 - (a >>> 1) | 0);
                            while (1) {
                                t = n + 16 + (a >>> 31 << 2) | 0;
                                o = i[t >> 2] | 0;
                                if (!o) break;
                                if ((i[o + 4 >> 2] & -8 | 0) == (u | 0)) {
                                    n = o;
                                    break e
                                } else {
                                    a = a << 1;
                                    n = o
                                }
                            }
                            if (t >>> 0 < (i[303] | 0) >>> 0) we();
                            i[t >> 2] = w;
                            i[w + 24 >> 2] = n;
                            i[w + 12 >> 2] = w;
                            i[w + 8 >> 2] = w;
                            return
                        }
                    while (0);
                    t = n + 8 | 0;
                    o = i[t >> 2] | 0;
                    _ = i[303] | 0;
                    if (!(o >>> 0 >= _ >>> 0 & n >>> 0 >= _ >>> 0)) we();
                    i[o + 12 >> 2] = w;
                    i[t >> 2] = w;
                    i[w + 8 >> 2] = o;
                    i[w + 12 >> 2] = n;
                    i[w + 24 >> 2] = 0;
                    return
                }

                function yr() {}

                function Mr(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0,
                        a = 0,
                        u = 0,
                        s = 0;
                    o = e + n | 0;
                    if ((n | 0) >= 20) {
                        r = r & 255;
                        u = e & 3;
                        s = r | r << 8 | r << 16 | r << 24;
                        a = o & ~3;
                        if (u) {
                            u = e + 4 - u | 0;
                            while ((e | 0) < (u | 0)) {
                                t[e >> 0] = r;
                                e = e + 1 | 0
                            }
                        }
                        while ((e | 0) < (a | 0)) {
                            i[e >> 2] = s;
                            e = e + 4 | 0
                        }
                    }
                    while ((e | 0) < (o | 0)) {
                        t[e >> 0] = r;
                        e = e + 1 | 0
                    }
                    return e - n | 0
                }

                function Ar(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    if ((n | 0) < 32) {
                        N = r << n | (e & (1 << n) - 1 << 32 - n) >>> 32 - n;
                        return e << n
                    }
                    N = e << n - 32;
                    return 0
                }

                function Rr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    n = e + n >>> 0;
                    return (N = r + t + (n >>> 0 < e >>> 0 | 0) >>> 0, n | 0) | 0
                }

                function Or(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0;
                    if ((n | 0) >= 4096) return Ae(e | 0, r | 0, n | 0) | 0;
                    o = e | 0;
                    if ((e & 3) == (r & 3)) {
                        while (e & 3) {
                            if (!n) return o | 0;
                            t[e >> 0] = t[r >> 0] | 0;
                            e = e + 1 | 0;
                            r = r + 1 | 0;
                            n = n - 1 | 0
                        }
                        while ((n | 0) >= 4) {
                            i[e >> 2] = i[r >> 2];
                            e = e + 4 | 0;
                            r = r + 4 | 0;
                            n = n - 4 | 0
                        }
                    }
                    while ((n | 0) > 0) {
                        t[e >> 0] = t[r >> 0] | 0;
                        e = e + 1 | 0;
                        r = r + 1 | 0;
                        n = n - 1 | 0
                    }
                    return o | 0
                }

                function br(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    var o = 0;
                    if ((r | 0) < (e | 0) & (e | 0) < (r + n | 0)) {
                        o = e;
                        r = r + n | 0;
                        e = e + n | 0;
                        while ((n | 0) > 0) {
                            e = e - 1 | 0;
                            r = r - 1 | 0;
                            n = n - 1 | 0;
                            t[e >> 0] = t[r >> 0] | 0
                        }
                        e = o
                    } else Or(e, r, n) | 0;
                    return e | 0
                }

                function kr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    t = r - t - (n >>> 0 > e >>> 0 | 0) >>> 0;
                    return (N = t, e - n >>> 0 | 0) | 0
                }

                function Tr(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    if ((n | 0) < 32) {
                        N = r >>> n;
                        return e >>> n | (r & (1 << n) - 1) << 32 - n
                    }
                    N = 0;
                    return r >>> n - 32 | 0
                }

                function Nr(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    if ((n | 0) < 32) {
                        N = r >> n;
                        return e >>> n | (r & (1 << n) - 1) << 32 - n
                    }
                    N = (r | 0) < 0 ? -1 : 0;
                    return r >> n - 32 | 0
                }

                function Dr(e) {
                    e = e | 0;
                    var r = 0;
                    r = t[S + (e & 255) >> 0] | 0;
                    if ((r | 0) < 8) return r | 0;
                    r = t[S + (e >> 8 & 255) >> 0] | 0;
                    if ((r | 0) < 8) return r + 8 | 0;
                    r = t[S + (e >> 16 & 255) >> 0] | 0;
                    if ((r | 0) < 8) return r + 16 | 0;
                    return (t[S + (e >>> 24) >> 0] | 0) + 24 | 0
                }

                function Pr(e, r) {
                    e = e | 0;
                    r = r | 0;
                    var n = 0,
                        t = 0,
                        o = 0,
                        i = 0;
                    i = e & 65535;
                    o = r & 65535;
                    n = re(o, i) | 0;
                    t = e >>> 16;
                    e = (n >>> 16) + (re(o, t) | 0) | 0;
                    o = r >>> 16;
                    r = re(o, i) | 0;
                    return (N = (e >>> 16) + (re(o, t) | 0) + (((e & 65535) + r | 0) >>> 16) | 0, e + r << 16 | n & 65535 | 0) | 0
                }

                function Cr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    var o = 0,
                        i = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0;
                    l = r >> 31 | ((r | 0) < 0 ? -1 : 0) << 1;
                    s = ((r | 0) < 0 ? -1 : 0) >> 31 | ((r | 0) < 0 ? -1 : 0) << 1;
                    i = t >> 31 | ((t | 0) < 0 ? -1 : 0) << 1;
                    o = ((t | 0) < 0 ? -1 : 0) >> 31 | ((t | 0) < 0 ? -1 : 0) << 1;
                    u = kr(l ^ e, s ^ r, l, s) | 0;
                    a = N;
                    e = i ^ l;
                    r = o ^ s;
                    return kr((xr(u, a, kr(i ^ n, o ^ t, i, o) | 0, N, 0) | 0) ^ e, N ^ r, e, r) | 0
                }

                function Lr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    var o = 0,
                        a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0;
                    o = f;
                    f = f + 16 | 0;
                    s = o | 0;
                    u = r >> 31 | ((r | 0) < 0 ? -1 : 0) << 1;
                    a = ((r | 0) < 0 ? -1 : 0) >> 31 | ((r | 0) < 0 ? -1 : 0) << 1;
                    c = t >> 31 | ((t | 0) < 0 ? -1 : 0) << 1;
                    l = ((t | 0) < 0 ? -1 : 0) >> 31 | ((t | 0) < 0 ? -1 : 0) << 1;
                    e = kr(u ^ e, a ^ r, u, a) | 0;
                    r = N;
                    xr(e, r, kr(c ^ n, l ^ t, c, l) | 0, N, s) | 0;
                    t = kr(i[s >> 2] ^ u, i[s + 4 >> 2] ^ a, u, a) | 0;
                    n = N;
                    f = o;
                    return (N = n, t) | 0
                }

                function Br(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    var o = 0,
                        i = 0;
                    o = e;
                    i = n;
                    n = Pr(o, i) | 0;
                    e = N;
                    return (N = (re(r, i) | 0) + (re(t, o) | 0) + e | e & 0, n | 0 | 0) | 0
                }

                function Ir(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    return xr(e, r, n, t, 0) | 0
                }

                function Hr(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    var o = 0,
                        a = 0;
                    a = f;
                    f = f + 16 | 0;
                    o = a | 0;
                    xr(e, r, n, t, o) | 0;
                    f = a;
                    return (N = i[o + 4 >> 2] | 0, i[o >> 2] | 0) | 0
                }

                function xr(e, r, n, t, o) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    o = o | 0;
                    var a = 0,
                        u = 0,
                        s = 0,
                        l = 0,
                        c = 0,
                        f = 0,
                        d = 0,
                        m = 0,
                        E = 0,
                        S = 0;
                    f = e;
                    l = r;
                    c = l;
                    u = n;
                    m = t;
                    s = m;
                    if (!c) {
                        a = (o | 0) != 0;
                        if (!s) {
                            if (a) {
                                i[o >> 2] = (f >>> 0) % (u >>> 0);
                                i[o + 4 >> 2] = 0
                            }
                            m = 0;
                            o = (f >>> 0) / (u >>> 0) >>> 0;
                            return (N = m, o) | 0
                        } else {
                            if (!a) {
                                m = 0;
                                o = 0;
                                return (N = m, o) | 0
                            }
                            i[o >> 2] = e | 0;
                            i[o + 4 >> 2] = r & 0;
                            m = 0;
                            o = 0;
                            return (N = m, o) | 0
                        }
                    }
                    a = (s | 0) == 0;
                    do
                        if (u) {
                            if (!a) {
                                a = (te(s | 0) | 0) - (te(c | 0) | 0) | 0;
                                if (a >>> 0 <= 31) {
                                    d = a + 1 | 0;
                                    s = 31 - a | 0;
                                    r = a - 31 >> 31;
                                    u = d;
                                    e = f >>> (d >>> 0) & r | c << s;
                                    r = c >>> (d >>> 0) & r;
                                    a = 0;
                                    s = f << s;
                                    break
                                }
                                if (!o) {
                                    m = 0;
                                    o = 0;
                                    return (N = m, o) | 0
                                }
                                i[o >> 2] = e | 0;
                                i[o + 4 >> 2] = l | r & 0;
                                m = 0;
                                o = 0;
                                return (N = m, o) | 0
                            }
                            a = u - 1 | 0;
                            if (a & u) {
                                s = (te(u | 0) | 0) + 33 - (te(c | 0) | 0) | 0;
                                S = 64 - s | 0;
                                d = 32 - s | 0;
                                l = d >> 31;
                                E = s - 32 | 0;
                                r = E >> 31;
                                u = s;
                                e = d - 1 >> 31 & c >>> (E >>> 0) | (c << d | f >>> (s >>> 0)) & r;
                                r = r & c >>> (s >>> 0);
                                a = f << S & l;
                                s = (c << S | f >>> (E >>> 0)) & l | f << d & s - 33 >> 31;
                                break
                            }
                            if (o) {
                                i[o >> 2] = a & f;
                                i[o + 4 >> 2] = 0
                            }
                            if ((u | 0) == 1) {
                                E = l | r & 0;
                                S = e | 0 | 0;
                                return (N = E, S) | 0
                            } else {
                                S = Dr(u | 0) | 0;
                                E = c >>> (S >>> 0) | 0;
                                S = c << 32 - S | f >>> (S >>> 0) | 0;
                                return (N = E, S) | 0
                            }
                        } else {
                            if (a) {
                                if (o) {
                                    i[o >> 2] = (c >>> 0) % (u >>> 0);
                                    i[o + 4 >> 2] = 0
                                }
                                E = 0;
                                S = (c >>> 0) / (u >>> 0) >>> 0;
                                return (N = E, S) | 0
                            }
                            if (!f) {
                                if (o) {
                                    i[o >> 2] = 0;
                                    i[o + 4 >> 2] = (c >>> 0) % (s >>> 0)
                                }
                                E = 0;
                                S = (c >>> 0) / (s >>> 0) >>> 0;
                                return (N = E, S) | 0
                            }
                            a = s - 1 | 0;
                            if (!(a & s)) {
                                if (o) {
                                    i[o >> 2] = e | 0;
                                    i[o + 4 >> 2] = a & c | r & 0
                                }
                                E = 0;
                                S = c >>> ((Dr(s | 0) | 0) >>> 0);
                                return (N = E, S) | 0
                            }
                            a = (te(s | 0) | 0) - (te(c | 0) | 0) | 0;
                            if (a >>> 0 <= 30) {
                                r = a + 1 | 0;
                                s = 31 - a | 0;
                                u = r;
                                e = c << s | f >>> (r >>> 0);
                                r = c >>> (r >>> 0);
                                a = 0;
                                s = f << s;
                                break
                            }
                            if (!o) {
                                E = 0;
                                S = 0;
                                return (N = E, S) | 0
                            }
                            i[o >> 2] = e | 0;
                            i[o + 4 >> 2] = l | r & 0;
                            E = 0;
                            S = 0;
                            return (N = E, S) | 0
                        }
                    while (0);
                    if (!u) {
                        c = s;
                        l = 0;
                        s = 0
                    } else {
                        d = n | 0 | 0;
                        f = m | t & 0;
                        c = Rr(d | 0, f | 0, -1, -1) | 0;
                        n = N;
                        l = s;
                        s = 0;
                        do {
                            t = l;
                            l = a >>> 31 | l << 1;
                            a = s | a << 1;
                            t = e << 1 | t >>> 31 | 0;
                            m = e >>> 31 | r << 1 | 0;
                            kr(c, n, t, m) | 0;
                            S = N;
                            E = S >> 31 | ((S | 0) < 0 ? -1 : 0) << 1;
                            s = E & 1;
                            e = kr(t, m, E & d, (((S | 0) < 0 ? -1 : 0) >> 31 | ((S | 0) < 0 ? -1 : 0) << 1) & f) | 0;
                            r = N;
                            u = u - 1 | 0
                        } while ((u | 0) != 0);
                        c = l;
                        l = 0
                    }
                    u = 0;
                    if (o) {
                        i[o >> 2] = e;
                        i[o + 4 >> 2] = r
                    }
                    E = (a | 0) >>> 31 | (c | u) << 1 | (u << 1 | a >>> 31) & 0 | l;
                    S = (a << 1 | 0 >>> 31) & -2 | s;
                    return (N = E, S) | 0
                }

                function Ur(e, r) {
                    e = e | 0;
                    r = r | 0;
                    return Ci[e & 127](r | 0) | 0
                }

                function zr(e) {
                    e = e | 0;
                    return ue(0, e | 0) | 0
                }

                function Yr(e) {
                    e = e | 0;
                    return ue(1, e | 0) | 0
                }

                function jr(e) {
                    e = e | 0;
                    return ue(2, e | 0) | 0
                }

                function Vr(e) {
                    e = e | 0;
                    return ue(3, e | 0) | 0
                }

                function qr(e) {
                    e = e | 0;
                    return ue(4, e | 0) | 0
                }

                function Kr(e) {
                    e = e | 0;
                    return ue(5, e | 0) | 0
                }

                function Wr(e) {
                    e = e | 0;
                    return ue(6, e | 0) | 0
                }

                function Xr(e) {
                    e = e | 0;
                    return ue(7, e | 0) | 0
                }

                function Gr(e) {
                    e = e | 0;
                    return ue(8, e | 0) | 0
                }

                function Jr(e) {
                    e = e | 0;
                    return ue(9, e | 0) | 0
                }

                function Zr(e) {
                    e = e | 0;
                    return ue(10, e | 0) | 0
                }

                function Qr(e) {
                    e = e | 0;
                    return ue(11, e | 0) | 0
                }

                function $r(e) {
                    e = e | 0;
                    return ue(12, e | 0) | 0
                }

                function en(e) {
                    e = e | 0;
                    return ue(13, e | 0) | 0
                }

                function rn(e) {
                    e = e | 0;
                    return ue(14, e | 0) | 0
                }

                function nn(e) {
                    e = e | 0;
                    return ue(15, e | 0) | 0
                }

                function tn(e) {
                    e = e | 0;
                    return ue(16, e | 0) | 0
                }

                function on(e) {
                    e = e | 0;
                    return ue(17, e | 0) | 0
                }

                function an(e) {
                    e = e | 0;
                    return ue(18, e | 0) | 0
                }

                function un(e) {
                    e = e | 0;
                    return ue(19, e | 0) | 0
                }

                function sn(e) {
                    e = e | 0;
                    return ue(20, e | 0) | 0
                }

                function ln(e) {
                    e = e | 0;
                    return ue(21, e | 0) | 0
                }

                function cn(e) {
                    e = e | 0;
                    return ue(22, e | 0) | 0
                }

                function fn(e) {
                    e = e | 0;
                    return ue(23, e | 0) | 0
                }

                function dn(e) {
                    e = e | 0;
                    return ue(24, e | 0) | 0
                }

                function mn(e) {
                    e = e | 0;
                    return ue(25, e | 0) | 0
                }

                function En(e) {
                    e = e | 0;
                    return ue(26, e | 0) | 0
                }

                function Sn(e) {
                    e = e | 0;
                    return ue(27, e | 0) | 0
                }

                function pn(e) {
                    e = e | 0;
                    return ue(28, e | 0) | 0
                }

                function hn(e) {
                    e = e | 0;
                    return ue(29, e | 0) | 0
                }

                function _n(e) {
                    e = e | 0;
                    return ue(30, e | 0) | 0
                }

                function wn(e) {
                    e = e | 0;
                    return ue(31, e | 0) | 0
                }

                function vn(e) {
                    e = e | 0;
                    return ue(32, e | 0) | 0
                }

                function Fn(e) {
                    e = e | 0;
                    return ue(33, e | 0) | 0
                }

                function gn(e) {
                    e = e | 0;
                    return ue(34, e | 0) | 0
                }

                function yn(e) {
                    e = e | 0;
                    return ue(35, e | 0) | 0
                }

                function Mn(e) {
                    e = e | 0;
                    return ue(36, e | 0) | 0
                }

                function An(e) {
                    e = e | 0;
                    return ue(37, e | 0) | 0
                }

                function Rn(e) {
                    e = e | 0;
                    return ue(38, e | 0) | 0
                }

                function On(e) {
                    e = e | 0;
                    return ue(39, e | 0) | 0
                }

                function bn(e) {
                    e = e | 0;
                    return ue(40, e | 0) | 0
                }

                function kn(e) {
                    e = e | 0;
                    return ue(41, e | 0) | 0
                }

                function Tn(e) {
                    e = e | 0;
                    return ue(42, e | 0) | 0
                }

                function Nn(e) {
                    e = e | 0;
                    return ue(43, e | 0) | 0
                }

                function Dn(e) {
                    e = e | 0;
                    return ue(44, e | 0) | 0
                }

                function Pn(e) {
                    e = e | 0;
                    return ue(45, e | 0) | 0
                }

                function Cn(e) {
                    e = e | 0;
                    return ue(46, e | 0) | 0
                }

                function Ln(e) {
                    e = e | 0;
                    return ue(47, e | 0) | 0
                }

                function Bn(e) {
                    e = e | 0;
                    return ue(48, e | 0) | 0
                }

                function In(e) {
                    e = e | 0;
                    return ue(49, e | 0) | 0
                }

                function Hn(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    return Li[e & 127](r | 0, n | 0, t | 0) | 0
                }

                function xn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(0, e | 0, r | 0, n | 0) | 0
                }

                function Un(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(1, e | 0, r | 0, n | 0) | 0
                }

                function zn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(2, e | 0, r | 0, n | 0) | 0
                }

                function Yn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(3, e | 0, r | 0, n | 0) | 0
                }

                function jn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(4, e | 0, r | 0, n | 0) | 0
                }

                function Vn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(5, e | 0, r | 0, n | 0) | 0
                }

                function qn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(6, e | 0, r | 0, n | 0) | 0
                }

                function Kn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(7, e | 0, r | 0, n | 0) | 0
                }

                function Wn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(8, e | 0, r | 0, n | 0) | 0
                }

                function Xn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(9, e | 0, r | 0, n | 0) | 0
                }

                function Gn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(10, e | 0, r | 0, n | 0) | 0
                }

                function Jn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(11, e | 0, r | 0, n | 0) | 0
                }

                function Zn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(12, e | 0, r | 0, n | 0) | 0
                }

                function Qn(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(13, e | 0, r | 0, n | 0) | 0
                }

                function $n(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(14, e | 0, r | 0, n | 0) | 0
                }

                function et(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(15, e | 0, r | 0, n | 0) | 0
                }

                function rt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(16, e | 0, r | 0, n | 0) | 0
                }

                function nt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(17, e | 0, r | 0, n | 0) | 0
                }

                function tt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(18, e | 0, r | 0, n | 0) | 0
                }

                function ot(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(19, e | 0, r | 0, n | 0) | 0
                }

                function it(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(20, e | 0, r | 0, n | 0) | 0
                }

                function at(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(21, e | 0, r | 0, n | 0) | 0
                }

                function ut(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(22, e | 0, r | 0, n | 0) | 0
                }

                function st(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(23, e | 0, r | 0, n | 0) | 0
                }

                function lt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(24, e | 0, r | 0, n | 0) | 0
                }

                function ct(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(25, e | 0, r | 0, n | 0) | 0
                }

                function ft(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(26, e | 0, r | 0, n | 0) | 0
                }

                function dt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(27, e | 0, r | 0, n | 0) | 0
                }

                function mt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(28, e | 0, r | 0, n | 0) | 0
                }

                function Et(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(29, e | 0, r | 0, n | 0) | 0
                }

                function St(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(30, e | 0, r | 0, n | 0) | 0
                }

                function pt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(31, e | 0, r | 0, n | 0) | 0
                }

                function ht(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(32, e | 0, r | 0, n | 0) | 0
                }

                function _t(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(33, e | 0, r | 0, n | 0) | 0;
                }

                function wt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(34, e | 0, r | 0, n | 0) | 0
                }

                function vt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(35, e | 0, r | 0, n | 0) | 0
                }

                function Ft(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(36, e | 0, r | 0, n | 0) | 0
                }

                function gt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(37, e | 0, r | 0, n | 0) | 0
                }

                function yt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(38, e | 0, r | 0, n | 0) | 0
                }

                function Mt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(39, e | 0, r | 0, n | 0) | 0
                }

                function At(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(40, e | 0, r | 0, n | 0) | 0
                }

                function Rt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(41, e | 0, r | 0, n | 0) | 0
                }

                function Ot(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(42, e | 0, r | 0, n | 0) | 0
                }

                function bt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(43, e | 0, r | 0, n | 0) | 0
                }

                function kt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(44, e | 0, r | 0, n | 0) | 0
                }

                function Tt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(45, e | 0, r | 0, n | 0) | 0
                }

                function Nt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(46, e | 0, r | 0, n | 0) | 0
                }

                function Dt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(47, e | 0, r | 0, n | 0) | 0
                }

                function Pt(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(48, e | 0, r | 0, n | 0) | 0
                }

                function Ct(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    return le(49, e | 0, r | 0, n | 0) | 0
                }

                function Lt(e, r, n, t, o) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    o = o | 0;
                    Bi[e & 127](r | 0, n | 0, t | 0, o | 0)
                }

                function Bt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(0, e | 0, r | 0, n | 0, t | 0)
                }

                function It(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(1, e | 0, r | 0, n | 0, t | 0)
                }

                function Ht(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(2, e | 0, r | 0, n | 0, t | 0)
                }

                function xt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(3, e | 0, r | 0, n | 0, t | 0)
                }

                function Ut(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(4, e | 0, r | 0, n | 0, t | 0)
                }

                function zt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(5, e | 0, r | 0, n | 0, t | 0)
                }

                function Yt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(6, e | 0, r | 0, n | 0, t | 0)
                }

                function jt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(7, e | 0, r | 0, n | 0, t | 0)
                }

                function Vt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(8, e | 0, r | 0, n | 0, t | 0)
                }

                function qt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(9, e | 0, r | 0, n | 0, t | 0)
                }

                function Kt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(10, e | 0, r | 0, n | 0, t | 0)
                }

                function Wt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(11, e | 0, r | 0, n | 0, t | 0)
                }

                function Xt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(12, e | 0, r | 0, n | 0, t | 0)
                }

                function Gt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(13, e | 0, r | 0, n | 0, t | 0)
                }

                function Jt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(14, e | 0, r | 0, n | 0, t | 0)
                }

                function Zt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(15, e | 0, r | 0, n | 0, t | 0)
                }

                function Qt(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(16, e | 0, r | 0, n | 0, t | 0)
                }

                function $t(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(17, e | 0, r | 0, n | 0, t | 0)
                }

                function eo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(18, e | 0, r | 0, n | 0, t | 0)
                }

                function ro(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(19, e | 0, r | 0, n | 0, t | 0)
                }

                function no(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(20, e | 0, r | 0, n | 0, t | 0)
                }

                function to(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(21, e | 0, r | 0, n | 0, t | 0)
                }

                function oo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(22, e | 0, r | 0, n | 0, t | 0)
                }

                function io(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(23, e | 0, r | 0, n | 0, t | 0)
                }

                function ao(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(24, e | 0, r | 0, n | 0, t | 0)
                }

                function uo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(25, e | 0, r | 0, n | 0, t | 0)
                }

                function so(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(26, e | 0, r | 0, n | 0, t | 0)
                }

                function lo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(27, e | 0, r | 0, n | 0, t | 0)
                }

                function co(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(28, e | 0, r | 0, n | 0, t | 0)
                }

                function fo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(29, e | 0, r | 0, n | 0, t | 0)
                }

                function mo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(30, e | 0, r | 0, n | 0, t | 0)
                }

                function Eo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(31, e | 0, r | 0, n | 0, t | 0)
                }

                function So(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(32, e | 0, r | 0, n | 0, t | 0)
                }

                function po(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(33, e | 0, r | 0, n | 0, t | 0)
                }

                function ho(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(34, e | 0, r | 0, n | 0, t | 0)
                }

                function _o(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(35, e | 0, r | 0, n | 0, t | 0)
                }

                function wo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(36, e | 0, r | 0, n | 0, t | 0)
                }

                function vo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(37, e | 0, r | 0, n | 0, t | 0)
                }

                function Fo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(38, e | 0, r | 0, n | 0, t | 0)
                }

                function go(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(39, e | 0, r | 0, n | 0, t | 0)
                }

                function yo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(40, e | 0, r | 0, n | 0, t | 0)
                }

                function Mo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(41, e | 0, r | 0, n | 0, t | 0)
                }

                function Ao(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(42, e | 0, r | 0, n | 0, t | 0)
                }

                function Ro(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(43, e | 0, r | 0, n | 0, t | 0)
                }

                function Oo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(44, e | 0, r | 0, n | 0, t | 0)
                }

                function bo(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(45, e | 0, r | 0, n | 0, t | 0)
                }

                function ko(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(46, e | 0, r | 0, n | 0, t | 0)
                }

                function To(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(47, e | 0, r | 0, n | 0, t | 0)
                }

                function No(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(48, e | 0, r | 0, n | 0, t | 0)
                }

                function Do(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    fe(49, e | 0, r | 0, n | 0, t | 0)
                }

                function Po(e, r) {
                    e = e | 0;
                    r = r | 0;
                    Ii[e & 127](r | 0)
                }

                function Co(e) {
                    e = e | 0;
                    me(0, e | 0)
                }

                function Lo(e) {
                    e = e | 0;
                    me(1, e | 0)
                }

                function Bo(e) {
                    e = e | 0;
                    me(2, e | 0)
                }

                function Io(e) {
                    e = e | 0;
                    me(3, e | 0)
                }

                function Ho(e) {
                    e = e | 0;
                    me(4, e | 0)
                }

                function xo(e) {
                    e = e | 0;
                    me(5, e | 0)
                }

                function Uo(e) {
                    e = e | 0;
                    me(6, e | 0)
                }

                function zo(e) {
                    e = e | 0;
                    me(7, e | 0)
                }

                function Yo(e) {
                    e = e | 0;
                    me(8, e | 0)
                }

                function jo(e) {
                    e = e | 0;
                    me(9, e | 0)
                }

                function Vo(e) {
                    e = e | 0;
                    me(10, e | 0)
                }

                function qo(e) {
                    e = e | 0;
                    me(11, e | 0)
                }

                function Ko(e) {
                    e = e | 0;
                    me(12, e | 0)
                }

                function Wo(e) {
                    e = e | 0;
                    me(13, e | 0)
                }

                function Xo(e) {
                    e = e | 0;
                    me(14, e | 0)
                }

                function Go(e) {
                    e = e | 0;
                    me(15, e | 0)
                }

                function Jo(e) {
                    e = e | 0;
                    me(16, e | 0)
                }

                function Zo(e) {
                    e = e | 0;
                    me(17, e | 0)
                }

                function Qo(e) {
                    e = e | 0;
                    me(18, e | 0)
                }

                function $o(e) {
                    e = e | 0;
                    me(19, e | 0)
                }

                function ei(e) {
                    e = e | 0;
                    me(20, e | 0)
                }

                function ri(e) {
                    e = e | 0;
                    me(21, e | 0)
                }

                function ni(e) {
                    e = e | 0;
                    me(22, e | 0)
                }

                function ti(e) {
                    e = e | 0;
                    me(23, e | 0)
                }

                function oi(e) {
                    e = e | 0;
                    me(24, e | 0)
                }

                function ii(e) {
                    e = e | 0;
                    me(25, e | 0)
                }

                function ai(e) {
                    e = e | 0;
                    me(26, e | 0)
                }

                function ui(e) {
                    e = e | 0;
                    me(27, e | 0)
                }

                function si(e) {
                    e = e | 0;
                    me(28, e | 0)
                }

                function li(e) {
                    e = e | 0;
                    me(29, e | 0)
                }

                function ci(e) {
                    e = e | 0;
                    me(30, e | 0)
                }

                function fi(e) {
                    e = e | 0;
                    me(31, e | 0)
                }

                function di(e) {
                    e = e | 0;
                    me(32, e | 0)
                }

                function mi(e) {
                    e = e | 0;
                    me(33, e | 0)
                }

                function Ei(e) {
                    e = e | 0;
                    me(34, e | 0)
                }

                function Si(e) {
                    e = e | 0;
                    me(35, e | 0)
                }

                function pi(e) {
                    e = e | 0;
                    me(36, e | 0)
                }

                function hi(e) {
                    e = e | 0;
                    me(37, e | 0)
                }

                function _i(e) {
                    e = e | 0;
                    me(38, e | 0)
                }

                function wi(e) {
                    e = e | 0;
                    me(39, e | 0)
                }

                function vi(e) {
                    e = e | 0;
                    me(40, e | 0)
                }

                function Fi(e) {
                    e = e | 0;
                    me(41, e | 0)
                }

                function gi(e) {
                    e = e | 0;
                    me(42, e | 0)
                }

                function yi(e) {
                    e = e | 0;
                    me(43, e | 0)
                }

                function Mi(e) {
                    e = e | 0;
                    me(44, e | 0)
                }

                function Ai(e) {
                    e = e | 0;
                    me(45, e | 0)
                }

                function Ri(e) {
                    e = e | 0;
                    me(46, e | 0)
                }

                function Oi(e) {
                    e = e | 0;
                    me(47, e | 0)
                }

                function bi(e) {
                    e = e | 0;
                    me(48, e | 0)
                }

                function ki(e) {
                    e = e | 0;
                    me(49, e | 0)
                }

                function Ti(e) {
                    e = e | 0;
                    oe(0);
                    return 0
                }

                function Ni(e, r, n) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    oe(1);
                    return 0
                }

                function Di(e, r, n, t) {
                    e = e | 0;
                    r = r | 0;
                    n = n | 0;
                    t = t | 0;
                    oe(2)
                }

                function Pi(e) {
                    e = e | 0;
                    oe(3)
                }
                var Ci = [Ti, Ti, zr, Ti, Yr, Ti, jr, Ti, Vr, Ti, qr, Ti, Kr, Ti, Wr, Ti, Xr, Ti, Gr, Ti, Jr, Ti, Zr, Ti, Qr, Ti, $r, Ti, en, Ti, rn, Ti, nn, Ti, tn, Ti, on, Ti, an, Ti, un, Ti, sn, Ti, ln, Ti, cn, Ti, fn, Ti, dn, Ti, mn, Ti, En, Ti, Sn, Ti, pn, Ti, hn, Ti, _n, Ti, wn, Ti, vn, Ti, Fn, Ti, gn, Ti, yn, Ti, Mn, Ti, An, Ti, Rn, Ti, On, Ti, bn, Ti, kn, Ti, Tn, Ti, Nn, Ti, Dn, Ti, Pn, Ti, Cn, Ti, Ln, Ti, Bn, Ti, In, Ti, cr, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti, Ti];
                var Li = [Ni, Ni, xn, Ni, Un, Ni, zn, Ni, Yn, Ni, jn, Ni, Vn, Ni, qn, Ni, Kn, Ni, Wn, Ni, Xn, Ni, Gn, Ni, Jn, Ni, Zn, Ni, Qn, Ni, $n, Ni, et, Ni, rt, Ni, nt, Ni, tt, Ni, ot, Ni, it, Ni, at, Ni, ut, Ni, st, Ni, lt, Ni, ct, Ni, ft, Ni, dt, Ni, mt, Ni, Et, Ni, St, Ni, pt, Ni, ht, Ni, _t, Ni, wt, Ni, vt, Ni, Ft, Ni, gt, Ni, yt, Ni, Mt, Ni, At, Ni, Rt, Ni, Ot, Ni, bt, Ni, kt, Ni, Tt, Ni, Nt, Ni, Dt, Ni, Pt, Ni, Ct, Ni, ar, ur, fr, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni, Ni];
                var Bi = [Di, Di, Bt, Di, It, Di, Ht, Di, xt, Di, Ut, Di, zt, Di, Yt, Di, jt, Di, Vt, Di, qt, Di, Kt, Di, Wt, Di, Xt, Di, Gt, Di, Jt, Di, Zt, Di, Qt, Di, $t, Di, eo, Di, ro, Di, no, Di, to, Di, oo, Di, io, Di, ao, Di, uo, Di, so, Di, lo, Di, co, Di, fo, Di, mo, Di, Eo, Di, So, Di, po, Di, ho, Di, _o, Di, wo, Di, vo, Di, Fo, Di, go, Di, yo, Di, Mo, Di, Ao, Di, Ro, Di, Oo, Di, bo, Di, ko, Di, To, Di, No, Di, Do, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di, Di];
                var Ii = [Pi, Pi, Co, Pi, Lo, Pi, Bo, Pi, Io, Pi, Ho, Pi, xo, Pi, Uo, Pi, zo, Pi, Yo, Pi, jo, Pi, Vo, Pi, qo, Pi, Ko, Pi, Wo, Pi, Xo, Pi, Go, Pi, Jo, Pi, Zo, Pi, Qo, Pi, $o, Pi, ei, Pi, ri, Pi, ni, Pi, ti, Pi, oi, Pi, ii, Pi, ai, Pi, ui, Pi, si, Pi, li, Pi, ci, Pi, fi, Pi, di, Pi, mi, Pi, Ei, Pi, Si, Pi, pi, Pi, hi, Pi, _i, Pi, wi, Pi, vi, Pi, Fi, Pi, gi, Pi, yi, Pi, Mi, Pi, Ai, Pi, Ri, Pi, Oi, Pi, bi, Pi, ki, Pi, pr, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi, Pi];
                return {
                    _fflush: ir,
                    _AVOggDestroy: tr,
                    _AVOggInit: rr,
                    _i64Add: Rr,
                    _AVOggRead: nr,
                    _memset: Mr,
                    _malloc: hr,
                    _memcpy: Or,
                    _memmove: br,
                    _free: _r,
                    ___errno_location: dr,
                    _bitshift64Shl: Ar,
                    runPostSets: yr,
                    stackAlloc: Pe,
                    stackSave: Ce,
                    stackRestore: Le,
                    establishStackSpace: Be,
                    setThrew: Ie,
                    setTempRet0: Ue,
                    getTempRet0: ze,
                    dynCall_ii: Ur,
                    dynCall_iiii: Hn,
                    dynCall_viiii: Lt,
                    dynCall_vi: Po
                }
            }(Module.asmGlobalArg, Module.asmLibraryArg, buffer),
            _fflush = Module._fflush = asm._fflush,
            runPostSets = Module.runPostSets = asm.runPostSets,
            _AVOggDestroy = Module._AVOggDestroy = asm._AVOggDestroy,
            _AVOggInit = Module._AVOggInit = asm._AVOggInit,
            _i64Add = Module._i64Add = asm._i64Add,
            _AVOggRead = Module._AVOggRead = asm._AVOggRead,
            _memset = Module._memset = asm._memset,
            _malloc = Module._malloc = asm._malloc,
            _memcpy = Module._memcpy = asm._memcpy,
            _memmove = Module._memmove = asm._memmove,
            _free = Module._free = asm._free,
            ___errno_location = Module.___errno_location = asm.___errno_location,
            _bitshift64Shl = Module._bitshift64Shl = asm._bitshift64Shl,
            dynCall_ii = Module.dynCall_ii = asm.dynCall_ii,
            dynCall_iiii = Module.dynCall_iiii = asm.dynCall_iiii,
            dynCall_viiii = Module.dynCall_viiii = asm.dynCall_viiii,
            dynCall_vi = Module.dynCall_vi = asm.dynCall_vi;
        Runtime.stackAlloc = asm.stackAlloc, Runtime.stackSave = asm.stackSave, Runtime.stackRestore = asm.stackRestore, Runtime.establishStackSpace = asm.establishStackSpace, Runtime.setTempRet0 = asm.setTempRet0, Runtime.getTempRet0 = asm.getTempRet0, ExitStatus.prototype = new Error, ExitStatus.prototype.constructor = ExitStatus;
        var initialStackTop, preloadStartTime = null,
            calledMain = !1;
        dependenciesFulfilled = function e() {
            Module.calledRun || run(), Module.calledRun || (dependenciesFulfilled = e)
        }, Module.callMain = Module.callMain = function (e) {
            function r() {
                for (var e = 0; e < 3; e++) t.push(0)
            }
            assert(0 == runDependencies, "cannot call main when async dependencies remain! (listen on __ATMAIN__)"), assert(0 == __ATPRERUN__.length, "cannot call main when preRun functions remain to be called"), e = e || [], ensureInitRuntime();
            var n = e.length + 1,
                t = [allocate(intArrayFromString(Module.thisProgram), "i8", ALLOC_NORMAL)];
            r();
            for (var o = 0; o < n - 1; o += 1) t.push(allocate(intArrayFromString(e[o]), "i8", ALLOC_NORMAL)), r();
            t.push(0), t = allocate(t, "i32", ALLOC_NORMAL);
            try {
                var i = Module._main(n, t, 0);
                exit(i, !0)
            } catch (a) {
                if (a instanceof ExitStatus) return;
                if ("SimulateInfiniteLoop" == a) return void(Module.noExitRuntime = !0);
                throw a && "object" == typeof a && a.stack && Module.printErr("exception thrown: " + [a, a.stack]), a
            } finally {
                calledMain = !0
            }
        }, Module.run = Module.run = run, Module.exit = Module.exit = exit;
        var abortDecorators = [];
        if (Module.abort = Module.abort = abort, Module.preInit)
            for ("function" == typeof Module.preInit && (Module.preInit = [Module.preInit]); Module.preInit.length > 0;) Module.preInit.pop()();
        var shouldRunNow = !0;
        Module.noInitialRun && (shouldRunNow = !1), run(), module.exports = Module
    }, {}],
    2: [function (e, r, n) {
        (function (n) {
            var t = "undefined" != typeof window ? window.AV : "undefined" != typeof n ? n.AV : null,
                o = e("../build/libogg"),
                i = t.Demuxer.extend(function () {
                    t.Demuxer.register(this), this.probe = function (e) {
                        return "OggS" === e.peekString(0, 4)
                    }, this.plugins = [];
                    var e = 8192;
                    this.prototype.init = function () {
                        this.ogg = o._AVOggInit(), this.buf = o._malloc(e);
                        var r = this,
                            n = null,
                            t = !1;
                        this._stream = this.stream, this.callback = o.Runtime.addFunction(function (e, a, u, s) {
                            var l = new Uint8Array(o.HEAPU8.subarray(e, e + a));
                            if (!n) {
                                for (var c = 0; c < i.plugins.length; c++) {
                                    var f = i.plugins[c],
                                        d = l.subarray(0, f.magic.length);
                                    if (String.fromCharCode.apply(String, d) === f.magic) {
                                        n = f;
                                        break
                                    }
                                }
                                if (!n) throw new Error("Unknown format in Ogg file.");
                                n.init && n.init.call(r)
                            }
                            t ? n.readPacket.call(r, l, u, s) : t = n.readHeaders.call(r, l)
                        })
                    }, this.prototype.readChunk = function () {
                        for (var r;
                            (r = this._stream.remainingBytes()) > 0;) {
                            var n = e <= r ? e : r;
                            o.HEAPU8.set(this._stream.readBuffer(n).data, this.buf), o._AVOggRead(this.ogg, this.buf, n, this.callback)
                        }
                    }, this.prototype.destroy = function () {
                        this._super(), o.Runtime.removeFunction(this.callback), o._AVOggDestroy(this.ogg), o._free(this.buf), this.ogg = null, this.buf = null, this.callback = null
                    }
                });
            r.exports = i, t.OggDemuxer = i
        }).call(this, "undefined" != typeof self ? self : "undefined" != typeof window ? window : {})
    }, {
        "../build/libogg": 1
    }]
}, {}, [2]);