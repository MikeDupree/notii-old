import io from 'socket.io-client';
import { Subject } from 'rxjs';

const socket = io('http://localhost:8888');

// Create a subject to handle incoming messages from the server
const messageSubject = new Subject();

// Listen for messages from the server
socket.on('message', (message) => {
  console.log(`Received message from server: ${message}`);
  messageSubject.next(message);
});

// Send a message to the server
socket.emit('message', 'Hello from the client!');

export { messageSubject };
