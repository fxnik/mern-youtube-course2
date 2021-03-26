const {Router} = require('express')
const config = require('config')
const shortid = require('shortid')
const Link = require('../models/Link')
const auth = require('../middleware/auth.middleware') // защищает endpoint чтобы неавторизованые пользователи не могли создавать ссылки owner:req.user.userId
const router = Router()

//------------------------------------------------------------

router.post('/generate', auth, async (req, res) => 
{
  try 
  {
    const baseUrl = config.get('baseUrl')

    const {from} = req.body // тот путь от куда мы делаем данную ссылку

    const code = shortid.generate() //получаем уникальный код //ссылка должна быть короткой//использовать уникальный ключ

    const existing = await Link.findOne({ from })

    if (existing) //если существует
    {
      return res.json({ link: existing }) //все данные по ссылке сформированы  и нет смысла заново их формировать
    }

    const to = baseUrl + '/t/' + code //формирование сокращенной ссылки

    const link = new Link({ //новый обьект ссылки и передаем в конструктор все параметры
      code, to, from, owner: req.user.userId
    })

    await link.save()

    res.status(201).json({ link })
  } 
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

//------------------------------------------------------------------

router.get('/', auth, async (req, res) => 
{
  try 
  {
    const links = await Link.find({ owner: req.user.userId }) //найти все ссылки которые относятся к текущему пользователю// поле user создано в '../middleware/auth.middleware'

    res.json(links)
  } 
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

//----------------------------------------------------------------------

router.get('/:id', auth, async (req, res) => 
{
  try 
  {
    const link = await Link.findById(req.params.id) //получаем ссылку

    res.json(link)
  } 
  catch (e) 
  {
    res.status(500).json({ message: 'Что-то пошло не так, попробуйте снова' })
  }
})

//----------------------------------------------------------------------

module.exports = router