import express, { Request, Response } from 'express';
import * as webPush from 'web-push';
import bodyParser from 'body-parser';
import cors from 'cors';

// import { sendNotification } from '/documents/metanet-webpush-sdk/dist/sendNotification';

const app = express();

app.use(cors());
app.use(bodyParser.json());

const publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
const privateKey = 'upQsMoPu4_T6aT3a8Nwg8b7Cd3wNjQwfD5PgCYJjTmc';
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
);

const subscriptions: any = {};

app.post('/subscribe', (req: Request, res: Response) => {
    try {
        const { subscription, id } = req.body;
        subscriptions[id] = subscription;
        console.log('Subscription success!', subscription);
        return res.status(201).json({ data: { success: true } });
    } catch (error) {
        console.error('Error subscribing:', error);
        return res.status(400).json({ data: { success: false } });
    }
});

app.post('/send', async (req: Request, res: Response) => {
    try {
        console.log('Sending notification!');
        console.log('Sending notification!')
        const { message, title, id } = req.body;
        console.log(message, title, id)
        const subscription = subscriptions[id]
        if (!subscription) {
            console.error('No subscription found for id:', id)
            return res.status(400).json({ data: { success: false } });
        }
        const payload = JSON.stringify({ title, message });
        console.log('Sending notification!', subscription)
        console.log('Payload:', payload)
        // await webPush.sendNotification(subscription, payload)
        await webPush.sendNotification(subscription, payload)
        console.log('Notification sent!')
        return res.status(201).json({ data: { success: true } });
    } catch (error: any) {
        console.error('Error sending:', error)
        // Handle specific web-push errors
        if (error.statusCode === 410) {
            // Subscription has expired or been unsubscribed
            console.log('Subscription expired/unsubscribed, removing from storage')
            return res.status(410).json({
                data: {
                    success: false,
                    error: 'Subscription expired or unsubscribed'
                }
            });
        }
        return res.status(400).json({ data: { success: false, error: error.message } });
    }
});

app.get('/info', (req: Request, res: Response) => {
    return res.status(200).json({ data: JSON.stringify(subscriptions) });
});

app.listen(3003, () => {
    console.log('Server started on port 3003');
});
