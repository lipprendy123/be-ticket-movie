import express, { Request, Response } from 'express';
import connectDB from './utils/db';
import adminRoutes from './routes/adminRoutes';
import bodyParser from 'body-parser';
import authRoutes from './routes/authRoutes';
import customerRoutes from './routes/customerRoutes';

const app = express();
const port = 3000;

connectDB()

app.use(bodyParser.json())

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, Express with TypeScript!');
});

app.use('/api', authRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/customer', customerRoutes)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});