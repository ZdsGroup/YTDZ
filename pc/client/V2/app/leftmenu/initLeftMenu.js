/**
 * Created by lyuwei on 2017/12/23.
 */
define(["jquery","app/common/restfulRequest","sweetalert",'app/markLayer'],
function ($,restfulRequest,swal,markLayer) {
    var quakeList = {};

    // 首先完成行政区划的获取
    function initmenu() {
        restfulRequest.sendWebRequest(
            'devices/tree',//'regions',
            'get',
            null,//{ pageno : 1 , pagesize : 200 },
            function (data) {
                if(data.message === 'success')
                    getTree(data);
                else
                    errorFunc(data);
            },
            function (data) {
                errorFunc(data);
            }
        )
    }
    
    function getTree(data) {
        var tempRegionDomStr =
            '<li class="nav-item" id="regionId_{regionId}">' +
                '<a href="javascript:;">' +
                    '<i class="my-icon nav-icon icon_1"></i>' +
                    '<span>{regionName}</span>' +
                    '<i class="my-icon nav-more"></i>' +
                '</a><ul id="childrenNode"></ul>' +
            '</li>';

        var tempQuakeDomStr =
            '<li id="quake_{quakeId}">' +
                '<a href="javascript:;"><span>{quakeName}</span></a>' +
                '<div></div>' +
            '</li>' +
            '<hr/>';

        for (var i = 0; i < data.data.length; i++) {
            var eachRegion = data.data[i];
            var regionli = $(tempRegionDomStr.replace('{regionId}',eachRegion.id)
                .replace('{regionName}',eachRegion.name));
            // 区划下的详细地点
            if(eachRegion.hasOwnProperty('children') && eachRegion.children.length > 0){
                for (var m = 0; m < eachRegion.children.length; m++) {
                    var eachQuake = eachRegion.children[m];
                    // 暂存到 quakeList 对象中
                    quakeList["quake_"+ eachQuake.id] = eachQuake;
                    var quakeli = $(tempQuakeDomStr.replace('{quakeId}',eachQuake.id)
                        .replace('{quakeName}',eachQuake.name));
                    regionli.find("ul#childrenNode").append(quakeli);
                }
            }
            $("ul#regionsItems").append(regionli);
        }
        require(["jquery.nav"]);
        // 得到地点的详细信息
        restfulRequest.sendWebRequest(
            'devices/sides',
            'get',
            null,
            function (data) {
                if(data.message === 'success')
                    getDetail(data);
                else
                    errorFunc(data);
            },
            function (data) {
                errorFunc(data);
            }
        )
    }

    function getDetail(data) {
        // 格式化所有的设备列表，把对应的设备按照地灾点分组
        var allDevices = {};
        for (var i = 0;i < data.data.devices.length; i++){
            var eachDevice = data.data.devices[i];
            var deviceQuake = eachDevice.quakeid;
            if(!allDevices.hasOwnProperty(deviceQuake))
                allDevices[deviceQuake] = [];
            allDevices[deviceQuake].push(eachDevice);
        }
        console.log(allDevices);
        var quakeInfoStr =
            '<p>告警等级：{rankStart}</p>' +// ☆☆☆☆
            '<p>地址：{address}</p>';
        for (var i = 0; i < data.data.quakes.length; i++){
            var eachQuake = data.data.quakes[i];
            var tempdata = quakeList["quake_"+ eachQuake.quakeid];
            if(tempdata !== undefined && tempdata !== null){
                tempdata.detailInfo = eachQuake;
            }
            // 把对应的设备放到对应地灾点下
            tempdata.childrenDevices = formatDevices(eachQuake.quakeid);
            // 初始化地灾点的详细信息
            var quakeInfoDom = $(quakeInfoStr.replace('{address}',eachQuake.address)
                .replace( '{rankStart}',rankStartRepeat( parseInt(eachQuake.rank,10)) ));
            var eachquake = $("ul#regionsItems").find('li#quake_' + eachQuake.quakeid);
            eachquake.find('div').append(quakeInfoDom);
            // 每个地灾点的点击事件
            eachquake.on('click',quakeClick);
            // 根据每个地点的参数来设置mark
            {
                var picker = JSON.parse( eachQuake.centroid );
                var mX = picker.lat;
                var mY = picker.lng;
                markLayer.addMark(
                    L.marker(
                        [mX, mY],{id:eachQuake.quakeid}
                        ).bindPopup(eachQuake.name)
                        .on('click',quakeClick)
                        .on('dblclick',function () {
                            require(['app/rightPanel'],function (rightpanel) {
                                rightpanel.destroy();
                        })
                    })
                )
            }
        }
        console.log(quakeList);

        function rankStartRepeat(n) {
            var result = '';
            for(var i=0;i<n;i++) {
                result += "☆";
            }
            return result;
        }
        // 地灾点的点击事件
        function quakeClick() {
            require(['app/rightPanel'],function (rightpanel) {
                rightpanel.init();
            })
        }
        function formatDevices(quakeid) {
            var returnChildDevices = {};
            if(!allDevices.hasOwnProperty(quakeid))
                return returnChildDevices;
            for (var deviceIndex = 0; deviceIndex < allDevices[quakeid].length; deviceIndex++){
                var deviceTYpe = '';
                switch (allDevices[quakeid][deviceIndex].type){
                    case 1:
                        deviceTYpe = '位移监测设备';
                        break;
                    case 2:
                        deviceTYpe = '雨量监测设备';
                        break;
                    case 3:
                        deviceTYpe = '裂缝监测设备';
                        break;
                }
                if(!returnChildDevices.hasOwnProperty(deviceTYpe))
                    returnChildDevices[deviceTYpe] = [];
                returnChildDevices[deviceTYpe].push( allDevices[quakeid][deviceIndex] );
            }

            return returnChildDevices;
        }

    }

    function returnQuakeDetail(quakeid) {
        return quakeList[quakeid];
    }

    function errorFunc() {
        swal("请联系管理员！", "行政区划设备树加载失败","error");
    }

    return {
        initmenu: initmenu,
        returnQuakeDetail: returnQuakeDetail
    }
});