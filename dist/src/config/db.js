"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const sequelize_1 = require("sequelize");
const sequelize = new sequelize_1.Sequelize('newlogin', 'root', 'rootpass', {
    host: 'localhost',
    dialect: 'mysql',
    timezone: '+05:30'
});
sequelize.authenticate().then(() => {
    console.log("Connection established Successfully");
}).catch((error) => {
    console.error(error);
});
exports.default = sequelize;
