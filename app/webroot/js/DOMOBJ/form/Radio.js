Radio.prototype = new Input();

function Radio(name,val){
    var self = this;
    Input.call(self,'radio');
    self.setAttribute('name',name).val(val);
}

Radio.prototype.isChecked = function(){
    var self = this;
    return $(self.getDOM()).is(':checked');
};

Radio.prototype.check = function(){
    var self = this;
    self.prop('checked',true);
};