import Ember from 'ember';
import config from '../config/environment';

export default Ember.Route.extend({

	beforeModel: function() {
		var isAuthenticated = null;
		if( localStorage !== null ) {
			isAuthenticated = localStorage.getItem(config.APP.LS);
			var controller = this;
		}
		if( !!isAuthenticated ) {
			console.log('enter');
			var localItem = JSON.parse(localStorage[config.APP.LS]);
			var userid = localItem.json.user_id;
			var token = localItem.json.access_token;

			var query = "user_id="+userid+"&token="+token;
			Ember.$.ajax({
				url: config.APP.REST_WSPREFIX + '/api/v1/sessions/validate_session?' + query,
				type: 'POST'
			}).then(function(apikey) {
				console.log('apikey --> ' + JSON.stringify(apikey));

				if( apikey.status === 201) {
					controller.transitionTo('/home');
					controller.controllerFor('application').set('isLogged', true);
				} else {
					delete window.localStorage[config.APP.LS];
					controller.transitionTo('/login');
					controller.controllerFor('application').set('isLogged', false);
				}
			});

		} else {
			this.transitionTo('/login');
		}
	},
	setupController: function(controller, model) {
		this._super(controller, model);
		if( localStorage.getItem(config.APP.LS) !== null ) {
			var localItem = JSON.parse(localStorage[config.APP.LS]);
			var userid = localItem.json.user_id;
			//controller.set('user', this.store.find('user', userid));
			this.store.find('user', userid).then(function(user) {
		    controller.set('user',user);
      });
		}
	}
});
