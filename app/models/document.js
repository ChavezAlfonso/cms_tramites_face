import DS from 'ember-data';

var documentModel = DS.Model.extend({
  description: DS.attr('string'),
  linkformat: DS.attr('string'),
  original: DS.attr('boolean'),
  copies: DS.attr('number'),
  order: DS.attr('number'),
  formality: DS.belongsTo('tramite', {async: true}),
  groupId: DS.belongsTo('documentsGroup', {async: true}),

  isFormat:function(){
    return (this.get('linkformat')!==undefined &&
            this.get('linkformat')!==null &&
            this.get('linkformat').trim().length>0
           )? true : false;
  }.property('linkformat'),
  formattedQuantity: function(){
    var original  = this.get('original');
    var copies    = this.get('copies');
    var strFormat = original?'Original':'';
    strFormat += copies===1?
                 ((original?' y ':'') + 'Copia'):
                 copies>1?
                 ((original?' y ':'') + copies +' Copias') : '';
    return strFormat;
  }.property('original','copies')
});

export default documentModel;
