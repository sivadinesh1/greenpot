import myEndpoint from '../../api/category/[...company_id]';
import myEndpoint1 from '../../api/category';
import testClient from './test-client';

describe('test endpoint', () => {
	test('verify log event endpoint fails on get request', async () => {
		const client = testClient(myEndpoint, { company_id: '2' }, false);
		const response = await client.get('/api/category');
		expect(response.status).toBe(200);
	});

	test(' post check  request', async () => {
		const client = testClient(myEndpoint1);
		const response = await client.post('/api/category').send({ name: 'zcat', company_id: '2' });
		expect(response.status).toBe(201);
	});
});
