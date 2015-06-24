var InputNumber = React.createClass({
    mixins: [updateMixin],
    propTypes: {
        value: React.PropTypes.number,
        change: React.PropTypes.func,
        min: React.PropTypes.number,
        max: React.PropTypes.number
    },
    incrementInterval: null,
    decrementInterval: null,
    getInitialState: function () {
        return {
            value: 0,
            change: null,
            min: null,
            max: null,
            incrementDisabled: false,
            decrementDisabled: false
        };
    },
    componentDidUpdate: function () {
        this.checkDisabledInputs();
    },
    componentDidMount: function () {
        this.checkDisabledInputs();
    },
    checkDisabledInputs: function () {
        var state = {
            incrementDisabled: this.state.value == this.state.max,
            decrementDisabled: this.state.value == this.state.min
        };

        if (this.state.value == this.state.max || this.state.value == this.state.min) {
            this.mouseUp();
        }
        this.updateState(state);
    },
    change: function (e) {
        var value = parseInt(e.target.value);
        value = !isNaN(value) ? value : this.state.min != null?this.state.min:0;
        if ((this.state.max == null || value <= this.state.max) && (this.state.min == null || value >= this.state.min)) {
            this.updateState({
                value: value
            });
        }

        if (_.isFunction(this.state.onChange)) {
            this.state.change(e, this);
        }
    },
    mouseDownIncrement: function (e) {
        e.preventDefault();
        var self = this;
        if (self.incrementInterval == null && !this.state.incrementDisabled) {
            this.incrementInterval = setInterval(function () {
                self.increment();
            }, 50);
        }
    },
    mouseDownDecrement: function (e) {
        e.preventDefault();
        var self = this;
        if (self.decrementInterval == null && !this.state.decrementDisabled) {
            this.decrementInterval = setInterval(function () {
                self.decrement();
            }, 50);
        }
    },
    mouseUp: function () {
        clearInterval(this.incrementInterval);
        clearInterval(this.decrementInterval);
        this.incrementInterval = null;
        this.decrementInterval = null;
    },
    render: function () {
        return (
            <div className="input-group">
                <span className="input-group-btn">
                    <button className="btn btn-default" disabled={this.state.decrementDisabled} onMouseDown={this.mouseDownDecrement} onMouseUp={this.mouseUp}>
                        <span className="glyphicon glyphicon-minus"></span>
                    </button>
                </span>
                <input className="form-control text-center" type="text" onChange={this.change} defaultValue={0} value={this.state.value}/>
                <span className="input-group-btn">
                    <button className="btn btn-default" disabled={this.state.incrementDisabled} onMouseDown={this.mouseDownIncrement} onMouseUp={this.mouseUp}>
                        <span className="glyphicon glyphicon-plus"></span>
                    </button>
                </span>
            </div>
        );
    },
    increment: function () {
        if (this.state.max == null || this.state.value < this.state.max) {
            this.updateState({
                value: this.state.value + 1
            });
        }
    },
    decrement: function () {
        if (this.state.max == null || this.state.value > this.state.min) {
            this.updateState({
                value: this.state.value - 1
            });
        }
    }
});