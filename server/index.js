//importing
const express = require("express");
const app = express();
const {
  client,
  createTable,
  fetchRestaurants,
  fetchReservation,
  fetchCustomers,
  createCustomer,
  createRestaurant,
  createReservation,
  destroyReservation,
} = require("./db");

//starting server
init();
async function init() {
  try {
    await client.connect((error) => {
      if (error) {
        console.error("there was an error connecting to your database", error);
      } else {
        console.log("conneted");
      }
    });
  } catch (error) {
    console.error("there was an error connecting to your database", error);
  }
  await createTable();
  //creating data
  const [jason, max, kevin, Bonefish_Grill, Lake_Mary_Social, Bayridge_Sushi] =
    await Promise.all([
      createCustomer({ name: "jason" }),
      createCustomer({ name: "max" }),
      createCustomer({ name: "kevin" }),
      createRestaurant({ name: "Bonefish_Grill" }),
      createRestaurant({ name: "Lake_Mary_Social" }),
      createRestaurant({ name: "Bayridge_Sushi" }),
      createReservation({
        date: "11/25/2024",
        party_count: 2,
        restaurant_name: "Bayridge_Sushi",
        customer_name: "jason",
      }),
    ]);
  app.use(express.json());
  const PORT = 8080;
  app.listen(PORT);
  //--------------------------routes-------------------------------------------------------------------------------
  //get custoemrs
  app.get("/api/customers", async (req, res) => {
    const user = await fetchCustomers();
    res.status(200).json(user);
  });
}

//get restaurants
app.get("/api/restaurants", async (req, res) => {
  const restaurants = await fetchRestaurants();
  res.status(200).json(restaurants);
});

//get reservations
app.get("/api/reservations", async (req, res) => {
  const reservations = await fetchReservation();
  res.status(200).json(reservations);
});

//post reservations
app.post("/api/customers/:id/reservations", async (req, res) => {
  console.log(req.body);
  const reservations = await createReservation({
    date: req.body.date,
    party_count: req.body.party_count,
    restaurant_name: req.body.restaurant_name,
    customer_name: req.body.customer_name,
  });

  res.status(200).json(reservations);
});
//delete reservations
app.delete("/api/customers/:customer_id/reservations/:id", async (req, res) => {
  const reservations = await destroyReservation(req.params.id);
});
