const { Router } = require('express');
const authController = require('../controllers/authController');
const { requireAuth } = require('../middleware/authMiddleware');
const User = require('../models/User');

const router = Router();

router.get('/signup', authController.signup_get);
router.post('/signup', authController.signup_post);
router.get('/login', authController.login_get);
router.post('/login', authController.login_post);
router.get('/logout', authController.logout_get);

// Новий маршрут для поповнення балансу
router.post('/top-up', requireAuth, async (req, res) => {
  try {
    const userId = req.user._id; // Припустимо, що req.user містить ідентифікатор користувача
    console.log(`User ID: ${userId}`);
    const { amount } = req.body;
    console.log(`Amount: ${amount}`);
    
    // Знайти користувача та оновити його баланс
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }
    console.log(`Current Balance: ${user.balance}`);
    user.balance += parseFloat(amount);
    await user.save();
    
    console.log(`New Balance: ${user.balance}`);
    res.json({ balance: user.balance });
  } catch (error) {
    console.error('Помилка поповнення балансу:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;