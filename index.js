let express = require('express');
let axios = require('axios');

let app = express()

app.use((req,res,next)=>{
    res.append('Access-Control-Allow-Origin',"*")
    res.append('Access-Control-Allow-Content-Type',"*")
    next()
})

let options={
    headers:{
        'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/80.0.3987.149 Safari/537.36',
        'Cookie': 'Hm_lvt_1db88642e346389874251b5a1eded6e3=1584692471; device_id=24700f9f1986800ab4fcc880530dd0ed; s=cf118wsj8e; Hm_lpvt_1db88642e346389874251b5a1eded6e3=1584694317; xq_a_token=2ee68b782d6ac072e2a24d81406dd950aacaebe3; xqat=2ee68b782d6ac072e2a24d81406dd950aacaebe3; xq_r_token=f9a2c4e43ce1340d624c8b28e3634941c48f1052; xq_id_token=eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1aWQiOi0xLCJpc3MiOiJ1YyIsImV4cCI6MTU4NzUyMjY2MSwiY3RtIjoxNTg0OTM0MTkxNTY0LCJjaWQiOiJkOWQwbjRBWnVwIn0.KVi1xMmZX8tdeBLri48RAl2tNudJk1vMQX5Jdq5fZPmcA1mY7z6cN4Rj_mh4jmN4D8gdAd-lTzosPkCTNY8yrp1h6Fo-h24k4hT1AXgxJaNC5iDZ2na11oN1MgEmug9C1b0CDpHENFlg2XOhh3ou9OD_ESiZvTiQVNFSrY3cnXlxm6ud6mPfJ4C67Mt709QJXiqHl9k8MSQCH335WEW5g6eAl8fdb5m2P1NV3Pi-1E9z-5TcqNTWQwcvAF5DCWwF7KecWcrClq1wJm02ERVUUGzkvXJlm2RQWnPMynQfm_6j2w1We4DXh-ybSuxCFjizwYThSupPLIBKHef3-_Xhzg; u=691584934212403; cookiesu=541584934212971'
    }
}


app.get('/',(req,res)=>{
    res.send('apiserver')
})

app.get('/api/index/quote',async(req,res)=>{
    let httpUrl = 'https://stock.xueqiu.com/v5/stock/batch/quote.json?symbol=SH000001,SZ399001,SZ399006,HKHSI,HKHSCEI,HKHSCCI,.DJI,.IXIC,.INX'
    
    let result = await axios.get(httpUrl,options)
    res.json(result.data)
})

//热股榜
app.get('/api/index/hotstock',async(req,res)=>{
    //10全球，12是沪深，13港股，11美股
    let index = req.query.index?req.query.index:12;
    let httpUrl = `https://stock.xueqiu.com/v5/stock/hot_stock/list.json?size=8&_type=${index}&type=${index}`
    let result = await axios.get(httpUrl,options)
    res.json(result.data)
})

//股票新闻
app.get('/api/index/news',async(req,res)=>{
    //category -1推荐。 6。7*24，  105 沪深 115 科创板
    let category = req.query.category?req.query.category:-1
    let httpUrl=`https://xueqiu.com/v4/statuses/public_timeline_by_category.json?since_id=-1&max_id=-1&count=15&category=${category}`
    let result = await axios.get(httpUrl,options)
    res.json(result.data)

})

app.get('/api/choose/tools', async (req,res)=>{
    let httpUrl='https://xueqiu.com/hq/screener';
    let result= await axios.get(httpUrl)

    let reg = /SNB.data.condition =(.*?);/

    let content =reg.exec(result.data)[1]
    res.send(content)
})

app.get('/api/choose/stocks',async(req,res)=>{
    let order_by =req.query.order_by?req.query.order_by:'follow7d'
    let page=req.query.page?req.query.page:1;
    let time =new Date().getTime()
    let order=req.query.order?req.query.order:'desc'
    let httpUrl= `https://xueqiu.com/service/screener/screen?category=CN&size=10&order=desc&order_by=${order_by}&only_count=0&page=${page}&_=${time}`
    let result= await axios.get(httpUrl)
    res.json(result.data)
})

app.get('/api/choose/industries',async(req,res)=>{
    let time =new Date().getTime()
    let httpUrl= `https://xueqiu.com/service/screener/industries?category=CN&_=${time}`;
    let result= await axios.get(httpUrl);
    res.json(result.data)

})

app.get('/api/choose/areas',async(req,res)=>{
    let time =new Date().getTime()
    let httpUrl= `https://xueqiu.com/service/screener/areas?_=${time}`;
    let result= await axios.get(httpUrl);
    res.json(result.data)

})

app.listen(8081,()=>{
    console.log('server start :','http://localhost:8081')
})