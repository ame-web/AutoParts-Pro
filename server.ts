import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import AdmZip from "adm-zip";

// Root structures mirroring src/data.ts helper states
let vehicles: any[] = [
  {
    plate: '70 A 123 AA',
    model: 'Toyota Camry 2022 · VIN: JT2BF22K1W0123456',
    icon: '🚗',
    status: 'Bound' as const,
    registrationDate: '2022-03-14',
    annualInspection: '2025-03-14',
    insuranceExpiry: '2025-12-31',
    planRemainingMonths: 8,
  },
  {
    plate: '01 B 456 BB',
    model: 'Chevrolet Malibu 2020 · VIN: 1G1ZD5ST4LF012345',
    icon: '🚙',
    status: 'Bound' as const,
    registrationDate: '2020-05-18',
    annualInspection: '2025-05-18',
    insuranceExpiry: '2026-02-15',
    planRemainingMonths: 11,
  },
  {
    plate: '40 C 789 CC',
    model: 'Mercedes Sprinter 2019 · VIN: WD3PE8CD9JP012345',
    icon: '🚐',
    status: 'Exp. soon' as const,
    registrationDate: '2019-11-20',
    annualInspection: '2025-01-10',
    insuranceExpiry: '2025-07-22',
    planRemainingMonths: 1,
  },
];

let incidents: any[] = [
  {
    id: '#INC-091',
    description: 'Front bumper collision damage',
    descriptionKey: 'inc1-desc',
    vehiclePlate: '70 A 123 AA',
    date: '2026-06-01',
    status: 'Closed' as const,
  },
  {
    id: '#INC-092',
    description: 'Engine oil leak reported',
    descriptionKey: 'inc2-desc',
    vehiclePlate: '01 B 456 BB',
    date: '2026-06-04',
    status: 'Processing' as const,
  },
  {
    id: '#INC-093',
    description: 'Brake pad replacement urgent',
    descriptionKey: 'inc3-desc',
    vehiclePlate: '40 C 789 CC',
    date: '2026-06-07',
    status: 'Under Review' as const,
  },
];

let customers: any[] = [
  { id: '1', name: 'Kamilov Xojiakbar', tier: 'Enterprise' as const, orders: 41, status: 'Active' as const },
  { id: '2', name: 'Sara Mitchell', tier: 'Pro' as const, orders: 17, status: 'Active' as const },
  { id: '3', name: 'David Lee', tier: 'Basic' as const, orders: 5, status: 'Pending' as const },
  { id: '4', name: 'Maria Garcia', tier: 'Enterprise' as const, orders: 88, status: 'Active' as const },
  { id: '5', name: 'Wei Zhang', tier: 'Pro' as const, orders: 23, status: 'Frozen' as const },
];

let parts: any[] = [
  { id: '1', name: 'Brake Pad Set', model: 'Toyota Camry', stock: 142, price: 45, status: 'In Stock' as const },
  { id: '2', name: 'Air Filter', model: 'Universal', stock: 89, price: 12, status: 'In Stock' as const },
  { id: '3', name: 'Oil Filter', model: 'Chevrolet', stock: 11, price: 8, status: 'Low Stock' as const },
  { id: '4', name: 'Timing Belt', model: 'Mercedes', stock: 0, price: 120, status: 'Out of Stock' as const },
];

let teamMembers: any[] = [
  { id: '1', name: 'John Doe', initials: 'JD', ordersCount: 23, earnings: 340, tier: 'Pro' as const },
  { id: '2', name: 'Sara Mitchell', initials: 'SM', ordersCount: 17, earnings: 210, tier: 'Basic' as const },
  { id: '3', name: 'Kamilov Xojiakbar', initials: 'KX', ordersCount: 41, earnings: 680, tier: 'Ent.' as const },
];

let orders: any[] = [
  { id: '#4821', packageName: 'Basic', amount: 29, status: 'Active' as const },
  { id: '#4820', packageName: 'Pro', amount: 79, status: 'Active' as const },
  { id: '#4819', packageName: 'Enterprise', amount: 199, status: 'Pending' as const },
  { id: '#4818', packageName: 'Basic', amount: 29, status: 'Expired' as const },
];

// Financial & Subscription global data states
let financialState = {
  walletTotal: 3847,
  walletAvailable: 1200,
  walletPending: 650,
  activeSubscription: 'Pro',
  subscriptionDaysRemaining: 214,
};

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Direct confirmation of successful startup
  try {
    fs.writeFileSync(path.join(process.cwd(), "server_status.txt"), "Server started successfully on port 3000 at " + new Date().toISOString() + "\n");
  } catch (err: any) {
    console.error("Failed to write boot log:", err);
  }

  // Body parsers
  app.use(express.json());

  // Request logging middleware to server.log for debugging
  app.use((req, res, next) => {
    try {
      const logLine = `[${new Date().toISOString()}] ${req.method} ${req.url} - IP ${req.ip} - Headers: ${JSON.stringify(req.headers)}\n`;
      fs.appendFileSync(path.join(process.cwd(), "server.log"), logLine);
    } catch (e) {}
    next();
  });

  // API Endpoints
  app.get("/api/data", (req, res) => {
    res.json({
      vehicles,
      incidents,
      customers,
      parts,
      orders,
      teamMembers,
      ...financialState
    });
  });

  app.get("/api/download-zip", (req, res) => {
    try {
      const startLog = `[${new Date().toISOString()}] Starting ZIP generation by request\n`;
      fs.appendFileSync(path.join(process.cwd(), "server.log"), startLog);

      const zip = new AdmZip();
      const workspaceRoot = process.cwd();

      const zipDirectory = (dirPath: string, relativePath = "") => {
        try {
          const items = fs.readdirSync(dirPath);
          for (const item of items) {
            // Exclude directories/files that shouldn't be included
            if (
              item === "node_modules" ||
              item === "dist" ||
              item === ".git" ||
              item === ".github" ||
              item === ".next" ||
              item === "out" ||
              item === ".cache" ||
              item === "server.js" ||
              item === "server.cjs" ||
              item === "server.log" || // Skip log file to keep it clean
              item.endsWith(".zip")
            ) {
              continue;
            }
            const itemPath = path.join(dirPath, item);
            try {
              const itemStats = fs.lstatSync(itemPath);
              if (itemStats.isSymbolicLink()) {
                continue; // Skip directory/file symlinks
              }
              const zipPath = relativePath ? path.join(relativePath, item) : item;

              if (itemStats.isDirectory()) {
                zipDirectory(itemPath, zipPath);
              } else if (itemStats.isFile()) {
                const data = fs.readFileSync(itemPath);
                zip.addFile(zipPath, data);
              }
            } catch (fileErr: any) {
              const errLog = `[${new Date().toISOString()}] Warning zipping file ${itemPath}: ${fileErr.message}\n`;
              fs.appendFileSync(path.join(process.cwd(), "server.log"), errLog);
            }
          }
        } catch (dirErr: any) {
          const errLog = `[${new Date().toISOString()}] Warning zipping dir ${dirPath}: ${dirErr.message}\n`;
          fs.appendFileSync(path.join(process.cwd(), "server.log"), errLog);
        }
      };

      zipDirectory(workspaceRoot);

      const buffer = zip.toBuffer();
      const doneLog = `[${new Date().toISOString()}] ZIP generated successfully, buffer size: ${buffer.length} bytes\n`;
      fs.appendFileSync(path.join(process.cwd(), "server.log"), doneLog);

      res.set({
        "Content-Type": "application/zip",
        "Content-Disposition": "attachment; filename=autoparts-pr-app.zip",
        "Content-Length": buffer.length
      });
      res.send(buffer);
    } catch (error: any) {
      const errLog = `[${new Date().toISOString()}] ERROR creating ZIP: ${error.message}\nStack: ${error.stack}\n`;
      fs.appendFileSync(path.join(process.cwd(), "server.log"), errLog);
      res.status(500).json({ error: "Failed to create ZIP package", details: error.message });
    }
  });

  // Reset helper
  app.post("/api/reset", (req, res) => {
    vehicles = [
      { plate: '70 A 123 AA', model: 'Toyota Camry 2022 · VIN: JT2BF22K1W0123456', icon: '🚗', status: 'Bound', registrationDate: '2022-03-14', annualInspection: '2025-03-14', insuranceExpiry: '2025-12-31', planRemainingMonths: 8 },
      { plate: '01 B 456 BB', model: 'Chevrolet Malibu 2020 · VIN: 1G1ZD5ST4LF012345', icon: '🚙', status: 'Bound', registrationDate: '2020-05-18', annualInspection: '2025-05-18', insuranceExpiry: '2026-02-15', planRemainingMonths: 11 },
      { plate: '40 C 789 CC', model: 'Mercedes Sprinter 2019 · VIN: WD3PE8CD9JP012345', icon: '🚐', status: 'Exp. soon', registrationDate: '2019-11-20', annualInspection: '2025-01-10', insuranceExpiry: '2025-07-22', planRemainingMonths: 1 },
    ];
    incidents = [
      { id: '#INC-091', description: 'Front bumper collision damage', descriptionKey: 'inc1-desc', vehiclePlate: '70 A 123 AA', date: '2026-06-01', status: 'Closed' },
      { id: '#INC-092', description: 'Engine oil leak reported', descriptionKey: 'inc2-desc', vehiclePlate: '01 B 456 BB', date: '2026-06-04', status: 'Processing' },
      { id: '#INC-093', description: 'Brake pad replacement urgent', descriptionKey: 'inc3-desc', vehiclePlate: '40 C 789 CC', date: '2026-06-07', status: 'Under Review' },
    ];
    customers = [
      { id: '1', name: 'Kamilov Xojiakbar', tier: 'Enterprise', orders: 41, status: 'Active' },
      { id: '2', name: 'Sara Mitchell', tier: 'Pro', orders: 17, status: 'Active' },
      { id: '3', name: 'David Lee', tier: 'Basic', orders: 5, status: 'Pending' },
      { id: '4', name: 'Maria Garcia', tier: 'Enterprise', orders: 88, status: 'Active' },
      { id: '5', name: 'Wei Zhang', tier: 'Pro', orders: 23, status: 'Frozen' },
    ];
    parts = [
      { id: '1', name: 'Brake Pad Set', model: 'Toyota Camry', stock: 142, price: 45, status: 'In Stock' },
      { id: '2', name: 'Air Filter', model: 'Universal', stock: 89, price: 12, status: 'In Stock' },
      { id: '3', name: 'Oil Filter', model: 'Chevrolet', stock: 11, price: 8, status: 'Low Stock' },
      { id: '4', name: 'Timing Belt', model: 'Mercedes', stock: 0, price: 120, status: 'Out of Stock' },
    ];
    orders = [
      { id: '#4821', packageName: 'Basic', amount: 29, status: 'Active' },
      { id: '#4820', packageName: 'Pro', amount: 79, status: 'Active' },
      { id: '#4819', packageName: 'Enterprise', amount: 199, status: 'Pending' },
      { id: '#4818', packageName: 'Basic', amount: 29, status: 'Expired' },
    ];
    financialState = {
      walletTotal: 3847,
      walletAvailable: 1200,
      walletPending: 650,
      activeSubscription: 'Pro',
      subscriptionDaysRemaining: 214,
    };
    res.json({ success: true, message: "Database resetted successfully" });
  });

  // BOUND VEHICLE POST
  app.post("/api/vehicles", (req, res) => {
    const { plate, model, icon } = req.body;
    if (!plate || !model) {
      return res.status(400).json({ error: "Plate and model are required" });
    }
    const newVehicle = {
      plate: String(plate).toUpperCase(),
      model: String(model),
      icon: String(icon || '🚗'),
      status: 'Bound' as const,
      registrationDate: new Date().toISOString().split('T')[0],
      annualInspection: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      insuranceExpiry: new Date(Date.now() + 31536000000).toISOString().split('T')[0],
      planRemainingMonths: 12,
    };
    vehicles.unshift(newVehicle);
    res.status(201).json(newVehicle);
  });

  // DELETE VEHICLE
  app.delete("/api/vehicles/:plate", (req, res) => {
    const plate = req.params.plate;
    vehicles = vehicles.filter(v => v.plate !== plate);
    res.json({ success: true, plate });
  });

  // INCIDENT POST (SUBMIT NEW)
  app.post("/api/incidents", (req, res) => {
    const { description, vehiclePlate, status } = req.body;
    if (!description || !vehiclePlate) {
      return res.status(400).json({ error: "Description and vehicleplate are required" });
    }
    const newId = `#INC-0${90 + incidents.length + 1}`;
    const newIncident = {
      id: newId,
      description: String(description),
      vehiclePlate: String(vehiclePlate),
      date: new Date().toISOString().split('T')[0],
      status: (status as any) || 'Under Review',
    };
    incidents.unshift(newIncident);
    res.status(201).json(newIncident);
  });

  // UPDATE INCIDENT (ADMIN CHANGE STATUS)
  app.put("/api/incidents/:id", (req, res) => {
    const id = req.params.id;
    const { status, description } = req.body;

    const idx = incidents.findIndex(inc => inc.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Incident not found" });
    }

    if (status) {
      incidents[idx].status = status;
    }
    if (description) {
      incidents[idx].description = description;
    }

    res.json(incidents[idx]);
  });

  // ADD PARTS
  app.post("/api/parts", (req, res) => {
    const { name, model, stock, price } = req.body;
    if (!name || !model) {
      return res.status(400).json({ error: "Name and model are required" });
    }
    const parsedStock = parseInt(stock) || 0;
    const parsedPrice = parseFloat(price) || 0;
    const stockStatus = parsedStock === 0 ? 'Out of Stock' : parsedStock <= 15 ? 'Low Stock' : 'In Stock';

    const newPart = {
      id: String(parts.length + 11),
      name: String(name),
      model: String(model),
      stock: parsedStock,
      price: parsedPrice,
      status: stockStatus,
    };
    parts.unshift(newPart);
    res.status(201).json(newPart);
  });

  // UPDATE PARTS STOCK / PRICE
  app.put("/api/parts/:id", (req, res) => {
    const id = req.params.id;
    const { stock, price, name, model } = req.body;

    const idx = parts.findIndex(p => p.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Part not found" });
    }

    if (name !== undefined) parts[idx].name = name;
    if (model !== undefined) parts[idx].model = model;
    if (stock !== undefined) {
      const parsedStock = parseInt(stock) || 0;
      parts[idx].stock = parsedStock;
      parts[idx].status = parsedStock === 0 ? 'Out of Stock' : parsedStock <= 15 ? 'Low Stock' : 'In Stock';
    }
    if (price !== undefined) {
      parts[idx].price = parseFloat(price) || 0;
    }

    res.json(parts[idx]);
  });

  // DELETE PARTS
  app.delete("/api/parts/:id", (req, res) => {
    const id = req.params.id;
    parts = parts.filter(p => p.id !== id);
    res.json({ success: true, id });
  });

  // ADD / EDIT CUSTOMER
  app.post("/api/customers", (req, res) => {
    const { name, tier, status, orders: orderCount } = req.body;
    if (!name) {
      return res.status(400).json({ error: "Name is required" });
    }
    const newCustomer = {
      id: String(customers.length + 11),
      name: String(name),
      tier: tier || 'Basic',
      orders: parseInt(orderCount) || 0,
      status: status || 'Active',
    };
    customers.unshift(newCustomer);
    res.status(201).json(newCustomer);
  });

  app.put("/api/customers/:id", (req, res) => {
    const id = req.params.id;
    const { name, tier, status, orders: orderCount } = req.body;

    const idx = customers.findIndex(c => c.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Customer not found" });
    }

    if (name !== undefined) customers[idx].name = name;
    if (tier !== undefined) customers[idx].tier = tier;
    if (status !== undefined) customers[idx].status = status;
    if (orderCount !== undefined) customers[idx].orders = parseInt(orderCount) || 0;

    res.json(customers[idx]);
  });

  app.delete("/api/customers/:id", (req, res) => {
    const id = req.params.id;
    customers = customers.filter(c => c.id !== id);
    res.json({ success: true, id });
  });

  // PAYMENTS & BUY PACKAGE
  app.post("/api/buy-package", (req, res) => {
    const { packageName, price } = req.body;
    if (!packageName || !price) {
      return res.status(400).json({ error: "packageName and price are required" });
    }
    const orderId = `#48${20 + orders.length + 1}`;
    const newOrder = {
      id: orderId,
      packageName: String(packageName),
      amount: parseFloat(price),
      status: 'Active' as const,
    };
    orders.unshift(newOrder);

    financialState.activeSubscription = packageName;
    financialState.subscriptionDaysRemaining = 365;

    res.status(201).json({ success: true, newOrder, financialState });
  });

  // WITHDRAW
  app.post("/api/withdraw", (req, res) => {
    const { amount } = req.body;
    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      return res.status(400).json({ error: "Invalid amount" });
    }
    if (parsedAmount > financialState.walletAvailable) {
      return res.status(400).json({ error: "Insufficient available balance" });
    }

    financialState.walletAvailable -= parsedAmount;
    financialState.walletTotal -= parsedAmount;

    res.json({ success: true, financialState });
  });

  // UPDATE ORDER STATUS (ADMIN APPROVED / EXPIRED TRADITIONAL)
  app.put("/api/orders/:id", (req, res) => {
    const id = req.params.id;
    const { status } = req.body;
    const idx = orders.findIndex(o => o.id === id);
    if (idx === -1) {
      return res.status(404).json({ error: "Order not found" });
    }
    if (status) {
      orders[idx].status = status;
    }
    res.json(orders[idx]);
  });

  // Basic Authentication Middleware for Admin Panel
  const requireAdminAuth = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const b64auth = (req.headers.authorization || '').split(' ')[1] || '';
    const [login, password] = Buffer.from(b64auth, 'base64').toString().split(':');

    // Default admin credentials
    if (login === 'admin' && password === 'admin123') {
      return next();
    }

    res.set('WWW-Authenticate', 'Basic realm="Admin Panel"');
    res.status(401).send('Admin Authentication Required.');
  };

  // Serve the separate standalone admin-panel directory
  const adminPanelPath = path.join(process.cwd(), "admin-panel");
  app.use("/admin", requireAdminAuth, express.static(adminPanelPath));
  app.use("/admin-panel", requireAdminAuth, express.static(adminPanelPath));

  app.get("/admin", requireAdminAuth, (req, res) => {
    res.sendFile(path.join(adminPanelPath, "index.html"));
  });
  app.get("/admin-panel", requireAdminAuth, (req, res) => {
    res.sendFile(path.join(adminPanelPath, "index.html"));
  });

  // Serve static assets / build using Vite middleware
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`[Fullstack Server] Ready on http://localhost:${PORT}`);
  });
}

startServer();
