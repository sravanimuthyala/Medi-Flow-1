const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async (req, res) => {
  try {
const {
  fullname,
  email,
  password,
  role,
  phone,
  specialization,
  department,
  qualification,
  experience,
  fee,
  hospitalId,
  bio,
  image
} = req.body;
    if (!fullname || !email || !password || !role) {
      return res.status(400).json({
        message: "All fields required",
      });
    }

    const existingUser = await pool.query(
      "SELECT * FROM users WHERE email=$1",
      [email],
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({
        message: "Email already exists",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await pool.query(
  `INSERT INTO users
  (fullname,email,password,role,phone)
  VALUES($1,$2,$3,$4,$5)
  RETURNING id,fullname,email,role`,
  [fullname, email, hashedPassword, role, phone]
);

if (role === "doctor") {
  await pool.query(
    `INSERT INTO doctors
    (
      name,
      email,
      phone,
      specialization,
      department,
      hospital_id,
      qualification,
      experience,
      fee,
      rating,
      image,
      bio,
      user_id,
      active
    )
    VALUES
    (
      $1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14
    )`,
    [
      fullname,
      email,
      phone,
      specialization,
      department,
      hospitalId,
      qualification,
      experience,
      fee,
      0,
      image,
      bio,
      result.rows[0].id,
      true
    ]
  );
}

    res.status(201).json({
      message: "User Registered Successfully",
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Server Error",
    });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await pool.query("SELECT * FROM users WHERE email=$1", [
      email,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not Found",
      });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      },
    );

    res.json({
      token,
      user: {
        id: user.id,
        fullname: user.fullname,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id,fullname,email,role,phone
       FROM users
       WHERE id=$1`,
      [req.user.id],
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json({
      user: result.rows[0],
    });
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server Error",
    });
  }
};

module.exports = { register, login, getCurrentUser };
