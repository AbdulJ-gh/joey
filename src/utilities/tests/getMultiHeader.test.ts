import test from 'ava';
import getMultiHeader from '../getMultiHeader';

test('Single header', t => {
	const headers = new Headers({ Authorization: 'Bearer someToken' });
	const authorization = headers.get('Authorization') as string;
	const multiHeader = getMultiHeader(authorization);
	t.deepEqual(multiHeader, { Bearer: 'someToken' });
});

test('Multiple headers', t => {
	const headers = new Headers();
	headers.append('Authorization', 'Bearer someToken');
	headers.append('Authorization', 'Scarer Sullivan');
	const authorization = headers.get('Authorization') as string;
	const multiHeader = getMultiHeader(authorization);
	t.deepEqual(multiHeader, { Bearer: 'someToken', Scarer: 'Sullivan' });
});

//
