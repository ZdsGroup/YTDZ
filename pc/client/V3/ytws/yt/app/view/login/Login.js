/**
 * Created by winnerlbm on 2018/6/1.
 */
Ext.define('yt.view.login.Login', {
    extend: 'Ext.Container',

    requires: [
        'Ext.button.Button',
        'Ext.container.Container',
        'Ext.form.field.Text',
        'Ext.layout.container.HBox',
        'Ext.layout.container.VBox',
        'Ext.panel.Panel',
        'yt.view.login.LoginController',
        'yt.view.login.LoginModel'
    ],

    //id: 'loginWindowId',

    /*
    Uncomment to give this component an xtype*/
    xtype: 'login',

    viewModel: {
        type: 'login'
    },

    controller: 'login',

    cls: 'sys-bg-image',
    baseCls: 'sys-panel',
    modal: true,
    defaultButton: 'loginButton',

    layout: {
        type: 'vbox',
        pack: 'start',
        align: 'stretch'
    },
    listeners: {
        render: 'onLoginRender'
    },
    items: [
        /* include child components here */
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            height: 200,
            items: [
                {
                    xtype: 'image',
                    width: 558,
                    height: 64,
                    cls: 'sys-banner-image'
                }
            ]

        },
        {
            xtype: 'container',
            layout: {
                type: 'hbox',
                pack: 'center',
                align: 'middle'
            },
            height: 300,
            items: [
                {
                    xtype: 'panel',
                    id: 'loginPanelId',
                    baseCls: 'sys-panel',
                    cls: 'sys-center-image',
                    width: 451,
                    height: 297,
                    layout: {
                        type: 'vbox',
                        pack: 'center',
                        align: 'stretch'
                    },

                    bodyPadding: 20,
                    defaults: {
                        margin: '10 0 5 0'
                    },
                    items: [
                        {
                            xtype: 'textfield',
                            id: 'userid',
                            height: 55,
                            hideLabel: true,
                            allowBlank: false,
                            emptyText: '用户名',
                            triggers: {
                                glyphed: {
                                    cls: 'trigger-glyph-noop auth-email-trigger'
                                }
                            }
                        },
                        {
                            xtype: 'textfield',
                            height: 55,
                            hideLabel: true,
                            emptyText: '密码',
                            inputType: 'password',
                            id: 'password',
                            allowBlank: false,
                            triggers: {
                                glyphed: {
                                    cls: 'trigger-glyph-noop auth-password-trigger'
                                }
                            }
                        },
                        {
                            xtype: 'button',
                            reference: 'loginButton',
                            id: 'loginButtonId',
                            ui: 'login-button-ui',
                            scale: 'large',
                            text: '登录',
                            formBind: true,
                            listeners: {
                                click: 'onLoginButton'
                            }
                        },
                        {
                            xtype: 'label',
                            id: 'loginInfoId',
                            style: 'color:black',
                            hidden: true
                        }
                    ]
                }
            ]
        },
        {
            xtype: 'container',
            flex: 1
        }
    ]
});