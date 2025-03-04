import express, { Request, Response } from 'express';
import connectDB from './utils/db';
import adminRoutes from './routes/adminRoutes';

const app = express();
const port = 3000;

connectDB()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.use('api/admin', adminRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});