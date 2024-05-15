// This file was automatically added by edgio init.
// You should commit this file to source control.
const { withEdgio } = require('@edgio/next/config');
const withOptimizely = require('./scripts/fetch_optimizely_datafile.js');

/** @type {import('next').NextConfig} */
const nextConfig = {};

module.exports = withOptimizely(withEdgio(nextConfig));
