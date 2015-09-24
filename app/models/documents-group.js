import DS from 'ember-data';

var documentGroupModel = DS.Model.extend({
  title: DS.attr('string'),
  description: DS.attr('string'),
  order: DS.attr('number'),
  note: DS.attr('string'),
  formality: DS.belongsTo('tramite', {async: true}),
  documents: DS.hasMany('documents')
});

export default documentGroupModel;
