// HTML References
const form = document.querySelector('form')

const baseUrl = 'http://localhost:8080/api'

function onSignIn (response) {
  const body = { idToken: response.credential }
  fetch(`${baseUrl}/auth/google`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  })
    .then(resp => resp.json())
    .then(({ token }) => {
      window.localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(console.warn)
}

function signOut () {
  window.google.accounts.id.disableAutoSelect()
  window.google.accounts.id.revoke(window.localStorage.getItem('email'), done => {
    window.localStorage.clear()
    window.location.reload()
  })
}

form.addEventListener('submit', ev => {
  ev.preventDefault()
  const formData = {}

  for (const el of form.elements) {
    if (el.name.length > 0) { formData[el.name] = el.value }
  }

  fetch(`${baseUrl}/auth/login`, {
    method: 'POST',
    body: JSON.stringify(formData),
    headers: { 'Content-Type': 'application/json' }
  })
    .then(resp => resp.json())
    .then(({ msg, token }) => {
      if (msg) {
        return console.error(msg)
      }
      window.localStorage.setItem('token', token)
      window.location = 'chat.html'
    })
    .catch(err => console.log(err))

  console.log(formData)
})
