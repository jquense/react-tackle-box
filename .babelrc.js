
module.exports = api => ({
  presets: [
    [
      'jason',
      {
        target: 'web',
        modules: api.env() === 'esm' ? false : 'commonjs'
      },
    ],
  ]
});
