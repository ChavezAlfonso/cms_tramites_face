import Ember from 'ember';
import config from '../config/environment';

var applicationController = Ember.Controller.extend({
	needs: ['login'],
	isLogged: false,
	actions: {
		//opened: function() {
		//	$('.subnav-sidebar').toggleClass('opened');
		//	$('.main-wrapper').toggleClass('opened');
		//},
		goToHome: function() {
			this.transitionToRoute('/home');
		},
		goToTramites: function() {
			this.transitionToRoute('/tramites');
			//$('.subnav-sidebar').toggleClass('opened');
			//$('.main-wrapper').toggleClass('opened');
		},
		goToCategories: function() {
			this.transitionToRoute('/categories');
			//$('.subnav-sidebar').toggleClass('opened');
			//$('.main-wrapper').toggleClass('opened');
		},
		goToUsers: function() {
			this.transitionToRoute('/users');
			//$('.subnav-sidebar').toggleClass('opened');
			//$('.main-wrapper').toggleClass('opened');
		},
    goToSecretarias: function(){
      this.transitionToRoute('/secretarias');
    },
		logout: function() {
			var controller = this;
			var accessToken = window.localStorage[config.APP.LS];
			var localItem = JSON.parse(localStorage[config.APP.LS]);
			//var userid = localItem.json.user_id;
			var token =  localItem.json.access_token;

			var query = 'token='+token;
			Ember.$.ajax({
				url: config.APP.REST_WSPREFIX + '/api/v1/sessions/sign_out?' + query,
				type: 'POST'
			}).then(function(apikey) {
				delete window.localStorage[config.APP.LS];
        controller.set('user',null);
				controller.transitionToRoute('/login');
				controller.set('isLogged', false);
			});
		}
	}
});

export default applicationController;
