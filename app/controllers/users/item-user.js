import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['users/index'],
  isEditingUser:false,
  isChecked: false,
  isEdited: false,
  selectedUserRol:null,
  watchRole: function() {
    var selection = this.get('selectedUserRol');
    if (selection) {
      this.get('model').set('role', selection.text);
    }
  }.observes('selectedUserRol'),
  watchValidation: function() {
    var re =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    var enableSave = (this.get('name')!==null && this.get('name').trim() === '')   ||
                     (this.get('email')!==null && this.get('email').trim() === '') ||
                     !re.test(this.get('email').trim()) ||
                     this.get('selectedUserRol')==null;
    this.set('isEdited', enableSave);
  }.observes('name','email','selectedUserRol'),
	actions: {
    editUserAction:function(){
      this.set('selectedUserRol',{text:this.get('model').get('role'), description:''});
      this.set('isEditingUser', true);
    },
    deleteUserAction:function(){
      var controller = this;
      $.prompt("¿Eliminar Usuario?", {
        overlayspeed:'fast',
        promptspeed:'fast',
        title: "Usuario",
        buttons: { "Eliminar": true, "Cancelar": false },
        submit: function(e,answer,m,f){
          if(answer){
            controller.set('isEditingUser', false);
            var record = controller.get('model');
            record.destroyRecord();
          }
        }
      });
    },
    cancelUserAction:function(){
      this.get('model').rollback();
      this.set('isEditingUser', false);
    },
    saveUserAction:function(){
      var controller = this;
      var parentController = this.get('parentController');
      controller.get('model').save().then(function(){
        controller.set('isEditingUser',false);
        parentController.set('userEvent',true);
        parentController.set('userMessage','Modificación Exitosa');
        setTimeout(function () {
          parentController.set('userEvent',false);
          parentController.set('userMessage','');
        },3000);
      });
    }
	}
});
