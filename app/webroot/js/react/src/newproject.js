var NewProject = React.createClass({
    getInitialState:function(){
        return {
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
            url: Global.project.add,
            type: 'post',
            data: data,
            dataType: 'json',
            success: function (data) {
                if (data.success) {
                    Global.project.id = data.id;
                    React.render(
                        <Tree id="tree" data={{'data[id]':Global.project.id}}/>,
                        document.getElementById('map-container')
                    );

                    React.render(
                        <ResourceModal id="resources-modal" projectId={Global.project.id}/>,
                        document.getElementById('resources-modal-container')
                    );
                    self.close();
                }
                else {
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

            }.bind(this)
        });
    }
});