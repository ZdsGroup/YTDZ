/**
 * Created by lyuwei on 2018/1/26.
 */
Ext.define('yt.utils.ImageSwiper', {
    extend: 'Ext.Container',

    xtype: 'imageswiper',

    border: false,

    config: {
        imageDataArr: []
    },

    initComponent: function () {
        var me = this;
        var newDateStr = new Date();
        newDateStr = newDateStr.getTime().toString();
        console.log(newDateStr);
        me.html =
            '<div id="'+ newDateStr +'" style="height: 100%; width: 100%">' +
            '<div class="swiper-wrapper">' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/1/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
            '</div>' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/2/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
            '</div>' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/3/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
            '</div>' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/4/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>'+
            '</div>' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/5/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
            '</div>' +
            '<div class="swiper-slide">' +
            '<img data-src="http://lorempixel.com/1600/1200/nature/6/" class="swiper-lazy">' +
            '<div class="swiper-lazy-preloader swiper-lazy-preloader-white"></div>' +
            '</div>' +

            '</div>' +
            '<div class="swiper-pagination-white" id="' + newDateStr + 'pagination' + '"></div>' +
            '</div>'

        me.on('boxready',function () {
            if( !me.getHeight() ){
                throw new Error("swiper组件要高度");
            }
            var swiper = new Swiper( '#' + newDateStr, {
                // Enable lazy loading
                lazy: true,
                pagination: {
                    el: '#' + newDateStr + 'pagination',
                    clickable: true
                }
            });
        })

        me.callParent();
    }

});