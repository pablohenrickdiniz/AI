var Step = React.createClass({
    render:function(){
        return (
            <Tabpane title={this.props.title} id={this.props.id}  data={this.props.nextStep}/>
        );
    }
});