/*
 * cb-floating-panel-composite 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbFloatingPanelComposite = (function () {
//保存容cb-floating-panel-composite组件结构的列表
    //cb-floating-panel-composite组件结构列表
    var domDivList = {
        default: '    <div class="cb-floating-panel-composite-div clearfix">' +
        '<input type="hidden">' +
        '    </div>'
    };
    var getOptions;
    (function () {
        var options = {
            domDiv: "default"
        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();

    //根据 cb-floating-panel-composite获得容器结构
    var getDomDiv = function (domDivName) {
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


//node端解析入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        $dom.append($tag.html());
        $tag.remove();
        return $dom;
    };
//浏览器端解析标签的入口，$dom为最外层的dom结构
    var initHtml = function ($dom) {
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        //标签解析时的所有data-options
        // console.log($dom.data("options"));
        //标签解析时的cid
        // console.log($dom.attr("cid"));
        //是由哪个标签解析而来
        var options = $dom.data("options");
        $dom.find('input[type=hidden]').attr('name',options.name);
    };
    
    return {
        initTag: initTag,
        initHtml: initHtml
    };
})();

//注册CbFloatingPanelComposite组件
ParsingHelper.registerComponent("cb-floating-panel-composite", CbFloatingPanelComposite);