/**
 * Created by lyuwei on 2018/1/9.
 */
Ext.define('yt.view.monpot.monpotMonitordata', {
    extend: 'Ext.tab.Panel',

    /*
    Uncomment to give this component an xtype
    xtype: 'monpotmonitordata',
    */
    xtype: 'monpot-monitordata',

    requires: [
        'Ext.grid.Panel',
        'Ext.toolbar.Paging'
    ],

    ui: 'navigation',
    flex: 1,
    tabBar: {
        layout: {
            pack: 'center'
        },
        // turn off borders for classic theme.  neptune and crisp don't need this
        // because they are borderless by default
        border: false
    },

    defaults: {
        bodyPadding: 5
    },

    items: [{
        title: '数据列表',
        xtype: 'gridpanel',
        frame: true,
        emptyText: '无数据',
        columns: [{
            dataIndex: '1',
            text: '设备名称',
            flex: 1,
            // filter: {
            //     type: 'string',
            //     itemDefaults: {
            //         emptyText: 'Search for...'
            //     }
            // }
        }, {
            dataIndex: '2',
            text: '设备ID',
            width: 90,
            // filter: 'number'
        }],
        bbar: {
            xtype: 'pagingtoolbar',
            displayInfo: true,
            displayMsg: '当前展示 {0} - {1} 共 {2}',
            emptyMsg: "当前列表为空"
        }

    }, {
        title: '数据比对',
        html: '2'
    }]
});