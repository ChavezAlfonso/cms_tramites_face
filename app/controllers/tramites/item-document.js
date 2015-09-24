import Ember from 'ember';

export default Ember.ObjectController.extend({
	needs: ['tramites/new'],
	isEditing: false,
	actions: {
		editDocument: function() {
			this.set('isEditing', true);
		},
		saveDocument: function() {
      var controller=this;
			this.get('model').save().then(function(){
        controller.set('isEditing', false);
      });
		},
    cancelEditDocument: function(){
      this.get('model').rollback();
      this.set('isEditing', false);
    },
		deleteDocument: function() {
			this.get('model').destroyRecord();
      this.set('isEditing', false);
		},
		moveUp: function() {

			var documentos = this.get('controllers.tramites/new').get('model').get('documents');
			var doc = this.get('content');

			var index = documentos.indexOf(doc);
			var newIndex = parseInt(index-1);

			if( index === 0 ) { return; }

			var docTop = documentos[newIndex];
			doc.set('order', newIndex + 1);
			documentos[newIndex].set('order', index+1 );

			this.get('controllers.tramites/new').set('documents', Ember.ArrayProxy.extend().create({ content: sortByKey(documentos, "order") }));

			function sortByKey(array, key) {
			    return array.sort(function(a, b) {
			        var x = a.get(key); var y = b.get(key);
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
			}

			doc.save();
			docTop.save();
		},
		moveDown: function() {
			var documentos = this.get('controllers.tramites/new').get('model').get('documents');
			var doc = this.get('content');

			var docsLength = this.get('controllers.tramites/new').get('model').get('documents').length;
			var index = documentos.indexOf(doc);
			var newIndex = parseInt(index+1);

			if( index + 1 === docsLength ) { return; }

			var docBottom = documentos[newIndex];
			doc.set('order', newIndex + 1);
			documentos[newIndex].set('order', index + 1 );

			this.get('controllers.tramites/new').set('documents', Ember.ArrayProxy.extend().create({ content: sortByKey(documentos, "order") }));

			function sortByKey(array, key) {
			    return array.sort(function(a, b) {
			        var x = a.get(key); var y = b.get(key);
			        return ((x < y) ? -1 : ((x > y) ? 1 : 0));
			    });
			}

			doc.save();
			docBottom.save();
		}
	}
});
