import Ember from 'ember';

export default Ember.Route.extend({
	model: function(params) {
    return this.store.fetchById('tramite', params.tramite_id);
  },
  setupController: function(controller, model) {
    this._super(controller, model);
    //Dependencia asignada
    if(model.get('dependence')!=null) {
      this.store.find('secretaria', model.get('dependence') ).then(function(dependencia){
        controller.set('secretaria', dependencia.get('name'));
        controller.set('homoclave',  dependencia.get('siglas')+model.get('id'));
      });
    }
    var tlineLinks = [];
    var soltdLinks = [];
    var plineLinks = [];
    var infoLinks  = [];
    var emailLinks = [];
    var formatLinks= [];
    var actionTypes = model.get('actionTypes');
    actionTypes.forEach(function(item){
      var atype = item.get('tipo');
      switch(atype){
        case 'Trámite en línea':
          tlineLinks.push({link:item.get('link'),description:item.get('description')});
        break;
        case 'Haz tu cita':
          soltdLinks.push({link:item.get('link'),description:item.get('description')});
        break;
        case 'Pago en línea':
          plineLinks.push({link:item.get('link'),description:item.get('description')});
        break;
        case 'Más Información':
          infoLinks.push({link:item.get('link'),description:item.get('description')});
        break;
        case 'Correo Electrónico':
          emailLinks.push({link:item.get('link'),description:item.get('description')});
        break;
      }
    });
    var documentFormats = model.get('documents');
    documentFormats.forEach(function(item){
      if(item.get('isFormat')){
        formatLinks.push({link:item.get('linkformat'),description:item.get('description')});
      }
    });
    controller.set('tlineLinks',tlineLinks);
    controller.set('soltdLinks',soltdLinks);
    controller.set('plineLinks',plineLinks);
    controller.set('infoLinks' ,infoLinks);
    controller.set('emailLinks',emailLinks);
    controller.set('formatLinks',formatLinks);

  }
});
