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
        'yt.utils.AjaxUtils'
    ],

    launch: function () {
        // TODO - Launch the application
        document.title = conf.title;
        var load = Ext.get('loading');
        if (load) {
            load.remove();//清除启动mask
        }
    },

    onAppUpdate: function () {
        //应用更新之后自动重载
        window.location.reload();
    }
});
