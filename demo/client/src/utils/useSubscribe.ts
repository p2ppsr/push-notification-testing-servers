const urlBase64ToUint8Array = (base64String: string): Uint8Array => {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/-/g, '+')
        .replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
};
export var Errors: any;
(function (Errors) {
    Errors["ServiceWorkerAndPushManagerNotSupported"] = "ServiceWorkerAndPushManagerNotSupported";
    Errors["PushManagerUnavailable"] = "PushManagerUnavailable";
    Errors["Unknown"] = "Unknown";
})(Errors || (Errors = {}));
export const useSubscribe = ({ publicKey }: { publicKey: string }) => {
    const getSubscription = async (subscribe = false) => {
        if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
            throw { errorCode: Errors.ServiceWorkerAndPushManagerNotSupported };
        }
        const registration = await navigator.serviceWorker.ready;
        if (!registration.pushManager) {
            throw { errorCode: Errors.PushManagerUnavailable };
        }
        const existingSubscription = await registration.pushManager.getSubscription();
        if (existingSubscription) {
            console.warn("existingSubscription", existingSubscription)
            return existingSubscription;
        }
        const convertedVapidKey = urlBase64ToUint8Array(publicKey);
        return subscribe ? await registration.pushManager.subscribe({
            applicationServerKey: convertedVapidKey,
            userVisibleOnly: true,
        }) : existingSubscription;
    };
    return { getSubscription };
};

