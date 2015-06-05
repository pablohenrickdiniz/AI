var Modal = React.createClass({
    options: {
        size: ['lg', 'md', 'sm']
    },
    componentWillMount: function () {
        var id = this.props.id != undefined ? this.props.id : generateUUID();
        var confirm = this.props.confirm == undefined || this.props.confirm == 'true' ? true : false;
        var cancel =  this.props.cancel == undefined || this.props.cancel == 'true'? true : false;
        var footer = this.props.footer == undefined || this.props.footer == 'true'? true:false;

        this.setState({
            id: id,
            confirm: confirm,
            cancel: cancel,
            footer:footer
        });
    },
    render: function () {
        var on_close = (typeof this.props.onClose == 'function') ? this.props.onClose : this.onClose;
        var on_confirm = (typeof this.props.onConfirm == 'function') ? this.props.onConfirm : null;
        var confirm_text = this.props.confirmText == undefined ? 'Ok' : this.props.confirmText;
        var cancel_text = this.props.cancelText == undefined ? 'Cancel' : this.props.cancelText;
        var size = this.props.size != undefined ? (this.options.size.indexOf(this.props.size) != -1 ? 'modal-' + this.props.size : 'modal-md') : 'modal-md';

        return (
            <div className="modal fade" id={this.state.id}>
                <div className={"modal-dialog" + ' ' + size}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={on_close}>
                                <span aria-hidden="true" className="aria-hidden">&times;</span>
                            </button>
                            <h2 className="modal-title">{this.props.title}</h2>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer" style={!this.state.footer?{display:'none'}:{}}>
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.close} style={!this.state.cancel?{display:'none'}:{}}>{cancel_text}</button>
                            <button type="button" className="btn btn-primary" onClick={on_confirm} style={!this.state.confirm?{display:'none'}:{}}>{confirm_text}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    onClose: function () {
        $('#' + this.state.id).modal('hide');
    },
    componentDidMount: function () {
        if (this.props.open) {
            $('#' + this.state.id).modal();
        }
    }
});