var ResourceModal = React.createClass({
    mixins: [updateMixin],
    items: {
        'new': {name: 'Importar recurso', icon: "add"}
    },
    allowedExtensions: {
        img: ['jpg', 'png', 'jpeg']
    },
    getInitialState: function () {
        return {
            loadUrl: '',
            projectId: 0,
            id: generateUUID(),
            open: false,
            fileInputId: generateUUID(),
            canvasImage: null,
            canvasGrid: null,
            stepModal: null,
            image: null,
            rows: 1,
            cols: 1,
            maxRows:1,
            maxCols:1,
            rowsInput:null,
            colsInput:null
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
    componentDidMount:function(){
        console.log(this.refs);
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
                var props = {
                    title: 'Novo Recurso',
                    layer: 3,
                    open: true,
                    confirmText: 'confirmar',
                    cancelText: 'cancelar',
                    nextText: 'próximo',
                    previousText: 'anterior',
                    loadCallback: this.stepModal,
                    onClose: this.closeStepModal
                };

                var rowStyle = {
                    marginLeft: 0,
                    marginRight: 0,
                    paddingTop: 10
                };

                React.render(
                    <StepModal {...props}>
                        <Tablistitem title="Imagem" key={0}/>
                        <Tablistitem title="Grid" key={1}/>
                        <Tabpane key={0}>
                            <div className="row" style={rowStyle}>
                                <div className="col-md-12">
                                    <Canvas loadCallback={this.canvasImage} layers={2}></Canvas>
                                </div>
                                <div className="col-md-12">
                                    <label htmlFor="arquivo">Selecione o arquivo</label>
                                    <input className="form-control" type="file" name="arquivo" required="true" onChange={this.inputFileChange}/>
                                </div>
                            </div>
                        </Tabpane>
                        <Tabpane key={1}>
                            <div className="row form-group" style={rowStyle}>
                                <div className="col-md-12">
                                    <Canvas loadCallback={this.canvasGrid} onWheel={this.onWheel}layers={2}></Canvas>
                                </div>
                            </div>
                            <div className="row form-group" style={rowStyle}>
                                <div className="col-md-6">
                                    <label>Linhas</label>
                                    <InputNumber min={1} value={1} onChange={this.rowsChange} loadCallback={this.rowsInput}/>
                                </div>
                                <div className="col-md-6">
                                    <label>Colunas</label>
                                    <InputNumber min={1} value={1} layers={2} onChange={this.colsChange} loadCallback={this.colsInput}/>
                                </div>
                            </div>
                        </Tabpane>
                    </StepModal>,
                    document.getElementById('resource-step-modal-container')
                );
                break;
        }

    },
    onWheel:function(){
        this.drawCanvasGrid();
    },
    closeStepModal: function () {
        this.setState({
            image: null
        });
    },
    rowsChange: function (value) {
        console.log('rows change...');
        if (this.state.rows != value) {
            this.updateState({rows: value});
        }
    },
    colsChange: function (value) {
        if (this.state.cols != value) {
            this.updateState({cols: value});
        }
    },
    componentDidUpdate: function () {
        if (this.state.image != null) {
            if (this.state.image.onload == null) {
                var self = this;
                this.state.image.onload = function () {
                    var state = {
                        width: self.state.image.width,
                        height: self.state.image.height
                    };
                    self.state.canvasImage.updateState(state);
                    self.state.canvasGrid.updateState(state);

                    var contextA = self.state.canvasImage.getContext(0);
                    var contextB = self.state.canvasGrid.getContext(0);

                    contextA.drawImage(self.state.image, 0, 0);
                    contextB.drawImage(self.state.image, 0, 0);
                    var maxRows = self.state.image.height / 24;
                    var maxCols = self.state.image.width / 24;

                    self.state.rowsInput.updateState({max:maxRows});
                    self.state.colsInput.updateState({max:maxCols});
                    self.drawCanvasGrid();
                };
            }
        }
        this.drawCanvasGrid();
    },
    drawCanvasGrid: function () {
        if (this.state.canvasGrid != null) {
            var visible = this.state.canvasGrid.getVisibleArea();
            if (this.state.image != null) {
                var contextA = this.state.canvasGrid.getContext(1);
                if (contextA != null) {
                    if (this.state.image.width != 0 && this.state.image.height != 0) {
                        var width = this.state.image.width / this.state.cols;
                        var height = this.state.image.height / this.state.rows;
                        this.state.canvasGrid.clearLayer(1);

                        contextA.setLineDash([4, 4]);
                        if (width == height) {
                            contextA.strokeStyle = 'blue';
                        }
                        else {
                            contextA.strokeStyle = 'red';
                        }

                        var start_x = (visible.x == 0 ? 0 : Math.floor(visible.x / width))*width;
                        var start_y = (visible.y == 0 ? 0 : Math.floor(visible.y / height))*height;
                        var xf = visible.x+visible.w;
                        var yf = visible.y+visible.h;
                        var end_x = (xf == 0 ? 1 : Math.floor(xf / width)+1)*width;
                        var end_y = (yf == 0 ? 1 : Math.floor(yf / height)+1)*height;

                        for (var x = start_x; x <= end_x; x += width) {
                            for (var y = start_y; y <= end_y; y += height) {
                                contextA.strokeRect(x, y, width, height);
                            }
                        }
                    }

                }
            }
        }
    },
    canvasImage: function (canvasImage) {
        var state = {};
        state.canvasImage = canvasImage;
        this.updateState(state);
    },
    canvasGrid: function (canvasGrid) {
        var state = {};
        state.canvasGrid = canvasGrid;
        this.updateState(state);
    },
    stepModal: function (stepModal) {
        var state = {};
        state.stepModal = stepModal;
        this.updateState(state);
    },
    rowsInput:function(rowsInput){
        var state ={};
        state.rowsInput = rowsInput;
        this.updateState(state);
    },
    colsInput:function(colsInput){
        var state ={};
        state.colsInput = colsInput;
        this.updateState(state);
    },
    inputFileChange: function (e) {
        e.preventDefault();

        var self = this;
        var src = e.target.files[0].name;
        var index = _.lastIndexOf(src, '.');
        var valid = false;

        if (index != -1) {
            var ext = src.substring(index + 1, src.length);
            if (_.indexOf(this.allowedExtensions.img, ext) != -1) {
                valid = true;
            }
        }

        if (valid) {
            var img = new Image;
            img.src = URL.createObjectURL(e.target.files[0]);
            this.updateState({
                image: img
            });

        }
        else {
            this.updateState({
                image: null
            });
        }

        this.state.stepModal.setDisabled(!valid);
    }
});