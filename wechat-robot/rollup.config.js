
import esbuild from "rollup-plugin-esbuild"
import path from "path"
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy"
import rollup from "rollup"
import fs from "fs"

export default {
	input: {
		"web":'./web/main.ts', // 控制系统
		"plugin":'./plugin/main.ts'  // 插件系统
	},
	external: [],
	plugins: [
		alias({
			entries: [

				{ find: '@web', replacement: path.resolve(__dirname, './web') },
				{ find: '@plugin', replacement: path.resolve(__dirname, './plugin') },
				{ find: '@common', replacement: path.resolve(__dirname, './common') },

			],
			customResolver:resolve({
				extensions: ['.js', '.jsx', '.json','.ts']
			})
		}),
		esbuild({
			include: /\.[jt]sx?$/,
			exclude: /node_modules/,
			sourceMap: true,
			minify: process.env.NODE_ENV === 'production',
			target: 'es2017',
			loaders: {
				'.json': 'json',
				'.js': 'jsx'
			},
			tsconfig: "tsconfig.json"
		}),
		copy({
			targets: [
				{
					src: "./package.json",
					dest: "./dist"
				},
				{
					src:"./.env",
					dest:"./dist"
				}
			]
		})
	],
	output: {
		dir: 'dist',
		format: 'cjs',
		entryFileNames: '[name].js'
	}
}