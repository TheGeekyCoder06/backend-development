import express from 'express';
import {getAllCars , getCar , addCar , updateCar , deleteCar} from '../controllers/car-controller.js';

const router = express.Router();

router.get('/', getAllCars);              
router.get('/:id', getCar);                     
router.post('/add-car', addCar);                
router.put('/edit/:id', updateCar);                
router.delete('/delete/:id', deleteCar);        

export default router;