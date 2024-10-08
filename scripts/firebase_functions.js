
// firebase_functions.js    
import { db } from "../database/firebase_config_CDN.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

export async function saveHexData(subject, language, type, command, explanation, code) {
    try {
        const docRef = await addDoc(collection(db, "commands"), {
            subject: subject,
            language: language,
            type: type,
            command: command,
            explanation: explanation,
            code: code
        });
        console.log("Document successfully written! Document ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
}
