// HTML References
const txtUid = document.querySelector('#txtUid')
const txtMessage = document.querySelector('#txtMessage')
const ulUsers = document.querySelector('#ulUsers')
const ulMessages = document.querySelector('#ulMessages')

let user = null
let socket = null

const baseUrl = 'http://localhost:8080/api'

const validateJwt = async () => {
  const token = window.localStorage.getItem('token') || ''
  if (token.length <= 10) {
    window.location = 'index.html'
    throw new Error('No token in server')
  }

  const resp = await fetch(`${baseUrl}/auth/`, {
    headers: { Authorization: `Bearer ${token}` }
  })

  const { user: userResp, token: tokenResp } = await resp.json()
  window.localStorage.setItem('token', tokenResp)
  user = userResp
  document.title = user.name

  await connectSocket()
}

const connectSocket = async () => {
// eslint-disable-next-line no-undef
  socket = io({
    extraHeaders: {
      Authorization: window.localStorage.getItem('token')
    }
  })

  socket.on('recieve-messages', drawMessages)

  socket.on('active-users', drawUsers)

  socket.on('private-messages', (payload) => {
    console.log(payload)
  })
}

const drawUsers = (users) => {
  let usersHtml = ''
  users.forEach(({ name, _id }) => {
    usersHtml += `
    <li>
      <p>
        <h5 class='text-success'>${name}</h5>
        <span class='fs-6 text-muted'>${_id}</span>
      </p>
    </li>`
  })

  ulUsers.innerHTML = usersHtml
}

const drawMessages = (messages) => {
  let messagesHtml = ''
  messages.forEach(({ message, name }) => {
    messagesHtml += `
    <li>
      <p>
        <span class='text-primary'>${name}</span>
        <span>${message}</span>
      </p>
    </li>`
  })

  ulMessages.innerHTML = messagesHtml
}

txtMessage.addEventListener('keyup', ({ keyCode }) => {
  const message = txtMessage.value
  const uid = txtUid.value

  if (keyCode !== 13) return
  if (message.length === 0) return

  socket.emit('send-message', { message, uid })

  txtMessage.value = ''
  txtUid.value = ''
})

const main = async () => {
  await validateJwt()
}
main()
