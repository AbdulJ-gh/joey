import test from 'ava';
import { parseFormData } from './formData';

test('parseFormData - TODO', t => {
	const formData = new FormData();
	formData.append('firstName', 'John');
	formData.append('lastName', 'Doe');

	t.deepEqual(parseFormData(formData), {
		firstName: 'John',
		lastName: 'Doe'
	});
});
