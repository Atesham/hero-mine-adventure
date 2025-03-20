
import { db } from '@/lib/firebase';
import { collection, query, where, orderBy, limit, getDocs, getDoc, doc, addDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

export interface Transaction {
  id: string;
  type: 'reward' | 'sent' | 'received';
  amount: number;
  timestamp: Date;
  description: string;
  userId: string;
  counterpartyId?: string;
  counterpartyName?: string;
  counterpartyAddress?: string;
}

// Get user wallet data including balance and transactions
export const getUserWalletData = async (userId: string) => {
  try {
    // Get user data
    const userRef = doc(db, 'users', userId);
    const userDoc = await getDoc(userRef);
    
    if (!userDoc.exists()) {
      throw new Error('User not found');
    }
    
    const userData = userDoc.data();
    
    // Get recent transactions
    const transactionsQuery = query(
      collection(db, 'transactions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(10)
    );
    
    const transactionsSnapshot = await getDocs(transactionsQuery);
    const transactions: Transaction[] = [];
    
    transactionsSnapshot.forEach((doc) => {
      const data = doc.data();
      transactions.push({
        id: doc.id,
        type: data.type,
        amount: data.amount,
        timestamp: data.timestamp?.toDate() || new Date(),
        description: data.description,
        userId: data.userId,
        counterpartyId: data.counterpartyId,
        counterpartyName: data.counterpartyName,
        counterpartyAddress: data.counterpartyAddress
      });
    });
    
    return {
      balance: userData.coins || 0,
      totalMined: userData.totalMined || 0,
      walletAddress: `HC-${userId.substring(0, 12).toUpperCase()}`,
      transactions
    };
  } catch (error) {
    console.error('Error fetching wallet data:', error);
    throw error;
  }
};

// Send coins to another user
export const sendCoins = async (
  senderUserId: string, 
  receiverAddress: string, 
  amount: number, 
  description: string = 'Sent Hero Coins'
) => {
  try {
    if (amount <= 0) {
      throw new Error('Amount must be greater than zero');
    }
    
    // Check if sender has enough balance
    const senderRef = doc(db, 'users', senderUserId);
    const senderDoc = await getDoc(senderRef);
    
    if (!senderDoc.exists()) {
      throw new Error('Sender account not found');
    }
    
    const senderBalance = senderDoc.data().coins || 0;
    
    if (senderBalance < amount) {
      throw new Error('Insufficient balance');
    }
    
    // Find receiver by address
    const receiverId = receiverAddress.startsWith('HC-') 
      ? receiverAddress.substring(3, 15).toLowerCase() 
      : receiverAddress;
    
    // Find matching user
    const usersQuery = query(
      collection(db, 'users'),
      where('uid', '==', receiverId)
    );
    
    const usersSnapshot = await getDocs(usersQuery);
    let receiverDoc;
    let receiverData;
    
    if (usersSnapshot.empty) {
      // Try finding by substring of UID
      const allUsersQuery = query(collection(db, 'users'));
      const allUsersSnapshot = await getDocs(allUsersQuery);
      
      allUsersSnapshot.forEach((doc) => {
        const uid = doc.id;
        if (uid.toLowerCase().includes(receiverId.toLowerCase())) {
          receiverDoc = doc;
          receiverData = doc.data();
        }
      });
      
      if (!receiverDoc) {
        throw new Error('Receiver not found with the provided address');
      }
    } else {
      receiverDoc = usersSnapshot.docs[0];
      receiverData = receiverDoc.data();
    }
    
    const receiverRef = doc(db, 'users', receiverDoc.id);
    
    // Check if sender is trying to send to themselves
    if (senderUserId === receiverDoc.id) {
      throw new Error('Cannot send coins to yourself');
    }
    
    // Update sender's balance
    await updateDoc(senderRef, {
      coins: senderBalance - amount
    });
    
    // Update receiver's balance
    await updateDoc(receiverRef, {
      coins: (receiverData.coins || 0) + amount
    });
    
    // Create sent transaction for sender
    await addDoc(collection(db, 'transactions'), {
      userId: senderUserId,
      counterpartyId: receiverDoc.id,
      counterpartyName: receiverData.displayName || 'Unknown User',
      counterpartyAddress: `HC-${receiverDoc.id.substring(0, 12).toUpperCase()}`,
      type: 'sent',
      amount: amount,
      description: description,
      timestamp: serverTimestamp()
    });
    
    // Create received transaction for receiver
    await addDoc(collection(db, 'transactions'), {
      userId: receiverDoc.id,
      counterpartyId: senderUserId,
      counterpartyName: senderDoc.data().displayName || 'Unknown User',
      counterpartyAddress: `HC-${senderUserId.substring(0, 12).toUpperCase()}`,
      type: 'received',
      amount: amount,
      description: 'Received Hero Coins',
      timestamp: serverTimestamp()
    });
    
    toast.success('Coins sent successfully!');
    return true;
  } catch (error) {
    console.error('Error sending coins:', error);
    throw error;
  }
};

// Get top miners for leaderboard
export const getTopMiners = async (limit = 20) => {
  try {
    const usersQuery = query(
      collection(db, 'users'),
      orderBy('coins', 'desc'),
      limit(limit)
    );
    
    const snapshot = await getDocs(usersQuery);
    const miners = snapshot.docs.map((doc, index) => {
      const data = doc.data();
      
      // Determine level based on coins
      let level = 'Bronze';
      if (data.coins >= 10000) level = 'Diamond';
      else if (data.coins >= 7500) level = 'Platinum';
      else if (data.coins >= 5000) level = 'Gold';
      else if (data.coins >= 2500) level = 'Silver';
      
      return {
        id: doc.id,
        name: data.displayName || 'Anonymous Miner',
        coins: data.coins || 0,
        level,
        rank: index + 1
      };
    });
    
    return miners;
  } catch (error) {
    console.error('Error fetching top miners:', error);
    throw error;
  }
};
