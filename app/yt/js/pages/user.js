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
	var username = localStorage.getItem('username');
	document.getElementById('userInfo').innerText = username;
	this.initEvent();
};
mui.ready(initApp);

var initEvent = function() {
	var loginOutButton = document.getElementById('loginOut');
	loginOutButton.addEventListener('tap', function(event) {
		localStorage.clear();
		mui.jumpToLogin('../../login.html');

		mui.plusReady(function() {
			var login = plus.webview.getWebviewById('login');
			if(login) {
				mui.fire(login, "loginrefresh");
			}
		})
	});
}