import { sequelize } from "./sequelize.client.js";
import { DataTypes, Model } from "sequelize";

// Creation of the model Chat with sequelize
export class Chat extends Model {}

// Definition of the model 
Chat.init(
    {
        name: {
            type: DataTypes.STRING, // Name of the chat can have 250 characters maximum
            allowNull: false, // A title for each chat is required to get back on it when it is needed
        }
    },{
        sequelize, // Information to connect the database
        modelName: "Chat", // Name of the model
        tableName: "chat"
    }
)

