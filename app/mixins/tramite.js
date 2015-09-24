/*global $:false */
import Ember from 'ember';
import config from '../config/environment';

export default Ember.Mixin.create({
  needs: ['tramites/index'],
  txSaved:false,
  txMessage:'',
  addSubcategoryEvent:false,
  isActionTypeLinkDisabled:true,
  isSaved: false, // START WITH FALSE
  isActionType: false,
  isActive: true,
  isNew: false,
  isComplete: true,
  isPublished:false,
  copiesRange:[0,1,2,3,4,5],
  types: ['Trámite en línea', 'Seguimiento de mi trámite', 'Haz tu cita','Pago en línea','Más Información','Correo Electrónico'],
  divisas: ['mxn','usd'],
  selectedSecretaria: null,
  selectedCategory: null,
  selectedSubcategory: null,
  selectedOrder: null,
  // OBJECTS
  newActionType: Ember.Object.extend().create(),
  newDocument:null,
  newDocumentGroup:null,
  newCost: null,
  eliminaGrupoEvent: false,
  estatusEliminaGrupo: '',
  guardaSubcategoria: false,
  mensajeSubcategoria: '',
  watchStart: function() {
    // DOBLE VALIDACIÓN PARA CREAR TRÁMITE
    var dependencia = this.get('selectedSecretaria');
    var name = this.get('model.name');
    if( dependencia !== null && name !== undefined && name !== '') {
      this.set('isActive', false);
    } else {
      this.set('isActive', true);
    }
  }.observes('model.dependence', 'model.name'),
  watchFormComplete: function() {
    var tramite = this.get('model');
    var hasValidData = tramite.get('actionTypes').length > 0 &&
                       tramite.get('documentsGroup').length > 0 &&
                       tramite.get('costs').length > 0 &&
                       tramite.get('presencial') != null &&
                       tramite.get('presencial').trim().length>0 &&
                       tramite.get('presencial')!=="<p><br></p>" &&
                       tramite.get('description') !=null &&
                       tramite.get('description').trim().length>0 &&
                       tramite.get('description')!=="<p><br></p>" &&
                       tramite.get('subcats') !=null &&
                       tramite.get('subcats').length>2;
    this.set('isComplete', (hasValidData?false:true));
  }.observes('model.subcats','model.description','model.presencial','model.actionTypes.length','model.documents.length','model.costs.length'),
  watchDependance: function() {
    var selection = this.get('selectedSecretaria');
    if( selection !== null ) {
      this.get('model').set('dependence', selection.get('id'));
    }
  }.observes('selectedSecretaria'),
  watchSelectedCategory: function() {
    var controller = this;
    var category = this.get('selectedCategory');
    if(category != null && category.id != null) {
      $('.subcategory-panel').removeClass('disabled');
      Ember.$.ajax({
        url: config.APP.REST_WSPREFIX + '/api/v1/subcategories/category/' + category.id,
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        controller.set('subcategorias', json.subcategories);
        controller.set('selectedSubcategory',null);
      });
    }else{
      controller.set('subcategorias', []);
      controller.set('selectedSubcategory',null);
    }
  }.observes('selectedCategory'),
  watchNewActionURL: function() {
    var regexURL = /(ftp?|http?|https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
    var regexEMAIL = /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/i;
    var actionType = this.get('newActionType');
    if(actionType===undefined || actionType===null){
      this.set('isActionTypeLinkDisabled', true);
      return;
    }
    var hasData = actionType.get('link') !== undefined && actionType.get('link') !== null &&
                  //actionType.get('description')!== undefined && actionType.get('description') !== null &&
                  actionType.get('tipo') !== undefined && actionType.get('tipo') !== null;
    var hasValidData =
                 hasData &&
                 //actionType.get('description').trim() !== '' &&
                 (actionType.get('tipo')!=='Correo Electrónico'?
                   regexURL.test(actionType.get('link')):
                   (regexURL.test(actionType.get('link'))  || regexEMAIL.test(actionType.get('link') ) )
                 );
    this.set('isActionTypeLinkDisabled', !hasValidData);
  }.observes('newActionType.link','newActionType.tipo','newActionType.description'),
  watchNewDocument: function() {
    //var regexURL = /(ftp?|http?|https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/i;
    //var documentItem = this.get('newDocument');
    //if(documentItem===undefined || document===null){
    //  this.set('isDigitalFormatDisabled', true);
    //  return;
    //}
    //var hasData = documentItem.get('linkformat') !== undefined &&
    //  documentItem.get('linkformat') !== null;
    //var hasValidData = hasData && regexURL.test(documentItem.get('linkformat'));
    //this.set('isDigitalFormatDisabled', !hasValidData);
  }.observes('newDocument.linkformat'),
  addDocumentEvent:  false,
  addDocumentGroupEvent: false,
  addDocumentsBlock:  false,
  editDocumentEvent: false,
  addCostEvent: false,
  selectedGroup: null,
  selectedSubcategories: Ember.ArrayProxy.create({content:[]}),
  actions: {
    /* SUBCATEGORIES */
    enableSubcategories: function() {
      this.set('addSubcategoryEvent', true);
    },
    cancelSubcategories: function(){
      this.set('addSubcategoryEvent', false);
    },
    changeOrder: function(incremento){
      var orden = this.get('selectedOrder')
      if (incremento){
        orden++;
      } else {
        if (orden != null && orden > 0 )
          orden--;
      }
      this.set('selectedOrder', orden)
      return
    },
    saveSubcategories: function() {
      var category = this.get('selectedCategory');
      if (category == null) {
        var controller = this;
        this.set('guardaSubcategoria', true)
        this.set('mensajeSubcategoria', 'Debe seleccionar una Categoría')
        setTimeout(function () {
          controller.set('guardaSubcategoria', false);
          controller.set('mensajeSubcategoria', '');
        },1500);
        return
      }
      var subcategory = this.get('selectedSubcategory');
      if (subcategory == null) {
        var controller = this;
        this.set('guardaSubcategoria', true)
        this.set('mensajeSubcategoria', 'Debe seleccionar una Subcategoría')
        setTimeout(function () {
          controller.set('guardaSubcategoria', false);
          controller.set('mensajeSubcategoria', '');
        },1500);
        return
      }
      var selectedSubcategories = this.get('selectedSubcategories');
      var orden = this.get('selectedOrder');
      console.log(orden)
      if (orden == null || orden == 0)
        orden = 99
      selectedSubcategories.pushObject({
        id: subcategory.id,
        name: subcategory.name,
        category_id: subcategory.category_id,
        category_name: category.get('name'),
        orden: orden
      });
      var serialized = JSON.stringify(selectedSubcategories.get('content'));
      this.get('model').set('subcats', serialized);
      this.set('addSubcategoryEvent', false);
      this.set('selectedCategory', null);
      this.set('selectedSubcategory', null);
      this.set('selectedOrder', null);
    },
    deleteSubcategory: function(subcategoryItem) {
      Ember.$.ajax({
        url: config.APP.REST_WSPREFIX + '/api/v1/subcategories/hideSubcategory/' + subcategoryItem.id,
        type: 'GET',
        dataType: 'json'
      }).then(function (json) {
        console.log(json)
      });
      var selectedSubcategories = this.get('selectedSubcategories');
      selectedSubcategories.removeObject(subcategoryItem);
      var serialized = JSON.stringify(selectedSubcategories.get('content'));
      this.get('model').set('subcats', serialized);
    },
    /* LINKS */
    enableActionType: function() {
      var tramite = this.get('model');
      this.set('addActionTypeEvent', true);
      this.set('isActionTypeLinkDisabled', true);
      var position = parseInt(tramite.get('actionTypes').length + 1);
      var payload = {"formality": tramite.get('id'), "active": true, "order": position};
      this.set('newActionType', tramite.store.createRecord('actionType', payload));
      tramite.get('actionTypes').pushObject(this.get('newActionType'));
    },
    cancelActionType: function() {
      this.set('addActionTypeEvent', false);
      this.get('newActionType').rollback();
      this.get('newActionType', null);
    },
    saveActionType: function() {
      var controller = this;
      var actionType = this.get('newActionType');
      if( actionType.get('description')=== undefined
          || actionType.get('description')===null
          || actionType.get('description').trim().length===0
      ){
        actionType.set('description',actionType.get('tipo'));
      }
      actionType.save().then(function() {
        controller.set('addActionTypeEvent', false);
        controller.set('newActionType', null);
      });
    },
    /* DOCUMENTOS */
    enableDocuments: function(){
      var tramite = this.get('model');
      var position = parseInt(tramite.get('documents').length + 1);
      var groupItem = this.get('selectedGroup');
      if(groupItem!=null) {
        var payload = {"formailty": tramite.get('id'), "copies": 0, "order": position, "original": true, "groupId": groupItem};
        this.set('newDocument', tramite.store.createRecord('document', payload));
        tramite.get('documents').pushObject(this.get('newDocument'));
        this.set('addDocumentEvent', true);
      }
    },
    showDocumentsByGroup: function(documentGroup){
      this.set('selectedGroup',documentGroup);
      this.set('addDocumentGroupEvent', false);
      this.set('addDocumentsBlock', true);
    },
    showDocumentsByGroup1: function(param){
      $('.nav li').removeClass('active');
      var sel = document.getElementById(param.get('id'))
      $('#'+sel.id).addClass('active');
    },
    editSelectedGroup: function(){
      var groupItem = this.get('selectedGroup');
      if(groupItem!=null){
        var showGroupForm = this.get('addDocumentGroupEvent')
        showGroupForm = !showGroupForm;
        this.set('newDocumentGroup', groupItem);
        this.set('addDocumentGroupEvent', showGroupForm);
        this.set('addDocumentsBlock', false);
      }
    },
    deleteDocumentGroupItem: function(){
      var groupItem = this.get('selectedGroup');
      if(groupItem!=null) {
        if ( groupItem.get('documents').length > 0 ) {
          var controller = this;
          controller.set('eliminaGrupoEvent', true);
          controller.set('estatusEliminaGrupo', 'No se puede eliminar el grupo, tiene documentos asociados');
          setTimeout(function () {
            controller.set('eliminaGrupoEvent', false);
            controller.set('estatusEliminaGrupo', '');
          },2000);
        } else {
          groupItem.destroyRecord();
          this.set('addDocumentGroupEvent', false);
        }
      }
    },
    addGroupDocument: function(){
      var tramite = this.get('model');
      var position = parseInt(tramite.get('documentsGroup').length + 1);
      var payload = {"formailty": tramite.get('id'), "order":position};
      this.set('newDocumentGroup', tramite.store.createRecord('documentsGroup', payload));
      tramite.get('documentsGroup').pushObject(this.get('newDocumentGroup'));
      this.set('addDocumentGroupEvent', true);
    },
    cancelDocumentsGroup: function(){
      this.get('newDocumentGroup').rollback();
      this.set('newDocumentGroup', null);
      this.set('addDocumentGroupEvent', false);
    },
    saveDocumentGroupItem: function(){
      var controller = this;
      var title = this.get('newDocumentGroup').get('title');
      if( title !== undefined || title !== '') {
        this.get('newDocumentGroup').save().then(function() {
          controller.set('addDocumentGroupEvent', false);
          controller.set('newDocumentGroup', null);
        });
      } else {
        alert('debes llenar los campos');
      }
    },


    cancelDocuments: function(){
      this.get('newDocument').rollback();
      this.set('newDocument', null);
      this.set('addDocumentEvent', false);
    },
    saveDocumentItem: function(){
      var controller = this;
      var description = this.get('newDocument').get('description');
      if( description !== undefined || description !== '') {
        this.get('newDocument').save().then(function() {
          controller.set('addDocumentEvent', false);
          controller.set('newDocument', null);
        });
      } else {
        alert('debes llenar los campos');
      }
    },


    /* COSTO */
    enableCosts: function(){
      var tramite = this.get('model');
      this.set('addCostEvent', true);
      var position = parseInt(tramite.get('costs').length + 1);
      var payload = {"formailty": tramite.get('id'), "order": position, "cfree":true};
      this.set('newCost', tramite.store.createRecord('cost', payload));
      this.set('isNew', true);
      tramite.get('costs').pushObject(this.get('newCost'));
    },
    cancelCosts: function(){
      this.get('newCost').rollback();
      this.set('addCostEvent', false);
    },
    addCostoItem: function() {
      var controller = this;
      this.get('newCost').save().then(function() {
        controller.set('newCost', null);
        controller.set('addCostEvent', false);
      });
    },
    createTramite: function() {
      var controller = this;
      this.get('model').set('status', 1);
      this.get('model').save().then(function() {
        controller.set('isSaved', true);
      });
      controller.set('addDocumentEvent', false);
      this.set('addDocumentsBlock', false);
    },
    /* TRAMITE */
    saveTramite: function() {
      var controller = this;
      var tramite = this.get('model');
      tramite.set('status', this.get('isPublished')?3:1);
      if(tramite.get('presencial')==="<p><br></p>"){
        tramite.set('presencial', '');
      }
      if(tramite.get('description')==="<p><br></p>"){
        tramite.set('description', '');
      }
      if(tramite.get('costNote')==="<p><br></p>"){
        tramite.set('costNote', '');
      }
      if(tramite.get('documentNote')==="<p><br></p>"){
        tramite.set('documentNote', '');
      }
      var parentController = this.get('controllers.tramites/index');
      parentController.set('txEvent',true);
      parentController.set('txMessage','Trámite Actualizado');
      tramite.save().then(function() {
        controller.set('isSaved', false);
        controller.set('selectedSecretaria', null);
        controller.set('selectedSubcategories', Ember.ArrayProxy.create({content:[]}));
        setTimeout(function () {
          if(parentController!==null) {
            parentController.set('txEvent', false);
            parentController.set('txMessage', '');
          }
        },2000);
        controller.transitionToRoute('/tramites');
      });
      return false;
    },
    publishTramite: function() {
      var controller = this;
      var tramite = this.get('model');
      tramite.set('status', 2);
      var parentController = this.get('controllers.tramites/index');
      parentController.set('txEvent',true);
      parentController.set('txMessage','Trámite Publicado');
      if(tramite.get('presencial')==="<p><br></p>"){
        tramite.set('presencial', '');
      }
      if(tramite.get('description')==="<p><br></p>"){
        tramite.set('description', '');
      }
      if(tramite.get('costNote')==="<p><br></p>"){
        tramite.set('costNote', '');
      }
      if(tramite.get('documentNote')==="<p><br></p>"){
        tramite.set('documentNote', '');
      }
      tramite.save().then(function() {
        controller.set('isSaved', false);
        controller.set('selectedSecretaria', null);
        controller.set('selectedSubcategories', Ember.ArrayProxy.create({content:[]}));
        setTimeout(function () {
          if(parentController!==null) {
            parentController.set('txEvent', false);
            parentController.set('txMessage', '');
          }
        },2000);
        controller.transitionToRoute('/tramites');
      });
    },
    unpublishTramite: function() {
      var controller = this;
      var tramite = this.get('model');
      tramite.set('status', 4);
      var parentController = this.get('controllers.tramites/index');
      parentController.set('txEvent',true);
      parentController.set('txMessage','Trámite Despublicado');
      tramite.save().then(function() {
        controller.set('isSaved', false);
        controller.set('selectedSecretaria', null);
        controller.set('selectedSubcategories', Ember.ArrayProxy.create({content:[]}));
        setTimeout(function () {
          if(parentController!==null) {
            parentController.set('txEvent', false);
            parentController.set('txMessage', '');
          }
        },2000);
        controller.transitionToRoute('/tramites');
      });
    },
    cancelTramite: function() {
      var tramite = this.get('model');
      tramite.rollback();
      this.set('isSaved', false);
      this.set('selectedSecretaria', null);
      this.set('selectedSubcategories', Ember.ArrayProxy.create({content:[]}));
      var parentController = this.get('controllers.tramites/index');
      parentController.set('txEvent',true);
      parentController.set('txMessage','Modificaciones Canceladas');
      setTimeout(function () {
        if(parentController!==null) {
          parentController.set('txEvent', false);
          parentController.set('txMessage', '');
        }
      },2000);
      this.transitionToRoute('/tramites');
    }
  }

});
