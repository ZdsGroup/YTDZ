/**
 * Created by lyuwei on 2017/12/19.
 */
// define(["jquery","jquery.mbExtruder"],function ($) {
//     var rightpanel = null;
//     function init() {
//         if(rightpanel!==null){
//             rightpanel.show();
//             return;
//         }
//         rightpanel = $("<div id=\"extruderRight\" class=\"{title:'概要信息', url:'parts/extruderRight.html'}\"></div>");
//         $(document.body).append(rightpanel);
//         rightpanel.buildMbExtruder({
//             position:"right",
//             width:300,
//             extruderOpacity:.8,
//             textOrientation:"tb",
//             onExtOpen:function(){},
//             onExtContentLoad:function(){},
//             onExtClose:function(){}
//         });
//     }
//
//     function destroy() {
//         if (rightpanel){
//             rightpanel.hide()
//         }
//     }
//
//     return {
//         init: init,
//         destroy: destroy
//     }
// })

define(["jquery","jquery.sliderBar"],function ($) {
    var rightpanel = null;
    function init() {
        if(rightpanel!==null){
            rightpanel.show();
            return;
        }
        rightpanel = $(
            "<div id=\"unitElementQuery\" class=\"sliderbar-container\">" +
                "<div class=\"title\"><i></i>基本信息</div>" +
                "<div class=\"body\">无消息</div>"+
            "</div>");
        $(document.body).append(rightpanel);
        rightpanel.sliderBar({
            open : true,
            top : 200,
            width : 350,
            height : '100%',//240,
            theme : 'rgba(0,0,0,0.8)',
            position : 'right',
        });
    }

    function destroy() {
        if (rightpanel){
            rightpanel.hide()
        }
    }

    return {
        init: init,
        destroy: destroy
    }
})