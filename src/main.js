import Vue from 'vue'
import App from './App.vue'
import { Icon }  from 'leaflet'
import * as Vue2Leaflet from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'


Vue.component('l-map', Vue2Leaflet.LMap)
Vue.component('l-marker',Vue2Leaflet.LMarker)
Vue.component('l-tile-layer', Vue2Leaflet.LTileLayer)
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
    iconUrl: require('leaflet/dist/images/marker-icon.png'),
    shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});


Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')
