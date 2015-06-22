var Modal = React.createClass({
    mixins:[updateMixin],
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
    getInitialState:function(){
        return {
            id:generateUUID(),
            zIndex:1,
            size:'',
            onClose:null,
            onConfirm:null,
            title:'Modal',
            footer:true,
            cancelText:'cancel',
            confirmText:'confirm',
            open:false,
            confirm:true,
            cancel:true
        }
    },
    componentDidUpdate:function(){
        this.start();
    },
    start:function(){
        if(this.state.open){
            $('#'+this.state.id).modal();
        }
        else{
            $('#'+this.state.id).modal('hide');
        }
    },
    componentDidMount:function(){
        this.start();
    },
    hide:function(){
        this.setState({
            open:false
        });
    },
    onConfirm:function(){
        if(_.isFunction(this.state.onConfirm)){
            this.state.onConfirm.apply(this,[this]);
        }
    },
    close:function(){
        if(_.isFunction(this.state.onClose)){
            this.state.onClose(this);
        }
    },
    render: function () {
        return (
            <div className="modal fade" id={this.state.id} style={{zIndex:this.state.layer}}>
                <div className={"modal-dialog" + ' ' + this.state.size}>
                    <div className="modal-content">
                        <div className="modal-header">
                            <button type="button" className="close" aria-label="Close" onClick={this.close}>
                                <span aria-hidden="true" className="aria-hidden">&times;</span>
                            </button>
                            <h2 className="modal-title">{this.state.title}</h2>
                        </div>
                        <div className="modal-body">
                            {this.props.children}
                        </div>
                        <div className="modal-footer" style={!this.state.footer?{display:'none'}:{}}>
                            <button type="button" className="btn btn-default" data-dismiss="modal" onClick={this.close} style={!this.state.cancel?{display:'none'}:{}}>{this.state.cancelText}</button>
                            <button type="button" className="btn btn-primary" onClick={this.state.onConfirm} style={!this.state.confirm?{display:'none'}:{}}>{this.state.confirmText}</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
});