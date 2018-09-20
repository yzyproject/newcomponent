/**
 *cbFlowInformation 1.0.0
 * author: dongjingfeng
 * Time: 2017.5.15
 * description: 流程信息组件
 */

var CbFlowInformation = (function(){
    //dom结构
    var flowDivList = {
        default: '<div class="cb-flow-information">' +
                    '<p class="flow-title">' +
                        '<img class="flow-icon" src="../images/cb-flow-information/flow-show.png">' +
                        '<span class="flow-title-text"></span></p>' +
                    '<ol class="flow-content"></ol>'+
                    '</div>'

    };
    var getFlowDiv = function(flowDivName){
        if (flowDivName && typeof flowDivName === "string") {
            return flowDivList[flowDivName] ? flowDivList[modalDivName] : flowDivList["default"];
        } else {
            err("未找到" + flowDivName + "组件结构，使用了默认结构",1);
            return flowDivList["default"];
        }
    };
    //配置项
    var getTagOptions;
    (function(){
        var options = {
            domDiv:"defalut",
            cid:"flow1",
            ctype:"gray"
        }
        getTagOptions = function(){
            return $.extend({}, options);
        }
    })();
    //initTag
    var initTag = function($tag,cid){
        ////node端解析入口
        var $flow=$tag,
            options =  $.extend(getTagOptions(), $tag.data("options")),
            $flowDiv=$(getFlowDiv(options.domDiv));
        $flow.after($flowDiv);
        $flowDiv.data("options",options);
        //处理公共部位的宏命令
        Macro.macroCommand($flow,$flowDiv,options);

        $flow.remove();

        return $flowDiv;
    };
    //initHtml
    var initHtml = function($dom){
        var options = $dom.data("options"),
            cid = $dom.attr("cid");
        parseFlowData($dom,options);
        bindEvent($dom);

    }
    var bindEvent = function($dom){
        $dom.on("click",".flow-icon",function(){
            if($(this).attr("src")==="../images/cb-flow-information/flow-show.png"){
                $(this).attr("src","../images/cb-flow-information/flow-hide.png");
            }else{
                $(this).attr("src","../images/cb-flow-information/flow-show.png");
            }
           $dom.find(".flow-content").slideToggle();
        });
    }
    var parseFlowData = function($dom,options){
        var data={},
            params = {};
        params.service = options.service;
        data.params =params;
        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function(returnData){
            var rowData = initDom($dom,options,returnData);
            $dom.find(".flow-content").html(rowData);
        };
        data.errorF = function(){
            console.err("获取流程信息有误");
            var $errMessage = $('<p class="flow-err">获取流程信息有误</p>');
            $dom.find(".flow-title-text").after();
        };
        CommonAjax.ajax(data);
    };
    //初始化流程dom
    var initDom = function($dom,options,returnData){
        var service = options.service;
        var ctype = 'ctype-' + options.ctype;
        var title = options.title;
        var data = options.flowinformationListName;
        var flowData = returnData[data];
        var time = options.processingTimeName;
        var department = options.departmentName;
        var cProcessor = options.currentProcessorName;
        var handleOptions = options.handleOpinionsName;
        var nProcessor = options.nextProcessorName;
        var outIndex,inIndex;
        var rowData ='';
        $dom.attr("data-service",service);
        $dom.find(".flow-title-text").text(title);
        $dom.addClass(ctype);
        for(outIndex = 0;outIndex<flowData.length;outIndex++){
            rowData +='<li>';
            rowData +=' ( '+flowData[outIndex].time+' ) ( '+ flowData[outIndex].department +' ) '+ flowData[outIndex].cProcessor + ' 处理了该业务。审批意见：'+ flowData[outIndex].handleOptions + '。';
            if(flowData[outIndex].nProcessor && flowData[outIndex].nProcessor + ''!=="") {
                rowData += '下一步处理人：' + flowData[outIndex].nProcessor;
            }else{
                rowData += '流程结束。';
            }
            rowData +='</li>';
        }
        return rowData;
    }

    //处理数据
    return {
        initTag:initTag,
        initHtml:initHtml
    }
})();

//注册组件
ParsingHelper.registerComponent("cb-flow-information", CbFlowInformation);