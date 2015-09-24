/*global $:false */
import Ember from 'ember';
export default Ember.Controller.extend({
secretaria:'',
homoclave:'',
tlineLinks:[],
soltdLinks:[],
plineLinks:[],
infoLinks:[],
emailLinks:[],
formatLinks:[],
actions:{
  dropDownTOnLine: function(){
    $('#dropDownTOnLine').toggleClass('open');
  },
  dropDownSolicitud: function(){
    $('#dropDownSolicitud').toggleClass('open');
  },
  dropDownPLine: function(){
    $('#dropDownPLine').toggleClass('open');
  },
  dropDownFormat: function(){
    $('#dropDownFormat').toggleClass('open');
  },
  dropDownMoreInfo: function(){
    $('#dropDownMoreInfo').toggleClass('open');
  },
  dropDownEmail: function(){
    $('#dropDownEmail').toggleClass('open');
  },showDocumentsByGroup: function( seleccionado ){
    $('.nav li').removeClass('active');
    $('.tab-content div').removeClass('active');
    var li = document.getElementById("ni" +seleccionado)
    if (!$(li).hasClass('active')) {
      $(li).addClass('active');
    }
    li = document.getElementById("dg" +seleccionado)
    if (!$(li).hasClass('active')) {
      $(li).addClass('active');
    }
    e.preventDefault();
  }
}

});
