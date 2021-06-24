module.exports = {
  pages: {
    'popup': {
      entry: 'src/main.js',
      title: 'Popup'
    }
  },
  pluginOptions: {
    browserExtension: {
      components: {
        popup: true,
        contentScripts: true
      },
      api: 'chrome',
      componentOptions: {
        contentScripts: {
          entries: {
            'content-script': [
              'src/content-script.js'
            ]
          }
        }
      }
    }
  }
}
