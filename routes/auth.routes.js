const {Router} = require('express')
const bcrypt = require('bcryptjs')
const config = require('config')
const jwt = require('jsonwebtoken')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')
const router = Router()


// /api/auth/register
router.post(
  '/register',
  [
    check('email', 'Некорректный email').isEmail(),
    check('password', 'Минимальная длина пароля 6 символов').isLength({ min: 6 })
  ],
  async (req, res) => { 
  try 
  {
    //console.log('Body:', req.body)

    const errors = validationResult(req) //результат валидации  check()

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(), // приведение к массиву
        message: 'Некорректный данные при регистрации'
      })
    }

    const {email, password} = req.body

    const candidate = await User.findOne({ email: email }) //ждем пока в БД ищут пользователя по полю email

    if (candidate) 
    {
      return res.status(400).json({ message: 'Такой пользователь уже существует' })
    }

    const hashedPassword = await bcrypt.hash(password, 12) //хеширование пароля
    const user = new User({ email, password: hashedPassword })

    await user.save() //ждем пока пользователь сохранится

    res.status(201).json({ message: 'Пользователь создан' }) //201 -  когда чтото создается

  } 
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

// /api/auth/login
router.post(
  '/login',
  [
    check('email', 'Введите корректный email').normalizeEmail().isEmail(),
    check('password', 'Введите пароль').exists() //пароль должен существовать
  ],
  async (req, res) => {
  try {
    const errors = validationResult(req)

    if (!errors.isEmpty()) {
      return res.status(400).json({
        errors: errors.array(),
        message: 'Некорректный данные при входе в систему'
      })
    }

    const {email, password} = req.body

    const user = await User.findOne({ email: email }) //найти одного пользователя

    if (!user) 
    {
      return res.status(400).json({ message: 'Пользователь не найден' })
    }

    const isMatch = await bcrypt.compare(password, user.password) //сравниваем пароли

    if (!isMatch) 
    {
      return res.status(400).json({ message: 'Неверный пароль, попробуйте снова' })
    }

    const token = jwt.sign(
      { userId: user.id },
      config.get('jwtSecret'),
      { expiresIn: '1h' }
    )

    res.json({ token, userId: user.id })

  } catch (e) {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})


module.exports = router