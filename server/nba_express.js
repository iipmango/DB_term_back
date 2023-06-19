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

app.get('/column', (req, res) => {
  const {attributeName} = req.query;

  let sql = '';
  sql = `SELECT COLUMN_NAME
  FROM INFORMATION_SCHEMA.COLUMNS
  WHERE TABLE_NAME = '${attributeName}';
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      res.json({ result: 'error' });
      return console.log(err);
    }
    res.json(rows);
    console.log(rows);
  });
})

app.get('/players', (req, res) => {
    const { attributeName, attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 이름과 값을 받아옵니다.
  
    let sql = '';
    if (attributeName === 'player_name') {
      sql = `SELECT players.*, teams.image
      FROM players
      INNER JOIN teams ON players.team_id = teams.team_id
      WHERE players.player_name LIKE '%${attributeValue}%'
      ORDER BY players.${attributeName} ASC`;
    } else if (attributeName === 'player_position') {
        sql = `SELECT players.*, teams.image
        FROM players
        INNER JOIN teams ON players.team_id = teams.team_id
        WHERE players.player_position = '${attributeValue}'
        ORDER BY players.player_name ASC`;
    } else if (attributeName === 'team') {
        sql = `SELECT players.*, teams.team_name, teams.image
        FROM players
        INNER JOIN teams ON players.team_id = teams.team_id
        WHERE teams.team_name LIKE '%${attributeValue}%'
        ORDER BY players.player_name ASC`;
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
    const { attributeName, attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 값 받아옵니다.

    const sql = `SELECT players.player_name, player_stats.*
                FROM player_stats
                INNER JOIN players ON player_stats.player_id = players.player_id
                WHERE players.player_name LIKE '%${attributeValue}%'
                `;
  
    db.query(sql, (err, rows) => {
      if (err) {
        res.json({ result: 'error' });
        return console.log(err);
      }
      res.json(rows);
    });
})

app.get('/teams', (req, res) => {
    const { attributeName, attributeValue } = req.query; // 프론트에서 선택한 어트리뷰트 이름과 값 받아옵니다.
  
    let sql = '';
    if (attributeName === 'team_name') {
      sql = `SELECT * FROM teams WHERE team_name LIKE '%${attributeValue}%'`;
    } else if (attributeName === 'city') {
      sql = `SELECT * FROM teams WHERE team_city = '${attributeValue}'`;
    } else if (attributeName === 'abbreviation') {
      sql = `SELECT * FROM teams WHERE team_abbreviation = '${attributeValue}'`;
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