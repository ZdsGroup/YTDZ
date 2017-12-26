/***************************************************************************************
 侧边栏插件
 @autor     iProg
 @date      2016-01-25
 @version   1.0

 使用方法：
 在页面建立html标签如下：
 <div class="sliderbar-container">
    <div class="title"><i></i> 通知消息</div>
    <div class="body">
        无消息
    </div>
 </div>

 说明：上面的class属性值，除了sliderbar-container1可以随意更改，其它的如title，body都
       不能更改哦！
 
 然后加入js代码如下，就可以了:
 <script type="text/javascript">
 $(function(){
    $('.sliderbar-container').sliderBar({
        open : true,
        top : 200,
        width : 360,
        height : 240,
        theme : '#463eee',
        position : 'right'
    });
 });
 </script>
****************************************************************************************/
;(function ($) {
    $.fn.extend({
        "sliderBar": function (options) {
            // 使用jQuery.extend 覆盖插件默认参数
            var opts = $.extend(
                {} ,
                $.fn.sliderBar.defalutPublic ,
                options
            );

            // 这里的this 就是 jQuery对象，遍历页面元素对象
            // 加个return可以链式调用
            return this.each(function () {
                //获取当前元素 的this对象 
                var $this = $(this);  

                $this.data('open', opts.open);

                privateMethods.initSliderBarCss($this, opts);

                switch(opts.position){
                    case 'right' : privateMethods.showAtRight($this, opts); break;
                    case 'left'  : privateMethods.showAtLeft($this, opts); break;
                }
                
            });
        }
    });

    // 默认公有参数
    $.fn.sliderBar.defalutPublic = {
        open : true,           // 默认是否打开，true打开，false关闭
        top : 200,             // 距离顶部多高
        width : 260,           // body内容宽度
        height : 200,          // body内容高度
        theme : 'green',       // 主题颜色
        position : 'left',      // 显示位置，有left和right两种
        zIndex :'1500'          //层叠位置
    }

    var privateMethods = {
        initSliderBarCss : function(obj, opts){
            obj.css({
                'width': opts.width+20+'px',
                'height' : opts.height+20+'px',
                'top' : opts.top+'px',
                'border' : '1px solid '+opts.theme,
                'position':'fixed',
                'background-color':'white',
                'font-family':'Microsoft Yahei',
                'z-index': opts.zIndex
            }).find('.body').css({
                'width': opts.width + 20 +'px',
                'height' : opts.height+'px',
                'position':'relative',
                // 'padding':'10px 10px 40px 10px',
                'padding':'0 0 40px 0',
                'overflow-x':'hidden',
                'overflow-y':'auto',
                'font-family':'Microsoft Yahei',
                'font-size' : '12px',
                'float': 'left'
            });
            function resizehight() {
                if(opts.height === '100%'){
                    // 根据top值设置高度
                    var clientHeight = $(window).height();
                    obj.css({'height' : clientHeight - opts.top + 'px'})
                        .find('.body').css({'height' : clientHeight - opts.top + 'px'});
                }
            }
            resizehight();
            $(window).bind("resize", function () {
                resizehight();
            });

            var titleCss = {
                'width':'25px',
                'height':'105px',
                'position':'absolute',
                'top':'-1px',
                'display':'block',
                'background-color': opts.theme,
                'font-size': '13px',
                'padding':'8px 4px 0px 5px',
                'color':'#fff',
                'cursor': 'pointer',
                'font-family':'Microsoft Yahei',
                'border-radius':'10px 0 0 10px'
            }

            obj.find('.title').css(titleCss).find('i').css({
                'font-size': '15px'
            });

            // 全屏操作
            obj.data('maxSize',false);
            obj.data('maxPreTop',opts.top);
            if(opts.hasOwnProperty('maxminEl')){
                setInterval(maxSizeWidthFunc , 250); // 监听map的div长度改变
                var iframDiv = $(
                    '<div id="iframDiv" class="panel-success" style="float: left;background-color: black;height: 100%;width: 100%">' +
                        '<div class="panel-heading" style="font-size: 14px;">' +
                            '<button class="btn-xs btn-w-m btn-info" id="iframMinSize">最小化</button>' +
                            '<span>贵溪市石膏矿地面塌陷地灾点详情</span>' +
                        '</div>' +
                    '</div>'
                );
                obj.append(iframDiv);
                iframDiv.hide();

                var iframchildrendiv = $('<iframe src="../../../V2/app/dzdetail.html" style="height:100%;width:100%"/>');
                iframDiv.append(iframchildrendiv);

                $(opts.maxminEl).click(function () {
                    _maxminCallBackFunction();
                })
                iframDiv.find('#iframMinSize').click(function () {
                    _maxminCallBackFunction();
                })

                function _maxminCallBackFunction() {
                    if(obj.data('maxSize')){
                        opts.top = obj.data('maxPreTop');
                        var minSizeCss = {
                            'width': opts.width+20+'px',
                            'top': opts.top + 'px',
                            'height': $(window).height() - opts.top + 'px'
                        }
                        obj.animate(minSizeCss,300,'linear',function () {
                            obj.find('.title').show();
                        });
                        // this.innerHTML = '更多';
                        iframDiv.hide();
                        obj.find('.body').show();
                    }else{
                        opts.top = 60;
                        var maxSizeCss = {
                            'width': $('#mapdiv').width() + 'px',
                            'top': opts.top + 'px',
                            'height': $(window).height() - opts.top + 'px'
                        }
                        obj.find('.title').hide();
                        obj.find('.body').hide();
                        obj.animate(maxSizeCss,300,'linear',function () {
                            iframDiv.show();
                        });
                        // this.innerHTML = '缩小';
                        // iframDiv.css({'width': $('#mapdiv').width() - opts.width - 22 + 'px'})
                    }
                    obj.data('maxSize',obj.data('maxSize') == true ? false : true);
                }
            }

            var oldMapWidth = null;
            function maxSizeWidthFunc() {
                if(obj.data('maxSize') == false)return;
                var mapwidth = $('#mapdiv').width();
                if( oldMapWidth !== null && oldMapWidth !== mapwidth){
                    obj.css({'width': mapwidth + 'px'});
                    // iframDiv.css({'width': mapwidth - opts.width - 22 + 'px'})
                }
                oldMapWidth = mapwidth;
            }
        },
        showAtLeft : function(obj, opts){
            if(opts.open){
                obj.css({left:'0px'});
                obj.find('.title').css('right','-25px').find('i').attr('class','fa fa-chevron-circle-left');
            }else{
                obj.css({left:-opts.width-22+'px'});
                obj.find('.title').css('right','-25px').find('i').attr('class','fa fa-chevron-circle-right');
            }

            obj.find('.title').click(function(){
                if(obj.data('open')){
                    obj.animate({left:-opts.width-21+'px'}, 500);
                    $(this).find('i').attr('class','fa fa-chevron-circle-right');
                }else{
                    obj.animate({left:'0px'}, 500);
                    $(this).find('i').attr('class','fa fa-chevron-circle-left');
                }
                obj.data('open',obj.data('open') == true ? false : true);
            });
        },
        showAtRight : function(obj, opts){
            if(opts.open){
                obj.css({right:'0px'});
                obj.find('.title').css('right', opts.width+20+'px').find('i').attr('class','fa fa-chevron-circle-right');
            }else{
                obj.css({right:-opts.width-21+'px'});
                obj.find('.title').css('right', opts.width+20+'px').find('i').attr('class','fa fa-chevron-circle-left');
            }

            obj.find('.title').click(function(){
                if(obj.data('open')){
                    obj.animate({right:-opts.width-21+'px'}, 500);
                    $(this).find('i').attr('class','fa fa-chevron-circle-left');
                }else{
                    obj.animate({right:'0px'}, 500);
                    $(this).find('i').attr('class','fa fa-chevron-circle-right');
                }
                obj.data('open',obj.data('open') == true ? false : true);
            });
        }
    };
})(jQuery)
