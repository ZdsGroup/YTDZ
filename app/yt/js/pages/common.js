
//扩展mui.ajax的请求，后台服务查询入口
(function($, window) {
	//显示加载框
	$.myMuiQuery = function(url, params, success, error) {
		mui.ajax(url, {
			data: params,
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			/*crossDomain: true,//这里如果强制跨域，可能需要在plusReady中执行，具体需要真机测试下
			headers: {
				'Content-Type': 'application/json'
			},*/
			success: success,
			error: error
		});
	}
})(mui, window);

(function($, window) {
	//查询出错公用显示
	$.myMuiQueryErr = function(msg) {
		mui.toast(msg, {
					duration: 'short',
					type: 'div'
				})
	},
	//查询无结果公用显示
	$.myMuiQueryNoResult = function(msg) {
		mui.toast(msg, {
					duration: 'short',
					type: 'div'
				})
	},
	$.myMuiQueryBaseInfo = {
		baseURL:'http://quake.anruence.com/oracle',
		pageStartIndex:1
	}
})(mui, window);

