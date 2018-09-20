/*
 * cb-tpl-date 1.0.0
 * author： niulei
 * Time: 2017.9.7
 * description: 日期组件，采用jedate插件实现。
 */
 var CbTplDate = (function () {
     //cb-tpl-date组件结构列表
     var domDivList = {
       "default": '<div class="cb-tpl-date-div">'+
                    '<label class="cb-tpl-date-label"></label>'+
                    '<input class="cb-tpl-date-input" type="text" readonly>'+
                  '</div>'

     };
     //日期的配置项
     var defaultOptins = {
       label:"",   //日期组件文本框内容
       placeholder:"",
       skinCell:"jedatered",         //日期风格样式，默认红色
       format:"YYYY-MM-DD",  //日期格式
       minDate:"1900-01-01 00:00:00", //最小日期
       maxDate:"2099-12-31 23:59:59", //最大日期
       language:{                     //多语言设置
         name  : "cn",
         month : ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"],
         weeks : [ "日", "一", "二", "三", "四", "五", "六" ],
         times : ["小时","分钟","秒数"],
         clear : "清空",
         today : "今天",
         yes   : "确定",
         close : "关闭"
       },
       isdocScroll:true,                           //判断是否作用在document绑定Scroll滚动，弹层是否关闭
       fixedCell:"",                               //日历固定在页面中的ID(ID是唯一性的)，字符中不能包含 # 与 . 这样的，默认值为空
       trigger:"click",                            //是否为内部触发事件，默认为内部触发事件
       position:[],                                //自定义日期弹层的偏移位置，长度为0，弹层自动查找位置
       initDate:[],                               //设置默认时分秒 [{"hh":"10","mm":"00","ss":"00"},false]
       startMin:"",                                //清除日期后返回到预设的最小日期
       startMax:"",                                //清除日期后返回到预设的最大日期
       isvalid:[],                                 //有效日期与非有效日期 ["3,4,8,10",true]
       isinitVal:false,                            //是否初始化时间，默认不初始化时间
       initAddVal:{},                              //初始化时间，加减 天 时 分 initAddVal:{MM:"+3"}
       isTime:true,                                //是否开启时间选择
       hmsLimit:true,                              //时分秒限制
       ishmsVal:true,                              //是否限制时分秒输入框输入，默认可以直接输入时间
       isClear:true,                               //是否显示清空
       isToday:false,                              //是否显示今天或本月
       isok:false,                                 //是否显示确定按钮
       clearRestore:true,                          //清空输入框，返回预设日期，输入框非空的情况下有效
       festival:false,                             //是否显示农历节日
       fixed:true,                                 //是否静止定位，为true时定位在输入框，为false时居中定位
       zIndex:9999,                                //弹出层的层级高度
       marks:null,                                 //给日期做标注
       chooseFn:"",                               //选中日期后的回调options为当前配置项, elem当前输入框ID, val当前选择的值, date当前完整的日期值
       clearFn:"",                                //清除日期后的回调options为当前配置项, elem当前输入框ID, val当前选择的值
       okFn:"",                                   //点击确定后的回调options为当前配置项, elem当前输入框ID, val当前选择的值, date当前完整的日期值
       successFn:""                                  //层弹出后的成功回调方法options为当前配置项, elem当前输入框ID
     };
     //根据 cb-tpl-date获得容器结构
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
     }
     //node端解析入口
     var initTag = function ($tag) {
         //获得具体的配置项
         var options = $.extend(true,{},defaultOptins, $tag.data("options"));
         //获取Dom结构，且转化为Jquery对象
         var $dom = $(getDomDiv(options["ctype"]));
         //将处理好的Dom结构插在自定义标签后
         $tag.after($dom);
         //处理公共部位的宏命令
         Macro.macroCommand($tag, $dom, options);
         //删除自定义标签
         $tag.remove();
         //返回解析后的Dom
         return $dom;

     };
     //浏览器端解析标签的入口，$dom为最外层的dom结构
     var initHtml = function ($dom) {
         var tagIndex = $dom.data("tagindex"),
             options = $dom.data("options"),
             tableTpl = "";
         $dom.removeAttr("data-options");
         $dom.data("options",options);
         //解析options
         parseOptions($dom,options);
         //解析时间插件事件
         parseOptionsEvent($dom,options);
         //调用jedate插件
         $dom.find(".cb-tpl-date-input").jeDate(options);
     };
     // 解析普通的配置项
     var parseOptions = function($dom,options){
       //为当前时间组件的最大最小值设置副本
       options["minDate"] && (options["theMinDate"] = options["minDate"]);
       options["maxDate"] && (options["theMaxDate"] = options["maxDate"]);
       //输入框name值
       options["name"] && $dom.find(".cb-tpl-date-input").attr("name",options["name"]);
       //label的值
       options["label"] && $dom.find(".cb-tpl-date-label").html(options["label"]);
       //placeholder的值
       options["placeholder"] && $dom.find(".cb-tpl-date-input").attr("placeholder",options["placeholder"]);
     };
     // 解析配置项，加入事件
     var parseOptionsEvent = function($dom,options){
       //选中日期后的回调, elem当前输入框, val当前选择的值, date当前完整的日期值
      options["choosefun"] = function(elem,val,date){
        var options = $dom.data("options") || {};
        var choosefun =  FnList.getFn(options["chooseFn"]);
        choosefun && choosefun.call($dom,options,elem,val,date);
      }
      //清除日期后的回调, elem当前输入框, val当前选择的值
      options["clearfun"] = function(elem,val){
        var options = $dom.data("options") || {};
        var clearfun =  FnList.getFn(options["clearFn"]);
        clearfun && clearfun.call($dom,options,elem,val);
      }
      //点击确定后的回调, elem当前输入框, val当前选择的值, date当前完整的日期值
      options["okfun"] = function(elem,val,date){
        var options = $dom.data("options") || {};
        var okfun =  FnList.getFn(options["okFn"]);
        okfun && okfun.call($dom,options,elem,val,date);
      }
      //层弹出后的成功回调方法, elem当前输入框
      options["success"] = function(elem){
        var options = $dom.data("options") || {};
        var success =  FnList.getFn(options["successFn"]);
        success && success.call($dom,options,elem);
      }
     }
     //变更配置项
     var upadteOptions = function($dom,obj){
       var options = $dom.data("options");
       parseOptions($dom,obj);
       $.extend(options,obj||{});
       $dom.data("options",options);
     };
     return {
         initTag: initTag,
         initHtml: initHtml,
         upadteOptions:upadteOptions
     };
 })();

 //注册Cb-tpl-date组件
 ParsingHelper.registerComponent("cb-tpl-date", CbTplDate);
