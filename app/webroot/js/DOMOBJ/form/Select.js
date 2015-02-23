Select.prototype = new Tag();

function Select(){
    var self = this;
    Tag.call(self,'select');
    self.options = [];
}

Select.prototype.add = function(option){
    var self = this;
    if(option instanceof Option){
        if(self.options.indexOf(option) == -1){
            self.options.push(option);
            $(self.getDOM()).append(option.getDOM());
        }
    }
    return self;
};

Select.prototype.val = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).val();
    }
    else{
        $(self.getDOM()).val(arguments[0]);
    }
    return self;
};

Select.prototype.clear = function(){
    var self = this;
    Tag.prototype.clear.apply(self);
    self.options = [];
};

Select.prototype.setOptions = function(options){
    var self =this;
    self.clear();
    for(var index in options){
        var option = new Option();
        option.val(index).text(options[index]);
        self.add(option);
    }
    return self;
};

Select.prototype.remove = function(){
    var self = this;
    if(arguments.length == 0){
        $(self.getDOM()).remove();
    }
    else if(arguments[0] instanceof Option){
        var option = arguments[0];
        var index = self.options.indexOf(option);
        if(index != -1){
            self.options.splice(index,1);
            $(option).remove();
        }
    }
    return self;
};