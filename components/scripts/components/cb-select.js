/*
 * cb-select 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 下拉框。
 */

var CbSelect = function () {
};

//注册CbSelect组件
ParsingHelper.registerComponent("cb-select", CbSelect);

//保存容cb-select组件结构的列表
(function () {
    //cb-select组件结构列表
    var domDivList = {
        default: '    <div class="cb-select-div clearfix">' +
        '<select class="select-list"></select>' +
        '    </div>'
    };

    //根据 cb-select获得容器结构
    CbSelect.getDomDiv = function (domDivName) {
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
        cid: "cb-select"
    };
    CbSelect.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbSelect.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbSelect.getOptions(), $tag.data("options"));
    var $dom = $(CbSelect.getDomDiv(options["domDiv"]).replace("wing", options["type"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbSelect.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    //标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    var tagIndex = $dom.data("tagindex"),
        options = $dom.data("options"),
        cid = $dom.attr("cid");
    $dom.find('.select-list').attr("name",options.name);
    if(options.isDisabled){
        $dom.find('.select-list').attr('disabled',"disabled");
    }
    if(options.isDefault){
        $dom.find('.select-list').append('<option value="">请选择</option>');
    }
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css('height',options.height);
    }
    if(!options.param){
        options.param={};
    }
    /*if (options.isRequest !== true || options.isRequest !== 'true') {
        CbSelect.prototype.initData($dom, options,options.param,tagIndex);
    }*/
    if (options.isRequest !== true) {
        CbSelect.prototype.initData($dom, options,options.param,tagIndex);
    }
};

//获取回调函数
CbSelect.prototype.getCallBackFn = function(fnName){
    if(!fnName){
        return undefined;
    }
    var fn = fnName;
    if(typeof fn === "function"){
        return fn;
    }else{
        if(typeof Fnlist ==="object" ){
            fn = FnList.getFn(fnName);
            if(fn){
                return fn;
            }else{
                return undefined;
            }
        }else{
            fn = new Function("returnData",fn);
            return fn;
        }
    }
};

CbSelect.prototype.initData = function ($dom, options,param,tagIndex) {
    //ajax加载请求数据
    if (options.service || options.url) {
        var list = options.list;
        var serviceId = options.service;
        param["service"] = serviceId;
        var data = {
            "type":options.type ? options.type : 'POST',
            "url": options.url ? options.url : false,
            /*"params": {
                "service": serviceId
            },*/
            "params":param,
            "successF": function (returnData) {
                var dataList = {};
                dataList.tagIndex = tagIndex;
                dataList.option = returnData[list];
                dataList.name = options.name;
                dataList.value = options.value;
                dataList.text = options.text;
                if(options.isDisabled){
                    dataList.isDisabled = options.isDisabled;
                }
                var html = "";
                if (options.dataType === 'localData') {
                    TemplateHelper.parseOptions("initSelectData", options.name, options, "");
                    html = TemplateHelper.render(options.name, options);
                } else if (options.dataType === 'mergeData') {
                    if(options.mergeDataOrder === 'ajax'){
                        TemplateHelper.parseOptions("initSelectAjaxData", options.name, dataList, "");
                        html = TemplateHelper.render(options.name, dataList);
                        TemplateHelper.parseOptions("initSelectData", options.name, options, "");
                        html += TemplateHelper.render(options.name, options);
                        
                    } else{
                        TemplateHelper.parseOptions("initSelectData", options.name, options, "");
                        html = TemplateHelper.render(options.name, options);
                        TemplateHelper.parseOptions("initSelectAjaxData", options.name, dataList, "");
                        html += TemplateHelper.render(options.name, dataList);
                    }
                } else {
                    TemplateHelper.parseOptions("initSelectAjaxData", options.name, dataList, "");
                    html = TemplateHelper.render(options.name, dataList);
                }

        
                $dom.find('.select-list').append(html);
                if(options.isSelectValue){
                    $dom.find('select').children('option[value="'+options.isSelectValue+'"]').attr("selected","selected");
                }

                if(options.afterAjax){
                    var fn = CbSelect.prototype.getCallBackFn(options.afterAjax);
                    fn(returnData);
                }
             
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
        TemplateHelper.parseOptions("initSelectData", options.name, options, "");
        html = TemplateHelper.render(options.name, options);
        $dom.find('.select-list').append(html);
    }
};

/*CbSelect.prototype.initLinkageSelect = function($dom,param){
    var options = $dom.data("options");
    CbSelect.prototype.initData($dom,options,param);
}*/
