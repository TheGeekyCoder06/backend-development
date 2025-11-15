import express from "express";
const app = express();

//root route
app.get("/", (req, res) => {
  res.send("Hello World from routes.js!");
});

// get products route

app.get("/products", async (req, res) => {
  // const products = [
  //     {id:1, name:'Product 1', price:100},
  //     {id:2, name:'Product 2', price:200},
  //     {id:3, name:'Product 3', price:300},
  // ];
  // res.send(products);
    try{
        const response = await fetch('https://dummyjson.com/products');
        const data = await response.json();
        res.send(data);
    }catch(error){
        res.status(500).send({error:"Failed to fetch products"});
    }
});

// get a single product by id route
app.get("/products/:id" , async(req , res) => {
    const productId = req.params.id;
    try{
        const response = await fetch(`https://dummyjson.com/products/${productId}`);
        if(!response.ok){
            return res.status(404).send({error:"Product not found"});
        }
        const data = await response.json();
        res.send(data);
    }catch(error){
        res.status(500).send({error:"Failed to fetch product"});
    }
})

const port = 3000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
