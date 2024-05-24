import * as esbuild from 'esbuild';
import process from 'process'

const buildOpts = {
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
}

if(process.argv[2] === 'production') {
	await esbuild.build(buildOpts);
	process.exit(0);
}

const ctx = await esbuild.context(buildOpts)
await ctx.watch();