import {
	afterAll,
	afterEach,
	beforeAll,
	describe,
	expect,
	Mock,
	test,
	vi
} from 'vitest';
import nock from 'nock';
import { Test, TestingModule } from '@nestjs/testing';
import { AxiosInterceptorConfig, HttpProvider } from './http.provider.js';

describe(HttpProvider.name, () => {
	let module: TestingModule;
	let provider: HttpProvider;

	const altToken = 'alt';
	const baseURL = 'https://api.com';
	const baseURLAlt = 'https://api.com/alt';

	const axiosInterceptors: AxiosInterceptorConfig = {
		request: {
			onFulfilled: vi.fn().mockImplementation((response) => response),
			onRejected: vi.fn().mockImplementation((error) => {
				throw error;
			})
		},
		response: {
			onFulfilled: vi.fn().mockImplementation((response) => response),
			onRejected: vi.fn().mockImplementation((error) => {
				throw error;
			})
		}
	};

	// hooks
	beforeAll(async () => {
		module = await Test.createTestingModule({
			providers: [
				HttpProvider.register({ baseURL }, axiosInterceptors),
				HttpProvider.register({
					useToken: altToken,
					baseURL: baseURLAlt
				})
			]
		}).compile();

		provider = module.get<HttpProvider>(HttpProvider);
	});

	afterEach(() => {
		vi.clearAllMocks();
	});

	afterAll(async () => {
		await module.close();
		nock.cleanAll();
	});

	// tests
	test('common http provider should be defined', () => {
		expect(provider).toBeDefined();
	});

	test('alternative http provider should be defined and configured', () => {
		const altProvider = module.get<HttpProvider>(altToken);

		expect(altProvider).toBeDefined();
		expect(altProvider.axiosRef.defaults.baseURL).toBe(baseURLAlt);
	});

	test('GET request is success', async () => {
		// mocking phase
		nock(baseURL).get('/').reply(200, 'ok');

		// request phase
		const response = await provider.get<string>('/');

		expect(response.data).toBe('ok');
	});

	test('GET request with json response is success', async () => {
		// mocking phase
		const data = { value: 1 };
		nock(baseURL).get('/').reply(200, data);

		// request phase
		const response = await provider.get<typeof data>('/');

		expect(response.data).toEqual(data);
	});

	test('GET request with params is success', async () => {
		// mocking phase
		const params = { id: 1, name: 'test' };
		nock(baseURL).get('/').query(params).reply(200, 'ok');

		// request phase
		const response = await provider.get<string>('/', {
			params
		});

		expect(response.data).toBe('ok');
	});

	test('POST request is success', async () => {
		// mocking phase
		const body = { id: 1, name: 'test' };
		const result = { result: { ...body, time: Date.now() } };
		nock(baseURL).post('/', body).reply(201, result);

		// request phase
		const response = await provider.post<typeof result>('/', body);

		expect(response.data).toEqual(result);
	});

	test('PUT request is success', async () => {
		// mocking phase
		const body = { id: 1, name: 'test' };
		nock(baseURL).put('/', body).reply(204, 'ok');

		// request phase
		const response = await provider.put<string>('/', body);

		expect(response.data).toBe('ok');
	});

	test('PATCH request is success', async () => {
		// mocking phase
		const body = { id: 1, name: 'test' };
		nock(baseURL).patch('/', body).reply(204, 'ok');

		// request phase
		const response = await provider.patch<string>('/', body);

		expect(response.data).toBe('ok');
	});

	test('DELETE request with params is success', async () => {
		// mocking phase
		nock(baseURL).delete('/').reply(204, 'ok');

		// request phase
		const response = await provider.delete<string>('/');

		expect(response.data).toBe('ok');
	});

	test('HEAD request with params is success', async () => {
		// mocking phase
		nock(baseURL).head('/').reply(200, 'ok');

		// request phase
		const response = await provider.head<string>('/');

		expect(response.data).toBe('ok');
	});

	test('request and response interceptors should been called on success', async () => {
		// mocking phase
		nock(baseURL).get('/').reply(200, 'ok');

		// request phase
		const response = await provider.get<string>('/');

		// interception mocks validation
		const requestOnFulfilled = axiosInterceptors.request
			?.onFulfilled as Mock;
		const responeOnFulfilled = axiosInterceptors.response
			?.onFulfilled as Mock;

		expect(response.data).toBe('ok');
		expect(requestOnFulfilled).toHaveBeenCalledTimes(1);
		expect(responeOnFulfilled).toHaveBeenCalledTimes(1);
	});

	test('request and response interceptors should been called on error', async () => {
		// mocking phase
		nock(baseURL).get('/').reply(500);

		// request phase
		await expect(provider.get('/')).rejects.toThrow();

		// interception mocks validation
		const requestOnRejected = axiosInterceptors.request?.onRejected as Mock;
		const responeOnRejected = axiosInterceptors.response
			?.onRejected as Mock;

		expect(requestOnRejected).toHaveBeenCalledTimes(0);
		expect(responeOnRejected).toHaveBeenCalledTimes(1);
	});

	test('request does not fails for timeout if response completes before', async () => {
		// mocking phase
		nock(baseURL).get('/').delay(20).reply(200);

		// request phase
		await expect(
			provider.get<string>('/', { timeout: 100 })
		).resolves.toBeDefined();
	});

	test('request fails for timeout', async () => {
		// mocking phase
		nock(baseURL).get('/').delay(200).reply(200);

		// request phase
		await expect(
			provider.get<string>('/', { timeout: 20 })
		).rejects.toThrow();
	});

	test('request can be aborted', async () => {
		// mocking phase
		nock(baseURL).get('/').delay(200).reply(200);

		// request phase
		const controller = new AbortController();

		const promise = provider.request({
			url: '/',
			method: 'get',
			signal: controller.signal
		});

		controller.abort();

		await expect(promise).rejects.toMatchObject({
			code: 'ERR_CANCELED',
			message: 'canceled'
		});
	});

	test('AxiosError is matched by isAxiosError method', async () => {
		try {
			await provider.get('/not-found');
		} catch (error: unknown) {
			expect(HttpProvider.isAxiosError(error)).toBeTruthy();
		}
	});
});
