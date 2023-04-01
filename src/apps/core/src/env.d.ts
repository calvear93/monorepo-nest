declare global {
	namespace NodeJS {
		// NOTE: only string type is supported
		interface ProcessEnv {
			readonly NODE_ENV: 'development' | 'production' | 'test';
			readonly ENV: 'dev' | 'release';
			readonly TARGET: string;
			readonly DEBUG?: string;

			// SECTION: runtime environment
			readonly HOSTNAME: string;

			// SECTION: project info from package.json
			readonly VERSION: string;
			readonly PROJECT: string;
			readonly NAME: string;
			readonly TITLE: string;
			readonly DESCRIPTION: string;

			// SECTION: base config
			readonly PORT: string;
			readonly API_PREFIX: string;
			readonly SWAGGER_UI: 'false' | 'true';

			// SECTION: localization
			readonly TZ: string;
			readonly LANG: string;
		}
	}
}

export {};
