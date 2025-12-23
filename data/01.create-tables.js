import { sequelize } from "../app/models/index.js";

console.log("🚧 Création des tables");
await sequelize.sync({ force: true }); // Tables are created from the models and relations between them
console.log("✅ Tables créées avec succès");

await sequelize.close();

