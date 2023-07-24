const Chat = require('./models/chat');

var load = [];
Chat.find((err, result) => {
  if (err) throw err;
  if (result.length > 0) {
    for (let i = 0; i < result.length; i++) {
    //console.log('result', result)
      load.push(result[i]);
    }
    //console.log('load', load)
  }
});
/* abstract */ 
class MessageStore {
  saveMessage(message) {}
  findMessagesForUser(userID) {}
}

class InMemoryMessageStore extends MessageStore {
  constructor() {
    super();
    this.messages = load;
  }

  saveMessage(message) {
    try {
      Chat.create(message)
      //console.log('sebelum', this.messages)
      //console.log('cht', message)
      this.messages.push(message);
      console.log('msg tersimpan')
      //console.log('setelah', this.messages)
    } catch (e) {
      console.log('gagal save msg', e)
    }
  }

  deleteMessage(id) {
    try {
      Chat.deleteOne({id: id}).exec();
      this.messages = this.messages.filter(item => {
        if(item.id != id) {
        return item  
        } 
      })
      console.log('msg terhapus')
    } catch (e) {
      console.log('gagal hapus msg', e)
    }
  } 

  findMessagesForUser(userID) {
    // console.log('ini hasil filter', this.messages.filter(
    //   ({ from, to }) => from === userID || to === userID
    // ))
    return this.messages.filter(
      ({ from, to }) => from === userID || to === userID
    );
  }
}

module.exports = {
  InMemoryMessageStore,
};