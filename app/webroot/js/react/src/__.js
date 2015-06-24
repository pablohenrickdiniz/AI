var updateMixin = {
    componentWillMount: function () {
        this.updateState(this.props);
    },
    updateState: function (props) {
        var self = this;
        var state = {};
        for (var index in props) {
            if (this.state[index] == undefined || !_.isEqual(props[index], this.state[index])) {
                state[index] = props[index];
            }
        }

        if (!_.isEmpty(state)) {
            this.setState(state);
        }
    },
    componentWillReceiveProps: function (props) {
        this.updateState(props);
    }
};

var setIntervalMixin = {
    componentWillMount: function () {
        this.intervals = [];
    },
    componentWillUnmount: function () {
        this.clearIntervals();
    },
    clearInterval: function (key) {
        clearInterval(this.intervals[key]);
    },
    clearIntervals:function(){
        this.intervals.forEach(function(interval){
            clearInterval(interval);
        });
    },
    setInterval: function (key, func, time) {
        var interval = setInterval.apply(self, [func, time]);
        if (key != null) {
            this.intervals.push(interval);
        }
        else {
            if(this.intervals[key] != undefined){
                clearInterval(this.intervals[key]);
            }
            this.intervals[key] = interval;
        }
    }
};

var customFunctions = {
    node: function (name) {
        return React.findDOMNode(this.refs[name]);
    }
};


var AjaxQueue = {
    queue:[],
    loading:false,
    ajax:function(obj) {
        var self = this;
        var ajax = {};
        var type = obj.type;
        var dataType = obj.dataType;
        var success = obj.success;
        var error = obj.error;
        var complete = obj.complete;
        var data = obj.data;
        var url = obj.url;

        var next = function () {
            var first = self.queue.shift();
            if (first != undefined) {
                $.ajax(first);
            }
            else {
                self.loading = false;
            }
        };


        if (_.isString(type)) {
            ajax.type = type;
        }
        else if (type != undefined) {
            throw new TypeError('type must be a string...');
        }

        if (_.isString(dataType)) {
            ajax.dataType = dataType;
        }
        else if (dataType != undefined) {
            throw new TypeError('dataType must be a string...');
        }

        if (_.isFunction(success)) {
            ajax.success = success;
        }
        else if (success != undefined) {
            throw new TypeError('success must be a function...');
        }

        if (_.isFunction(error)) {
            ajax.error = error;
        }
        else if (error != undefined) {
            throw new TypeError('error must be a function...');
        }

        if (_.isFunction(complete)) {
            ajax.complete = function () {
                complete();
                next();
            }
        }
        else if (complete == undefined) {
            ajax.complete = function () {
                next();
            }
        }
        else {
            throw new TypeError('complete must be a function...');
        }

        if (_.isObject(data)) {
            ajax.data = data;
        }
        else if (data != undefined) {
            throw new TypeError('data must be a object...');
        }

        if (_.isString(url)) {
            ajax.url = url;
        }
        else {
            throw new TypeError('url must be a string...');
        }

        if (!self.loading) {
            self.loading = true;
            $.ajax(ajax);
        }
        else {
            self.queue.push(ajax);
        }
    }
};
