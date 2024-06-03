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

const browOpts = {
	entryPoints: ['./src/client/**/loader.ts'],
	bundle: true,
	platform: "browser",
	sourcemap: "inline",
	minify: true,
	treeShaking: false,
	outdir: "./public/scripts"
}

if(process.argv[2] === 'production') {
	await esbuild.build(buildOpts);
	await esbuild.build(browOpts);
	process.exit(0);
}

Promise.all([
	(await esbuild.context(buildOpts)).watch(),
	(await esbuild.context(browOpts)).watch()
]);