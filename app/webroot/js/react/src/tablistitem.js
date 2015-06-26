var Tablistitem = React.createClass({
    mixins:[updateMixin],
    propTypes:{
        toggle:React.PropTypes.bool,
        active:React.PropTypes.bool,
        id:React.PropTypes.string,
        title:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            toggle:false,
            active:false,
            id:generateUUID(),
            title:'tablistitem'
        }
    },
    render:function(){
        return (
            <li role="presentation" className={"tablistitem"+(this.state.active?' active':'')}>
                <a href={'#'} aria-controls={this.state.title} role="tab" data-toggle={this.state.toggle?'tab':''} aria-expanded={this.state.active}>{this.state.title}</a>
            </li>
        );
    }
});