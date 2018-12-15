/**
 * The main application class. An instance of this class is created by app.js when it
 * calls Ext.application(). This is the ideal place to handle application launch and
 * initialization details.
 */
Ext.define('yt.Application', {
    extend: 'Ext.app.Application',

    name: 'yt',
    //controllers: ["GlobalController"],
    stores: [
        // TODO: add global / shared stores here
    ],

    controllers: ["Global"],

    requires: [
        'yt.conf.SystemConfig',
        'yt.conf.Bounds',
        'yt.utils.AjaxUtils'
    ],

    launch: function () {
        // TODO - Launch the application
        document.title = conf.title;
        var load = Ext.get('loading');
        if (load) {
            load.remove();//清除启动mask
        }

        //设置应用到期时间
        var expireDate = new Date();
        expireDate.setFullYear(2019, 2, 15);
        //获取当前时间
        var nowDate = new Date();
        var days = expireDate.getTime() - nowDate.getTime();
        //var day = parseInt(days / (1000 * 60 * 60 * 24));

        if (days <= 0) {
            Ext.Msg.show({
                title: '温馨提示',
                message: '应用许可已到期，请联系管理员！',
                buttons: Ext.Msg.YES,
                icon: Ext.Msg.INFO,
                fn: function (btn) {
                    if (btn === 'yes') {
                        window.opener = null;
                        window.open('', '_self');
                        window.close();
                    }
                }
            });
        }
    },

    onAppUpdate: function () {
        //应用更新之后自动重载
        window.location.reload();
    }
});
