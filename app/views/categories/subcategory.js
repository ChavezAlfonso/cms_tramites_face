import Ember from 'ember';

export default Ember.View.extend({
  tagName: 'label',
  mouseEnter:function(){
    this.get('controller').send('hoverEnter', this.get('context'));
  },
  mouseLeave:function(){
    this.get('controller').send('hoverLeave', this.get('context'));
  }
});
