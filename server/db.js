//importing
const { Client } = require("pg");
const { v4: uuidv4 } = require("uuid");
const client = new Client({
  connectionString:
    process.env_DATABASE_URL || "postgres://localhost/reservation",
});
//dropping and creating tables
async function createTable() {
  try {
    await client.query(`
DROP TABLE IF EXISTS reservation;
DROP TABLE IF EXISTS customer;
DROP TABLE IF EXISTS restaurant;

CREATE TABLE customer(
    id UUID PRIMARY KEY,
    name VARCHAR(50) NOT NULL);

CREATE TABLE restaurant(
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL);

CREATE TABLE reservation(
    id UUID PRIMARY KEY,
    date VARCHAR(50) NOT NULL,
    party_count INTEGER NOT NULL,
    restaurant_id UUID REFERENCES restaurant(id) NOT NULL,
    customer_id UUID REFERENCES customer(id) ON DELETE CASCADE);`);
    console.log("new tables created");
  } catch (error) {
    console.log("there was an erorr dropping/create a tables", error);
    throw error;
  }
}
//fetch all customers
async function fetchCustomers() {
  try {
    const result = await client.query(`SELECT * FROM customer;`);
    return result.rows;
  } catch (error) {
    console.error("there was an error geting all customers", error);
  }
}
//fetch all restaurants
async function fetchRestaurants() {
  try {
    const result = await client.query(`SELECT * FROM restaurant;`);
    return result.rows;
  } catch (error) {
    console.error("there was an error geting all restaurants", error);
  }
}
//fetch all Reservations
async function fetchReservation() {
  try {
    const result = await client.query(`SELECT * FROM Reservation;`);
    return result.rows;
  } catch (error) {
    console.error("there was an error geting all Reservations", error);
  }
}

//POST request for cusomter
async function createCustomer({ name }) {
  try {
    const id = uuidv4();
    const result = await client.query(
      `
            INSERT INTO customer(id, name)
            VALUES($1,$2) RETURNING *;`,
      [id, name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("there was an error posting to customer", error);
  }
}
//POST request for restaurant
async function createRestaurant({ name }) {
  try {
    const id = uuidv4();
    const result = await client.query(
      `
            INSERT INTO restaurant(id, name)
            VALUES($1,$2) RETURNING *;`,
      [id, name]
    );
    return result.rows[0];
  } catch (error) {
    console.error("there was an error posting to restaurant", error);
  }
}
//POST request for Reservations
async function createReservation({
  date,
  party_count,
  restaurant_name,
  customer_name,
}) {
  const id = uuidv4();
  try {
    const customer = await client.query(
      `SELECT id FROM customer WHERE name = $1;`,
      [customer_name]
    );
    const customerId = customer.rows[0].id;
    console.log(customer_name);
    const restaurant = await client.query(
      ` SELECT id FROM Restaurant WHERE name = $1;`,
      [restaurant_name]
    );
    const restaurant_id = restaurant.rows[0].id;

    const result = await client.query(
      `
        INSERT INTO Reservation(id,date,party_count,restaurant_id,customer_id)
        VALUES($1,$2,$3,$4,$5) RETURNING *;
        `,
      [id, date, party_count, restaurant_id, customerId]
    );
    return result.rows[0];
  } catch (error) {
    console.error("there was an error posting to Reservations", error);
  }
}

async function destroyReservation({ id }) {
  try {
    await client.query(
      `
    DELETE FROM Reservation where id =$1`,
      [id]
    );
    console.log("the Reservation was deleted");
  } catch (error) {
    console.log("there was an error deleteing a Reservation", error);
  }
}
//exporting
module.exports = {
  client,
  createTable,
  fetchRestaurants,
  fetchReservation,
  fetchCustomers,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
};
