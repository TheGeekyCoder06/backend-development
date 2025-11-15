import express from "express"
const app = express();

const port = 3000;

// home route
app.get("/" , (req , res)=>{
    res.send("Welcome to recepies page");
})

//get all receipes

app.get("/recepies" , async (req , res)=> {
    try{
        const response = await fetch('https://dummyjson.com/recipes');
        const data = await response.json()
        res.send(data);
    }catch(err){
        console.log('err' , err)
    }
})

// get single receipe by id

app.get("/recepies/:id" , async (req , res)=> {
    const recepieId = req.params.id;
    try{
        const response = await fetch(`https://dummyjson.com/recipes/${recepieId}`);
        if(!response.ok){
            return res.status(404).send({error:"Product not found"});
        }
        const data = await response.json();
        res.send(data);
    }catch(err){
        console.log("err" , err)
    }
})

// listen to port

app.listen(port , ()=> {
    console.log(`Server running on http://localhost:${port}`)
})