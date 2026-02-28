const bcrypt = require('bcrypt');
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


bcrypt.hash("123456", 10).then(hash => {
  console.log(hash);
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
app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = "SELECT * FROM user WHERE email = ?";
  
  db.query(sql, [email], async (err, result) => {

    if (err) return res.status(500).json(err);

    if (result.length === 0) {
      return res.json({ success: false, message: "User not found" });
    }

    const user = result[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (isMatch) {
      res.json({
        success: true,
        role: user.role,
        name: user.full_name
      });
    } else {
      res.json({
        success: false,
        message: "Invalid credentials"
      });
    }
  });
});
app.post('/api/staff/create', upload.single("profile_image"), async (req, res) => {
  const { full_name, mobile, email, password, role, is_active } = req.body;

  if (!full_name || !mobile || !email || !password || !role) {
    return res.status(400).json({ success: false, message: "All fields required" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10); // 🔐 hash password

    const profile_image = req.file ? req.file.filename : null;
    const isActiveValue = (is_active === 'true' || is_active === true) ? 1 : 0;

    const insertSql = `
      INSERT INTO user (full_name, mobile, email, password, role, is_active, profile_image)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.query(
      insertSql,
      [full_name, mobile, email, hashedPassword, role, isActiveValue, profile_image],
      (err, result) => {
        if (err) {
          console.log("DB INSERT ERROR:", err);
          return res.status(500).json({ success: false, message: "Database insert failed" });
        }

        res.json({ success: true, message: "Staff account created successfully" });
      }
    );

  } catch (error) {
    res.status(500).json({ success: false, message: "Hashing failed" });
  }
});

// app.post('/api/staff/create', upload.single("profile_image"), (req, res) => {
//   const { full_name, mobile, email, password, role, is_active } = req.body;

//   if (!full_name || !mobile || !email || !password || !role) {
//     return res.status(400).json({ success: false, message: "All fields required" });
//   }

//   const profile_image = req.file ? req.file.filename : null;
//   const isActiveValue = (is_active === 'true' || is_active === true) ? 1 : 0;

//   const insertSql = `
//     INSERT INTO user (full_name, mobile, email, password, role, is_active, profile_image)
//     VALUES (?, ?, ?, ?, ?, ?, ?)
//   `;

//   db.query(insertSql, [full_name, mobile, email, password, role, isActiveValue, profile_image], (err, result) => {
//     if (err) {
//       console.log("DB INSERT ERROR:", err);
//       return res.status(500).json({ success: false, message: "Database insert failed", error: err });
//     }

//     res.json({ success: true, message: "Staff account created successfully" });
//   });
// });
// //  LOGIN 
// app.post('/login', (req, res) => {
//   const { email, password } = req.body;

//   const sql = "SELECT * FROM user WHERE email = ? AND password = ?";
  
//   db.query(sql, [email, password], (err, result) => {

//     if (err) return res.status(500).json(err);

//     if (result.length > 0) {
//       res.json({
//         success: true,
//         role: result[0].role,
//         name: result[0].full_name
//       });
//     } else {
//       res.json({
//         success: false,
//         message: "Invalid credentials"
//       });
//     }
//   });
// });

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
// app.post("/api/orders", (req, res) => {
//   const { table_id, items } = req.body;

//   if (!table_id || !items || items.length === 0) {
//     return res.status(400).json({ success: false, message: "Invalid order data" });
//   }

//   const insertSql =
//     "INSERT INTO orders (table_id, menu_id, quantity) VALUES (?, ?, ?)";
// // Update table status to Occupied
// const updateTableSql = `
//   UPDATE tables 
//   SET status = 'Occupied', occupied_at = NOW() 
//   WHERE id = ?
// `;

// db.query(updateTableSql, [table_id]);
//   try {
//     items.forEach((item) => {
//       db.query(insertSql, [table_id, item.menu_id, item.quantity]);
//     });

//     res.json({ success: true, message: "Order placed successfully" });

//   } catch (error) {
//     console.log("ORDER INSERT ERROR:", error);
//     res.status(500).json({ success: false, message: "Order failed" });
//   }
// });
app.post("/api/orders", (req, res) => {
  const { table_id, items } = req.body;

  if (!table_id || !items || items.length === 0) {
    return res.status(400).json({ success: false });
  }

  const insertSql =
    "INSERT INTO orders (table_id, menu_id, quantity) VALUES (?, ?, ?)";

const updateTableSql =
  "UPDATE tables SET status = 'Occupied' WHERE id = ?";

  // Update table status
  db.query(updateTableSql, [table_id], (err) => {
    if (err) {
      console.log("TABLE UPDATE ERROR:", err);
      return res.status(500).json({ success: false });
    }

    // Insert orders
    items.forEach((item) => {
      db.query(insertSql, [table_id, item.menu_id, item.quantity]);
    });

    res.json({ success: true });
  });
});
// GET ORDERS 
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
app.post("/api/reservations/create", (req, res) => {
  const { customer_name, phone, table_id, reservation_date, reservation_time, guests } = req.body;

  if (!customer_name || !table_id || !reservation_date || !reservation_time || !guests) {
    return res.status(400).json({ success: false, message: "All required fields must be filled" });
  }

  const insertSql = `
    INSERT INTO reservations 
    (customer_name, phone, table_id, reservation_date, reservation_time, guests) 
    VALUES (?, ?, ?, ?, ?, ?)
  `;

  db.query(
    insertSql,
    [customer_name, phone, table_id, reservation_date, reservation_time, guests],
    (err, result) => {
      if (err) {
        console.log(err);
        return res.status(500).json({ success: false });
      }

      // 🔥 Update table status to Reserved
      db.query(
        "UPDATE tables SET status='Reserved' WHERE id=?",
        [table_id]
      );

      res.json({ success: true, message: "Reservation created" });
    }
  );
});
app.get("/api/reservations/by-date/:date", (req, res) => {
  const { date } = req.params;

  const sql = `
    SELECT r.*, t.table_number 
    FROM reservations r
    JOIN tables t ON r.table_id = t.id
    WHERE DATE(r.reservation_date) = ?
  `;

  db.query(sql, [date], (err, result) => {
    if (err) {
      console.log(err);
      return res.status(500).json({ success: false });
    }

    res.json({ success: true, data: result });
  });
});
app.listen(5000, () => {
  console.log("Server running on port 5000");
});