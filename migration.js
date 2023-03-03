const { Pool } = require('pg');
const DATABASE_URL = process.env.DATABASE_URL;
const pool = require('./dbConn');

// run migration SQL
pool.query(`CREATE TABLE IF NOT EXISTS accounts (
    id SERIAL PRIMARY KEY,
    bank varchar(30),
    type varchar(15))`,
    (err, data) => {
        if (err){
            console.log("CREATE TABLE pets failed");
        } else {
            console.log("pets table created sucessfully");
        }
    }
);

pool.query(`CREATE TABLE IF NOT EXISTS deposits (
    id SERIAL PRIMARY KEY,
    account_id INTEGER NOT NULL,
    amount INTEGER,
    who varchar(30),
    date varchar(30),
    note TEXT)`,
    (err, data) => {
        if (err){
            console.log("CREATE TABLE pets failed");
        } else {
            console.log("pets table created sucessfully");
        }
    }
);

// close connection
pool.end();