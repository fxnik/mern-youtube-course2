const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    //fields
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    links: [{type: Types.ObjectId, ref: 'Link'}] // связка модели пользователя и записей в БД, к какой коллекции мы привязываемся //Link - это модель
})

module.exports = model('User', schema)