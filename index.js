const express = require('express');
const fs = require('fs');
const path = require('path');
const helmet = require("helmet");
const morgan = require("morgan");
const app = express();
const route = require('./routes/routes');
const cors =  require('cors');
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    {flags: 'a'}
);

app.use(cors());
app.use(helmet());
app.use(morgan('combined', {stream: accessLogStream}));
app.use(express.urlencoded({extended:true}));
app.use(express.json())
app.use(route);

app.use((error, req, res, next) => {
    res.status(500).json({message: "An Error occured"});
})

app.get('/', (req, res) => {
    res.send('Welcome to MonResto with the best host Render in the world!');
  });

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","GET, PUT, POST, DELETE, HEAD, OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
  });


app.listen(3000, ()=>{ console.log('App running');});