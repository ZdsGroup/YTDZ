/**
 * Created by lyuwei on 2018/1/17.
 */
Ext.define('yt.view.ytmap.detail.analytics.EchartsBasePanel', {
    extend: 'Ext.Container',

    /*
    Uncomment to give this component an xtype
    xtype: 'echartsbasepanel',
    */
    xtype: 'echartsbasepanel',

    requires: [],

    bodyPadding: 5,
    border: false,

    config: {
        echartsOption: null
    },

    initComponent: function(){
        var me = this;
        me.on("boxready", function () {
            if( !me.getHeight() ){
                throw new Error("图表组件要高度");
            }
            me.echarts = echarts.init(me.getEl().dom);
            if (me.echartsOption) {
                me.echarts.setOption(me.echartsOption);
            }
        });
        me.on("resize",function () {
            me.echarts.resize(me.getWidth(), me.getHeight());
        })
        me.callParent();
    },

    getEcharts: function () {
        var me = this;
        if( !me.echarts )
            throw new Error('echarts 还没有初始化')

        return me.echarts;
    }
});