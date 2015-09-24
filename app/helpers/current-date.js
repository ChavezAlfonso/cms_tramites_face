/* global moment:true */
import Ember from 'ember';


export function currentDate(input) {	 
  return moment(input).format('DD/MM/YYYY');
}

export default Ember.Handlebars.makeBoundHelper(currentDate);
