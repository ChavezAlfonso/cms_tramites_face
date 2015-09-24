import Ember from 'ember';
import config from '../../config/environment';

export default Ember.ObjectController.extend({
  needs:['categories/index'],
  //txSubEvent:false,
  txMessage:'',
  hoverEvent:false,
  isEditingSubcategory:false,
  isLoaded:false,
  parentItem:'',
  //COMBO
  comboItems:[],
  categoriesCombo: function(){
    var controller = this;
    if( this.get('isEditingSubcategory') ) {
      Ember.$.ajax({
        url: config.APP.REST_WSPREFIX + '/api/v1/categories/combo/',
        type: 'GET',
        dataType: 'json'
      }).then(function(json) {
        controller.set('comboItems',json.categories);
        controller.set('isLoaded', true);
      });
    }
  }.observes('isEditingSubcategory'),
  toogleVisibility: function(){
    var controller = this;
    controller.get('model').save().then(function() {
    }, function(error){
      controller.get('model').rollback();
    });
  }.observes('model.visible'),
  disableSubcategorySave:true,
  validateSubcategoryData:function(){
    var hasData = this.get('model').get('name')!==null &&
                  this.get('parentItem')!==null;
                  //this.get('model').get('description')!==null
    var hasValidData = hasData &&
                  this.get('model').get('name').trim()!=='';
                  //&& this.get('model').get('description').trim()!=='';
    this.set('disableSubcategorySave',!hasValidData);
  }.observes('model.name','model.description','parentItem'),
  actions: {
    hoverEnter:function(){
      this.set('hoverEvent', true);
    },
    hoverLeave:function(){
      this.set('hoverEvent', false);
    },
    editSubcategoryEvent:function(){
      var category_id = this.get('model').get('category_id');
      var controller = this;
      this.store.find('category',parseInt(category_id)).then(function(category){
        controller.set('parentItem',{'id':category.get('id'),'text':category.get('name'),'description':'Categoría'});
      });
      this.set('isEditingSubcategory', true);
      controller.set('txSubEvent',false);
      controller.set('txMessage','');
    },
    deleteSubcategoryEvent:function(){
      var controller = this;
      $.prompt("¿Eliminar SubCategoría?", {
        overlayspeed:'fast',
        promptspeed:'fast',
        title: "SubCategoría",
        buttons: { "Eliminar": true, "Cancelar": false },
        submit: function(e,answer,m,f){
          if(answer){
            controller.set('isEditingSubcategory', false);
            var record = controller.get('model');
            record.destroyRecord().then(function(){
              controller.get('parentController').set('txSubEvent', true);
              controller.get('parentController').set('txMessage','Subcategoría Eliminada');
              setTimeout(function () {
                if( controller != null ) {
                  controller.get('parentController').set('txSubEvent', false);
                  controller.get('parentController').set('txMessage', '');
                }
              },3000);
            }, function(){
              record.rollback();
              controller.get('parentController').set('txSubEvent', true);
              controller.get('parentController').set('txMessage','La Subcategoría no se puede eliminar, tiene trámites asociados');
              setTimeout(function () {
                if( controller != null ) {
                  controller.get('parentController').set('txSubEvent', false);
                  controller.get('parentController').set('txMessage', '');
                }
              },3000);
            });
          }
        }
      });
    },
    cancelSubcategoryEvent:function(){
      this.get('model').rollback();
      this.set('isEditingSubcategory', false);
    },
    saveSubcategoryEvent:function(){
      var controller = this;
      var modelItem = this.get('model');
      var oldParentId = this.get('model').get('category_id');
      var parentItem = this.get('parentItem');
      var store = this.store;

      controller.get('parentController').set('txSubEvent', true);
      controller.get('parentController').set('txMessage','Subcategoría Actualizada');

      modelItem.set('category_id', parentItem.id);
      modelItem.save().then(function(data){
        if(oldParentId !== parentItem.id) {
          store.find('category', oldParentId).then(function (parent) {
            parent.get('subcategories').removeObject(modelItem);
          });
          store.find('category', parentItem.id).then(function (parent) {
            modelItem = data;
            parent.get('subcategories').pushObject(data);
          });
          modelItem = data;
        }

        controller.get('parentController').get('model').get('subcategories').pushObject(modelItem);
        controller.set('isEditingSubcategory',false);
        setTimeout(function () {
          if( controller != null ) {
            controller.get('parentController').set('txSubEvent', false);
            controller.get('parentController').set('txMessage', '');
          }
        },3000);
      });
    }
	}
});
