const express = require('express');
const webPush = require('web-push');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

// DO NOT USE IN PROD
const publicKey = 'BDZJSiMXSJUhryPkjFh_H84ZeEjVNfq5STCXVDEW4bpXye1mybGCjufRFIVmMxJN1wHOGUunGyBra0qvSa0fGJ8';
const privateKey = 'upQsMoPu4_T6aT3a8Nwg8b7Cd3wNjQwfD5PgCYJjTmc';
webPush.setVapidDetails(
    'mailto:example@yourdomain.org',
    publicKey,
    privateKey
);

// Хранилище для подписок
const subscriptions = {};

app.post('/subscribe', (req, res) => {
    try {
        const { subscription, id } = req.body;
        subscriptions[id] = subscription;
        console.log('Subscription success!', subscription)
        return res.status(201).json({ data: { success: true } });
    } catch (error) {
        console.error('Error subscribing:', error)
        return res.status(400).json({ data: { success: false } });
    }
});

app.post('/send', (req, res) => {
    try {
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
        webPush.sendNotification(subscription, payload)
        console.log('Notification sent!')
        return res.status(201).json({ data: { success: true } });
    } catch (error) {
        console.error('Error sending:', error)
        return res.status(400).json({ data: { success: false } });
    }
});

app.get('/info', (req, res) => {
    return res.status(200).json({ data: JSON.stringify(subscriptions) });
});


app.listen(3003, () => {
    console.log('Server started on port 3003');
});
