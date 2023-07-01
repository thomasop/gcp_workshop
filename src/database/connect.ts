import { Sequelize } from "sequelize";

/* let connect = new Sequelize("chat", "root", "root", {
  dialect: "mysql",
  host: "localhost",
  dialectOptions: {
    socketPath: "/Applications/MAMP/tmp/mysql/mysql.sock",
  },
}); */
let connect = new Sequelize(`postgresql://postgres:${process.env.DATABASE_PASSWORD}@db.jqyhiagnqcvjhufbfezl.supabase.co:5432/postgres`)

try {
  connect.authenticate();
  console.log("Database is connecting");
} catch (error) {
  console.log(error);
}

export default connect;
