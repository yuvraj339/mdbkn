// import { Database } from 'sqlite3';
// import { PrismaClient } from '@prisma/client';
// const prisma = new PrismaClient();

// const apiCalling =  async (req, res) => {
//   const records = await prisma.records.findMany();
//   res.status(200).json(records);
// };

export default defineEventHandler((event) => {
    if (event.node.req.method === 'GET') {
        return {
             "data": [
                {
                    "name": "John Doe",
                    "position": "Software Engineer",
                    "office": "New York",
                    "extn": "5421",
                    "start_date": "2019-04-15",
                    "salary": "$120,000"
                },
                {
                    "name": "Jane Smith",
                    "position": "Product Manager",
                    "office": "San Francisco",
                    "extn": "6721",
                    "start_date": "2018-09-23",
                    "salary": "$145,000"
                },
                {
                    "name": "Michael Brown",
                    "position": "UX Designer",
                    "office": "Los Angeles",
                    "extn": "3495",
                    "start_date": "2020-01-12",
                    "salary": "$105,000"
                },
                {
                    "name": "Emily Davis",
                    "position": "Data Scientist",
                    "office": "Chicago",
                    "extn": "8312",
                    "start_date": "2017-11-01",
                    "salary": "$135,000"
                },
                {
                    "name": "David Wilson",
                    "position": "DevOps Engineer",
                    "office": "Seattle",
                    "extn": "6725",
                    "start_date": "2020-03-08",
                    "salary": "$110,000"
                },
                {
                    "name": "Sophia Johnson",
                    "position": "Marketing Specialist",
                    "office": "Boston",
                    "extn": "5543",
                    "start_date": "2016-06-25",
                    "salary": "$95,000"
                },
                {
                    "name": "James Lee",
                    "position": "Sales Executive",
                    "office": "Dallas",
                    "extn": "3982",
                    "start_date": "2015-12-20",
                    "salary": "$85,000"
                },
                {
                    "name": "Olivia Martinez",
                    "position": "HR Manager",
                    "office": "Miami",
                    "extn": "2205",
                    "start_date": "2021-05-18",
                    "salary": "$125,000"
                },
                {
                    "name": "Ethan Clark",
                    "position": "Financial Analyst",
                    "office": "Denver",
                    "extn": "7814",
                    "start_date": "2018-08-07",
                    "salary": "$115,000"
                },
                {
                    "name": "Isabella Rodriguez",
                    "position": "Project Coordinator",
                    "office": "Austin",
                    "extn": "4623",
                    "start_date": "2019-11-30",
                    "salary": "$102,000"
                }
        ]}
    }
    if (event.node.req.method === 'POST') {
        // create a blog
        // return the blog;
        console.log(event.node.req);
    }
    
  });


  

// export default defineEventHandler(async (event) => {
//     if (event.node.req.method === 'GET') {
//         const db = new Database('./database.sqlite'); // Open SQLite database

//         return new Promise((resolve, reject) => {
//             db.all('SELECT * FROM roomes', (err, rows) => {
//             if (err) return reject(err);
//             resolve(rows); // Return all users' data
//             });
//         });
//     }
//     if (event.node.req.method === 'POST') {
//         // create a blog
//         // return the blog;
//       }
// });
