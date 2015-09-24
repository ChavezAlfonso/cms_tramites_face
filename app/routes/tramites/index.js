import Ember from 'ember';
import config from '../../config/environment';
//import AuthenticatedRouteMixin from 'simple-auth/mixins/authenticated-route-mixin';

export default Ember.Route.extend({
	beforeModel: function() {
	},
	model: function() {
		return this.store.fetchAll('tramite');
	},
	setupController: function(controller, model) {
		this._super(controller, model);
		controller.set('secretarias', this.store.find('secretaria'));
		Ember.$.ajax({
	      url: config.APP.REST_WSPREFIX + '/api/v1/subcategories',
	      type: 'GET',
	      dataType: 'json'
	    }).then(function (json) {
	      controller.set('subcategorias', json.subcategories);
	    });
	}
});
