/*global $:false */
import Ember from 'ember';

export default Ember.View.extend({
	actions: {
		togglePanel: function() {
			$('.user-header').toggleClass('open');
		}
	}
});
