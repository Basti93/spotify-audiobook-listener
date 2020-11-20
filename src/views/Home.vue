<template>
  <div class="home">
    <SpotifyLogin />
  </div>
</template>

<script>
import SpotifyLogin from "@/components/SpotifyLogin.vue";

export default {
  name: "Home",
  components: {
    SpotifyLogin
  }
};
</script>
