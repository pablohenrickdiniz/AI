var Alert = React.createClass({
    render:function(){
        return (
            <div className={'alert alert-'+this.props.type} style={{display:this.props.show?'block':'none'}}>
                {this.props.message}
            </div>
        );
    }
});