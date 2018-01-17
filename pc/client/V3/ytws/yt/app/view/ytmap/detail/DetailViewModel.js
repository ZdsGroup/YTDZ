/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.DetailViewModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.detailViewModel',

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'Detail',
            autoLoad: true
        }
        */
        // 设备列表
        deviceList:  {
            data: [
                {
                    "id": 7,
                    "deviceid": 301,
                    "quakeid": 100000,
                    "regionid": 0,
                    "name": "裂缝设备2",
                    "username": "张欣怡",
                    "mobile": "18851376895",
                    "description": "设备运行保障无问题",
                    "company": "联通公司",
                    "lat": "28.22171",
                    "lng": "117.224488",
                    "address": "南山大道与火炬大道交叉口东50米",
                    "type": 3,
                    "connectstatus": 0,
                    "batterystatus": 0,
                    "runstatus": 1,
                    "rate": 0,
                    "reason": "",
                    "modtime": "2017-11-24 11:12:35",
                    "addtime": "2017-11-24 11:12:35",
                    "rank": 0,
                    "alarmnum": 0
                },
                {
                    "id": 1,
                    "deviceid": 302,
                    "quakeid": 100000,
                    "regionid": 0,
                    "name": "裂缝监测设备1",
                    "username": "秦晨光",
                    "mobile": "18851376895",
                    "description": "设备运维保障无问题",
                    "company": "移动公司",
                    "lat": "28.224357",
                    "lng": "117.204488",
                    "address": "南山大道与火炬大道交叉口东50米",
                    "type": 3,
                    "connectstatus": 0,
                    "batterystatus": 1,
                    "runstatus": 0,
                    "rate": 0,
                    "reason": "",
                    "modtime": "2017-11-24 11:12:35",
                    "addtime": "2017-11-24 11:12:35",
                    "rank": 1,
                    "alarmnum": 0
                },
                {
                    "id": 2,
                    "deviceid": 7,
                    "quakeid": 100000,
                    "regionid": 0,
                    "name": "位移监测设备1",
                    "username": "秦晨光",
                    "mobile": "18851376895",
                    "description": "设备运维保障无问题",
                    "company": "移动公司",
                    "lat": "28.219786",
                    "lng": "117.205647",
                    "address": "南山大道与火炬大道交叉口东50米",
                    "type": 1,
                    "connectstatus": 1,
                    "batterystatus": 0,
                    "runstatus": 0,
                    "rate": 0,
                    "reason": "",
                    "modtime": "2017-11-24 11:12:59",
                    "addtime": "2017-11-24 11:12:59",
                    "rank": 0,
                    "alarmnum": 0
                },
                {
                    "id": 5,
                    "deviceid": 8,
                    "quakeid": 100000,
                    "regionid": 0,
                    "name": "位移监测设备2",
                    "username": "秦晨光",
                    "mobile": "18851376895",
                    "description": "设备运维保障无问题",
                    "company": "移动公司",
                    "lat": "28.22161",
                    "lng": "117.200626",
                    "address": "南山大道与火炬大道交叉口东50米",
                    "type": 1,
                    "connectstatus": 1,
                    "batterystatus": 1,
                    "runstatus": 1,
                    "rate": 0,
                    "reason": "",
                    "modtime": "2017-11-27 01:40:20",
                    "addtime": "2017-11-24 11:44:17",
                    "rank": 0,
                    "alarmnum": 0
                }
            ]
        },

        // 智能分析 中所有图表数据
        linechartData: {
            data:[
                { month: '1月', data1: 20, data2: 37, data3: 35, data4: 4, other: 4 },
                { month: '2月', data1: 20, data2: 37, data3: 36, data4: 5, other: 2 },
                { month: '3月', data1: 19, data2: 36, data3: 37, data4: 4, other: 4 },
                { month: '4月', data1: 18, data2: 36, data3: 38, data4: 5, other: 3 },
                { month: '5月', data1: 18, data2: 35, data3: 39, data4: 4, other: 4 },
                { month: '6月', data1: 17, data2: 34, data3: 42, data4: 4, other: 3 },
                { month: '7月', data1: 16, data2: 34, data3: 43, data4: 4, other: 3 },
                { month: '8月', data1: 16, data2: 33, data3: 44, data4: 4, other: 3 },
                { month: '9月', data1: 16, data2: 32, data3: 44, data4: 4, other: 4 },
                { month: '10月', data1: 16, data2: 32, data3: 45, data4: 4, other: 3 },
                { month: '11月', data1: 15, data2: 31, data3: 46, data4: 4, other: 4 },
                { month: '12月', data1: 15, data2: 31, data3: 47, data4: 4, other: 3 }
            ]
        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
    }
});