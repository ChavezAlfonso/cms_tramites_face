import DS from 'ember-data';

var costModel = DS.Model.extend({
  description: DS.attr('string'),
  amount: DS.attr('string'),
  divisa: DS.attr('string'),
  cfree: DS.attr('boolean'),
  order: DS.attr('number'),
  formality: DS.belongsTo('tramite'),

  amountFormatted: function(){
    if (this.get('amount')!==null) {
      return '$' + this.get('amount').replace(/\B(?=(\d{3})+\b)/g, ",") +
             ' ' + (this.get('divisa')!==null?this.get('divisa'):'') ;
    }
  }.property('amount')


});

export default costModel;
