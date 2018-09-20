/*
 * cb-input 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 输入框组件，。
 */

var CbInput = function () {

};

//注册cb-input组件
ParsingHelper.registerComponent("cb-input", CbInput);

//保存容cb-input组件结构的列表
(function () {
    //cb-input组件结构列表
    var domDivList = {
        default: '    <div class="cb-input-div clearfix">' +
        '      <input class="cb-input" hasBind="true">' +
        '    </div>'
    };
    //根据cb-inputDivName获得容器结构
    CbInput.getDomDiv = function (domDivName) {
        if (domDivName && typeof domDivName === "string") { //此处校验可以写为公共方法
            var componentDiv = domDivList[domDivName];
            if (componentDiv) {
                return componentDiv;
            } else {
                err("未找到" + domDivName + "组件结构，使用了默认结构",1);
                return domDivList["default"];
            }
        } else {
            return domDivList["default"];
        }
    }
})();

(function () {
    var options = {
        domDiv: "default",
        isRequest:true,
    };
    CbInput.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbInput.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbInput.getOptions(), $tag.data("options"));
    var $dom = $(CbInput.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    if(options.isHasHiddenInput){
        $dom.append('<input type="hidden">');
    }
    if($tag.html()){
        $dom.append($tag.html());
    }
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbInput.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options");
    CbInput.prototype.optionsData($dom, options);
    if(options.isRequest){
        CbInput.prototype.initInputValue($dom, options);
    }
};
CbInput.prototype.optionsData = function ($dom, options) {
    $dom.children('.cb-input').attr('placeholder',options.placeholder);
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.find('input').css('height',options.height);
    }
    if(options.borderRadius){
        for(;options.borderRadius.length<5;){
            options.borderRadius.push(0);
        }
        $dom.find('input').css('borderTopLeftRadius',options.borderRadius[0]);
        $dom.find('input').css('borderTopRightRadius',options.borderRadius[1]);
        $dom.find('input').css('borderBottomRightRadius',options.borderRadius[2]);
        $dom.find('input').css('borderBottomLeftRadius',options.borderRadius[3]);
    }
    if(options.isHasHiddenInput){
        $dom.children('input[type="hidden"]').attr('name',options.name);
    } else{
        $dom.children('.cb-input').attr('name',options.name);
    }
    if(!options.type){
        $dom.children('.cb-input').attr('type','text');
    } else{
        $dom.children('.cb-input').attr('type',options.type);
    }
    if(options.isReadonly){
        $dom.find('.cb-input').attr('readonly','readonly');
    }
};
var beforeAjAx,afterAjax;
CbInput.prototype.initInputValue = function ($dom, options) {
    if(options.service){
        var serviceId = options.service;
        var params = {},
            data = {};
        params.service = serviceId;
        data.params = params;
        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        if(options.beforeAjax){
            var beforeAjax = new Function('$dom','data',options.beforeAjax);
            data = beforeAjax($dom,data);
        }
        data.successF = function (returnData) {
            if(options.afterAjax){
                var afterAjax = new Function('$dom',"returnData",options.afterAjax);
                returnData = afterAjax($dom,returnData);
            }
            $dom.find("input[name="+options.name+"]").val(returnData[options.name]);
        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        };
        CommonAjax.ajax(data);
    }
};


