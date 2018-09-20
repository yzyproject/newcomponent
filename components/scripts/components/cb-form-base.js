/*
 * cb-form-base 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 表单基础组件。
 */

var CbFormBase = function () {
};

//注册CbFormBase组件
ParsingHelper.registerComponent("cb-form-base", CbFormBase);

//保存容cb-form-base组件结构的列表
(function () {
    //cb-form-base组件结构列表
    var domDivList = {
        default: '    <div class="cb-form-base-div clearfix">' +
        '   </div>'
    };

    //根据 cb-form-base获得容器结构
    CbFormBase.getDomDiv = function (domDivName) {
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
        domDiv: "default"
    };
    CbFormBase.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析的入口
CbFormBase.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbFormBase.getOptions(), $tag.data("options"));
    var $dom = $(CbFormBase.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    //item 为input
    if(options.labelPlace === 'top'){
        $dom.append('<cb-text class="cb-text-top" data-options='+JSON.stringify(options.labelOptions)+'></cb-text>');
    } else{
        $dom.append('<cb-text class="" data-options='+JSON.stringify(options.labelOptions)+'></cb-text>');
    }

    if (options.item === 'input') {
        $dom.append('<cb-input class="" data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-input>')
    }
    //item 为select
    if(options.item === 'select'){
        $dom.append('<cb-select class=""  data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-select>');
    }
    //item 为radio
    if (options.item === 'radio') {
        $dom.append('<cb-radio class=""  data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-radio>');
    }
    //item checkbox
    if(options.item === 'checkbox'){
        $dom.append('<cb-checkbox class=""  data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-select>');
    }
    //item 为textarea
    if (options.item === 'textarea') {
        $dom.append('<cb-textarea class="" data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-textarea>');
    }
    //item 为 text
    if (options.item === 'text') {
        $dom.append('<cb-text class="" data-options='+JSON.stringify(options.itemComponentOptions)+'></cb-text>');
    }

    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbFormBase.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    //标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options");
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.margin){

        for(;options.margin.length<5;){
            options.margin.push(0);
        }
        $dom.css('marginTop',options.margin[0]);
        $dom.css('marginRight',options.margin[1]);
        $dom.css('marginBottom',options.margin[2]);
        $dom.css('marginLeft',options.margin[3]);
    }
};
