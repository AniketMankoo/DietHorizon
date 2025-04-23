// utils/mockData.js

/**
 * Comprehensive mock data for development without database connection
 * Used when MONGO_CONNECT is set to false in .env
 */
const mockData = {
    users: [
        {
            _id: 'mock_user_1',
            name: 'Admin User',
            email: 'admin@diethorizon.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1TD7WS', // 'password123'
            role: 'admin',
            phone: '555-123-4567',
            address: {
                street: '123 Admin St',
                city: 'San Francisco',
                state: 'CA',
                postalCode: '94105',
                country: 'USA'
            },
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
        },
        {
            _id: 'mock_user_2',
            name: 'Regular User',
            email: 'user@diethorizon.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1TD7WS', // 'password123'
            role: 'user',
            phone: '555-987-6543',
            address: {
                street: '456 User Ave',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'USA'
            },
            createdAt: new Date('2023-02-20'),
            updatedAt: new Date('2023-02-20')
        },
        {
            _id: 'mock_user_3',
            name: 'Nutrition Expert',
            email: 'expert@diethorizon.com',
            password: '$2a$10$XOPbrlUPQdwdJUpSrIF6X.LbE14qsMmKGhM1A8W9iqaG3vv1TD7WS', // 'password123'
            role: 'expert',
            phone: '555-555-5555',
            address: {
                street: '789 Expert Blvd',
                city: 'Chicago',
                state: 'IL',
                postalCode: '60601',
                country: 'USA'
            },
            credentials: {
                degree: 'PhD in Nutrition Science',
                institution: 'University of Health Sciences',
                yearCompleted: 2015
            },
            createdAt: new Date('2023-01-25'),
            updatedAt: new Date('2023-01-25')
        }
    ],

    categories: [
        {
            _id: 'mock_category_1',
            name: 'Diet Plans',
            description: 'Comprehensive diet plans for various health and fitness goals',
            image: 'category_diet_plans.jpg',
            createdAt: new Date('2023-01-05'),
            updatedAt: new Date('2023-01-05')
        },
        {
            _id: 'mock_category_2',
            name: 'Workout Plans',
            description: 'Exercise regimens designed for different fitness levels and goals',
            image: 'category_workout_plans.jpg',
            createdAt: new Date('2023-01-10'),
            updatedAt: new Date('2023-01-10')
        },
        {
            _id: 'mock_category_3',
            name: 'Supplements',
            description: 'High-quality nutritional supplements to support your diet and fitness goals',
            image: 'category_supplements.jpg',
            createdAt: new Date('2023-01-12'),
            updatedAt: new Date('2023-01-12')
        },
        {
            _id: 'mock_category_4',
            name: 'Meal Prep Tools',
            description: 'Tools and accessories to make meal preparation easier and more efficient',
            image: 'category_meal_prep.jpg',
            createdAt: new Date('2023-01-15'),
            updatedAt: new Date('2023-01-15')
        }
    ],

    products: [
        {
            _id: 'mock_product_1',
            name: 'High Protein Diet Plan',
            description: 'A nutritious diet plan designed for muscle building and recovery. Includes meal plans, recipes, and shopping lists for 30 days.',
            price: 29.99,
            category: 'mock_category_1',
            stock: 100,
            images: ['product1_img1.jpg', 'product1_img2.jpg'],
            ratings: [
                { user: 'mock_user_2', rating: 4, review: 'Great plan, seeing good results!' },
                { user: 'mock_user_3', rating: 5, review: 'Excellent macronutrient balance' }
            ],
            avgRating: 4.5,
            featured: true,
            createdAt: new Date('2023-03-10'),
            updatedAt: new Date('2023-03-10')
        },
        {
            _id: 'mock_product_2',
            name: 'Low Carb Diet Plan',
            description: 'Effective diet plan for weight loss focusing on reducing carbohydrate intake. Includes 4 weeks of meal plans, recipe book, and progress tracker.',
            price: 24.99,
            category: 'mock_category_1',
            stock: 150,
            images: ['product2_img1.jpg', 'product2_img2.jpg'],
            ratings: [
                { user: 'mock_user_2', rating: 5, review: 'Lost 8 pounds in the first month!' }
            ],
            avgRating: 5.0,
            featured: true,
            createdAt: new Date('2023-03-15'),
            updatedAt: new Date('2023-03-15')
        },
        {
            _id: 'mock_product_3',
            name: 'Beginner Strength Training Plan',
            description: 'A comprehensive 12-week strength training program for beginners. Includes video tutorials and progression tracking.',
            price: 19.99,
            category: 'mock_category_2',
            stock: 200,
            images: ['product3_img1.jpg', 'product3_img2.jpg'],
            ratings: [],
            avgRating: 0,
            featured: false,
            createdAt: new Date('2023-03-20'),
            updatedAt: new Date('2023-03-20')
        },
        {
            _id: 'mock_product_4',
            name: 'Plant-Based Protein Powder',
            description: 'High-quality plant-based protein powder with 25g protein per serving. 30 servings per container.',
            price: 39.99,
            category: 'mock_category_3',
            stock: 75,
            images: ['product4_img1.jpg', 'product4_img2.jpg'],
            ratings: [
                { user: 'mock_user_2', rating: 4, review: 'Great taste for a plant-based protein!' }
            ],
            avgRating: 4.0,
            featured: false,
            createdAt: new Date('2023-03-25'),
            updatedAt: new Date('2023-03-25')
        },
        {
            _id: 'mock_product_5',
            name: 'Meal Prep Container Set',
            description: 'Set of 10 BPA-free meal prep containers with 3 compartments. Microwave and dishwasher safe.',
            price: 24.99,
            category: 'mock_category_4',
            stock: 50,
            images: ['product5_img1.jpg', 'product5_img2.jpg'],
            ratings: [],
            avgRating: 0,
            featured: false,
            createdAt: new Date('2023-03-30'),
            updatedAt: new Date('2023-03-30')
        }
    ],

    carts: [
        {
            _id: 'mock_cart_1',
            user: 'mock_user_2',
            items: [
                {
                    product: 'mock_product_2',
                    quantity: 1,
                    price: 24.99
                },
                {
                    product: 'mock_product_4',
                    quantity: 1,
                    price: 39.99
                }
            ],
            totalPrice: 64.98,
            createdAt: new Date('2023-04-10'),
            updatedAt: new Date('2023-04-10')
        }
    ],

    orders: [
        {
            _id: 'mock_order_1',
            orderNumber: 'DH-2023-1001',
            user: 'mock_user_2',
            items: [
                {
                    product: 'mock_product_1',
                    name: 'High Protein Diet Plan',
                    quantity: 1,
                    price: 29.99
                }
            ],
            totalPrice: 29.99,
            shippingAddress: {
                street: '456 User Ave',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'USA'
            },
            paymentMethod: 'Credit Card',
            paymentStatus: 'Paid',
            status: 'Delivered',
            orderDate: new Date('2023-04-05'),
            deliveryDate: new Date('2023-04-07'),
            createdAt: new Date('2023-04-05'),
            updatedAt: new Date('2023-04-07')
        },
        {
            _id: 'mock_order_2',
            orderNumber: 'DH-2023-1002',
            user: 'mock_user_2',
            items: [
                {
                    product: 'mock_product_3',
                    name: 'Beginner Strength Training Plan',
                    quantity: 1,
                    price: 19.99
                },
                {
                    product: 'mock_product_5',
                    name: 'Meal Prep Container Set',
                    quantity: 1,
                    price: 24.99
                }
            ],
            totalPrice: 44.98,
            shippingAddress: {
                street: '456 User Ave',
                city: 'New York',
                state: 'NY',
                postalCode: '10001',
                country: 'USA'
            },
            paymentMethod: 'PayPal',
            paymentStatus: 'Paid',
            status: 'Processing',
            orderDate: new Date('2023-04-15'),
            createdAt: new Date('2023-04-15'),
            updatedAt: new Date('2023-04-15')
        }
    ],

    // Add more entities as needed
    promotions: [
        {
            _id: 'mock_promo_1',
            code: 'WELCOME20',
            description: '20% off your first order',
            discountType: 'percentage',
            discountValue: 20,
            minPurchase: 0,
            startDate: new Date('2023-01-01'),
            endDate: new Date('2023-12-31'),
            isActive: true,
            createdAt: new Date('2023-01-01'),
            updatedAt: new Date('2023-01-01')
        },
        {
            _id: 'mock_promo_2',
            code: 'SUMMER10',
            description: '$10 off orders over $50',
            discountType: 'fixed',
            discountValue: 10,
            minPurchase: 50,
            startDate: new Date('2023-06-01'),
            endDate: new Date('2023-08-31'),
            isActive: true,
            createdAt: new Date('2023-05-15'),
            updatedAt: new Date('2023-05-15')
        }
    ],

    blogs: [
        {
            _id: 'mock_blog_1',
            title: 'The Benefits of High-Protein Diets',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua...',
            author: 'mock_user_3',
            category: 'Nutrition',
            tags: ['protein', 'diet', 'muscle building'],
            image: 'blog1.jpg',
            published: true,
            publishDate: new Date('2023-02-10'),
            createdAt: new Date('2023-02-05'),
            updatedAt: new Date('2023-02-10')
        },
        {
            _id: 'mock_blog_2',
            title: 'How to Start Strength Training: A Beginner\'s Guide',
            content: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris...',
            author: 'mock_user_1',
            category: 'Fitness',
            tags: ['strength training', 'beginner', 'workout'],
            image: 'blog2.jpg',
            published: true,
            publishDate: new Date('2023-03-01'),
            createdAt: new Date('2023-02-25'),
            updatedAt: new Date('2023-03-01')
        }
    ],

    wishlist: [
        {
            _id: 'mock_wishlist_1',
            user: 'mock_user_2',
            products: ['mock_product_3', 'mock_product_5'],
            createdAt: new Date('2023-04-01'),
            updatedAt: new Date('2023-04-10')
        }
    ],

    reviews: [
        {
            _id: 'mock_review_1',
            product: 'mock_product_1',
            user: 'mock_user_2',
            rating: 4,
            title: 'Great results!',
    comment: 'I\'ve been following this plan for 3 weeks and already seeing good results. Easy to follow recipes.',
    createdAt: new Date('2023-04-20'),
            updatedAt: new Date('2023-04-20')
        },
        {
            _id: 'mock_review_2',
            product: 'mock_product_2',
            user: 'mock_user_2',
            rating: 5,
            title: 'Lost weight quickly',
            comment: 'This low carb plan helped me lose 8 pounds in the first month. The meal plans are delicious and filling.',
            createdAt: new Date('2023-04-25'),
            updatedAt: new Date('2023-04-25')
        }
    ]
};

export default mockData;