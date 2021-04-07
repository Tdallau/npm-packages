
import { Option } from '../index'

test('Option', () => {
  const temp: Option<string> =  { kind: 'some', value: 'test' };
  expect(temp.kind).toBe('some');
  expect(temp.value).toBe('test');
})