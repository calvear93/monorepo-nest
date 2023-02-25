import { writeFile } from 'node:fs/promises';
import { UserConfigExport } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { dependencies } from './package.json';

export default {
	build: {
		ssr: 'src/main.ts',
		minify: 'terser',
		target: process.env.TARGET,
		sourcemap: false,
		rollupOptions: {
			input: 'src/main.ts',
			output: {
				format: 'esm',
				compact: true,
				preserveModules: true,
				preserveModulesRoot: 'src'
			}
		},
		terserOptions: {
			keep_classnames: true
		}
	},
	plugins: [
		typescript({ tsconfig: 'tsconfig.release.json' }),
		{
			name: 'package-json-gen',
			closeBundle: () => {
				const pkg = {
					type: 'module',
					dependencies: Object.fromEntries(
						Object.entries(dependencies).filter(
							([, value]) => !value.includes('workspace')
						)
					)
				};

				return writeFile(
					'dist/package.json',
					JSON.stringify(pkg, null, 4)
				);
			}
		}
	]
} satisfies UserConfigExport;
