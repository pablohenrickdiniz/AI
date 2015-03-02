TabContent.prototype = new Tag();

function TabContent(){
    var self = this;
    Tag.call(self,'div');
    self.addClass('tab-content');
}

TabContent.prototype.add = function(tabpane){
    var self = this;
    if(tabpane instanceof TabPane){
        $(self.getDOM()).append(tabpane.getDOM());
    }
    return self;
};