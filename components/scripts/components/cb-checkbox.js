/*
 * cb-checkbox 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 多选框组件。
 */

var CbCheckbox = function () {
};

//注册CbCheckbox组件
ParsingHelper.registerComponent("cb-checkbox", CbCheckbox);

var  checkboxBeforeAjax;
//保存容cb-checkbox组件结构的列表
(function () {
    //cb-checkbox组件结构列表
    var domDivList = {
        default: '    <div class="cb-checkbox-div clearfix">' +
        '    </div>'
    };

    //根据 cb-checkbox获得容器结构
    CbCheckbox.getDomDiv = function (domDivName) {
        if (domDivName && typeof domDivName === "string") { //此处校验可以写为公共方法
            var componentDiv = domDivList[domDivName];
            if (componentDiv) {
                return componentDiv;
            } else {
                err("未找到" + domDivName + "组件结构，使用了默认结构", 1);
                return domDivList["default"];
            }
            return
        } else {
            return domDivList["default"];
        }
    }
})();

(function () {
    var options = {
        domDiv: "default",
        cid: "cb-checkbox"
    };
    CbCheckbox.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbCheckbox.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbCheckbox.getOptions(), $tag.data("options"));
    var $dom = $(CbCheckbox.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbCheckbox.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    //标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var tagIndex = $dom.data("tagindex"),
        options = $dom.data("options"),
        cid = $dom.attr("cid");
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css('height',options.height);
    }
    if (options.isRequest !== true && options.isRequest !== 'true' ) {
        CbCheckbox.prototype.initData($dom, options, tagIndex);
    }
};

CbCheckbox.prototype.initData = function ($dom, options, tagIndex) {
    //ajax加载请求数据
    if (options.service) {
        var list = options.list;
        var serviceId = options.service;
        var data = {};
        var params = {};
        data.type =options.type ? options.type : 'POST';
        params.service = serviceId;
        data.url = options.url ? options.url : false;
        data.params = params;
        if(options.beforeAjax){
            checkboxBeforeAjax = new Function('data',options.beforeAjax);
            data = checkboxBeforeAjax(data);
        }
        data.successF = function (returnData) {
            var dataList = {};
            dataList.tagIndex = tagIndex;
            dataList.option = returnData[list];
            dataList.name = options.name;
            dataList.value = options.value;
            dataList.text = options.text;
            if (options.isCheckbox) {
                dataList.isCheckbox = options.isCheckbox;
            }
            var html = "";
            TemplateHelper.parseOptions("initCheckboxAjaxData", options.name, dataList, "");
            html = TemplateHelper.render(options.name, dataList);
            $dom.append(html);
        };
        //业务数据有误的提示 带确认
        data.errorF = function (value1, value2, value3) {
        };
        CommonAjax.ajax(data);
    } else {
        //没有请求
        options.tagIndex = tagIndex;
        var html = "";
        TemplateHelper.parseOptions("initCheckboxData", options.name, options, "");
        html = TemplateHelper.render(options.name, options);
        $dom.append(html);
    }
};
