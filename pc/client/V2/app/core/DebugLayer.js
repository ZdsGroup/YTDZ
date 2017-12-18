/**
 * Created by lyuwei on 2017/12/15.
 */
define(['leaflet'],function (L) {
    var DebugGridLayer = L.GridLayer.extend({
        createTile: function(coords){
            // create a <canvas> element for drawing
            var tile = L.DomUtil.create('div', 'leaflet-tile');
            // setup tile width and height according to the options
            var size = this.getTileSize();
            tile.width = size.x;
            tile.height = size.y;
            tile.style.outline = '1px solid red';
            tile.style['font-size'] = '30px';
            tile.innerHTML = 'z:' + coords.z + ' x:' + coords.x + ' y:' + coords.y;
            // return the tile so it can be rendered on screen
            return tile;
        }
    });

    function debugerlayer(opt_option) {
        return new DebugGridLayer(opt_option)
    }

    return debugerlayer
})