import 'dotenv/config';
import { Sequelize } from 'sequelize';

//Connect ORM to the database
// Set up general architecture and option of the database

export const sequelize = new Sequelize(
    process.env.DB_URL,
    {
        logging: false, // Disable Sequelize console logging
        define: {
            createdAt: "created_at", // Use "created_at for creation of timestamp"
            underscored: true, // Use snake_case for table and column names
        }
    }
);

// Test to see if the connection to the database works

try {
    await sequelize.authenticate();
    console.log('Connection to database has been established successfully. ✅')
} catch (error) {
    console.error('Unable to connect to the database. ❌')
}