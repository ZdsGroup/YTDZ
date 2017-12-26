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

define(["jquery","swiper",'text!app/panelsmall.html',"jquery.sliderBar",'jquery.iCheck'],
function ($,Swiper,panelsmallStr) {
    var rightpanel = null;
    function init() {
        if(rightpanel!==null){
            rightpanel.show();
            return;
        }
        rightpanel = $(
            "<div id=\"unitElementQuery\" class=\"sliderbar-container\">" +
                "<div class=\"title\"><i></i>基本信息</div>" +
                "<div class=\"body\"></div>" +
            "</div>");

        $('#center_panel').append(rightpanel);
        var REG_BODY = /<body[^>]*>([\s\S]*)<\/body>/;
        var result = REG_BODY.exec(panelsmallStr);
        if(result && result.length === 2)
            rightpanel.find('.body').append(result[1])

        rightpanel.sliderBar({
            open : false,
            top : 200,
            width : 350,
            height : '100%',//240,
            theme : 'rgba(0,0,0,0.8)',
            position : 'right',

            maxminEl : '#rightPanelDetail'
        });
        rightpanel.find('.title').trigger('click');

        // 初始化图片轮播
        new Swiper('.swiper-container', {
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            loop: true
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