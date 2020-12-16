<template>
  <div id="map" v-if="$store.state.submissions">
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
import { words } from '@/constants/lang'
import Mapbox from 'mapbox-gl-vue'
import * as Axios from 'axios'
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl'
 console.log(mapboxgl)
export default {
  name: 'Map',
  components: { Mapbox },
  computed: {
    lang: function () {
      return this.$store.state.lang
    }
  },
  data: () => ({
    words
  }),
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
        let categ = key;
        if (typeof this.$store.state.map.getLayer('poi-' + categ) !== 'undefined') {
          this.$store.state.map.setFilter('poi-' + categ, this.getMapFilter(categ));
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
          center: [8, 7],
          zoom: 4,
          speed: 1,
          essential: true,
          bearing: 0
        });
      });
    },
    getMapFilter: function (category) {
      return [
        'all',
        ['>=', 'year', this.$store.state.minYearFilter + +this.$store.state.minYearShown - 1],
        ['<', 'year', this.$store.state.maxYearFilter + +this.$store.state.minYearShown - 1]
        ,['==', 'icon', category]
      ];
    },
    translate: function () {
      this.$store.state.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_' + this.$store.state.lang]);
    },
    getBase64: async function (url) {
      const PROXY_FOR_CORS = "https://cors-anywhere.herokuapp.com/"
      const koboImgUrl = "https://kc.humanitarianresponse.info/attachment/medium?media_file=" + this.$store.state.KOBO_USERNAME + "/attachments/";
      let fullUrl = PROXY_FOR_CORS + koboImgUrl + url;
      const koboReqOptions = {
        method: 'get',
        url: fullUrl,
        headers: { Authorization: this.$store.state.AUTH_TOKEN },
        responseType: 'arraybuffer'
      }
      const koboRes = await Axios(koboReqOptions)
      return koboRes;
    },
    showIcons: function (map) {
      for (let key in this.$store.state.categories) {
        var path = require('../assets/img/icons/' + key + '.png');
        map.loadImage(
          path,
          function (error, image) {
            var category = key
            if (error) throw error;
            map.addImage(category, image);
        });
      }

      var geojson = [];
      Array.prototype.forEach.call(this.$store.state.submissions , function(line) {
        geojson.push({
          'type': 'Feature',
          'properties': {
            'year': line.year,
            'icon': line.icon,
            'label': line.label,
            'description': line.description,
            'image': line.image,
          },
          'geometry': {
          'type': 'Point',
          'coordinates': line.coords
          }
        })
      })


      var labelPopup = new mapboxgl.Popup({
        closeButton: false,
        offset: 28,
        className: 'LabelPopup'
      })
      var labelPopupFeature = "";

      var places = {
        'type': 'FeatureCollection',
        'features': geojson
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
            'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.25, 3, 0.35, 5, 0.35, 8, 0.45],
            'icon-allow-overlap': true,
            // 'text-field': ['get', 'label'],
            // 'text-size': 10,
            // 'text-variable-anchor': ['top', 'bottom', 'left', 'right']
          },
            'filter': self.getMapFilter(symbol)
          });

          map.on('mouseenter', layerID, (e) => {
            if (labelPopupFeature != e.features[0]) labelPopup.remove();
            map.getCanvas().style.cursor = 'pointer';
            var coordinates = e.features[0].geometry.coordinates.slice();
            labelPopup
              .setLngLat(coordinates)
              .setHTML(e.features[0].properties.label)
              .addTo(map);

            labelPopupFeature = e.features[0];
          })
          map.on('mouseleave', layerID, () => {
            map.getCanvas().style.cursor = ''
            labelPopup.remove();
          })

          map.on('click', layerID, function (e) {
            labelPopup.remove();
            var coordinates = e.features[0].geometry.coordinates.slice();
            var image = "";
            if (e.features[0].properties.image !== undefined) {
              self.getBase64(e.features[0].properties.image).then(function(results) {
                let base64 = "data:image/jpg;base64," + Buffer.from(results.data, 'binary').toString('base64').replace(/(\r\n|\n|\r)/gm, "");
                let imageHtml = document.getElementsByClassName('Image')[0];
                imageHtml.style.backgroundImage = "url('" + base64 + "')";
              });

              image = '<div class="Image"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>';
            }
            // var image = '<div class="Image" style="background-image: url(https://www.plan-international.fr/sites/default/files/styles/blog_index/public/field/field_image_listing/appel_a_projets.jpg?itok=z-hc_lGo);"></div>';
            var infrastructure = '<h3>' + e.features[0].properties.label + '</h3>'
            let icon = e.features[0].properties.icon;
            var subtype = '<span class="subtype ' + icon + '" style="background:' + self.$store.state.categories[icon].color + '">' + words[self.$store.state.lang].category[icon] + '</span>'

            var description = "";
            if (e.features[0].properties.description !== undefined) {
              description = '<p>' + e.features[0].properties.description + '</p>';
            }

            // Ensure that if the map is zoomed out such that multiple
            // copies of the feature are visible, the popup appears
            // over the copy being pointed to.
            while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
              coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
            }

            new mapboxgl.Popup({offset: 30})
              .setLngLat(coordinates)
              .setHTML(image + infrastructure + subtype + description)
              .addTo(map);

            map.flyTo({
              speed: 0.35,
              center: e.features[0].geometry.coordinates,
              essential: true
            });
          });
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
  min-width: 240px;
}

.LabelPopup {
  background: none;
  box-shadow: none !important;
  max-width: 160px;
  min-width: inherit;

  & > * {
    background: none;
    border: none;
    box-shadow: none !important;
    font-family: @font-primary;
    font-size: 1.2em;
    color: #444;
  }

  .mapboxgl-popup-content {
    animation: showLabel .15s ease-in forwards;
    opacity: 0;
    transform: translateY(5px);
    background: rgba(255,255,255,0.9);
    padding: 1px 6px;
    border-radius: @rad-box;
  }
}

@keyframes showLabel {
  0% {
    opacity: 0;
    transform: translateY(5px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}

.mapboxgl-popup-content {
  padding: 0;
  overflow: hidden;
  border-radius: @rad-box;
  box-shadow: 0 5px 21px -3px rgb(178 204 226);

  h3 {
    font-family: @font-primary;
    font-size: 1.6em;
    font-weight: 100;
    margin: 10px;
  }
  .Image {
    display: flex;
    flex-flow: row nowrap;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 140px;
    background-size: cover !important;
    background-position: center center !important;
    background-repeat: no-repeat !important;
    background-color: #ddd;

    &[style] {
      .lds-ring {
        display: none;
      }
    }

    & ~ * {
      margin: 10px;
    }
  }

  .subtype {
    padding: 3px 6px;
    border-radius: 5px;
    color: white;
    margin: 10px;
  }

  p {
    margin: 10px;
  }

  .mapboxgl-popup-close-button {
    background: white;
    margin: 0;
    padding: 5px 11px;
    border-radius: 0px 0px 0px 17px;
    outline: none;
  }
}
.lds-ring {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;
  transform-origin: center center;
  transform: scale(0.6);
}
.lds-ring div {
  box-sizing: border-box;
  display: block;
  position: absolute;
  width: 64px;
  height: 64px;
  margin: 8px;
  border: 8px solid #fff;
  border-radius: 50%;
  animation: lds-ring 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
  border-color: #fff transparent transparent transparent;
}
.lds-ring div:nth-child(1) {
  animation-delay: -0.45s;
}
.lds-ring div:nth-child(2) {
  animation-delay: -0.3s;
}
.lds-ring div:nth-child(3) {
  animation-delay: -0.15s;
}
@keyframes lds-ring {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
