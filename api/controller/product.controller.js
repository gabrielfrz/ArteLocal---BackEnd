import { createProduct, getAllProducts } from '../services/product.service.js';

// POST /products
export const create = async (req, res) => {
  try {
    const { title, description, price, image, contact, artistName } = req.body;

    if (!title || !description || !price || !image || !contact || !artistName) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const product = await createProduct({ title, description, price, image, contact, artistName });
    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creating product:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

// GET /products
export const list = async (req, res) => {
  try {
    const { maxPrice } = req.query;
    const products = await getAllProducts(maxPrice);
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error fetching products:', error.message);
    return res.status(500).json({ message: 'Internal server error' });
  }
};
