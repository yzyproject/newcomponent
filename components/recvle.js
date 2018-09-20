
module.exports={
  startParse:function(){
    ParsingHelper.parsingTag();
  }
}
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
      //检测配置项是否正确
      if(tagOptions && (typeof tagOptions !== "object")){
        console.error("第"+tagIndex+"次解析的"+tagName+"组件的options配置出错，错误配置"+tagOptions);
      }
      if(otherParams && (typeof otherParams !== "object")){
        console.error("第"+tagIndex+"次解析的"+tagName+"组件的params配置出错，错误配置"+otherParams);
      }
      //获得CID
      var cid = CidFactory.makingCid(tagName, tagIndex, options.cid);
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
    //node端页面索引
    var htmlIndex = 0;
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
        if(htmlIndex !== c){
          htmlIndex = c;
          tagNumberlist = {};
        }
        if (tagName && typeof tagName === "string") {
            tagName = tagName.toLowerCase();
            if (componentList[tagName]) {
                if(tagNumberlist[tagName]){
                  tagNumberlist[tagName] += 1;
                }else{
                  tagNumberlist[tagName] = 1;
                }
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
        });
        listenList ? $dom.attr("listen", listenList) : false;
        bindList.length > 0 ? $bindDom.attr("bindlist", bindList.join(",")) : false;


    };
    return {
        parseOptions: parseOptions
    }

})();
/*
 * Event 1.0.0
 * author： niulei
 * Time: 2017.3.24
 * description: 事件发布订阅中心，用于发布订阅事件
 */

/*
 * CheckHelper 1.0.0
 * author： niulei
 * Time: 2017.3.31
 * description: 校验模块，此模块通过正则表达式来对输入进行校验。
 */
var CheckHelper = (function () {

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

    return {
        parseOptions: parseOptions

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
 * CidFactory 1.0.0
 * author： niulei
 * Time: 2017.4.11
 * description: 生成组件唯一标识
 */
var CidFactory = (function () {
    var cidList = [];
    var htmlIndex = 0;
    var makingCid = function (tagName, tagIndex, cid) {
        // console.log(cidList.length)
        if(htmlIndex !== c){
          htmlIndex = c;
          cidList = [];
        }
        // console.log(c);
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
