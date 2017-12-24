mui.init();
mui.plusReady(initView);

function initView () {
	//页面传值
	var self = plus.webview.currentWebview();
	var warnId = self.warnId;
	var action = "alarms/";

	mui.myMuiQuery(action + warnId, null, function(result) {
		var html = template('ul-li-template', {
			data: result.data
		});
		document.getElementById("warn-Info").innerHTML = html;
	}, function(reslut) {

	});
}