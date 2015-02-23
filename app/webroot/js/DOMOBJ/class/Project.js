function Project(id,name){
    var self = this;
    self.id = id;
    self.name = name;
    self.row = null;
    self.radio = null;
}

Project.prototype.isChecked = function(){
    var self = this;
    return self.getRadio().isChecked();
};

Project.prototype.getRadio = function(){
    var self = this;
    if(self.radio == null){
        self.radio = new Radio('project',self.id);
    }
    return self.radio;
};

Project.prototype.toString = function(){
    var self = this;
    return 'Project:{id:'+self.id+', name:'+self.name+'};'
};

Project.prototype.getRow = function(){
    var self = this;
    if(self.row == null){
        self.row = new Row();
        var td = new Col();
        var td2 = new Col();
        var radio = self.getRadio();
        td2.add(radio);
        td.val(self.name);
        self.row.add(td).add(td2).addClass('project-list-item');
        self.row.click(function(){
            radio.check();
        });
    }
    return self.row;
};