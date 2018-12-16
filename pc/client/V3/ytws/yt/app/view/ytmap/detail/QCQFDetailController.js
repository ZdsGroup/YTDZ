Ext.define('yt.view.ytmap.detail.QCQFDetailController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.QCQFDetailController',

    /**
     * Called when the view is created
     */
    init: function() {

    },

    afterRendererFunction: function() {
        var me = this;
        var meview = this.getView();

        var action = 'comments/' + meview.getQCQFId();
        var mask = ajax.fn.showMask( meview, '数据加载中...');

        // 初始化群测群防地图 延迟一会以解决渲染不正常的现象
        setTimeout(function () {
            me.map = L.map('qcqfMapContainer', {
                zoomControl: false,
                attributionControl: false
            }).fitWorld();
            L.tileLayer.chinaProvider('GaoDe.Normal.Map', {
                maxZoom: 18
            }).addTo(me.map);
            // L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(me.map);
            me.map.flyTo(L.latLng(28.23, 117.02), 10, true);//定位到鹰潭市

            // 获取接口数据 渲染相关组件
            // 获取评论详细信息
            // ajax.fn.executeV2({}, 'GET', 'http://182.92.2.91:8081/oracle/' + action, successCallBack, failureCallBack);
            ajax.fn.executeV2({}, 'GET', conf.serviceUrl + action, successCallBack, failureCallBack);
        },300);


        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);

            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(!result['data']) return;

            me.getViewModel().set('QCQFDetailData',result['data']);

            // 处理 图片轮播组件展示的图片
            var imageArr = result['data']['image'].toString().split(';');
            var formateimageArr = [];
            for (var i = 0; i < imageArr.length; i++) {
                formateimageArr.push(
                    {
                        url: imageArr[i]
                    }
                )
            };
            meview.lookupReference('imgswiper').insertImage(
                formateimageArr
            )
            // 处置 button 的处理
            meview.lookupReference('stateButton').setText(result['data']['state'] ? '已处置' : '处置');

            // 渲染上传点图标
            var uploadLon = result['data']['lngnew'];
            var uploadLat = result['data']['latnew'];
            if(uploadLon && uploadLat) {
                L.marker([uploadLat,uploadLon]).addTo(me.map)
                .bindPopup('用户评论上传点')
                .openPopup();
            }
            // 如果有链接相关设备id则查询设备id并渲染设备点
            if(result['data']['deviceid']) {
                ajax.fn.executeV2(
                    {},
                    'GET',
                    conf.serviceUrl + 'devices/' + result['data']['deviceid'],
                    function(response, opts) {
                        //查询结果转json对象
                        var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
                        if(result.code === 0) {
                            // 渲染设备点
                            var uploadLon = result['data']['lngnew'];
                            var uploadLat = result['data']['latnew'];
                            if(uploadLon && uploadLat) {
                                L.marker([uploadLat,uploadLon]).addTo(me.map)
                                .bindPopup(result['data']['name'])
                                .openPopup();
                            }
                        }
                    },
                    function(response, opts){
                        // failed
                    }
                );
            }
        }

        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
    },

    changeDetailState() {
        var me = this;
        var meview = me.getView();
        // 状态只能由未处置变成处置，即 0 -> 1
        var action = 'comments/' + meview.getQCQFId() + '/1';
        var mask = ajax.fn.showMask( meview, '处置评论中...');
        function successCallBack(response, opts) {
            ajax.fn.hideMask(mask);
            //查询结果转json对象
            var result = Ext.JSON.decode(decodeURIComponent((response.responseText)), true);
            if(result.code === 0) {
                // 如果处置成功，修改button状态
                // 处置 button 的处理
                meview.lookupReference('stateButton').setText('已处置');
                meview.lookupReference('stateButton').setDisabled(true);

                // 刷新展示的面板数据
                var fatherpanel = Ext.getCmp('dzDetailContainerID').query('monpot-detail')[0];
                var fathercontroller = fatherpanel.getController();
                var fatherViewModel = fatherpanel.getViewModel();
                fathercontroller.qcqfGridListQuery( fatherViewModel.get('QCQFGridPageStore')['currentPage'] );
            }
        }
        function failureCallBack(response, opts) {
            ajax.fn.hideMask(mask);
        }
        // ajax.fn.executeV2({}, 'POST', 'http://182.92.2.91:8081/oracle/' + action, successCallBack, failureCallBack);
        ajax.fn.executeV2({}, 'POST', conf.serviceUrl + action, successCallBack, failureCallBack);
    }
});