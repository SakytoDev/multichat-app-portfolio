const { app, BrowserWindow } = require('electron')

const fs = require('fs')

process.env.NODE_ENV = 'production'

const createWindow = () => {
    const window = new BrowserWindow({
        minWidth: 800,
        minHeight: 600,
        webPreferences: { devTools: false }
    })

    if (process.env.NODE_ENV != 'production') {
        saveVersionFile()
    }

    window.setMenuBarVisibility(false)
    window.loadFile('./views/index.html')
}

function saveVersionFile() {
    let jsonSave = { "version": app.getVersion() }

    try {
        fs.writeFileSync('version.json', JSON.stringify(jsonSave), 'utf-8')
    }
    catch(e) {
        console.log(e)
    }
}

app.on('certificate-error', (event, webContents, url, error, certificate, callback) => {
    event.preventDefault();
    callback(true);
});

app.whenReady().then(() => {
    createWindow()
})