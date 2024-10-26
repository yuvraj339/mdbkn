export default defineEventHandler(async (event) => {
    const db = useDatabase("mdbkn");

    if (event.node.req.method === 'GET') {
        // Query for users
        // const { rows } = await db.sql`SELECT * FROM records WHERE id = ${userId}`;
        const { rows } = await db.sql`SELECT * FROM records`;
    
        return {
          rows,
        };
    }
    if (event.node.req.method === 'POST') {
        const reqBody = await readBody(event);
   
        // Create table
        // await db.sql`DROP TABLE IF EXISTS records`;
        await db.sql`CREATE TABLE IF NOT EXISTS records ("id" INTEGER PRIMARY KEY AUTOINCREMENT, "name" TEXT, "email" TEXT)`;
    
        // Add a new user
        // const userId = String(Math.round(Math.random() * 10_000));
        const result  = await db.sql`INSERT INTO records(name, email) VALUES (${reqBody.name}, ${reqBody.email})`;
        console.log(result)
        
    }
  });