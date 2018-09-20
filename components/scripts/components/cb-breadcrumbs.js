/*
 * cb-bread-nav 1.0.0
 * author： dongjingfeng
 * Time: 2017.5.16
 * description: 面包屑导航
 */

var CbBreadcrumbs = (function(){
    var domDiv = {
        "default":'<div class="cb-breadcrumbs">' +
        '<ul class="cb-breadcrumbs-list"></ul>' +
        '</div>'
    };
    var getNavDiv = function(navName){
        if(navName && typeof navName === "string"){
            var navDiv = domDiv[navName];
            if(navDiv){
                return navDiv;
            }else{
                err("未找到" + navName + "组件结构，使用了默认结构", 1);
                return domDiv["default"];
            }
        }else{
            return domDiv["default"];
        }
    };
    var options = {
        domDiv: "default"
    };
    var getOptions = function(){
        return $.extend({},options);
    };
    var initTag = function($tag){
        var options = $.extend(getOptions(),$tag.data("options")),
            $dom = $(getNavDiv(options["domDiv"]));
        $tag.after($dom);
        if(options.isTransverse){
            $dom.find('.cb-breadcrumbs-list').before('<div class="cross-screen"></div>')
        }
        if(options.isVertical){
            $dom.find('.cb-breadcrumbs-list').before('<div class="vertical-screen"></div>')
        }
        Macro.macroCommand($tag,$dom,options);

        $tag.remove();
        return $dom;

    };
    var initHtml = function($dom){
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        //标签解析时的所有data-options
        // console.log($dom.data("options"));
        //标签解析时的cid
        // console.log($dom.attr("cid"));
        var cid = $dom.attr("cid");
        //是由哪个标签解析而来
        // console.log($dom.attr("tagtype"));
        var options = $dom.data("options");
        if(options.padding){
            for(;options.padding.length<5;){
                options.padding.push(0);
            }
            $dom.css('paddingTop',options.padding[0]);
            $dom.css('paddingRight',options.padding[1]);
            $dom.css('paddingBottom',options.padding[2]);
            $dom.css('paddingLeft',options.padding[3]);
        }
        bindEventTransverse($dom);
        bindEventVertical($dom);
    };

    var bindEventVertical = function ($dom) {
        var options = $dom.data('options');
        $dom.find('.vertical-screen').on('click', function () {
            if ($(this).hasClass('vertical-fold-up')) {
                Event.trigger('verticalFoldUp', true);
                $(this).removeClass('vertical-fold-up');
            } else {
                Event.trigger('verticalFoldUp', false);
                $(this).addClass('vertical-fold-up');
            }
        })
    };
    var bindEventTransverse = function ($dom) {
        var options = $dom.data('options');
        $dom.find('.cross-screen').on('click', function () {
            if ($(this).hasClass('cross-fold-up')) {
                Event.trigger('crossFoldUp', true);
                $(this).removeClass('cross-fold-up');
            } else {
                Event.trigger('crossFoldUp', false);
                $(this).addClass('cross-fold-up');
            }
        })
    };

    var breadcrumbsDom = function (strArray,$dom) {
        var $liDom = '';
        for(var i=0;i<strArray.length;i++){
            $liDom +='<li class="cb-breadcrumbs-arrow"></li><li>'+strArray[i]+'</li>'
        }
        $dom.find('.cb-breadcrumbs-list').append($liDom);
    };
    var mainBreadcrumbsDom = function (params,$dom) {
        $dom.find('.cb-breadcrumbs-list').prepend('<li class="cb-breadcrumbs-arrow"></li><li>'+params+'</li>');
    };
    return {
        initTag:initTag,
        initHtml:initHtml,
        breadcrumbsDom:breadcrumbsDom,
        mainBreadcrumbsDom:mainBreadcrumbsDom
    }
})();

ParsingHelper.registerComponent("cb-breadcrumbs",CbBreadcrumbs);