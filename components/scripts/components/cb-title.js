/*
 * cb-title 1.0.0
 * author： dongjingfeng
 * Time: 2017.5.12
 * description: 标题组件
 */


var CbTitle = (function () {
    var domDivList = {
        default: '    <div class="cb-title-div">' +
        '      <p class="cb-title"></p>' +
        '    </div>'

    };

    //根据 cb-title DivName获得容器结构
    var getDomDiv = function (domDivName) {
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
    var options = {
        domDiv: "default",
        type:"title",
        /*为适应vop，加无边框标题。即borderPosition为false,同时设置为默认值-djf*/
        borderPosition:"none"

    };
    var getOptions = function () {
        return $.extend({}, options);
    }
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        //获取Dom结构，且转化为Jquery对象
        var $dom = $(getDomDiv(options["domDiv"]));
        //处理自定义标签中的内容
        options.title ? $dom.find(".cb-title").text(options.title) :$dom.find(".cb-title").text($tag.text());
        //将处理好的Dom结构插在自定义标签后
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        //删除自定义标签
        $tag.remove();
        //返回解析后的Dom
        return $dom;

    };
    var initHtml = function ($dom) {
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        // //标签解析时的所有data-options
        // console.log($dom.data("options"));
        // //标签解析时的cid
        // console.log($dom.attr("cid"));
        // //是由哪个标签解析而来
        // console.log($dom.attr("tagtype"));
        var options = $.extend(getOptions(), $dom.data("options"));
        initStyle($dom,options);


    };
    var initStyle = function($dom,options){
        options.width && $dom.css("width",options.width);
        switch(options.borderPosition){
            case "bottom" : $dom.addClass("title-bottom");break;
            case "left" : $dom.find(".cb-title").addClass("title-left");break;
            case "none":break;
        }
    }
    return{
        initTag:initTag,
        initHtml:initHtml
    }
})();

//注册CbBtn组件
ParsingHelper.registerComponent("cb-title", CbTitle);

