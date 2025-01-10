
import esbuild from "rollup-plugin-esbuild"
import path from "path"
import alias from '@rollup/plugin-alias';
import resolve from '@rollup/plugin-node-resolve';
import copy from "rollup-plugin-copy"
import rollup from "rollup"
import fs from "fs"

export default {
	input: "./src/main.ts",
	external: [],
	plugins: [
		alias({
			entries: [
				{ find: '@', replacement: path.resolve(__dirname, './src') },
			],
			customResolver:resolve({
				extensions: ['.js', '.jsx', '.json','.ts','.tsx']
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
					src:"./src/.env",
					dest:"./dist"
				}
			]
		})
	],
	output: [
		{ file: "./dist/robot.js", format: 'cjs' }
	]
}