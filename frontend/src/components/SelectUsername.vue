<template>
  <div class="select-username">
    <div class="chatlogin-box">
      <form class="form-chatlogin" @submit.prevent="onSubmit">
        <header class="header-chatlogin">LOGIN</header>
        <input
          class="input-chatlogin"
          type="text"
          v-model="username"
          autocomplete="off"
          placeholder="Your username..."
        />
        <button :disabled="!isValid" class="btn-chatlogin">LOGIN</button>
      </form>
    </div>
  </div>
</template>

<script>
import { ref } from "vue";
export default {
  name: "SelectUsername",
  emits: ["input"],
  data() {
    return {
      username: ref(""),
    };
  },
  computed: {
    isValid() {
      return this.username.length > 2;
    },
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.username);
      this.username = "";
    },
  },
};
</script>

<style scoped>
.select-username {
  display: flex;
  width: 100%;
  height: 100vh;
}
.chatlogin-box {
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
  border-radius: 20px;
  width: 93%;
  box-sizing: border-box;
  padding: 0 20px;
  max-width: 450px;
  margin: auto;
}
.header-chatlogin {
  padding: 15px;
  border-bottom: 1px solid rgb(223, 223, 223);
  text-align: center;
  font-weight: bold;
  color: #6fb0db;
  font-size: 20px;
}
.form-chatlogin {
  display: flex;
  flex-direction: column;
  margin-top: 20px;
}
.input-chatlogin {
  color: grey;
  margin-bottom: 15px;
  border: none;
  outline: none;
  font-size: 16px;
  padding: 10px;
  border-radius: 5px;
  box-shadow: rgba(67, 71, 85, 0.27) 0px 0px 0.25em,
    rgba(90, 125, 188, 0.05) 0px 0.25em 1em;
}
.btn-chatlogin {
  width: 100%;
  max-width: 200px;
  margin: auto;
  border: none;
  padding: 15px;
  cursor: pointer;
  border-radius: 5px;
  font-weight: bold;
  color: white;
  outline: none;
  background: #6fb0db;
  margin-top: 10px;
  margin-bottom: 30px;
}
</style>