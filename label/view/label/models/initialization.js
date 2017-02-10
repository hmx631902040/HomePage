var Utils = require("./utils.js");
var TgService = require("./tgService.js");
var ChartUtils = require("./chartUtil.js");
/**
 * 设置涨跌平区域的高度
 */
// function setHeightOfDetail(){
// 	var colormark = document.getElementById("colormark");
// 	var height = window.innerWidth / 100 * 53;
// 	if(colormark.clientHeight <= height){
// 		colormark.style.height = height + "px";
// 	}
// }

// setHeightOfDetail();

/**
 * 初始化创建时的详情数据
 */
function initDetailsCreated(detailData){
	if(!detailData){
		return "false";
	}

	var user = detailData.user||{};
	var zsyl = Utils.parsePercent(detailData.totalIncomeRate);
	var rootDiv = document.getElementById("rootDiv");
	if(zsyl < 0){
		rootDiv.setAttribute("data-color","die");
	} else if(zsyl > 0){
		rootDiv.setAttribute("data-color","zhang");
	} else{
		rootDiv.setAttribute("data-color","ping");
	}

	if(user.strav_small){
		var peoplePic = document.getElementById("peoplePic");
		peoplePic.src = user.strav_small;
	}

	//总收益率
	Utils.TouGuUtils.setValue("zsyl", zsyl);
	//关注人数
	Utils.TouGuUtils.setValue("gzrs", detailData.gzrs);
	//净值
	Utils.TouGuUtils.setValue("jzvalue", detailData.netWorth);
	//用户名
	Utils.TouGuUtils.setValue("peopleName", user.strnickName);
	//创建时间
	Utils.TouGuUtils.setValue("createdate", Utils.parseTime(detailData.createTime));

	if(detailData.name){
		document.title = detailData.name;

		//以下代码可以解决微信上不能更新标题问题
		setTimeout(function(){
		    //利用iframe的onload事件刷新页面
		    document.title = detailData.name;
		    var iframe = document.createElement('iframe');
		    iframe.style.visibility = 'hidden';
		    iframe.style.width = '1px';
		    iframe.style.height = '1px';
		    iframe.onload = function () {
		        setTimeout(function () {
		            document.body.removeChild(iframe);
		        }, 0);
		    };
		    document.body.appendChild(iframe);
		},0);
	}
}

/**
 * 初始化详情
 */
function initDetails(response){
	if(!response || response.length <= 0 || response.errCode){
		return;
	}

	var detailData = response[0];

	var result = {
		day: Utils.parsePercent(detailData.dayIncomeRate, true, true),
		month: Utils.parsePercent(detailData.monthIncomeRate, true, true),
		defeat: Utils.parsePercent(detailData.beatPercent, true, true),
		updatedate:Utils.parseTime(detailData.lastUpdateTime),
		likeCount:detailData.likeCount,
		mockCount:detailData.mockCount,
		sfdz:detailData.sfdz,
		sftc:detailData.sftc,
		idea:detailData.idea
	};

	//日值
	Utils.TouGuUtils.setValue("dayvalue", result.day);
	//月值
	Utils.TouGuUtils.setValue("monthvalue", result.month);
	//战胜百分数
	Utils.TouGuUtils.setValue("defeatvalue", result.defeat);
	//更新时间
	Utils.TouGuUtils.setValue("updatedate", result.updatedate);
	//点赞人数
	Utils.TouGuUtils.setValue("goodNumber", result.likeCount);
	//吐槽人数
	Utils.TouGuUtils.setValue("badNumber", result.mockCount);

	if(result.idea == "" || result.idea == null){
		result.idea = "说说你的理念，让别人更好的了解你的组合";
	}
	//个性签名
	Utils.TouGuUtils.setValue("peopleintro", result.idea, false, true);

	if(result.idea == ""){
		document.getElementById("stockgod").style.marginTop = "0";
	}

	window.currentDZS = parseInt(result.likeCount || 0);
	window.currentTCS = parseInt(result.mockCount || 0);

	return result;
}

/**
 * 初始化调仓记录
 */
function initStorageRecords(response){
	if(!response || response.length <= 0 || response.errCode){
		return;
	}

	var storagetime = document.getElementById("storagetime");
	storagetime.innerText = "("+ response[0].createTime+")";

	//生成调仓记录
	Utils.TouGuUtils.generateRecords(response);
};

/**
 * 初始化收益走势
 */
function initProfitTrend(groupID, clickHandle){
}

/**
 * 获取数据并初始化走势图
 */
function getProfitTrend(tjsj, groupID){
	//初始化走势图表
	TgService.callProfitTrend({tjsj: tjsj, groupID: groupID },function(response){
		//初始化走势图表
		ChartUtils.drawProfitTrendChart(response);
	});
}

module.exports = {
	initProfitTrend: initProfitTrend,
	initStorageRecords: initStorageRecords,
	initDetails: initDetails,
	initDetailsCreated: initDetailsCreated,
	getProfitTrend: getProfitTrend,
}
