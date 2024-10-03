// import type { NextApiRequest, NextApiResponse } from 'next';
// import dbConnect from '../../lib/dbConnect';
// import Question from '../../models/Question';

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse
// ) {
//   await dbConnect();

//   switch (req.method) {
//     case 'GET':
//       try {
//         const { answered } = req.query;
//         let questions;

//         if (answered === 'false') {
//           questions = await Question.find({ isAnswered: false }).sort({
//             timestamp: -1,
//           });
//         } else {
//           questions = await Question.find().sort({ timestamp: -1 });
//         }

//         res.status(200).json({ success: true, data: questions });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;

//     case 'POST':
//       try {
//         const question = await Question.create(req.body);
//         res.status(201).json({ success: true, data: question });
//       } catch (error) {
//         res.status(400).json({ success: false });
//       }
//       break;

//     default:
//       res.status(405).json({ success: false, message: 'Method not allowed' });
//       break;
//   }
// }
