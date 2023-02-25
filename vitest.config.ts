import { UserConfigExport } from 'vitest/config';
import typescript from '@rollup/plugin-typescript';

export default {
	test: {
		include: ['src/**/*.(spec|test).{ts,cts,mts}'],
		reporters: ['junit', 'verbose'],
		outputFile: {
			junit: '.reports/junit.xml'
		},
		coverage: {
			all: true,
			reportsDirectory: '.reports/coverage',
			reporter: ['text', 'text-summary', 'lcov', 'cobertura', 'json'],
			include: ['src/**/*.{ts,cts,mts}'],
			exclude: [
				'**/index.{ts,cts,mts}',
				'**/main.{ts,cts,mts}',
				'**/*.d.{ts,cts,mts}',
				'**/*.mock.{ts,cts,mts}',
				'**/*.config.{ts,cts,mts}',
				'**/__tests__',
				'**/__mocks__',
				'**/__fixtures__'
			]
		}
	},
	plugins: [typescript()]
} satisfies UserConfigExport;
