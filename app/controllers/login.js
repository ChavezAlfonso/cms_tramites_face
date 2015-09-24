/*global $:false */
import Ember from 'ember';
import config from '../config/environment';
//import LoginControllerMixin from 'simple-auth/mixins/login-controller-mixin';

export default Ember.Controller.extend({
	//authenticator: 'simple-auth-authenticator:oauth2-password-grant'
	message: '',
	needs: ['application'],
	username: '',
	contrasena: '',
	actions: {
		authenticate: function() {
			var identification = this.get('identification');
			var password = this.get('password');
			var controller = this;
			var query = 'grant_type=password&username='+identification+'&password='+ password;
			delete window.localStorage[config.APP.LS];
			if( identification !== undefined && password !== undefined) {
				controller.set('username', identification);
				controller.set('contrasena', password);
				Ember.$.ajax({
					url: config.APP.REST_WSPREFIX + '/api/v1/sessions/sign_in?' + query,
					type: 'POST'
				}).then(function(apikey) {
					if( !apikey.hasOwnProperty("error") ) {
						window.localStorage.setItem(config.APP.LS, JSON.stringify(apikey));
						controller.set('password', '');
						controller.get('identification', '');
						controller.transitionToRoute('/home');
						// TO GET USER
						//var localItem = JSON.parse(localStorage[config.APP.LS]);
						var userid = apikey.json.user_id;
						//controller.set('user', this.store.find('user', userid));
						controller.store.find('user', userid).then(function(user) {
					    controller.set('user',user);
              controller.get('controllers.application').set('user',user);
					  });
						controller.get('controllers.application').set('isLogged', true);
					} else {
						$('.alert').removeClass('hidden');
						controller.set('message', 'Usuario y contraseña no coinciden.');
						setTimeout(function () { $('.alert').addClass('hidden'); },3000);
					}
				});
			} else {
				$('.alert').removeClass('hidden');
				this.set('message', 'Debes de llenar ambos campos.');
				setTimeout(function () { $('.alert').addClass('hidden'); },3000);
			}
    },
		goToSolicitud: function() {
			this.transitionToRoute('solicitud');
		}
	}
});
