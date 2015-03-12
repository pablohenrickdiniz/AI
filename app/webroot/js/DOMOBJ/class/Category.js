function Category(name){
    var self = this;
    self.name = name;
    self.dom = null;
    self.close = null;
    self.oncloseactions = [];
}

Category.prototype.remove = function(){
    var self = this;
    self.getDOM().remove();
};

Category.prototype.getDOM = function(){
    var self = this;
    if(self.dom == null){
        self.dom = new Tag('span');
        self.dom.addClass('category');
        self.dom.add(self.name);
        self.dom.add(self.getClose());
    }
    return self.dom;
};

Category.prototype.getClose = function(){
    var self = this;
    if(self.close == null){
        self.close = new Tag('span');
        self.close.addClass('category-close');
        self.close.html('&times;');
        self.close.click(function(){
            for(var i = 0; i < self.oncloseactions.length;i++){
                self.oncloseactions[i].apply(self);
            }
        });
    }
    return self.close;
};

Category.prototype.onclose = function(func){
    var self = this;
    self.oncloseactions.push(func);
};

