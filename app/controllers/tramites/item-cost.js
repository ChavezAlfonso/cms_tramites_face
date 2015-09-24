import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['tramites/new'],
	isEditing: false,
	actions: {
		editCost: function() {
			this.set('isEditing', true);
		},
    cancelCost: function() {
      this.get('model').rollback();
      this.set('isEditing', false);
    },
		saveCost: function() {
      var controller=this;
			this.get('model').save().then(function (){
        controller.set('isEditing', false);
      });
		},
		deleteCost: function() {
			this.get('model').destroyRecord();
			this.set('isEditing', false);
		},
		moveUp: function() {
			var costos = this.get('controllers.tramites/new').get('model').get('costs');
			if( this.get('content') !== undefined ) {
				var costo = this.get('content');
				var index = costos.indexOf(costo);
				var newIndex = parseInt(index-1);
				if( index === 0 ) { return; }
				var costoTop = costos[newIndex];
				costo.set('order', newIndex + 1);
				costos[newIndex].set('order', index+1 );
				this.get('controllers.tramites/new').set('costs', Ember.ArrayProxy.extend().create({ content: sortByKey(costos, "order") }));
				function sortByKey(array, key) {
          return array.sort(function(a, b) {
            var x = a.get(key); var y = b.get(key);
            return ((x < y) ? -1 : ((x > y) ? 1 : 0));
          });
				}
				costo.save();
				costoTop.save();
			}
		},
		moveDown: function() {
			var costos = this.get('controllers.tramites/new').get('model').get('costos');
			var costo = this.get('content');
			var costosLength = this.get('controllers.tramites/new').get('documents').get('content').length;
			var index = costos.indexOf(costo);
			var newIndex = parseInt(index + 1);
			if( index + 1 === costosLength ) { return; }
			var costoBottom = costos[newIndex];
			costo.set('order', newIndex + 1);
			costos[newIndex].set('order', index + 1 );
			this.get('controllers.tramites/new').set('costos', Ember.ArrayProxy.extend().create({ content: sortByKey(costos, "order") }));
			function sortByKey(array, key) {
        return array.sort(function(a, b) {
          var x = a.get(key); var y = b.get(key);
          return ((x < y) ? -1 : ((x > y) ? 1 : 0));
        });
			}
			costo.save();
			costoBottom.save();
		}
	}
});
