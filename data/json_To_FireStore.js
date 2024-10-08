// Import Firestore and necessary functions
import { collection, addDoc } from "firebase/firestore";
import { db } from '../database/firebase_config_npm' // Import the Firestore configuration
import fs from 'fs'; // Import fs module to read the JSON file

// Load JSON data
const jsonData = JSON.parse(fs.readFileSync('./data/node.json', 'utf8'));

// Function to upload the JSON data to Firestore
async function uploadJsonToFirestore() {
  try {
    for (const command of jsonData.commands) {
      // Add each command as a document to the 'commands' collection
      await addDoc(collection(db, "commands"), {
        subject: command.subject,
        language: command.language,
        type: command.type,
        command: command.command,
        explanation: command.explanation,
        code: command.code || ""  // Add code field if it exists, else empty string
      });
      console.log(`Added command: ${command.command}`);
    }
    console.log("All commands uploaded successfully!");
  } catch (error) {
    console.error("Error adding document: ", error);
  }
}

// export 
export { uploadJsonToFirestore };
