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
	//异常处理；
}

var action = "alarms";
var pageno = mui.myMuiQueryBaseInfo.pageStartIndex;
function pulldownRefresh() {
	pageno = 1;
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

//添加列表项的点击事件
var initEvent = function() {
	mui(".mui-table-view").on('tap', '.mui-table-view-cell', function(e) {
		var info = this.getAttribute("id");
		var typeT = info.split('_')[0];
		var idT = info.split('_')[1];
		//定位到具体的预警tab
		var tabT = 'warn'
		openInfoPage(typeT, idT, tabT);
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

	//根据类型和id打开对应的设备详情页面
	function openInfoPage(typeT, idT, tabT) {
		var pageUrl = '';
		var pageId = '';
		switch(typeT) {
			case 'bmwyjc':
				{
					pageUrl = '../../pages/jcsb/jcsbyjxx.html';
					pageId = 'dzd-bmwyjc-yjxx';
					break;
				}
			case 'lfjc':
				{
					pageUrl = '../../pages/jcsb/jcsbyjxx.html';
					pageId = 'dzd-lfjc-yjxx';
					break;
				}
			case 'yljc':
				{
					pageUrl = '../../pages/jcsb/jcsbyjxx.html';
					pageId = 'dzd-yljc-yjxx';
					break;
				}
			default:
				break;
		}
		mui.openWindow({
			url: pageUrl,
			id: pageId,
			extras: {
				xqType: typeT,
				xqID: idT,
				xqTab: tabT
			}
		});
	}
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
	return queryParam;
}

function IsNum(num) {
	var reNum = /^\d*$/;
	return(reNum.test(num));
}
var initApp = function() {
	this.initEvent();
};
if(mui.os.plus) {
	mui.plusReady(function() {
		setTimeout(function() {
			mui('#pullrefresh').pullRefresh().pullupLoading();
		}, 1000);
		initApp();

	});
} else {
	mui.ready(function() {
		mui('#pullrefresh').pullRefresh().pullupLoading();
		initApp();
	});
}