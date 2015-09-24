/*global $:false */
import Ember from 'ember';

export default Ember.Component.extend({
	attributeBindings: ['onElement','asElement','htmlValue'],
	didInsertElement: function() {
		var onElement = $('.' + this.get('onElement'));
		var asElement = $(this.get('asElement'));
		if( this.get('htmlValue') !== null ) {
      asElement.html(this.get('htmlValue'));
      asElement.appendTo(onElement);
		}
	}
});
