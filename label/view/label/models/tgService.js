var $ = require("./jquery-3.0.0.min.js");
/**
 * 发送网络请求
 */
function callWeb (url, data, options, successCallback) {
	// body...
	$.ajax({
			url: url,
            // data: data,
            dataType: "json",
            timeout: 60 * 1000,
            async: true,
            crossDomain: true,
            disableLog: true,
            beforeSend: function () {  //请求之前加载

            },
            success: function (response) {
                console.log(url + "\n", response);

                if(successCallback){
                	successCallback(response);
                }
            },
            error: function (request, status, error) {
                console.log(request);
            }
        });
}

/**
 * 查询组合配置
 */
function callGroupConfig(params, successCallback){
	var url = window.tg_service_address + "/api/tg-service/portfolio/zhcc/select/100000?"

    url = url + "groupID=" + params.groupID;

	callWeb(url, params, null, successCallback);
}

/**
 * 获取调仓记录
 */
function callStorageRecords(params, successCallback){
    var url = window.tg_service_address + "api/tg-service/portfolio/tcjl/select/100000?";

    url = url +
            "userID=" + params.userID +
            "&groupID=" + params.groupID +
            "&count=" + params.count +
            "&page=" + params.page;


    callWeb(url, params, null, successCallback);
}

/**
 * 获取组合详情
 */
function callGroupDetail(params, successCallback){
    var url = window.tg_service_address + "api/tg-service/portfolio/zhxq/select/100000?";

    url = url +
            "userID=" + params.userID +
            "&groupID=" + params.groupID;


    callWeb(url, params, null, successCallback);
}

/**
 * 获取最近收益走势
 */
function callProfitTrend(params, successCallback){
    var url = window.tg_service_address + "api/tg-service/portfolio/zyzs/select/100000?";

    url = url +
            "tjsj=" + params.tjsj +
            "&groupID=" + params.groupID;


    callWeb(url, params, null, successCallback);
}

/**
 * 获取相关资讯
 */
// function callRelativeInfos(params, successCallback){
//     var url = window.info_service_address + "api/news/select/?";

//     url = url +
//             "start=" + params.start +
//             "&end=" + params.end +
//             "&code=" + params.code;

//     callWeb(url, params, null, successCallback);
// }

/**
 * 设置点赞或者吐槽
 */
// function callSetGoodOrBad(status, successCallback){
//     var url = window.tg_service_address + "/api/tg-service/portfolio/dztc/add/100000?";

//     var userID = "", groupID = "", currentUserId = "";
//     if(window.currentGroupData) {
//         //userID = window.currentGroupData.user.userid;
//         groupID = window.currentGroupData.id;
//         currentUserId = window.currentGroupData.currentUserId;
//     }

//     var czlx, flag;
//     if(status == 0){
//         if(window.currentGoodBadStatus == 0){
//             return;
//         }else if(window.currentGoodBadStatus == 1){
//             czlx = 1; flag = 0;
//         } else {
//             czlx = 2; flag = 0;
//         }
//     }else if(status == 1){
//         if(window.currentGoodBadStatus == 1){
//             czlx = 1; flag = 0;
//         } else {
//             czlx = 1; flag = 1;
//         }
//     } else{
//         if(window.currentGoodBadStatus == 2){
//             czlx = 2; flag = 0;
//         } else {
//             czlx = 2; flag = 1;
//         }
//     }

//     url = url +
//             "userID=" + currentUserId +
//             "&groupID=" + groupID +
//             "&czlx=" + czlx +
//             "&flag=" + flag;


//     callWeb(url, "", null, successCallback);
// }

/**
 * 获取组合详情
 */
function callWebDetails(params, successCallback){
    var url = window.tg_service_address + "api/tg-service/portfolio/zhfx/select/100000?";

    url = url +
            "groupID=" + params.groupID;

    callWeb(url, params, null, successCallback);
}

module.exports = {
    callWebDetails: callWebDetails,
    callStorageRecords: callStorageRecords,
    callProfitTrend: callProfitTrend,
}
