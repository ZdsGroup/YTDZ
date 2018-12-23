mui.init({
	gestureConfig: {
		tap: true, //默认为true
		doubletap: false, //默认为false
		longtap: false, //默认为false
		swipe: true, //默认为true
		drag: true, //默认为true
		hold: false, //默认为false，不监听
		release: false //默认为false，不监听
	}
});

//初始化应用
var initApp = function() {
	this.initEvent();
};
mui.ready(initApp);

mui.plusReady(function() {
	//若用户已经登录，则直接跳转到首页
	var token = plus.storage.getItem("token");
		var username = plus.storage.getItem('username');
		var pwd = plus.storage.getItem('pwd');
		if(token && username && pwd) {
			mui.jumpToIndex();
		}
});

var data = 0;
mui.back = function() {
	var first = null;
	if(!first) { //首次按键，提示‘再按一次退出应用’
		data += 1;
		setTimeout(function() {
			data = 0;
		}, 1000);
	}
	if(data == 2) {
		var btnArray = ['是', '否'];
		mui.confirm('确认退出？', '鹰潭地灾应用', btnArray, function(e) {
			if(e.index == 0) {
				plus.runtime.quit();
			} else {}
		});
	}
};

var initEvent = function() {
	//登录
	var loginButton = document.getElementById('login');
	var accountBox = document.getElementById('account');
	var passwordBox = document.getElementById('password');
	loginButton.addEventListener('tap', function(event) {
		if(accountBox.value && passwordBox.value) {
			var params = {
					username: accountBox.value,
					password: passwordBox.value
				},
				action = 'login';
			document.getElementById('loginInfo').innerText = '登录中，请稍候...';
			//发送登录请求
			mui.myMuiQueryPost(action, params, function(result) {
				if(result['code'] === 0) {
					if(plus && plus.storage) {
						plus.storage.setItem('name', accountBox.value);
						plus.storage.setItem('pwd', passwordBox.value);
						plus.storage.setItem('token', result['data']['token']);
					}
					
					mui.jumpToIndex();
				}
			}, mui.myMuiQueryErr('登录失败'));
		} else {
			document.getElementById('loginInfo').innerText = '请输入登录信息';
		}
	});
}