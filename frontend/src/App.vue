<template>
  <div id="app">
    <select-username
      v-if="!usernameAlreadySelected"
      @input="onUsernameSelection"
    />
    <chat v-else @logOut="logOut" />
  </div>
</template>

<script>
import SelectUsername from "./components/SelectUsername.vue";
import Chat from "./components/Chat.vue";
import socket from "./ socket";
export default {
  name: "App",
  components: {
    Chat,
    SelectUsername,
  },
  data() {
    return {
      usernameAlreadySelected: false,
    };
  },
  methods: {
    onUsernameSelection(username) {
      console.log("username", username);
      this.usernameAlreadySelected = true;
      socket.auth = { username };
      socket.connect();
    },
    logOut() {
      //localStorage.removeItem("sessionID");
      localStorage.setItem("sessionID", "");
      this.usernameAlreadySelected = false;
    },
  },
  created() {
    const sessionID = localStorage.getItem("sessionID");
    if (sessionID) {
      this.usernameAlreadySelected = true;
      socket.auth = { sessionID };
      socket.connect();
    }
    socket.on("session", ({ sessionID, userID }) => {
      // attach the session ID to the next reconnection attempts
      socket.auth = { sessionID };
      // store it in the localStorage
      localStorage.setItem("sessionID", sessionID);
      // save the ID of the user
      socket.userID = userID;
    });
    socket.on("connect_error", (err) => {
      if (err.message === "invalid username") {
        this.usernameAlreadySelected = false;
        console.log("ini error Login");
      }
    });
  },
  unmounted() {
    socket.off("connect_error");
  },
};
</script>