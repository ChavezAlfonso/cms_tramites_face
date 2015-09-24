/**
 * Created by giardino on 25/08/15.
 */
import Ember from 'ember';

export default Ember.Route.extend({
  model: function() {
    return this.store.fetchAll('secretaria');
  },
  setupController: function(controller, model) {
    this._super(controller, model);
  }
});
