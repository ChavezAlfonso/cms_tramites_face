import DS from 'ember-data';

var tramiteModel = DS.Model.extend({
  name:          DS.attr('string'),
  dependence:    DS.attr('number'),
  description:   DS.attr('string'),
  cntseId:       DS.attr('string'),
  presencial:    DS.attr('string'),
  costNote:      DS.attr('string'),
  documentNote:  DS.attr('string'),
  status:        DS.attr('number'),
  created_at:    DS.attr('date'),
  subcats:       DS.attr('string'),
  actionTypes:   DS.hasMany('actionType',{embedded:'always'}),
  documents:     DS.hasMany('document',{embedded:'always', async: false}),
  documentsGroup:    DS.hasMany('documentsGroup',{embedded:'always', async: false}),
  costs:         DS.hasMany('cost',{embedded:'always'}),

  formattedCostNote:function(){
    return this.get('costNote')!==null?this.get('costNote'):'';
  }.property('costNote'),
  formattedDocumentNote:function(){
    return this.get('documentNote')!==null?this.get('documentNote'):'';
  }.property('documentNote'),
  formattedOpcionesTramite:function(){
    return this.get('presencial')!==null?this.get('presencial'):'';
  }.property('presencial'),
  isPublic:function(){
    return this.get('status')!==null && this.get('status')===2?true:false;
  }.property('status')

});

export default tramiteModel;
