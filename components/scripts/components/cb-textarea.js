/*
 * cb-textarea 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 输入文本框组件。
 */

var CbTextarea = function () {
};

//注册cb-textarea组件
ParsingHelper.registerComponent("cb-textarea", CbTextarea);

//保存容cb-textarea组件结构的列表
(function () {
    //cb-textarea组件结构列表
    var domDivList = {
        default: '    <div class="cb-textarea-div clearfix">' +
        '      <textarea class="cb-textarea"  type="wing" hasBind="true"></textarea>' +
        '    </div>'
    };

    //根据 cb-textareaDivName获得容器结构
    CbTextarea.getDomDiv = function (domDivName) {
        if (domDivName && typeof domDivName === "string") { //此处校验可以写为公共方法
            var componentDiv = domDivList[domDivName];
            if (componentDiv) {
                return componentDiv;
            } else {
                err("未找到" + domDivName + "组件结构，使用了默认结构", 1);
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
    CbTextarea.getOptions = function () {
        return $.extend({}, options);
    }
})();
//弄得端解析入口
CbTextarea.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbTextarea.getOptions(), $tag.data("options"));
    var $dom = $(CbTextarea.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbTextarea.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    //标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options");
    CbTextarea.prototype.optionsData($dom, options);
};

CbTextarea.prototype.optionsData = function ($dom, options) {
    $dom.children('textarea').attr('placeholder',options.placeholder);
    $dom.children('textarea').attr("name", options.name);
    if(options.width){
        $dom.css('width',options.width);
    }
    if(options.height){
        $dom.find('textarea').css('height',options.height);
    }
    if(options.borderRadius){
        for(;options.borderRadius.length<5;){
            options.borderRadius.push(0);
        }
        $dom.find('textarea').css('borderTopLeftRadius',options.borderRadius[0]);
        $dom.find('textarea').css('borderTopRightRadius',options.borderRadius[1]);
        $dom.find('textarea').css('borderBottomRightRadius',options.borderRadius[2]);
        $dom.find('textarea').css('borderBottomLeftRadius',options.borderRadius[3]);
    }
    if (options.chartNum) {
        $dom.append('<div class="textarea-remark">还可以输入' + options.chartNum + '个字</div>');
        CbTextarea.prototype.validateChartNum($dom, options.chartNum);
    }
    if (options.isDisabled) {
        $dom.find('textarea').attr("disabled","disabled")
    }
    if (options.isReadOnly) {
    $dom.find('textarea').attr("readonly","readonly")
    }
    if(options.service){
        var serviceId = options.service;
        var params = {},
            data = {};
        params.service = serviceId;
        data.params = params;
        data.type =  options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function (returnData) {
            $dom.find("textarea").val(returnData[options.name]);
        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        };
        CommonAjax.ajax(data);
    }
};

CbTextarea.prototype.validateChartNum = function ($dom, chartNum) {
    $dom.children('textarea').on('keyup', function () {
        var charLength = $dom.children('textarea').val().length;
        var chartRemainderNum = chartNum - charLength;
        if (chartRemainderNum == 0 || chartRemainderNum > 0) {
            $dom.children('.textarea-remark').html('还可以输入' + chartRemainderNum + '个字');
        } else {
            var textareaValue = $dom.children('textarea').val().substr(0, charLength - 1);
            $(this).val(textareaValue);
        }
    })
};
