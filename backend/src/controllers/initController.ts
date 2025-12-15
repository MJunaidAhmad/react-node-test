import { Request, Response } from 'express';
import { Product } from '../models/Product';
import { User } from '../models/User';
import { Order } from '../models/Order';
import { syncOrderServiceConfig } from './orderController';

export const initializeDatabase = async (req: Request, res: Response) => {
    try {
        const adminUser = await User.findOne({ email: 'admin@ericcressey.com' });
        const seedProduct = await Product.findOne({ name: 'Premium Training Program' });

        if (adminUser || seedProduct) {
            const existingProducts = await Product.countDocuments();
            const existingUsers = await User.countDocuments();
            const existingOrders = await Order.countDocuments();

            return res.json({
                success: true,
                message: 'Database already initialized',
                data: {
                    products: existingProducts,
                    users: existingUsers,
                    orders: existingOrders,
                },
            });
        }

        const productsData = [
            {
                name: 'Premium Training Program',
                description: 'Comprehensive 12-week strength training program designed for athletes. Includes video tutorials, workout plans, and nutrition guidance.',
                price: 199.99,
                category: 'fitness',
                imageUrl: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop&q=80',
                stock: 50,
                featured: true,
            },
            {
                name: 'Nutrition Guide Book',
                description: 'Complete nutrition guide with meal plans and recipes. Perfect for athletes looking to optimize their diet.',
                price: 49.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=400&h=400&fit=crop&q=80',
                stock: 100,
                featured: true,
            },
            {
                name: 'Resistance Bands Set',
                description: 'Professional-grade resistance bands for home workouts. Includes 5 different resistance levels.',
                price: 79.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=400&fit=crop&q=80',
                stock: 30,
                featured: false,
            },
            {
                name: 'Athletic Performance T-Shirt',
                description: 'High-quality moisture-wicking athletic t-shirt. Made from premium materials for maximum comfort.',
                price: 29.99,
                category: 'apparel',
                imageUrl: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=400&fit=crop&q=80',
                stock: 75,
                featured: false,
            },
            {
                name: 'Recovery Supplement Bundle',
                description: 'Post-workout recovery supplements for optimal muscle repair. Includes protein powder and BCAAs.',
                price: 89.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1556910103-2c02749b8d0e?w=400&h=400&fit=crop&q=80',
                stock: 40,
                featured: true,
            },
            {
                name: 'Adjustable Dumbbells',
                description: 'Space-saving adjustable dumbbells (5-50 lbs each). Perfect for home gyms with limited space.',
                price: 299.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400&h=400&fit=crop&q=80',
                stock: 15,
                featured: false,
            },
            {
                name: 'Yoga Mat Premium',
                description: 'Extra-thick non-slip yoga mat for all types of workouts. Eco-friendly and easy to clean.',
                price: 59.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop&q=80',
                stock: 60,
                featured: false,
            },
            {
                name: 'Kettlebell Set (3-Piece)',
                description: 'Professional kettlebell set with 10lb, 20lb, and 30lb weights. Perfect for full-body workouts.',
                price: 149.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=400&h=400&fit=crop&q=80',
                stock: 25,
                featured: true,
            },
            {
                name: 'Pre-Workout Energy Formula',
                description: 'High-performance pre-workout supplement to boost energy and focus during training sessions.',
                price: 39.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&q=80',
                stock: 80,
                featured: false,
            },
            {
                name: 'Compression Leggings',
                description: 'Performance compression leggings with moisture-wicking technology. Available in multiple sizes.',
                price: 69.99,
                category: 'apparel',
                imageUrl: 'https://images.unsplash.com/photo-1552902865-b72c031ac5ea?w=400&h=400&fit=crop&q=80',
                stock: 45,
                featured: false,
            },
            {
                name: 'Pull-Up Bar',
                description: 'Doorway-mounted pull-up bar that requires no drilling. Supports up to 300 lbs.',
                price: 49.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80',
                stock: 35,
                featured: false,
            },
            {
                name: 'Online Coaching Program',
                description: '6-month personalized online coaching program with weekly check-ins and custom workout plans.',
                price: 499.99,
                category: 'fitness',
                imageUrl: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop&q=80',
                stock: 20,
                featured: true,
            },
            {
                name: 'Protein Bars (12-Pack)',
                description: 'High-protein bars with natural ingredients. Perfect for post-workout recovery on the go.',
                price: 24.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1606312619070-d48b4bc8b9e1?w=400&h=400&fit=crop&q=80',
                stock: 120,
                featured: false,
            },
            {
                name: 'Workout Gloves',
                description: 'Padded workout gloves to protect hands during weight training. Breathable and durable.',
                price: 19.99,
                category: 'apparel',
                imageUrl: 'https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=400&h=400&fit=crop&q=80',
                stock: 90,
                featured: false,
            },
            {
                name: 'Foam Roller',
                description: 'High-density foam roller for muscle recovery and flexibility. 36 inches long.',
                price: 34.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400&h=400&fit=crop&q=80',
                stock: 55,
                featured: false,
            },
            {
                name: 'Meal Prep Containers (10-Pack)',
                description: 'BPA-free meal prep containers with portion dividers. Microwave and dishwasher safe.',
                price: 29.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1556910103-2c02749b8d0e?w=400&h=400&fit=crop&q=80',
                stock: 70,
                featured: false,
            },
            {
                name: 'Running Shorts',
                description: 'Lightweight running shorts with built-in compression liner. Perfect for all weather conditions.',
                price: 44.99,
                category: 'apparel',
                imageUrl: 'https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop&q=80',
                stock: 50,
                featured: false,
            },
            {
                name: 'Battle Rope',
                description: 'Professional 30ft battle rope for high-intensity interval training. Great for cardio workouts.',
                price: 89.99,
                category: 'equipment',
                imageUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400&h=400&fit=crop&q=80',
                stock: 20,
                featured: false,
            },
            {
                name: 'Creatine Monohydrate',
                description: 'Pure creatine monohydrate powder for strength and muscle gains. Unflavored and easy to mix.',
                price: 24.99,
                category: 'nutrition',
                imageUrl: 'https://images.unsplash.com/photo-1598300042247-d088f8ab3a91?w=400&h=400&fit=crop&q=80',
                stock: 95,
                featured: false,
            },
            {
                name: 'Hooded Sweatshirt',
                description: 'Premium cotton blend hooded sweatshirt with logo. Comfortable for workouts and casual wear.',
                price: 54.99,
                category: 'apparel',
                imageUrl: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop&q=80',
                stock: 40,
                featured: false,
            },
        ];

        const productsToInsert = [];
        for (const productData of productsData) {
            const existingProduct = await Product.findOne({ name: productData.name });
            if (!existingProduct) {
                productsToInsert.push(productData);
            }
        }

        let products = [];
        if (productsToInsert.length > 0) {
            try {
                products = await Product.insertMany(productsToInsert, { ordered: false });
            } catch (insertError: any) {
                if (insertError.code === 11000 || insertError.name === 'MongoBulkWriteError') {
                    const productNames = productsData.map((p) => p.name);
                    products = await Product.find({ name: { $in: productNames } });
                } else {
                    throw insertError;
                }
            }
        }

        const productNames = productsData.map((p) => p.name);
        products = await Product.find({ name: { $in: productNames } });

        const usersData = [
            { email: 'admin@ericcressey.com', name: 'Admin User', role: 'admin' },
            { email: 'john.doe@example.com', name: 'John Doe', role: 'customer' },
            { email: 'jane.smith@example.com', name: 'Jane Smith', role: 'customer' },
            { email: 'mike.johnson@example.com', name: 'Mike Johnson', role: 'customer' },
            { email: 'sarah.williams@example.com', name: 'Sarah Williams', role: 'customer' },
            { email: 'david.brown@example.com', name: 'David Brown', role: 'customer' },
            { email: 'emily.davis@example.com', name: 'Emily Davis', role: 'customer' },
            { email: 'chris.miller@example.com', name: 'Chris Miller', role: 'customer' },
        ];

        const usersToInsert = [];
        for (const userData of usersData) {
            const existingUser = await User.findOne({ email: userData.email });
            if (!existingUser) {
                usersToInsert.push(userData);
            }
        }

        let users = [];
        if (usersToInsert.length > 0) {
            try {
                users = await User.insertMany(usersToInsert, { ordered: false });
            } catch (insertError: any) {
                if (insertError.code === 11000 || insertError.name === 'MongoBulkWriteError') {
                    const userEmails = usersData.map((u) => u.email);
                    users = await User.find({ email: { $in: userEmails } });
                } else {
                    throw insertError;
                }
            }
        }

        const userEmails = usersData.map((u) => u.email);
        users = await User.find({ email: { $in: userEmails } });

        const user1 = users.find((u) => u.email === 'john.doe@example.com');
        const user2 = users.find((u) => u.email === 'jane.smith@example.com');
        const user3 = users.find((u) => u.email === 'mike.johnson@example.com');

        const product1 = products.find((p) => p.name === 'Premium Training Program');
        const product2 = products.find((p) => p.name === 'Nutrition Guide Book');
        const product3 = products.find((p) => p.name === 'Resistance Bands Set');
        const product4 = products.find((p) => p.name === 'Recovery Supplement Bundle');
        const product5 = products.find((p) => p.name === 'Kettlebell Set (3-Piece)');

        const orders = [];

        if (user1 && product1 && product2) {
            const order1 = new Order({
                userId: user1._id,
                items: [
                    {
                        productId: product1._id,
                        name: product1.name,
                        price: product1.price,
                        quantity: 1,
                    },
                    {
                        productId: product2._id,
                        name: product2.name,
                        price: product2.price,
                        quantity: 2,
                    },
                ],
                total: product1.price + product2.price * 2,
                status: 'delivered',
                shippingAddress: {
                    street: '123 Main Street',
                    city: 'New York',
                    state: 'NY',
                    zipCode: '10001',
                    country: 'USA',
                },
            });
            await order1.save();
            orders.push(order1);
        }

        if (user2 && product3 && product4) {
            const order2 = new Order({
                userId: user2._id,
                items: [
                    {
                        productId: product3._id,
                        name: product3.name,
                        price: product3.price,
                        quantity: 1,
                    },
                    {
                        productId: product4._id,
                        name: product4.name,
                        price: product4.price,
                        quantity: 1,
                    },
                ],
                total: product3.price + product4.price,
                status: 'shipped',
                shippingAddress: {
                    street: '456 Oak Avenue',
                    city: 'Los Angeles',
                    state: 'CA',
                    zipCode: '90001',
                    country: 'USA',
                },
            });
            await order2.save();
            orders.push(order2);
        }

        if (user3 && product5) {
            const order3 = new Order({
                userId: user3._id,
                items: [
                    {
                        productId: product5._id,
                        name: product5.name,
                        price: product5.price,
                        quantity: 1,
                    },
                ],
                total: product5.price,
                status: 'processing',
                shippingAddress: {
                    street: '789 Pine Road',
                    city: 'Chicago',
                    state: 'IL',
                    zipCode: '60601',
                    country: 'USA',
                },
            });
            await order3.save();
            orders.push(order3);
        }
        syncOrderServiceConfig().catch(() => { });

        res.json({
            success: true,
            message: 'Database initialized successfully',
            data: {
                products: products.length,
                users: users.length,
                orders: orders.length,
            },
        });
    } catch (error: any) {
        console.error('Initialization error:', error);

        if (error.code === 11000 || error.name === 'MongoBulkWriteError') {
            const existingProducts = await Product.countDocuments();
            const existingUsers = await User.countDocuments();
            const existingOrders = await Order.countDocuments();
            syncOrderServiceConfig().catch(() => { });

            return res.json({
                success: true,
                message: 'Database already contains some seed data. Skipping initialization.',
                data: {
                    products: existingProducts,
                    users: existingUsers,
                    orders: existingOrders,
                },
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to initialize database',
            error: error.message,
        });
    }
};

