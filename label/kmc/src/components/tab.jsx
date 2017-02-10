require("../less/tab");
var React = require('react');

var Tab = React.createClass({
    getInitialState:function() {
        return {
            index: 0
        }
    },

    handleClick:function(i) {
        if(this.props.pagetabClick) {
            this.props.pagetabClick(i);
        }
        this.setState({index: i});
    },

    select:function(index) {
        this.setState({index: index});
    },

    render:function() {
        var index = this.state.index;
        if(this.props.pagetabClick && this.props.pageSelected) {
            index = this.props.pageSelected;
        }
        return (
            <div>
            {this.props.pagetab.map(function(name,i) {
                var classNameSelected = "";
                if(index == i) {
                    classNameSelected = "active";
                }
                return <li className = {classNameSelected} onClick = {this.handleClick.bind(this,i)} key={i}>{name}</li>
            },this)}
            </div>
        )
    }
});
module.exports = Tab;
