response :{
"text": "this is your file structue of the expree server

    "fileTree" : {
    "app.js":{
    file:{
    contents: "
    const express = require('express')

const app = express();

app.get('/',(req,res)=>{
res.send("hellow world");
})

app.listen(3000,()=>{
console.log("server starts at port 3000")
})
"}

    },

    "package.json" : {

    file:{
     contents :"
     {

"name": "temp",
"version": "1.0.0",
"description": "",
"main": "index.js",
"scripts": {
"test": "echo \"Error: no test specified\" && exit 1"
},
"keywords": [],
"author": "",
"license": "ISC",
"type": "commonjs",
"dependencies": {
"express": "^5.1.0"
}
}
",}

    } ,

    },

    
         "buildCommand":{

mainItem: "npm",
commands : ["install"]
},

"startCommand" : {
mainItem : "node",
commands:["app.js"]
}
}
