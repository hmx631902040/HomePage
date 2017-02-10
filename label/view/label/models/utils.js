/**String Extension**/
String.format = function () {
    if (arguments.length == 0)
        return null;

    var str = arguments[0];
    for (var i = 1; i < arguments.length; i++) {
        var re = new RegExp('\\{' + (i - 1) + '\\}', 'gm');
        str = str.replace(re, arguments[i]);
    }
    return str;
} // String.format("I Love {0}, and You Love {1}", "You","Me")

/**
 * 转换为百分数
 */
function parsePercent(number, multiply, addPer){
    var result = parseFloat(number);

    if(multiply){
        result *= 100;
    }

    result = result.toFixed(2);

    if(addPer){
        result += "%";
    }

    return result;
}

/**
 * 转换时间为指定格式 16/07/16
 */
function parseTime(dateString, setting){
    var date;
    if(dateString instanceof Date){
        date = dateString;
    }else{
        date = new Date(dateString.replace(/-/g, "/"));
    }

    var result = ""

    if(!setting){
        setting = {separator:"/", year:true, month: true, day: true};
    }

    var separator = setting.separator || "/"
    if(setting.year){
        result += date.getYear().toString().substr(-2) + separator;
    }

    if(setting.month){
        var month = date.getMonth() + 1;
        if(month < 10){
            result += "0";
        }
        result += month + separator;
    }

    if(setting.day){
        var day = date.getDate();
        if(day < 10){
            result += "0";
        }
        result += day;
    }

    return result;
}

/**
 * 投顾组合工具
 */
var TouGuUtils = (function () {
    function TouGuUtils(){

    }

    TouGuUtils.prototype.getBrowserType = function() {
        var ua = navigator.userAgent.toLowerCase();
        if(ua.indexOf('android') > -1) {
            return 1; //android
        } else if(ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1) {
            return 2; //IOS
        }

        return 0;
    };

    //前往调仓记录
    TouGuUtils.prototype.gotoTransferRecord = function(id){
        this.sendInteraction("gotoTransferRecord", [id]);
    };

    //前往组合配置
    TouGuUtils.prototype.gotoGroupConfig = function(id){
        this.sendInteraction("gotoGroupConfig", [id]);
    };

    //前往资讯详情
    TouGuUtils.prototype.gotoInfoDetail = function(id){
        this.sendInteraction("gotoInfoDetail", [id]);
    };

    //前往更多资讯页面
    TouGuUtils.prototype.gotoMoreInfos = function(codes){
        this.sendInteraction("gotoMoreInfos", [codes]);
    };

    //设置客户端总收益率
    TouGuUtils.prototype.setTGTotalIncomeRate = function(zsyl){
        this.sendInteraction("setTGTotalIncomeRate", [zsyl]);
    };

    //前往登录页面
    TouGuUtils.prototype.gotoLoginPage = function(){
        this.sendInteraction("gotoLoginPage", []);
    };

    //前往个股详情页面
    TouGuUtils.prototype.gotoStockInfoDetail = function(stockName, stockCode, marketId){
        this.sendInteraction("gotoStockInfoDetail", [stockName, stockCode, marketId]);
    };

    //设置字段内容
    TouGuUtils.prototype.setValue = function(id, value, field, hidenWhenEmpty){
        var element = document.getElementById(id);
        if(!element){
            return;
        }

        if(!field){
            field = "innerText";
        }

        if(hidenWhenEmpty){
            if(value == null || value == ""){
                element.style.display = "none";
            }else{
                element.style.display = "block";
            }
        }

        element[field] = value;
    };

    /**
     * 生成调仓记录
     */
    TouGuUtils.prototype.generateRecords = function(arr){
        var strPart1 = '<div class="storeitem" data-value="{0}" onclick="touGuUtils.gotoStockInfoDetail('+ "'{1}'"+ ", '{2}'"+ ", '{6}')"+ '">'+
                    '<div class="imgBuyOrSell"></div>'+
                    '<div class="stockinfo">'+
                        '<div class="stockname">{1}</div>'+
                        '<div class="stockcode">{2}</div>'+
                    '</div>'+

                    '<div class="stockdetail">'+
                        '<div>'+
                            '<span>{3}</span>'+
                            '<img src="../img/store_arrow.svg"/>'+
                            '<span>{4}</span>'+
                        '</div>';
        var strPart2 = '</div>'+
                    '<div class="clear line"></div>'+
                '</div>';

        var result = "";
        for(var i = 0; i < arr.length ; i++){
            var item = arr[i];
            var str;
            if(item.isTraded != 0){
                str = strPart1 + '<div class="priceIndi">参考成交价<span>' + parsePercent(item.tradePrice) + '</span></div>' + strPart2;
            }else{
                str = strPart1 + '<div class="indiStatus">待成交</div>' + strPart2;
                setMarketStatus(true);
            }

            result += String.format(str,
                item.isBuyOrSell != "0" ? "buy": "sell",
                item.stockName,
                item.stockCode,
                parsePercent(item.beforePercent, false, true),
                parsePercent(item.afterPercent, false, true),
                parsePercent(item.tradePrice),
                item.marketCode);
        }

        var records = document.getElementById("records");
        records.innerHTML = result;
    }

    /**
     * 生成组合配置
     */
    TouGuUtils.prototype.generateGroupConfig = function(config){
        var str = '<tr>'+
            '<td width="20"><div class="legendcircle" style="background-color:{0}"></div></td>'+
            '<td class="al" style="width:70px;">{1}</td>'+
            '<td><div class="valuebar" style="width:{2};background-color:{3}"></div></td>'+
            '<td width="50" class="ar">{4}</td>'+
        '</tr>';

        var result = "";
        for(var i = 0; i < config.datas.length ; i++){
            result += String.format(str,
                config.colors[i],
                config.labels[i],
                config.widths[i],
                config.colors[i],
                config.values[i]);
        }

        if(config.datas.length){
            var groupLegend = document.getElementById("groupLegend");
            groupLegend.style.display = "block";
        }

        var legendgroup = document.getElementById("legendgroup");
        legendgroup.innerHTML = result;
    }

    /**
     * 生成资讯列表
     */
    // TouGuUtils.prototype.generateInfoList = function(arr){
    //     var str = '<tr class="infoitem" data-value="{0}">'+
    //                 '<td class="infoitem-text">{1}</td>'+
    //                 '<td class="infoitem-time">{2}</td>'+
    //             '</tr>'+
    //             '<tr><td colspan="2"><div class="line"></div></td></tr>';

    //     var result = "";
    //     for(var i = 0; i < arr.length ; i++){
    //         var item = arr[i];
    //         result += String.format(str,
    //             item.titleID,
    //             item.title,
    //             parseTime(item.time));
    //     }

    //     var infoitembody = document.getElementById("infoitembody");
    //     infoitembody.innerHTML = result;
    // }

    /**
     * 发送与原生接口的交互请求
     * @param  {String} methodName 方法名
     * @param  {Array} parameters 参数数组
     */
    TouGuUtils.prototype.sendInteraction = function(methodName, parameters){
        if(window.disableInteraction){
            return;
        }

        // 判断如果是 PC, 则不处理
        var type = this.getBrowserType();
        if (!type) {

        }
        //判断如果是IOS平台则发送IOS请求，是Android平台则发送Android请求
        else if(type == 1) {
            if(methodName == "log"){
                console.log.apply(console, parameters);
            } else {
                // Android 平台
                KDS_Native[methodName].apply(KDS_Native, parameters);
            }
        } else if(type == 2) {
            //IOS 平台
            //组装方法
            var iosMethod = "KDS_Native://" + methodName;

            //组装参数
            var iosParams = "";
            if(parameters){
                for (var i = 0; i < parameters.length; i++) {
                    iosParams += ":" + parameters[i];
                };
            }

            //与IOS端交互
            location.href = iosMethod + iosParams;
        }
    };

    /**
     * Get params from Url
     * @author 杨利东
     */
    TouGuUtils.prototype.getParamsFromUrl = function () {
        var result = {};
        var url = decodeURI(location.href);

        if(url.length >=0 && url[url.length-1]=='#'){
            url = url.substring(0, url.length-1);
        }

        var paramsStr = url.toLowerCase().split("?")[1];

        if (paramsStr != null) {
            var paramArray = paramsStr.split("&");

            for (var i = 0; i < paramArray.length; i++) {
                var paramTarget = paramArray[i].split("=");

                result[paramTarget[0]] = paramTarget[1];
            }
        }

        return result;
    };

    /**
     * 随机生成颜色
     */
    TouGuUtils.prototype.randomColor = function () {
        return 'rgba(' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',' + Math.round(Math.random() * 255) + ',.7)';
    };

    return TouGuUtils;
})();

var TouGuUtils = new TouGuUtils();
module.exports = {
    parsePercent: parsePercent,
    parseTime: parseTime,
    TouGuUtils: TouGuUtils,
}
