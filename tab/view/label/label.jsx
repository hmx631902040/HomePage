var React = require('react');
var ReactDOM = require('react-dom');
var Tab = require('../../kmc/src/components/tab.jsx');

var Home = React.createClass({
    render:function() {
        return (
            <Tab />
        );
    }
});

ReactDOM.render(
    <Home />,
    document.getElementById('label')
);
