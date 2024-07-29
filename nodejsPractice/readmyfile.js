
const http = require('http')
const fs = require('fs')

const server = http.createServer()

server.listen(7000, () => {
    console.log('server has started')
})

server.on('request', (req, res) => {
    let rs = fs.createReadStream('./data/largeFile.txt')

    rs.pipe(res)
})