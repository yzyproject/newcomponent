/*
 * cb-table 2.0.0
 * author： niulei
 * Time: 2017.4.25
 * description: 原子表格组件，组件功能为组基础的展示功能
 */

var CbTable = (function () {

  var domDivList = {
    "default": '<div class="cb-table-div clearfix" >'+
    '<div class="fixed-table-head clearfix">'+
    '<table class="cb-head-table"></table>'+
    '</div>'+
    '<div class="fixed-table-body clearfix">'+
    '<table class="cb-table"><thead></thead><tbody></tbody></table>'+
    '</div>'+
    '</div>'

  };

  //组件数据缓存列表
  var tableOptions = {

  };

  var getData = function (cid) {
    return tableOptions[cid];
  };
  var setData = function (cid,object) {
    tableOptions[cid] = object;
  };
  var getDomDiv = function (domDivName) {
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
  };
  //默认属性配置
  var getTagOptions ;
  (function () {
    var options = {
      ctype: "default",
      fixed:false,
      escape:false,
      hideHead:false,
      undefinedText:"-",
      headData:[],
      bodyData:[]
    };
    getTagOptions = function () {
      return $.extend(true, {}, options);
    }
  })();

  //node端解析标签的入口
  var initTag = function ($tag) {
    //获得具体的配置项
    var options = $.extend(getTagOptions(), $tag.data("options"));
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
    var cid = $dom.attr("cid");
    var tagIndex = $dom.data("tagindex");
    var options = getData(cid) || $dom.data("options");
    if(options["hasInit"]){
      //若外层表格主导，则退出
      return false;
    }
    options["hasInit"] = true;
    $dom.removeAttr("data-options");
    //表头初始化
    initHead($dom, options);
    //表格tbody初始化
    initBody($dom, options);
    //更新页面的数据
    setData(cid,options);
    options = null ;
  };

  //处理一些参数
  var ParseOptions = function (options, escape, undefinedText) {
    options["escape"]=escape;
    options["undefinedText"]=undefinedText;
  }

  //设置表头thead的函数
  var initHead = function($dom, options, append){
    if(!options.headData || options.hideHead){
      //无表头配置或配置了隐藏表头，则退出函数
      console.error("表头配置出错或未配置表头");
      return false;
    }
    //dongjingfeng 修改表格width
    options.width && $dom.find("table").css("width",options.width).parent().css("width",options.width);
    //获得headData参数
    var headData = options.headData;
    //处理一些参数
    ParseOptions(headData, options.escape, options.undefinedText);
    var html = macroCommand( headData, "th");
    if(append){
      $dom.find(".cb-table thead").append(html);
      options["fixed"] && loadFixedHead($dom, html, options["fixed"]);
    }else{
      $dom.find(".cb-table thead").html(html);
      options["fixed"] && loadFixedHead($dom, html, options["fixed"]);
    }
    options = null;
  };
  var loadFixedHead = function ($dom, html, fixed) {
    var sourceHead = $dom.find(".cb-table thead");
    var targetHead = $dom.find(".cb-head-table");
    var sourceArray = "";
    var targetArray = "";
    var outIndex = 0;
    var tableLength = 0;
    //复制一份表头
    targetHead.html("");
    sourceHead.clone().appendTo(targetHead);
    //为复制的表头动态添加长度，以保证表格的对齐
    sourceArray = sourceHead.find("th>div").toArray();
    targetArray = targetHead.find("thead th>div").toArray();
    for(outIndex = 0; outIndex<targetArray.length; outIndex++){
      if($(sourceArray[outIndex]).outerWidth() !== $(targetArray[outIndex]).outerWidth() ){
        //若不等于，则重新设置宽度值
        $(targetArray[outIndex]).css("width",$(sourceArray[outIndex]).outerWidth());
      }
    }
    //将表格内容向上提升
    $dom.find(".cb-table").css("margin-top","-"+sourceHead.outerHeight()+"px")
    //为表格内容区域设置最大高度
    $dom.find(".fixed-table-body").css("max-height",fixed);
    //为头部DIV设置宽度
    // tableLength = $dom.find(".cb-table").outerWidth();
    // console.log(tableLength);
    $dom.find(".fixed-table-body").css("overflow-y","scroll");
    $dom.find(".fixed-table-head").css("overflow-y","scroll");



  }
  //设置表格tbody的函数
  var initBody = function($dom, options, append){
    if(!options.bodyData){
      //无表格配置，则退出函数
      console.error("表格配置出错或未配置表格");
      return false;
    }
    var bodyData = options.bodyData;
    //处理一些参数
    ParseOptions(bodyData, options.escape, options.undefinedText);
    var html =macroCommand( bodyData, "td");
    if(append){
      $dom.find(".cb-table tbody").append(html);
      options["fixed"] && loadFixedHead($dom, html, options["fixed"]);
    }else{
      $dom.find(".cb-table tbody").html(html);
      options["fixed"] && loadFixedHead($dom, html, options["fixed"]);
    }
    options = null;

  };
  //表格内容解析的宏命令
  var macroCommand = function( options, cell) {
    var html = "";
    //初始化数据结构
    parsingData(options);
    //根据merge来进行合并
    mergeData(options);
    //根据数据来合成表格
    html = mergeTable(options,cell);
    options = null;
    return html;
  }
  //合成表格内容
  var mergeTable = function (options,cell) {
    var data = options.data || [];
    var html = "";
    var tr = "";
    var str = {};
    var celStyle = "";
    var outIndex = 0;
    var inIndex = 0;
    for(outIndex = 0; outIndex < data.length; outIndex++){
      tr = "<tr data-index='"+outIndex+"'>";
      for(inIndex = 0;inIndex < data[outIndex].length; inIndex++){
        str = data[outIndex][inIndex];
        celStyle = "";
        if(str["width"]){
          celStyle+="width:"+str["width"]+";";
        }
        if(!str["rubbish"]){
          if(celStyle){
            //dongjingfeng 判断width为具体像素值还是相对值

            if(celStyle.indexOf("%")<0){
              tr = tr + "<"+cell+" class='"+str["class"]+"' data-field='"+str["field"]+"' rowspan='"+str["rowspan"]+"' colspan='"+str["colspan"]+"'>"+"<div class='width-cell-div "+(str["class"] || "")+"'style='"+celStyle+"'>"+str["contents"]+"</div>"+"</"+cell+">";
            }else{
              tr = tr + "<"+cell+" class='"+str["class"]+"' data-field='"+str["field"]+"' rowspan='"+str["rowspan"]+"' colspan='"+str["colspan"]+"' style='"+celStyle+"'>"+"<div class='width-cell-div "+(str["class"] || "")+"'style='100%'>"+str["contents"]+"</div>"+"</"+cell+">";
            }


          }else{
            tr = tr + "<"+cell+" class='"+str["class"]+"' data-field='"+str["field"]+"' rowspan='"+str["rowspan"]+"' colspan='"+str["colspan"]+"'>"+"<div class='cell-div "+(str["class"] || "")+"'style='"+celStyle+"'>"+str["contents"]+"</div>"+"</"+cell+">";
          }
        }
      }
      tr = tr +"</tr>";
      html = html + tr;
    }

    options = null;
    return html;
  };
  //数据的初步处理
  var parsingData = function (options) {
    var outIndex = 0;
    var inIndex = 0;
    var data = options.data || [];
    var dataOption =getDataOption();
    var theDataOption;
    for(outIndex = 0; outIndex < data.length; outIndex++){
      for(inIndex = 0;inIndex < data[outIndex].length; inIndex++){
        theDataOption = $.extend({}, dataOption,data[outIndex][inIndex]);
        if(data[outIndex][inIndex] && typeof data[outIndex][inIndex] === "object"){
          theDataOption["contents"] = checkData(data[outIndex][inIndex]["contents"], options);
          theDataOption["field"] = data[outIndex][inIndex]["field"];
        }else{
          theDataOption["contents"] = checkData(data[outIndex][inIndex], options);
          theDataOption["field"] = "";
        }
        data[outIndex][inIndex] = theDataOption;
      }
    }
    options = null;

  };
  var mergeData = function (options) {
    var mergeRuleArr = options.merge || [];
    var data = options.data || [];
    var outIndex = 0;
    var mergeRule = [];
    var row = 0;
    var col = 0;
    var rows = 0;
    var cols = 0;
    for(outIndex = 0; outIndex < mergeRuleArr.length; outIndex++){
      mergeRule=mergeRuleArr[outIndex];
      rows = mergeRule[1][0] - mergeRule[0][0] + 1;
      cols = mergeRule[1][1] - mergeRule[0][1] + 1;
      data[mergeRule[0][0]][mergeRule[0][1]].rowspan = rows;
      data[mergeRule[0][0]][mergeRule[0][1]].colspan = cols;
      for(row = mergeRule[0][0];row <= mergeRule[1][0];row++){
        for(col = mergeRule[0][1];col <= mergeRule[1][1];col++){
          data[row][col].rubbish = true;
        }
      }
      data[mergeRule[0][0]][mergeRule[0][1]].rubbish = false;
    }
    options = null;

  };
  var getDataOption = function () {
    var dataOption = {
      colspan:1,
      rowspan:1,
      contents:"",
      rubbish:false,
      field:""
    };
    return dataOption;

  };
  //数据为空时的转义函数
  var undefinedData = function (undefinedText, text) {
    return text || undefinedText;
  };
  //转义html标签
  var escapeData = function (text) {
    // 未书写转义逻辑
    return text;
  };
  //校验数据
  var checkData = function (text, options) {
    var undefinedText = options.undefinedText;
    var escape = options.escape;
    var str = text;
    str = undefinedData(undefinedText,str);
    if(escape){
      str = escapeData(str) ;
    }
    return str;
    options = null;
  };
  var loadData = function ($dom, data, cell) { //sortRule, returnData["data"]
    //$dom 为表格Dom ， data为数据 ， cell可传不可传，默认为td；
    var cid = $dom.attr("cid");
    cell ? cell === "th" ? cell = "th" : cell = "td" : cell = "td";
    var options = getData(cid);
    if(cell === "td"){
      handleData("bodyData", options, data);
      initBody($dom, options, false);
    }else if (cell === "th"){
      handleData("headData", options, data);
      initHead($dom, options, false);
    }
    setData(cid,options);
    options = null;


  };
  var appendData = function ($dom, data, cell) {
    //$dom 为表格Dom ， data为数据 ， cell可传不可传，默认为td；
    var cid = $dom.attr("cid");
    cell ? cell === "th" ? cell = "th" : cell = "td" : cell = "td";
    var options = getData(cid);
    if(cell === "td"){
      ParseOptions(data, options.escape, options.undefinedText);
      appendTable($dom, data, cell);
      mergeOptions("bodyData", options, data);
    }else if (cell === "th"){
      ParseOptions(data, options.escape, options.undefinedText);
      appendTable($dom, data, cell);
      mergeOptions("headData", options, data);
    }
    setData(cid,options);
    options = null;
  };
  //表格的增加行
  var appendTable = function($dom, data, cell){

    //处理一些参数
    var html =macroCommand( data, cell);
    if(cell === "td"){
      $dom.find(".cb-table tbody").append(html);
    }else if (cell === "th"){
      $dom.find(".cb-table thead").append(html);
    }
    data = null;

  };
  //合并数据矩阵
  var mergeOptions = function (dataType, options, data){
    if(options[dataType]){
      for(var i =0;i<data["data"].length;i++){
        options[dataType]["data"].push(data["data"][i] || []);
      }
    }else{
      options[dataType]= {};
      options[dataType]["data"] = data["data"] || [];
    }
    options = null;
  }
  //将th的class同样赋值给对应td-dongjf
  var thClassTotd = function(dataType, options, data){
    if(options.headData["data"]){
      //处理当前列class
      var headRule = [];
      var headData = options.headData["data"];
      for(var i = 0; i<headData.length;i++){
        var thDatas = headData[i];
        for(var p = 0;p<thDatas.length;p++){
          if(thDatas[p]["class"]){
            headRule[thDatas[p]["field"]]=thDatas[p]["class"];
          }
        }
      }
      //处理单元格数据
      for(var s = 0; s<data["data"].length;s++){
        var tdDatas = data["data"][s];
        for(var q = 0;q<tdDatas.length;q++){
          var field = tdDatas[q]["field"];
          if(headRule[field]!==undefined){
            tdDatas[q]["class"] = headRule[field];
          }
        }
      }
    }
  };
  //数据矩阵的完全改变
  var handleData = function (dataType, options, data){
    thClassTotd(dataType, options, data);
    if(options[dataType]){
      options[dataType]["data"] = data["data"] || options[dataType]["data"];
      options[dataType]["merge"] = data["merge"] || options[dataType]["merge"];
    }else{
      options[dataType] = data;
    }
    options = null;
    data = null;
  };
  var setCellData = function ($dom, data, cell) {
    //$dom 为表格Dom ， data为数据 ， cell可传不可传，默认为td；
    var cid = $dom.attr("cid");
    cell ? cell === "th" ? cell = "th" : cell = "td" : cell = "td";
    var options = getData(cid);
    var row = data["cell"][0]+"" || false;
    var col = data["cell"][1]+"" || false;
    var cellData ="";
    var html = "";
    if(row && col){
      if(cell === "td"){
        cellData = options["bodyData"]["data"];
        cellData[row][col]["contents"] = data["data"];
        html = mergeTable(options["bodyData"],cell);
        $dom.find(".cb-table tbody").html(html);
      }else if (cell ==="th"){
        cellData = options["headData"]["data"];
        cellData[row][col]["contents"] = data["data"];
        html = mergeTable(options["headData"],cell);
        $dom.find(".cb-table thead").html(html);
      }
    }else{
      console.error("输入坐标");
    }

    setData(cid,options);
    options = null;
  }

  return {
    initTag : initTag,
    initHtml : initHtml,
    loadData:loadData,
    getData:getData,
    appendData:appendData,
    setCellData:setCellData
  }
})();




//注册cb-table组件
ParsingHelper.registerComponent("cb-table", CbTable);
