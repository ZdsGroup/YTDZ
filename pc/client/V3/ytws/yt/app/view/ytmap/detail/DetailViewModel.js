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
    },

    data: {
        /* This object holds the arbitrary data that populates the ViewModel and is then available for binding. */
        gridPageStore:{
            total: 0,
            currentPage: 0,
            pageSize: 20
        },

        deviceDetailInfo: {
            name: 'test1',
            username: 'test11',
            mobile: 'test12',
            address: 'test13',
            addtime: 'test14',
            rate: 'test15',
            modtime: 'test16'
        },

        dzdDetailInfo: {
            name: 'test1',
            username: 'test11',
            mobile: 'test12',
            address: 'test13',
            addtime: 'test14',
            rate: 'test15',
            modtime: 'test16'
        }
    }
});