/**
 * 面包屑导航
 * @param {Object} options
 * @container         导航容器，默认为breadcrumb。
 * @data              数据参数对象
 * @data[separator]   分隔符，默认为/
 * @data[list]        导航项列表，格式为：[{ title: "主页", url: "/" }]
 */
thinui.breadcrumb = function (options) {
    let { container, data } = options;
    if (!container) throw "thin-breadcrumb没有配置参数[container]！";

    let breadcrumb = container;
    if (container.nodeName !== "BREADCRUMB") {
        breadcrumb = document.createElement("breadcrumb");
        container.appendChild(breadcrumb);
    }
    if (!data.separator) data.separator = "/"; // 默认分隔符为/

    data.list &&
        data.list.forEach(function (item, index) {
            let a = document.createElement("a");
            a.innerText = item.title;
            a.setAttribute("href", item.url);
            breadcrumb.appendChild(a);
            if (index < data.list.length - 1) {
                let sep = document.createElement("i");
                sep.innerText = data.separator;
                breadcrumb.appendChild(sep);
            }
        });
};
