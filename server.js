const express = require('express');
require('dotenv').config();
require("./db");
const userRouter = require("./routers/user");
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./swagger');
const dateRouter = require('./routers/dateSession');
const postRouter = require('./routers/post');
const travelPlanRouter = require('./routers/travelPlan');
const travelRequestRouter = require('./routers/travelRequest')
const moviePlanRouter = require('./routers/moviePlan');
const movieRequest = require('./routers/movieRequest');
const videoCloudRoutes = require('./routers/videoCloudRoute');
 
const app = express();
exports.app = app;
app.use(express.json());
 
app.use("/api", userRouter)
app.use("/api", dateRouter)
app.use("/api", postRouter)
app.use("/api", travelPlanRouter)
app.use("/api", travelRequestRouter)
app.use("/api", moviePlanRouter)
app.use("/api", movieRequest)
app.use('/api', videoCloudRoutes);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Start Server
const PORT = process.env.PORT || 8081;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));