/**
 * Created by lyuwei on 2017/12/22.
 */
define(function () {
    var baseUrl = 'http://quake.anruence.com/oracle/';

    /**
     * @method 处理前后台交互 ajax 请求
     *
     * @param url 请求的url 如果带有http则直接使用该地址，如果没有则前面添加baseurl
     * @param method 请求方法 默认为 Get
     * @param data 需要处理的数据，传入对象，内部做obj 转 json处理
     * @param successBak 成功回调
     * @param errorBak 失败后的回调
     *
     * @example sendWebRequest('http://localhost:8080/webservice','GET',{data: '1'}, success, error)
     * @example sendWebRequest('regions','GET',{data: '1'}, success, error)
     * */
    function sendWebRequest(url,method, data,successBak,errorBak){
        if(url === undefined || url === null){
            throw new Error('没有正确的url');
            return;
        }
        if(url.indexOf('http') < 0)
            url = baseUrl + url;
        if(method === undefined || method === null)
            method = 'GET';
        $.ajax({
            url: url,
            type: method,
            contentType:"application/json;charset=UTF-8",
            dataType:"json",
            data: data,
            success:function (data) {
                successBak(data);
            },
            error:function (response) {
                errorBak(response);
            }
        });
    }
    return {
        sendWebRequest: sendWebRequest
    };
});