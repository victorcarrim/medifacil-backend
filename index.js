const express = require("express");
const passport = require("passport");
const session = require("express-session");
const MongoStore = require('connect-mongo');
const { swaggerUi, swaggerSpec } = require('./swaggerConfig');
const swaggerFile = require('./swagger_output.json');
const authRoutes = require("./routes/auth.routes");
const api = require("./routes/api.routes");
require("./auth");
const app = express();
const cors = require("cors");
const {json, urlencoded} = require("body-parser");

app.use(cors());
app.use(json({ limit: '50mb' }));
app.use(urlencoded({ limit: '50mb', extended: true }));

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.MONGODB_URI })
}));

app.use(passport.initialize());
app.use(passport.session());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));

app.use('/auth', authRoutes);
app.use("/api", passport.authenticate("bearer", { session: false }), api);

module.exports = app;
