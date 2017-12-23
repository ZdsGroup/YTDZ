/**
 * Created by lyuwei on 2017/12/23.
 */
define(["jquery","app/common/restfulRequest","sweetalert"],
function ($,restfulRequest,swal) {
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
        String.prototype.repeat = function(n) {
            var _this = this;
            var result = '';
            for(var i=0;i<n;i++) {
                result += _this;
            }
        }

        var quakeInfoStr =
            '<p>告警等级：{rankStart}</p>' +// ☆☆☆☆
            '<p>地址：{address}</p>';
        for (var i = 0; i < data.data.quakes.length; i++){
            var eachQuake = data.data.quakes[i];
            var tempdata = quakeList["quake_"+ eachQuake.quakeid];
            if(tempdata !== undefined && tempdata !== null){
                tempdata.detailInfo = eachQuake;
            }
            var quakeInfoDom = $(quakeInfoStr.replace('{address}',eachQuake.address)
                .replace( '{rankStart}',rankStartRepeat( parseInt(eachQuake.rank,10)) ));
            $("ul#regionsItems").find('li#quake_' + eachQuake.quakeid)
                .find('div').append(quakeInfoDom);

            // 根据每个地点的参数来设置mark
            {
                var quakeLonLat = JSON.parse( eachQuake.centroid );
                var tempicon = new L.marker([
                    parseInt(quakeLonLat.lat,10), parseInt(quakeLonLat.lng,10)
                ]).bindPopup(eachQuake.name)
                    .addTo(YTmap);
                tempicon.on('click',function () {
                    require(['app/core/rightPanel'],function (rightpanel) {
                        rightpanel.init();
                    })
                })
                tempicon.on('dblclick',function () {
                    require(['app/core/rightPanel'],function (rightpanel) {
                        rightpanel.destroy();
                    })
                })
            }
        }

        function rankStartRepeat(n) {
            var result = '';
            for(var i=0;i<n;i++) {
                result += "☆";
            }
            return result;
        }
    }

    function errorFunc() {
        swal("请联系管理员！", "行政区划设备树加载失败","error");
    }

    return {
        initmenu: initmenu
    }
});