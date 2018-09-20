
/*
 * cb-background-image 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 图标组件，。
 */

var CbBackgroundImage = function () {
};

//注册cb-background-image组件
ParsingHelper.registerComponent("cb-background-image", CbBackgroundImage);

//保存容cb-background-image组件结构的列表
(function () {
    //cb-background-image组件结构列表
    var domDivList = {
        default: '    <div class="cb-background-image-div clearfix">' +
        '    </div>'
    };

    //根据cb-background-imageDivName获得容器结构
    CbBackgroundImage.getDomDiv = function (domDivName) {
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
    CbBackgroundImage.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbBackgroundImage.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbBackgroundImage.getOptions(), $tag.data("options"));
    var $dom = $(CbBackgroundImage.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    if($tag.html()){
        $dom.append($tag.html());
    }
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbBackgroundImage.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options");
    //CbBackgroundImage.prototype.optionsData($dom, options);
    $dom.css('backgroundImage','url("'+options.imageUrl+'")');
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css('height',options.height);
    }
    if(options.parentWidth){
        $dom.parent().css('width',options.parentWidth);
    }
    if(options.parentHeight){
        $dom.parent().css('height',options.parentHeight);
    }
    if(options.isRepeatX){
        $dom.css('backgroundRepeat',"repeat-x");
    } else if (options.isRepeatY) {
        $dom.css('backgroundRepeat',"repeat-y");
    } else{
        $dom.css('backgroundRepeat',"no-repeat");
    }

    if(options.service){
        CbBackgroundImage.prototype.imageSrc($dom);
    }
    CbBackgroundImage.prototype.againImageSrc($dom);
};
CbBackgroundImage.prototype.imageSrc = function ($dom) {
    var options = $dom.data("options");
    var imageUrl = options.imageUrlName;
    var data={},
        params = {};
        params.service = options.service;
        data.params =params;
        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function (returnData) {
            $dom.removeClass("again-request");
            $dom.html("");
            $dom.css('backgroundImage','url("'+returnData[imageUrl]+'")');
        };
        data.errorF = function (returnData) {
            $dom.addClass("again-request");
            $dom.html("刷新验证码");
        };
        CommonAjax.ajax(data);
};
CbBackgroundImage.prototype.againImageSrc = function ($dom) {
    if($dom.hasClass('again-request')){
        $dom.on("click",function () {
            CbBackgroundImage.prototype.imageSrc($dom);
        })
    } else{
        return false;
    }
};