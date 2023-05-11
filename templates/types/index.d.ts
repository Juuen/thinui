/**
 * thinui组件
 */
declare namespace thinui {
    /**
     * 模态对话框
     * @param options
     * @param options.title       -   对话框标题，如果为空，则隐藏标题栏。
     * @param options.content     -   对话框内容回调函数。
     * @param options.foot        -   对话框底栏回调函数，默认null，允许用户自定义底栏，当赋值为false时表示隐藏对话框底栏。
     * @param options.confirm     -   确认按钮，值为对象时，包含title（按钮文字）、finish（回调函数）；值为函数时等效于confirm.finish。回调参数内置close()方法用来关闭对话框、refresh()方法用来恢复按钮状态（防抖），当foot为false时可以不需要填写该参数。
     * @param options.cancel      -   取消按钮回调函数。
     * @param options.draggable   -   是否启用拖拽，默认为true。
     * @param options.width       -   对话框宽度，默认为60%。
     * @param options.top         -   对话框离顶部距离，支持%、px，默认为12%。
     * @param options.style       -   对话框css样式。
     */
    function dialog(options: {
        title: string;
        content: Function;
        foot: Function | boolean;
        confirm: Function | object;
        cancel: Function;
        draggable: boolean;
        width: string;
        top: string;
        style: object;
    }): void;

    /**
     * 数据分页
     * @param {Object} options
     * @param options.container             分页容器，默认为pager标签。
     * @param options.data                  分页控件参数集合，包含所有输入参数，包括ddd返回结果。
     * @param options.data.pagecount        总页数，默认不足两页不显示分页控件。
     * @param options.data.page             页码，默认为1。
     * @param options.data.pagesize         页长，默认为10，即显示10条数据。
     * @param options.data.showSummary      显示数据总数，默认为false。
     * @param options.data.showJumper       显示跳转，默认为false。
     * @param options.data.showSinglePage   当页码不足或等于一页的时候是否展示，默认为true。
     * @param options.data.step             步长，默认为2，即中间显示5个页码。
     * @param options.data.container        回调函数容器，用来渲染数据列表。
     * @param options.data.reRender         渲染数据列表函数，当发生页码变化时候会调用该函数更新数据列表。例：reRender(container,data)。
     */
    function pager(options: {
        container: string;
        data: {
            pagecount: number;
            page: number;
            pagesize: number;
            showSummary: boolean;
            showJumper: boolean;
            showSinglePage: boolean;
            step: number;
            container: string;
            reRender: Function;
        };
    }): void;

    /**
     * 标签
     * @param {Object} options
     * @param options.container         渲染TAB容器
     * @param options.data              thin-data，标签输入数据对象。
     * @param options.data.tabs         TAB数据对象，格式为{tabname:内容渲染函数名，[...repeat}。
     * @param options.data.tabindex     默认TAB索引，默认值为0。
     * @param options.data.change       仅当tabs为字符串数组时可用，用来触发标签切换回调函数。
     */
    function taber(options: { container: string; data: { tabs: object; tabindex: number; change: Function } }): void;

    /**
     * 面包屑导航
     * @param {Object} options
     * @param options.container         导航容器，默认为breadcrumb。
     * @param options.data              数据参数对象
     * @param options.data.separator    分隔符，默认为/
     * @param options.data.list         导航项列表，格式为：[{ title: "主页", url: "/" }]
     */
    function breadcrumb(options: { container: string; data: { separator: string; list: object[] } }): void;

    /**
     * TABLE数据列表 - 字段查询扩展模块
     * @param {Object} options
     * @param options.filters       设置可查询的数据字段，逗号分隔，必填，当使用该模块，该字段必须指定。
     * @param options.container     用来渲染数据表table的容器标签，必填。
     * @param options.reRender      渲染数据列表函数，必填，例：reRender(container,data)
     * @description                 当使用该模块时，表头(TH)必须添加field属性。例：`<th field="name"></th>`
     */
    function tableFilter(options: { filters: string; container: string; reRender: Function }): void;
}
