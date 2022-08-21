"use strict";
window.thinui = (function () {
    function thinui() {}

    thinui.utils = {
        getss: function (name) {
            return JSON.parse(sessionStorage.getItem(name));
        },
        setss: function (name, value) {
            value &&
                Object.keys(value).forEach(function (item) {
                    !["[object String]", "[object Number]", "[object Boolean]"].includes(Object.prototype.toString.call(value[item])) && delete value[item];
                });
            sessionStorage.setItem(name, JSON.stringify(value));
        },
        q: function (reRender) {
            if (Object.prototype.toString.call(reRender) === "[object Function]") return { ...this.getss(`q_${reRender.name}`) };
            else return {};
        }
    };

    return thinui;
})();
