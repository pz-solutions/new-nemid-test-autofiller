module.exports = {
  pages: {
    'popup/popup': {
      entry: 'src/popup/popup.js',
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
            'content_scripts/content-script': [
              'src/content_scripts/content-script.js'
            ]
          }
        }
      }
    }
  }
}
