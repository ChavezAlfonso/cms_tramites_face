import Ember from 'ember';

var radioButtonView = Ember.View.extend({
  tagName: 'input',
  type: 'radio',
  attributeBindings: ['type', 'htmlChecked:checked', 'value', 'name'],
  htmlChecked: function(){
    return this.get('value') === this.get('checked');
  }.property('value', 'checked'),
  change: function(){
    this.set('checked', this.get('value'));
    //console.log('change radio option ---> ' + this.get('value'));
    if( this.get('value') !== 'Ninguno' ) {
      //this.$('#actionButtonLink').removeClass('hide');
      this.get('controller').set('isActionType', true);
      //this.get('controller').get('model').set('actionType', true);
      this.get('controller').get('model').set('actionValue', '');
    } else {
      this.get('controller').set('isActionType', false);
      //this.get('controller').get('model').set('actionType', false);
    }
  },
  _updateElementValue: function() {
    Ember.run.next(this, function() {
      this.$().prop('checked', this.get('htmlChecked'));
    });
  }.observes('htmlChecked')
});

export default radioButtonView;
