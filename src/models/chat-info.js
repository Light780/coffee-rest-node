class Message {
  constructor (uid, name, message) {
    this.uid = uid
    this.name = name
    this.message = message
  }
}

class ChatInfo {
  constructor () {
    this.messages = []
    this.users = {}
  }

  get lastTen () {
    this.messages = this.messages.splice(0, 10)
    return this.messages
  }

  get usersArr () {
    return Object.values(this.users)
  }

  sendMessage (uid, name, message) {
    this.messages.unshift(new Message(uid, name, message))
  }

  addUser (user) {
    this.users[user.id] = user
  }

  disconnectUser (user) {
    delete this.users[user.id]
  }
}

export default ChatInfo
