/*
 * cb-date-interval 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 输入框组件，。
 */

var CbDateInterval = function () {
};

//注册cb-date-interval组件
ParsingHelper.registerComponent("cb-date-interval", CbDateInterval);
var $master1,value1,$master2,value2;
var dateIntervalOnValued ;
//保存容cb-date-interval组件结构的列表
(function () {
    //cb-date-interval组件结构列表
    var domDivList = {
        default: '	<div class="cb-date-interval-div clearfix">    ' +
        '</div>'
    };

    //根据cb-date-intervalDivName获得容器结构
    CbDateInterval.getDomDiv = function (domDivName) {
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
    CbDateInterval.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbDateInterval.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbDateInterval.getOptions(), $tag.data("options"));
    var $dom = $(CbDateInterval.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    dateIntervalOnValued = new Function("$master1","value1","$master2","value2",options.onValued);
    if(!options.placeholder[0]) options.placeholder[0]='';
    if(!options.placeholder[1]) options.placeholder[1]='';
    if(! options.isReadonly)  options.isReadonly=true;
    if(!options.labelTypes[0]) options.labelTypes[0]='label';
    if(!options.labelTypes[1]) options.labelTypes[1]='text';
    if(!options.dateFormat) options.dateFormat='';
    if(!options.dateIntervals){
        options.dateIntervals =[['',''],['','']];
    }

    var inputOption1 = {"name":options.inputNames[0],"placeholder":options.placeholder[0],"isReadonly":options.isReadonly},
        inputOption2 = {"name":options.inputNames[1],"placeholder":options.placeholder[1],"isReadonly":options.isReadonly},
        labelOption2 = {"labelText":options.labelTexts[1],"type":options.labelTypes[1]},
        dateOption1 = {"ctype":options.ctype,"format":options.dateFormat,"minDate":options.dateIntervals[0][0],"maxDate":options.dateIntervals[0][1],"onValued":"$master1=$master;value1=value;dateIntervalOnValued($master1,value1,$master2,value2);"},
        dateOption2 = {"ctype":options.ctype,"format":options.dateFormat,"minDate":options.dateIntervals[1][0],"maxDate":options.dateIntervals[1][1],"onValued":"$master2=$master;value2=value;dateIntervalOnValued($master1,value1,$master2,value2);"},
        iconOption = {"imageUrl":options.imageUrl};
    var labelOption1='';
    if(options.labelTexts[0]){
        $dom.append('<cb-text data-options='+JSON.stringify(labelOption1)+'></cb-text>');
    }
    $dom.append(
        '<div class="date-input-group clearfix">' +
        '<cb-input data-options='+JSON.stringify(inputOption1)+'></cb-input>' +
        '<cb-icon data-options='+JSON.stringify(iconOption)+'></cb-icon>' +
        '</div>' +
        '<cb-date  data-options = '+JSON.stringify(dateOption1)+'></cb-date>' +
        '<cb-text data-options='+JSON.stringify(labelOption2)+'></cb-text>' +
        '<div class="date-input-group  clearfix">' +
        '<cb-input data-options='+JSON.stringify(inputOption2)+'></cb-input>' +
        '<cb-icon data-options='+JSON.stringify(iconOption)+'></cb-icon>' +
        '</div>' +
        '<cb-date  data-options = '+JSON.stringify(dateOption2)+'></cb-date>');
    ParsingHelper.getObject("cb-date");
    $tag.remove();
    return $dom;
};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbDateInterval.prototype.initHtml = function ($dom) {
    //标签解析的位置
    // console.log($dom.data("tagindex"));
    //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // 标签解析时的cid
    // console.log($dom.attr("cid"));
    //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));
    var  isMaster1= true,
        isMaster2 = true;
    if(isMaster1) {
        $dom.find('.date-input-group').eq(0).on('click', function () {
            isMaster1 = false;
            $dom.find('.date-input-group').eq(0).datetimepicker('setFirstValue','');
        });
    }
    if(isMaster2) {
        $dom.find('.date-input-group').eq(1).on('click', function () {
            isMaster2 = false;
            $dom.find('.date-input-group').eq(1).datetimepicker('setFirstValue','');
        });
    }
    CbDateInterval.prototype.dateInterval ($dom);
};

CbDateInterval.prototype.dateInterval = function ($dom) {
    $dom.find('.date-input-group').eq(0).on('changeDate',function(e){
        var startTime =  $(this).data("date");
        $dom.find('.date-input-group').eq(1).datetimepicker('setStartDate',startTime);
    });
    $dom.find('.date-input-group').eq(1).on('changeDate',function(e){
        var endTime = $(this).data("date");
        $dom.find('.date-input-group').eq(0).datetimepicker('setEndDate',endTime);
    });
};