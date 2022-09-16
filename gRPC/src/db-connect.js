const {Pool} = require('pg');

const connectionData = {
    user:'postgres',
    host:'postgres',
    password:'postgres',
    database:'dataset',
    port:5432
}

const client = new Pool(connectionData)

module.exports = {client};