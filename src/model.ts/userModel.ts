import { DataTypes, Model } from "sequelize";
import sequelize from "../config/db";


class UserModel extends Model {
    public id!: number;
    public name!: string;
    public mail!: string;
    public password!: string;
}


UserModel.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    mail: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    sequelize,
    modelName: 'UserModel',
    timestamps: true
}
)

export default UserModel