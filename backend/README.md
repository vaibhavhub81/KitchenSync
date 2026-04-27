# KitchenSync Backend API

This is the demo-ready backend for the KitchenSync Queue Management System. It provides a full set of APIs for restaurants, orders, users, and admin statistics, matching the requirements of the frontend.

## Features
- **Pune Dataset**: Pre-populated with 25+ famous restaurants across Pune (Kothrud, Camp, Wakad, FC Road, etc.).
- **Real-time Simulation**: Mock workload management and order status tracking.
- **Zero Database Complexity**: Stores all data in local JSON files.
- **DEMO Ready**: Runs instantly with minimal setup.

## Prerequisites
- Node.js installed on your machine.

## How to Run
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   ```bash
   npm start
   ```
   The server will run on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/login`: Dummy login (returns a user with role CUSTOMER, RESTAURANT_OWNER, or ADMIN).

### Restaurants
- `GET /api/restaurants`: Fetch all Pune restaurants.
- `GET /api/restaurants/:id`: Fetch detailed restaurant information with menu.
- `PATCH /api/restaurants/:id/workload`: Update kitchen workload (0-100%).

### Orders
- `GET /api/orders`: Fetch orders (filterable by `customerId` or `restaurantId`).
- `GET /api/orders/:id`: Fetch single order status.
- `POST /api/orders`: Create a new order (with auto-token generation).
- `PATCH /api/orders/:id/status`: Update order status (Accepted, Preparing, Ready, Completed).
- `PATCH /api/orders/:id/arrive`: Mark customer as arrived at the counter.

### Admin & Analytics
- `GET /api/admin/stats`: Get dashboard summary (Today's orders, Revenue, Active users).
- `GET /api/admin/config`: Get system configuration (thresholds).
- `POST /api/admin/config`: Update system configuration.
- `GET /api/audit-logs`: Get system audit logs.

## Connection with Frontend
To connect the frontend to this backend, update the API base URL in the frontend's data fetching layer (e.g., in `lib/app-context.tsx` or a custom fetch wrapper) to `http://localhost:5000/api`.
