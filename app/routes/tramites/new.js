import Ember from 'ember';

export default Ember.Route.extend({
	model: function() {
		return this.store.createRecord('tramite');
	},
	setupController: function(controller, model) {
		this._super(controller, model);
    //Mensajes
    controller.set('txSaved',false);
    controller.set('txMessage','');
    //Creado
    controller.set('isSaved',false);
    //Dropdowns
		controller.set('categorias',  this.store.find('category'));
		controller.set('secretarias', this.store.find('secretaria'));
    controller.set('selectedGroup', null);
	}
});
