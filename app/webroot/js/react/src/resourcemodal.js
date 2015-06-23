var ResourceModal = React.createClass({
    mixins: [updateMixin],
    items: {
        'new': {name: 'Importar recurso', icon: "add"}
    },
    getInitialState: function () {
        return {
            loadUrl: '',
            projectId: 0,
            id: generateUUID(),
            open: false,
            fileInputId:generateUUID(),
            canvas:null
        };
    },
    close: function () {
        this.setState({
            open: false
        });
    },
    render: function () {
        return (
            <Modal title="Recursos" footer={false} id={this.state.id} onClose={this.close} open={this.state.open} layer={2}>
                <Tree id="resource-tree" loadUrl={this.state.loadUrl} formData={{'data[id]': this.state.projectId}} onItemLeftClick={this.onItemLeftClick}/>
            </Modal>
        );
    },

    onItemLeftClick: function (e, obj) {
        if (obj.state.metadata.type == 'resource-folder') {
            var x = e.pageX;
            var y = e.pageY;
            this.selectedFolder = obj;
            React.render(
                <ContextMenu x={x} y={y} items={this.items} callback={this.callback} show={true}/>,
                document.getElementById('context-menu-container')
            );
        }
    },
    callback: function (key, e, obj) {
        switch (key) {
            case 'new':
                React.render(
                    <StepModal title='Novo Recurso' layer={3} open={true} confirmText='confirmar' cancelText='cancelar' nextText='próximo' previousText='anterior'>
                        <Tabpane title='Imagem'>
                            <div className="row" style={{marginLeft:0, marginRight:0}}>
                                <div className="col-md-12" style={{overflow:'scroll',height:300,width:'100%'}}>
                                    <Canvas parent={this}></Canvas>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="arquivo">Selecione o arquivo</label>
                                    <input className="form-control" type="file" name="arquivo" required="true" onChange={this.inputFileChange}/>
                                </div>
                            </div>
                        </Tabpane>
                        <Tabpane title="Grid">
                        </Tabpane>
                        <Tabpane title="Regiões">
                        </Tabpane>
                    </StepModal>,
                    document.getElementById('resource-step-modal-container')
                );
                break;
        }

    },
    inputFileChange:function(e){
        var self = this;
        var img = new Image;
        img.src = URL.createObjectURL(e.target.files[0]);
        img.onload = function(){
            var state = {
                width:img.width,
                height:img.height
            };
            var canvas = self.state.canvas;
            var context = canvas.state.context;
            canvas.updateState(state);
            context.drawImage(img,0,0);
        };
    }
});