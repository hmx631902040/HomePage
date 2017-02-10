var React = require('react');
var ReactDOM = require('react-dom');
var Echarts = require('echarts');
var $ = require('jquery');
require("../models/utils.js");
require("../models/tgService.js");
require("../models/chartUtil.js");
require("../models/initialization.js");
require("../models/data.js");
require("./detail.css");

var Detail = React.createClass({
    getInitialState:function(){
        return {
            "gzrs": 0,
            "zsyl": 500,
            "previousActiveItem": "timeli0",
        }
    },

    componentDidMount:function(){
        var colormark = document.getElementById("colormark");
        var height = window.innerWidth / 100 * 53;
        if(colormark.clientHeight <= height){
            colormark.style.height = height + "px";
        }
    },

    setActiveFunc:function (ev, tjsj, clickHandle) {
        var item = document.getElementById(this.state.previousActiveItem);
        item.className="";
        var ev = ev || window.event;
        var target  = ev.target || ev.srcElement;
        target.className = "active";

        if(clickHandle){
            clickHandle(tjsj, groupID);
        }

        this.setState({previousActiveItem: target.id});
    },

    handleOne:function(e){
        this.setActiveFunc(e, 3);
    },

    handleTwo:function(e){
        this.setActiveFunc(e, 1);
    },

    handleThree:function(e){
        this.setActiveFunc(e, 2);
    },

    handleStoragetime:function(){
        this.innerText = "("+ response[0].createTime+")";
    },

    goForDownload:function(){
        window.location.href = 'http://a.app.qq.com/o/simple.jsp?pkgname=zhongxinjiantou.szkingdom.android.newphone';
    },

    appdownloadClose:function(){
        $("#appdownload").css('display','none');
    },

    render:function(){
        var divStyle = {
            "visibility": "hidden"
        };
        var syl = {
            "marginTop": "-16px"
        };

        return (
            <div className="kmc kmc-tgxq">
                <div id="rootDiv" className="header" data-color="ping" >
                    <div id="colormark" className="colormark">
                        <div className="attention">
                            <img id="imgrank" style={divStyle} src="../img/detail_golden.png" />
                            <div>
                                <span id="gzrs">
                                    {this.state.gzrs}
                                </span>人关注
                            </div>
                        </div>
                        <div className="sumprofit">
                            <p className="label" style={syl}>总收益率</p>
                            <p className="value">
                                <span id="zsyl">{this.state.zsyl}</span>
                                <span className="percent">%</span>
                            </p>
                            <div className="header-line"></div>
                        </div>
                        <div className="time-rank">
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody>
                                    <tr>
                                        <th>日</th>
                                        <th>月</th>
                                        <th className="toright">净值</th>
                                        <th className="line"></th>
                                        <th className="toleft">组合收益排行</th>
                                    </tr>

                                    <tr>
                                        <td id="dayvalue" className="value"></td>
                                        <td id="monthvalue" className="value"></td>
                                        <td id="jzvalue" className="value toright"></td>
                                        <td className="line"></td>
                                        <th className="toleft">战胜
                                            <span id="defeatvalue" className="value"></span>
                                            组合
                                        </th>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                    <div className="nocolormark">
                        <div id="stockgod" className="stockgod">
                            <table border="0" cellPadding="0" cellSpacing="0">
                                <tbody><tr>
                                    <td className="pictd">
                                        <div className="pic"><img id="peoplePic" src="../img/detail_person.svg"/></div>
                                    </td>
                                    <td className="middletd">
                                        <div className="person">
                                            <div className="info">
                                                <div className="name">
                                                    <div id="peopleName"></div>
                                                    <img style={divStyle} src="../img/icon_v.svg"/>
                                                </div>
                                                <div className="clear"></div>
                                                <p id="peopleintro" className="intro"></p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="timetd">
                                        <div className="time">
                                            <div>
                                                <span id="createdate"></span>
                                            创建</div>
                                            <div className="update">
                                                <span id="updatedate"></span>
                                            更新</div>
                                        </div>
                                    </td>
                                </tr></tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <div className="clear line"></div>

                <div className="storerecord groupview">
                    <div className="line"></div>
                    <div className="titleheader" id="titleStorageHeader">
                        <span>调仓记录
                            <span className="recordtime" id="storagetime">
                            {this.handleStoragetime}
                            </span>
                        </span>
                    </div>
                    <div className="clear line"></div>

                    <div id="records" className="items">
                    </div>
                </div>

                <div className="groupconfig groupview">
                    <div className="line"></div>
                    <div className="titleheader" id="titleGroupHeader">
                        <span>组合配置</span>
                    </div>
                    <div className="clear line"></div>
                    <div id="doughnutChart"></div>

                    <div id="hideChartDiv" className="hideChartDiv"></div>
                    <div id="groupLegend">
                        <br/>
                        <div className="legendarea">
                            <table className="group-legend">
                                <tbody id="legendgroup">

                                </tbody>
                            </table>
                        </div>
                        <div className="line"></div>
                    </div>
                </div>

                <div className="profittrend groupview">
                    <div className="line"></div>
                    <div className="titleheader">
                        <span>收益率走势</span>
                    </div>
                    <div className="clear line"></div>

                    <div>
                        <ul className="time-ul" id="timeul" selectItem="timeli0">
                            <li id="timeli0" className="active" onClick={this.handleOne}>近3个月</li>
                            <li id="timeli1" onClick={this.handleTwo}>近1年</li>
                            <li id="timeli2" onClick={this.handleThree}>全部</li>
                        </ul>

                        <table className="group-legend"><tbody><tr>
                            <td><div className="legendcircle"></div></td>
                            <td>组合</td>
                            <td><div className="legendcircle margin-left" data-color="blue"></div></td>
                            <td>沪深300</td>
                        </tr></tbody></table>
                    </div>
                    <div className="clear"></div>
                    <br/>
                    <div className="chartArea">
                        <div id="lineChart"></div>
                    </div>
                    <div className="tip">
                        <table border="0" cellPadding="0" cellSpacing="0">
                            <tbody>
                                <tr>
                                    <td className="tip-msg">
                                        <img src="../img/icon_tip.svg" />
                                        <span>温馨提示：组合数据与实际操作结果存在差异</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td className="tip-declare" colSpan="2">
                                        <span>本组合仅代表创建者观点，与中信建投无关，不构成投资建议</span>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div id="appdownload">
                    <div className="bg-appdownload"></div>
                    <img id="appdownload-close" src="../img/closebutton.png" alt="" onClick={this.appdownloadClose}/>
                    <dl>
                        <dt className="appdownload-logo"><img src="../img/logo.png"/></dt>
                        <dd className="appdownload-text">
                           <div className="appdownload-title">中信建投证券</div>
                           <div className="appdownload-content">全新打造的移动证券APP</div>
                        </dd>
                    </dl>
                    <button id="Immediately-use" onClick={this.goForDownload}>立即使用</button>
                </div>
            </div>
        );
    }
});
ReactDOM.render(
    <Detail />,
    document.getElementById('tgxq')
);
