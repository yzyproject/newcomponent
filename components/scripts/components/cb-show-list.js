/*
 * cb-show-list 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbShowList = (function () {
//保存容cb-show-list组件结构的列表
    //cb-show-list组件结构列表
    var onSelect;
    var domDivList = {
        default: '    <div class="cb-show-list-div clearfix">' +
        '    </div>',
        Tip: '    <div class="cb-show-list-div clearfix">' +
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

    //根据 cb-show-list获得容器结构
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
    }


//node端解析入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        if(options.ctype){
            options["domDiv"]=options.ctype;
        }
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        if(options.ctype === "orange" || !options.ctype){
            $dom.addClass('cb-show-list-orange');
        }
        if(options.ctype === "blue"){
            $dom.addClass('cb-show-list-blue');
        }
        if(options.ctype === "tip"){
            $dom.addClass('cb-show-list-tip');
        }
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
        if(options.onValued){
            onSelect = new Function('$dom',options.onValued);
        } else{
            onSelect = function ($dom) {
                $dom.parents('div[tagtype="cb-floating-panel"]').hide();
            };

        }

        if (options.isRequest !== true || options.isRequest !== 'true') {
            initData($dom, options, tagIndex);
        }
    };

    var initData = function ($dom, options, tagIndex) {
        //ajax加载请求数据
        if (options.service || options.url) {
            var list = options.listName;
            var serviceId = options.service;
            var data = {
                "type": options.type ? options.type : 'POST',
                "url": options.url ? options.url : false,
                "params": {
                    "service": serviceId
                },
                "successF": function (returnData) {
                    var dataList = {};
                    dataList.tagIndex = tagIndex;
                    dataList.option = returnData[list];
                    dataList.name = options.name;
                    dataList.valueName = options.valueName;
                    dataList.textName = options.textName;
                    var html = "";
                    var templateName ='';
                    options.name?templateName=options.name:templateName='initListAjaxDate';
                    TemplateHelper.parseOptions(templateName, options.name, dataList, "");
                    html = TemplateHelper.render(options.name, dataList);
                    $dom.append(html);
                    operationDom($dom);
                    if(options.isDefaultSelected){
                        $dom.find('li').eq(0).children('span').trigger("click");
                    }
                },
                //业务数据有误的提示 带确认
                "errorF": function (value1, value2, value3) {
                }
            };
            CommonAjax.ajax(data);
        } else {
            //没有请求
            options.tagIndex = tagIndex;
            options.option =  options.localDataList;
            var html = "";
            TemplateHelper.parseOptions("initListDate", options.name, options, "");
            html = TemplateHelper.render(options.name, options);
            $dom.append(html);
            operationDom($dom);
        }
    };

    var operationDom = function ($dom) {
        var options = $dom.data('options');
        $dom.find('li').children('span').on('click',function () {
            var $this = $(this);
            if(!$this.hasClass('active')){
                $this.addClass('active');
                $this.parents('li').siblings().children('span').removeClass('active');
                $dom.data('id',$this.data('id'));
                $dom.data('text',$this.html());
                onSelect($dom);
            }
        });
    };
    return {
        initTag: initTag,
        initHtml: initHtml
    };
})();

//注册CbShowList组件
ParsingHelper.registerComponent("cb-show-list", CbShowList);