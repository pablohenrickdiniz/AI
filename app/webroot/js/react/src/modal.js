var Modal = React.createClass({
    options: {
        size: ['lg', 'md', 'sm'],
        position:[
            'top left',
            'top center',
            'top right',
            'center left',
            'center center',
            'center right',
            'bottom left',
            'bottom center',
            'bottom right'
        ]
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    render: function () {
        return (
            <div className="modal fade" id={this.state.id} style={{zIndex:this.state.layer}}>
                <div className={"modal-dialog" + ' ' + this.state.size}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={this.state.onClose}>
                                <span aria-hidden="true" className="aria-hidden">&times;</span>
                            </button>
                            <h2 className="modal-title">{this.state.title}</h2>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer" style={!this.state.footer?{display:'none'}:{}}>
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.state.close} style={!this.state.cancel?{display:'none'}:{}}>{this.state.cancelText}</button>
                            <button type="button" className="btn btn-primary" onClick={this.state.onConfirm} style={!this.state.confirm?{display:'none'}:{}}>{this.state.confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    updateState:function(props){
        var id = this.props.id == undefined ?generateUUID():this.props.id;
        var confirm = (this.props.confirm == undefined || props.confirm == 'true');
        var cancel =  (props.cancel == undefined || props.cancel == 'true');
        var footer =  (props.footer == undefined || props.footer == 'true');
        var on_close = (typeof props.onClose == 'function') ? props.onClose : this.onClose;
        var on_confirm = (typeof props.onConfirm == 'function') ? props.onConfirm : null;
        var confirm_text = props.confirmText == undefined ? 'Ok' : props.confirmText;
        var cancel_text = props.cancelText == undefined ? 'Cancel' : props.cancelText;
        var size = props.size != undefined ? (this.options.size.indexOf(props.size) != -1 ? 'modal-' + props.size : 'modal-md') : 'modal-md';
        var title = props.title == undefined?'Modal':props.title;
        var open = (props.open != undefined && props.open);
        var layer = parseInt(this.props.layer);
        var position = this.props.position == undefined?'':this.options.position.indexOf(this.props.position) != -1?this.props.position+' absolute':'';

        layer = isNaN(layer)?1:layer;
        this.setState({
            id:id,
            title:title,
            confirm: confirm,
            cancel: cancel,
            footer: footer,
            onClose: on_close,
            onConfirm: on_confirm,
            confirmText: confirm_text,
            cancelText: cancel_text,
            size: size,
            open:open,
            layer:layer,
            position:position
        });
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    open:function(){
        if(this.state.open){
            $('#' + this.state.id).modal();
        }
    },
    componentDidUpdate:function(){
        this.open();
    },
    onClose: function () {
        $('#' + this.state.id).modal('hide');
    },
    componentDidMount: function () {
        this.open();
    }
});