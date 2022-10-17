/** Common config for bookstore. */


let DB_URI = `postgresql://`;

if (process.env.NODE_ENV === "test") {
  DB_URI = `${DB_URI}/bookstore_test`;
} else {
  DB_URI = process.env.DATABASE_URL || `postgresql:///bookstore`;
}


module.exports = { DB_URI };