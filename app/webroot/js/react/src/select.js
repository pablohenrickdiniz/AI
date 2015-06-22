var Select = React.createClass({
    mixins:[updateMixin],
    getInitialState:function(){
        return {
            value:'',
            onChange:null,
            ref:null
        };
    },
    render:function(){
        var options = this.state.options.map(function(value,index){
            return <option value={index} key={index}>{value}</option>;
        });

        return (
            <select className="form-control" ref={this.state.ref} value={this.state.value} onChange={this.state.onChange}>
                {options}
            </select>
        );
    }
});