/**
 * Created by giardino on 25/08/15.
 */
/*global $:false */
import Ember from 'ember';

export default Ember.ArrayController.extend({
  namesearch: '',
  filter: '',
  filterTitle: '',
  newDependenceEvent:false,
  newDependenceItem:null,
  disableDependenciaSave: true,
  filteredCategory: function() {
    var filter = this.get('filter');
    var rx = new RegExp(filter, 'gi');
    var dependences = this.get('model');
    return dependences.filter(function(dependence) {
      if( dependence.get('name') !== undefined) {
        return dependence.get('name').match(rx);
      }
    });
  }.property('content','model', 'filter', 'model.@each'),
  validateNewCategoryData: function(){
    var dependenceItem = this.get('newDependenceItem');
    var hasAllProperties = dependenceItem!==null &&
      dependenceItem.hasOwnProperty('name')
      && dependenceItem.hasOwnProperty('siglas');
    var hasValidData =     hasAllProperties &&
      dependenceItem.name.trim() !== ''
      && dependenceItem.siglas.trim() !== '';
    this.set('disableDependenciaSave',!hasValidData);
  }.observes('newDependenceItem.name', 'newDependenceItem.siglas'),
  actions: {
    goToPreview: function(params) {
      this.transitionToRoute('/secretarias/show/' + params.id);
    },
    goToTramite: function(params) {
      this.transitionToRoute('/secretarias/edit/' + params.id);
    },
    createNewTramite: function() {
      this.transitionToRoute('/secretarias/new');
    },
    displayAdvSearch: function() {
      $('.adv-search').toggleClass('invisible');
    },
    enableNewDependenceForm: function(){
      this.set('newDependenceItem',{
        name:'',
        siglas:''
      });
      this.set('disableDependenciaSave',true);
      this.set('newDependenceEvent',true);
    },
    cancelNewDependenceForm: function(){
      this.set('newDependenceEvent', false)
      this.set('newDependenceItem', null)
    },
    saveNewDependenceForm: function(){
      console.log("pruebaa")
      var newDependenceItem = this.get('newDependenceItem');
      var controller = this;
      //save as category
      this.store.createRecord('secretaria', newDependenceItem).save().then(
        function(){
          controller.set('newDependenceEvent', false)
          controller.set('newDependenceItem', null)
          controller.set('txCatEvent',true);
          controller.set('txCatMessage','Nueva Dependencia creada');
          setTimeout(function () {
            controller.set('txCatEvent',false);
            controller.set('txCatMessage','');
          },5000);
          controller.set('newCategoryItem',null);
          controller.set('newCategoryEvent',false);
        },
        function(){
          controller.get('model').forEach(function(p){
              if (p.get('id') == null)
                p.deleteRecord();
            }
          )
          controller.set('txCatError',true);
          controller.set('txCatMessageError','Ya existe Dependencia con ese nombre o siglas');
          setTimeout(function () {
            controller.set('txCatError',false);
            controller.set('txCatMessageError','');
          },5000);
        }
      );
    }
  }
});

