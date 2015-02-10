function Tag(name){
    var self = this;
    self.name = name;
    self.element = null;
}

Tag.prototype.setClass = function(className){
    var self = this;
    $(self.getDOM()).attr('class',className);
};

Tag.prototype.addClass = function(className){
    var self = this;
    $(self.getDOM()).addClass(className);
};

Tag.prototype.getDOM = function(){
    var self = this;
    if(self.element == null){
        self.element = document.createElement(self.name);
    }
    return self.element;
};

Tag.prototype.prop = function(){
    var self = this;
    if(arguments.length == 1){
        return $(self.getDOM()).prop(arguments[0]);
    }
    else if(arguments.length == 2){
        $(self.getDOM()).prop(arguments[0],arguments[1]);
    }
    return self;
};


Tag.prototype.add = function(element){
    var self = this;
    if(element instanceof Tag){
        $(self.getDOM()).append(element.getDOM());
    }
    else{
        $(self.getDOM()).append(element);
    }
};

Tag.prototype.find = function(query){
    var self = this;
    var element = self.getDOM();
    return $(element).find(query);
};

Tag.prototype.clear = function(){
    var self = this;
    $(self.getDOM()).empty();
};

Tag.prototype.setId = function(id){
    var self = this;
    $(self.getDOM()).prop('id',id);
    return self;
};

Tag.prototype.setAttribute = function(name,value){
    var self = this;
    $(self.getDOM()).attr(name,value);
    return self;
};

Tag.prototype.getAttribute = function(name){
    var self = this;
    return $(self.getDOM()).attr(name);
};

Tag.prototype.remove = function(){
    var self = this;
    if(arguments.length == 0){
        $(self.getDOM()).remove();
    }
    else{
        for(var i = 0; i < arguments.length;i++){
            if(arguments[i] instanceof Tag){
                $(self.getDOM()).remove(arguments[i].getDOM());
            }
            else{
                $(self.getDOM()).remove(arguments[i]);
            }
        }
    }
};

Tag.prototype.click = function(func){
    var self = this;
    $(self.getDOM()).click(function(){
        func.apply(self,arguments);
    });
};

Tag.prototype.hover = function(func){
    var self = this;
    $(self.getDOM()).hover(function(){
        func.apply(self,arguments);
    });
};

Tag.prototype.dbclick = function(func){
    var self = this;
    $(self.getDOM()).dbclick(function(){
        func.apply(self,arguments);
    });
};

Tag.prototype.change = function(func){
    var self = this;
    $(self.getDOM()).change(function(){
        func.apply(self,arguments);
    });
};

Tag.prototype.keyup = function(func){
    var self = this;
    $(self.getDOM()).keyup(function(){
        func.apply(self,arguments);
    });
};

Tag.prototype.hide = function(){
    $(self.getDOM()).hide();
};


