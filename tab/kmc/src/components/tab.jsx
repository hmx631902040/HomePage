require("../less/tab");
var React = require('react');

var Tab = React.createClass({
    getInitialState: function() {
        return {
            index: -1,
        }
   },

    handleClick: function(i) {
        this.setState({index: i});
    },

    render: function() {
        var dataTab = ["自选", "市场", ];
        var index = this.state.index;
        console.log("当前选中: ",index);

        return (
            <div>
                {dataTab.map(function(item, i){
                    var classNameSelected = "";

                    if (index == i) {
                        classNameSelected = "active";
                    }
                    return (
                    <li className={classNameSelected} key={i} onClick={this.handleClick.bind(this, i)}>{item}</li>
                    );
                }, this)}
            </div>
        );
    }
});
module.exports = Tab;
