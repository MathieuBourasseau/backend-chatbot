import { sequelize } from "./sequelize.client.js";
import { DataTypes, Model } from "sequelize"

// Creation of User model from sequelize 
export class Message extends Model {}

Message.init(
    {
        content: {
            type: DataTypes.TEXT, //This data is a string type without limitation of characters
            allowNull: false, // Message should have at least one character
        },
        role: {
            type: DataTypes.ENUM("user", "assistant"), // Mistral API need this two roles to work
            allowNull: false,
        }
    },
    {
        sequelize, // Information required to connect to the DB
        modelName: "Message", // Name of the model
        tableName: "message", // Name of the table in the database
    }
);
