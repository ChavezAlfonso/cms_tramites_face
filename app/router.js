import Ember from 'ember';
import config from './config/environment';

var Router = Ember.Router.extend({
  location: config.locationType
});

Router.map(function() {
  this.route('login');
  this.route('home');
  this.route('solicitud');

  this.resource('tramites', function() {
    this.route('new');
    this.route('show', { path: '/show/:tramite_id' });
    this.route('edit', { path: '/edit/:tramite_id' });
  });

  this.resource('secretarias', function(){
    this.route('new');
    this.route('show', {path: '/show/:secretaria_id'});
    this.route('edit', {path: '/edit/:secretaria_id'});
  });

  this.route('categories', function() {
  });

  this.route('users', function() {
  });

});

export default Router;
