export interface Message {
  _id: string;
  senderId: string;
  receiverId: string;
  content: string;
  timestamp: string; 
  read: boolean;
}
