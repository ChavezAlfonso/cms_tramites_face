import Ember from 'ember';
import DS from 'ember-data';
import config from '../config/environment';

var AppAdapter = DS.RESTAdapter.extend({
	host: config.APP.REST_WSPREFIX,
	namespace: 'api/v1',
  ajaxError: function(jqXHR) {
    var error = this._super(jqXHR);
    if (jqXHR && jqXHR.status === 422) {
      var jsonErrors = Ember.$.parseJSON(jqXHR.responseText);
      return new DS.InvalidError(jsonErrors);
    } else {
      return error;
    }
  }
});

var inflector = Ember.Inflector.inflector;
inflector.irregular('secretaria','secretarias');

export default AppAdapter;
