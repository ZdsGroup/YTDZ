/**
 * Created by lyuwei on 2017/10/30.
 */
define(function(){
    return {
        DMZ_TDTSL: {
            "text": '天地图矢量',
            "nodeId": '3B0B1B86D7C44C73A55BAAA33D1D187E',
            "baseLayerType": '_V',

            "baseServerInfo": [
                {
                    "serviceId": "9CF3210E19BE49DB90108C41AA8652B9",
                    "layerName": "天地图矢量图",
                    "serviceType": "WMTS",
                    "defaultSelect": "true",
                    "url":"http://t{s}.tianditu.com/vec_c/wmts",
                    "layer":"vec",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"0",
                    "layerIndex":"10",
                    "opacity": 1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                },
                {
                    "serviceId": "0D407B74C4FF4163B6851F28E3DB8H2G",
                    "layerName": "天地图矢量注记",
                    "serviceType": "WMTS",
                    "defaultSelect": "false",
                    "url":"http://t{s}.tianditu.com/cva_c/wmts",
                    "layer":"cva",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"10",
                    "layerIndex":"10",
                    "opacity":1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                }
            ]
        },
        DMZ_TDTYX: {
            "text": '天地图影像',
            "nodeId": '4AB9A9212EEA40D1AA8BBBA9C1F3376F',
            "baseLayerType": '_R',

            "baseServerInfo": [
                {
                    "serviceId": "3A8987D86C98423A9E45C96B53FCC30D",
                    "layerName": "天地图影像图",
                    "serviceType": "WMTS",
                    "defaultSelect": "true",
                    "url":"http://t{s}.tianditu.com/img_c/wmts",
                    "layer":"img",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"0",
                    "layerIndex":"10",
                    "opacity": 1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                },
                {
                    "serviceId": "3A8987D86C98423A9E45C96B53FCC30F",
                    "layerName": "天地图影像注记",
                    "serviceType": "WMTS",
                    "defaultSelect": "false",
                    "url":"http://t{s}.tianditu.com/cia_c/wmts",
                    "layer":"cia",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"10",
                    "layerIndex":"10",
                    "opacity":1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                }
            ]
        },
        DMZ_TDTDX: {
            "text": '天地图地形',
            "nodeId": '0409B39385FB4BCF80A01CD9983DC43C',
            "baseLayerType": '_V',

            "baseServerInfo": [
                {
                    "serviceId": "62CC2ADD2119448C82249D1EAECD7392",
                    "layerName": "天地图地形图",
                    "serviceType": "WMTS",
                    "defaultSelect": "true",
                    "url":"http://t{s}.tianditu.com/ter_c/wmts",
                    "layer":"ter",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"0",
                    "layerIndex":"10",
                    "opacity": 1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                },
                {
                    "serviceId": "3A8987D86C98423A9E45C96B53FCC30D",
                    "layerName": "天地图地形注记",
                    "serviceType": "WMTS",
                    "defaultSelect": "false",
                    "url":"http://t{s}.tianditu.com/cta_c/wmts",
                    "layer":"cta",
                    "tilematrixSet":"c",
                    "style":"default",
                    "format":"Tile",
                    "layerType":"10",
                    "layerIndex":"10",
                    "opacity":1,
                    "extent": null,
                    "resolutions": null,
                    "matrixIds": null,
                    "origin": null,
                    "subdomains": [0, 1, 2, 3, 4, 5, 6, 7],
                    "zoomOffset": 1
                }
            ]
        }
    }
})