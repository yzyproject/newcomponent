/*
 * EventHandler 1.0.0
 * author： niulei
 * Time: 2017.3.29
 * description:  事件回调函数列表，为了更好地维护。
 */
var EventHandler = (function () {
    //公共事件列表
    var eventList = {
        //回调函数列表，所有的this关键字为触发事件的元素
        serialize: function (triggerName) {
            var $form=$(this).closest("form");
            var params={};
            //调用序列化模块
            if(!CheckHelper.checkForm($form)){
              return false;
            };
            $.extend(params,Serialize.serializeObject($form));
            Event.trigger(triggerName,params);
        },
        //提交表单并跳转页面
        submitAndJump: function(triggerName){
          var btnParams = $(this).parent().data('params');
          var $form=$(this).closest('[tagtype = "cb-form"]');
          var form = $(this).closest('form');
          var formOptions = $form.data('options');
          var data={};
          var params = {}
          //调用序列化模块
          if(!CheckHelper.checkForm(form)){
              return false;
          };
          $.extend(params,Serialize.serializeObject(form));
          //服务号
          params.service = formOptions.service;
          data.params = params;
          data.type =formOptions.type ? formOptions.type : 'POST';
          data.url = formOptions.url ? formOptions.url : false;
          data.successF = function (returnData) {
              var data = returnData["data"],
              //拼接在地址后面的参数
              str = "",
              //跳转地址
              href= btnParams["href"] || ""
              //key值列表
              keyList = btnParams["keyId"] || [],
              //name值列表
              nameList = btnParams["keyName"] || [];
              $.each(keyList,function(index,value){
                  // 获得接口返回的参数
                  var val = data[value] || "";
                  // 判断是否需要进行参数转换
                  var name = nameList[index] || value;
                  str = str + name + "=" + val + "&";
              });
              if(href){
                location.href = href+"?"+str.substring(0,str.length-1);
              }
          };
          CommonAjax.ajax(data);
        },
        //提交表单
        submitForm: function (triggerName) {
            var options = $(this).parent().data('options');
            var $form=$(this).closest("form");
            var params={};
            var pathName = window.document.location.pathname;
            var ctx = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
            if (ctx == "/views")
                ctx = "";
            //调用序列化模块
            if(!CheckHelper.checkForm($form)){
                return false;
            };

            if(options.href){
                var thisHref = ctx+options.href;
                params.thisHref = thisHref;
            }
            $.extend(params,Serialize.serializeObject($form));
            Event.trigger(triggerName,params);
        },
        fileUploadtrigger:function (triggerName) {
            Event.trigger(triggerName);
        },
        fileCanceltrigger:function (triggerName) {
            Event.trigger(triggerName);
        },
        submitTable:function(triggerName){
            var params={};
            params.service = $(this).data().service;//服务挂在按钮上 嗯 挂在钮上 在钮上 钮上 上....
            Event.trigger(triggerName,params);
        },
        modalShow:function(triggerName){
            Event.trigger(triggerName);
        },
        ShowFloatingPanel:function (triggerName) {
            Event.trigger(triggerName);
        },
        clearOperation:function (triggerName) {
            Event.trigger(triggerName);
        },
        modalHideFunction:function (triggerName) {
            Event.trigger(triggerName);
        },
        getSelectedData:function (triggerName) {
            Event.trigger(triggerName);
        },
        checkedFunction:function (triggerName) {
            var data = CbBusinessTable.getSelectionsFrom($(this).parents('div[tagtype="cb-business-table"]'));
            Event.trigger(triggerName,data);
        },
        tableSearch:function(triggerName){
            var data={
                options:{
                    "tableDiv":"table1",
                    "tableId":"3434",
                    "idField":"deviceNumber",
                    "operation":[{"field":"batchNo","triggerType":"select"}],
                    "columns":[
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"},
                        {"field":"deviceNumber","title":"业务号码"},
                        {"field":"storeName","title":"库"}]
                }
            }
            Event.trigger(triggerName,data);
        }

    };

    var callHandler = function (eventName, triggerName,e) {  //wing　event1
      //获得页面js
      var pageJS = window[CommonConfig.getConfig("pageJsName")] || {},
          handler = pageJS[eventName]; //先从页面JS中获取函数。
        if (CommonConfig.getConfig("pageToEventList") && handler && typeof handler === "function") {
            //确保自定义的回调函数this指向触发事件的元素
            handler.call(this, triggerName,e);
            return;
        }
        handler = eventList[eventName];
        if (handler && typeof handler === "function") {
            //确保自定义的回调函数this指向触发事件的元素
            handler.call(this, triggerName,e);
            return;
        }
        console.error(eventName + "事件回调函数未找到");

    };
    var addHandler = function (eventName, fn) {
        if (typeof fn === "function") {
            eventList[eventName] = fn;
        }

    }
    return {
        callHandler: callHandler,
        addHandler: addHandler
    }

})();
