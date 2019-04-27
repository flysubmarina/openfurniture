var mysql = require("mysql");
let handled = false;
const connectionConfig = {
    host: "den1.mysql1.gear.host",
    user: "openfurniture",
    password: "Yu767K-?u1J2",
    database: "openfurniture",
    connectTimeout: 40000,
}

let connection = mysql.createConnection(connectionConfig);

function handleDisconnect() {
    console.log("handle disconect");
    connection = mysql.createConnection(connectionConfig);

    connection.connect(function (err) {              // The server is either down
        if (err) {                                     // or restarting (takes a while sometimes).
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000); // We introduce a delay before attempting to reconnect,
        }                                     // to avoid a hot loop, and to allow our node script to
    });
    connection.on('error', function (err) {
        console.log('db error WARNING', err);
        if (err.code == 'ETIMEDOUT') {
            handleDisconnect()
        }
        if (err.code === 'PROTOCOL_CONNECTION_LOST' || err.code === 'PROTOCOL_ENQUEUE_AFTER_FATAL_ERROR') { // Connection to the MySQL server is usually
            handleDisconnect()                         // lost due to either server restart, or a
        } else {                                      // connnection idle timeout (the wait_timeout
            throw err                                 // server variable configures this)
        }
    });
}






const query = sql => {
    if(!handled){
        handleDisconnect();
        handled = true;
    }

    return new Promise((resolve, reject) => {
        connection.query(sql, (err, result) => {
            if (err) {
               reject(err)
            }
            resolve(result)
        })
    })
}

module.exports = query;