const Pool = require('pg').Pool
const pool = new Pool({
  user: 'postgres.qkbcoirsgjnavtmactvi',
  host: 'aws-0-us-east-1.pooler.supabase.com',
  database: 'postgres',
  password: 'fdJvWvj77H0SdAnE',
  port: 5432,
})




module.exports={
  pool
}
