"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
// istanbul ignore file
// Note: order of keys are important. If we have more
// specific version of the same key, then specific version
// of the same key must go before the less specific version
// for example:
// if we have:
//
// {
//    key: "nuxt",
//    name: "Nuxt.js"
//    builder: "@edgio\nuxt-nitro",
//    framework: 'nuxt',
//    frameworkVersion: "3.x"  <-- specific version must be placed before non specific
//    ...
// }
// {
//    key: "nuxt",
//    name: "Nuxt.js"
//    builder: "@edgio\nuxt",
//    framework: 'nuxt',
//    ...
// }
//
// The versions are compared using "satisfies" function from https://www.npmjs.com/package/semver
//
var _default = [{
  key: 'next',
  name: 'Next.js',
  builder: '@edgio/next',
  devDependencies: ['@edgio/react'],
  framework: 'next',
  frameworkVersion: undefined
}, {
  key: 'spartacus',
  name: 'Spartacus',
  builder: '@edgio/spartacus',
  devDependencies: ['@edgio/angular', 'workbox-build', 'webpack-cli'],
  framework: '@spartacus/core',
  frameworkVersion: undefined
}, {
  key: 'angular',
  name: 'Angular',
  builder: '@edgio/angular',
  devDependencies: ['globby@11.0.2'],
  // later Angular versions use globby@12.x which breaks build
  framework: '@angular/core',
  frameworkVersion: undefined
}, {
  key: 'vsf',
  name: 'Vue Storefront',
  builder: '@edgio/vue-storefront',
  devDependencies: ['@edgio/apollo', '@edgio/vue', '@edgio/nuxt'],
  framework: '@vue-storefront/nuxt',
  frameworkVersion: undefined
}, {
  key: 'nuxt',
  name: 'Nuxt',
  builder: '@edgio/nuxt-nitro',
  devDependencies: ['@edgio/vue'],
  framework: 'nuxt',
  frameworkVersion: '>=3.0.0'
}, {
  key: 'nuxt-v2',
  name: 'Nuxt v2',
  builder: '@edgio/nuxt',
  devDependencies: ['@edgio/vue'],
  framework: 'nuxt',
  frameworkVersion: undefined
}, {
  key: 'gatsby',
  name: 'Gatsby',
  builder: '@edgio/gatsby',
  devDependencies: ['@edgio/react'],
  framework: 'gatsby',
  frameworkVersion: undefined
}, {
  key: 'sapper',
  name: 'Sapper',
  builder: '@edgio/sapper',
  devDependencies: ['@edgio/svelte'],
  framework: 'sapper',
  frameworkVersion: undefined
}, {
  key: 'frontity',
  name: 'Frontity',
  builder: '@edgio/frontity',
  devDependencies: ['@edgio/react'],
  framework: 'frontity',
  frameworkVersion: undefined
}, {
  key: 'fastboot',
  name: 'Ember Fastboot',
  builder: '@edgio/fastboot',
  dependencies: ['@edgio/fastboot'],
  framework: 'ember-cli-fastboot',
  frameworkVersion: undefined
}, {
  key: 'sveltekit',
  name: 'SvelteKit',
  builder: '@edgio/sveltekit',
  dependencies: ['@edgio/sveltekit'],
  devDependencies: ['@edgio/svelte'],
  framework: '@sveltejs/kit',
  frameworkVersion: undefined
}, {
  key: 'razzle',
  name: 'razzle',
  builder: '@edgio/razzle',
  dependencies: ['@edgio/razzle'],
  framework: 'razzle',
  frameworkVersion: undefined
}, {
  key: 'express',
  name: 'express',
  builder: '@edgio/express',
  dependencies: ['@edgio/express'],
  framework: 'express',
  frameworkVersion: undefined
}, {
  key: 'redwoodjs',
  name: 'redwoodjs',
  builder: '@edgio/redwood',
  devDependencies: ['@edgio/redwood'],
  framework: '@redwoodjs/core',
  frameworkVersion: undefined
}, {
  key: 'shopify-hydrogen',
  name: 'shopify-hydrogen',
  builder: '@edgio/shopify-hydrogen',
  devDependencies: ['@edgio/shopify-hydrogen'],
  framework: '@shopify/hydrogen',
  frameworkVersion: undefined
}, {
  key: 'astro',
  name: 'astro',
  builder: '@edgio/astro',
  devDependencies: ['@edgio/astro'],
  framework: 'astro',
  frameworkVersion: '>=1.0.0'
}, {
  key: 'hexo',
  name: 'hexo',
  builder: '@edgio/hexo',
  devDependencies: ['@edgio/hexo'],
  framework: 'hexo',
  frameworkVersion: undefined
}];
exports.default = _default;
module.exports = exports.default;