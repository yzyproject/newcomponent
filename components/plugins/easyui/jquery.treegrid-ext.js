(function ($) {
    "use strict";

    $.fn.treegridData = function (options, param) {
        //����ǵ��÷���
        if (typeof options == 'string') {
            return $.fn.treegridData.methods[options](this, param);
        }

        //����ǳ�ʼ�����
        options = $.extend({}, $.fn.treegridData.defaults, options || {});
        var target = $(this);
        debugger;
        //�õ����ڵ�
        target.getRootNodes = function (data) {
            var result = [];
            $.each(data, function (index, item) {
                if (!item[options.parentColumn]) {
                    result.push(item);
                }
            });
            return result;
        };
        var j = 0;
        //�ݹ��ȡ�ӽڵ㲢�������ӽڵ�
        target.getChildNodes = function (data, parentNode, parentIndex, tbody) {
            $.each(data, function (i, item) {
                if (item[options.parentColumn] == parentNode[options.id]) {
                    var tr = $('<tr></tr>');
                    var nowParentIndex = (parentIndex + (j++) + 1);
                    tr.addClass('treegrid-' + nowParentIndex);
                    tr.addClass('treegrid-parent-' + parentIndex);
                    $.each(options.columns, function (index, column) {
                        var td = $('<td></td>');
                        td.text(item[column.field]);
                        tr.append(td);
                    });
                    tbody.append(tr);
                    target.getChildNodes(data, item, nowParentIndex, tbody)

                }
            });
        };
        target.addClass('table');
        if (options.striped) {
            target.addClass('table-striped');
        }
        if (options.bordered) {
            target.addClass('table-bordered');
        }
        if (options.url) {
            $.ajax({
                type: options.type,
                url: options.url,
                data: options.ajaxParams,
                dataType: "JSON",
                success: function (data, textStatus, jqXHR) {
                    debugger;
                    //�����ͷ
                    var thr = $('<tr></tr>');
                    $.each(options.columns, function (i, item) {
                        var th = $('<th style="padding:10px;"></th>');
                        th.text(item.title);
                        thr.append(th);
                    });
                    var thead = $('<thead></thead>');
                    thead.append(thr);
                    target.append(thead);

                    //�������
                    var tbody = $('<tbody></tbody>');
                    var rootNode = target.getRootNodes(data);
                    $.each(rootNode, function (i, item) {
                        var tr = $('<tr></tr>');
                        tr.addClass('treegrid-' + (j + i));
                        $.each(options.columns, function (index, column) {
                            var td = $('<td></td>');
                            td.text(item[column.field]);
                            tr.append(td);
                        });
                        tbody.append(tr);
                        target.getChildNodes(data, item, (j + i), tbody);
                    });
                    target.append(tbody);
                    target.treegrid({
                        expanderExpandedClass: options.expanderExpandedClass,
                        expanderCollapsedClass: options.expanderCollapsedClass
                    });
                    if (!options.expandAll) {
                        target.treegrid('collapseAll');
                    }
                }
            });
        }
        else {
            //Ҳ����ͨ��defaults�����data����ͨ������һ�����ݼ��Ͻ�����������г�ʼ��....����Ȥ�����Լ�ʵ�֣�˼·����������
        }
        return target;
    };

    $.fn.treegridData.methods = {
        getAllNodes: function (target, data) {
            return target.treegrid('getAllNodes');
        },
        //�������������Ҳ���Խ������Ʒ�װ........
    };

    $.fn.treegridData.defaults = {
        id: 'Id',
        parentColumn: 'ParentId',
        data: [],    //����table�����ݼ���
        type: "GET", //�������ݵ�ajax����
        url: null,   //�������ݵ�ajax��url
        ajaxParams: {}, //�������ݵ�ajax��data����
        expandColumn: null,//����һ��������ʾչ����ť
        expandAll: true,  //�Ƿ�ȫ��չ��
        striped: false,   //�Ƿ���н���ɫ
        bordered: false,  //�Ƿ���ʾ�߿�
        columns: [],
        expanderExpandedClass: 'glyphicon glyphicon-chevron-down',//չ���İ�ť��ͼ��
        expanderCollapsedClass: 'glyphicon glyphicon-chevron-right'//����İ�ť��ͼ��

    };
})(jQuery);
