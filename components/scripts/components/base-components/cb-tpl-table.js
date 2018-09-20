/*
 * cb-tpl-table 1.0.0
 * author： niulei
 * Time: 2017.8.17
 * description: 模板表格组件，用来进行一般的表格操作。
 */
var CbTplTable = (function () {
    //cb-tpl-table组件结构列表
    var domDivList = {
        "default": '<div class="cb-tpl-table-div">' +
        '<div class="cb-tpl-table-area">' +
        '<div class="fixed-thead-div"><table></table></div>'+
        '<div class="fixed-tbody-div"></div>'+
        '</div>' +
        '<div class="M-box-div clearfix"><div class="M-box"></div></div>' +
        '</div>'

    };
    //用于生成表格模板的模板
    var tplList = {
        "default":
        '<table><thead>' +
        '<tr>' +
        '{{if chooseBox == "checkBox"}}<th style="width:40px;"><div class="tydic-check-all"></div></th>{{/if}}' +
        '{{if chooseBox == "radioBox"}}<th style="width:40px;"><div></div></th>{{/if}}' +
        '{{each columns as value i}}' +
        '<th  style="width:{{value.width | widthDeal:"%"}}"><div class = "{{value.class}}"  style="width:{{value.width | widthDeal:"px"}}">{{value.title}}</div></th>' +
        '{{/each}}' +
        '</tr>' +
        '</thead>' +
        '<tbody>' +
        '{{"{"+"{"}}each rows as value i {{"}"+"}"}}' +
        '<tr class="{{if clickTr}}tydic-table-tr {{"{"+"{"}}if value.isClicked == 1{{"}"+"}"}} active {{"{"+"{"}}/if{{"}"+"}"}}{{/if}}" data-index={{"{"+"{"}}value.trIndex{{"}"+"}"}}>' +
        '{{if chooseBox == "checkBox"}}<td><div class="tydic-table-check {{"{"+"{"}}if value.isChecked == 1{{"}"+"}"}} active {{"{"+"{"}}/if{{"}"+"}"}}"></div></th>{{/if}}' +
        '{{if chooseBox == "radioBox"}}<td><div class="tydic-table-radio {{"{"+"{"}}if value.isChecked == 1{{"}"+"}"}} active {{"{"+"{"}}/if{{"}"+"}"}}"></div></th>{{/if}}' +
        '{{each columns as value i}}' +
        '<td data-field="{{value.field}}"><div class = "{{value.class}}" >{{"{"+"{"}}#value.{{value.field}} | tableFormatter:options,rows,i,"{{value.field}}"{{"}"+"}"}}</div></td>' +
        '{{/each}}' +
        '</tr>' +
        '{{"{"+"{"}}/each{{"}"+"}"}}' +
        '</tbody>' +
        '</table>'
    };
    //表格的配置项
    var defaultOptins = {
        total: "recordsTotal",
        idField: "", //主键
        tbodyDataName: "rows",
        theadDataName: "columns",
        columns:"",//表头配置项
        tplUrl: "",//模板地址
        ctype: "default", //默认采用的dom结构
        fixed: 0,
        escape: false,//是否进行html转义
        undefinedText: "-",//数据为空时展示的字符
        tips: "未找到符合条件的条目！",//表格无数据时的默认提示
        method: "POST",//表格自带请求数据的方法。
        contentType: "application/x-www-form-urlencoded; charset=UTF-8",//请求头的格式
        dataType: "json",//请求后接受数据的格式
        tbodyService: "",//表格服务
        theadService: "",//表头服务
        thead: false, //头部配置
        url: "",//表格自身请求地址
        theadUrl: "",//表头自身请求地址
        chooseBox: false,//展示多选框 、单选框
        pagination: true,//是否展示分页
        isPageSearch: true,
        pageSize: 10,//一页几条
        coping: true,//是否开启首页与末页
        homePage: '首页',
        endPage: '尾页',
        prevContent: '上页',
        nextContent: '下页',
        jump: true,//是否开启跳转
        jumpBtn: "确定",
        paginationLoop: false,
        cache: false, //是否开启分页缓存
        keepShowPN: false,//是否一直显示上一页，下一页
        isPageShowAll: false,///选择第一是否显示首页，最后一页时是否显示最后一页,
        beforeLoad: false,//用表格加载数据时，加载数据之前的数据处理
        loadSuccess: false,//用表格加载数据时，数据请求成功后的数据处理
        loadFail: false,//用表格加载数据时，数据请求失败后的数据处理
        loadError: false,//用表格加载数据时，数据请求异常后的数据处理
        renderSuccess: false,//表格成功渲染后，执行的回调函数。
        loadTheadSuccess: false,//用表头加载数据时，数据请求成功后的数据处理
        loadTheadFail: false,//用表头加载数据时，数据请求失败后的数据处理
        loadTheadError: false,//用表头加载数据时，数据请求异常后的数据处理
        renderTheadSuccess: false,//表头成功渲染后，执行的回调函数。
        paginationClick: false,//分页按钮点击后，执行的操作。
        onClickTr: false, //单击行函数
        onCheck: false,//单击多选
        onCheckAll: false,//单击全选
        onRadio: false,//单击单选
        checkFn: false,//多选,单选状态变更后
        checkAllFn: false,//全选状态变更后
        clickTrFn: false,//行选中后
        clickTr: false//开启行单击
    };
    //根据 cb-tpl-table获得容器结构
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
        var options = $.extend(true, {}, defaultOptins, $tag.data("options"));
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
        $dom.data("options", options);
        //判断是否采用后台表头-djf
        parseThead($dom, options);
        tableTpl = parseColumns(options);
        loadData($dom, tableTpl, {});
        //为表格添加事件
        addTableEvent($dom);
    };
    //判断是否采用后台表头
    var parseThead = function ($dom, options) {
        var theadDataName = options.theadDataName;
        if (!options["columns"]) {
            ajaxTheadData(options, function (returnData) {
                var fn = getCallBackFn(options["loadTheadSuccess"]);
                if (fn) {
                    //若有加载成功函数，执行此函数
                    returnData = fn(options, returnData);
                }
                options["columns"] = returnData[theadDataName];
            }, function () {});
        }
    };
    //解析表头
    var parseColumns = function (options) {
        var tableTpl = "";
        if (options["tplUrl"]) {
            //若有模板url地址
            TplHelper.getTplByUrl(options["tplUrl"], function (render, str) {
                var tpl = render(options);
                PageCache.setCache(options["cid"] + "_tpl", tpl);
                tableTpl = tpl;
            }, undefined, false);
        } else {
            TplHelper.getTplByStr(tplList["default"], function (render, str) {
                if(!options["columns"]){
                    console.error("表格表头出错，表格停止渲染");
                    return false
                }
                var tpl = render(options);
                PageCache.setCache(options["cid"] + "_tpl", tpl);
                tableTpl = tpl;
            });
        }
        return tableTpl;
    };
    //固定表头
    var fixedHead = function($dom, fixed){
        var $headDiv = $dom.find(".fixed-thead-div");
        var $bodyDiv = $dom.find(".fixed-tbody-div");
        var $bodyDivHead = $bodyDiv.find("table>thead");
        var headHeight = $bodyDivHead.outerHeight()+1;
        var outIndex = 0;
        //复制表格头
        $headDiv.find("table").html($bodyDivHead.clone());
        //给body-div高度赋值
        $bodyDiv.css({
            'max-height':fixed+'',
            'overflow':'auto',
            'min-width':'100%'
        });
        $bodyDiv.find("table").css("margin-top","-"+headHeight+"px");
        $headDiv.css({
            'overflow-y':"scroll",
            'overflow-x':"hidden"
        });
        //为复制的表头动态添加长度，以保证表格的对齐
        var sourceArray = $bodyDivHead.find("th").toArray();
        var targetArray = $headDiv.find("thead th").toArray();
        //for(outIndex = 0; outIndex<targetArray.length; outIndex++){
        //     $(targetArray[outIndex]).css("width",$(sourceArray[outIndex]).outerWidth());
        //}
    };
    //获取表格模板
    var getTableTpl = function (options) {
        var tpl = PageCache.getCache(options["cid"] + '_tpl');
        if (!tpl) {
            //若没有模板，则重新获取模板
            tpl = parseColumns(options);
        }
        return tpl;
    };
    //处理数据
    var paseOptions = function ($table, obj, parsePosition) {
        var options = $table.data("options") || {},
            cid = options["cid"];
        if (!cid) {
            console.error("表格cid出错，表格停止数据加载");
            return false;
        }
        obj = $.extend(true, {}, obj || {});
        $.extend(options, obj || {});
        if (parsePosition == "thead") {
            options = parseTheadOptions(options, obj);
        } else {
            options = paseTbodyOptions(options, obj);
        }
        $table.data("options", options);
        return options;
    };
    //处理表头配置
    var parseTheadOptions = function (options, obj) {
        options["cid"] = options["cid"];
        options["columns"] = undefined;
        options["theadParams"] = $.extend(true, {}, obj["theadParams"] || {});
        return options;
    };
    //处理表格配置
    var paseTbodyOptions = function (options, obj) {
        options["cid"] = options["cid"];
        options["data"] = undefined;
        options["params"] = $.extend(true, {}, obj["params"] || {});
        return options;
    };
    //对外暴露，重新加载表头
    var loadThead = function ($table, obj) {
        var options = paseOptions($table, obj,"thead");
        if (!options) {
            console.error("表格配置项出错，停止数据加载");
            return false;
        }
        var theadDataName = options.theadDataName;
        if(obj[theadDataName]){
            options["columns"] = obj[theadDataName];
        }
        //判断是否通过ajax请求数据
        parseThead($table, options);
        var tableTpl = parseColumns(options);
        loadData($dom, tableTpl, {});
        //替换模板
        parseColumns(options);

        //修改缓存数据
        var tableData = getTableData($table);
        tableData["columns"] = options["columns"];
        setTableData(options.cid,tableData);

        var reloadObj = {};
        if(!reloadTable){
            reloadObj.data = getTableData($table)["ajaxData"];
        }
        loadTable($table,reloadObj);
    };
    //对外暴露，加载数据
    var loadTable = function ($table, obj) {
        //处理表格配置
        var options = paseOptions($table, obj);
        if (!options) {
            console.error("表格配置项出错，停止数据加载");
            return false;
        }
        var tpl = getTableTpl(options);
        var renderSuccess = getCallBackFn(options["renderSuccess"]);
        if (obj["data"]) {
            Loading.loading($table);
            loadData($table, tpl, obj["data"]);
            //执行渲染成功函数
            renderSuccess && renderSuccess($table);
            //加载分页 分页 对的 就是加载分页。
            options["pagination"] && loadPagination($table, $table.find(".M-box"), obj["data"]);
            options["checkAll"] && $table.find(".jc-check-all").trigger("click");
            Loading.removeAll();
        } else {
            Loading.loading($table);
            dataAjax(options, function (returnData) {
                loadData($table, tpl, returnData);
                renderSuccess && renderSuccess($table);
                //加载分页 分页 对的 就是加载分页。
                options["pagination"] && loadPagination($table, $table.find(".M-box"), returnData);
                options["checkAll"] && $table.find(".jc-check-all").trigger("click");
            }, function (returnData) {

            });

        }
    };
    //分页加载
    //加载分页
    var loadPagination = function ($table, $pagination, data) {
        var pathName = window.document.location.pathname;
        pathName = pathName.substring(0, pathName.substr(1).indexOf('/views') + 1);
        $("head").append("<link rel='stylesheet'  href='" + pathName + "/plugins/pagination/style/pagination.css" + "'>");
        var options = $table.data("options");
        $pagination.pagination({
            current: data.current || (options["params"] || {})["current"],
            coping: options.coping,
            homePage: options.homePage,
            endPage: options.endPage,
            prevContent: options.prevContent,
            nextContent: options.nextContent,
            totalData: data[options["total"]],
            showData: options.pageSize,
            keepShowPN: options.keepShowPN,
            isPageShowAll: options.isPageShowAll,
            jump: options.jump,
            jumpBtn: options.jumpBtn,
            isPageSearch: options.isPageSearch,
            isHide: false,
            callback: function (api) {
                var data = {},
                    current = api.getCurrent() + "";
                data.params = options["params"] || {};
                //缓存数据开启后，进行读取缓存数据的操作,现在不支持
                var fn = getCallBackFn(options["paginationClick"]);
                if (fn) {
                    //若有加载成功函数，执行此函数
                    data = fn(options, data, current);
                } else {
                    data.params["current"] = current;
                }
                ;
                if (!data) {
                    return false;
                }
                loadTable($table, data);
            }
        });
    };
    //目的，根据参数请求数据，仅此而已-注（加载表格数据）
    var dataAjax = function (options, sucessF, failF) {
        var cid = options["cid"];
        var data = {};
        var params = {};
        params = options["params"] || {};
        params.service = options.tbodyService;
        params.current = params.current || "1";
        params.pageSize = options.pageSize;
        data["params"] = params;
        data.url = options.tbodyUrl || options.url || false;
        // data.url = "table_data.json";
        data.type = options.method;
        data.datatype = options.dataType;
        data.successF = function (returnData) {
            var fn = getCallBackFn(options["loadSuccess"]);
            if (fn) {
                //若有加载成功函数，执行此函数
                returnData = fn(options, returnData);
            }
            if (!returnData) {
                return false;
            }
            sucessF(returnData);
        };
        data.failF = function (returnData) {
            var fn = getCallBackFn(options["loadFail"]);
            if (fn) {
                //若有加载失败函数，执行此函数
                returnData = fn(options, returnData);
            }
            if (!returnData) {
                return false;
            }
            layer.alert(returnData.respDesc || "系统繁忙", {
                icon: 'error',
                skin: 'layui-blue'
            });
            failF(returnData);
        };
        data.errorF = function (XMLHttpRequest, textStatus, errorThrown) {
            var fn = getCallBackFn(options["loadError"]);
            if (fn) {
                //若有加载失败函数，执行此函数
                fn(options, XMLHttpRequest, textStatus, errorThrown);
            } else {
                layer.alert("网络异常", {
                        icon: 'error',
                        skin: 'layui-blue'
                    }
                );
            }
        };
        // 执行beforeAjax的函数，来改变一些参数
        var fn = getCallBackFn(options["beforeLoad"]);
        if (fn) {
            //若有加载失败函数，执行此函数
            data = fn(options, data);
        }
        ;
        if (!data) {
            return false;
        }
        //执行ajax函数
        CommonAjax.ajax(data);


    };
    //目的，根据参数请求数据，仅此而已-注（加载表头数据）
    var ajaxTheadData = function (options, sucessF, failF) {
        var cid = options["cid"];
        var data = {};
        var params = {};
        params = options["TheadParams"] || {};
        params.service = options.theadService;
        data["params"] = params;
        data.url = options.theadUrl || false;
        // data.url = "table_data.json";
        data.type = options.method;
        data.async = false;
        data.datatype = options.dataType;
        data.successF = function (returnData) {
            var fn = getCallBackFn(options["loadTheadSuccess"]);
            if (fn) {
                //若有加载成功函数，执行此函数
                returnData = fn(options, returnData);
            }
            if (!returnData) {
                return false;
            }
            sucessF(returnData);
        };
        data.failF = function (returnData) {
            var fn = getCallBackFn(options["loadTheadFail"]);
            if (fn) {
                //若有加载失败函数，执行此函数
                returnData = fn(options, returnData);
            }
            if (!returnData) {
                return false;
            }
            layer.alert(returnData.respDesc || "系统繁忙", {
                icon: 'error',
                skin: 'layui-blue'
            });
            failF(returnData);
        };
        data.errorF = function (XMLHttpRequest, textStatus, errorThrown) {
            var fn = getCallBackFn(options["loadTheadError"]);
            if (fn) {
                //若有加载失败函数，执行此函数
                fn(options, XMLHttpRequest, textStatus, errorThrown);
            } else {
                layer.alert("请求表头网络异常", {
                        icon: 'error',
                        skin: 'layui-blue'
                    }
                );
            }
        };
        // 执行beforeAjax的函数，来改变一些参数
        var fn = getCallBackFn(options["beforeLoadThead"]);
        if (fn) {
            //若有加载失败函数，执行此函数
            data = fn(options, data);
        }
        if (!data) {
            return false;
        }
        //执行ajax函数
        CommonAjax.ajax(data);


    };
    //底层 刷新全部表格内容的接口
    var loadData = function ($table, templateHtml, data) {
        var options = $table.data("options"),
            selectLength = 0,
            dataLength = 0,
            tbodyDataName = options["tbodyDataName"];
        var ajaxData = $.extend({}, data);
        data = $.extend(true, {}, data);
        data["ajaxData"] = ajaxData;
        data["rows"] = data[tbodyDataName];
        data["options"] = options;
        //最后处理数据和生成序列号
        if (data["rows"]) {
            for (var i = 0; i < data["rows"].length; i++) {
                var trMajorKey = "xiaomiao" + i + new Date().getTime();
                data["rows"][i]["serialNumber"] = i + 1;
                data["rows"][i]["trIndex"] = i;
                if (!data["rows"][i]["trMajorKey"]) {
                    data["rows"][i]["trMajorKey"] = trMajorKey;
                }
            }
        } else {
            data["rows"] = [];
        }
        data["hasHead"] = "1";
        var render = template.compile(templateHtml);
        $table.find(".cb-tpl-table-area .fixed-tbody-div").html(render(data));
        //是否固定表头
        options.fixed && fixedHead($table,options.fixed);
        if (data["rows"].length < 1) {
            $table.find("tbody").html('<tr class="noData"><td colspan="' + $table.find("th").length + '"><i></i>' + options["tips"] + '</td></tr>');
        }
        setTableData(options["cid"], data);
        $.each(data["rows"], function (index, value) {
            if (value["isChecked"] == "1") {
                selectLength += 1;
            }
        });
        dataLength = data["rows"].length;
        if (dataLength > 0) {
            selectLength >= dataLength ? $table.find(".tydic-check-all").addClass("active") : $table.find(".tydic-check-all").removeClass("active");
        }
    };
    //获得函数
    var getCallBackFn = function (fnName) {
        if (!fnName) {
            return undefined;
        }
        var fn = fnName;
        if (typeof fn === "function") {
            return fn;
        } else {
            fn = FnList.getFn(fnName);
            if (fn) {
                return fn;
            } else {
                return undefined;
            }
        }
    };
    //表格表头渲染时，判断宽度类型，并赋值予不同的位置
    var widthDeal = function (value, type) {
        var state = "auto";
        switch (type) {
            case "%" :
                value && (value.indexOf("%") != -1) && (state = value);
                break;
            case "px" :
                value && (value.indexOf("px") != -1) && (state = value);
                break;
        }
        return state;
    };
    //表格内容渲染时 首先执行的数据处理函数
    var tableFormatter = function (value, options, rows, index, field) {
        var columns = options["columns"] || [],
            formatter = "";
        $.each(columns, function (index, val) {
            if (val.field == field) {
                formatter = val.formatter;
                return false;
            }
        });
        formatter = getCallBackFn(formatter);
        if (formatter) {
            //若有加载成功函数，执行此函数
            value = formatter(options, value, rows[index], index, field);
        }
        ;
        if (value || value === 0) {
            return value;
        } else {
            return options["undefinedText"];
        }
    };
    //获得表格所有数据
    var getTableData = function ($table) {
        if ($table.attr("tagtype") != "cb-tpl-table") {
            console.error("传入表格错误，数据异常");
        }
        var options = $table.data("options"),
            cid = options["cid"];
        dataList = PageCache.getCache(cid + "_data") || {};
        return dataList;
    };
    //更新表格数据
    var setTableData = function (cid, data) {
        PageCache.setCache(cid + "_data", data);
    };
    //表格事件添加
    var addTableEvent = function ($table) {
        //多选框单击
        $table.on("click", ".tydic-table-check", function (event) {
            event.stopPropagation();
            var $td = $(this),
                options = $table.data("options"),
                trId = $td.closest("tr").data("index"), //当前行id
                selectLength = 0,
                dataList = getTableData($table),
                rows = dataList["rows"] || [],
                dataLength = rows.length,
                onCheck = getCallBackFn(options["onCheck"]),
                status = true;
            if (onCheck) {
                status = onCheck.call(this, options, rows[trId], trId, $td.hasClass("active"));
                if (status) {
                    $td.addClass("active");
                    checkedStatus.call(this, $table, trId, true);
                } else {
                    $td.removeClass("active");
                    checkedStatus.call(this, $table, trId, false);
                }
            } else {
                if ($td.hasClass("active")) {
                    $td.removeClass("active");
                    checkedStatus.call(this, $table, trId, false);
                } else {
                    $td.addClass("active");
                    checkedStatus.call(this, $table, trId, true);
                }
            }
            //取出新的数据
            dataList = getTableData($table),
                rows = dataList["rows"] || [],
                dataLength = rows.length,
                $.each(rows, function (index, value) {
                    if (value["isChecked"] == "1") {
                        selectLength += 1;
                    }
                });
            selectLength >= dataLength ? $table.find(".tydic-check-all").addClass("active") : $table.find(".tydic-check-all").removeClass("active");
        });
        //全选框单击
        $table.on("click", ".tydic-check-all", function (event) {
            event.stopPropagation();
            var $td = $(this),
                options = $table.data("options"),
                dataList = getTableData($table),
                rows = dataList["rows"] || [],
                onCheckAll = getCallBackFn(options["onCheckAll"]),
                status = true;
            if (onCheckAll) {
                status = onCheckAll.call(this, options, rows, $td.hasClass("active"));
                if (status) {
                    $td.addClass("active");
                    checkAll($td, $table, true);
                } else {
                    $td.removeClass("active");
                    checkAll($td, $table, false);
                }
            } else {
                if ($td.hasClass("active")) {
                    $td.removeClass("active");
                    checkAll($td, $table, false);
                } else {
                    $td.addClass("active");
                    checkAll($td, $table, true);
                }
            }
        });
        //单选框单击
        $table.on("click", ".tydic-table-radio", function (event) {
            event.stopPropagation();
            var $td = $(this),
                options = $table.data("options"),
                trId = $td.closest("tr").data("index"), //当前行id
                dataList = getTableData($table),
                rows = dataList["rows"] || [],
                onRadio = getCallBackFn(options["onRadio"]),
                status = true;
            if (onRadio) {
                status = onRadio.call(this, options, rows[trId], trId, $td.hasClass("active"));
                if (status) {
                    $table.find(".tydic-table-radio").each(function (index, item) {
                        if ($(this).hasClass("active")) {
                            $(this).removeClass("active");
                            checkedStatus.call(this, $table, $(this).closest("tr").data("index"), false);
                        }
                    });
                    $td.addClass("active");
                    checkedStatus.call(this, $table, trId, true);
                } else {
                    $td.removeClass("active");
                    checkedStatus.call(this, $table, trId, false);
                }
            } else {
                if ($td.hasClass("active")) {
                    $td.removeClass("active");
                    checkedStatus.call(this, $table, trId, false);
                } else {
                    $table.find(".tydic-table-radio").each(function (index, item) {
                        if ($(this).hasClass("active")) {
                            $(this).removeClass("active");
                            checkedStatus.call(this, $table, $(this).closest("tr").data("index"), false);
                        }
                    });
                    $td.addClass("active");
                    checkedStatus.call(this, $table, trId, true);
                }
            }
        });
        //行单击
        $table.on("click", ".tydic-table-tr", function (event) {
            event.stopPropagation();
            var $tr = $(this),
                trId = $tr.data("index"), //当前行id
                options = $table.data("options"),
                dataList = getTableData($table) || {},
                rows = dataList["rows"] || [],
                row = rows[trId],
                onClickTr = getCallBackFn(options["onClickTr"]),
                status = true;
            if (onClickTr) {
                status = onClickTr.call(this, options, row, trId, $tr.hasClass("active"));
                if (status) {
                    clickStatus.call(this, $table, trId, false);
                    $tr.removeClass("active");
                } else {
                    clickStatus.call(this, $table, trId, true);
                    $tr.addClass("active");
                }
            } else {
                if ($tr.hasClass("active")) {
                    clickStatus.call(this, $table, trId, false);
                    $tr.removeClass("active");
                } else {
                    clickStatus.call(this, $table, trId, true);
                    $tr.addClass("active");
                }
            }
        });
        //操作按钮单击 state
        $table.on("click", ".tydic-table-state", function (event) {
            event.stopPropagation();
            cellOperate.call(this, $table);
        });
        //表格 focusout按钮
        $table.on("focusout", ".tydic-table-focusout", function (event) {
            event.stopPropagation();
            cellOperate.call(this, $table);
        });
        $table.find(".fixed-tbody-div").on("scroll",function(){
            $(this).siblings(".fixed-thead-div").scrollLeft($(this).scrollLeft());
        });
    };
    //表格单元格操作
    var cellOperate = function ($table) {
        var $cell = $(this),
            $td = $cell.closest("td"),
            field = $td.data("field") || "",
            trId = $cell.closest("tr").data("index"), //当前行id
            options = $table.data("options"),
            tdOptions = $cell.data("options"),
            dataList = getTableData($table) || {},
            rows = dataList["rows"] || [],
            row = rows[trId] || {},
            fnName = $cell.data("fn-name"),
            stateFn = getCallBackFn(fnName);
        stateFn && stateFn.call(this, options, tdOptions, row, trId, field);
    };
    //多选按钮状态变更
    var checkedStatus = function ($table, trId, status) {
        var options = $table.data("options"),
            dataList = getTableData($table),
            rows = dataList["rows"] || [],
            row = rows[trId] || {},
            checkFn = getCallBackFn(options["checkFn"]);
        if (status) {
            // 若status为true，则表明要选中
            row["isChecked"] = "1";
        } else {
            //若status为false，则表明要取消选中状态
            delete row["isChecked"];
        }
        setTableData(options["cid"], dataList);
        checkFn && checkFn.call(this, options, row, trId, status);
    };
    //行状态改变
    var clickStatus = function ($table, trId, status) {
        var options = $table.data("options"),
            dataList = getTableData($table),
            rows = dataList["rows"] || [],
            row = rows[trId] || {},
            clickTrFn = getCallBackFn(options["clickTrFn"]);
        if (status) {
            // 若status为true，则表明要选中
            row["isClicked"] = "1";
        } else {
            //若status为false，则表明要取消选中状态
            delete row["isClicked"];
        }
        setTableData(options["cid"], dataList);
        clickTrFn && clickTrFn.call(this, options, row, trId, status);
    };
    // 全选按钮 状态变更
    var checkAll = function ($td, $table, status) {
        var options = $table.data("options"),
            dataList = getTableData($table),
            rows = dataList["rows"] || [],
            checkAllFn = getCallBackFn(options["checkAllFn"]);
        $table.find("tbody .tydic-table-check").each(function (index, item) {
            var $td = $(this),
                trId = $td.closest("tr").data("index"),
                isHide = $td.closest("tr").hasClass("hide");
            if ($td.hasClass("active")) {
                status || checkedStatus.call(this, $table, trId, status);
            } else {
                (status && !isHide) && checkedStatus.call(this, $table, trId, status);
            }
            status ? $td.addClass("active") : $td.removeClass("active");
        });
        checkAllFn && checkAllFn.call($td, options, rows, status);
    };
    //对外暴露，获得表格已选数据的API
    var getSelectedData = function ($table) {
        var dataList = getTableData($table) || {}
        var data = dataList["rows"] || [];
        var rows = [];
        var index = 0;
        for (index = 0; index < data.length; index++) {
            if (data[index]["isChecked"] == "1") {
                delete data[index]["isChecked"];
                rows.push(data[index]);
            }
        }
        return rows;
    };
    //对外暴露，获得表格已点击数据的API
    var getClickData = function ($table) {
        var dataList = getTableData($table) || {}
        var data = dataList["rows"] || [];
        var rows = [];
        var index = 0;
        for (index = 0; index < data.length; index++) {
            if (data[index]["isClicked"]) {
                delete data[index]["isClicked"];
                rows.push(data[index]);
            }
        }
        return rows;
    };
    //对外暴露，获得表格未选数据的API
    var getNoSelectedData = function ($table) {
        var dataList = getTableData($table) || {}
        var data = dataList["rows"] || [];
        var rows = [];
        var index = 0;
        for (index = 0; index < data.length; index++) {
            if (data[index]["isChecked"] !== "1") {
                rows.push(data[index]);
            }
        }
        return rows;
    };
    //对外暴露，取消所有表格点击状态
    var unClickAllRow = function ($table) {
        var dataList = getTableData($table) || {};
        var data = dataList["rows"] || [];
        var options = $table.data("options");
        $table.find("tbody tr").removeClass("active");
        $.each(data, function (index, value) {
            if (value["isClicked"])
                delete value["hasClick"];
        });
        setTableData(options["cid"], dataList);
    };
    //对外暴露，取消所有表格点击状态
    var unCheckAllRow = function ($table) {
        var dataList = getTableData($table) || {};
        var data = dataList["rows"] || [];
        var options = $table.data("options");
        $table.find(".jc-table-check").removeClass("active");
        $table.find(".jc-check-all").removeClass("active");
        $table.find(".jc-table-radio").removeClass("active");
        $.each(data, function (index, value) {
            if (value["isChecked"] == "1")
                delete value["isChecked"];
        });
        setTableData(options["cid"], dataList);
    };
    //对外暴露，获取数据在表格中的位置
    var getDataIndex = function ($table, trData, sign) {
        var dataList = getTableData($table) || {};
        var data = dataList["rows"] || [];
        var options = $table.data("options");
        var trIndex = undefined;
        $.each(data, function (index, value) {
            if (value[sign || "trMajorKey"] == trData[sign || "trMajorKey"]) {
                trIndex = index;
                return false;
            }
        });
        return trIndex;
    };
    //对外暴露，获取指定行数据的API
    var getDataFrom = function ($table, index) {
        var dataList = getTableData($table) || {};
        var data = dataList["rows"] || [];
        return data[index] || [];
    };
    //对外暴露，获得表格所有数据的API
    var getAllTableData = function ($table) {
        var dataList = getTableData($table) || [];
        var data = dataList["rows"] || [];
        return data;
    };
    //对外暴露，表格全选的API
    var checkAllRow = function ($table) {
        $table.find(".tydic-check-all").trigger("click");
    };
    //对外暴露，获取选中数据的主键集合
    var getSelectedIdFeild = function ($table) {
        var dataList = getTableData($table) || {}
        var data = dataList["rows"] || [];
        var rows = [];
        var index = 0;
        var options = $table.data("options");
        var idField = options["idField"];
        if (!idField) {
            console.error("表格为配置主键名");
            return [];
        }
        for (index = 0; index < data.length; index++) {
            if (data[index]["isChecked"] == "1") {
                delete data[index]["isChecked"];
                rows.push(data[index][idField]);
            }
        }
        return rows;
    };
    //对外暴露，根据表格原有的参数，刷新表格
    var refreshTable = function ($table) {
        var options = $table.data("options");
        var params = options["params"] || {};
        loadTable($table, {params: params});
    };
    // 对外暴露，获得表格请求的参数
    var getTableAjaxParams = function ($table) {
        var options = $table.data("options");
        var params = options["params"] || {};
        return params;
    };
    //对外暴露  更新表格数据层的单元格内容
    var updateCell = function ($table, index, field, value) {
        var options = $table.data("options");
        var cid = options.cid;
        var dataList = getTableData($table) || [];
        var data = dataList["rows"] || [];
        data[index][field] = value;
        setTableData(cid, dataList);
    };
    if (typeof TplHelper !== "undefined") {
        TplHelper.helper('tableFormatter', tableFormatter);
        TplHelper.helper('widthDeal', widthDeal);
    }
    return {
        initTag: initTag,
        initHtml: initHtml,
        loadTable: loadTable,
        loadThead: loadThead,
        getSelectedData: getSelectedData,
        getClickData: getClickData,
        getNoSelectedData: getNoSelectedData,
        unCheckAllRow: unCheckAllRow,
        unClickAllRow: unClickAllRow,
        getDataIndex: getDataIndex,
        getAllTableData: getAllTableData,
        getDataFrom: getDataFrom,
        checkAllRow: checkAllRow,
        getSelectedIdFeild: getSelectedIdFeild,
        refreshTable: refreshTable,
        getTableAjaxParams: getTableAjaxParams,
        updateCell: updateCell

    };
})();

//注册CbShowList组件
ParsingHelper.registerComponent("cb-tpl-table", CbTplTable);
