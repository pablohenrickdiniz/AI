var Modal = React.createClass({
    render:function(){
        return (
            <div className="modal fade" id={this.props.id}>
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" data-dismiss="modal" aria-label="Close" onClick={this.closeAction}><span aria-hidden="true" className="aria-hidden">&times;</span></button>
                            <h4 className="modal-title">{this.props.title}</h4>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.cancelAction}>{this.props.cancelText}</button>
                            <button type="button" className="btn btn-primary">{this.props.confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    },
    show:function(){
        $(this.getDOMNode()).modal();
    },
    componentDidMount:function(){
        this.show();
    }
});