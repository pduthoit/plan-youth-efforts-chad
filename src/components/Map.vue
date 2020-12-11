<template>
  <div id="map">
    <mapbox
      access-token="pk.eyJ1IjoicGxjYXJ0b25nIiwiYSI6ImNrN25pbTN4bDAycXEzZnM4a212M3k1dWkifQ.mfCBz7pz5g7ykUXaeNy13A"
      :map-options="{
        style: 'mapbox://styles/plcartong/ckihfzfro6i8b19s2zwgr3jdx/draft',
        center: [13, 12],
        zoom: 1.6,
        bearing: -6.5, // bearing in degrees
      }"
      @map-init="initialized"
      @map-load="loaded"
    />
    <nav id="filter-group" class="filter-group"></nav>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'
 console.log(mapboxgl)
export default {
  name: 'Map',
  components: { Mapbox },
  props: {
    // msg: String
  },

  computed: {
    lang: function () {
      return this.$store.state.lang
    }
  },
  watch: {
    '$store.state.lang': function() {
      this.translate()
    },
    '$store.state.minYearFilter': function() {
      this.updateIcons()
    },
    '$store.state.maxYearFilter': function() {
      this.updateIcons()
    },
  },
  methods: {
    initialized: function (map) {
      this.$store.commit('updateMap', map)
    },
    updateIcons: function () {
      for (var key in this.$store.state.categories) {
        if (typeof this.$store.state.map.getLayer('poi-' + key) !== 'undefined') {
          console.log(this.$store.state.minYearFilter + this.$store.state.minYearShown - 1)
          console.log(this.$store.state.maxYearFilter + this.$store.state.minYearShown - 1)
          this.$store.state.map.setFilter('poi-' + key,
            ['all',
            ['>=', 'year', this.$store.state.minYearFilter + this.$store.state.minYearShown - 1],
            ['<', 'year', this.$store.state.maxYearFilter + this.$store.state.minYearShown - 1]
          ]);
        }
      }
    },
    loaded(map) {
      this.showIcons(map)
      window.addEventListener('resize', () => {
        map.resize()
      });
      setTimeout(function () {
        map.flyTo({
          center: [14.2, 12.7],
          zoom: 7.5,
          speed: 0.6,
          essential: true,
          bearing: 0
        });
      });
    },
    translate: function () {
      this.$store.state.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_' + this.$store.state.lang]);
    },
    showIcons: function (map) {
      for (var key in this.$store.state.categories) {
        let category = key
        map.loadImage(
          require('../assets/img/icons/' + category + '.png'),
          function (error, image) {
            if (error) throw error;
            map.addImage(category, image);
        });
      }

      var places = {
        'type': 'FeatureCollection',
        'features': [
        {
        'type': 'Feature',
        'properties': {
        'year': 2019,
        'icon': 'child-protection',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate. Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.212659, 12.731567]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2017,
        'icon': 'child-protection',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.403168, 12.394651]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2020,
        'icon': 'sexual-violence',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.503168, 12.794651]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2019,
        'icon': 'community-building',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.090372, 12.681189]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2019,
        'icon': 'data',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.852477, 12.443951]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2019,
        'icon': 'school',
        'label': 'This is a label',
        'description': 'Aenean mi lacus, euismod ac nibh eu, aliquet efficitur elit. Sed varius vulputate metus.'
        },
        'geometry': {
          'type': 'Point',
        'coordinates': [14.631706, 12.914581]
        }
        },
        {
          'type': 'Feature',
        'properties': {
        'year': 2019,
          'icon': 'school',
        'label': 'This is a label',
        'description': ' Etiam vitae neque at orci euismod vulputate nec at ipsum. Nam at ipsum elementum, sollicitudin purus egestas, ultricies eros. Integer in viverra ante. Duis nec sapien at turpis vestibulum pellentesque. Aliquam sed magna ac libero sodales venenatis vitae quis urna. Phasellus interdum risus consectetur maximus elementum. Maecenas vel libero metus.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [15.020945, 12.278241]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2019,
        'icon': 'school',
        'label': 'This is a label',
        'description': ''
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.007481, 12.876516]
        }
        },
        {
        'type': 'Feature',
        'properties': {
        'year': 2017,
        'icon': 'training',
        'label': 'This is a label',
        'description': 'Phasellus ac eros ligula. In congue diam nec eleifend vulputate.'
        },
        'geometry': {
        'type': 'Point',
        'coordinates': [14.007481, 12.876516]
        }
        }
        ]
        };
      let self = this;
      map.addSource('places', {
        'type': 'geojson',
        'data': places
      });
      places.features.forEach(function (feature) {
        var symbol = feature.properties['icon'];
        var layerID = 'poi-' + symbol;
        
        // Add a layer for this symbol type if it hasn't been added already.
        if (!map.getLayer(layerID)) {
          map.addLayer({
            'id': layerID,
            'type': 'symbol',
            'source': 'places',
            'layout': {
            'icon-image': symbol,
            'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.2, 3, 0.3, 5, 0.3, 8, 0.4],
            'icon-allow-overlap': true,
            // 'text-field': ['get', 'label'],
            // 'text-size': 10,
            // 'text-variable-anchor': ['top', 'bottom', 'left', 'right']
          },
            'filter': ['==', 'icon', symbol]
          });
          // map.on('mousemove', layerID, function (e) {
          //   var label = e.features[0].properties.label;
          //   var coordinates = e.features[0].geometry.coordinates.slice();
            
          //   while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
          //     coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
          //   }
            
          //   new mapboxgl
          //     .setLngLat(coordinates)
          //     .setHTML(label)
          //     .addTo(map);

          // })
          map.on('click', layerID, function (e) {
            var coordinates = e.features[0].geometry.coordinates.slice();
            var image = '<div class="Image" style="background-image: url(https://www.plan-international.fr/sites/default/files/styles/blog_index/public/field/field_image_listing/appel_a_projets.jpg?itok=z-hc_lGo);"></div>';
            var infrastructure = '<h3>' + e.features[0].properties.label + '</h3>'
            let icon = e.features[0].properties.icon;
            var subtype = '<span class="subtype ' + icon + '" style="background:' + self.$store.state.categories[icon].color + '">' + icon + '</span>'
            var description = '<p>' + e.features[0].properties.description + '</p>';

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup()
              .setLngLat(coordinates)
              .setHTML(image + infrastructure + subtype + description)
              .addTo(map);

            map.flyTo({
              speed: 0.35,
              center: e.features[0].geometry.coordinates,
              essential: true
            });
          });
          
          // Add checkbox and label elements for the layer.
          // var input = document.createElement('input');
          // input.type = 'checkbox';
          // input.id = layerID;
          // input.checked = true;
          // filterGroup.appendChild(input);
          
          // var label = document.createElement('label');
          // label.setAttribute('for', layerID);
          // label.textContent = symbol;
          // filterGroup.appendChild(label);
          
          // When the checkbox changes, update the visibility of the layer.
          // input.addEventListener('change', function (e) {
          //   map.setLayoutProperty(
          //     layerID,
          //     'visibility',
          //     e.target.checked ? 'visible' : 'none'
          //   );
          // });
        }
      });
      
      this.$store.commit('updateMap', map)
    }
  }
}
</script>

<style lang="less">
@import "../assets/less/var";

#map {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0;
  left: 0;
}

.mapboxgl-canvas {
  width: 100%;
  min-width: 100%;
}
.mapboxgl-popup {
  z-index: 3;
}
.mapboxgl-popup-content {
  padding: 0;
  overflow: hidden;
  border-radius: 10px;
  box-shadow: 0 5px 21px -3px rgb(178 204 226);

  h3 {
    font-family: @font-primary;
    font-size: 1.6em;
    font-weight: 100;
  }
  .Image {
    width: 100%;
    height: 140px;
    background-size: cover;
    background-position: center center;
    background-repeat: no-repeat;

    & ~ * {
      margin: 10px;
    }
  }

  .subtype {
    padding: 3px 6px;
    border-radius: 5px;
    color: white;
  }

  .mapboxgl-popup-close-button {
    background: white;
    margin: 0;
    padding: 5px 11px;
    border-radius: 0px 0px 0px 17px;
    outline: none;
  }
}
</style>
