import { beforeAll, describe, expect, test } from 'vitest';
import { Test } from '@nestjs/testing';
import { SampleService } from '../services/sample.service.js';
import { SampleController } from './sample.controller.js';

describe(SampleController.name, () => {
	let controller: SampleController;

	// hooks
	beforeAll(async () => {
		const module = await Test.createTestingModule({
			controllers: [SampleController],
			providers: [SampleService]
		}).compile();

		controller = module.get<SampleController>(SampleController);
	});

	// tests
	test('should be defined', () => {
		expect(controller).toBeDefined();
	});
});
