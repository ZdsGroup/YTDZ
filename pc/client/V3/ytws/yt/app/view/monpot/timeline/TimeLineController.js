/**
 * Created by lyuwei on 2018/1/1.
 */
Ext.define('yt.view.monpot.timeline.TimeLineController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.timeline',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    warmButtonCountClick: function (buttonExt, evt, eOpts) {
        buttonExt.toggleCls('normal');
        console.log(buttonExt);
        // 遍历所有 warmbutton 得到当前选中的所有rank值，过滤对应的store
    }
});