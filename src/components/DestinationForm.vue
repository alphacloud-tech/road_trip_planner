<template>
  <div>
    <input v-model="newDestination" placeholder="Add a new destination" />
    <button @click="addDestination">Add</button>
  </div>
</template>

<script>
import api from "../api";

export default {
  data() {
    return {
      newDestination: "",
    };
  },
  methods: {
    async addDestination() {
      if (this.newDestination.trim() === "") return;

      await api.post("/destinations", {
        name: this.newDestination,
        latitude: 0,
        longitude: 0,
      });

      this.$emit("refresh");
      this.newDestination = "";
    },
  },
};
</script>
