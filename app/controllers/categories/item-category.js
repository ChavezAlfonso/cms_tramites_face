import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['categories/index'],
  editCategoryEvent:false,
  txInnerCatEvent:false,
  txSubEvent:false,
  txInnerMessage:'',
  disableCategorySave:true,
  validateCategoryData: function(){
    var hasData = this.get('model').get('name')!==null;
                  //&& this.get('model').get('description')!==null;
    var hasValidData = hasData &&
                       this.get('model').get('name').trim()!=='';
                       //&& this.get('model').get('description').trim()!=='';
    this.set('disableCategorySave',!hasValidData);
  }.observes('model.name','model.description', 'model.order'),
	actions: {
    editCategoryForm: function(){
      this.set('editCategoryEvent',true);
      this.set('txInnerCatEvent', false);
      this.set('txInnerMessage', '');
    },
    saveCategoryItem: function(){
      var controller = this;
      var order = this.get('model').get('order')
      controller.set('editCategoryEvent',false);
      if (order == null || order <= 0 || order == undefined) {
        order = 999
        this.get('model').set('order', order);
      }
      this.get('model').save().then(function(){
        controller.set('txInnerCatEvent',true);
        controller.set('txInnerMessage','Categoría actualizada');
      }, function(error){
        controller.get('model').set('visible',false);
        controller.set('txInnerCatEvent',true);
        controller.set('txInnerMessage','Categoría actualizada, no tiene trámites asociados para ser visible');
      });
      setTimeout(function () {
        if(controller!==null) {
          controller.set('txInnerCatEvent', false);
          controller.set('txInnerMessage', '');
        }
      },3000);
    },
    deleteCategoryItem: function(){
      var parentController = this.get('parentController');
      var controller = this;
      $.prompt("¿Eliminar Categoría?", {
        overlayspeed:'fast',
        promptspeed:'fast',
        title: "Categoría",
        buttons: { "Eliminar": true, "Cancelar": false },
        submit: function(e,answer,m,f){
          if(answer){
            var record = controller.get('model');
            record.destroyRecord().then(function() {
              parentController.set('txCatEvent', true);
              parentController.set('txCatMessage', 'Categoría Eliminada');
              setTimeout(function () {
                if (parentController !== null) {
                  parentController.set('txCatEvent', false);
                  parentController.set('txCatMessage', '');
                }
              }, 3000);
            },function(){
              record.rollback();
              parentController.sortBy('name');
              parentController.set('txCatEvent', true);
              parentController.set('txCatMessage', 'La Categoría no puede eliminarse, tiene trámites asociados');
              setTimeout(function () {
                if (parentController !== null) {
                  parentController.set('txCatEvent', false);
                  parentController.set('txCatMessage', '');
                }
              }, 3000);
            });
          }
        }
      });
    },
    cancelCategoryItem: function(){
      this.set('editCategoryEvent',false);
      this.get('model').rollback();
    }
	}
});
