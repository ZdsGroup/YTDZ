/**
 * Created by LBM on 2017/8/10.
 */
Ext.define('yt.plugin.SearchField', {
    extend: 'Ext.form.field.Trigger',
    xtype: 'searchField',
    //fieldLabel: '搜 索',
    triggers: {
        clear: {
            weight: 0,
            cls: Ext.baseCSSPrefix + 'form-clear-trigger',
            hidden: true,
            // handler: 'onClearClick',//实际应用中追加事件绑定
            scope: 'this'
        },
        search: {
            weight: 1,
            cls: Ext.baseCSSPrefix + 'form-search-trigger',
            // handler: 'onSearchClick',//实际应用中追加事件绑定
            scope: 'this'
        }
    }
});