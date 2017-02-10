var React = require('react');
var ReactDOM = require('react-dom');
var Tab = require('../../kmc/src/components/tab.jsx');
var API = require('./network/net.jsx');

var Home = React.createClass({
    render:function() {
        return (
            <Tab pagetab={["自选", "市场"]}/>
        );
    }
});

ReactDOM.render(
    <Home />,
    document.getElementById('label')
);
