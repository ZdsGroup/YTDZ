//扩展mui.ajax的请求，后台服务查询入口
(function($, window) {
	//对象拷贝
	//深复制对象方法    
	$.myCloneObj = function(obj) {
		var newObj = {};
		if(obj instanceof Array) {
			newObj = [];
		}
		for(var key in obj) {
			var val = obj[key];
			newObj[key] = typeof val === 'object' ? arguments.callee(val) : val; //arguments.callee 在哪一个函数中运行，它就代表哪个函数, 一般用在匿名函数中。  
		}
		return newObj;
	}
	//显示加载框 上面是正式服务器，下面是测试服务器
	var baseURL = 'http://218.87.176.150/oracle/';
	// var baseURL = 'http://218.87.176.150:80/oracle/';
	//	var baseURL = 'http://182.92.2.91:8081/oracle/';

	//跳转到主页
	$.jumpToIndex = function() {
		mui.openWindow({
			url: 'index.html',
			id: 'index'
		});
	};

	//跳转到登录页
	$.jumpToLogin = function() {
		mui.openWindow({
			url: 'login.html',
			id: 'login'
		});
	};

	$.myMuiQueryBaseInfo = {
		pageStartIndex: 1,
		pageSize: 20
	}
	//查询入口
	$.myMuiQuery = function(url, params, success, error) {
		var token = plus.storage.getItem('token');
		mui.ajax(baseURL + url, {
			data: params,
			dataType: 'json',
			type: 'get',
			headers: {
				'token': token != null ? token : ''
			},
			timeout: 10000,
			success: function(result) {
				//令牌过期
				if(result['code'] == 1111) {
					if(plus && plus.storage) {
						plus.storage.clear();
					}

					mui.alert('用户令牌已过期，请重新登录!', '温馨提示', function() {
						mui.jumpToLogin();
					});
				} else if(result['code'] == -1) {
					if(plus && plus.storage) {
						plus.storage.clear();
					}

					mui.alert('应用许可已到期，请联系管理员!', '温馨提示', function() {
						mui.jumpToLogin();
					});
				} else {
					success(result);
				}

			},
			error: error
		});
	}

	//查询入口post
	$.myMuiQueryPost = function(url, params, success, error) {
		var token = null;
		if(plus && plus.storage){
			plus.storage.getItem('token');
		}
		mui.ajax(baseURL + url, {
			data: params,
			dataType: 'json',
			type: 'post',
			headers: {
				'token': token != null ? token : ''
			},
			timeout: 10000,
			success: function(result) {
				//令牌过期
				if(result['code'] == 1111) {
					if(plus && plus.storage) {
						plus.storage.clear();
					}

					mui.alert('用户令牌已过期，请重新登录!', '温馨提示', function() {
						jumpToLogin();
					});
				} else if(result['code'] == -1) {
					if(plus && plus.storage) {
						plus.storage.clear();
					}

					mui.alert('应用许可已到期，请联系管理员!', '温馨提示', function() {
						jumpToLogin();
					});
				} else {
					success(result);
				}

			},
			error: error
		});
	}
	//查询出错公用显示
	$.myMuiQueryErr = function(msg) {
		mui.toast(msg, {
			duration: 'short',
			type: 'div'
		})
	};
	//查询无结果公用显示
	$.myMuiQueryNoResult = function(msg) {
		mui.toast(msg, {
			duration: 'short',
			type: 'div'
		})
	};
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