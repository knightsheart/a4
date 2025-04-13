const oracledb = require('oracledb');

const dbConfig = {
  user: 'COMP214_W25_ers_31',
  password: 'password',
  connectionString: '199.212.26.208:1521/SQLD'
};

let connection;

async function initialize() {
    connection = await oracledb.getConnection(dbConfig);
    console.log('✅ Connected to Oracle DB');
    return connection;
}

async function getConnection() {
    if (connection) return connection;
    return initialize();
}

module.exports = { initialize, getConnection };
