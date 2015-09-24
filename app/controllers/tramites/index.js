/*global $:false */
import Ember from 'ember';

export default Ember.ArrayController.extend({
  selectedSecretaria: null,
  selectedSubcategoria: null,
  namesearch: '',
  status: 2,
  filter: '',
  filterTitle: '',
  filteredContent: function() {
    var filter = this.get('filter');
    var rx = new RegExp(filter, 'gi');
    var tramites = this.get('model');
    var controller = this;
    if (filter.length>0) {
      return tramites.filter(function(tramite) {
        if (tramite.get('name') != undefined &&  ( controller.get('status') == 2? tramite.get('status') == 2 : tramite.get('status') != 2   ) ) {
          return tramite.get('name').match(rx) + tramite.get('cntseId').match(rx);
        }
      });
    }else{
      return tramites.filter(function(tramite){
        if ( controller.get('status') == 2? tramite.get('status') == 2 : tramite.get('status') != 2   ){
          return true
        }
      });
    }
  }.property('content','model', 'filter', 'model.@each', 'status'),
  actions: {
    goToPreview: function(params) {
      this.transitionToRoute('/tramites/show/' + params.id);
    },
    changeStatus: function(status){
      $(".navStatus").removeClass("active")
      $("#status-" + status).addClass("active")
      this.set('status', status)
      return false
    },
    goToTramite: function(params) {
      this.transitionToRoute('/tramites/edit/' + params.id);
    },
    createNewTramite: function() {
      this.transitionToRoute('/tramites/new');
    },
    displayAdvSearch: function() {
      $('.adv-search').toggleClass('invisible');
    },
    advancedSearch: function(keyword1, keyword2, keyword3) {
      var params = {};
      if (keyword1 !== undefined && keyword1 !== null && keyword1.trim()!==''){
        params['name'] = keyword1;
      }
      if (keyword2 !== undefined && keyword2 !== null){
        params['dependence'] = parseInt(keyword2.id);
      }
      if (keyword3 !== undefined && keyword3 !== null){
        params['subcat'] = keyword3.id;
      }
      var results = this.store.findQuery('tramite', params);
      this.set('model',results);
      this.set('selectedSecretaria', null);
      this.set('selectedSubcategoria', null);
      this.set('namesearch', '');
    }
  }
});
