/*
 * cb-icon 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 图标组件，。
 */

var CbIcon = function () {
};

//注册cb-icon组件
ParsingHelper.registerComponent("cb-icon", CbIcon);

//保存容cb-icon组件结构的列表
(function () {
    //cb-icon组件结构列表
    var domDivList = {
        default: '    <div class="cb-icon-div clearfix">' +
        '      <span><img class="cb-icon"></span>' +
        '    </div>'
    };

    //根据cb-iconDivName获得容器结构
    CbIcon.getDomDiv = function (domDivName) {
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
        domDiv: "default"
    };
    CbIcon.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbIcon.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbIcon.getOptions(), $tag.data("options"));
    var $dom = $(CbIcon.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    if($tag.html()){
        $dom.append($tag.html());
    }
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    if(options.ctype){
        $dom.addClass(options.ctype);
    }
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbIcon.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options");
    //CbIcon.prototype.optionsData($dom, options);
    $dom.find('img').attr('src',options.imageUrl);
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css('height',options.height);
    }
};

