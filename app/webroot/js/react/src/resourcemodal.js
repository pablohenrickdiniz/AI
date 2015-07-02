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
            maxRows: 1,
            maxCols: 1,
            rowsInput: null,
            colsInput: null
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
                    <StepModal {...props} onNext={this.onNext} onPrev={this.onPrev}>
                        <Tablistitem title="Imagem" key={0}/>
                        <Tablistitem title="Grid" key={1}/>
                        <Tabpane key={0}>
                            <div className="row" style={rowStyle}>
                                <div className="col-md-12">
                                    <Canvas loadCallback={this.canvasImage} layers={1} onWheel={this.redrawImage} onMove={this.redrawImage}></Canvas>
                                </div>
                                <div className="col-md-12">
                                    <ZoomBtn className="pull-right" onZoomIn={this.zoomIn} onZoomOut={this.zoomOut}/>
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
                                    <Canvas loadCallback={this.canvasGrid} onWheel={this.onWheel} layers={2} onMove={this.canvasGridMove}></Canvas>
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
    onNext:function(step,modal){
        console.log(step);
        if(step == 0){
            this.redrawImage();
            this.drawCanvasGrid();
        }
        return true;
    },
    onPrev:function(step,modal){
        console.log(step);
        if(step == 1){
            this.redrawImage();
        }
        return true;
    },
    canvasGridMove: function () {
        this.drawCanvasGrid();
    },
    zoomIn: function () {
        var self = this;
        self.state.canvasImage.clearLayer(0);
        var scale = self.state.canvasImage.state.scale;
        scale = scale > 1 ? scale + 0.1 : scale < 1 ? scale * 2 : scale + 0.1;
        self.state.canvasImage.setScale(scale,function(){
            self.redrawImage();
        });
    },
    zoomOut: function () {
        var self = this;
        self.state.canvasImage.clearLayer(0);
        var scale = self.state.canvasImage.state.scale;
        scale = scale < 1 ? scale / 2 : scale > 1 ? scale - 0.1 : scale / 2;
        self.state.canvasImage.setScale(scale,function(){
            self.redrawImage();
        });
    },
    onWheel: function () {
        this.drawCanvasGrid();
    },
    closeStepModal: function () {
        this.setState({
            image: null
        });
    },
    rowsChange: function (value) {
        if (this.state.rows != value) {
            this.updateState({rows: value},this.drawCanvasGrid);
        }
    },
    colsChange: function (value) {
        if (this.state.cols != value) {
            this.updateState({cols: value},this.drawCanvasGrid);
        }
    },
    componentDidUpdate: function () {
        if (this.state.image != null) {
            if (this.state.image.onload == null) {
                var self = this;
                this.state.image.onload = function () {
                    var state  = {
                        frameWidth: self.state.image.width,
                        frameHeight: self.state.image.height
                    };
                    self.state.canvasGrid.updateState(state);
                    self.state.canvasImage.updateState(state, function () {
                        console.log(self.state.canvasImage.state);
                        self.redrawImage();
                        var maxRows = self.state.image.height / 24;
                        var maxCols = self.state.image.width / 24;
                        self.state.rowsInput.updateState({max: maxRows});
                        self.state.colsInput.updateState({max: maxCols});
                    });
                };
            }
        }
    },
    redrawImage: function () {
        var self = this;
        if (self.state.image != null) {
            self.state.canvasImage.clearLayer(0);
            self.state.canvasGrid.clearLayer(0);
            self.state.canvasImage.getContext(0, function (contextA,canvas) {
               if(contextA != null){
                   contextA.drawImage(self.state.image, -canvas.state.left, canvas.state.top);
               }
            });
            self.state.canvasGrid.getContext(0, function (contextB,canvas) {
                if(contextB != null){
                    contextB.drawImage(self.state.image, -canvas.state.left, canvas.state.top);
                }
            });
        }
    },
    drawCanvasGrid: function () {
        var self = this;
        if (self.state.canvasGrid != null) {
            var visible = self.state.canvasGrid.getVisibleArea();
            if (self.state.image != null) {
                self.state.canvasGrid.getContext(1,function(contextA,canvas){
                    if (contextA != null) {
                        if (canvas.state.frameWidth != 0 && canvas.state.frameHeight != 0) {
                            var width = canvas.state.frameWidth / self.state.cols;
                            var height = canvas.state.frameHeight / self.state.rows;
                            this.clearLayer(1);

                            if (width == height) {
                                contextA.strokeStyle = 'blue';
                            }
                            else {
                                contextA.strokeStyle = 'red';
                            }

                            for(var y = 0;y < canvas.state.frameHeight;y+=height){
                                for(var x = 0; x < canvas.state.frameWidth;x+=width){
                                    contextA.strokeRect(x,y,width,height);
                                }
                            }
                        }

                    }
                });
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
    rowsInput: function (rowsInput) {
        var state = {};
        state.rowsInput = rowsInput;
        this.updateState(state);
    },
    colsInput: function (colsInput) {
        var state = {};
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