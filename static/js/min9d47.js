! function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : "object" == typeof exports ? module.exports = t(require("jquery")) : t(jQuery)
}(function (t) {
    var e = "waitForImages";
    t.waitForImages = {
        hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
        hasImageAttributes: ["srcset"]
    }, t.expr[":"]["has-src"] = function (e) {
        return t(e).is('img[src][src!=""]')
    }, t.expr[":"].uncached = function (e) {
        return !!t(e).is(":has-src") && !e.complete
    }, t.fn.waitForImages = function () {
        var i, s, n, o = 0,
            a = 0,
            r = t.Deferred();
        if (t.isPlainObject(arguments[0]) ? (n = arguments[0].waitForAll, s = arguments[0].each, i = arguments[0].finished) : 1 === arguments.length && "boolean" === t.type(arguments[0]) ? n = arguments[0] : (i = arguments[0], s = arguments[1], n = arguments[2]), i = i || t.noop, s = s || t.noop, n = !!n, !t.isFunction(i) || !t.isFunction(s)) throw new TypeError("An invalid callback was supplied.");
        return this.each(function () {
            var l = t(this),
                c = [],
                d = t.waitForImages.hasImageProperties || [],
                u = t.waitForImages.hasImageAttributes || [],
                h = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
            n ? l.find("*").addBack().each(function () {
                var e = t(this);
                e.is("img:has-src") && !e.is("[srcset]") && c.push({
                    src: e.attr("src"),
                    element: e[0]
                }), t.each(d, function (t, i) {
                    var s, n = e.css(i);
                    if (!n) return !0;
                    for (; s = h.exec(n);) c.push({
                        src: s[2],
                        element: e[0]
                    })
                }), t.each(u, function (t, i) {
                    return !e.attr(i) || void c.push({
                        src: e.attr("src"),
                        srcset: e.attr("srcset"),
                        element: e[0]
                    })
                })
            }) : l.find("img:has-src").each(function () {
                c.push({
                    src: this.src,
                    element: this
                })
            }), o = c.length, a = 0, 0 === o && (i.call(l[0]), r.resolveWith(l[0])), t.each(c, function (n, c) {
                var d = new Image,
                    u = "load." + e + " error." + e;
                t(d).one(u, function e(n) {
                    var d = [a, o, "load" == n.type];
                    return a++, s.apply(c.element, d), r.notifyWith(c.element, d), t(this).off(u, e), a == o ? (i.call(l[0]), r.resolveWith(l[0]), !1) : void 0
                }), c.srcset && (d.srcset = c.srcset), d.src = c.src
            })
        }), r.promise()
    }
}),
function () {
    "use strict";
    var t = function () {
        this.called = !1, this.callonce = !0, this.compat()
    };
    t.prototype.init = function (t, e) {
        this.retina = window.devicePixelRatio > 1, this.elements = [], this.callback = "function" == typeof e ? e : function () {}, this.curwidth = this.getWidth();
        for (var i = this.gather(t), s = 0, n = i.length; n > s; s++) this.parse(i[s]);
        this.set(), this.resize()
    }, t.prototype.compat = function () {
        var t = document;
        "function" != typeof t.getElementsByClassName && (t.getElementsByClassName = function (e) {
            return t.querySelectorAll("." + e)
        }), String.prototype.trim || (String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "")
        }), t.addEventListener || (this.addEvent = function (t, e, i) {
            t.attachEvent("on" + e, function (t) {
                i(t || window.event)
            })
        })
    }, t.prototype.gather = function (t) {
        var e = t,
            i = e.nodeType ? "Object" : Object.prototype.toString.call(e).replace(/^\[object |\]$/g, ""),
            s = "parse" + i;
        return ["HTMLCollection", "NodeList"].indexOf(i) > -1 ? e : this[s] ? this[s](e) : []
    }, t.prototype.parseObject = function (t) {
        return t.nodeType ? [t] : []
    }, t.prototype.parseArray = function (t) {
        return t
    }, t.prototype.parseString = function (t) {
        var e = document,
            i = t.trim(),
            s = i[0],
            n = [];
        switch (!0) {
            case "." === s:
                n = e.getElementsByClassName(i.substring(1));
                break;
            case "#" === s:
                n.push(e.getElementById(i.substring(1)));
                break;
            case /^[a-zA-Z]+$/.test(i):
                n = e.getElementsByTagName(i);
                break;
            default:
                n = []
        }
        return n
    }, t.prototype.parse = function (t) {
        var e = t.getAttribute("data-bg-srcset");
        if (null === e) return !1;
        this.elements.push({});
        var i = e.split(","),
            s = this.elements[this.elements.length - 1];
        s.node = t, s.srcset = [];
        for (var n = 0, o = i.length; o > n; n++) {
            s.srcset.push({});
            for (var a, r, l, c = i[n].trim().split(" "), d = 0, u = c.length; u > d; d++) {
                switch (a = c[d], r = s.srcset[n], l = a.length - 1, !0) {
                    case "" === a.trim():
                        continue;
                    case "w" !== a[l] && "x" !== a[a.length - 1]:
                        r.src = a;
                        break;
                    case "w" === a[l]:
                        r.width = parseInt(a.slice(0, -1));
                        break;
                    case "x" === a[l]:
                        r.retina = parseInt(a.slice(0, -1)) > 1
                }
                r.width || (r.width = Number.POSITIVE_INFINITY), r.retina || (r.retina = !1)
            }
        }
    }, t.prototype.set = function () {
        for (var t = 0, e = this.elements.length; e > t; t++) this.setSingle(t)
    }, t.prototype.setSingle = function (t) {
        var e, i = this.elements[t],
            s = [],
            n = 0,
            o = this;
        e = i.node.clientWidth * (this.retina ? 2 : 1), i.srcset = i.srcset.sort(function (t) {
            var e = 1;
            return "-" === t[0] && (e = -1, t = t.substr(1)),
                function (i, s) {
                    return (i[t] < s[t] ? -1 : i[t] > s[t] ? 1 : 0) * e
                }
        }("width"));
        for (var a = 0, r = i.srcset.length; r > a; a++) i.srcset[a].width < e || s.push(i.srcset[a]);
        if (0 === s.length && s.push(i.srcset[i.srcset.length - 1]), n = s[0], s.length > 1 && s[0].width === s[1].width && (n = s[0].retina !== this.retina ? s[1] : s[0]), void 0 !== n.src && "null" !== n.src) {
            var l = new Image,
                c = !1;
            l.onload = l.onreadystatechange = function () {
                c || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (c = !0, i.node.style.backgroundImage = "url('" + n.src + "')", o.called || (o.callback(i), o.called = o.callonce))
            }, l.src = n.src
        } else i.node.style.backgroundImage = ""
    }, t.prototype.resize = function () {
        var t = this,
            e = setTimeout(function () {}, 0);
        this.addEvent(window, "resize", function () {
            clearTimeout(e), e = setTimeout(function () {
                var e = t.getWidth();
                e !== t.curwidth && (t.curwidth = e, t.retina = window.devicePixelRatio > 1, t.set())
            }, 250)
        })
    }, t.prototype.addEvent = function (t, e, i) {
        t.addEventListener(e, i, !1)
    }, t.prototype.getWidth = function () {
        var t, e, i, s;
        return t = window, i = (e = document).documentElement, s = e.getElementsByTagName("body")[0], t.innerWidth || i.clientWidth || s.clientWidth
    }, window.bgsrcset = t
}(),
function (t, e) {
    var i = function (t, e) {
        "use strict";
        if (e.getElementsByClassName) {
            var i, s, n = e.documentElement,
                o = t.Date,
                a = t.HTMLPictureElement,
                r = "addEventListener",
                l = "getAttribute",
                c = t[r],
                d = t.setTimeout,
                u = t.requestAnimationFrame || d,
                h = t.requestIdleCallback,
                p = /^picture$/i,
                m = ["load", "error", "lazyincluded", "_lazyloaded"],
                f = {},
                g = Array.prototype.forEach,
                v = function (t, e) {
                    return f[e] || (f[e] = new RegExp("(\\s|^)" + e + "(\\s|$)")), f[e].test(t[l]("class") || "") && f[e]
                },
                _ = function (t, e) {
                    v(t, e) || t.setAttribute("class", (t[l]("class") || "").trim() + " " + e)
                },
                y = function (t, e) {
                    var i;
                    (i = v(t, e)) && t.setAttribute("class", (t[l]("class") || "").replace(i, " "))
                },
                w = function (t, e, i) {
                    var s = i ? r : "removeEventListener";
                    i && w(t, e), m.forEach(function (i) {
                        t[s](i, e)
                    })
                },
                b = function (t, s, n, o, a) {
                    var r = e.createEvent("Event");
                    return n || (n = {}), n.instance = i, r.initEvent(s, !o, !a), r.detail = n, t.dispatchEvent(r), r
                },
                C = function (e, i) {
                    var n;
                    !a && (n = t.picturefill || s.pf) ? (i && i.src && !e[l]("srcset") && e.setAttribute("srcset", i.src), n({
                        reevaluate: !0,
                        elements: [e]
                    })) : i && i.src && (e.src = i.src)
                },
                k = function (t, e) {
                    return (getComputedStyle(t, null) || {})[e]
                },
                x = function (t, e, i) {
                    for (i = i || t.offsetWidth; i < s.minSize && e && !t._lazysizesWidth;) i = e.offsetWidth, e = e.parentNode;
                    return i
                },
                z = function () {
                    var t, i, s = [],
                        n = [],
                        o = s,
                        a = function () {
                            var e = o;
                            for (o = s.length ? n : s, t = !0, i = !1; e.length;) e.shift()();
                            t = !1
                        },
                        r = function (s, n) {
                            t && !n ? s.apply(this, arguments) : (o.push(s), i || (i = !0, (e.hidden ? d : u)(a)))
                        };
                    return r._lsFlush = a, r
                }(),
                T = function (t, e) {
                    return e ? function () {
                        z(t)
                    } : function () {
                        var e = this,
                            i = arguments;
                        z(function () {
                            t.apply(e, i)
                        })
                    }
                },
                E = function (t) {
                    var e, i = 0,
                        n = s.throttleDelay,
                        a = s.ricTimeout,
                        r = function () {
                            e = !1, i = o.now(), t()
                        },
                        l = h && a > 49 ? function () {
                            h(r, {
                                timeout: a
                            }), a !== s.ricTimeout && (a = s.ricTimeout)
                        } : T(function () {
                            d(r)
                        }, !0);
                    return function (t) {
                        var s;
                        (t = !0 === t) && (a = 33), e || (e = !0, (s = n - (o.now() - i)) < 0 && (s = 0), t || s < 9 ? l() : d(l, s))
                    }
                },
                S = function (t) {
                    var e, i, s = function () {
                            e = null, t()
                        },
                        n = function () {
                            var t = o.now() - i;
                            t < 99 ? d(n, 99 - t) : (h || s)(s)
                        };
                    return function () {
                        i = o.now(), e || (e = d(n, 99))
                    }
                };
            ! function () {
                var e, i = {
                    lazyClass: "lazyload",
                    loadedClass: "lazyloaded",
                    loadingClass: "lazyloading",
                    preloadClass: "lazypreload",
                    errorClass: "lazyerror",
                    autosizesClass: "lazyautosizes",
                    srcAttr: "data-src",
                    srcsetAttr: "data-srcset",
                    sizesAttr: "data-sizes",
                    minSize: 40,
                    customMedia: {},
                    init: !0,
                    expFactor: 1.5,
                    hFac: .8,
                    loadMode: 2,
                    loadHidden: !0,
                    ricTimeout: 0,
                    throttleDelay: 125
                };
                for (e in s = t.lazySizesConfig || t.lazysizesConfig || {}, i) e in s || (s[e] = i[e]);
                t.lazySizesConfig = s, d(function () {
                    s.init && O()
                })
            }();
            var I = function () {
                    var a, u, h, m, f, x, I, O, j, A, M, $, L, B, N = /^img$/i,
                        H = /^iframe$/i,
                        W = "onscroll" in t && !/(gle|ing)bot/.test(navigator.userAgent),
                        D = 0,
                        F = 0,
                        q = -1,
                        R = function (t) {
                            F--, t && t.target && w(t.target, R), (!t || F < 0 || !t.target) && (F = 0)
                        },
                        V = function (t, i) {
                            var s, o = t,
                                a = "hidden" == k(e.body, "visibility") || "hidden" != k(t.parentNode, "visibility") && "hidden" != k(t, "visibility");
                            for (O -= i, M += i, j -= i, A += i; a && (o = o.offsetParent) && o != e.body && o != n;)(a = (k(o, "opacity") || 1) > 0) && "visible" != k(o, "overflow") && (s = o.getBoundingClientRect(), a = A > s.left && j < s.right && M > s.top - 1 && O < s.bottom + 1);
                            return a
                        },
                        U = function () {
                            var t, o, r, c, d, h, p, f, g, v = i.elements;
                            if ((m = s.loadMode) && F < 8 && (t = v.length)) {
                                o = 0, q++, null == L && ("expand" in s || (s.expand = n.clientHeight > 500 && n.clientWidth > 500 ? 500 : 370), $ = s.expand, L = $ * s.expFactor), D < L && F < 1 && q > 2 && m > 2 && !e.hidden ? (D = L, q = 0) : D = m > 1 && q > 1 && F < 6 ? $ : 0;
                                for (; o < t; o++)
                                    if (v[o] && !v[o]._lazyRace)
                                        if (W)
                                            if ((f = v[o][l]("data-expand")) && (h = 1 * f) || (h = D), g !== h && (x = innerWidth + h * B, I = innerHeight + h, p = -1 * h, g = h), r = v[o].getBoundingClientRect(), (M = r.bottom) >= p && (O = r.top) <= I && (A = r.right) >= p * B && (j = r.left) <= x && (M || A || j || O) && (s.loadHidden || "hidden" != k(v[o], "visibility")) && (u && F < 3 && !f && (m < 3 || q < 4) || V(v[o], h))) {
                                                if (X(v[o]), d = !0, F > 9) break
                                            } else !d && u && !c && F < 4 && q < 4 && m > 2 && (a[0] || s.preloadAfterLoad) && (a[0] || !f && (M || A || j || O || "auto" != v[o][l](s.sizesAttr))) && (c = a[0] || v[o]);
                                else X(v[o]);
                                c && !d && X(c)
                            }
                        },
                        Z = E(U),
                        Q = function (t) {
                            _(t.target, s.loadedClass), y(t.target, s.loadingClass), w(t.target, K), b(t.target, "lazyloaded")
                        },
                        Y = T(Q),
                        K = function (t) {
                            Y({
                                target: t.target
                            })
                        },
                        G = function (t) {
                            var e, i = t[l](s.srcsetAttr);
                            (e = s.customMedia[t[l]("data-media") || t[l]("media")]) && t.setAttribute("media", e), i && t.setAttribute("srcset", i)
                        },
                        J = T(function (t, e, i, n, o) {
                            var a, r, c, u, m, f;
                            (m = b(t, "lazybeforeunveil", e)).defaultPrevented || (n && (i ? _(t, s.autosizesClass) : t.setAttribute("sizes", n)), r = t[l](s.srcsetAttr), a = t[l](s.srcAttr), o && (c = t.parentNode, u = c && p.test(c.nodeName || "")), f = e.firesLoad || "src" in t && (r || a || u), m = {
                                target: t
                            }, f && (w(t, R, !0), clearTimeout(h), h = d(R, 2500), _(t, s.loadingClass), w(t, K, !0)), u && g.call(c.getElementsByTagName("source"), G), r ? t.setAttribute("srcset", r) : a && !u && (H.test(t.nodeName) ? function (t, e) {
                                try {
                                    t.contentWindow.location.replace(e)
                                } catch (i) {
                                    t.src = e
                                }
                            }(t, a) : t.src = a), o && (r || u) && C(t, {
                                src: a
                            })), t._lazyRace && delete t._lazyRace, y(t, s.lazyClass), z(function () {
                                (!f || t.complete && t.naturalWidth > 1) && (f ? R(m) : F--, Q(m))
                            }, !0)
                        }),
                        X = function (t) {
                            var e, i = N.test(t.nodeName),
                                n = i && (t[l](s.sizesAttr) || t[l]("sizes")),
                                o = "auto" == n;
                            (!o && u || !i || !t[l]("src") && !t.srcset || t.complete || v(t, s.errorClass) || !v(t, s.lazyClass)) && (e = b(t, "lazyunveilread").detail, o && P.updateElem(t, !0, t.offsetWidth), t._lazyRace = !0, F++, J(t, e, o, n, i))
                        },
                        tt = function () {
                            if (!u) {
                                if (o.now() - f < 999) return void d(tt, 999);
                                var t = S(function () {
                                    s.loadMode = 3, Z()
                                });
                                u = !0, s.loadMode = 3, Z(), c("scroll", function () {
                                    3 == s.loadMode && (s.loadMode = 2), t()
                                }, !0)
                            }
                        };
                    return {
                        _: function () {
                            f = o.now(), i.elements = e.getElementsByClassName(s.lazyClass), a = e.getElementsByClassName(s.lazyClass + " " + s.preloadClass), B = s.hFac, c("scroll", Z, !0), c("resize", Z, !0), t.MutationObserver ? new MutationObserver(Z).observe(n, {
                                childList: !0,
                                subtree: !0,
                                attributes: !0
                            }) : (n[r]("DOMNodeInserted", Z, !0), n[r]("DOMAttrModified", Z, !0), setInterval(Z, 999)), c("hashchange", Z, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (t) {
                                e[r](t, Z, !0)
                            }), /d$|^c/.test(e.readyState) ? tt() : (c("load", tt), e[r]("DOMContentLoaded", Z), d(tt, 2e4)), i.elements.length ? (U(), z._lsFlush()) : Z()
                        },
                        checkElems: Z,
                        unveil: X
                    }
                }(),
                P = function () {
                    var t, i = T(function (t, e, i, s) {
                            var n, o, a;
                            if (t._lazysizesWidth = s, s += "px", t.setAttribute("sizes", s), p.test(e.nodeName || ""))
                                for (n = e.getElementsByTagName("source"), o = 0, a = n.length; o < a; o++) n[o].setAttribute("sizes", s);
                            i.detail.dataAttr || C(t, i.detail)
                        }),
                        n = function (t, e, s) {
                            var n, o = t.parentNode;
                            o && (s = x(t, o, s), (n = b(t, "lazybeforesizes", {
                                width: s,
                                dataAttr: !!e
                            })).defaultPrevented || (s = n.detail.width) && s !== t._lazysizesWidth && i(t, o, n, s))
                        },
                        o = S(function () {
                            var e, i = t.length;
                            if (i)
                                for (e = 0; e < i; e++) n(t[e])
                        });
                    return {
                        _: function () {
                            t = e.getElementsByClassName(s.autosizesClass), c("resize", o)
                        },
                        checkElems: o,
                        updateElem: n
                    }
                }(),
                O = function () {
                    O.i || (O.i = !0, P._(), I._())
                };
            return i = {
                cfg: s,
                autoSizer: P,
                loader: I,
                init: O,
                uP: C,
                aC: _,
                rC: y,
                hC: v,
                fire: b,
                gW: x,
                rAF: z
            }
        }
    }(t, t.document);
    t.lazySizes = i, "object" == typeof module && module.exports && (module.exports = i)
}(window),
function (t, e) {
    var i = function () {
        e(t.lazySizes), t.removeEventListener("lazyunveilread", i, !0)
    };
    e = e.bind(null, t, t.document), "object" == typeof module && module.exports ? e(require("lazysizes")) : t.lazySizes ? i() : t.addEventListener("lazyunveilread", i, !0)
}(window, function (t, e, i) {
    "use strict";
    if (t.addEventListener) {
        var s = /\s+/g,
            n = /\s*\|\s+|\s+\|\s*/g,
            o = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
            a = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
            r = /\(|\)|'/,
            l = {
                contain: 1,
                cover: 1
            },
            c = function (t, e) {
                if (e) {
                    var i = e.match(a);
                    i && i[1] ? t.setAttribute("type", i[1]) : t.setAttribute("media", lazySizesConfig.customMedia[e] || e)
                }
            },
            d = function (t, i, a) {
                var r = e.createElement("picture"),
                    l = i.getAttribute(lazySizesConfig.sizesAttr),
                    d = i.getAttribute("data-ratio"),
                    u = i.getAttribute("data-optimumx");
                i._lazybgset && i._lazybgset.parentNode == i && i.removeChild(i._lazybgset), Object.defineProperty(a, "_lazybgset", {
                    value: i,
                    writable: !0
                }), Object.defineProperty(i, "_lazybgset", {
                    value: r,
                    writable: !0
                }), t = t.replace(s, " ").split(n), r.style.display = "none", a.className = lazySizesConfig.lazyClass, 1 != t.length || l || (l = "auto"), t.forEach(function (t) {
                    var i, s = e.createElement("source");
                    l && "auto" != l && s.setAttribute("sizes", l), (i = t.match(o)) ? (s.setAttribute(lazySizesConfig.srcsetAttr, i[1]), c(s, i[2]), c(s, i[3])) : s.setAttribute(lazySizesConfig.srcsetAttr, t), r.appendChild(s)
                }), l && (a.setAttribute(lazySizesConfig.sizesAttr, l), i.removeAttribute(lazySizesConfig.sizesAttr), i.removeAttribute("sizes")), u && a.setAttribute("data-optimumx", u), d && a.setAttribute("data-ratio", d), r.appendChild(a), i.appendChild(r)
            },
            u = function (t) {
                if (t.target._lazybgset) {
                    var e = t.target,
                        s = e._lazybgset,
                        n = e.currentSrc || e.src;
                    if (n) {
                        var o = i.fire(s, "bgsetproxy", {
                            src: n,
                            useSrc: r.test(n) ? JSON.stringify(n) : n
                        });
                        o.defaultPrevented || (s.style.backgroundImage = "url(" + o.detail.useSrc + ")")
                    }
                    e._lazybgsetLoading && (i.fire(s, "_lazyloaded", {}, !1, !0), delete e._lazybgsetLoading)
                }
            };
        addEventListener("lazybeforeunveil", function (t) {
            var s, n, o;
            !t.defaultPrevented && (s = t.target.getAttribute("data-bgset")) && (o = t.target, (n = e.createElement("img")).alt = "", n._lazybgsetLoading = !0, t.detail.firesLoad = !0, d(s, o, n), setTimeout(function () {
                i.loader.unveil(n), i.rAF(function () {
                    i.fire(n, "_lazyloaded", {}, !0, !0), n.complete && u({
                        target: n
                    })
                })
            }))
        }), e.addEventListener("load", u, !0), t.addEventListener("lazybeforesizes", function (t) {
            if (t.detail.instance == i && t.target._lazybgset && t.detail.dataAttr) {
                var e = function (t) {
                    var e;
                    return e = (getComputedStyle(t) || {
                        getPropertyValue: function () {}
                    }).getPropertyValue("background-size"), !l[e] && l[t.style.backgroundSize] && (e = t.style.backgroundSize), e
                }(t.target._lazybgset);
                l[e] && (t.target._lazysizesParentFit = e, i.rAF(function () {
                    t.target.setAttribute("data-parent-fit", e), t.target._lazysizesParentFit && delete t.target._lazysizesParentFit
                }))
            }
        }, !0), e.documentElement.addEventListener("lazybeforesizes", function (t) {
            !t.defaultPrevented && t.target._lazybgset && t.detail.instance == i && (t.detail.width = function (t) {
                var e = i.gW(t, t.parentNode);
                return (!t._lazysizesWidth || e > t._lazysizesWidth) && (t._lazysizesWidth = e), t._lazysizesWidth
            }(t.target._lazybgset))
        })
    }
}),
function (t, e) {
    var i = function () {
        e(t.lazySizes), t.removeEventListener("lazyunveilread", i, !0)
    };
    e = e.bind(null, t, t.document), "object" == typeof module && module.exports ? e(require("lazysizes")) : t.lazySizes ? i() : t.addEventListener("lazyunveilread", i, !0)
}(window, function (t, e, i) {
    "use strict";

    function s(t, i) {
        if (!a[t]) {
            var s = e.createElement(i ? "link" : "script"),
                n = e.getElementsByTagName("script")[0];
            i ? (s.rel = "stylesheet", s.href = t) : s.src = t, a[t] = !0, a[s.src || s.href] = !0, n.parentNode.insertBefore(s, n)
        }
    }
    var n, o, a = {};
    e.addEventListener && (o = /\(|\)|\s|'/, n = function (t, i) {
        var s = e.createElement("img");
        s.onload = function () {
            s.onload = null, s.onerror = null, s = null, i()
        }, s.onerror = s.onload, s.src = t, s && s.complete && s.onload && s.onload()
    }, addEventListener("lazybeforeunveil", function (t) {
        var e, a, r;
        t.detail.instance == i && (t.defaultPrevented || ("none" == t.target.preload && (t.target.preload = "auto"), (e = t.target.getAttribute("data-link")) && s(e, !0), (e = t.target.getAttribute("data-script")) && s(e), (e = t.target.getAttribute("data-require")) && (i.cfg.requireJs ? i.cfg.requireJs([e]) : s(e)), (a = t.target.getAttribute("data-bg")) && (t.detail.firesLoad = !0, n(a, function () {
            t.target.style.backgroundImage = "url(" + (o.test(a) ? JSON.stringify(a) : a) + ")", t.detail.firesLoad = !1, i.fire(t.target, "_lazyloaded", {}, !0, !0)
        })), (r = t.target.getAttribute("data-poster")) && (t.detail.firesLoad = !0, n(r, function () {
            t.target.poster = r, t.detail.firesLoad = !1, i.fire(t.target, "_lazyloaded", {}, !0, !0)
        }))))
    }, !1))
}),
function (t, e, i, s) {
    function n(e, i) {
        this.settings = null, this.options = t.extend({}, n.Defaults, i), this.$element = t(e), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
            time: null,
            target: null,
            pointer: null,
            stage: {
                start: null,
                current: null
            },
            direction: null
        }, this._states = {
            current: {},
            tags: {
                initializing: ["busy"],
                animating: ["busy"],
                dragging: ["interacting"]
            }
        }, t.each(["onResize", "onThrottledResize"], t.proxy(function (e, i) {
            this._handlers[i] = t.proxy(this[i], this)
        }, this)), t.each(n.Plugins, t.proxy(function (t, e) {
            this._plugins[t.charAt(0).toLowerCase() + t.slice(1)] = new e(this)
        }, this)), t.each(n.Workers, t.proxy(function (e, i) {
            this._pipe.push({
                filter: i.filter,
                run: t.proxy(i.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }
    n.Defaults = {
        items: 3,
        loop: !1,
        center: !1,
        rewind: !1,
        checkVisibility: !0,
        mouseDrag: !0,
        touchDrag: !0,
        pullDrag: !0,
        freeDrag: !1,
        margin: 0,
        stagePadding: 0,
        merge: !1,
        mergeFit: !0,
        autoWidth: !1,
        startPosition: 0,
        rtl: !1,
        smartSpeed: 250,
        fluidSpeed: !1,
        dragEndSpeed: !1,
        responsive: {},
        responsiveRefreshRate: 200,
        responsiveBaseElement: e,
        fallbackEasing: "swing",
        slideTransition: "",
        info: !1,
        nestedItemSelector: !1,
        itemElement: "div",
        stageElement: "div",
        refreshClass: "owl-refresh",
        loadedClass: "owl-loaded",
        loadingClass: "owl-loading",
        rtlClass: "owl-rtl",
        responsiveClass: "owl-responsive",
        dragClass: "owl-drag",
        itemClass: "owl-item",
        stageClass: "owl-stage",
        stageOuterClass: "owl-stage-outer",
        grabClass: "owl-grab"
    }, n.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, n.Type = {
        Event: "event",
        State: "state"
    }, n.Plugins = {}, n.Workers = [{
        filter: ["width", "settings"],
        run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            t.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = this.settings.margin || "",
                i = !this.settings.autoWidth,
                s = this.settings.rtl,
                n = {
                    width: "auto",
                    "margin-left": s ? e : "",
                    "margin-right": s ? "" : e
                };
            !i && this.$stage.children().css(n), t.css = n
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                i = null,
                s = this._items.length,
                n = !this.settings.autoWidth,
                o = [];
            for (t.items = {
                    merge: !1,
                    width: e
                }; s--;) i = this._mergers[s], i = this.settings.mergeFit && Math.min(i, this.settings.items) || i, t.items.merge = i > 1 || t.items.merge, o[s] = n ? e * i : this._items[s].width();
            this._widths = o
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            var e = [],
                i = this._items,
                s = this.settings,
                n = Math.max(2 * s.items, 4),
                o = 2 * Math.ceil(i.length / 2),
                a = s.loop && i.length ? s.rewind ? n : Math.max(n, o) : 0,
                r = "",
                l = "";
            for (a /= 2; a > 0;) e.push(this.normalize(e.length / 2, !0)), r += i[e[e.length - 1]][0].outerHTML, e.push(this.normalize(i.length - 1 - (e.length - 1) / 2, !0)), l = i[e[e.length - 1]][0].outerHTML + l, a -= 1;
            this._clones = e, t(r).addClass("cloned").appendTo(this.$stage), t(l).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            for (var t = this.settings.rtl ? 1 : -1, e = this._clones.length + this._items.length, i = -1, s = 0, n = 0, o = []; ++i < e;) s = o[i - 1] || 0, n = this._widths[this.relative(i)] + this.settings.margin, o.push(s + n * t);
            this._coordinates = o
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            var t = this.settings.stagePadding,
                e = this._coordinates,
                i = {
                    width: Math.ceil(Math.abs(e[e.length - 1])) + 2 * t,
                    "padding-left": t || "",
                    "padding-right": t || ""
                };
            this.$stage.css(i)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            var e = this._coordinates.length,
                i = !this.settings.autoWidth,
                s = this.$stage.children();
            if (i && t.items.merge)
                for (; e--;) t.css.width = this._widths[this.relative(e)], s.eq(e).css(t.css);
            else i && (t.css.width = t.items.width, s.css(t.css))
        }
    }, {
        filter: ["items"],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (t) {
            t.current = t.current ? this.$stage.children().index(t.current) : 0, t.current = Math.max(this.minimum(), Math.min(this.maximum(), t.current)), this.reset(t.current)
        }
    }, {
        filter: ["position"],
        run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function () {
            var t, e, i, s, n = this.settings.rtl ? 1 : -1,
                o = 2 * this.settings.stagePadding,
                a = this.coordinates(this.current()) + o,
                r = a + this.width() * n,
                l = [];
            for (i = 0, s = this._coordinates.length; i < s; i++) t = this._coordinates[i - 1] || 0, e = Math.abs(this._coordinates[i]) + o * n, (this.op(t, "<=", a) && this.op(t, ">", r) || this.op(e, "<", a) && this.op(e, ">", r)) && l.push(i);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + l.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
        }
    }], n.prototype.initializeStage = function () {
        this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = t("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass
        }).wrap(t("<div/>", {
            class: this.settings.stageOuterClass
        })), this.$element.append(this.$stage.parent()))
    }, n.prototype.initializeItems = function () {
        var e = this.$element.find(".owl-item");
        if (e.length) return this._items = e.get().map(function (e) {
            return t(e)
        }), this._mergers = this._items.map(function () {
            return 1
        }), void this.refresh();
        this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)
    }, n.prototype.initialize = function () {
        var t, e, i;
        (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) && (t = this.$element.find("img"), e = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : s, i = this.$element.children(e).width(), t.length && i <= 0 && this.preloadAutoWidthImages(t));
        this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, n.prototype.isVisible = function () {
        return !this.settings.checkVisibility || this.$element.is(":visible")
    }, n.prototype.setup = function () {
        var e = this.viewport(),
            i = this.options.responsive,
            s = -1,
            n = null;
        i ? (t.each(i, function (t) {
            t <= e && t > s && (s = Number(t))
        }), "function" == typeof (n = t.extend({}, this.options, i[s])).stagePadding && (n.stagePadding = n.stagePadding()), delete n.responsive, n.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + s))) : n = t.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: n
            }
        }), this._breakpoint = s, this.settings = n, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, n.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, n.prototype.prepare = function (e) {
        var i = this.trigger("prepare", {
            content: e
        });
        return i.data || (i.data = t("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(e)), this.trigger("prepared", {
            content: i.data
        }), i.data
    }, n.prototype.update = function () {
        for (var e = 0, i = this._pipe.length, s = t.proxy(function (t) {
                return this[t]
            }, this._invalidated), n = {}; e < i;)(this._invalidated.all || t.grep(this._pipe[e].filter, s).length > 0) && this._pipe[e].run(n), e++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, n.prototype.width = function (t) {
        switch (t = t || n.Width.Default) {
            case n.Width.Inner:
            case n.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, n.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, n.prototype.onThrottledResize = function () {
        e.clearTimeout(this.resizeTimer), this.resizeTimer = e.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, n.prototype.onResize = function () {
        return !!this._items.length && this._width !== this.$element.width() && !!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))
    }, n.prototype.registerEventHandlers = function () {
        t.support.transition && this.$stage.on(t.support.transition.end + ".owl.core", t.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(e, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", t.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", t.proxy(this.onDragEnd, this)))
    }, n.prototype.onDragStart = function (e) {
        var s = null;
        3 !== e.which && (t.support.transform ? s = {
            x: (s = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","))[16 === s.length ? 12 : 4],
            y: s[16 === s.length ? 13 : 5]
        } : (s = this.$stage.position(), s = {
            x: this.settings.rtl ? s.left + this.$stage.width() - this.width() + this.settings.margin : s.left,
            y: s.top
        }), this.is("animating") && (t.support.transform ? this.animate(s.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === e.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = t(e.target), this._drag.stage.start = s, this._drag.stage.current = s, this._drag.pointer = this.pointer(e), t(i).on("mouseup.owl.core touchend.owl.core", t.proxy(this.onDragEnd, this)), t(i).one("mousemove.owl.core touchmove.owl.core", t.proxy(function (e) {
            var s = this.difference(this._drag.pointer, this.pointer(e));
            t(i).on("mousemove.owl.core touchmove.owl.core", t.proxy(this.onDragMove, this)), Math.abs(s.x) < Math.abs(s.y) && this.is("valid") || (e.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, n.prototype.onDragMove = function (t) {
        var e = null,
            i = null,
            s = null,
            n = this.difference(this._drag.pointer, this.pointer(t)),
            o = this.difference(this._drag.stage.start, n);
        this.is("dragging") && (t.preventDefault(), this.settings.loop ? (e = this.coordinates(this.minimum()), i = this.coordinates(this.maximum() + 1) - e, o.x = ((o.x - e) % i + i) % i + e) : (e = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), i = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), s = this.settings.pullDrag ? -1 * n.x / 5 : 0, o.x = Math.max(Math.min(o.x, e + s), i + s)), this._drag.stage.current = o, this.animate(o.x))
    }, n.prototype.onDragEnd = function (e) {
        var s = this.difference(this._drag.pointer, this.pointer(e)),
            n = this._drag.stage.current,
            o = s.x > 0 ^ this.settings.rtl ? "left" : "right";
        t(i).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== s.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(n.x, 0 !== s.x ? o : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = o, (Math.abs(s.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, n.prototype.closest = function (e, i) {
        var n = -1,
            o = this.width(),
            a = this.coordinates();
        return this.settings.freeDrag || t.each(a, t.proxy(function (t, r) {
            return "left" === i && e > r - 30 && e < r + 30 ? n = t : "right" === i && e > r - o - 30 && e < r - o + 30 ? n = t + 1 : this.op(e, "<", r) && this.op(e, ">", a[t + 1] !== s ? a[t + 1] : r - o) && (n = "left" === i ? t + 1 : t), -1 === n
        }, this)), this.settings.loop || (this.op(e, ">", a[this.minimum()]) ? n = e = this.minimum() : this.op(e, "<", a[this.maximum()]) && (n = e = this.maximum())), n
    }, n.prototype.animate = function (e) {
        var i = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(), i && (this.enter("animating"), this.trigger("translate")), t.support.transform3d && t.support.transition ? this.$stage.css({
            transform: "translate3d(" + e + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
        }) : i ? this.$stage.animate({
            left: e + "px"
        }, this.speed(), this.settings.fallbackEasing, t.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: e + "px"
        })
    }, n.prototype.is = function (t) {
        return this._states.current[t] && this._states.current[t] > 0
    }, n.prototype.current = function (t) {
        if (t === s) return this._current;
        if (0 === this._items.length) return s;
        if (t = this.normalize(t), this._current !== t) {
            var e = this.trigger("change", {
                property: {
                    name: "position",
                    value: t
                }
            });
            e.data !== s && (t = this.normalize(e.data)), this._current = t, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, n.prototype.invalidate = function (e) {
        return "string" === t.type(e) && (this._invalidated[e] = !0, this.is("valid") && this.leave("valid")), t.map(this._invalidated, function (t, e) {
            return e
        })
    }, n.prototype.reset = function (t) {
        (t = this.normalize(t)) !== s && (this._speed = 0, this._current = t, this.suppress(["translate", "translated"]), this.animate(this.coordinates(t)), this.release(["translate", "translated"]))
    }, n.prototype.normalize = function (t, e) {
        var i = this._items.length,
            n = e ? 0 : this._clones.length;
        return !this.isNumeric(t) || i < 1 ? t = s : (t < 0 || t >= i + n) && (t = ((t - n / 2) % i + i) % i + n / 2), t
    }, n.prototype.relative = function (t) {
        return t -= this._clones.length / 2, this.normalize(t, !0)
    }, n.prototype.maximum = function (t) {
        var e, i, s, n = this.settings,
            o = this._coordinates.length;
        if (n.loop) o = this._clones.length / 2 + this._items.length - 1;
        else if (n.autoWidth || n.merge) {
            if (e = this._items.length)
                for (i = this._items[--e].width(), s = this.$element.width(); e-- && !((i += this._items[e].width() + this.settings.margin) > s););
            o = e + 1
        } else o = n.center ? this._items.length - 1 : this._items.length - n.items;
        return t && (o -= this._clones.length / 2), Math.max(o, 0)
    }, n.prototype.minimum = function (t) {
        return t ? 0 : this._clones.length / 2
    }, n.prototype.items = function (t) {
        return t === s ? this._items.slice() : (t = this.normalize(t, !0), this._items[t])
    }, n.prototype.mergers = function (t) {
        return t === s ? this._mergers.slice() : (t = this.normalize(t, !0), this._mergers[t])
    }, n.prototype.clones = function (e) {
        var i = this._clones.length / 2,
            n = i + this._items.length,
            o = function (t) {
                return t % 2 == 0 ? n + t / 2 : i - (t + 1) / 2
            };
        return e === s ? t.map(this._clones, function (t, e) {
            return o(e)
        }) : t.map(this._clones, function (t, i) {
            return t === e ? o(i) : null
        })
    }, n.prototype.speed = function (t) {
        return t !== s && (this._speed = t), this._speed
    }, n.prototype.coordinates = function (e) {
        var i, n = 1,
            o = e - 1;
        return e === s ? t.map(this._coordinates, t.proxy(function (t, e) {
            return this.coordinates(e)
        }, this)) : (this.settings.center ? (this.settings.rtl && (n = -1, o = e + 1), i = this._coordinates[e], i += (this.width() - i + (this._coordinates[o] || 0)) / 2 * n) : i = this._coordinates[o] || 0, i = Math.ceil(i))
    }, n.prototype.duration = function (t, e, i) {
        return 0 === i ? 0 : Math.min(Math.max(Math.abs(e - t), 1), 6) * Math.abs(i || this.settings.smartSpeed)
    }, n.prototype.to = function (t, e) {
        var i = this.current(),
            s = null,
            n = t - this.relative(i),
            o = (n > 0) - (n < 0),
            a = this._items.length,
            r = this.minimum(),
            l = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(n) > a / 2 && (n += -1 * o * a), (s = (((t = i + n) - r) % a + a) % a + r) !== t && s - n <= l && s - n > 0 && (i = s - n, t = s, this.reset(i))) : this.settings.rewind ? t = (t % (l += 1) + l) % l : t = Math.max(r, Math.min(l, t)), this.speed(this.duration(i, t, e)), this.current(t), this.isVisible() && this.update()
    }, n.prototype.next = function (t) {
        t = t || !1, this.to(this.relative(this.current()) + 1, t)
    }, n.prototype.prev = function (t) {
        t = t || !1, this.to(this.relative(this.current()) - 1, t)
    }, n.prototype.onTransitionEnd = function (t) {
        if (t !== s && (t.stopPropagation(), (t.target || t.srcElement || t.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, n.prototype.viewport = function () {
        var s;
        return this.options.responsiveBaseElement !== e ? s = t(this.options.responsiveBaseElement).width() : e.innerWidth ? s = e.innerWidth : i.documentElement && i.documentElement.clientWidth ? s = i.documentElement.clientWidth : console.warn("Can not detect viewport width."), s
    }, n.prototype.replace = function (e) {
        this.$stage.empty(), this._items = [], e && (e = e instanceof jQuery ? e : t(e)), this.settings.nestedItemSelector && (e = e.find("." + this.settings.nestedItemSelector)), e.filter(function () {
            return 1 === this.nodeType
        }).each(t.proxy(function (t, e) {
            e = this.prepare(e), this.$stage.append(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, n.prototype.add = function (e, i) {
        var n = this.relative(this._current);
        i = i === s ? this._items.length : this.normalize(i, !0), e = e instanceof jQuery ? e : t(e), this.trigger("add", {
            content: e,
            position: i
        }), e = this.prepare(e), 0 === this._items.length || i === this._items.length ? (0 === this._items.length && this.$stage.append(e), 0 !== this._items.length && this._items[i - 1].after(e), this._items.push(e), this._mergers.push(1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[i].before(e), this._items.splice(i, 0, e), this._mergers.splice(i, 0, 1 * e.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[n] && this.reset(this._items[n].index()), this.invalidate("items"), this.trigger("added", {
            content: e,
            position: i
        })
    }, n.prototype.remove = function (t) {
        (t = this.normalize(t, !0)) !== s && (this.trigger("remove", {
            content: this._items[t],
            position: t
        }), this._items[t].remove(), this._items.splice(t, 1), this._mergers.splice(t, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: t
        }))
    }, n.prototype.preloadAutoWidthImages = function (e) {
        e.each(t.proxy(function (e, i) {
            this.enter("pre-loading"), i = t(i), t(new Image).one("load", t.proxy(function (t) {
                i.attr("src", t.target.src), i.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", i.attr("src") || i.attr("data-src") || i.attr("data-src-retina"))
        }, this))
    }, n.prototype.destroy = function () {
        for (var s in this.$element.off(".owl.core"), this.$stage.off(".owl.core"), t(i).off(".owl.core"), !1 !== this.settings.responsive && (e.clearTimeout(this.resizeTimer), this.off(e, "resize", this._handlers.onThrottledResize)), this._plugins) this._plugins[s].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, n.prototype.op = function (t, e, i) {
        var s = this.settings.rtl;
        switch (e) {
            case "<":
                return s ? t > i : t < i;
            case ">":
                return s ? t < i : t > i;
            case ">=":
                return s ? t <= i : t >= i;
            case "<=":
                return s ? t >= i : t <= i
        }
    }, n.prototype.on = function (t, e, i, s) {
        t.addEventListener ? t.addEventListener(e, i, s) : t.attachEvent && t.attachEvent("on" + e, i)
    }, n.prototype.off = function (t, e, i, s) {
        t.removeEventListener ? t.removeEventListener(e, i, s) : t.detachEvent && t.detachEvent("on" + e, i)
    }, n.prototype.trigger = function (e, i, s, o, a) {
        var r = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            l = t.camelCase(t.grep(["on", e, s], function (t) {
                return t
            }).join("-").toLowerCase()),
            c = t.Event([e, "owl", s || "carousel"].join(".").toLowerCase(), t.extend({
                relatedTarget: this
            }, r, i));
        return this._supress[e] || (t.each(this._plugins, function (t, e) {
            e.onTrigger && e.onTrigger(c)
        }), this.register({
            type: n.Type.Event,
            name: e
        }), this.$element.trigger(c), this.settings && "function" == typeof this.settings[l] && this.settings[l].call(this, c)), c
    }, n.prototype.enter = function (e) {
        t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
            this._states.current[e] === s && (this._states.current[e] = 0), this._states.current[e]++
        }, this))
    }, n.prototype.leave = function (e) {
        t.each([e].concat(this._states.tags[e] || []), t.proxy(function (t, e) {
            this._states.current[e]--
        }, this))
    }, n.prototype.register = function (e) {
        if (e.type === n.Type.Event) {
            if (t.event.special[e.name] || (t.event.special[e.name] = {}), !t.event.special[e.name].owl) {
                var i = t.event.special[e.name]._default;
                t.event.special[e.name]._default = function (t) {
                    return !i || !i.apply || t.namespace && -1 !== t.namespace.indexOf("owl") ? t.namespace && t.namespace.indexOf("owl") > -1 : i.apply(this, arguments)
                }, t.event.special[e.name].owl = !0
            }
        } else e.type === n.Type.State && (this._states.tags[e.name] ? this._states.tags[e.name] = this._states.tags[e.name].concat(e.tags) : this._states.tags[e.name] = e.tags, this._states.tags[e.name] = t.grep(this._states.tags[e.name], t.proxy(function (i, s) {
            return t.inArray(i, this._states.tags[e.name]) === s
        }, this)))
    }, n.prototype.suppress = function (e) {
        t.each(e, t.proxy(function (t, e) {
            this._supress[e] = !0
        }, this))
    }, n.prototype.release = function (e) {
        t.each(e, t.proxy(function (t, e) {
            delete this._supress[e]
        }, this))
    }, n.prototype.pointer = function (t) {
        var i = {
            x: null,
            y: null
        };
        return (t = (t = t.originalEvent || t || e.event).touches && t.touches.length ? t.touches[0] : t.changedTouches && t.changedTouches.length ? t.changedTouches[0] : t).pageX ? (i.x = t.pageX, i.y = t.pageY) : (i.x = t.clientX, i.y = t.clientY), i
    }, n.prototype.isNumeric = function (t) {
        return !isNaN(parseFloat(t))
    }, n.prototype.difference = function (t, e) {
        return {
            x: t.x - e.x,
            y: t.y - e.y
        }
    }, t.fn.owlCarousel = function (e) {
        var i = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var s = t(this),
                o = s.data("owl.carousel");
            o || (o = new n(this, "object" == typeof e && e), s.data("owl.carousel", o), t.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (e, i) {
                o.register({
                    type: n.Type.Event,
                    name: i
                }), o.$element.on(i + ".owl.carousel.core", t.proxy(function (t) {
                    t.namespace && t.relatedTarget !== this && (this.suppress([i]), o[i].apply(this, [].slice.call(arguments, 1)), this.release([i]))
                }, o))
            })), "string" == typeof e && "_" !== e.charAt(0) && o[e].apply(o, i)
        })
    }, t.fn.owlCarousel.Constructor = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    }, n.prototype.watch = function () {
        this._interval || (this._visible = this._core.isVisible(), this._interval = e.setInterval(t.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, n.prototype.refresh = function () {
        this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, n.prototype.destroy = function () {
        var t, i;
        for (t in e.clearInterval(this._interval), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoRefresh = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": t.proxy(function (e) {
                if (e.namespace && this._core.settings && this._core.settings.lazyLoad && (e.property && "position" == e.property.name || "initialized" == e.type)) {
                    var i = this._core.settings,
                        s = i.center && Math.ceil(i.items / 2) || i.items,
                        n = i.center && -1 * s || 0,
                        o = (e.property && void 0 !== e.property.value ? e.property.value : this._core.current()) + n,
                        a = this._core.clones().length,
                        r = t.proxy(function (t, e) {
                            this.load(e)
                        }, this);
                    for (i.lazyLoadEager > 0 && (s += i.lazyLoadEager, i.loop && (o -= i.lazyLoadEager, s++)); n++ < s;) this.load(a / 2 + this._core.relative(o)), a && t.each(this._core.clones(this._core.relative(o)), r), o++
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    n.Defaults = {
        lazyLoad: !1,
        lazyLoadEager: 0
    }, n.prototype.load = function (i) {
        var s = this._core.$stage.children().eq(i),
            n = s && s.find(".owl-lazy");
        !n || t.inArray(s.get(0), this._loaded) > -1 || (n.each(t.proxy(function (i, s) {
            var n, o = t(s),
                a = e.devicePixelRatio > 1 && o.attr("data-src-retina") || o.attr("data-src") || o.attr("data-srcset");
            this._core.trigger("load", {
                element: o,
                url: a
            }, "lazy"), o.is("img") ? o.one("load.owl.lazy", t.proxy(function () {
                o.css("opacity", 1), this._core.trigger("loaded", {
                    element: o,
                    url: a
                }, "lazy")
            }, this)).attr("src", a) : o.is("source") ? o.one("load.owl.lazy", t.proxy(function () {
                this._core.trigger("loaded", {
                    element: o,
                    url: a
                }, "lazy")
            }, this)).attr("srcset", a) : ((n = new Image).onload = t.proxy(function () {
                o.css({
                    "background-image": 'url("' + a + '")',
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: o,
                    url: a
                }, "lazy")
            }, this), n.src = a)
        }, this)), this._loaded.push(s.get(0)))
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this._core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Lazy = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (i) {
        this._core = i, this._previousHeight = null, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && "position" === t.property.name && this.update()
            }, this),
            "loaded.owl.lazy": t.proxy(function (t) {
                t.namespace && this._core.settings.autoHeight && t.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
        var s = this;
        t(e).on("load", function () {
            s._core.settings.autoHeight && s.update()
        }), t(e).resize(function () {
            s._core.settings.autoHeight && (null != s._intervalId && clearTimeout(s._intervalId), s._intervalId = setTimeout(function () {
                s.update()
            }, 250))
        })
    };
    n.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, n.prototype.update = function () {
        var e = this._core._current,
            i = e + this._core.settings.items,
            s = this._core.settings.lazyLoad,
            n = this._core.$stage.children().toArray().slice(e, i),
            o = [],
            a = 0;
        t.each(n, function (e, i) {
            o.push(t(i).height())
        }), (a = Math.max.apply(null, o)) <= 1 && s && this._previousHeight && (a = this._previousHeight), this._previousHeight = a, this._core.$stage.parent().height(a).addClass(this._core.settings.autoHeightClass)
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.AutoHeight = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.video && this.isInFullScreen() && t.preventDefault()
            }, this),
            "refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" === t.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": t.proxy(function (e) {
                if (e.namespace) {
                    var i = t(e.content).find(".owl-video");
                    i.length && (i.css("display", "none"), this.fetch(i, t(e.content)))
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", t.proxy(function (t) {
            this.play(t)
        }, this))
    };
    n.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, n.prototype.fetch = function (t, e) {
        var i = t.attr("data-vimeo-id") ? "vimeo" : t.attr("data-vzaar-id") ? "vzaar" : "youtube",
            s = t.attr("data-vimeo-id") || t.attr("data-youtube-id") || t.attr("data-vzaar-id"),
            n = t.attr("data-width") || this._core.settings.videoWidth,
            o = t.attr("data-height") || this._core.settings.videoHeight,
            a = t.attr("href");
        if (!a) throw new Error("Missing video URL.");
        if ((s = a.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/))[3].indexOf("youtu") > -1) i = "youtube";
        else if (s[3].indexOf("vimeo") > -1) i = "vimeo";
        else {
            if (!(s[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
            i = "vzaar"
        }
        s = s[6], this._videos[a] = {
            type: i,
            id: s,
            width: n,
            height: o
        }, e.attr("data-video", a), this.thumbnail(t, this._videos[a])
    }, n.prototype.thumbnail = function (e, i) {
        var s, n, o = i.width && i.height ? "width:" + i.width + "px;height:" + i.height + "px;" : "",
            a = e.find("img"),
            r = "src",
            l = "",
            c = this._core.settings,
            d = function (i) {
                '<div class="owl-video-play-icon"></div>',
                s = c.lazyLoad ? t("<div/>", {
                    class: "owl-video-tn " + l,
                    srcType: i
                }) : t("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + i + ")"
                }),
                e.after(s),
                e.after('<div class="owl-video-play-icon"></div>')
            };
        if (e.wrap(t("<div/>", {
                class: "owl-video-wrapper",
                style: o
            })), this._core.settings.lazyLoad && (r = "data-src", l = "owl-lazy"), a.length) return d(a.attr(r)), a.remove(), !1;
        "youtube" === i.type ? (n = "//img.youtube.com/vi/" + i.id + "/hqdefault.jpg", d(n)) : "vimeo" === i.type ? t.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + i.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                n = t[0].thumbnail_large, d(n)
            }
        }) : "vzaar" === i.type && t.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + i.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (t) {
                n = t.framegrab_url, d(n)
            }
        })
    }, n.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, n.prototype.play = function (e) {
        var i, s = t(e.target).closest("." + this._core.settings.itemClass),
            n = this._videos[s.attr("data-video")],
            o = n.width || "100%",
            a = n.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), s = this._core.items(this._core.relative(s.index())), this._core.reset(s.index()), (i = t('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>')).attr("height", a), i.attr("width", o), "youtube" === n.type ? i.attr("src", "//www.youtube.com/embed/" + n.id + "?autoplay=1&rel=0&v=" + n.id) : "vimeo" === n.type ? i.attr("src", "//player.vimeo.com/video/" + n.id + "?autoplay=1") : "vzaar" === n.type && i.attr("src", "//view.vzaar.com/" + n.id + "/player?autoplay=true"), t(i).wrap('<div class="owl-video-frame" />').insertAfter(s.find(".owl-video")), this._playing = s.addClass("owl-video-playing"))
    }, n.prototype.isInFullScreen = function () {
        var e = i.fullscreenElement || i.mozFullScreenElement || i.webkitFullscreenElement;
        return e && t(e).parent().hasClass("owl-video-frame")
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this._core.$element.off("click.owl.video"), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Video = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (e) {
        this.core = e, this.core.options = t.extend({}, n.Defaults, this.core.options), this.swapping = !0, this.previous = s, this.next = s, this.handlers = {
            "change.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" == t.property.name && (this.previous = this.core.current(), this.next = t.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": t.proxy(function (t) {
                t.namespace && (this.swapping = "translated" == t.type)
            }, this),
            "translate.owl.carousel": t.proxy(function (t) {
                t.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    n.Defaults = {
        animateOut: !1,
        animateIn: !1
    }, n.prototype.swap = function () {
        if (1 === this.core.settings.items && t.support.animation && t.support.transition) {
            this.core.speed(0);
            var e, i = t.proxy(this.clear, this),
                s = this.core.$stage.children().eq(this.previous),
                n = this.core.$stage.children().eq(this.next),
                o = this.core.settings.animateIn,
                a = this.core.settings.animateOut;
            this.core.current() !== this.previous && (a && (e = this.core.coordinates(this.previous) - this.core.coordinates(this.next), s.one(t.support.animation.end, i).css({
                left: e + "px"
            }).addClass("animated owl-animated-out").addClass(a)), o && n.one(t.support.animation.end, i).addClass("animated owl-animated-in").addClass(o))
        }
    }, n.prototype.clear = function (e) {
        t(e.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.handlers) this.core.$element.off(t, this.handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Animate = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    var n = function (e) {
        this._core = e, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
            "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "settings" === t.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : t.namespace && "position" === t.property.name && this._paused && (this._time = 0)
            }, this),
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": t.proxy(function (t, e, i) {
                t.namespace && this.play(e, i)
            }, this),
            "stop.owl.autoplay": t.proxy(function (t) {
                t.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": t.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = t.extend({}, n.Defaults, this._core.options)
    };
    n.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, n.prototype._next = function (s) {
        this._call = e.setTimeout(t.proxy(this._next, this, s), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || i.hidden || this._core.next(s || this._core.settings.autoplaySpeed)
    }, n.prototype.read = function () {
        return (new Date).getTime() - this._time
    }, n.prototype.play = function (i, s) {
        var n;
        this._core.is("rotating") || this._core.enter("rotating"), i = i || this._core.settings.autoplayTimeout, n = Math.min(this._time % (this._timeout || i), i), this._paused ? (this._time = this.read(), this._paused = !1) : e.clearTimeout(this._call), this._time += this.read() % i - n, this._timeout = i, this._call = e.setTimeout(t.proxy(this._next, this, s), i - n)
    }, n.prototype.stop = function () {
        this._core.is("rotating") && (this._time = 0, this._paused = !0, e.clearTimeout(this._call), this._core.leave("rotating"))
    }, n.prototype.pause = function () {
        this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, e.clearTimeout(this._call))
    }, n.prototype.destroy = function () {
        var t, e;
        for (t in this.stop(), this._handlers) this._core.$element.off(t, this._handlers[t]);
        for (e in Object.getOwnPropertyNames(this)) "function" != typeof this[e] && (this[e] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.autoplay = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    "use strict";
    var n = function (e) {
        this._core = e, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": t.proxy(function (e) {
                e.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + t(e.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": t.proxy(function (t) {
                t.namespace && this._core.settings.dotsData && this._templates.splice(t.position, 1)
            }, this),
            "changed.owl.carousel": t.proxy(function (t) {
                t.namespace && "position" == t.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": t.proxy(function (t) {
                t.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": t.proxy(function (t) {
                t.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    n.Defaults = {
        nav: !1,
        navText: ['<span aria-label="Previous">&#x2039;</span>', '<span aria-label="Next">&#x203a;</span>'],
        navSpeed: !1,
        navElement: 'button type="button" role="presentation"',
        navContainer: !1,
        navContainerClass: "owl-nav",
        navClass: ["owl-prev", "owl-next"],
        slideBy: 1,
        dotClass: "owl-dot",
        dotsClass: "owl-dots",
        dots: !0,
        dotsEach: !1,
        dotsData: !1,
        dotsSpeed: !1,
        dotsContainer: !1
    }, n.prototype.initialize = function () {
        var e, i = this._core.settings;
        for (e in this._controls.$relative = (i.navContainer ? t(i.navContainer) : t("<div>").addClass(i.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = t("<" + i.navElement + ">").addClass(i.navClass[0]).html(i.navText[0]).prependTo(this._controls.$relative).on("click", t.proxy(function (t) {
                this.prev(i.navSpeed)
            }, this)), this._controls.$next = t("<" + i.navElement + ">").addClass(i.navClass[1]).html(i.navText[1]).appendTo(this._controls.$relative).on("click", t.proxy(function (t) {
                this.next(i.navSpeed)
            }, this)), i.dotsData || (this._templates = [t('<button role="button">').addClass(i.dotClass).append(t("<span>")).prop("outerHTML")]), this._controls.$absolute = (i.dotsContainer ? t(i.dotsContainer) : t("<div>").addClass(i.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", t.proxy(function (e) {
                var s = t(e.target).parent().is(this._controls.$absolute) ? t(e.target).index() : t(e.target).parent().index();
                e.preventDefault(), this.to(s, i.dotsSpeed)
            }, this)), this._overrides) this._core[e] = t.proxy(this[e], this)
    }, n.prototype.destroy = function () {
        var t, e, i, s, n;
        for (t in n = this._core.settings, this._handlers) this.$element.off(t, this._handlers[t]);
        for (e in this._controls) "$relative" === e && n.navContainer ? this._controls[e].html("") : this._controls[e].remove();
        for (s in this.overides) this._core[s] = this._overrides[s];
        for (i in Object.getOwnPropertyNames(this)) "function" != typeof this[i] && (this[i] = null)
    }, n.prototype.update = function () {
        var t, e, i = this._core.clones().length / 2,
            s = i + this._core.items().length,
            n = this._core.maximum(!0),
            o = this._core.settings,
            a = o.center || o.autoWidth || o.dotsData ? 1 : o.dotsEach || o.items;
        if ("page" !== o.slideBy && (o.slideBy = Math.min(o.slideBy, o.items)), o.dots || "page" == o.slideBy)
            for (this._pages = [], t = i, e = 0, 0; t < s; t++) {
                if (e >= a || 0 === e) {
                    if (this._pages.push({
                            start: Math.min(n, t - i),
                            end: t - i + a - 1
                        }), Math.min(n, t - i) === n) break;
                    e = 0, 0
                }
                e += this._core.mergers(this._core.relative(t))
            }
    }, n.prototype.draw = function () {
        var e, i = this._core.settings,
            s = this._core.items().length <= i.items,
            n = this._core.relative(this._core.current()),
            o = i.loop || i.rewind;
        this._controls.$relative.toggleClass("disabled", !i.nav || s), i.nav && (this._controls.$previous.toggleClass("disabled", !o && n <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !o && n >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !i.dots || s), i.dots && (e = this._pages.length - this._controls.$absolute.children().length, i.dotsData && 0 !== e ? this._controls.$absolute.html(this._templates.join("")) : e > 0 ? this._controls.$absolute.append(new Array(e + 1).join(this._templates[0])) : e < 0 && this._controls.$absolute.children().slice(e).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(t.inArray(this.current(), this._pages)).addClass("active"))
    }, n.prototype.onTrigger = function (e) {
        var i = this._core.settings;
        e.page = {
            index: t.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: i && (i.center || i.autoWidth || i.dotsData ? 1 : i.dotsEach || i.items)
        }
    }, n.prototype.current = function () {
        var e = this._core.relative(this._core.current());
        return t.grep(this._pages, t.proxy(function (t, i) {
            return t.start <= e && t.end >= e
        }, this)).pop()
    }, n.prototype.getPosition = function (e) {
        var i, s, n = this._core.settings;
        return "page" == n.slideBy ? (i = t.inArray(this.current(), this._pages), s = this._pages.length, e ? ++i : --i, i = this._pages[(i % s + s) % s].start) : (i = this._core.relative(this._core.current()), s = this._core.items().length, e ? i += n.slideBy : i -= n.slideBy), i
    }, n.prototype.next = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!0), e)
    }, n.prototype.prev = function (e) {
        t.proxy(this._overrides.to, this._core)(this.getPosition(!1), e)
    }, n.prototype.to = function (e, i, s) {
        var n;
        !s && this._pages.length ? (n = this._pages.length, t.proxy(this._overrides.to, this._core)(this._pages[(e % n + n) % n].start, i)) : t.proxy(this._overrides.to, this._core)(e, i)
    }, t.fn.owlCarousel.Constructor.Plugins.Navigation = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    "use strict";
    var n = function (i) {
        this._core = i, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": t.proxy(function (i) {
                i.namespace && "URLHash" === this._core.settings.startPosition && t(e).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": t.proxy(function (e) {
                if (e.namespace) {
                    var i = t(e.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!i) return;
                    this._hashes[i] = e.content
                }
            }, this),
            "changed.owl.carousel": t.proxy(function (i) {
                if (i.namespace && "position" === i.property.name) {
                    var s = this._core.items(this._core.relative(this._core.current())),
                        n = t.map(this._hashes, function (t, e) {
                            return t === s ? e : null
                        }).join();
                    if (!n || e.location.hash.slice(1) === n) return;
                    e.location.hash = n
                }
            }, this)
        }, this._core.options = t.extend({}, n.Defaults, this._core.options), this.$element.on(this._handlers), t(e).on("hashchange.owl.navigation", t.proxy(function (t) {
            var i = e.location.hash.substring(1),
                s = this._core.$stage.children(),
                n = this._hashes[i] && s.index(this._hashes[i]);
            void 0 !== n && n !== this._core.current() && this._core.to(this._core.relative(n), !1, !0)
        }, this))
    };
    n.Defaults = {
        URLhashListener: !1
    }, n.prototype.destroy = function () {
        var i, s;
        for (i in t(e).off("hashchange.owl.navigation"), this._handlers) this._core.$element.off(i, this._handlers[i]);
        for (s in Object.getOwnPropertyNames(this)) "function" != typeof this[s] && (this[s] = null)
    }, t.fn.owlCarousel.Constructor.Plugins.Hash = n
}(window.Zepto || window.jQuery, window, document),
function (t, e, i, s) {
    function n(e, i) {
        var n = !1,
            o = e.charAt(0).toUpperCase() + e.slice(1);
        return t.each((e + " " + r.join(o + " ") + o).split(" "), function (t, e) {
            if (a[e] !== s) return n = !i || e, !1
        }), n
    }

    function o(t) {
        return n(t, !0)
    }
    var a = t("<support>").get(0).style,
        r = "Webkit Moz O ms".split(" "),
        l = {
            transition: {
                end: {
                    WebkitTransition: "webkitTransitionEnd",
                    MozTransition: "transitionend",
                    OTransition: "oTransitionEnd",
                    transition: "transitionend"
                }
            },
            animation: {
                end: {
                    WebkitAnimation: "webkitAnimationEnd",
                    MozAnimation: "animationend",
                    OAnimation: "oAnimationEnd",
                    animation: "animationend"
                }
            }
        },
        c = function () {
            return !!n("transform")
        },
        d = function () {
            return !!n("perspective")
        },
        u = function () {
            return !!n("animation")
        };
    (function () {
        return !!n("transition")
    })() && (t.support.transition = new String(o("transition")), t.support.transition.end = l.transition.end[t.support.transition]), u() && (t.support.animation = new String(o("animation")), t.support.animation.end = l.animation.end[t.support.animation]), c() && (t.support.transform = new String(o("transform")), t.support.transform3d = d())
}(window.Zepto || window.jQuery, window, document),
function (t) {
    "use strict";
    t.fn.fitVids = function (e) {
        var i = {
            customSelector: null,
            ignore: null
        };
        if (!document.getElementById("fit-vids-style")) {
            var s = document.head || document.getElementsByTagName("head")[0],
                n = document.createElement("div");
            n.innerHTML = '<p>x</p><style id="fit-vids-style">.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}</style>', s.appendChild(n.childNodes[1])
        }
        return e && t.extend(i, e), this.each(function () {
            var e = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', "object", "embed"];
            i.customSelector && e.push(i.customSelector);
            var s = ".fitvidsignore";
            i.ignore && (s = s + ", " + i.ignore);
            var n = t(this).find(e.join(","));
            (n = (n = n.not("object object")).not(s)).each(function (e) {
                var i = t(this);
                if (!(i.parents(s).length > 0 || "embed" === this.tagName.toLowerCase() && i.parent("object").length || i.parent(".fluid-width-video-wrapper").length)) {
                    i.css("height") || i.css("width") || !isNaN(i.attr("height")) && !isNaN(i.attr("width")) || (i.attr("height", 9), i.attr("width", 16));
                    var n = ("object" === this.tagName.toLowerCase() || i.attr("height") && !isNaN(parseInt(i.attr("height"), 10)) ? parseInt(i.attr("height"), 10) : i.height()) / (isNaN(parseInt(i.attr("width"), 10)) ? i.width() : parseInt(i.attr("width"), 10));
                    if (!i.attr("id")) {
                        var o = "fitvid" + e;
                        i.attr("id", o)
                    }
                    i.wrap('<div class="fluid-width-video-wrapper"></div>').parent(".fluid-width-video-wrapper").css("padding-top", 100 * n + "%"), i.removeAttr("height").removeAttr("width")
                }
            })
        })
    }
}(window.jQuery || window.Zepto),
function (t) {
    t.fn.extend({
        customSelect: function (e) {
            if (void 0 === document.body.style.maxHeight) return this;
            var i = (e = t.extend({
                    customClass: "customSelect",
                    mapClass: !0,
                    mapStyle: !0
                }, e)).customClass,
                s = function (e, i) {
                    var s = e.find(":selected"),
                        o = i.children(":first"),
                        a = s.html() || "&nbsp;";
                    o.html(a), s.attr("disabled") ? i.addClass(n("DisabledOption")) : i.removeClass(n("DisabledOption")), setTimeout(function () {
                        i.removeClass(n("Open")), t(document).off("mouseup.customSelect")
                    }, 60)
                },
                n = function (t) {
                    return i + t
                };
            return this.each(function () {
                var o = t(this),
                    a = t("<span />").addClass(n("Inner")),
                    r = t("<span />");
                o.after(r.append(a)), r.addClass(i), e.mapClass && r.addClass(o.attr("class")), e.mapStyle && r.attr("style", o.attr("style")), o.addClass("hasCustomSelect").on("render.customSelect", function () {
                    s(o, r), o.css("width", "");
                    var t = parseInt(o.outerWidth(), 10) - (parseInt(r.outerWidth(), 10) - parseInt(r.width(), 10));
                    r.css({
                        display: "inline-block"
                    });
                    var e = r.outerHeight();
                    o.attr("disabled") ? r.addClass(n("Disabled")) : r.removeClass(n("Disabled")), a.css({
                        width: t,
                        display: "inline-block"
                    }), o.css({
                        "-webkit-appearance": "menulist-button",
                        width: r.outerWidth(),
                        position: "absolute",
                        opacity: 0,
                        height: e,
                        fontSize: r.css("font-size")
                    })
                }).on("change.customSelect", function () {
                    r.addClass(n("Changed")), s(o, r)
                }).on("keyup.customSelect", function (t) {
                    r.hasClass(n("Open")) ? 13 != t.which && 27 != t.which || s(o, r) : (o.trigger("blur.customSelect"), o.trigger("focus.customSelect"))
                }).on("mousedown.customSelect", function () {
                    r.removeClass(n("Changed"))
                }).on("mouseup.customSelect", function (e) {
                    r.hasClass(n("Open")) || (t("." + n("Open")).not(r).length > 0 && "undefined" != typeof InstallTrigger ? o.trigger("focus.customSelect") : (r.addClass(n("Open")), e.stopPropagation(), t(document).one("mouseup.customSelect", function (e) {
                        e.target != o.get(0) && t.inArray(e.target, o.find("*").get()) < 0 ? o.trigger("blur.customSelect") : s(o, r)
                    })))
                }).on("focus.customSelect", function () {
                    r.removeClass(n("Changed")).addClass(n("Focus"))
                }).on("blur.customSelect", function () {
                    r.removeClass(n("Focus") + " " + n("Open"))
                }).on("mouseenter.customSelect", function () {
                    r.addClass(n("Hover"))
                }).on("mouseleave.customSelect", function () {
                    r.removeClass(n("Hover"))
                }).trigger("render.customSelect")
            })
        }
    })
}(jQuery),
function (t) {
    "function" == typeof define && define.amd ? define(["jquery"], t) : t("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function (t) {
    var e, i, s, n, o, a, r = "Close",
        l = "BeforeClose",
        c = "MarkupParse",
        d = "Open",
        u = "Change",
        h = "mfp",
        p = "." + h,
        m = "mfp-ready",
        f = "mfp-removing",
        g = "mfp-prevent-close",
        v = function () {},
        _ = !!window.jQuery,
        y = t(window),
        w = function (t, i) {
            e.ev.on(h + t + p, i)
        },
        b = function (e, i, s, n) {
            var o = document.createElement("div");
            return o.className = "mfp-" + e, s && (o.innerHTML = s), n ? i && i.appendChild(o) : (o = t(o), i && o.appendTo(i)), o
        },
        C = function (i, s) {
            e.ev.triggerHandler(h + i, s), e.st.callbacks && (i = i.charAt(0).toLowerCase() + i.slice(1), e.st.callbacks[i] && e.st.callbacks[i].apply(e, t.isArray(s) ? s : [s]))
        },
        k = function (i) {
            return i === a && e.currTemplate.closeBtn || (e.currTemplate.closeBtn = t(e.st.closeMarkup.replace("%title%", e.st.tClose)), a = i), e.currTemplate.closeBtn
        },
        x = function () {
            t.magnificPopup.instance || ((e = new v).init(), t.magnificPopup.instance = e)
        };
    v.prototype = {
        constructor: v,
        init: function () {
            var i = navigator.appVersion;
            e.isLowIE = e.isIE8 = document.all && !document.addEventListener, e.isAndroid = /android/gi.test(i), e.isIOS = /iphone|ipad|ipod/gi.test(i), e.supportsTransition = function () {
                var t = document.createElement("p").style,
                    e = ["ms", "O", "Moz", "Webkit"];
                if (void 0 !== t.transition) return !0;
                for (; e.length;)
                    if (e.pop() + "Transition" in t) return !0;
                return !1
            }(), e.probablyMobile = e.isAndroid || e.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), s = t(document), e.popupsCache = {}
        },
        open: function (i) {
            var n;
            if (!1 === i.isObj) {
                e.items = i.items.toArray(), e.index = 0;
                var a, r = i.items;
                for (n = 0; n < r.length; n++)
                    if ((a = r[n]).parsed && (a = a.el[0]), a === i.el[0]) {
                        e.index = n;
                        break
                    }
            } else e.items = t.isArray(i.items) ? i.items : [i.items], e.index = i.index || 0;
            if (!e.isOpen) {
                e.types = [], o = "", i.mainEl && i.mainEl.length ? e.ev = i.mainEl.eq(0) : e.ev = s, i.key ? (e.popupsCache[i.key] || (e.popupsCache[i.key] = {}), e.currTemplate = e.popupsCache[i.key]) : e.currTemplate = {}, e.st = t.extend(!0, {}, t.magnificPopup.defaults, i), e.fixedContentPos = "auto" === e.st.fixedContentPos ? !e.probablyMobile : e.st.fixedContentPos, e.st.modal && (e.st.closeOnContentClick = !1, e.st.closeOnBgClick = !1, e.st.showCloseBtn = !1, e.st.enableEscapeKey = !1), e.bgOverlay || (e.bgOverlay = b("bg").on("click" + p, function () {
                    e.close()
                }), e.wrap = b("wrap").attr("tabindex", -1).on("click" + p, function (t) {
                    e._checkIfClose(t.target) && e.close()
                }), e.container = b("container", e.wrap)), e.contentContainer = b("content"), e.st.preloader && (e.preloader = b("preloader", e.container, e.st.tLoading));
                var l = t.magnificPopup.modules;
                for (n = 0; n < l.length; n++) {
                    var u = l[n];
                    u = u.charAt(0).toUpperCase() + u.slice(1), e["init" + u].call(e)
                }
                C("BeforeOpen"), e.st.showCloseBtn && (e.st.closeBtnInside ? (w(c, function (t, e, i, s) {
                    i.close_replaceWith = k(s.type)
                }), o += " mfp-close-btn-in") : e.wrap.append(k())), e.st.alignTop && (o += " mfp-align-top"), e.fixedContentPos ? e.wrap.css({
                    overflow: e.st.overflowY,
                    overflowX: "hidden",
                    overflowY: e.st.overflowY
                }) : e.wrap.css({
                    top: y.scrollTop(),
                    position: "absolute"
                }), (!1 === e.st.fixedBgPos || "auto" === e.st.fixedBgPos && !e.fixedContentPos) && e.bgOverlay.css({
                    height: s.height(),
                    position: "absolute"
                }), e.st.enableEscapeKey && s.on("keyup" + p, function (t) {
                    27 === t.keyCode && e.close()
                }), y.on("resize" + p, function () {
                    e.updateSize()
                }), e.st.closeOnContentClick || (o += " mfp-auto-cursor"), o && e.wrap.addClass(o);
                var h = e.wH = y.height(),
                    f = {};
                if (e.fixedContentPos && e._hasScrollBar(h)) {
                    var g = e._getScrollbarSize();
                    g && (f.marginRight = g)
                }
                e.fixedContentPos && (e.isIE7 ? t("body, html").css("overflow", "hidden") : f.overflow = "hidden");
                var v = e.st.mainClass;
                return e.isIE7 && (v += " mfp-ie7"), v && e._addClassToMFP(v), e.updateItemHTML(), C("BuildControls"), t("html").css(f), e.bgOverlay.add(e.wrap).prependTo(e.st.prependTo || t(document.body)), e._lastFocusedEl = document.activeElement, setTimeout(function () {
                    e.content ? (e._addClassToMFP(m), e._setFocus()) : e.bgOverlay.addClass(m), s.on("focusin" + p, e._onFocusIn)
                }, 16), e.isOpen = !0, e.updateSize(h), C(d), i
            }
            e.updateItemHTML()
        },
        close: function () {
            e.isOpen && (C(l), e.isOpen = !1, e.st.removalDelay && !e.isLowIE && e.supportsTransition ? (e._addClassToMFP(f), setTimeout(function () {
                e._close()
            }, e.st.removalDelay)) : e._close())
        },
        _close: function () {
            C(r);
            var i = f + " " + m + " ";
            if (e.bgOverlay.detach(), e.wrap.detach(), e.container.empty(), e.st.mainClass && (i += e.st.mainClass + " "), e._removeClassFromMFP(i), e.fixedContentPos) {
                var n = {
                    marginRight: ""
                };
                e.isIE7 ? t("body, html").css("overflow", "") : n.overflow = "", t("html").css(n)
            }
            s.off("keyup.mfp focusin" + p), e.ev.off(p), e.wrap.attr("class", "mfp-wrap").removeAttr("style"), e.bgOverlay.attr("class", "mfp-bg"), e.container.attr("class", "mfp-container"), !e.st.showCloseBtn || e.st.closeBtnInside && !0 !== e.currTemplate[e.currItem.type] || e.currTemplate.closeBtn && e.currTemplate.closeBtn.detach(), e.st.autoFocusLast && e._lastFocusedEl && t(e._lastFocusedEl).focus(), e.currItem = null, e.content = null, e.currTemplate = null, e.prevHeight = 0, C("AfterClose")
        },
        updateSize: function (t) {
            if (e.isIOS) {
                var i = document.documentElement.clientWidth / window.innerWidth,
                    s = window.innerHeight * i;
                e.wrap.css("height", s), e.wH = s
            } else e.wH = t || y.height();
            e.fixedContentPos || e.wrap.css("height", e.wH), C("Resize")
        },
        updateItemHTML: function () {
            var i = e.items[e.index];
            e.contentContainer.detach(), e.content && e.content.detach(), i.parsed || (i = e.parseEl(e.index));
            var s = i.type;
            if (C("BeforeChange", [e.currItem ? e.currItem.type : "", s]), e.currItem = i, !e.currTemplate[s]) {
                var o = !!e.st[s] && e.st[s].markup;
                C("FirstMarkupParse", o), e.currTemplate[s] = !o || t(o)
            }
            n && n !== i.type && e.container.removeClass("mfp-" + n + "-holder");
            var a = e["get" + s.charAt(0).toUpperCase() + s.slice(1)](i, e.currTemplate[s]);
            e.appendContent(a, s), i.preloaded = !0, C(u, i), n = i.type, e.container.prepend(e.contentContainer), C("AfterChange")
        },
        appendContent: function (t, i) {
            e.content = t, t ? e.st.showCloseBtn && e.st.closeBtnInside && !0 === e.currTemplate[i] ? e.content.find(".mfp-close").length || e.content.append(k()) : e.content = t : e.content = "", C("BeforeAppend"), e.container.addClass("mfp-" + i + "-holder"), e.contentContainer.append(e.content)
        },
        parseEl: function (i) {
            var s, n = e.items[i];
            if (n.tagName ? n = {
                    el: t(n)
                } : (s = n.type, n = {
                    data: n,
                    src: n.src
                }), n.el) {
                for (var o = e.types, a = 0; a < o.length; a++)
                    if (n.el.hasClass("mfp-" + o[a])) {
                        s = o[a];
                        break
                    } n.src = n.el.attr("data-mfp-src"), n.src || (n.src = n.el.attr("href"))
            }
            return n.type = s || e.st.type || "inline", n.index = i, n.parsed = !0, e.items[i] = n, C("ElementParse", n), e.items[i]
        },
        addGroup: function (t, i) {
            var s = function (s) {
                s.mfpEl = this, e._openClick(s, t, i)
            };
            i || (i = {});
            var n = "click.magnificPopup";
            i.mainEl = t, i.items ? (i.isObj = !0, t.off(n).on(n, s)) : (i.isObj = !1, i.delegate ? t.off(n).on(n, i.delegate, s) : (i.items = t, t.off(n).on(n, s)))
        },
        _openClick: function (i, s, n) {
            if ((void 0 !== n.midClick ? n.midClick : t.magnificPopup.defaults.midClick) || !(2 === i.which || i.ctrlKey || i.metaKey || i.altKey || i.shiftKey)) {
                var o = void 0 !== n.disableOn ? n.disableOn : t.magnificPopup.defaults.disableOn;
                if (o)
                    if (t.isFunction(o)) {
                        if (!o.call(e)) return !0
                    } else if (y.width() < o) return !0;
                i.type && (i.preventDefault(), e.isOpen && i.stopPropagation()), n.el = t(i.mfpEl), n.delegate && (n.items = s.find(n.delegate)), e.open(n)
            }
        },
        updateStatus: function (t, s) {
            if (e.preloader) {
                i !== t && e.container.removeClass("mfp-s-" + i), s || "loading" !== t || (s = e.st.tLoading);
                var n = {
                    status: t,
                    text: s
                };
                C("UpdateStatus", n), t = n.status, s = n.text, e.preloader.html(s), e.preloader.find("a").on("click", function (t) {
                    t.stopImmediatePropagation()
                }), e.container.addClass("mfp-s-" + t), i = t
            }
        },
        _checkIfClose: function (i) {
            if (!t(i).hasClass(g)) {
                var s = e.st.closeOnContentClick,
                    n = e.st.closeOnBgClick;
                if (s && n) return !0;
                if (!e.content || t(i).hasClass("mfp-close") || e.preloader && i === e.preloader[0]) return !0;
                if (i === e.content[0] || t.contains(e.content[0], i)) {
                    if (s) return !0
                } else if (n && t.contains(document, i)) return !0;
                return !1
            }
        },
        _addClassToMFP: function (t) {
            e.bgOverlay.addClass(t), e.wrap.addClass(t)
        },
        _removeClassFromMFP: function (t) {
            this.bgOverlay.removeClass(t), e.wrap.removeClass(t)
        },
        _hasScrollBar: function (t) {
            return (e.isIE7 ? s.height() : document.body.scrollHeight) > (t || y.height())
        },
        _setFocus: function () {
            (e.st.focus ? e.content.find(e.st.focus).eq(0) : e.wrap).focus()
        },
        _onFocusIn: function (i) {
            return i.target === e.wrap[0] || t.contains(e.wrap[0], i.target) ? void 0 : (e._setFocus(), !1)
        },
        _parseMarkup: function (e, i, s) {
            var n;
            s.data && (i = t.extend(s.data, i)), C(c, [e, i, s]), t.each(i, function (i, s) {
                if (void 0 === s || !1 === s) return !0;
                if ((n = i.split("_")).length > 1) {
                    var o = e.find(p + "-" + n[0]);
                    if (o.length > 0) {
                        var a = n[1];
                        "replaceWith" === a ? o[0] !== s[0] && o.replaceWith(s) : "img" === a ? o.is("img") ? o.attr("src", s) : o.replaceWith(t("<img>").attr("src", s).attr("class", o.attr("class"))) : o.attr(n[1], s)
                    }
                } else e.find(p + "-" + i).html(s)
            })
        },
        _getScrollbarSize: function () {
            if (void 0 === e.scrollbarSize) {
                var t = document.createElement("div");
                t.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(t), e.scrollbarSize = t.offsetWidth - t.clientWidth, document.body.removeChild(t)
            }
            return e.scrollbarSize
        }
    }, t.magnificPopup = {
        instance: null,
        proto: v.prototype,
        modules: [],
        open: function (e, i) {
            return x(), (e = e ? t.extend(!0, {}, e) : {}).isObj = !0, e.index = i || 0, this.instance.open(e)
        },
        close: function () {
            return t.magnificPopup.instance && t.magnificPopup.instance.close()
        },
        registerModule: function (e, i) {
            i.options && (t.magnificPopup.defaults[e] = i.options), t.extend(this.proto, i.proto), this.modules.push(e)
        },
        defaults: {
            disableOn: 0,
            key: null,
            midClick: !1,
            mainClass: "",
            preloader: !0,
            focus: "",
            closeOnContentClick: !1,
            closeOnBgClick: !0,
            closeBtnInside: !0,
            showCloseBtn: !0,
            enableEscapeKey: !0,
            modal: !1,
            alignTop: !1,
            removalDelay: 0,
            prependTo: null,
            fixedContentPos: "auto",
            fixedBgPos: "auto",
            overflowY: "auto",
            closeMarkup: '<button title="%title%" type="button" class="mfp-close">&#215;</button>',
            tClose: "Close (Esc)",
            tLoading: "Loading...",
            autoFocusLast: !0
        }
    }, t.fn.magnificPopup = function (i) {
        x();
        var s = t(this);
        if ("string" == typeof i)
            if ("open" === i) {
                var n, o = _ ? s.data("magnificPopup") : s[0].magnificPopup,
                    a = parseInt(arguments[1], 10) || 0;
                o.items ? n = o.items[a] : (n = s, o.delegate && (n = n.find(o.delegate)), n = n.eq(a)), e._openClick({
                    mfpEl: n
                }, s, o)
            } else e.isOpen && e[i].apply(e, Array.prototype.slice.call(arguments, 1));
        else i = t.extend(!0, {}, i), _ ? s.data("magnificPopup", i) : s[0].magnificPopup = i, e.addGroup(s, i);
        return s
    };
    var z, T, E, S = "inline",
        I = function () {
            E && (T.after(E.addClass(z)).detach(), E = null)
        };
    t.magnificPopup.registerModule(S, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function () {
                e.types.push(S), w(r + "." + S, function () {
                    I()
                })
            },
            getInline: function (i, s) {
                if (I(), i.src) {
                    var n = e.st.inline,
                        o = t(i.src);
                    if (o.length) {
                        var a = o[0].parentNode;
                        a && a.tagName && (T || (z = n.hiddenClass, T = b(z), z = "mfp-" + z), E = o.after(T).detach().removeClass(z)), e.updateStatus("ready")
                    } else e.updateStatus("error", n.tNotFound), o = t("<div>");
                    return i.inlineElement = o, o
                }
                return e.updateStatus("ready"), e._parseMarkup(s, {}, i), s
            }
        }
    });
    var P, O = "ajax",
        j = function () {
            P && t(document.body).removeClass(P)
        },
        A = function () {
            j(), e.req && e.req.abort()
        };
    t.magnificPopup.registerModule(O, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function () {
                e.types.push(O), P = e.st.ajax.cursor, w(r + "." + O, A), w("BeforeChange." + O, A)
            },
            getAjax: function (i) {
                P && t(document.body).addClass(P), e.updateStatus("loading");
                var s = t.extend({
                    url: i.src,
                    success: function (s, n, o) {
                        var a = {
                            data: s,
                            xhr: o
                        };
                        C("ParseAjax", a), e.appendContent(t(a.data), O), i.finished = !0, j(), e._setFocus(), setTimeout(function () {
                            e.wrap.addClass(m)
                        }, 16), e.updateStatus("ready"), C("AjaxContentAdded")
                    },
                    error: function () {
                        j(), i.finished = i.loadError = !0, e.updateStatus("error", e.st.ajax.tError.replace("%url%", i.src))
                    }
                }, e.st.ajax.settings);
                return e.req = t.ajax(s), ""
            }
        }
    });
    var M, $ = function (i) {
        if (i.data && void 0 !== i.data.title) return i.data.title;
        var s = e.st.image.titleSrc;
        if (s) {
            if (t.isFunction(s)) return s.call(e, i);
            if (i.el) return i.el.attr(s) || ""
        }
        return ""
    };
    t.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function () {
                var i = e.st.image,
                    s = ".image";
                e.types.push("image"), w(d + s, function () {
                    "image" === e.currItem.type && i.cursor && t(document.body).addClass(i.cursor)
                }), w(r + s, function () {
                    i.cursor && t(document.body).removeClass(i.cursor), y.off("resize" + p)
                }), w("Resize" + s, e.resizeImage), e.isLowIE && w("AfterChange", e.resizeImage)
            },
            resizeImage: function () {
                var t = e.currItem;
                if (t && t.img && e.st.image.verticalFit) {
                    var i = 0;
                    e.isLowIE && (i = parseInt(t.img.css("padding-top"), 10) + parseInt(t.img.css("padding-bottom"), 10)), t.img.css("max-height", e.wH - i)
                }
            },
            _onImageHasSize: function (t) {
                t.img && (t.hasSize = !0, M && clearInterval(M), t.isCheckingImgSize = !1, C("ImageHasSize", t), t.imgHidden && (e.content && e.content.removeClass("mfp-loading"), t.imgHidden = !1))
            },
            findImageSize: function (t) {
                var i = 0,
                    s = t.img[0],
                    n = function (o) {
                        M && clearInterval(M), M = setInterval(function () {
                            return s.naturalWidth > 0 ? void e._onImageHasSize(t) : (i > 200 && clearInterval(M), void(3 === ++i ? n(10) : 40 === i ? n(50) : 100 === i && n(500)))
                        }, o)
                    };
                n(1)
            },
            getImage: function (i, s) {
                var n = 0,
                    o = function () {
                        i && (i.img[0].complete ? (i.img.off(".mfploader"), i === e.currItem && (e._onImageHasSize(i), e.updateStatus("ready")), i.hasSize = !0, i.loaded = !0, C("ImageLoadComplete")) : 200 > ++n ? setTimeout(o, 100) : a())
                    },
                    a = function () {
                        i && (i.img.off(".mfploader"), i === e.currItem && (e._onImageHasSize(i), e.updateStatus("error", r.tError.replace("%url%", i.src))), i.hasSize = !0, i.loaded = !0, i.loadError = !0)
                    },
                    r = e.st.image,
                    l = s.find(".mfp-img");
                if (l.length) {
                    var c = document.createElement("img");
                    c.className = "mfp-img", i.el && i.el.find("img").length && (c.alt = i.el.find("img").attr("alt")), i.img = t(c).on("load.mfploader", o).on("error.mfploader", a), c.src = i.src, l.is("img") && (i.img = i.img.clone()), (c = i.img[0]).naturalWidth > 0 ? i.hasSize = !0 : c.width || (i.hasSize = !1)
                }
                return e._parseMarkup(s, {
                    title: $(i),
                    img_replaceWith: i.img
                }, i), e.resizeImage(), i.hasSize ? (M && clearInterval(M), i.loadError ? (s.addClass("mfp-loading"), e.updateStatus("error", r.tError.replace("%url%", i.src))) : (s.removeClass("mfp-loading"), e.updateStatus("ready")), s) : (e.updateStatus("loading"), i.loading = !0, i.hasSize || (i.imgHidden = !0, s.addClass("mfp-loading"), e.findImageSize(i)), s)
            }
        }
    });
    var L;
    t.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function (t) {
                return t.is("img") ? t : t.find("img")
            }
        },
        proto: {
            initZoom: function () {
                var t, i = e.st.zoom,
                    s = ".zoom";
                if (i.enabled && e.supportsTransition) {
                    var n, o, a = i.duration,
                        c = function (t) {
                            var e = t.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                s = "all " + i.duration / 1e3 + "s " + i.easing,
                                n = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                o = "transition";
                            return n["-webkit-" + o] = n["-moz-" + o] = n["-o-" + o] = n[o] = s, e.css(n), e
                        },
                        d = function () {
                            e.content.css("visibility", "visible")
                        };
                    w("BuildControls" + s, function () {
                        if (e._allowZoom()) {
                            if (clearTimeout(n), e.content.css("visibility", "hidden"), !(t = e._getItemToZoom())) return void d();
                            (o = c(t)).css(e._getOffset()), e.wrap.append(o), n = setTimeout(function () {
                                o.css(e._getOffset(!0)), n = setTimeout(function () {
                                    d(), setTimeout(function () {
                                        o.remove(), t = o = null, C("ZoomAnimationEnded")
                                    }, 16)
                                }, a)
                            }, 16)
                        }
                    }), w(l + s, function () {
                        if (e._allowZoom()) {
                            if (clearTimeout(n), e.st.removalDelay = a, !t) {
                                if (!(t = e._getItemToZoom())) return;
                                o = c(t)
                            }
                            o.css(e._getOffset(!0)), e.wrap.append(o), e.content.css("visibility", "hidden"), setTimeout(function () {
                                o.css(e._getOffset())
                            }, 16)
                        }
                    }), w(r + s, function () {
                        e._allowZoom() && (d(), o && o.remove(), t = null)
                    })
                }
            },
            _allowZoom: function () {
                return "image" === e.currItem.type
            },
            _getItemToZoom: function () {
                return !!e.currItem.hasSize && e.currItem.img
            },
            _getOffset: function (i) {
                var s, n = (s = i ? e.currItem.img : e.st.zoom.opener(e.currItem.el || e.currItem)).offset(),
                    o = parseInt(s.css("padding-top"), 10),
                    a = parseInt(s.css("padding-bottom"), 10);
                n.top -= t(window).scrollTop() - o;
                var r = {
                    width: s.width(),
                    height: (_ ? s.innerHeight() : s[0].offsetHeight) - a - o
                };
                return void 0 === L && (L = void 0 !== document.createElement("p").style.MozTransform), L ? r["-moz-transform"] = r.transform = "translate(" + n.left + "px," + n.top + "px)" : (r.left = n.left, r.top = n.top), r
            }
        }
    });
    var B = "iframe",
        N = function (t) {
            if (e.currTemplate[B]) {
                var i = e.currTemplate[B].find("iframe");
                i.length && (t || (i[0].src = "//about:blank"), e.isIE8 && i.css("display", t ? "block" : "none"))
            }
        };
    t.magnificPopup.registerModule(B, {
        options: {
            markup: '<div class="mfp-iframe-scaler"><div class="mfp-close"></div><iframe class="mfp-iframe" src="//about:blank" frameborder="0" allowfullscreen></iframe></div>',
            srcAction: "iframe_src",
            patterns: {
                youtube: {
                    index: "youtube.com",
                    id: "v=",
                    src: "//www.youtube.com/embed/%id%?autoplay=1"
                },
                vimeo: {
                    index: "vimeo.com/",
                    id: "/",
                    src: "//player.vimeo.com/video/%id%?autoplay=1"
                },
                gmaps: {
                    index: "//maps.google.",
                    src: "%id%&output=embed"
                }
            }
        },
        proto: {
            initIframe: function () {
                e.types.push(B), w("BeforeChange", function (t, e, i) {
                    e !== i && (e === B ? N() : i === B && N(!0))
                }), w(r + "." + B, function () {
                    N()
                })
            },
            getIframe: function (i, s) {
                var n = i.src,
                    o = e.st.iframe;
                t.each(o.patterns, function () {
                    return n.indexOf(this.index) > -1 ? (this.id && (n = "string" == typeof this.id ? n.substr(n.lastIndexOf(this.id) + this.id.length, n.length) : this.id.call(this, n)), n = this.src.replace("%id%", n), !1) : void 0
                });
                var a = {};
                return o.srcAction && (a[o.srcAction] = n), e._parseMarkup(s, a, i), e.updateStatus("ready"), s
            }
        }
    });
    var H = function (t) {
            var i = e.items.length;
            return t > i - 1 ? t - i : 0 > t ? i + t : t
        },
        W = function (t, e, i) {
            return t.replace(/%curr%/gi, e + 1).replace(/%total%/gi, i)
        };
    t.magnificPopup.registerModule("gallery", {
        options: {
            enabled: !1,
            arrowMarkup: '<button title="%title%" type="button" class="mfp-arrow mfp-arrow-%dir%"></button>',
            preload: [0, 2],
            navigateByImgClick: !0,
            arrows: !0,
            tPrev: "Previous (Left arrow key)",
            tNext: "Next (Right arrow key)",
            tCounter: "%curr% of %total%"
        },
        proto: {
            initGallery: function () {
                var i = e.st.gallery,
                    n = ".mfp-gallery";
                return e.direction = !0, !(!i || !i.enabled) && (o += " mfp-gallery", w(d + n, function () {
                    i.navigateByImgClick && e.wrap.on("click" + n, ".mfp-img", function () {
                        return e.items.length > 1 ? (e.next(), !1) : void 0
                    }), s.on("keydown" + n, function (t) {
                        37 === t.keyCode ? e.prev() : 39 === t.keyCode && e.next()
                    })
                }), w("UpdateStatus" + n, function (t, i) {
                    i.text && (i.text = W(i.text, e.currItem.index, e.items.length))
                }), w(c + n, function (t, s, n, o) {
                    var a = e.items.length;
                    n.counter = a > 1 ? W(i.tCounter, o.index, a) : ""
                }), w("BuildControls" + n, function () {
                    if (e.items.length > 1 && i.arrows && !e.arrowLeft) {
                        var s = i.arrowMarkup,
                            n = e.arrowLeft = t(s.replace(/%title%/gi, i.tPrev).replace(/%dir%/gi, "left")).addClass(g),
                            o = e.arrowRight = t(s.replace(/%title%/gi, i.tNext).replace(/%dir%/gi, "right")).addClass(g);
                        n.click(function () {
                            e.prev()
                        }), o.click(function () {
                            e.next()
                        }), e.container.append(n.add(o))
                    }
                }), w(u + n, function () {
                    e._preloadTimeout && clearTimeout(e._preloadTimeout), e._preloadTimeout = setTimeout(function () {
                        e.preloadNearbyImages(), e._preloadTimeout = null
                    }, 16)
                }), void w(r + n, function () {
                    s.off(n), e.wrap.off("click" + n), e.arrowRight = e.arrowLeft = null
                }))
            },
            next: function () {
                e.direction = !0, e.index = H(e.index + 1), e.updateItemHTML()
            },
            prev: function () {
                e.direction = !1, e.index = H(e.index - 1), e.updateItemHTML()
            },
            goTo: function (t) {
                e.direction = t >= e.index, e.index = t, e.updateItemHTML()
            },
            preloadNearbyImages: function () {
                var t, i = e.st.gallery.preload,
                    s = Math.min(i[0], e.items.length),
                    n = Math.min(i[1], e.items.length);
                for (t = 1; t <= (e.direction ? n : s); t++) e._preloadItem(e.index + t);
                for (t = 1; t <= (e.direction ? s : n); t++) e._preloadItem(e.index - t)
            },
            _preloadItem: function (i) {
                if (i = H(i), !e.items[i].preloaded) {
                    var s = e.items[i];
                    s.parsed || (s = e.parseEl(i)), C("LazyLoad", s), "image" === s.type && (s.img = t('<img class="mfp-img" />').on("load.mfploader", function () {
                        s.hasSize = !0
                    }).on("error.mfploader", function () {
                        s.hasSize = !0, s.loadError = !0, C("LazyLoadError", s)
                    }).attr("src", s.src)), s.preloaded = !0
                }
            }
        }
    });
    var D = "retina";
    t.magnificPopup.registerModule(D, {
        options: {
            replaceSrc: function (t) {
                return t.src.replace(/\.\w+$/, function (t) {
                    return "@2x" + t
                })
            },
            ratio: 1
        },
        proto: {
            initRetina: function () {
                if (window.devicePixelRatio > 1) {
                    var t = e.st.retina,
                        i = t.ratio;
                    (i = isNaN(i) ? i() : i) > 1 && (w("ImageHasSize." + D, function (t, e) {
                        e.img.css({
                            "max-width": e.img[0].naturalWidth / i,
                            width: "100%"
                        })
                    }), w("ElementParse." + D, function (e, s) {
                        s.src = t.replaceSrc(s, i)
                    }))
                }
            }
        }
    }), x()
}),
function (t, e) {
    "object" == typeof exports && "object" == typeof module ? module.exports = e() : "function" == typeof define && define.amd ? define("simpleParallax", [], e) : "object" == typeof exports ? exports.simpleParallax = e() : t.simpleParallax = e()
}(window, function () {
    return function (t) {
        var e = {};

        function i(s) {
            if (e[s]) return e[s].exports;
            var n = e[s] = {
                i: s,
                l: !1,
                exports: {}
            };
            return t[s].call(n.exports, n, n.exports, i), n.l = !0, n.exports
        }
        return i.m = t, i.c = e, i.d = function (t, e, s) {
            i.o(t, e) || Object.defineProperty(t, e, {
                enumerable: !0,
                get: s
            })
        }, i.r = function (t) {
            "undefined" != typeof Symbol && Symbol.toStringTag && Object.defineProperty(t, Symbol.toStringTag, {
                value: "Module"
            }), Object.defineProperty(t, "__esModule", {
                value: !0
            })
        }, i.t = function (t, e) {
            if (1 & e && (t = i(t)), 8 & e) return t;
            if (4 & e && "object" == typeof t && t && t.__esModule) return t;
            var s = Object.create(null);
            if (i.r(s), Object.defineProperty(s, "default", {
                    enumerable: !0,
                    value: t
                }), 2 & e && "string" != typeof t)
                for (var n in t) i.d(s, n, function (e) {
                    return t[e]
                }.bind(null, n));
            return s
        }, i.n = function (t) {
            var e = t && t.__esModule ? function () {
                return t.default
            } : function () {
                return t
            };
            return i.d(e, "a", e), e
        }, i.o = function (t, e) {
            return Object.prototype.hasOwnProperty.call(t, e)
        }, i.p = "", i(i.s = 0)
    }([function (t, e, i) {
        "use strict";

        function s(t, e) {
            for (var i = 0; i < e.length; i++) {
                var s = e[i];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        i.r(e);
        var n = new(function () {
                function t() {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), this.positions = {
                        top: 0,
                        bottom: 0,
                        height: 0
                    }
                }
                var e, i, n;
                return e = t, (i = [{
                    key: "setViewportTop",
                    value: function (t) {
                        return this.positions.top = t ? t.scrollTop : window.pageYOffset, this.positions
                    }
                }, {
                    key: "setViewportBottom",
                    value: function () {
                        return this.positions.bottom = this.positions.top + this.positions.height, this.positions
                    }
                }, {
                    key: "setViewportAll",
                    value: function (t) {
                        return this.positions.top = t ? t.scrollTop : window.pageYOffset, this.positions.height = t ? t.clientHeight : document.documentElement.clientHeight, this.positions.bottom = this.positions.top + this.positions.height, this.positions
                    }
                }]) && s(e.prototype, i), n && s(e, n), t
            }()),
            o = function (t) {
                return NodeList.prototype.isPrototypeOf(t) || HTMLCollection.prototype.isPrototypeOf(t) ? Array.from(t) : "string" == typeof t || t instanceof String ? document.querySelectorAll(t) : [t]
            },
            a = function () {
                for (var t, e = "transform webkitTransform mozTransform oTransform msTransform".split(" "), i = 0; void 0 === t;) t = void 0 !== document.createElement("div").style[e[i]] ? e[i] : void 0, i += 1;
                return t
            }(),
            r = function (t) {
                return !(!t || !t.complete || void 0 !== t.naturalWidth && 0 === t.naturalWidth)
            };

        function l(t) {
            return function (t) {
                if (Array.isArray(t)) {
                    for (var e = 0, i = new Array(t.length); e < t.length; e++) i[e] = t[e];
                    return i
                }
            }(t) || function (t) {
                if (Symbol.iterator in Object(t) || "[object Arguments]" === Object.prototype.toString.call(t)) return Array.from(t)
            }(t) || function () {
                throw new TypeError("Invalid attempt to spread non-iterable instance")
            }()
        }

        function c(t, e) {
            for (var i = 0; i < e.length; i++) {
                var s = e[i];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        var d = function () {
            function t(e, i) {
                ! function (t, e) {
                    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                }(this, t), this.element = e, this.elementContainer = e, this.settings = i, this.isVisible = !0, this.isInit = !1, this.oldTranslateValue = -1, this.init = this.init.bind(this), r(e) ? this.init() : this.element.addEventListener("load", this.init)
            }
            var e, i, s;
            return e = t, (i = [{
                key: "init",
                value: function () {
                    var t = this;
                    this.isInit || this.element.closest(".simpleParallax") || (!1 === this.settings.overflow && this.wrapElement(this.element), this.setTransformCSS(), this.getElementOffset(), this.intersectionObserver(), this.getTranslateValue(), this.animate(), this.settings.delay > 0 && setTimeout(function () {
                        t.setTransitionCSS()
                    }, 10), this.isInit = !0)
                }
            }, {
                key: "wrapElement",
                value: function () {
                    var t = this.element.closest("picture") || this.element,
                        e = document.createElement("div");
                    e.classList.add("simpleParallax"), e.style.overflow = "hidden", t.parentNode.insertBefore(e, t), e.appendChild(t), this.elementContainer = e
                }
            }, {
                key: "unWrapElement",
                value: function () {
                    var t = this.elementContainer;
                    t.replaceWith.apply(t, l(t.childNodes))
                }
            }, {
                key: "setTransformCSS",
                value: function () {
                    !1 === this.settings.overflow && (this.element.style[a] = "scale(".concat(this.settings.scale, ")")), this.element.style.willChange = "transform"
                }
            }, {
                key: "setTransitionCSS",
                value: function () {
                    this.element.style.transition = "transform ".concat(this.settings.delay, "s ").concat(this.settings.transition)
                }
            }, {
                key: "unSetStyle",
                value: function () {
                    this.element.style.willChange = "", this.element.style[a] = "", this.element.style.transition = ""
                }
            }, {
                key: "getElementOffset",
                value: function () {
                    var t = this.elementContainer.parentElement.getBoundingClientRect();
                    this.elementParentHeight = t.height;
                    var e = this.elementContainer.getBoundingClientRect();
                    if (this.elementHeight = e.height, this.elementTop = e.top + n.positions.top, this.settings.customContainer) {
                        var i = this.settings.customContainer.getBoundingClientRect();
                        this.elementTop = e.top - i.top + n.positions.top
                    }
                    this.elementBottom = this.elementHeight + this.elementTop
                }
            }, {
                key: "buildThresholdList",
                value: function () {
                    for (var t = [], e = 1; e <= this.elementHeight; e++) {
                        var i = e / this.elementHeight;
                        t.push(i)
                    }
                    return t
                }
            }, {
                key: "intersectionObserver",
                value: function () {
                    var t = {
                        root: null,
                        threshold: this.buildThresholdList()
                    };
                    this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), t), this.observer.observe(this.element)
                }
            }, {
                key: "intersectionObserverCallback",
                value: function (t) {
                    for (var e = t.length - 1; e >= 0; e--) t[e].isIntersecting ? this.isVisible = !0 : this.isVisible = !1
                }
            }, {
                key: "checkIfVisible",
                value: function () {
                    return this.elementBottom > n.positions.top && this.elementTop < n.positions.bottom
                }
            }, {
                key: "getRangeMax",
                value: function () {
                    var t = this.element.clientHeight;
                    this.rangeMax = t * this.settings.scale - t
                }
            }, {
                key: "getTranslateValue",
                value: function () {
                    var t = ((n.positions.bottom - this.elementTop) / ((n.positions.height + this.elementHeight) / 100)).toFixed(1);
                    if (t = Math.min(100, Math.max(0, t)), this.oldPercentage === t) return !1;
                    this.rangeMax || this.getRangeMax(), this.translateValue = t / 100 * this.rangeMax - this.rangeMax / 2;
                    var e = (this.elementHeight - this.elementParentHeight) / 2;
                    return e > 0 && e + this.translateValue < 0 && (this.translateValue = -e), e > 0 && e < this.translateValue && (this.translateValue = e), this.translateValue = this.translateValue.toFixed(0), this.oldTranslateValue !== this.translateValue && (this.oldPercentage = t, this.oldTranslateValue = this.translateValue, !0)
                }
            }, {
                key: "animate",
                value: function () {
                    var t, e = 0,
                        i = 0;
                    (this.settings.orientation.includes("left") || this.settings.orientation.includes("right")) && (i = "".concat(this.settings.orientation.includes("left") ? -1 * this.translateValue : this.translateValue, "px")), (this.settings.orientation.includes("up") || this.settings.orientation.includes("down")) && (e = "".concat(this.settings.orientation.includes("up") ? -1 * this.translateValue : this.translateValue, "px")), t = !1 === this.settings.overflow ? "translate3d(".concat(i, ", ").concat(e, ", 0) scale(").concat(this.settings.scale, ")") : "translate3d(".concat(i, ", ").concat(e, ", 0)"), this.element.style[a] = t
                }
            }]) && c(e.prototype, i), s && c(e, s), t
        }();

        function u(t, e) {
            for (var i = 0; i < e.length; i++) {
                var s = e[i];
                s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
            }
        }
        i.d(e, "default", function () {
            return _
        });
        var h, p, m, f = !0,
            g = !1,
            v = [],
            _ = function () {
                function t(e, i) {
                    ! function (t, e) {
                        if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
                    }(this, t), e && (this.elements = o(e), this.defaults = {
                        delay: .4,
                        orientation: "up",
                        scale: 1.3,
                        overflow: !1,
                        transition: "cubic-bezier(0,0,0,1)",
                        customContainer: !1
                    }, this.settings = Object.assign(this.defaults, i), "IntersectionObserver" in window || (f = !1), this.settings.customContainer && (this.customContainer = o(this.settings.customContainer)[0]), this.lastPosition = -1, this.resizeIsDone = this.resizeIsDone.bind(this), this.handleResize = this.handleResize.bind(this), this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this), this.init())
                }
                var e, i, s;
                return e = t, (i = [{
                    key: "init",
                    value: function () {
                        n.setViewportAll(this.customContainer);
                        for (var t = this.elements.length - 1; t >= 0; t--) {
                            var e = new d(this.elements[t], this.settings);
                            v.push(e)
                        }
                        h = v.length, g || (this.proceedRequestAnimationFrame(), window.addEventListener("resize", this.resizeIsDone), g = !0)
                    }
                }, {
                    key: "resizeIsDone",
                    value: function () {
                        clearTimeout(m), m = setTimeout(this.handleResize, 500)
                    }
                }, {
                    key: "handleResize",
                    value: function () {
                        n.setViewportAll(this.customContainer);
                        for (var t = h - 1; t >= 0; t--) v[t].getElementOffset(), v[t].getRangeMax();
                        this.lastPosition = -1
                    }
                }, {
                    key: "proceedRequestAnimationFrame",
                    value: function () {
                        if (n.setViewportTop(this.customContainer), this.lastPosition !== n.positions.top) {
                            n.setViewportBottom();
                            for (var t = h - 1; t >= 0; t--) this.proceedElement(v[t]);
                            p = window.requestAnimationFrame(this.proceedRequestAnimationFrame), this.lastPosition = n.positions.top
                        } else p = window.requestAnimationFrame(this.proceedRequestAnimationFrame)
                    }
                }, {
                    key: "proceedElement",
                    value: function (t) {
                        (!f || this.customContainer ? t.checkIfVisible() : t.isVisible) && t.getTranslateValue() && t.animate()
                    }
                }, {
                    key: "destroy",
                    value: function () {
                        var t = this,
                            e = [];
                        v = v.filter(function (i) {
                            return t.elements.includes(i.element) ? (e.push(i), !1) : i
                        });
                        for (var i = e.length - 1; i >= 0; i--) e[i].unSetStyle(), !1 === this.settings.overflow && e[i].unWrapElement();
                        (h = v.length) || (window.cancelAnimationFrame(p), window.removeEventListener("resize", this.handleResize))
                    }
                }]) && u(e.prototype, i), s && u(e, s), t
            }()
    }]).default
}),
function (t, e) {
    if ("function" == typeof define && define.amd) define(["exports"], e);
    else if ("undefined" != typeof exports) e(exports);
    else {
        var i = {};
        e(i), t.bodyScrollLock = i
    }
}(this, function (t) {
    "use strict";
    Object.defineProperty(t, "__esModule", {
        value: !0
    });
    var e = "undefined" != typeof window && window.navigator && window.navigator.platform && /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform),
        i = null,
        s = [],
        n = !1,
        o = -1,
        a = void 0,
        r = void 0,
        l = function (t) {
            var e = t || window.event;
            return e.preventDefault && e.preventDefault(), !1
        },
        c = function () {
            setTimeout(function () {
                void 0 !== r && (document.body.style.paddingRight = r, r = void 0), void 0 !== a && (document.body.style.overflow = a, a = void 0)
            })
        };
    t.disableBodyScroll = function (t, c) {
        var d;
        e ? t && !s.includes(t) && (s = [].concat(function (t) {
            if (Array.isArray(t)) {
                for (var e = 0, i = Array(t.length); e < t.length; e++) i[e] = t[e];
                return i
            }
            return Array.from(t)
        }(s), [t]), t.ontouchstart = function (t) {
            1 === t.targetTouches.length && (o = t.targetTouches[0].clientY)
        }, t.ontouchmove = function (e) {
            var i, s, n, a;
            1 === e.targetTouches.length && (s = t, a = (i = e).targetTouches[0].clientY - o, s && 0 === s.scrollTop && 0 < a ? l(i) : (n = s) && n.scrollHeight - n.scrollTop <= n.clientHeight && a < 0 ? l(i) : i.stopPropagation())
        }, n || (document.addEventListener("touchmove", l, {
            passive: !1
        }), n = !0)) : (d = c, setTimeout(function () {
            if (void 0 === r) {
                var t = !!d && !0 === d.reserveScrollBarGap,
                    e = window.innerWidth - document.documentElement.clientWidth;
                t && 0 < e && (r = document.body.style.paddingRight, document.body.style.paddingRight = e + "px")
            }
            void 0 === a && (a = document.body.style.overflow, document.body.style.overflow = "hidden")
        }), i || (i = t))
    }, t.clearAllBodyScrollLocks = function () {
        e ? (s.forEach(function (t) {
            t.ontouchstart = null, t.ontouchmove = null
        }), n && (document.removeEventListener("touchmove", l, {
            passive: !1
        }), n = !1), s = [], o = -1) : (c(), i = null)
    }, t.enableBodyScroll = function (t) {
        e ? (t.ontouchstart = null, t.ontouchmove = null, s = s.filter(function (e) {
            return e !== t
        }), n && 0 === s.length && (document.removeEventListener("touchmove", l, {
            passive: !1
        }), n = !1)) : i === t && (c(), i = null)
    }
}),
function () {
    var t, e, i;
    t = function () {
        function t(t, e) {
            var i, s;
            if (this.options = {
                    target: "instafeed",
                    get: "popular",
                    resolution: "thumbnail",
                    sortBy: "none",
                    links: !0,
                    mock: !1,
                    useHttp: !1
                }, "object" == typeof t)
                for (i in t) s = t[i], this.options[i] = s;
            this.context = null != e ? e : this, this.unique = this._genKey()
        }
        return t.prototype.hasNext = function () {
            return "string" == typeof this.context.nextUrl && this.context.nextUrl.length > 0
        }, t.prototype.next = function () {
            return !!this.hasNext() && this.run(this.context.nextUrl)
        }, t.prototype.run = function (e) {
            var i, s;
            if ("string" != typeof this.options.clientId && "string" != typeof this.options.accessToken) throw new Error("Missing clientId or accessToken.");
            if ("string" != typeof this.options.accessToken && "string" != typeof this.options.clientId) throw new Error("Missing clientId or accessToken.");
            return null != this.options.before && "function" == typeof this.options.before && this.options.before.call(this), "undefined" != typeof document && null !== document && ((s = document.createElement("script")).id = "instafeed-fetcher", s.src = e || this._buildUrl(), document.getElementsByTagName("head")[0].appendChild(s), i = "instafeedCache" + this.unique, window[i] = new t(this.options, this), window[i].unique = this.unique), !0
        }, t.prototype.parse = function (t) {
            var e, i, s, n, o, a, r, l, c, d, u, h, p, m, f, g, v, _, y, w, b, C, k, x, z, T, E, S;
            if ("object" != typeof t) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "Invalid JSON data"), !1;
                throw new Error("Invalid JSON response")
            }
            if (200 !== t.meta.code) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, t.meta.error_message), !1;
                throw new Error("Error from Instagram: " + t.meta.error_message)
            }
            if (0 === t.data.length) {
                if (null != this.options.error && "function" == typeof this.options.error) return this.options.error.call(this, "No images were returned from Instagram"), !1;
                throw new Error("No images were returned from Instagram")
            }
            if (null != this.options.success && "function" == typeof this.options.success && this.options.success.call(this, t), this.context.nextUrl = "", null != t.pagination && (this.context.nextUrl = t.pagination.next_url), "none" !== this.options.sortBy) switch (z = "least" === (T = "random" === this.options.sortBy ? ["", "random"] : this.options.sortBy.split("-"))[0], T[1]) {
                case "random":
                    t.data.sort(function () {
                        return .5 - Math.random()
                    });
                    break;
                case "recent":
                    t.data = this._sortBy(t.data, "created_time", z);
                    break;
                case "liked":
                    t.data = this._sortBy(t.data, "likes.count", z);
                    break;
                case "commented":
                    t.data = this._sortBy(t.data, "comments.count", z);
                    break;
                default:
                    throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.")
            }
            if ("undefined" != typeof document && null !== document && !1 === this.options.mock) {
                if (h = t.data, x = parseInt(this.options.limit, 10), null != this.options.limit && h.length > x && (h = h.slice(0, x)), a = document.createDocumentFragment(), null != this.options.filter && "function" == typeof this.options.filter && (h = this._filter(h, this.options.filter)), null != this.options.template && "string" == typeof this.options.template) {
                    for (r = "", "", "", S = document.createElement("div"), l = 0, w = h.length; l < w; l++) {
                        if ("object" != typeof (d = (c = h[l]).images[this.options.resolution])) throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                        f = "square", (g = d.width) > (m = d.height) && (f = "landscape"), g < m && (f = "portrait"), u = d.url, window.location.protocol.indexOf("http") >= 0 && !this.options.useHttp && (u = u.replace(/https?:\/\//, "//")), r += this._makeTemplate(this.options.template, {
                            model: c,
                            id: c.id,
                            link: c.link,
                            type: c.type,
                            image: u,
                            width: g,
                            height: m,
                            orientation: f,
                            caption: this._getObjectProperty(c, "caption.text"),
                            likes: c.likes.count,
                            comments: c.comments.count,
                            location: this._getObjectProperty(c, "location.name")
                        })
                    }
                    for (S.innerHTML = r, n = [], s = 0, i = S.childNodes.length; s < i;) n.push(S.childNodes[s]), s += 1;
                    for (_ = 0, b = n.length; _ < b; _++) k = n[_], a.appendChild(k)
                } else
                    for (y = 0, C = h.length; y < C; y++) {
                        if (c = h[y], p = document.createElement("img"), "object" != typeof (d = c.images[this.options.resolution])) throw o = "No image found for resolution: " + this.options.resolution + ".", new Error(o);
                        u = d.url, window.location.protocol.indexOf("http") >= 0 && !this.options.useHttp && (u = u.replace(/https?:\/\//, "//")), p.src = u, !0 === this.options.links ? ((e = document.createElement("a")).href = c.link, e.appendChild(p), a.appendChild(e)) : a.appendChild(p)
                    }
                if ("string" == typeof (E = this.options.target) && (E = document.getElementById(E)), null == E) throw o = 'No element with id="' + this.options.target + '" on page.', new Error(o);
                E.appendChild(a), document.getElementsByTagName("head")[0].removeChild(document.getElementById("instafeed-fetcher")), v = "instafeedCache" + this.unique, window[v] = void 0;
                try {
                    delete window[v]
                } catch (t) {
                    t
                }
            }
            return null != this.options.after && "function" == typeof this.options.after && this.options.after.call(this), !0
        }, t.prototype._buildUrl = function () {
            var t, e;
            switch ("https://api.instagram.com/v1", this.options.get) {
                case "popular":
                    t = "media/popular";
                    break;
                case "tagged":
                    if (!this.options.tagName) throw new Error("No tag name specified. Use the 'tagName' option.");
                    t = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case "location":
                    if (!this.options.locationId) throw new Error("No location specified. Use the 'locationId' option.");
                    t = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case "user":
                    if (!this.options.userId) throw new Error("No user specified. Use the 'userId' option.");
                    t = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.")
            }
            return e = "https://api.instagram.com/v1/" + t, null != this.options.accessToken ? e += "?access_token=" + this.options.accessToken : e += "?client_id=" + this.options.clientId, null != this.options.limit && (e += "&count=" + this.options.limit), e += "&callback=instafeedCache" + this.unique + ".parse"
        }, t.prototype._genKey = function () {
            var t;
            return "" + (t = function () {
                return (65536 * (1 + Math.random()) | 0).toString(16).substring(1)
            })() + t() + t() + t()
        }, t.prototype._makeTemplate = function (t, e) {
            var i, s, n, o, a;
            for (s = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/, i = t; s.test(i);) o = i.match(s)[1], a = null != (n = this._getObjectProperty(e, o)) ? n : "", i = i.replace(s, function () {
                return "" + a
            });
            return i
        }, t.prototype._getObjectProperty = function (t, e) {
            var i, s;
            for (s = (e = e.replace(/\[(\w+)\]/g, ".$1")).split("."); s.length;) {
                if (i = s.shift(), !(null != t && i in t)) return null;
                t = t[i]
            }
            return t
        }, t.prototype._sortBy = function (t, e, i) {
            var s;
            return s = function (t, s) {
                var n, o;
                return n = this._getObjectProperty(t, e), o = this._getObjectProperty(s, e), i ? n > o ? 1 : -1 : n < o ? 1 : -1
            }, t.sort(s.bind(this)), t
        }, t.prototype._filter = function (t, e) {
            var i, s, n, o;
            for (i = [], s = function (t) {
                    if (e(t)) return i.push(t)
                }, n = 0, o = t.length; n < o; n++) s(t[n]);
            return i
        }, t
    }(), e = this, i = function () {
        return t
    }, "function" == typeof define && define.amd ? define([], i) : "object" == typeof module && module.exports ? module.exports = i() : e.Instafeed = i()
}.call(this),
    function (t, e, i) {
        "use strict";
        try {
            document.createEvent("TouchEvent"), e.ideapark_is_mobile = !0
        } catch (t) {
            e.ideapark_is_mobile = !1
        }
        e.ideapark_is_responsinator = !1, document.referrer && (e.ideapark_is_responsinator = "www.responsinator.com" == document.referrer.split("/")[2]), e.ideapark_debounce = function (t, e, i) {
            var s;
            return function () {
                var n = this,
                    o = arguments,
                    a = i && !s;
                clearTimeout(s), s = setTimeout(function () {
                    s = null, i || t.apply(n, o)
                }, e), a && t.apply(n, o)
            }
        }, e.ideapark_isset = function (t) {
            return void 0 !== t
        }, e.ideapark_empty = function (t) {
            return void 0 === t || "object" == typeof t && null == t || "array" == typeof t && 0 == t.length || "string" == typeof t && "" == ideapark_alltrim(t) || 0 === t
        }, e.ideapark_is_array = function (t) {
            return "array" == typeof t
        }, e.ideapark_is_function = function (t) {
            return "function" == typeof t
        }, e.ideapark_is_object = function (t) {
            return "object" == typeof t
        }, e.ideapark_alltrim = function (t) {
            var e, i = void 0 !== arguments[1] ? arguments[1] : "a",
                s = 0,
                n = t.length - 1;
            if ("a" == i || "l" == i)
                for (e = 0; e < t.length; e++)
                    if (" " != t.substr(e, 1)) {
                        s = e;
                        break
                    } if ("a" == i || "r" == i)
                for (e = t.length - 1; e >= 0; e--)
                    if (" " != t.substr(e, 1)) {
                        n = e;
                        break
                    } return t.substring(s, n + 1)
        }, e.ideapark_ltrim = function (t) {
            return ideapark_alltrim(t, "l")
        }, e.ideapark_rtrim = function (t) {
            return ideapark_alltrim(t, "r")
        }, e.ideapark_dec2hex = function (t) {
            return Number(t).toString(16)
        }, e.ideapark_hex2dec = function (t) {
            return parseInt(t, 16)
        }, e.ideapark_in_array = function (t, e) {
            for (var i = !1, s = 0; s < e.length; s++)
                if (e[s] == t) {
                    i = !0;
                    break
                } return i
        }, e.ideapark_detectIE = function () {
            var t = window.navigator.userAgent,
                e = t.indexOf("MSIE ");
            if (e > 0) return parseInt(t.substring(e + 5, t.indexOf(".", e)), 10);
            if (t.indexOf("Trident/") > 0) {
                var i = t.indexOf("rv:");
                return parseInt(t.substring(i + 3, t.indexOf(".", i)), 10)
            }
            var s = t.indexOf("Edge/");
            return s > 0 && parseInt(t.substring(s + 5, t.indexOf(".", s)), 10)
        }, e.ideapark_loadScript = function (t, e, i) {
            var s = document.createElement("script");
            s.async = !(void 0 === i || !i), s.src = t, s.onerror = function () {
                void 0 !== e && e(new Error("Failed to load" + t))
            }, s.onload = function () {
                void 0 !== e && e()
            }, document.getElementsByTagName("head")[0].appendChild(s)
        }
    }(jQuery, this),
    function (t, e, i) {
        "use strict";
        t.migrateMute = !0, t.migrateTrace = !1, e.ideapark_videos = [], e.ideapark_players = [], e.ideapark_env_init = !1, e.ideapark_slick_paused = !1, e.ideapark_is_mobile = !1;
        try {
            document.createEvent("TouchEvent"), e.ideapark_is_mobile = !0
        } catch (t) {
            e.ideapark_is_mobile = !1
        }
        e.ideapark_is_responsinator = !1, document.referrer && (e.ideapark_is_responsinator = "www.responsinator.com" == document.referrer.split("/")[2]), e.old_windows_width = 0;
        var s = "undefined" != typeof window && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform),
            n = window.innerWidth < 992,
            o = t("body"),
            a = t(window),
            r = !0,
            l = !0,
            c = 0,
            d = !1,
            u = 0,
            h = t("#home-banners .banner").length,
            p = t("#home-banners"),
            m = !!t(".parallax,.parallax-lazy").length && "undefined" != typeof simpleParallax,
            f = null,
            g = t(".checkout-collaterals"),
            v = t(".woocommerce"),
            _ = 0,
            y = !1,
            w = t(".to-top-button"),
            b = 0,
            C = !1,
            k = !1,
            x = t(".js-product-info-carousel"),
            z = t(".slide", x),
            T = t(".slick-product"),
            E = t(".slide", T),
            S = [],
            I = [],
            P = null,
            O = 0;
        t(function () {
            if (t("html > head").append(t("<style>svg{width: initial;height: initial;}</style>")), t("#ajax-search,#ajax-search-result,.search-shadow,.menu-shadow").removeClass("hidden"), t("select.styled, .variations select").customSelect(), t("section.products").each(function () {
                    var e = t(this);
                    if (!e.hasClass("c-home-tabs--carousel")) {
                        e.addClass("c-home-tabs--carousel");
                        var i = e.find(".products:not(.owl-carousel)");
                        i.length && (i.addClass("h-carousel h-carousel--flex"), ideapark_init_home_tab_carousel(i))
                    }
                }), t(document).on("lazyloaded", function (t) {
                    m && t.target.className.indexOf("parallax-img") > -1 && setTimeout(function () {
                        I.push(new simpleParallax(t.target, {
                            scale: 1.5,
                            overflow: !0
                        }))
                    }, 100)
                }), (new bgsrcset).init(".bgimg"), ideapark_mega_menu_init(), ideapark_banners(), ideapark_stickyNav(), ideapark_init_product_tabs(), ideapark_init_home_tabs(), ideapark_init_home_slider(), ideapark_init_home_brands(), ideapark_init_home_review(), ideapark_to_top_button(), ideapark_init_home_instagram(), ideapark_parallax_init(), ideapark_init_product_gallery(), ideapark_init_thumbs(), ideapark_init_masonry(), ideapark_wp_vars.stickyMenu && t("#header .logo").waitForImages().done(function () {
                    c = t("#header").outerHeight(), ideapark_stickyNav()
                }), t(".container").fitVids(), t("#header .main-menu").addClass("initialized"), g.length) {
                g.css("position", "relative"), g.on("webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend", function (t) {
                    y = !1
                });
                var e = function () {
                    if (t(window).width() < 992) return _ > 0 && (_ = 0, y = !0, setTimeout(function () {
                        y = !1
                    }, 700), g.css({
                        top: _
                    })), void(f = null);
                    var e = t("#payment"),
                        i = t(window).scrollTop(),
                        s = i,
                        n = e.offset().top;
                    if (ideapark_wp_vars.stickyMenu) {
                        var o = t("body.sticky #header .main-menu"),
                            a = t("#wpadminbar");
                        o.length && (i += o.height()), a.length && (i += a.height())
                    }
                    var r = i - n;
                    if ((_ > 0 || 0 !== r) && !y && (r > 0 || 0 !== _)) {
                        var l = g.offset().top + g.outerHeight(),
                            c = r + l - (t(window).height() + s);
                        c > 0 && (r -= c), (c = r + l - (v.offset().top + v.outerHeight())) > 0 && (r -= c), (_ += r) < 0 && (_ = 0), y = !0, setTimeout(function () {
                            y = !1
                        }, 700), g.css({
                            top: _
                        })
                    }
                    f = null
                };
                e(), t(window).on("scroll resize", function () {
                    f || (f = setTimeout(e, 500))
                })
            }
            ideapark_scroll_actions(), ideapark_resize_actions(), t("body.preload").removeClass("preload")
        }), e.ideapark_scroll_actions = function () {
            ideapark_banners(), ideapark_stickyNav(), ideapark_to_top_button(), r = !1
        }, a.scroll(function () {
            window.requestAnimationFrame ? r || (r = !0, window.requestAnimationFrame(ideapark_scroll_actions)) : ideapark_scroll_actions()
        }), e.ideapark_resize_actions = function () {
            var t = window.innerWidth < 992,
                e = n !== t;
            n = t, ideapark_banners(), ideapark_stickyNav(), ideapark_submenu_direction(), ideapark_mega_menu_break(), ideapark_megamenu(), ideapark_wpadminbar_mobile(), e && !n && null !== P && T.length && (ideapark_init_thumbs() || setTimeout(function () {
                T.slick("refresh")
            }, 500), T.eq(P).trigger("click")), l = !1
        }, a.resize(function () {
            window.requestAnimationFrame ? l || (l = !0, window.requestAnimationFrame(ideapark_resize_actions)) : ideapark_resize_actions()
        }),
         t(".woocommerce-tabs .tabs li a").click(function () {
            var e = t(this),
                i = t(e.attr("href")),
                s = t(this).parent("li");
            s.hasClass("active") && t(window).width() < 992 && i.hasClass("current") ? s.parent("ul").toggleClass("expand") : (t(".woocommerce-tabs .tabs li.active").removeClass("active"), s.addClass("active"), t(".woocommerce-tabs .current").removeClass("current"), setTimeout(function () {
                i.addClass("current")
            }, 100), s.parent("ul").removeClass("expand"))
        }),
         t(document).on("click", ".product-categories > ul li.has-children > a:not(.js-more), .product-categories > ul li.menu-item-has-children > a:not(.js-more)", function () {
            return t(this).closest(".sub-menu .sub-menu").length > 0 || (t(window).width() >= 992 || (t(this).attr("href") ? void 0 : (t(this).parent().children(".js-more").trigger("click"), !1)))
        }).on("click", ".js-more", function () {
            return t(window).width() >= 992 || (0 === S.length && t(document.body).addClass("submenu-open"), S.push(t(this).closest("li")), t(this).closest("li").addClass("selected"), !1)
        }).on("click", "#header .search, #header .mobile-search, #search-close", function () {
            return t("html").toggleClass("search-open"), o.toggleClass("search-open").hasClass("search-open") ? (bodyScrollLock.disableBodyScroll(t("#ajax-search-result")[0]), setTimeout(function () {
                t("#ajax-search-input").focus()
            }, 200)) : bodyScrollLock.clearAllBodyScrollLocks(), !t(".js-ajax-search-result").text() && t("#ajax-search-input").val().trim() && ajaxSearchFunction(), !1
        }).on("click", ".mobile-menu, .mobile-menu-close, .menu-open .menu-shadow", function () {
            return t("html").toggleClass("menu-open"), o.toggleClass("menu-open").hasClass("menu-open") ? bodyScrollLock.disableBodyScroll(t(".product-categories > .menu")[0]) : bodyScrollLock.clearAllBodyScrollLocks(), !1
        }).on("click", ".mobile-sidebar, .mobile-sidebar-close, .sidebar-open .menu-shadow", function () {
            return t("html").toggleClass("sidebar-open"), s && 0 !== t("#ip-shop-sidebar").find("[class~=select2]").length ? o.toggleClass("sidebar-open") : o.toggleClass("sidebar-open").hasClass("sidebar-open") ? bodyScrollLock.disableBodyScroll(t("#ip-shop-sidebar")[0]) : bodyScrollLock.clearAllBodyScrollLocks(), !1
        }).on("click", ".collaterals .coupon .header a", function () {
            var e = t(".collaterals .coupon");
            return e.toggleClass("opened"), e.hasClass("opened") && setTimeout(function () {
                e.find("input[type=text]").first().focus()
            }, 500), !1
        }).on("click", ".collaterals .shipping-calculator .header a", function () {
            t(this).closest(".shipping-calculator").toggleClass("opened")
        }).on("click", ".ip-prod-quantity-minus", function (e) {
            e.stopPropagation(), e.preventDefault();
            var i = t(this).parent().find("input[type=number]"),
                s = i.val().trim(),
                n = i.attr("min");
            --s < ("" !== n ? n : 1) && (s = "" !== n ? n : 1), i.val(s), i.trigger("change")
        }).on("click", ".ip-prod-quantity-plus", function (e) {
            e.stopPropagation(), e.preventDefault();
            var i = t(this).parent().find("input[type=number]"),
                s = i.val().trim(),
                n = i.attr("max");
            s++, "" !== n && s > n && (s = n), s > 0 && (i.val(s), i.trigger("change"))
        }).on("click", "#ip-checkout-apply-coupon", function () {
            var e = t(this).closest("form");
            if (e.is(".processing")) return !1;
            e.addClass("processing").block({
                message: null,
                overlayCSS: {
                    background: "#fff",
                    opacity: .6
                }
            });
            var i = {
                security: wc_checkout_params.apply_coupon_nonce,
                coupon_code: e.find('input[name="coupon_code"]').val()
            };
            return t.ajax({
                type: "POST",
                url: wc_checkout_params.wc_ajax_url.toString().replace("%%endpoint%%", "apply_coupon"),
                data: i,
                success: function (i) {
                    t(".woocommerce-error, .woocommerce-message").remove(), e.removeClass("processing").unblock(), i && (e.before(i), t(".collaterals .coupon.opened").removeClass("opened"), t(document.body).trigger("update_checkout", {
                        update_shipping_method: !1
                    }))
                },
                dataType: "html"
            }), !1
        }), t(".variations_form").on("woocommerce_variation_select_change", function () {
            t(".variations_form select").each(function () {
                t(this).next("span.customSelect").html(t(this).find(":selected").html())
            }), void 0 !== x && x.length && setTimeout(function () {
                x.trigger("to.owl.carousel", 0);
                var e = z.first().children("a");
                t("<img/>").attr("src", e.attr("href")).load(function () {
                    e.attr("data-size", this.width + "x" + this.height)
                })
            }, 500)
        }), t("#header .mobile-menu-back").click(function () {
            S.length && (S.pop().removeClass("selected"), 0 === S.length && t(document.body).removeClass("submenu-open"));
            return !1
        }), t("#ip-wishlist-share-link").focus(function () {
            t(this).select()
        }), t(".menu-item").click(function () {
            t(this).toggleClass("open")
        }), t("#customer_login .tab-header").click(function () {
            return t("#customer_login .tab-header.active").removeClass("active"), t(this).addClass("active"), t("#customer_login .wrap li.active").removeClass("active"), t("#customer_login .wrap li." + t(this).data("tab-class")).addClass("active"), !1
        }), t(".product-categories > ul").append('<li class="space-item"></li>'), t("#header .top-menu .menu > li").each(function () {
            t(".product-categories > ul").append(t(this).clone())
        }), t("#ajax-search-input").on("input", function () {
            "search-type-3" != ideapark_wp_vars.searchType && (t(this).val().trim().length > 1 ? (t(".js-ajax-search-result").removeClass("loaded"), t(".search-shadow").addClass("loading"), ajaxSearchFunction()) : (t(".search-shadow").removeClass("loading"), t(".js-ajax-search-result").removeClass("loaded")))
        }).on("keydown", function (e) {
            13 == e.keyCode ? (e.preventDefault(), t(".search-shadow").removeClass("loading"), t("#ajax-search-input").val().trim() && t("#ajax-search form").submit()) : 27 == e.keyCode && (t(".search-shadow").removeClass("loading"), t("#mobilesearch-close").trigger("click"), t("#search-close").trigger("click"))
        }), t("#ajax-search form").on("submit", function () {
            if (!t("#ajax-search-input").val().trim()) return !1
        }), t(".ip-watch-video-btn").click(function () {
            var e = t("#ip-quickview"),
                i = t("#ip_hidden_product_video");
            if (o.hasClass("quickview-open") || 1 != i.length) return !1;
            var s = t('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>');
            return o.append(s), o.addClass("quickview-open"), e.html(i.val()), e.fitVids(), t.magnificPopup.open({
                mainClass: "ip-mfp-quickview ip-mfp-fade-in",
                closeMarkup: '<a class="mfp-close ip-mfp-close video"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
                removalDelay: 180,
                items: {
                    src: e,
                    type: "inline"
                },
                callbacks: {
                    open: function () {
                        s.removeClass("loading"), s.one("touchstart", function () {
                            t.magnificPopup.close()
                        })
                    },
                    beforeClose: function () {
                        s.addClass("mfp-removing")
                    },
                    close: function () {
                        s.remove(), o.removeClass("quickview-open")
                    }
                }
            }), !1
        }), t(".ip-quickview-btn").click(function () {
            var i, s = t("#ip-quickview"),
                n = t(this).data("product_id"),
                a = {
                    product_id: n
                };
            if (o.hasClass("quickview-open")) return !1;
            if (n) {
                var r = t('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>');
                o.append(r), setTimeout(function () {
                    o.addClass("quickview-open")
                }, 100), "undefined" != typeof wc_add_to_cart_params ? i = wc_add_to_cart_params.wc_ajax_url.toString().replace("%%endpoint%%", "ip_ajax_load_product") : (i = ip_wp_vars.ajaxUrl, a.action = "ip_ajax_load_product"), e.ip_quickview_get_product = t.ajax({
                    type: "POST",
                    url: i,
                    data: a,
                    dataType: "html",
                    cache: !1,
                    headers: {
                        "cache-control": "no-cache"
                    },
                    beforeSend: function () {
                        "object" === e.window.ip_quickview_get_product && e.ip_quickview_get_product.abort()
                    },
                    error: function (t, e, i) {
                        r.remove(), o.removeClass("quickview-open")
                    },
                    success: function (e) {
                        s.html(e), t.magnificPopup.open({
                            mainClass: "ip-mfp-quickview ip-mfp-fade-in",
                            closeMarkup: '<a class="mfp-close ip-mfp-close"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
                            removalDelay: 300,
                            items: {
                                src: s,
                                type: "inline"
                            },
                            callbacks: {
                                open: function () {
                                    r.removeClass("loading"), r.one("touchstart", function () {
                                        t.magnificPopup.close()
                                    });
                                    var e = t(".slick-product-qv", s);
                                    1 == e.length && t(".slick-product-qv:not(.owl-carousel)").addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).owlCarousel({
                                        items: 1,
                                        loop: !1,
                                        margin: 0,
                                        nav: !0,
                                        dots: !1,
                                        rtl: !!ideapark_wp_vars.isRtl,
                                        navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                                        onInitialized: ideapark_owl_hide_arrows
                                    }), t("select.styled, .variations select", s).customSelect();
                                    var i = s.find("#product-" + n),
                                        o = i.find("form.cart");
                                    t(".product-images", s).waitForImages().done(function () {
                                        i.hasClass("product-type-variable") && (o.wc_variation_form().find(".variations select:eq(0)").change(), t(".variations_form").on("woocommerce_variation_select_change", function () {
                                            t(".variations_form select").each(function () {
                                                t(this).next("span.customSelect").html(t(this).find(":selected").html())
                                            }), void 0 !== e && e.length && setTimeout(function () {
                                                e.trigger("to.owl.carousel", 0);
                                                var i = e.find(".slide").first().children("a");
                                                t("<img/>").attr("src", i.attr("href")).load(function () {
                                                    i.attr("data-size", this.width + "x" + this.height)
                                                })
                                            }, 500)
                                        }))
                                    })
                                },
                                beforeClose: function () {
                                    o.removeClass("quickview-open")
                                },
                                close: function () {
                                    r.remove()
                                }
                            }
                        })
                    }
                })
            }
            return !1
        }), t(".entry-content a > img").each(function () {
            var e, i = t(this).closest("a");
            i.attr("href").search(/\.(gif|jpg|png|jpeg)$/i) >= 0 && i.magnificPopup({
                type: "image",
                closeOnContentClick: !0,
                image: {
                    verticalFit: !0
                },
                mainClass: "ip-mfp-quickview ip-mfp-fade-in",
                closeMarkup: '<a class="mfp-close ip-mfp-close"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
                removalDelay: 300,
                callbacks: {
                    beforeOpen: function () {
                        e = t('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>'), o.append(e), e.one("touchstart", function () {
                            t.magnificPopup.close()
                        })
                    },
                    open: function () {
                        o.addClass("quickview-open")
                    },
                    imageLoadComplete: function () {
                        e.removeClass("loading")
                    },
                    beforeClose: function () {
                        e.addClass("mfp-removing"), o.removeClass("quickview-open")
                    },
                    close: function () {
                        e.remove()
                    }
                }
            })
        }), w.click(function () {
            return t("html, body").animate({
                scrollTop: 0
            }, 800), !1
        }), e.ideapark_refresh_parallax = ideapark_debounce(function () {}, 500), e.ideapark_third_party_reload = function () {
            "function" == typeof e.sbi_init && (window.sbiCommentCacheStatus = 0, e.sbi_init(function (t, i) {
                e.sbi_cache_all(t, i)
            }))
        }, e.ideapark_parallax_destroy = function () {
            m && I.length
        }, e.ideapark_parallax_init = function () {
            if (m) {
                var t = document.querySelectorAll(".parallax");
                I.push(new simpleParallax(t, {
                    scale: 1.5,
                    overflow: !0
                }))
            }
        }, e.ideapark_mega_menu_break = function (e) {
            if (e && (b = 0), a.width() < 992) 1 === b && (t(".mega-menu-break").each(function () {
                t(this).css({
                    height: ""
                }).removeClass("mega-menu-break")
            }), b = 0);
            else if (0 === b) {
                var i = t(".main-menu .menu").find(".col-2,.col-3,.col-4");
                i.length && (i.each(function () {
                    var e = t(this),
                        i = 0;
                    e.hasClass("col-2") ? i = 2 : e.hasClass("col-3") ? i = 3 : e.hasClass("col-4") && (i = 4);
                    var s = e.find(".sub-menu").first(),
                        n = s.css("padding-top") ? parseInt(s.css("padding-top").replace("px", "")) : 0,
                        o = s.css("padding-bottom") ? parseInt(s.css("padding-bottom").replace("px", "")) : 0,
                        a = [],
                        r = 0;
                    s.children("li").each(function () {
                        var e = t(this).outerHeight();
                        e > r && (r = e), e, a.push(e)
                    });
                    var l = 0,
                        c = 0,
                        d = r - 1;
                    do {
                        d++, c++, l = 1;
                        for (var u = 0, h = 0; h < a.length; h++)(u += a[h]) > d && (u = 0, h--, l++)
                    } while (l > i && c < 1e3);
                    l <= i && d > 0 && s.css({
                        height: d + n + o + "px"
                    }).addClass("mega-menu-break")
                }), b = 1)
            }
        }, e.ideapark_init_home_slider = function () {
            var e = t(".js-slider-carousel:not(.owl-carousel)");
            if (e.length) {
                var i = t("#home-slider"),
                    s = i.data("slider_effect"),
                    n = i.data("slider_interval"),
                    o = !i.data("slider_hide_dots"),
                    a = {
                        items: 1,
                        loop: !0,
                        margin: 0,
                        nav: !i.data("slider_hide_arrows"),
                        dots: o,
                        rtl: !!ideapark_wp_vars.isRtl,
                        navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                        onInitialized: function (t) {
                            ideapark_owl_hide_arrows(t), setTimeout(function () {
                                e.removeClass("preloading")
                            }, 100)
                        }
                    };
                n && (a.autoplay = !0, a.autoplayTimeout = n, a.autoplayHoverPause = !0), "fade" === s && (a.animateOut = "fadeOut");
                var r = t(".slick .bgimg").first();
                if (1 === r.length) {
                    var l = new Image;
                    l.onload = function () {
                        e.hasClass("preloading") && (e.on("transitionend webkitTransitionEnd oTransitionEnd", function () {
                            t(".slick-preloader").remove()
                        }), e.addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).owlCarousel(a))
                    };
                    var c = r.css("background-image");
                    if (null !== c.match(/\((.*?)\)/)) {
                        var d = c.match(/\((.*?)\)/)[1].replace(/('|")/g, "");
                        l.src = d, l.complete && l.onload()
                    } else l.onload()
                }
            }
        }, e.ideapark_init_home_review = function () {
            t(".js-review-carousel:not(.owl-carousel)").addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).owlCarousel({
                items: 1,
                loop: !1,
                margin: 0,
                nav: !0,
                dots: !1,
                rtl: !!ideapark_wp_vars.isRtl,
                navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                responsive: {
                    0: {
                        dots: !0,
                        nav: !1
                    },
                    480: {
                        nav: !0,
                        dots: !1
                    }
                },
                onInitialized: ideapark_owl_hide_arrows
            })
        }, e.ideapark_init_home_brands = function () {
            t(".js-brands-carousel:not(.owl-carousel)").addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).owlCarousel({
                center: !1,
                autoWidth: !0,
                loop: !1,
                margin: 0,
                nav: !0,
                dots: !1,
                rtl: !!ideapark_wp_vars.isRtl,
                navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                responsive: {
                    0: {
                        dots: !0,
                        nav: !1
                    },
                    768: {
                        nav: !0,
                        dots: !1
                    }
                },
                onInitialized: ideapark_owl_hide_arrows
            })
        }, e.ideapark_init_view_more_item = function (e, i, s) {
            if (e && e.length) {
                var n = e.find(".js-view-more-item"),
                    o = !1;
                n.length || (n = t('<div class="product product--view-more js-view-more-item"><div class="ip-shop-loop-wrap ip-shop-loop-wrap--view-more"><a class="button" href="' + i + '">' + ideapark_wp_vars.viewMore + (s ? " " + s : "") + "</a></div></div>"), o = !0);
                var a = e.find(".products");
                o && (a.append(n), e.addClass("js-view-more-tab"))
            }
        }, e.ideapark_init_home_tab_carousel = function (e) {
            e.each(function () {
                var e = t(this),
                    i = e.hasClass("products--mobile-small") ? {
                        0: {
                            dots: !0,
                            nav: !1,
                            margin: 30
                        },
                        601: {
                            nav: !0,
                            dots: !1,
                            margin: 0
                        }
                    } : {
                        0: {
                            dots: !0,
                            nav: !1,
                            margin: 30
                        },
                        360: {
                            dots: !0,
                            nav: !1,
                            margin: 0
                        },
                        480: {
                            nav: !0,
                            dots: !1,
                            margin: 0
                        }
                    };
                e.addClass("products--" + e.children().length).addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).owlCarousel({
                    center: !1,
                    autoWidth: !0,
                    loop: !1,
                    margin: 0,
                    nav: !0,
                    dots: !1,
                    rtl: !!ideapark_wp_vars.isRtl,
                    navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                    responsive: i,
                    onInitialized: ideapark_owl_hide_arrows
                })
            })
        }, e.ideapark_init_home_tabs = function () {
            t(".c-home-tabs:not(.init)").each(function () {
                var e = t(this);
                e.hasClass("js-product-carousel") && (e.find(".home-tab").each(function () {
                    var e = t(this),
                        i = e.find(".product").length;
                    e.data("view-more") && e.data("per-page") == i && ideapark_init_view_more_item(e, e.data("view-more"))
                }), ideapark_init_home_tab_carousel(e.find(".products:not(.owl-carousel)")));
                var i = e.find(".home-tabs li");
                if (i.length) {
                    var s = function () {
                        var n = document.getElementById("ideapark-core-css");
                        if (n)
                            if ("all" === n.getAttribute("media") && i.first().outerWidth() > 0) {
                                var o = 0;
                                i.each(function () {
                                    var e = t(this);
                                    e.outerWidth() > o && (o = e.outerWidth())
                                }), e.find(".home-tabs").css({
                                    width: o + 10
                                })
                            } else setTimeout(s, 100)
                    };
                    s(), e.find(".home-tabs li a").click(function () {
                        var e = t(this),
                            i = e.closest(".c-home-tabs"),
                            s = t(e.attr("href")),
                            n = t(this).parent("li");
                        return n.hasClass("current") ? (n.parent("ul").toggleClass("expand"), !1) : (t(".home-tabs li.current", i).removeClass("current"), n.addClass("current"), t(".home-tab.current", i).removeClass("current"), t(".home-tab.visible", i).removeClass("visible"), s.addClass("visible"), setTimeout(function () {
                            s.addClass("current"), setTimeout(function () {
                                ideapark_owl_hide_arrows(s), s.find("[data-src]").each(function () {
                                    var e = t(this);
                                    e.attr("srcset", e.attr("data-srcset")), e.attr("src", e.attr("data-src")), e.attr("sizes", e.attr("data-sizes")), e.removeAttr("data-srcset"), e.removeAttr("data-src"), e.removeAttr("data-sizes")
                                })
                            }, 500)
                        }, 100), n.parent("ul").removeClass("expand"), !1)
                    })
                }
                e.addClass("init")
            })
        }, e.ideapark_init_product_tabs = function () {
            var e = t(".woocommerce-tabs .tabs li");
            if (e.length) {
                var i = function () {
                    var s = document.getElementById("ideapark-core-css");
                    if (s && "all" === s.getAttribute("media") && e.first().outerWidth() > 0) {
                        var n = 0;
                        e.each(function () {
                            var e = t(this);
                            e.outerWidth() > n && (n = e.outerWidth())
                        }), t(".woocommerce-tabs .tabs").css({
                            width: n + 10
                        })
                    } else setTimeout(i, 100)
                };
                i()
            }
        }, e.ideapark_wpadminbar_mobile = function () {
            var e = t("#wpadminbar");
            if (e.length) {
                var i = a.width();
                i > 782 && e.hasClass("mobile") ? e.removeClass("mobile") : i <= 782 && !e.hasClass("mobile") && e.addClass("mobile")
            }
        }, e.ideapark_submenu_direction = function (e) {
            if (e && (C = !1), t(window).width() < 992 || C) return !0;
            var i = t(".product-categories > ul");
            if (i.length) {
                var s = Math.round(i.offset().left + i.width() / 2 - 40);
                i.children("li").each(function () {
                    var e = t(this);
                    e.offset().left <= s && !e.hasClass("ltr") && (e.removeClass("rtl"), e.addClass("ltr")), e.offset().left > s && !e.hasClass("rtl") && (e.removeClass("ltr"), e.addClass("rtl"))
                })
            }
            C = !0
        }, e.ideapark_megamenu = function () {
            var e = a.width();
            if (e >= 992) {
                var i = t('.main-menu .product-categories > ul > li[class*="col-"] > ul');
                if (i.length) {
                    var s = t(".main-menu .container").first(),
                        n = s.offset().left,
                        o = n + s.width();
                    i.each(function () {
                        var e, i = t(this);
                        i.attr("data-left") ? i.css({
                            left: i.attr("data-left")
                        }) : i.attr("data-left", i.css("left"));
                        var s = i.offset().left,
                            a = s + i.width();
                        s < n && (e = Math.round(parseInt(i.attr("data-left").replace("px", "")) + n - s + 1), i.css({
                            left: e
                        })), a > o && (e = Math.round(parseInt(i.attr("data-left").replace("px", "")) - a + o - 1), i.css({
                            left: e
                        }))
                    }), k = !0
                }
            }
            k && e < 992 && t('.main-menu .product-categories > ul > li[class*="col-"] > ul[data-left]').each(function () {
                t(this).css({
                    left: 0
                }), k = !1
            })
        }, e.ideapark_mega_menu_init = function () {
            ideapark_mega_menu_break(!0), ideapark_submenu_direction(!0), ideapark_megamenu()
        }, e.ideapark_stickyNav = function () {
            if (ideapark_wp_vars.stickyMenu && c) {
                var e = t(window).scrollTop(),
                    i = o.hasClass("menu-open") || o.hasClass("sidebar-open");
                e > c && !o.hasClass("sticky") ? (t("#header").css({
                    height: c
                }), d = !0, i || t("#header .main-menu").hide(), o.addClass("sticky"), i || t("#header .main-menu").fadeTo(300, 1)) : e <= c && o.hasClass("sticky") && (o.removeClass("sticky"), d && (t("#header").css({
                    height: ""
                }), c = t("#header").outerHeight(), d = !1, m && ideapark_refresh_parallax()))
            }
        }, e.ideapark_banners = function () {
            var e = a;
            if (h && e.width() <= 991) {
                var i = e.scrollTop(),
                    s = e.height(),
                    n = t(".banner", p).first().outerHeight(),
                    r = p.offset().top,
                    l = o.hasClass("sticky") ? t(".main-menu").outerHeight() + 50 : 0,
                    c = r - l - (r + n - s),
                    d = Math.round((i - (r + n - s)) / c * h);
                (i < r - l && i >= r + n - s || u != d || i < r + n - s && 1 != u || i > r - l && u != h) && (d <= 0 ? d = 1 : d >= h && (d = h), p.hasClass("shift-" + d) || (p.removeClass(), p.addClass("shift-" + d)), u = d), p.removeClass("preloading")
            }
        }, e.ideapark_open_photo_swipe = function (e, i) {
            var s, o, a, r, l, c = [];
            z.each(function () {
                s = t(this), o = s.children("a"), a = o.children("img"), r = o.data("size").split("x"), l = {
                    src: o.attr("href"),
                    w: parseInt(r[0], 10),
                    h: parseInt(r[1], 10),
                    msrc: a.attr("src"),
                    el: o[0]
                }, c.push(l)
            });
            var d = {
                    index: i,
                    showHideOpacity: !0,
                    bgOpacity: 1,
                    loop: !1,
                    closeOnVerticalDrag: !1,
                    mainClass: z.length > 1 ? "pswp--minimal--dark" : "pswp--minimal--dark pswp--single--image",
                    barsSize: {
                        top: 0,
                        bottom: 0
                    },
                    captionEl: !1,
                    fullscreenEl: !1,
                    zoomEl: !1,
                    shareEl: !1,
                    counterEl: !1,
                    tapToClose: !0,
                    tapToToggleControls: !1
                },
                u = t(".pswp")[0],
                h = new PhotoSwipe(u, PhotoSwipeUI_Default, c, d);
            h.init(), h.listen("initialZoomIn", function () {
                T.length && !n && (t(this).product_thumbnails_speed = T.slick("slickGetOption", "speed"), T.slick("slickSetOption", "speed", 0))
            });
            var p = i;
            h.listen("beforeChange", function (t) {
                p += t, x.trigger("to.owl.carousel", p)
            }), h.listen("close", function () {
                T.length && !n && T.slick("slickSetOption", "speed", t(this).product_thumbnails_speed)
            })
        }, e.ajaxSearchFunction = ideapark_debounce(function () {
            var e = t("#ajax-search-input").val();
            t.ajax({
                url: ideapark_wp_vars.ajaxUrl,
                type: "POST",
                data: {
                    action: "ideapark_ajax_search",
                    s: e
                },
                success: function (e) {
                    t(".js-ajax-search-result").html(e).addClass("loaded"), t(".search-shadow").removeClass("loading")
                }
            })
        }, 500), e.ideapark_to_top_button = function () {
            w.length && (a.scrollTop() > 500 ? w.hasClass("active") || w.addClass("active") : w.hasClass("active") && w.removeClass("active"))
        }, e.ideapark_init_home_instagram = function () {
            var e = t("#instafeed");
            if (e.length && "" !== e.data("token")) {
                var i = '<div class="home-instagram-item"><a href="{{link}}" target="_blank">' + (ideapark_wp_vars.lazyload ? '<img class="lazyload" data-src="{{image}}" alt=""/>' : '<img src="{{image}}" alt=""/>') + "</a></div>";
                new Instafeed({
                    get: "user",
                    limit: 6,
                    resolution: "standard_resolution",
                    userId: e.data("user-id"),
                    accessToken: e.data("token"),
                    template: i
                }).run()
            }
        }, e.ideapark_owl_hide_arrows = function (e) {
            var i = e instanceof jQuery ? e : t(e.target),
                s = i.find(".owl-prev"),
                n = i.find(".owl-next");
            s.length && n.length && (s.hasClass("disabled") && n.hasClass("disabled") ? (s.addClass("h-hidden"), n.addClass("h-hidden")) : (s.removeClass("h-hidden"), n.removeClass("h-hidden")))
        }, e.ideapark_init_thumbs = function () {
            return !(n || !T.length || T.hasClass("init")) && (T.on("init", function () {
                E.bind("click", function () {
                    var e = t(this);
                    if (!e.hasClass("current")) {
                        var i = e.index() > O ? "right" : "left";
                        O = e.index(), t(".slide.current", T).removeClass("current"), e.addClass("current");
                        var s = function () {
                            t(".slide.current", T).hasClass("slick-active") || ("right" === i ? T.slick("slickNext") : T.slick("slickPrev"), setTimeout(s, 500))
                        };
                        s(), "right" !== i || e.next().hasClass("slick-active") ? "left" !== i || e.prev().hasClass("slick-active") || T.slick("slickPrev") : T.slick("slickNext"), x.trigger("to.owl.carousel", e.index())
                    }
                })
            }), T.addClass("init").slick({
                dots: !1,
                arrows: !1,
                slidesToShow: T.data("count"),
                slidesToScroll: 1,
                adaptiveHeight: !1,
                vertical: "left" === ideapark_wp_vars.productThumbnails,
                infinite: !1,
                focusOnSelect: !1,
                draggable: !1,
                touchMove: !1
            }), !0)
        }, e.ideapark_init_product_gallery = function () {
            x.length && (x.find(".woocommerce-product-gallery__image").length > 1 && t(".js-product-info-carousel:not(.owl-carousel)").addClass("owl-carousel").on("resized.owl.carousel", ideapark_owl_hide_arrows).on("changed.owl.carousel", function (t) {
                var e = t.item.index;
                P = e, T.length && !n && E.eq(e).trigger("click")
            }).owlCarousel({
                items: 1,
                loop: !1,
                margin: 0,
                nav: !0,
                dots: !1,
                rtl: !!ideapark_wp_vars.isRtl,
                navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                onInitialized: ideapark_owl_hide_arrows
            }), z.bind("click", function (e) {
                if (!x.hasClass("animating")) {
                    e.preventDefault();
                    var i = t(this),
                        s = i.data("index");
                    ideapark_wp_vars.shopProductModal && i.hasClass("ip-product-image--zoom") && ideapark_open_photo_swipe(this, s)
                }
            }))
        }, e.ideapark_init_masonry = function () {
            if (t.fn.masonry) {
                var e = t(".grid.masonry");
                e.length && (e.masonry({
                    itemSelector: ".post, .page, .product",
                    columnWidth: ".post-sizer",
                    percentPosition: !0
                }), e.imagesLoaded().progress(function () {
                    e.masonry("layout")
                }), e.imagesLoaded(function () {
                    e.masonry("layout")
                }))
            }
        }
    }(jQuery, window);