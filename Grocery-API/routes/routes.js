import express from 'express';
import {getAllGroceries ,
    getSingleGrocery,
    addNewGrocery,
    updateGrocery,
    deletedGrocery} from "../controllers/controller.js"
const router = express.Router();

router.get("/" , getAllGroceries);
router.get("/:id" , getSingleGrocery);
router.post("/add" , addNewGrocery);
router.put("/update/:id" ,updateGrocery );
router.delete("/delete/:id" , deletedGrocery);

export default router;