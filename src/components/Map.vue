<template>
  <div id="map" v-if="$store.state.submissions">
    <mapbox
      :access-token="$store.state.mapboxToken"
      :map-options="{
        style: 'mapbox://styles/' + $store.state.style,
        center: [13, 12],
        zoom: 1.6,
        bearing: -6.5, // bearing in degrees
        padding: {
          right: 420
        }
      }"
      @map-init="initialized"
      @map-load="loaded"
      @map-move="updateMapMarkers"
      @map-zoomend="updateMapMarkersEnd"
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
    words,
    markers: {},
    markersOnScreen: {},
    source: 'places'
  }),
  watch: {
    '$store.state.style': function() {
      this.updateStyle()
    },
    '$store.state.lang': function() {
      this.translate()
    },
    '$store.state.minYearFilter': function() {
      if (this.$store.state.map != null) this.updateIcons()
    },
    '$store.state.maxYearFilter': function() {
      if (this.$store.state.map != null) this.updateIcons()
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
          this.$store.state.map.setFilter('poi-' + categ, this.getClusterFilter(categ));
        }
      }
    },
    updateStyle () {
      this.$store.state.map.setStyle('mapbox://styles/' + this.$store.state.style);
      let self = this;
      this.$store.state.map.once('styledata', function () {
        self.showIcons(self.$store.state.map)
      })
    },
    loaded(map) {
      this.$store.commit('updateMapLoaded')

      this.showIcons(map)
      window.addEventListener('resize', () => {
        map.resize()
      });
      setTimeout(function () {
        map.flyTo({
          center: [10, 12],
          zoom: 5,
          speed: 0.6,
          essential: true,
          bearing: 0,
          padding: {
            right: 420
          }
        });
      }, 250);
    },
    updateMapMarkersEnd: function () {
      this.$store.state.map.jumpTo({center: this.$store.state.map.getCenter()})
    },
    updateMapMarkers: function () {
      this.updateMarkers();
    },
    getMapFilter: function (category) {
      return [
        'all',
        ['>=', ['get', 'year'], this.$store.state.minYearFilter + +this.$store.state.minYearShown - 1],
        ['<', ['get', 'year'], this.$store.state.maxYearFilter + +this.$store.state.minYearShown - 1],
        ['==', ['get', 'icon'], category]
      ];
    },
    getClusterFilter: function (category) {
      // Hide points if clustered
      return [...this.getMapFilter(category), ['!=', ['get', 'cluster'], true]]
    },
    translate: function () {
      this.$store.state.map.setLayoutProperty('country-label', 'text-field', ['get', 'name_' + this.$store.state.lang]);
    },
    getBase64: async function (url) {
      // const PROXY_FOR_CORS = ""
      const PROXY_FOR_CORS = "https://cartong-cors-anywhere.herokuapp.com/"
      const koboImgUrl = "https://kc.humanitarianresponse.info/attachment/medium?media_file=" + this.$store.state.KOBO_USERNAME + "/attachments/";
      let fullUrl = PROXY_FOR_CORS + koboImgUrl + url;
      const koboReqOptions = {
        method: 'get',
        url: fullUrl,
        headers: {
          Authorization: this.$store.state.AUTH_TOKEN,
          'x-requested-with': 'XMLHttpRequest'
        },
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
            if (!map.hasImage(category)) map.addImage(category, image);
        });
      }

      var geojson = [];
      Array.prototype.forEach.call(this.$store.state.submissions , function(line) {
        geojson.push({
          'properties': {
            'id': line.id,
            'year': line.year,
            'icon': line.icon,
            'label': line.label,
            'type_en': line.type.en,
            'type_fr': line.type.fr,
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

      // Store popup to reuse it
      this.$store.commit('updateLabelPopup', labelPopup)

      var places = {
        'type': 'FeatureCollection',
        'features': geojson
      };
      let self = this;

      // Remove layers and source if they already exists
      if (typeof this.$store.state.map.getLayer('poi-education') !== 'undefined') this.$store.state.map.removeLayer('poi-education');
      if (typeof this.$store.state.map.getLayer('poi-health') !== 'undefined') this.$store.state.map.removeLayer('poi-health');
      if (typeof this.$store.state.map.getLayer('poi-youth-organizations') !== 'undefined') this.$store.state.map.removeLayer('poi-youth-organizations');

      // Cluster filters
      var education =          this.getMapFilter('education');
      var health =             this.getMapFilter('health');
      var youthOrganizations = this.getMapFilter('youth-organizations');

      if (!map.getSource(this.source)) {
        map.addSource(this.source, {
          'type': 'geojson',
          'data': places,
          cluster: true,
          clusterMaxZoom: 12, // Max zoom to cluster points on
          tolerance: 0,
          clusterProperties: {
            // keep separate counts for each category in a cluster
            'education':          ['+', ['case', education, 1, 0]],
            'health':             ['+', ['case', health, 1, 0]],
            'youthOrganizations': ['+', ['case', youthOrganizations, 1, 0]]
          }
        });
      }

      places.features.forEach(function (feature) {
        var symbol = feature.properties['icon'];
        var layerID = 'poi-' + symbol;

        // Add a layer for this symbol type if it hasn't been added already.
        if (typeof map.getLayer(layerID) === 'undefined') {
          map.addLayer({
            'id': layerID,
            'type': 'symbol',
            'source': self.source,
            'layout': {
              'icon-image': symbol,
              'icon-size': ['interpolate', ['linear'], ['zoom'], 1, 0.15, 3, 0.25, 5, 0.25, 8, 0.25, 9, 0.3],
              'icon-allow-overlap': true
            },
            'filter': self.getClusterFilter(symbol)
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

          // Reset event listeners if they already exist
          map.off('click', layerID, self.showPopup);
          map.on('click', layerID, self.showPopup);
        }
      });

      this.$store.commit('updateMap', map)
    },
    updateMarkers() {
      var map = this.$store.state.map;
      var newMarkers = {};
      var features = map.querySourceFeatures(this.source);
      var self = this;

      // for every cluster on the screen, create an HTML marker for it (if we didn't yet),
      // and add it to the map if it's not there already
      for (var i = 0; i < features.length; i++) {
        var coords = features[i].geometry.coordinates;
        var props = features[i].properties;
        if (!props.cluster) continue;
        var id = props.cluster_id;
        var marker = this.markers[id];

        if (!marker) {
          var el = this.createDonutChart(props, coords);
          marker = this.markers[id] = new mapboxgl.Marker({
            element: el
          }).setLngLat(coords);

          // On cluster click, zoom to it's extent points
          marker.getElement().addEventListener('click', (e) => {

            // SVG Marker element
            let svg = e.currentTarget.lastChild;

            // Retrieve clicked cluster id and coordinates
            let clusterId = +svg.getAttribute('data-id');
            let coordinates = [
              parseFloat(svg.getAttribute('coords-x')),
              parseFloat(svg.getAttribute('coords-y'))
            ];

            // Zoom on cluster expansion zoom extent
            map.getSource(self.source).getClusterExpansionZoom(
              clusterId,
              function (err, zoom) {
                if (err) return;
                if (!zoom) return;
                map.easeTo({
                  center: coordinates,
                  zoom: zoom + 1.1
                });
              }
            );
          });
        }
        newMarkers[id] = marker;

        // If the cluster is not on the screen show it
        if (!this.markersOnScreen[id]) marker.addTo(map);
      }
      // for every marker we've added previously, remove those that are no longer visible
      for (id in this.markersOnScreen) {
        if (!newMarkers[id]) this.markersOnScreen[id].remove();
      }
      this.markersOnScreen = newMarkers;
    },

    // code for creating an SVG donut chart from feature properties
    createDonutChart(props, coords) {
      var colors = ['#00843d','#0072ce','#e17800'];
      var offsets = [];
      var counts = [
        this.$store.state.categories['education'].shown ? props.education : 0,
        this.$store.state.categories['health'].shown ? props.health : 0,
        this.$store.state.categories['youth-organizations'].shown ? props.youthOrganizations : 0
      ];

      var total = 0;
      for (var i = 0; i < counts.length; i++) {
        offsets.push(total);
        total += counts[i];
      }
      var fontSize =
      total >= 1000 ? 22 : total >= 100 ? 20 : total >= 10 ? 18 : 16;
      var r = total >= 1000 ? 50 : total >= 100 ? 32 : total >= 10 ? 24 : 18;
      var r0 = Math.round(r * 0.6);
      var w = r * 2;

      var html =
      '<div><svg data-id="' + props.cluster_id + '" coords-x="'+ coords[0] +'" coords-y="'+ coords[1] +'" width="' + w + '" height="' + w + '" viewbox="0 0 ' + w + ' ' + w +
      '" text-anchor="middle" style="font: ' + fontSize + 'px sans-serif; display: block">' +
      '<style>.text-cluster { fill: white; font-size: 12px; }</style>';

      for (i = 0; i < counts.length; i++) {
        html += this.donutSegment(
          offsets[i] / total,
          (offsets[i] + counts[i]) / total,
          r,
          r0,
          colors[i]
        );
      }

      html +=
      '<circle cx="' + r + '" cy="' + r + '" r="' + r0 + '" fill="rgba(0,0,0,0.6)" />' +
      '<text dominant-baseline="central" class="text-cluster" transform="translate(' +
      r + ', ' + r + ')">' + total.toLocaleString() + '</text>' +
      '</svg></div>';

      var el = document.createElement('div');
      el.innerHTML = html;
      return el.firstChild;
    },

    donutSegment(start, end, r, r0, color) {
      if (end - start === 1) end -= 0.00001;
      var a0 = 2 * Math.PI * (start - 0.25);
      var a1 = 2 * Math.PI * (end - 0.25);
      var x0 = Math.cos(a0),
      y0 = Math.sin(a0);
      var x1 = Math.cos(a1),
      y1 = Math.sin(a1);
      var largeArc = end - start > 0.5 ? 1 : 0;

      return [
        '<path d="M', r + r0 * x0, r + r0 * y0,
        'L', r + r * x0, r + r * y0,
        'A', r, r, 0, largeArc, 1, r + r * x1, r + r * y1,
        'L', r + r0 * x1, r + r0 * y1,
        'A', r0, r0, 0, largeArc, 0, r + r0 * x0, r + r0 * y0, '" fill="' + color + '" />'
      ].join(' ');
    },
    showPopup(e) {
      let map = this.$store.state.map;
      this.$store.state.labelPopup.remove();
      var coordinates = e.features[0].geometry.coordinates.slice();
      var image = "";

      if (e.features[0].properties.image !== undefined) {
        this.getBase64(e.features[0].properties.image).then(function(results) {
          let base64 = "data:image/jpg;base64," + Buffer.from(results.data, 'binary').toString('base64').replace(/(\r\n|\n|\r)/gm, "");
          let imageHtml = document.getElementsByClassName('Image')[0];
          imageHtml.style.backgroundImage = "url('" + base64 + "')";
        });

        image = '<div class="Image"><div class="lds-ring"><div></div><div></div><div></div><div></div></div></div>';
      }
      var infrastructure = '<h3>' + e.features[0].properties.label + '</h3>'
      let icon = e.features[0].properties.icon;
      var subtype = '<span class="subtype ' + icon + '" style="background:' + this.$store.state.categories[icon].color + '">' + words[this.$store.state.lang].category[icon] + '</span>'

      var type = "", lang = this.$store.state.lang;

      if (e.features[0].properties['type_' + lang] != 'null') {
        type = '<p>' + e.features[0].properties['type_' + lang] + '</p>';
      } else if (e.features[0].properties['type_en'] != 'null') {
        type = '<p>' + e.features[0].properties['type_en'] + '</p>';
      }

      // Ensure that if the map is zoomed out such that multiple
      // copies of the feature are visible, the popup appears
      // over the copy being pointed to.
      while (Math.abs(e.lngLat.lng - coordinates[0]) > 180) {
        coordinates[0] += e.lngLat.lng > coordinates[0] ? 360 : -360;
      }

      new mapboxgl.Popup({offset: 30})
        .setLngLat(coordinates)
        .setHTML(image + infrastructure + subtype + type)
        .addTo(map);

      map.flyTo({
        speed: 0.95,
        center: e.features[0].geometry.coordinates,
        essential: true,
        zoom: 14,
        padding: {
          right: 420
        }
      });
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
.mapboxgl-marker {
  cursor: zoom-in;
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
