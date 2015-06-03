var Alert = React.createClass({
    render:function(){
        return (
            <div className={'alert alert-'+this.props.type}>
                {this.props.message}
            </div>
        );
    }
});