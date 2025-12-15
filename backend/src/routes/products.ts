import { Router } from 'express';
import { getProducts, getProductById } from '../controllers/productController';

export const productsRouter = Router();

productsRouter.get('/', getProducts);
productsRouter.get('/:id', getProductById);

