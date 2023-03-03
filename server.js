// define dependencies
const { Pool } = require("pg");
const cors = require("cors");
const express = require("express");
const app = express();
app.use(express.json());
app.use(cors());
//app.use(cors({ origin: '*' }));

// define port number
const port = 8000;

// define structure for accessing database
const pool = new Pool ({
  user: 'postgres',
  host: 'postgres-db',
  database: 'money',
  password: 'password',
  port: 5432
});

// listen to the port
app.listen(port, function () {
  console.log(`Server is listening on port ${port}.`);
});

//
// here is where all of your requests with routes go
//

// test request to verify this file is working
app.get("/api/test", (req, res, next) => {
  res.send('Programming is so awesome!');
})

// return all entries for table accounts
app.get("/api/accounts", (req, res, next) => {
  const result = pool.query('SELECT * FROM accounts;', (err, data) => {
    if (err) {
      return next ({ status: 500, message: err });
    }
    res.send(data.rows);
  })
});

// return all entries for table deposits
app.get("/api/deposits", (req, res, next) => {
  const result = pool.query('SELECT * FROM deposits;', (err, data) => {
    if (err) {
      return next ({ status: 500, message: err });
    }
    res.send(data.rows);
  })
});

// return all deposits where account = id
app.get("/api/accounts/:id/deposits", (req, res, next) => {
  let id = parseInt(req.params.id);
  const result = pool.query('SELECT * FROM deposits WHERE account_id = $1;', [id], (err, data) => {
    if (err) {
      return next ({ status: 500, message: err });
    }
    res.send(data.rows);
  })
});

// retun only the requested entry from accounts
app.get("/api/accounts/:id", (req, res, next) => {
  let id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return next({ status: 404, message: "Please enter correct account number" });
  }
  const result = pool.query(`SELECT * FROM accounts WHERE id = $1;`, [id], (err, data) => {
    if (err) {
      return next({ status: 500, message: err});
    }
    else if (data.rowCount == 0) {
      return next({ status: 404, message: `Please enter a valid account id` });
    }
    res.send(data.rows[0]);
  });
});

// retun only the requested entry from deposits
app.get("/api/deposits/:id", (req, res, next) => {
  let id = parseInt(req.params.id);
  if (!Number.isInteger(id)) {
    return next({ status: 404, message: "Please enter correct deposit number" });
  }
  const result = pool.query(`SELECT * FROM deposits WHERE id = $1;`, [id], (err, data) => {
    if (err) {
      return next({ status: 500, message: err});
    }
    else if (data.rowCount == 0) {
      return next({ status: 404, message: `Please enter a valid deposit id` });
    }
    res.send(data.rows[0]);
  });
});

// Adds a new row to deposits connected to account id
app.post("/api/accounts/:id/deposits", (req, res, next) => {
  let id = parseInt(req.params.id);
  const { amount, who, date, note } = req.body;
  if ( !amount || !who || !date || !note || !Number(amount) ) {
    return next({ status: 400, message: `Submitted information was incorrect. ${amount}, ${who}, ${date}, ${note}` });
  }
  // Verify that the account id exists
  const result = pool.query(`SELECT * FROM accounts WHERE id = $1;`, [id], (readError, data) => {
    if (readError) {
      return next({ status: 500, message: readError});
    }
    else {
      if (data.rowCount == 0) {
        return next({ status: 404, message: `Account ${id} does not exist.`});
      }
      // Add data to the deposits table
      const result = pool.query(`INSERT INTO deposits (account_id, amount, who, date, note) VALUES ($1, $2, $3, $4, $5);`, [id, amount, who, date, note], (writeError, data) => {
        if (writeError) {
          return next({ status: 500, message: writeError });
        }
        res.send(`Added: { id: ${id}, amount: ${amount}, who: ${who}, date: ${date}, note: ${note} }`);
      });
    };
  });
});

// Changes/replaces information in row id of Table 1
app.patch("/api/accounts/:idAcc/deposits/:idDep", (req, res, next) => {
  const idAcc = parseInt(req.params.idAcc);
  const idDep = parseInt(req.params.idDep);
  const request = req.body;

  const result1 = pool.query(`SELECT * FROM accounts WHERE id = $1;`, [idAcc], (readError, data) => {
    if (readError) {
      return next({ status: 500, message: readError});
    }
    else if (data.rowCount == 0) {
      return next({status: 404, message: `Account ${idAcc} does not exist.`});
    }
    const result2 = pool.query(`SELECT * FROM deposits WHERE id = $1 AND account_id = $2;`, [idDep, idAcc], (readError, data) => {
      if (readError) {
      return next({ status: 500, message: readError});
      }
      else if (data.rowCount == 0) {
        return next({status: 404, message: `Deposit ${idDep} from Account ${idAcc} does not exist.`});
      }
    })
    // for loop allows for changing more than one value at a time
    for (let key in request){
      if (key == 'amount' && !Number(request[key])) {
        return next({stutus: 400, message: `Submitted amount is not a number.`})
      }
      else if (key == 'amount') {
        const result = pool.query(`UPDATE deposits SET amount=$1 WHERE id = $2;`, [request[key], idDep], (writeError, data)=> {
          if (writeError) {
            return next({status: 500, message: writeError});
          }
        });
      }
      else if (key == 'who') {
        const result = pool.query(`UPDATE deposits SET who=$1 WHERE id = $2;`, [request[key], idDep], (writeError, data)=> {
          if (writeError) {
            return next({status: 500, message: writeError});
          }
        });
      }
      else if (key == 'date') {
        const result = pool.query(`UPDATE deposits SET date=$1 WHERE id = $2;`, [request[key], idDep], (writeError, data) => {
          if (writeError) {
            return next({status: 500, message: writeError});
          }
        });
      }
      else if (key == 'note') {
        const result = pool.query(`UPDATE deposits SET note=$1 WHERE id = $2;`, [request[key], idDep], (writeError, data) => {
          if (writeError) {
            return next({status: 500, message: writeError});
          }
        });
      }
      else if (key == 'account_id') {
        const result = pool.query(`SELECT * FROM accounts WHERE accounts_id = $1;`, [account_id], (readError, data) => {
          if (readError) {
            return next({ status: 500, message: readError});
          }
          else if (data.rowCount == 0) {
            return next({status: 404, message: `Account ${request[key]} to change to does not exist.`});
          }
          const result = pool.query(`UPDATE deposits SET account_id=$1 WHERE id = $2;`, [request[key], idDep], (writeError, data) => {
            if (writeError) {
              return next({status: 500, message: writeError});
            }
          });
        });
      }
      else {
        return next({status: 400, message: `Request was bad. Can only change "amount", "who", "date", and/or "note"`})
      }
    }
    const result = pool.query(`SELECT * FROM deposits WHERE id = $1;`, [idDep], (readError, updatedData) => {
      updatedData = updatedData.rows[0];
      res.send(`Updated: { id: ${updatedData.id}, account_id: ${updatedData.account_id}, amount: ${updatedData.amount}, who: ${updatedData.who}, date: ${updatedData.date}, note: ${updatedData.note} }`);
    });
  });
});

// Deletes an row of id from Table 1
app.delete("/api/deposits/:id", (req, res, next) => {
  const id = parseInt(req.params.id);
  // Verify the ID exists
  const result = pool.query(`SELECT * FROM deposits WHERE id = $1;`, [id], (readError, deletedData) => {
    if (readError) {
      return next({ status: 500, message: readError});
    }
    else if (deletedData.rowCount == 0) {
      return next({status: 404, message: `Deposit ${id} does not exist.`});
    }
    // store the data that we are about to delete
    deletedData = deletedData.rows[0];
    //delete the data
    const result = pool.query(`DELETE FROM deposits WHERE id = $1;`, [id], (writeError, data) => {
      if (writeError) {
        return next({ status: 500, message: writeError });
      }
      res.send(`Deleted: { id: ${deletedData.id}, amount: ${deletedData.amount}, who: ${deletedData.who}, date: ${deletedData.date}, note: ${deletedData.note} }`);
    });
  });
});

//
// Below are standard routes -- leave alone
//

// if an error occured  -- Keep next to last
app.use((err, req, res, next) => {
  //console.error("Error Stack: ", err.stack);
  res.status(err.status).send({ error: err });
});

// if requested handle does not exist -- keep last
app.use((req, res, next) => {
  // res.status(404).send(`Path Not Found: ${req.url}`);   // Only sends message or JSON, not both
  res.status(404).json({ error: { message: `Path Not Found: ${req.url}` } });
});