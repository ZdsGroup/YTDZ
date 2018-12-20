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
		var loginInfo = {
			account: accountBox.value,
			password: passwordBox.value
		};
		alert(loginInfo.account + loginInfo.password);
		//plus.nativeUI.toast(000);
	});
}