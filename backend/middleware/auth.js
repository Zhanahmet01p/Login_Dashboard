const jwt = require('jsonwebtoken');


const pool = require('../db'); 

const checkUserStatus = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Не авторизован' });
    }

    
    const decodedUser = jwt.verify(token, process.env.JWT_SECRET);

    const result = await pool.query('SELECT * FROM users WHERE id = $1', [decodedUser.id]);
    const user = result.rows[0];

    if (!user || user.status === 'blocked') {
      return res.status(403).json({ message: 'Аккаунт заблокирован или удален' });
    }

    req.user = user; 
    next(); 
  } catch (error) {
    if (error.name === 'JsonWebTokenError' || error.name === 'TokenExpiredError') {
      return res.status(403).json({ message: 'Токен не валиден или истек' });
    }

    console.error('Ошибка в мидлваре checkUserStatus:', error);
    res.status(500).json({ message: 'Ошибка сервера' });
  }
};

module.exports = { checkUserStatus };