var echarts = require('./echarts.simple.min.js');
var Utils = require("./utils.js");
window.myGroupChartsObj = {};

/**
 * 窗体大小更改后重新规划图表大小
 */
window.onresize = function (argument) {
	if(window.myGroupChartsObj.myLineChart){
		window.myGroupChartsObj.myLineChart.resize();
	}

	if(window.myGroupChartsObj.myPieChart){
		window.myGroupChartsObj.myPieChart.resize();
	}
}

/**
 * 画收益走势图表
 */
function drawProfitTrendChart(response){
	var dataLabels = [], groupDatas = [], hsDatas = [], emptys=[];
	var lineChart = document.getElementById('lineChart');
	lineChart.style.display = "block";
	if(!window.myGroupChartsObj.myLineChart){
		window.myGroupChartsObj.myLineChart = echarts.init(document.getElementById('lineChart'));
	}

	if(response){
		for (var i = 0; i < response.length - 1; i++) {
			for (var j = 0; j < response.length - 1 - i; j++) {
				if(!response[j].date) {response[j].date = new Date(response[j].hs_date.replace(/-/g, "/")); }
				if(!response[j+1].date) {response[j+1].date = new Date(response[j+1].hs_date.replace(/-/g, "/")); }
				if(response[j].date > response[j+1].date){
					var temp = response[j+1];
					response[j+1] = response[j];
					response[j] = temp;
				}
			};
		}

		var fistClosePrice = 0;
		if(response.length > 0){
			var fistClosePrice = parseFloat(response[0].closePrice);

			//增加起点
			// var date = new Date(response[0].hs_date.replace(/-/g, "/"));
			// date.setDate(date.getDate() - 1);
			// dataLabels.push(parseTime(date, {month:true, day:true, separator: "-"}));
			// groupDatas.push(0);
			// hsDatas.push(0)
		}

		var maxNum = response.length < 5 ? 5: response.length;
		var maxValue = 0, minValue = 0;
		for (var i = 0; i < maxNum; i++) {
			if(i < response.length){
				var item = response[i];
				if(i!=0 && item.hs_date == response[i-1].hs_date){
					continue;
				}

				var dayNetWorth = ((parseFloat(item.dayNetWorth) - 1)*100).toFixed(2);
				var closePrice = parseFloat(response[i].closePrice);
				var zdf = (closePrice - fistClosePrice) / fistClosePrice;
				if(isNaN(zdf)){
					zdf = 0;
				}
				var hszdf = Utils.parsePercent(zdf, true);

				dataLabels.push(Utils.parseTime(item.hs_date, {month:true, day:true, separator: "-"}));
				groupDatas.push(dayNetWorth);
				hsDatas.push(hszdf);

				if(maxValue < dayNetWorth){
					maxValue = dayNetWorth;
				}
				if(maxValue < hszdf){
					maxValue = hszdf;
				}
				if(dayNetWorth < minValue){
					minValue = dayNetWorth;
				}
				if(hszdf < minValue){
					minValue = hszdf;
				}
			}else{
				dataLabels.push("");
				groupDatas.push(NaN);
				hsDatas.push(NaN);
			}

			emptys.push(NaN);
		};

		emptys[0] = maxValue * 1.1;
		emptys[emptys.length - 1] = minValue * 1.2;
	}

	option = {
		animation: false,
	    title: {
	        show:false
	    },
	    tooltip: {
	        trigger: 'axis',
            axisPointer: {
                animation: false
            },
	    },
	    grid: {
	    	top: '3%',
	        left: '3%',
	        right: '5%',
	        bottom: '3%',
	        containLabel: true
	    },
	    toolbox: {
	        feature: {
	            saveAsImage: {}
	        }
	    },
	    xAxis: {
	    	splitLine: {
                show: false
            },
	        type: 'category',
	        boundaryGap: false,
	        data: dataLabels,
	        axisLabel: {
                show: true,
                interval: 'auto',
				textStyle:{
					color:"black"
            	}
            },
	        axisLine:{
            	lineStyle:{color:"#CCCCCC"}
            },
	        axisTick: {
	        	show: false
	        }
	    },
	    yAxis: {
			type : 'value',
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: function (value, index) {
				    // 格式化成月/日，只在第一个刻度显示年份

				    return value.toFixed(2) + "%";
				},
				textStyle:{
					color:"black"
            	}
            },
            axisLine:{
            	lineStyle:{color:"white"}
            },
            splitNumber: 4,
	    },
	    series: [
	        {
	        	showSymbol: false,
	            name:'组合',
	            type:'line',
	            itemStyle: {
                	normal: {
	                    color: 'rgb(255,61,0)'
	                }
	            },
	            data:groupDatas
	        },
	        {
	        	showSymbol: false,
	            name:'沪深300',
	            type:'line',
	            itemStyle: {
                	normal: {
	                    color: '#2577ff'
	                }
	            },
	            data:hsDatas
	        },
	        {
	        	showSymbol: false,
	            name:'invisible',
	            type:'line',
	            itemStyle: {
                	normal: {
	                    color: 'transparent'
	                }
	            },
	            data:emptys
	        },
	    ]
	};

    // If Samsung android browser is detected
    if (window.navigator && window.navigator.userAgent.indexOf('534.30') > 0) {

        // Tweak the canvas opacity, causing it to redraw
        $('canvas').css('opacity', '0.99');

        // Set the canvas opacity back to normal after 5ms
        setTimeout(function() {
            $('canvas').css('opacity', '1');
        }, 5);

    }

	// 使用刚指定的配置项和数据显示图表。
    window.myGroupChartsObj.myLineChart.setOption(option);
}

/**
 * 画组合配置的饼状图
 */
function drawGroupConfig(response, paramsConfig){
	var labels = [];
	var datas = [];
	var colors = ["#3a84ff","#ff8400", "#a24aff", "#2577ff", "#ff3d00", "#ffcc00", "#2b99f0",
		"#d26164", "#6740b3", "#fe9927", "#920784", "#20bcd3", "#53ae51",
		"#def318", "#4153b5", "#8dc152", "#feec4e", "#9e9e9e", "#617d89",
		"#13897b", "#cddb48", "#def318"];
	var widths = [];
	var values = [];

	var blockName = "blockName";
	var rate = "rate";

	if(window.isMarketClose){
		var waitDeal = document.getElementById("waitDeal");
		waitDeal.style.display = "block";
		colors = ["#808080", "#868686",
		"#8e8d8d","#9c9c9c", "#a5a5a5", "#afafaf", "#b3b3b3", "#bbbbbb",
		"#c1c1c1", "#cacaca", "#d2d2d2", "#dcdcdc", "#e8e8e8","#ececec","#f1f1f1"];
	}

	if(paramsConfig){
		blockName = paramsConfig.blockName;
		rate = paramsConfig.rate;
	}

	for (var i = 0; i < response.length; i++) {
		var dataItem = response[i];
		var percent = Utils.parsePercent(dataItem[rate],true,true);
		labels.push(dataItem[blockName]);
		datas.push(Utils.parsePercent(dataItem[rate],true,false));
		values.push(percent);
		widths.push(percent);

		if(colors.length == i){
			colors.push(touGuUtils.randomColor());
		}
	};

	var doughnutChart = document.getElementById('doughnutChart');
	doughnutChart.style.display = "block";
	var hideChartDiv = document.getElementById('hideChartDiv');
	hideChartDiv.style.display = "block";
	if(!window.myGroupChartsObj.myPieChart){
		window.myGroupChartsObj.myPieChart = echarts.init(doughnutChart);
	}

	if(datas.length > 0){
		datas[0] = {
			value: datas[0],
			name: "持股板块分布"
		};
	}

	// 指定图表的配置项和数据
    var option = {
    	animation: false,
	    tooltip: {
	        show: false
	    },
	    legend: {
	    	show: false,
	        orient: 'vertical',
	        x: 'left',
	        data:labels
	    },
	    grid: {
	    	top: '3%',
	    },
	    series: [
	        {
	            name:'组合配置',
	            type:'pie',
	            radius: ['100%', '70%'],
	            avoidLabelOverlap: false,
	            hoverAnimation: false,
	            legendHoverLink: false,
	            selectedOffset: 0,
	            label: {
	                normal: {
	                    show: true,
	                    position: 'center',
	                    textStyle: {
	                        color: 'black'
	                    }
	                },
	                emphasis: {
	                    show: true,
	                    textStyle: {
	                        color: 'black'
	                    }
	                }
	            },
	            color:colors,
	            labelLine: {
	                normal: {
	                    show: false
	                }
	            },
	            data: datas
	        }
	    ]
	}

    // If Samsung android browser is detected
    if (window.navigator && window.navigator.userAgent.indexOf('534.30') > 0) {

        // Tweak the canvas opacity, causing it to redraw
        $('canvas').css('opacity', '0.99');

        // Set the canvas opacity back to normal after 5ms
        setTimeout(function() {
            $('canvas').css('opacity', '1');
        }, 5);

    }

    // 使用刚指定的配置项和数据显示图表。
    window.myGroupChartsObj.myPieChart.setOption(option);

    var config = {
    	labels: labels,
    	datas: datas,
    	colors: colors,
    	widths: widths,
    	values: values
    };
    // 初始化组合配置标志
    Utils.TouGuUtils.generateGroupConfig(config);
}

module.exports = {
	drawProfitTrendChart: drawProfitTrendChart,
	drawGroupConfig: drawGroupConfig,
}
