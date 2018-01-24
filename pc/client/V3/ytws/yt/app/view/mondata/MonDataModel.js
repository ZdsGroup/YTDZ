/**
 * Created by LBM on 2017/12/30.
 */
Ext.define('yt.view.mondata.MonDataModel', {
    extend: 'Ext.app.ViewModel',
    alias: 'viewmodel.mondata',

    requires: [],

    stores: {
        /*
        A declaration of Ext.data.Store configurations that are first processed as binds to produce an effective
        store configuration. For example:

        users: {
            model: 'MonData',
            autoLoad: true
        }
        */
        typeStore: {
            alias: 'store.types',
            data: [
                // {name: '全部类型', type: 'alljc'},
                {name: '裂缝设备', type: 'lfjc'},
                {name: '位移设备', type: 'wyjc'},
                {name: '雨量设备', type: 'yljc'}
            ]
        }
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
        gridPageStore:{
            total: 0,
            currentPage: 0,
            pageSize: 20
        }
    }
});