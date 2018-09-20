/*
 * cb-btn 1.0.0
 * author： niulei
 * Time: 2017.3.27
 * description: 按钮组件，用来发布事件或订阅事件。
 */

var CbBtn = function () {
};

//注册CbBtn组件
ParsingHelper.registerComponent("cb-btn", CbBtn);

//保存容cb-btn组件结构的列表
(function () {
    //cb-btn组件结构列表
    var domDivList = {
        default: '    <div class="cb-btn-div">' +
        '      <button class="cb-btn" hasBind="true"></button>' +
        '    </div>',
        //添加图标-djf
        buttonIcon:'    <div class="cb-btn-div">' +
        '      <button class="cb-btn" hasBind="true"><span class="btn-icon"></span></button>' +
        '    </div>'

    };
    //根据 cb-btnDivName获得容器结构
    CbBtn.getDomDiv = function (domDivName) {
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
        domDiv: "default",
        type:"button"

    };
    CbBtn.getOptions = function () {
        return $.extend({}, options);
    }
})();

//node端解析标签的入口
CbBtn.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbBtn.getOptions(), $tag.data("options"));
    //获取Dom结构，且转化为Jquery对象
    //djf
    if(options.ctype){
        options["domDiv"]=options.ctype;
    }
    var $dom = $(CbBtn.getDomDiv(options["domDiv"]));
    //处理自定义标签中的内容
    //$dom.find(".cb-btn").text($tag.text());
    //适配vop-djf
    $dom.find(".cb-btn").append($tag.text());
    //将处理好的Dom结构插在自定义标签后
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    //设置自身的属性
    CbBtn.prototype.setAttr($dom, options);
    //设置按钮样式-djf
    CbBtn.prototype.styleSet(options,$dom);
    //删除自定义标签
    $tag.remove();
    //返回解析后的Dom
    return $dom;

};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbBtn.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    // //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // //标签解析时的cid
    // console.log($dom.attr("cid"));
    // //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options=$dom.data("options");
    if(options.borderRadius){
        for(;options.borderRadius.length<5;){
            options.borderRadius.push(0);
        }
        $dom.find('button').css('borderTopLeftRadius',options.borderRadius[0]);
        $dom.find('button').css('borderTopRightRadius',options.borderRadius[1]);
        $dom.find('button').css('borderBottomRightRadius',options.borderRadius[2]);
        $dom.find('button').css('borderBottomLeftRadius',options.borderRadius[3]);
    }
    if(options.height){
        $dom.find('button').css('height',options.height);
        $dom.find('button').css('line-height',options.height);
    }
    if(options.width){
        $dom.find('button').css('width',options.width);
    }
    if(options.padding){
        for(;options.padding.length<5;){
            options.padding.push(0);
        }
        $dom.find('button').css('paddingTop',options.padding[0]);
        $dom.find('button').css('paddingRight',options.padding[1]);
        $dom.find('button').css('paddingBottom',options.padding[2]);
        $dom.find('button').css('paddingLeft',options.padding[3]);
    }
    CbBtn.prototype.hrefFunction($dom);
};
//按钮样式设置-适配vop-djf
CbBtn.prototype.styleSet = function(options,$dom){
    var ctype = options.ctype;
    if(options.btnColor){
        CbBtn.prototype.setColor($dom,options.btnColor);
    }
    if(ctype=="buttonIcon"){
        var iconStyle = options.iconStyle;
        CbBtn.prototype.setIcon($dom,iconStyle);
    }
};
CbBtn.prototype.setColor = function($dom,color){
    $dom.find("button").css({"background":color,"border":color});
};
CbBtn.prototype.setIcon = function($dom,iconStyle){
    $dom.find(".btn-icon").addClass("btn-icon-"+iconStyle);
};
CbBtn.prototype.setAttr = function($dom, options){
    //设置按钮属性
    options["type"]?$dom.find(".cb-btn").attr("type",options["type"]):err("无此属性",1);
    options["service"]?$dom.find(".cb-btn").attr("data-service",options["service"]):err("无此属性",1);
    //设置按钮是否失效
    options["disabled"]?$dom.find(".cb-btn").prop("disabled",options["type"]).addClass("disabled"):err("无此属性",1);
};
var beforeHref;
CbBtn.prototype.hrefFunction = function ($dom) {
    var options = $dom.data('options');
    if(options.href){
        $dom.on('click','.cb-btn',function () {
            if(options.beforeHref){
                beforeHref = new Function('$dom','options',options.beforeHref);
                beforeHref($dom,options);
            } else{

            }
        })
    }

}
