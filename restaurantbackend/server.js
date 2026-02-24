
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require("multer");
const path = require("path");
const app = express();
app.use(cors());
app.use(express.json());
app.use('/uploads', express.static('uploads'));
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'rayesha',
  database: 'restaurant_db'
});

db.connect(err => {
  if (err) {
    console.log("Database error", err);
  } else {
    console.log("MySQL Connected");
  }
});


// Storage setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });


app.post('/api/staff/create', upload.single("profile_image"), (req, res) => {
  const { full_name, mobile, email, password, role, is_active } = req.body;

  if (!full_name || !mobile || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  const profile_image = req.file ? req.file.filename : null;
  const isActiveValue = (is_active === 'true' || is_active === true) ? 1 : 0;

  const insertSql = `
    INSERT INTO user (full_name, mobile, email, password, role, is_active, profile_image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(insertSql, [full_name, mobile, email, password, role, isActiveValue, profile_image], (err, result) => {
    if (err) {
      console.log("DB INSERT ERROR:", err);
      return res.status(500).json({ success: false, message: "Database insert failed", error: err });
    }

    res.json({ success: true, message: "Staff account created successfully" });
  });
});
//  LOGIN 
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
  
  db.query(sql, [email, password], (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length > 0) {
      res.json({
        success: true,
        role: result[0].role,
        name: result[0].full_name
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials"
      });
    }
  });
});

// Create Table Route
app.post("/api/tables/create", (req, res) => {
  const { table_number, capacity, table_type, status, notes } = req.body;

  if (!table_number || !capacity || !table_type || !status) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }

  const sql = "INSERT INTO tables (table_number, capacity, table_type, status, notes) VALUES (?, ?, ?, ?, ?)";
  db.query(sql, [table_number, capacity, table_type, status, notes], (err, result) => {
    if (err) {
      console.error("DB ERROR:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }

    res.json({ success: true, message: "Table created successfully", tableId: result.insertId });
  });
});

// Fetch all tables
app.get("/api/tables", (req, res) => {
  db.query("SELECT * FROM tables ORDER BY id DESC", (err, results) => {
    if (err) return res.status(500).json({ success: false, message: "Database error" });
    res.json({ success: true, data: results });
  });
});
// ADD MENU ITEM
// ADD MENU WITH IMAGE
app.post("/api/menu/add", upload.single("image"), (req, res) => {

  const { name, category, price, description, isVeg, available } = req.body;

  const imagePath = req.file ? req.file.filename : null;

  const sql = `
    INSERT INTO menu
    (name, category, price, description, is_veg, available, image)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      name,
      category,
      price,
      description,
      isVeg === "true" ? 1 : 0,
      available === "true" ? 1 : 0,
      imagePath
    ],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.json({ success: false });
      }
      res.json({ success: true });
    }
  );
});
// GET all menu items
app.get("/api/menu", (req, res) => {
  db.query("SELECT * FROM menu ORDER BY id DESC", (err, results) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ success: false, message: "Database error" });
    }
    res.json(results); // send array of menu items
  });
});
// CREATE ORDER 
app.post("/api/orders", (req, res) => {
  const { table_id, items } = req.body;

  if (!table_id || !items || items.length === 0) {
    return res.status(400).json({ success: false, message: "Invalid order data" });
  }

  const insertSql =
    "INSERT INTO orders (table_id, menu_id, quantity) VALUES (?, ?, ?)";

  try {
    items.forEach((item) => {
      db.query(insertSql, [table_id, item.menu_id, item.quantity]);
    });

    res.json({ success: true, message: "Order placed successfully" });

  } catch (error) {
    console.log("ORDER INSERT ERROR:", error);
    res.status(500).json({ success: false, message: "Order failed" });
  }
});// GET ORDERS 
app.get("/api/orders", (req, res) => {

  const sql = `
  
    SELECT o.id, o.quantity, o.status,
       o.created_at,
       t.table_number,
       m.name AS menu_name
    FROM orders o
    JOIN tables t ON o.table_id = t.id
    JOIN menu m ON o.menu_id = m.id
    ORDER BY o.created_at DESC
  `;

  db.query(sql, (err, results) => {
    if (err) {
      console.log("FETCH ORDER ERROR:", err);
      return res.status(500).json({ success: false });
    }
    res.json(results);
  });
});
// UPDATE ORDER STATUS
app.put("/api/orders/:id", (req, res) => {
  const { status } = req.body;
  const orderId = req.params.id;

  const sql = "UPDATE orders SET status = ? WHERE id = ?";

  db.query(sql, [status, orderId], (err, result) => {
    if (err) {
      return res.status(500).json({ success: false });
    }
    res.json({ success: true });
  });
});
// GET ALL STAFF 
app.get("/api/staff", (req, res) => {

  const sql = "SELECT id, full_name, mobile, role, is_active, profile_image FROM user ORDER BY id DESC";

  db.query(sql, (err, results) => {
    if (err) {
      console.log("FETCH STAFF ERROR:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, data: results });
  });
});
//  UPDATE STAFF STATUS 
app.put("/api/staff/:id/status", (req, res) => {

  const staffId = req.params.id;
  const { is_active } = req.body;

  const sql = "UPDATE user SET is_active = ? WHERE id = ?";

  db.query(sql, [is_active, staffId], (err, result) => {
    if (err) {
      console.log("UPDATE STATUS ERROR:", err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, message: "Status updated" });
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});