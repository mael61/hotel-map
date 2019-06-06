<template>

    <div class="container">
        <div class="row" style="height: 500px; ">
            <div class="col-sm" >
                <input v-model="address" placeholder="entrer une adresse">
                <button v-on:click="search">valider</button>
                <!--      {{ locate}}-->
                <l-map
                        :zoom="zoom"
                        :center="center"
                        @update:zoom="zoomUpdated"
                        @update:center="centerUpdated"
                        @update:bounds="boundsUpdated">
                    <l-tile-layer :url="url"></l-tile-layer>
                    <l-marker :lat-lng="[hotel.latitude,hotel.longitude]" v-for=" hotel in hotels">
                    <l-popup>
                        <div>
                           <div> <strong>{{hotel.name}}</strong></div>
                            <div>{{hotel.adresse}}</div>
                            <hr>
                            <div>{{hotel.distance}} km</div>
                        </div>
                    </l-popup>
                    </l-marker>
                </l-map>
            </div>

        <div class="col-sm " style="height: 500px;overflow-y: scroll;" >
            <div class="card" v-for="hotel in hotels">
                <h5 class="card-title">{{hotel.name}}</h5>
                <p class="card-text">{{hotel.adresse}}.</p>
                <p class="card-text">{{hotel.distance}} km</p>
            </div>
        </div>
        </div>
    </div>
</template>

<script>
    import axios from 'axios';

    export default {
        data() {
            return {
                url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
                zoom: 17,
                center: [47.211978, -1.5481],
                bounds: null,
                locate: '',
                address: '',
                markers: [],
                hotels: []
            };
        },
        methods: {
            // https://www.geodatasource.com/developers/javascript


            sortHotels(array) {
                return array.sort((a,b) => a.distance - b.distance)
            },


                distance(lat1, lon1, lat2, lon2, unit) {
                if ((lat1 == lat2) && (lon1 == lon2)) {
                    return 0;
                } else {
                    var radlat1 = Math.PI * lat1 / 180;
                    var radlat2 = Math.PI * lat2 / 180;
                    var theta = lon1 - lon2;
                    var radtheta = Math.PI * theta / 180;
                    var dist = Math.sin(radlat1) * Math.sin(radlat2) + Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
                    if (dist > 1) {
                        dist = 1;
                    }
                    dist = Math.acos(dist);
                    dist = dist * 180 / Math.PI;
                    dist = dist * 60 * 1.1515;
                    if (unit == "K") {
                        dist = dist * 1.609344
                    }
                    if (unit == "N") {
                        dist = dist * 0.8684
                    }
                    return dist;
                }
            },
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
                        this.centerUpdated([this.locate.coordinates[1], this.locate.coordinates[0]])
                        // this.marker = [this.locate.coordinates[1],this.locate.coordinates[0]]

                        this.searchHotel(this.locate.coordinates[1], this.locate.coordinates[0])
                        // this.markers.push([this.locate.coordinates[1],this.locate.coordinates[0]])
                    })
            },
            searchHotel: function (lat, long) {
                //5510z est le naf pour les hotels
                axios.get('https://entreprise.data.gouv.fr/api/sirene/v1/near_point/?lat=' + lat + '&long=' + long + '&activite_principale=5510Z&per_page=100')
                    .then(response => {
                        // this.hotels =response.data.etablissements
                        response.data.etablissements.forEach(function (OneHotel) {
                            this.markers.push([OneHotel.latitude, OneHotel.longitude])
                            var distance = this.distance(this.locate.coordinates[1], this.locate.coordinates[0], OneHotel.latitude, OneHotel.longitude, "K")
                            var Hotel = {
                                name: OneHotel.l1_normalisee,
                                adresse: OneHotel.geo_adresse,
                                latitude: OneHotel.latitude,
                                longitude: OneHotel.longitude,
                                distance: distance,
                                rechercheLat: this.locate.coordinates[1],
                                rechercheLong: this.locate.coordinates[0]
                            }

                            this.hotels.push(Hotel)
                        }.bind(this))
                        this.hotels = this.sortHotels(this.hotels)
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
        height: 50vh;
    }

</style>
