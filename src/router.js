import { createRouter, createWebHistory } from 'vue-router';
import DestinationForm from './components/DestinationForm.vue';
import DestinationList from './components/DestinationList.vue';
import MapDisplay from './components/MapDisplay.vue';


const routes = [
    { path: '/', name: 'Home', component: DestinationList }, // Route to AutobotList
    { path: '/map', name: 'MapDisplay', component: MapDisplay }, // Route to AutobotList
    // { path: '/posts/:id', name: 'SinglePost', component: DestinationForm }
    { path: '/destination/add', component: DestinationForm }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;