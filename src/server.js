const express = require("express")
const server = express()

const db = require("./database/db.js")

server.use(express.static("public"))

server.use(express.urlencoded({ extended: true }))

const nunjucks = require("nunjucks")
nunjucks.configure("src/views", {
    express: server,
    noCache: true
})

server.get("/", (req, res) => {
    return res.render("index.html")
})

server.get("/create-point", (req, res) => {
    return res.render("create-point.html")
})

server.post("/savepoint", (req, res) => {
    const query = `
    INSERT INTO places (
        image,
        name,
        address,
        address2,
        state,
        city,
        items
    ) VALUES (
        ?,?,?,?,?,?,?
    );`

    const values = [
        req.body.image,
        req.body.name,
        req.body.address,
        req.body.address2,
        req.body.state,
        req.body.city,
        req.body.items,
    ]

    function afterinsertdata(err){
        if(err){
            console.log(err)
            return res.send("Erro no cadastro!")

        }
        console.log("Cadastrado com sucesso")
        console.log(this)
        return res.render("create-point.html", {saved: true})
    }

    db.run(query, values, afterinsertdata)
})

server.get("/search-results", (req, res) => {
    const search = req.query.search

    if (search == ""){
        return res.render("search-results.html", {total: 0})
    }
    db.all(`SELECT * FROM places where city like '%${search}%'`, function(err, rows) {
        if(err){
            return console.log(err)
        }
        const total = rows.length
        return res.render("search-results.html", {places: rows, total: total})
    })
})

server.get("/modal", (req, res) => {
    return res.render("modal.html")
})
server.listen(3000)