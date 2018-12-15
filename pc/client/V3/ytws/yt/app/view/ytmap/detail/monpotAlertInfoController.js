/**
 * Created by lyuwei on 2018/1/30.
 */
Ext.define('yt.view.ytmap.detail.monpotAlertInfoController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.monpotalertinfo',

    requires: [
        'Ext.data.Store'
    ],

    /**
     * Called when the view is created
     */
    init: function () {

    },

    exportExcelFile: function () {
        var me = this;
        var meView = me.getView();
        var datagrid = meView.lookupReference('AlertInfoGridPanel');
        var rankNumber = meView.lookupReference('rankCombo').getValue();
        var action = "alarms";
        var param = {};
        switch (rankNumber) {
            case '红色预警':
                param.rank = 4;
                break;
            case '橙色预警':
                param.rank = 3;
                break;
            case '黄色预警':
                param.rank = 2;
                break;
            case '蓝色预警':
                param.rank = 1;
                break;
        }
        if (meView.deviceCode === '') {
            // 看设备列表的选择
            var selectedValue = meView.lookupReference('deviceList').getValue();
            if (!selectedValue) selectedValue = '';
            param.deviceid = selectedValue;
        } else {
            param.deviceid = meView.deviceCode;
        }
        var selectedStatus = meView.lookupReference('statusCombo').getValue();
        param.status = selectedStatus;
        param.quakeid = meView.quakeId;
        param.begin = meView.lookupReference('startDate').getRawValue();
        param.end = meView.lookupReference('endDate').getRawValue();

        window.open(conf.serviceUrl + 'alarms/expxls?status=' + param.status + '&quakeid=' + param.quakeid + '&deviceid=' + param.deviceid + '&rank=' + param.rank + '&begin=' + param.begin + '&end=' + param.end);
    },

    // 预警信息面板相关 controller
    alertInfoBoxReady: function () {
        var me = this;
        var meView = me.getView();
        var rankNumber = meView.lookupReference('rankCombo');
        if (meView.rankStr !== '') {
            rankNumber.setValue(meView.rankStr);
        }

        if (meView.deviceCode === '') {
            meView.lookupReference('deviceListPanel').show();
            // 查询对应的地灾点的设备列表
            // mv.v.mapDetailPanelInfo.children 为设备列表
            var deviceListArr = [
                {label: '全部设备', deviceCode: ''}
            ];
            var quakeChildren = mv.v.mapDetailPanelInfo.children;
            if (quakeChildren && quakeChildren instanceof Array) {
                for (var index = 0; index < quakeChildren.length; index++) {
                    deviceListArr.push(
                        {
                            label: quakeChildren[index].text,
                            deviceCode: quakeChildren[index].code
                        }
                    )
                }
            }
            meView.lookupReference('deviceList').setStore(
                new Ext.create('Ext.data.Store', {
                    data: deviceListArr
                })
            );
        }

        me.updateAlertInfoDataGrid(1);
    },
    updateAlertInfoDataGrid: function (wantpageno) {
        if (!wantpageno) return;
        var me = this;
        var meView = me.getView();
        var datagrid = meView.lookupReference('AlertInfoGridPanel');
        var rankNumber = meView.lookupReference('rankCombo').getValue();
        var action = "alarms";
        var param = {};
        switch (rankNumber) {
            case '红色预警':
                param.rank = 4;
                break;
            case '橙色预警':
                param.rank = 3;
                break;
            case '黄色预警':
                param.rank = 2;
                break;
            case '蓝色预警':
                param.rank = 1;
                break;
        }
        if (meView.deviceCode === '') {
            // 看设备列表的选择
            var selectedValue = meView.lookupReference('deviceList').getValue();
            if (!selectedValue) selectedValue = '';
            param.deviceid = selectedValue;
        } else {
            param.deviceid = meView.deviceCode;
        }
        var selectedStatus = meView.lookupReference('statusCombo').getValue();
        param.status = selectedStatus;
        param.quakeid = meView.quakeId;
        param.begin = meView.lookupReference('startDate').getRawValue();
        param.end = meView.lookupReference('endDate').getRawValue();
        param.pageno = wantpageno;
        param.pagesize = meView.getViewModel().get('gridPageStore').pageSize;

        var mask = ajax.fn.showMask(meView, '数据加载中...');

        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if (!result['data']) return;

            meView.getViewModel().set('gridPageStore', {
                total: result['data']['total'],
                currentPage: result['data']['page'],
                pageSize: result['data']['size']
            });

            var gridStore = new Ext.create('Ext.data.Store', {
                data: result.data.rows
            });
            datagrid.setStore(gridStore);
        }

        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }

        ajax.fn.executeV2(param, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
    },
    AlertInfobuttonClick: function () {
        var me = this;
        var meView = me.getView();
        me.updateAlertInfoDataGrid(1);
    },
    pagebuttonChange: function (thisExt, page, eOpts) {
        var me = this;
        me.updateAlertInfoDataGrid(page);
        return false;
    },

    rankrenderer: function (value) {
        var showStr = '';
        switch (value) {
            case 4:
                showStr = '<span style="color: red">红色预警</span>';
                break;
            case 3:
                showStr = '<span style="color: orange">橙色预警</span>';
                break;
            case 2:
                showStr = '<span style="color: #9e9e00">黄色预警</span>';
                break;
            case 1:
                showStr = '<span style="color: blue">蓝色预警</span>';
                break;
            default:
                showStr = value;
                break;
        }

        return showStr;
    },

    widgetColumAttach: function (col, widget, rec) {
        var handleStatus = (rec.get('status') === 0);
        widget.setText(handleStatus ? '处置' : '已处置');
        widget.setDisabled(!handleStatus);
        if (handleStatus) {
            // 如果是未处置的数据
            widget.setHandler(clickFunction);

            function clickFunction() {
                var rankStr = '';
                switch (rec.get('rank')) {
                    case 4:
                        rankStr = '红色预警';
                        break;
                    case 3:
                        rankStr = '橙色预警';
                        break;
                    case 2:
                        rankStr = '黄色预警';
                        break;
                    case 2:
                        rankStr = '蓝色预警';
                        break;
                }
                Ext.MessageBox.confirm(
                    '请确认处置',
                    '确认处置' + rec.get('devicename') + '设备的' + rankStr + '吗?',
                    function (confirmButton) {
                        if (confirmButton === 'yes') {
                            // 确认弹出框点击的是 yes
                            // 将指定 id 的 status 改成 1
                            var params = {
                                ids: rec.get('id'),
                                status: 1
                            }
                            ajax.fn.executeV2(params, 'POST', conf.serviceUrl + 'alarms/status', successChangeStatus, failureChangeStatus);

                            function successChangeStatus(response, opts) {
                                //查询结果转json对象
                                var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

                                if (result['code'] !== 0)
                                    return;

                                widget.setText('已处置');
                                widget.setDisabled(true);
                            }

                            function failureChangeStatus(response, opts) {
                                alert(response.responseText);
                            }
                        }
                    }
                )
            }
        }
    }
});
