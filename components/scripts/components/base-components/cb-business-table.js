/*
 * cb-business-table 1.0.0
 * author： niulei
 * Time: 2017.4.28
 * description: 复杂表格组件
 */

var CbBusinessTable = (function () {
  //组件结构列表
  var domDivList = {
    "default": '<div class="cb-business-table-div">'+
    '<div class="table-title" ></div>'+
    '<cb-table></cb-table>'+
    '<div class="M-box-div clearfix"><div class="M-box"></div></div>'+
    '</div>'
  };

  var getTipDom = function(tipName){
    if (tipName && typeof tipName === "string") { //此处校验可以写为公共方法
      var tipDiv = tipDom[tipName];
      if (tipDiv) {
        return tipDiv;
      } else {
        err("未找到" + tipName + "提示结构，使用了默认结构",1);
        return tipDom["default"];
      }
    } else {
      return tipDom["default"];
    }

  }
  //列处理函数列表
  var formatter ={
    Hyperlink :function (headData,data,$dom) {
      // data参数为后台传回的参数
      return "<a href='"+data.contents+"'>"+data.contents+"</a>";
    },
    addCheckBox : function (headdata,data,$dom) {
      if(data && data["contents"]){
        return "<input type='checkbox' id='"+"undefined"+"' checked='true' class='the-checkBox'>" +
            "<label for='"+ "undefined"+"'>";
      }
      return "<input type='checkbox' id='"+"undefined"+"' class='the-checkBox'>" +
          "<label for='"+ "undefined"+"'>";
    },
    addRadioBox : function (headData, data,$dom) {
      return "<input type='radio' id='"+"undefined"+"' class='the-radio'>" +
          "<label for='"+ "undefined"+"'>";
    },
    moreBtn : function (headData, data,$dom){
      return "<a class='more-btn'>更多</a>";
    }
    //threeBtn : function(headData, data){
    //  return "<a class='delete-btn'>删除</a><a class='revise-btn'>修改</a><a class='more-btn'>更多</a>"
    //}



  };
  //ajax数据处理函数列表
  var ajaxFunctionList = {
    default : function(data){
      return data;
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

  //获得ajax处理函数
  var getAjaxFunction = function(fnName){
    if(!fnName){
      return ajaxFunctionList["default"];
    }
    if(ajaxFunctionList[fnName]){
      return ajaxFunctionList[fnName];
    }else{
      var a = new Function("data", fnName);
      return a;
    }
  };
  //设置ajax处理函数
  var addAjaxFunction = function(fnName,fn){
    if(typeof fn === "function"){
      ajaxFunctionList["fnName"] = fn;
    }
  };

  //表格显示的数据缓存列表
  var tableOptions = {

  };
  // 后台来源的数据缓存
  var ajaxData = {

  };
  var getAjaxData = function(cid) {
    return $.extend(true,{},ajaxData[cid]);
  };
  var setAjaxData = function(cid,object) {
    ajaxData[cid] = object;
  };
  //复杂表格配置表
  var getData = function (cid) {
    return $.extend(true,{},tableOptions[cid]);
  };
  var setData = function (cid,object) {
    tableOptions[cid] = object;
  };
  var cacheDataList = {

  };
  var getCacheData = function (cid, index) {
    if(cacheDataList[cid] && cacheDataList[cid][index]){
      return $.extend(true, {}, cacheDataList[cid][index]);
    }else{
      return false;
    }
  };
  var getAllCacheData = function(cid){
    if(cacheDataList[cid]){
      return $.extend(true, {}, cacheDataList[cid]);
    }else{
      return false;
    }
  };
  var setCacheData = function (cid, index, data) {
    if(! cacheDataList[cid]){
      cacheDataList[cid] = {};
    }
    cacheDataList[cid][index] = $.extend(true, {}, data);
  };
  //dongjingfeng
  var updateCacheData = function(cid,newData,pageIndex){
    if(pageIndex){
      if(!cacheDataList[cid]){
        cacheDataList[cid]={};
      }
      cacheDataList[cid][pageIndex] = newData;
    }else{
      cacheDataList[cid] = newData;
    }
  }
  var clearCacheData = function(cid) {
    //清空缓存的数据
    cacheDataList[cid] = false;
  };
  //获得标签属性
  var getTagOptions ;
  //获得html属性
  var getHtmlOptions ;
  (function(){
    var tagOptions = {
      ctype: "default",
      fixed:0,
      escape:false,
      undefinedText:"-",
      hideHead:false

    };
    var htmlOptions = {
      method:"POST",
      contentType:"application/x-www-form-urlencoded; charset=UTF-8",
      dataType:"json",
      chooseBox:false,
      pagination:true,
      isPageSearch:true,
      pageList:[10,20,30],
      pageSize:10,
      coping:true,
      homePage:'首页',
      endPage:'尾页',
      prevContent:'上页',
      nextContent:'下页',
      totalData:10000,
      jump:true,
      jumpBtn:"确定",
      paginationLoop:false,
      tbodyService:"159",
      thead:false,
      tbody:false,
      url:"",
      tips:{},
      cache:false,
      keepShowPN:false,
      isPageShowAll:false,
      beforeAjax:"default",
      afterAjax:"default"
    };
    //获得标签属性
    getTagOptions = function () {
      return $.extend(true,{}, tagOptions);
    };
    //获得html属性
    getHtmlOptions = function () {
      return $.extend(true,{}, htmlOptions);
    };
  })();

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
    //设置原子表格的属性
    setCbTableAttr($dom, options);
    //删除自定义标签
    $tag.remove();
    //返回解析后的Dom
    return $dom;

  };

  //浏览器端解析标签的入口，$dom为最外层的dom结构
  var initHtml = function ($dom) {
    var tagindex = $dom.data("tagindex"),
        options = $.extend(getHtmlOptions(),$dom.data("options")),
        cid = $dom.attr("cid"),
        tagtype = $dom.attr("tagtype");
    //保存原始的配置。
    setData(cid,$.extend(true,{},options));
    //删除表格上的data-options
    $dom.removeAttr("data-options");

    //内置的基础表格初始化
    CbTable.initHtml($dom.find('[tagtype="cb-table"]'));
    //根据配置项决定是否启用分页。
    options["pagination"] && addPagination($dom,$dom.find(".M-box"),options);
    //配置复杂表格的表头
    initHead($dom, options);
    //初始化表头
    initBody($dom, options);
    //事件绑定
    bindEvent($dom, options);

  };

  /*事件绑定*/
    var eventList ={
      "default":function(){
        console.log("默认函数缺失");
      },
      //表格删除一行并刷新表格
      "delTrData":function(options,trData,$table){
        var $btn = $(this),
            data = {},
            param = {},
            options = $btn.data("options");
            param.service = options.service;
            $.extend(param,trData);
            data.params = param;
            data.type =options.type ? options.type : 'POST';
            data.url = options.url ? options.url : false;
            data.successF = function (returnData) {
              var cid = $table.attr("cid");
              var param = getAjaxData(cid)["param"]["params"] || {};
              CbBusinessTable.loadTable($table, param, true);
              layer.msg('删除成功',{icon:'success',skin: 'layui-blue'});
            }
            layer.confirm('确定删除此行数据？', {
          	  btn: ['确定','取消'],//按钮
              skin: 'layui-blue'
          	}, function(){
  	            CommonAjax.ajax(data);
          	}, function(){

          	});
      },
      //将选中行的数据发给后台，并进行刷新表格的操作
      "sendTrData":function(options,trData,$table){
        var $btn = $(this),
            data = {},
            param = {},
            options = $btn.data("options");
            param.service = options.service;
            $.extend(param,trData);
            data.params = param;
            data.type =options.type ? options.type : 'POST';
            data.url = options.url ? options.url : false;
            data.successF = function (returnData) {
                if(!options["noRefresh"]){
                  var cid = $table.attr("cid");
                  var param = getAjaxData(cid)["param"]["params"] || {};
                  CbBusinessTable.loadTable($table, param, true);
                }
              layer.msg(returnData["respDesc"] ||'操作成功',{icon:'success',skin: 'layui-blue'});
            }
            if(options["tips"]){
              layer.confirm(options["tips"], {
            	  btn: ['确定','取消'],//按钮
                skin: 'layui-blue'
            	}, function(){
    	            CommonAjax.ajax(data);
            	}, function(){

            	});
            }else{
              CommonAjax.ajax(data);
            }

      }
    } ;
    var addBindFun = function(eventName,eventFun){
        if (eventName && typeof eventName === "string") { //此处校验可以写为公共方法
          eventList[eventName] = eventFun;
        } else {
          console.log("添加绑定事件失败");
        }
    };
    var getBindFun = function(eventName){
        if(eventList[eventName]){
          return eventList[eventName];
        }else{
          return eventList["default"];
        }
    };

  var bindEvent = function ($dom, options) {

    var cid = $dom.attr("cid");
    $dom.on("click",".table-operation-event",function(){
      //拿到type值；
      var tableData = getAjaxData(cid)["tableData"]["data"],
          $tr = $(this).closest("tr"),
          index = $tr.data("index"),
          funName = $(this).attr("data-eventName"),
          trData = {};
      $.each(tableData[index],function(index,value){
        trData[value["field"]] = value["contents"];
      });

      //取到type所定义的函数
      var eventFun = getBindFun(funName).call(this,options,trData,$dom);

    });
    //dongjingfeng 更多详情的下拉
    $dom.on("click",".more-btn",function(event){
      event.stopPropagation();
      var trIndex = $(this).closest("tr").data("index");
      var detailTr = $("tbody tr[data-index="+ trIndex + "]").next();
      var tableOption = getData(cid);
      var detailList = tableOption.detailList;
      if(detailList){
        if(detailTr.length == 0 || detailTr.attr("data-index")){
          var outIndex;
          var inIndex;
          var trContent = '';
          var tdContent = '';
          var moreDom ='';
          var pageIndex = $dom.data("pageindex");
          var pageData = getCacheData(cid, pageIndex) || {};
          var trData = pageData["data"] ? pageData["data"][trIndex] :console.error("数据有误");
          var $tr = $(this).closest("tr");
          var colspan = $tr.find("td").length;
          var detailData = trData[trData.length-1];
          if(detailList.isAllMarge===true){
            colspan +=1;
          }
          if(detailList.data){
            //moreDom = $(getMoreDom());
            var data=detailList.data;
            var tdData=[];
            for(outIndex = 0;outIndex<data.length;outIndex++){
              var position = data[outIndex].position;
              if(!tdData[position[0]-1]){
                tdData[position[0]-1]=[];
              }
              tdData[position[0]-1][position[1]-1]="<td class='detail-title' style='width:20%;text-align: right;'>"+data[outIndex].cName +"：</td><td class='detail' style='width: 30%;text-align: left;' data-name='"+ data[outIndex].name+"'></td>";
            }
            for(outIndex=0;outIndex<tdData.length;outIndex++){
              moreDom += "<tr>";
              for(inIndex=0;inIndex<tdData[outIndex].length;inIndex++){
                moreDom += tdData[outIndex][inIndex];
              }
              moreDom +="</tr>";
            }
          }
          else{
            console.error("请配置相关详情参数");
          }
          moreDom = "<table>" + moreDom +"</table>";
          var $moreDom = $(moreDom);
          for(outIndex=0;outIndex<detailData.length;outIndex++){
            $moreDom.find("[data-name='"+ detailData[outIndex].name+"']").text(detailData[outIndex].value);
          }
          $(this).text("收起");
          $tr.after("<tr><td class='details' colspan='"+(colspan-1)+"' ><table class='detail-table' style='border:none;margin:0;'>"+ $moreDom.html() + "</table></td></tr>");


        }
        else{
          switch($(this).text()){
            case "更多" :detailTr.show();$(this).text("收起");break;
            default :detailTr.hide();$(this).text("更多");
          }
        }
      }else{
        console.error("请输入详情配置项");
      }
    });
    switch (options["chooseBox"]) {
      case 'checkbox':
        $dom.on("click",".all-checkBox",function(event){
          event.stopPropagation();
          var pageIndex = $dom.data("pageindex");
          var pageData = getCacheData(cid, pageIndex) || {};
          var data = pageData["data"] ? pageData["data"] :console.error("数据有误");
          var checked = $(this).prop("checked");
          var object = {
            field:"choosebox",
            contents:false
          };
          if(checked){
            object.contents = true;
            $dom.find(".the-checkBox").prop("checked",true);
          }else{
            $dom.find(".the-checkBox").prop("checked",false);
          }
          if(data){
            for(var i = 0; i< data.length; i++){
              var flag = true;
              for(var j =0;j< data[i].length; j++){
                if(data[i][j].field ==="choosebox"){
                  data[i][j] = object;
                  flag = false;
                }
              }
              if(flag){
                data[i].unshift(object);
              }

            }
          }
          else{
            console.error("无数据以进行多选");
          }

          setCacheData(cid, pageIndex, pageData);
        });
        $dom.on("click",".the-checkBox",function(event){
          event.stopPropagation();
          var pageIndex = $dom.data("pageindex");
          var pageData = getCacheData(cid, pageIndex) || {};
          var trIndex = $(this).closest("tr").data("index");
          var trData = pageData["data"] ? pageData["data"][trIndex] :console.error("数据有误");
          var checked = $(this).prop("checked");
          //dongjingfeng 选择联动效果  判断是否全选或取消全选
          var trCount = $dom.find("tbody tr[data-index]").length;
          var checkedCount = $dom.find("tbody input:checked").length;
          if(checkedCount < trCount){
            $dom.find(".all-checkBox").prop("checked",false);
          }else{
            $dom.find(".all-checkBox").prop("checked",true);
          }

          var flag = true;
          var object = {
            field:"choosebox",
            contents:false
          };
          if(checked){
            object.contents = true;
          }
          for(var i =0;i< trData.length; i++){
            if(trData[i].field ==="choosebox"){
              trData[i] = object;
              flag = false;
            }
          }
          if(flag){
            trData.unshift(object);
          }
          setCacheData(cid, pageIndex, pageData);
          //此处可以决定处理函数
        });
        break;
      case 'radio':
        $dom.on("click",".the-radio",function(){
          $dom.find(".the-radio").prop("checked",false);
          $(this).prop("checked",true);
          //清空已选择信息
          var type =options.chooseBox;
          var cacheData = getAllCacheData(cid) || {};
          for(var i in cacheData){
            var data = cacheData[i]["data"];
            for(var p =0;p<data.length;p++){
              if(data[p][0]["field"] ===type){
                data[p].shift();
              }
            }
          }
          updateCacheData(cid,cacheData);
          var pageIndex = $dom.data("pageindex");
          var trIndex = $(this).closest("tr").data("index");
          var pageData = getCacheData(cid, pageIndex) || {};
          var trData = pageData["data"] ? pageData["data"][trIndex] :console.error("数据有误");
          var checked = $(this).prop("checked");



          var flag = true;
          var object = {
            field:"choosebox",
            contents:false
          };
          if(checked){
            object.contents = true;
          }
          for(var i =0;i< trData.length; i++){
            if(trData[i].field ==="choosebox"){
              trData[i] = object;
              flag = false;
            }
          }
          if(flag){
            trData.unshift(object);
          }
          setCacheData(cid, pageIndex, pageData);
        });
        break;
      default:

    }
    $dom.on("click",".details-btn",function (event) {
      event.stopPropagation();
      var $this = $(this);
      var getTrIndex = $this.parents('tr').data('index');
      var pageIndex = $dom.data("pageindex");
      var pageData = getCacheData(cid, pageIndex) || {};
      var trData = pageData["data"] ? pageData["data"][getTrIndex] :console.error("数据有误");
      var thisOptions = $this.data('options');
      var id;
      var name;
      var pathName = window.document.location.pathname;
      var ctx = pathName.substring(0, pathName.substr(1).indexOf('/') + 1);
      if (ctx == "/views")
        ctx = "";
      $.each(trData, function (key, item) {
        if(item.field === thisOptions.keyId){
          id = item.contents;
          name = thisOptions.keyName || item.field;
          return;
        }
      })
      var  thisHref =  ctx+thisOptions.href+'?'+name+'='+id;
      window.location.href = thisHref;
    })

    //$dom.on("click",".modalShow",function (event) {
    //
    //})
  };

  /*//dongjingfeng 用户自行事件绑定
  var eventList={
    "moreBtn":function(event){
      event.stopPropagation();
      var trIndex = $(this).closest("tr").data("index");
      var detailTr = $("tbody tr[data-index="+ trIndex + "]").next();
      var tableOption = getData(cid);
      var detailList = tableOption.detailList;
      if(detailList){
        if(detailTr.length == 0 || detailTr.attr("data-index")){
          var outIndex;
          var inIndex;
          var trContent = '';
          var tdContent = '';
          var moreDom ='';
          var pageIndex = $dom.data("pageindex");
          var pageData = getCacheData(cid, pageIndex) || {};
          var trData = pageData["data"] ? pageData["data"][trIndex] :console.error("数据有误");
          var $tr = $(this).closest("tr");
          var colspan = $tr.find("td").length;
          var detailData = trData[trData.length-1];
          if(detailList.isAllMarge===true){
            colspan +=1;
          }
          if(detailList.data){
            //moreDom = $(getMoreDom());
            var data=detailList.data;
            var tdData=[];
            for(outIndex = 0;outIndex<data.length;outIndex++){
              var position = data[outIndex].position;
              if(!tdData[position[0]-1]){
                tdData[position[0]-1]=[];
              }
              tdData[position[0]-1][position[1]-1]="<td class='detail-title' style='width:20%;text-align: right;'>"+data[outIndex].cName +"：</td><td class='detail' style='width: 30%;text-align: left;' data-name='"+ data[outIndex].name+"'></td>";
            }
            for(outIndex=0;outIndex<tdData.length;outIndex++){
              moreDom += "<tr>";
              for(inIndex=0;inIndex<tdData[outIndex].length;inIndex++){
                moreDom += tdData[outIndex][inIndex];
              }
              moreDom +="</tr>";
            }
          }
          else{
            console.error("请配置相关详情参数");
          }
          moreDom = "<table>" + moreDom +"</table>";
          var $moreDom = $(moreDom);
          for(outIndex=0;outIndex<detailData.length;outIndex++){
            $moreDom.find("[data-name='"+ detailData[outIndex].name+"']").text(detailData[outIndex].value);
          }
          $(this).text("收起");
          $tr.after("<tr><td class='details' colspan='"+(colspan-1)+"' ><table class='detail-table' style='border:none;margin:0;'>"+ $moreDom.html() + "</table></td></tr>");


        }
        else{
          switch($(this).text()){
            case "更多" :detailTr.show();$(this).text("收起");break;
            default :detailTr.hide();$(this).text("更多");
          }
        }
      }else{
        console.error("请输入详情配置项");
      }
    },
    "deleteBtn":function(event){
      console.log("delete");
    },
    "updateBtn":function(event){
      console.log("update");
    }
  };
  var userEvent = function ($dom,triggerDom,eventName,fun) {
    var cid = $dom.attr("cid");
    //dongjingfeng 更多详情的下拉
    $dom.on("click",".more-btn",function(event){
      event.stopPropagation();
      var trIndex = $(this).closest("tr").data("index");
      var detailTr = $("tbody tr[data-index="+ trIndex + "]").next();
      var tableOption = getData(cid);
      var detailList = tableOption.detailList;
      if(detailList){
        if(detailTr.length == 0 || detailTr.attr("data-index")){
          var outIndex;
          var inIndex;
          var trContent = '';
          var tdContent = '';
          var moreDom ='';
          var pageIndex = $dom.data("pageindex");
          var pageData = getCacheData(cid, pageIndex) || {};
          var trData = pageData["data"] ? pageData["data"][trIndex] :console.error("数据有误");
          var $tr = $(this).closest("tr");
          var colspan = $tr.find("td").length;
          var detailData = trData[trData.length-1];
          if(detailList.isAllMarge===true){
            colspan +=1;
          }
          if(detailList.data){
            //moreDom = $(getMoreDom());
            var data=detailList.data;
            var tdData=[];
            for(outIndex = 0;outIndex<data.length;outIndex++){
              var position = data[outIndex].position;
              if(!tdData[position[0]-1]){
                tdData[position[0]-1]=[];
              }
              tdData[position[0]-1][position[1]-1]="<td class='detail-title' style='width:20%;text-align: right;'>"+data[outIndex].cName +"：</td><td class='detail' style='width: 30%;text-align: left;' data-name='"+ data[outIndex].name+"'></td>";
            }
            for(outIndex=0;outIndex<tdData.length;outIndex++){
              moreDom += "<tr>";
              for(inIndex=0;inIndex<tdData[outIndex].length;inIndex++){
                moreDom += tdData[outIndex][inIndex];
              }
              moreDom +="</tr>";
            }
          }
          else{
            console.error("请配置相关详情参数");
          }
          moreDom = "<table>" + moreDom +"</table>";
          var $moreDom = $(moreDom);
          for(outIndex=0;outIndex<detailData.length;outIndex++){
            $moreDom.find("[data-name='"+ detailData[outIndex].name+"']").text(detailData[outIndex].value);
          }
          $(this).text("收起");
          $tr.after("<tr><td class='details' colspan='"+(colspan-1)+"' ><table class='detail-table' style='border:none;margin:0;'>"+ $moreDom.html() + "</table></td></tr>");


        }
        else{
          switch($(this).text()){
            case "更多" :detailTr.show();$(this).text("收起");break;
            default :detailTr.hide();$(this).text("更多");
          }
        }
      }else{
        console.error("请输入详情配置项");
      }


    });
  };
*/

  //配置复杂表格的tbody。
  var initBody = function ($dom, options) {
    //判断是否需要从后台请求表格头部
    if(options["tbody"]){
      var bodyData = {};
      var $table = $dom.find('[tagtype="cb-table"]');
      bodyData["data"] = options["tbody"]["data"];
      bodyData["merge"] = options["tbody"]["merge"];
      CbTable.loadData($table, bodyData);

    }else{
      //dongjingfeng 无表格tbody信息时的提示信息
      var str = '请输入查询条件，进行查询！';
      console.error(str);
      var $targetDom = $dom;
      var $tipDiv = $('<div class="cb-err-prompt"></div>');
      $tipDiv.text(str);
      $dom.append($tipDiv);
    }

  };

  //配置复杂表格的表头。
  var initHead = function ($dom, options) {
    //判断是否需要从后台请求表格头部
    if(options["thead"]){
      options["thead"]["service"] ? ajaxHead($dom, options) : parseHead($dom, options);
    }else{
      console.error("请输入表头");
    }
  };
  //通过配置解析表头
  var parseHead = function ($dom, options) {
    var headData = {};
    var $table = $dom.find('[tagtype="cb-table"]');
    headData["data"] = options["thead"]["data"] || [];
    headData["merge"] = options["thead"]["merge"] || [];
    // 表头是否包含chooseBOX
    parseChooseBox(options["chooseBox"],headData["data"]);
    //嗯  这块还要改
    parseId($dom,headData["data"],"headChoose");
    CbTable.loadData($table, headData,"th",options);
  };
  var parseChooseBox = function (chooseBox, data) {
    if(chooseBox === "checkbox"){
      // 若配置项中有checkbox，则表头生成checkBox
      var object = {
        contents:"<input type='checkbox' id='' class='all-checkBox'>" +
        "<label for=''>",
        field:"choosebox",
        formatter:"addCheckBox"
      };
      data[0].unshift(object);
    }
    if(chooseBox === "radio") {
      var object = {
        contents:" ",
        field:"choosebox",
        formatter:"addRadioBox"
      };
      data[0].unshift(object);
    }
  }
  //通过请求后台数据来生成表头
  var ajaxHead = function ($dom, options) {

    var thead = options["thead"];
    var service = thead["service"];
    var $table = $dom.find('[tagtype="cb-table"]');
    var data = {};
    var param = {};
    param.service = service;
    data["params"] = param;
    data.url = thead.url || options.url || false;
    // data.url = "table_data.json";
    data.type = thead.method || options.method || false;
    data.datatype = options.dataType;
    data.successF = function (returnData) {

      //ajax之后的函数执行
      returnData=getAjaxFunction(thead["afterAjax"])(returnData);
      console.log(returnData);
      // 表头是否包含chooseBOX
      parseChooseBox(options["chooseBox"],returnData["data"]);
      CbTable.loadData($table, returnData,"th");
    };
    data.errorF = function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("网络异常");
    };
    // 执行beforeAjax的函数，来改变一些参数
    data=getAjaxFunction(thead["beforeAjax"])(data);
    //执行ajax函数
    CommonAjax.ajax(data);

  };
  //为原子表格增加属性
  var setCbTableAttr = function($dom, options){
    var param = {};
    param["escape"] = options["escape"];
    param["undefinedText"] = options["undefinedText"];
    param["hideHead"] = options["hideHead"];
    param["fixed"] = options["fixed"];
    //dongjingfeng 实现表格width调整 在表格上挂载服务
    param["width"] = options["width"];
    param["tbodyService"] = options["tbodyService"];
    $dom.find("cb-table").attr("data-options",JSON.stringify(param));

  };
  var loadTable = function ($dom, param, isRefresh, pageIndex) {
    //dongjingfeng 实现表格加载中及表格加载后无内容的提示信息
    //清除->无条件进行查询的提示
    var colNum = getMergeNum($dom);
    if($dom.find(".cb-err-prompt")){
      $dom.find(".cb-err-prompt").remove();
    }
    //加载中
    var $targetDom = $dom.find(".cb-table tbody");
    //var options = getHtmlOptions();
    var options =  $dom.data("options");
    var str = options.tips.loadingText ? options.tips.loadingText : "加载中";
    //parseTip($targetDom,str,colNum);

    if(isRefresh && pageIndex){
      var pageData = getCacheData($dom.attr("cid"), pageIndex);
      $dom.find(".all-checkBox").prop("checked",false);
      $dom.data("pageindex",pageIndex);
      macroCommand($dom, $.extend(true,{},pageData));

    }else{
      //修改原函数名 ajaxData
      //开启loadin层
      Loading.loading($dom);
      var tableData = dataAjax($dom, param, isRefresh);
    }
    if($dom.find(".cb-table tbody tr[data-index]").length ===0){
     str=options.tips.noResult ? options.tips.noResult : "没有符合条件的条目，请重新输入条件，进行查询。";
     parseTip($targetDom,str,colNum);
    }

  };
  //dongjingfeng 获取提示信息在表格中时的合并数量
  var getMergeNum = function($dom){
    var list = $dom.find(".cb-table tr:first");
    list = list.find("th");
    var colNum=0;
    for(var i=0;i<list.length;i++){
      var tr=$(list[i]);
      colNum+=parseFloat(tr.attr("colspan"));
    }
    return colNum;
  }
  //dongjingfeng 解析提示信息 ->暂只实现在表格中提示
  var parseTip = function($dom,tipMessage,colNum){
    var str = tipMessage;
    var $targetDom = $dom;
    var merge = colNum;
    var tipDiv = $('<tr><td colspan="'+ merge +'">' + '<div class="cb-err-prompt"></div>' + '</td></tr>');
    var $tipDiv  = $(tipDiv);
    $tipDiv.find(".cb-err-prompt").text(str);
    $targetDom.html($tipDiv);

  };
  //修改原函数名 ajaxData
  var dataAjax = function ($dom, param, isRefresh) {
    var cid = $dom.attr("cid");
    var options = getData(cid);
    var data = {};
    param.service = options.tbodyService || param.service;
    param.current = param.current || "1";
    param.pageSize = options.pageSize;
    data["params"] = param;
    data.url = options.url || false;
    // data.url = "table_data.json";
    data.type = options.method;
    data.datatype = options.dataType;
    data.successF = function (returnData) {
      var dataOptions = {
        param:{},
        tableData:{}
      };
      //ajax之后的函数执行
      returnData=getAjaxFunction(options["afterAjax"])(returnData);
      $.extend(true, dataOptions["param"], data);
      $.extend(true, dataOptions["tableData"], returnData);
      setAjaxData(cid, $.extend(true,{},dataOptions));
      if(!isRefresh){
        //若是重头刷新表格，则清空缓存
        clearCacheData(cid);
      }
      setCacheData(cid, param.current, returnData);
      // 根据配置项决定是否启用分页。
      options["pagination"] && loadPagination($dom,$dom.find(".M-box"),options,returnData.total, isRefresh,param.current);
      macroCommand($dom, $.extend(true,{},returnData));
      //将全选按钮的选中取消
      $dom.find(".all-checkBox").prop("checked",false);

    };
    data.errorF = function (XMLHttpRequest, textStatus, errorThrown) {
      console.log("网络异常");
    };
    $dom.data("pageindex",param.current);
    // 执行beforeAjax的函数，来改变一些参数
    data=getAjaxFunction(options["beforeAjax"])(data);
    //执行ajax函数
    CommonAjax.ajax(data);


  };
  var macroCommand = function($dom, returnData) {
    //对表格数据进行初步处理，进行排序
    var cid = $dom.attr("cid");

    var $table = $dom.find('[tagtype="cb-table"]');
    var thead = $.extend(true,{},CbTable.getData($table.attr("cid")).headData);
    var sortRule = theadSortRule(thead["data"],returnData);
    var cloneData = returnData["data"];
    //为数据进行初步的数据排序处理
    returnData["data"] = parseData(sortRule,returnData["data"]);
    //ajax中为加载中  获取数据后table覆盖
    //为数据进行formatter处理和样式处理
    //dongjingfeng 判断实现表格加载提示信息
    if(returnData["total"]>0){
      if(returnData["data"].length>0){
        returnData["data"] = HandleFormatter(sortRule, returnData["data"],$dom);
        //加个小树枝 dongjingfeng 为选择框附加id
        var type = $dom.data("options")["chooseBox"];
        returnData["data"] = parseId($dom,returnData["data"],type);

        CbTable.loadData($table, returnData);
      }else{
        console.error("没有符合条件的条目！");
        var options = $dom.data("options");
        var str=options.tips.noResult ? options.tips.noResult : "没有符合条件的条目！";
        parseTip($dom.find(".cb-table tbody"),str,sortRule.length);
      }
    }else{
      var options = $dom.data("options");
      var str=options.tips.noResult ? options.tips.noResult : "没有符合条件的条目，请重新输入条件，进行查询。";
      parseTip($dom.find(".cb-table tbody"),str,sortRule.length);
    }

    /*else{
      console.error("没有符合条件的条目，请重新输入条件，进行查询。");
      var options = getHtmlOptions();
      var str=options.tips.noResult ? options.tips.noResult : "没有符合条件的条目，请重新输入条件，进行查询。";
      parseTip($dom.find(".cb-table tbody"),str,sortRule.length);
    }*/

  };
  //小树枝  初始化input id label for
  var parseId = function($dom,data,type){
    switch(type){
      case "checkbox" :
      case "radio" :
        var nameFun=getParseIdFun("default");
          nameFun($dom,data,type);
        break;
      case "headChoose":
            var nameFun = getParseIdFun(type);
            nameFun($dom,data);
        break;
    }
    return data;
  };
  var parseInFun ={
    "default" : function($dom,data,type){
      var pageIndex = $dom.data("pageindex");
      var tableId = $dom.attr("cid");
      var outIndex,inIndex;
      for(outIndex = 0;outIndex< data.length;outIndex++){
        var trIndex = outIndex;
        var idName = tableId + pageIndex + trIndex;
        for(inIndex =0;inIndex<data[outIndex].length;inIndex++){
          if(data[outIndex][inIndex]["contents"] && typeof data[outIndex][inIndex]["contents"] === 'string' && data[outIndex][inIndex]["contents"].indexOf(type)!==-1) {
            var $type = $('<div>' + data[outIndex][inIndex]["contents"] + '</div>');
            $type.find("input").attr("id", idName);
            $type.find("label").attr("for", idName);
            data[outIndex][inIndex]["contents"] = $type.html().toString();
            $type = null;
          }
        }
      }
    },
    "headChoose" :function($dom,data){
      var tableId = $dom.attr("cid");
      var outIndex,inIndex;
      for(outIndex = 0;outIndex< data.length;outIndex++){
        var trIndex = outIndex;
        var idName = tableId;
        for(inIndex =0;inIndex<data[outIndex].length;inIndex++){
          if(data[outIndex][inIndex]["field"] && data[outIndex][inIndex]["field"]==="choosebox") {
            var $type = $('<div>' + data[outIndex][inIndex]["contents"] + '</div>');
            $type.find("input").attr("id", idName);
            $type.find("label").attr("for", idName);
            data[outIndex][inIndex]["contents"] = $type.html().toString();
            $type = null;
          }
        }
      }
    }
  };
  var getParseIdFun = function(IdNameFun){
    if (IdNameFun && typeof IdNameFun === "string") {
      return parseInFun[IdNameFun] ? parseInFun[IdNameFun] : console.err("命名方式不存在，请重新确认。")
    } else {
      console.error("获取方式有误。");
      return false;
    }
  }
  var setParseIdFun = function(name,fun){
    if (name && typeof name === "string") {
      parseInFun[name] = fun;
    } else {
      console.error("命名有误");
      return false;
    }
  }

  //为数据进行formatter处理
  var HandleFormatter = function(sortRule, data,$dom) {
    var outLength = data[0].length;
    var inLength = data.length;
    var outIndex ;
    var inIndex ;
    var formatter;
    for(outIndex = 0; outIndex <outLength ; outIndex++ ){
      formatter = getFormatter(sortRule[outIndex]["formatter"]);
      for(inIndex = 0; inIndex < inLength ; inIndex++){
        //若表头配置了width属性，则在此处为表格内容添加width属性。
        data[inIndex][outIndex]["width"]=sortRule[outIndex]["width"];
        if(formatter){
          if(!data[inIndex][outIndex]["field"]){
            data[inIndex][outIndex]["field"] = sortRule[outIndex]["field"] || ""
          }
          data[inIndex][outIndex]["contents"]=formatter(sortRule[outIndex],data[inIndex][outIndex],$dom);
        }
      }
    }
    return data;
  };
  //对表格数据进行处理，如对应表头排序，对应的处理程序
  var parseData = function(sortRule, tableData){
    var newData = [];
    var newRow = [];
    var oldRow = [];
    var outIndex = 0;
    var inIndex = 0;
    var cellIndex = 0;
    var theSortRule = "";
    for(outIndex = 0 ; outIndex<tableData.length; outIndex++){
      oldRow = tableData[outIndex];
      newRow = [];
      //console.log(oldRow);
      for(inIndex = 0; inIndex < sortRule.length; inIndex++){
        theSortRule = sortRule[inIndex];
        newRow[inIndex] = {};
        for(cellIndex = 0 ; cellIndex< oldRow.length; cellIndex++){
          if(theSortRule["field"]){
            if(oldRow[cellIndex]["field"] === theSortRule["field"]){
              newRow[inIndex] = oldRow[cellIndex];
              break;
            }
          }else{
            newRow[inIndex] = oldRow[inIndex];
            break ;
          }

        }
      }
      newData.push(newRow);

    }
    return newData;
  };
  //获得表头的name排列顺序
  var theadSortRule = function(data,returnData){
    var outLength = data[0].length;  //8
    var inLength = data.length;  //1

    var outIndex ;
    var inIndex ;
    var sortRule = [];
    for(outIndex = 0; outIndex <outLength ; outIndex++ ){
      for(inIndex = 0; inIndex < inLength ; inIndex++){
        if(!data[inIndex][outIndex]["rubbish"]){
          sortRule.push($.extend(true,{},data[inIndex][outIndex]));
          break;
        }
      }
    }
    //returnData && sortRule.push({});
    return sortRule;
  };
  //增加分页插件并为分页增加配置项。
  var addPagination = function($dom,$pagination, options){
    var pathName = window.document.location.pathname;
    pathName = pathName.substring(0,pathName.substr(1).indexOf('/views')+1);
    $("head").append("<link rel='stylesheet'  href='"+pathName+"/plugins/pagination/style/pagination.css"+"'>");
  };
  //加载分页
  var loadPagination = function($dom, $pagination, options, total, isRefresh,pageCurrent) {
    // if(isRefresh) {
    //   //若不是分页触发的加载，则退出初始化
    //   return false;
    // }
    var cid = $dom.attr("cid");
    $pagination.pagination({
      current:pageCurrent,
      coping:options.coping,
      homePage:options.homePage,
      endPage:options.endPage,
      prevContent:options.prevContent,
      nextContent:options.nextContent,
      totalData: total,
      showData:options.pageSize,
      keepShowPN:options.keepShowPN,
      isPageShowAll:options.isPageShowAll,
      jump:options.jump,
      jumpBtn:options.jumpBtn,
      isPageSearch:options.isPageSearch,
      isHide:false,
      callback:function(api){
        console.log("sdsdsd");
        var param = getAjaxData(cid)["param"]["params"] || {};
        param["current"] = api.getCurrent()+"";
        if(getCacheData(cid, api.getCurrent()+"") && options["cache"]){
          //在有缓存数据且开启缓存时，读取缓存。
          CbBusinessTable.loadTable($dom, param, true, api.getCurrent()+"");
        }else{
          CbBusinessTable.loadTable($dom, param, true);
        }
      }
    });
  };
  var getSelections = function ($dom) {
    var cid = $dom.attr("cid");
    var options = getData(cid);
    var cache = options["cache"];
    var pageIndex = $dom.data("pageindex");
    var cacheData = "";
    if(cache){
      //若开启了缓存，则读取缓存中的所有数据
      cacheData = getAllCacheData(cid);
      var data = [];
      if(! cacheData){
        //若无数据，则返回空数组
        console.error("数据出错1");
        return [];
      }
      for(var i in cacheData){
        $.merge( data, filterSelectionData(cacheData[i]["data"]));
      }
      return data;

    }
    else{
      //若未开启缓存，则读取当前页的数据
      cacheData = getCacheData(cid, pageIndex+"") || {};
      if(! cacheData){
        //若无数据，则返回空数组
        console.error("数据出错2");
        return [];
      }
      var data = filterSelectionData(cacheData["data"]);
      return data;

    }
  };
  var filterSelectionData = function (data,type) {
    //type 为筛选check类型数据 还是筛选radio类型数据。
    var theData = [];
    var outIndex = 0;
    var inIndex = 0;
    for(outIndex = 0; outIndex< data.length; outIndex++){
      for(inIndex = 0; inIndex< data[outIndex].length; inIndex++){
        if(data[outIndex][inIndex]["field"] === "choosebox" && data[outIndex][inIndex]["contents"]){
          theData.push(data[outIndex]);
        }
      }
    }
    return theData;
  }



  return {
    initTag:initTag,
    initHtml:initHtml,
    loadTable:loadTable,
    addFormatter:addFormatter,
    addAjaxFunction:addAjaxFunction,
    getSelectionsFrom:getSelections,
    getAjaxData:getAjaxData,
    addBindFun:addBindFun
  };
})();

//注册组件
ParsingHelper.registerComponent("cb-business-table", CbBusinessTable);
