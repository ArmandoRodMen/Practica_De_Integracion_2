import { Router } from "express";
import { cartsManager } from "../DAO/mongodb/managers/cartsManager.js";

const router = Router();

router.get("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  if ( !idCart ) {
    res.status(400).json({ message: "Required data is missing" });
  }
  try {
  const cart = await cartsManager.findCartById(idCart);
  res.json({ cart });} catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete("/:idCart", async (req, res) => {
  const { idCart } = req.params;
  if ( !idCart ) {
    res.status(400).json({ message: "No cart found with that id" });
  }try {
    await cartsManager.deleteProductsInCart(idCart);
    res.status(200).json({ message: "Products in the cart deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  if ( !idCart, !idProduct ) {
    res.status(400).json({ message: "Required data is missing" });
  }else{
    try {
    const cart = await cartsManager.deleteProductInCart(idCart, idProduct);
    res.status(200).json({ message: "Product deleted" });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

router.put("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  const quantity = req.body.quantity;
  try {
    const cart = await cartsManager.updateProductInCart(idCart, idProduct, quantity);
    res.status(200).json({ message: "Product updated" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/:idCart", async (req, res)=>{
  try{
    const {idCart} = req.params
    const {products} = req.body;
    const response = await cartsManager.updateAllProducts(idCart, products)
    res.status(200).json({message: "Products updated", cart: response})
  }catch(error){
    res.status(500).json({messsage: error.message});
  }
});

router.post("/:idCart/products/:idProduct", async (req, res) => {
  const { idCart, idProduct } = req.params;
  if (!idCart || !idProduct) {
    res.status(400).json({ message: "Required data is missing" });
  } else {
    try {
      const cart = await cartsManager.addProductToCart(idCart, idProduct);
      res.json({ cart });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }
});

router.get("/", async (req, res) => {
  try {
  const cart = await cartsManager.getCarts();
  res.json({ cart });} catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/", async (req, res) => {
  try {
  const cart = await cartsManager.createCart();
  res.json({ cart });} catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
