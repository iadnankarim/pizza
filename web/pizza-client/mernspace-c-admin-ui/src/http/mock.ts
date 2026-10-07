// In-memory mock backend, used when VITE_USE_MOCK=true (UI-only development without services).
import { AxiosAdapter, AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { Category, Order, OrderStatus, PaymentMode, PaymentStatus, Product } from '../types';

const pizzaImage =
    'data:image/svg+xml;utf8,' +
    encodeURIComponent(
        '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><circle cx="50" cy="50" r="45" fill="#F6C343"/><circle cx="50" cy="50" r="38" fill="#E8553B"/><circle cx="35" cy="38" r="6" fill="#8B1E12"/><circle cx="62" cy="34" r="6" fill="#8B1E12"/><circle cx="58" cy="62" r="6" fill="#8B1E12"/><circle cx="36" cy="64" r="6" fill="#8B1E12"/></svg>'
    );

let loggedIn = true;

const adminUser = {
    id: 1,
    firstName: 'Admin',
    lastName: 'User',
    email: 'admin@pizza.com',
    role: 'admin',
    createdAt: '2024-01-10T10:00:00.000Z',
    tenant: null,
};

const tenants = [
    { id: 1, name: 'Pizza Hub - Downtown', address: 'Main Street 1' },
    { id: 2, name: 'Pizza Hub - Uptown', address: 'Hill Road 22' },
    { id: 3, name: 'Pizza Hub - Airport', address: 'Terminal 2' },
];

const users = [
    adminUser,
    {
        id: 2,
        firstName: 'Rakesh',
        lastName: 'Kumar',
        email: 'rakesh@pizza.com',
        role: 'manager',
        createdAt: '2024-02-01T10:00:00.000Z',
        tenant: tenants[0],
    },
    {
        id: 3,
        firstName: 'Sara',
        lastName: 'Khan',
        email: 'sara@pizza.com',
        role: 'manager',
        createdAt: '2024-02-15T10:00:00.000Z',
        tenant: tenants[1],
    },
    {
        id: 4,
        firstName: 'Ali',
        lastName: 'Ahmed',
        email: 'ali@example.com',
        role: 'customer',
        createdAt: '2024-03-05T10:00:00.000Z',
        tenant: null,
    },
];

const categories: Category[] = [
    {
        _id: 'cat-pizza',
        name: 'Pizza',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['Small', 'Medium', 'Large'] },
            Crust: { priceType: 'aditional', availableOptions: ['Thin', 'Thick'] },
        },
        attributes: [
            {
                name: 'isHit',
                widgetType: 'switch',
                defaultValue: 'No',
                availableOptions: ['Yes', 'No'],
            },
            {
                name: 'Spiciness',
                widgetType: 'radio',
                defaultValue: 'Medium',
                availableOptions: ['Less', 'Medium', 'Hot'],
            },
        ],
    },
    {
        _id: 'cat-beverages',
        name: 'Beverages',
        priceConfiguration: {
            Size: { priceType: 'base', availableOptions: ['300ml', '500ml'] },
        },
        attributes: [],
    },
];

const products: Product[] = [
    ['p1', 'Margherita', 'Classic tomato sauce, mozzarella and basil.', true],
    ['p2', 'Pepperoni', 'Loaded with spicy pepperoni and cheese.', true],
    ['p3', 'Veggie Supreme', 'Peppers, onions, mushrooms and olives.', false],
    ['p4', 'Chicken Tikka', 'Tandoori chicken, onions and jalapenos.', true],
].map(([_id, name, description, isPublish], i) => ({
    _id: _id as string,
    name: name as string,
    description: description as string,
    image: pizzaImage,
    category: categories[0],
    priceConfiguration: categories[0].priceConfiguration,
    attributes: [],
    isPublish: isPublish as boolean,
    createdAt: new Date(2024, 3, i + 1).toISOString(),
}));

const orders: Order[] = [
    [OrderStatus.RECEIVED, PaymentMode.CASH, PaymentStatus.PENDING, 1250],
    [OrderStatus.CONFIRMED, PaymentMode.CARD, PaymentStatus.PAID, 860],
    [OrderStatus.OUT_FOR_DELIVERY, PaymentMode.CARD, PaymentStatus.PAID, 1540],
    [OrderStatus.DELIVERED, PaymentMode.CASH, PaymentStatus.PAID, 640],
].map(([orderStatus, paymentMode, paymentStatus, total], i) => ({
    _id: `66f0a1b2c3d4e5f6a7b8c9d${i}`,
    image: pizzaImage,
    cart: [
        {
            _id: products[i]._id,
            name: products[i].name,
            image: pizzaImage,
            priceConfiguration: products[i].priceConfiguration,
            chosenConfiguration: {
                priceConfiguration: { Size: 'Medium', Crust: 'Thin' },
                selectedToppings: [{ id: 't1', name: 'Cheese', price: 40, image: pizzaImage }],
            },
            qty: i + 1,
        },
    ],
    customerId: { _id: 'c1', firstName: 'Ali', lastName: 'Ahmed' },
    total: total as number,
    discount: 0,
    taxes: 50,
    deliveryCharges: 50,
    address: `House ${i + 10}, Street ${i + 3}, City`,
    tenantId: '1',
    comment: i === 0 ? 'Extra spicy please' : undefined,
    paymentMode: paymentMode as PaymentMode,
    orderStatus: orderStatus as OrderStatus,
    paymentStatus: paymentStatus as PaymentStatus,
    createdAt: new Date(Date.now() - i * 3600_000).toISOString(),
}));

const paginate = <T>(items: T[], params: URLSearchParams) => {
    const perPage = Number(params.get('perPage')) || items.length || 1;
    const currentPage = Number(params.get('currentPage')) || 1;
    const q = params.get('q')?.toLowerCase();
    const filtered = q
        ? items.filter((item) => JSON.stringify(item).toLowerCase().includes(q))
        : items;
    return {
        data: filtered.slice((currentPage - 1) * perPage, currentPage * perPage),
        total: filtered.length,
        perPage,
        currentPage,
    };
};

type Handler = (match: RegExpMatchArray, params: URLSearchParams, body: unknown) => unknown;

const routes: [string, RegExp, Handler][] = [
    ['post', /^\/api\/auth\/auth\/login$/, () => ((loggedIn = true), {})],
    ['post', /^\/api\/auth\/auth\/logout$/, () => ((loggedIn = false), {})],
    ['post', /\/api\/auth\/auth\/refresh$/, () => ({})],
    ['get', /^\/api\/auth\/auth\/self$/, () => (loggedIn ? adminUser : null)],
    ['get', /^\/api\/auth\/users$/, (_, params) => paginate(users, params)],
    ['post', /^\/api\/auth\/users$/, () => ({ id: users.length + 1 })],
    ['patch', /^\/api\/auth\/users\/(.+)$/, () => ({})],
    ['get', /^\/api\/auth\/tenants$/, (_, params) => paginate(tenants, params)],
    ['post', /^\/api\/auth\/tenants$/, () => ({ id: tenants.length + 1 })],
    ['get', /^\/api\/catalog\/categories$/, () => categories],
    ['get', /^\/api\/catalog\/categories\/(.+)$/, (m) => categories.find((c) => c._id === m[1])],
    ['get', /^\/api\/catalog\/products$/, (_, params) => paginate(products, params)],
    ['post', /^\/api\/catalog\/products$/, () => ({})],
    ['put', /^\/api\/catalog\/products\/(.+)$/, () => ({})],
    ['get', /^\/api\/order\/orders$/, () => orders],
    ['get', /^\/api\/order\/orders\/([^/]+)$/, (m) => orders.find((o) => o._id === m[1])],
    [
        'patch',
        /^\/api\/order\/orders\/change-status\/(.+)$/,
        (m, _, body) => {
            const order = orders.find((o) => o._id === m[1]);
            const { status } = (typeof body === 'string' ? JSON.parse(body) : body) as {
                status: OrderStatus;
            };
            if (order) order.orderStatus = status;
            return { _id: m[1] };
        },
    ],
];

export const mockAdapter: AxiosAdapter = async (config: InternalAxiosRequestConfig) => {
    const url = new URL(config.url ?? '', 'http://mock');
    const method = (config.method ?? 'get').toLowerCase();

    const respond = (status: number, data: unknown): AxiosResponse => ({
        data,
        status,
        statusText: String(status),
        headers: {},
        config,
    });

    // small delay so loading states are visible
    await new Promise((resolve) => setTimeout(resolve, 200));

    for (const [routeMethod, pattern, handler] of routes) {
        const match = url.pathname.match(pattern);
        if (routeMethod === method && match) {
            const data = handler(match, url.searchParams, config.data);
            if (data === null || data === undefined) {
                const response = respond(data === null ? 401 : 404, {});
                throw new AxiosError('Mock error', undefined, config, null, response);
            }
            return respond(200, data);
        }
    }

    console.warn(`[mock] no handler for ${method.toUpperCase()} ${url.pathname}`);
    throw new AxiosError('Not found', undefined, config, null, respond(404, {}));
};
