import Ember from 'ember';

export default Ember.Controller.extend({

	actions: {
		goToTramites: function() {
			this.transitionToRoute('/tramites/new');
		},
		goToCategories: function() {
			this.transitionToRoute('/categories?nca=true');
		},
		goToUsers: function() {
			this.transitionToRoute('/users?newUserEnabled=true');
		}
	}
});
