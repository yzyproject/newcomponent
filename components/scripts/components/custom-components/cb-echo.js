/*
 * cb-main-nav 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbEcho = (function () {
//保存容cb-main-nav组件结构的列表
    //cb-main-nav组件结构列表
    var domDivList = {
        default: '    <div class="cb-echo-div clearfix">' +
        '    </div>'
    };
    var getOptions;
    (function () {
        var options = {
            domDiv: "default"
        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();

    //根据 cb-main-nav获得容器结构
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
    };


//node端解析入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        $dom.append('<'+options.triggerType+' bindcl="modalShow,show" class="trigger-dom" data-options='+JSON.stringify(options.triggerData)+'></'+options.triggerType+'>');

//查询条件
        var $htmlDom = '<cb-modal listen={"show":"showModal"} data-options='+JSON.stringify(options.modalOptions)+'><cb-form class="cb-form-default" listen={"clearData1":"clearInput","show":"getInitFormData"}><cb-view class="border-bottom clearfix" data-options=\'{"padding":["15px","0","15px","0"]}\'><cb-view>';
        if(options.queryConditionTypeAttr && options.queryConditionDataAttr){
            for(var i=0;options.queryConditionTypeAttr.length>i;i++){
                $htmlDom += '<'+options.queryConditionTypeAttr[i]+'  data-options='+JSON.stringify(options.queryConditionDataAttr[i])+'></'+options.queryConditionTypeAttr[i]+'>'
            }
        }
        //按钮
        $htmlDom += '</cb-view><cb-view class="cb-view-right"><cb-btn class="btn-blue btn-left btn-margin-right" bindcl="serialize,loading"  data-options=\'{"padding":["0","20px","0","20px"],"height":"30px"}\'>查询</cb-btn><cb-btn class="btn-default btn-left  btn-margin-right" bindcl="clearOperation,clearData1" data-options=\'{"padding":["0","20px","0","20px"],"height":"30px"}\'>重置</cb-btn></cb-view></cb-form></cb-view>';


        $htmlDom += '<cb-view class="clearfix" data-options=\'{"padding":["15px","0","15px","0"]}\'><cb-btn class="btn-blue btn-right btn-margin-right confirm-btn"  data-options=\'{"padding":["0","20px","0","20px"],"height":"30px"}\'>确定</cb-btn> </cb-view>';

        //回显
        $htmlDom += '<cb-view listen={"checkedValue":"checkedValueFunction"} class="select-contents-show"></cb-view>';

        //表格
        $htmlDom += '<cb-business-table listen={"loading":"loadTable","initTableData":"loadTable"} bindCg="checkedFunction,checkedValue" class="cb-business-table-blue"  data-options='+JSON.stringify(options.tableOptions)+'></cb-business-table>';
        $htmlDom += '</cb-modal>';
        $dom.append($htmlDom);
        $tag.remove();
        return $dom;
    };
//浏览器端解析标签的入口，$dom为最外层的dom结构
    var initHtml = function ($dom) {
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        //标签解析时的所有data-options
        // console.log($dom.data("options"));
        //标签解析时的cid
        // console.log($dom.attr("cid"));
        //是由哪个标签解析而来
        var tagIndex = $dom.data("tagindex"),
            options = $dom.data("options"),
            cid = $dom.attr("cid");
        echoTriggerValue($dom);
    };

    var echoValue = function ($dom,param) {
        var options = $dom.parents('div[tagtype="cb-echo"]').data('options');
        var keyName = options.echoName;
        var keyValue = [];
        for (var i = 0; i < param.length; i++) {
            for (var j = 0; j < param[i].length; j++) {
                if (param[i][j].field == keyName) {
                    keyValue.push(param[i][j].contents);
                }
            }
        }
        options.keyValue = keyValue;
        $dom.html(keyValue.join(','));
    }
    var echoTriggerValue = function ($dom) {
        var options = $dom.data('options');
        $dom.find('.confirm-btn').on('click',function () {
            $dom.find('.trigger-dom').find('input').val((options.keyValue).join(','));
            $dom.find('.trigger-dom').data('keyValue',options.keyValue);
            Cbmodal.hideModal($dom.find('div[tagtype="cb-modal"]'));
        });
    }
    return {
        initTag: initTag,
        initHtml: initHtml,
        echoValue:echoValue
    };
})();

//注册CbEcho组件
ParsingHelper.registerComponent("cb-echo", CbEcho);
