var CreateProject = React.createClass({
    render:function(){
        return (
            <Modal title="Novo Projeto" id="new-project-modal" confirmText="Criar" cancelText="cancelar" confirmAction={this.confirm}>
                <div className="form-group">
                    <input type="text" className="form-control" ref="nome" placeholder="Nome do projeto"/>
                </div>
                <Alert message={this.state.message} type={this.state.messageType} show={this.state.show}/>
            </Modal>
        );
    }
});