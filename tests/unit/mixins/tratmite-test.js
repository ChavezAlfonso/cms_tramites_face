import Ember from 'ember';
import TratmiteMixin from '../../../mixins/tratmite';
import { module, test } from 'qunit';

module('TratmiteMixin');

// Replace this with your real tests.
test('it works', function(assert) {
  var TratmiteObject = Ember.Object.extend(TratmiteMixin);
  var subject = TratmiteObject.create();
  assert.ok(subject);
});
