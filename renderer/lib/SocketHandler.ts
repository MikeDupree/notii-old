import io from 'socket.io-client';

export const getSocket = () => {
  return io('http://localhost:8989');
};
