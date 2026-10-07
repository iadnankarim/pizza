// Fallback data used when the backend is not reachable (frontend-only development).
import { Category, Product, Tenant, Topping } from './types';

export const mockTenants: { data: Tenant[] } = {
    data: [
        { id: '1', name: 'Pizza Hub - Downtown', address: 'Main Street 1' },
        { id: '2', name: 'Pizza Hub - Uptown', address: 'Hill Road 22' },
    ],
};

const pizzaCategory: Category = {
    _id: 'cat-pizza',
    name: 'Pizza',
    priceConfiguration: {
        Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] },
        Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick'] },
    },
    attributes: [],
};

const beverageCategory: Category = {
    _id: 'cat-beverages',
    name: 'Beverages',
    priceConfiguration: {
        Size: { priceType: 'base', availableOptions: ['300ml', '500ml'] },
    },
    attributes: [],
};

export const mockCategories: Category[] = [pizzaCategory, beverageCategory];

const pizzaPrices = {
    Size: { priceType: 'base' as const, availableOptions: { Small: 400, Medium: 600, Large: 800 } },
    Crust: { priceType: 'aditional' as const, availableOptions: { Thin: 0, Thick: 50 } },
};

const makePizza = (id: string, name: string, description: string): Product => ({
    _id: id,
    name,
    image: '/pizza-main.png',
    description,
    category: pizzaCategory,
    priceConfiguration: pizzaPrices,
    attributes: [],
    isPublish: true,
    createdAt: new Date(0).toISOString(),
});

export const mockProducts: { data: Product[] } = {
    data: [
        makePizza('p1', 'Margherita', 'Classic tomato sauce, mozzarella and basil.'),
        makePizza('p2', 'Pepperoni', 'Loaded with spicy pepperoni and cheese.'),
        makePizza('p3', 'Veggie Supreme', 'Peppers, onions, mushrooms and olives.'),
        makePizza('p4', 'Chicken Tikka', 'Tandoori chicken, onions and jalapenos.'),
        {
            _id: 'b1',
            name: 'Cola',
            image: '/pizza-main.png',
            description: 'Chilled soft drink.',
            category: beverageCategory,
            priceConfiguration: {
                Size: { priceType: 'base', availableOptions: { '300ml': 60, '500ml': 90 } },
            },
            attributes: [],
            isPublish: true,
            createdAt: new Date(0).toISOString(),
        },
    ],
};

export const mockToppings: Topping[] = [
    { id: 't1', name: 'Chicken', price: 50, image: '/chicken.png' },
    { id: 't2', name: 'Jalapeno', price: 30, image: '/jelapeno.png' },
    { id: 't3', name: 'Cheese', price: 40, image: '/cheese.png' },
    { id: 't4', name: 'Mushroom', price: 30, image: '/mushroom.png' },
];
