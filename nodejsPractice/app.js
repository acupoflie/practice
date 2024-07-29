

const http = require('http')
const fs = require('fs')
const url = require('url')

const html = fs.readFileSync('./template/index.html', 'utf-8')
let products = JSON.parse(fs.readFileSync('./data/products.json', 'utf-8'))
let productListHtml = fs.readFileSync('./template/product-list.html', 'utf-8')
let productDetailHtml = fs.readFileSync('./template/product-details.html', 'utf-8')

// let productHtmlArray = products.map((prod) => {
//     let output = productListHtml.replace('{{%IMAGE%}}', prod.productImage)
//     output = output.replace('{{%NAME%}}', prod.name)
//     output = output.replace('{{%MODELNAME%}}', prod.modeName)
//     output = output.replace('{{%MODELNO%}}', prod.modelNumber)
//     output = output.replace('{{%SIZE%}}', prod.size)
//     output = output.replace('{{%CAMERA%}}', prod.camera)
//     output = output.replace('{{%PRICE%}}', prod.price)
//     output = output.replace('{{%COLOR%}}', prod.color)
//     output = output.replace('{{%ID%}}', prod.id)

//     return output
// })

function replaceHtml(template, prod) {
    let output = template.replace('{{%IMAGE%}}', prod.productImage)
    output = output.replace('{{%NAME%}}', prod.name)
    output = output.replace('{{%MODELNAME%}}', prod.modeName)
    output = output.replace('{{%MODELNO%}}', prod.modelNumber)
    output = output.replace('{{%SIZE%}}', prod.size)
    output = output.replace('{{%CAMERA%}}', prod.camera)
    output = output.replace('{{%PRICE%}}', prod.price)
    output = output.replace('{{%COLOR%}}', prod.color)
    output = output.replace('{{%ID%}}', prod.id)
    output = output.replace('{{%ROM%}}', prod.ROM)
    output = output.replace('{{%DESC%}}', prod.Description)

    return output
}

const server = http.createServer((req, res) => {
    let {query, pathname: path} = url.parse(req.url, true)

    console.log('request received')

    if(path === '/' || path.toLocaleLowerCase() === '/home') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(html.replace('{{%CONTENT%}}', productListHtml))
    } else if (path.toLocaleLowerCase() === '/about') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        for(let i = 0; i < 500000; i++) {
            fs.writeFileSync('./data/largeFile.txt', `This is a very large file ${i}\n`, {encoding: 'utf-8', flag: 'a+'})
        }
        res.end(html.replace('{{%CONTENT%}}', 'About Page'))
    } else if (path.toLocaleLowerCase() === '/contact') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        res.end(html.replace('{{%CONTENT%}}', 'Contact Page'))
        //! PRODUCTS PAGE
    } else if(path.toLocaleLowerCase() === '/products') {
        if(!query.id) {
            let productHtmlArray = products.map((prod) => replaceHtml(productListHtml, prod))
            let productResponseHtml = html.replace('{{%CONTENT%}}', productHtmlArray.join(''))
            res.writeHead(200, {'Content-type': 'text/html'})
            res.end(productResponseHtml)
        } else {
            let productDetailResponse = replaceHtml(productDetailHtml, products[query.id])
            res.end(html.replace('{{%CONTENT%}}', productDetailResponse))
        }
    } else {
        res.writeHead(404, {
            'Content-type': 'text/html'
        })
        res.end(html.replace('{{%CONTENT%}}', '404 Page not found'))
    }
})

server.listen(3000, 'localhost', () => {
    console.log('server has started')
})