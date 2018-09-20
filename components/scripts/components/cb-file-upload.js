/*
 * cb-file-upload 1.0.0
 * author： anwenzhen
 * Time: 2017.4.12
 * description: 文件上传
 */

var CbFileUpload = (function () {
//保存容cb-file-upload组件结构的列表
    //cb-file-upload组件结构列表
    var domDivList = {
        default: '       <div class="cb-file-upload-div">' +
        '<ul class="files-list clearfix"></ul>' +
        '<div class="btn-upload-wrapper">' +
        '<a href="javascript:void(0);" class="label-remark"><span class="uploadIcon"></span><span class="uploadText"></span></a><input type="hidden" class="label-remark-input"> ' +
        '<input hasBind="true" class="fileupload input-file" type="file" name="file"><span class="fileName"></span> </div> ' +
        '</div> ',
        defalutInput: '       <div class="cb-file-upload-div">' +
        '<ul class="files-list clearfix"></ul>' +
        '<div class="btn-upload-wrapper">' +
        ' <input type="text" readonly class="label-remark-input">' +
        '<input hasBind="true" class="fileupload input-file" type="file" name="file"><span class="fileName"></span></div> ' +
        '</div> '
    };
    var getOptions;
    (function () {
        var options = {
            domDiv: "default",
            isRequired:true
        };
        getOptions = function () {
            return $.extend({}, options);
        }
    })();

    //根据 cb-file-upload获得容器结构
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

    var fileArray;
    var afterAjax;
//node端解析入口
    var initTag = function ($tag) {
        //获得具体的配置项
        var options = $.extend(getOptions(), $tag.data("options"));
        var $dom = $(getDomDiv(options["domDiv"]).replace("wing", options["type"]));
        $tag.after($dom);
        //处理公共部位的宏命令
        Macro.macroCommand($tag, $dom, options);
        $dom.find('.label-remark>.uploadText').html(options.labelRemark);
        $dom.find('.label-remark-input').attr("name",options.name);
        if(options.ctype === "text" || !options.ctype){
            $dom.addClass('cb-file-upload-text');
        }
        $tag.remove();
        return $dom;
    };

    var beforeUploadFun ;
    var beforeUpload = function(fun){
        beforeUploadFun = fun;
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
        var options = $dom.data("options"),
            cid = $dom.attr("cid");
        if(options.padding){
            for(;options.padding.length<5;){
                options.padding.push(0);
            }
            $dom.css('paddingTop',options.padding[0]);
            $dom.css('paddingRight',options.padding[1]);
            $dom.css('paddingBottom',options.padding[2]);
            $dom.css('paddingLeft',options.padding[3]);
        }
        options.name && $dom.find("input[type='file']").attr("name",options.name);
        var limitFileType = options.limitFileType;
        limitFileType = limitFileType.join("|");
        var fileUrl = options.url;
        var fileNum = 0;
        options.fileNum = fileNum;
        options.maxFileNum = options.maxFileNum?options.maxFileNum:1;
        //window.fileArray = [];
        $dom.find('.fileupload').fileupload(
            {
            url: fileUrl,
            dataType: 'json',
            singleFileUploads: false,
            acceptFileTypes: eval('/(\\.|\\/)('+limitFileType+')$/i'),
            messages: {
                acceptFileTypes: '文件类型不匹配'
            },
            maxNumberOfFiles:options.maxFileNum,
            autoUpload: options.autoUpload === false? options.autoUpload :true,
            processalways:function (e, data){
                //是否添加参数

            }


        }).on('fileuploadadd', function (e, data) {
                var fileState;
                if(!fileArray){
                    data.files[0]["fileName"] = options.name;
                    fileArray = data;
                    fileState = false;
                }else{
                    fileState = true;
                }
            var fileNameArray = data.files[0].name.split("."),
                fileType = fileNameArray[fileNameArray.length-1],
                reg = new RegExp('^'+limitFileType+'$');
            if (!reg.test(fileType)) {
                layer.alert('文件类型不匹配', {
                    icon: 'error',
                    skin: 'layui-blue'
                });

                return false;
            }
            if(data.files[0].size > options.maxFileSize){
                    layer.alert('文件过大', {
                        icon: 'error',
                        skin: 'layui-blue'
                    });
                return false;
            }

            if(options.fileNum >= options.maxFileNum){
                layer.alert('文件个数大于上传文件最多数', {
                    icon: 'error',
                    skin: 'layui-blue'
                });
                return false;
            }
            //上传之前的函数执行
            if(beforeUploadFun){
                beforeUploadFun.call(this,fileNum);
            }
            if(options.autoUpload === false && options.echoFileNameCid){

                options.fileNum++;
                //fileArray.push(data);
                //options.fileArray = fileArray;
                $.each(data.files, function (index, file) {
                    var fileNameString = $('div[cid="'+options.echoFileNameCid+'"]').find('input').val();
                    if(fileNameString === ''){
                        $('div[cid="'+options.echoFileNameCid+'"]').find('input').val(file.name);
                    } else{
                        $('div[cid="'+options.echoFileNameCid+'"]').find('input').val(fileNameString+','+file.name);
                    }
                    /*if(fileArray[$dom.attr("cid")]){
                        fileArray[$dom.attr("cid")][file.name] = data;
                    }else{
                        fileArray[$dom.attr("cid")]={};
                        fileArray[$dom.attr("cid")][file.name] = data;
                    }*/
                    if(fileState){
                        data.files[0]["fileName"] = options.name;
                        fileArray.files.push(data.files[0]);
                        fileArray.paramName.push(options.name);
                    }

                });
            }
            else{
              layer.load();
              data.submit();
            }

        }).on('fileuploaddone', function (e, data) {
            layer.closeAll('loading');
            if(options.afterAjax){
                var data = data.result;
                var afterAjax = new Function('$dom',"data",options.afterAjax);
                var state  = afterAjax($dom,data);
                if(!state){
                    return false;
                }
            }

            if(options.autoUpload === true && options.isShowFileName) {
                options.fileNum++;
                if(options.fileName){
                    $dom.find('input[name="options.name"]').val(data.result[options.fileName]);
                }
            }else if(options.autoUpload === true){
                options.fileNum++;
            }
            if(options.echoContent){
                $('div[cid="'+options.relateCid+'"]').children().val(data.result[options.echoContent]);
            }
            options.fileArray = [];
            layer.alert('文件上传成功', {
                icon: 'success',
                skin: 'layui-blue'
            });
        }).on('fileuploadfail', function (e, data) {
            layer.closeAll('loading');
            layer.alert('文件上传失败', {
                icon: 'error',
                skin: 'layui-blue'
            });
        }).on('fileuploadsubmit',function(e,data){
            //放置上传所带参数
            if(sendData){
                data.formData = sendData;
            }
        });
        //回显删除按钮
        $(".close-btn").unbind("click");
        $(document).on("click",".close-btn",function(){
            options.fileNum--;
            $(this).parents("li").html("").remove();
        });
    };

    var sendData;
    var addParameter = function(data){
        sendData = data;
    };

    var  fileUpload = function ($dom) {
        var options = $dom.data('options');
        var cid = $dom.attr("cid");
        if(fileArray && fileArray.files.length>0){
            fileArray.submit();
            return true;
        }else{
            if(options.isRequired){
                layer.alert('请选择文件', {
                    icon: 'error',
                    skin: 'layui-blue'
                });
            }
            return false;
        }

        /*if(fileArray){
            if(fileArray[cid]){
                var fileDatas = fileArray[cid];
                for(var p in fileDatas){
                    var data = fileDatas[p];
                    $.each(data.files, function (index, file) {
                        if (data.files[index].name) {
                            layer.load();
                            data.submit();
                        }
                    })
                }
            }else{
                $dom.find("form").submit();
            }
        }*/
        /*if(fileArray){
            if(fileArray.length>0){
                for(var i=0;fileArray.length>i;i++) {
                    var data = fileArray[i];
                    $.each(data.files, function (index, file) {
                        if (data.files[index].name) {
                            layer.load();
                            data.submit();
                        }
                    })
                }
            }else{
                layer.alert('请选择文件', {
                    icon: 'error',
                    skin: 'layui-blue'
                });
            }
        }else{
            layer.alert('请选择文件', {
                icon: 'error',
                skin: 'layui-blue'
            });
        }*/

    };
    var  cancelFileUpload = function ($dom,fileName) {
        layer.closeAll('loading');
        var options = $dom.data('options');
        var echoFileNameCid = options.echoFileNameCid;
        var $echoFileName = $("[cid='"+echoFileNameCid+"']>input");
        var fileNames = $echoFileName.val();
        var files = fileArray.files;
        var cancelArray= fileNames.split(',');
        for(var i=0;i<files.length;i++){
            var fileData = files[i];
            if(!fileName){
                for(var p=0;p<cancelArray.length;p++){
                    if(fileData["name"]==cancelArray[p] && fileData["fileName"] == options.name){
                        files.splice(i,1);
                        fileArray.paramName.splice(i,1);
                        i-=1;
                    }
                }
                options.fileNum = 0;
            }else{
                var cancelFile = fileName.split(",");
                for(var p=0;p<cancelFile.length;p++){
                    if(fileData.name==cancelFile[p]){
                        files.splice(i,1);
                        fileArray.paramName.splice(i,1);
                        i-=1;
                        options.fileNum -= 1;
                    }
                }
            }
        }
        /*
        if(fileName){
            delete fileArray[cid][fileName];
        }else{
            fileArray[cid]={};
        }*/
        $('div[cid="'+options.echoFileNameCid+'"]').find('input').val('');
    };




    return {
        initTag: initTag,
        initHtml: initHtml,
        fileUpload:fileUpload,
        cancelFileUpload:cancelFileUpload,
        addParameter:addParameter,
        beforeUpload:beforeUpload
    };
})();

//注册CbFileUpload组件
ParsingHelper.registerComponent("cb-file-upload", CbFileUpload);
