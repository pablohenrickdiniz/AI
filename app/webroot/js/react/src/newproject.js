var NewProject = React.createClass({
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
            show:false,
            text:''
        };
    },
    render:function(){
        return (
            <Modal title="Novo Projeto" id="new-project-modal" confirmText="Criar" cancelText="cancelar" onConfirm={this.confirm} onClose={this.close}>
                <div className="form-group">
                    <input type="text" className="form-control" ref="nome" placeholder="Nome do projeto"/>
                </div>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.show}/>
            </Modal>
        );
    },
    updateState:function(props){
        var state = {};

        if(_.isString(props.postUrl) && props.postUrl != this.state.postUtl){
            state.postUrl = props.postUrl;
        }

        if(_.isString(props.message) && props.message != this.state.message){
            state.message = props.message;
        }

        if(_.isBoolean(props.show) && props.show != this.state.show){
            state.show = props.show;
        }

        if(_.isString(props.text) && props.text != this.state.text){
            state.text = props.text;
        }

        if(!_.isEmpty(state)){
            this.setState(state);
        }
    },
    componentWillMount:function(){
        this.updateState(this.props);
    },
    componentWillReceiveProps:function(props){
        this.updateState(props);
    },
    node:function(name){
        return React.findDOMNode(this.refs.nome);
    },
    clear:function(){
        this.setState({
            show:false
        });
        this.node('nome').value = '';
    },
    close:function(){
        this.clear();
        $('#new-project-modal').modal('hide');
    },
    confirm:function(){
        var self = this;
        var data = {
            'data[Project][name]':React.findDOMNode(this.refs.nome).value.trim()
        };

        $.ajax({
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