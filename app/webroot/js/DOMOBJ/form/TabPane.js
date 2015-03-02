
TabPane.prototype = new Tag();

function TabPane(id){
    var self = this;
    Tag.call(self,'div');
    self.addClass('tab-pane').prop('id',id).setAttribute('role','tabpanel');
}

