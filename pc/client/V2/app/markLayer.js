/**
 * Created by lyuwei on 2017/12/23.
 */
define(
    [
        'jquery',
        'leaflet'
    ],
function ($,L) {
    var map = window.YTmap;
    var markLayerGroup = null;
    var deviceMarkLayerGroup = null;

    function initMarkLayerGroup() {
        markLayerGroup = new L.layerGroup();
        map.addLayer(markLayerGroup);
    }

    function addMark(markObj) {
        if(markLayerGroup === null)
            initMarkLayerGroup();
        markLayerGroup.addLayer(markObj);
    }

    function flyTO() {
        var boundsLatLonArrs = [];
        markLayerGroup.eachLayer(
            function (layer) {
                boundsLatLonArrs.push( layer.getLatLng() );
            }
        )
        if(boundsLatLonArrs.length > 0){
            map.flyToBounds( L.latLngBounds(boundsLatLonArrs) )
        }
    }

    return {
        addMark: addMark,
        flyTO: flyTO
    };
});