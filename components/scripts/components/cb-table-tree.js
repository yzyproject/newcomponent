/*
 * cb-btn 1.0.0
 * author： dongjingfeng
 * Time: 2017.8.2
 * description: 表格树组件
 */

var CbTableTree = (function () {
    var formatter ={
        treeCheckbox :function (value,rowData,rowIndex) {
            return "<input class='click-btn' class='' data-trigger-name='treeclick' data-fn-name='treeClick' type='checkbox'  id='"+rowData.id+"' "+(rowData.checked?'checked':'')+"/>" + rowData.tree;
        },
        powerCheckbox : function (value,rowData,rowIndex) {
            var template = '<ul>';
            var checkBoxData = value;
            var type = typeof checkBoxData;
            if(type ==="object"){
                for(var i=0;i<checkBoxData.length;i++){
                    var data=checkBoxData[i];
                    var html = '<li><input class="click-btn" data-trigger-name ="powerclick" data-fn-name="powerClick" type="checkbox" name ='+data.value+' value='+data.key+' id='+data.value+'-'+data.key+' ' ;
                    (data.checked)&&(html+=" checked ");
                    html+= '><label class="checkbox-label" for='+data.value+'-'+data.key+'></label><span>'+data.value+'</span></li>';
                    template = template + html;
                }

            }
            return template;
        }
    };
    //获得处理函数
    var getFormatter = function(fnName){
        if(!fnName){
            return false;
        }
        if(formatter[fnName]){
            return formatter[fnName];

        }else{
            var a = new Function("headData", "data", fnName);
            return a;
        }
    };
    //设置处理函数
    var addFormatter = function(fnName,fn){
        if(typeof fn === "function"){
            formatter[fnName] = fn;
        }
    };
    var getDomDiv,getOptions;
    //保存容cb-btn组件结构的列表
    (function () {
        //cb-btn组件结构列表
        var domDivList = {
            default: '    <div class="cb-table-tree-div">' +
            '      <div class="cb-table-tree" id="tableTree"></div>' +
            '    </div>'

        };
        //根据 cb-btnDivName获得容器结构
        getDomDiv = function (domDivName) {
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
            domDiv: "default",
            method: 'get',
            showFooter: false,
            idName: 'id',
            treeIdName: 'tree',
            pidName:'pId',
            listName:"list",
            width:500,
            columns:[[
                {field:'tree',title:'菜单',width:250,formatter:"treeCheckbox"},
                {field:'power',title:'权限',width:250,formatter:"powerCheckbox"}
            ]]

        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();


//node端解析标签的入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        //获取Dom结构，且转化为Jquery对象
        var $dom = $(getDomDiv(options["domDiv"]));
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
        //标签解析的位置
        // console.log($dom.data("tagindex"));
        // //标签解析时的所有data-options
        // console.log($dom.data("options"));
        // //标签解析时的cid
        // console.log($dom.attr("cid"));
        // //是由哪个标签解析而来
        // console.log($dom.attr("tagtype"));
        var options=$dom.data("options");
        isAjax($dom,options);


    };
    var dealColumn = function(data){
        var columns = data;
        for(var i = 0;i<columns.length;i++){
            var column = columns[i];
            for(var p = 0;p<column.length;p++){
                var columnRow = column[p];
                if(columnRow["formatter"]){
                    var fnName = columnRow["formatter"];
                    columnRow["formatter"] = getFormatter(fnName);
                }
                if(columnRow["width"]){
                    columnRow["width"] += 6/columns.length;
                }
            }
        }
        return column;
    };
    var isAjax = function($dom,options){
        dealColumn(options.columns);
        var params={};
        if(options.beforeAjax){
            var beforeAjax = new Function("params",options.beforeAjax);
            console.log(beforeAjax);
            params = beforeAjax(params);
        }
        /*var optionss = {
            url: 'treegrid_data3.json',
            method: 'get',
            idField: 'id',
            treeField: 'tree',
            Pid:'pId',
            columns:[[
                {field:'tree',title:'菜单',width:200},
                {field:'power',title:'权限',width:200,formatter:function(value, row, index){
                    console.log(row);
                    var template = '<ul>';
                    var checkBoxData = value;
                    var type = typeof checkBoxData;
                    if(type ==="object"){
                        for(var i=0;i<checkBoxData.length;i++){
                            var data=checkBoxData[i];
                            var html = '<li><input class="click-btn" data-trigger-name ="powerclick" data-fn-name="powerClick" type="checkbox" name ='+data.key+' value='+data.key+' id='+data.value+'-'+data.key+' ' ;
                            (data.checked)&&(html+=" checked ");
                            html+= '><label class="checkbox-label" for='+data.value+'-'+data.key+'></label><span>'+data.value+'</span></li>';
                            template = template + html;
                        }

                    }
                    return template;
                }}
            ]]
        };*/
        var setting = {
            url:options.url,
            width:options.width,
            queryParams:params,
            idField: options.idName,
            treeField: options.treeIdName,
            Pid:options.pidName,
            columns:options.columns
        };
        $dom.find(".cb-table-tree").treegrid(setting);
    };
    /*var loadTableTree = function(adjustmentData,options){

        var setting = {
            showFooter: false,
            idField: options.idName,
            treeField: options.treeIdName,
            Pid:options.pidName,
            columns:[[
                {field:'tree',title:'菜单',width:200,formatter:function(value,rowData,rowIndex){
                    return "<p style='padding:0;margin:0' class='' data-trigger-name='treeclick' data-fn-name='treeClick'><input  type='checkbox' id='taocan_"+rowData.id+"' "+(rowData.checked?'checked':'')+"/>" + rowData.tree+'</p>';
                }},
                {field:'power',title:'权限',width:200,formatter:function(value, row, index){
                    var template = '<ul>';
                    var checkBoxData = value;
                    var type = typeof checkBoxData;
                    if(type ==="object"){
                        for(var i=0;i<checkBoxData.length;i++){
                            var data=checkBoxData[i];
                            var html = '<li class="" data-trigger-name ="powerclick" data-fn-name="powerClick"><input  type="checkbox" name ='+data.key+' value='+data.key+' id='+data.value+'-'+data.key+' ' ;
                            (data.checked)&&(html+=" checked ");
                            html+= '><label class="checkbox-label" for='+data.value+'-'+data.key+'></label><span>'+data.value+'</span></li>';
                            template = template + html;
                        }

                    }
                    return template;
                }}
            ]],
            data:adjustmentData
        };
        $dom.find(".cb-table-tree").treegrid(setting);
    }*/
    var getData = function($dom,field,dataStyle){
        var selectNodes = $dom.find(".datagrid-btable td[field='"+field+"'] input:checked");
        var data=[];
        for(var i= 0,p=0;i<selectNodes.length;i++){
            var selectNode = selectNodes[i];
            //data[p++] = Number(selectNode["id"].replace(/[^0-9]/ig,""));
            data[p++] = selectNode[dataStyle];
        }
        return data;
    };
   /* var getOtherData = function($dom){
        var selectNodes = $dom.find(".datagrid-btable td[field!='tree'] input:checked");
        var data=[];
        for(var i= 0,p=0;i<selectNodes.length;i++){
            var selectNode = selectNodes[i];
            data[p++] = selectNode["value"];
        }
        return data;
    };*/
    return {
        initTag: initTag,
        initHtml: initHtml,
        addFormatter:addFormatter,
        getData:getData
    };
})();

//注册CbTableTree组件
ParsingHelper.registerComponent("cb-table-tree", CbTableTree);



