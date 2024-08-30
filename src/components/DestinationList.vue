<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 style="float: left">Destinations</h5>
              <!-- <button @click="openAddDestination" class="btn btn-primary" style="float: right">Add Destination</button> -->
              <button @click="openModal2" class="btn btn-primary m-2" style="float: right">POI</button>
              <button @click="openModal" class="btn btn-primary m-2" style="float: right">Add Destination</button>
              <!-- <button style="float: right" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal" data-bs-whatever="@mdo">Add Destination</button> -->
            </div>
            <div class="card-body">
              <div class="row">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <!-- <th scope="col">S/N</th> -->
                        <th scope="col"></th>
                        <th scope="col">Name</th>
                        <th scope="col">Latitude</th>
                        <th scope="col">Longitude</th>
                        <!-- <th>Distance to Next</th>
                        <th>Duration to Next</th> -->
                        <th scope="col">Actions</th>
                      </tr>
                    </thead>
                    <draggable v-model="destinations" @end="onReorder" :options="{ animation: 200, handle: '.drag-handle' }" tag="tbody">
                      <tr v-for="destination in destinations" :key="destination.id">
                        <!-- <th scope="row">{{ index + 1 }}</th> -->
                        <td class="drag-handle">
                          <i class="fa fa-grip-vertical"></i>
                        </td>
                        <td>{{ destination.name }}</td>
                        <td>{{ destination.latitude }}</td>
                        <td>{{ destination.longitude }}</td>

                        <!-- <td v-if="index < distancesAndDurations.length">{{ distancesAndDurations[index].distance.kilometers.toFixed(2) }} km</td>
                        <td v-if="index < distancesAndDurations.length">{{ distancesAndDurations[index].duration.minutes }} min</td> -->
                        <td>
                          <!-- <button type="button" class="btn btn-outline-primary m-2">Edit</button> -->
                          <button type="button" class="btn btn-outline-danger" @click="deleteDestination(destination.id)">
                            <i class="fa fa-trash"></i>
                          </button>
                        </td>
                      </tr>
                    </draggable>
                  </table>
                </div>
              </div>
            </div>

            <div class="card-header">
              <h5 style="float: left">Destination and Duration List</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="table-responsive">
                  <table class="table">
                    <thead>
                      <tr>
                        <th>From</th>
                        <th>To</th>
                        <th>Distance (km)</th>
                        <th>Distance (m)</th>
                        <th>Distance (mi)</th>
                      </tr>
                    </thead>
                    <tr v-for="entry in distancesAndDurations" :key="entry">
                      <td>{{ entry.from }}</td>
                      <td>{{ entry.to }}</td>
                      <td>{{ entry.distance_kilometers ? entry.distance_kilometers.toFixed(2) : "N/A" }} km</td>
                      <td>{{ entry.distance_meters ? entry.distance_meters.toFixed(2) : "N/A" }} m</td>
                      <td>{{ entry.distance_miles ? entry.distance_miles.toFixed(2) : "N/A" }} mi</td>
                    </tr>
                  </table>
                </div>
              </div>
            </div>

            <div class="card-header">
              <!-- <h5 style="float: left">Total Distance, Time, and Fuel List</h5> -->
              <h5 style="float: left">Journey Summary</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <table class="table">
                  <thead>
                    <tr>
                      <th>Total Distance</th>
                      <th>Total Time</th>
                      <th>Estimated Fuel Needed</th>
                    </tr>
                  </thead>
                  <tr>
                    <td>{{ journeySummary.totalDistance.toFixed(2) }} km</td>
                    <td>{{ journeySummary.totalTime.toFixed(2) }} hours</td>
                    <td>{{ journeySummary.totalFuelNeeded.toFixed(2) }} liters</td>
                  </tr>
                </table>
              </div>
            </div>
          </div>
        </div>

        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 style="float: left">Map</h5>
            </div>
            <div class="card-body">
              <div class="row">
                <MapDisplay v-if="totalDistance !== undefined && totalTime !== undefined && totalFuelNeeded !== undefined" :destinations="destinations" :distancesAndDurations="distancesAndDurations" :totalDistance="totalDistance" :totalTime="totalTime" :totalFuelNeeded="totalFuelNeeded" :pois="filteredPOIs" @destination-added="handleDestinationAdded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal to add new destination -->
    <div v-if="showForm" class="modal fade show" tabindex="-1" style="display: block">
      <!-- 9.052277278122045 -->
      <div class="modal-dialog">
        <form @submit.prevent="submitNewDestination">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Add New Destination</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeForm"></button>
            </div>
            <div class="modal-body">
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Destination Name:</label>
                <input type="text" class="form-control" id="destinationName" v-model="newDestination.name" required />
              </div>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Latitude:</label>
                <input type="text" class="form-control" id="destinationLatitude" v-model="newDestination.latitude" required />
              </div>
              <div class="mb-3">
                <label for="recipient-name" class="col-form-label">Longitude:</label>
                <input type="text" class="form-control" id="destinationLongitude" v-model="newDestination.longitude" required />
              </div>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="closeForm">Close</button>
              <button type="submit" class="btn btn-primary">Add Destination</button>
            </div>
          </div>
        </form>
      </div>
    </div>

    <div v-if="isVisible" class="modal fade show" tabindex="-1" style="display: block">
      <div class="modal-dialog">
        <form @submit.prevent="submitInterests">
          <div class="modal-content">
            <div class="modal-header">
              <h5 class="modal-title" id="exampleModalLabel">Points of Interest</h5>
              <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="closeForm2"></button>
            </div>
            <div class="modal-body">
              <label for="interests">Choose your interests:</label>
              <select id="interests" v-model="userInterests" multiple class="form-control">
                <option value="museum">Museums</option>
                <option value="park">Parks</option>
                <option value="restaurant">Restaurants</option>
                <option value="restaurant">Accommodation</option>
              </select>
            </div>
            <div class="modal-footer">
              <button type="button" class="btn btn-danger" data-bs-dismiss="modal" @click="closeForm2">Close</button>
              <button type="submit" class="btn btn-primary">Find Points of Interest</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import Swal from "sweetalert2";
// import { Modal } from "bootstrap";
import MapDisplay from "./MapDisplay.vue";
import { VueDraggableNext } from "vue-draggable-next";
import axios from "axios";
// import { toRaw } from "vue";
import eventBus from "../eventBus";

export default {
  components: {
    MapDisplay,
    draggable: VueDraggableNext,
  },

  data() {
    return {
      showForm: false,
      isVisible: false,
      destinations: [],
      distancesAndDurations: JSON.parse(localStorage.getItem("distancesAndDurations")) || [],
      pointsOfInterest: JSON.parse(localStorage.getItem("pointsOfInterest")) || [],
      filteredPointsOfInterest: [],
      newDestination: {
        name: "",
        latitude: "",
        longitude: "",
        id: null,
      },
      latitudeError: null,
      longitudeError: null,
      fuelEfficiency: 15,
      averageSpeed: 60,
    };
  },
  methods: {
    fetchDestinations() {
      try {
        // Load destinations and distances from local storage
        const storedDestinations = JSON.parse(localStorage.getItem("destinations")) || [];
        const storedDistancesAndDurations = JSON.parse(localStorage.getItem("distancesAndDurations")) || [];

        // Update the component state with the stored data
        this.destinations = storedDestinations;
        this.distancesAndDurations = {
          original: storedDistancesAndDurations,
        };

        console.log("Fetched destinations from localStorage:", storedDistancesAndDurations);
        // console.log("Fetched distances and durations from localStorage:", this.distancesAndDurations);
      } catch (error) {
        console.error("Failed to fetch destinations from localStorage:", error);
      }
    },

    async deleteDestination(id) {
      if (confirm("Are you sure you want to delete this destination?")) {
        try {
          // Remove the destination from the local destinations array
          this.destinations = this.destinations.filter((destination) => destination.id !== id);

          // Save the updated destinations array to local storage
          localStorage.setItem("destinations", JSON.stringify(this.destinations));

          // Optionally, you might want to clear distancesAndDurations if necessary
          // this.distancesAndDurations = { original: [] };
          // localStorage.setItem('distancesAndDurations', JSON.stringify([]));

          // Optionally, you can fetch updated distances if needed
          this.fetchDistancesAndDurations();

          console.log("Destination deleted successfully.");
        } catch (error) {
          console.error("Failed to delete destination:", error);
        }
      }
    },

    openModal() {
      this.showForm = true; // Show the form/modal to capture destination details
    },

    openModal2() {
      this.isVisible = true; // Show the form/modal to capture destination details
    },

    closeForm() {
      this.showForm = false; // Hide the form/modal
    },

    closeForm2() {
      this.isVisible = false; // Hide the form/modal
    },

    async submitInterests() {
      try {
        // Save user interests to local storage
        localStorage.setItem("userInterests", JSON.stringify(this.userInterests));

        // Fetch POIs from local storage
        const allPOIs = JSON.parse(localStorage.getItem(this.destinations)) || [];

        // Filter POIs based on user interests
        this.filteredPointsOfInterest = allPOIs.filter((poi) => this.userInterests.includes(poi.category));

        console.log("POIs to be displayed:", this.filteredPointsOfInterest);
        // Emit event with found points (if needed)
        eventBus.emit("points-found", this.filteredPointsOfInterest);

        this.closeForm2();

        // display a success message
        Swal.fire({
          icon: "success",
          title: "Points of Interest",
          text: "Points of Interest has been added successfully!",
        });
      } catch (error) {
        console.error("Failed to fetch points of interest:", error);
      }
    },

    async submitNewDestination() {
      this.latitudeError = null;
      this.longitudeError = null;

      const latitude = parseFloat(this.newDestination.latitude);
      const longitude = parseFloat(this.newDestination.longitude);

      if (isNaN(latitude) || latitude < -90 || latitude > 90) {
        Swal.fire({
          icon: "error",
          title: "Invalid Latitude",
          text: "Latitude must be a number between -90 and 90.",
        });
        return;
      }

      if (isNaN(longitude) || longitude < -180 || longitude > 180) {
        Swal.fire({
          icon: "error",
          title: "Invalid Longitude",
          text: "Longitude must be a number between -180 and 180.",
        });
        return;
      }

      try {
        // Fetch existing destinations from local storage
        const storedDestinations = JSON.parse(localStorage.getItem("destinations")) || [];

        let ids = "_" + Math.random().toString(36).substr(2, 9);

        // console.log("Saving", ids);
        // Add new destination to the list
        storedDestinations.push({ ...this.newDestination, id: ids });

        // Save updated list to local storage
        localStorage.setItem("destinations", JSON.stringify(storedDestinations));

        // Update the destinations array in the Vue component
        this.destinations = storedDestinations;

        // Reset the new destination form
        this.newDestination = { name: "", latitude: "", longitude: "" };

        // Close the modal
        this.closeForm();

        // Optionally, display a success message
        Swal.fire({
          icon: "success",
          title: "Destination Added",
          text: "The new destination has been added successfully!",
        });

        // Optionally, you can manually trigger any method that updates the display or fetches data if needed
        // e.g., this.fetchDestinations(); (Not required if local storage is the sole source of truth)

        this.fetchDestinations();
      } catch (error) {
        console.error("Failed to add destination:", error);

        let errorMessage = "Failed to add destination. Please try again.";

        if (error.response) {
          // The request was made and the server responded with a status code
          errorMessage = `Error: ${error.response.data.message || "Unexpected server error."}`;
        } else if (error.request) {
          // The request was made but no response was received
          errorMessage = "No response from server. Please check your network connection.";
        } else {
          // Something happened in setting up the request that triggered an Error
          errorMessage = `Request error: ${error.message}`;
        }

        Swal.fire({
          icon: "error",
          title: "Error",
          text: errorMessage,
        });
      }
    },

    async onReorder() {
      try {
        // const order = this.destinations.map((dest) => parseInt(dest.id));
        // const response = await api.post("/destinations/update-order", { order });

        // Update local storage
        localStorage.setItem("destinations", JSON.stringify(this.destinations));

        // console.log("Order updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating order:", error.response?.data || error.message);
      }
    },

    async handleDestinationAdded(destination) {
      // Update the list of destinations in the parent component
      this.destinations.push(destination);
    },

    async calculateDistancesAndDurations() {
      this.distancesAndDurations = []; // Reset the results array

      try {
        // Iterate over the destinations array
        for (let i = 0; i < this.destinations.length; i++) {
          for (let j = i + 1; j < this.destinations.length; j++) {
            const start = this.destinations[i];
            const end = this.destinations[j];

            const response = await axios.get("https://distance-calculator8.p.rapidapi.com/calc", {
              params: {
                startLatitude: start.latitude,
                startLongitude: start.longitude,
                endLatitude: end.latitude,
                endLongitude: end.longitude,
              },
              headers: {
                "x-rapidapi-host": "distance-calculator8.p.rapidapi.com",
                "x-rapidapi-key": "3e7ec94b06mshb1a68ea31726312p10f83ajsn327bfd377d85", // Replace with your actual API key
              },
            });

            const data = response.data;
            const distance = data.body.distance || {};

            this.distancesAndDurations.push({
              from: start.name,
              to: end.name,
              distance_kilometers: distance.kilometers || "N/A",
              distance_meters: distance.meters || "N/A",
              distance_miles: distance.miles || "N/A",
            });

            // Step 2: Store the updated array in localStorage
            localStorage.setItem("distancesAndDurations", JSON.stringify(this.distancesAndDurations));
          }
        }

        // console.log("Calculated distances and durations:", this.distancesAndDurations);
      } catch (error) {
        console.error("Failed to calculate distances and durations:", error);
      }
    },
  },
  mounted() {
    this.fetchDestinations();
    this.calculateDistancesAndDurations();
  },

  computed: {
    totalDistance() {
      const convertDistancesAndDurations = JSON.parse(localStorage.getItem("distancesAndDurations"));

      if (Array.isArray(convertDistancesAndDurations) && convertDistancesAndDurations.length > 0) {
        const total = convertDistancesAndDurations.reduce((sum, entry) => {
          const distance = parseFloat(entry.distance_kilometers) || 0;
          console.log(`Processing Entry:`, entry);
          console.log(`Parsed Distance: ${distance}`);
          return sum + distance;
        }, 0);

        console.log("Total Distance Calculated:", total);
        return total;
      } else {
        console.log("No valid distances or empty array, returning 0");
      }

      return 0;
    },

    totalTime() {
      // Convert the distancesAndDurations array to raw data
      const convertDistancesAndDurations = JSON.parse(localStorage.getItem("distancesAndDurations"));

      if (convertDistancesAndDurations && convertDistancesAndDurations.length > 0) {
        // Calculate the total time by summing the duration of each journey
        return convertDistancesAndDurations.reduce((sum, entry) => {
          const duration = entry.duration_hours ? parseFloat(entry.duration_hours) : entry.distance_kilometers / this.averageSpeed;
          return sum + duration;
        }, 0);
      }
      return 0;
    },

    totalFuelNeeded() {
      return this.totalDistance / (this.fuelEfficiency || 1); // Prevent division by zero
    },

    journeySummary() {
      let totalDistance = 0;
      let totalTime = 0;
      let totalFuelNeeded = 0;
      const averageSpeed = 60; // Example: 60 km/h

      if (this.distancesAndDurations && this.distancesAndDurations.length > 0) {
        this.distancesAndDurations.forEach((entry) => {
          totalDistance += entry.distance_kilometers;

          // Calculate duration based on provided hours or fallback to distance/speed
          const duration = entry.duration_hours ? parseFloat(entry.duration_hours) : entry.distance_kilometers / averageSpeed;
          console.log("duration", duration);

          // Add the duration to the total time
          totalTime += duration;
          console.log("totalTime", totalTime);
        });

        // Calculate total fuel needed
        totalFuelNeeded = totalDistance / this.fuelEfficiency;
      }

      //   console.log("Final totalTime", totalTime);
      return {
        totalDistance,
        totalTime,
        totalFuelNeeded,
      };
    },
  },
};
</script>

<style scoped>
.modal.show {
  display: block;
  background: rgba(0, 0, 0, 0.5);
}

.table th,
.table td {
  text-align: center; /* Center align text if needed */
}

.drag-handle {
  cursor: grab;
  text-align: center; /* Center the icon */
}

.drag-handle i {
  font-size: 1.2rem; /* Adjust icon size as needed */
}
</style>
