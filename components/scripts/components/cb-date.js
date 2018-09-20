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
    //显示默认时间-dongjf
    if(options.defaultDate){
        CbDate.prototype.setDefaultDate($dom,options);
    }

};
//显示默认时间-dongjf

//比较是否处于限制日期范围内
CbDate.prototype.compareRange = function(date,targetDate,compareRule){
    var date = Number(date);
    var min = Number(targetDate);
    if(eval(date+compareRule+min)){
        return true;
    }else{
        return false;
    }
};
//日期转为字符串方便检查是否处于范围内
CbDate.prototype.dateChangeToString = function(date){
    var dateArray = date.split(" ");
    var dateArrayLast = [];
    for(var i=0;i<dateArray.length;i++){
        if(dateArray[i].indexOf("-")!=-1){
            dateArrayLast = dateArrayLast.concat(dateArray[i].split("-").join(""));
        }else{
            dateArrayLast = dateArrayLast.concat(dateArray[i].split(":").join("")).join("");
        }
    }
    return dateArrayLast;
};
//检查日期格式是否符合要求
CbDate.prototype.checkFormat = function(dateFormat,defaultDate){
    var checkRole;
    //校验格式
    switch(dateFormat){
        case "yyyy" : checkRole="/^[0-9]{4}-[0-1]?[0-9]{1}$/";break;
        case "yyyy-mm" : checkRole="/^[0-9]{4}-[0-1]?[0-9]{1}$/";break;
        case "yyyy-mm-dd" : checkRole="/^[0-9]{4}-[0-1]?[0-9]{1}-[0-3]?[0-9]{1}$/";break;
        case "yyyy-mm-dd hh" : checkRole="^[1-2][0-9][0-9][0-9]-([1][0-2]|0?[1-9])-([12][0-9]|3[01]|0?[1-9]) ([01][0-9]|[2][0-3])$";break;
        case "yyyy-mm-dd hh:ii" : checkRole="^[1-2][0-9][0-9][0-9]-([1][0-2]|0?[1-9])-([12][0-9]|3[01]|0?[1-9]) ([01][0-9]|[2][0-3]):[0-5][0-9]$";break;
    }
    var regExp = new RegExp(checkRole);
    var checkResult = regExp.test(defaultDate);
    return checkResult;
};
//设置默认日期
CbDate.prototype.setDefaultDate = function($dom,options){
    var defaultDate = options.defaultDate;
    var dateFormat = options.format;
    var minDate = options.minDate;
    var maxDate = options.maxDate;
    //校验格式
    var checkState = CbDate.prototype.checkFormat(dateFormat,defaultDate);
    if(!checkState){
        console.error("默认日期格式不符");
        return;
    }
    //校验大小
    var minDateStr = CbDate.prototype.dateChangeToString(minDate);
    var maxDateStr = CbDate.prototype.dateChangeToString(maxDate);
    var dateStr = CbDate.prototype.dateChangeToString(defaultDate);
    //和最小日期比较
    var checkRangeResult = CbDate.prototype.compareRange(dateStr,minDateStr,">=");
    if(!checkRangeResult){
        console.error("默认日期值小于日期限定最小值");
        return;
    }
    //和最大日期比较
    checkRangeResult = CbDate.prototype.compareRange(dateStr,maxDateStr,"<=");
    if(!checkRangeResult){
        console.error("默认日期值大于日期限定最小值");
        return;
    }
    //赋值
    var $showBack;
    if(options.masterId){
        $showBack = $('body').find("[cid='"+ options.masterId +"']");
    }else{
        $showBack = $dom.prev();
    }
    if($showBack.is('input')){
        $showBack.val(defaultDate);
    }else if($showBack.has('input').length >0 ){
        $showBack.find('input').val(defaultDate);
    } else{
        $showBack.text(defaultDate);
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
        startDate: "1900-01-01 00:00:00",
        endDate: "2099-06-30 23:59:59"
    };
    return $.extend({}, dateOptions);
};

//初始化日期插件
CbDate.prototype.optionsData = function ($dom, options, tagIndex) {
    if (options.format === 'yyyy-mm-dd' || options.format === 'day'|| !options.format) {
        options.startView = 2;
        options.minView = 2;
        options.format = 'yyyy-mm-dd';
    }
    if (options.format === 'yyyy' || options.format === 'year') {
        options.format = 'yyyy';
        options.startView = 4;
        options.minView = 4;
    }
    if (options.format === 'yyyy-mm'|| options.format === 'mouth') {
        options.format = 'yyyy-mm';
        options.startView = 3;
        options.minView = 3;
    }
    if (options.format === 'yyyy-mm-dd hh'|| options.format === 'hour') {
        options.format='yyyy-mm-dd hh';
        options.startView = 2;
        options.minView = 1;
    }
    if (options.format === 'yyyy-mm-dd hh:ii'|| options.format === 'minute') {
        options.format='yyyy-mm-dd hh:ii';
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

    //设置日期可选区间 lqw
    if(options.duringDate){
        duringDate = new Function('$dom','options',options.duringDate);
        duringDate($dom,options);
    }
    var dateOptions = $.extend(CbDate.prototype.dateDefaultInit(), options);
    if(dateOptions.minDate){
        dateOptions.startDate = dateOptions.minDate;
    }
    if(dateOptions.maxDate){
        dateOptions.endDate = dateOptions.maxDate;
    }

    if (!options.masterId) {
        $dom.prev().datetimepicker(dateOptions);
    } else {
        $('body').find("[cid='"+ options.masterId +"']").datetimepicker(dateOptions);
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
        $('body').find("[cid='"+ options.masterId +"']").jeDate(dateOptions);
    }
};


