import Car from '../models/car.js';
const getAllCars = async(req , res) => {
    try{
        const cars = await Car.find({});
        if(!cars){
            res.status(404).json({message: "No cars found"})
        }
        res.json(cars)
    }catch(err){
        res.status(500).json("Internal server error")
    }
}

const getCar = async(req , res) => {
    try{
        const {id} = req.params;
        const car = await Car.findById(id);
        if(!car){
            res.status(404).json({message: "Car not found"})
        }
        res.json(car);
    }catch(err){
        res.status(500).json("Internal server error")  
    }
}

const addCar = async(req , res) => {
    try{
        const newCarFormData = req.body;
        const newCar = await Car.create(newCarFormData);
        res.status(201).json(newCar);
    }catch(err){
        res.status(500).json("Internal server error")  
    }
}

const updateCar = async(req , res) => {
    const {id} = req.params;
    try{
        const updatedCar = await Car.findByIdAndUpdate(id , req.body , {new: true});
        if(!updatedCar){
            res.status(404).json({message: "Car not found"})
        }
        res.json(updatedCar);
    }catch(err){
        res.status(500).json("Internal server error")  
    }
}

const deleteCar = async(req , res) => {
    const {id} = req.params;
    try{
        const deletedCar = await Car.findByIdAndDelete(id);
        if(!deletedCar){
            res.status(404).json({message: "Car not found"})
        }
        res.json({message: "Car deleted successfully"});
    }catch(err){
        res.status(500).json("Internal server error")  
    }
}

export  {
    getAllCars,
    getCar,
    addCar,
    updateCar,
    deleteCar
};