export = thinui2;
export as namespace thinui;

declare namespace thinui2 {
    /**
     * 模态对话框
     * @param {Object} options
     * @title        对话框标题，如果为空，则隐藏标题栏。
     * @content      对话框内容回调函数。
     * @foot         对话框底栏回调函数，默认null，允许用户自定义底栏，当赋值为false时表示隐藏对话框底栏。
     * @confirm      确认按钮，值为对象时，包含title（按钮文字）、finish（回调函数）；值为函数时等效于confirm.finish。
     *               回调参数内置close()方法用来关闭对话框、refresh()方法用来恢复按钮状态（防抖）
     *               当foot为false时可以不需要填写该参数。
     * @cancel       取消按钮回调函数。
     * @draggable    是否启用拖拽，默认为true。
     * @width        对话框宽度，默认为60%。
     * @top          对话框离顶部距离，支持%、px，默认为10%。
     * @style        对话框css样式。
     */
    function dialog(options: any): void;

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
    function pager(options: any): void;

    /**
     * 标签
     * @param {Object} options
     * @container         渲染TAB容器
     * @data              thin-data，标签输入数据对象。
     * @data[tabs]        TAB数据对象，格式为{tabname:内容渲染函数名，[...repeat}。
     * @data[tabindex]    默认TAB索引，默认值为0。
     * @data[change]      仅当tabs为字符串数组时可用，用来触发标签切换回调函数。
     */
    function taber(options: any): void;

    /**
     * 面包屑导航
     * @param {Object} options
     * @container         导航容器，默认为breadcrumb。
     * @data              数据参数对象
     * @data[separator]   分隔符，默认为/
     * @data[list]        导航项列表，格式为：[{ title: "主页", url: "/" }]
     */
    function breadcrumb(options: any): void;

    /**
     * TABLE数据列表 - 字段查询扩展模块
     * @param {Object} options
     * @filters       设置可查询的数据字段，逗号分隔，必填，当使用该模块，该字段必须指定。
     * @container     用来渲染数据表table的容器标签，必填。
     * @reRender      渲染数据列表函数，必填，例：reRender(container,data)
     * @注            当使用该模块时，表头(TH)必须添加field属性。例：`<th field="name"></th>`
     */
    function tableFilter(options: any): void;
}
