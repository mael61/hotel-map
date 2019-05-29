<template>
<div >
  <mgl-map :accessToken="accessToken" :mapStyle="mapStyle" id="map" >
    </mgl-map>
    </div>
</template>

<script>


  import Mapbox from "mapbox-gl";
  import { MglMap  } from "vue-mapbox";

  export default {
    components: {
      MglMap,
    },
    data () {
      return {
        accessToken: 'pk.eyJ1IjoibWFlbG1haWxsYXJkIiwiYSI6ImNqdzlhZHR0ejBtbmMzeXFyM29rdWQxZ3cifQ.e4591TEg8Ms_2eYjP1wmhg', // your access token. Needed if you using Mapbox maps
        mapStyle: 'mapbox://styles/mapbox/streets-v11' // your map style

      };
    },
    created() {
      // We need to set mapbox-gl library here in order to use it in template
      this.mapbox = Mapbox;
    },

    mounted () {
      axios
              .get('https://api.coindesk.com/v1/bpi/currentprice.json')
              .then(response => (this.info = response))
    }

  }
</script>
<style>
  body { margin:0; padding:0; }
  #map { position:absolute; top:0; bottom:0; width:80%; }
</style>