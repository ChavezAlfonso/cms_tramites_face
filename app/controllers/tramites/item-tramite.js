import Ember from 'ember';

export default Ember.ObjectController.extend({
	actions: {
		deleteTramite: function() {
      var controller = this;
      $.prompt("¿Eliminar Trámite?", {
        overlayspeed:'fast',
        promptspeed:'fast',
        title: "Trámite",
        buttons: { "Eliminar": true, "Cancelar": false },
        submit: function(e,answer,m,f){
          if(answer){
            var tramite = controller.get('content');
            tramite.destroyRecord();
          }
        }
      });
		}
	}
});
