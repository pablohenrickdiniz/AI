var Dropdownitem = React.createClass({
    getInitialState:function(){
        return {
            id:generateUUID()
        };
    },
    render:function(){
        var id = this.props.id ==  undefined?this.state.id:this.props.id;
        return (
            <li><a href='#' id={id} data-toggle="modal" data-target={'#'+this.props.target}><span className={this.props.icon}></span>&nbsp;&nbsp;{this.props.title}</a></li>
        );
    }
});