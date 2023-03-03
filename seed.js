const { Pool } = require('pg');
const pool = require('./connDB');

// run seed SQL
pool.query(`SELECT COUNT(*) FROM accounts`, (err, data) => {
    if (data.rows[0].count == 0) {
        pool.query(`INSERT INTO accounts (bank, type) VALUES 
            ('USAA', 'Checking'),
            ('USAA', 'Savings'),
            ('Navy Federal', 'Checking'),
            ('Navy Federal', 'Savings');`,
            (err, data) => {
                if (err){
                    console.log("Insert failed (accounts)");
                } else {
                    console.log(data);
                }
            }
        );
    }
});

pool.query(`SELECT COUNT(*) FROM deposits`, (err, data) => {
    if (data.rows[0].count == 0) {
        pool.query(`INSERT INTO deposits (account_id, amount, who, date, note) VALUES 
        (1, 125, 'WalMart', '1 Mar 2023', 'Groceries'),
        (1, 102, 'SafeWay', '1 Mar 2023', 'Groceries'),
        (3, 133, 'WalMart', '1 Mar 2023', 'Groceries'),
        (3, 125, 'WalMart', '5 Mar 2023', 'Monirot'),
        (3, 207, 'Best Buy', '1 Mar 2023', 'TV'),
        (2, 25, 'Sears', '1 Mar 2023', 'Tools'),
        (1, 56, 'Taco Palace', '1 Mar 2023', 'Dinner'),
        (1, 76, 'Chili', '3 Mar 2023', 'Dinner'),
        (1, 23, 'McDonalds', '5 Mar 2023', 'Lunch'),
        (3, 16, 'Taco Bell', '2 Mar 2023', 'Lunch'),
        (3, 75, 'Church', '1 Mar 2023', 'Tithe');`, 
        (err, data) => {
            if (err){
                console.log("Insert failed (deposits)");
            } else {
                console.log(data);
            }
        }
        );
    }
});


// close connection
pool.end();