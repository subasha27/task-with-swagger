import express from "express";
import sequelize from "./config/db";
import router from "./router/router";
import swaggerUi from 'swagger-ui-express';
import swaggerDocument from '../swagger';
import dotenv from "dotenv";
dotenv.config();



const app = express();
app.use(express.urlencoded({extended:true}));
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(router);

sequelize.sync();

const port = process.env.PORT || 9000;

app.listen(port,()=>{
    console.log(`Server is Running in the Port: ${port}`)
})