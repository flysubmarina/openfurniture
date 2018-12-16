const redis = require('redis')
const client = redis.createClient()
const redisAsyncSet = require('util').promisify(client.set).bind(client)
const redisAsyncGet = require('util').promisify(client.get).bind(client)
const setFurnitureHeight = async (IdRoom, IdFurniture, height) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncSet(key, height.toString())

}

const getFurnitureHeight = async (IdRoom, IdFurniture) => {
    const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncGet(key)
}

module.exports = {
    setFurnitureHeight, getFurnitureHeight
}