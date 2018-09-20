/**
 *cbmodal 2.0.0
 * author： dongjingfeng
 * Time: 2017.9.26
 * description: 模态框组件,通过封装layer完成
 */

 var CbModal = (function () {
     //cb-tpl-date组件结构列表
     var domDivList = {
       "default": '<div class="cb-modal-area">'+
                  '</div>'

     };
     //模态框的配置项
     var defaultOptins = {
       title:"示例",//标题
       skin:"layui-ext-blue",//样式类名
       offset:"auto",//初始化位置，默认为auto 水平居中    offset: '10px'	只定义top坐标，水平保持居中   offset: ['100px', '50px']	同时定义top、left坐标
       btn:undefined,//按钮  ['确定', '取消'] 第一个按钮的回调为yesFn  取消为 btn2Fn
       closeBtn:1, //关闭按钮  默认为1  不显示时为0
       shadeClose:false, //单击遮罩层关闭模态框
       area:'auto',//宽高，默认为auto，即自适应，自适应时maxWidth，maxHeight生效  area:500px 为500 告诉自适应 ， ['500px', '300px'] 宽高为 500
       maxWidth:'700px',//最大宽，只有area为auto时有效
       maxHeight:'600px',//最大高，只有area为auto时有效
       moveOut:false,//移动时是否可以移到外面
       successFn:undefined,//模态框加载成功后的回调
       yesFn:undefined,//模态框确认按钮的回调
       cancelFn:undefined,//模态框右上角关闭按钮的回调
       btn2Fn:undefined,//取消按钮的回调
       endFn:undefined,//层被销毁后的回调
       scrollbar:false,//默认 不允许出现浏览器滚动条
       move:true // 点击谁可以移动 传入class名   为false  禁止拖动
     };
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
         //将模态框中的内容放入解析后的标签中
         $dom.html($tag.html());
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
         $dom.css("display","none");
         //解析options
         parseOptions($dom,options);
         //解析时间插件事件
         parseOptionsEvent($dom,options);

     };
     // 解析普通的配置项
     var parseOptions = function($dom,options){
       options.move === true && (options.move = '.layui-layer-title');
       //兼容原先的模态框 宽高配置项
       (options.width && options.height) && (options.area = [options.width+"px",options.height+"px"]);
       (options.width && !options.height) && (options.area = options.width+"px");
     };
     // 解析配置项，加入事件
     var parseOptionsEvent = function($dom,options){
       //模态框成功加载后的回调, index为当前模态框的索引 layero为当前层dom对象
      options["success"] = function(index, layero){
        var options = $dom.data("options") || {};
        var successFn = getCallBackFn(options["successFn"]);
        successFn && successFn.call($dom,options);
      }
      //模态框确认按钮点击后的回调, index为当前模态框的索引 layero为当前层dom对象 return真值时关闭模态框
      options["yes"] = function(index, layero){
        var options = $dom.data("options") || {};
        var yesFn = getCallBackFn(options["yesFn"]);
        var closeFlag = true;
        yesFn && (closeFlag = yesFn.call($dom,options));
        closeFlag && layer.close(index);
      }
      options["btn2"] = function(index, layero){
        var options = $dom.data("options") || {};
        var btnFn = getCallBackFn(options["btn2Fn"]);
        btnFn && btnFn.call($dom,options);
      }
      //点击右上角关闭的回调, index为当前模态框的索引 layero为当前层dom对象
      options["cancel"] = function(index, layero){
        var options = $dom.data("options") || {};
        var cancelFn = getCallBackFn(options["cancelFn"]);
        cancelFn && cancelFn.call($dom,options);

      }
      //弹框被销毁后回调方法,
      options["end"] = function(){
        var options = $dom.data("options") || {};
        var endFn = getCallBackFn(options["endFn"]);
        endFn && endFn.call($dom,options);
      }


     };
     //
    var getCallBackFn = function(fnName){
      if(!fnName){
        return undefined;
      }
      var fn = fnName;
      if(typeof fn === "function"){
          return fn;
      }else{
          fn = FnList.getFn(fnName);
          if(fn){
            return fn;
          }else{
            return undefined;
          }
      }
    };
     //变更配置项
     var upadteOptions = function($dom,obj){
       var options = $dom.data("options");
       parseOptions($dom,obj);
       $.extend(options,obj||{});
       $dom.data("options",options);
     };
     //对外暴露，打开模态框
     var showModal = function($dom){
       var tagType = $dom.attr("tagtype"),
           options = $dom.data("options") || {},
           index = 0; //模态框索引，
       if(tagType === "cb-modal"){
         options.type = 1;
         options.content = $dom;
         index = layer.open(options);
         options._index = index;
       }
     };
     //对外暴露 关闭模态框
     var hideModal = function($dom){
       var tagType = $dom.attr("tagtype"),
           options = $dom.data("options") || {},
           index = 0; //模态框索引，
       if(tagType === "cb-modal"){
         index = options._index;
         index && layer.close(index);
         options._index = false;
       }
     }
     return {
         initTag: initTag,
         initHtml: initHtml,
         upadteOptions:upadteOptions,
         showModal:showModal,
         hideModal:hideModal
     };
 })();
 // 兼容历史版本变量名
 var Cbmodal = CbModal;
 //注册cb-modal组件
ParsingHelper.registerComponent("cb-modal", CbModal);
