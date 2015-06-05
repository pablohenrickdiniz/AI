var MapEditor = React.createClass({
    options: {
        title: {
            'new': 'Novo Mapa',
            'edit': 'Editar Mapa'
        },
        confirmText: {
            'new': 'Criar',
            'edit': 'Salvar Alterações'
        },
        loop: [
            'Nenhum',
            'Loop Vertical',
            'Loop Horizontal',
            'Loop Vertical e Horizontal'
        ]
    },
    componentDidMount: function () {
        var self = this;
        $('#' + this.props.id).on('show.bs.modal', function (e) {
            self.setState({
                action: Global.map.action
            });
            if (self.state.action == 'new') {
                self.clear();
            }
            else if (self.state.action == 'edit') {
                self.load();
            }
        });
    },
    getInitialState: function () {
        return {
            action: 'new',
            show: false,
            message: '',
            messageType: 'success'
        };
    },
    render: function () {
        return (
            <Modal onClose={this.close} onConfirm={this.send} title={this.options.title[this.state.action]} id={this.props.id} confirmText={this.options.confirmText[this.state.action]} cancelText="cancelar">
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome" required="true" ref="nome"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="text" className="form-control" placeholder="Nome de apresentação" required="true" ref="nomeApresentacao"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Largura" required="true" min="10" max="100" ref="largura"/>
                </div>
                <div className="form-group col-md-6">
                    <input type="number" className="form-control" placeholder="Altura" required="true" min="10" max="100" ref="altura"/>
                </div>
                <div className="form-group col-md-12">
                    <Select ref="loop" options={this.options.loop} />
                </div>
                <div className="clearfix"/>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.show}/>
            </Modal>
        );
    },
    close: function () {
        $('#' + this.props.id).modal('hide');
        this.clear();
        this.setState({show: false});
    },
    clear: function () {
        this.node('nome').value = '';
        this.node('nomeApresentacao').value = '';
        this.node('largura').value = 10;
        this.node('altura').value = 10;
        this.node('loop').value = 0;
    },
    node: function (name) {
        return React.findDOMNode(this.refs[name]);
    },
    load: function () {
        var self = this;
        $.ajax({
            url: Global.map.load,
            type: 'post',
            dataType: 'json',
            data: {
                'data[id]': FolderManager.id
            },
            success: function (data) {
                if (data.success) {
                    var map = data.map;
                    self.node('nome').value = map.name;
                    self.node('nomeApresentacao').value = map.display;
                    self.node('largura').value = map.width;
                    self.node('altura').value = map.height;
                    self.node('loop').value = map.scroll;
                    self.setState({
                        show: false
                    });
                }
                else {
                    self.setState({
                        show: true,
                        message: 'Erro ao tentar carregar informações do mapa...',
                        messageType: 'danger'
                    });
                }
            }.bind(this),
            error: function () {
                self.setState({
                    show: true,
                    message: 'Erro de conexão!',
                    messageType: 'warning'
                });
            }.bind(this)
        });
    },
    send: function () {
        var self = this;
        var name = React.findDOMNode(this.refs.nome).value;
        var display_name = React.findDOMNode(this.refs.nomeApresentacao).value;
        var width = React.findDOMNode(this.refs.largura).value;
        var height = React.findDOMNode(this.refs.altura).value;
        var scroll = React.findDOMNode(this.refs.loop).value;
        var action = null;
        var data = {
            'data[Map][name]': name,
            'data[Map][display]': display_name,
            'data[Map][width]': width,
            'data[Map][height]': height,
            'data[Map][scroll]': scroll
        };

        switch(this.state.action){
            case 'new':
                action = Global.map.add;
                if (FolderManager.type == 'map') {
                    data['data[Map][parent_id]'] = FolderManager.id;
                }
                else {
                    data['data[Map][project_id]'] = FolderManager.id;
                }
                break;
            case 'edit':
                action = Global.map.edit;
                data['data[Map][id]'] = FolderManager.id;
                break;
            default:
                action = '';
        }

        $.ajax({
            url: action,
            type: 'post',
            dataType: 'json',
            data: data,
            success: function (data) {
                if (data.success) {
                    self.close();
                    var tree = $('#tree').dynatree('getTree');
                    var node = tree.getNodeByKey(FolderManager.id);
                    if (node != null) {
                        if(self.state.action == 'new'){
                            node.addChild(data.node);
                        }
                        else if(self.state.action == 'edit'){
                            node.data.title = data.map.name;
                            node.render();
                        }
                    }
                    self.setState({
                        message: '',
                        show: false
                    });
                }
                else {
                    var errors = data.errors;
                    var message = '';
                    var elements = [];
                    for (var index in errors) {
                        elements.push((<span key={index}>{'* ' + errors[index]}
                            <br />
                        </span>));
                    }
                    self.setState({
                        message: elements,
                        show: true,
                        messageType: 'warning'
                    });
                }
            }.bind(this),
            complete:function(){

            }.bind(this),
            error:function(){
                self.setState({
                    message:'Erro de conexão',
                    show:true,
                    messageType: 'danger'
                });
            }.bind(this)
        });

    }
});