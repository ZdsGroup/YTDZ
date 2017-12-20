//扩展mui.ajax的请求，后台服务查询入口
(function($, window) {
	//显示加载框
	var baseURL = 'http://quake.anruence.com/oracle/';
	$.myMuiQueryBaseInfo = {
		pageStartIndex: 1,
		pageSize: 20
	}
	//查询入口
	$.myMuiQuery = function(url, params, success, error) {
		mui.ajax(baseURL + url, {
			data: params,
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: success,
			error: error
		});
	}
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
	//通用提示信息显示
	$.showMsg = function(mst) {
		mui.toast(mst, {
			icon: '/images/info.png',
			duration: 'short',
			align: 'center',
			verticalAlign: 'center'
		});
	}
})(mui, window);