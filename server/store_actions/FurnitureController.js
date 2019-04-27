const redis = require('redis')
const client = redis.createClient()
const redisAsyncSet = require('util').promisify(client.set).bind(client)
const redisAsyncGet = require('util').promisify(client.get).bind(client)
const setFurnitureHeight = async (IdRoom, height, unlock) => {
    const value = height.toString().concat(':').concat(unlock.toString());
    return await redisAsyncSet(IdRoom, value)

}

const getFurnitureHeight = async (IdRoom) => {
 //   const key = IdRoom.toString().concat('.').concat(IdFurniture.toString())
    return await redisAsyncGet(IdRoom)
}

module.exports = {
    setFurnitureHeight, getFurnitureHeight
}