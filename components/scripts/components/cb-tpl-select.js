/*
 * cb-tpl-select 1.0.0
 * author： niulei
 * Time: 2017.10.4
 * description:  下拉框组件。
 */
 var CbTplSelect = (function () {
     //cb-tpl-select组件结构列表
     var domDivList = {
       "default": '<div class="cb-tpl-select-div">'+
                  '<input class="cb-tpl-select-input" type="text" hascheck="hascheck" readonly="readonly" ></input>'+
                  '<input class="cb-tpl-select-hide" type="hidden"></input>'+
                  '<ul class="cb-tpl-select-list hide"></ul>'+
                  '</div>'
     };
     //单选框组件的模板
     var tplList = {
       "default": '{{each list as value i }}'+
                    '<li data-value="{{value.value}}" class="tydic-select-li {{if value.disabled}} disabled {{/if}} {{if value.isChecked}} active {{/if}} {{if value.isAll}}isall{{/if}} {{if value.isSelectedTitle}} selected-title{{/if}}">'+
                      '<label data-value="{{value.value}}" class="tydic-select-label {{if !options.multiSelected || value.isSelectedTitle}} hide {{/if}} {{if value.disabled}} disabled {{/if}} {{if value.isChecked}} active {{/if}}"  ></label>'+
                      '<span class="tydic-select-span">{{value.text}}</span>'+
                    '</li>'+
                  '{{/each}}'
     };
     //日期的配置项
     var defaultOptins = {
       minSelected:"0",//单选时，最低选择一个
       placeholder:"请选择",//请选择
       multiSelected:false,//是否打开多选功能
       openSelectedTitle:false, //是否打开 请选择提示
       openAllSelectedTitle:false, //是否打开全部选项
       selectedTitle:"请选择",//选择提示的默认文本
       selectedValue:"tpl_selected",//选择提示的默认value
       allSelectedTitle:"全部",//全部选项的文本
       allSelectedValue:"",//全部选项的value值
       zIndex:"99999999",//下拉框下拉列表zindex
       mergeData:"ajax", //判断保留数据的方式，ajax：以ajax的数据为准；option：以页面配置的option数据为准；merge：将两个数据合并
       tpl:"default",//采用默认的模板
       params:"", //请求后台时携带的参数
       name:"",//序列化val时的name属性
       textName:"",//序列化单选框文本内容时的name属性
       isRequest:false,//是否在组件初始化时加载数据
       icon:"",//默认的图标位置
       list:"list",//后台返回数据的数组名
       value:"value",//单选框中value值的键名
       text:"text",//单选框中 文本内容的键名
       option:"",//页面配置的数据项
       method:"post",//ajax加载数据时的请求方式
       url:"",//ajax加载数据时的请求地址
       dataType:"json",//ajax数据请求时返回的数据类型
       beforeLoad:"",//ajax请求之前的数据处理
       loadSuccess:"",//ajax请求成功后的数据处理
       loadError:"",//ajax请求error后的数据处理
       loadFail:"",//ajax请求时，返回错误码的数据处理
       renderSuccess:"",//渲染成功后的处理函数
       onCheck:"",//单击单选框时的处理函数，return true 为选中， return false为未选中
       checkFn:""//选中状态变更后的处理函数

     };
     //根据 cb-tpl-select获得容器结构
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
         options.isRequest && loadSelect($dom,{params:options["params"]});

     };
     // 解析普通的配置项
     var parseOptions = function($dom,options){
       options.name && $dom.find(".cb-tpl-select-hide").attr("name",options.name);
       options.textName && $dom.find(".cb-tpl-select-input").attr("name",options.textName);
       options.placeholder && $dom.find(".cb-tpl-select-input").attr("placeholder",options.placeholder);
     };
     // 解析配置项，加入事件
     var parseOptionsEvent = function($dom){
       //选中条目时的单击事件
       $dom.on("click",".tydic-select-li",function(event){
         var onCheckFn,
             checkFn,
             options = $dom.data("options"),
             $this = $(this),
             checkVal = "",
             $label = $this.find(".tydic-select-label"), //找到对应的多选框
             $span = $this.find(".tydic-select-span"),//找到对应的文本元素
             $text = $dom.find(".cb-tpl-select-input"), //用于回显选中文本的输入框
             $input = $dom.find(".cb-tpl-select-hide"), //找到用于存放value的隐藏域
             hasActive = $this.hasClass("active"); //是否已选中
         event.stopPropagation();
         if($this.hasClass("disabled")){
           return false;
         }
         onCheckFn = getCallBackFn(options["onCheck"]);
         checkFn = getCallBackFn(options["checkFn"]);
         if(onCheckFn){
           checkVal = onCheckFn.call(this,options,hasActive,$this.data("value"),$span.text());
           options.multiSelected ? checkStatuss.call(this,$dom,checkVal,$this.data("value"),$span.text()) : checkStatus.call(this,$dom,checkVal,$this.data("value"),$span.text());
         }else{
           options.multiSelected ? checkStatuss.call(this,$dom,!$this.hasClass("active"),$this.data("value"),$span.text()) : checkStatus.call(this,$dom,!$this.hasClass("active"),$this.data("value"),$span.text());
         }
         checkFn && checkFn.call(this,options,$this.hasClass("active"),$this.data("value"),$span.text());

       })
       //单击输入框，打开选择项
       $dom.on("click",".cb-tpl-select-input",function(event){
         var $this = $(this),
             options = $dom.data("options") || {};
         event.stopPropagation();
         $dom.css("position","relative");
         $dom.find(".cb-tpl-select-list").css({
           "position":"absolute",
           "width":$this.css("width"),
           "top":$this.css("height"),
           "left":$this.position().left,
           "z-index":options.zIndex
         });
         $dom.find(".cb-tpl-select-list").removeClass("hide");
       })
       //点击body时，关闭下拉框
       $(document).off("click.hideTplSelect");
       $(document).on("click.hideTplSelect",function(event){
         var $target = $(event.target);
        if($target.closest([tagtype="cb-tpl-select"]).length === 0 ){
            $(".cb-tpl-select-list").addClass("hide");
        }
       })
     };
     //下拉单选的状态变更
     var checkStatus = function($dom,status,value,text){
       //status为true时表明要选中   status为false时 表明要取消选中
       var options = $dom.data("options");
       if(status){
         //去除所有其他的选项选中状态
         $dom.find(".tydic-select-li").removeClass("active");
         $dom.find(".tydic-select-label").removeClass("active");
         //选中当前的选中状态
         $(this).addClass("active");
         $(this).find(".tydic-select-label").addClass("active");
         //更新值
         $dom.find(".cb-tpl-select-input").val(text);
         $dom.find(".cb-tpl-select-hide").val(value);

       }else{
         //取消当前的选中状态
         if(options.minSelected != "1"){
           $(this).removeClass("active");
           $(this).find(".tydic-select-label").removeClass("active");
           //更新值
           $dom.find(".cb-tpl-select-input").val("");
           $dom.find(".cb-tpl-select-hide").val("");
         }
       }
       $dom.find(".cb-tpl-select-list").addClass("hide");

     };
     //下拉多选的状态变更
     var checkStatuss = function($dom,status,value,text){
       //status为true时表明要选中   status为false时 表明要取消选中
       var texts = $dom.find(".cb-tpl-select-input").val(),
           values = $dom.find(".cb-tpl-select-hide").val(),
           textArr = texts ? texts.split(",") : [],
           valueArr = values ? values.split(",") : [],
           valueIndex = $.inArray(""+value,valueArr),
           textIndex = $.inArray(""+text,textArr);
       if(status){
         if($(this).hasClass("isall")){
           $dom.find(".tydic-select-li").removeClass("active");
           $dom.find(".tydic-select-label").removeClass("active");
           //选中当前的选中状态
           $(this).addClass("active");
           $(this).find(".tydic-select-label").addClass("active");
           //更新值
           $dom.find(".cb-tpl-select-input").val(text);
           $dom.find(".cb-tpl-select-hide").val(value);
           return true;
         }
         //去掉全部的选择状态
         if($dom.find(".tydic-select-li.isall").hasClass("active")){
           textArr=[];
           valueArr=[];
         }
         $dom.find(".tydic-select-li.isall").removeClass("active");
         $dom.find(".tydic-select-li.isall .tydic-select-label").removeClass("active");
         //选中当前的选中状态
         $(this).addClass("active");
         $(this).find(".tydic-select-label").addClass("active");
         //更新值
         textArr.push(text);
         valueArr.push(value);
         $dom.find(".cb-tpl-select-input").val(textArr.join(","));
         $dom.find(".cb-tpl-select-hide").val(valueArr.join(","));
         //关闭下拉框列表
       }else{
         //取消当前的选中状态
         $(this).removeClass("active");
         $(this).find(".tydic-select-label").removeClass("active");
         //更新值
         (valueIndex !== -1) && valueArr.splice(valueIndex,1);
         (textIndex !== -1) && textArr.splice(textIndex,1);
         $dom.find(".cb-tpl-select-input").val(textArr.join(","));
         $dom.find(".cb-tpl-select-hide").val(valueArr.join(","));
       }
     };
     //处理单选框配置项
     var paseOptions = function($dom,obj){
       var options = $dom.data("options") || {},
           cid = options["cid"];
       if(!cid){
         console.error("下拉框cid出错，停止数据加载");
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
     //加载单选框
     var loadSelect = function($dom,obj){
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
     //为单选框追加数据
     var appendSelect = function($dom,obj){
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
     //渲染单选框
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
       //是否有全部项
       if(isAppend !=="append" && options.openAllSelectedTitle){
         returnData.list.unshift({
           isAll:true,
           text:options.allSelectedTitle,
           value:options.allSelectedValue
         })
       }
       //是否有请选择项
       if(isAppend !=="append" && options.openSelectedTitle){
         returnData.list.unshift({
           isSelectedTitle:true,
           disabled:true,
           text:options.selectedTitle,
           value:options.selectedValue
         })
       }

       TplHelper.getTplByStr(tpl,function(render,str){
         var html = render(returnData);
         if(isAppend === "append"){
           $dom.find(".cb-tpl-select-list").append(html);
         }else{
           $dom.find(".cb-tpl-select-list").html(html);
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
     //对外暴露，获得单选框请求的参数
     var getParams = function($dom){
       var options = $dom.data("options");
       var params = options["params"] || {};
       return params;
     };

     //对外暴露，用原有的参数重新加载单选框
     var reLoadSelect = function($dom){
       var options = $dom.data("options");
       var params = options["params"] || {};
       loadSelect($dom,{params:params});
     }
     //对外暴露 赋值下拉框
     var val = function($dom,value){
       if(value && $.isArray(value)){
         console.error("未支持下拉多选框的赋值操作");
        //  $.each(value,function(index,val){
        //    $dom.find(".tydic-select-li").each(function(i,v){
        //      var data = $(this).data("value");
        //      if(val)
        //    })
        //  })
       };
       if(value){
         $dom.find(".tydic-select-li").each(function(index,val){
           var data = $(this).data("value"),
               $span = $(this).find(".tydic-select-span");//找到对应的文本元素
           if(data == value) {
             checkStatus.call(this,$dom,true,data,$span.text());
           }
         });
       }else{
         return $dom.find(".cb-tpl-select-hide").val();
       }

     }
     //对外暴露 取消所有下拉框的选中状态。
     var removeAllValue=function($dom){
       $dom.find(".tydic-select-li").removeClass("active");
       $dom.find(".tydic-select-label").removeClass("active");
       //更新值
       $dom.find(".cb-tpl-select-input").val("");
       $dom.find(".cb-tpl-select-hide").val("");

     }
     return {
         initTag: initTag,
         initHtml: initHtml,
         upadteOptions:upadteOptions,
         getParams:getParams,
         loadSelect:loadSelect,
         appendSelect:appendSelect,
         reLoadSelect:reLoadSelect,
         val:val,
         removeAllValue:removeAllValue

     };
 })();

 //注册Cb-tpl-date组件
 ParsingHelper.registerComponent("cb-tpl-select", CbTplSelect);
