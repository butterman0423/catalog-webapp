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

const scriptOpts = {
	entryPoints: ['./src/browser/*.ts'],
	bundle: false,
	platform: "browser",
	format: "cjs",
	logLevel: "info",
	treeShaking: false,
	outdir: "./build"
}

if(process.argv[2] === 'production') {
	await esbuild.build(buildOpts);
	await esbuild.build(scriptOpts);
	process.exit(0);
}

const ctx = await esbuild.context(buildOpts)
const scrCtx = await esbuild.context(scriptOpts);
await Promise.all([
	ctx.watch(),
	scrCtx.watch()
])