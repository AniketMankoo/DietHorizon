// utils/mockDB.js
const mockData = require('./mockData');

/**
 * Mock database interface that emulates Mongoose methods
 * Used when MONGO_CONNECT is set to false in .env
 */
const mockDB = {
    /**
     * User collection methods
     */
    users: {
        find: (query = {}) => {
            let results = [...mockData.users];

            // Apply filtering if query has properties
            if (Object.keys(query).length > 0) {
                results = results.filter(user => {
                    return Object.entries(query).every(([key, value]) => {
                        return user[key] === value;
                    });
                });
            }

            return {
                select: (fields) => {
                    if (fields === '-password') {
                        return Promise.resolve(results.map(user => {
                            const { password, ...userWithoutPassword } = user;
                            return userWithoutPassword;
                        }));
                    }
                    return Promise.resolve(results);
                },
                sort: () => Promise.resolve(results),
                limit: (num) => Promise.resolve(results.slice(0, num)),
                skip: (num) => Promise.resolve(results.slice(num)),
                populate: () => Promise.resolve(results),
                exec: () => Promise.resolve(results)
            };
        },

        findById: (id) => {
            const user = mockData.users.find(u => u._id === id);

            return {
                select: (fields) => {
                    if (fields === '-password' && user) {
                        const { password, ...userWithoutPassword } = user;
                        return Promise.resolve(userWithoutPassword);
                    } else if (fields === '+password' && user) {
                        return Promise.resolve(user);
                    }
                    return Promise.resolve(user);
                },
                populate: () => Promise.resolve(user),
                exec: () => Promise.resolve(user)
            };
        },

        findOne: (query = {}) => {
            let user = null;

            if (query.email) {
                user = mockData.users.find(u => u.email === query.email);
            } else if (query.resetPasswordToken) {
                user = mockData.users.find(u =>
                    u.resetPasswordToken === query.resetPasswordToken &&
                    u.resetPasswordExpire > query.resetPasswordExpire?.$gt
                );
            } else if (Object.keys(query).length > 0) {
                user = mockData.users.find(u => {
                    return Object.entries(query).every(([key, value]) => {
                        return u[key] === value;
                    });
                });
            } else {
                user = mockData.users[0];
            }

            return {
                select: (fields) => {
                    if (fields === '+password' && user) {
                        return Promise.resolve(user);
                    } else if (fields === '-password' && user) {
                        const { password, ...userWithoutPassword } = user;
                        return Promise.resolve(userWithoutPassword);
                    }
                    return Promise.resolve(user);
                },
                populate: () => Promise.resolve(user),
                exec: () => Promise.resolve(user)
            };
        },

        create: (data) => {
            const newUser = {
                _id: `mock_user_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.users.push(newUser);
            return Promise.resolve(newUser);
        },

        findByIdAndUpdate: (id, data, options = {}) => {
            const index = mockData.users.findIndex(u => u._id === id);
            if (index !== -1) {
                mockData.users[index] = {
                    ...mockData.users[index],
                    ...data,
                    updatedAt: new Date()
                };

                // Return the updated document if new: true
                if (options.new) {
                    return Promise.resolve(mockData.users[index]);
                }

                // Otherwise return the original document (pre-update)
                return Promise.resolve({ ...mockData.users[index], ...data });
            }
            return Promise.resolve(null);
        },

        deleteOne: (query) => {
            let deletedCount = 0;

            if (query._id) {
                const index = mockData.users.findIndex(u => u._id === query._id);
                if (index !== -1) {
                    mockData.users.splice(index, 1);
                    deletedCount = 1;
                }
            }

            return Promise.resolve({ deletedCount });
        }
    },

    /**
     * Product collection methods
     */
    products: {
        find: (query = {}) => {
            let results = [...mockData.products];

            // Apply filtering
            if (query.category) {
                results = results.filter(p => p.category === query.category);
            }

            if (query.featured === true) {
                results = results.filter(p => p.featured === true);
            }

            if (query.name) {
                const searchRegex = new RegExp(query.name, 'i');
                results = results.filter(p => searchRegex.test(p.name));
            }

            return {
                sort: (sortField) => {
                    if (sortField === 'price') {
                        results.sort((a, b) => a.price - b.price);
                    } else if (sortField === '-price') {
                        results.sort((a, b) => b.price - a.price);
                    } else if (sortField === 'name') {
                        results.sort((a, b) => a.name.localeCompare(b.name));
                    } else if (sortField === '-createdAt') {
                        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    }
                    return {
                        populate: () => Promise.resolve(results),
                        limit: (num) => Promise.resolve(results.slice(0, num)),
                        skip: (num) => Promise.resolve(results.slice(num)),
                        exec: () => Promise.resolve(results)
                    };
                },
                limit: (num) => Promise.resolve(results.slice(0, num)),
                skip: (num) => Promise.resolve(results.slice(num)),
                populate: () => Promise.resolve(results),
                exec: () => Promise.resolve(results)
            };
        },

        findById: (id) => {
            const product = mockData.products.find(p => p._id === id);

            return {
                populate: (field) => {
                    if (field === 'category' && product) {
                        const category = mockData.categories.find(c => c._id === product.category);
                        return Promise.resolve({
                            ...product,
                            category: category
                        });
                    }
                    return Promise.resolve(product);
                },
                exec: () => Promise.resolve(product)
            };
        },

        findOne: (query = {}) => {
            let product = null;

            if (query._id) {
                product = mockData.products.find(p => p._id === query._id);
            } else if (Object.keys(query).length > 0) {
                product = mockData.products.find(p => {
                    return Object.entries(query).every(([key, value]) => {
                        return p[key] === value;
                    });
                });
            } else {
                product = mockData.products[0];
            }

            return {
                populate: () => Promise.resolve(product),
                exec: () => Promise.resolve(product)
            };
        },

        create: (data) => {
            const newProduct = {
                _id: `mock_product_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date(),
                ratings: [],
                avgRating: 0
            };
            mockData.products.push(newProduct);
            return Promise.resolve(newProduct);
        },

        findByIdAndUpdate: (id, data, options = {}) => {
            const index = mockData.products.findIndex(p => p._id === id);
            if (index !== -1) {
                mockData.products[index] = {
                    ...mockData.products[index],
                    ...data,
                    updatedAt: new Date()
                };

                if (options.new) {
                    return Promise.resolve(mockData.products[index]);
                }

                return Promise.resolve({ ...mockData.products[index], ...data });
            }
            return Promise.resolve(null);
        },

        deleteOne: (query) => {
            let deletedCount = 0;

            if (query._id) {
                const index = mockData.products.findIndex(p => p._id === query._id);
                if (index !== -1) {
                    mockData.products.splice(index, 1);
                    deletedCount = 1;
                }
            }

            return Promise.resolve({ deletedCount });
        }
    },

    /**
     * Category collection methods
     */
    categories: {
        find: () => {
            const results = [...mockData.categories];

            return {
                sort: (sortField) => {
                    if (sortField === 'name') {
                        results.sort((a, b) => a.name.localeCompare(b.name));
                    }
                    return Promise.resolve(results);
                },
                exec: () => Promise.resolve(results)
            };
        },

        findById: (id) => {
            return Promise.resolve(mockData.categories.find(c => c._id === id));
        },

        findOne: (query = {}) => {
            if (query.name) {
                return Promise.resolve(mockData.categories.find(c => c.name === query.name));
            }

            if (query._id) {
                return Promise.resolve(mockData.categories.find(c => c._id === query._id));
            }

            return Promise.resolve(mockData.categories[0]);
        },

        create: (data) => {
            const newCategory = {
                _id: `mock_category_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.categories.push(newCategory);
            return Promise.resolve(newCategory);
        },

        findByIdAndUpdate: (id, data, options = {}) => {
            const index = mockData.categories.findIndex(c => c._id === id);
            if (index !== -1) {
                mockData.categories[index] = {
                    ...mockData.categories[index],
                    ...data,
                    updatedAt: new Date()
                };

                if (options.new) {
                    return Promise.resolve(mockData.categories[index]);
                }

                return Promise.resolve({ ...mockData.categories[index], ...data });
            }
            return Promise.resolve(null);
        },

        deleteOne: (query) => {
            let deletedCount = 0;

            if (query._id) {
                const index = mockData.categories.findIndex(c => c._id === query._id);
                if (index !== -1) {
                    mockData.categories.splice(index, 1);
                    deletedCount = 1;
                }
            }

            return Promise.resolve({ deletedCount });
        }
    },

    /**
     * Order collection methods
     */
    orders: {
        find: (query = {}) => {
            let results = [...mockData.orders];

            if (query.user) {
                results = results.filter(o => o.user === query.user);
            }

            return {
                populate: (fields) => {
                    // Simulate populating user field
                    if (fields.includes('user')) {
                        results = results.map(order => {
                            const user = mockData.users.find(u => u._id === order.user);
                            return {
                                ...order,
                                user: user ? { _id: user._id, name: user.name, email: user.email } : order.user
                            };
                        });
                    }

                    // Simulate populating cart/items fields
                    if (fields.includes('cart') || fields.path === 'cart') {
                        results = results.map(order => {
                            if (order.items) {
                                const populatedItems = order.items.map(item => {
                                    const product = mockData.products.find(p => p._id === item.product);
                                    return {
                                        ...item,
                                        product: product || item.product
                                    };
                                });

                                return {
                                    ...order,
                                    items: populatedItems
                                };
                            }
                            return order;
                        });
                    }

                    return {
                        sort: (sortField) => {
                            if (sortField === '-orderDate') {
                                results.sort((a, b) => new Date(b.orderDate || b.createdAt) - new Date(a.orderDate || a.createdAt));
                            }
                            return Promise.resolve(results);
                        },
                        exec: () => Promise.resolve(results)
                    };
                },
                sort: (sortField) => {
                    if (sortField === '-orderDate' || sortField === '-createdAt') {
                        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    }
                    return Promise.resolve(results);
                },
                exec: () => Promise.resolve(results)
            };
        },

        findById: (id) => {
            const order = mockData.orders.find(o => o._id === id);

            return {
                populate: (fields) => {
                    if (!order) return Promise.resolve(null);

                    let populatedOrder = { ...order };

                    // Simulate populating user field
                    if (fields === 'user' || (typeof fields === 'object' && fields.path === 'user')) {
                        const user = mockData.users.find(u => u._id === order.user);
                        populatedOrder.user = user ? { _id: user._id, name: user.name, email: user.email } : order.user;
                    }

                    // Simulate populating items.product field
                    if (fields === 'items.product' || (typeof fields === 'object' && fields.path === 'items.product')) {
                        if (populatedOrder.items) {
                            populatedOrder.items = populatedOrder.items.map(item => {
                                const product = mockData.products.find(p => p._id === item.product);
                                return {
                                    ...item,
                                    product: product || item.product
                                };
                            });
                        }
                    }

                    return Promise.resolve(populatedOrder);
                },
                exec: () => Promise.resolve(order)
            };
        },

        create: (data) => {
            const orderNumber = `DH-${new Date().getFullYear()}-${1000 + mockData.orders.length}`;

            const newOrder = {
                _id: `mock_order_${Date.now()}`,
                orderNumber,
                ...data,
                orderDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date()
            };

            mockData.orders.push(newOrder);
            return Promise.resolve(newOrder);
        },

        findByIdAndUpdate: (id, data, options = {}) => {
            const index = mockData.orders.findIndex(o => o._id === id);
            if (index !== -1) {
                mockData.orders[index] = {
                    ...mockData.orders[index],
                    ...data,
                    updatedAt: new Date()
                };

                if (options.new) {
                    return Promise.resolve(mockData.orders[index]);
                }

                return Promise.resolve({ ...mockData.orders[index], ...data });
            }
            return Promise.resolve(null);
        }
    },

    /**
     * Cart collection methods
     */
    carts: {
        findOne: (query = {}) => {
            let cart = null;

            if (query.user) {
                cart = mockData.carts.find(c => c.user === query.user);
            } else {
                cart = mockData.carts[0];
            }

            return {
                populate: (fields) => {
                    if (!cart) return Promise.resolve(null);

                    if (fields === 'items.product' || (typeof fields === 'object' && fields.path === 'items.product')) {
                        const populatedCart = { ...cart };
                        if (populatedCart.items) {
                            populatedCart.items = populatedCart.items.map(item => {
                                const product = mockData.products.find(p => p._id === item.product);
                                return {
                                    ...item,
                                    product: product || item.product
                                };
                            });
                        }
                        return Promise.resolve(populatedCart);
                    }

                    return Promise.resolve(cart);
                },
                exec: () => Promise.resolve(cart)
            };
        },

        create: (data) => {
            const newCart = {
                _id: `mock_cart_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.carts.push(newCart);
            return Promise.resolve(newCart);
        },

        findOneAndUpdate: (query, data, options = {}) => {
            let cartIndex = -1;

            if (query.user) {
                cartIndex = mockData.carts.findIndex(c => c.user === query.user);
            }

            if (cartIndex !== -1) {
                mockData.carts[cartIndex] = {
                    ...mockData.carts[cartIndex],
                    ...data,
                    updatedAt: new Date()
                };

                if (options.new) {
                    return Promise.resolve(mockData.carts[cartIndex]);
                }

                return Promise.resolve({ ...mockData.carts[cartIndex], ...data });
            }

            // If upsert is true and cart doesn't exist, create a new one
            if (options.upsert) {
                const newCart = {
                    _id: `mock_cart_${Date.now()}`,
                    ...query,  // Include the query fields (like user)
                    ...data,   // Include the update data
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockData.carts.push(newCart);
                return Promise.resolve(newCart);
            }

            return Promise.resolve(null);
        }
    },

    /**
     * Blog collection methods
     */
    blogs: {
        find: (query = {}) => {
            let results = [...mockData.blogs];

            if (query.published) {
                results = results.filter(b => b.published === query.published);
            }

            if (query.author) {
                results = results.filter(b => b.author === query.author);
            }

            return {
                sort: (sortField) => {
                    if (sortField === '-publishDate') {
                        results.sort((a, b) => new Date(b.publishDate) - new Date(a.publishDate));
                    }
                    return {
                        limit: (num) => Promise.resolve(results.slice(0, num)),
                        skip: (num) => Promise.resolve(results.slice(num)),
                        populate: () => Promise.resolve(results),
                        exec: () => Promise.resolve(results)
                    };
                },
                populate: () => Promise.resolve(results),
                exec: () => Promise.resolve(results)
            };
        },

        findById: (id) => {
            const blog = mockData.blogs.find(b => b._id === id);

            return {
                populate: (field) => {
                    if (field === 'author' && blog) {
                        const author = mockData.users.find(u => u._id === blog.author);
                        const { password, ...authorWithoutPassword } = author || {};
                        return Promise.resolve({
                            ...blog,
                            author: authorWithoutPassword
                        });
                    }
                    return Promise.resolve(blog);
                },
                exec: () => Promise.resolve(blog)
            };
        },

        create: (data) => {
            const newBlog = {
                _id: `mock_blog_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.blogs.push(newBlog);
            return Promise.resolve(newBlog);
        }
    },

    /**
     * Review collection methods
     */
    reviews: {
        find: (query = {}) => {
            let results = [...mockData.reviews];

            if (query.product) {
                results = results.filter(r => r.product === query.product);
            }

            if (query.user) {
                results = results.filter(r => r.user === query.user);
            }

            return {
                sort: (sortField) => {
                    if (sortField === '-createdAt') {
                        results.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                    }
                    return {
                        populate: () => Promise.resolve(results),
                        exec: () => Promise.resolve(results)
                    };
                },
                populate: () => Promise.resolve(results),
                exec: () => Promise.resolve(results)
            };
        },

        create: (data) => {
            const newReview = {
                _id: `mock_review_${Date.now()}`,
                ...data,
                createdAt: new Date(),
                updatedAt: new Date()
            };
            mockData.reviews.push(newReview);

            // Update product average rating
            if (data.product && data.rating) {
                const productReviews = [...mockData.reviews, newReview].filter(r => r.product === data.product);
                const avgRating = productReviews.reduce((acc, review) => acc + review.rating, 0) / productReviews.length;

                const productIndex = mockData.products.findIndex(p => p._id === data.product);
                if (productIndex !== -1) {
                    mockData.products[productIndex].avgRating = parseFloat(avgRating.toFixed(1));
                    mockData.products[productIndex].ratings = productReviews.map(r => ({
                        user: r.user,
                        rating: r.rating,
                        review: r.comment
                    }));
                }
            }

            return Promise.resolve(newReview);
        }
    },

    /**
     * Wishlist collection methods
     */
    wishlist: {
        findOne: (query = {}) => {
            let wishlist = null;

            if (query.user) {
                wishlist = mockData.wishlist.find(w => w.user === query.user);
            }

            return {
                populate: (fields) => {
                    if (!wishlist) return Promise.resolve(null);

                    if (fields === 'products' || (typeof fields === 'object' && fields.path === 'products')) {
                        const populatedWishlist = { ...wishlist };
                        populatedWishlist.products = populatedWishlist.products.map(productId => {
                            return mockData.products.find(p => p._id === productId) || productId;
                        });
                        return Promise.resolve(populatedWishlist);
                    }

                    return Promise.resolve(wishlist);
                },
                exec: () => Promise.resolve(wishlist)
            };
        },

        findOneAndUpdate: (query, data, options = {}) => {
            let wishlistIndex = -1;

            if (query.user) {
                wishlistIndex = mockData.wishlist.findIndex(w => w.user === query.user);
            }

            if (wishlistIndex !== -1) {
                mockData.wishlist[wishlistIndex] = {
                    ...mockData.wishlist[wishlistIndex],
                    ...data,
                    updatedAt: new Date()
                };

                if (options.new) {
                    return Promise.resolve(mockData.wishlist[wishlistIndex]);
                }

                return Promise.resolve({ ...mockData.wishlist[wishlistIndex], ...data });
            }

            // If upsert is true and wishlist doesn't exist, create a new one
            if (options.upsert) {
                const newWishlist = {
                    _id: `mock_wishlist_${Date.now()}`,
                    ...query,
                    ...data,
                    createdAt: new Date(),
                    updatedAt: new Date()
                };
                mockData.wishlist.push(newWishlist);
                return Promise.resolve(newWishlist);
            }

            return Promise.resolve(null);
        }
    },

    /**
     * Promotion collection methods
     */
    promotions: {
        find: (query = {}) => {
            let results = [...mockData.promotions];

            if (query.isActive) {
                results = results.filter(p => p.isActive === query.isActive);
            }

            if (query.endDate && query.endDate.$gt) {
                const compareDate = new Date(query.endDate.$gt);
                results = results.filter(p => new Date(p.endDate) > compareDate);
            }

            return {
                exec: () => Promise.resolve(results)
            };
        },

        findOne: (query = {}) => {
            let promotion = null;

            if (query.code) {
                promotion = mockData.promotions.find(p =>
                    p.code === query.code &&
                    p.isActive === true &&
                    new Date(p.endDate) > new Date()
                );
            }

            return Promise.resolve(promotion);
        }
    }
};

module.exports = mockDB;