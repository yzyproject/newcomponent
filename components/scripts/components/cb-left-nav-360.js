
/*
 * cb-left-nav 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 列表展示
 */

var CbLeftNav = (function () {
//保存容cb-left-nav组件结构的列表
    //cb-left-nav组件结构列表
    var domDivList = {
        default: '    <div class="cb-left-nav-div clearfix">' +
        '    </div>'
    };
    var getOptions;
    (function () {
        var options = {
            domDiv: "default",
            ctype:"black"
        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();

    //根据 cb-left-nav获得容器结构
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
        ajaxData($dom);
    };

    var ajaxData = function ($dom) {
        var options= $dom.data('options');
        var serviceId = options.service;
        var params = {},
            data = {},
            attr = [];
        params.service = serviceId;
        data.params = params;
        data.type =options.type ? options.type : 'POST';
        data.url = options.url ? options.url : false;
        data.successF = function (returnData) {
            var returnData = returnData[options.navListName];
            var $list = ''
            for(var i=0;returnData.length>i; i++){
                if(options.idName){
                    if(returnData[i][options.idName] == options.defaultShowId){
                         $list += '<ul class="left-list-nav left-list-nav-active" listen={"'+returnData[i][options.flagName]+'":"NavActive"} flag='+returnData[i][options.flagName]+'>';
                         attr.push(returnData[i][options.flagName]);
                         $list = domLoad(returnData[i][options.navListName],$list,options);
                         $list += '</ul>' ;
                     } else{
                         $list += '<ul class="left-list-nav" listen={"'+returnData[i][options.flagName]+'":"NavActive"} flag='+returnData[i][options.flagName]+'>';
                         attr.push(returnData[i][options.flagName]);
                         $list = domLoad(returnData[i][options.navListName],$list,options);
                         $list += '</ul>' ;
                     }
                } else{
                    $list += '<ul class="left-list-nav" listen={"'+returnData[i][options.flagName]+'":"NavActive"} flag='+returnData[i][options.flagName]+'>';
                    attr.push(returnData[i][options.flagName]);
                    $list = domLoad(returnData[i][options.navListName],$list,options);
                    $list += '</ul>' ;
                }
            }
            $dom.append($list);
            options.attr = attr;
            navHrefMatch($dom);
            operateSecondNav($dom);
            operateThirdNav($dom);
            $dom.find('.left-list-nav').each(function () {
                BindEvent.setListener($(this));
            });

        };
        data.errorF = function (returnData) {
            console.log(returnData.respDesc)
        };
        CommonAjax.ajax(data);
    };

    var domLoad = function (returnData, $list, options) {
        for (var i = 0; returnData.length > i; i++) {
            if (returnData[i][options.hrefName]) {
                $list += '<li class="nav-href" flag="' + returnData[i][options.flagName] + '"><a class=" '+returnData[i][options.iconClassName]+'" href="' + returnData[i][options.hrefName] + '">' + returnData[i][options.navTextName] + '</a>'
            } else {
                $list += '<li flag="' + returnData[i][options.flagName] + '"><a class="is-parent '+returnData[i][options.iconClassName]+'" href="javascript:void(0);">' + returnData[i][options.navTextName] + '</a>'
            }
            if (returnData[i][options.navListName] && returnData[i][options.navListName].length >0) {
                $list += '<ul>';
                $list =domLoad(returnData[i][options.navListName], $list, options);
            } else {
                $list += '</li>';
            }
            if( returnData[i][options.navListName] && returnData[i][options.navListName].length >0){
                $list +='</ul></li>';
            }
        }
        return $list;
    };


    var operateSecondNav = function ($dom) {
        $dom.on('click','.left-list-nav-active>li>.is-parent',function () {
            $(this).addClass('active');
            $(this).parents('li').siblings('li').children('a').removeClass('active');
            if($(this).hasClass('pack-up')){
                $(this).removeClass('pack-up');
                $(this).parents('li').children('ul').hide();
            } else{
                $(this).addClass('pack-up');
                $(this).parents('li').children('ul').show();
            }
        })
    };

    var operateThirdNav = function ($dom) {
        $dom.on('click','.left-list-nav-active>li ul a',function () {
            $(this).parents('.left-list-nav-active').find('ul').find('a').removeClass('active');
            $(this).addClass('active');
            $(this).parents('.left-list-nav-active').children('li').children('a').removeClass('active');
            $(this).parent('li').parent('ul').parent('li').children('a').addClass('active');
        });
    };

    var strArray = [];
    var navHrefMatch = function ($dom) {
       var options= $dom.data("options");
      var  localHref = window.location.href;
        $dom.find('.nav-href').each(function () {
            var  aHref = $(this).children('a').attr('href');
            if(localHref.indexOf(aHref) > 0 || localHref.indexOf(aHref) === 0 ){
                $(this).children('a').addClass('active');
                $(this).parents('ul').prev('a').addClass('active');
                $(this).parents('.left-list-nav').addClass('left-list-nav-active');
                $(this).parents('.left-list-nav').children('li').children('a.active').addClass('pack-up');
                $(this).parents('.left-list-nav').children('li').children('a.active').next('ul').show();
                $(this).parents('.left-list-nav').show();
                var leftNavFlag = $(this).parents('.left-list-nav').attr('flag');
                if( !$('div[tagtype="cb-main-nav"]')){
                    navHrefMatch($dom);
                    return false;
                } else{
                    $('div[tagtype="cb-main-nav"]').find('.main-nav-list').children('li').each(function () {
                        if($(this).data('bindcl') == leftNavFlag){
                            $(this).addClass('main-nav-active');
                            strArray.push($(this).html());
                            return false;
                        }
                    })
                    $dom.find('.left-list-nav-active').find('a.active').each(function () {
                        strArray.push($(this).html());
                    });
                    Event.trigger('breadcrumbsInfo',strArray);
                }
            }
        })
    };

    var expandFun = function($dom){
        if($dom.hasClass("expand")){
            $dom.find(".left-list-nav-active>li>ul").addClass("secondMenu");
            $dom.on('mouseover','.left-list-nav>li',function () {
                var $expand = $(this).closest(".expand");
                if($expand && $expand.length>0){
                    $(this).children('a').addClass('active');
                    $(this).addClass("stretch");
                    $(this).children("ul").addClass("showMenu").addClass("left-list-nav-expandUl");
                }else{
                    console.log(2);
                }
            });
            $dom.on('mouseout','.left-list-nav>li',function () {
                var $expand = $(this).closest(".expand");
                if($expand && $expand.length>0){
                    $(this).children('a').removeClass('active');
                    $(this).removeClass("stretch");
                    $(this).children("ul").removeClass("showMenu").removeClass("left-list-nav-expandUl");
                }else{
                }
            });
        }else{
            $dom.find(".left-list-nav>li>ul.secondMenu").removeClass("secondMenu");
        }
    };
    return {
        initTag: initTag,
        initHtml: initHtml,
        expandFun:expandFun
    };
})();

//注册CbLeftNav组件
ParsingHelper.registerComponent("cb-left-nav", CbLeftNav);