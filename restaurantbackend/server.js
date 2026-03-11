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
const nodemailer = require("nodemailer");

let otpStore = {}; // temporary store

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "rayesharayesha61@gmail.com",
    pass: "hzzhenvbdatuuddj"
  },
  tls:{
    rejectUnauthorized: false
  }
});
app.post("/api/forgot-password", (req, res) => {

  const { email } = req.body;

  const sql = "SELECT * FROM user WHERE email=?";

  db.query(sql, [email], (err, result) => {

    if (result.length === 0) {
      return res.json({ success:false, message:"Email not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    otpStore[email] = otp;

    const mailOptions = {
      from: "rayeshrayesha61@gmail.com",
      to: email,
      subject: "Password Reset OTP",
      text: `Your OTP is ${otp}`
    };

    transporter.sendMail(mailOptions, (error, info) => {

      if(error){
        console.log(error);
        return res.json({ success:false });
      }

      res.json({ success:true, message:"OTP sent to email" });

    });

  });

});
app.post("/api/verify-otp", (req,res)=>{

const {email, otp} = req.body;

if(otpStore[email] == otp){
res.json({success:true});
}
else{
res.json({success:false, message:"Invalid OTP"});
}

});
app.post("/api/reset-password", async (req,res)=>{

const {email, otp, password} = req.body;

if(otpStore[email] != otp){
return res.json({success:false, message:"Invalid OTP"});
}

const hashed = await bcrypt.hash(password,10);

db.query(
"UPDATE user SET password=? WHERE email=?",
[hashed, email],
(err,result)=>{

if(err){
return res.json({success:false});
}

delete otpStore[email];

res.json({
success:true,
message:"Password updated"
});

});

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

app.get("/api/orders", (req, res) => {

  const sql = `
    SELECT 
      o.id, 
      o.quantity, 
      o.status,
      o.created_at,
      t.table_number,
      m.name AS menu_name,
      m.price AS price
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

app.post("/create-bill", (req, res) => {

  const { id } = req.body;

  const sql = "UPDATE orders SET status='Ready' WHERE id=?";

  db.query(sql, [id], (err, result) => {

    if(err){
      res.json({success:false});
    } else {
      res.json({success:true});
    }

  });

});

app.post("/api/generate-bill", (req, res) => {
  const {
    order_id,
    table_number,
    subtotal,
    discount_percent,
    discount_amount,
    gst,
    tip,
    total,
  } = req.body;

  const billSql = `
    INSERT INTO billspay 
    (order_id, table_number, subtotal, discount_percent, discount_amount, gst, tip, total)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    billSql,
    [
      order_id,
      table_number,
      subtotal,
      discount_percent,
      discount_amount,
      gst,
      tip,
      total,
    ],
    (err, result) => {
      if (err) {
        console.log("Bill Insert Error:", err);
        return res.status(500).json({ error: "Bill creation failed" });
      }

      // Update order status
      db.query(
        "UPDATE orders SET status='Paid' WHERE id=?",
        [order_id]
      );

      // 🔥 TABLE AVAILABLE UPDATE
      db.query(
        "UPDATE tables SET status='Available' WHERE table_number=?",
        [table_number]
      );

      res.json({
        message: "Bill generated successfully",
        bill_id: result.insertId,
      });
    }
  );
});
app.get("/admin-total-sales", (req, res) => {

  const sql = `
    SELECT SUM(total) AS total_sales
    FROM billspay
  `;

  db.query(sql, (err, result) => {
    if (err) {
      console.log("Total Sales Error:", err);
      return res.status(500).json({ message: "Error fetching total sales" });
    }

    res.json(result[0]);
  });

});

app.get("/get-bills", (req, res) => {

  const sql = `
  SELECT 
    o.id,
    o.status,
    t.table_number,
    m.name AS menu_name,
    m.price,
    o.quantity
  FROM orders o
  JOIN tables t ON o.table_id = t.id
  JOIN menu m ON o.menu_id = m.id
  ORDER BY o.id DESC
  `;

  db.query(sql, (err, results) => {

    if (err) {
      console.log("Fetch Bills Error:", err);
      return res.status(500).json([]);
    }

    res.json(results);

  });

});


app.get("/bill-history", (req, res) => {

  const sql = "SELECT * FROM billspay ORDER BY id DESC";

  db.query(sql, (err, result) => {

    if (err) {
      console.log(err);
      return res.status(500).json([]);
    }

    res.json(result);

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

app.get("/api/tables/available-count", (req, res) => {
  const sql = "SELECT COUNT(*) AS available FROM tables WHERE status = 'Available'";

  db.query(sql, (err, result) => {
    if (err) {
      console.log("DB ERROR:", err);
      return res.status(500).json({ success: false });
    }

    res.json({
      success: true,
      available: result[0].available
    });
  });
});
app.get("/api/orders/queue-count", (req,res)=>{

const sql="SELECT COUNT(*) AS total FROM orders WHERE status='Pending'";

db.query(sql,(err,result)=>{

if(err){
return res.status(500).json({success:false});
}

res.json({
success:true,
queue:result[0].total
});

});

});
app.get("/api/orders-tables", (req, res) => {
  const sql = "SELECT * FROM tables WHERE status='Occupied'";
  db.query(sql, (err, result) => {
    if (err) {
      res.json({ success:false });
    } else {
      res.json({ success:true, data: result });
    }
  });
});
app.get("/api/inventory", (req,res)=>{
db.query("SELECT * FROM inventory",(err,result)=>{
if(err) res.status(500).json(err);
else res.json(result);
});
});
app.post("/api/inventory",(req,res)=>{

const {name,quantity,unit} = req.body;

const qty = parseInt(quantity);   // convert to number

db.query(
"INSERT INTO inventory(name,quantity,unit) VALUES(?,?,?)",
[name, qty, unit],
(err,result)=>{
if(err){
console.log("Inventory Insert Error:",err);
res.status(500).json(err);
}
else res.json({success:true});
});

});
app.put("/api/inventory/:id",(req,res)=>{

const { quantity } = req.body;

const qty = parseInt(quantity);   // convert to number

db.query(
"UPDATE inventory SET quantity=? WHERE id=?",
[qty, req.params.id],
(err,result)=>{
if(err){
console.log("Update Stock Error:", err);
res.status(500).json(err);
}
else res.json({success:true});
});

});
// app.listen(5000, () => {
//   console.log("Server running on port 5000");
// });
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));