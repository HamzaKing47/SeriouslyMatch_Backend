const express = require('express');
require('dotenv').config();
require("./db");
const userRouter = require("./routers/user");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');

const app = express();
app.use(express.json());
app.use("/api",userRouter)
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Server
const PORT = process.env.PORT || 8080;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
