<template>
  <div>
    <div class="container">
      <div class="row">
        <div class="col-md-6">
          <div class="card">
            <div class="card-header">
              <h5 style="float: left">Destinations</h5>
              <!-- <button @click="openAddDestination" class="btn btn-primary" style="float: right">Add Destination</button> -->
              <button @click="openModal" class="btn btn-primary" style="float: right">Add Destination</button>
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
                    <tr v-for="entry in distancesAndDurations.original" :key="entry">
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
                <!-- <MapDisplay :destinations="destinations" /> -->
                <!-- <MapDisplay :destinations="destinations" :distancesAndDurations="distancesAndDurations" @destination-added="handleDestinationAdded" /> -->

                <MapDisplay :destinations="destinations" :distancesAndDurations="distancesAndDurations" :totalDistance="totalDistance" :totalTime="totalTime" :totalFuelNeeded="totalFuelNeeded" @destination-added="handleDestinationAdded" />
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
  </div>
</template>

<script>
import api from "../api.js";
import Swal from "sweetalert2";
// import { Modal } from "bootstrap";
import MapDisplay from "./MapDisplay.vue";
import { VueDraggableNext } from "vue-draggable-next";

export default {
  components: {
    MapDisplay,
    draggable: VueDraggableNext,
  },
  data() {
    return {
      showForm: false,
      destinations: [],
      distancesAndDurations: [],
      newDestination: {
        name: "",
        latitude: "",
        longitude: "",
      },
      latitudeError: null,
      longitudeError: null,
      fuelEfficiency: 15,
      averageSpeed: 60,
    };
  },
  methods: {
    async fetchDestinations() {
      try {
        const response = await api.get("/destinations");
        console.log("Fetched destinations:", response.data); // Add this line
        this.destinations = response.data.destinations;
        this.distancesAndDurations = response.data.distancesAndDurations;
      } catch (error) {
        console.error("Failed to fetch destinations:", error);
      }
    },
    async deleteDestination(id) {
      if (confirm("Are you sure you want to delete this destination?")) {
        try {
          await api.delete(`/destinations/${id}`);
          this.fetchDestinations();
        } catch (error) {
          console.error("Failed to delete destination:", error);
        }
      }
    },

    openModal() {
      this.showForm = true; // Show the form/modal to capture destination details
    },
    closeForm() {
      this.showForm = false; // Hide the form/modal
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
        const response = await api.post("/destinations", this.newDestination);
        this.destinations.push(response.data);
        // Reset the new destination form
        this.newDestination = { name: "", latitude: "", longitude: "" };

        // Reset the form fields
        this.newDestination = { name: "", latitude: "", longitude: "" };

        // Close the modal
        this.closeForm();

        // Optionally, display a success message
        Swal.fire({
          icon: "success",
          title: "Destination Added",
          text: "The new destination has been added successfully!",
        });

        // this.$emit("save");
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
        const response = await api.post("/destinations/update-order", {
          //   order: this.destinations,
          order: this.destinations.map((dest) => parseInt(dest.id)),
        });
        console.log("Order updated successfully:", response.data);
      } catch (error) {
        console.error("Error updating order:", error.response?.data || error.message);
      }
    },

    async handleDestinationAdded(destination) {
      // Update the list of destinations in the parent component
      this.destinations.push(destination);
    },
  },
  mounted() {
    this.fetchDestinations();
  },

  computed: {
    totalDistance() {
      return (this.distancesAndDurations?.original || []).reduce((sum, entry) => sum + (entry.distance_kilometers || 0), 0);
    },
    totalTime() {
      return (this.distancesAndDurations?.original || []).reduce((sum, entry) => {
        // const duration = entry.duration_hours ?? entry.distance_kilometers / this.averageSpeed;
        const duration = entry.duration_hours ? parseFloat(entry.duration_hours) : entry.distance_kilometers / this.averageSpeed;
        return sum + duration;
      }, 0);
    },
    totalFuelNeeded() {
      return this.totalDistance / (this.fuelEfficiency || 1); // Prevent division by zero
    },

    journeySummary() {
      let totalDistance = 0;
      let totalTime = 0;
      let totalFuelNeeded = 0;
      const averageSpeed = 60; // Example: 60 km/h

      if (this.distancesAndDurations && this.distancesAndDurations.original) {
        this.distancesAndDurations.original.forEach((entry) => {
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

      console.log("Final totalTime", totalTime);
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
