/*
 * commonJS 1.0.0
 * author： niulei
 * Time: 2017.3.29
 * description:  公共JS,用来存放公共模块的地方，由于未使用那些打包工具，所以只能手动写到一块。
 */

$(function () {
    // //加载公共css文件
    LoadStyle.loadTheme("common");
    //加载样式文件
    LoadStyle.loadTheme(ParsingHelper.getTag());
    //解析标签
    ParsingHelper.parsingTag();
    //二次解析标签
    ParsingHelper.parsinghtml($("body"));
    //标签解析完毕后，进行事件绑定与校验绑定
    InitModal.initHtml($("body"));
    //一些页面加载后进行的事件额外处理
    BindEvent.bindCommentEvent();
    //校验事件的加载
    CheckHelper.bindCheckEvent();

})
/*
 * InitModal 1.0.0
 * author： niulei
 * Time: 2017.4.13
 * description: 标签解析完后，用来绑定事件和校验。
 */
var InitModal = (function ($) {

    // 初始化页面绑定的函数
    var initHtml = function ($dom) {

        var hasEventDom = $dom.find('[bindlist]');
        var hasListenDom = $dom.find('[listen]');
        var hasRegExpDom = $dom.find('[regexp]');

        //校验模块的事件绑定。
        hasEventDom.each(function (index, item) {
            // 绑定事件
            BindEvent.bindEvent($(item));
        });
        hasListenDom.each(function (index, item) {
            // 订阅事件
            BindEvent.setListener($(item));
        });
        hasRegExpDom.each(function (index, item) {
            //绑定校验事件
            CheckHelper.bindCheck($(item));
        });
    };
    return {
        initHtml: initHtml
    }

})(jQuery)
/*
 * CommonConfig 1.0.0
 * author： niulei
 * Time: 2017.8.8
 * description: 项目级别
 */
 var CommonConfig = (function(){
    var config = {
      pageJsName:"page",  //页面JS的闭包名称
      pageTemplateUrl:"_template/", // 页面模板放置位置
      CommonTemplateUrl:"未知",//公共模板放置位置。
      checkDomClass:"check-dom-sign",//校验事件的class
      pageToEventList:false,  //common-event 列表中是否可以直接使用页面JS中的函数
      pageToListenList:false, //common-listen 列表中是否可以直接使用页面JS中的函数
      pageToFnList:true,      //common-fn 列表中是否可以直接使用页面JS中的函数
      theme:"blueStyle"//组件样式主题
    }
    var getConfig = function(name){
      return config[name];
    };
    var setConfig = function(name,value){
      config[name] = value;
    };
    var getConfigList = function(){

    };
    var setConfigList = function(){

    }
    return {
      getConfig:getConfig,
      setConfig:setConfig
    }
 })();
/*
 * CommonAjax 1.0.0
 * author： niulei
 * Time: 2017.4.1
 * description: 公共ajax模块
 */
var CommonAjax = (function () {
    var pathName = window.document.location.pathname;
    var ctx = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
    if (ctx == "/views")
        ctx = "";
    var ajax = function (data) {
        var serviceUrl = ctx+'/proxy/'+data.params.service;
        $.ajax({
            type: data.type ? data.type : 'POST',
            url: data.url ? data.url : serviceUrl,
            data: JSON.stringify(data.params) || JSON.stringify({}),
            cache: data.cache ? true : false,
            dataType: data.dataType ? data.dataType : "json",
            async:data.async != undefined ? data.async :true,
            contentType:"application/json",
            traditional: true,
            success: function (returnData) {
              //关闭loading框
              Loading.removeAll();
              layer.closeAll('loading');
                var respCode = data.respCode || "0000";
                if (returnData.respCode == respCode) {
                    if (data.successF) {
                        data.successF(returnData);//请求成功
                    } else {
                         layer.alert(
                             returnData.respDesc || "操作成功",{
                                 closeBtn:0,
                                 icon:'success',
                                 skin: 'layui-blue'
                             });
                    }
                } else {
                    if(data.failF){
                      data.failF(returnData);//请求接口成功，但状态码不正确
                    }else{
                      layer.alert(returnData.respDesc || "系统繁忙",{
                          icon:'error',
                          skin: 'layui-blue'
                      });
                    }
                }
            },
            error: function (XMLHttpRequest, textStatus, errorThrown) {
              //关闭loading框
              Loading.removeAll();
              layer.closeAll('loading');
                if (data.errorF) {
                    data.errorF(XMLHttpRequest, textStatus, errorThrown);
                } else {
                    //调用提示框组件，提示失败，在平台开发的时候进行补充
                     layer.alert("网络异常", {
                         icon:'error',
                         skin: 'layui-blue'
                         }
                     );
                }
            }
        });
    };
    return {
        ajax: ajax
    }
})();

/*
 * LoadStyle 1.0.0
 * author： niulei
 * Time: 2017.4.1
 * description: 样式加载模块
 */
var LoadStyle = (function () {
    var tagArray = {};
    var theme = CommonConfig.getConfig("theme");
    var pathName = window.document.location.pathname;
    if(pathName.substr(1).indexOf('/views') > -1){
      pathName = pathName.substring(0, pathName.substr(1).indexOf('/views') + 1);
    }else{
      pathName = pathName.substring(0, pathName.substr(1).indexOf('/src') + 1);
    }

    var loadTheme = function (tagNames, isUpdate) {
        if ($.isArray(tagNames)) {
            for (var i in tagNames) {
                createLink(tagNames[i], isUpdate);
            }
        } else {
            createLink(tagNames, isUpdate);
        }

    };
    var createLink = function (tagName, isUpdate) {
        var path = pathName + "/styles/" + theme + "/" + tagName + ".css";
        if (!tagArray[tagName]) {
            tagArray[tagName] = true;
            $("head").append("<link rel='stylesheet' id='style-" + tagName + "' href='" + path + "'>");
        } else {
            isUpdate ? $("head").find("#style-" + tagName).attr("href", path) : false;
        }
    }
    var setTheme = function (themeName) {
        theme = themeName;
    };
    var remove = function () {

    };
    return {
        loadTheme: loadTheme,
        setTheme: setTheme
    }

})();

/*
 * Macro 1.0.0
 * author： niulei
 * Time: 2017.3.29
 * description: 宏命令集合，用于执行一系列的操作
 */
var Macro = (function () {
    var macroCommand = function ($tag, $dom, options) {
        //获得标签上的配置项
        var tagOptions = $tag.data("options");
        //获取标签名
        var tagName = $tag[0].tagName.toLowerCase();
        //获得当前标签的解析位置 index
        var tagIndex = $tag.data("tagindex");
        //获得当前标签的额外参数配置
        var otherParams = $tag.data("params") || {};
        //获得当前标签上的cid
        var cid = $tag.attr("cid") || "";
        //检测配置项是否正确
        if(tagOptions && (typeof tagOptions !== "object")){
          console.error("第"+tagIndex+"次解析的"+tagName+"组件的options配置出错，错误配置"+tagOptions);
        }
        if(otherParams && (typeof otherParams !== "object")){
          console.error("第"+tagIndex+"次解析的"+tagName+"组件的params配置出错，错误配置"+otherParams);
        }
        //获得CID
        cid = CidFactory.makingCid(tagName, tagIndex, cid || options.cid);
        //将cid放入options中
        options.cid = cid;
        //将组件额外的参数绑定到dom上
        $dom.attr("data-params", JSON.stringify(otherParams));
        //将当前标签名 绑到dom上
        $dom.attr("tagtype", tagName);
        //将当前标签的解析位置index 绑到dom上
        $dom.attr("data-tagindex", tagIndex);
        //将配置绑定到Dom上
        $dom.attr("data-options", JSON.stringify(options));
        //为组件设置内联样式
        $dom.css($tag.data("cbstyle") || {});
        //为组件设置唯一的id
        $dom.attr("cid", cid);
        //将自定义标签的样式覆盖在Dom上。
        $tag.attr("class") ? $dom.attr("class", "dic-"+tagName+" "+$tag.attr("class")) : $dom.addClass("dic-"+tagName);
        //解析标签上的校验配置
        CheckHelper.parseOptions($tag, $dom);
        //解析标签上的事件与订阅
        BindEvent.parseOptions($tag, $dom);
    };
    return {
        macroCommand: macroCommand
    }

})()
/*
 * parsingHelper 1.0.0
 * author： niulei
 * Time: 2017.3.23
 * description:  公共组件，解析模板
 */
var ParsingHelper = (function () {
    // 缓存已注册的组件
    var componentList = {};
    //已解析的自定义标签个数
    var tagNumberlist = {};
    var registerComponent = function (componentName, fn) {
        var fdStart = componentName ? componentName.indexOf("cb-") : "-1";
        if (fdStart == 0) {
            //若是以cb开头，则通过
            if (typeof fn === "function" || typeof fn === "object") {
                componentList[componentName.toLowerCase()] = fn;
                tagNumberlist[componentName.toLowerCase()] = 0;
            }
        } else {
            //若不是以cb开头，则不通过
            console.error("解析模块注册" + componentName + "组件时出错");
            return false;
        }

    };
    var getTag = function () {
        var tagArray = [];
        for (var i in componentList) {
            if (componentList.hasOwnProperty(i)) {
                tagArray.push(i);
            }
        }
        return tagArray;
    };
    var getObject = function (tagName) {
        return componentList[tagName.toLowerCase()];
    };
    var initTag = function (tagName, $tag) {
        if (tagName && typeof tagName === "string") {
            tagName = tagName.toLowerCase();
            if (componentList[tagName]) {
                tagNumberlist[tagName] += 1;
                $tag.data("tagindex", tagNumberlist[tagName]);
                if (componentList[tagName]["initTag"]) {
                    return componentList[tagName]["initTag"]($tag);
                } else {
                    return componentList[tagName]["prototype"]["initTag"]($tag);
                }
            } else {
                return $tag;
            }
        }
    };
    //递归解析标签
    var recursivlyParse = function ($tag) {
        //获得解析后的Dom节点
        var $dom = initTag($tag[0].tagName, $tag);
        var tagArray = $dom.children();
        tagArray.each(function (index, item) {
            //解析具体的组件
            recursivlyParse($(this));
        })
    };
    var parsingTag = function () {
        //递归解析标签
        recursivlyParse($("body"));
    };
    // 二次解析页面 进行浏览器端的解析。
    var parsinghtml = function ($dom) {
        $dom.find('[tagtype]').each(function (index, item) {
            initHtml($(this).attr("tagtype"), $(this));
        });
    };
    var initHtml = function (tagName, $dom) {
        if (tagName && typeof tagName === "string") {
            tagName = tagName.toLowerCase();
            if (componentList[tagName]) {
              //去除dom上的params参数配置的显示，
              // if($dom.data("params")){
              //
              // }
                if (componentList[tagName]["initHtml"]) {
                    return componentList[tagName]["initHtml"]($dom);
                } else {
                    return componentList[tagName]["prototype"]["initHtml"]($dom);
                }
            } else {
                return $dom;
            }
        }
    };
    return {
        registerComponent: registerComponent,
        getTag: getTag,
        parsingTag: parsingTag,
        recursivlyParse: recursivlyParse,
        parsinghtml: parsinghtml,
        getObject: getObject
    };
})();


/*
 * TemplateHelper 1.0.0
 * author： niulei
 * Time: 2017.3.21    已被宣判死刑。
 * description： 此模块为公共模块，目的为缓存模板和利用模板生成html，因为可能会换模板引擎，所以模板的生成，渲染，缓存在此模块定义。
 */
 //2017.8.9，被宣判死刑，剥夺政治权利终生。
var TemplateHelper = (function () {
    //2017.8.9，被宣判死刑，剥夺政治权利终生。
    var checkEngineName = function (EngineName) {
        var templateEngine = TemplateList.getEngineName();
        if (!EngineName) {
            //若没有传模板引擎，则采用默认的模板引擎
            EngineName = templateEngine;
        } else if (!TemplateList.getTemplateFactory[EngineName]) {
            //若采用的模板引擎不存在，则使用默认的模板引擎
            console.error("不支持" + EngineName + "模板引擎，已使用默认模板引擎" + templateEngine + "生成Dom");
            EngineName = templateEngine;
        }
        return EngineName;
    }

    var templateList = {};//缓存模板的地方

    var parseOptions = function (type, id, options, EngineName) {
        //通过配置文件，生成模板   ，
        //校验模板名称，若不存在，则返回默认的模板名称
        EngineName = checkEngineName(EngineName);
        if (id && typeof id === "string") {
            //调用生成模板的方法
            var templateFactory = TemplateList.getTemplateFactory(EngineName, type);
            var template = templateFactory(options);
            //将生成的模板存入缓存列表中
            templateList[id] = template;
        } else {
            console.error("请传入组件的唯一标识");
        }

    }
    var renderTemplate = function (id, data, EngineName) {
        //通过id来查找模板，查找到模板后通过数据渲染出html片段。
        //校验模板名称，若不存在，则返回默认的模板名称
        EngineName = checkEngineName(EngineName);
        if (!templateList[id]) {
            console.error("未找到" + id + "模板");
            return false;
        }
        var templateFactory = TemplateList.getTemplateFactory(EngineName, "render");
        return templateFactory(templateList[id], data);

    };

    return {
        render: renderTemplate,
        parseOptions: parseOptions
    }

})();
/*
 * TplHelper 1.0.0
 * author： niulei
 * Time: 2017.8.9
 * description： 新的模板模块，采用art-template模板引擎，通过请求模板文件和数据来渲染出Dom结构。
 */
 var TplHelper = (function(){
   //通过ajax获取模板
   var ajaxTpl = function (tplUrl,callback,isAsync){
    var date = new Date();
    date = date.getTime();
    $.ajax({
        type : 'GET',
        url : tplUrl+"?_="+date,
        async : isAsync === false ? false : true,
        success : function(data){
            return callback(data)
        },
        error : function(jqXHR,  textStatus,  errorThrown ){
            layer.msg("网络异常,模板未找到",{icon:2});
        }
    });
  };
   //通过url来获取模板渲染函数
    var getTplByUrl = function(url,callback,fromCommon,isAsync){

      url = CommonConfig.getConfig("pageTemplateUrl")+url;
      if(fromCommon){
        url = CommonConfig.getConfig("CommonTemplateUrl")+url;
      }
      ajaxTpl(url,function(rs){
          var render = template.compile(rs);
          if(callback !== undefined){
              return callback(render,rs);
          }
      },isAsync);
    };
    //通过传入模板来获取模板渲染函数
    var getTplByStr = function(str,callback){
      var render = template.compile(str);
      if(callback !== undefined){
          return callback(render,str);
      }
    };
    //通过传入的url和class来在制定地方渲染模板
    var renderByUrl = function(url,clazz,data,callback,fromCommon,isAsync){
      url = CommonConfig.getConfig("pageTemplateUrl")+url;
      if(fromCommon){
        url = CommonConfig.getConfig("CommonTemplateUrl")+url;
      }
      ajaxTpl(url,function(rs){
          var render = template.compile(rs);
          $(clazz).html(render(data))
          if(callback !== undefined){
              return callback();
          }
      },isAsync);
    }
    //通过传入的模板字符串和class来在制定的地方渲染模板
    var renderByStr = function(str,clazz,data,callback){
      var render = template.compile(str);
      $(clazz).html(render(data))
      if(callback !== undefined){
          return callback();
      }
    }
    //添加帮助函数
    var helper = function(fnName,fn){
      template.helper(fnName,fn);
    }
    return {
      getTplByUrl:getTplByUrl,
      getTplByStr:getTplByStr,
      renderByUrl:renderByUrl,
      renderByStr:renderByStr,
      helper:helper
    }
 })();
/*
 * bindEvent 1.0.0
 * author： niulei
 * Time: 2017.3.24
 * description: 绑定事件的模块，即在自定义标签解析完毕后，为制定的标签添加事件
 */
var BindEvent = (function () {
    var eventList = {
        //此处事件均为冒泡事件。
        "bindcl": "click",
        "binddb": "dbclick",
        "bindfs": "focus",
        "bindfsi": "focusin",
        "bindfso": "focusout",
        "bindbl": "blur",
        "bindcg": "change",
        "bindku": "keyup",
        "bindkd": "keydown",
        "bindkp": "keypress"
        //若要支持不冒泡的事件，则在此处另行配置事件列表，而后，在setEvent的函数中添加限制
    };
    var getEventName = function (eventName) {
        return eventList[eventName];
    };

    //绑定事件函数
    var bindEvent = function ($dom) {
        var bindList = $dom.attr("bindlist") ? $dom.attr("bindlist").split(",") : [];
        for (var i = 0; i < bindList.length; i++) {
            (function ($) {
                var eventType = bindList[i].split("-") || [];
                $dom.on(eventType[0], function (event) {
                    //阻止事件的默认动作
                    //event.preventDefault();
                    //阻止事件冒泡
                    event.stopPropagation();
                    //改变callHandler函数this的指向，确保回调函数中的this都为触发事件的元素
                    EventHandler.callHandler.call(event.target, eventType[1], eventType[2],event);
                })
            })(jQuery)
        }


    };
    var setListener = function ($dom) {
        var listenList = $dom.attr("listen");
        if (!listenList) {
            //若未配置订阅者，则回退
            return false;
        }
        listenList = JSON.parse(listenList);
        for (var i in listenList) {
            EventListenr.listenEvent.call($dom, i, listenList[i]);
        }

    };
    var parseOptions = function ($tag, $dom) {
        //通过是否含有hasbind属性获得要绑定事件的具体Dom
        $tag.attr("bindlist") ? $dom.attr("bindlist", $tag.attr("bindlist")) : false;
        var $bindDom = $dom.find('[hasbind]').length > 0 ? $dom.find('[hasbind]') : $dom;
        var attributes = $tag[0].attributes || err("获取标签属性出错", 3);
        var listenList = $tag.attr("listen");
        var bindList = $bindDom.attr("bindlist") ? $bindDom.attr("bindlist").split(",") : [];
        var eventParam = [];
        var nodeValue = [];
        $.each(attributes,function(index,value){
          var strStart = (""+value.nodeName).indexOf("bind");
          if (strStart == 0) {
              //若是以bind开头，则。
              nodeValue = value.nodeValue ? value.nodeValue.split(",") : [];
              //获得绑定事件类型
              eventParam[0] = getEventName(value.nodeName);
              //获得事件的回调函数
              eventParam[1] = nodeValue[0];
              //获得发布事件的消息名
              eventParam[2] = nodeValue[1];
              //获得事件绑定标识，为了更换回调函数
              // eventParam[3] = nodeValue[2];
              bindList.push(eventParam.join("-"));
          } else {

          }
        })
        listenList ? $dom.attr("listen", listenList) : false;
        bindList.length > 0 ? $bindDom.attr("bindlist", bindList.join(",")) : false;


    };
    var bindCommentEvent = function () {
        //绑定单击事件
        $(document).on("click",".click-btn",function(event){
          //阻止事件的默认动作。
          //event.preventDefault();
          var _this = $(this),
          fnType = _this.data("fn-name"),
          triggerName = _this.data("trigger-name");
          //改变callHandler函数this的指向，确保回调函数中的this都为触发事件的元素
          EventHandler.callHandler.call(_this, fnType, triggerName,event);
        });
        //绑定change事件
        $(document).on("change",".change-btn",function(event){
          //阻止事件的默认动作。
          //event.preventDefault();
          var _this = $(this),
          fnType = _this.data("fn-name"),
          triggerName = _this.data("trigger-name");
          //改变callHandler函数this的指向，确保回调函数中的this都为触发事件的元素
          EventHandler.callHandler.call(_this, fnType, triggerName,event);
        });
    }
    return {
        bindEvent: bindEvent,
        setListener: setListener,
        parseOptions: parseOptions,
        bindCommentEvent:bindCommentEvent
    }

})();
/*
 * Event 1.0.0
 * author： niulei
 * Time: 2017.3.24
 * description: 事件发布订阅中心，用于发布订阅事件
 */
var Event = (function () {
    var clientList = {};
    var listen = function (key, fn) { //订阅事件的函数
        if (!clientList[key]) {
            clientList[key] = [];
        }
        if (typeof fn === "function") {
            var object = {
                context: this,
                fn: fn

            };
            clientList[key].push(object); //若fn是函数，则把fn推入消息缓存区clientList
        } else {
            console.log(fn);//若fn不是函数，不推入缓存区
        }

    };
    var trigger = function () {
        var key = Array.prototype.shift.call(arguments),//获得参数中最前面的key类型
            fns = clientList[key];
        if (!fns || fns.length == 0) {
            console.log("没有此" + key + "的订阅者");
            return false;
        }
        for (var i = 0, object; object = fns[i]; i++) {
            object["fn"].apply(object.context, arguments);//挨个执行消息缓存区中的事件处理
        }
    };
    var remove = function () {

    };
    return {
        listen: listen,
        trigger: trigger,
        remove: remove
    }

})();
/*
 * CheckHelper 1.0.0
 * author： niulei
 * Time: 2017.3.31
 * description: 校验模块，此模块通过正则表达式来对输入进行校验。
 */
 var CheckHelper = (function () {
     var resultTipList = {
         // 缓存校验结果的列表，现未使用
     };
     //匹配正则
     var checkRegExp = function ($dom, regExpName, regTip) {
         var str = $.trim($dom.val());
         var regTip = regTip === "default" ? "输入不合法" : regTip;
         var regExp = new RegExp(ValidateRules.getCheckRegExp(regExpName) || regExpName);
         var result = regExp.test(str);
         return [result, regTip];
     };
     //校验处理函数
     var triggerChecking = function ($dom, regList) {
         var state = true;
         for (var item in regList) {
             var regExp = regList[item].split("-");
             var hanler = ValidateRules.getCheckHandler(regExp[0]);
             var result = hanler ? hanler($dom, regExp[1]) : checkRegExp($dom, regExp[0], regExp[1]);
             checkResult(result[0], $dom, result[1]);
             result[0] || (state = false);
         }
         return state;
     };
     //回调函数
     var checkHandler = function (event) {
         var $this = event ? $(event.target) : $(this),
             regList = $this.data("reglist") || [],
             hideCheck = !$this.data("hideCheck");
         if (hideCheck && regList.length > 0 ) {
             return triggerChecking($this, regList);
         } else {
             return true;
         }
     };
     //获得组件中的具体绑定校验的元素
     var getCheckDom = function($dom){
       var tagName = $dom[0].tagName.toLowerCase(),
           $checkDom = $dom,
           tagNameList = ValidateRules.getTagName();
       if ($.inArray(tagName, tagNameList) == -1) {
           $checkDom = $dom.find(tagNameList.join(","));
       }
       if ($checkDom.length < 1) {
           console.error("校验元素中，必须包含 " + tagNameList.join(","));
           return false;
       }
       return $checkDom;
     }
     //校验绑定事件
     var bindCheck = function ($dom,isAppend) {
         var tagName = $dom[0].tagName.toLowerCase(),
             regList = $dom.attr("regexp") ? $dom.attr("regexp").split(",") : [],
             tipStyle = $dom.attr("tipstyle"),
             $checkDom = getCheckDom($dom),
             tagNameList = ValidateRules.getTagName(),
             eventName = ValidateRules.getEventName(),
             checkDomClass =CommonConfig.getConfig("checkDomClass");
         if(!$checkDom){
           return false;
         }
         //校验样式处理
         addCheckStyle($dom, regList, tipStyle);
         //将参数绑定在checkDom上
         if(isAppend){
           //若是追加
           $checkDom.data("reglist", ($checkDom.data("reglist") || []).concat(regList));
         }else{
           $checkDom.data("reglist", regList);
         }
         $checkDom.data("tipstyle", tipStyle);
         //绑定
         $checkDom.addClass(checkDomClass);
     };
     //向外暴露的校验接口
     var checkDom = function ($dom) {
         var $checkDom = getCheckDom($dom);
         return checkHandler.call($checkDom);
     }
     //校验表单
     var checkForm = function ($form) {
         var flag = true;
         var tagNameList = ValidateRules.getTagName();
         var $items = $form.find(tagNameList.join(","));
         $items.each(function () {
             checkHandler.call(this);
             if ($(this).data("resulttip") && $(this).data("resulttip").length > 0) {
                 flag = false;
                 $(this).focus();
             }
         });
         return flag;
     };

     //设置错误校验弹出的主题
     var setTheme = function (themeName) {
         if (themeName && typeof themeName === "string") {
             LoadStyle.loadTheme("check-style", true);
         } else {
             return false;
         }
     };
     //根据校验结果 来弹出和隐藏相应的提示
     var checkResult = function (result, $dom, regTip) {
         result ? hideTip($dom, regTip) : showTip($dom, regTip);

     };
     var hideTip = function ($dom, regTip) {
         //隐藏校验结果
         var resultTip = $dom.data("resulttip") || [];
         var index = $.inArray(regTip, resultTip);
         if (index !== -1) {
             resultTip.splice(index, 1);
         }
         if (regTip === "hideAllTip" || resultTip.length < 1) {
             resultTip = [];
             $dom.removeClass("validate-color");
             $dom.siblings(".reg-tip").remove();
             $dom.data("isinvalid", false);
             $dom.data("resulttip", resultTip);
             return;
         } else {
             $dom.data("resulttip", resultTip);
             buildTipDiv($dom, resultTip[resultTip.length-1]);
         }

     };

     //隐藏所有的提示信息，一般为重置输入时使用
     var hideAllTip = function ($form) {
         var tagNameList = ValidateRules.getTagName();
         $form.find(tagNameList.join(",")).each(function (index, item) {
             hideTip($(this), "hideAllTip");
         })

     };
     //显示校验结果
     var showTip = function ($dom, regTip) {
         var resultTip = $dom.data("resulttip") || [];
         var index = $.inArray(regTip, resultTip);
         if (index == -1) {
             resultTip.push(regTip);
             $dom.data("resulttip", resultTip);
         }
         $dom.addClass("validate-color");
         buildTipDiv($dom, regTip);

     };
     // 创建提示框的函数
     var buildTipDiv = function ($dom, regTip) {
         var html = '<div class="reg-tip invalid-div"></div>';
         if ($dom.data("isinvalid")) {
             //若已有错误提示框，则只变更内容
             $dom.siblings(".reg-tip").text(regTip);
         } else {
             //若无错误提示框，则创建
             var tipStyle = $dom.data("tipstyle");
             if (tipStyle !== "default") {
                 //若有配置项，则更换样式
                 html = html.replace("invalid-div", " " + tipStyle + " ");
             }
             var $html = $(html);
             $html.text(regTip);
             $dom.parent().css("position", "relative");
             $dom.after($html);
             // if(tipStyle =="default"){
             //    //若无配置项，则采用默认的样式
             //    $html.css("left",$dom.position().left+"px");
             //    $html.css("top",$dom.outerHeight()+"px");
             //
             // }
             $dom.data("isinvalid", true);
         }
     };
     //加载校验的样式文件
     var addCheckStyle = function ($dom, regList, tipStyle) {
         LoadStyle.loadTheme("check-style");
         //获得校验类型
         for (var i = 0; i < regList.length; i++) {
             var index = $.inArray("required", regList[i].split("-"));
             if (index !== -1) {
                 if ($dom.attr('tagtype') === 'cb-input') {
                     $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
                 }
                 if ($dom.attr('tagtype') === 'cb-textarea') {
                     $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
                 }
                 if ($dom.attr('tagtype') === 'cb-select') {
                     $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
                 }
                 if ($dom.attr('tagtype') === 'cb-form-base') {
                     $dom.find("label").addClass("required");
                 }
                 break;
             }
         }
     };
     var removeRequireStyle = function($dom){
       if ($dom.attr('tagtype') === 'cb-input') {
           $dom.prev('div[tagtype="cb-text"]').find('label').removeClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-textarea') {
           $dom.prev('div[tagtype="cb-text"]').find('label').removeClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-select') {
           $dom.prev('div[tagtype="cb-text"]').find('label').removeClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-form-base') {
           $dom.find("label").removeClass("required");
       }
     };
     var addRequireStyle = function($dom){
       if ($dom.attr('tagtype') === 'cb-input') {
           $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-textarea') {
           $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-select') {
           $dom.prev('div[tagtype="cb-text"]').find('label').addClass("required");
       }
       if ($dom.attr('tagtype') === 'cb-form-base') {
           $dom.find("label").addClass("required");
       }
     };
     var parseOptions = function ($tag, $dom) {
         var regList = $tag.attr("regexp");
         if (!regList) {
             return false;
         }
         var regexp = [];
         var tipStyle = $tag.attr("tipstyle") || "default";
         var $checkDom = $dom.find('[hascheck]').length > 0 ? $dom.find('[hascheck]') : $dom;
         var newRegList = [];
         regList = regList.split(",");
         for (var i = 0; i < regList.length; i++) {
             regexp = regList[i].split("-");
             if (!regexp[1]) {
                 regexp[1] = "default";
             }
             newRegList.push(regexp.join("-"));
         }
         regList = newRegList.join(",");
         if (regList) {
             $checkDom.attr("regexp", regList);
             $checkDom.attr("tipstyle", tipStyle);
         }
     };
     var bindCheckEvent = function(){
         var eventName = ValidateRules.getEventName(),
             checkDomClass =CommonConfig.getConfig("checkDomClass");
         $(document).on(eventName,"."+checkDomClass,checkHandler);
     };
     //全量替换校验规则。
     var addRuleTo = function($dom,regexp,tipStyle){
         var $checkDom = getCheckDom($dom);
         regexp && $dom.attr("regexp",regexp);
         tipStyle && $dom.attr("tipstyle",tipStyle);
         bindCheck($dom);
         //去除当前元素的校验结果
         hideTip($checkDom,"hideAllTip");

     };
     //追加校验规则
     var appendRuleTo = function($dom,regexp,tipStyle){
         var _regexp = $dom.attr("regexp");
         _regexp = _regexp ? (_regexp = _regexp +","+ regexp) : regexp;
         _regexp && $dom.attr("regexp",_regexp);
         tipStyle && $dom.attr("tipstyle",tipStyle);
         bindCheck($dom);
     };
     //隐藏所有检验规则
     var hideRuleTo = function($dom){
         var $checkDom = getCheckDom($dom);
         $checkDom.data("hideCheck",true);
         hideTip($checkDom,"hideAllTip");
         removeRequireStyle($dom);
     };
     //隐藏后，显示所有检验规则
     var showRuleTo = function($dom){
         var $checkDom = getCheckDom($dom);
         $checkDom.data("hideCheck",false);
         addRequireStyle($dom);
     };
     //删除校验规则
     var removeRuleTo = function($dom,reg){
       //暂不支持

     };
     //为元素赋值并进行校验
     var setValTo = function($dom,val){
       var $checkDom = getCheckDom($dom);
       $checkDom.val(val);
       return checkHandler.call($checkDom);

     };
     //获得当前元素的校验规则
     var getRulesFrom = function($dom){
       var $checkDom = getCheckDom($dom);
       var regList = $checkDom.data("reglist") || [];
       return regList;
     }
     return {
         bindCheck: bindCheck,
         checkForm: checkForm,
         setTheme: setTheme,
         hideAllTip: hideAllTip,
         parseOptions: parseOptions,
         checkDom: checkDom,
         bindCheckEvent:bindCheckEvent,
         addRuleTo:addRuleTo,
         appendRuleTo:appendRuleTo,
         hideRuleTo:hideRuleTo,
         showRuleTo:showRuleTo,
         removeRuleTo:removeRuleTo,
         setValTo:setValTo,
         getRulesFrom:getRulesFrom

     }

 })();
/*
 * err 1.0.0
 * author： niulei
 * Time: 2017.4.1
 * description: 错误抛出模块
 */
var err = (function () {
    var throwErr = function () {
        // console.log("sd")
    }
    return throwErr;

})();
/*
 * Serialize 1.0.0
 * author： niulei
 * Time: 2017.4.1
 * description: 序列化模块
 */
var Serialize = (function () {
    var serializing = function ($form) {
        var result = {};
        var array = $form.serializeArray();
        for (var i in array) {
            var name = array[i]["name"];
            var value = array[i]["value"];
            if (value) {
                if (result[name]) {
                    $.isArray(result[name]) ? result[name].push(value) : result[name] = [result[name]], result[name].push(value);
                } else {
                    result[name] = value;
                }
            }
        }
        return result;

    }
    var serializeObject = function ($form) {
        if ($form[0].tagName.toLowerCase() == "form") {

            return serializing($form);
        } else {
            err("序列化出错", 2);
        }

    };
    //序列化出当前范围内所有name属性的值
    var serializeObj = function($dom,tag){
      var $cellList = $dom.find(':not(.disabled)[name]'),
          dataList = {};
      $cellList.each(function(index,value){
        var $cell = $(this),
            valList = ["input","select","textarea"],
            name = $cell.attr("name"),
            tagName = $cell[0].tagName.toLowerCase(),
            data = "";
        if(!name){
          return true; //相当于continue语句
        }　
        if($.inArray(tagName, valList) == -1){
          data = $cell.text();
        }else {
            if($cell.prop("disabled")==true){
                return true;
            }
            if(($cell.attr("type")=="checkbox" || $cell.attr("type")=="radio")){
                $cell.prop("checked")==true?data=$cell.val():data="";
            }else{
                data=$cell.val();
            }

        }
        if((!tag) && (data==="")){
          return true; //相当于continue语句
        }
        if(dataList[name] !== undefined){
          $.isArray(dataList[name]) ? dataList[name].push(data) : dataList[name] = [dataList[name]], dataList[name].push(data);
        }else{
          dataList[name] = data;
        }
      });
      return dataList;
    }
    return {
        serializeObject: serializeObject,
        serializeObj:serializeObj
    };
})();
/*
 * CidFactory 1.0.0
 * author： niulei
 * Time: 2017.4.11
 * description: 生成组件唯一标识
 */
var CidFactory = (function () {
    var cidList = [];
    var makingCid = function (tagName, tagIndex, cid) {

        if (cid && cid + "" !== tagName && $.inArray(cid + "", cidList) == -1) {
            cidList.push(cid + "");
            return cid;
        } else {
            cid && console.error("第"+tagIndex+"次解析的"+tagName+"组件cid重复，重复的cid为"+cid+",重复的cid已被自动修改为"+tagName + tagIndex);
            cidList.push(tagName + tagIndex);
            return tagName + tagIndex;
        }
    };
    return {
        makingCid: makingCid
    }
})();
/*
 * PageCache 1.0.0
 * author： niulei
 * Time: 2017.7.26
 * description: 页面级的缓存
 */
 var PageCache = (function(){
   var dataList = {};
   //获得传入数据的类型
   var getType = function (obj) {
     var typeStr = Object.prototype.toString.call(obj),
     typeArr = [];
     typeStr = typeStr.substring(1, typeStr.length - 1);
     typeArr = typeStr.split(" ");
     return typeArr[1];
   };
    //添加缓存
    var setCache = function (id, data) {
      //因为 null undefined “” 0 的缘故，所以在此先判断是否为空
      if(data){
          var type = getType(data);
          switch(type){
            case 'Object':
              dataList[id] = $.extend(true,{},data);
              break;
            case 'Array':
              dataList[id] = data.slice(0);
              break;
            default:
              dataList[id] = data;
              break;
          }
      }else{
          dataList[id] = data;
      }

    };
    // 获得缓存
    var getCache = function (id) {
      //因为 null undefined “” 0 的缘故，所以在此先判断是否为空
        if(dataList[id]){
          var type = getType(dataList[id]);
          switch(type){
            case 'Object':
              return $.extend(true,{},dataList[id]);
              break;
            case 'Array':
              return dataList[id].slice(0);
              break;
            default:
              return dataList[id];
              break;
          }
        }else{
            return dataList[id];
        }
    };
    // 根据id清空缓存
    var clearCahce = function (id) {
        delete dataList[id];
    };
    // 清空所有的缓存
    var clearAllCache = function () {
        dataList = {};
    }
    return {
      setCache:setCache,
      getCache:getCache,
      clearCahce:clearCahce,
      clearAllCache:clearAllCache
    }
 })();
 /*
  * Loading 1.0.0
  * author： niulei
  * Time: 2017.8.4
  * description: 在指定的DOM中加入loading提示。
  */
var Loading = (function () {
    var loading = function($dom){
      $dom.css("position","relative").prepend('<div class="loading"></div>');
    };
    var removeLoading = function($dom){
      $dom.find('div.loading').remove();
    };
    var removeAll = function(){
      $("div.loading").remove();
    }
    return {
      loading:loading,
      removeLoading:removeLoading,
      removeAll:removeAll
    };

})();
/*
 * ToolBox 1.0.0
 * author： niulei
 * Time: 2017.8.15
 * description: 工具模块，包含一些url参数获取，表单赋值等。
 */
var ToolBox = (function(){
    //获得url后面携带的参数
    var getUrlParams = function(){
      if(!location.search){
        return undefined;
      }
      var searchStr = location.search.substring(1),
          search = searchStr.split("&"),
          param = {};
      $.each(search,function(index,value){
        var Arr = value.split("=");
        param[Arr[0]] = Arr[1];
      });
      return param;
    };
    //获得传入数据的具体类型
    var getTypeFrom = function (obj) {
        var typeStr = Object.prototype.toString.call(obj),
            typeArr = [];
        typeStr = typeStr.substring(1, typeStr.length - 1);
        typeArr = typeStr.split(" ");
        return typeArr[1];
    };
    //为页面元素赋值
    var valPage = function($dom,data){
        var valList = ["input","select","textarea"],
            textList = [];
        if(!(data && typeof data == 'object')){
          console.error("数据源错误");
          return false;
        }
        $dom.find('[name]').each(function(index,value){
          var tagName = $(this)[0].tagName.toLowerCase(),
              name = $(this).attr("name");
          if(data[name] === undefined || data[name] === null || data[name] === false){

          }else{
              $.inArray(tagName, valList) == -1 ? $(this).html(data[name]) : $(this).val(data[name]);
          }

        });
    };
    //获得组件的配置项
    var getModelOptions = function(cid){
      if(!cid){
        return undefined;
      };
      var $dom = $("div[cid="+cid+"]");
      if($dom.length < 1){
        console.error("未找到cid为"+cid+"的组件实例");
        return undefined
      }
      return $dom.data("options") || {};
    }
    return {
      getUrlParams:getUrlParams,
      getTypeFrom:getTypeFrom,
      valPage:valPage,
      getModelOptions:getModelOptions
    };
})();
