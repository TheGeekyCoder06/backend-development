import Grocery from "../models/grocery-model.js";

const getAllGroceries = async(req , res) => {
    try{
        const groceries = await Grocery.find({});
        if(!groceries){
            res.status(400).json({message: "No groceries found!"})
        }
        res.json(groceries)
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

const getSingleGrocery = async (req,res) =>{
    try{
        const {id} = req.params;
        const grocery = await Grocery.findById(id);
        if(!grocery){
            res.status(404).json({message: "Grocery not found"});
        }
        res.json(grocery)
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

const addNewGrocery = async(req , res)=>{
    try{
        const newGroceryData = req.body;
        const newGrocery = await Grocery.create(newGroceryData);
        if(!newGrocery){
            res.status(404).json({message: "Grocery not added"});
        }
        res.json(newGrocery);
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

const updateGrocery = async(req , res) => {
    const {id} = req.params;
    try{
        const updatedGrocery = await Grocery.findByIdAndUpdate(id , req.body , {new: true});
        if(!updateGrocery){
            res.status(404).json({message : "Grocery not found"});
        }
        res.json("Grocery updated successfully", updatedGrocery)
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

const deletedGrocery = async (req , res) => {
    const {id} = req.params;
    try{
        const deleteGrocery = await Grocery.findByIdAndDelete(id);
        if(!deleteGrocery){
            res.status(404).json({message: "Grocery not found"});
        }
        res.json("Grocery deleted successfully")
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

export {
    getAllGroceries ,
    getSingleGrocery,
    addNewGrocery,
    updateGrocery,
    deletedGrocery
}