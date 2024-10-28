// // import bcrypt from 'bcryptjs';
// // import { User } from '~/models'

// export default defineEventHandler(async (event) => {
//   const db = useDatabase('mdbkn');

//   const body = await readBody(event);
//   const { email, password } = body;
//   const { rows } = await db.sql(`SELECT * from users WHERE email = ${email}`);
//   const user = rows['rows'];
//   console.log(user, 'username');
//   if (!user) {
//     return sendError(event, createError({ statusCode: 404, message: 'User not found' }));
//   }

//   // Hash the new password before saving it
//   // user.password = await bcrypt.hash(password, 10);
//   await user.save();

//   return { message: 'Password reset successfully.' };
// });
