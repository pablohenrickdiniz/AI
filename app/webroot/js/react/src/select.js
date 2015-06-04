var Select = React.createClass({
    render:function(){
        var options = this.props.options.map(function(value,index){
            return <option value={index} key={index}>{value}</option>;
        });

        return (
            <select className="form-control" ref={this.props.ref}>
                {options}
            </select>
        );
    }
});