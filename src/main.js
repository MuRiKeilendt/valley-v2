import Vue from 'vue'
import App from './App.vue'
import vuetify from './plugins/vuetify'; // Asegúrate de que el camino sea correcto

Vue.config.productionTip = false

new Vue({
  render: h => h(App),
  vuetify, // Añade vuetify a la instancia de Vue
}).$mount('#app')
