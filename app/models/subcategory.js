import DS from 'ember-data';

var subcategoryModel = DS.Model.extend({
  name: DS.attr('string'),
  description: DS.attr('string'),
  visible: DS.attr('boolean'),
  category_id: DS.attr('number')
});

export default subcategoryModel;
