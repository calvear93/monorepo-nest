import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { SampleService } from '../services/sample.service.js';

@Controller({
	path: 'basic',
	version: '1'
})
@ApiTags('Sample')
export class SampleController {
	constructor(private readonly _service: SampleService) {}

	/**
	 * Return sample result.
	 *
	 * @returns sample string
	 */
	@Get()
	run(): string {
		return this._service.sample();
	}
}
