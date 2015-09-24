/*global $:false */
import Ember from 'ember';

export default Ember.Controller.extend({
  queryParams: ['newUserEnabled'],
  isSendingEmail:false,
  onNewUserError:null,
  rolItems:[{id:1, text:'Administrador',description:''},{id:2,text:'Editor',description:''}],
  newUserEnabled:false,
  isComplete: false,
  newUserInstance:{},
  groupActions: ['Editar','Eliminar'],
  selectedAction: '',
  filter: '',
  filteredContent: function() {
    var filter = this.get('filter');
    var rx = new RegExp(filter, 'gi');
    var usuarios = this.get('content');
    //console.log('usuarios ---> ' + this.get('content'));
    return usuarios.filter(function(usuario) {
        return usuario.get('name').match(rx) || usuario.get('username').match(rx) || usuario.get('email').match(rx) || usuario.get('role').match(rx);
    });
  }.property('content', 'filter', 'content.@each'),
  watchNewUserForm: function() {
    var newUser = this.get('newUserInstance');
    var re =  /[A-Z0-9._%+-]+@[A-Z0-9.-]+.[A-Z]{2,4}/igm;
    var hasAllProperties = newUser.hasOwnProperty('name') &&
                           newUser.hasOwnProperty('username') &&
                           newUser.hasOwnProperty('role') &&
                           newUser.hasOwnProperty('email');
    var hasValidData =     hasAllProperties &&
                           newUser.name.trim() !== '' &&
                           newUser.username.trim() !== '' &&
                           newUser.role !== '' &&
                           newUser.email.trim() === newUser.emailConfirm.trim() &&
                           re.test(newUser.email.trim())
    if(hasValidData){
      $('#addUser').removeClass('disabled');
    } else {
      $('#addUser').addClass('disabled');
    }
  }.observes('newUserInstance.name','newUserInstance.username','newUserInstance.email','newUserInstance.emailConfirm','newUserInstance.role'),
  watchGroupAction: function() {
    var selectedAction = this.get('selectedAction');
  }.observes('selectedAction'),
  actions:{
    newUserEventEnable: function(){
      this.set('newUserInstance',{name:'', username:'', email:'', emailConfirm:'', role:'', actve:''});
      this.set('newUserEnabled',true);
      this.set('onNewUserError',null);
      this.set('isSendingEmail',false);
    },
    newUserEventDisable: function(){
      if (confirm('Estas seguro que deseas cancelar?')) {
        this.set('onNewUserError',null);
        this.set('newUserEnabled',false);
        this.set('newUserInstance',{});
        this.set('isSendingEmail',false);
      }
    },
    saveUser: function(){
      var newUser = this.get('newUserInstance');
      var userItem = {
        name:newUser.name,
        username:newUser.username,
        //encrypted_password: 'tramitesgob',
        password: 'tramitesgob',
        email:newUser.email,
        role:newUser.role.text
        //active: true
      };
      var controller=this;
      var newRecord = this.store.createRecord('user', userItem);
      controller.set('isSendingEmail',true);
      newRecord.save().then(function(){ //SUCCESS
        controller.set('onNewUserError',null);
        controller.set('newCategoryItem',null);
        controller.set('newUserEnabled',false);
        setTimeout(function () { controller.set('isSendingEmail',false); }, 5000);
      }, function (result){ //ERROR
        controller.set('onNewUserError', result.errors.error);
        setTimeout(function () { controller.set('onNewUserError', false); }, 5000);
        newRecord.rollback();
        newRecord.unloadRecord();
        controller.set('isSendingEmail',false);
      });
    }
  }
});
