! function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : "object" == typeof exports ? module.exports = a(require("jquery")) : a(jQuery)
}(function (a) {
    var b = "waitForImages";
    a.waitForImages = {
        hasImageProperties: ["backgroundImage", "listStyleImage", "borderImage", "borderCornerImage", "cursor"],
        hasImageAttributes: ["srcset"]
    }, a.expr[":"]["has-src"] = function (b) {
        return a(b).is('img[src][src!=""]')
    }, a.expr[":"].uncached = function (b) {
        return a(b).is(":has-src") ? !b.complete : !1
    }, a.fn.waitForImages = function () {
        var c, d, e, f = 0,
            g = 0,
            h = a.Deferred();
        if (a.isPlainObject(arguments[0]) ? (e = arguments[0].waitForAll, d = arguments[0].each, c = arguments[0].finished) : 1 === arguments.length && "boolean" === a.type(arguments[0]) ? e = arguments[0] : (c = arguments[0], d = arguments[1], e = arguments[2]), c = c || a.noop, d = d || a.noop, e = !!e, !a.isFunction(c) || !a.isFunction(d)) throw new TypeError("An invalid callback was supplied.");
        return this.each(function () {
            var i = a(this),
                j = [],
                k = a.waitForImages.hasImageProperties || [],
                l = a.waitForImages.hasImageAttributes || [],
                m = /url\(\s*(['"]?)(.*?)\1\s*\)/g;
            e ? i.find("*").addBack().each(function () {
                var b = a(this);
                b.is("img:has-src") && !b.is("[srcset]") && j.push({
                    src: b.attr("src"),
                    element: b[0]
                }), a.each(k, function (a, c) {
                    var d, e = b.css(c);
                    if (!e) return !0;
                    for (; d = m.exec(e);) j.push({
                        src: d[2],
                        element: b[0]
                    })
                }), a.each(l, function (a, c) {
                    var d = b.attr(c);
                    return d ? void j.push({
                        src: b.attr("src"),
                        srcset: b.attr("srcset"),
                        element: b[0]
                    }) : !0
                })
            }) : i.find("img:has-src").each(function () {
                j.push({
                    src: this.src,
                    element: this
                })
            }), f = j.length, g = 0, 0 === f && (c.call(i[0]), h.resolveWith(i[0])), a.each(j, function (e, j) {
                var k = new Image,
                    l = "load." + b + " error." + b;
                a(k).one(l, function m(b) {
                    var e = [g, f, "load" == b.type];
                    return g++, d.apply(j.element, e), h.notifyWith(j.element, e), a(this).off(l, m), g == f ? (c.call(i[0]), h.resolveWith(i[0]), !1) : void 0
                }), j.srcset && (k.srcset = j.srcset), k.src = j.src
            })
        }), h.promise()
    }
});
! function () {
    "use strict";

    function t(t) {
        var e = 1;
        return "-" === t[0] && (e = -1, t = t.substr(1)),
            function (n, r) {
                var i = n[t] < r[t] ? -1 : n[t] > r[t] ? 1 : 0;
                return i * e
            }
    }
    var e = function () {
        this.called = !1, this.callonce = !0, this.compat()
    };
    e.prototype.init = function (t, e) {
        this.retina = window.devicePixelRatio > 1, this.elements = [], this.callback = "function" == typeof e ? e : function () {}, this.curwidth = this.getWidth();
        for (var n = this.gather(t), r = 0, i = n.length; i > r; r++) this.parse(n[r]);
        this.set(), this.resize()
    }, e.prototype.compat = function () {
        var t = document;
        "function" != typeof t.getElementsByClassName && (t.getElementsByClassName = function (e) {
            return t.querySelectorAll("." + e)
        }), String.prototype.trim || (String.prototype.trim = function () {
            return this.replace(/^\s+|\s+$/g, "")
        }), t.addEventListener || (this.addEvent = function (t, e, n) {
            t.attachEvent("on" + e, function (t) {
                n(t || window.event)
            })
        })
    }, e.prototype.gather = function (t) {
        var e = ["HTMLCollection", "NodeList"],
            n = t,
            r = n.nodeType ? "Object" : Object.prototype.toString.call(n).replace(/^\[object |\]$/g, ""),
            i = "parse" + r;
        return e.indexOf(r) > -1 ? n : this[i] ? this[i](n) : []
    }, e.prototype.parseObject = function (t) {
        return t.nodeType ? [t] : []
    }, e.prototype.parseArray = function (t) {
        return t
    }, e.prototype.parseString = function (t) {
        var e = document,
            n = t.trim(),
            r = n[0],
            i = [];
        switch (!0) {
            case "." === r:
                i = e.getElementsByClassName(n.substring(1));
                break;
            case "#" === r:
                i.push(e.getElementById(n.substring(1)));
                break;
            case /^[a-zA-Z]+$/.test(n):
                i = e.getElementsByTagName(n);
                break;
            default:
                i = []
        }
        return i
    }, e.prototype.parse = function (t) {
        var e = t.getAttribute("data-bg-srcset");
        if (null === e) return !1;
        this.elements.push({});
        var n = e.split(","),
            r = "",
            i = this.elements[this.elements.length - 1];
        i.node = t, i.srcset = [];
        for (var s = 0, o = n.length; o > s; s++) {
            i.srcset.push({}), r = n[s].trim();
            for (var a, c, l, h = r.split(" "), u = 0, d = h.length; d > u; u++) {
                switch (a = h[u], c = i.srcset[s], l = a.length - 1, !0) {
                    case "" === a.trim():
                        continue;
                    case "w" !== a[l] && "x" !== a[a.length - 1]:
                        c.src = a;
                        break;
                    case "w" === a[l]:
                        c.width = parseInt(a.slice(0, -1));
                        break;
                    case "x" === a[l]:
                        c.retina = parseInt(a.slice(0, -1)) > 1
                }
                c.width || (c.width = Number.POSITIVE_INFINITY), c.retina || (c.retina = !1)
            }
        }
    }, e.prototype.set = function () {
        for (var t = 0, e = this.elements.length; e > t; t++) this.setSingle(t)
    }, e.prototype.setSingle = function (e) {
        var n = 0,
            r = this.elements[e],
            i = [],
            s = 0,
            o = this;
        n = r.node.clientWidth * (this.retina ? 2 : 1), r.srcset = r.srcset.sort(t("width"));
        for (var a = 0, c = r.srcset.length; c > a; a++) r.srcset[a].width < n || i.push(r.srcset[a]);
        if (0 === i.length && i.push(r.srcset[r.srcset.length - 1]), s = i[0], i.length > 1 && i[0].width === i[1].width && (s = i[0].retina !== this.retina ? i[1] : i[0]), void 0 !== s.src && "null" !== s.src) {
            var l = new Image,
                h = !1;
            l.onload = l.onreadystatechange = function () {
                h || this.readyState && "loaded" !== this.readyState && "complete" !== this.readyState || (h = !0, r.node.style.backgroundImage = "url('" + s.src + "')", o.called || (o.callback(r), o.called = o.callonce))
            }, l.src = s.src
        } else r.node.style.backgroundImage = ""
    }, e.prototype.resize = function () {
        var t = this,
            e = setTimeout(function () {}, 0);
        this.addEvent(window, "resize", function () {
            clearTimeout(e), e = setTimeout(function () {
                var e = t.getWidth();
                e !== t.curwidth && (t.curwidth = e, t.retina = window.devicePixelRatio > 1, t.set())
            }, 250)
        })
    }, e.prototype.addEvent = function (t, e, n) {
        t.addEventListener(e, n, !1)
    }, e.prototype.getWidth = function () {
        var t, e, n, r;
        return t = window, e = document, n = e.documentElement, r = e.getElementsByTagName("body")[0], t.innerWidth || n.clientWidth || r.clientWidth
    }, window.bgsrcset = e
}();
! function (a, b) {
    var c = b(a, a.document);
    a.lazySizes = c, "object" == typeof module && module.exports && (module.exports = c)
}(window, function (a, b) {
    "use strict";
    if (b.getElementsByClassName) {
        var c, d, e = b.documentElement,
            f = a.Date,
            g = a.HTMLPictureElement,
            h = "addEventListener",
            i = "getAttribute",
            j = a[h],
            k = a.setTimeout,
            l = a.requestAnimationFrame || k,
            m = a.requestIdleCallback,
            n = /^picture$/i,
            o = ["load", "error", "lazyincluded", "_lazyloaded"],
            p = {},
            q = Array.prototype.forEach,
            r = function (a, b) {
                return p[b] || (p[b] = new RegExp("(\\s|^)" + b + "(\\s|$)")), p[b].test(a[i]("class") || "") && p[b]
            },
            s = function (a, b) {
                r(a, b) || a.setAttribute("class", (a[i]("class") || "").trim() + " " + b)
            },
            t = function (a, b) {
                var c;
                (c = r(a, b)) && a.setAttribute("class", (a[i]("class") || "").replace(c, " "))
            },
            u = function (a, b, c) {
                var d = c ? h : "removeEventListener";
                c && u(a, b), o.forEach(function (c) {
                    a[d](c, b)
                })
            },
            v = function (a, d, e, f, g) {
                var h = b.createEvent("Event");
                return e || (e = {}), e.instance = c, h.initEvent(d, !f, !g), h.detail = e, a.dispatchEvent(h), h
            },
            w = function (b, c) {
                var e;
                !g && (e = a.picturefill || d.pf) ? (c && c.src && !b[i]("srcset") && b.setAttribute("srcset", c.src), e({
                    reevaluate: !0,
                    elements: [b]
                })) : c && c.src && (b.src = c.src)
            },
            x = function (a, b) {
                return (getComputedStyle(a, null) || {})[b]
            },
            y = function (a, b, c) {
                for (c = c || a.offsetWidth; c < d.minSize && b && !a._lazysizesWidth;) c = b.offsetWidth, b = b.parentNode;
                return c
            },
            z = function () {
                var a, c, d = [],
                    e = [],
                    f = d,
                    g = function () {
                        var b = f;
                        for (f = d.length ? e : d, a = !0, c = !1; b.length;) b.shift()();
                        a = !1
                    },
                    h = function (d, e) {
                        a && !e ? d.apply(this, arguments) : (f.push(d), c || (c = !0, (b.hidden ? k : l)(g)))
                    };
                return h._lsFlush = g, h
            }(),
            A = function (a, b) {
                return b ? function () {
                    z(a)
                } : function () {
                    var b = this,
                        c = arguments;
                    z(function () {
                        a.apply(b, c)
                    })
                }
            },
            B = function (a) {
                var b, c = 0,
                    e = d.throttleDelay,
                    g = d.ricTimeout,
                    h = function () {
                        b = !1, c = f.now(), a()
                    },
                    i = m && g > 49 ? function () {
                        m(h, {
                            timeout: g
                        }), g !== d.ricTimeout && (g = d.ricTimeout)
                    } : A(function () {
                        k(h)
                    }, !0);
                return function (a) {
                    var d;
                    (a = !0 === a) && (g = 33), b || (b = !0, d = e - (f.now() - c), d < 0 && (d = 0), a || d < 9 ? i() : k(i, d))
                }
            },
            C = function (a) {
                var b, c, d = 99,
                    e = function () {
                        b = null, a()
                    },
                    g = function () {
                        var a = f.now() - c;
                        a < d ? k(g, d - a) : (m || e)(e)
                    };
                return function () {
                    c = f.now(), b || (b = k(g, d))
                }
            };
        ! function () {
            var b, c = {
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
            d = a.lazySizesConfig || a.lazysizesConfig || {};
            for (b in c) b in d || (d[b] = c[b]);
            a.lazySizesConfig = d, k(function () {
                d.init && F()
            })
        }();
        var D = function () {
                var g, l, m, o, p, y, D, F, G, H, I, J, K, L, M = /^img$/i,
                    N = /^iframe$/i,
                    O = "onscroll" in a && !/(gle|ing)bot/.test(navigator.userAgent),
                    P = 0,
                    Q = 0,
                    R = 0,
                    S = -1,
                    T = function (a) {
                        R--, a && a.target && u(a.target, T), (!a || R < 0 || !a.target) && (R = 0)
                    },
                    U = function (a, c) {
                        var d, f = a,
                            g = "hidden" == x(b.body, "visibility") || "hidden" != x(a.parentNode, "visibility") && "hidden" != x(a, "visibility");
                        for (F -= c, I += c, G -= c, H += c; g && (f = f.offsetParent) && f != b.body && f != e;)(g = (x(f, "opacity") || 1) > 0) && "visible" != x(f, "overflow") && (d = f.getBoundingClientRect(), g = H > d.left && G < d.right && I > d.top - 1 && F < d.bottom + 1);
                        return g
                    },
                    V = function () {
                        var a, f, h, j, k, m, n, p, q, r = c.elements;
                        if ((o = d.loadMode) && R < 8 && (a = r.length)) {
                            f = 0, S++, null == K && ("expand" in d || (d.expand = e.clientHeight > 500 && e.clientWidth > 500 ? 500 : 370), J = d.expand, K = J * d.expFactor), Q < K && R < 1 && S > 2 && o > 2 && !b.hidden ? (Q = K, S = 0) : Q = o > 1 && S > 1 && R < 6 ? J : P;
                            for (; f < a; f++)
                                if (r[f] && !r[f]._lazyRace)
                                    if (O)
                                        if ((p = r[f][i]("data-expand")) && (m = 1 * p) || (m = Q), q !== m && (y = innerWidth + m * L, D = innerHeight + m, n = -1 * m, q = m), h = r[f].getBoundingClientRect(), (I = h.bottom) >= n && (F = h.top) <= D && (H = h.right) >= n * L && (G = h.left) <= y && (I || H || G || F) && (d.loadHidden || "hidden" != x(r[f], "visibility")) && (l && R < 3 && !p && (o < 3 || S < 4) || U(r[f], m))) {
                                            if (ba(r[f]), k = !0, R > 9) break
                                        } else !k && l && !j && R < 4 && S < 4 && o > 2 && (g[0] || d.preloadAfterLoad) && (g[0] || !p && (I || H || G || F || "auto" != r[f][i](d.sizesAttr))) && (j = g[0] || r[f]);
                            else ba(r[f]);
                            j && !k && ba(j)
                        }
                    },
                    W = B(V),
                    X = function (a) {
                        s(a.target, d.loadedClass), t(a.target, d.loadingClass), u(a.target, Z), v(a.target, "lazyloaded")
                    },
                    Y = A(X),
                    Z = function (a) {
                        Y({
                            target: a.target
                        })
                    },
                    $ = function (a, b) {
                        try {
                            a.contentWindow.location.replace(b)
                        } catch (c) {
                            a.src = b
                        }
                    },
                    _ = function (a) {
                        var b, c = a[i](d.srcsetAttr);
                        (b = d.customMedia[a[i]("data-media") || a[i]("media")]) && a.setAttribute("media", b), c && a.setAttribute("srcset", c)
                    },
                    aa = A(function (a, b, c, e, f) {
                        var g, h, j, l, o, p;
                        (o = v(a, "lazybeforeunveil", b)).defaultPrevented || (e && (c ? s(a, d.autosizesClass) : a.setAttribute("sizes", e)), h = a[i](d.srcsetAttr), g = a[i](d.srcAttr), f && (j = a.parentNode, l = j && n.test(j.nodeName || "")), p = b.firesLoad || "src" in a && (h || g || l), o = {
                            target: a
                        }, p && (u(a, T, !0), clearTimeout(m), m = k(T, 2500), s(a, d.loadingClass), u(a, Z, !0)), l && q.call(j.getElementsByTagName("source"), _), h ? a.setAttribute("srcset", h) : g && !l && (N.test(a.nodeName) ? $(a, g) : a.src = g), f && (h || l) && w(a, {
                            src: g
                        })), a._lazyRace && delete a._lazyRace, t(a, d.lazyClass), z(function () {
                            (!p || a.complete && a.naturalWidth > 1) && (p ? T(o) : R--, X(o))
                        }, !0)
                    }),
                    ba = function (a) {
                        var b, c = M.test(a.nodeName),
                            e = c && (a[i](d.sizesAttr) || a[i]("sizes")),
                            f = "auto" == e;
                        (!f && l || !c || !a[i]("src") && !a.srcset || a.complete || r(a, d.errorClass) || !r(a, d.lazyClass)) && (b = v(a, "lazyunveilread").detail, f && E.updateElem(a, !0, a.offsetWidth), a._lazyRace = !0, R++, aa(a, b, f, e, c))
                    },
                    ca = function () {
                        if (!l) {
                            if (f.now() - p < 999) return void k(ca, 999);
                            var a = C(function () {
                                d.loadMode = 3, W()
                            });
                            l = !0, d.loadMode = 3, W(), j("scroll", function () {
                                3 == d.loadMode && (d.loadMode = 2), a()
                            }, !0)
                        }
                    };
                return {
                    _: function () {
                        p = f.now(), c.elements = b.getElementsByClassName(d.lazyClass), g = b.getElementsByClassName(d.lazyClass + " " + d.preloadClass), L = d.hFac, j("scroll", W, !0), j("resize", W, !0), a.MutationObserver ? new MutationObserver(W).observe(e, {
                            childList: !0,
                            subtree: !0,
                            attributes: !0
                        }) : (e[h]("DOMNodeInserted", W, !0), e[h]("DOMAttrModified", W, !0), setInterval(W, 999)), j("hashchange", W, !0), ["focus", "mouseover", "click", "load", "transitionend", "animationend", "webkitAnimationEnd"].forEach(function (a) {
                            b[h](a, W, !0)
                        }), /d$|^c/.test(b.readyState) ? ca() : (j("load", ca), b[h]("DOMContentLoaded", W), k(ca, 2e4)), c.elements.length ? (V(), z._lsFlush()) : W()
                    },
                    checkElems: W,
                    unveil: ba
                }
            }(),
            E = function () {
                var a, c = A(function (a, b, c, d) {
                        var e, f, g;
                        if (a._lazysizesWidth = d, d += "px", a.setAttribute("sizes", d), n.test(b.nodeName || ""))
                            for (e = b.getElementsByTagName("source"), f = 0, g = e.length; f < g; f++) e[f].setAttribute("sizes", d);
                        c.detail.dataAttr || w(a, c.detail)
                    }),
                    e = function (a, b, d) {
                        var e, f = a.parentNode;
                        f && (d = y(a, f, d), e = v(a, "lazybeforesizes", {
                            width: d,
                            dataAttr: !!b
                        }), e.defaultPrevented || (d = e.detail.width) && d !== a._lazysizesWidth && c(a, f, e, d))
                    },
                    f = function () {
                        var b, c = a.length;
                        if (c)
                            for (b = 0; b < c; b++) e(a[b])
                    },
                    g = C(f);
                return {
                    _: function () {
                        a = b.getElementsByClassName(d.autosizesClass), j("resize", g)
                    },
                    checkElems: g,
                    updateElem: e
                }
            }(),
            F = function () {
                F.i || (F.i = !0, E._(), D._())
            };
        return c = {
            cfg: d,
            autoSizer: E,
            loader: D,
            init: F,
            uP: w,
            aC: s,
            rC: t,
            hC: r,
            fire: v,
            gW: y,
            rAF: z
        }
    }
});
! function (a, b) {
    var c = function () {
        b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0)
    };
    b = b.bind(null, a, a.document), "object" == typeof module && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0)
}(window, function (a, b, c) {
    "use strict";
    if (a.addEventListener) {
        var d = /\s+/g,
            e = /\s*\|\s+|\s+\|\s*/g,
            f = /^(.+?)(?:\s+\[\s*(.+?)\s*\])(?:\s+\[\s*(.+?)\s*\])?$/,
            g = /^\s*\(*\s*type\s*:\s*(.+?)\s*\)*\s*$/,
            h = /\(|\)|'/,
            i = {
                contain: 1,
                cover: 1
            },
            j = function (a) {
                var b = c.gW(a, a.parentNode);
                return (!a._lazysizesWidth || b > a._lazysizesWidth) && (a._lazysizesWidth = b), a._lazysizesWidth
            },
            k = function (a) {
                var b;
                return b = (getComputedStyle(a) || {
                    getPropertyValue: function () {}
                }).getPropertyValue("background-size"), !i[b] && i[a.style.backgroundSize] && (b = a.style.backgroundSize), b
            },
            l = function (a, b) {
                if (b) {
                    var c = b.match(g);
                    c && c[1] ? a.setAttribute("type", c[1]) : a.setAttribute("media", lazySizesConfig.customMedia[b] || b)
                }
            },
            m = function (a, c, g) {
                var h = b.createElement("picture"),
                    i = c.getAttribute(lazySizesConfig.sizesAttr),
                    j = c.getAttribute("data-ratio"),
                    k = c.getAttribute("data-optimumx");
                c._lazybgset && c._lazybgset.parentNode == c && c.removeChild(c._lazybgset), Object.defineProperty(g, "_lazybgset", {
                    value: c,
                    writable: !0
                }), Object.defineProperty(c, "_lazybgset", {
                    value: h,
                    writable: !0
                }), a = a.replace(d, " ").split(e), h.style.display = "none", g.className = lazySizesConfig.lazyClass, 1 != a.length || i || (i = "auto"), a.forEach(function (a) {
                    var c, d = b.createElement("source");
                    i && "auto" != i && d.setAttribute("sizes", i), (c = a.match(f)) ? (d.setAttribute(lazySizesConfig.srcsetAttr, c[1]), l(d, c[2]), l(d, c[3])) : d.setAttribute(lazySizesConfig.srcsetAttr, a), h.appendChild(d)
                }), i && (g.setAttribute(lazySizesConfig.sizesAttr, i), c.removeAttribute(lazySizesConfig.sizesAttr), c.removeAttribute("sizes")), k && g.setAttribute("data-optimumx", k), j && g.setAttribute("data-ratio", j), h.appendChild(g), c.appendChild(h)
            },
            n = function (a) {
                if (a.target._lazybgset) {
                    var b = a.target,
                        d = b._lazybgset,
                        e = b.currentSrc || b.src;
                    if (e) {
                        var f = c.fire(d, "bgsetproxy", {
                            src: e,
                            useSrc: h.test(e) ? JSON.stringify(e) : e
                        });
                        f.defaultPrevented || (d.style.backgroundImage = "url(" + f.detail.useSrc + ")")
                    }
                    b._lazybgsetLoading && (c.fire(d, "_lazyloaded", {}, !1, !0), delete b._lazybgsetLoading)
                }
            };
        addEventListener("lazybeforeunveil", function (a) {
            var d, e, f;
            !a.defaultPrevented && (d = a.target.getAttribute("data-bgset")) && (f = a.target, e = b.createElement("img"), e.alt = "", e._lazybgsetLoading = !0, a.detail.firesLoad = !0, m(d, f, e), setTimeout(function () {
                c.loader.unveil(e), c.rAF(function () {
                    c.fire(e, "_lazyloaded", {}, !0, !0), e.complete && n({
                        target: e
                    })
                })
            }))
        }), b.addEventListener("load", n, !0), a.addEventListener("lazybeforesizes", function (a) {
            if (a.detail.instance == c && a.target._lazybgset && a.detail.dataAttr) {
                var b = a.target._lazybgset,
                    d = k(b);
                i[d] && (a.target._lazysizesParentFit = d, c.rAF(function () {
                    a.target.setAttribute("data-parent-fit", d), a.target._lazysizesParentFit && delete a.target._lazysizesParentFit
                }))
            }
        }, !0), b.documentElement.addEventListener("lazybeforesizes", function (a) {
            !a.defaultPrevented && a.target._lazybgset && a.detail.instance == c && (a.detail.width = j(a.target._lazybgset))
        })
    }
});
! function (a, b) {
    var c = function () {
        b(a.lazySizes), a.removeEventListener("lazyunveilread", c, !0)
    };
    b = b.bind(null, a, a.document), "object" == typeof module && module.exports ? b(require("lazysizes")) : a.lazySizes ? c() : a.addEventListener("lazyunveilread", c, !0)
}(window, function (a, b, c) {
    "use strict";

    function d(a, c) {
        if (!g[a]) {
            var d = b.createElement(c ? "link" : "script"),
                e = b.getElementsByTagName("script")[0];
            c ? (d.rel = "stylesheet", d.href = a) : d.src = a, g[a] = !0, g[d.src || d.href] = !0, e.parentNode.insertBefore(d, e)
        }
    }
    var e, f, g = {};
    b.addEventListener && (f = /\(|\)|\s|'/, e = function (a, c) {
        var d = b.createElement("img");
        d.onload = function () {
            d.onload = null, d.onerror = null, d = null, c()
        }, d.onerror = d.onload, d.src = a, d && d.complete && d.onload && d.onload()
    }, addEventListener("lazybeforeunveil", function (a) {
        if (a.detail.instance == c) {
            var b, g, h, i;
            a.defaultPrevented || ("none" == a.target.preload && (a.target.preload = "auto"), b = a.target.getAttribute("data-link"), b && d(b, !0), b = a.target.getAttribute("data-script"), b && d(b), b = a.target.getAttribute("data-require"), b && (c.cfg.requireJs ? c.cfg.requireJs([b]) : d(b)), h = a.target.getAttribute("data-bg"), h && (a.detail.firesLoad = !0, g = function () {
                a.target.style.backgroundImage = "url(" + (f.test(h) ? JSON.stringify(h) : h) + ")", a.detail.firesLoad = !1, c.fire(a.target, "_lazyloaded", {}, !0, !0)
            }, e(h, g)), (i = a.target.getAttribute("data-poster")) && (a.detail.firesLoad = !0, g = function () {
                a.target.poster = i, a.detail.firesLoad = !1, c.fire(a.target, "_lazyloaded", {}, !0, !0)
            }, e(i, g)))
        }
    }, !1))
});
! function (a, b, c, d) {
    function e(b, c) {
        this.settings = null, this.options = a.extend({}, e.Defaults, c), this.$element = a(b), this._handlers = {}, this._plugins = {}, this._supress = {}, this._current = null, this._speed = null, this._coordinates = [], this._breakpoint = null, this._width = null, this._items = [], this._clones = [], this._mergers = [], this._widths = [], this._invalidated = {}, this._pipe = [], this._drag = {
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
        }, a.each(["onResize", "onThrottledResize"], a.proxy(function (b, c) {
            this._handlers[c] = a.proxy(this[c], this)
        }, this)), a.each(e.Plugins, a.proxy(function (a, b) {
            this._plugins[a.charAt(0).toLowerCase() + a.slice(1)] = new b(this)
        }, this)), a.each(e.Workers, a.proxy(function (b, c) {
            this._pipe.push({
                filter: c.filter,
                run: a.proxy(c.run, this)
            })
        }, this)), this.setup(), this.initialize()
    }
    e.Defaults = {
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
        responsiveBaseElement: b,
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
    }, e.Width = {
        Default: "default",
        Inner: "inner",
        Outer: "outer"
    }, e.Type = {
        Event: "event",
        State: "state"
    }, e.Plugins = {}, e.Workers = [{
        filter: ["width", "settings"],
        run: function () {
            this._width = this.$element.width()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            a.current = this._items && this._items[this.relative(this._current)]
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            this.$stage.children(".cloned").remove()
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = this.settings.margin || "",
                c = !this.settings.autoWidth,
                d = this.settings.rtl,
                e = {
                    width: "auto",
                    "margin-left": d ? b : "",
                    "margin-right": d ? "" : b
                };
            !c && this.$stage.children().css(e), a.css = e
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = (this.width() / this.settings.items).toFixed(3) - this.settings.margin,
                c = null,
                d = this._items.length,
                e = !this.settings.autoWidth,
                f = [];
            for (a.items = {
                    merge: !1,
                    width: b
                }; d--;) c = this._mergers[d], c = this.settings.mergeFit && Math.min(c, this.settings.items) || c, a.items.merge = c > 1 || a.items.merge, f[d] = e ? b * c : this._items[d].width();
            this._widths = f
        }
    }, {
        filter: ["items", "settings"],
        run: function () {
            var b = [],
                c = this._items,
                d = this.settings,
                e = Math.max(2 * d.items, 4),
                f = 2 * Math.ceil(c.length / 2),
                g = d.loop && c.length ? d.rewind ? e : Math.max(e, f) : 0,
                h = "",
                i = "";
            for (g /= 2; g > 0;) b.push(this.normalize(b.length / 2, !0)), h += c[b[b.length - 1]][0].outerHTML, b.push(this.normalize(c.length - 1 - (b.length - 1) / 2, !0)), i = c[b[b.length - 1]][0].outerHTML + i, g -= 1;
            this._clones = b, a(h).addClass("cloned").appendTo(this.$stage), a(i).addClass("cloned").prependTo(this.$stage)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            for (var a = this.settings.rtl ? 1 : -1, b = this._clones.length + this._items.length, c = -1, d = 0, e = 0, f = []; ++c < b;) d = f[c - 1] || 0, e = this._widths[this.relative(c)] + this.settings.margin, f.push(d + e * a);
            this._coordinates = f
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function () {
            var a = this.settings.stagePadding,
                b = this._coordinates,
                c = {
                    width: Math.ceil(Math.abs(b[b.length - 1])) + 2 * a,
                    "padding-left": a || "",
                    "padding-right": a || ""
                };
            this.$stage.css(c)
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            var b = this._coordinates.length,
                c = !this.settings.autoWidth,
                d = this.$stage.children();
            if (c && a.items.merge)
                for (; b--;) a.css.width = this._widths[this.relative(b)], d.eq(b).css(a.css);
            else c && (a.css.width = a.items.width, d.css(a.css))
        }
    }, {
        filter: ["items"],
        run: function () {
            this._coordinates.length < 1 && this.$stage.removeAttr("style")
        }
    }, {
        filter: ["width", "items", "settings"],
        run: function (a) {
            a.current = a.current ? this.$stage.children().index(a.current) : 0, a.current = Math.max(this.minimum(), Math.min(this.maximum(), a.current)), this.reset(a.current)
        }
    }, {
        filter: ["position"],
        run: function () {
            this.animate(this.coordinates(this._current))
        }
    }, {
        filter: ["width", "position", "items", "settings"],
        run: function () {
            var a, b, c, d, e = this.settings.rtl ? 1 : -1,
                f = 2 * this.settings.stagePadding,
                g = this.coordinates(this.current()) + f,
                h = g + this.width() * e,
                i = [];
            for (c = 0, d = this._coordinates.length; c < d; c++) a = this._coordinates[c - 1] || 0, b = Math.abs(this._coordinates[c]) + f * e, (this.op(a, "<=", g) && this.op(a, ">", h) || this.op(b, "<", g) && this.op(b, ">", h)) && i.push(c);
            this.$stage.children(".active").removeClass("active"), this.$stage.children(":eq(" + i.join("), :eq(") + ")").addClass("active"), this.$stage.children(".center").removeClass("center"), this.settings.center && this.$stage.children().eq(this.current()).addClass("center")
        }
    }], e.prototype.initializeStage = function () {
        this.$stage = this.$element.find("." + this.settings.stageClass), this.$stage.length || (this.$element.addClass(this.options.loadingClass), this.$stage = a("<" + this.settings.stageElement + ">", {
            class: this.settings.stageClass
        }).wrap(a("<div/>", {
            class: this.settings.stageOuterClass
        })), this.$element.append(this.$stage.parent()))
    }, e.prototype.initializeItems = function () {
        var b = this.$element.find(".owl-item");
        if (b.length) return this._items = b.get().map(function (b) {
            return a(b)
        }), this._mergers = this._items.map(function () {
            return 1
        }), void this.refresh();
        this.replace(this.$element.children().not(this.$stage.parent())), this.isVisible() ? this.refresh() : this.invalidate("width"), this.$element.removeClass(this.options.loadingClass).addClass(this.options.loadedClass)
    }, e.prototype.initialize = function () {
        if (this.enter("initializing"), this.trigger("initialize"), this.$element.toggleClass(this.settings.rtlClass, this.settings.rtl), this.settings.autoWidth && !this.is("pre-loading")) {
            var a, b, c;
            a = this.$element.find("img"), b = this.settings.nestedItemSelector ? "." + this.settings.nestedItemSelector : d, c = this.$element.children(b).width(), a.length && c <= 0 && this.preloadAutoWidthImages(a)
        }
        this.initializeStage(), this.initializeItems(), this.registerEventHandlers(), this.leave("initializing"), this.trigger("initialized")
    }, e.prototype.isVisible = function () {
        return !this.settings.checkVisibility || this.$element.is(":visible")
    }, e.prototype.setup = function () {
        var b = this.viewport(),
            c = this.options.responsive,
            d = -1,
            e = null;
        c ? (a.each(c, function (a) {
            a <= b && a > d && (d = Number(a))
        }), e = a.extend({}, this.options, c[d]), "function" == typeof e.stagePadding && (e.stagePadding = e.stagePadding()), delete e.responsive, e.responsiveClass && this.$element.attr("class", this.$element.attr("class").replace(new RegExp("(" + this.options.responsiveClass + "-)\\S+\\s", "g"), "$1" + d))) : e = a.extend({}, this.options), this.trigger("change", {
            property: {
                name: "settings",
                value: e
            }
        }), this._breakpoint = d, this.settings = e, this.invalidate("settings"), this.trigger("changed", {
            property: {
                name: "settings",
                value: this.settings
            }
        })
    }, e.prototype.optionsLogic = function () {
        this.settings.autoWidth && (this.settings.stagePadding = !1, this.settings.merge = !1)
    }, e.prototype.prepare = function (b) {
        var c = this.trigger("prepare", {
            content: b
        });
        return c.data || (c.data = a("<" + this.settings.itemElement + "/>").addClass(this.options.itemClass).append(b)), this.trigger("prepared", {
            content: c.data
        }), c.data
    }, e.prototype.update = function () {
        for (var b = 0, c = this._pipe.length, d = a.proxy(function (a) {
                return this[a]
            }, this._invalidated), e = {}; b < c;)(this._invalidated.all || a.grep(this._pipe[b].filter, d).length > 0) && this._pipe[b].run(e), b++;
        this._invalidated = {}, !this.is("valid") && this.enter("valid")
    }, e.prototype.width = function (a) {
        switch (a = a || e.Width.Default) {
            case e.Width.Inner:
            case e.Width.Outer:
                return this._width;
            default:
                return this._width - 2 * this.settings.stagePadding + this.settings.margin
        }
    }, e.prototype.refresh = function () {
        this.enter("refreshing"), this.trigger("refresh"), this.setup(), this.optionsLogic(), this.$element.addClass(this.options.refreshClass), this.update(), this.$element.removeClass(this.options.refreshClass), this.leave("refreshing"), this.trigger("refreshed")
    }, e.prototype.onThrottledResize = function () {
        b.clearTimeout(this.resizeTimer), this.resizeTimer = b.setTimeout(this._handlers.onResize, this.settings.responsiveRefreshRate)
    }, e.prototype.onResize = function () {
        return !!this._items.length && (this._width !== this.$element.width() && (!!this.isVisible() && (this.enter("resizing"), this.trigger("resize").isDefaultPrevented() ? (this.leave("resizing"), !1) : (this.invalidate("width"), this.refresh(), this.leave("resizing"), void this.trigger("resized")))))
    }, e.prototype.registerEventHandlers = function () {
        a.support.transition && this.$stage.on(a.support.transition.end + ".owl.core", a.proxy(this.onTransitionEnd, this)), !1 !== this.settings.responsive && this.on(b, "resize", this._handlers.onThrottledResize), this.settings.mouseDrag && (this.$element.addClass(this.options.dragClass), this.$stage.on("mousedown.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("dragstart.owl.core selectstart.owl.core", function () {
            return !1
        })), this.settings.touchDrag && (this.$stage.on("touchstart.owl.core", a.proxy(this.onDragStart, this)), this.$stage.on("touchcancel.owl.core", a.proxy(this.onDragEnd, this)))
    }, e.prototype.onDragStart = function (b) {
        var d = null;
        3 !== b.which && (a.support.transform ? (d = this.$stage.css("transform").replace(/.*\(|\)| /g, "").split(","), d = {
            x: d[16 === d.length ? 12 : 4],
            y: d[16 === d.length ? 13 : 5]
        }) : (d = this.$stage.position(), d = {
            x: this.settings.rtl ? d.left + this.$stage.width() - this.width() + this.settings.margin : d.left,
            y: d.top
        }), this.is("animating") && (a.support.transform ? this.animate(d.x) : this.$stage.stop(), this.invalidate("position")), this.$element.toggleClass(this.options.grabClass, "mousedown" === b.type), this.speed(0), this._drag.time = (new Date).getTime(), this._drag.target = a(b.target), this._drag.stage.start = d, this._drag.stage.current = d, this._drag.pointer = this.pointer(b), a(c).on("mouseup.owl.core touchend.owl.core", a.proxy(this.onDragEnd, this)), a(c).one("mousemove.owl.core touchmove.owl.core", a.proxy(function (b) {
            var d = this.difference(this._drag.pointer, this.pointer(b));
            a(c).on("mousemove.owl.core touchmove.owl.core", a.proxy(this.onDragMove, this)), Math.abs(d.x) < Math.abs(d.y) && this.is("valid") || (b.preventDefault(), this.enter("dragging"), this.trigger("drag"))
        }, this)))
    }, e.prototype.onDragMove = function (a) {
        var b = null,
            c = null,
            d = null,
            e = this.difference(this._drag.pointer, this.pointer(a)),
            f = this.difference(this._drag.stage.start, e);
        this.is("dragging") && (a.preventDefault(), this.settings.loop ? (b = this.coordinates(this.minimum()), c = this.coordinates(this.maximum() + 1) - b, f.x = ((f.x - b) % c + c) % c + b) : (b = this.settings.rtl ? this.coordinates(this.maximum()) : this.coordinates(this.minimum()), c = this.settings.rtl ? this.coordinates(this.minimum()) : this.coordinates(this.maximum()), d = this.settings.pullDrag ? -1 * e.x / 5 : 0, f.x = Math.max(Math.min(f.x, b + d), c + d)), this._drag.stage.current = f, this.animate(f.x))
    }, e.prototype.onDragEnd = function (b) {
        var d = this.difference(this._drag.pointer, this.pointer(b)),
            e = this._drag.stage.current,
            f = d.x > 0 ^ this.settings.rtl ? "left" : "right";
        a(c).off(".owl.core"), this.$element.removeClass(this.options.grabClass), (0 !== d.x && this.is("dragging") || !this.is("valid")) && (this.speed(this.settings.dragEndSpeed || this.settings.smartSpeed), this.current(this.closest(e.x, 0 !== d.x ? f : this._drag.direction)), this.invalidate("position"), this.update(), this._drag.direction = f, (Math.abs(d.x) > 3 || (new Date).getTime() - this._drag.time > 300) && this._drag.target.one("click.owl.core", function () {
            return !1
        })), this.is("dragging") && (this.leave("dragging"), this.trigger("dragged"))
    }, e.prototype.closest = function (b, c) {
        var e = -1,
            f = 30,
            g = this.width(),
            h = this.coordinates();
        return this.settings.freeDrag || a.each(h, a.proxy(function (a, i) {
            return "left" === c && b > i - f && b < i + f ? e = a : "right" === c && b > i - g - f && b < i - g + f ? e = a + 1 : this.op(b, "<", i) && this.op(b, ">", h[a + 1] !== d ? h[a + 1] : i - g) && (e = "left" === c ? a + 1 : a), -1 === e
        }, this)), this.settings.loop || (this.op(b, ">", h[this.minimum()]) ? e = b = this.minimum() : this.op(b, "<", h[this.maximum()]) && (e = b = this.maximum())), e
    }, e.prototype.animate = function (b) {
        var c = this.speed() > 0;
        this.is("animating") && this.onTransitionEnd(), c && (this.enter("animating"), this.trigger("translate")), a.support.transform3d && a.support.transition ? this.$stage.css({
            transform: "translate3d(" + b + "px,0px,0px)",
            transition: this.speed() / 1e3 + "s" + (this.settings.slideTransition ? " " + this.settings.slideTransition : "")
        }) : c ? this.$stage.animate({
            left: b + "px"
        }, this.speed(), this.settings.fallbackEasing, a.proxy(this.onTransitionEnd, this)) : this.$stage.css({
            left: b + "px"
        })
    }, e.prototype.is = function (a) {
        return this._states.current[a] && this._states.current[a] > 0
    }, e.prototype.current = function (a) {
        if (a === d) return this._current;
        if (0 === this._items.length) return d;
        if (a = this.normalize(a), this._current !== a) {
            var b = this.trigger("change", {
                property: {
                    name: "position",
                    value: a
                }
            });
            b.data !== d && (a = this.normalize(b.data)), this._current = a, this.invalidate("position"), this.trigger("changed", {
                property: {
                    name: "position",
                    value: this._current
                }
            })
        }
        return this._current
    }, e.prototype.invalidate = function (b) {
        return "string" === a.type(b) && (this._invalidated[b] = !0, this.is("valid") && this.leave("valid")), a.map(this._invalidated, function (a, b) {
            return b
        })
    }, e.prototype.reset = function (a) {
        (a = this.normalize(a)) !== d && (this._speed = 0, this._current = a, this.suppress(["translate", "translated"]), this.animate(this.coordinates(a)), this.release(["translate", "translated"]))
    }, e.prototype.normalize = function (a, b) {
        var c = this._items.length,
            e = b ? 0 : this._clones.length;
        return !this.isNumeric(a) || c < 1 ? a = d : (a < 0 || a >= c + e) && (a = ((a - e / 2) % c + c) % c + e / 2), a
    }, e.prototype.relative = function (a) {
        return a -= this._clones.length / 2, this.normalize(a, !0)
    }, e.prototype.maximum = function (a) {
        var b, c, d, e = this.settings,
            f = this._coordinates.length;
        if (e.loop) f = this._clones.length / 2 + this._items.length - 1;
        else if (e.autoWidth || e.merge) {
            if (b = this._items.length)
                for (c = this._items[--b].width(), d = this.$element.width(); b-- && !((c += this._items[b].width() + this.settings.margin) > d););
            f = b + 1
        } else f = e.center ? this._items.length - 1 : this._items.length - e.items;
        return a && (f -= this._clones.length / 2), Math.max(f, 0)
    }, e.prototype.minimum = function (a) {
        return a ? 0 : this._clones.length / 2
    }, e.prototype.items = function (a) {
        return a === d ? this._items.slice() : (a = this.normalize(a, !0), this._items[a])
    }, e.prototype.mergers = function (a) {
        return a === d ? this._mergers.slice() : (a = this.normalize(a, !0), this._mergers[a])
    }, e.prototype.clones = function (b) {
        var c = this._clones.length / 2,
            e = c + this._items.length,
            f = function (a) {
                return a % 2 == 0 ? e + a / 2 : c - (a + 1) / 2
            };
        return b === d ? a.map(this._clones, function (a, b) {
            return f(b)
        }) : a.map(this._clones, function (a, c) {
            return a === b ? f(c) : null
        })
    }, e.prototype.speed = function (a) {
        return a !== d && (this._speed = a), this._speed
    }, e.prototype.coordinates = function (b) {
        var c, e = 1,
            f = b - 1;
        return b === d ? a.map(this._coordinates, a.proxy(function (a, b) {
            return this.coordinates(b)
        }, this)) : (this.settings.center ? (this.settings.rtl && (e = -1, f = b + 1), c = this._coordinates[b], c += (this.width() - c + (this._coordinates[f] || 0)) / 2 * e) : c = this._coordinates[f] || 0, c = Math.ceil(c))
    }, e.prototype.duration = function (a, b, c) {
        return 0 === c ? 0 : Math.min(Math.max(Math.abs(b - a), 1), 6) * Math.abs(c || this.settings.smartSpeed)
    }, e.prototype.to = function (a, b) {
        var c = this.current(),
            d = null,
            e = a - this.relative(c),
            f = (e > 0) - (e < 0),
            g = this._items.length,
            h = this.minimum(),
            i = this.maximum();
        this.settings.loop ? (!this.settings.rewind && Math.abs(e) > g / 2 && (e += -1 * f * g), a = c + e, (d = ((a - h) % g + g) % g + h) !== a && d - e <= i && d - e > 0 && (c = d - e, a = d, this.reset(c))) : this.settings.rewind ? (i += 1, a = (a % i + i) % i) : a = Math.max(h, Math.min(i, a)), this.speed(this.duration(c, a, b)), this.current(a), this.isVisible() && this.update()
    }, e.prototype.next = function (a) {
        a = a || !1, this.to(this.relative(this.current()) + 1, a)
    }, e.prototype.prev = function (a) {
        a = a || !1, this.to(this.relative(this.current()) - 1, a)
    }, e.prototype.onTransitionEnd = function (a) {
        if (a !== d && (a.stopPropagation(), (a.target || a.srcElement || a.originalTarget) !== this.$stage.get(0))) return !1;
        this.leave("animating"), this.trigger("translated")
    }, e.prototype.viewport = function () {
        var d;
        return this.options.responsiveBaseElement !== b ? d = a(this.options.responsiveBaseElement).width() : b.innerWidth ? d = b.innerWidth : c.documentElement && c.documentElement.clientWidth ? d = c.documentElement.clientWidth : console.warn("Can not detect viewport width."), d
    }, e.prototype.replace = function (b) {
        this.$stage.empty(), this._items = [], b && (b = b instanceof jQuery ? b : a(b)), this.settings.nestedItemSelector && (b = b.find("." + this.settings.nestedItemSelector)), b.filter(function () {
            return 1 === this.nodeType
        }).each(a.proxy(function (a, b) {
            b = this.prepare(b), this.$stage.append(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)
        }, this)), this.reset(this.isNumeric(this.settings.startPosition) ? this.settings.startPosition : 0), this.invalidate("items")
    }, e.prototype.add = function (b, c) {
        var e = this.relative(this._current);
        c = c === d ? this._items.length : this.normalize(c, !0), b = b instanceof jQuery ? b : a(b), this.trigger("add", {
            content: b,
            position: c
        }), b = this.prepare(b), 0 === this._items.length || c === this._items.length ? (0 === this._items.length && this.$stage.append(b), 0 !== this._items.length && this._items[c - 1].after(b), this._items.push(b), this._mergers.push(1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)) : (this._items[c].before(b), this._items.splice(c, 0, b), this._mergers.splice(c, 0, 1 * b.find("[data-merge]").addBack("[data-merge]").attr("data-merge") || 1)), this._items[e] && this.reset(this._items[e].index()), this.invalidate("items"), this.trigger("added", {
            content: b,
            position: c
        })
    }, e.prototype.remove = function (a) {
        (a = this.normalize(a, !0)) !== d && (this.trigger("remove", {
            content: this._items[a],
            position: a
        }), this._items[a].remove(), this._items.splice(a, 1), this._mergers.splice(a, 1), this.invalidate("items"), this.trigger("removed", {
            content: null,
            position: a
        }))
    }, e.prototype.preloadAutoWidthImages = function (b) {
        b.each(a.proxy(function (b, c) {
            this.enter("pre-loading"), c = a(c), a(new Image).one("load", a.proxy(function (a) {
                c.attr("src", a.target.src), c.css("opacity", 1), this.leave("pre-loading"), !this.is("pre-loading") && !this.is("initializing") && this.refresh()
            }, this)).attr("src", c.attr("src") || c.attr("data-src") || c.attr("data-src-retina"))
        }, this))
    }, e.prototype.destroy = function () {
        this.$element.off(".owl.core"), this.$stage.off(".owl.core"), a(c).off(".owl.core"), !1 !== this.settings.responsive && (b.clearTimeout(this.resizeTimer), this.off(b, "resize", this._handlers.onThrottledResize));
        for (var d in this._plugins) this._plugins[d].destroy();
        this.$stage.children(".cloned").remove(), this.$stage.unwrap(), this.$stage.children().contents().unwrap(), this.$stage.children().unwrap(), this.$stage.remove(), this.$element.removeClass(this.options.refreshClass).removeClass(this.options.loadingClass).removeClass(this.options.loadedClass).removeClass(this.options.rtlClass).removeClass(this.options.dragClass).removeClass(this.options.grabClass).attr("class", this.$element.attr("class").replace(new RegExp(this.options.responsiveClass + "-\\S+\\s", "g"), "")).removeData("owl.carousel")
    }, e.prototype.op = function (a, b, c) {
        var d = this.settings.rtl;
        switch (b) {
            case "<":
                return d ? a > c : a < c;
            case ">":
                return d ? a < c : a > c;
            case ">=":
                return d ? a <= c : a >= c;
            case "<=":
                return d ? a >= c : a <= c
        }
    }, e.prototype.on = function (a, b, c, d) {
        a.addEventListener ? a.addEventListener(b, c, d) : a.attachEvent && a.attachEvent("on" + b, c)
    }, e.prototype.off = function (a, b, c, d) {
        a.removeEventListener ? a.removeEventListener(b, c, d) : a.detachEvent && a.detachEvent("on" + b, c)
    }, e.prototype.trigger = function (b, c, d, f, g) {
        var h = {
                item: {
                    count: this._items.length,
                    index: this.current()
                }
            },
            i = a.camelCase(a.grep(["on", b, d], function (a) {
                return a
            }).join("-").toLowerCase()),
            j = a.Event([b, "owl", d || "carousel"].join(".").toLowerCase(), a.extend({
                relatedTarget: this
            }, h, c));
        return this._supress[b] || (a.each(this._plugins, function (a, b) {
            b.onTrigger && b.onTrigger(j)
        }), this.register({
            type: e.Type.Event,
            name: b
        }), this.$element.trigger(j), this.settings && "function" == typeof this.settings[i] && this.settings[i].call(this, j)), j
    }, e.prototype.enter = function (b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
            this._states.current[b] === d && (this._states.current[b] = 0), this._states.current[b]++
        }, this))
    }, e.prototype.leave = function (b) {
        a.each([b].concat(this._states.tags[b] || []), a.proxy(function (a, b) {
            this._states.current[b]--
        }, this))
    }, e.prototype.register = function (b) {
        if (b.type === e.Type.Event) {
            if (a.event.special[b.name] || (a.event.special[b.name] = {}), !a.event.special[b.name].owl) {
                var c = a.event.special[b.name]._default;
                a.event.special[b.name]._default = function (a) {
                    return !c || !c.apply || a.namespace && -1 !== a.namespace.indexOf("owl") ? a.namespace && a.namespace.indexOf("owl") > -1 : c.apply(this, arguments)
                }, a.event.special[b.name].owl = !0
            }
        } else b.type === e.Type.State && (this._states.tags[b.name] ? this._states.tags[b.name] = this._states.tags[b.name].concat(b.tags) : this._states.tags[b.name] = b.tags, this._states.tags[b.name] = a.grep(this._states.tags[b.name], a.proxy(function (c, d) {
            return a.inArray(c, this._states.tags[b.name]) === d
        }, this)))
    }, e.prototype.suppress = function (b) {
        a.each(b, a.proxy(function (a, b) {
            this._supress[b] = !0
        }, this))
    }, e.prototype.release = function (b) {
        a.each(b, a.proxy(function (a, b) {
            delete this._supress[b]
        }, this))
    }, e.prototype.pointer = function (a) {
        var c = {
            x: null,
            y: null
        };
        return a = a.originalEvent || a || b.event, a = a.touches && a.touches.length ? a.touches[0] : a.changedTouches && a.changedTouches.length ? a.changedTouches[0] : a, a.pageX ? (c.x = a.pageX, c.y = a.pageY) : (c.x = a.clientX, c.y = a.clientY), c
    }, e.prototype.isNumeric = function (a) {
        return !isNaN(parseFloat(a))
    }, e.prototype.difference = function (a, b) {
        return {
            x: a.x - b.x,
            y: a.y - b.y
        }
    }, a.fn.owlCarousel = function (b) {
        var c = Array.prototype.slice.call(arguments, 1);
        return this.each(function () {
            var d = a(this),
                f = d.data("owl.carousel");
            f || (f = new e(this, "object" == typeof b && b), d.data("owl.carousel", f), a.each(["next", "prev", "to", "destroy", "refresh", "replace", "add", "remove"], function (b, c) {
                f.register({
                    type: e.Type.Event,
                    name: c
                }), f.$element.on(c + ".owl.carousel.core", a.proxy(function (a) {
                    a.namespace && a.relatedTarget !== this && (this.suppress([c]), f[c].apply(this, [].slice.call(arguments, 1)), this.release([c]))
                }, f))
            })), "string" == typeof b && "_" !== b.charAt(0) && f[b].apply(f, c)
        })
    }, a.fn.owlCarousel.Constructor = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._interval = null, this._visible = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoRefresh && this.watch()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        autoRefresh: !0,
        autoRefreshInterval: 500
    }, e.prototype.watch = function () {
        this._interval || (this._visible = this._core.isVisible(), this._interval = b.setInterval(a.proxy(this.refresh, this), this._core.settings.autoRefreshInterval))
    }, e.prototype.refresh = function () {
        this._core.isVisible() !== this._visible && (this._visible = !this._visible, this._core.$element.toggleClass("owl-hidden", !this._visible), this._visible && this._core.invalidate("width") && this._core.refresh())
    }, e.prototype.destroy = function () {
        var a, c;
        b.clearInterval(this._interval);
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoRefresh = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._loaded = [], this._handlers = {
            "initialized.owl.carousel change.owl.carousel resized.owl.carousel": a.proxy(function (b) {
                if (b.namespace && this._core.settings && this._core.settings.lazyLoad && (b.property && "position" == b.property.name || "initialized" == b.type)) {
                    var c = this._core.settings,
                        e = c.center && Math.ceil(c.items / 2) || c.items,
                        f = c.center && -1 * e || 0,
                        g = (b.property && b.property.value !== d ? b.property.value : this._core.current()) + f,
                        h = this._core.clones().length,
                        i = a.proxy(function (a, b) {
                            this.load(b)
                        }, this);
                    for (c.lazyLoadEager > 0 && (e += c.lazyLoadEager, c.loop && (g -= c.lazyLoadEager, e++)); f++ < e;) this.load(h / 2 + this._core.relative(g)), h && a.each(this._core.clones(this._core.relative(g)), i), g++
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers)
    };
    e.Defaults = {
        lazyLoad: !1,
        lazyLoadEager: 0
    }, e.prototype.load = function (c) {
        var d = this._core.$stage.children().eq(c),
            e = d && d.find(".owl-lazy");
        !e || a.inArray(d.get(0), this._loaded) > -1 || (e.each(a.proxy(function (c, d) {
            var e, f = a(d),
                g = b.devicePixelRatio > 1 && f.attr("data-src-retina") || f.attr("data-src") || f.attr("data-srcset");
            this._core.trigger("load", {
                element: f,
                url: g
            }, "lazy"), f.is("img") ? f.one("load.owl.lazy", a.proxy(function () {
                f.css("opacity", 1), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this)).attr("src", g) : f.is("source") ? f.one("load.owl.lazy", a.proxy(function () {
                this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this)).attr("srcset", g) : (e = new Image, e.onload = a.proxy(function () {
                f.css({
                    "background-image": 'url("' + g + '")',
                    opacity: "1"
                }), this._core.trigger("loaded", {
                    element: f,
                    url: g
                }, "lazy")
            }, this), e.src = g)
        }, this)), this._loaded.push(d.get(0)))
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this._core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Lazy = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (c) {
        this._core = c, this._previousHeight = null, this._handlers = {
            "initialized.owl.carousel refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && this.update()
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && "position" === a.property.name && this.update()
            }, this),
            "loaded.owl.lazy": a.proxy(function (a) {
                a.namespace && this._core.settings.autoHeight && a.element.closest("." + this._core.settings.itemClass).index() === this._core.current() && this.update()
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._intervalId = null;
        var d = this;
        a(b).on("load", function () {
            d._core.settings.autoHeight && d.update()
        }), a(b).resize(function () {
            d._core.settings.autoHeight && (null != d._intervalId && clearTimeout(d._intervalId), d._intervalId = setTimeout(function () {
                d.update()
            }, 250))
        })
    };
    e.Defaults = {
        autoHeight: !1,
        autoHeightClass: "owl-height"
    }, e.prototype.update = function () {
        var b = this._core._current,
            c = b + this._core.settings.items,
            d = this._core.settings.lazyLoad,
            e = this._core.$stage.children().toArray().slice(b, c),
            f = [],
            g = 0;
        a.each(e, function (b, c) {
            f.push(a(c).height())
        }), g = Math.max.apply(null, f), g <= 1 && d && this._previousHeight && (g = this._previousHeight), this._previousHeight = g, this._core.$stage.parent().height(g).addClass(this._core.settings.autoHeightClass)
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.AutoHeight = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._videos = {}, this._playing = null, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.register({
                    type: "state",
                    name: "playing",
                    tags: ["interacting"]
                })
            }, this),
            "resize.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.video && this.isInFullScreen() && a.preventDefault()
            }, this),
            "refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.is("resizing") && this._core.$stage.find(".cloned .owl-video-frame").remove()
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" === a.property.name && this._playing && this.stop()
            }, this),
            "prepared.owl.carousel": a.proxy(function (b) {
                if (b.namespace) {
                    var c = a(b.content).find(".owl-video");
                    c.length && (c.css("display", "none"), this.fetch(c, a(b.content)))
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this._core.$element.on(this._handlers), this._core.$element.on("click.owl.video", ".owl-video-play-icon", a.proxy(function (a) {
            this.play(a)
        }, this))
    };
    e.Defaults = {
        video: !1,
        videoHeight: !1,
        videoWidth: !1
    }, e.prototype.fetch = function (a, b) {
        var c = function () {
                return a.attr("data-vimeo-id") ? "vimeo" : a.attr("data-vzaar-id") ? "vzaar" : "youtube"
            }(),
            d = a.attr("data-vimeo-id") || a.attr("data-youtube-id") || a.attr("data-vzaar-id"),
            e = a.attr("data-width") || this._core.settings.videoWidth,
            f = a.attr("data-height") || this._core.settings.videoHeight,
            g = a.attr("href");
        if (!g) throw new Error("Missing video URL.");
        if (d = g.match(/(http:|https:|)\/\/(player.|www.|app.)?(vimeo\.com|youtu(be\.com|\.be|be\.googleapis\.com|be\-nocookie\.com)|vzaar\.com)\/(video\/|videos\/|embed\/|channels\/.+\/|groups\/.+\/|watch\?v=|v\/)?([A-Za-z0-9._%-]*)(\&\S+)?/), d[3].indexOf("youtu") > -1) c = "youtube";
        else if (d[3].indexOf("vimeo") > -1) c = "vimeo";
        else {
            if (!(d[3].indexOf("vzaar") > -1)) throw new Error("Video URL not supported.");
            c = "vzaar"
        }
        d = d[6], this._videos[g] = {
            type: c,
            id: d,
            width: e,
            height: f
        }, b.attr("data-video", g), this.thumbnail(a, this._videos[g])
    }, e.prototype.thumbnail = function (b, c) {
        var d, e, f, g = c.width && c.height ? "width:" + c.width + "px;height:" + c.height + "px;" : "",
            h = b.find("img"),
            i = "src",
            j = "",
            k = this._core.settings,
            l = function (c) {
                e = '<div class="owl-video-play-icon"></div>', d = k.lazyLoad ? a("<div/>", {
                    class: "owl-video-tn " + j,
                    srcType: c
                }) : a("<div/>", {
                    class: "owl-video-tn",
                    style: "opacity:1;background-image:url(" + c + ")"
                }), b.after(d), b.after(e)
            };
        if (b.wrap(a("<div/>", {
                class: "owl-video-wrapper",
                style: g
            })), this._core.settings.lazyLoad && (i = "data-src", j = "owl-lazy"), h.length) return l(h.attr(i)), h.remove(), !1;
        "youtube" === c.type ? (f = "//img.youtube.com/vi/" + c.id + "/hqdefault.jpg", l(f)) : "vimeo" === c.type ? a.ajax({
            type: "GET",
            url: "//vimeo.com/api/v2/video/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (a) {
                f = a[0].thumbnail_large, l(f)
            }
        }) : "vzaar" === c.type && a.ajax({
            type: "GET",
            url: "//vzaar.com/api/videos/" + c.id + ".json",
            jsonp: "callback",
            dataType: "jsonp",
            success: function (a) {
                f = a.framegrab_url, l(f)
            }
        })
    }, e.prototype.stop = function () {
        this._core.trigger("stop", null, "video"), this._playing.find(".owl-video-frame").remove(), this._playing.removeClass("owl-video-playing"), this._playing = null, this._core.leave("playing"), this._core.trigger("stopped", null, "video")
    }, e.prototype.play = function (b) {
        var c, d = a(b.target),
            e = d.closest("." + this._core.settings.itemClass),
            f = this._videos[e.attr("data-video")],
            g = f.width || "100%",
            h = f.height || this._core.$stage.height();
        this._playing || (this._core.enter("playing"), this._core.trigger("play", null, "video"), e = this._core.items(this._core.relative(e.index())), this._core.reset(e.index()), c = a('<iframe frameborder="0" allowfullscreen mozallowfullscreen webkitAllowFullScreen ></iframe>'), c.attr("height", h), c.attr("width", g), "youtube" === f.type ? c.attr("src", "//www.youtube.com/embed/" + f.id + "?autoplay=1&rel=0&v=" + f.id) : "vimeo" === f.type ? c.attr("src", "//player.vimeo.com/video/" + f.id + "?autoplay=1") : "vzaar" === f.type && c.attr("src", "//view.vzaar.com/" + f.id + "/player?autoplay=true"), a(c).wrap('<div class="owl-video-frame" />').insertAfter(e.find(".owl-video")), this._playing = e.addClass("owl-video-playing"))
    }, e.prototype.isInFullScreen = function () {
        var b = c.fullscreenElement || c.mozFullScreenElement || c.webkitFullscreenElement;
        return b && a(b).parent().hasClass("owl-video-frame")
    }, e.prototype.destroy = function () {
        var a, b;
        this._core.$element.off("click.owl.video");
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Video = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this.core = b, this.core.options = a.extend({}, e.Defaults, this.core.options), this.swapping = !0, this.previous = d, this.next = d, this.handlers = {
            "change.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" == a.property.name && (this.previous = this.core.current(), this.next = a.property.value)
            }, this),
            "drag.owl.carousel dragged.owl.carousel translated.owl.carousel": a.proxy(function (a) {
                a.namespace && (this.swapping = "translated" == a.type)
            }, this),
            "translate.owl.carousel": a.proxy(function (a) {
                a.namespace && this.swapping && (this.core.options.animateOut || this.core.options.animateIn) && this.swap()
            }, this)
        }, this.core.$element.on(this.handlers)
    };
    e.Defaults = {
        animateOut: !1,
        animateIn: !1
    }, e.prototype.swap = function () {
        if (1 === this.core.settings.items && a.support.animation && a.support.transition) {
            this.core.speed(0);
            var b, c = a.proxy(this.clear, this),
                d = this.core.$stage.children().eq(this.previous),
                e = this.core.$stage.children().eq(this.next),
                f = this.core.settings.animateIn,
                g = this.core.settings.animateOut;
            this.core.current() !== this.previous && (g && (b = this.core.coordinates(this.previous) - this.core.coordinates(this.next), d.one(a.support.animation.end, c).css({
                left: b + "px"
            }).addClass("animated owl-animated-out").addClass(g)), f && e.one(a.support.animation.end, c).addClass("animated owl-animated-in").addClass(f))
        }
    }, e.prototype.clear = function (b) {
        a(b.target).css({
            left: ""
        }).removeClass("animated owl-animated-out owl-animated-in").removeClass(this.core.settings.animateIn).removeClass(this.core.settings.animateOut), this.core.onTransitionEnd()
    }, e.prototype.destroy = function () {
        var a, b;
        for (a in this.handlers) this.core.$element.off(a, this.handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Animate = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    var e = function (b) {
        this._core = b, this._call = null, this._time = 0, this._timeout = 0, this._paused = !0, this._handlers = {
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "settings" === a.property.name ? this._core.settings.autoplay ? this.play() : this.stop() : a.namespace && "position" === a.property.name && this._paused && (this._time = 0)
            }, this),
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.autoplay && this.play()
            }, this),
            "play.owl.autoplay": a.proxy(function (a, b, c) {
                a.namespace && this.play(b, c)
            }, this),
            "stop.owl.autoplay": a.proxy(function (a) {
                a.namespace && this.stop()
            }, this),
            "mouseover.owl.autoplay": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "mouseleave.owl.autoplay": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.play()
            }, this),
            "touchstart.owl.core": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this._core.is("rotating") && this.pause()
            }, this),
            "touchend.owl.core": a.proxy(function () {
                this._core.settings.autoplayHoverPause && this.play()
            }, this)
        }, this._core.$element.on(this._handlers), this._core.options = a.extend({}, e.Defaults, this._core.options)
    };
    e.Defaults = {
        autoplay: !1,
        autoplayTimeout: 5e3,
        autoplayHoverPause: !1,
        autoplaySpeed: !1
    }, e.prototype._next = function (d) {
        this._call = b.setTimeout(a.proxy(this._next, this, d), this._timeout * (Math.round(this.read() / this._timeout) + 1) - this.read()), this._core.is("interacting") || c.hidden || this._core.next(d || this._core.settings.autoplaySpeed)
    }, e.prototype.read = function () {
        return (new Date).getTime() - this._time
    }, e.prototype.play = function (c, d) {
        var e;
        this._core.is("rotating") || this._core.enter("rotating"), c = c || this._core.settings.autoplayTimeout, e = Math.min(this._time % (this._timeout || c), c), this._paused ? (this._time = this.read(), this._paused = !1) : b.clearTimeout(this._call), this._time += this.read() % c - e, this._timeout = c, this._call = b.setTimeout(a.proxy(this._next, this, d), c - e)
    }, e.prototype.stop = function () {
        this._core.is("rotating") && (this._time = 0, this._paused = !0, b.clearTimeout(this._call), this._core.leave("rotating"))
    }, e.prototype.pause = function () {
        this._core.is("rotating") && !this._paused && (this._time = this.read(), this._paused = !0, b.clearTimeout(this._call))
    }, e.prototype.destroy = function () {
        var a, b;
        this.stop();
        for (a in this._handlers) this._core.$element.off(a, this._handlers[a]);
        for (b in Object.getOwnPropertyNames(this)) "function" != typeof this[b] && (this[b] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.autoplay = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    "use strict";
    var e = function (b) {
        this._core = b, this._initialized = !1, this._pages = [], this._controls = {}, this._templates = [], this.$element = this._core.$element, this._overrides = {
            next: this._core.next,
            prev: this._core.prev,
            to: this._core.to
        }, this._handlers = {
            "prepared.owl.carousel": a.proxy(function (b) {
                b.namespace && this._core.settings.dotsData && this._templates.push('<div class="' + this._core.settings.dotClass + '">' + a(b.content).find("[data-dot]").addBack("[data-dot]").attr("data-dot") + "</div>")
            }, this),
            "added.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 0, this._templates.pop())
            }, this),
            "remove.owl.carousel": a.proxy(function (a) {
                a.namespace && this._core.settings.dotsData && this._templates.splice(a.position, 1)
            }, this),
            "changed.owl.carousel": a.proxy(function (a) {
                a.namespace && "position" == a.property.name && this.draw()
            }, this),
            "initialized.owl.carousel": a.proxy(function (a) {
                a.namespace && !this._initialized && (this._core.trigger("initialize", null, "navigation"), this.initialize(), this.update(), this.draw(), this._initialized = !0, this._core.trigger("initialized", null, "navigation"))
            }, this),
            "refreshed.owl.carousel": a.proxy(function (a) {
                a.namespace && this._initialized && (this._core.trigger("refresh", null, "navigation"), this.update(), this.draw(), this._core.trigger("refreshed", null, "navigation"))
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers)
    };
    e.Defaults = {
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
    }, e.prototype.initialize = function () {
        var b, c = this._core.settings;
        this._controls.$relative = (c.navContainer ? a(c.navContainer) : a("<div>").addClass(c.navContainerClass).appendTo(this.$element)).addClass("disabled"), this._controls.$previous = a("<" + c.navElement + ">").addClass(c.navClass[0]).html(c.navText[0]).prependTo(this._controls.$relative).on("click", a.proxy(function (a) {
            this.prev(c.navSpeed)
        }, this)), this._controls.$next = a("<" + c.navElement + ">").addClass(c.navClass[1]).html(c.navText[1]).appendTo(this._controls.$relative).on("click", a.proxy(function (a) {
            this.next(c.navSpeed)
        }, this)), c.dotsData || (this._templates = [a('<button role="button">').addClass(c.dotClass).append(a("<span>")).prop("outerHTML")]), this._controls.$absolute = (c.dotsContainer ? a(c.dotsContainer) : a("<div>").addClass(c.dotsClass).appendTo(this.$element)).addClass("disabled"), this._controls.$absolute.on("click", "button", a.proxy(function (b) {
            var d = a(b.target).parent().is(this._controls.$absolute) ? a(b.target).index() : a(b.target).parent().index();
            b.preventDefault(), this.to(d, c.dotsSpeed)
        }, this));
        for (b in this._overrides) this._core[b] = a.proxy(this[b], this)
    }, e.prototype.destroy = function () {
        var a, b, c, d, e;
        e = this._core.settings;
        for (a in this._handlers) this.$element.off(a, this._handlers[a]);
        for (b in this._controls) "$relative" === b && e.navContainer ? this._controls[b].html("") : this._controls[b].remove();
        for (d in this.overides) this._core[d] = this._overrides[d];
        for (c in Object.getOwnPropertyNames(this)) "function" != typeof this[c] && (this[c] = null)
    }, e.prototype.update = function () {
        var a, b, c, d = this._core.clones().length / 2,
            e = d + this._core.items().length,
            f = this._core.maximum(!0),
            g = this._core.settings,
            h = g.center || g.autoWidth || g.dotsData ? 1 : g.dotsEach || g.items;
        if ("page" !== g.slideBy && (g.slideBy = Math.min(g.slideBy, g.items)), g.dots || "page" == g.slideBy)
            for (this._pages = [], a = d, b = 0, c = 0; a < e; a++) {
                if (b >= h || 0 === b) {
                    if (this._pages.push({
                            start: Math.min(f, a - d),
                            end: a - d + h - 1
                        }), Math.min(f, a - d) === f) break;
                    b = 0, ++c
                }
                b += this._core.mergers(this._core.relative(a))
            }
    }, e.prototype.draw = function () {
        var b, c = this._core.settings,
            d = this._core.items().length <= c.items,
            e = this._core.relative(this._core.current()),
            f = c.loop || c.rewind;
        this._controls.$relative.toggleClass("disabled", !c.nav || d), c.nav && (this._controls.$previous.toggleClass("disabled", !f && e <= this._core.minimum(!0)), this._controls.$next.toggleClass("disabled", !f && e >= this._core.maximum(!0))), this._controls.$absolute.toggleClass("disabled", !c.dots || d), c.dots && (b = this._pages.length - this._controls.$absolute.children().length, c.dotsData && 0 !== b ? this._controls.$absolute.html(this._templates.join("")) : b > 0 ? this._controls.$absolute.append(new Array(b + 1).join(this._templates[0])) : b < 0 && this._controls.$absolute.children().slice(b).remove(), this._controls.$absolute.find(".active").removeClass("active"), this._controls.$absolute.children().eq(a.inArray(this.current(), this._pages)).addClass("active"))
    }, e.prototype.onTrigger = function (b) {
        var c = this._core.settings;
        b.page = {
            index: a.inArray(this.current(), this._pages),
            count: this._pages.length,
            size: c && (c.center || c.autoWidth || c.dotsData ? 1 : c.dotsEach || c.items)
        }
    }, e.prototype.current = function () {
        var b = this._core.relative(this._core.current());
        return a.grep(this._pages, a.proxy(function (a, c) {
            return a.start <= b && a.end >= b
        }, this)).pop()
    }, e.prototype.getPosition = function (b) {
        var c, d, e = this._core.settings;
        return "page" == e.slideBy ? (c = a.inArray(this.current(), this._pages), d = this._pages.length, b ? ++c : --c, c = this._pages[(c % d + d) % d].start) : (c = this._core.relative(this._core.current()), d = this._core.items().length, b ? c += e.slideBy : c -= e.slideBy), c
    }, e.prototype.next = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!0), b)
    }, e.prototype.prev = function (b) {
        a.proxy(this._overrides.to, this._core)(this.getPosition(!1), b)
    }, e.prototype.to = function (b, c, d) {
        var e;
        !d && this._pages.length ? (e = this._pages.length, a.proxy(this._overrides.to, this._core)(this._pages[(b % e + e) % e].start, c)) : a.proxy(this._overrides.to, this._core)(b, c)
    }, a.fn.owlCarousel.Constructor.Plugins.Navigation = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    "use strict";
    var e = function (c) {
        this._core = c, this._hashes = {}, this.$element = this._core.$element, this._handlers = {
            "initialized.owl.carousel": a.proxy(function (c) {
                c.namespace && "URLHash" === this._core.settings.startPosition && a(b).trigger("hashchange.owl.navigation")
            }, this),
            "prepared.owl.carousel": a.proxy(function (b) {
                if (b.namespace) {
                    var c = a(b.content).find("[data-hash]").addBack("[data-hash]").attr("data-hash");
                    if (!c) return;
                    this._hashes[c] = b.content
                }
            }, this),
            "changed.owl.carousel": a.proxy(function (c) {
                if (c.namespace && "position" === c.property.name) {
                    var d = this._core.items(this._core.relative(this._core.current())),
                        e = a.map(this._hashes, function (a, b) {
                            return a === d ? b : null
                        }).join();
                    if (!e || b.location.hash.slice(1) === e) return;
                    b.location.hash = e
                }
            }, this)
        }, this._core.options = a.extend({}, e.Defaults, this._core.options), this.$element.on(this._handlers), a(b).on("hashchange.owl.navigation", a.proxy(function (a) {
            var c = b.location.hash.substring(1),
                e = this._core.$stage.children(),
                f = this._hashes[c] && e.index(this._hashes[c]);
            f !== d && f !== this._core.current() && this._core.to(this._core.relative(f), !1, !0)
        }, this))
    };
    e.Defaults = {
        URLhashListener: !1
    }, e.prototype.destroy = function () {
        var c, d;
        a(b).off("hashchange.owl.navigation");
        for (c in this._handlers) this._core.$element.off(c, this._handlers[c]);
        for (d in Object.getOwnPropertyNames(this)) "function" != typeof this[d] && (this[d] = null)
    }, a.fn.owlCarousel.Constructor.Plugins.Hash = e
}(window.Zepto || window.jQuery, window, document),
function (a, b, c, d) {
    function e(b, c) {
        var e = !1,
            f = b.charAt(0).toUpperCase() + b.slice(1);
        return a.each((b + " " + h.join(f + " ") + f).split(" "), function (a, b) {
            if (g[b] !== d) return e = !c || b, !1
        }), e
    }

    function f(a) {
        return e(a, !0)
    }
    var g = a("<support>").get(0).style,
        h = "Webkit Moz O ms".split(" "),
        i = {
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
        j = {
            csstransforms: function () {
                return !!e("transform")
            },
            csstransforms3d: function () {
                return !!e("perspective")
            },
            csstransitions: function () {
                return !!e("transition")
            },
            cssanimations: function () {
                return !!e("animation")
            }
        };
    j.csstransitions() && (a.support.transition = new String(f("transition")), a.support.transition.end = i.transition.end[a.support.transition]), j.cssanimations() && (a.support.animation = new String(f("animation")), a.support.animation.end = i.animation.end[a.support.animation]), j.csstransforms() && (a.support.transform = new String(f("transform")), a.support.transform3d = j.csstransforms3d())
}(window.Zepto || window.jQuery, window, document);;
(function ($) {
    'use strict';
    $.fn.fitVids = function (options) {
        var settings = {
            customSelector: null,
            ignore: null
        };
        if (!document.getElementById('fit-vids-style')) {
            var head = document.head || document.getElementsByTagName('head')[0];
            var css = '.fluid-width-video-wrapper{width:100%;position:relative;padding:0;}.fluid-width-video-wrapper iframe,.fluid-width-video-wrapper object,.fluid-width-video-wrapper embed {position:absolute;top:0;left:0;width:100%;height:100%;}';
            var div = document.createElement("div");
            div.innerHTML = '<p>x</p><style id="fit-vids-style">' + css + '</style>';
            head.appendChild(div.childNodes[1]);
        }
        if (options) {
            $.extend(settings, options);
        }
        return this.each(function () {
            var selectors = ['iframe[src*="player.vimeo.com"]', 'iframe[src*="youtube.com"]', 'iframe[src*="youtube-nocookie.com"]', 'iframe[src*="kickstarter.com"][src*="video.html"]', 'object', 'embed'];
            if (settings.customSelector) {
                selectors.push(settings.customSelector);
            }
            var ignoreList = '.fitvidsignore';
            if (settings.ignore) {
                ignoreList = ignoreList + ', ' + settings.ignore;
            }
            var $allVideos = $(this).find(selectors.join(','));
            $allVideos = $allVideos.not('object object');
            $allVideos = $allVideos.not(ignoreList);
            $allVideos.each(function (count) {
                var $this = $(this);
                if ($this.parents(ignoreList).length > 0) {
                    return;
                }
                if (this.tagName.toLowerCase() === 'embed' && $this.parent('object').length || $this.parent('.fluid-width-video-wrapper').length) {
                    return;
                }
                if ((!$this.css('height') && !$this.css('width')) && (isNaN($this.attr('height')) || isNaN($this.attr('width')))) {
                    $this.attr('height', 9);
                    $this.attr('width', 16);
                }
                var height = (this.tagName.toLowerCase() === 'object' || ($this.attr('height') && !isNaN(parseInt($this.attr('height'), 10)))) ? parseInt($this.attr('height'), 10) : $this.height(),
                    width = !isNaN(parseInt($this.attr('width'), 10)) ? parseInt($this.attr('width'), 10) : $this.width(),
                    aspectRatio = height / width;
                if (!$this.attr('id')) {
                    var videoID = 'fitvid' + count;
                    $this.attr('id', videoID);
                }
                $this.wrap('<div class="fluid-width-video-wrapper"></div>').parent('.fluid-width-video-wrapper').css('padding-top', (aspectRatio * 100) + '%');
                $this.removeAttr('height').removeAttr('width');
            });
        });
    };
})(window.jQuery || window.Zepto);
(function (a) {
    a.fn.extend({
        customSelect: function (c) {
            if (typeof document.body.style.maxHeight === "undefined") {
                return this
            }
            var e = {
                    customClass: "customSelect",
                    mapClass: true,
                    mapStyle: true
                },
                c = a.extend(e, c),
                d = c.customClass,
                f = function (h, k) {
                    var g = h.find(":selected"),
                        j = k.children(":first"),
                        i = g.html() || "&nbsp;";
                    j.html(i);
                    if (g.attr("disabled")) {
                        k.addClass(b("DisabledOption"))
                    } else {
                        k.removeClass(b("DisabledOption"))
                    }
                    setTimeout(function () {
                        k.removeClass(b("Open"));
                        a(document).off("mouseup.customSelect")
                    }, 60)
                },
                b = function (g) {
                    return d + g
                };
            return this.each(function () {
                var g = a(this),
                    i = a("<span />").addClass(b("Inner")),
                    h = a("<span />");
                g.after(h.append(i));
                h.addClass(d);
                if (c.mapClass) {
                    h.addClass(g.attr("class"))
                }
                if (c.mapStyle) {
                    h.attr("style", g.attr("style"))
                }
                g.addClass("hasCustomSelect").on("render.customSelect", function () {
                    f(g, h);
                    g.css("width", "");
                    var k = parseInt(g.outerWidth(), 10) - (parseInt(h.outerWidth(), 10) - parseInt(h.width(), 10));
                    h.css({
                        display: "inline-block"
                    });
                    var j = h.outerHeight();
                    if (g.attr("disabled")) {
                        h.addClass(b("Disabled"))
                    } else {
                        h.removeClass(b("Disabled"))
                    }
                    i.css({
                        width: k,
                        display: "inline-block"
                    });
                    g.css({
                        "-webkit-appearance": "menulist-button",
                        width: h.outerWidth(),
                        position: "absolute",
                        opacity: 0,
                        height: j,
                        fontSize: h.css("font-size")
                    })
                }).on("change.customSelect", function () {
                    h.addClass(b("Changed"));
                    f(g, h)
                }).on("keyup.customSelect", function (j) {
                    if (!h.hasClass(b("Open"))) {
                        g.trigger("blur.customSelect");
                        g.trigger("focus.customSelect")
                    } else {
                        if (j.which == 13 || j.which == 27) {
                            f(g, h)
                        }
                    }
                }).on("mousedown.customSelect", function () {
                    h.removeClass(b("Changed"))
                }).on("mouseup.customSelect", function (j) {
                    if (!h.hasClass(b("Open"))) {
                        if (a("." + b("Open")).not(h).length > 0 && typeof InstallTrigger !== "undefined") {
                            g.trigger("focus.customSelect")
                        } else {
                            h.addClass(b("Open"));
                            j.stopPropagation();
                            a(document).one("mouseup.customSelect", function (k) {
                                if (k.target != g.get(0) && a.inArray(k.target, g.find("*").get()) < 0) {
                                    g.trigger("blur.customSelect")
                                } else {
                                    f(g, h)
                                }
                            })
                        }
                    }
                }).on("focus.customSelect", function () {
                    h.removeClass(b("Changed")).addClass(b("Focus"))
                }).on("blur.customSelect", function () {
                    h.removeClass(b("Focus") + " " + b("Open"))
                }).on("mouseenter.customSelect", function () {
                    h.addClass(b("Hover"))
                }).on("mouseleave.customSelect", function () {
                    h.removeClass(b("Hover"))
                }).trigger("render.customSelect")
            })
        }
    })
})(jQuery);
! function (a) {
    "function" == typeof define && define.amd ? define(["jquery"], a) : a("object" == typeof exports ? require("jquery") : window.jQuery || window.Zepto)
}(function (a) {
    var b, c, d, e, f, g, h = "Close",
        i = "BeforeClose",
        j = "AfterClose",
        k = "BeforeAppend",
        l = "MarkupParse",
        m = "Open",
        n = "Change",
        o = "mfp",
        p = "." + o,
        q = "mfp-ready",
        r = "mfp-removing",
        s = "mfp-prevent-close",
        t = function () {},
        u = !!window.jQuery,
        v = a(window),
        w = function (a, c) {
            b.ev.on(o + a + p, c)
        },
        x = function (b, c, d, e) {
            var f = document.createElement("div");
            return f.className = "mfp-" + b, d && (f.innerHTML = d), e ? c && c.appendChild(f) : (f = a(f), c && f.appendTo(c)), f
        },
        y = function (c, d) {
            b.ev.triggerHandler(o + c, d), b.st.callbacks && (c = c.charAt(0).toLowerCase() + c.slice(1), b.st.callbacks[c] && b.st.callbacks[c].apply(b, a.isArray(d) ? d : [d]))
        },
        z = function (c) {
            return c === g && b.currTemplate.closeBtn || (b.currTemplate.closeBtn = a(b.st.closeMarkup.replace("%title%", b.st.tClose)), g = c), b.currTemplate.closeBtn
        },
        A = function () {
            a.magnificPopup.instance || (b = new t, b.init(), a.magnificPopup.instance = b)
        },
        B = function () {
            var a = document.createElement("p").style,
                b = ["ms", "O", "Moz", "Webkit"];
            if (void 0 !== a.transition) return !0;
            for (; b.length;)
                if (b.pop() + "Transition" in a) return !0;
            return !1
        };
    t.prototype = {
        constructor: t,
        init: function () {
            var c = navigator.appVersion;
            b.isLowIE = b.isIE8 = document.all && !document.addEventListener, b.isAndroid = /android/gi.test(c), b.isIOS = /iphone|ipad|ipod/gi.test(c), b.supportsTransition = B(), b.probablyMobile = b.isAndroid || b.isIOS || /(Opera Mini)|Kindle|webOS|BlackBerry|(Opera Mobi)|(Windows Phone)|IEMobile/i.test(navigator.userAgent), d = a(document), b.popupsCache = {}
        },
        open: function (c) {
            var e;
            if (c.isObj === !1) {
                b.items = c.items.toArray(), b.index = 0;
                var g, h = c.items;
                for (e = 0; e < h.length; e++)
                    if (g = h[e], g.parsed && (g = g.el[0]), g === c.el[0]) {
                        b.index = e;
                        break
                    }
            } else b.items = a.isArray(c.items) ? c.items : [c.items], b.index = c.index || 0;
            if (b.isOpen) return void b.updateItemHTML();
            b.types = [], f = "", c.mainEl && c.mainEl.length ? b.ev = c.mainEl.eq(0) : b.ev = d, c.key ? (b.popupsCache[c.key] || (b.popupsCache[c.key] = {}), b.currTemplate = b.popupsCache[c.key]) : b.currTemplate = {}, b.st = a.extend(!0, {}, a.magnificPopup.defaults, c), b.fixedContentPos = "auto" === b.st.fixedContentPos ? !b.probablyMobile : b.st.fixedContentPos, b.st.modal && (b.st.closeOnContentClick = !1, b.st.closeOnBgClick = !1, b.st.showCloseBtn = !1, b.st.enableEscapeKey = !1), b.bgOverlay || (b.bgOverlay = x("bg").on("click" + p, function () {
                b.close()
            }), b.wrap = x("wrap").attr("tabindex", -1).on("click" + p, function (a) {
                b._checkIfClose(a.target) && b.close()
            }), b.container = x("container", b.wrap)), b.contentContainer = x("content"), b.st.preloader && (b.preloader = x("preloader", b.container, b.st.tLoading));
            var i = a.magnificPopup.modules;
            for (e = 0; e < i.length; e++) {
                var j = i[e];
                j = j.charAt(0).toUpperCase() + j.slice(1), b["init" + j].call(b)
            }
            y("BeforeOpen"), b.st.showCloseBtn && (b.st.closeBtnInside ? (w(l, function (a, b, c, d) {
                c.close_replaceWith = z(d.type)
            }), f += " mfp-close-btn-in") : b.wrap.append(z())), b.st.alignTop && (f += " mfp-align-top"), b.fixedContentPos ? b.wrap.css({
                overflow: b.st.overflowY,
                overflowX: "hidden",
                overflowY: b.st.overflowY
            }) : b.wrap.css({
                top: v.scrollTop(),
                position: "absolute"
            }), (b.st.fixedBgPos === !1 || "auto" === b.st.fixedBgPos && !b.fixedContentPos) && b.bgOverlay.css({
                height: d.height(),
                position: "absolute"
            }), b.st.enableEscapeKey && d.on("keyup" + p, function (a) {
                27 === a.keyCode && b.close()
            }), v.on("resize" + p, function () {
                b.updateSize()
            }), b.st.closeOnContentClick || (f += " mfp-auto-cursor"), f && b.wrap.addClass(f);
            var k = b.wH = v.height(),
                n = {};
            if (b.fixedContentPos && b._hasScrollBar(k)) {
                var o = b._getScrollbarSize();
                o && (n.marginRight = o)
            }
            b.fixedContentPos && (b.isIE7 ? a("body, html").css("overflow", "hidden") : n.overflow = "hidden");
            var r = b.st.mainClass;
            return b.isIE7 && (r += " mfp-ie7"), r && b._addClassToMFP(r), b.updateItemHTML(), y("BuildControls"), a("html").css(n), b.bgOverlay.add(b.wrap).prependTo(b.st.prependTo || a(document.body)), b._lastFocusedEl = document.activeElement, setTimeout(function () {
                b.content ? (b._addClassToMFP(q), b._setFocus()) : b.bgOverlay.addClass(q), d.on("focusin" + p, b._onFocusIn)
            }, 16), b.isOpen = !0, b.updateSize(k), y(m), c
        },
        close: function () {
            b.isOpen && (y(i), b.isOpen = !1, b.st.removalDelay && !b.isLowIE && b.supportsTransition ? (b._addClassToMFP(r), setTimeout(function () {
                b._close()
            }, b.st.removalDelay)) : b._close())
        },
        _close: function () {
            y(h);
            var c = r + " " + q + " ";
            if (b.bgOverlay.detach(), b.wrap.detach(), b.container.empty(), b.st.mainClass && (c += b.st.mainClass + " "), b._removeClassFromMFP(c), b.fixedContentPos) {
                var e = {
                    marginRight: ""
                };
                b.isIE7 ? a("body, html").css("overflow", "") : e.overflow = "", a("html").css(e)
            }
            d.off("keyup" + p + " focusin" + p), b.ev.off(p), b.wrap.attr("class", "mfp-wrap").removeAttr("style"), b.bgOverlay.attr("class", "mfp-bg"), b.container.attr("class", "mfp-container"), !b.st.showCloseBtn || b.st.closeBtnInside && b.currTemplate[b.currItem.type] !== !0 || b.currTemplate.closeBtn && b.currTemplate.closeBtn.detach(), b.st.autoFocusLast && b._lastFocusedEl && a(b._lastFocusedEl).focus(), b.currItem = null, b.content = null, b.currTemplate = null, b.prevHeight = 0, y(j)
        },
        updateSize: function (a) {
            if (b.isIOS) {
                var c = document.documentElement.clientWidth / window.innerWidth,
                    d = window.innerHeight * c;
                b.wrap.css("height", d), b.wH = d
            } else b.wH = a || v.height();
            b.fixedContentPos || b.wrap.css("height", b.wH), y("Resize")
        },
        updateItemHTML: function () {
            var c = b.items[b.index];
            b.contentContainer.detach(), b.content && b.content.detach(), c.parsed || (c = b.parseEl(b.index));
            var d = c.type;
            if (y("BeforeChange", [b.currItem ? b.currItem.type : "", d]), b.currItem = c, !b.currTemplate[d]) {
                var f = b.st[d] ? b.st[d].markup : !1;
                y("FirstMarkupParse", f), f ? b.currTemplate[d] = a(f) : b.currTemplate[d] = !0
            }
            e && e !== c.type && b.container.removeClass("mfp-" + e + "-holder");
            var g = b["get" + d.charAt(0).toUpperCase() + d.slice(1)](c, b.currTemplate[d]);
            b.appendContent(g, d), c.preloaded = !0, y(n, c), e = c.type, b.container.prepend(b.contentContainer), y("AfterChange")
        },
        appendContent: function (a, c) {
            b.content = a, a ? b.st.showCloseBtn && b.st.closeBtnInside && b.currTemplate[c] === !0 ? b.content.find(".mfp-close").length || b.content.append(z()) : b.content = a : b.content = "", y(k), b.container.addClass("mfp-" + c + "-holder"), b.contentContainer.append(b.content)
        },
        parseEl: function (c) {
            var d, e = b.items[c];
            if (e.tagName ? e = {
                    el: a(e)
                } : (d = e.type, e = {
                    data: e,
                    src: e.src
                }), e.el) {
                for (var f = b.types, g = 0; g < f.length; g++)
                    if (e.el.hasClass("mfp-" + f[g])) {
                        d = f[g];
                        break
                    } e.src = e.el.attr("data-mfp-src"), e.src || (e.src = e.el.attr("href"))
            }
            return e.type = d || b.st.type || "inline", e.index = c, e.parsed = !0, b.items[c] = e, y("ElementParse", e), b.items[c]
        },
        addGroup: function (a, c) {
            var d = function (d) {
                d.mfpEl = this, b._openClick(d, a, c)
            };
            c || (c = {});
            var e = "click.magnificPopup";
            c.mainEl = a, c.items ? (c.isObj = !0, a.off(e).on(e, d)) : (c.isObj = !1, c.delegate ? a.off(e).on(e, c.delegate, d) : (c.items = a, a.off(e).on(e, d)))
        },
        _openClick: function (c, d, e) {
            var f = void 0 !== e.midClick ? e.midClick : a.magnificPopup.defaults.midClick;
            if (f || !(2 === c.which || c.ctrlKey || c.metaKey || c.altKey || c.shiftKey)) {
                var g = void 0 !== e.disableOn ? e.disableOn : a.magnificPopup.defaults.disableOn;
                if (g)
                    if (a.isFunction(g)) {
                        if (!g.call(b)) return !0
                    } else if (v.width() < g) return !0;
                c.type && (c.preventDefault(), b.isOpen && c.stopPropagation()), e.el = a(c.mfpEl), e.delegate && (e.items = d.find(e.delegate)), b.open(e)
            }
        },
        updateStatus: function (a, d) {
            if (b.preloader) {
                c !== a && b.container.removeClass("mfp-s-" + c), d || "loading" !== a || (d = b.st.tLoading);
                var e = {
                    status: a,
                    text: d
                };
                y("UpdateStatus", e), a = e.status, d = e.text, b.preloader.html(d), b.preloader.find("a").on("click", function (a) {
                    a.stopImmediatePropagation()
                }), b.container.addClass("mfp-s-" + a), c = a
            }
        },
        _checkIfClose: function (c) {
            if (!a(c).hasClass(s)) {
                var d = b.st.closeOnContentClick,
                    e = b.st.closeOnBgClick;
                if (d && e) return !0;
                if (!b.content || a(c).hasClass("mfp-close") || b.preloader && c === b.preloader[0]) return !0;
                if (c === b.content[0] || a.contains(b.content[0], c)) {
                    if (d) return !0
                } else if (e && a.contains(document, c)) return !0;
                return !1
            }
        },
        _addClassToMFP: function (a) {
            b.bgOverlay.addClass(a), b.wrap.addClass(a)
        },
        _removeClassFromMFP: function (a) {
            this.bgOverlay.removeClass(a), b.wrap.removeClass(a)
        },
        _hasScrollBar: function (a) {
            return (b.isIE7 ? d.height() : document.body.scrollHeight) > (a || v.height())
        },
        _setFocus: function () {
            (b.st.focus ? b.content.find(b.st.focus).eq(0) : b.wrap).focus()
        },
        _onFocusIn: function (c) {
            return c.target === b.wrap[0] || a.contains(b.wrap[0], c.target) ? void 0 : (b._setFocus(), !1)
        },
        _parseMarkup: function (b, c, d) {
            var e;
            d.data && (c = a.extend(d.data, c)), y(l, [b, c, d]), a.each(c, function (c, d) {
                if (void 0 === d || d === !1) return !0;
                if (e = c.split("_"), e.length > 1) {
                    var f = b.find(p + "-" + e[0]);
                    if (f.length > 0) {
                        var g = e[1];
                        "replaceWith" === g ? f[0] !== d[0] && f.replaceWith(d) : "img" === g ? f.is("img") ? f.attr("src", d) : f.replaceWith(a("<img>").attr("src", d).attr("class", f.attr("class"))) : f.attr(e[1], d)
                    }
                } else b.find(p + "-" + c).html(d)
            })
        },
        _getScrollbarSize: function () {
            if (void 0 === b.scrollbarSize) {
                var a = document.createElement("div");
                a.style.cssText = "width: 99px; height: 99px; overflow: scroll; position: absolute; top: -9999px;", document.body.appendChild(a), b.scrollbarSize = a.offsetWidth - a.clientWidth, document.body.removeChild(a)
            }
            return b.scrollbarSize
        }
    }, a.magnificPopup = {
        instance: null,
        proto: t.prototype,
        modules: [],
        open: function (b, c) {
            return A(), b = b ? a.extend(!0, {}, b) : {}, b.isObj = !0, b.index = c || 0, this.instance.open(b)
        },
        close: function () {
            return a.magnificPopup.instance && a.magnificPopup.instance.close()
        },
        registerModule: function (b, c) {
            c.options && (a.magnificPopup.defaults[b] = c.options), a.extend(this.proto, c.proto), this.modules.push(b)
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
    }, a.fn.magnificPopup = function (c) {
        A();
        var d = a(this);
        if ("string" == typeof c)
            if ("open" === c) {
                var e, f = u ? d.data("magnificPopup") : d[0].magnificPopup,
                    g = parseInt(arguments[1], 10) || 0;
                f.items ? e = f.items[g] : (e = d, f.delegate && (e = e.find(f.delegate)), e = e.eq(g)), b._openClick({
                    mfpEl: e
                }, d, f)
            } else b.isOpen && b[c].apply(b, Array.prototype.slice.call(arguments, 1));
        else c = a.extend(!0, {}, c), u ? d.data("magnificPopup", c) : d[0].magnificPopup = c, b.addGroup(d, c);
        return d
    };
    var C, D, E, F = "inline",
        G = function () {
            E && (D.after(E.addClass(C)).detach(), E = null)
        };
    a.magnificPopup.registerModule(F, {
        options: {
            hiddenClass: "hide",
            markup: "",
            tNotFound: "Content not found"
        },
        proto: {
            initInline: function () {
                b.types.push(F), w(h + "." + F, function () {
                    G()
                })
            },
            getInline: function (c, d) {
                if (G(), c.src) {
                    var e = b.st.inline,
                        f = a(c.src);
                    if (f.length) {
                        var g = f[0].parentNode;
                        g && g.tagName && (D || (C = e.hiddenClass, D = x(C), C = "mfp-" + C), E = f.after(D).detach().removeClass(C)), b.updateStatus("ready")
                    } else b.updateStatus("error", e.tNotFound), f = a("<div>");
                    return c.inlineElement = f, f
                }
                return b.updateStatus("ready"), b._parseMarkup(d, {}, c), d
            }
        }
    });
    var H, I = "ajax",
        J = function () {
            H && a(document.body).removeClass(H)
        },
        K = function () {
            J(), b.req && b.req.abort()
        };
    a.magnificPopup.registerModule(I, {
        options: {
            settings: null,
            cursor: "mfp-ajax-cur",
            tError: '<a href="%url%">The content</a> could not be loaded.'
        },
        proto: {
            initAjax: function () {
                b.types.push(I), H = b.st.ajax.cursor, w(h + "." + I, K), w("BeforeChange." + I, K)
            },
            getAjax: function (c) {
                H && a(document.body).addClass(H), b.updateStatus("loading");
                var d = a.extend({
                    url: c.src,
                    success: function (d, e, f) {
                        var g = {
                            data: d,
                            xhr: f
                        };
                        y("ParseAjax", g), b.appendContent(a(g.data), I), c.finished = !0, J(), b._setFocus(), setTimeout(function () {
                            b.wrap.addClass(q)
                        }, 16), b.updateStatus("ready"), y("AjaxContentAdded")
                    },
                    error: function () {
                        J(), c.finished = c.loadError = !0, b.updateStatus("error", b.st.ajax.tError.replace("%url%", c.src))
                    }
                }, b.st.ajax.settings);
                return b.req = a.ajax(d), ""
            }
        }
    });
    var L, M = function (c) {
        if (c.data && void 0 !== c.data.title) return c.data.title;
        var d = b.st.image.titleSrc;
        if (d) {
            if (a.isFunction(d)) return d.call(b, c);
            if (c.el) return c.el.attr(d) || ""
        }
        return ""
    };
    a.magnificPopup.registerModule("image", {
        options: {
            markup: '<div class="mfp-figure"><div class="mfp-close"></div><figure><div class="mfp-img"></div><figcaption><div class="mfp-bottom-bar"><div class="mfp-title"></div><div class="mfp-counter"></div></div></figcaption></figure></div>',
            cursor: "mfp-zoom-out-cur",
            titleSrc: "title",
            verticalFit: !0,
            tError: '<a href="%url%">The image</a> could not be loaded.'
        },
        proto: {
            initImage: function () {
                var c = b.st.image,
                    d = ".image";
                b.types.push("image"), w(m + d, function () {
                    "image" === b.currItem.type && c.cursor && a(document.body).addClass(c.cursor)
                }), w(h + d, function () {
                    c.cursor && a(document.body).removeClass(c.cursor), v.off("resize" + p)
                }), w("Resize" + d, b.resizeImage), b.isLowIE && w("AfterChange", b.resizeImage)
            },
            resizeImage: function () {
                var a = b.currItem;
                if (a && a.img && b.st.image.verticalFit) {
                    var c = 0;
                    b.isLowIE && (c = parseInt(a.img.css("padding-top"), 10) + parseInt(a.img.css("padding-bottom"), 10)), a.img.css("max-height", b.wH - c)
                }
            },
            _onImageHasSize: function (a) {
                a.img && (a.hasSize = !0, L && clearInterval(L), a.isCheckingImgSize = !1, y("ImageHasSize", a), a.imgHidden && (b.content && b.content.removeClass("mfp-loading"), a.imgHidden = !1))
            },
            findImageSize: function (a) {
                var c = 0,
                    d = a.img[0],
                    e = function (f) {
                        L && clearInterval(L), L = setInterval(function () {
                            return d.naturalWidth > 0 ? void b._onImageHasSize(a) : (c > 200 && clearInterval(L), c++, void(3 === c ? e(10) : 40 === c ? e(50) : 100 === c && e(500)))
                        }, f)
                    };
                e(1)
            },
            getImage: function (c, d) {
                var e = 0,
                    f = function () {
                        c && (c.img[0].complete ? (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("ready")), c.hasSize = !0, c.loaded = !0, y("ImageLoadComplete")) : (e++, 200 > e ? setTimeout(f, 100) : g()))
                    },
                    g = function () {
                        c && (c.img.off(".mfploader"), c === b.currItem && (b._onImageHasSize(c), b.updateStatus("error", h.tError.replace("%url%", c.src))), c.hasSize = !0, c.loaded = !0, c.loadError = !0)
                    },
                    h = b.st.image,
                    i = d.find(".mfp-img");
                if (i.length) {
                    var j = document.createElement("img");
                    j.className = "mfp-img", c.el && c.el.find("img").length && (j.alt = c.el.find("img").attr("alt")), c.img = a(j).on("load.mfploader", f).on("error.mfploader", g), j.src = c.src, i.is("img") && (c.img = c.img.clone()), j = c.img[0], j.naturalWidth > 0 ? c.hasSize = !0 : j.width || (c.hasSize = !1)
                }
                return b._parseMarkup(d, {
                    title: M(c),
                    img_replaceWith: c.img
                }, c), b.resizeImage(), c.hasSize ? (L && clearInterval(L), c.loadError ? (d.addClass("mfp-loading"), b.updateStatus("error", h.tError.replace("%url%", c.src))) : (d.removeClass("mfp-loading"), b.updateStatus("ready")), d) : (b.updateStatus("loading"), c.loading = !0, c.hasSize || (c.imgHidden = !0, d.addClass("mfp-loading"), b.findImageSize(c)), d)
            }
        }
    });
    var N, O = function () {
        return void 0 === N && (N = void 0 !== document.createElement("p").style.MozTransform), N
    };
    a.magnificPopup.registerModule("zoom", {
        options: {
            enabled: !1,
            easing: "ease-in-out",
            duration: 300,
            opener: function (a) {
                return a.is("img") ? a : a.find("img")
            }
        },
        proto: {
            initZoom: function () {
                var a, c = b.st.zoom,
                    d = ".zoom";
                if (c.enabled && b.supportsTransition) {
                    var e, f, g = c.duration,
                        j = function (a) {
                            var b = a.clone().removeAttr("style").removeAttr("class").addClass("mfp-animated-image"),
                                d = "all " + c.duration / 1e3 + "s " + c.easing,
                                e = {
                                    position: "fixed",
                                    zIndex: 9999,
                                    left: 0,
                                    top: 0,
                                    "-webkit-backface-visibility": "hidden"
                                },
                                f = "transition";
                            return e["-webkit-" + f] = e["-moz-" + f] = e["-o-" + f] = e[f] = d, b.css(e), b
                        },
                        k = function () {
                            b.content.css("visibility", "visible")
                        };
                    w("BuildControls" + d, function () {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.content.css("visibility", "hidden"), a = b._getItemToZoom(), !a) return void k();
                            f = j(a), f.css(b._getOffset()), b.wrap.append(f), e = setTimeout(function () {
                                f.css(b._getOffset(!0)), e = setTimeout(function () {
                                    k(), setTimeout(function () {
                                        f.remove(), a = f = null, y("ZoomAnimationEnded")
                                    }, 16)
                                }, g)
                            }, 16)
                        }
                    }), w(i + d, function () {
                        if (b._allowZoom()) {
                            if (clearTimeout(e), b.st.removalDelay = g, !a) {
                                if (a = b._getItemToZoom(), !a) return;
                                f = j(a)
                            }
                            f.css(b._getOffset(!0)), b.wrap.append(f), b.content.css("visibility", "hidden"), setTimeout(function () {
                                f.css(b._getOffset())
                            }, 16)
                        }
                    }), w(h + d, function () {
                        b._allowZoom() && (k(), f && f.remove(), a = null)
                    })
                }
            },
            _allowZoom: function () {
                return "image" === b.currItem.type
            },
            _getItemToZoom: function () {
                return b.currItem.hasSize ? b.currItem.img : !1
            },
            _getOffset: function (c) {
                var d;
                d = c ? b.currItem.img : b.st.zoom.opener(b.currItem.el || b.currItem);
                var e = d.offset(),
                    f = parseInt(d.css("padding-top"), 10),
                    g = parseInt(d.css("padding-bottom"), 10);
                e.top -= a(window).scrollTop() - f;
                var h = {
                    width: d.width(),
                    height: (u ? d.innerHeight() : d[0].offsetHeight) - g - f
                };
                return O() ? h["-moz-transform"] = h.transform = "translate(" + e.left + "px," + e.top + "px)" : (h.left = e.left, h.top = e.top), h
            }
        }
    });
    var P = "iframe",
        Q = "//about:blank",
        R = function (a) {
            if (b.currTemplate[P]) {
                var c = b.currTemplate[P].find("iframe");
                c.length && (a || (c[0].src = Q), b.isIE8 && c.css("display", a ? "block" : "none"))
            }
        };
    a.magnificPopup.registerModule(P, {
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
                b.types.push(P), w("BeforeChange", function (a, b, c) {
                    b !== c && (b === P ? R() : c === P && R(!0))
                }), w(h + "." + P, function () {
                    R()
                })
            },
            getIframe: function (c, d) {
                var e = c.src,
                    f = b.st.iframe;
                a.each(f.patterns, function () {
                    return e.indexOf(this.index) > -1 ? (this.id && (e = "string" == typeof this.id ? e.substr(e.lastIndexOf(this.id) + this.id.length, e.length) : this.id.call(this, e)), e = this.src.replace("%id%", e), !1) : void 0
                });
                var g = {};
                return f.srcAction && (g[f.srcAction] = e), b._parseMarkup(d, g, c), b.updateStatus("ready"), d
            }
        }
    });
    var S = function (a) {
            var c = b.items.length;
            return a > c - 1 ? a - c : 0 > a ? c + a : a
        },
        T = function (a, b, c) {
            return a.replace(/%curr%/gi, b + 1).replace(/%total%/gi, c)
        };
    a.magnificPopup.registerModule("gallery", {
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
                var c = b.st.gallery,
                    e = ".mfp-gallery";
                return b.direction = !0, c && c.enabled ? (f += " mfp-gallery", w(m + e, function () {
                    c.navigateByImgClick && b.wrap.on("click" + e, ".mfp-img", function () {
                        return b.items.length > 1 ? (b.next(), !1) : void 0
                    }), d.on("keydown" + e, function (a) {
                        37 === a.keyCode ? b.prev() : 39 === a.keyCode && b.next()
                    })
                }), w("UpdateStatus" + e, function (a, c) {
                    c.text && (c.text = T(c.text, b.currItem.index, b.items.length))
                }), w(l + e, function (a, d, e, f) {
                    var g = b.items.length;
                    e.counter = g > 1 ? T(c.tCounter, f.index, g) : ""
                }), w("BuildControls" + e, function () {
                    if (b.items.length > 1 && c.arrows && !b.arrowLeft) {
                        var d = c.arrowMarkup,
                            e = b.arrowLeft = a(d.replace(/%title%/gi, c.tPrev).replace(/%dir%/gi, "left")).addClass(s),
                            f = b.arrowRight = a(d.replace(/%title%/gi, c.tNext).replace(/%dir%/gi, "right")).addClass(s);
                        e.click(function () {
                            b.prev()
                        }), f.click(function () {
                            b.next()
                        }), b.container.append(e.add(f))
                    }
                }), w(n + e, function () {
                    b._preloadTimeout && clearTimeout(b._preloadTimeout), b._preloadTimeout = setTimeout(function () {
                        b.preloadNearbyImages(), b._preloadTimeout = null
                    }, 16)
                }), void w(h + e, function () {
                    d.off(e), b.wrap.off("click" + e), b.arrowRight = b.arrowLeft = null
                })) : !1
            },
            next: function () {
                b.direction = !0, b.index = S(b.index + 1), b.updateItemHTML()
            },
            prev: function () {
                b.direction = !1, b.index = S(b.index - 1), b.updateItemHTML()
            },
            goTo: function (a) {
                b.direction = a >= b.index, b.index = a, b.updateItemHTML()
            },
            preloadNearbyImages: function () {
                var a, c = b.st.gallery.preload,
                    d = Math.min(c[0], b.items.length),
                    e = Math.min(c[1], b.items.length);
                for (a = 1; a <= (b.direction ? e : d); a++) b._preloadItem(b.index + a);
                for (a = 1; a <= (b.direction ? d : e); a++) b._preloadItem(b.index - a)
            },
            _preloadItem: function (c) {
                if (c = S(c), !b.items[c].preloaded) {
                    var d = b.items[c];
                    d.parsed || (d = b.parseEl(c)), y("LazyLoad", d), "image" === d.type && (d.img = a('<img class="mfp-img" />').on("load.mfploader", function () {
                        d.hasSize = !0
                    }).on("error.mfploader", function () {
                        d.hasSize = !0, d.loadError = !0, y("LazyLoadError", d)
                    }).attr("src", d.src)), d.preloaded = !0
                }
            }
        }
    });
    var U = "retina";
    a.magnificPopup.registerModule(U, {
        options: {
            replaceSrc: function (a) {
                return a.src.replace(/\.\w+$/, function (a) {
                    return "@2x" + a
                })
            },
            ratio: 1
        },
        proto: {
            initRetina: function () {
                if (window.devicePixelRatio > 1) {
                    var a = b.st.retina,
                        c = a.ratio;
                    c = isNaN(c) ? c() : c, c > 1 && (w("ImageHasSize." + U, function (a, b) {
                        b.img.css({
                            "max-width": b.img[0].naturalWidth / c,
                            width: "100%"
                        })
                    }), w("ElementParse." + U, function (b, d) {
                        d.src = a.replaceSrc(d, c)
                    }))
                }
            }
        }
    }), A()
});
(function webpackUniversalModuleDefinition(root, factory) {
    if (typeof exports === "object" && typeof module === "object") module.exports = factory();
    else if (typeof define === "function" && define.amd) define("simpleParallax", [], factory);
    else if (typeof exports === "object") exports["simpleParallax"] = factory();
    else root["simpleParallax"] = factory()
})(window, function () {
    return function (modules) {
        var installedModules = {};

        function __webpack_require__(moduleId) {
            if (installedModules[moduleId]) {
                return installedModules[moduleId].exports
            }
            var module = installedModules[moduleId] = {
                i: moduleId,
                l: false,
                exports: {}
            };
            modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
            module.l = true;
            return module.exports
        }
        __webpack_require__.m = modules;
        __webpack_require__.c = installedModules;
        __webpack_require__.d = function (exports, name, getter) {
            if (!__webpack_require__.o(exports, name)) {
                Object.defineProperty(exports, name, {
                    enumerable: true,
                    get: getter
                })
            }
        };
        __webpack_require__.r = function (exports) {
            if (typeof Symbol !== "undefined" && Symbol.toStringTag) {
                Object.defineProperty(exports, Symbol.toStringTag, {
                    value: "Module"
                })
            }
            Object.defineProperty(exports, "__esModule", {
                value: true
            })
        };
        __webpack_require__.t = function (value, mode) {
            if (mode & 1) value = __webpack_require__(value);
            if (mode & 8) return value;
            if (mode & 4 && typeof value === "object" && value && value.__esModule) return value;
            var ns = Object.create(null);
            __webpack_require__.r(ns);
            Object.defineProperty(ns, "default", {
                enumerable: true,
                value: value
            });
            if (mode & 2 && typeof value != "string")
                for (var key in value) __webpack_require__.d(ns, key, function (key) {
                    return value[key]
                }.bind(null, key));
            return ns
        };
        __webpack_require__.n = function (module) {
            var getter = module && module.__esModule ? function getDefault() {
                return module["default"]
            } : function getModuleExports() {
                return module
            };
            __webpack_require__.d(getter, "a", getter);
            return getter
        };
        __webpack_require__.o = function (object, property) {
            return Object.prototype.hasOwnProperty.call(object, property)
        };
        __webpack_require__.p = "";
        return __webpack_require__(__webpack_require__.s = 0)
    }([function (module, __webpack_exports__, __webpack_require__) {
        "use strict";
        __webpack_require__.r(__webpack_exports__);

        function _classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function _defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor)
            }
        }

        function _createClass(Constructor, protoProps, staticProps) {
            if (protoProps) _defineProperties(Constructor.prototype, protoProps);
            if (staticProps) _defineProperties(Constructor, staticProps);
            return Constructor
        }
        var Viewport = function () {
            function Viewport() {
                _classCallCheck(this, Viewport);
                this.positions = {
                    top: 0,
                    bottom: 0,
                    height: 0
                }
            }
            _createClass(Viewport, [{
                key: "setViewportTop",
                value: function setViewportTop(container) {
                    this.positions.top = container ? container.scrollTop : window.pageYOffset;
                    return this.positions
                }
            }, {
                key: "setViewportBottom",
                value: function setViewportBottom() {
                    this.positions.bottom = this.positions.top + this.positions.height;
                    return this.positions
                }
            }, {
                key: "setViewportAll",
                value: function setViewportAll(container) {
                    this.positions.top = container ? container.scrollTop : window.pageYOffset;
                    this.positions.height = container ? container.clientHeight : document.documentElement.clientHeight;
                    this.positions.bottom = this.positions.top + this.positions.height;
                    return this.positions
                }
            }]);
            return Viewport
        }();
        var viewport = new Viewport;
        var convertToArray = function convertToArray(elements) {
            if (NodeList.prototype.isPrototypeOf(elements) || HTMLCollection.prototype.isPrototypeOf(elements)) return Array.from(elements);
            if (typeof elements === "string" || elements instanceof String) return document.querySelectorAll(elements);
            return [elements]
        };
        var helpers_convertToArray = convertToArray;
        var cssTransform = function cssTransform() {
            var prefixes = "transform webkitTransform mozTransform oTransform msTransform".split(" ");
            var transform;
            var i = 0;
            while (transform === undefined) {
                transform = document.createElement("div").style[prefixes[i]] !== undefined ? prefixes[i] : undefined;
                i += 1
            }
            return transform
        };
        var helpers_cssTransform = cssTransform();
        var isImageLoaded = function isImageLoaded(image) {
            if (!image) {
                return false
            }
            if (!image.complete) {
                return false
            }
            if (typeof image.naturalWidth !== "undefined" && image.naturalWidth === 0) {
                return false
            }
            return true
        };
        var helpers_isImageLoaded = isImageLoaded;

        function _toConsumableArray(arr) {
            return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread()
        }

        function _nonIterableSpread() {
            throw new TypeError("Invalid attempt to spread non-iterable instance")
        }

        function _iterableToArray(iter) {
            if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter)
        }

        function _arrayWithoutHoles(arr) {
            if (Array.isArray(arr)) {
                for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) {
                    arr2[i] = arr[i]
                }
                return arr2
            }
        }

        function parallax_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function parallax_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor)
            }
        }

        function parallax_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) parallax_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) parallax_defineProperties(Constructor, staticProps);
            return Constructor
        }
        var parallax_ParallaxInstance = function () {
            function ParallaxInstance(element, options) {
                parallax_classCallCheck(this, ParallaxInstance);
                this.element = element;
                this.elementContainer = element;
                this.settings = options;
                this.isVisible = true;
                this.isInit = false;
                this.oldTranslateValue = -1;
                this.init = this.init.bind(this);
                if (helpers_isImageLoaded(element)) {
                    this.init()
                } else {
                    this.element.addEventListener("load", this.init)
                }
            }
            parallax_createClass(ParallaxInstance, [{
                key: "init",
                value: function init() {
                    var _this = this;
                    if (this.isInit) return;
                    if (this.element.closest(".simpleParallax")) return;
                    if (this.settings.overflow === false) {
                        this.wrapElement(this.element)
                    }
                    this.setTransformCSS();
                    this.getElementOffset();
                    this.intersectionObserver();
                    this.getTranslateValue();
                    this.animate();
                    if (this.settings.delay > 0) {
                        setTimeout(function () {
                            _this.setTransitionCSS()
                        }, 10)
                    }
                    this.isInit = true
                }
            }, {
                key: "wrapElement",
                value: function wrapElement() {
                    var elementToWrap = this.element.closest("picture") || this.element;
                    var wrapper = document.createElement("div");
                    wrapper.classList.add("simpleParallax");
                    wrapper.style.overflow = "hidden";
                    elementToWrap.parentNode.insertBefore(wrapper, elementToWrap);
                    wrapper.appendChild(elementToWrap);
                    this.elementContainer = wrapper
                }
            }, {
                key: "unWrapElement",
                value: function unWrapElement() {
                    var wrapper = this.elementContainer;
                    wrapper.replaceWith.apply(wrapper, _toConsumableArray(wrapper.childNodes))
                }
            }, {
                key: "setTransformCSS",
                value: function setTransformCSS() {
                    if (this.settings.overflow === false) {
                        this.element.style[helpers_cssTransform] = "scale(".concat(this.settings.scale, ")")
                    }
                    this.element.style.willChange = "transform"
                }
            }, {
                key: "setTransitionCSS",
                value: function setTransitionCSS() {
                    this.element.style.transition = "transform ".concat(this.settings.delay, "s ").concat(this.settings.transition)
                }
            }, {
                key: "unSetStyle",
                value: function unSetStyle() {
                    this.element.style.willChange = "";
                    this.element.style[helpers_cssTransform] = "";
                    this.element.style.transition = ""
                }
            }, {
                key: "getElementOffset",
                value: function getElementOffset() {
                    var parent_positions = this.elementContainer.parentElement.getBoundingClientRect();
                    this.elementParentHeight = parent_positions.height;
                    var positions = this.elementContainer.getBoundingClientRect();
                    this.elementHeight = positions.height;
                    this.elementTop = positions.top + viewport.positions.top;
                    if (this.settings.customContainer) {
                        var parentPositions = this.settings.customContainer.getBoundingClientRect();
                        this.elementTop = positions.top - parentPositions.top + viewport.positions.top
                    }
                    this.elementBottom = this.elementHeight + this.elementTop
                }
            }, {
                key: "buildThresholdList",
                value: function buildThresholdList() {
                    var thresholds = [];
                    for (var i = 1; i <= this.elementHeight; i++) {
                        var ratio = i / this.elementHeight;
                        thresholds.push(ratio)
                    }
                    return thresholds
                }
            }, {
                key: "intersectionObserver",
                value: function intersectionObserver() {
                    var options = {
                        root: null,
                        threshold: this.buildThresholdList()
                    };
                    this.observer = new IntersectionObserver(this.intersectionObserverCallback.bind(this), options);
                    this.observer.observe(this.element)
                }
            }, {
                key: "intersectionObserverCallback",
                value: function intersectionObserverCallback(entries) {
                    for (var i = entries.length - 1; i >= 0; i--) {
                        if (entries[i].isIntersecting) {
                            this.isVisible = true
                        } else {
                            this.isVisible = false
                        }
                    }
                }
            }, {
                key: "checkIfVisible",
                value: function checkIfVisible() {
                    return this.elementBottom > viewport.positions.top && this.elementTop < viewport.positions.bottom
                }
            }, {
                key: "getRangeMax",
                value: function getRangeMax() {
                    var elementImageHeight = this.element.clientHeight;
                    this.rangeMax = elementImageHeight * this.settings.scale - elementImageHeight
                }
            }, {
                key: "getTranslateValue",
                value: function getTranslateValue() {
                    var percentage = ((viewport.positions.bottom - this.elementTop) / ((viewport.positions.height + this.elementHeight) / 100)).toFixed(1);
                    percentage = Math.min(100, Math.max(0, percentage));
                    if (this.oldPercentage === percentage) {
                        return false
                    }
                    if (!this.rangeMax) {
                        this.getRangeMax()
                    }
                    this.translateValue = percentage / 100 * this.rangeMax - this.rangeMax / 2;
                    var delta = (this.elementHeight - this.elementParentHeight) / 2;
                    if (delta > 0 && delta + this.translateValue < 0) {
                        this.translateValue = -delta
                    }
                    if (delta > 0 && delta < this.translateValue) {
                        this.translateValue = delta
                    }
                    this.translateValue = this.translateValue.toFixed(0);
                    if (this.oldTranslateValue === this.translateValue) {
                        return false
                    }
                    this.oldPercentage = percentage;
                    this.oldTranslateValue = this.translateValue;
                    return true
                }
            }, {
                key: "animate",
                value: function animate() {
                    var translateValueY = 0;
                    var translateValueX = 0;
                    var inlineCss;
                    if (this.settings.orientation.includes("left") || this.settings.orientation.includes("right")) {
                        translateValueX = "".concat(this.settings.orientation.includes("left") ? this.translateValue * -1 : this.translateValue, "px")
                    }
                    if (this.settings.orientation.includes("up") || this.settings.orientation.includes("down")) {
                        translateValueY = "".concat(this.settings.orientation.includes("up") ? this.translateValue * -1 : this.translateValue, "px")
                    }
                    if (this.settings.overflow === false) {
                        inlineCss = "translate3d(".concat(translateValueX, ", ").concat(translateValueY, ", 0) scale(").concat(this.settings.scale, ")")
                    } else {
                        inlineCss = "translate3d(".concat(translateValueX, ", ").concat(translateValueY, ", 0)")
                    }
                    this.element.style[helpers_cssTransform] = inlineCss
                }
            }]);
            return ParallaxInstance
        }();
        var parallax = parallax_ParallaxInstance;
        __webpack_require__.d(__webpack_exports__, "default", function () {
            return simpleParallax_SimpleParallax
        });

        function simpleParallax_classCallCheck(instance, Constructor) {
            if (!(instance instanceof Constructor)) {
                throw new TypeError("Cannot call a class as a function")
            }
        }

        function simpleParallax_defineProperties(target, props) {
            for (var i = 0; i < props.length; i++) {
                var descriptor = props[i];
                descriptor.enumerable = descriptor.enumerable || false;
                descriptor.configurable = true;
                if ("value" in descriptor) descriptor.writable = true;
                Object.defineProperty(target, descriptor.key, descriptor)
            }
        }

        function simpleParallax_createClass(Constructor, protoProps, staticProps) {
            if (protoProps) simpleParallax_defineProperties(Constructor.prototype, protoProps);
            if (staticProps) simpleParallax_defineProperties(Constructor, staticProps);
            return Constructor
        }
        var intersectionObserverAvailable = true;
        var isInit = false;
        var instances = [];
        var instancesLength;
        var frameID;
        var resizeID;
        var simpleParallax_SimpleParallax = function () {
            function SimpleParallax(elements, options) {
                simpleParallax_classCallCheck(this, SimpleParallax);
                if (!elements) return;
                this.elements = helpers_convertToArray(elements);
                this.defaults = {
                    delay: .4,
                    orientation: "up",
                    scale: 1.3,
                    overflow: false,
                    transition: "cubic-bezier(0,0,0,1)",
                    customContainer: false
                };
                this.settings = Object.assign(this.defaults, options);
                if (!("IntersectionObserver" in window)) intersectionObserverAvailable = false;
                if (this.settings.customContainer) {
                    this.customContainer = helpers_convertToArray(this.settings.customContainer)[0]
                }
                this.lastPosition = -1;
                this.resizeIsDone = this.resizeIsDone.bind(this);
                this.handleResize = this.handleResize.bind(this);
                this.proceedRequestAnimationFrame = this.proceedRequestAnimationFrame.bind(this);
                this.init()
            }
            simpleParallax_createClass(SimpleParallax, [{
                key: "init",
                value: function init() {
                    viewport.setViewportAll(this.customContainer);
                    for (var i = this.elements.length - 1; i >= 0; i--) {
                        var instance = new parallax(this.elements[i], this.settings);
                        instances.push(instance)
                    }
                    instancesLength = instances.length;
                    if (!isInit) {
                        this.proceedRequestAnimationFrame();
                        window.addEventListener("resize", this.resizeIsDone);
                        isInit = true
                    }
                }
            }, {
                key: "resizeIsDone",
                value: function resizeIsDone() {
                    clearTimeout(resizeID);
                    resizeID = setTimeout(this.handleResize, 500)
                }
            }, {
                key: "handleResize",
                value: function handleResize() {
                    viewport.setViewportAll(this.customContainer);
                    for (var i = instancesLength - 1; i >= 0; i--) {
                        instances[i].getElementOffset();
                        instances[i].getRangeMax()
                    }
                    this.lastPosition = -1
                }
            }, {
                key: "proceedRequestAnimationFrame",
                value: function proceedRequestAnimationFrame() {
                    viewport.setViewportTop(this.customContainer);
                    if (this.lastPosition === viewport.positions.top) {
                        frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
                        return
                    }
                    viewport.setViewportBottom();
                    for (var i = instancesLength - 1; i >= 0; i--) {
                        this.proceedElement(instances[i])
                    }
                    frameID = window.requestAnimationFrame(this.proceedRequestAnimationFrame);
                    this.lastPosition = viewport.positions.top
                }
            }, {
                key: "proceedElement",
                value: function proceedElement(instance) {
                    var isVisible = false;
                    if (!intersectionObserverAvailable || this.customContainer) {
                        isVisible = instance.checkIfVisible()
                    } else {
                        isVisible = instance.isVisible
                    }
                    if (!isVisible) return;
                    if (!instance.getTranslateValue()) {
                        return
                    }
                    instance.animate()
                }
            }, {
                key: "destroy",
                value: function destroy() {
                    var _this = this;
                    var instancesToDestroy = [];
                    instances = instances.filter(function (instance) {
                        if (_this.elements.includes(instance.element)) {
                            instancesToDestroy.push(instance);
                            return false
                        }
                        return instance
                    });
                    for (var i = instancesToDestroy.length - 1; i >= 0; i--) {
                        instancesToDestroy[i].unSetStyle();
                        if (this.settings.overflow === false) {
                            instancesToDestroy[i].unWrapElement()
                        }
                    }
                    instancesLength = instances.length;
                    if (!instancesLength) {
                        window.cancelAnimationFrame(frameID);
                        window.removeEventListener("resize", this.handleResize)
                    }
                }
            }]);
            return SimpleParallax
        }()
    }])["default"]
});
! function (o, e) {
    if ("function" == typeof define && define.amd) define(["exports"], e);
    else if ("undefined" != typeof exports) e(exports);
    else {
        var t = {};
        e(t), o.bodyScrollLock = t
    }
}(this, function (exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", {
        value: !0
    });
    var n = "undefined" != typeof window && window.navigator && window.navigator.platform && /iPad|iPhone|iPod|(iPad Simulator)|(iPhone Simulator)|(iPod Simulator)/.test(window.navigator.platform),
        i = null,
        l = [],
        d = !1,
        u = -1,
        c = void 0,
        a = void 0,
        s = function (o) {
            var e = o || window.event;
            return e.preventDefault && e.preventDefault(), !1
        },
        o = function () {
            setTimeout(function () {
                void 0 !== a && (document.body.style.paddingRight = a, a = void 0), void 0 !== c && (document.body.style.overflow = c, c = void 0)
            })
        };
    exports.disableBodyScroll = function (r, o) {
        var t;
        n ? r && !l.includes(r) && (l = [].concat(function (o) {
            if (Array.isArray(o)) {
                for (var e = 0, t = Array(o.length); e < o.length; e++) t[e] = o[e];
                return t
            }
            return Array.from(o)
        }(l), [r]), r.ontouchstart = function (o) {
            1 === o.targetTouches.length && (u = o.targetTouches[0].clientY)
        }, r.ontouchmove = function (o) {
            var e, t, n, i;
            1 === o.targetTouches.length && (t = r, i = (e = o).targetTouches[0].clientY - u, t && 0 === t.scrollTop && 0 < i ? s(e) : (n = t) && n.scrollHeight - n.scrollTop <= n.clientHeight && i < 0 ? s(e) : e.stopPropagation())
        }, d || (document.addEventListener("touchmove", s, {
            passive: !1
        }), d = !0)) : (t = o, setTimeout(function () {
            if (void 0 === a) {
                var o = !!t && !0 === t.reserveScrollBarGap,
                    e = window.innerWidth - document.documentElement.clientWidth;
                o && 0 < e && (a = document.body.style.paddingRight, document.body.style.paddingRight = e + "px")
            }
            void 0 === c && (c = document.body.style.overflow, document.body.style.overflow = "hidden")
        }), i || (i = r))
    }, exports.clearAllBodyScrollLocks = function () {
        n ? (l.forEach(function (o) {
            o.ontouchstart = null, o.ontouchmove = null
        }), d && (document.removeEventListener("touchmove", s, {
            passive: !1
        }), d = !1), l = [], u = -1) : (o(), i = null)
    }, exports.enableBodyScroll = function (e) {
        n ? (e.ontouchstart = null, e.ontouchmove = null, l = l.filter(function (o) {
            return o !== e
        }), d && 0 === l.length && (document.removeEventListener("touchmove", s, {
            passive: !1
        }), d = !1)) : i === e && (o(), i = null)
    }
});
(function () {
    var Instafeed;
    Instafeed = (function () {
        function Instafeed(params, context) {
            var option, value;
            this.options = {
                target: 'instafeed',
                get: 'popular',
                resolution: 'thumbnail',
                sortBy: 'none',
                links: true,
                mock: false,
                useHttp: false
            };
            if (typeof params === 'object') {
                for (option in params) {
                    value = params[option];
                    this.options[option] = value;
                }
            }
            this.context = context != null ? context : this;
            this.unique = this._genKey();
        }
        Instafeed.prototype.hasNext = function () {
            return typeof this.context.nextUrl === 'string' && this.context.nextUrl.length > 0;
        };
        Instafeed.prototype.next = function () {
            if (!this.hasNext()) {
                return false;
            }
            return this.run(this.context.nextUrl);
        };
        Instafeed.prototype.run = function (url) {
            var header, instanceName, script;
            if (typeof this.options.clientId !== 'string') {
                if (typeof this.options.accessToken !== 'string') {
                    throw new Error("Missing clientId or accessToken.");
                }
            }
            if (typeof this.options.accessToken !== 'string') {
                if (typeof this.options.clientId !== 'string') {
                    throw new Error("Missing clientId or accessToken.");
                }
            }
            if ((this.options.before != null) && typeof this.options.before === 'function') {
                this.options.before.call(this);
            }
            if (typeof document !== "undefined" && document !== null) {
                script = document.createElement('script');
                script.id = 'instafeed-fetcher';
                script.src = url || this._buildUrl();
                header = document.getElementsByTagName('head');
                header[0].appendChild(script);
                instanceName = "instafeedCache" + this.unique;
                window[instanceName] = new Instafeed(this.options, this);
                window[instanceName].unique = this.unique;
            }
            return true;
        };
        Instafeed.prototype.parse = function (response) {
            var anchor, childNodeCount, childNodeIndex, childNodesArr, e, eMsg, fragment, header, htmlString, httpProtocol, i, image, imageObj, imageString, imageUrl, images, img, imgHeight, imgOrient, imgUrl, imgWidth, instanceName, j, k, len, len1, len2, node, parsedLimit, reverse, sortSettings, targetEl, tmpEl;
            if (typeof response !== 'object') {
                if ((this.options.error != null) && typeof this.options.error === 'function') {
                    this.options.error.call(this, 'Invalid JSON data');
                    return false;
                } else {
                    throw new Error('Invalid JSON response');
                }
            }
            if (response.meta.code !== 200) {
                if ((this.options.error != null) && typeof this.options.error === 'function') {
                    this.options.error.call(this, response.meta.error_message);
                    return false;
                } else {
                    throw new Error("Error from Instagram: " + response.meta.error_message);
                }
            }
            if (response.data.length === 0) {
                if ((this.options.error != null) && typeof this.options.error === 'function') {
                    this.options.error.call(this, 'No images were returned from Instagram');
                    return false;
                } else {
                    throw new Error('No images were returned from Instagram');
                }
            }
            if ((this.options.success != null) && typeof this.options.success === 'function') {
                this.options.success.call(this, response);
            }
            this.context.nextUrl = '';
            if (response.pagination != null) {
                this.context.nextUrl = response.pagination.next_url;
            }
            if (this.options.sortBy !== 'none') {
                if (this.options.sortBy === 'random') {
                    sortSettings = ['', 'random'];
                } else {
                    sortSettings = this.options.sortBy.split('-');
                }
                reverse = sortSettings[0] === 'least' ? true : false;
                switch (sortSettings[1]) {
                    case 'random':
                        response.data.sort(function () {
                            return 0.5 - Math.random();
                        });
                        break;
                    case 'recent':
                        response.data = this._sortBy(response.data, 'created_time', reverse);
                        break;
                    case 'liked':
                        response.data = this._sortBy(response.data, 'likes.count', reverse);
                        break;
                    case 'commented':
                        response.data = this._sortBy(response.data, 'comments.count', reverse);
                        break;
                    default:
                        throw new Error("Invalid option for sortBy: '" + this.options.sortBy + "'.");
                }
            }
            if ((typeof document !== "undefined" && document !== null) && this.options.mock === false) {
                images = response.data;
                parsedLimit = parseInt(this.options.limit, 10);
                if ((this.options.limit != null) && images.length > parsedLimit) {
                    images = images.slice(0, parsedLimit);
                }
                fragment = document.createDocumentFragment();
                if ((this.options.filter != null) && typeof this.options.filter === 'function') {
                    images = this._filter(images, this.options.filter);
                }
                if ((this.options.template != null) && typeof this.options.template === 'string') {
                    htmlString = '';
                    imageString = '';
                    imgUrl = '';
                    tmpEl = document.createElement('div');
                    for (i = 0, len = images.length; i < len; i++) {
                        image = images[i];
                        imageObj = image.images[this.options.resolution];
                        if (typeof imageObj !== 'object') {
                            eMsg = "No image found for resolution: " + this.options.resolution + ".";
                            throw new Error(eMsg);
                        }
                        imgWidth = imageObj.width;
                        imgHeight = imageObj.height;
                        imgOrient = "square";
                        if (imgWidth > imgHeight) {
                            imgOrient = "landscape";
                        }
                        if (imgWidth < imgHeight) {
                            imgOrient = "portrait";
                        }
                        imageUrl = imageObj.url;
                        httpProtocol = window.location.protocol.indexOf("http") >= 0;
                        if (httpProtocol && !this.options.useHttp) {
                            imageUrl = imageUrl.replace(/https?:\/\//, '//');
                        }
                        imageString = this._makeTemplate(this.options.template, {
                            model: image,
                            id: image.id,
                            link: image.link,
                            type: image.type,
                            image: imageUrl,
                            width: imgWidth,
                            height: imgHeight,
                            orientation: imgOrient,
                            caption: this._getObjectProperty(image, 'caption.text'),
                            likes: image.likes.count,
                            comments: image.comments.count,
                            location: this._getObjectProperty(image, 'location.name')
                        });
                        htmlString += imageString;
                    }
                    tmpEl.innerHTML = htmlString;
                    childNodesArr = [];
                    childNodeIndex = 0;
                    childNodeCount = tmpEl.childNodes.length;
                    while (childNodeIndex < childNodeCount) {
                        childNodesArr.push(tmpEl.childNodes[childNodeIndex]);
                        childNodeIndex += 1;
                    }
                    for (j = 0, len1 = childNodesArr.length; j < len1; j++) {
                        node = childNodesArr[j];
                        fragment.appendChild(node);
                    }
                } else {
                    for (k = 0, len2 = images.length; k < len2; k++) {
                        image = images[k];
                        img = document.createElement('img');
                        imageObj = image.images[this.options.resolution];
                        if (typeof imageObj !== 'object') {
                            eMsg = "No image found for resolution: " + this.options.resolution + ".";
                            throw new Error(eMsg);
                        }
                        imageUrl = imageObj.url;
                        httpProtocol = window.location.protocol.indexOf("http") >= 0;
                        if (httpProtocol && !this.options.useHttp) {
                            imageUrl = imageUrl.replace(/https?:\/\//, '//');
                        }
                        img.src = imageUrl;
                        if (this.options.links === true) {
                            anchor = document.createElement('a');
                            anchor.href = image.link;
                            anchor.appendChild(img);
                            fragment.appendChild(anchor);
                        } else {
                            fragment.appendChild(img);
                        }
                    }
                }
                targetEl = this.options.target;
                if (typeof targetEl === 'string') {
                    targetEl = document.getElementById(targetEl);
                }
                if (targetEl == null) {
                    eMsg = "No element with id=\"" + this.options.target + "\" on page.";
                    throw new Error(eMsg);
                }
                targetEl.appendChild(fragment);
                header = document.getElementsByTagName('head')[0];
                header.removeChild(document.getElementById('instafeed-fetcher'));
                instanceName = "instafeedCache" + this.unique;
                window[instanceName] = void 0;
                try {
                    delete window[instanceName];
                } catch (_error) {
                    e = _error;
                }
            }
            if ((this.options.after != null) && typeof this.options.after === 'function') {
                this.options.after.call(this);
            }
            return true;
        };
        Instafeed.prototype._buildUrl = function () {
            var base, endpoint, final;
            base = "https://api.instagram.com/v1";
            switch (this.options.get) {
                case "popular":
                    endpoint = "media/popular";
                    break;
                case "tagged":
                    if (!this.options.tagName) {
                        throw new Error("No tag name specified. Use the 'tagName' option.");
                    }
                    endpoint = "tags/" + this.options.tagName + "/media/recent";
                    break;
                case "location":
                    if (!this.options.locationId) {
                        throw new Error("No location specified. Use the 'locationId' option.");
                    }
                    endpoint = "locations/" + this.options.locationId + "/media/recent";
                    break;
                case "user":
                    if (!this.options.userId) {
                        throw new Error("No user specified. Use the 'userId' option.");
                    }
                    endpoint = "users/" + this.options.userId + "/media/recent";
                    break;
                default:
                    throw new Error("Invalid option for get: '" + this.options.get + "'.");
            }
            final = base + "/" + endpoint;
            if (this.options.accessToken != null) {
                final += "?access_token=" + this.options.accessToken;
            } else {
                final += "?client_id=" + this.options.clientId;
            }
            if (this.options.limit != null) {
                final += "&count=" + this.options.limit;
            }
            final += "&callback=instafeedCache" + this.unique + ".parse";
            return final;
        };
        Instafeed.prototype._genKey = function () {
            var S4;
            S4 = function () {
                return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
            };
            return "" + (S4()) + (S4()) + (S4()) + (S4());
        };
        Instafeed.prototype._makeTemplate = function (template, data) {
            var output, pattern, ref, varName, varValue;
            pattern = /(?:\{{2})([\w\[\]\.]+)(?:\}{2})/;
            output = template;
            while (pattern.test(output)) {
                varName = output.match(pattern)[1];
                varValue = (ref = this._getObjectProperty(data, varName)) != null ? ref : '';
                output = output.replace(pattern, function () {
                    return "" + varValue;
                });
            }
            return output;
        };
        Instafeed.prototype._getObjectProperty = function (object, property) {
            var piece, pieces;
            property = property.replace(/\[(\w+)\]/g, '.$1');
            pieces = property.split('.');
            while (pieces.length) {
                piece = pieces.shift();
                if ((object != null) && piece in object) {
                    object = object[piece];
                } else {
                    return null;
                }
            }
            return object;
        };
        Instafeed.prototype._sortBy = function (data, property, reverse) {
            var sorter;
            sorter = function (a, b) {
                var valueA, valueB;
                valueA = this._getObjectProperty(a, property);
                valueB = this._getObjectProperty(b, property);
                if (reverse) {
                    if (valueA > valueB) {
                        return 1;
                    } else {
                        return -1;
                    }
                }
                if (valueA < valueB) {
                    return 1;
                } else {
                    return -1;
                }
            };
            data.sort(sorter.bind(this));
            return data;
        };
        Instafeed.prototype._filter = function (images, filter) {
            var filteredImages, fn, i, image, len;
            filteredImages = [];
            fn = function (image) {
                if (filter(image)) {
                    return filteredImages.push(image);
                }
            };
            for (i = 0, len = images.length; i < len; i++) {
                image = images[i];
                fn(image);
            }
            return filteredImages;
        };
        return Instafeed;
    })();
    (function (root, factory) {
        if (typeof define === 'function' && define.amd) {
            return define([], factory);
        } else if (typeof module === 'object' && module.exports) {
            return module.exports = factory();
        } else {
            return root.Instafeed = factory();
        }
    })(this, function () {
        return Instafeed;
    });
}).call(this);
(function ($, root, undefined) {
    "use strict";
    try {
        document.createEvent("TouchEvent");
        root.ideapark_is_mobile = true;
    } catch (e) {
        root.ideapark_is_mobile = false;
    }
    root.ideapark_is_responsinator = false;
    if (document.referrer) {
        root.ideapark_is_responsinator = (document.referrer.split('/')[2] == 'www.responsinator.com');
    }
    root.ideapark_debounce = function (func, wait, immediate) {
        var timeout;
        return function () {
            var context = this,
                args = arguments;
            var later = function () {
                timeout = null;
                if (!immediate) func.apply(context, args);
            };
            var callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func.apply(context, args);
        };
    };
    root.ideapark_isset = function (obj) {
        return typeof (obj) != 'undefined';
    };
    root.ideapark_empty = function (obj) {
        return typeof (obj) == 'undefined' || (typeof (obj) == 'object' && obj == null) || (typeof (obj) == 'array' && obj.length == 0) || (typeof (obj) == 'string' && ideapark_alltrim(obj) == '') || obj === 0;
    };
    root.ideapark_is_array = function (obj) {
        return typeof (obj) == 'array';
    };
    root.ideapark_is_function = function (obj) {
        return typeof (obj) == 'function';
    };
    root.ideapark_is_object = function (obj) {
        return typeof (obj) == 'object';
    };
    root.ideapark_alltrim = function (str) {
        var dir = arguments[1] !== undefined ? arguments[1] : 'a';
        var rez = '';
        var i, start = 0,
            end = str.length - 1;
        if (dir == 'a' || dir == 'l') {
            for (i = 0; i < str.length; i++) {
                if (str.substr(i, 1) != ' ') {
                    start = i;
                    break;
                }
            }
        }
        if (dir == 'a' || dir == 'r') {
            for (i = str.length - 1; i >= 0; i--) {
                if (str.substr(i, 1) != ' ') {
                    end = i;
                    break;
                }
            }
        }
        return str.substring(start, end + 1);
    };
    root.ideapark_ltrim = function (str) {
        return ideapark_alltrim(str, 'l');
    };
    root.ideapark_rtrim = function (str) {
        return ideapark_alltrim(str, 'r');
    };
    root.ideapark_dec2hex = function (n) {
        return Number(n).toString(16);
    };
    root.ideapark_hex2dec = function (hex) {
        return parseInt(hex, 16);
    };
    root.ideapark_in_array = function (val, thearray) {
        var rez = false;
        for (var i = 0; i < thearray.length; i++) {
            if (thearray[i] == val) {
                rez = true;
                break;
            }
        }
        return rez;
    };
    root.ideapark_detectIE = function () {
        var ua = window.navigator.userAgent;
        var msie = ua.indexOf('MSIE ');
        if (msie > 0) {
            return parseInt(ua.substring(msie + 5, ua.indexOf('.', msie)), 10);
        }
        var trident = ua.indexOf('Trident/');
        if (trident > 0) {
            var rv = ua.indexOf('rv:');
            return parseInt(ua.substring(rv + 3, ua.indexOf('.', rv)), 10);
        }
        var edge = ua.indexOf('Edge/');
        if (edge > 0) {
            return parseInt(ua.substring(edge + 5, ua.indexOf('.', edge)), 10);
        }
        return false;
    };
    root.ideapark_loadScript = function (src, cb, async) {
        var script = document.createElement('script');
        script.async = !!(typeof async !=='undefined' && async);
        script.src = src;
        script.onerror = function () {
            if (typeof cb !== 'undefined') {
                cb(new Error("Failed to load" + src));
            }
        };
        script.onload = function () {
            if (typeof cb !== 'undefined') {
                cb();
            }
        };
        document.getElementsByTagName("head")[0].appendChild(script);
    }
})(jQuery, this);
(function ($, root, undefined) {
    "use strict";
    $.migrateMute = true;
    $.migrateTrace = false;
    root.ideapark_videos = [];
    root.ideapark_players = [];
    root.ideapark_env_init = false;
    root.ideapark_slick_paused = false;
    root.ideapark_is_mobile = false;
    try {
        document.createEvent("TouchEvent");
        root.ideapark_is_mobile = true;
    } catch (e) {
        root.ideapark_is_mobile = false;
    }
    root.ideapark_is_responsinator = false;
    if (document.referrer) {
        root.ideapark_is_responsinator = (document.referrer.split('/')[2] == 'www.responsinator.com');
    }
    root.old_windows_width = 0;
    var isIosDevice = typeof window !== 'undefined' && window.navigator && window.navigator.platform && /iP(ad|hone|od)/.test(window.navigator.platform);
    var ideapark_is_mobile_layout = window.innerWidth < 992;
    var $body = $('body');
    var $window = $(window);
    var ideapark_scroll_busy = true;
    var ideapark_resize_busy = true;
    var ideaparkStickHeight = 0;
    var needUpdateIdeaparkStickHeight = false;
    var lastBannerIndex = 0;
    var $home_banners_count = $('#home-banners .banner').length;
    var $home_banners = $('#home-banners');
    var ideapark_parallax_on = !!$('.parallax,.parallax-lazy').length && typeof simpleParallax !== 'undefined';
    var ideaparkStickyCheckoutTimeout = null;
    var $ideaparkCheckout = $('.checkout-collaterals');
    var $ideaparkWoocommerce = $('.woocommerce');
    var ideaparkCheckoutTop = 0;
    var ideaparkCheckoutInTransition = false;
    var $to_top_button = $('.to-top-button');
    var ideapark_mega_menu_break_mode = 0;
    var ideapark_submenu_direction_set = false;
    var ideapark_megamenu_left_set = false;
    var $slick_product_single = $('.js-product-info-carousel');
    var $slick_product_single_slides = $('.slide', $slick_product_single);
    var $slick_product_thumbnails = $('.slick-product');
    var $slick_product_thumbnails_slides = $('.slide', $slick_product_thumbnails);
    var $ideapark_submenu_open = [];
    var ideapark_simple_parallax_instances = [];
    var ideapark_current_slide = null;
    var ideapark_current_index_thumbnail = 0;
    $(function () {
        $('html > head').append($('<style>svg{width: initial;height: initial;}</style>'));
        $('#ajax-search,#ajax-search-result,.search-shadow,.menu-shadow').removeClass('hidden');
        $('select.styled, .variations select').customSelect();
        $('section.products').each(function () {
            var $this = $(this);
            if (!$this.hasClass('c-home-tabs--carousel')) {
                $this.addClass('c-home-tabs--carousel');
                var $list = $this.find('.products:not(.owl-carousel)');
                if ($list.length) {
                    $list.addClass('h-carousel h-carousel--flex');
                    ideapark_init_home_tab_carousel($list);
                }
            }
        });
        $(document).on('lazyloaded', function (e) {
            if (ideapark_parallax_on && e.target.className.indexOf('parallax-img') > -1) {
                setTimeout(function () {
                    ideapark_simple_parallax_instances.push(new simpleParallax(e.target, {
                        scale: 1.5,
                        overflow: true
                    }));
                }, 100);
            }
        });
        var bgss = new bgsrcset();
        bgss.init('.bgimg');
        ideapark_mega_menu_init();
        ideapark_banners();
        ideapark_stickyNav();
        ideapark_init_product_tabs();
        ideapark_init_home_tabs();
        ideapark_init_home_slider();
        ideapark_init_home_brands();
        ideapark_init_home_review();
        ideapark_to_top_button();
        ideapark_init_home_instagram();
        ideapark_parallax_init();
        ideapark_init_product_gallery();
        ideapark_init_thumbs();
        ideapark_init_masonry();
        if (ideapark_wp_vars.stickyMenu) {
            $('#header .logo').waitForImages().done(function () {
                ideaparkStickHeight = $('#header').outerHeight();
                ideapark_stickyNav();
            });
        }
        $(".container").fitVids();
        $('#header .main-menu').addClass('initialized');
        if ($ideaparkCheckout.length) {
            $ideaparkCheckout.css('position', 'relative');
            $ideaparkCheckout.on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function (e) {
                ideaparkCheckoutInTransition = false;
            });
            var ideapark_stickyCheckout = function () {
                if ($(window).width() < 992) {
                    if (ideaparkCheckoutTop > 0) {
                        ideaparkCheckoutTop = 0;
                        ideaparkCheckoutInTransition = true;
                        setTimeout(function () {
                            ideaparkCheckoutInTransition = false;
                        }, 700);
                        $ideaparkCheckout.css({
                            top: ideaparkCheckoutTop
                        });
                    }
                    ideaparkStickyCheckoutTimeout = null;
                    return;
                }
                var $ideaparkPayment = $('#payment');
                var scrollTop = $(window).scrollTop();
                var scrollTopOrig = scrollTop;
                var payment_top = $ideaparkPayment.offset().top;
                if (ideapark_wp_vars.stickyMenu) {
                    var $sticky_menu = $('body.sticky #header .main-menu');
                    var $admin_menu = $('#wpadminbar');
                    if ($sticky_menu.length) {
                        scrollTop += $sticky_menu.height();
                    }
                    if ($admin_menu.length) {
                        scrollTop += $admin_menu.height();
                    }
                }
                var dif = scrollTop - payment_top;
                if ((ideaparkCheckoutTop > 0 || dif !== 0) && !ideaparkCheckoutInTransition) {
                    if (dif > 0 || ideaparkCheckoutTop !== 0) {
                        var checkout_bottom = $ideaparkCheckout.offset().top + $ideaparkCheckout.outerHeight();
                        var overdif = dif + checkout_bottom - ($(window).height() + scrollTopOrig);
                        if (overdif > 0) {
                            dif -= overdif;
                        }
                        overdif = dif + checkout_bottom - ($ideaparkWoocommerce.offset().top + $ideaparkWoocommerce.outerHeight());
                        if (overdif > 0) {
                            dif -= overdif;
                        }
                        ideaparkCheckoutTop += dif;
                        if (ideaparkCheckoutTop < 0) {
                            ideaparkCheckoutTop = 0;
                        }
                        ideaparkCheckoutInTransition = true;
                        setTimeout(function () {
                            ideaparkCheckoutInTransition = false;
                        }, 700);
                        $ideaparkCheckout.css({
                            top: ideaparkCheckoutTop
                        });
                    }
                }
                ideaparkStickyCheckoutTimeout = null;
            };
            ideapark_stickyCheckout();
            $(window).on('scroll resize', function () {
                if (!ideaparkStickyCheckoutTimeout) ideaparkStickyCheckoutTimeout = setTimeout(ideapark_stickyCheckout, 500);
            });
        }
        ideapark_scroll_actions();
        ideapark_resize_actions();
        $('body.preload').removeClass('preload');
    });
    root.ideapark_scroll_actions = function () {
        ideapark_banners();
        ideapark_stickyNav();
        ideapark_to_top_button();
        ideapark_scroll_busy = false;
    };
    $window.scroll(function () {
        if (window.requestAnimationFrame) {
            if (!ideapark_scroll_busy) {
                ideapark_scroll_busy = true;
                window.requestAnimationFrame(ideapark_scroll_actions);
            }
        } else {
            ideapark_scroll_actions();
        }
    });
    root.ideapark_resize_actions = function () {
        var ideapark_is_mobile_layout_new = (window.innerWidth < 992);
        var is_layout_changed = (ideapark_is_mobile_layout !== ideapark_is_mobile_layout_new);
        ideapark_is_mobile_layout = ideapark_is_mobile_layout_new;
        ideapark_banners();
        ideapark_stickyNav();
        ideapark_submenu_direction();
        ideapark_mega_menu_break();
        ideapark_megamenu();
        ideapark_wpadminbar_mobile();
        if (is_layout_changed) {
            if (!ideapark_is_mobile_layout && ideapark_current_slide !== null && $slick_product_thumbnails.length) {
                if (!ideapark_init_thumbs()) {
                    setTimeout(function () {
                        $slick_product_thumbnails.slick('refresh');
                    }, 500);
                }
                $slick_product_thumbnails.eq(ideapark_current_slide).trigger('click');
            }
        }
        ideapark_resize_busy = false;
    };
    $window.resize(function () {
        if (window.requestAnimationFrame) {
            if (!ideapark_resize_busy) {
                ideapark_resize_busy = true;
                window.requestAnimationFrame(ideapark_resize_actions);
            }
        } else {
            ideapark_resize_actions();
        }
    });
    $('.woocommerce-tabs .tabs li a').click(function () {
        var _ = $(this);
        var $tab = $(_.attr('href'));
        var $li = $(this).parent('li');
        if ($li.hasClass('active') && $(window).width() < 992 && $tab.hasClass('current')) {
            $li.parent('ul').toggleClass('expand');
        } else {
            $('.woocommerce-tabs .tabs li.active').removeClass('active');
            $li.addClass('active');
            $('.woocommerce-tabs .current').removeClass('current');
            setTimeout(function () {
                $tab.addClass('current');
            }, 100);
            $li.parent('ul').removeClass('expand');
        }
    });
    $(document).on('click', ".product-categories > ul li.has-children > a:not(.js-more), .product-categories > ul li.menu-item-has-children > a:not(.js-more)", function () {
        if ($(this).closest('.sub-menu .sub-menu').length > 0) {
            return true;
        }
        if ($(window).width() >= 992) {
            return true;
        }
        if (!$(this).attr('href')) {
            $(this).parent().children('.js-more').trigger('click');
            return false;
        }
    }).on('click', ".js-more", function () {
        if ($(window).width() >= 992) {
            return true;
        }
        if ($ideapark_submenu_open.length === 0) {
            $(document.body).addClass("submenu-open");
        }
        $ideapark_submenu_open.push($(this).closest('li'));
        $(this).closest('li').addClass('selected');
        return false;
    }).on('click', '#header .search, #header .mobile-search, #search-close', function () {
        $('html').toggleClass('search-open');
        if ($body.toggleClass('search-open').hasClass('search-open')) {
            bodyScrollLock.disableBodyScroll($('#ajax-search-result')[0]);
            setTimeout(function () {
                $("#ajax-search-input").focus();
            }, 200);
        } else {
            bodyScrollLock.clearAllBodyScrollLocks();
        }
        if (!$(".js-ajax-search-result").text() && $("#ajax-search-input").val().trim()) {
            ajaxSearchFunction();
        }
        return false;
    }).on('click', '.mobile-menu, .mobile-menu-close, .menu-open .menu-shadow', function () {
        $('html').toggleClass('menu-open');
        if ($body.toggleClass('menu-open').hasClass('menu-open')) {
            bodyScrollLock.disableBodyScroll($('.product-categories > .menu')[0]);
        } else {
            bodyScrollLock.clearAllBodyScrollLocks();
        }
        return false;
    }).on('click', '.mobile-sidebar, .mobile-sidebar-close, .sidebar-open .menu-shadow', function () {
        $('html').toggleClass('sidebar-open');
        if (!isIosDevice || $('#ip-shop-sidebar').find('[class~=select2]').length === 0) {
            if ($body.toggleClass('sidebar-open').hasClass('sidebar-open')) {
                bodyScrollLock.disableBodyScroll($('#ip-shop-sidebar')[0]);
            } else {
                bodyScrollLock.clearAllBodyScrollLocks();
            }
        } else {
            $body.toggleClass('sidebar-open');
        }
        return false;
    }).on('click', ".collaterals .coupon .header a", function () {
        var $coupon = $(".collaterals .coupon");
        $coupon.toggleClass('opened');
        if ($coupon.hasClass('opened')) {
            setTimeout(function () {
                $coupon.find('input[type=text]').first().focus();
            }, 500);
        }
        return false;
    }).on('click', ".collaterals .shipping-calculator .header a", function () {
        $(this).closest('.shipping-calculator').toggleClass('opened');
    }).on('click', ".ip-prod-quantity-minus", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $input = $(this).parent().find('input[type=number]');
        var quantity = $input.val().trim();
        var min = $input.attr('min');
        quantity--;
        if (quantity < (min !== '' ? min : 1)) {
            quantity = (min !== '' ? min : 1);
        }
        $input.val(quantity);
        $input.trigger('change');
    }).on('click', ".ip-prod-quantity-plus", function (e) {
        e.stopPropagation();
        e.preventDefault();
        var $input = $(this).parent().find('input[type=number]');
        var quantity = $input.val().trim();
        var max = $input.attr('max');
        quantity++;
        if ((max !== '') && (quantity > max)) {
            quantity = max;
        }
        if (quantity > 0) {
            $input.val(quantity);
            $input.trigger('change');
        }
    }).on('click', "#ip-checkout-apply-coupon", function () {
        var $form = $(this).closest('form');
        if ($form.is('.processing')) {
            return false;
        }
        $form.addClass('processing').block({
            message: null,
            overlayCSS: {
                background: '#fff',
                opacity: 0.6
            }
        });
        var data = {
            security: wc_checkout_params.apply_coupon_nonce,
            coupon_code: $form.find('input[name="coupon_code"]').val()
        };
        $.ajax({
            type: 'POST',
            url: wc_checkout_params.wc_ajax_url.toString().replace('%%endpoint%%', 'apply_coupon'),
            data: data,
            success: function (code) {
                $('.woocommerce-error, .woocommerce-message').remove();
                $form.removeClass('processing').unblock();
                if (code) {
                    $form.before(code);
                    $(".collaterals .coupon.opened").removeClass('opened');
                    $(document.body).trigger('update_checkout', {
                        update_shipping_method: false
                    });
                }
            },
            dataType: 'html'
        });
        return false;
    });
    $(".variations_form").on("woocommerce_variation_select_change", function () {
        $(".variations_form select").each(function () {
            $(this).next('span.customSelect').html($(this).find(':selected').html());
        });
        if (typeof $slick_product_single != 'undefined' && $slick_product_single.length) {
            setTimeout(function () {
                $slick_product_single.trigger('to.owl.carousel', 0);
                var $fisrtSlide = $slick_product_single_slides.first().children('a');
                $("<img/>").attr("src", $fisrtSlide.attr('href')).load(function () {
                    $fisrtSlide.attr('data-size', this.width + 'x' + this.height);
                });
            }, 500);
        }
    });
    $("#header .mobile-menu-back").click(function () {
        if ($ideapark_submenu_open.length) {
            var $li = $ideapark_submenu_open.pop();
            $li.removeClass('selected');
            if ($ideapark_submenu_open.length === 0) {
                $(document.body).removeClass("submenu-open");
            }
        }
        return false;
    });
    $("#ip-wishlist-share-link").focus(function () {
        $(this).select();
    });
    $('.menu-item').click(function () {
        $(this).toggleClass('open');
    });
    $('#customer_login .tab-header').click(function () {
        $('#customer_login .tab-header.active').removeClass('active');
        $(this).addClass('active');
        $('#customer_login .wrap li.active').removeClass('active');
        $('#customer_login .wrap li.' + $(this).data('tab-class')).addClass('active');
        return false;
    });
    $(".product-categories > ul").append('<li class="space-item"></li>');
    $('#header .top-menu .menu > li').each(function () {
        $(".product-categories > ul").append($(this).clone());
    });
    $("#ajax-search-input").on('input', function () {
        if (ideapark_wp_vars.searchType != 'search-type-3') {
            var _ = $(this);
            if (_.val().trim().length > 1) {
                $(".js-ajax-search-result").removeClass('loaded');
                $('.search-shadow').addClass('loading');
                ajaxSearchFunction();
            } else {
                $('.search-shadow').removeClass('loading');
                $(".js-ajax-search-result").removeClass('loaded');
            }
        }
    }).on('keydown', function (event) {
        if (event.keyCode == 13) {
            event.preventDefault();
            $('.search-shadow').removeClass('loading');
            if ($("#ajax-search-input").val().trim()) {
                $("#ajax-search form").submit();
            }
        } else if (event.keyCode == 27) {
            $('.search-shadow').removeClass('loading');
            $('#mobilesearch-close').trigger('click');
            $('#search-close').trigger('click');
        }
    });
    $("#ajax-search form").on('submit', function () {
        if (!$("#ajax-search-input").val().trim()) {
            return false;
        }
    });
    $('.ip-watch-video-btn').click(function () {
        var $container = $('#ip-quickview'),
            $video_code = $("#ip_hidden_product_video");
        if ($body.hasClass('quickview-open') || $video_code.length != 1) {
            return false;
        }
        var $shadow = $('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>');
        $body.append($shadow);
        $body.addClass('quickview-open');
        $container.html($video_code.val());
        $container.fitVids();
        $.magnificPopup.open({
            mainClass: 'ip-mfp-quickview ip-mfp-fade-in',
            closeMarkup: '<a class="mfp-close ip-mfp-close video"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
            removalDelay: 180,
            items: {
                src: $container,
                type: 'inline'
            },
            callbacks: {
                open: function () {
                    $shadow.removeClass('loading');
                    $shadow.one('touchstart', function () {
                        $.magnificPopup.close();
                    });
                },
                beforeClose: function () {
                    $shadow.addClass('mfp-removing');
                },
                close: function () {
                    $shadow.remove();
                    $body.removeClass('quickview-open');
                }
            }
        });
        return false;
    });
    $('.ip-quickview-btn').click(function () {
        var $container = $('#ip-quickview'),
            ajaxUrl, productId = $(this).data('product_id'),
            data = {
                product_id: productId
            };
        if ($body.hasClass('quickview-open')) {
            return false;
        }
        if (productId) {
            var $shadow = $('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>');
            $body.append($shadow);
            setTimeout(function () {
                $body.addClass('quickview-open');
            }, 100);
            if (typeof wc_add_to_cart_params !== 'undefined') {
                ajaxUrl = wc_add_to_cart_params.wc_ajax_url.toString().replace('%%endpoint%%', 'ip_ajax_load_product');
            } else {
                ajaxUrl = ip_wp_vars.ajaxUrl;
                data.action = 'ip_ajax_load_product';
            }
            root.ip_quickview_get_product = $.ajax({
                type: 'POST',
                url: ajaxUrl,
                data: data,
                dataType: 'html',
                cache: false,
                headers: {
                    'cache-control': 'no-cache'
                },
                beforeSend: function () {
                    if (root.window.ip_quickview_get_product === 'object') {
                        root.ip_quickview_get_product.abort();
                    }
                },
                error: function (XMLHttpRequest, textStatus, errorThrown) {
                    $shadow.remove();
                    $body.removeClass('quickview-open');
                },
                success: function (data) {
                    $container.html(data);
                    $.magnificPopup.open({
                        mainClass: 'ip-mfp-quickview ip-mfp-fade-in',
                        closeMarkup: '<a class="mfp-close ip-mfp-close"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
                        removalDelay: 300,
                        items: {
                            src: $container,
                            type: 'inline'
                        },
                        callbacks: {
                            open: function () {
                                $shadow.removeClass('loading');
                                $shadow.one('touchstart', function () {
                                    $.magnificPopup.close();
                                });
                                var $slick_product_qv = $('.slick-product-qv', $container);
                                if ($slick_product_qv.length == 1) {
                                    $('.slick-product-qv:not(.owl-carousel)').addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).owlCarousel({
                                        items: 1,
                                        loop: false,
                                        margin: 0,
                                        nav: true,
                                        dots: false,
                                        rtl: !!ideapark_wp_vars.isRtl,
                                        navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                                        onInitialized: ideapark_owl_hide_arrows
                                    });
                                }
                                $('select.styled, .variations select', $container).customSelect();
                                var $currentContainer = $container.find('#product-' + productId),
                                    $productForm = $currentContainer.find('form.cart');
                                $('.product-images', $container).waitForImages().done(function () {
                                    if ($currentContainer.hasClass('product-type-variable')) {
                                        $productForm.wc_variation_form().find('.variations select:eq(0)').change();
                                        $(".variations_form").on("woocommerce_variation_select_change", function () {
                                            $(".variations_form select").each(function () {
                                                $(this).next('span.customSelect').html($(this).find(':selected').html());
                                            });
                                            if (typeof $slick_product_qv != 'undefined' && $slick_product_qv.length) {
                                                setTimeout(function () {
                                                    $slick_product_qv.trigger('to.owl.carousel', 0);
                                                    var $fisrtSlide = $slick_product_qv.find('.slide').first().children('a');
                                                    $("<img/>").attr("src", $fisrtSlide.attr('href')).load(function () {
                                                        $fisrtSlide.attr('data-size', this.width + 'x' + this.height);
                                                    });
                                                }, 500);
                                            }
                                        });
                                    }
                                });
                            },
                            beforeClose: function () {
                                $body.removeClass('quickview-open');
                            },
                            close: function () {
                                $shadow.remove();
                            }
                        }
                    });
                }
            });
        }
        return false;
    });
    $('.entry-content a > img').each(function () {
        var $shadow, $a = $(this).closest('a');
        if ($a.attr('href').search(/\.(gif|jpg|png|jpeg)$/i) >= 0) {
            $a.magnificPopup({
                type: 'image',
                closeOnContentClick: true,
                image: {
                    verticalFit: true
                },
                mainClass: 'ip-mfp-quickview ip-mfp-fade-in',
                closeMarkup: '<a class="mfp-close ip-mfp-close"><svg><use xlink:href="' + ideapark_wp_vars.svgUrl + '#svg-close-light" /></svg></a>',
                removalDelay: 300,
                callbacks: {
                    beforeOpen: function () {
                        $shadow = $('<div id="ip-quickview-shadow" class="loading"><div class="ip-shop-loop-loading"><i></i><i></i><i></i></div></div>');
                        $body.append($shadow);
                        $shadow.one('touchstart', function () {
                            $.magnificPopup.close();
                        });
                    },
                    open: function () {
                        $body.addClass('quickview-open');
                    },
                    imageLoadComplete: function () {
                        $shadow.removeClass('loading');
                    },
                    beforeClose: function () {
                        $shadow.addClass('mfp-removing');
                        $body.removeClass('quickview-open');
                    },
                    close: function () {
                        $shadow.remove();
                    }
                }
            });
        }
    });
    $to_top_button.click(function () {
        $('html, body').animate({
            scrollTop: 0
        }, 800);
        return false;
    });
    root.ideapark_refresh_parallax = ideapark_debounce(function () {}, 500);
    root.ideapark_third_party_reload = function () {
        if (typeof root.sbi_init === "function") {
            window.sbiCommentCacheStatus = 0;
            root.sbi_init(function (imagesArr, transientName) {
                root.sbi_cache_all(imagesArr, transientName);
            });
        }
    };
    root.ideapark_parallax_destroy = function () {
        if (ideapark_parallax_on && ideapark_simple_parallax_instances.length) {}
    };
    root.ideapark_parallax_init = function () {
        if (ideapark_parallax_on) {
            var images = document.querySelectorAll('.parallax');
            ideapark_simple_parallax_instances.push(new simpleParallax(images, {
                scale: 1.5,
                overflow: true
            }));
        }
    };
    root.ideapark_mega_menu_break = function (force) {
        if (force) {
            ideapark_mega_menu_break_mode = 0;
        }
        if ($window.width() < 992) {
            if (ideapark_mega_menu_break_mode === 1) {
                $('.mega-menu-break').each(function () {
                    var $ul = $(this);
                    $ul.css({
                        height: ''
                    }).removeClass('mega-menu-break');
                });
                ideapark_mega_menu_break_mode = 0;
            }
            return;
        }
        if (ideapark_mega_menu_break_mode === 0) {
            var main_items = $('.main-menu .menu').find('.col-2,.col-3,.col-4');
            if (main_items.length) {
                main_items.each(function () {
                    var $li_main = $(this);
                    var cols = 0;
                    if ($li_main.hasClass('col-2')) {
                        cols = 2;
                    } else if ($li_main.hasClass('col-3')) {
                        cols = 3;
                    } else if ($li_main.hasClass('col-4')) {
                        cols = 4;
                    }
                    var $ul = $li_main.find('.sub-menu').first();
                    var padding_top = $ul.css('padding-top') ? parseInt($ul.css('padding-top').replace('px', '')) : 0;
                    var padding_bottom = $ul.css('padding-bottom') ? parseInt($ul.css('padding-bottom').replace('px', '')) : 0;
                    var heights = [];
                    var max_height = 0;
                    var all_sum_height = 0;
                    $ul.children('li').each(function () {
                        var $li = $(this);
                        var height = $li.outerHeight();
                        if (height > max_height) {
                            max_height = height;
                        }
                        all_sum_height += height;
                        heights.push(height);
                    });
                    var test_cols = 0;
                    var cnt = 0;
                    var test_height = max_height - 1;
                    do {
                        test_height++;
                        cnt++;
                        test_cols = 1;
                        var sum_height = 0;
                        for (var i = 0; i < heights.length; i++) {
                            sum_height += heights[i];
                            if (sum_height > test_height) {
                                sum_height = 0;
                                i--;
                                test_cols++;
                            }
                        }
                    } while (test_cols > cols && cnt < 1000);
                    if (test_cols <= cols && test_height > 0) {
                        $ul.css({
                            height: (test_height + padding_top + padding_bottom) + 'px'
                        }).addClass('mega-menu-break');
                    }
                });
                ideapark_mega_menu_break_mode = 1;
            }
        }
    };
    root.ideapark_init_home_slider = function () {
        var $carousel = $('.js-slider-carousel:not(.owl-carousel)');
        if ($carousel.length) {
            var $slider = $('#home-slider');
            var sliderEffect = $slider.data('slider_effect');
            var sliderInterval = $slider.data('slider_interval');
            var sliderShowDots = !$slider.data('slider_hide_dots');
            var sliderShowArrows = !$slider.data('slider_hide_arrows');
            var params = {
                items: 1,
                loop: true,
                margin: 0,
                nav: sliderShowArrows,
                dots: sliderShowDots,
                rtl: !!ideapark_wp_vars.isRtl,
                navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                onInitialized: function (e) {
                    ideapark_owl_hide_arrows(e);
                    setTimeout(function () {
                        $carousel.removeClass('preloading');
                    }, 100);
                }
            };
            if (sliderInterval) {
                params.autoplay = true;
                params.autoplayTimeout = sliderInterval;
                params.autoplayHoverPause = true;
            }
            if (sliderEffect === 'fade') {
                params.animateOut = 'fadeOut';
            }
            var $first_slide = $('.slick .bgimg').first();
            if ($first_slide.length === 1) {
                var img = new Image();
                img.onload = function () {
                    if ($carousel.hasClass('preloading')) {
                        $carousel.on('transitionend webkitTransitionEnd oTransitionEnd', function () {
                            $('.slick-preloader').remove();
                        });
                        $carousel.addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).owlCarousel(params);
                    }
                };
                var src = $first_slide.css('background-image');
                var match = src.match(/\((.*?)\)/);
                if (match !== null) {
                    var url = src.match(/\((.*?)\)/)[1].replace(/('|")/g, '');
                    img.src = url;
                    if (img.complete) {
                        img.onload();
                    }
                } else {
                    img.onload();
                }
            }
        }
    };
    root.ideapark_init_home_review = function () {
        $('.js-review-carousel:not(.owl-carousel)').addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).owlCarousel({
            items: 1,
            loop: false,
            margin: 0,
            nav: true,
            dots: false,
            rtl: !!ideapark_wp_vars.isRtl,
            navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
            responsive: {
                0: {
                    dots: true,
                    nav: false
                },
                480: {
                    nav: true,
                    dots: false
                }
            },
            onInitialized: ideapark_owl_hide_arrows
        });
    };
    root.ideapark_init_home_brands = function () {
        $('.js-brands-carousel:not(.owl-carousel)').addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).owlCarousel({
            center: false,
            autoWidth: true,
            loop: false,
            margin: 0,
            nav: true,
            dots: false,
            rtl: !!ideapark_wp_vars.isRtl,
            navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
            responsive: {
                0: {
                    dots: true,
                    nav: false
                },
                768: {
                    nav: true,
                    dots: false
                }
            },
            onInitialized: ideapark_owl_hide_arrows
        });
    };
    root.ideapark_init_view_more_item = function ($tab, href, postfix) {
        if ($tab && $tab.length) {
            var $li = $tab.find('.js-view-more-item');
            var new_item = false;
            if (!$li.length) {
                $li = $('<div class="product product--view-more js-view-more-item"><div class="ip-shop-loop-wrap ip-shop-loop-wrap--view-more"><a class="button" href="' + href + '">' + ideapark_wp_vars.viewMore + (postfix ? ' ' + postfix : '') + '</a></div></div>');
                new_item = true;
            }
            var $grid = $tab.find('.products');
            if (new_item) {
                $grid.append($li);
                $tab.addClass('js-view-more-tab');
            }
        }
    };
    root.ideapark_init_home_tab_carousel = function ($product_list) {
        $product_list.each(function () {
            var $this = $(this);
            var responsive = $this.hasClass('products--mobile-small') ? {
                0: {
                    dots: true,
                    nav: false,
                    margin: 30
                },
                601: {
                    nav: true,
                    dots: false,
                    margin: 0
                }
            } : {
                0: {
                    dots: true,
                    nav: false,
                    margin: 30
                },
                360: {
                    dots: true,
                    nav: false,
                    margin: 0
                },
                480: {
                    nav: true,
                    dots: false,
                    margin: 0
                }
            };
            $this.addClass('products--' + $this.children().length).addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).owlCarousel({
                center: false,
                autoWidth: true,
                loop: false,
                margin: 0,
                nav: true,
                dots: false,
                rtl: !!ideapark_wp_vars.isRtl,
                navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                responsive: responsive,
                onInitialized: ideapark_owl_hide_arrows
            });
        });
    };
    root.ideapark_init_home_tabs = function () {
        var $tabs = $(".c-home-tabs:not(.init)");
        $tabs.each(function () {
            var $tab = $(this);
            if ($tab.hasClass('js-product-carousel')) {
                $tab.find('.home-tab').each(function () {
                    var $tab = $(this);
                    var product_count = $tab.find('.product').length;
                    if ($tab.data('view-more') && $tab.data('per-page') == product_count) {
                        ideapark_init_view_more_item($tab, $tab.data('view-more'));
                    }
                });
                ideapark_init_home_tab_carousel($tab.find('.products:not(.owl-carousel)'));
            }
            var $tab_buttons = $tab.find(".home-tabs li");
            if ($tab_buttons.length) {
                var set_tab_width = function () {
                    var el = document.getElementById('ideapark-core-css');
                    if (el) {
                        if (el.getAttribute('media') === 'all' && $tab_buttons.first().outerWidth() > 0) {
                            var maxTabWidth = 0;
                            $tab_buttons.each(function () {
                                var _ = $(this);
                                if (_.outerWidth() > maxTabWidth) {
                                    maxTabWidth = _.outerWidth();
                                }
                            });
                            $tab.find(".home-tabs").css({
                                width: maxTabWidth + 10
                            });
                        } else {
                            setTimeout(set_tab_width, 100);
                        }
                    }
                };
                set_tab_width();
                $tab.find('.home-tabs li a').click(function () {
                    var _ = $(this);
                    var $wrap = _.closest('.c-home-tabs');
                    var $tab = $(_.attr('href'));
                    var $li = $(this).parent('li');
                    if ($li.hasClass('current')) {
                        $li.parent('ul').toggleClass('expand');
                        return false;
                    }
                    $('.home-tabs li.current', $wrap).removeClass('current');
                    $li.addClass('current');
                    $('.home-tab.current', $wrap).removeClass('current');
                    $('.home-tab.visible', $wrap).removeClass('visible');
                    $tab.addClass('visible');
                    setTimeout(function () {
                        $tab.addClass('current');
                        setTimeout(function () {
                            ideapark_owl_hide_arrows($tab);
                            $tab.find('[data-src]').each(function () {
                                var $this = $(this);
                                $this.attr('srcset', $this.attr('data-srcset'));
                                $this.attr('src', $this.attr('data-src'));
                                $this.attr('sizes', $this.attr('data-sizes'));
                                $this.removeAttr('data-srcset');
                                $this.removeAttr('data-src');
                                $this.removeAttr('data-sizes');
                            });
                        }, 500);
                    }, 100);
                    $li.parent('ul').removeClass('expand');
                    return false;
                });
            }
            $tab.addClass('init');
        });
    };
    root.ideapark_init_product_tabs = function () {
        var $tabs = $(".woocommerce-tabs .tabs li");
        if ($tabs.length) {
            var set_product_tab_width = function () {
                var el = document.getElementById('ideapark-core-css');
                if (el && el.getAttribute('media') === 'all' && $tabs.first().outerWidth() > 0) {
                    var maxTabWidth = 0;
                    $tabs.each(function () {
                        var _ = $(this);
                        if (_.outerWidth() > maxTabWidth) {
                            maxTabWidth = _.outerWidth();
                        }
                    });
                    $(".woocommerce-tabs .tabs").css({
                        width: maxTabWidth + 10
                    });
                } else {
                    setTimeout(set_product_tab_width, 100);
                }
            };
            set_product_tab_width();
        }
    };
    root.ideapark_wpadminbar_mobile = function () {
        var $ideapark_admin_bar = $('#wpadminbar');
        if ($ideapark_admin_bar.length) {
            var window_width = $window.width();
            if (window_width > 782 && $ideapark_admin_bar.hasClass('mobile')) {
                $ideapark_admin_bar.removeClass('mobile');
            } else if (window_width <= 782 && !$ideapark_admin_bar.hasClass('mobile')) {
                $ideapark_admin_bar.addClass('mobile');
            }
        }
    };
    root.ideapark_submenu_direction = function (force) {
        if (force) {
            ideapark_submenu_direction_set = false;
        }
        if ($(window).width() < 992 || ideapark_submenu_direction_set) {
            return true;
        }
        var $nav = $('.product-categories > ul');
        if ($nav.length) {
            var nav_center = Math.round($nav.offset().left + $nav.width() / 2 - 40);
            $nav.children('li').each(function () {
                var _ = $(this);
                if (_.offset().left <= nav_center && !_.hasClass('ltr')) {
                    _.removeClass('rtl');
                    _.addClass('ltr');
                }
                if (_.offset().left > nav_center && !_.hasClass('rtl')) {
                    _.removeClass('ltr');
                    _.addClass('rtl');
                }
            });
        }
        ideapark_submenu_direction_set = true;
    };
    root.ideapark_megamenu = function () {
        var window_width = $window.width();
        if (window_width >= 992) {
            var $uls = $('.main-menu .product-categories > ul > li[class*="col-"] > ul');
            if ($uls.length) {
                var $container = $('.main-menu .container').first();
                var container_left = $container.offset().left;
                var container_right = container_left + $container.width();
                $uls.each(function () {
                    var delta;
                    var _ = $(this);
                    if (!_.attr('data-left')) {
                        _.attr('data-left', _.css('left'));
                    } else {
                        _.css({
                            left: _.attr('data-left')
                        });
                    }
                    var ul_left = _.offset().left;
                    var ul_right = ul_left + _.width();
                    if (ul_left < container_left) {
                        delta = Math.round(parseInt(_.attr('data-left').replace('px', '')) + container_left - ul_left + 1);
                        _.css({
                            left: delta
                        });
                    }
                    if (ul_right > container_right) {
                        delta = Math.round(parseInt(_.attr('data-left').replace('px', '')) - ul_right + container_right - 1);
                        _.css({
                            left: delta
                        });
                    }
                });
                ideapark_megamenu_left_set = true;
            }
        }
        if (ideapark_megamenu_left_set && window_width < 992) {
            $('.main-menu .product-categories > ul > li[class*="col-"] > ul[data-left]').each(function () {
                var _ = $(this);
                _.css({
                    left: 0
                });
                ideapark_megamenu_left_set = false;
            });
        }
    };
    root.ideapark_mega_menu_init = function () {
        ideapark_mega_menu_break(true);
        ideapark_submenu_direction(true);
        ideapark_megamenu();
    };
    root.ideapark_stickyNav = function () {
        if (ideapark_wp_vars.stickyMenu) {
            if (ideaparkStickHeight) {
                var scrollTop = $(window).scrollTop();
                var is_modal_open = $body.hasClass('menu-open') || $body.hasClass('sidebar-open');
                if (scrollTop > ideaparkStickHeight && !$body.hasClass('sticky')) {
                    $('#header').css({
                        height: ideaparkStickHeight
                    });
                    needUpdateIdeaparkStickHeight = true;
                    if (!is_modal_open) {
                        $('#header .main-menu').hide();
                    }
                    $body.addClass('sticky');
                    if (!is_modal_open) {
                        $('#header .main-menu').fadeTo(300, 1);
                    }
                } else if (scrollTop <= ideaparkStickHeight && $body.hasClass('sticky')) {
                    $body.removeClass('sticky');
                    if (needUpdateIdeaparkStickHeight) {
                        $('#header').css({
                            height: ''
                        });
                        ideaparkStickHeight = $('#header').outerHeight();
                        needUpdateIdeaparkStickHeight = false;
                        if (ideapark_parallax_on) {
                            ideapark_refresh_parallax();
                        }
                    }
                }
            }
        }
    };
    root.ideapark_banners = function () {
        var $w = $window;
        if ($home_banners_count) {
            if ($w.width() <= 991) {
                var wst = $w.scrollTop();
                var wh = $w.height();
                var bh = $('.banner', $home_banners).first().outerHeight();
                var bot = $home_banners.offset().top;
                var mmh = $body.hasClass('sticky') ? $('.main-menu').outerHeight() + 50 : 0;
                var delta = (bot - mmh) - (bot + bh - wh);
                var index = Math.round((wst - (bot + bh - wh)) / delta * $home_banners_count);
                if (wst < bot - mmh && wst >= bot + bh - wh || lastBannerIndex != index || wst < bot + bh - wh && lastBannerIndex != 1 || wst > bot - mmh && lastBannerIndex != $home_banners_count) {
                    if (index <= 0) {
                        index = 1;
                    } else if (index >= $home_banners_count) {
                        index = $home_banners_count;
                    }
                    if (!$home_banners.hasClass('shift-' + index)) {
                        $home_banners.removeClass();
                        $home_banners.addClass('shift-' + index);
                    }
                    lastBannerIndex = index;
                }
                $home_banners.removeClass('preloading');
            }
        }
    };
    root.ideapark_open_photo_swipe = function (imageWrap, index) {
        var $this, $a, $img, items = [],
            size, item;
        $slick_product_single_slides.each(function () {
            $this = $(this);
            $a = $this.children('a');
            $img = $a.children('img');
            size = $a.data('size').split('x');
            item = {
                src: $a.attr('href'),
                w: parseInt(size[0], 10),
                h: parseInt(size[1], 10),
                msrc: $img.attr('src'),
                el: $a[0]
            };
            items.push(item);
        });
        var options = {
            index: index,
            showHideOpacity: true,
            bgOpacity: 1,
            loop: false,
            closeOnVerticalDrag: false,
            mainClass: ($slick_product_single_slides.length > 1) ? 'pswp--minimal--dark' : 'pswp--minimal--dark pswp--single--image',
            barsSize: {
                top: 0,
                bottom: 0
            },
            captionEl: false,
            fullscreenEl: false,
            zoomEl: false,
            shareEl: false,
            counterEl: false,
            tapToClose: true,
            tapToToggleControls: false
        };
        var pswpElement = $('.pswp')[0];
        var gallery = new PhotoSwipe(pswpElement, PhotoSwipeUI_Default, items, options);
        gallery.init();
        gallery.listen('initialZoomIn', function () {
            if ($slick_product_thumbnails.length && !ideapark_is_mobile_layout) {
                $(this).product_thumbnails_speed = $slick_product_thumbnails.slick('slickGetOption', 'speed');
                $slick_product_thumbnails.slick('slickSetOption', 'speed', 0);
            }
        });
        var slide = index;
        gallery.listen('beforeChange', function (dirVal) {
            slide = slide + dirVal;
            $slick_product_single.trigger('to.owl.carousel', slide);
        });
        gallery.listen('close', function () {
            if ($slick_product_thumbnails.length && !ideapark_is_mobile_layout) {
                $slick_product_thumbnails.slick('slickSetOption', 'speed', $(this).product_thumbnails_speed);
            }
        });
    };
    root.ajaxSearchFunction = ideapark_debounce(function () {
        var search = $("#ajax-search-input").val();
        $.ajax({
            url: ideapark_wp_vars.ajaxUrl,
            type: 'POST',
            data: {
                action: 'ideapark_ajax_search',
                s: search
            },
            success: function (results) {
                $(".js-ajax-search-result").html(results).addClass('loaded');
                $('.search-shadow').removeClass('loading');
            }
        });
    }, 500);
    root.ideapark_to_top_button = function () {
        if ($to_top_button.length) {
            if ($window.scrollTop() > 500) {
                if (!$to_top_button.hasClass('active')) {
                    $to_top_button.addClass('active');
                }
            } else {
                if ($to_top_button.hasClass('active')) {
                    $to_top_button.removeClass('active');
                }
            }
        }
    };
    root.ideapark_init_home_instagram = function () {
        var $instafeed = $('#instafeed');
        if ($instafeed.length && $instafeed.data('token') !== '') {
            var template = '<div class="home-instagram-item"><a href="{{link}}" target="_blank">' + (ideapark_wp_vars.lazyload ? '<img class="lazyload" data-src="{{image}}" alt=""/>' : '<img src="{{image}}" alt=""/>') + '</a></div>';
            var userFeed = new Instafeed({
                get: 'user',
                limit: 6,
                resolution: 'standard_resolution',
                userId: $instafeed.data('user-id'),
                accessToken: $instafeed.data('token'),
                template: template
            });
            userFeed.run();
        }
    };
    root.ideapark_owl_hide_arrows = function (event) {
        var $element = event instanceof jQuery ? event : $(event.target);
        var $prev = $element.find('.owl-prev');
        var $next = $element.find('.owl-next');
        if ($prev.length && $next.length) {
            if ($prev.hasClass('disabled') && $next.hasClass('disabled')) {
                $prev.addClass('h-hidden');
                $next.addClass('h-hidden');
            } else {
                $prev.removeClass('h-hidden');
                $next.removeClass('h-hidden');
            }
        }
    };
    root.ideapark_init_thumbs = function () {
        if (!ideapark_is_mobile_layout && $slick_product_thumbnails.length && !$slick_product_thumbnails.hasClass('init')) {
            $slick_product_thumbnails.on('init', function () {
                $slick_product_thumbnails_slides.bind('click', function () {
                    var _ = $(this);
                    if (_.hasClass('current')) {
                        return;
                    }
                    var direction = _.index() > ideapark_current_index_thumbnail ? 'right' : 'left';
                    ideapark_current_index_thumbnail = _.index();
                    $('.slide.current', $slick_product_thumbnails).removeClass('current');
                    _.addClass('current');
                    var find = function () {
                        if (!$('.slide.current', $slick_product_thumbnails).hasClass('slick-active')) {
                            if (direction === 'right') {
                                $slick_product_thumbnails.slick('slickNext');
                            } else {
                                $slick_product_thumbnails.slick('slickPrev');
                            }
                            setTimeout(find, 500);
                        }
                    };
                    find();
                    if (direction === 'right' && !_.next().hasClass('slick-active')) {
                        $slick_product_thumbnails.slick('slickNext');
                    } else if (direction === 'left' && !_.prev().hasClass('slick-active')) {
                        $slick_product_thumbnails.slick('slickPrev');
                    }
                    $slick_product_single.trigger('to.owl.carousel', _.index());
                });
            });
            $slick_product_thumbnails.addClass('init').slick({
                dots: false,
                arrows: false,
                slidesToShow: $slick_product_thumbnails.data('count'),
                slidesToScroll: 1,
                adaptiveHeight: false,
                vertical: ideapark_wp_vars.productThumbnails === 'left',
                infinite: false,
                focusOnSelect: false,
                draggable: false,
                touchMove: false
            });
            return true;
        }
        return false;
    };
    root.ideapark_init_product_gallery = function () {
        if ($slick_product_single.length) {
            var count = $slick_product_single.find('.woocommerce-product-gallery__image').length;
            if (count > 1) {
                $('.js-product-info-carousel:not(.owl-carousel)').addClass('owl-carousel').on('resized.owl.carousel', ideapark_owl_hide_arrows).on('changed.owl.carousel', function (event) {
                    var currentItem = event.item.index;
                    ideapark_current_slide = currentItem;
                    if ($slick_product_thumbnails.length && !ideapark_is_mobile_layout) {
                        $slick_product_thumbnails_slides.eq(currentItem).trigger('click');
                    }
                }).owlCarousel({
                    items: 1,
                    loop: false,
                    margin: 0,
                    nav: true,
                    dots: false,
                    rtl: !!ideapark_wp_vars.isRtl,
                    navText: [ideapark_wp_vars.arrowLeftOwl, ideapark_wp_vars.arrowRightOwl],
                    onInitialized: ideapark_owl_hide_arrows
                });
            }
            $slick_product_single_slides.bind('click', function (e) {
                if ($slick_product_single.hasClass('animating')) {
                    return;
                }
                e.preventDefault();
                var $this = $(this);
                var index = $this.data('index');
                if (ideapark_wp_vars.shopProductModal && $this.hasClass('ip-product-image--zoom')) {
                    ideapark_open_photo_swipe(this, index);
                }
            });
        }
    };
    root.ideapark_init_masonry = function () {
        if ($.fn.masonry) {
            var $grid = $('.grid.masonry');
            if ($grid.length) {
                $grid.masonry({
                    itemSelector: '.post, .page, .product',
                    columnWidth: '.post-sizer',
                    percentPosition: true
                });
                $grid.imagesLoaded().progress(function () {
                    $grid.masonry('layout');
                });
                $grid.imagesLoaded(function () {
                    $grid.masonry('layout');
                });
            }
        }
    };
})(jQuery, window);