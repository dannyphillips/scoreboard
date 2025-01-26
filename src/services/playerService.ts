import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Player, GameHistory, PlayerStats } from '../types';
import { generateId } from '../utils';

const PLAYERS_COLLECTION = 'players';
const GAME_HISTORY_COLLECTION = 'gameHistory';
const PLAYER_STATS_COLLECTION = 'playerStats';

export const createPlayer = async (player: Omit<Player, 'id' | 'createdAt'>): Promise<Player> => {
  const newPlayer = {
    ...player,
    id: generateId(),
    createdAt: new Date()
  };
  
  await setDoc(doc(db, PLAYERS_COLLECTION, newPlayer.id), newPlayer);
  return newPlayer;
};

export const updatePlayer = async (player: Player): Promise<void> => {
  const playerRef = doc(db, PLAYERS_COLLECTION, player.id);
  const playerDoc = await getDoc(playerRef);
  
  if (!playerDoc.exists()) {
    throw new Error('Player not found');
  }

  await updateDoc(playerRef, {
    name: player.name,
    color: player.color,
  });
};

export const deletePlayer = async (playerId: string): Promise<void> => {
  // Delete player document
  await deleteDoc(doc(db, PLAYERS_COLLECTION, playerId));
  
  // Delete player stats
  const statsQuery = query(
    collection(db, PLAYER_STATS_COLLECTION),
    where('playerId', '==', playerId)
  );
  const statsSnapshot = await getDocs(statsQuery);
  for (const doc of statsSnapshot.docs) {
    await deleteDoc(doc.ref);
  }
  
  // Delete game history
  const historyQuery = query(
    collection(db, GAME_HISTORY_COLLECTION),
    where('playerId', '==', playerId)
  );
  const historySnapshot = await getDocs(historyQuery);
  for (const doc of historySnapshot.docs) {
    await deleteDoc(doc.ref);
  }
};

export const getPlayer = async (id: string): Promise<Player | null> => {
  const playerDoc = await getDoc(doc(db, PLAYERS_COLLECTION, id));
  if (!playerDoc.exists()) return null;
  return { ...playerDoc.data(), id: playerDoc.id } as Player;
};

export const getAllPlayers = async (): Promise<Player[]> => {
  const querySnapshot = await getDocs(
    query(collection(db, PLAYERS_COLLECTION), orderBy('createdAt', 'desc'))
  );
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as Player);
};

export const getPlayerGameHistory = async (playerId: string): Promise<GameHistory[]> => {
  const q = query(
    collection(db, GAME_HISTORY_COLLECTION),
    where('playerId', '==', playerId),
    orderBy('playedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }) as GameHistory);
};

export async function getPlayerStats(): Promise<PlayerStats[]> {
  const querySnapshot = await getDocs(collection(db, 'playerStats'));
  return querySnapshot.docs.map(doc => {
    const data = doc.data();
    return {
      id: doc.id,
      playerId: data.playerId,
      gameId: data.gameId,
      highScore: data.highScore,
      gamesPlayed: data.gamesPlayed,
      averageScore: data.averageScore,
      lastPlayed: data.lastPlayed.toDate(),
    } as PlayerStats;
  });
}

export const updateGameHistory = async (history: Omit<GameHistory, 'id'>): Promise<void> => {
  const historyId = generateId();
  await setDoc(doc(db, GAME_HISTORY_COLLECTION, historyId), {
    ...history,
    id: historyId
  });
  
  // Update player stats
  const statsRef = doc(db, PLAYER_STATS_COLLECTION, `${history.playerId}_${history.gameId}`);
  const statsDoc = await getDoc(statsRef);
  
  if (statsDoc.exists()) {
    const stats = statsDoc.data() as PlayerStats;
    const newGamesPlayed = stats.gamesPlayed + 1;
    const newHighScore = Math.max(stats.highScore, history.score);
    const newAverageScore = (stats.averageScore * stats.gamesPlayed + history.score) / newGamesPlayed;
    
    await updateDoc(statsRef, {
      gamesPlayed: newGamesPlayed,
      highScore: newHighScore,
      averageScore: newAverageScore,
      lastPlayed: history.playedAt
    });
  } else {
    await setDoc(statsRef, {
      id: `${history.playerId}_${history.gameId}`,
      playerId: history.playerId,
      gameId: history.gameId,
      gamesPlayed: 1,
      highScore: history.score,
      averageScore: history.score,
      lastPlayed: history.playedAt
    });
  }
};

export const getPlayerStatsByGame = async (playerId: string, gameId: string): Promise<PlayerStats | null> => {
  const statsRef = doc(db, PLAYER_STATS_COLLECTION, `${playerId}_${gameId}`);
  const statsDoc = await getDoc(statsRef);
  
  if (!statsDoc.exists()) return null;
  return statsDoc.data() as PlayerStats;
}; 
