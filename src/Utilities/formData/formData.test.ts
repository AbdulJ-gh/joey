import test from 'ava';
import { parseFormData } from './formData';

test('parseFormData - TODO', t => {
	const formData = new FormData();
	formData.append('First name', 'John');
	formData.append('Last name', 'Doe');

	for (const entry of formData.entries()) {
		console.log('====', entry[0], ':', entry[1]);
	}
	t.deepEqual(parseFormData(formData), {
		firstName: 'John',
		lastName: 'Doe'
	});
});
