const express=require('express');
const app=express();
app.use(express.json());

app.get('/api/profile',(req,res)=>{
res.json({
name:'Kelvin Kimani Mugure',
title:'Bachelor of Science in Computer Science and System Security'
});
});

app.listen(5000,()=>console.log('API running'));
