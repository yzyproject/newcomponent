/*
 * cb-tap-switch 1.0.0
 * author： niulei
 * Time: 2017.10.7
 * description: 选项卡组件。
 */
 var CbTapSwitch = (function () {
     //cb-tap-switch组件结构列表
     var domDivList = {
       "default": '<div class="cb-tap-switch-div">'+
                    '<ul class="cb-tap-switch-list"></ul>'+
                  '</div>'

     };
     //多选框组件的模板
     var tplList = {
       "default": '{{each tapTextList as value i }}'+
                    '<li class="tydic-tap-switch-li  {{if value.defaultShow}} active {{/if}}" data-tocid="{{value.toCid}}">'+
                      '<div class="tydic-tap-switch-text" >{{value.text}}</div>'+
                      '<span class="tydic-tap-switch-span"></span>'+
                    '</li>'+
                  '{{/each}}'
     };
     //日期的配置项
     var defaultOptins = {
       tapTextList:[],//选项卡的中文名称与对应的容器cid配置 如[{"text":"选项一","toCid":"234","defaultShow":true},{"text":"选项二","toCid":"2345"}]
       renderSuccess:"",//渲染成功后的处理函数
       onCheck:"",//单击选项卡时的处理函数，return true 为切换， return false为不进行切换
       checkFn:"",//切换后变更后的处理函数
       tpl:"default"//默认的模板

     };
     //根据 cb-tap-switch获得容器结构
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
             renderSuccess = getCallBackFn(options["renderSuccess"]);
         $dom.removeAttr("data-options");
         $dom.data("options",options);
         //解析普通的配置项
         parseOptions($dom,options);
         //解析事件配置项
         parseOptionsEvent($dom);
         //将对应的cid抽出到数组中
         pushCidToArr(options);
         //加载选项卡
         loadTaps($dom,options);
         renderSuccess && renderSuccess($dom);


     };
     //将对应的cid抽出到数组中
     var pushCidToArr = function (options){
       var tapTextList = options.tapTextList || [],
           cidList = [];
       $.each(tapTextList,function(index,value){
         cidList.push(value["toCid"]);
       });
       options._cidList = cidList;
     }
     //加载选项卡
     var loadTaps = function($dom,options){
       var tpl = tplList[options["tpl"] || "default"];
       TplHelper.getTplByStr(tpl,function(render,str){
         var html = render(options);
         $dom.find(".cb-tap-switch-list").html(html);

       });
     }
     // 解析普通的配置项
     var parseOptions = function($dom,options){
       //读取options 来为多选框插入值
     };
     // 解析配置项，加入事件
     var parseOptionsEvent = function($dom){
       $dom.on("click",".tydic-tap-switch-li",function(event){
         var onCheckFn,
             checkFn,
             options = $dom.data("options"),
             $this = $(this),
             checkVal = "",
             toCid = $this.data("tocid"),
             cidList = options._cidList,
             $span = $this.find(".tydic-tap-switch-text");//找到对应的文本元素
         event.stopPropagation();
         if($this.hasClass("disabled")){
           return false;
         }
         onCheckFn = getCallBackFn(options["onCheck"]);
         checkFn = getCallBackFn(options["checkFn"]);

         if(onCheckFn){
           checkVal = onCheckFn.call(this,options,$this.hasClass("active"),toCid,$span.text());
           if(checkVal){
             //取消所欲标签的活动状态，并隐藏所有的对应选项卡
             $dom.find(".tydic-tap-switch-li").removeClass("active");
             $.each(cidList,function(index,value){
               $("div[cid='"+value+"']").addClass("hide");
             })
             $this.addClass("active");
             $("div[cid='"+toCid+"']").removeClass("hide");
             if(checkFn){
               checkFn.call(this,options,$this.hasClass("active"),toCid,$span.text());

             }

           }
         }else{
           if(!$this.hasClass("active")){
             //取消所欲标签的活动状态，并隐藏所有的对应选项卡
             $dom.find(".tydic-tap-switch-li").removeClass("active");
             $.each(cidList,function(index,value){
               $("div[cid='"+value+"']").addClass("hide");
             })
             $this.addClass("active");
             $("div[cid='"+toCid+"']").removeClass("hide");
             if(checkFn){
               checkFn.call(this,options,$this.hasClass("active"),toCid,$span.text());

             }

           }

         }


       })
     };
     //处理选项卡置项
     var paseOptions = function($dom,obj){
       var options = $dom.data("options") || {},
           cid = options["cid"];
       if(!cid){
         console.error("选项卡cid出错，停止数据加载");
         return false;
       }
       obj = $.extend(true,{},obj||{});
       $.extend(options,obj||{});
       options["cid"] = cid;
       $dom.data("options",options);
       return options;
     }

     //获得函数
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

     //对外暴露 取消所有多选框的选中状态。
     return {
         initTag: initTag,
         initHtml: initHtml
     };
 })();

 //注册Cb-tpl-date组件
 ParsingHelper.registerComponent("cb-tap-switch", CbTapSwitch);
