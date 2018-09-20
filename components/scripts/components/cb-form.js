/*
 * cb-form 1.0.0
 * author： niulei
 * Time: 2017.4.1
 * description: 表单容器组件。
 */

var CbForm = function () {
};

//注册Cbbtn组件
ParsingHelper.registerComponent("cb-form", CbForm);

//保存容cbbtn组件结构的列表
(function () {
    //cbbtn组件结构列表
    var domDivList = {
        default: '  <div class="cb-form-div">'+
                  '    <form class="cb-form"></form>'+
                  '  </div>'
    };

    //根据 cbbtnDivName获得容器结构
    CbForm.getDomDiv = function (domDivName) {
        if (domDivName && typeof domDivName === "string") { //此处校验可以写为公共方法
            var componentDiv = domDivList[domDivName];
            if (componentDiv) {
                return componentDiv;
            } else {
                err("未找到" + domDivName + "组件结构，使用了默认结构",1);
                return domDivList["default"];
            }
        } else {
            return domDivList["default"];
        }
    }

})();
(function () {
    var options = {
        domDiv: "default"
    };
    CbForm.getOptions = function () {
        return $.extend({}, options);
    }
})();
//node端解析入口
CbForm.prototype.initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(CbForm.getOptions(), $tag.data("options"));
    var $dom = $(CbForm.getDomDiv(options["domDiv"]));
    $tag.after($dom);
    //将自定义标签中的内容插入到生成的form中
    $dom.find(".cb-form").append($tag.html());
    //处理公共部位的宏命令
    Macro.macroCommand($tag, $dom, options);
    //设置自身的属性
    CbForm.prototype.setAttr($dom, options);
    $tag.remove();
    return $dom;

};
//浏览器端解析标签的入口，$dom为最外层的dom结构
CbForm.prototype.initHtml = function ($dom) {
    // //标签解析的位置
    // console.log($dom.data("tagindex"));
    // //标签解析时的所有data-options
    // console.log($dom.data("options"));
    // //标签解析时的cid
    // console.log($dom.attr("cid"));
    // //是由哪个标签解析而来
    // console.log($dom.attr("tagtype"));

};
CbForm.prototype.setAttr = function($dom, options){
    //设置标题属性
    options["title"]?$dom.find(".cb-form-head").text(options["title"]):err("无此属性",1);
    //设置宽度
    options["width"]?$dom.css("width",options["width"]):err("无此属性",1);
};

CbForm.prototype.ajaxSubmitData = function ($form,param) {
    var data={},
        params = {},
        options = $form.data('options');
    param.service = options.service;
    data.params = param;
    data.type =options.type ? options.type : 'POST';
    var thisHref,keyId,keyName;
    if(data.params.thisHref){
        thisHref = data.params.thisHref;
        keyId = data.params.keyId;
        keyName = data.params.keyName;
    }
    data.url = options.url ? options.url : false;
    data.successF = function (returnData) {
      if(options.afterAjax){
            if(FnList.getFn(options.afterAjax)){
                var fun = FnList.getFn(options.afterAjax);
                var state = fun(returnData,options,param);
                if(state && !state){
                    return false;
                }
            }else{
                var fn = new Function("returnData","options","params",options.afterAjax);
                var state =  fn(returnData,options,param);
                if(state && !state){
                    return false;
                }
            }
        }
      if(options.noLayer){
        if(thisHref){
             //拼接在地址后面的参数
             str = "",
             //key值列表
             keyList = keyId || [],
             //name值列表
             nameList = keyName || [];
             $.each(keyList,function(index,value){
               var value1 = value.split('.');
                 // 获得接口返回的参数
                 var val = returnData;
                 for(var i in value1){
                   val = val[value1[i]]
                 }
                 // 判断是否需要进行参数转换
                 var name = nameList[index] || value;
                 str = str + name + "=" + val + "&";
             });
             if(keyList.length > 0){
               location.href = thisHref+"?"+str.substring(0,str.length-1);
             }else{
               location.href = thisHref;
             }
        }
      }else{
        layer.alert(returnData.respDesc, {
            closeBtn:0,
            icon: 'success',
            skin: 'layui-blue'
        },function () {
            if(thisHref){
                 //拼接在地址后面的参数
                 str = "",
                 //key值列表
                 keyList = keyId || [],
                 //name值列表
                 nameList = keyName || [];
                 $.each(keyList,function(index,value){
                	 var value1 = value.split('.');
                     // 获得接口返回的参数
                     var val = returnData;
                     for(var i in value1){
                    	 val = val[value1[i]]
                     }
                     // 判断是否需要进行参数转换
                     var name = nameList[index] || value;
                     str = str + name + "=" + val + "&";
                 });
                 if(keyList.length > 0){
                	 location.href = thisHref+"?"+str.substring(0,str.length-1);
                 }else{
                	 location.href = thisHref;
                 }
            }
            layer.closeAll();
        })
      }

    };
    data.errorF = function (returnData) {
        console.log(123);
        layer.alert(returnData.respDesc, {
            icon: 'fail',
            skin: 'layui-blue'
        });
    }
    layer.load();
    CommonAjax.ajax(data);
};
var ajaxSubmitAfter;
CbForm.prototype.ajaxSubmit = function ($form) {
    var data={},
        params = {},
        options = $form.data('options');
    if(options.service){
        if(!CheckHelper.checkForm($form)){
            return false;
        };
        var $formDom = $form.find('form');
        $.extend(params,Serialize.serializeObject($formDom));
        params.service = options.service;
        data.params =params;
        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function (returnData) {
            if(options.hasLayer){
              layer.alert(returnData.respDesc, {
                  icon: 'success',
                  skin: 'layui-blue'
              });
            }
            /*if(options.afterAjax){
                if(FnList.getFn(options.afterAjax)){
                    var fun = FnList.getFn(options.afterAjax);
                    var state = fun(returnData);
                    if(state && !state){
                        return false;
                    }
                }else{
                    var fn = new Function("returnData","options","params",options.afterAjax);
                    var state =  fn(returnData,options,params);
                    if(state && !state){
                        return false;
                    }
                }
            }*/
            ajaxSubmitAfter = new Function("returnData",options.afterAjax);
            ajaxSubmitAfter(returnData);
        };
        data.errorF = function (returnData) {
            layer.alert(returnData.respDesc, {
                icon: 'fail',
                skin: 'layui-blue'
            });
        };
        layer.load();
        CommonAjax.ajax(data);
    }
};
