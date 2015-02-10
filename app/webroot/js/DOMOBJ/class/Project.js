
function Project(id,name){
    var self = this;
    self.id = id;
    self.name = name;
    self.checked = false;
    self.row = null;
    self.radio = null;
    self.parent = null;
}

Project.prototype.setParent = function(parent){
    var self =this;
    self.parent = parent;
};

Project.prototype.getRadio = function(){
    var self = this;
    if(self.radio == null){
        self.radio = new Radio();
        self.radio.type('radio').setAttribute('name','project').val(self.id);
    }
    return self.radio;
};

Project.prototype.toDOM = function(){
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
            radio.prop('checked',true);
            self.checked = true;
            self.parent.projects.forEach(function(project){
                if(project != self){
                    project.checked = false;
                }
            });
        });

        self.radio.change(function(){
            var tmp = this;
            self.checked = $(tmp.getDOM()).is(':checked');
        });
    }
    return self.row;
};