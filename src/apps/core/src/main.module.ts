import { HttpProvider } from '@libs/http';
import { Logger, Module } from '@nestjs/common';
import { HealthModule, SampleModule } from './modules/index.js';

@Module({
	imports: [HealthModule, SampleModule],
	providers: [HttpProvider.register()]
})
export class MainModule {
	onModuleInit(): void {
		this._logger.debug('Started');
	}

	private readonly _logger: Logger = new Logger(MainModule.name);
}
