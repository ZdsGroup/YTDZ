//说明：预警信息中心，支持首页预警图标点击，展示预警信息，也支持通过地灾点、设备页面，点击预警新使用，通过传递参数不同，进行不同的查询
//type:dzd--地灾点预警,数字--设备预警  , null--查询所有预警信息,
//paramId:对应地灾点ID，或者设备ID
var type = null;
var paramId = null;
var action = "alarms";
(function($) {
	$.init({
		pullRefresh: {
			container: '#pullrefresh',
			down: {
				callback: pulldownRefresh //下拉，获取更多数据
			},
			up: {
				contentrefresh: '正在加载...',
				callback: pullupRefresh //上拉， 刷新最新数据
			}
		}
	});
})(mui);

function pullUpSuccess(result) {
	if(result.code == 0) {
		var data = result.data;
		var rows = data.rows;
		var html = template('ul-li-template', {
			list: rows
		});
		document.getElementById("ullist").innerHTML = document.getElementById("ullist").innerHTML + html;
		if((data.page + 1) * data.size >= data.total) {
			//没有更多数据
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(true);
		} else {
			pageno = data.page + 1;
			mui('#pullrefresh').pullRefresh().endPullupToRefresh(false);
		}

	}
}

function pullDownSuccess(result) {
	if(result.code == 0) {
		var data = result.data;
		var rows = data.rows;
		var html = template('ul-li-template', {
			list: rows
		});
		document.getElementById("ullist").innerHTML = html;
		if((data.page + 1) * data.size >= data.total) {
			//没有更多数据
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh(true);
		} else {
			pageno = data.page + 1;
			mui('#pullrefresh').pullRefresh().endPulldownToRefresh();
		}
	}
}

function falult(message) {
	document.getElementById("ullist").innerHTML = '';
	mui.showMsg('查询失败');
	//异常处理；
}

var pageno = mui.myMuiQueryBaseInfo.pageStartIndex;

function pulldownRefresh() {
	pageno = mui.myMuiQueryBaseInfo.pageStartIndex;
	var queryParam = getQueryParam();
	queryParam.pageno = pageno;
	mui.myMuiQuery(action, queryParam,
		pullDownSuccess,
		falult
	)
}
/**
 * 上拉加载具体业务实现
 */
function pullupRefresh() {
	var queryParam = getQueryParam();
	queryParam.pageno = pageno;
	mui.myMuiQuery(action, queryParam,
		pullUpSuccess,
		falult
	)
}

//预警信息列表项的点击事件
var initEvent = function() {
	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
		var warnId = this.getAttribute("id");
		var pageUrl = '../../pages/common/yjxxxq.html';
		mui.openWindow({
			url: pageUrl,
			id: "yjxxxq",
			extras: {
				warnId: warnId
			}
		});
	});

	function siblingElems(elem) {
		var nodes = [];
		var _elem = elem;
		while((elem = elem.previousSibling)) {
			if(elem.nodeType == 1) {
				nodes.push(elem);
			}
		}
		var elem = _elem;
		while((elem = elem.nextSibling)) {
			if(elem.nodeType == 1) {
				nodes.push(elem);
			}
		}
		return nodes;
	}
	mui(".mui-table-cell").on('tap', '.mui-btn', function(e) {
		var value = this.getAttribute("value");
		var silbs = siblingElems(this);
		mui.each(silbs, function(index, element) {
			element.classList.remove('mui-active');
		})
		this.classList.add('mui-active');
		pageno = 1;
		var queryParam = getQueryParam();
		queryParam.pageno = pageno;
		mui.myMuiQuery(action, queryParam,
			pullDownSuccess,
			falult
		)
	});

}

function getQueryParam() {
	var dateSelect = document.getElementById("dateType").getElementsByClassName("mui-active")[0];
	var warnSelect = document.getElementById("warnType").getElementsByClassName("mui-active")[0];
	var queryParam = {
		pageno: pageno,
		pagesize: mui.myMuiQueryBaseInfo.pageSize
	}
	//判读时间
	var begin = null;
	var end = null;
	var day = null;
	var value = dateSelect.getAttribute("value");
	if(value == "currentday") {
		day = new Date().Format("yyyy-MM-dd");
		begin = day;
	} else if(value == "currentweek") {
		day = new Date().Format("yyyy-MM-dd");
		begin = getWeekStartDate();
		end = day;
	} else if(value == "currentmonth") {
		day = new Date().Format("yyyy-MM-dd");
		begin = getMonthStartDate();
		end = day;
	}
	if(begin != null) {
		queryParam.begin = begin;
	}
	if(end != null) {
		queryParam.end = end;
	}

	//判读预警等级
	value = warnSelect.getAttribute("value");
	if(IsNum(value)) {
		queryParam.rank = value;
	}
	//判读是否查询指定的地灾点或者监测设备的预警,如果=null ,说明是从首页点击预警信息 ，进入到页面，显示所有预警信息，和单个地灾点、设备无关
	//dzd ---地灾点
	if(!(typeof(type) == "undefined")) {
		if(type == "dzd") {
			queryParam.quakeid = paramId;
		} else {
			queryParam.deviceid = paramId;
		}
	}
	return queryParam;
}

function IsNum(num) {
	var reNum = /^\d*$/;
	return(reNum.test(num));
}

function initApp() {
	this.initEvent();
};
if(mui.os.plus) {
	mui.plusReady(function() {
		getParentPageParam();
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);
		initApp();

	});
} else {
	mui.ready(function() {
		getParentPageParam();
		mui('#pullrefresh').pullRefresh().pullupLoading();
		initApp();
	});
}

//页面传值
function getParentPageParam() {
	var self = plus.webview.currentWebview();
	type = self.type;
	paramId = self.paramId;
}