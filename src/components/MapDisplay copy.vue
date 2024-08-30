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
import api from "../api.js";
// import Swal from "sweetalert2";

export default {
  name: "MapDisplay",
  props: {
    destinations: {
      type: Array,
      default: () => [],
    },

    distancesAndDurations: {
      type: Object,
      required: true,
    },

    totalDistance: Number,
    totalTime: Number,
    totalFuelNeeded: Number,
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
    };
  },
  mounted() {
    this.initMap();
  },

  watch: {
    destinations: {
      handler() {
        this.updateMap();
      },
      deep: true,
    },
  },
  methods: {
    initMap() {
      //   this.map = L.map("map").setView([51.505, -0.09], 13);
      this.map = L.map("map").setView([0, 0], 2);

      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(this.map);

      this.map.on("click", this.handleMapClick);

      this.updateMap();
    },

    handleMapClick(e) {
      const { lat, lng } = e.latlng;
      this.newDestination.latitude = lat;
      this.newDestination.longitude = lng;
      this.showForm = true; // Show the form/modal to capture destination details
    },
    closeForm() {
      this.showForm = false; // Hide the form/modal
    },

    async submitNewDestination() {
      // Here you can make an API call to save the new destination
      // Example:
      try {
        // Assume `api` is a service you use to interact with your backend
        await api.post("/destinations", this.newDestination);
        this.$emit("destination-added", this.newDestination); // Notify parent component
        this.closeForm();
      } catch (error) {
        console.error("Failed to add destination:", error);
      }
    },

    // updateMap() {
    //   if (!this.map) return;

    //   // Clear existing markers
    //   this.map.eachLayer((layer) => {
    //     if (layer instanceof L.Marker) {
    //       this.map.removeLayer(layer);
    //     }
    //   });

    //   // Add new markers
    //   const latLngs = this.destinations
    //     .map((destination) => {
    //       const lat = parseFloat(destination.latitude);
    //       const lng = parseFloat(destination.longitude);

    //       if (!isNaN(lat) && !isNaN(lng)) {
    //         const icon = L.icon({
    //           iconUrl: "https://unpkg.com/leaflet/dist/images/marker-icon.png",
    //           iconSize: [25, 41], // size of the icon
    //           iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
    //           popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
    //           shadowUrl: "https://unpkg.com/leaflet/dist/images/marker-shadow.png",
    //           shadowSize: [41, 41], // size of the shadow
    //         });

    //         L.marker([lat, lng], { icon: icon }).addTo(this.map).bindPopup(`<b>${destination.name}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
    //         return [lat, lng];
    //       } else {
    //         console.warn(`Invalid coordinates for destination: ${destination.name}`);
    //         return null;
    //       }
    //     })
    //     .filter((latLng) => latLng !== null);

    //   // Adjust map view to fit all markers
    //   if (latLngs.length) {
    //     const bounds = L.latLngBounds(latLngs);
    //     this.map.fitBounds(bounds);
    //   }
    // },

    updateMap() {
      if (!this.map) {
        console.error("Map instance is not available");
        return;
      }

      // Clear existing markers and polylines
      this.map.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Polyline) {
          console.log("Removing layer:", layer);
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

            console.log(`Adding marker at [${lat}, ${lng}] with name: ${destination.name}`);
            L.marker([lat, lng], { icon: icon }).addTo(this.map).bindPopup(`<b>${destination.name}</b><br>Lat: ${lat}<br>Lng: ${lng}`);
            return [lat, lng];
          } else {
            console.warn(`Invalid coordinates for destination: ${destination.name}`);
            return null;
          }
        })
        .filter((latLng) => latLng !== null);

      //   console.log("LatLngs for markers:", latLngs);

      // Draw polylines between destinations
      if (this.distancesAndDurations && this.distancesAndDurations.original) {
        console.log("Distances and Durations data:", this.distancesAndDurations.original);

        this.distancesAndDurations.original.forEach((entry) => {
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
      if (latLngs.length) {
        const bounds = L.latLngBounds(latLngs);
        console.log("Fitting map to bounds:", bounds);
        this.map.fitBounds(bounds);
      } else {
        console.warn("No latLngs available to fit bounds");
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
