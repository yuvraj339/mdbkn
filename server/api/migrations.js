export default defineEventHandler(async (event) => {
  //   const db = new Database("./path-to-your-database.db");
  const db = useDatabase('mdbkn');

  return new Promise((resolve, reject) => {
    const statement = db.prepare(`ALTER TABLE bookings ADD COLUMN amenities DEFAULT NULL`);
    statement.run();
  });
});
