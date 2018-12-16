/**此对象为ajax请求类，全局唯一，每次调用前需要初始化相关参数，url默认已经添加,不需要重复设置*/
var ajax = {
    v: {
        timeout: 60000,//请求超时设置
        method: 'GET',//请求方式
        url: '',//请求服务地址
        successCallBack: null,//回调至少包含一个参数
        failureCallBack: null,//回调至少包含一个参数
        params: null//采用json对象的方式组织参数，如 ajax.v.params = {action: 'query',name: '北京'};
    },
    fn: {
        showMask: function (target, msg) {
            var mask = new Ext.LoadMask(target, {
                msg: msg,
                removeMask: true
            });
            mask.show();
            return mask;
        },
        hideMask: function (mask) {
            if (mask) {
                mask.hide();
                mask = null;
            }
        },
        execute: function () {
            if (ajax.v.params == null) {
                ajax.v.params = {};
            }
            //追加时间戳
            ajax.v.params['timeStamp'] = Ext.Date.now();

            Ext.Ajax.setTimeout(ajax.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                method: ajax.v.method,
                url: ajax.v.url,
                success: function (response, opts) {
                    ajax.v.successCallBack(response, opts);
                },
                failure: function (response, opts) {
                    ajax.v.failureCallBack(response, opts);
                },
                params: ajax.v.params
                /*params: {
                    requestData: encodeURI(Ext.JSON.encode(ajax.v.params)),
                    timeStamp: Ext.Date.now()
                }*/
            });
        },
        executeV2: function (params, method, url, successcallback, failurecallback) {
            if (params === null || params === undefined) {
                params = {};
            }
            //追加时间戳
            params['timeStamp'] = Ext.Date.now();

            Ext.Ajax.setTimeout(ajax.v.timeout);
            Ext.Ajax.async = true;
            Ext.Ajax.cors = true;
            Ext.Ajax.request({
                headers: {
                    'token': conf.loginInfo != null ? conf.loginInfo['token'] : ''
                },
                method: method || ajax.v.method,
                url: url || ajax.v.url,
                success: function (response, opts) {
                    //todo 2018-12-15--这里到时需要测试一下后台token过期时，是否能正常刷新到登录页面？
                    let result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                    if (result['code'] === 401) {
                        //清空缓存
                        localUtils.clearLocalStorage(conf.sysLocalStore);

                        Ext.Msg.confirm('温馨提示', '用户令牌已过期，请重新登录?',
                            function (choice) {
                                if (choice === 'yes') {
                                    window.location.reload();
                                }
                            }
                        );
                    } else {
                        if (successcallback) {
                            successcallback(response, opts);
                        }
                    }
                },
                failure: function (response, opts) {
                    if (failurecallback) {
                        failurecallback(response, opts);
                    }
                },
                params: params
            });
        }
    }
}

/**
 * 定义集成打包
 */
Ext.define('yt.utils.AjaxUtils', {});

//--------------------调用示例------------------------------------------------------
/*ajax.v.method = 'GET';
ajax.v.url = 'http://172.16.60.204:8080/monitor/monitor/getPerSecondFlow';
ajax.v.params = {};
ajax.v.successCallBack = function (response, opts) {
    //查询结果转json对象
    var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);

};
ajax.v.failureCallBack = function (response, opts) {
};
ajax.fn.execute();*/
