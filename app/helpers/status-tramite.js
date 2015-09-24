import Ember from 'ember';

export function statusTramite(input) {
	var status = input;
		if( status === 0 ) {
			input = 'Borrador';
		} else if ( status === 1 ) {
			input = 'Borrador';
		} else if ( status === 2 ) {
			input = 'Publicado';
    } else if ( status === 3 ) {
      input = 'Publicado / Edición';
    } else if ( status === 4 ) {
      input = 'Despublicado';
    }
  return input;
}

export default Ember.Handlebars.makeBoundHelper(statusTramite);
