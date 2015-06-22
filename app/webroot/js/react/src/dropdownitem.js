var Dropdownitem = React.createClass({
    mixins:[updateMixin],
    getInitialState:function(){
        return {
            id:generateUUID(),
            onClick:null,
            icon:'',
            title:'DropdownItem'
        };
    },
    render:function(){
        return (
            <li><a href='#' id={this.state.id} onClick={this.state.onClick}><span className={this.state.icon}></span>&nbsp;&nbsp;{this.state.title}</a></li>
        );
    }
});