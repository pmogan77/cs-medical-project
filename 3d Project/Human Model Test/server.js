const http = require('http');
const fs = require('fs');
const url = require('url');

var PORT = process.env.PORT||3000;

const server  = http.createServer((req,res)=>{
    const pathName = url.parse(req.url,true).pathname;
    const queries = url.parse(req.url,true).query;

    if(req.method==='POST')
    {

    }
    else if(req.method==='PUT')
    {

    }
    else if(req.method==='DELETE')
    {

    }
    else if(req.method==='GET')
    {

    }
    else{
        
    }
})