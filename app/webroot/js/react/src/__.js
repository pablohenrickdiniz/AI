var updateMixin = {
    componentWillMount: function() {
        this.updateState(this.props);
    },
    updateState:function(props){
        var self = this;
        var state = {};
        for(var index in props){
            if(!_.isEqual(props[index],this.state[index])){
                state[index] = props[index];
            }
        }


        if (!_.isEmpty(state)) {
            this.setState(state);
        }
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    }
};



var customFunctions = {
    node: function (name) {
        return React.findDOMNode(this.refs[name]);
    }
};
