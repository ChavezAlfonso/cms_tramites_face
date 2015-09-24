import Ember from 'ember';

export default Ember.ObjectController.extend({
	isEditing: false,
  isEditDisabled:true,
  watchNewActionURL: function() {
    var regexURL = /(ftp?|http?|https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
    var regexEMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;
    var actionType = this.get('model');
    if(actionType===undefined || actionType===null){
      this.set('isEditDisabled', true);
      return;
    }
    var hasData = actionType.get('link') !== undefined && actionType.get('link') !== null &&
                  //actionType.get('description')!== undefined && actionType.get('description') !== null &&
                  actionType.get('tipo') !== undefined && actionType.get('tipo') !== null;
    var hasValidData =
                  hasData &&
                  //actionType.get('description').trim() !== '' &&
                  (actionType.get('tipo')!=='Correo Electrónico'?
                    regexURL.test(actionType.get('link')):
                    regexEMAIL.test(actionType.get('link'))
                  );
    this.set('isEditDisabled', !hasValidData);
  }.observes('model.link','model.tipo','model.description'),
  actions:{
    editActionType:function(){
      this.set('isEditing', true);
    },
    deleteActionType:function(){
      this.get('model').destroyRecord();
      this.set('isEditing', false);
    },
    saveActionType:function(){
      var controller=this;
      var actionType = this.get('model');
      if( actionType.get('description')=== undefined
          || actionType.get('description')===null
          || actionType.get('description').trim().length===0
      ){
        actionType.set('description',actionType.get('tipo'));
      }
      actionType.save().then(function(){
        controller.set('isEditing', false);
      });
    },
    cancelEditActionType:function(){
      this.get('model').rollback();
      this.set('isEditing', false);
    }

  }
});
