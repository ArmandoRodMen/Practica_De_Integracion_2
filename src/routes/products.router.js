import { Router } from "express";
import { productsManager } from "../DAO/mongodb/managers/productsManager.js";
const router = Router();

router.get("/", async (req, res) => {
  try {
    const products = await productsManager.findAggregation(req.query);
    res.status(200).json({ message: "Products found", products });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    const product = await productsManager.findById(idProduct);
    if (!product) {
      return res.status(404).json({ message: "No product found with that id" });
    }
    res.status(200).json({ message: "Product found", product });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  const { title, description, code, price, stock } = req.body;
  if (!title || !description || !code || !price ) {
    res.status(400).json({ message: "Required data is missing" });
  }
  try {
    const newProduct = await productsManager.createOne(req.body);
    res.status(200).json({ message: "Product created", product: newProduct });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idProduct", async (req, res) => {
  const { idProduct } = req.params;
  try {
    if (!idProduct) {
      return res.status(404).json({ message: "No product found with that id" });
    }
    await productsManager.deleteOne(idProduct);
    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;