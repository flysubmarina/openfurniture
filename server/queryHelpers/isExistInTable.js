const query = require('../dbConnector')


const isExist = (tableName, fieldName, value) => {
    return new Promise((resolve, reject) => {
        query(`select * from ${tableName} where ${fieldName} = '${value}'`).then(data => {
            if (data.length > 0) {
                resolve(true)
            } else {
                resolve(false)
            }
        }).catch(err => {
            reject(err)
        })
    })
}


const TABLES = {
    USER: {
        TABLE_NAME: 'user',
        FIELDS: {
            ID_USER: 'IdUser',
            LOGIN: 'login',
            PASSWORD: 'password',
            TYPE: 'type'
        }
    },
    ROOM: {
        TABLE_NAME: 'room',
        FIELDS: {
            ID_ROOM: 'IdRoom',
            NUM: 'num'
        }
    },
    FURNITURE: {
        TABLE_NAME: 'furniture',
        FIELDS: {
            ID_FURNITURE: 'IdFurniture',
            NAME: 'name',
            TYPE: 'type',
            SRC: 'src'
        }
    },
    ROOM_FURNITURE: {
        TABLE_NAME: 'room',
        FIELDS: {
            ID: 'id',
            ID_ROOM: 'IdRoom',
            ID_FURNITURE: 'IdFurniture',
        }
    },
    USER_ROOM: {
        TABLE_NAME: 'user_room',
        FIELDS: {
            ID_ROOM: 'IdRoom',
            ID_USER: 'IdUser',
        }
    },
    USER_PROFILE: {
        TABLE_NAME: 'user_profile',
        FIELDS: {
            ID_USER: 'IdUser',
            ID_FURNITURE: 'IdFurniture',
            HEIGHT: 'height'
        }
    }
}

module.exports.TABLES = TABLES
module.exports.isExist = isExist
