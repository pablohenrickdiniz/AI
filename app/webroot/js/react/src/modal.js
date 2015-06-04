var Modal = React.createClass({
    render:function(){
        var on_close = (typeof this.props.onClose == 'function')?this.props.onClose:this.onClose;
        var on_confirm = (typeof this.props.onConfirm == 'function')?this.props.onConfirm:null;
        return (
            <div className="modal fade" id={this.props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={on_close}><span aria-hidden="true" className="aria-hidden">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.close}>{this.props.cancelText}</button>
                            <button type="button" className="btn btn-primary" onClick={on_confirm}>{this.props.confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    onClose:function(){
        $('#'+this.props.id).modal('hide');
    }
});