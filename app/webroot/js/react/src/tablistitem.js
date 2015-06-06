var Tablistitem = React.createClass({
    render:function(){
        var data_toggle = this.props.dataToggle == undefined || this.props.dataToggle?true:false;

        return (
            <li role="presentation" className={"tablistitem"+(this.props.active?' active':'')}>
                <a href={'#'+this.props.id} aria-controls="home" role="tab" data-toggle={data_toggle?'tab':''} aria-expanded={this.props.active}>{this.props.title}</a>
            </li>
        );
    }
});