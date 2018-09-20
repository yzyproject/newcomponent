/*
 * cb-tpl-checkbox 1.0.0
 * author： niulei
 * Time: 2017.9.23
 * description: 多选框组件。
 */
 var CbTplCheckBox = (function () {
     //cb-tpl-checkbox组件结构列表
     var domDivList = {
       "default": '<div class="cb-tpl-checkbox-div">'+
                    '<ul class="cb-tpl-checkbox-list"></ul>'+
                  '</div>'

     };
     //多选框组件的模板
     var tplList = {
       "default": '{{each list as value i }}'+
                    '<li>'+
                      '<input class="tydic-checkbox" type="checkbox" name="{{options.name}}" value="{{value.value}}" id="{{options.cid+options._totalIndex+i}}" {{if value.disabled}} disabled="disabled" {{/if}} {{if value.isChecked}} checked="checked" {{/if}}>'+
                      '<label class="tydic-checkbox-label {{if value.disabled}} disabled {{/if}} {{if value.isChecked}} active {{/if}}" for="{{options.cid+options._totalIndex+i}}" ></label>'+
                      '<span class="tydic-checkbox-span">{{value.text}}</span>'+
                    '</li>'+
                  '{{/each}}'
     };
     //日期的配置项
     var defaultOptins = {
       mergeData:"ajax", //判断保留数据的方式，ajax：以ajax的数据为准；option：以页面配置的option数据为准；merge：将两个数据合并
       tpl:"default",//采用默认的模板
       params:"", //请求后台时携带的参数
       name:"",//序列化val时的name属性
       textName:"",//序列化多选框文本内容时的name属性
       isRequest:false,//是否在组件初始化时加载数据
       icon:"",//默认的图标位置
       list:"list",//后台返回数据的数组名
       value:"value",//多选框中value值的键名
       text:"text",//多选框中 文本内容的键名
       option:"",//页面配置的数据项
       method:"post",//ajax加载数据时的请求方式
       url:"",//ajax加载数据时的请求地址
       _totalIndex:0,//内部计数器，不可修改与引用
       dataType:"json",//ajax数据请求时返回的数据类型
       beforeLoad:"",//ajax请求之前的数据处理
       loadSuccess:"",//ajax请求成功后的数据处理
       loadError:"",//ajax请求error后的数据处理
       loadFail:"",//ajax请求时，返回错误码的数据处理
       renderSuccess:"",//渲染成功后的处理函数
       onCheck:"",//单击多选框时的处理函数，return true 为选中， return false为未选中
       checkFn:""//选中状态变更后的处理函数

     };
     //根据 cb-tpl-checkbox获得容器结构
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
         //解析普通的配置项
         parseOptions($dom,options);
         //解析事件配置项
         parseOptionsEvent($dom);
         if(options.option){
           options._firstOption = true;
           loadData($dom,{list:options.option})
         }
         options.isRequest && loadCheckBox($dom,{params:options["params"]});

     };
     // 解析普通的配置项
     var parseOptions = function($dom,options){
       //读取options 来为多选框插入值
     };
     // 解析配置项，加入事件
     var parseOptionsEvent = function($dom){
       $dom.on("click",".tydic-checkbox-label",function(event){
         var onCheckFn,
             checkFn,
             options = $dom.data("options"),
             $this = $(this),
             checkVal = "",
             $input = $this.siblings(".tydic-checkbox"), //找到对应的多选框
             $span = $this.siblings(".tydic-checkbox-span");//找到对应的文本元素
         event.stopPropagation();
         if($this.hasClass("disabled")){
           return false;
         }
         onCheckFn = getCallBackFn(options["onCheck"]);
         checkFn = getCallBackFn(options["checkFn"]);
         if(onCheckFn){
           checkVal = onCheckFn.call(this,options,$input.prop("checked"),$input.val(),$span.text());
           if(checkVal){
             $this.addClass("active");
             $input.prop("checked",true);
           }else{
             $this.removeClass("active");
             $input.prop("checked",false);
           }
           if(checkFn){
             checkFn.call(this,options,$input.prop("checked"),$input.val(),$span.text());
           }
           return false; //禁止默认事件发生
         }else{
           $this.toggleClass("active");
           if(checkFn){
             checkFn.call(this,options,$this.hasClass("active"),$input.val(),$span.text());

           }
         }

       })
     };
     //处理多选框配置项
     //处理表格配置
     var paseOptions = function($dom,obj){
       var options = $dom.data("options") || {},
           cid = options["cid"];
       if(!cid){
         console.error("多选框cid出错，停止数据加载");
         return false;
       }
       obj = $.extend(true,{},obj||{});
       $.extend(options,obj||{});
       options["cid"] = cid;
       options["data"] = undefined;
       options["params"] = $.extend(true,{},obj["params"] || {});
       $dom.data("options",options);
       return options;
     }
     //加载多选框
     var loadCheckBox = function($dom,obj){
       //处理表格配置
       var options = paseOptions($dom, obj);
       var renderSuccess = getCallBackFn(options["renderSuccess"]);
       if(obj["data"]){
         Loading.loading($dom);
         loadData($dom,obj["data"]);
         renderSuccess && renderSuccess($dom);
         Loading.removeAll();
       }else{
         Loading.loading($dom);
         ajaxData(options,function(returnData){
           loadData($dom,returnData);
           renderSuccess && renderSuccess($dom);
       },function(returnData){});

       }
     }
     //为多选框追加数据
     var appendCheckBox = function($dom,obj){
       //处理表格配置
       var options = paseOptions($dom, obj);
       var renderSuccess = getCallBackFn(options["renderSuccess"]);
       if(obj["data"]){
         Loading.loading($dom);
         loadData($dom,obj["data"],"append");
         renderSuccess && renderSuccess($dom);
         Loading.removeAll();
       }else{
         Loading.loading($dom);
         ajaxData(options,function(returnData){
           loadData($dom,returnData,"append");
           renderSuccess && renderSuccess($dom);
       },function(returnData){});

       }
     }
     //根据配置项 合并数据
     var mergeData = function(options,returnData){
       var mergeData = options["mergeData"];
       var list = [];
       var _firstOption = options._firstOption; //当_firstoption为true时,即组件第一次初始化，且包含option配置项
       if(_firstOption){
         options._firstOption = false;
         return returnData.list;
       }
       switch (mergeData) {
         case "ajax":
           list = returnData[options["list"] || "list"] || [];
           break;
        case "option":
           list = options["option"] || [];
           break;
        case "merge":
           list = (returnData[options["list"] || "list"] || []).concat(options["option"] || []);
           break;
        default:
         list = returnData[options["list"] || "list"] || [];
         break;
       }
       return list;
     };
     //渲染多选框
     var loadData = function($dom,returnData,isAppend){
       var options = $dom.data("options") || {},
           tpl = tplList[options["tpl"] || "default"];
       //累加技术器
       options._totalIndex += 1;
       //将配置项放入data中
       returnData.options = options;
       //切换数据数组名
       returnData.list = mergeData(options,returnData);
       //切换数组名中的key，value值
       $.each(returnData.list,function(index,value){
         value["value"] = value[options["value"] || "value"];
         value["text"] =  value[options["text"] || "text"];
       });
       TplHelper.getTplByStr(tpl,function(render,str){
         var html = render(returnData);
         if(isAppend === "append"){
           $dom.find(".cb-tpl-checkbox-list").append(html);
         }else{
           $dom.find(".cb-tpl-checkbox-list").html(html);
         }
       });
     }
     //向后台请求数据
     var ajaxData = function(options,successF,failF){
       var cid = options["cid"];
       var data = {};
       var params = {};
       params = options["params"] || {};
       params.service = options.service ;
       data["params"] = params;
       data.url = options.url || false;
       data.type = options.method || "post";
       data.datatype = options.dataType;
       data.successF = function (returnData) {
         var fn = getCallBackFn(options["loadSuccess"]);
         if(fn){
           //若有加载成功函数，执行此函数
           returnData = fn(options,returnData);
         };
         if(!returnData){
           return false;
         }
         successF(returnData);
       };
       data.failF = function (returnData) {
         var fn = getCallBackFn(options["loadFail"]);
         if(fn){
           //若有加载失败函数，执行此函数
           returnData = fn(options,returnData);
         };
         if(!returnData){
           return false;
         };
         layer.alert(returnData.respDesc || "系统繁忙",{
             icon:'error',
             skin: 'layui-blue'
         });
         failF(returnData);
       }
       data.errorF = function (XMLHttpRequest, textStatus, errorThrown) {
         var fn = getCallBackFn(options["loadError"]);
         if(fn){
           //若有加载失败函数，执行此函数
           fn(options,XMLHttpRequest, textStatus, errorThrown);
         }else{
           layer.alert("网络异常", {
               icon:'error',
               skin: 'layui-blue'
               }
           );
         }
       };
       // 执行beforeAjax的函数，来改变一些参数
       var fn = getCallBackFn(options["beforeLoad"]);
       if(fn){
         //若有加载失败函数，执行此函数
         data = fn(options,data);
       };
       if(!data){
         return false;
       }
       //执行ajax函数
       CommonAjax.ajax(data);
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
     //变更配置项
     var upadteOptions = function($dom,obj){
       var options = $dom.data("options");
       parseOptions($dom,obj);
       $.extend(options,obj||{});
       $dom.data("options",options);
     };
     //对外暴露，获得多选框请求的参数
     var getParams = function($dom){
       var options = $dom.data("options");
       var params = options["params"] || {};
       return params;
     };
     //对外暴露 全选多选框所有项
     var checkAll = function($dom){
       $dom.find(".tydic-checkbox-label").each(function(index,value){
         if(!$(this).hasClass("disabled")){
           $(this).addClass("active");
           $(this).siblings(".tydic-checkbox").prop("checked",true);
         }
       });
     };
     //对外暴露 取消多选框的所有项
     var unCheckAll = function($dom){
       $dom.find(".tydic-checkbox-label.active").each(function(index,value){
           $(this).removeClass("active");
           $(this).siblings(".tydic-checkbox").prop("checked",false);
       });
     };
     //对外暴露，用原有的参数重新加载多选框
     var reLoadCheckBox = function($dom){
       var options = $dom.data("options");
       var params = options["params"] || {};
       loadCheckBox($dom,{params:params});
     }
     //对外暴露 取消所有多选框的选中状态。
     return {
         initTag: initTag,
         initHtml: initHtml,
         upadteOptions:upadteOptions,
         getParams:getParams,
         loadCheckBox:loadCheckBox,
         appendCheckBox:appendCheckBox,
         reLoadCheckBox:reLoadCheckBox,
         checkAll:checkAll,
         unCheckAll:unCheckAll

     };
 })();

 //注册Cb-tpl-date组件
 ParsingHelper.registerComponent("cb-tpl-checkbox", CbTplCheckBox);
