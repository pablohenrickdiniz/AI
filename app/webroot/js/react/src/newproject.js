var NewProject = React.createClass({
    mixins:[updateMixin,customFunctions],
    propTypes:{
        postUrl:React.PropTypes.string,
        message:React.PropTypes.string,
        messageType:React.PropTypes.string,
        show:React.PropTypes.bool,
        text:React.PropTypes.string
    },
    getInitialState:function(){
        return {
            postUrl:'',
            message:'',
            messageType:'success',
            showError:false,
            text:'',
            open:false
        };
    },
    render:function(){
        return (
            <Modal title="Novo Projeto" id="new-project-modal" confirmText="Criar" cancelText="cancelar" onConfirm={this.confirm} onClose={this.close} open={this.state.open}>
                <div className="form-group">
                    <input type="text" className="form-control" ref="nome" placeholder="Nome do projeto" value={this.state.text} onChange={this.change}/>
                </div>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.showError}/>
            </Modal>
        );
    },
    close:function(){
        this.setState(this.getInitialState());
    },
    change:function(e){
        this.setState({
            text: e.target.value
        });
    },
    confirm:function(){
        var self = this;
        var data = {
            'data[Project][name]':React.findDOMNode(this.refs.nome).value.trim()
        };

        AjaxQueue.ajax({
            url: self.state.postUrl,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    Global.project.id = parseInt(data.id);
                    Render.project.updateMapTree();
                    Render.resource.updateResourceModal();
                    self.close();
                }
                else {
                    console.warn('Falha ao tentar criar projeto...');
                    var msg = '';
                    var elements = [];
                    for (var index in data.errors) {
                        elements.push((<span key={index}>{'* ' + data.errors[index]}<br /></span>));
                    }
                    self.setState({
                        message: elements,
                        show: true,
                        messageType: 'warning'
                    });
                }
            }.bind(this),
            error: function (data) {
                console.log(data.responseText);
                console.warn('Erro ao tentar realizar requisição...');
            }.bind(this)
        });
    }
});