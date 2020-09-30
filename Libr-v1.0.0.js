/**
* @author: Emmanuel Godswill - (Ryan Lincoln);
* @version: 0.0.1;
*/
function createFactory(e, t) {
    return t ? new e(t) : new e();
}
var Libr,
    xhttp = createFactory(XMLHttpRequest), exports = {};
!(function () {
    "use strict";
    ((Libr = function (e) {
        var o = Object.create(null);
        return (
            (o.selector = e),
            (o.element = "window" === e ? window : "document" === e ? document : document.querySelector(o.selector)),
            (o.elements = document.querySelectorAll(o.selector)),
            (o.html = function (e) {
                return e ? ((o.element.innerHTML = e), o) : o.element;
            }),
            (o.append = function (e) {
                if (!e) throw new Error("append method must have one argument");
                return o.element.insertAdjacentHTML("beforeend", e), o;
            }),
            (o.insertBefore = function (e) {
                return o.element.insertAdjacentHTML("beforebegin", e), o;
            }),
            (o.hide = function () {
                return (o.element.style.display = "none"), o;
            }),
            (o.show = function () {
                return (o.element.style.display = "block"), o;
            }),
            (o.toggle = function (e) {
                return e || ("none" !== o.element.style.display ? (o.element.style.display = "none") : (o.element.style.display = "block")), o.element.classList.contains(e) ? o.element.classList.remove(e) : o.element.classList.add(e), o;
            }),
            (o.attr = function (e, t) {
                return t ? (o.element.setAttribute(e, t), o) : o.element.getAttribute(e);
            }),
            (o.each = function (e) {
                if ("object" != typeof o.element) throw new Error("Libr each method requires an object to be passed as the selector, non object given");
                return o.elements.forEach(e), o;
            }),
            (o.find = function (t) {
                if (!t || "form" !== o.element.nodeName.toLowerCase()) throw new Error("No element supplied or not quering a form in the find method");
                var e = Array.from(o.element.getElementsByTagName("input")),
                    n = "#" === t[0] ? "id" : "className";
                if ("#" !== t[0] && "." !== t[0]) throw new Error("find method expects an id or class");
                return (
                    e.forEach(function (e) {
                        e[n] === t.slice(1) && (o.element = e);
                    }),
                    o
                );
            }),
            (o.val = function (e) {
                if ("input" === o.element.nodeName.toLowerCase() || "textarea" === o.element.nodeName.toLowerCase()) {
                    if (!e) return o.element.value;
                    o.element.value = e;
                }
                return o;
            }),
            (o.scrollTo = function (e, t) {
                if (!e || !t) throw new Error("provide a start and finish index");
                return o.element.scrollTo(e, t), o;
            }),
            (o.reset = function () {
                if (arguments[0]) throw new Error("reset method does not require any arguments");
                return o.element.reset(), o;
            }),
            (o.parent = function () {
                var e;
                return arguments[0] || (e = o.element.parentNode), (o.element = e), o;
            }),
            (o.on = function (e, t) {
                if (!e) throw new TypeError("Unknown event passed in");
                return (o.element["on" + e] = t), o;
            }),
            (o.css = function () {
                if (!arguments[0] || 1 < arguments.length) throw new Error("CSS method requires some css properties to be passed and just a single arguments of either object or string pair");
                var e,
                    t = arguments[0];
                if ("object" == typeof t) {
                    for (e in t) t.hasOwnProperty(e) && (o.element.style[e] = t[e]);
                } else {
                    if ("string" != typeof t) throw new Error("Error on your css construction");
                    if (-1 !== t.indexOf(",")) throw new Error("multiple css properties should be defined inside an object");
                    var n = t.split(":")[0],
                        r = t.split(":")[1];
                    o.element.style[n] = r;
                }
                return o;
            }),
            o
        );
    }).ready = function (e) {
        return document.addEventListener ? document.addEventListener("DOMContentLoaded", e) : document.attachEvent("DOMContentLoaded", e);
    }),
        (Libr.ajax = function () {
            var e = arguments[0];
            if (e && "object" == typeof e) {
                if (!(e.hasOwnProperty("method") && e.hasOwnProperty("url") && e.hasOwnProperty("done") && e.hasOwnProperty("fail")))
                    throw new Error("Libr ajax requires object with the following core properties. method, url, done, fail. please review the doc");
                if ("function" != typeof e.done || "function" != typeof e.fail) throw new TypeError("done and fail properties expects a function");
                var t = e.method,
                    n = e.url,
                    r = e.body,
                    o = e.done,
                    i = e.fail;
                if ("" === t || "" === n) throw new Error("method and url cannot be empty");
                if (!["GET", "POST"].includes(t)) throw new Error("method can either be GET or POST");
                if ("GET" === t)
                    "undefined" !== window.fetch
                        ? fetch(n)
                              .then(function (e) {
                                  e.json();
                              })
                              .then(function (e) {
                                  o(e);
                              })
                              .catch(function (e) {
                                  i(e);
                              })
                        : (xhttp.open("GET", n, !0),
                          (xhttp.onreadystatechange = function () {
                              try {
                                  4 === xhttp.readyState && 200 === xhttp.status && o(JSON.parse(xhttp.responseText));
                              } catch (e) {
                                  i(e);
                              }
                          }),
                          xhttp.send());
                else if ("POST" === t) {
                    if (!e.hasOwnProperty("body")) throw new Error("POST method requires a form body, provide a body to send");
                    window.fetch
                        ? fetch(n, e)
                              .then(function (e) {
                                  e.json();
                              })
                              .then(function (e) {
                                  o(e);
                              })
                              .catch(function (e) {
                                  i(e);
                              })
                        : (xhttp.open("POST", n, !0),
                          (xhttp.onreadystatechange = function () {
                              try {
                                  4 === xhttp.readyState && 200 === xhttp.status && o(JSON.parse(xhttp.responseText));
                              } catch (e) {
                                  i(e);
                              }
                          }),
                          xhttp.send(r));
                }
            }
        }),
        (Libr.allowRouting = !1),
        Object.defineProperty(Libr, "useHashRouter", {
            get: function () {
                return this.allowRouting;
            },
            set: function (e) {
                if ("boolean" != typeof e) throw new TypeError("useHashRouter requires a boolean to be passed, " + typeof e + " given");
                this.allowRouting = e;
            },
        }),
        Libr.ready(function () {
            window.Libr && !0 === window.Libr.useHashRouter && Libr.hashRouter();
        }),
        (Libr.hashRouter = function () {
            var n = document.querySelector("#libr-view");
            window.addEventListener("hashchange", function (e) {
                var t = window.location.hash.substring(1);
                r(window.fetch, t, n);
            });
            var r = function (e, t, n) {
                "undefined" !== e
                    ? e(t)
                          .then(function (e) {
                              e.text();
                          })
                          .then(function (e) {
                              n.innerHTML = e;
                          })
                          .catch(function (e) {
                              console.log(e);
                          })
                    : (xhttp.open("GET", t, !0),
                      (xhttp.onreadystatechange = function () {
                          try {
                              4 === xhttp.readyState && 200 === xhttp.status && (n.innerHTML = xhttp.responseText);
                          } catch (e) {
                              console.log(e);
                          }
                      }),
                      xhttp.send());
            };
        }),
        window && void 0 === window.Libr && (window.Libr = Libr);
})(),
    (exports.default = Libr);
