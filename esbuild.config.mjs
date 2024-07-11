import * as esbuild from 'esbuild';
import process from 'process'

const opts = [
	{
		entryPoints: ['./src/app.js'],
		bundle: true,
		platform: "node",
		format: "cjs",
		target: "es2018",
		logLevel: "info",
		sourcemap: "inline",
		treeShaking: true,
		outfile: "index.js",
		packages: "external"
	},
	{
		entryPoints: ['./src/client/**/loader.ts'],
		bundle: true,
		platform: "browser",
		sourcemap: "inline",
		minify: true,
		treeShaking: false,
		outdir: "./public/scripts"
	},
	{
		entryPoints: ['./tools/*.ts'],
		bundle: true,
		platform: "node",
		format: "cjs",
		target: "es2018",
		treeShaking: true,
		outdir: "./tools/build",
		packages: "external"
	}
]

if(process.argv[2] === 'production') {
	opts.forEach(async (opt) => await esbuild.build(opt));
}
else {
	opts.map(async (opt) => esbuild.context(opt))
		.forEach(async (ctx) => (await ctx).watch());
}