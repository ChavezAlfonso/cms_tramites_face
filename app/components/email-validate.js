import Ember from 'ember';

export default Ember.TextField.extend({
	change: function() {
		var re =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
		if ( (this.$().val()!==null && this.$().val().trim() === '') || !re.test(this.$().val())) {
	    	alert('Por favor ingresa un correo electrónico válido.');
	    	this.$().val('');
		}
	}
});
