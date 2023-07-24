import socket from "../ socket";
import { defineStore } from "pinia";

export const useChatStore = defineStore({
  id: "chat",
  state: () => ({
    rawItems: [],
  }),
  getters: {
    items: (state) => state.rawItems,
  },
  actions: {
    addChat(id, content, date, to) {
      try {
        // axios
        socket.emit("private message", {
          id,
          content,
          date,
          to,
        });
        this.rawItems.push({
          id,
          content,
          date,
          fromSelf: true,
          sent: true,
        });
      } catch (error) {
        console.log("lagi error");
      }
    },

    removeChat(msgdelid, to, msgindx) {
      socket.emit("delete message", { msgdelid, to, msgindx });
      this.rawItems = this.rawItems.filter((item) => {
        if (item.id != msgdelid) {
          console.log("item", item);
          return item;
        }
      });
      // this.rawItems = this.rawItems.filter(item => item.id === id)
    },

    updateItem(todo) {
      this.rawItems = this.rawItems.map((item) => {
        if (item.id === todo.id) {
          return todo;
        }
        return item;
      });
    },
  },
});