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
            canvasImage:null,
            canvasGrid:null,
            image:null
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
                                    <Canvas loadCallback={this.canvasImage}></Canvas>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="arquivo">Selecione o arquivo</label>
                                    <input className="form-control" type="file" name="arquivo" required="true" onChange={this.inputFileChange}/>
                                </div>
                            </div>
                        </Tabpane>
                        <Tabpane title="Grid">
                            <div className="row form-group">
                                <div className="col-md-12" style={{overflow:'scroll',height:300,width:'100%'}}>
                                    <Canvas loadCallback={this.canvasGrid}></Canvas>
                                </div>
                            </div>
                            <div className="row form-group">
                                <div className="col-md-6">
                                    <label>Linhas</label>
                                    <InputNumber min={1} max={100} value={1}/>
                                </div>
                                <div className="col-md-6">
                                    <label>Colunas</label>
                                    <InputNumber min={1} max={100} value={1}/>
                                </div>
                            </div>
                        </Tabpane>
                        <Tabpane title="Regiões">
                        </Tabpane>
                    </StepModal>,
                    document.getElementById('resource-step-modal-container')
                );
                break;
        }

    },
    componentDidUpdate:function(){
        if(this.state.image != null){
            if(this.state.image.onload == null){
                var self = this;
                this.state.image.onload = function(){
                    var contextA = self.state.canvasImage.state.context;
                    var contextB = self.state.canvasGrid.state.context;

                    var state = {
                        width:self.state.image.width,
                        height:self.state.image.height
                    };

                    self.state.canvasImage.updateState(state);
                    self.state.canvasGrid.updateState(state);

                    contextA.drawImage(self.state.image,0,0);
                    contextB.drawImage(self.state.image, 0, 0);
                };
            }
        }
    },
    canvasImage:function(canvasImage){
        var state = {};
        state.canvasImage = canvasImage;
        this.updateState(state);
    },
    canvasGrid:function(canvasGrid){
        var state = {};
        state.canvasGrid = canvasGrid;
        this.updateState(state);
    },
    inputFileChange:function(e){
        var self = this;
        var img = new Image;
        img.src = URL.createObjectURL(e.target.files[0]);
        this.setState({
            image:img
        });
    }
});