import { collection, doc, setDoc, getDoc, getDocs, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from './firebase';
import { Player, GameHistory, PlayerStats } from '../types';
import { generateId } from '../utils';

const PLAYERS_COLLECTION = 'players';
const GAME_HISTORY_COLLECTION = 'gameHistory';
const PLAYER_STATS_COLLECTION = 'playerStats';

export const createPlayer = async (player: Player): Promise<Player> => {
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
  await updateDoc(playerRef, {
    name: player.name,
    color: player.color,
  });
};

export const deletePlayer = async (playerId: string): Promise<void> => {
  await deleteDoc(doc(db, PLAYERS_COLLECTION, playerId));
};

export const getPlayer = async (id: string): Promise<Player | null> => {
  const playerDoc = await getDoc(doc(db, PLAYERS_COLLECTION, id));
  if (!playerDoc.exists()) return null;
  return playerDoc.data() as Player;
};

export const getAllPlayers = async (): Promise<Player[]> => {
  const querySnapshot = await getDocs(collection(db, PLAYERS_COLLECTION));
  return querySnapshot.docs.map(doc => doc.data() as Player);
};

export const getPlayerGameHistory = async (playerId: string): Promise<GameHistory[]> => {
  const q = query(
    collection(db, GAME_HISTORY_COLLECTION),
    where('playerId', '==', playerId),
    orderBy('playedAt', 'desc')
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as GameHistory);
};

export const getPlayerStats = async (playerId: string): Promise<PlayerStats[]> => {
  const q = query(
    collection(db, PLAYER_STATS_COLLECTION),
    where('playerId', '==', playerId)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data() as PlayerStats);
};

export const updateGameHistory = async (history: GameHistory): Promise<void> => {
  await setDoc(doc(db, GAME_HISTORY_COLLECTION, history.id), history);
  
  // Update player stats
  const statsRef = doc(db, PLAYER_STATS_COLLECTION, `${history.playerId}_${history.gameId}`);
  const statsDoc = await getDoc(statsRef);
  
  if (statsDoc.exists()) {
    const stats = statsDoc.data() as PlayerStats;
    await updateDoc(statsRef, {
      gamesPlayed: stats.gamesPlayed + 1,
      highScore: Math.max(stats.highScore, history.score),
      averageScore: (stats.averageScore * stats.gamesPlayed + history.score) / (stats.gamesPlayed + 1),
      lastPlayed: history.playedAt
    });
  } else {
    await setDoc(statsRef, {
      playerId: history.playerId,
      gameId: history.gameId,
      gamesPlayed: 1,
      highScore: history.score,
      averageScore: history.score,
      lastPlayed: history.playedAt
    });
  }
}; 
