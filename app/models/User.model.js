import { sequelize } from "./sequelize.client.js";
import { DataTypes, Model } from "sequelize"

// Creation of User model from sequelize 
export class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.TEXT, //This data is a string type without limitation of characters
            allowNull: false, // Identifier is obligatory to access to conversation
            unique: true, // Identifier must be unique for each user
        },
        password: {
            type: DataTypes.TEXT, // Password must be a string
            allowNull: false, // It is an obligatory field
            unique: false,
        }
    },
    {
        sequelize, // Information required to connect to the DB
        modelName: "User", // Name of the model
        tableName: "user", // Name of the table in the database
    }
);
