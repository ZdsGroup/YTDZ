/**
 * Created by lyuwei on 2017/12/14.
 */
define(['leaflet'],
    function (L) {
        var WMTSLayer = L.TileLayer.extend({

            options: {
                version: '1.0.0',
                style: 'default',
                tilematrixSet: '',
                format: 'image/png',
                tileSize: 256,
                matrixIds: null,
                layer: '',
                opacity: 1.0
            },

            //todo 自动获取 GetCapabilities(根据url自动获取相关xml从中读取相关参数，完成初始化)
            initialize: function (url, options) {
                this._url = url;
                L.setOptions(this, options);
            },

            getTileUrl: function (coords) {
                var zoom = this._getZoomForUrl();
                var ident = this.options.matrixIds ? this.options.matrixIds[zoom].identifier : zoom;
                var url = L.Util.template(this._url, {s: this._getSubdomain(coords)});
                var obj = {
                    service: 'WMTS',
                    request: 'GetTile',
                    version: this.options.version,
                    style: this.options.style,
                    tilematrixSet: this.options.tilematrixSet,
                    format: this.options.format,
                    width: this.options.tileSize,
                    height: this.options.tileSize,
                    layer: this.options.layer,
                    tilematrix: ident,
                    tilerow: coords.y,
                    tilecol: coords.x
                };
                return url + L.Util.getParamString(obj, url);
            }
        });

        function wmtsLayer(url,opt_option) {
            return new WMTSLayer(url, opt_option);
        }

        return wmtsLayer
})