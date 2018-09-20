/*
 * FnList 1.0.0
 * author： niulei
 * Time: 2017.8.8
 * description:  公共的函数列表，存放公共的函数。以便维护每个组件抛出的接口
 */
 var FnList = (function () {
     //公共事件列表
     var fnList = {
          //日期示例 进行时间限制  this关键字为当前日历组件
          limitDate:function(options,elem,val,datas){
            var startOptions = ToolBox.getModelOptions(options["startDate"]);
            var endOptions = ToolBox.getModelOptions(options["endDate"]);
            startOptions && (startOptions["maxDate"]=val);
            endOptions && (endOptions["minDate"]=val);
          },
          //日期示例 ，清空时间限制
          clearLimitDate:function(options,elem,val){
            var startOptions = ToolBox.getModelOptions(options["startDate"]);
            var endOptions = ToolBox.getModelOptions(options["endDate"]);
            startOptions && (startOptions["maxDate"]=startOptions["theMaxDate"]);
            endOptions && (endOptions["minDate"]=endOptions["theMinDate"]);
          },
          //示例
          Hyperlink:function(options,value,row,index,field){
            return value;
          },
         //号卡二期 卡计划申请表格 计算误差百分比计算函数  入参：上季度计划量，上季度实际订卡量
         getPerError : function(cardPlanCount,bookCardCount){
           cardPlanCount = Number(cardPlanCount);
           bookCardCount = Number(bookCardCount);
           return (cardPlanCount-bookCardCount)/cardPlanCount;
         },
         //号卡二期 卡计划申请表格  计算本季度计划总量  入参：第一个月，第二个月，第三个月
         getAllPlanCount : function(firstNum,secondNum,thirdNum){
           firstNum = Number(firstNum);
           secondNum = Number(secondNum);
           thirdNum = Number(thirdNum);
           return firstNum+secondNum+thirdNum;

         },
         //号卡二期 卡计划申请表格 计算计划控制指标   入参：本季度计划总量 截止上月底库存总量 本季度预计月均发展用户数
         getPlanTarget : function(allPlanCount,storeCount,monthlyUserNum){
           allPlanCount = Number(allPlanCount);
           storeCount = Number(storeCount);
           monthlyUserNum = Number(monthlyUserNum);
           return (allPlanCount+storeCount)/monthlyUserNum;

         },
         //号卡二期 卡计划申请表格 计算经济库存倍数  入参：截止上月底库存总量 本季度预计月均发展用户数
         getStockRate : function(storeCount,monthlyUserNum){
           storeCount = Number(storeCount);
           monthlyUserNum = Number(monthlyUserNum);
           return storeCount/monthlyUserNum;
         },
         //号卡二期 卡计划申请表格 本季度预计月均发展用户数 输入框操作
         monthlyUserNumInput:function(options,tdoptions){
           //请输入数字的输入校验 ，现未书写
           //更新计划控制指标单元格
           fnList.updatePlanTargetCell($(this));
           //更新经济库存倍数单元格
           fnList.updateStockRateCell($(this));
           fnList.setCellVal($(this),$(this).val());
           console.log("本季度预计月均发展用户数");
         },
         //号卡二期 卡计划申请表格 截止上月底库存总量  输入框失去焦点操作
         storeCountInput:function(options,tdoptions){
           //请输入数字的输入校验 ，现未书写
           //更新计划控制指标单元格
           fnList.updatePlanTargetCell($(this));
           //更新经济库存倍数单元格
           fnList.updateStockRateCell($(this));
           fnList.setCellVal($(this),$(this).val());
           console.log("截止上月底库存总量 ");
         },
         //号卡二期 卡计划申请表格 第一 二 三 个月输入框操作
         cellNumInput:function(options,tdoptions){
           //请输入数字的输入校验 ，现未书写
           console.log($(this));
           //更改本季度计划总量
           fnList.updateAllPlanCountCell($(this));
           fnList.setCellVal($(this),$(this).val());
         },
         //更改本季度计划总量单元格
         updateAllPlanCountCell:function($input){
           //请输入数字的输入校验 ，现未书写
           var $tr = $input.closest("tr"),
               firstNum = $tr.find(".firstnuminput").val() || 0,
               secondNum = $tr.find(".secondnuminput").val() || 0,
               thirdNum = $tr.find(".thirdnuminput").val() || 0,
               $allPlanCountCell = $tr.find(".allplancountcell"),
               allPlanCount = fnList.getAllPlanCount(firstNum,secondNum,thirdNum);
           $allPlanCountCell.html(allPlanCount);
           //更改计划控制指标
           fnList.updatePlanTargetCell($allPlanCountCell);
           fnList.setCellVal($allPlanCountCell,allPlanCount);

         },
         //号卡二期，更改计划控制指标单元格
         updatePlanTargetCell:function($input){
           var $tr = $input.closest("tr"),
               $allPlanCountCell = $tr.find(".allplancountcell"),
               allPlanCount = $allPlanCountCell.text() || 0,
               storeCount = $tr.find(".storecountinput").val() || 0,
               monthlyUserNum = $tr.find(".monthlyusernuminput").val()||0,
               $planTargetCell = $tr.find(".plantargetinput"),
               planTarget = fnList.getPlanTarget(allPlanCount,storeCount,monthlyUserNum);
           $planTargetCell.html(planTarget);
           fnList.setCellVal($planTargetCell,planTarget);
         },
         //号卡二期，更改经济库存倍数单元格
         updateStockRateCell:function($input){
           var $tr = $input.closest("tr"),
               storeCount = $tr.find(".storecountinput").val() || 0,
               monthlyUserNum = $tr.find(".monthlyusernuminput").val()||0,
               $stockRateCell = $tr.find(".stockrateinput"),
               stockRate = fnList.getStockRate(storeCount,monthlyUserNum);
           $stockRateCell.html(stockRate);
           fnList.setCellVal($stockRateCell,stockRate);
         },
         //号卡二期，变更省模板表格数据底层
         setCellVal:function($cell,val){
           var field = $cell.data("field"),
               $table = $cell.closest("div[tagtype='cb-tpl-table']"),
               cid = $table.attr("cid"),
               $tr = $cell.closest("tr"),
               data = {},
               indexs = $tr.data("index").split("-");
               // 接口向外暴露，需要修改掉
               data = PageCache.getCache(cid+"_data") || {};
               data.rows[indexs[0]].cardTypeInfoList[indexs[1]].cardTypeDetailList[indexs[2]][field] = val;
               PageCache.setCache(cid+"_data",data);



         },
         //号卡二期，卡计划申请表格 数据处理函数
         cardPatternListData:function(options,returnData){
           var cardPatternList = returnData.cardPatternList || [];
           $.each(cardPatternList,function(index,value){
             $.each(value.cardTypeInfoList,function(i,val){
               $.each(val.cardTypeDetailList,function(j,vale){
                 //初始化 误差百分比
                 vale["perError"] = fnList.getPerError(vale["cardPlanCount"] || 0,vale["bookCardCount"] || 0);
                 //初始化  本季度计划总量
                 vale["allPlanCount"] = fnList.getAllPlanCount(vale["firstNum"] || 0,vale["secondNum"] || 0,vale["thirdNum"]||0);
                 // 初始化 计划控制指标
                 vale["planTarget"] = fnList.getPlanTarget(vale["allPlanCount"] || 0,vale["storeCount"] || 0,vale["monthlyUserNum"] || 0);
                 // 初始化 经济库存配置
                 vale["stockRate"] = fnList.getStockRate(vale["storeCount"] || 0,vale["monthlyUserNum"] || 0)
               })
             })
           });
           return returnData;
         }


     };

     var getFn = function (fnName) {
         if(!fnName){
           return undefined;
         }
          //获得页面js
         var pageJS = window[CommonConfig.getConfig("pageJsName")] || {},
             fn = pageJS[fnName]; //先从页面JS中获取函数。
         if (CommonConfig.getConfig("pageToFnList") && fn && typeof fn === "function") {
             //将找到的函数返回
             return fn;
         }
         fn = fnList[fnName];
         if(fn && typeof fn === "function"){
            //将在列表中查找到的函数返回
            return fn;
         }
         console.error(fnName+"函数在common-fn列表中未找到");
         return undefined;

     };
     var getFnFromList = function(fnName){
          if(!fnName){
            return undefined;
          }
          var fn = fnList[fnName];
          if(fn && typeof fn === "function"){
             //将在列表中查找到的函数返回
             return fn;
          }
          console.error(fnName+"函数在common-fn列表中未找到");
          return undefined;
     }
     var addFn = function (fnName, fn) {
         if (typeof fn === "function") {
             fnList[fnName] = fn;
         }else{
           console.error(fn + "类型错误");
         }

     }
     return {
         addFn: addFn,
         getFn: getFn,
         getFnFromList:getFnFromList
     }

 })();
