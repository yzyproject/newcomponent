/*
 * cb-common-frame 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 公共模板
 */
var CbCommonFrame = (function () {
//保存容cb-common-frame组件结构的列表
    //cb-common-frame组件结构列表
    var domDivList = {
        default: '    <div class="cb-common-frame-div clearfix">' +
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

    //根据 cb-common-frame获得容器结构
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
        var html = '<cb-view  listen={"verticalFoldUp":"verticalFoldUpFunction"} class="cb-view-white main-nav-height clearfix"><cb-view class="cb-view-left clearfix">';
        html+='<cb-icon class="floatLeft" data-options=\'{"imageUrl":"../images/cb-file-upload/icon-close.png"}\'></cb-icon>'
        html+= '<cb-text class ="cb-text-logo-white" data-options=\'{"type":"text","labelText":"360运维平台"}\'></cb-text>';

        //html +='<cb-text class="cb-text-logo-remark" data-options=\'{"labelText":"OPAAS","type":"text"}\'></cb-text>';

        //html += '<cb-main-nav class="cb-main-nav-black" data-options='+JSON.stringify(options.mainNavOptions)+'></cb-main-nav></cb-view>';
        html += '<cb-main-nav class="cb-main-nav-black" ></cb-main-nav></cb-view>';
        html += '<cb-view class="cb-view-right clearfix">';

 /*       html +=  '<cb-input class="cb-input-search "  data-options=\'{"name":"input1"}\'> ' +
            '<cb-icon class="" data-options=\'{"ctype":"icon-search","imageUrl":"../images/cb-icon/icon-search.png"}\'></cb-icon>' +
            '</cb-input>';*/
        html += '<cb-text class="cb-text-color-black" bindcl="ShowFloatingPanel,event1" data-options= '+JSON.stringify(options.userOptions)+'>' +'</cb-text>';
        html += '<cb-floating-panel listen={"event1":"ShowFloatingPanel","event2":"HideFloatingPanel"} data-options=\'{"ctype":"1","masterId":"","animation":"3","showBeforeProcessor":"","showAfterProcessor":"","hidebeforeProcessor":"","hideAfterProcessor":"","showOperationMethod":""}\'>';
        html +='<cb-show-list data-options=\'{"service":"111","url":"text_data.json","name":"goodLevel","isRequest":"true","onValued":"","listName":"data","valueName":"code","textName":"title","localDataList":[{"key":"1","value":"普号"},{"key":"2","value":"靓号"},{"key":"03","value":"优质号码"},{"key":"04","value":"带“4”号"}]}\'></cb-show-list>';
        html += '</cb-floating-panel></cb-view></cb-view>';
        /*360*/
        html+= '<cb-view class="cb-view-360 main-nav-height clearfix">' ;
        html+= '<cb-view  class="floatLeft" data-options=\'{"width":"267px"}\'>';
        html+= '<cb-breadcrumbs listen={"breadcrumbsInfo":"breadcrumbsFunction"} data-options=\'{"isTransverse":true,"cid":"breadcrumbs"}\'></cb-breadcrumbs>';
        html+= '</cb-view>';
        html+= '<cb-view class="cb-view-left clearfix floatLeft">';


        html += '<cb-main-nav class="cb-main-nav-360" data-options='+JSON.stringify(options.mainNavOptions)+'></cb-main-nav></cb-view>';
        //html += '<cb-view class="cb-view-right clearfix">';

        //html += '<cb-text class="cb-text-color-white" data-options= '+JSON.stringify(options.userOptions)+'> ' +'</cb-text>';
        html += '</cb-view>';
        /*360*/
        html += '<cb-view class="cb-view-block">';
        html+= '<cb-view  class="cb-view-left-block left-nav-height floatLeft" listen={"crossFoldUp":"expandLeftNav"} data-options=\'{"width":"267px"}\'> ' +
            '<cb-left-nav  data-options='+JSON.stringify(options.leftNavList)+'></cb-left-nav> ' +
            '</cb-view>';

        html += '    <cb-view class="cb-view-mainWindow" listen={"crossFoldUp":"expandCrossSpreadFunction"} data-options=\'{"width":"100%","padding":["0","0","0","267px"]}\'>' ;
        html +='<cb-btn>sfasdvfbvqvcevcevcevevc</cb-btn>';
        html += '</cb-view></cb-view>';
        $dom.append(html);
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
        quitDom($dom);
    };

    // $(window).load(function(){
    //     $('.left-nav-height').css('height',$('body').height()-$('.main-nav-height').height()+'px');
    //     $('.left-nav-height').parents('div[tagtype="cb-common-frame"]').next().css('height',$('body').height()-$('.main-nav-height').height()-48+'px');
    // });

    var quitDom = function ($dom) {
        $dom.on('click','.btn-quit',function () {
            window.location.href="/logout"
        });
    };
    return {
        initTag: initTag,
        initHtml: initHtml
    };
})();

//注册CbCommonFrame组件
ParsingHelper.registerComponent("cb-common-frame", CbCommonFrame);
