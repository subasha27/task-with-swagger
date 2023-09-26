import { Sequelize } from "sequelize";

const sequelize = new Sequelize(
    'newlogin',
    'root',
    'rootpass',{
        host:'localhost',
        dialect:'mysql',
        timezone: '+05:30'
    }
)

sequelize.authenticate().then(()=>{
    console.log("Connection established Successfully")
}).catch((error)=>{
    console.error(error)
})


export default sequelize;