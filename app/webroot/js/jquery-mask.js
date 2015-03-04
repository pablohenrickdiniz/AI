// jQuery Mask Plugin v1.7.4
// github.com/igorescobar/jQuery-Mask-Plugin
(function (g) {
    "function" === typeof define && define.amd ? define(["jquery"], g) : g(window.jQuery || window.Zepto)
})(function (g) {
    var z = function (a, e, b) {
        var k = this, n, p;
        a = g(a);
        e = "function" === typeof e ? e(a.val(), void 0, a, b) : e;
        var c = {
            getCaret: function () {
                try {
                    var d, f = 0, c = a.get(0), h = document.selection, e = c.selectionStart;
                    if (h && !~navigator.appVersion.indexOf("MSIE 10"))d = h.createRange(), d.moveStart("character", a.is("input") ? -a.val().length : -a.text().length), f = d.text.length; else if (e || "0" === e)f = e;
                    return f
                } catch (b) {
                }
            }, setCaret: function (d) {
                try {
                    if (a.is(":focus")) {
                        var f,
                            c = a.get(0);
                        c.setSelectionRange ? c.setSelectionRange(d, d) : c.createTextRange && (f = c.createTextRange(), f.collapse(!0), f.moveEnd("character", d), f.moveStart("character", d), f.select())
                    }
                } catch (h) {
                }
            }, events: function () {
                a.on("keydown.mask", function () {
                    n = c.val()
                }).on("keyup.mask", c.behaviour).on("paste.mask drop.mask", function () {
                    setTimeout(function () {
                        a.keydown().keyup()
                    }, 100)
                }).on("change.mask", function () {
                    a.data("changed", !0)
                }).on("blur.mask", function () {
                    n === a.val() || a.data("changed") || a.trigger("change");
                    a.data("changed",
                        !1)
                }).on("focusout.mask", function () {
                    b.clearIfNotMatch && !p.test(c.val()) && c.val("")
                })
            }, getRegexMask: function () {
                for (var d = [], f, a, c, b, l = 0; l < e.length; l++)(f = k.translation[e[l]]) ? (a = f.pattern.toString().replace(/.{1}$|^.{1}/g, ""), c = f.optional, (f = f.recursive) ? (d.push(e[l]), b = {
                    digit: e[l],
                    pattern: a
                }) : d.push(c || f ? a + "?" : a)) : d.push("\\" + e[l]);
                d = d.join("");
                b && (d = d.replace(RegExp("(" + b.digit + "(.*" + b.digit + ")?)"), "($1)?").replace(RegExp(b.digit, "g"), b.pattern));
                return RegExp(d)
            }, destroyEvents: function () {
                a.off("keydown keyup paste drop change blur focusout DOMNodeInserted ".split(" ").join(".mask ")).removeData("changeCalled")
            },
            val: function (d) {
                var c = a.is("input");
                return 0 < arguments.length ? c ? a.val(d) : a.text(d) : c ? a.val() : a.text()
            }, getMCharsBeforeCount: function (d, a) {
                for (var c = 0, b = 0, g = e.length; b < g && b < d; b++)k.translation[e.charAt(b)] || (d = a ? d + 1 : d, c++);
                return c
            }, caretPos: function (d, a, b, h) {
                return k.translation[e.charAt(Math.min(d - 1, e.length - 1))] ? Math.min(d + b - a - h, b) : c.caretPos(d + 1, a, b, h)
            }, behaviour: function (d) {
                d = d || window.event;
                var a = d.keyCode || d.which;
                if (-1 === g.inArray(a, k.byPassKeys)) {
                    var b = c.getCaret(), e = c.val(), u = e.length, l =
                        b < u, q = c.getMasked(), m = q.length, n = c.getMCharsBeforeCount(m - 1) - c.getMCharsBeforeCount(u - 1);
                    q !== e && c.val(q);
                    !l || 65 === a && d.ctrlKey || (8 !== a && 46 !== a && (b = c.caretPos(b, u, m, n)), c.setCaret(b));
                    return c.callbacks(d)
                }
            }, getMasked: function (a) {
                var f = [], g = c.val(), h = 0, n = e.length, l = 0, q = g.length, m = 1, p = "push", s = -1, r, v;
                b.reverse ? (p = "unshift", m = -1, r = 0, h = n - 1, l = q - 1, v = function () {
                    return -1 < h && -1 < l
                }) : (r = n - 1, v = function () {
                    return h < n && l < q
                });
                for (; v();) {
                    var w = e.charAt(h), x = g.charAt(l), t = k.translation[w];
                    if (t)x.match(t.pattern) ? (f[p](x),
                    t.recursive && (-1 === s ? s = h : h === r && (h = s - m), r === s && (h -= m)), h += m) : t.optional && (h += m, l -= m), l += m; else {
                        if (!a)f[p](w);
                        x === w && (l += m);
                        h += m
                    }
                }
                a = e.charAt(r);
                n !== q + 1 || k.translation[a] || f.push(a);
                return f.join("")
            }, callbacks: function (d) {
                var f = c.val(), g = f !== n;
                if (!0 === g && "function" === typeof b.onChange)b.onChange(f, d, a, b);
                if (!0 === g && "function" === typeof b.onKeyPress)b.onKeyPress(f, d, a, b);
                if ("function" === typeof b.onComplete && f.length === e.length)b.onComplete(f, d, a, b)
            }
        };
        k.remove = function () {
            var a;
            c.destroyEvents();
            c.val(k.getCleanVal()).removeAttr("maxlength");
            a = c.getCaret();
            c.setCaret(a - c.getMCharsBeforeCount(a))
        };
        k.getCleanVal = function () {
            return c.getMasked(!0)
        };
        k.init = function () {
            b = b || {};
            k.byPassKeys = [9, 16, 17, 18, 36, 37, 38, 39, 40, 91];
            k.translation = {
                0: {pattern: /\d/},
                9: {pattern: /\d/, optional: !0},
                "#": {pattern: /\d/, recursive: !0},
                A: {pattern: /[a-zA-Z0-9]/},
                S: {pattern: /[a-zA-Z]/}
            };
            k.translation = g.extend({}, k.translation, b.translation);
            k = g.extend(!0, {}, k, b);
            p = c.getRegexMask();
            !1 !== b.maxlength && a.attr("maxlength", e.length);
            b.placeholder && a.attr("placeholder", b.placeholder);
            a.attr("autocomplete", "off");
            c.destroyEvents();
            c.events();
            var d = c.getCaret();
            c.val(c.getMasked());
            c.setCaret(d + c.getMCharsBeforeCount(d, !0))
        }()
    }, p = {}, y = function () {
        var a = g(this), e = {};
        a.attr("data-mask-reverse") && (e.reverse = !0);
        "false" === a.attr("data-mask-maxlength") && (e.maxlength = !1);
        a.attr("data-mask-clearifnotmatch") && (e.clearIfNotMatch = !0);
        a.mask(a.attr("data-mask"), e)
    };
    g.fn.mask = function (a, e) {
        var b = this.selector, k = function (b) {
            if (!b.originalEvent || g(b.originalEvent.relatedNode)[0] != g(this)[0])return g(this).data("mask",
                new z(this, a, e))
        };
        this.each(k);
        b && !p[b] && (p[b] = !0, setTimeout(function () {
            g(document).on("DOMNodeInserted.mask", b, k)
        }, 500))
    };
    g.fn.unmask = function () {
        try {
            return this.each(function () {
                g(this).data("mask").remove()
            })
        } catch (a) {
        }
    };
    g.fn.cleanVal = function () {
        return this.data("mask").getCleanVal()
    };
    g("*[data-mask]").each(y);
    g(document).on("DOMNodeInserted.mask", "*[data-mask]", y)
});
