Table.prototype = new Tag();

function Table(){
    var self = this;
    Tag.call(self,'table');
    self.rows = [];
}

Table.prototype.clearTds = function(){
    var self = this;
    var rows = self.rows;
    for(var i = 0; i < rows.length;i++){
        var row = rows[i];
        var cols = row.getCols();
        for(var j = 0; j < cols.length;j++){
            if(cols[i].getType() == 'td'){
                rows[i].remove();
                rows.splice(i,1);
                i--;
                break;
            }
        }
    }
};

Table.prototype.add = function(row){
    var self = this;
    if(row instanceof Row){
        self.rows.push(row);
        $(self.getDOM()).append(row.getDOM());
    }
    return self;
};

Table.prototype.remove = function(){
    var self = this;
    if(arguments.length == 0){
        $(self.getDOM()).remove();
    }
    else if(arguments[0] instanceof Row){
        var row = arguments[0];
        var index = self.rows.indexOf(row);
        if(index != -1){
            $(row).remove();
            self.rows.splice(index,1);
        }
    }
    return self;
};
