const { Pool } = require('pg');
const dotenv = require('dotenv')

dotenv.config()

const PG_URI = process.env.PG_URI

const pool = new Pool({
  connectionString: PG_URI
})


module.exports = {
  query: (text, params, callback) => {
    console.log('executed query:', text);
    return pool.query(text, params, callback);
  },

  findActivity: (activity, user_id) => {
    const queryString = `SELECT id FROM activities WHERE activity = '${activity}' AND users_id = ${user_id}`
    console.log(queryString)
    return pool.query(queryString);
  },

  addActivity: (activity, user_id) => {
    const queryString = `INSERT INTO activities(activity, user_id) VALUES('${activity}', ${user_id})`
    console.log(queryString)
    return pool.query(queryString);
  },

  addLog: (date, mood, activity_id, user_id) => {
    const queryString = `INSERT INTO logs(date, mood, activity_id, user_id) VALUES('${date}', ${mood}, ${activity_id}, ${user_id})`
    return pool.query(queryString)
  },

  getAllUsers: () => {
    const sqlQuery = 'SELECT * FROM users'
    return pool.query(sqlQuery)
  },

  getOneUser: (username) => {
    const sqlQuery = `SELECT * FROM users u where u.username='${username}' LIMIT 1`
    return pool.query(sqlQuery)
  },

  createOneUser: (username, hashedPassword) => {
    const sqlQuery = `INSERT INTO users (username, password) VALUES ('${username}', '${hashedPassword}');`
    console.log(sqlQuery)
    return pool.query(sqlQuery)
  },

  getAllUserActivities: (user_id) => {
    const queryString = 'SELECT * FROM activities WHERE user_id = $1'
    const values = [user_id];
    return pool.query(queryString);
  },

  getAllActivityLogsForUser: (user_id) => {
    const queryString = `SELECT * FROM logs LEFT JOIN activities ON logs.activity_id = activities.id WHERE user_id = ${user_id}`
    return pool.query(queryString)
  },
}