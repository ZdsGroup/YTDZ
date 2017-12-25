$(function(){
    // nav收缩展开
    $('.nav-item>a').on('click',function(){
        if (!$('.navnew').hasClass('nav-mini')) {
            if ($(this).next().css('display') == "none") {
                //展开未展开
                $('.nav-item').children('ul').slideUp(300);
                $(this).next('ul').slideDown(300);
                $(this).parent('li').addClass('nav-show').siblings('li').removeClass('nav-show');
            }else{
                //收缩已展开
                $(this).next('ul').slideUp(300);
                $('.nav-item.nav-show').removeClass('nav-show');
            }
        }
    });
    //nav-mini切换
    $('#mini').on('click',function(){
        if (!$('.navnew').hasClass('nav-mini')) {
            $('.nav-item.nav-show').removeClass('nav-show');
            $('.nav-item').children('ul').removeAttr('style');
            $('.navnew').addClass('nav-mini');
            $('#center_panel').css("margin-left", "60px");
            $('.navnew').find('#menuSearch').hide();
        }else{
            $('.navnew').removeClass('nav-mini');
            $('#center_panel').css("margin-left", "220px");
            $('.navnew').find('#menuSearch').show();
        }
    });

    hiddenTitle();
    $(window).bind("resize", function () {
        hiddenTitle();
    });
});

function hiddenTitle() {
    if ($(this).width() < 1500) {
        $('.header-title').addClass('hide');
    } else {
        $('.header-title').removeClass('hide');
    }

    $('.navnew').css({ 'height': $(this).height() - 60 + 'px' });
    $('#center_panel').css({ 'height': $(this).height() - 60 + 'px' });
}