import Vue from 'vue'
import App from './App.vue'
import { Icon }  from 'leaflet'
import * as Vue2Leaflet from 'vue2-leaflet'

// this part resolve an issue where the markers would not appear
delete Icon.Default.prototype._getIconUrl;

Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png')
});


delete Icon.Default.prototype._getIconUrl;

Vue.component('l-map', Vue2Leaflet.LMap)
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer)


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
