/*
 * cb-main-nav 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbMainNav = (function () {
//保存容cb-main-nav组件结构的列表
    //cb-main-nav组件结构列表
    var domDivList = {
        default: '    <div class="cb-main-nav-div clearfix">' +
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

    //根据 cb-main-nav获得容器结构
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
    };


//node端解析入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
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
        var tagIndex = $dom.data("tagindex"),
            options = $dom.data("options"),
            cid = $dom.attr("cid");
        ajaxData($dom);
    };

    var ajaxData = function ($dom) {
        var options= $dom.data('options');
        var serviceId = options.service;
        var params = {},
            data = {},
            attr = [];
        params.service = serviceId;

        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.params = params;
        data.successF = function (returnData) {
            var $mainNavList = '<ul class="main-nav-list clearfix">';
            for(var i=0;i<returnData[options.navListName].length;i++){
                if(options.idName){
                    if(returnData[options.navListName][i][options.idName] == options.defaultShowId){
                        $mainNavList += '<li class="main-nav-active" hrefLocal = "'+returnData[options.navListName][i][options.hrefName]+'" data-bindcl = "'+returnData[options.navListName][i][options.flagName]+'">'+ returnData[options.navListName][i][options.navTextName]+'</li>';
                    } else{
                        $mainNavList += '<li hrefLocal = "'+returnData[options.navListName][i][options.hrefName]+'" data-bindcl = "'+returnData[options.navListName][i][options.flagName]+'">'+ returnData[options.navListName][i][options.navTextName]+'</li>';
                    }

                } else{
                    $mainNavList += '<li hrefLocal = "'+returnData[options.navListName][i][options.hrefName]+'" data-bindcl = "'+returnData[options.navListName][i][options.flagName]+'">'+ returnData[options.navListName][i][options.navTextName]+'</li>';
                }

                attr.push(returnData[options.navListName][i][options.flagName]);
            }
            $mainNavList+="</ul>";
            $dom.append($mainNavList);
            options.attr = attr;
            bindEvent($dom);
        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        }
        CommonAjax.ajax(data);
    };

    var bindEvent = function ($dom) {
        var options = $dom.data('options');
        $dom.on('click',".main-nav-list>li",function () {
            if($(this).attr('hrefLocal') && $(this).attr('hrefLocal') != "undefined"){
                window.location.href= $(this).attr('hrefLocal');
            }
            $(this).addClass('main-nav-active');
            $(this).siblings('li').removeClass('main-nav-active');
            var infoValue = $(this).data('bindcl');
            for(var i=0;options.attr.length>i;i++){
                if(options.attr[i] === infoValue){
                    Event.trigger(options.attr[i],'true');
                }else{
                    Event.trigger(options.attr[i],'false');
                }
            }
        })
    };

    var mainValueShow = function ($dom,params) {
        $dom.find('.main-nav-list').children('li').each(function () {
            if($(this).data('bindcl') == params){
                $(this).addClass('main-nav-active');
                var mainValue = $(this).html();
                Event.trigger('mainValueShow',mainValue);
            }
        })
    };

    return {
        initTag: initTag,
        initHtml: initHtml,
        mainValueShow: mainValueShow
};
})();

//注册CbMainNav组件
ParsingHelper.registerComponent("cb-main-nav", CbMainNav);