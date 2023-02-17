import fg from 'fast-glob'
import dev from 'rollup-plugin-dev'
import html from '@web/rollup-plugin-html'
import summary from 'rollup-plugin-summary'
import replace from '@rollup/plugin-replace'
import commonjs from 'rollup-plugin-commonjs'
import { terser } from 'rollup-plugin-terser'
import livereload from 'rollup-plugin-livereload'
import resolve from '@rollup/plugin-node-resolve'
import minifyHTML from 'rollup-plugin-minify-html-literals'

export default [
  {
    plugins: [
      dev({ port: process.env.PORT || 3000, dirname: 'build', spa: true }),
      process.env.NODE_ENV !== 'production' && livereload('build'),
      html({
        input: 'src/index.html',
      }),
      resolve(),
      minifyHTML(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
      summary(),
      commonjs({
        namedExports: {
          '@edgio/prefetch': ['Prefetcher'],
        },
      }),
      {
        name: 'watch-external',
        async buildStart() {
          const files = await fg('src/**/*')
          for (let file of files) {
            this.addWatchFile(file)
          }
        },
      },
    ],
    output: {
      dir: 'build',
      entryFileNames: '[name]-[hash].js',
    },
    preserveEntrySignatures: 'strict',
  },
  {
    input: './src/service-worker.js',
    plugins: [
      replace({
        preventAssignment: true,
        'process.env.NODE_ENV': '"production"',
        'process.env.EDGIO_PREFETCH_HEADER_VALUE': '"1"',
        'process.env.EDGIO_PREFETCH_CACHE_NAME': '"prefetch"',
      }),
      resolve(),
      minifyHTML(),
      terser({
        ecma: 2020,
        module: true,
        warnings: true,
      }),
      summary(),
      commonjs({
        namedExports: {
          '@edgio/prefetch': ['Prefetcher'],
        },
      }),
    ],
    output: {
      dir: 'build',
    },
    preserveEntrySignatures: 'strict',
  },
]
