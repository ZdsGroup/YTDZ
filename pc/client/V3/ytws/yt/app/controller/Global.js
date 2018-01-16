/**
 * Created by LBM on 2017/12/30.
 */
var g = {
    v: {
        isInit: false,
        //系统主菜单项目
        sysMenuItems: [],
        //主容器
        mainContainer: null,
        //浮动容器
        floatContainer: null,
        //当前显示的模块布局参数
        currentFloatParams: null
    },
    fn: {
        //根据配置文件初始化系统主菜单项目
        initSystemMenu: function (view) {
            if (view && view.xtype == 'yt-top') {
                var sysMenuCmp = view.down("segmentedbutton");
                var menus = conf.systemMenu;
                if (menus && menus.length > 0) {
                    //解析系统菜单配置参数
                    Ext.each(menus, function (rec) {
                        if (rec != null) {
                            var menuItem = Ext.create('Ext.button.Button', {
                                id: rec['key'],
                                text: rec['name'],
                                value: rec['url'],
                                pressed: rec['selected'],
                                /*scale: 'large',*/
                                hidden: rec['hide'],
                                iconCls: rec['icon'],
                                ui: rec['ui']
                            });
                            menuItem['widgetType'] = rec['type'];
                            menuItem['parent'] = rec['parent'];
                            menuItem['init'] = rec['init'];
                            menuItem['mode'] = rec['mode'];
                            menuItem['widgetId'] = rec['widgetId'];
                            menuItem['floatContainerParams'] = rec['floatContainerParams'];
                            g.v.sysMenuItems.push(menuItem);
                        }
                    });

                    if (sysMenuCmp) {
                        sysMenuCmp.removeAll();
                        sysMenuCmp.add(g.v.sysMenuItems);
                        sysMenuCmp.on('toggle', g.fn.toggleHandler);
                    }
                }
            }
        },
        loadWidget: function (widget) {
            var wType = widget['widgetType'];
            var wMode = widget['mode'];
            if (wType == 'widget') {
                if (wMode == 'cover') {
                    if (g.v.mainContainer == null) {
                        g.v.mainContainer = Ext.getCmp(widget['parent']);
                    }

                    //隐藏主容器中已加载的模块
                    if (g.v.mainContainer.items.items && g.v.mainContainer.items.items.length > 0) {
                        for (var i = 0; i < g.v.mainContainer.items.items.length; i++) {
                            var mWidget = g.v.mainContainer.items.items[i];
                            mWidget.hide();
                        }
                    }
                }
                else if (wMode == 'normal') {
                    var floatParams = widget['floatContainerParams'];

                    if (floatParams) {
                        g.v.currentFloatParams = floatParams;
                    }

                    //初始化浮动模块容器
                    g.fn.initFloatContainer(floatParams);

                    if (g.v.floatContainer) {
                        //清空浮动容器中已加载的常规模块
                        //g.v.floatContainer.removeAll();

                        //隐藏浮动容器中已加载的模块
                        if (g.v.floatContainer.items.items && g.v.floatContainer.items.items.length > 0) {
                            for (var i = 0; i < g.v.floatContainer.items.items.length; i++) {
                                var fWidget = g.v.floatContainer.items.items[i];
                                fWidget.hide();
                            }
                        }
                    }

                    if (g.v.floatContainer.hidden) {
                        g.v.floatContainer.show();
                    }
                }

                //加载新的模块,判断模块是否已经加载，有-显示，无-新建
                var wParent = widget['parent'];
                var tempWidget = null;
                if (g.v.mainContainer && wParent == conf.bodyContainerID) {
                    tempWidget = g.v.mainContainer.getComponent(widget['widgetId']);
                    if (tempWidget) {
                        tempWidget.show();
                    } else {
                        tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                        g.v.mainContainer.add(tempWidget);
                    }

                    g.v.mainContainer.updateLayout();
                } else if (g.v.floatContainer && wParent == conf.floatContainerID) {
                    //清空浮动容器中模块
                    //tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                    //g.v.floatContainer.add(tempWidget);

                    //不清空浮动容器中模块
                    tempWidget = g.v.floatContainer.getComponent(widget['widgetId']);
                    if (tempWidget) {
                        tempWidget.show();
                    } else {
                        tempWidget = new Ext.create('widget.' + widget['value'], {id: widget['widgetId']});
                        g.v.floatContainer.add(tempWidget);
                    }

                    //公用代码
                    g.v.floatContainer.setTitle(widget['text']);
                    g.v.floatContainer.setIconCls(widget['iconCls']);
                    g.v.floatContainer.updateLayout();
                }
            }
        },
        initWidget: function () {
            var menus = conf.systemMenu;
            if (menus && menus.length > 0) {
                Ext.each(menus, function (rec) {
                    if (rec != null) {
                        var widget = {};
                        widget['id'] = rec['key'];
                        widget['text'] = rec['name'];
                        widget['value'] = rec['url'];
                        widget['widgetType'] = rec['type'];
                        widget['parent'] = rec['parent'];
                        widget['init'] = rec['init'];
                        widget['widgetId'] = rec['widgetId'];
                        widget['mode'] = rec['mode'];
                        widget['iconCls'] = rec['icon'];
                        widget['hidden'] = rec['hide'];
                        widget['pressed'] = rec['selected'];
                        widget['floatContainerParams'] = rec['floatContainerParams'];
                        //如果有多个菜单init设置为true，默认全部加载，容器显示最后初始化的模块
                        if (rec['init']) {
                            g.fn.loadWidget(widget);
                            conf.currentMenuItem = widget;
                            //return false;//退出当前循环
                        }
                    }
                });
            }
        },
        initFloatContainer: function (floatParams) {
            if (g.v.floatContainer == null) {
                g.v.floatContainer = new Ext.create('Ext.panel.Panel', {
                    width: 300,
                    height: 300,
                    x: 5,
                    y: 65,
                    ui: 'float-panel',
                    layout: 'fit',
                    draggable: false,
                    collapsible: false,
                    collapseToolText: '隐藏',
                    expandToolText: "展开",
                    closeToolText: '关闭',
                    plain: true,
                    floating: false,
                    closable: true,
                    closeAction: 'hide',
                    hidden: true,
                    bodyStyle: 'opacity:0.9; filter: Alpha(Opacity=90);',
                    renderTo: Ext.getBody(),
                    listeners: {
                        close: g.fn.fcCloseHandler
                    }
                })
            }

            //如果浮动面板参数不为空，则设置面板参数，暂时实现四种方式，可以参照官方API完善扩展
            if (floatParams && g.v.mainContainer) {
                var w = floatParams['w'];
                var h = floatParams['h'];

                var align = floatParams['align'];
                var offsetX = floatParams['gapX'];
                var offsetY = floatParams['gapY'];

                if (typeof (w) == 'string' && w.indexOf('%') > -1) {
                    w = g.v.mainContainer.el.dom.clientWidth * parseFloat(w.substr(0, w.indexOf('%'))) / 100 - 2 * offsetX;
                }

                if (typeof (h) == 'string' && h.indexOf('%') > -1) {
                    h = g.v.mainContainer.el.dom.clientHeight * parseFloat(h.substr(0, h.indexOf('%'))) / 100 - 2 * offsetY;
                }

                g.v.floatContainer.setWidth(w);
                g.v.floatContainer.setHeight(h);

                switch (align) {
                    case 'tl': {
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'bl': {
                        offsetY = g.v.mainContainer.el.dom.clientHeight - offsetY - h;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'tr': {
                        offsetX = g.v.mainContainer.el.dom.clientWidth - offsetX - w;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                    case 'br': {
                        offsetX = g.v.mainContainer.el.dom.clientWidth - offsetX - w;
                        offsetY = g.v.mainContainer.el.dom.clientHeight - offsetY - h;
                        g.v.floatContainer.el.alignTo(g.v.mainContainer.el, "tl?", [offsetX, offsetY], true);
                        break;
                    }
                }
            }

            //默认隐藏
            //g.v.floatContainer.hide();
        },
        fcCloseHandler: function () {
            if (conf.currentMenuItem) {
                var menuId = conf.currentMenuItem['id'];
                var meunItem = Ext.getCmp(menuId);
                if (meunItem) {
                    meunItem.setPressed(false);
                }

                conf.currentMenuItem = null;
            }
        },
        toggleHandler: function (container, button, pressed) {
            if (pressed) {
                g.v.isInit = true;
                g.fn.loadWidget(button);

                conf.currentMenuItem = button;
            }
        },
        changeDisplayMode: function (button, e, eOpts) {
            if (button['pressed']) {
                //进入全屏模式
                var tv = this.getTopView();
                tv.hide(true);

                g.fn.fullScreen();
            } else {
                //退出全屏模式
                var tv = this.getTopView();
                tv.show(true);

                g.fn.exitFullScreen();
            }
        },
        switchLeftPanel: function (button, e, eOpts) {
            var wv = this.getWestView();
            if(wv.hidden){
                wv.show(true);
                button.setIconCls('fa fa-caret-left');
                button.setTooltip('关闭左侧面板');
            }else{
                wv.hide(true);
                button.setIconCls('fa fa-caret-right');
                button.setTooltip('显示左侧面板');
            }
        },
        fullScreen: function () {
            var docElm = document.documentElement;
            //W3C
            if (docElm.requestFullscreen) {
                docElm.requestFullscreen();
            }

            //FireFox
            else if (docElm.mozRequestFullScreen) {
                docElm.mozRequestFullScreen();
            }

            //Chrome等
            else if (docElm.webkitRequestFullScreen) {
                docElm.webkitRequestFullScreen();
            }

            //IE11
            else if (docElm.msRequestFullscreen) {
                docElm.msRequestFullscreen();
            }
        },

        exitFullScreen: function () {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
            else if (document.mozCancelFullScreen) {
                document.mozCancelFullScreen();
            }
            else if (document.webkitCancelFullScreen) {
                document.webkitCancelFullScreen();
            }
            else if (document.msExitFullscreen) {
                document.msExitFullscreen();
            }
        },
        //获取地灾点树
        getDzDataTree: function (view) {
            var me = view;
            var dzDataTree = me.lookupReference('dzDataTreeRef');
            var dzDataTreeCon = Ext.getCmp('dzDataTreeContainerId');
            var mask = ajax.fn.showMask(dzDataTreeCon, '数据加载中...');

            ajax.v.method = 'GET';
            ajax.v.url = conf.serviceUrl + 'menu/tree';
            ajax.v.successCallBack = function (response, opts) {
                //查询结果转json对象
                var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                if (result['data'] != null) {
                    var dataList = result['data'];
                    if (dataList && dataList.length > 0) {
                        var treeStore = new Ext.create('Ext.data.TreeStore', {
                            data: dataList//此处需要根据需要预处理数据，以满足tree组件显示需求,现在使用conf.dataList作为测试数据
                        });
                        dzDataTree.setStore(treeStore);
                        //dzDataTree.setExpanderFirst(false);//false-表示下拉箭头位于右侧，与expanderFirst: false效果一致

                        //解析数据，并绘制到当前地图
                        mv.fn.createMarker(dataList);//@TODO 鉴于服务不完善，地灾点数据暂时用假数据
                    }
                }

                ajax.fn.hideMask(mask);

            };
            ajax.v.failureCallBack = function (response, opts) {
                ajax.fn.hideMask(mask);
            };
            ajax.fn.execute();
        }
    }
}

Ext.define('yt.controller.Global', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.data.TreeStore'],
    config: {
        //Uncomment to add references to view components
        refs: [

            {
                ref: 'topView',
                selector: 'yt-top'
            },
            {
                ref: 'mapView',
                selector: 'yt-map'
            },
            {
                ref: 'westView',
                selector: 'yt-west'
            },
            {
                ref: 'mainView',
                selector: 'yt-main'
            }
        ],

        //Uncomment to listen for events from view components
        control: {
            'yt-main': {
                afterlayout: function () {
                    if (!g.v.isInit) {
                        g.fn.initWidget();
                    }
                    else {
                        if (!g.v.floatContainer.hidden) {
                            g.fn.initFloatContainer(g.v.currentFloatParams);
                        }
                        /*else if (g.v.floatContainer.hidden) {
                         g.v.floatContainer.show();
                         }*/
                    }
                }
            },
            'yt-top': {
                added: function (view, container, pos, eOpts) {
                    g.fn.initFloatContainer();
                    g.fn.initSystemMenu(view);
                }
            },
            'yt-map': {
                added: function (view, container, pos, eOpts) {
                }
            },
            'yt-west': {
                afterrender: function (view, eOpts) {
                    g.fn.getDzDataTree(view);
                }
            },
            'button[action=fullScreen]': {
                click: g.fn.changeDisplayMode
            },
            'button[action=controllleftpanel]': {
                click: g.fn.switchLeftPanel
            }
        }
    },

    /**
     * Called when the view is created
     */
    init: function () {

    }
});