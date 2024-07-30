require("dotenv").config();
const express = require("express");
const app = express();
const db = require("./database/db");
const port = process.env.PORT;
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
const authRoutes = require("./routes/authroutes");

//forimageUploads
app.use(express.static(path.join(__dirname, "uploads")));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Access the all https frontend urls
app.use(
  cors({
    origin: "*", // Consider replacing "*" with specific domains
    methods: ["POST", "GET", "PUT", "DELETE", "PATCH"],
  })
);

//Routes Manage
app.use("/api/auth", authRoutes);

//starting The Server
app.listen(port, () => {
  console.log(`Server Running On Port ${port}`);
});
