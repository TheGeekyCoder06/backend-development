import express from 'express'
const app = express();

const port = 3000;

// home route
app.get('/' , (req, res)=>{
    res.send("Welcome to users page")
})

// /users route -> get all users
app.get("/users" , async (req, res)=>{
    try{
         const response = await fetch('https://dummyjson.com/users')
        const data = await response.json();
        if(!response.ok){
            console.log("Error fetching data");
        }
        res.send(data);
    }catch(err){
        console.log('err' , err);
    }
})

// get single user by id
app.get("/users/:id" , async (req, res)=> {
    const userId = req.params.id;
    try{
        const response = await fetch(`https://dummyjson.com/users/${userId}`)
        const data = await response.json();
        if(!response.ok){
            return res.status(404).send("User not found. Please try with a different user id");
        }
        res.send(data);
    }catch(err){
        console.log("err" , err);
    }
})

app.listen(port , ()=>{
    console.log(`Server running on http://localhost:${port}`)
})