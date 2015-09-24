import Ember from 'ember';

export function subcatsName(input) {	
  if( input != null ) {  	
  	var splitInput = input.split(':')[2];
  	var value = '';
  	if( splitInput != undefined) {
  		value = splitInput.split('"')[1];
  	}
  	return value;
  }
}

export default Ember.Handlebars.makeBoundHelper(subcatsName);
