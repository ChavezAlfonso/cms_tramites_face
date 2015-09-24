import DS from 'ember-data';

export default DS.Model.extend({
  name: DS.attr('string'),
  email: DS.attr('string'),
  username: DS.attr('string'),
  //encrypted_password: DS.attr('string'),
  password: DS.attr('string'),
  role: DS.attr('string')
  //active: DS.attr('boolean')
});
