/**
 * Created by Administrator on 2018-1-5.
 */
var wt = {
    v: {
        a: ''
    },
    fn: {
        initView: function () {
            var obj = Ext.getDom('scrollobj');
            obj.innerHTML += obj.innerHTML;
        },
        scroll: function (obj) {
            (obj.scrollLeft)++;
            if (obj.scrollLeft == obj.children[0].offsetWidth) {
                obj.scrollLeft = 0;
            }
        },
        stop: function () {
            clearInterval(wt.v.a);
        },
        start: function () {
            wt.v.a = setInterval("wt.fn.scroll(Ext.getDom('scrollobj'))", 30);
        }
    }
}

Ext.define('yt.view.warntip.WarntipController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.warntip',

    /**
     * Called when the view is created
     */
    init: function () {
    }
});