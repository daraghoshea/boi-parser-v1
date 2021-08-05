import Vue from 'vue'
import App from './App.vue'
import "./assets/main.css";
import Dinero from 'dinero.js'
import 'vue-material-design-icons/styles.css';
import store from './store';
import router from './router';

require("flatpickr/dist/flatpickr.css");

Vue.config.productionTip = false;

Dinero.defaultCurrency = 'EUR';
Dinero.globalFormat = "0,0.00";

new Vue({
  render: h => h(App),
  store,
  router
}).$mount('#app')
