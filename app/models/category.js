import DS from 'ember-data';

var categories = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  visible: DS.attr('boolean'),
  order: DS.attr('number'),
  subcategories: DS.hasMany('subcategory')
});
export default categories;
