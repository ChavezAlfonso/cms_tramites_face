import {
  emailValidate
} from '../../../helpers/email-validate';
import { module, test } from 'qunit';

module('EmailValidateHelper');

// Replace this with your real tests.
test('it works', function(assert) {
  var result = emailValidate(42);
  assert.ok(result);
});
