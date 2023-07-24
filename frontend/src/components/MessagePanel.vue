<template>
  <div class="box">
    <div class="content-header-chatbox">
      <status-icon :connected="user.connected" />{{ user.username }}
    </div>
    <div class="content-main-chatbox">
      <div class="chatcontainer-chatbox-container">
        <div class="chatcontainer-chatbox">
          <div class="chat-item-box">
            <li
              v-for="(message, index) in user.messages"
              :key="index"
              :class="
                message.fromSelf
                  ? 'chat-item-container'
                  : 'chat-item-container chat-item-container-others'
              "
            >
              <div
                v-if="bdelete && message.fromSelf"
                class="chat-item-actions"
                @click="deleteCHAT(message, index)"
              >
                <button
                  @click="bdelete = false"
                  type="button"
                  class="btn btn-lg"  
                >
                ⓧ
                </button>
              </div>

              <div
                v-if="!message.sent && message.fromSelf"
                class="chat-item-actions"
              >
                <button
                  type="button"
                  class="btn btn-warning"
                  @click="resendCHAT(message)"
                >
                  &#8635;
                </button>
              </div>

              <div
                :class="
                  message.fromSelf ? 'chat-item' : 'chat-item chat-item-others'
                "
                @click="bdelete = !bdelete"
              >
                <div>
                  {{ message.content }}
                </div>
                <div>
                  <sub>{{ message.date }}</sub>
                </div>
              </div>
              <br />
            </li>
          </div>
        </div>
      </div>
    </div>
    <form @submit.prevent="onSubmit" class="chatform-chatbox">
      <textarea
        type="text"
        v-model="input"
        class="chatinput-chatbox"
        @keypress.enter="onSubmit"
        placeholder="Your message..."
      />
      <button :disabled="!isValid" class="send-button">Send</button>
    </form>
  </div>
</template>

<script>
import { useChatStore } from "../stores/chat";
import StatusIcon from "./StatusIcon.vue";
export default {
  name: "MessagePanel",
  emits: ["input", "deleteChat", "resendChat"],
  setup() {
    const Chat = useChatStore();
    return { Chat };
  },
  components: {
    StatusIcon,
  },
  props: {
    user: Object,
  },
  data() {
    return {
      input: "",
      bdelete: false,
    };
  },
  methods: {
    onSubmit() {
      this.$emit("input", this.input);
      this.input = "";
    },
    deleteCHAT(message, index) {
      this.$emit("deleteChat", message, index);
    },
    resendCHAT(message) {
      this.$emit("resendChat", message);
    },
    displaySender(message, index) {
      return (
        index === 0 ||
        this.user.messages[index - 1].fromSelf !==
          this.user.messages[index].fromSelf
      );
    },
  },
  computed: {
    isValid() {
      return this.input.length > 0;
    },
  },
};
</script>

<style scoped>
.box {
  width: 100%;
}
.header {
  line-height: 40px;
  padding: 10px 10px;
  border-bottom: 1px solid #dddddd;
  background-color: #1164a3;
  color: #fff;
  font-size: 23px;
  font-weight: 600;
  letter-spacing: 0.3px;
  border-radius: 15px 15px 0px 0px;
  position: sticky;
  text-align: center;
}
.footer {
  display: flex;
  align-items: center;
  box-sizing: border-box;
}
.bottom {
  bottom: 40px;
  position: fixed;
  width: max-content;
}
.messages {
  margin: 0;
  padding: 20px;
}
.message {
  list-style: none;
  overflow: auto;
}
.sender {
  overflow-wrap: break-word;
  font-weight: bold;
  margin-top: 5px;
  text-align: right;
  padding: 10px;
  background: #e1ffc7;
  border-radius: 15px 0px 15px 15px;
  float: right;
  max-width: 70%;
}
.receiver {
  overflow-wrap: break-word;
  font-weight: bold;
  margin-top: 5px;
  text-align: left;
  padding: 10px;
  background: rgb(211, 211, 211);
  border-radius: 0px 15px 15px 15px;
  float: left;
  max-width: 70%;
}
.form {
  padding: 10px;
}
.input {
  width: 80%;
  resize: none;
  padding: 10px;
  line-height: 1.5;
  border-radius: 5px;
  border: 1px solid #000;
}
.send-button {
  vertical-align: top;
  padding: 13px;
  background-color: #b8e0d2;
  border-radius: 0px 15px 15px 15px;
  color: #fff;
}
</style>