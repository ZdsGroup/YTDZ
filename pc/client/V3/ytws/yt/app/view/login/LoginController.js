/**
 * Created by winnerlbm on 2018/6/1.
 */
Ext.define('yt.view.login.LoginController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.login',

    /**
     * Called when the view is created
     */
    init: function () {

    },
    onLoginRender: function () {
        var lu = localUtils.getFromLocalStorage(conf.sysLocalStore, 0);
        if (lu) {
            var userInfo = JSON.parse(lu.data.sysObject);
            conf.loginInfo = userInfo;
            this.loadMainView();
            this.setUserInfo(userInfo);
        }
    },
    onLoginButton: function () {
        var infoCmp = Ext.getCmp('loginInfoId');
        infoCmp.setHidden(true);
        infoCmp.setText("");

        let userCmp = Ext.getCmp('userid'),
            pwdCmp = Ext.getCmp('password');
        //username=admin&password=123456
        var params = {
            username: userCmp.getValue(),
            password: pwdCmp.getValue()
        };

        this.loginAction(params);
    },
    loadMainView: function () {
        var appView = new Ext.create('widget.yt-main', {flex: 1});
        let userCmp = Ext.getCmp('userid'),
            pwdCmp = Ext.getCmp('password');
        userCmp.setValue('');
        pwdCmp.setValue('');
        Ext.getCmp('loginContainerId').setHidden(true);
        Ext.getCmp('appMainContainerId').setHidden(false);
        Ext.getCmp('appMainContainerId').add(appView);
    },
    setUserInfo: function (userInfo) {
        var userCmp = Ext.getCmp('userInfoButtonId');
        if (userCmp) {
            userCmp.setText(userInfo['username']);
        }
    },
    loginAction: function (params) {
        //清空缓存
        localUtils.clearLocalStorage(conf.sysLocalStore);

        var me = this;
        var infoCmp = Ext.getCmp('loginInfoId');
        infoCmp.setHidden(false);
        infoCmp.setText("登录中，请稍候...");

        function successCallBack(response, opts) {
            infoCmp.setText('');
            infoCmp.setHidden(true);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            /*{
                "code": 0,
                "message": "success",
                "data": {
                    "userid": 1,
                    "loginname": "admin",
                    "username": "admin",
                    "token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzUxMiJ9.eyJzdWIiOiIxIiwiaWF0IjoxNTQ0ODU1MDgzLCJleHAiOjE1NDQ4NTg2ODN9.8J3Xhg5eRzSKFLex204_RLU2BDHfbu6OOKTWWG28636N-Sg7b9jCJXAhyp1M-KqQ-iBKJfcJWahmq4R2DDGg8A"
            }
            }*/
            if (result['code'] === 0) {
                var json = {};
                json.sysObject = result['data'];
                localUtils.clearLocalStorage(conf.sysLocalStore);
                localUtils.saveToLocalStorageEx(conf.sysLocalStore, json.sysObject);

                conf.loginInfo = result['data'];//保存用户登录信息

                me.loadMainView();
                me.setUserInfo(result['data']);
            }
        }

        function failureCallBack(response, opts) {
            infoCmp.setHidden(false);
            infoCmp.setText("登录失败，请重新登录！");
        }

        ajax.fn.executeV2(params, 'POST', conf.serviceUrl + 'login', successCallBack, failureCallBack);
    }
});