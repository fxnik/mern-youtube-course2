const jwt = require('jsonwebtoken')
const config = require('config')

module.exports = (req, res, next) => {
  if (req.method === 'OPTIONS') // REST API проверяет доступность сервера
  {
    return next()
  }

  try 
  {
    const token = req.headers.authorization.split(' ')[1] // "Bearer TOKEN"

    if (!token)  
    {
      return res.status(401).json({ message: 'Нет авторизации' })
    }

    const decoded = jwt.verify(token, config.get('jwtSecret')) //раскодировать токен
    req.user = decoded //создаем поле user
    next()

  } catch (e) 
  {
    res.status(401).json({ message: 'Нет авторизации' }) //если токен не раскодирован
  }
}