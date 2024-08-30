<template>
  <div id="map" style="height: 500px"></div>

  <!-- Modal to add new destination -->
  <div v-if="showForm" class="modal fade show" tabindex="-1" style="display: block">
    <div class="modal-dialog">
      <form @submit.prevent="submitNewDestination">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">Add New Destination</h5>
            <button type="button" class="btn-close" @click="closeForm"></button>
          </div>
          <div class="modal-body">
            <div class="mb-3">
              <label for="destinationName" class="col-form-label">Destination Name:</label>
              <input type="text" class="form-control" id="destinationName" v-model="newDestination.name" required />
            </div>
            <div class="mb-3">
              <label for="destinationLatitude" class="col-form-label">Latitude:</label>
              <input type="text" class="form-control" id="destinationLatitude" v-model="newDestination.latitude" readonly />
            </div>
            <div class="mb-3">
              <label for="destinationLongitude" class="col-form-label">Longitude:</label>
              <input type="text" class="form-control" id="destinationLongitude" v-model="newDestination.longitude" readonly />
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" @click="closeForm">Close</button>
            <button type="submit" class="btn btn-primary">Add Destination</button>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<!-- <script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";

export default {
  name: "MapDisplay",
  props: {
    center: {
      type: Object,
      default: () => ({ lat: 51.505, lng: -0.09 }),
    },
    zoom: {
      type: Number,
      default: 13,
    },
    markers: {
      type: Array,
      default: () => [],
    },
  },
  mounted() {
    this.initMap();
  },
  methods: {
    initMap() {
      const map = L.map("map").setView([this.center.lat, this.center.lng], this.zoom);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      this.markers.forEach((marker) => {
        L.marker([marker.lat, marker.lng])
          .addTo(map)
          .bindPopup(marker.name || "No name")
          .openPopup();
      });
    },
  },
};
</script> -->

<script>
import L from "leaflet";
import "leaflet/dist/leaflet.css";
// import Swal from "sweetalert2";
// import { toRaw } from "vue";
import { nextTick } from "vue";
import eventBus from "../eventBus";

export default {
  name: "MapDisplay",
  props: {
    destinations: {
      type: Array,
      default: () => [],
    },
    pois: {
      type: Array,
      default: () => [],
    },

    distancesAndDurations: {
      type: Object,
      required: true,
    },

    totalDistance: {
      type: Number,
      required: true, // Optional, but ensures the prop is passed
    },
    totalTime: {
      type: Number,
      required: true,
    },
    totalFuelNeeded: {
      type: Number,
      required: true,
    },

    fetchDestinations: Function,
  },
  data() {
    return {
      map: null,

      newDestination: {
        name: "",
        latitude: "",
        longitude: "",
      },
      showForm: false,

      pointsOfInterest: [],
    };
  },
  mounted() {
    this.initMap();
    this.fetchPOIs();
  },

  watch: {
    destinations: {
      async handler() {
        await this.updateMap();
        await nextTick();
        // await this.fetchPOIs();
      },
      deep: true,
    },
  },
  methods: {
    async initMap() {
      //   this.map = L.map("map").setView([51.505, -0.09], 13);
      this.map = L.map("map").setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      })
        .addTo(this.map)
        .openPopup();

      this.map.on("click", this.handleMapClick);

      //   await this.updateMap();
      // Delay updateMap until the map is fully initialized

      //   await nextTick();
      this.map.whenReady(async () => {
        this.updateMap();
      });
    },

    handleMapClick(e) {
      const { lat, lng } = e.latlng;
      this.newDestination.latitude = lat;
      this.newDestination.longitude = lng;
      this.showForm = true;
    },

    closeForm() {
      this.showForm = false; // Hide the form/modal
    },

    async submitNewDestination() {
      // Validate input data
      if (!this.newDestination.name || !this.newDestination.latitude || !this.newDestination.longitude) {
        console.error("Invalid destination data");
        return;
      }

      try {
        // Generate a unique ID for the new destination
        const id = "_" + Math.random().toString(36).substr(2, 9);

        // Retrieve existing destinations from local storage
        const storedDestinations = JSON.parse(localStorage.getItem("destinations")) || [];

        // Add the new destination with the generated ID
        storedDestinations.push({ ...this.newDestination, id });

        // Save the updated list of destinations to local storage
        localStorage.setItem("destinations", JSON.stringify(storedDestinations));

        // Reset the new destination form
        this.newDestination = { name: "", latitude: "", longitude: "" };

        // Notify the parent component

        this.fetchDestinations();
        // Optionally, close the form
        this.closeForm();
      } catch (error) {
        console.error("Failed to add destination:", error);
      }
    },

    async updateMap() {
      if (!this.map) {
        console.error("Map instance is not available");
        return;
      }

      // Clear existing markers and polylines

      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          //   console.log("Removing layer:", layer);
          this.map.removeLayer(layer);
        }
      });

      //   console.log("LatLngs for markers:", this.destinations);
      // Add markers for each destination
      const latLngs = this.destinations
        .map((destination) => {
          const lat = parseFloat(destination.latitude);
          const lng = parseFloat(destination.longitude);

          if (!isNaN(lat) && !isNaN(lng)) {
            const icon = L.icon({
              iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
              iconSize: [25, 41],
              iconAnchor: [12, 41],
              popupAnchor: [1, -34],
              shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
              shadowSize: [41, 41],
            });

            // console.log(`Adding marker at [${lat}, ${lng}] with name: ${destination.name}`);
            L.marker([lat, lng], { icon: icon }).addTo(this.map).bindPopup(`<b>${destination.name}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
            return [lat, lng];
          } else {
            console.warn(`Invalid coordinates for destination: ${destination.name}`);
            return null;
          }
        })
        .filter((latLng) => latLng !== null);

      await nextTick();
      //   const rawData = toRaw(this.distancesAndDurations);
      const rawData = JSON.parse(localStorage.getItem("distancesAndDurations")) || [];
      // Draw polylines between destinations

      if (rawData && rawData.length > 0) {
        // console.log("LatLngs for markers by tofunmi:", rawData);
        rawData.forEach((entry) => {
          const fromDest = this.destinations.find((dest) => dest.name === entry.from);
          const toDest = this.destinations.find((dest) => dest.name === entry.to);

          if (fromDest && toDest) {
            const fromLatLng = [parseFloat(fromDest.latitude), parseFloat(fromDest.longitude)];
            const toLatLng = [parseFloat(toDest.latitude), parseFloat(toDest.longitude)];

            // console.log(`Drawing polyline from ${entry.from} to ${entry.to} with coordinates: ${fromLatLng} to ${toLatLng}`);
            console.log(`Popup content: <b>From: ${entry.from}</b><br>To: ${entry.to}<br>Distance: ${entry.distance_kilometers.toFixed(2)} km`);
            L.polyline([fromLatLng, toLatLng], {
              color: "blue",
              weight: 3,
              opacity: 0.7,
              dashArray: "5, 10",
            })
              .addTo(this.map)
              .bindPopup(
                `
                <b>Journey Summary:</b><br>
                Total Distance: ${this.totalDistance.toFixed(2)} km<br>
                Total Time: ${this.totalTime.toFixed(2)} hours<br>
                Total Fuel Needed: ${this.totalFuelNeeded.toFixed(2)} liters
                `
              )
              .openPopup();
            //   .bindPopup(`<b>From: ${entry.from}</b><br>To: ${entry.to}<br>Distance: ${entry.distance_kilometers.toFixed(2)} km`)
          } else {
            console.warn(`Missing destinations for polyline: ${entry.from} to ${entry.to}`);
          }
        });
      } else {
        console.warn("Distances and durations data is missing or empty");
      }

      // Adjust map view to fit all markers
      if (latLngs.length && latLngs.length > 0) {
        const bounds = L.latLngBounds(latLngs);
        // console.log("Fitting map to bounds:", bounds);
        this.map.fitBounds(bounds);
      } else {
        console.warn("No latLngs available to fit bounds");
      }
    },

    async fetchPOIs() {
      try {
        const response = await fetch("https://places-and-amenities.p.rapidapi.com/v1/places?lat1=48.3817&lon1=10.8728&limit=5&type=restaurant&lat2=48.3436&lon2=10.9301", {
          method: "GET",
          headers: {
            "x-rapidapi-key": this.apiKey,
            "x-rapidapi-host": "places-and-amenities.p.rapidapi.com",
          },
        });
        const data = await response.json();
        this.allPOIs = data.results || [];

        console.log("Adjust based on actual response structure", data);
        this.displayPOIsOnMap();
      } catch (error) {
        console.error("Failed to fetch POIs:", error);
      }
    },

    displayPOIsOnMap() {
      this.allPOIs.forEach((poi) => {
        L.marker([poi.latitude, poi.longitude]).addTo(this.map).bindPopup(`<b>${poi.name}</b><br>${poi.category}`).openPopup();
      });
    },
    beforeDestroy() {
      // Clean up event listeners
      eventBus.off("points-found");
      if (this.map) {
        this.map.off();
        this.map.remove();
        this.map = null;
      }
    },
  },
};
</script>

<style scoped>
/* Optional: Add styles for the map */
#map {
  height: 500px; /* Adjust as needed */
  width: 100%; /* Ensure it fills the container */
}

.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}
</style>
