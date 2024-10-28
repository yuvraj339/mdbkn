// import { useAuthStore } from '~/stores/auth';

export default defineEventHandler(async (event) => {
  const db = useDatabase('mdbkn');
  const { email, password } = await readBody(event);

  let user;

  if (event.node.req.method === 'POST') {
    // const authStore = useAuthStore();
    // Use parameterized query to avoid SQL injection and syntax errors
    const { rows } = await db.sql`SELECT * FROM users WHERE email = ${email}`;

    user = rows.length ? rows[0] : null;

    if (user) {
      // authStore.authenticateUser(true);
      // authStore.currentUser(user);
      return { success: true, user: { name: user.name, email: user.email, mobile: user.mobile }, auth: true };
    } else {
      return { success: false, message: 'Wrong details..', auth: true };
    }
  }

  // if (event.node.req.method === 'POST') {
  //   return { success: true };
  //   // Create table
  //   // await db.sql`DROP TABLE IF EXISTS room_category`;
  //   // await db.sql`CREATE TABLE IF NOT EXISTS users (
  //   //               id INTEGER PRIMARY KEY AUTOINCREMENT,
  //   //               name TEXT,
  //   //               secret TEXT,
  //   //               email TEXT,
  //   //               mobile TEXT,
  //   //               password INTEGER
  //   //               );`;

  //   // const name = 'Admin';
  //   // const secret = ']Z!_wkK0$7oe|kWhNqle';
  //   // const email = 'admin@mdbkn.com';
  //   // const mobile = '7737833706';
  //   // const password = 'Qazwsxedc!@#123';

  //   // const statement = db.prepare(`
  //   //       INSERT INTO users (name, secret, email, mobile, password)
  //   //       VALUES (?, ?, ?, ?, ?)
  //   //       `);

  //   // const result = statement.run(name, secret, email, mobile, password);

  //   return { success: true, id: result.lastInsertRowid };
  // }
});
