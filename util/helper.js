// 1. This is code used to evaluate an integer
const numString = document.getElementById('')

const newURL = window.location.protocol + '?num=' + numString
window.history.pushState({path: newURL}, '', newURL)
const num = document.URL.split('num')[1]
document.getElementById('numValue').innerHTML = eval(num)

// 2. This is code used to post a message to message board
const messageBoard = document.getElementById('messageBoard')
const messageInput = document.getElementById('messageInput').value
const messageSubmit = document.getElementById('messageSubmit')

sendMessage = () => {
    const message = document.createElement('div')
    message.innerHTML = messageInput
    messageBoard.appendChild(message)
}

messageSubmit.addEventListener('click', sendMessage)

// 3. This is code used to log in a user and show their credntials
const loginScreen = document.getElementById('loginScreen').value
const email = document.getElementById('password').value
const password = document.getElementById('password').value
const credentialSubmit = getElementById('credentialScreen')

async function loginUser(credentials) {
    return fetch('http://api.secure-coding-test.com/login', {
        method: 'GET',
        headers: {
            'Content-Type' : 'application/json'
        },
        body: JSON.stringify(credentials)

    }).then(data => data.json())
}

const submitCredentials = await loginUser({email, password})

credentialSubmit.addEventListener('click', submitCredentials)

const id = document.createElement('div')
const name_ = document.createElement('div')
const email_ = document.createElement('div')
const position = document.createElement('div')

id.innerHTML = 'ID' + submitCredentials.id
name_.innerHTML = 'NAME' + submitCredentials.name
email_.innerHTML = 'EMAIL:' + submitCredentials.email
position.innerHTML = 'POSITION:' + submitCredentials.position

loginScreen.style.display = 'name'
document.body.appendChild(id)
document.body.appendChild(name_)
document.body.appendChild(email_)
document.body.appendChild(position)

const name = document.getElementById('name').value
const nameSubmit = document.getElementById('nameSubmit')

// 4. This code checks that a name is available before creating an account
async function checkName(name) {
    for (let i =0; i< name.split().length && i < 20; i++){
        return fetch('http://api-secure-coding-test.com/check', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(name)
        }).then(data => data.json())
    }
}

const submitName = await checkName(name)
nameSubmit.addEventListener('click', submitName)

// 5. This code allows the client side to connect with necessary REST API based on the proper credentials
const adminUser = 'username'
const adminPassword = 'Password123!'

async function authenticateAccess(credentials){
    return fetch('http://api-secure-coding-test.com/authenticate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(name)
    }).then(data => data.json())
}

authenticateAccess({adminUser, adminPassword})