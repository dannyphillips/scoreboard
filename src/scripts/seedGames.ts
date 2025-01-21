import { db } from '../services/firebase';
import { collection, addDoc } from 'firebase/firestore';
import { Game } from '../types';

const games: Omit<Game, 'id'>[] = [
  {
    name: "Basketball",
    description: "Track points for pickup basketball games. First team to 21 wins!",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc?w=800"
  },
  {
    name: "Hearts",
    description: "Classic card game where lowest score wins. Shoot the moon if you dare!",
    scoreType: "points",
    highScoreOrder: "asc",
    imageUrl: "https://images.unsplash.com/photo-1529480384838-c1681c84aca5?w=800"
  },
  {
    name: "Yahtzee",
    description: "Roll dice to score combinations. Aim for multiple Yahtzees!",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1585504198199-20277593b94f?w=800"
  },
  {
    name: "Ping Pong",
    description: "Table tennis matches to 11 points. Must win by 2!",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1534158914592-062992fbe900?w=800"
  },
  {
    name: "Mario Kart",
    description: "Race for the fastest time across multiple tracks",
    scoreType: "time",
    highScoreOrder: "asc",
    imageUrl: "https://images.unsplash.com/photo-1612404730960-5c71577fca11?w=800"
  },
  {
    name: "Spades",
    description: "Trick-taking card game played with partners",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1593645510102-6aa3e9324d13?w=800"
  },
  {
    name: "Cornhole",
    description: "Toss bean bags for points. 3 points in the hole, 1 point on the board",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1596731498067-aa3c96c9cd90?w=800"
  },
  {
    name: "Darts",
    description: "Hit the bullseye! Standard 501 rules",
    scoreType: "points",
    highScoreOrder: "desc",
    imageUrl: "https://images.unsplash.com/photo-1545192637-b7d7594ed078?w=800"
  }
];

async function seedGames() {
  try {
    const gamesCollection = collection(db, 'games');
    
    for (const game of games) {
      await addDoc(gamesCollection, game);
      console.log(`Added game: ${game.name}`);
    }
    
    console.log('Seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding games:', error);
  }
}

// Run the seed function
seedGames(); 
