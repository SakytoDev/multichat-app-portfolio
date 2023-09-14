const socket = io('https://192.168.10.8:3000')

var account = null

var menuList
var mainMenu

var chatMenu

var memberPrefab
var onlineList

var msgPrefab
var messagesList
var msgInput
var authToSendBlur

var notification
var getNotification

$(document).ready(function() {
    menuList = document.getElementById("menuList")
    
    mainMenu = document.getElementById("mainMenu")  
    chatMenu = document.getElementById("chatMenu")
    
    memberPrefab = document.getElementById("memberObj")
    onlineList = document.getElementById("onlineList")
    
    msgPrefab = document.getElementById("messageObj")
    messagesList = document.getElementById("messagesList")
    msgInput = document.getElementById("msgInput")

    notification = document.getElementById("Notification")
    getNotification = bootstrap.Toast.getOrCreateInstance(notification)

    $(function() {
        $('[data-toggle="tooltip"]').tooltip()
    })

    $("#msgInput").on("keypress", function(e) {
        if (e.keyCode == 13) {
            sendMessage()
        }
    })

    socket.on('chatMessage', function(data) {
        var messageObj = msgPrefab.cloneNode(true)

        messageObj.querySelector("#nickname").textContent = data.nickname
        messageObj.querySelector("#message").textContent = data.message
        messageObj.querySelector("#date").textContent = data.sendDate

        messagesList.appendChild(messageObj)
    })

    socket.on('onlineList', function(data) {
        onlineList.innerHTML = ""

        data.forEach(function(value) {
            var memberObj = memberPrefab.cloneNode(true)
            memberObj.querySelector("#nickname").textContent = value
            onlineList.appendChild(memberObj)
        })
    })

    onlineList.innerHTML = ""
    messagesList.innerHTML = ""

    updateAccountInfo()
})

function updateAccountInfo() {
    $.ajax({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'getAcc'
        },
        success: function(data) {
            if (data.code === "success") {
                account = { "id": data.account.id, "logoutToken": data.account.logoutToken }

                socket.emit('authUpdate', { "id": account.id })

                $("#authMenu").addClass('hide')
                $("#chatMenu").removeClass('hide')
            }
            else if (data.code === "failure") {
                $("#authMenu").removeClass('hide')
                $("#chatMenu").addClass('hide')
            }
        }
    })
}

function loginAccount() {
    var formLogin = $("#postLoginInfo").serializeArray()

    if (!formLogin[0].value) {
        showNotification("Ошибка", "Введите никнейм")
        return
    }

    if (!formLogin[1].value) {
        showNotification("Ошибка", "Введите пароль")
        return
    }

    $.ajax({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accLogin',
            form: formLogin
        },
        success: function(data) {
            if (data.code === "success") {
                updateAccountInfo()

                showNotification("Авторизация успешна", "Добро пожаловать в систему!")
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function regAccount() {
    var formReg = $("#postRegInfo").serializeArray()

    if (!formReg[0].value) {
        showNotification("Ошибка", "Введите почту")
        return
    }

    if (!formReg[1].value) {
        showNotification("Ошибка", "Введите никнейм")
        return
    }

    if (!formReg[2].value) {
        showNotification("Ошибка", "Введите пароль")
        return
    }

    $.ajax({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accReg',
            form: formReg
        },
        success: function(data) {
            if (data.code === "success") {
                updateAccountInfo()

                showNotification("Регистрация успешна", "Добро пожаловать в систему!")
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function logoutAccount() {
    $.ajax({
        url: 'https://192.168.10.8:3000/request',
        method: 'GET',
        dataType: 'json',
        data: {
            type: 'accLogout',
            token: account.logoutToken
        },
        success: function(data)
        {
            if (data.code === "success") {
                account = null

                updateAccountInfo()
            }
            else if (data.code === "failure") {
                showNotification("Ошибка", data.reason)
            }
        }
    })
}

function sendMessage() {
    if ((account && account != null) && msgInput.value)
    {
        socket.emit('chatMessage', { "id": account.id, "message": msgInput.value })
        msgInput.value = ''
    }
}

function showNotification(header, message) {
    $("#NotificationHeader").html(header)
    $("#NotificationMessage").html(message)
    getNotification.show()
}