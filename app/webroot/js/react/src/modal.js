var Modal = React.createClass({
    render:function(){
        var close_action = (typeof this.props.closeAction == 'function')?this.props.closeAction:this.close;
        var confirm_action = (typeof this.props.confirmAction == 'function')?this.props.confirmAction:null;
        return (
            <div className="modal fade" id={this.props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={close_action}><span aria-hidden="true" className="aria-hidden">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.close}>{this.props.cancelText}</button>
                            <button type="button" className="btn btn-primary" onClick={confirm_action}>{this.props.confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    close:function(){
        $('#'+this.props.id).modal('hide');
    }
});