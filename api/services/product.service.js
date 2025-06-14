import Product from '../models/Product.js';


export const createProduct = async ({ title, description, price, image, contact, artistName }) => {
  const product = await Product.create({
    title,
    description,
    price,
    image,
    contact,
    artistName
  });

  return product;
};


export const getAllProducts = async (maxPrice) => {
  const where = {};

  if (maxPrice) {
    where.price = { lte: maxPrice };  
  }

  const products = await Product.findAll({
    where,
    order: [['createdAt', 'DESC']]
  });

  return products;
};
