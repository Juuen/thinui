/**
 * TABLE数据列表 - 字段查询扩展模块
 * @param {Object} options
 * @filters       设置可查询的数据字段，逗号分隔，必填，当使用该模块，该字段必须指定。
 * @container     用来渲染数据表table的容器标签，必填。
 * @reRender      渲染数据列表函数，必填，例：reRender(container,data)
 * @注            当使用该模块时，表头(TH)必须添加field属性。例：`<th field="name"></th>`
 */
thinui.tableFilter = function (options) {
    let { container, reRender, filters, tpl } = options || {};
    if (!filters || filters === "") return; // 如果没有配置查询字段，直接退出。
    if (!container) throw "thin-dfilter没有配置参数[container]！";
    if (!reRender || Object.prototype.toString.call(reRender) !== "[object Function]") throw "thin-dfilter没有配置参数[reRender]！";

    let tb = container.nodeName === "TABLE" ? container : container.querySelector("table");
    let qfilters = filters.split(",");
    let ssname = `q_${reRender.name}`;
    let ths = tb.querySelectorAll("th");
    let q = {};

    ths.forEach(function (item, index) {
        if (qfilters.includes(item.getAttribute("field"))) {
            item.setAttribute("title", "双击可查询");
        }
    });

    tb.addEventListener("dblclick", function (e) {
        let th = e.target;
        if (th.nodeName !== "TH") return;
        let field = th.getAttribute("field");
        let tplitem = (tpl && tpl[field]) || "";

        if (!qfilters.includes(field)) {
            field && alert(`尚未配置筛选字段[${field}]！`);
            return;
        }

        thinui.dialog({
            title: "数据查询",
            confirm: function (res) {
                let ss = thinui.utils.getss(ssname);
                q = { ...ss, ...res.new_data, page: 1 };
                thinui.utils.setss(ssname, q);
                reRender(container, { ...q, res });
                setTimeout(function () {
                    res.close(res);
                }, 200);
            },
            content: function (d) {
                $(d.container).render({
                    template: {
                        switch: Object.prototype.toString.call(tplitem),
                        case: {
                            "[object Object]": {
                                e: "select",
                                a: { name: "status" },
                                options: tplitem
                            },
                            default: {
                                field: [{ label: th.innerText }, { input: "", a: { type: "text", name: `${field}` } }]
                            }
                        }
                    }
                });
            },
            width: "400px"
        });
    });
    thinui.tableFilter.condRender(q, tb, reRender, container, qfilters);
};

thinui.tableFilter.condRender = function (q, tb, reRender, container, qfilters) {
    let ssname = `q_${reRender.name}`;
    q = { ...(thinui.utils.getss(ssname) || {}), ...(q || {}) };

    let tb_parent = tb.parentNode,
        cond = tb_parent.querySelector("cond") || document.createElement("cond"),
        keys = function () {
            return Object.keys(q);
        };

    if (!keys || !keys().length || !qfilters.length) return;
    let condlist = qfilters.filter(function (item) {
        return keys().includes(item);
    });
    if (!condlist.length) return;

    tb_parent.insertBefore(cond, tb);
    $(cond).render({
        data: condlist,
        template: {
            conditem: [
                {
                    span: function (r) {
                        r.container.parentNode.setAttribute("data-field", r.data);
                        return q[r.data];
                    }
                },
                {
                    i: "",
                    a: { title: "删除" },
                    click: function (e) {
                        let pnode = e.sender.parentNode,
                            field = pnode.dataset.field,
                            q_ss = thinui.utils.getss(ssname);
                        delete q_ss[field];
                        thinui.utils.setss(ssname, { ...q_ss, page: 1 });
                        pnode.remove();
                        reRender(container);
                    }
                }
            ]
        }
    });
    thinui.utils.setss(ssname, q);
};
