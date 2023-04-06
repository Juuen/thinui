/**
 * 数据分页
 * @param {Object} options
 * @container              分页容器，默认为pager标签。
 * @data                   分页控件参数集合，包含所有输入参数，包括ddd返回结果。
 * @data [pagecount]       总页数，默认不足两页不显示分页控件。
 * @data [page]            页码，默认为1。
 * @data [pagesize]        页长，默认为10，即显示10条数据。
 * @data [showSummary]     显示数据总数，默认为false。
 * @data [showJumper]      显示跳转，默认为false。
 * @data [showSinglePage]  当页码不足或等于一页的时候是否展示，默认为true。
 * @data [step]            步长，默认为2，即中间显示5个页码。
 * @data [container]       回调函数容器，用来渲染数据列表。
 * @data [reRender]        渲染数据列表函数，当发生页码变化时候会调用该函数更新数据列表。例：reRender(container,data)。
 */
thinui.pager = function (options) {
    let { data } = options || {};
    if (!data) throw "thin-pager没有配置参数[data]！";
    if (!data.container) throw "thin-pager没有配置参数[data.container]！";
    if (!data.reRender || Object.prototype.toString.call(data.reRender) !== "[object Function]") throw "thin-pager没有配置参数[data.reRender]！";
    if (data.showSinglePage === false && !(data.pagecount > 1)) return;

    data.step = data.step || 2; // 前后步长,默认步长为2，即中间显示5页
    data.showSummary = data.showSummary || false; // 显示总数信息
    data.showJumper = data.showJumper || false; // 显示跳转页码
    data.pagesize = data.pagesize || 10; // 初始化页长

    let pagecount = data.pagecount || 0,
        page = data.page || 1,
        pageRangeStart = page - data.step,
        pageRangeEnd = page + data.step,
        plist = [], // 中间页码容器
        ssname = `q_${data.reRender.name}`;

    thinui.utils.setss(ssname, { ...thinui.utils.getss(ssname), ...data, page, pagesize: data.pagesize });

    // 计算中间页展示
    if (pageRangeStart <= 1) {
        pageRangeStart = data.step;
        pageRangeEnd = pageRangeStart + data.step * 2;
        if (pageRangeEnd >= pagecount) pageRangeEnd = pagecount - 1;
    }
    if (pageRangeEnd >= pagecount) {
        pageRangeEnd = pagecount - 1;
        pageRangeStart = pageRangeEnd - data.step * 2;
        if (pageRangeStart <= 1) pageRangeStart = data.step;
    }

    while (pageRangeStart <= pageRangeEnd) {
        plist.push(pageRangeStart);
        pageRangeStart++;
    }

    page - data.step > 2 && plist.length === 5 && plist.unshift("...");
    pagecount - data.step > page + 1 && plist.length >= 5 && plist.push("...");

    let pager = options.container;
    if (pager.nodeName !== "PAGER") {
        pager = document.createElement("pager");
        options.container.appendChild(pager);
    }

    // 渲染页码
    $(pager).render({
        template: [
            {
                i: `总数 ${data.total}`,
                when: function (r) {
                    return data.showSummary;
                }
            },
            {
                ul: [
                    {
                        li: function (d) {
                            page === d.data && d.container.classList.add("active");
                            page <= 1 && d.data === "<" && d.container.classList.add("notallow");
                            if (d.data === "<") return `<i>${d.data}</i>`;
                            else return d.data;
                        },
                        data: ["<", 1],
                        click: function (e) {
                            if (e.sender.classList.contains("active")) return;
                            let pageText = e.sender.innerText;
                            switch (pageText) {
                                case "<":
                                    page - 1 >= 1 && data.reRender(data.container, { ...data, page: page - 1 });
                                    break;
                                default:
                                    data.reRender(data.container, { ...data, page: pageText });
                            }
                        }
                    },
                    {
                        li: function (d) {
                            page === d.data && d.container.classList.add("active");
                            return d.data;
                        },
                        data: plist,
                        click: function (e) {
                            !e.sender.classList.contains("active") && e.sender.innerText !== "..." && data.reRender(data.container, { ...data, page: e.sender.innerText });
                        }
                    },
                    {
                        li: function (d) {
                            page === d.data && d.container.classList.add("active");
                            page >= pagecount && d.data === ">" && d.container.classList.add("notallow");
                            if (d.data === ">") return `<i>${d.data}</i>`;
                            else return d.data;
                        },
                        data: pagecount > 1 ? [pagecount, ">"] : [">"],
                        click: function (e) {
                            if (e.sender.classList.contains("active")) return;
                            let pageText = e.sender.innerText;
                            switch (pageText) {
                                case ">":
                                    page + 1 <= pagecount && data.reRender(data.container, { ...data, page: page + 1 });
                                    break;
                                default:
                                    data.reRender(data.container, { ...data, page: pageText });
                            }
                        }
                    }
                ]
            },
            {
                span: [
                    { span: "跳转" },
                    {
                        e: "input",
                        a: { type: "text", value: `${data.page}` },
                        event: {
                            keydown: function (r) {
                                let gotoPage = r.sender.value;
                                if (!(1 <= gotoPage && gotoPage <= pagecount)) gotoPage = page;
                                r.event.keyCode === 13 && data.reRender(data.container, { ...data, page: gotoPage });
                            }
                        }
                    }
                ],
                when: function (r) {
                    return data.showJumper;
                }
            }
        ]
    });
};
