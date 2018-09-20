/*
 * cb-main-nav 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbTree = (function () {
//保存容cb-main-nav组件结构的列表
    //cb-main-nav组件结构列表
    var  treeBeforeAjax,deleteBeforeAjax,addBeforeAjax,modifyBeforeAjax;
    var domDivList = {
        default: '    <div class="cb-tree-div clearfix"><ul id="cbTree" class="ztree"></ul>' +
        '   </div>'
    };
    var getOptions;
    (function () {
        var options = {
            domDiv: "default",
            isShowDownloadIcon:true,
            isLastNodePopup:true,
            dragRandom:true,
            draggable:true,
            sendNodesBackNow:true,
            isExpandAll:false,
            idName:"id",
            pidName:"pId",
            name:"name",
            checkedRoot:false,
            dropPrev:"limitLevelPrev",
            dropInner:"limitLevelInner"
        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();

    //添加树信息缓存-获取-添加-djf
    var getNodesCache,setNodesCache;
    (function(){
        var cacheNodes = {};
        setNodesCache = function(nodesName,nodes){
            if (nodesName && typeof nodesName === "string") {
                cacheNodes[nodesName] = nodes;
            }else{
                console.log("嗯。名字是不对滴");
            }
        };
        getNodesCache = function(nodesName){
            if (nodesName && typeof nodesName === "string") { //此处校验可以写为公共方法
                var nodesData = cacheNodes[nodesName];
                if (nodesData) {
                    return nodesData;
                } else {
                    err("未找到" + nodesName + "的缓存数据", 1);
                    return cacheNodes["original"];
                }
                return;
            } else {
                return nodes["original"];
            }
        }
    })();

    //添加树节点拖拽的限制函数回调-djf
    var addDropRule,getDropRule;
    (function(){
        var ruleList ={
            "limitLevelInner":function(nodeId,nodes,targetNode){
                if(!targetNode.isDirectory){
                    return false;
                }
                var nodeParent = nodes[0].getParentNode().getParentNode();
                var targetParent = targetNode.getParentNode();
                if(nodeParent && targetParent && nodeParent.id === targetParent.id){
                    if(nodes[0].level === targetNode.level+1 || nodes[0].level === targetNode.level){
                        return true;
                    }else{
                        return false;
                    }
                }else{
                    return false;
                }

            },
            "limitLevelPrev":function(nodeId,nodes,targetNode){
                if(nodes[0].level === targetNode.level){
                    return true;
                }else{
                    return false;
                }
            },
            "limitPidAndLevel":function(nodeId,nodes,targetNode){
                return nodes[0][pidName] === targetNode[pidName] && nodes[0].level === targetNode.level;
            }
        };
        addDropRule = function(ruleName,fun){
            if (typeof fun === "function") {
                ruleList[ruleName] = fun;
            }
        };
        getDropRule = function (ruleName) {
            var rule = ruleList[ruleName];
            if (rule && typeof rule === "function") {
                return rule;
            } else {
                console.error(ruleName + "拖拽规则未找到");
            }
        };
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
    var treeNodes,
        cbTree;
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        var $htmlDom='';
        if(options.modalContentOptions){
            for(var j=0;options.modalContentOptions.length>j;j++) {
                var modalDataOptions = options.modalContentOptions[j];
                var modalOptions = options.modalOptions;
                modalOptions.title = modalDataOptions.modalBtnText+"节点";
                $htmlDom += '<cb-modal class="'+modalDataOptions.modalClass+' cb-modal-div" data-options = \'{"ctype":"blue","title":"'+modalDataOptions.modalBtnText+'节点","primaryPostion":[400,80],"isShowMaskLayer":true,"isShowCloseIcon":true,"width":"600","height":"300","closeIconLocation":"rightUp","draggable":true,"beforeCloseProcessor":"Fun1","isShowConfirmBtn":false,"isShowCancelBtn":false}\'><cb-form class="cb-form-default" ><cb-view class=" cb-view-block clearfix" data-options=\'{"padding":["15px","0","15px","0"]}\'><cb-view>';
                for (var i = 0; modalDataOptions.optionsData.length > i; i++) {
                    var p=i+1;
                    if(Number(p)%Number(options.rowShowNum) == 1){
                        $htmlDom += '<cb-view class="cb-view-block clearfix" data-options=\'{"padding":["5px","0","5px","0"]}\'> '
                    }
                    if (modalDataOptions.optionsData[i].isHasRule) {
                        $htmlDom += '<cb-form-base regexp="' + modalDataOptions.optionsData[i].isHasRule + '" data-options=' + JSON.stringify(modalDataOptions.optionsData[i].formBaseOptions) + '></cb-form-base>';
                    } else {
                        $htmlDom += '<cb-form-base  data-options=' + JSON.stringify(modalDataOptions.optionsData[i].formBaseOptions) + '></cb-form-base>';
                    }
                    if(Number(p)%Number(options.rowShowNum) == 0){
                        $htmlDom += '</cb-view> '
                    }
                }
                $htmlDom += '</cb-view>';
                $htmlDom += '<cb-view class="cb-view-right"><cb-btn class="btn-blue btn-left btn-margin-right '+modalDataOptions.modalClass+'-btn"  data-options=\'{"padding":["0","20px","0","20px"],"height":"30px","url":"'+modalDataOptions.url+'","beforeAjax":"'+modalDataOptions.beforeAjax+'","nodeListName":"'+modalDataOptions.nodeListName+'"}\'>'+modalDataOptions.modalBtnText+'</cb-btn> ' +
                    '<cb-btn class="btn-default btn-left btn-margin-right close-modal-btn" bindcl="clearOperation,clearData1" data-options=\'{"padding":["0","20px","0","20px"],"height":"30px"}\'>关闭</cb-btn></cb-view></cb-view></cb-form></cb-modal>';
            }

            $dom.append($htmlDom);
        }

        if(options.tipsOptions ){
            if(!options.customMenu){
                var $tipsContent='<div class="opeation-menu-btn-area"><ul>';
                for(var p=0;options.tipsOptions.length>p;p++){
                    $tipsContent += '<li flag='+options.tipsOptions[p].tipFlag+'>'+options.tipsOptions[p].tipContent +'</li>'
                }
                $tipsContent += '</ul></div>'
                $dom.append($tipsContent);
            }else{

                //自定义弹框列表-djf
                var $tipsContent = '<div class="opeation-menu-btn-area customDiv">';
                for(var i=0;i<options.customMenu.length;i++){
                    var menuMessage = options.customMenu[i];

                    $tipsContent += '<cb-view><'+menuMessage.tipName+' data-options=\''+JSON.stringify(menuMessage.tipOptions)+'\' '+menuMessage.bindStyle+'="'+menuMessage.bindFun+'">';
                        if(menuMessage.tipContent){
                            $tipsContent += menuMessage.tipContent;
                        }
                    $tipsContent +=  '</'+menuMessage.tipName+'></cb-view>';
                }
                $tipsContent += '</div>';
                $dom.append($tipsContent);
            }

        }

        $tag.remove();
        return $dom;
    };

//浏览器端解析标签的入口，$dom为最外层的dom结构
    var initHtml = function ($dom) {
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        //标签解析时的所有data-options
        // ($dom.data("options"));
        //标签解析时的cid
        // ($dom.attr("cid"));
        //是由哪个标签解析而来
        var tagIndex = $dom.data("tagindex"),
            options = $dom.data("options"),
            cid = $dom.attr("cid");
        if(options.height){
            $dom.find('#cbTree').css('height',options.height);
        }
        if(options.width){
            $dom.find('#cbTree').css('width',options.width);
        }
        ajaxTree($dom,options);



    };

    var setEventList,getEventList;
    (function(){
        var eventList={
            default:function(){
                console.log("调用默认函数");
            },
            clickToCheckBox:function(event,treeId,treeNode){
                var checked = treeNode.checked;
                var pid = treeNode.id;
                var hasChild=function(children){
                    for(var i=0;i<children.length;i++){
                        var child = children[i];
                        if(child.children){
                            hasChild(child.children);
                        }
                        var childPid = child.id;
                        if(checked){
                            $("[cid='ss']").find("[data-pId='"+childPid+"']>input").prop("checked",true);
                        }else{
                            $("[cid='ss']").find("[data-pId='"+childPid+"']>input").prop("checked",false);
                        }
                    }
                };
                if(treeNode.children){
                    var children = treeNode.children;
                    hasChild(children)
                }
                if(checked){
                    $("[cid='ss']").find("[data-pid='"+pid+"']>input").prop("checked",true);
                }else{
                    $("[cid='ss']").find("[data-pid='"+pid+"']>input").prop("checked",false);
                }
            }
        };
        setEventList = function(funName,fun){
            if (funName && typeof funName === "string") { //此处校验可以写为公共方法
                eventList[funName] = fun;
            } else {
                console.log("添加绑定事件失败");
                return false;
            }
        };
        getEventList = function(funName){
            if (funName && typeof funName === "string") { //此处校验可以写为公共方法
                var clickFun = eventList[funName];
                if (clickFun) {
                    return clickFun;
                } else {
                    err("未找到" + funName + "组件结构，使用了默认结构",1);
                    return false;
                }
            } else {
                return false;
            }
        };
    })();

    var ajaxTree = function($dom,options){
        var list= options.treeListName;
        if(options.treeCheckList){
            var checkEnable = options.treeCheckList.enable?options.treeCheckList.enable:false;
            var checkStyle = options.treeCheckList.chkStyle?'radio':'checkbox';
        }
        var setting = {
            view: {
                dblClickExpand: false,
                showLine: true,
                selectedMulti: false,
                showIcon:false
            },
            /*拖拽-djf*/
            edit: {
                drag: {
                    isCopy:false,
                    isMove:false,
                    prev:false,
                    inner:false,
                    next:false

                },
                enable: true,
                showRemoveBtn: false,
                showRenameBtn: false
            },
            check: {
                enable: checkEnable,
                chkStyle:checkStyle
            },
            data: {
                key:{
                    name:options.name
                },
                simpleData: {
                    enable:true,
                    idKey: options.idName ,
                    pIdKey: options.pidName ,
                    rootPId: ""
                }

            },
            callback: {
                onRightClick: OnRightClick,
                onDrop:onDrop
            }
        };

        //添加下载图标
        if(options.isShowDownloadIcon){
            setting.view.addDiyDom = showDownloadIcon;
        }
        //控制弹窗节点
        if(options.isLastNodePopup){
            setting.callback.onRightClick = onRightClick_lastNode;
        }else{
            setting.callback.onRightClick = OnRightClick;
        }
        //控制节点拖拽-djf
        options.draggable && ( setting.edit.drag.isMove = true );
        //拖拽限制-djf
        if(options.draggable){
            if(options.dragRandom){
                setting.edit.drag.prev = randomDragPrev;
                setting.edit.drag.inner = function(treeId,treeNodes,targetNode){
                    if(!targetNode.isDirectory){
                        return false;
                    }
                    return true;
                };
                setting.edit.drag.next = true;
            }else{
                setting.edit.drag.prev = dropPrev;
                setting.edit.drag.inner = dropInner;
                setting.edit.drag.next = dropNext;
            }
        }
        //绑定单击事件
        if(options.onClickFun){
            var clickFun = new Function("event","treeId","treeNode","clickFlag",options.onClickFun);
            setting.callback.onClick = clickFun;
        }
        //绑定选择事件
        if(options.onCheckFun){
            var checkFun = getEventList(options.onCheckFun);
            if(!checkFun){
                var checkFun =  new Function("event","treeId","treeNode",options.onCheckFun);
            }
            setting.callback.onCheck = checkFun;
        }

        var data = {},
            params = {};
        params.service = options.service;
        data.url = options.url?options.url:false;
        data.type =  options.type ? 'POST' : 'POST';
        data.params=params;
        if(options.beforeAjax){
            treeBeforeAjax = new Function('data',options.beforeAjax);
            data = treeBeforeAjax(data);
        }
        data.successF = function (returnData) {
            $.fn.zTree.init($dom.find("#cbTree"), setting, returnData[list]);
            cbTree = $.fn.zTree.getZTreeObj("cbTree");
            if(options.isExpandAll){
                cbTree.expandAll(true);
            }
            setNodesCache("ajaxData",returnData[list]);
            if(options.checkedRoot){
                var node = cbTree.getNodeByParam(options.idName,1);
                cbTree.selectNode(node);//选择点
                cbTree.setting.callback.onCheck(null,cbTree.setting.treeId, node);
            }
            modalShow($dom);

        };
        data.errorF = function (returnData) {
            layer.alert(returnData.respDesc, {
                icon: 'fail',
                skin: 'layui-blue'
            });
        };
        CommonAjax.ajax(data);
    };

    var modalShow = function ($dom) {
        $dom.find('.opeation-menu-btn-area').find('li[flag="add"]').on('click',function () {
            hideRMenu();
            $dom.find('.add-modal').find('div[tagtype="cb-form-base"]').each(function () {
                $(this).find('input').val('');
            });
            var nodes = treeObj.getSelectedNodes();
            var options = $dom.data('options');
            if (options.addNodeRelate !== '') {
                for (var i = 0; options.addNodeRelate.length > i; i++) {
                    for (var key in nodes[0]) {
                        if (options.addNodeRelate[i] == key) {
                            $dom.find('.add-modal').find('div[tagtype="cb-form-base"]').find('div[tagtype="cb-input"]').children('input[name="'+key+'"]').val(nodes[0][key]);
                        }
                    }
                }
            }
            Cbmodal.showModal( $dom.find('.add-modal'));
        });

        $dom.find('.opeation-menu-btn-area').find('li[flag="delete"]').on('click',function () {
            hideRMenu();
            $dom.find('.delete-modal').find('div[tagtype="cb-form-base"]').each(function () {
                $(this).find('span').html('');
            });
            var nodes = treeObj.getSelectedNodes();
            for(var key in nodes[0]){
                $dom.find('.delete-modal').find('div[tagtype="cb-form-base"]').each(function(){
                    var domName = $(this).find('div[tagtype="cb-text"]').find('span').attr('name');
                    if(key === domName){
                        $(this).find('div[tagtype="cb-text"]').children('span[name="'+key+'"]').html(nodes[0][key]);
                    }
                })
            }
            Cbmodal.showModal( $dom.find('.delete-modal'));

    });
        $dom.find('.opeation-menu-btn-area').find('li[flag="modify"]').on('click',function () {
            hideRMenu();
            $dom.find('.modify-modal').find('div[tagtype="cb-form-base"]').each(function () {
                $(this).find('input').val('');
            });
            var nodes = treeObj.getSelectedNodes();
            for(var key in nodes[0]){
                $dom.find('.modify-modal').find('div[tagtype="cb-form-base"]').each(function(){
                    var domName = $(this).find('div[tagtype="cb-input"]').find('input').attr('name');
                    if(key === domName){
                        $(this).find('div[tagtype="cb-input"]').children('input[name="'+key+'"]').val(nodes[0][key]);
                    }
                })
            }
            Cbmodal.showModal( $dom.find('.modify-modal'));
        });

        $dom.find('.add-modal').find('.add-modal-btn').children('button').on('click',function () {
            var $form = $(this).parents('.add-modal').find('form');
            var options = $(this).parent('div').data('options');
            var nodes = treeObj.getSelectedNodes();
            var params={};
            //调用序列化模块
            if(!CheckHelper.checkForm($form)){
                return false;
            };
            var formData = Serialize.serializeObject($form);
            var pId = nodes[0].id;
            $.extend(params,formData);
            params.pId = pId;
            var data={};
            data.params = params;
            data.type =  options.type ? 'POST' : 'POST';
            data.url = options.url ? options.url : false;
            var listName = options.nodeListName;
            if(options.beforeAjax){
                addBeforeAjax = new Function('data',options.beforeAjax);
                data = addBeforeAjax(data);
            }
            data.successF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    closeBtn:0,
                    icon: 'success',
                    skin: 'layui-blue'
                },function () {
                    Cbmodal.hideModal($dom.find('.add-modal'));
                    addTreeNode(returnData[listName]);
                    layer.closeAll();
                })
            };
            data.errorF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    icon: 'fail',
                    skin: 'layui-blue'
                });
            };
            CommonAjax.ajax(data);

        });
        $dom.find('.delete-modal').find('.delete-modal-btn').children('button').on('click',function (){
            var $form = $(this).parents('.delete-modal').find('form');
            var options = $(this).parent('div').data('options');
            var params={};
            var nodes = treeObj.getSelectedNodes();
            $.extend(params,nodes[0]);
            var data={};
            data.params = params;
            data.type =  options.type ? 'POST' : 'POST';
            data.url = options.url ? options.url : false;
            if(options.beforeAjax){
                deleteBeforeAjax = new Function('data',options.beforeAjax);
                data = deleteBeforeAjax(data);
            }
            data.successF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    closeBtn: 0,
                    icon: 'success',
                    skin: 'layui-blue'
                }, function () {
                    removeTreeNode();
                    Cbmodal.hideModal($dom.find('.delete-modal'));
                    layer.closeAll();
                })
            };
            data.errorF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    icon: 'fail',
                    skin: 'layui-blue'
                });
            };
            CommonAjax.ajax(data);
        });
        $dom.find('.modify-modal').find('.modify-modal-btn').children('button').on('click',function (){
            var $form = $(this).parents('.modify-modal').find('form');
            var options = $(this).parent('div').data('options');
            var params={};
            //调用序列化模块
            if(!CheckHelper.checkForm($form)){
                return false;
            };
            var formData = Serialize.serializeObject($form);
            var nodes = treeObj.getSelectedNodes();
            $.extend(nodes[0],formData);
            $.extend(params,nodes[0]);
            var data={};
            data.params = params;
            data.url = options.url ? options.url : false;
            data.type =  options.type ? 'POST' : 'POST';
            if(options.beforeAjax){
                modifyBeforeAjax = new Function('data',options.beforeAjax);
                data = modifyBeforeAjax(data);
            }
            var listName = options.nodeListName;
            data.successF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    closeBtn: 0,
                    icon: 'success',
                    skin: 'layui-blue'
                }, function () {
                    updateTreeNode(returnData[listName]);
                    Cbmodal.hideModal( $dom.find('.modify-modal'));
                    layer.closeAll();
                })
            };
            data.errorF = function (returnData) {
                layer.alert(returnData.respDesc, {
                    icon: 'fail',
                    skin: 'layui-blue'
                });
            };
            CommonAjax.ajax(data);
        });
        $dom.find('.close-modal-btn').children('button').on('click',function () {
            Cbmodal.hideModal($(this).parents('div[tagtype="cb-modal"]'));
        })
    };
    //增加
    var addTreeNode = function(formData) {
        var newNode = formData;
        if (treeObj.getSelectedNodes()[0]) {
            newNode.checked = treeObj.getSelectedNodes()[0].checked;
            treeObj.addNodes(treeObj.getSelectedNodes()[0], newNode);
        } else {
            treeObj.addNodes(null, newNode);
        }
    }

    //删除
    var removeTreeNode = function() {
        var nodes = treeObj.getSelectedNodes();
        if (nodes && nodes.length>0) {
            if (nodes[0].children && nodes[0].children.length > 0) {
                var msg = "该节点的子节点页面被删除，确定要删除吗？";
                if (confirm(msg)==true){
                    treeObj.removeNode(nodes[0]);
                }
            } else {
                treeObj.removeNode(nodes[0]);
            }
        }
    }

    //修改
   var updateTreeNode = function(formData) {
        var nodes = treeObj.getSelectedNodes();
        for(var key in formData){
            for(var item in nodes[0]) {
                if (key == item) {
                    nodes[0][item] = formData[key];
                }
            }

        }
        treeObj.updateNode(nodes[0]);
    }

    // 右击
    var treeObj;
    var rightClickEvent = function(event, treeId, treeNode,isLastNodePopup){
        if(!treeNode){
            return false;
        }
        treeObj = $.fn.zTree.getZTreeObj(treeId);
        if (!treeNode && event.target.tagName.toLowerCase() != "button" && $(event.target).parents("a").length == 0) {
            treeObj.cancelSelectedNode();
            isLastNodePopup ? (Boolean(!treeNode.children)  &&  showRMenu("root", event.clientX, event.clientY)) : (showRMenu("root", event.clientX, event.clientY));
        } else if (treeNode && !treeNode.noR) {
            treeObj.selectNode(treeNode);
            isLastNodePopup ? (Boolean(!treeNode.children)  &&  showRMenu("node", event.clientX, event.clientY)) : (showRMenu("node", event.clientX, event.clientY));
        }
        var options = $("#"+treeId).parent("div").data("options");
        console.log(options);
        //将选择节点id挂至弹框上
        if($(".opeation-menu-btn-area").length>0){
            $(".opeation-menu-btn-area").attr("data-checkNodeId",treeNode[options.idName]);
        }


    };
    var OnRightClick = function(event, treeId, treeNode) {
        rightClickEvent(event, treeId, treeNode,false);
    };
    var onRightClick_lastNode = function(event, treeId, treeNode) {
        rightClickEvent(event, treeId, treeNode,true);
    };

    //控制显示下载图标
    var showDownloadIcon = function(treeId, treeNode){
        var options = $("#cbTree").parent("div").data("options");
        if(treeNode.fileAddress){
            var $lastNodeDom = $("#" + treeNode.tId + "_a");
            var editStr = "<span class='tree-icon icon-downLoad diyBtn_" +treeNode[options.idName]+ "'></span>";
            $lastNodeDom.after(editStr);
            var $bindEventDom = $("#cbTree");
            var fun = new Function("data",options.downloadFun);
            if ($bindEventDom && treeNode.fileAddress) {
                $bindEventDom.on("click",".diyBtn_"+treeNode[options.idName],function(){
                    location.href = treeNode.fileAddress;
                });
            }
        }

    };
    //展示操作按钮tips
    var showRMenu = function(type, x, y) {
        $(".opeation-menu-btn-area").show();
        if (type=="root") {
            $(".tree_del").hide();
        } else {
            $(".tree_del").show();
        }
        $(".opeation-menu-btn-area").css({"top":y+"px", "left":x+"px", "visibility":"visible"});

        $("body").bind("mousedown", onBodyMouseDown);
    }
    //隐藏操作按钮tips
    var hideRMenu = function() {
        if ($(".opeation-menu-btn-area")) $(".opeation-menu-btn-area").css({"display": "none"});
        $("body").unbind("mousedown", onBodyMouseDown);
    };
    //隐藏操作按钮tips
    var onBodyMouseDown = function(event){
        if (!(event.target.id == "rMenu" || $(event.target).parents(".opeation-menu-btn-area").length>0)) {
            $(".opeation-menu-btn-area").css({"display" : "none"});
        }
    }

    var selectedTreeData = function (treeId) {
        var treeObject = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObject.getCheckedNodes();
        return nodes;
    };
    var getSelectNode = function (treeId) {
        var treeObject = $.fn.zTree.getZTreeObj(treeId);
        var nodes = treeObject.getCheckedNodes();
        return nodes;
    };
    /*拖拽-djf*/
    var randomDragPrev,dropPrev,dropInner,dropNext,onDrop;
    (function(){
        var dragBeforePid;
        randomDragPrev = function(treeId, nodes, targetNode){
            var options = $('#'+treeId).parent("div").data("options");
            dragBeforePid = nodes[0][options["pidName"]];
            return true;
        };
        dropPrev =function (treeId, nodes, targetNode) {
            var options = $('#'+treeId).parent("div").data("options");
            dragBeforePid =  nodes[0][options["pidName"]];
            //判断pid
            var idName = options.idName;
            var pidName = options.pidName;
            if(options.dropPrev){
                var ruleFun = getDropRule(options.dropPrev);
                var rule = ruleFun(treeId, nodes, targetNode);
            }
            if(rule){
                var pNode = targetNode.getParentNode();
                if (pNode && pNode.dropInner === false) {
                    console.log(1);
                    return false;

                } else {
                    for (var i=0,l=nodes.length; i<l; i++) {
                        var curPNode = nodes[i].getParentNode();
                        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                            console.log(2);
                            return false;

                        }else{
                            console.log(3);
                            return true;
                        }
                    }
                }
            }
            else{
                return false;
            }
        };
        dropInner =function (treeId, nodes, targetNode) {
            var options = $('#'+treeId).parent("div").data("options");
            dragBeforePid =  nodes[0][options["pidName"]];
            //判断pid
            if(options.dropInner){
                var ruleFun = getDropRule(options.dropInner);
                var rule = ruleFun(treeId, nodes, targetNode);
            }
            if(rule){
                return true;
            }else{
                if (targetNode && targetNode.dropInner === false) {
                    return false;
                } else {
                    for (var i=0,l=nodes.length; i<l; i++) {
                        if (!targetNode && nodes[i].dropRoot === false) {
                            return false;
                        } else if (nodes[i].parentTId && nodes[i].getParentNode() !== targetNode && nodes[i].getParentNode().childOuter === false) {
                            return false;
                        }
                    }
                }
            }


        };
        dropNext =function (treeId, nodes, targetNode) {
            if(nodes[0].level === targetNode.level){
                var pNode = targetNode.getParentNode();
                if (pNode && pNode.dropInner === false) {
                    return false;
                } else {
                    for (var i=0,l=nodes.length; i<l; i++) {
                        var curPNode = nodes[i].getParentNode();
                        if (curPNode && curPNode !== targetNode.getParentNode() && curPNode.childOuter === false) {
                            return false;
                        }
                    }
                }
                return true;
            }else{
                return false;
            }
        };
        onDrop  =function (srcEvent, treeId, treeNodes, targetNode){
            /*cbTree = $.fn.zTree.getZTreeObj("cbTree");
             var treeNodes = cbTree.getNodes();
             var nodesArray = cbTree.transformToArray(treeNodes);
             var adjustmentNodes=[];
             var outIndex,inIndex;
             for(outIndex= 0;outIndex<nodesArray.length;outIndex++){
             var obj={};
             var node=nodesArray[outIndex];
             for( inIndex in node){
             //将操作后的树信息去除children属性后保存
             if(inIndex!="children"){
             obj[inIndex]=node[inIndex];
             }
             }
             adjustmentNodes[outIndex]=obj;
             }
             setNodesCache("adjustmentNodes",adjustmentNodes);*/
            var $treeDom = $('#'+treeId).parent("div");
            //var nodePidName = $treeDom.data("options")["pidName"]?$treeDom.data("options")["pidName"]:"pId";
            //var nodeIdName = $treeDom.data("options")["idName"]?$treeDom.data("options")["idName"]:"id";
            var options = $('#'+treeId).parent("div").data("options");
            var nodePidName = options["pidName"];
            var nodeIdName = options["idName"];
            var nodeId = treeNodes[0][nodeIdName];
            var beforePid = dragBeforePid;
            if(targetNode){
                var afterPid = targetNode.isDirectory ? targetNode[nodeIdName] : targetNode[nodePidName];
            }
            sendTreeNodesBack($treeDom,beforePid,nodeId,afterPid);
            //zTreeOnDrop(event, treeId, treeNodes, targetNode);
        };

    })();

    var sendTreeNodesBack = function($dom,beforePid,nodeId,afterPid){
        //需获取options配置项
        var options = JSON.parse($dom.attr("data-options"));
        var sendBcak = options.sendNodesBackNow;
        if(sendBcak){
            var options = JSON.parse($dom.attr("data-options"));
            var dataCache = getNodesCache("ajaxData")[0];
            //数据格式转换
            cbTree = $.fn.zTree.getZTreeObj("cbTree");
            var treeNodes = cbTree.getNodes();
            var nodesArray = cbTree.transformToArray(treeNodes);
            var treeData =[];
            for(var i=0;i<nodesArray.length;i++){
                treeData[i]={};
                for(var p in nodesArray[i]){
                    for(var s in dataCache){
                        if(p ==s ){
                            treeData[i][p] =nodesArray[i][p];
                        }
                    }
                }
            }

            var beforeNodes = [],afterNodes=[],node=[];
            for(var outIndex = 0,inIndex= 0,afterIndex=0;outIndex<treeData.length;outIndex++){
                var nodeData = treeData[outIndex];
                if(nodeData[options.pidName]==beforePid){
                    beforeNodes[inIndex++]=treeData[outIndex];
                }
                if(nodeData[options.pidName]==afterPid){
                    afterNodes[afterIndex++]=treeData[outIndex];
                }
                if(nodeData[options.idName]==nodeId){
                    node[0]=treeData[outIndex];
                }
            }
            //调用传送函数
            var params = {};
            params.beforePid=beforePid;
            params.afterPid=afterPid;
            params.beforeDragNodeData = beforeNodes;
            params.treeData = treeData;
            params.dragNodeData = node;
            params.nodeData = afterNodes;
            params.service = options.dragService?options.dragService:options.service;
            sendAdjustmentData($dom,params);
        }else{
            console.log("不向后台传送数据");
        }
    };
    var sendAdjustmentData = function($dom,params){
        var options = JSON.parse($dom.attr("data-options"));
        var data = {};
        //params.nodePid = pid;
        data.url = options.url?options.url:false;
        data.type =  options.type ? 'POST' : 'POST';
        data.params=params;
        data.successF = function(returnData){
            var fun = new Function("data",options.onDropFun);
            if(fun){
                fun.call(this,returnData);
            }
        };
        data.errorF = function(returnData){
            console.log("error");
        };
        CommonAjax.ajax(data);

    };

    var changeChecked = function($dom,nodeId,checked){
        var id = $dom.parent("div").data("options")["idName"]?$dom.parent("div").data("options")["idName"]:"id";
        //console.log(typeof id);
        var nodeCheck = cbTree.getNodeByParam(id,nodeId);
        cbTree.checkNode(nodeCheck,checked);
    };
    var sendAllAdjustmentTreeNodes = function(treeId){
        var $dom = $("#"+treeId).parent("div");
        var options = $dom.data("options");
        var dataCache = getNodesCache("ajaxData")[0];
        var tree = $.fn.zTree.getZTreeObj(treeId);
        var treeNodes = cbTree.getNodes();
        var nodesArray = cbTree.transformToArray(treeNodes);
        var treeData =[];
        for(var i=0;i<nodesArray.length;i++){
            treeData[i]={};
            for(var p in nodesArray[i]){
                for(var s in dataCache){
                    if(p ==s ){
                        treeData[i][p] =nodesArray[i][p];
                    }
                }
            }
        }
        var params = {};
        params.treeData = treeData;
        params.service = options.dragService?options.dragService:options.service;
        sendAdjustmentData($("#"+treeId).parent("div"),params);
    };
    return {
        initTag: initTag,
        initHtml: initHtml,
        selectedTreeData:selectedTreeData,
        sendAdjustmentNodes:sendAllAdjustmentTreeNodes,
        ajaxTree:ajaxTree,
        changeChecked:changeChecked,
        addDropRule:addDropRule
    };
})();

//注册CbTree组件
ParsingHelper.registerComponent("cb-tree", CbTree);
