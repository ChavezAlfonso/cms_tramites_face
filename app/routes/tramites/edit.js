/*global $:false */
import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
    return this.store.fetchById('tramite', params.tramite_id);
	},
  setupController: function(controller, model) {
    this._super(controller, model);
    //Mensajes
    controller.set('txSaved',false);
    controller.set('txMessage','');
    controller.set('selectedGroup', null);
    //Status
    var status = parseInt(model.get('status'));
    controller.set('isPublished', (status===2 || status===3)?true:false);
    //IsComplete
    var hasValidData =
      model.get('actionTypes').length > 0 &&
      model.get('documents').length > 0 &&
      model.get('costs').length > 0 &&
      model.get('presencial') != null &&
      model.get('presencial').trim().length>0 &&
      model.get('presencial')!=="<p><br></p>" &&
      model.get('description') !=null &&
      model.get('description').trim().length>0 &&
      model.get('description')!=="<p><br></p>" &&
      model.get('subcats') !=null &&
      model.get('subcats').length>2;
    //IsDisabled IfNotComplete
    this.set('isComplete', hasValidData?false:true);

    //Dropdown
    this.store.find('category').then(function(categorias){
      controller.set('categorias',categorias);
    });
    this.store.find('secretaria').then(function(secretarias){
      controller.set('secretarias',secretarias);
    });
    //Creado
    controller.set('isSaved', true);
    var subcats_str = model.get('subcats');
    if (subcats_str!=null && subcats_str.length>0){
      var tx_subcategories =  $.parseJSON(subcats_str);
      if (tx_subcategories.length>0){
        var emberArray = Ember.ArrayProxy.create({content:tx_subcategories});
        controller.set('selectedSubcategories', emberArray);
      }
    }
    //Dependencia asignada
    if(model.get('dependence')!=null) {
     this.store.find('secretaria', model.get('dependence') ).then(function(dependencia){
        controller.set('selectedSecretaria', dependencia);
      });
    }
  }
});
