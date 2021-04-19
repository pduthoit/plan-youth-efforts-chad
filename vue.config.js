var webpack = require('webpack')

module.exports = {
	publicPath: '',
  configureWebpack: {
    plugins: [
      new webpack.ProvidePlugin({
        mapboxgl: 'mapbox-gl'
      })
    ]
  },
  pwa: {
      workboxOptions: {
        skipWaiting: true,
        runtimeCaching: [
          {
            urlPattern: /^(https:\/\/cors-anywhere\.herokuapp\.com\/)?https:\/\/kobo\.humanitarianresponse\.info/,
            handler: 'networkFirst',
            options: {
              networkTimeoutSeconds: 20,
              cacheName: 'api-cache',
              cacheableResponse: {
                  statuses: [0, 200]
              },
            },
          },
          {
            urlPattern: /https:\/\/api\.mapbox\.com/,
            handler: 'cacheFirst',
            options: {
              cacheName: 'mapbox-cache',
              cacheableResponse: {
                statuses: [0, 200]
              },
              expiration: {
                maxEntries: 120,
              }
            }
          }

      ]
    }
  }
}
