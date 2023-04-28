import { Socket } from 'socket.io'
import { validateJwtSocket } from '../helpers/jwt.js'
import ChatInfo from '../models/chat-info.js'

const chatInfo = new ChatInfo()

export const socketController = async (socket = new Socket(), io) => {
  const token = socket.handshake.headers.authorization
  const user = await validateJwtSocket(token)

  if (!user) return socket.disconnect()

  // Add User connected
  chatInfo.addUser(user)

  io.emit('active-users', chatInfo.usersArr)
  socket.emit('recieve-messages', chatInfo.lastTen)

  socket.join(user.id) // global, socket.id, user.id

  socket.on('disconnect', () => {
    chatInfo.disconnectUser(user)
    io.emit('active-users', chatInfo.usersArr)
  })

  socket.on('send-message', ({ uid, message }) => {
    if (uid) {
      socket.to(uid).emit('private-messages', { from: user.name, message })
    } else {
      chatInfo.sendMessage(user.id, user.name, message)
      io.emit('recieve-messages', chatInfo.lastTen)
    }
  })
}
