
/*
 * cb-custom-table 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbCustomTable = (function () {
//保存容cb-custom-table组件结构的列表
    //cb-custom-table组件结构列表
    var domDivList = {
        default: '    <div class="cb-custom-table-div clearfix " style="overflow: auto">' +
        '<table class="table ">' +
        '<thead></thead>' +
        '<tbody></tbody>' +
        '</table>' +
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

    //根据 cb-custom-table获得容器结构
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

        var html="<tr>";
        if(options.isHasSelectBtn){
            html += '<th><input type="checkbox" class = "checkbox-all"></th>';
        }
        for(var i=0;i<options.tableOptions.length;i++){
            html+='<th data-filed="'+options.tableOptions[i].field+'">'+options.tableOptions[i].content+'</th>';
        }
        html+="</tr>";
        $dom.find('table').find('thead').append(html);

        var htmlTbody = '<tr>';
        if(options.isHasSelectBtn){
            htmlTbody += '<td><input type="checkbox" class = "checkbox-single"></td>';
        }
        for(var i=0;i<options.tableOptions.length;i++){
                var regexpIfo="";
                var regexpOptionsData =options.tableOptions[i].itemOptionsData.regexpOptions;
                if(regexpOptionsData){
                    for(var j=0;j<regexpOptionsData.length;j++){
                        regexpIfo +=regexpOptionsData[j].regexpName;
                        if(regexpOptionsData[j].regexpRemark){
                            regexpIfo +="-";
                            regexpIfo +=regexpOptionsData[j].regexpRemark;
                        }
                        if(j != (regexpOptionsData.length-1)){
                            regexpIfo +=","
                        }
                    }
                }
            if(options.tableOptions[i].bindEvent && !options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp = "'+regexpIfo+'" '+options.tableOptions[i].bindEvent+'="'+options.tableOptions[i].bindFunction+','+options.tableOptions[i].bindInfo+'" data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else if(!options.tableOptions[i].bindEvent && options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp="'+regexpIfo+'"  listen={"'+options.tableOptions[i].listenInfo+'":"'+options.tableOptions[i].listenFunction+'"} data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else if(options.tableOptions[i].bindEvent && options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp="'+regexpIfo+'"  '+options.tableOptions[i].bindEvent+'="'+options.tableOptions[i].bindFunction+','+options.tableOptions[i].bindInfo+'"  listen={"'+options.tableOptions[i].listenInfo+'":"'+options.tableOptions[i].listenFunction+'"} data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else{
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp = "'+regexpIfo+'" data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            }
        }
        
        htmlTbody+="</tr>";
        $dom.find('table').find('tbody').append(htmlTbody);

        Macro.macroCommand($tag, $dom, options);
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
        checkboxFunction($dom)
    };
    var cloneTr = function ($dom,options,$target){
            var htmlTbody = '<tr>';
        if(options.isHasSelectBtn){
            htmlTbody += '<td><input type="checkbox" class = "checkbox-single"></td>';
        }
        for(var i=0;i<options.tableOptions.length;i++){
            var regexpIfo="";
            var regexpOptionsData =options.tableOptions[i].itemOptionsData.regexpOptions;
            if(regexpOptionsData){
                for(var j=0;j<regexpOptionsData.length;j++){
                    regexpIfo +=regexpOptionsData[j].regexpName;
                    if(regexpOptionsData[j].regexpRemark){
                        regexpIfo +="-";
                        regexpIfo +=regexpOptionsData[j].regexpRemark;
                    }
                    if(j != (regexpOptionsData.length-1)){
                        regexpIfo +=","
                    }
                }
            }
            if(options.tableOptions[i].bindEvent && !options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp = "'+regexpIfo+'" '+options.tableOptions[i].bindEvent+'="'+options.tableOptions[i].bindFunction+','+options.tableOptions[i].bindInfo+'" data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else if(!options.tableOptions[i].bindEvent && options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp="'+regexpIfo+'"  listen={"'+options.tableOptions[i].listenInfo+'":"'+options.tableOptions[i].listenFunction+'"} data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else if(options.tableOptions[i].bindEvent && options.tableOptions[i].listenInfo){
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp="'+regexpIfo+'"  '+options.tableOptions[i].bindEvent+'="'+options.tableOptions[i].bindFunction+','+options.tableOptions[i].bindInfo+'"  listen={"'+options.tableOptions[i].listenInfo+'":"'+options.tableOptions[i].listenFunction+'"} data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            } else{
                htmlTbody+='<td><form><'+options.tableOptions[i].item+' regexp = "'+regexpIfo+'" data-options = '+JSON.stringify(options.tableOptions[i].itemOptionsData)+'></'+options.tableOptions[i].item+'></form></td>';
            }
        }

            htmlTbody+="</tr>";
        //var $htmlTbody = $(htmlTbody);
        if($target){
            $target.after(htmlTbody);
            var $parsing = $target.next("tr");
            var $bind = $target.next("tr");
        }else{
            $dom.find('table').find('tbody').append(htmlTbody);
            var $parsing = $dom.find('table').find('tbody').find('tr').eq($dom.find('table').find('tbody').find('tr').length-1);
            var $bind = $dom.find('table').find('tbody').find('tr').eq($dom.find('table').find('tbody').find('tr').length-1);
        }

            //解析标签
            ParsingHelper.parsingTag();
            //二次解析标签
            ParsingHelper.parsinghtml($parsing);
            //标签解析完毕后，进行事件绑定与校验绑定
            InitModal.initHtml($bind);

    };

    var checkboxFunction = function ($dom) {
        $dom.on("click", ".checkbox-all", function () {
            if ($(this).prop("checked")) {
                $dom.find('tbody').find('tr').each(function () {
                    $(this).find('input.checkbox-single').prop("checked", true);
                })
            } else {
                $dom.find('tbody').find('tr').each(function () {
                    $(this).find('input.checkbox-single').prop("checked", false);
                })
            }
        });
        $dom.on("click",".checkbox-single",function () {
            if($(this).prop("checked")){
                var isTrue = true;
                $dom.find('tbody').find('tr').each(function () {
                    if(!$(this).find('input.checkbox-single').prop("checked")){
                        isTrue = false;
                        return false;
                    }
                    if(isTrue){
                        $dom.find('.checkbox-all').prop("checked",true);
                    } else{
                        $dom.find('.checkbox-all').prop("checked",false);
                    }
                })
            } else{
                $dom.find('.checkbox-all').prop("checked",false);
            }
        })
    };

    return {
        initTag: initTag,
        initHtml: initHtml,
        cloneTr:cloneTr
    };
})();

//注册CbCustomTable组件
ParsingHelper.registerComponent("cb-custom-table", CbCustomTable);