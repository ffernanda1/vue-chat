<template>
  <i class="icon" :class="{ connected: connected }"></i>
</template>

<script>
export default {
  name: "StatusIcon",
  props: {
    connected: Boolean,
  },
};
</script>

<style scoped>
.icon {
  height: 12px;
  width: 12px;
  border-radius: 50%;
  display: inline-block;
  background-color: #ff4400;
  margin-right: 10px;
}
.icon.connected {
  background-color: #52de1b;
}
</style>