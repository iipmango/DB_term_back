import express from "express"
import mysql from "mysql"
import bodyParser from "body-parser"
import cors from "cors"

import dbconf from "./conf/auth.js"

const app = express()
const port = 3010

const db = mysql.createConnection(dbconf)

db.connect()

app.use(cors())
app.use(bodyParser.json())

app.get('/', (req, res) => {
  res.json({result: "success"})
})

app.get('/player', (req, res) => {
    const { attributeName, attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 이름과 값 받아옵니다.
  
    let sql = '';
    if (attributeName === 'name') {
      sql = `SELECT * FROM player WHERE player_name = '${attributeValue}'`;
    } else if (attributeName === 'back_number') {
      sql = `SELECT * FROM player WHERE player_number = ${attributeValue}`;
    } else if (attributeName === 'position') {
      sql = `SELECT * FROM player WHERE position = '${attributeValue}'`;
    } else if (attributeName === 'team') {
      sql = `SELECT * FROM player WHERE team = '${attributeValue}'`;
    } else {
      res.json({ result: 'error', message: 'Invalid attribute name' });
      return;
    }
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.json({ result: 'error' });
        return console.log(err);
      }
      res.json(rows);
    });
  });
  

app.get('/stats', (req, res) => {
    const { attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 값 받아옵니다.

    const sql = `SELECT * FROM stats
                WHERE player_id = (
                  SELECT id FROM player
                  WHERE player_name = '${attributeValue}'
                )`;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.json({ result: 'error' });
        return console.log(err);
      }
      res.json(rows);
    });
})

app.get('/team', (req, res) => {
    const { attributeName, attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 이름과 값 받아옵니다.
  
    let sql = '';
    if (attributeName === 'team_name') {
      sql = `SELECT * FROM player WHERE player_name = '${attributeValue}'`;
    } else if (attributeName === 'city') {
      sql = `SELECT * FROM player WHERE player_number = ${attributeValue}`;
    } else if (attributeName === 'abbreviation') {
      sql = `SELECT * FROM player WHERE position = '${attributeValue}'`;
    } else {
      res.json({ result: 'error', message: 'Invalid attribute name' });
      return;
    }
    db.query(sql, (err, rows) => {
        if (err) {
            res.json({result: "error"})
            return console.log(err)
        }
        res.json(rows)
    })
})

app.listen(port, () => {
  console.log(`서버 실행됨 (port ${port})`)
})