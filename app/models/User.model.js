import { sequelize } from "./sequelize.client.js";
import { DataTypes, Model } from "sequelize"
import bcrypt from 'bcrypt';

// --- CREATION OF THE USER MODEL WITH SEQUELIZE ---
export class User extends Model {}

User.init(
    {
        email: {
            type: DataTypes.TEXT, //This data is a string type without limitation of characters
            allowNull: false, // Identifier is obligatory to access to conversation
            unique: true, // Identifier must be unique for each user
        },
        username: {
            type: DataTypes.STRING(20), // Username must be a string that cannot be beyond 20 characters
            allowNull: false,
            unique: true,
        },
        password: {
            type: DataTypes.TEXT, // Password must be a string
            allowNull: false, // It is an obligatory field
            unique: false,
        },
        avatar: {
            type: DataTypes.TEXT, // Image is a string
            allowNull: true,
            unique: false,
        }
    },
    {
        sequelize, // Information required to connect to the DB
        modelName: "User", // Name of the model
        tableName: "user", // Name of the table in the database
    }
);

// Hash the user password when user is created 
User.beforeCreate(async (user) => {

    const saltRounds = 10;
    
    user.password = await bcrypt.hash(user.password, saltRounds);

});
