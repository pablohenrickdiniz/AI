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
    return self;
};

Tag.prototype.removeClass = function(className){
    var self = this;
    $(self.getDOM()).removeClass(className);
    return self;
};

Tag.prototype.css = function(attr,val){
    var self = this;
    $(self.getDOM()).css(attr,val);
    return self;
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

Tag.prototype.addContainer = function(className,element){
    var self = this;
    var container = new Tag('div');
    container.addClass(className);
    container.add(element);
    self.add(container);
    return container;
};

Tag.prototype.add = function(){
    var self = this;
    for(var i = 0; i < arguments.length;i++){
        var element = arguments[i];
        if(element instanceof Tag){
            $(self.getDOM()).append(element.getDOM());
        }
        else{
            $(self.getDOM()).append(element);
        }
    }

    return self;
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
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.focus = function(func){
    var self = this;
    $(self.getDOM()).focus(function(){
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.hover = function(func){
    var self = this;
    $(self.getDOM()).hover(function(){
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.dbclick = function(func){
    var self = this;
    $(self.getDOM()).dbclick(function(){
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.change = function(func){
    var self = this;
    $(self.getDOM()).change(function(){
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.keyup = function(func){
    var self = this;
    $(self.getDOM()).keyup(function(){
        if(typeof func == 'function'){
            func.apply(self,arguments);
        }
    });
    return self;
};

Tag.prototype.hide = function(){
    var self = this;
    $(self.getDOM()).hide();
    return self;
};

Tag.prototype.show = function(){
    var self = this;
    $(self.getDOM()).show();
    return self;
};

Tag.prototype.html = function(){
    var self = this;
    if(arguments.length == 0){
        return $(self.getDOM()).html();
    }
    else{
        $(self.getDOM()).html(arguments[0]);
    }
    return self;
};

Tag.prototype.disable = function(){
    var self = this;
    $(self.getDOM()).attr('disabled',true);
    return self;
};


Tag.prototype.enable = function(){
    var self = this;
    $(self.getDOM()).attr('disabled',false);
};
