import { create } from 'zustand';

export type NotificationType = 'alert' | 'claim' | 'payout' | 'review' | 'plan';

export interface Notification {
    id: string;
    title: string;
    message: string;
    time: string;
    read: boolean;
    type: NotificationType;
}

interface NotificationStore {
    notifications: Notification[];
    addNotification: (notification: Omit<Notification, 'id' | 'read' | 'time'>) => void;
    markAsRead: (id: string) => void;
    markAllRead: () => void;
}

const INITIAL_NOTIFICATIONS: Notification[] = [
    { id: '1', title: 'Heavy Rain started', message: 'Chennai South', time: '5 mins ago', read: false, type: 'alert' },
    { id: '2', title: 'Review request approved', message: 'Claim updated', time: 'Yesterday', read: true, type: 'review' },
];

export const useNotificationStore = create<NotificationStore>((set) => ({
    notifications: INITIAL_NOTIFICATIONS,
    addNotification: (notif) => {
        const newNotification: Notification = {
            id: Date.now().toString(),
            time: 'Just now',
            read: false,
            ...notif,
        };
        set((state) => ({ notifications: [newNotification, ...state.notifications] }));
    },
    markAsRead: (id) =>
        set((state) => ({
            notifications: state.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
        })),
    markAllRead: () =>
        set((state) => ({
            notifications: state.notifications.map((n) => ({ ...n, read: true })),
        })),
}));

// Mock SMS Service for the Demo
export const SMS_SERVICE = {
    sendPlanSubscriptionSMS: (amount: number) => {
        console.log(`[SMS DISPATCHED]: Your GigSync Income Protection plan is now active. Weekly premium: ₹${amount}. Coverage started successfully.`);
    },
    sendClaimTriggerSMS: (reason: string, location: string, expectedPayout: number) => {
        console.log(`[SMS DISPATCHED]: A claim has been triggered for your account due to ${reason} in ${location}. Estimated payout: ₹${expectedPayout}. Check the app for details.`);
    }
};
