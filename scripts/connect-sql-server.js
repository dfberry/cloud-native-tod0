const sql = require('mssql');

const config = {
    user: 'sa',
    password: 'YourStrong!Passw0rd',
    server: 'localhost',
    database: 'todo',
    port: 1433
};

sql.connect(config).then(() => {
    console.log('Connected to the database.');
}).catch((error) => {
    console.error('Error connecting to the database: ', error);
});