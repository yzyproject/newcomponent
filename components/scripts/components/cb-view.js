/*
 * cbview 1.0.0
 * author： niulei
 * Time: 2017.3.22
 * description:  容器组件，可提供网格化的功能
 */

var CbView = function () {
};

//注册cbview组件
ParsingHelper.registerComponent("cb-view", CbView);

//保存容器结构的列表
(function ($) {
    //容器结构列表
    var domDivList = {
        default: '    <div class="cb-view-div clearfix">' +

        '    </div>'

    };

    //根据 cbviewDivName获得容器结构
    CbView.getdomDiv = function (domDivName) {
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

})(jQuery);
(function () {
    var options = {
        domDiv: "default",
        overflow:"auto"

    };
    CbView.getOptions = function () {
        return $.extend({}, options);
    }
})()
//node端解析入口
CbView.prototype.initTag = function ($tag) {
    var options = $.extend(CbView.getOptions(), $tag.data("options"));
    var $dom = $(CbView.getdomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理列合并的函数
    CbView.prototype.colspan($tag, $dom, options);

    //设置自身的属性
    CbView.prototype.setAttr($dom, options);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    //移除自定义标签
    $tag.remove();
    return $dom;

}
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbView.prototype.initHtml = function ($dom) {
    // //标签解析的位置
    // console.log($dom.data("tagindex"));
    // //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // //标签解析时的cid
    // console.log($dom.attr("cid"));
    // //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options =$dom.data("options");
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.css({'height':options.height,"overflow":options.overflow});
    }
    if(options.padding){
       for(;options.padding.length<5;){
           options.padding.push(0);
       }
        $dom.css('paddingTop',options.padding[0]);
        $dom.css('paddingRight',options.padding[1]);
        $dom.css('paddingBottom',options.padding[2]);
        $dom.css('paddingLeft',options.padding[3]);
    }
    if(options.isDefaultAjax){
        CbView.prototype.initViewData($dom,options);
    }
};
CbView.prototype.colspan = function ($cbview, $cbviewDiv, options) {
    var column = options["column"]?1 / options["column"] * 100:100;
    var children = $cbview.children();
    children.each(function () {
        var tagName = $(this)[0].tagName;
        var colspan = $(this).attr("colspan");
        if (!colspan) {
            colspan = 1;
        }
        if(options.column){
            $(this).appendTo($cbviewDiv).wrap("<div class='content-item' style='width:" + column * colspan + "%'></div>");
        } else{
            $(this).appendTo($cbviewDiv);
        }
    })
}
CbView.prototype.setAttr = function($dom, options){
    var $item=$dom.find(".content-item");
    //设置按钮属性
    options["height"]?$item.css("height",options["height"]):err("无此属性",1);

};

CbView.prototype.initViewData = function ($dom,options) {
    if(options.service){
        var serviceId = options.service;
        var params = {},
            data = {};
        params.service = serviceId;
        data.params = params;
        data.url = options.url ? options.url : false;
        data.type =  options.type ? options.type : 'POST';
        if(options.ajaxDataFunction){
            var ajaxBeforeData = new Function("data","options",options.ajaxDataFunction);
           data = ajaxBeforeData(data,options);
        }
        data.successF = function (returnData) {
            if(options.onVauled){
                var onSelectValue = new Function("returnData","options",options.onVauled);
                returnData = onSelectValue(returnData,options);
            }
            $.each(returnData,function (key,item) {
                $dom.find('select[name="'+key+'"]').children('option[value="'+returnData[key]+'"]').attr("selected","selected");

                $dom.find('textarea[name="'+key+'"]').val(returnData[key]);
                $dom.find('input[name="'+key+'"]').val(returnData[key]);
                $dom.find('span[name="'+key+'"]').html(returnData[key]);
            })
        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        };
        CommonAjax.ajax(data);
    }
};
