/*
 * cb-radio 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 单选框。
 */

var CbRadio = function () {
};

//注册CbRadio组件
ParsingHelper.registerComponent("cb-radio", CbRadio);

//保存容cb-radio组件结构的列表
(function () {
    //cb-radio组件结构列表
    var domDivList = {
        default: '    <div class="cb-radio-div clearfix">' +
        '    </div>'
    };

    //根据 cb-radio获得容器结构
    CbRadio.getDomDiv = function (domDivName) {
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
        cid: "cb-radio"};
    CbRadio.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbRadio.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbRadio.getOptions(), $tag.data("options"));
    var $dom = $(CbRadio.getDomDiv(options["domDiv"]).replace("wing", options["type"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbRadio.prototype.initHtml = function ($dom) {
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
    if (options.isRequest !== true && options.isRequest !== 'true') {
        CbRadio.prototype.initData($dom, options, tagIndex);
    }
};

CbRadio.prototype.initData = function ($dom, options, tagIndex) {
    //ajax加载请求数据
    if (options.service || options.url) {
        var list = options.list;
        var serviceId = options.service;
        var data = {
            "type": options.type ? options.type : 'POST',
            "url":options.url ? options.url : false,
            "params": {
                "service": serviceId
            },
            "successF": function (returnData) {
                var dataList = {};
                dataList.tagIndex = tagIndex;
                dataList.option = returnData[list];
                dataList.name = options.name;
                dataList.value = options.value;
                dataList.text = options.text;
                var html = "";
                TemplateHelper.parseOptions("initRadioAjaxData", options.name, dataList, "");
                html = TemplateHelper.render(options.name, dataList);
                var $html = $(html);
                if(options.defaultKey){
                    $html.find("li>input[value='"+options.defaultKey+"']").prop("checked","checked");
                }else{
                    $html.find("li:first-child>input").prop("checked","checked");
                }
                $dom.append($html);
                CbRadio.prototype.bindEvent($dom,options);
            },
            //业务数据有误的提示 带确认
            "errorF": function (value1, value2, value3) {
            }
        };
        CommonAjax.ajax(data);
    } else {
        //没有请求
        options.tagIndex = tagIndex;
        var html = "";
        TemplateHelper.parseOptions("initRadioData", options.name, options, "");
        html = TemplateHelper.render(options.name, options);
        var $html = $(html);
        if(options.defaultKey){
            $html.find("li>input[value='"+options.defaultKey+"']").prop("checked","checked");
        }else{
            $html.find("li:first-child>input").prop("checked","checked");
        }
        $dom.append($html);
        CbRadio.prototype.bindEvent($dom,options);

    }
};
CbRadio.prototype.bindEvent = function($dom,options){
    if(options.callBackFun){
        var radioFun =  options.callBackFun;
        var fun = new Function(radioFun);
        $dom.on("click","input[type='radio']",fun);
    }
};