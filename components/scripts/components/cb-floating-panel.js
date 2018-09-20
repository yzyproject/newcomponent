/*
 * cb-floating-panel 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 浮动面板组件
 */

var CbFloatingPanel = function () {
};

//注册cb-floating-panel组件
ParsingHelper.registerComponent("cb-floating-panel", CbFloatingPanel);
var showBeforeProcessor,showAfterProcessor,hideBeforeProcessor,hideAfterProcessor;
//保存容cb-floating-panel组件结构的列表
(function () {
    //cb-floating-panel组件结构列表
    var domDivList = {
        default: '    <div class="cb-floating-panel-div clearfix">' +
        '    </div>'
    };

    //根据cb-floating-panelDivName获得容器结构
    CbFloatingPanel.getDomDiv = function (domDivName) {
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
    CbFloatingPanel.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbFloatingPanel.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbFloatingPanel.getOptions(), $tag.data("options"));
    var $dom = $(CbFloatingPanel.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $dom.append($tag.html());
    if(options.ctype === '1'){
        $dom.addClass('cb-floating-panel');
    }
    if(options.ctype === '2'){
        $dom.addClass('cb-floating-panel-blue');
    }
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbFloatingPanel.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options =$dom.data("options");
    if(options.showBeforeProcessor){
        showBeforeProcessor = new Function('$dom',options.showBeforeProcessor);
    }
    if(options.showAfterProcessor){
        showAfterProcessor = new Function('$dom',options.showAfterProcessor);
    }
    if(options.hideBeforeProcessor){
        hideBeforeProcessor = new Function('$dom',options.hideBeforeProcessor);
    }
    if(options.hideAfterProcessor){
        hideAfterProcessor = new Function('$dom',options.hideAfterProcessor);
    } else{
        hideAfterProcessor = function ($dom) {
            $dom.siblings('input[type=text]').val($dom.find('div[tagtype="cb-show-list"]').data('text'));
            $dom.parents('div[tagtype="cb-input"]').find('input[type=hidden]').val($dom.find('div[tagtype="cb-show-list"]').data('id'));
            $dom.siblings('input[type=text]').data("resulttip",'');
             CheckHelper.checkDom( $dom.siblings('input[type=text]'));
        }
    }
    $(document).on('click',function () {
        var options = $dom.data('options');
        if(options.hideBeforeProcessor){
            hideBeforeProcessor($dom);
        }
        if(options.animation === '1' || !options.animation){
            $dom.hide();
        } else if(options.animation === '2'){
            $dom.fadeOut();
        } else if(options.animation === '3'){
            $dom.slideUp();
        } else {
            console.log('options.animation 配置有误');
        }
        // CbFloatingPanel.prototype.hideFloatingPanel($dom);
    });
    //$dom.on('click',function (e) {
    //    e.stopPropagation();
    //});
    if(options.masterCid){
        $("[cid='"+options.masterCid+"']").on('click',function (e) {
            e.stopPropagation();
        });
    } else{
        $dom.prev().on('click',function (e) {
            e.stopPropagation();
        });
    }
};

CbFloatingPanel.prototype.showFloatingPanel = function ($dom) {
    var options = $dom.data('options');
    if(options.showBeforeProcessor){
        showBeforeProcessor($dom);
    }
    if(options.animation === '1' || !options.animation){
        $dom.show();
    } else if(options.animation === '2'){
        $dom.fadeIn();
    } else if(options.animation === '3'){
        $dom.slideDown();
    } else {
        console.log('options.animation 配置有误');
    }
    if(options.showAfterProcessor){
        showAfterProcessor($dom);
    }
};
CbFloatingPanel.prototype.hideFloatingPanel = function($dom) {
    var options = $dom.data('options');
    if(options.hideBeforeProcessor){
        hideBeforeProcessor($dom);
    }
    if(options.animation === '1' || !options.animation){
        $dom.hide();
    } else if(options.animation === '2'){
        $dom.fadeOut();
    } else if(options.animation === '3'){
        $dom.slideUp();
    } else {
        console.log('options.animation 配置有误');
    }
    hideAfterProcessor($dom);
};

