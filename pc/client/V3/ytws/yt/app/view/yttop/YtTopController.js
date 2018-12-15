/**
 * Created by LBM on 2017/12/27.
 */
Ext.define('yt.view.yttop.YtTopController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.top',

    /**
     * Called when the view is created
     */
    init: function () {

    },
    loginOutHandler: function () {
        //清空缓存
        localUtils.clearLocalStorage(conf.sysLocalStore);

        //应用更新之后自动重载
        window.location.reload();
    }
});