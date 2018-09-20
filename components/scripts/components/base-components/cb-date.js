/*
 * cb-date 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 输入框组件，。
 */

var CbDate = function () {
};

//注册cb-date组件
ParsingHelper.registerComponent("cb-date", CbDate);

//保存容cb-date组件结构的列表
(function () {
    //cb-date组件结构列表
    var domDivList = {
        default: '	<div class="cb-date-div clearfix"> ' +
        '</div>'
    };

    //根据cb-dateDivName获得容器结构
    CbDate.getDomDiv = function (domDivName) {
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
        domDiv: "default",
        type: "text"
    };
    CbDate.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbDate.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbDate.getOptions(), $tag.data("options"));
    var $dom = $(CbDate.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbDate.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var options = $dom.data("options"),
        tagIndex = $dom.data("tagindex");
    if (options.ctype === '1') {
        CbDate.prototype.optionsData($dom, options, tagIndex);
    }
    if (options.ctype === '2') {
        CbDate.prototype.optionsData2($dom, options, tagIndex);
    }

};

//设置日期插件的默认配置项
CbDate.prototype.dateDefaultInit = function () {
    var dateOptions = {
        format: "yyyy-mm-dd",
        language: 'zh-CN',
        weekStart: 0,
        todayBtn: false,
        autoclose: true,
        todayHighlight: true,
        minDate: "1900-01-01 00:00:00",
        maxDate: "2099-06-30 23:59:59"
    };
    return $.extend({}, dateOptions);
};

//初始化日期插件
CbDate.prototype.optionsData = function ($dom, options, tagIndex) {
    if (options.format === 'yyyy-mm-dd' || !options.format) {
        options.startView = 2;
        options.minView = 2;
    }
    if (options.format === 'yyyy') {
        options.startView = 4;
        options.minView = 4;
    }
    if (options.format === 'yyyy-mm') {
        options.startView = 3;
        options.minView = 3;
    }
    if (options.format === 'yyyy-mm-dd hh') {
        options.startView = 2;
        options.minView = 1;
    }
    if (options.format === 'yyyy-mm-dd hh:ii') {
        options.startView = 2;
        options.minView = 0;
    }
    if (options.onValued) {
        var onValued = options.onValued;
        var onSelectValue = new Function("$master", "value", onValued);
        options.onSelect = onSelectValue;
    }
    if (options.weekAlias && options.weekAlias != '') {
        $.extend($.fn.datetimepicker.dates['zh-CN'].daysMin, options.weekAlias);
    }
    var dateOptions = $.extend(CbDate.prototype.dateDefaultInit(), options);
    dateOptions.startDate = dateOptions.minDate;
    dateOptions.endDate = dateOptions.maxDate;
    if (!options.masterId) {
        $dom.prev().datetimepicker(dateOptions);
    } else {
        $('body').find('#' + options.masterId).datetimepicker(dateOptions);
    }
};

CbDate.prototype.optionsData2 = function ($dom, options, tagIndex) {
    var dateOptions = $.extend(CbDate.prototype.dateDefaultInit(), options);
    var format = dateOptions.format.toUpperCase();
    dateOptions.format = format;
    if (format == 'YYYY-MM-DD' || format == 'YYYY-MM' || format == 'YYYY') {
        dateOptions.isTime = false;
    } else {
        dateOptions.isTime = true;
    }
    if (options.onVauled.indexOf('function')) {
        var onVauled = options.onVauled;
        var onSelectValue = new Function("$master", "value", onVauled);
        options.onSelect = onSelectValue;
    } else {
        dateOptions.choosefun = options.onVauled;
    }
    if (options.weekAlias && options.weekAlias != '') {
        dateOptions.weeks = options.weekAlias;
    }
    if (!options.masterId) {
        $dom.prev().jeDate(dateOptions);
    } else {
        $('body').find('#' + options.masterId).jeDate(dateOptions);
    }
};


