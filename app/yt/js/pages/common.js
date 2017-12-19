//扩展mui.ajax的请求，后台服务查询入口
(function($, window) {
	//显示加载框
	var baseURL = 'http://quake.anruence.com/oracle/';
	$.myMuiQueryBaseInfo = {
		pageStartIndex: 1,
		pageSize: 20
	}
	$.myMuiQuery = function(url, params, success, error) {
		mui.ajax(baseURL + url, {
			data: params,
			dataType: 'json',
			type: 'get',
			timeout: 10000,
			success: globalSuccess,
			error: myMuiQueryErr
		});

		//查询无结果公用显示
		function globalSuccess(result) {
			if(result.code == 0 && result.data != null && result.data.total == 0) {
				plus.nativeUI.toast("无查询结果",{
					icon:'/images/info.png',
					duration: 'short',
					align: 'center',
					verticalAlign:'center'
				})
			}
			return success(result);
		}
		//查询出错公用显示
		function myMuiQueryErr(result) {
			if(result.code != 0) {
				plus.nativeUI.toast("查询失败”", {
					icon:'/images/info.png',
					duration: 'short',
					align: 'center',
					verticalAlign:'center'
				})
			}
			return error(result);
		}
	}

})(mui, window);