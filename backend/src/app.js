const express = require('express');
const cors = require('cors');
const path = require('path');
const morgan = require('morgan');
const passport = require("passport");
const session = require("express-session");
const cookieParser = require('cookie-parser')
const passportConfig = require("./config/passport");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

// middleware
const authJWT = require('./middleware/authenticate')
const limiter = require('./middleware/rateLimiter')
const restrictOrigin = require('./middleware/restrictOrigins')

// routes import
const auth_routes = require('./routes/auth/auth_routes')
const resources_routes = require('./routes/auth/res_route')
const Course = require('./routes/course/course')
const Register = require('./routes/register/register')
const Approval = require('./routes/approval/approval')
const request = require('./routes/request/request')
const dept = require('./routes/dept/dept')
const Reports = require('./routes/reports/reports')


const morgan_config = morgan(
  ":method :url :status :res[content-length] - :response-time ms"
);

const app = express();
const port = process.env.PORT;
app.use(cookieParser());

// session
app.use(
  session({
    secret: "this is my secrect code",
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false },
  })
);
app.use(passport.initialize());
app.use(passport.session());

// cors
app.use(express.json());
const cors_config = {
  origin: "*",
};
app.use(cors(cors_config));
app.use(morgan_config);

// auth routes
app.use("/api/auth", auth_routes);
// api routes
app.use("/api", resources_routes);
// middleware
// app.use([authJWT, limiter, restrictOrigin])
app.use('/api', Course)
app.use('/api', Register)
app.use('/api',Approval)
app.use('/api', dept)
app.use('/api', request)
app.use('/api', Reports)



// port
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});