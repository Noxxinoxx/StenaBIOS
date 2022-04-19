var http = require("http")
var expresss = require("express")
var app = expresss()
var fs = require("fs")
var server = http.createServer(app)
var io = require("socket.io")(server)
var bodyParser = require("body-parser")
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
app.post("/PostLaptop", (req, res ) => {
    console.log(req.body)
    res.redirect("/")
})

io.on("connection", (socket) => {

    var file = fs.readFileSync(__dirname + "/database.json")
    file = JSON.parse(file)


    socket.on("value", (data) => {
        var array = []
        console.log(file[1].ModelName)
        for(i = 0; i < file.length; i++) {
            if(file[i].ModelName.indexOf(data) != -1) {
                array.push(file[i].Name)
            }


        }

        socket.emit("return", array)

    })
})





app.get("/", (req,res) => {
    res.sendFile(__dirname + "/index.html")
    
})

function imm() {
    var file = fs.readFileSync(__dirname + "/laptops.csv", "utf8")
    
    var array = []
    
    var i = 0
    console.log(file)
    getLaptops(file, array, i)
}
function getLaptops(file, array, i) {

    console.log(file.split("\n"))
    var file = file.split("\n")
    var arrat = []
    for(i = 0; i < file.length; i++) {
        var f = file[i].split(",")
        var json = {
            "Manufacturer" : f[0], 
            "ModelName" : f[1], 
            "Category" : f[2], 
            "ScreenSize" : f[3], 
            "Screen" : f[4],
            "CPU" : f[5],
            "RAM" : f[6],
            "Storage" : f[7],
            "GPU" : f[8],
            "OperatingSystem" : f[9], 
            "OperatingSystemVersion" : f[10],
            "Weight" : f[11],
            "Price" : f[12]
        }
        arrat.push(json)


    }
    done(arrat)
    
    
}
function done(array) {
    console.log(array)

    fs.writeFileSync(__dirname + "/database.json", JSON.stringify(array))
}

server.listen(3000, () => {
    console.log("server started!")
})