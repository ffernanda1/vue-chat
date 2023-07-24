<template>
  <div class="container-chatbox">
    <main class="main-chatbox">
      <div class="sidebar-chatbox">
        <div class="title-sidebar-chatbox">Contacts</div>
        <user
          v-for="user in users"
          :key="user.userID"
          :user="user"
          :selected="selectedUser === user"
          @select="onSelectUser(user)"
        />
      </div>
      <div class="content-chatbox" v-if="selectedUser">
        <message-panel
          :user="selectedUser"
          @input="onMessage"
          @deleteChat="deleteChat"
          @resendChat="resendChat"
          class="content-chatbox"
        />
      </div>
      <div v-else class="select-msg-chatbox-txt">
        Select a chat to start messaging
      </div>
      <div class="footer">
        <button class="btn-logout" @click="logOUT">LOG OUT</button>
      </div>
    </main>
  </div>
</template>

<script>
import { useChatStore } from "../stores/chat";
import socket from "../ socket";
import User from "./ User.vue";
import MessagePanel from "./MessagePanel.vue";
export default {
  name: "ComponentChat",
  emits: ["logOut"],
  setup() {
    const Chat = useChatStore();
    return { Chat };
  },
  components: { User, MessagePanel },
  data() {
    return {
      selectedUser: null,
      users: [],
      count: 0,
    };
  },
  methods: {
    onMessage(content) {
      const id = Date.now();
      const date = new Date().toLocaleTimeString(["it-IT"], {
        hour: "2-digit",
        minute: "2-digit",
      });
      const to = this.selectedUser.userID;
      if (this.selectedUser) {
        if (socket.connected) {
          console.log("ada koneksi");
          this.Chat.addChat(id, content, date, to);
          this.selectedUser.messages.push({
            id,
            content,
            date,
            fromSelf: true,
            sent: true,
          });
        } else {
          console.log("tidak ada koneksi");
          this.selectedUser.messages.push({
            id,
            content,
            date,
            fromSelf: true,
            sent: false,
          });
        }
      }
    },
    onSelectUser(user) {
      this.selectedUser = user;
      user.hasNewMessages = false;
    },
    logOUT() {
      socket.on("user disconnected", (id) => {
        for (let i = 0; i < this.users.length; i++) {
          const user = this.users[i];
          if (user.userID === id) {
            user.connected = false;
            break;
          }
        }
      });
      this.$emit("logOut");
    },
    deleteChat(messageDel, msgindx) {
      console.log("onMesag", messageDel);
      const to = this.selectedUser.userID;
      const msgdelid = messageDel.id;
      if (this.selectedUser) {
        this.Chat.removeChat(msgdelid, to, msgindx);
        this.selectedUser.messages = this.selectedUser.messages.filter(
          (item) => {
            if (item.id != msgdelid) {
              return item;
            }
          }
        );
      }
    },
    resendChat(msgResend) {
      console.log("resendChat", msgResend);
      const id = msgResend.id;
      const content = msgResend.content;
      const date = msgResend.date;
      const to = this.selectedUser.userID;
      if (this.selectedUser) {
        if (socket.connected) {
          console.log("ada koneksi resend");
          this.Chat.addChat(id, content, date, to);
          this.selectedUser.messages.map((item) => {
            if (item.id == id) {
              item.sent = true;
            }
            return item;
          });
        } else {
          console.log("tidak ada koneksi resend");
          this.selectedUser.messages.map((item) => {
            if (item.id == id) {
              item.sent = false;
            }
            return item;
          });
        }
      }
    },
  },
  created() {
    socket.on("connect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = true;
        }
      });
    });
    socket.on("disconnect", () => {
      this.users.forEach((user) => {
        if (user.self) {
          user.connected = false;
        }
      });
    });
    const initReactiveProperties = (user) => {
      user.hasNewMessages = false;
    };
      //make socket.once so that resend work
      socket.once("users", (users) => {
        users.forEach((user) => {
          user.messages.forEach((message) => {
            message.fromSelf = message.from === socket.userID;
          });
          for (let i = 0; i < this.users.length; i++) {
            const existingUser = this.users[i];
            if (existingUser.userID === user.userID) {
              existingUser.connected = user.connected;
              existingUser.messages = user.messages;
              return;
            }
          }
          user.self = user.userID === socket.userID;
          initReactiveProperties(user);
          this.users.push(user);
        });
        this.users.sort((a, b) => {
          if (a.self) return -1;
          if (b.self) return 1;
          if (a.username < b.username) return -1;
          return a.username > b.username ? 1 : 0;
        });
      });
    socket.on("user connected", (user) => {
      for (let i = 0; i < this.users.length; i++) {
        const existingUser = this.users[i];
        if (existingUser.userID === user.userID) {
          existingUser.connected = true;
          return;
        }
      }
      initReactiveProperties(user);
      this.users.push(user);
    });
    socket.on("private message", ({ id, content, date, from, to, sent }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages.push({
            id,
            content,
            date,
            fromSelf,
            sent,
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
    socket.on("delete message", ({ to, from, msgindx }) => {
      for (let i = 0; i < this.users.length; i++) {
        const user = this.users[i];
        const fromSelf = socket.userID === from;
        if (user.userID === (fromSelf ? to : from)) {
          user.messages = user.messages.filter((item, index) => {
            if (index != msgindx) {
              return item;
            }
          });
          if (user !== this.selectedUser) {
            user.hasNewMessages = true;
          }
          break;
        }
      }
    });
  },
  unmounted() {
    socket.off("connect");
    socket.off("disconnect");
    socket.off("users");
    socket.off("user connected");
    socket.off("user disconnected");
    socket.off("private message");
    socket.off("delete message");
  },
};
</script>

<style scoped>
.left-panel {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 0;
  width: 260px;
  overflow-x: hidden;
  background-color: #e9e9e9;
  color: rgb(0, 0, 0);
}
.start-blank {
  text-align: center;
  vertical-align: middle;
  line-height: 1000px;
  font-size: x-large;
  font-style: italic;
}
.left2 {
  position: fixed;
  left: 10px;
  top: 10px;
  bottom: 10px;
  width: 240px;
  overflow-x: hidden;
  background-color: #ffffff;
  border-radius: 15px 15px 15px 15px;
  color: rgb(0, 0, 0);
}
.right-panel {
  margin-left: 260px;
  width: auto;
}
.footer {
  position: unset;
  left: 450px;
  bottom: 100px;
  padding: 5px;
  width: 25%;
}
</style>