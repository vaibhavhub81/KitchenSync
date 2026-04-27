const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');
const morgan = require('morgan');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// Data paths
const DATA_DIR = path.join(__dirname, 'data');
const RESTAURANTS_FILE = path.join(DATA_DIR, 'restaurants.json');
const ORDERS_FILE = path.join(DATA_DIR, 'orders.json');
const USERS_FILE = path.join(DATA_DIR, 'users.json');
const STATS_FILE = path.join(DATA_DIR, 'stats.json');
const LOGS_FILE = path.join(DATA_DIR, 'audit-logs.json');
const CONFIG_FILE = path.join(DATA_DIR, 'config.json');

// Helper to read data
const readData = (file) => {
  try {
    const data = fs.readFileSync(file, 'utf8');
    return JSON.parse(data);
  } catch (err) {
    console.error(`Error reading ${file}:`, err);
    return [];
  }
};

// Helper to write data
const writeData = (file, data) => {
  try {
    fs.writeFileSync(file, JSON.stringify(data, null, 2), 'utf8');
  } catch (err) {
    console.error(`Error writing to ${file}:`, err);
  }
};

// --- AUTH API ---
app.post('/api/auth/login', (req, res) => {
  const { email, role } = req.body;
  const users = readData(USERS_FILE);
  // Simple dummy login - find by role if email not provided
  const user = users.find(u => (email ? u.email === email : u.role === role)) || users[0];
  res.json(user);
});

// --- RESTAURANTS API ---
app.get('/api/restaurants', (req, res) => {
  const restaurants = readData(RESTAURANTS_FILE);
  res.json(restaurants);
});

app.get('/api/restaurants/:id', (req, res) => {
  const restaurants = readData(RESTAURANTS_FILE);
  const restaurant = restaurants.find(r => r.id === req.params.id);
  if (restaurant) {
    res.json(restaurant);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

app.patch('/api/restaurants/:id/workload', (req, res) => {
  const { workloadPercent } = req.body;
  const restaurants = readData(RESTAURANTS_FILE);
  const config = readData(CONFIG_FILE);
  
  const index = restaurants.findIndex(r => r.id === req.params.id);
  if (index !== -1) {
    restaurants[index].workloadPercent = workloadPercent;
    
    // Update status based on thresholds
    if (workloadPercent >= config.overloadedThreshold) {
      restaurants[index].status = 'overloaded';
    } else if (workloadPercent >= config.busyThreshold) {
      restaurants[index].status = 'busy';
    } else {
      restaurants[index].status = 'normal';
    }
    
    writeData(RESTAURANTS_FILE, restaurants);
    res.json(restaurants[index]);
  } else {
    res.status(404).json({ message: 'Restaurant not found' });
  }
});

// --- ORDERS API ---
app.get('/api/orders', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const { customerId, restaurantId } = req.query;
  
  let filteredOrders = orders;
  if (customerId) filteredOrders = filteredOrders.filter(o => o.customerId === customerId);
  if (restaurantId) filteredOrders = filteredOrders.filter(o => o.restaurantId === restaurantId);
  
  res.json(filteredOrders);
});

app.get('/api/orders/:id', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const order = orders.find(o => o.id === req.params.id);
  if (order) {
    res.json(order);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

app.post('/api/orders', (req, res) => {
  const newOrder = req.body;
  const orders = readData(ORDERS_FILE);
  
  // Basic validation and ID generation if missing
  if (!newOrder.id) newOrder.id = `ord-${Date.now()}`;
  if (!newOrder.createdAt) newOrder.createdAt = new Date().toISOString();
  if (!newOrder.status) newOrder.status = 'waiting_confirmation';
  
  // Simulate payment
  newOrder.paymentCompleted = true;
  
  orders.unshift(newOrder); // Add to beginning
  writeData(ORDERS_FILE, orders);
  
  // Update stats
  const stats = readData(STATS_FILE);
  stats.todayOrders += 1;
  stats.revenue += newOrder.total || 0;
  writeData(STATS_FILE, stats);
  
  res.status(201).json(newOrder);
});

app.patch('/api/orders/:id/status', (req, res) => {
  const { status } = req.body;
  const orders = readData(ORDERS_FILE);
  const now = new Date().toISOString();
  
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    orders[index].status = status;
    if (status === 'accepted') orders[index].acceptedAt = now;
    if (status === 'preparing') orders[index].preparingAt = now;
    if (status === 'ready' || status === 'almost_ready') orders[index].readyAt = now;
    if (status === 'completed') orders[index].completedAt = now;
    
    writeData(ORDERS_FILE, orders);
    res.json(orders[index]);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

app.patch('/api/orders/:id/arrive', (req, res) => {
  const orders = readData(ORDERS_FILE);
  const index = orders.findIndex(o => o.id === req.params.id);
  if (index !== -1) {
    orders[index].hasArrived = true;
    writeData(ORDERS_FILE, orders);
    res.json(orders[index]);
  } else {
    res.status(404).json({ message: 'Order not found' });
  }
});

// --- ADMIN API ---
app.get('/api/admin/stats', (req, res) => {
  const stats = readData(STATS_FILE);
  const orders = readData(ORDERS_FILE);
  const restaurants = readData(RESTAURANTS_FILE);
  const users = readData(USERS_FILE);
  
  // Refresh some stats from live data
  stats.totalRestaurants = restaurants.length;
  stats.activeOrders = orders.filter(o => !['completed', 'rejected', 'timeout'].includes(o.status)).length;
  
  res.json(stats);
});

app.get('/api/admin/config', (req, res) => {
  const config = readData(CONFIG_FILE);
  res.json(config);
});

app.post('/api/admin/config', (req, res) => {
  const newConfig = req.body;
  writeData(CONFIG_FILE, newConfig);
  res.json(newConfig);
});

// --- AUDIT LOGS ---
app.get('/api/audit-logs', (req, res) => {
  const logs = readData(LOGS_FILE);
  res.json(logs);
});

app.post('/api/audit-logs', (req, res) => {
  const newLog = req.body;
  const logs = readData(LOGS_FILE);
  
  newLog.id = `log-${Date.now()}`;
  newLog.timestamp = new Date().toISOString();
  
  logs.unshift(newLog);
  writeData(LOGS_FILE, logs);
  res.status(201).json(newLog);
});

// Static assets (if needed)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Root route
app.get('/', (req, res) => {
  res.send('KitchenSync Backend API is running...');
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
