import nodeResolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

const isProd = process.env.PRODUCTION === 'true'

const plugins = [
  nodeResolve({
    jsnext: true,
    modulesOnly: true
  }),
  commonjs({
    include: 'node_modules/**',
    namedExports: {
      'buble/dist/buble.deps': ['transform'],
      'buble': ['transform'],
      'prismjs/components/prism-core': ['highlight', 'languages']
    }
  }),
  babel({
    babelrc: false,
    presets: [
      ['env', { modules: false, loose: true }],
      'react'
    ],
    plugins: [
      'external-helpers',
      'transform-object-rest-spread',
      'transform-class-properties',
      ['transform-react-remove-prop-types', { removeImport: true }]
    ].filter(Boolean)
  })
]

const base = {
  input: 'src/index.js',
  external: ['react', 'react-dom', 'prismjs', 'buble']
};

const output = {
  exports: 'named',
  globals: {
    prismjs: 'Prism',
    react: 'React',
    buble: 'Buble',
    'react-dom': 'ReactDOM',
  }
};

const makeOutput = config => Object.assign({}, output, config);

const withBase = config => Object.assign({}, base, config);

export default [
  {
    output: [{
      file: 'dist/react-live.es.js',
      format: 'es'
    }, {
      file: 'dist/react-live.cjs.js',
      format: 'cjs'
    }].map(makeOutput),
    plugins
  }
].map(withBase);
