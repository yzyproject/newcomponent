/*
 * EventListenr 1.0.0
 * author： niulei
 * Time: 2017.3.29
 * description:  订阅消息的回调函数列表，便于维护
 */
var EventListenr = (function () {
    //公共订阅回调列表
    var listenList = {
        //回调函数列表，所有的this关键字为调阅消息的元素
        loadTable: function (params) {
          var $table = $(this);
          CbBusinessTable.loadTable($table, params);
        },
        getInitFormData:function () {
            var params = {};
            $.extend(params,Serialize.serializeObject($(this)));
            Event.trigger('initTableData',params);
        },
        checkedValueFunction:function (data) {
            CbEcho.echoValue($(this),data);
        },
        formSubmit: function (params) {
            var $form = $(this);
            CbForm.prototype.ajaxSubmitData($form,params);
        },
        tableSubmit:function(params){
            params.data = CbBusinessTable.getSelectionsFrom($(this));
            var data={};
 /*           data.url= options.url ? options.url : false;*/
            data.params = params;
            data.successF = function(){
                console.log("发送成功");
            };
            data.errorF = function(){
                console.log("发送失败");
            };
            CommonAjax.ajax(data);

        },
        cloneContentsFunction:function () {
            $('body').find('div[cid = "breadcrumbs"]').after($(this).clone());
            $(this).html('').remove();
        },
        NavActive:function (params) {
            if(params === 'true'){
                $(this).addClass('left-list-nav-active');
            } else{
                $(this).removeClass('left-list-nav-active');
            }
        },
        breadcrumbsFunction:function (params) {
            CbBreadcrumbs.breadcrumbsDom(params,$(this));
        },
        mainValueFunction:function(params){
            CbMainNav.mainValueShow($(this),params);
        },
        mainValueShowFunction:function(params){
            CbBreadcrumbs.mainBreadcrumbsDom(params,$(this));
        },
        fileUploadFunction:function () {
            if($(this).data("options")["echoFileNameCid"]){
                var cid = $(this).data("options")["echoFileNameCid"];
                console.log(CheckHelper.checkForm($("[cid='"+ cid +"']")));
                if(!CheckHelper.checkForm($("[cid='"+ cid +"']"))){
                    return false;
                }
            }
            CbFileUpload.fileUpload($(this));
        },
        fileCancelFunction:function () {
            CbFileUpload.cancelFileUpload($(this));
        },
        crossFoldUpFunction:function (params) {
            if (params) {
                $(this).show();
            } else{
                $(this).hide();
            }
        },

        crossSpreadFunction: function (params) {
            if (params) {
                var options=$(this).data('options');
                if(!options.padding || options.padding.length <4){
                    $(this).css('paddingLeft','0');
                } else{
                    $(this).css('paddingLeft',options.padding[3]);
                }
            } else{
                $(this).css('paddingLeft','0');
            }
        },
        verticalFoldUpFunction:function (params) {
            if (params) {
                $(this).show();
            } else{
                $(this).hide();
            }
        },
        verticalSpreadFunction: function (params) {
            if (params) {
                $(this).hide();
                $(this).css('min-height','inherit');
                $(this).children('div[tagtype="cb-view"]').css('min-height',$('body').height()-$(this).prev().height()+'px');
                $(this).show();
            } else{
                $(this).css('min-height',$('body').css('height'));
                $(this).children('div[tagtype="cb-view"]').css('min-height',$('body').css('height'));
            }
        },
        showModal:function(params){
            Cbmodal.showModal($(this));
        },
        hideModalFunction:function () {
            Cbmodal.hideModal($(this));
        },
        clearInput:function () {
            var $this = $(this);
            $this.find('input').each(function () {
                $(this).val('');
            });
            $this.find('select').each(function () {
                $(this).children('option:first').attr("selected", 'selected');
            });
        },
        ShowFloatingPanel:function () {
            CbFloatingPanel.prototype.showFloatingPanel($(this));
        }
    };

    var listenEvent = function (eventName, handlerName) {    //找到缓存的回调函数
        //获得页面JS
        var pageJS = window[CommonConfig.getConfig("pageJsName")] || {},
            handler = pageJS[handlerName];
        if (CommonConfig.getConfig("pageToListenList") && handler && typeof handler === "function") {
          //确保自定义的回调函数this指向触发事件的元素
          Event.listen.call(this, eventName, handler);
          return;
        }
        handler = listenList[handlerName];
        if (handler && typeof handler === "function") {
          //确保自定义的回调函数this指向触发事件的元素
          Event.listen.call(this, eventName, handler);
          return;
        }
        console.error(handlerName + "用于订阅的回调函数未找到");
    };
    var addListenr = function (handlerName, fn) {
        if (typeof fn === "function") {
            listenList[handlerName] = fn;
        }
    };
    return {
        listenEvent: listenEvent,
        addListenr: addListenr
    }

})();
