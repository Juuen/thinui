/**
 * 标签
 * @param {Object} options
 * @container         渲染TAB容器
 * @data              thin-data，标签输入数据对象。
 * @data[tabs]        TAB数据对象，格式为{tabname:内容渲染函数名，[...repeat}。
 * @data[tabindex]    默认TAB索引，默认值为0。
 * @data[change]      仅当tabs为字符串数组时可用，用来触发标签切换回调函数。
 */
thinui.taber = function (options) {
    let { container, data } = options || {};
    if (!container) throw "thin-taber没有配置参数[container]";
    if (!data) throw "thin-taber没有配置参数[data]";
    if (!data.tabs) throw "thin-taber没有配置参数[data.tabs]";

    let tabsDataType = Object.prototype.toString.call(data.tabs);
    if (tabsDataType === "[object Array]" && !(Object.prototype.toString.call(data.change) === "[object Function]")) throw "thin-taber没有配置参数[data.change]";
    else if (tabsDataType === "[object Object]" && !(Object.keys(data.tabs).length > 0)) throw "thin-taber参数[data.tabs]格式化不规范";

    let isTabArray = tabsDataType === "[object Array]",
        tabNames = isTabArray ? data.tabs : Object.keys(data.tabs),
        ssname = `tabindex_${isTabArray ? data.change.name : data.tabs[tabNames[0]].name || data.tabs[tabNames[0]]}`,
        tabindex = thinui.utils.getss(ssname) || data.tabindex || 0;

    tabNames.length &&
        $(container).render({
            taber: [
                {
                    tablist: {
                        tabitem: function (d) {
                            d.data === tabNames[tabindex] && d.container.classList.add("active");
                            return d.data;
                        },
                        data: tabNames,
                        click: function (e) {
                            let siblings = e.sender.parentNode.querySelectorAll("tabitem");
                            siblings.forEach(function (item) {
                                e.sender.isSameNode(item) ? e.sender.classList.add("active") : item.classList.remove("active");
                            });
                            e.container = e.sender.closest("taber").querySelector("tabview");
                            e.container.innerHTML = "";
                            if (isTabArray) data.change(e);
                            else {
                                e.reRender = data.tabs[e.org_data];
                                Object.prototype.toString.call(e.reRender) === "[object Function]" && e.reRender(e.container, data);
                            }
                            ssname && thinui.utils.setss(ssname, tabNames.indexOf(e.org_data));
                        }
                    }
                },
                {
                    tabview: function (r) {
                        if (isTabArray) data.change({ container: r.container, org_data: tabNames[tabindex] });
                        else {
                            r.reRender = data.tabs[tabNames[tabindex]];
                            Object.prototype.toString.call(r.reRender) === "[object Function]" && r.reRender(r.container, data);
                        }
                    }
                }
            ],
            data: ""
        });
};
