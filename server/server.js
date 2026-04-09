import express from 'express';
import cookieParser from 'cookie-parser';
import 'dotenv/config';
import cors from 'cors'
import mongodb from './database/mongodb.js';
import connectCloudinary from './database/cloudinary.js';
import heroRoute from './routes/hero-route.js';
import categoryRoute from './routes/category-route.js';
import userRoute from './routes/user-route.js';
import adminRouter from './routes/admin-route.js';
import menuitemRoute from './routes/menuitem-route.js';
import addressRoute from './routes/address-route.js';
import orderRoute from './routes/order-route.js';
import notificationRoute from './routes/notification-route.js';

// connecting cloudinary
await connectCloudinary();

// Initialize the express app
const app = express();
const port = 3000;
app.use(cookieParser());

const allowedOrigins = [
    'http://localhost:5173',
    'https://food-order-amber-eight.vercel.app/'
];

//Middlewares
//app.use(cors());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Hello World!')
})

// routes
app.use('/api/user', userRoute);
app.use('/api/admin', adminRouter);
app.use('/api/hero', heroRoute);
app.use('/api/category', categoryRoute);
app.use('/api/menu', menuitemRoute);
app.use('/api/address', addressRoute);
app.use('/api/order', orderRoute);
app.use('/api/notification', notificationRoute);

mongodb().then(() => {
    app.listen(port, () => {
        console.log(`Example app listening on port ${port}`)
    })
})