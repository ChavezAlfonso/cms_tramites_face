import Ember from 'ember';
import config from '../../config/environment';

var categoriesIndexController = Ember.ArrayController.extend({
  queryParams: ['nca'],
  disableCategorySave:true,
  txCatEvent:false,
  txCatMessage:'',
  txCatError:false,
  txCatMessageError:'',
  //FILTER
  filter:'',
  filteredCategory: function() {
    var filter = this.get('filter');
    var rx = new RegExp(filter, 'gi');
    var categories = this.get('model');
    return categories.filter(function(category) {
      if( category.get('name') !== undefined) {
        return category.get('name').match(rx);
      }
    });
  }.property('content','model', 'filter', 'model.@each'),
  //NEW CATEGORY
  newCategoryEvent:false,
  newCategoryItem:null,
  isLoaded: false,
  //COMBO
  comboItems:[],
  categoriesCombo: function(){
    if( this.get('newCategoryEvent') ) {
      var controller = this;
      Ember.$.ajax({
        url: config.APP.REST_WSPREFIX + '/api/v1/categories/combo/',
        type: 'GET',
        dataType: 'json'
      }).then(function(json) {
        controller.set('comboItems',json.categories);
        controller.set('isLoaded', true);
      });
    }
  }.observes('newCategoryEvent'),
  newCategoryAccess: function(){
    this.set('newCategoryItem',{
      name:'',
      description:'',
      parentCategory:null,
      order: 0
    });
    this.set('newCategoryEvent',true);
    this.set('disableCategorySave',true);
  }.observes('nca'),
  validateNewCategoryData: function(){
    var categoryItem = this.get('newCategoryItem');
    var hasAllProperties = categoryItem!==null &&
                           categoryItem.hasOwnProperty('name');
                           // && categoryItem.hasOwnProperty('description');
    var hasValidData =     hasAllProperties &&
                           categoryItem.name.trim() !== '';
                           // && categoryItem.description.trim() !== '';
    this.set('disableCategorySave',!hasValidData);
  }.observes('newCategoryItem.name', 'newCategoryItem.description'),
  //ACTIONS
  actions:{
    reloadModel: function(){
      console.log('reloading');
      this.get('model').reload();
    },
    changeOrder: function(incremento, category){
      var orden = category.get('order')
      if (incremento){
        orden++;
      } else {
        if (orden != null && orden > 0 )
          orden--;
      }
      category.set('order', orden)
      return
    },
    changeOrderNew: function(incremento){
      var orden = this.get('newCategoryItem.order')
      if (incremento){
        orden++;
      } else {
        if (orden != null && orden > 0 )
          orden--;
      }
      this.set('newCategoryItem.order', orden);
      return
    },
    enableNewCategoryForm: function(){
      this.set('newCategoryItem',{
        name:'',
        description:'',
        visible: false,
        parentCategory:null,
        order: 0
      });
      this.set('disableCategorySave',true);
      this.set('newCategoryEvent',true);
    },
    cancelNewCategoryForm: function(){
      this.set('newCategoryItem',null);
      this.set('newCategoryEvent',false);
      this.set('disableCategorySave',true);
    },
    saveNewCategoryForm: function(){
      var newCategoryItem = this.get('newCategoryItem');
      console.log(newCategoryItem.visible)
      var controller = this;
      //save as category
      if (newCategoryItem.parentCategory==null) {
        if (newCategoryItem.order == undefined || newCategoryItem.order == '' || newCategoryItem.order <= 0) {
          newCategoryItem = {
            name: newCategoryItem.name, description: newCategoryItem.description,
            visible: newCategoryItem.visible, order: 999
          }
        }
        this.store.createRecord('category', newCategoryItem).save().then(
          function(){
            controller.set('txCatEvent',true);
            controller.set('txCatMessage','Nueva categoría creada');
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
            controller.set('txCatMessageError','Ya existe categoría con ese nombre');
            setTimeout(function () {
              controller.set('txCatError',false);
              controller.set('txCatMessageError','');
            },5000);
          }
        );
      }else { //save as subcategory
        newCategoryItem.category_id = parseInt(newCategoryItem.parentCategory.id);
        var store = this.store;
        store.createRecord('subcategory',newCategoryItem).save().then(
          function(subcategory){
            store.find('category',newCategoryItem.category_id).then(function(parent){
              parent.get('subcategories').pushObject(subcategory);
            });
            controller.set('txCatEvent',true);
            controller.set('txCatMessage','Nueva Subcategoría creada');
            setTimeout(function () {
              controller.set('txCatEvent',false);
              controller.set('txCatMessage','');
            },5000);
            controller.set('newCategoryItem',null);
            controller.set('newCategoryEvent',false);
          },
          function(){
            controller.set('txCatError',true);
            controller.set('txCatMessageError','Ya existe subcategoría con ese nombre');
            setTimeout(function () {
              controller.set('txCatError',false);
              controller.set('txCatMessageError','');
            },5000);
          }
        );
      }
    }
  }
});

export default categoriesIndexController;
