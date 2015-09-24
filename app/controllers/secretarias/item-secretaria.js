/**
 * Created by giardino on 26/08/15.
 */
import Ember from 'ember';

export default Ember.ObjectController.extend({
  needs: ['secretarias/index'],
  editDependenceEvent:false,
  txInnerCatEvent:false,
  txSubEvent:false,
  txInnerMessage:'',
  disableDependenceSave:true,
  validateDependenceData: function(){
    var hasData = this.get('model').get('name')!==null
        && this.get('model').get('siglas')!==null;
    var hasValidData = hasData &&
      this.get('model').get('name').trim()!==''
      && this.get('model').get('siglas').trim()!=='';
    this.set('disableDependenceSave',!hasValidData);
  }.observes('model.name','model.siglas'),
  actions: {
    editDependenceForm: function(){
      this.set('editDependenceEvent',true);
      this.set('txInnerMessage', '');
    },
    saveDependenceItem: function(){
      var controller = this;
      this.get('model').save().then(function(){
        controller.set('editDependenceEvent',false);
        controller.set('txInnerCatEvent',true);
        controller.set('txInnerMessage','Dependencia actualizada');
      }, function(error){
        controller.get('model').rollback();
        controller.set('txInnerCatEvent',true);
        controller.set('txInnerMessage','Existe Dependencia con el mismo nombre o siglas');
      });
      setTimeout(function () {
        if(controller!==null) {
          controller.set('txInnerCatEvent', false);
          controller.set('txInnerMessage', '');
        }
      },1500);
    },
    deleteDependence: function(){
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
    cancelDependenceItem: function(){
      this.set('editDependenceEvent',false);
      this.set('disableDependenceSave', true);
      this.get('model').rollback();
    }
  }
});
