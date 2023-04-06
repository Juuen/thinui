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
 * @top          对话框离顶部距离，支持%、px，默认为12%。
 * @style        对话框css样式。
 */
thinui.dialog = function (options) {
    let { container, data, title, cancel, confirm, content, foot, draggable, width, top, style } = options || {},
        topSpacing;
    if (!confirm && foot !== false) throw "thin-dialog没有配置参数[confirm]！";
    if (!content || Object.prototype.toString.call(content) !== "[object Function]") throw "thin-dialog参数[content]为函数！";
    if (!container) container = document.body;
    if (!(draggable === false)) draggable = true;

    style = style || {};
    style.width = width || style.width || "60%";
    style["margin-top"] = top || style["margin-top"] || "12%";

    if ((style["margin-top"] || "").includes("%")) topSpacing = style["margin-top"].replace("%", "") / 100;
    else if ((style["margin-top"] || "").includes("px")) topSpacing = style["margin-top"].replace("px", "");
    else topSpacing = 0.12;

    let transform = {
        offsetX: 0,
        offsetY: 0
    };

    $(container).render({
        thinmask: {
            thindialog: [
                {
                    dlghead: [
                        { em: `${title || "Untitled"}` },
                        {
                            i: "",
                            click: function (e) {
                                dialogClose(e);
                            }
                        },
                        function (d) {
                            !title && d.container.remove();
                        }
                    ],
                    event: {
                        mousedown: function (e) {
                            if (!draggable) return;
                            const cursorDefaultX = e.event.clientX,
                                cursorDefaultY = e.event.clientY,
                                { offsetX, offsetY } = transform,
                                _thindialog = e.sender.parentNode,
                                rect = _thindialog.getBoundingClientRect(),
                                dialogX = rect.x,
                                dialogY = rect.y,
                                dialogWidth = rect.width,
                                dialogHeight = rect.height,
                                clientWidth = document.documentElement.clientWidth,
                                clientHeight = document.documentElement.clientHeight,
                                minX = -dialogX + offsetX,
                                maxX = clientWidth - dialogX - dialogWidth + offsetX,
                                minY = -dialogY + offsetY,
                                maxY = clientHeight - dialogY - dialogHeight + offsetY;

                            const onMousemove = function (e) {
                                const moveX = Math.min(Math.max(offsetX + e.clientX - cursorDefaultX, minX), maxX);
                                const moveY = Math.min(Math.max(offsetY + e.clientY - cursorDefaultY, minY), maxY);

                                transform = {
                                    offsetX: moveX,
                                    offsetY: moveY
                                };

                                _thindialog.style.transform = `translate(${moveX}px,${moveY}px)`;
                            };
                            const onMouseup = function (e) {
                                document.removeEventListener("mousemove", onMousemove);
                                document.removeEventListener("mouseup", onMouseup);
                            };

                            document.addEventListener("mousemove", onMousemove);
                            document.addEventListener("mouseup", onMouseup);
                        },
                        mouseover: function (e) {
                            if (draggable) e.sender.style.cursor = "move";
                        }
                    }
                },
                { dlgbody: content, data: data || {} },
                {
                    dlgfoot: {
                        if: function (r) {
                            return Object.prototype.toString.call(foot) === "[object Function]";
                        },
                        then: foot,
                        else: [
                            {
                                button: `${(confirm || {}).title || "确定"}`,
                                class: "thin-button-primary",
                                a: { "data-title": `${(confirm || {}).title || "确定"}` },
                                click: function (e) {
                                    e.close = dialogClose;
                                    e.refresh = opButtonRefresh;
                                    e.sender.innerText = "处理中";
                                    e.sender.setAttribute("disabled", "");
                                    Object.prototype.toString.call(confirm) === "[object Function]" ? confirm(e) : confirm.finish && confirm.finish(e);
                                }
                            },
                            {
                                button: `${(cancel || {}).title || "取消"}`,
                                click: function (e) {
                                    dialogClose(e);
                                }
                            }
                        ]
                    },
                    when: function (r) {
                        if (foot === false) return false;
                        else return true;
                    }
                },
                function (r) {
                    // 动态适配对话框高度
                    let contentHeight = r.container.clientHeight,
                        docHeight = document.documentElement.clientHeight,
                        avlHeight = docHeight * (1 - topSpacing * 2);
                    console.log(contentHeight, docHeight, avlHeight);
                    if (contentHeight > avlHeight) contentHeight = avlHeight;
                    r.container.style.maxHeight = `${avlHeight}px`;
                    document.body.style.overflow = "hidden";
                }
            ],
            style: style
        },
        data: "",
        class: "dialog-in"
    });

    /**
     * 关闭对话框
     * @param {Event} e 触发关闭动作的事件源，可选。
     */
    function dialogClose(e) {
        let sender = (e && e.sender) || this.sender,
            mask = sender.closest("thinmask");
        mask.classList.remove("dialog-in");
        mask.classList.add("dialog-out");
        setTimeout(() => {
            mask.remove();
            document.body.style.overflow = "auto";
        }, 500);
    }

    /**
     * 刷新操作按钮
     * @param {Event} e 触发关闭动作的事件源，可选。
     */
    function opButtonRefresh(e) {
        let sender = (e && e.sender) || this.sender;
        sender.innerText = sender.dataset.title || sender.innerText;
        sender.removeAttribute("disabled");
    }
};
