import DS from 'ember-data';

export default DS.Model.extend({
    description: DS.attr('string'),
  	link: DS.attr('string'),
  	tipo: DS.attr('string'),
  	order: DS.attr('number'),
  	formality: DS.attr('number')
});
