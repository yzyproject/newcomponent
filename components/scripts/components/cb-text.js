/*
 * cb-text 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 文本展示。
 */

var CbText = function () {
};

//注册cb-text组件
ParsingHelper.registerComponent("cb-text", CbText);

//保存容cb-text组件结构的列表
(function () {
    //cb-text组件结构列表
    var domDivList = {
        default: '    <div class="cb-text-div clearfix">' +
        '    </div>'
    };

    //根据cb-textDivName获得容器结构
    CbText.getDomDiv = function (domDivName) {
        if (domDivName && typeof domDivName === "string") { //此处校验可以写为公共方法
            var componentDiv = domDivList[domDivName];
            if (componentDiv) {
                return componentDiv;
            } else {
                err("未找到" + domDivName + "组件结构，使用了默认结构", 1);
                return domDivList["default"];
            }
        } else {
            return domDivList["default"];
        }
    }
})();

(function () {
    var options = {
        domDiv: "default"
    };
    CbText.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbText.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbText.getOptions(), $tag.data("options"));
    var $dom = $(CbText.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    if($tag.html()){
        $dom.append($tag.html());
    }
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    if(options.type === 'text'){
        $dom.append(options.labelText?'<span class="text-content">'+options.labelText+'</span>':'<span class="text-content"></span>');
        $dom.addClass('cb-text');
    } else {
        $dom.append(options.labelText?'<label class="text-content">'+options.labelText+'</label>':'<label class="text-content"></label>');
    }
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbText.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    //标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data('options');
    if(options.name){
        $dom.children('.text-content').attr("name",options.name);
    }
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css('height',options.height);
        $dom.css('line-height',options.height);
    }
    if(options.service){
        var serviceId = options.service;
        var params = {},
            data = {};
        params.service = serviceId;
        data.params = params;
        data.type =  options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function (returnData) {
            if(options.onVauled){
                var onSelectValue = new Function("returnData","options",options.onVauled);
                onSelectValue(returnData,options);
            }
            $dom.find('*[name="'+options.name+'"]').html(returnData[options.name]);
        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        };
        CommonAjax.ajax(data);
    }
};
