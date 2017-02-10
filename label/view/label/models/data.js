var Utils = require("./utils.js");
var TgService = require("./tgService.js");
var $ = require("./jquery-3.0.0.min.js");
var Initialization = require("./initialization.js");
var ChartUtil = require("./chartUtil.js");

(function() {
    //获取页面的参数
    var params = Utils.TouGuUtils.getParamsFromUrl();
    var groupID = params.groupid; //组合ID
    var userID = params.userid; //用户ID

    // window.tg_service_address = "../../../";//"http://111.13.63.1:9800/";
    //window.tg_service_address = "http://111.13.63.1:9800/";
    //window.tg_service_address = "http://172.16.210.200:21800/"
    //window.tg_service_address = "http://111.13.63.1:9800/";
    // window.tg_service_address = "http://120.27.166.251:9800/";
    window.tg_service_address = "http://accounttest.csc108.com:9800/";
    // window.tg_service_address = window.location.origin + "/";
    window.disableInteraction = true;

    //取组合详情数据
    // callGroupDetail({userID: userID, groupID: groupID },function(response){
    //  //初始化详情
    //  initDetails(response);
    // });

    //取组合详情数据
    TgService.callWebDetails({groupID: groupID}, function(response){
        var resultData = response[0];
        resultData.createdate = resultData.cjsj;
        resultData.createTime = resultData.cjsj;
        resultData.lastUpdateTime = resultData.gxrq;
        resultData.dayIncomeRate = resultData.rsy;
        resultData.totalIncomeRate = parseFloat(resultData.zsy||resultData.zsyl) * 100;
        resultData.netWorth = resultData.jz;
        resultData.monthIncomeRate= resultData.ysy;
        resultData.beatPercent = resultData.syph;
        resultData.name = resultData.zhmc;

        resultData.user={
            strav_small:resultData.tx,
            strnickName:resultData.yhnc
        };

        Initialization.initDetails(response);
        Initialization.initDetailsCreated(resultData);

        resultData.bkinfo = resultData.bkinfo || [];
        resultData.bkinfo.unshift({
            bzmc:"现金",
            bkzb:resultData.cash
        });

        ChartUtil.drawGroupConfig(resultData.bkinfo, {blockName:"bzmc", rate:"bkzb"});
    });

    //获取调仓记录
    TgService.callStorageRecords({userID: userID, groupID: groupID, count: 3, page: 1 },function(response){
        //初始化调仓记录
        Initialization.initStorageRecords(response);
    });

    // //获取组合配置
    // callGroupConfig({groupID: groupID}, function(response){
    //  //初始化组合配置
    //  drawGroupConfig(response, {blockName:"stockTypeName", rate:"group_percent"});
    // });

    //初始化收益走势
    Initialization.initProfitTrend(groupID, function(tjsj, curid){
        //初始化走势图表
        getProfitTrend(tjsj, curid);
    });

    //初始化走势图表
    Initialization.getProfitTrend(3, groupID);
})();
