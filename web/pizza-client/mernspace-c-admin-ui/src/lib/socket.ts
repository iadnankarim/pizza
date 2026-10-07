import { io } from 'socket.io-client';

// no socket server in mock mode, so don't try to connect
const socket = io(import.meta.env.VITE_SOCKET_SERVICE_URL, {
    autoConnect: import.meta.env.VITE_USE_MOCK !== 'true',
});

socket.on('connect', () => {
    console.log(`Connected socket: `, socket.id);
});

socket.on('disconnect', () => {
    console.log('Disconnected: ', socket.id);
});

export default socket;
