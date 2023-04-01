import { writeFile } from 'node:fs/promises';
import type { PluginOption, UserConfigExport } from 'vite';
import typescript from '@rollup/plugin-typescript';
import { dependencies } from './package.json';

const pkgJsonGen = (): PluginOption => {
	return {
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

			return writeFile('dist/package.json', JSON.stringify(pkg, null, 4));
		}
	};
};

export default {
	build: {
		ssr: 'src/main.ts',
		minify: 'terser',
		target: process.env.TARGET,
		sourcemap: false,
		rollupOptions: {
			output: {
				format: 'esm',
				compact: true,
				preserveModules: true,
				preserveModulesRoot: 'src'
			},
			plugins: [pkgJsonGen()]
		},
		terserOptions: {
			keep_classnames: true
		}
	},
	plugins: [typescript({ tsconfig: 'tsconfig.release.json' })]
} satisfies UserConfigExport;
