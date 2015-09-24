import Ember from 'ember';

var tramitesNew =  Ember.View.extend({
	didInsertElement: function() {

	},
	actions: {
		addScheduleItem: function (payload) {
			// VALIDATIONS
			console.log('this happened --> ' + JSON.stringify(payload));
			if( payload.phoneNum !== undefined && payload.initHour !== undefined && payload.endHour !== undefined) {
				//payload.initTime = '10:10';
				//payload.set('entTime', payload.endHour+':'+payload.endMins);

				this.get('controller').send('addScheduleItem', payload);				
			} else {
				alert('Por favor completa todos los campos');
			}			
		},
		addCostoItem: function() {
			var costo = this.get('controller').get('costo');
			if( costo.descripcion !== undefined && costo.precio !== undefined ) {
				console.log('exito');
				this.get('controller').send('addCostoItem');
			} else {
				alert('Por favor completa todos los campos');
			}

		}
	}
});

export default tramitesNew;