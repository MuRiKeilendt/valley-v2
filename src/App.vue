<template>
  <v-app>
    <v-app-bar app color="primary" dark>
      <div class="d-flex align-center">
        <v-img alt="Null Valley" class="shrink mr-2" contain
          src="https://static.vecteezy.com/system/resources/thumbnails/013/217/113/small_2x/karate-icon-illustration-png.png"
          transition="scale-transition" width="40" />

        <h1>Dojo: Null Valley</h1>
      </div>

      <v-spacer></v-spacer>


    </v-app-bar>

    <v-main>
      <HelloWorld />
    </v-main>
  </v-app>
</template>

<script>
import HelloWorld from './components/HelloWorld';

export default {
  name: 'App',

  components: {
    HelloWorld,
  },

  data: () => ({

  }),
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
