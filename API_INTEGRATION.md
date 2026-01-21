# API Integration Guide

## Setup

### 1. Environment Configuration

Create or update `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://your-api-url.com/api
VITE_ENV=development
```

### 2. API Base URL

The default API base URL is configured in `src/services/axiosInstance.ts`:
- Default: `http://localhost:3000/api`
- Can be overridden via `VITE_API_BASE_URL` environment variable

## API Services

All API services are located in `src/services/adminService.ts`

### Product Service

```typescript
import { productService } from '@/services/adminService';

// Get all products
const products = await productService.getAll();

// Get single product
const product = await productService.getById('product-id');

// Create product
const newProduct = await productService.create({
    name: "Product Name",
    description: "Description",
    price: 100000,
    link_product: "https://...",
    images: ["base64string1", "base64string2"],
    category_id: 1,
    stock: 50,
    add_ons: []
});

// Update product
const updated = await productService.update('product-id', {
    name: "Updated Name",
    price: 150000,
    stock: 30
});

// Delete product
await productService.delete('product-id');
```

### Add-on Service

```typescript
import { addOnService } from '@/services/adminService';

// Get all add-ons for a product
const addOns = await addOnService.getByProductId('product-id');

// Create add-on
const newAddOn = await addOnService.create('product-id', {
    name: "Extra Feature",
    price: 20000,
    link_add_ons: "https://..."
});

// Update add-on
const updated = await addOnService.update('product-id', 'addon-id', {
    name: "Updated Feature",
    price: 25000
});

// Delete add-on
await addOnService.delete('product-id', 'addon-id');
```

### Category Service

```typescript
import { categoryService } from '@/services/adminService';

// Get all categories
const categories = await categoryService.getAll();

// Get single category
const category = await categoryService.getById(1);

// Create category
const newCategory = await categoryService.create({
    name: "New Category",
    description: "Category description"
});

// Update category
const updated = await categoryService.update(1, {
    name: "Updated Category"
});

// Delete category
await categoryService.delete(1);
```

### Auth Service

```typescript
import { authService } from '@/services/adminService';

// Login
const response = await authService.login('admin@example.com', 'password');
// Token is automatically stored in localStorage

// Logout
authService.logout();

// Check authentication
const isAuth = authService.isAuthenticated();
```

## API Endpoints

### Products
- `GET /products` - Get all products
- `GET /products/:id` - Get single product
- `POST /products` - Create product
- `PUT /products/:id` - Update product
- `DELETE /products/:id` - Delete product

### Add-ons
- `GET /products/:productId/add-ons` - Get all add-ons
- `POST /products/:productId/add-ons` - Create add-on
- `PUT /products/:productId/add-ons/:addOnId` - Update add-on
- `DELETE /products/:productId/add-ons/:addOnId` - Delete add-on

### Categories
- `GET /categories` - Get all categories
- `GET /categories/:id` - Get single category
- `POST /categories` - Create category
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category

### Auth
- `POST /auth/login` - Login

## Error Handling

The axios instance includes automatic error handling:

- **401 Unauthorized**: Automatically redirects to login page
- **403 Forbidden**: Logs error to console
- **404 Not Found**: Logs error to console
- **500 Server Error**: Logs error to console

## Authentication

All requests automatically include the Bearer token from localStorage:

```
Authorization: Bearer <token>
```

The token is stored when logging in and removed when logging out.

## Usage in Components

### Example: Fetch Products

```typescript
import { useEffect, useState } from 'react';
import { productService, Product } from '@/services/adminService';

function ProductList() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const data = await productService.getAll();
                setProducts(data);
            } catch (err) {
                setError('Failed to fetch products');
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            {products.map(product => (
                <div key={product.id}>{product.name}</div>
            ))}
        </div>
    );
}
```

### Example: Create Product

```typescript
import { productService } from '@/services/adminService';
import { toast } from 'sonner';

async function handleCreateProduct(formData) {
    try {
        const newProduct = await productService.create(formData);
        toast.success('Product created successfully!');
        navigate('/admin/produk');
    } catch (error) {
        toast.error('Failed to create product');
        console.error(error);
    }
}
```

## Postman Collection

To test the API endpoints, you can import the Postman collection:

1. Open Postman
2. Import the collection file (if available)
3. Set the base URL variable to your API endpoint
4. Add authentication token in the collection variables

## Notes

- All API calls are asynchronous and return Promises
- Use try-catch blocks to handle errors
- The axios instance has a 10-second timeout
- Images should be sent as base64 strings in the `images` array
