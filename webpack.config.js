const webpack = require('webpack')

plugins: [
  new webpack.ProvidePlugin({
    mapboxgl: 'mapbox-gl',
  }),
]