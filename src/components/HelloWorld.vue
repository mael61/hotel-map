<template>

  <div style="height: 100%; width: 100%">
    <div>
      <input v-model="address" placeholder="entrer une adresse">
      <button v-on:click="search">valider</button>
      {{locate}}
      {{hotels}}
    </div>
    <div class="info" style="height: 15%">
      <span>Center: {{ center }}</span>

    </div>
    <l-map
            style="height: 80%; width: 100%"
            :zoom="zoom"
            :center="center"
            @update:zoom="zoomUpdated"
            @update:center="centerUpdated"
            @update:bounds="boundsUpdated"
    >
      <l-tile-layer :url="url"></l-tile-layer>
      <l-marker  :lat-lng="marker" v-for=" marker in markers"></l-marker>
    </l-map>
  </div>

</template>

<script>
    import axios from 'axios';
    export default {
        data() {
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 17,
                center: [0, 0],
                bounds: null,
                locate: '',
                address:'',
                markers: [],


                hotels: []
            };
        },
        methods: {
            addMarker(event) {
                this.markers.push(event.latlng);
            },
            zoomUpdated(zoom) {
                this.zoom = zoom;
            },
            centerUpdated(center) {
                this.center = center;
            },
            boundsUpdated(bounds) {
                this.bounds = bounds;
            },
            search: function () {
                axios.get('https://api-adresse.data.gouv.fr/search/?q=' + this.address)
                    .then(response => {
                        this.locate = response.data.features[0].geometry
                        this.centerUpdated([this.locate.coordinates[1],this.locate.coordinates[0]])
                        // this.marker = [this.locate.coordinates[1],this.locate.coordinates[0]]
                        console.log('test')
                        this.searchHotel(this.locate.coordinates[1],this.locate.coordinates[0])
                        // this.markers.push([this.locate.coordinates[1],this.locate.coordinates[0]])
                    })

            },
            addHotel(hotel){
                this.hotels.push(hotel)
            },

            searchHotel: function(lat,long){

                //5510z est le naf pour les hotels
                axios.get('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat='+lat+'&long='+long+'&activite_principale=5510Z')
                    .then(response => {
                        this.hotels =response.data.etablissements
                        this.hotels.forEach(function(hotel){
                            this.markers.push([hotel.latitude,hotel.longitude])
                        }.bind(this))

                    })
                    //


            }
        },



    }
</script>
<style>
  #app,
  l-map {
    position: relative;
    padding: 0;
    width: 600px;
    height: 600px;
  }

</style>
