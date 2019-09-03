import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './registerServiceWorker'
import VueSocketIO from 'vue-socket.io'

// Vue.use(VueSocketIO, location.protocol +
//   "//" +
//   location.hostname +
//   (location.port ? ":" + location.port : "8080"));

Vue.use(new VueSocketIO({
  debug: true,
  connection: 'https://pushtok.herokuapp.com',
  vuex: {
    store,
    actionPrefix: 'SOCKET_',
    mutationPrefix: 'SOCKET_'
  },
}));

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
