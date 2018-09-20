/*
 * cb-download 1.0.0
 * author： niulei
 * Time: 2017.3.27
 * description: 文件下载。
 */

var CbDown = function () {
};

//注册CbDown组件
ParsingHelper.registerComponent("cb-download", CbDown);

//保存容cb-download组件结构的列表
(function () {
    //cb-download组件结构列表
    var domDivList = {
        default: '    <div class="cb-download-div">' +
            '<input type="button" class="down-load">'+
    '    </div>'
    };
    //根据 cb-downloadDivName获得容器结构
    CbDown.getDomDiv = function (domDivName) {
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
    CbDown.getOptions = function () {
        return $.extend({}, options);
    }
})();

//node端解析标签的入口
CbDown.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbDown.getOptions(), $tag.data("options"));
    //获取Dom结构，且转化为Jquery对象
    var $dom = $(CbDown.getDomDiv(options["domDiv"]));
    //将处理好的Dom结构插在自定义标签后
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    //删除自定义标签
    $tag.remove();
    //返回解析后的Dom
    return $dom;

};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbDown.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    // //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // //标签解析时的cid
    // console.log($dom.attr("cid"));
    // //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    CbDown.prototype.setAttr($dom);
};

CbDown.prototype.setAttr = function($dom){
    var options = $dom.data("options");
    if (options.downloadFile){
        $dom.find(".down-load").on("click",function(){
            location.href = options.downloadFile;
        });
    }
    if(options.value){
        $dom.find(".down-load").val(options.value);
    }
    
};

