import { db } from '../database/firebase_config_CDN.js';
import { collection, query, where, getDocs, deleteDoc, doc } from "https://www.gstatic.com/firebasejs/10.14.0/firebase-firestore.js";

// פונקציית חיפוש
export async function searchHexes() {
    console.log("Starting search...");

    // קבלת הערכים מהשדות
    const subject1 = document.getElementById('subjectInputs').value;
    const subject2 = document.getElementById('subjectInputss').value;
    const language = document.getElementById('languageSearch').value;
    const type = document.getElementById('typeSearch').value;

    // נקה את התצוגה הישנה
    const hexGrid = document.getElementById('hexGrid');
    hexGrid.innerHTML = '';

    // פונקציה לטיפול בתוצאות
    async function fetchAndDisplayResults(q, label) {
        const querySnapshot = await getDocs(q);

        if (querySnapshot.empty) {
            hexGrid.innerHTML += `<h2><hr> תוצאות עבור: ${label}</h2><p>לא נמצאו תוצאות.</p>`;
            return;
        }

        // כותרת לנושא/שפה/סוג קלט
        hexGrid.innerHTML += `<h2 style="width: 100%; align-self: center;"> <hr> תוצאות עבור: ${label}</h2>`;
        
        querySnapshot.forEach((docSnapshot) => {
            const data = docSnapshot.data();

            // יצירת ריבוע חדש עם התוכן שהוזן
            const newHex = document.createElement('div');
            newHex.classList.add('hex');
            newHex.innerHTML = `
                <br>    
                <hr>
                <button class="delete-btn" onclick="deleteHex('${docSnapshot.id}')">&times;</button>
                <div class="hex-content">
                    <div class="command"><strong>נושא:</strong> ${data.subject}</div>
                    <div class="command"><strong>שפה:</strong> ${data.language}</div>
                    <div class="command"><strong>${data.type}:</strong> ${data.command}</div>
                    <div class="explanation"><strong>הסבר:</strong> ${data.explanation}</div>
                    ${data.code ? `<pre><code>${data.code}</code></pre>` : ''}
                </div>
            `;
            hexGrid.appendChild(newHex);
        });
    }

    // חיפוש לפי שפה בלבד אם אין נושא או סוג קלט
    if (!subject1 && !subject2 && language && !type) {
        let q = query(collection(db, "commands"), where("language", "==", language));
        await fetchAndDisplayResults(q, `שפה: ${language}`);
        return; // סיים חיפוש לפי שפה בלבד
    }

    // חיפוש לפי סוג קלט בלבד אם אין נושא או שפה
    if (!subject1 && !subject2 && !language && type) {
        let q = query(collection(db, "commands"), where("type", "==", type));
        await fetchAndDisplayResults(q, `סוג קלט: ${type}`);
        return; // סיים חיפוש לפי סוג קלט בלבד
    }

    // חיפוש לפי שפה וסוג קלט בלבד אם אין נושא
    if (!subject1 && !subject2 && language && type) {
        let q = query(collection(db, "commands"), where("language", "==", language), where("type", "==", type));
        await fetchAndDisplayResults(q, `שפה: ${language}, סוג קלט: ${type}`);
        return; // סיים חיפוש לפי שפה וסוג קלט בלבד
    }

    // חיפוש עבור כל נושא בנפרד
    if (subject1) {
        let q = query(collection(db, "commands"), where("subject", "==", subject1));
        
        // הוספת תנאי לשפה אם קיים
        if (language) {
            q = query(q, where("language", "==", language));
        }

        // הוספת תנאי לסוג קלט אם קיים
        if (type) {
            q = query(q, where("type", "==", type));
        }

        await fetchAndDisplayResults(q, `נושא: ${subject1}`);
    }

    if (subject2) {
        let q = query(collection(db, "commands"), where("subject", "==", subject2));
        
        // הוספת תנאי לשפה אם קיים
        if (language) {
            q = query(q, where("language", "==", language));
        }

        // הוספת תנאי לסוג קלט אם קיים
        if (type) {
            q = query(q, where("type", "==", type));
        }

        await fetchAndDisplayResults(q, `נושא: ${subject2}`);
    }
}

// פונקציה למחיקת רשומה מ-Firestore
export async function deleteHex(id) {
    if (confirm("האם אתה בטוח שברצונך למחוק את הרשומה הזו?")) {
        try {
            await deleteDoc(doc(db, "commands", id));
            alert("הרשומה נמחקה בהצלחה!");
            searchHexes(); // רענן את הרשימה לאחר המחיקה
        } catch (error) {
            console.error("שגיאה במחיקת הרשומה:", error);
            alert("אירעה שגיאה בעת המחיקה.");
        }
    }
}

// הוספת הפונקציות ל-window כדי שיהיו נגישות מה-HTML
window.searchHexes = searchHexes;
window.deleteHex = deleteHex;
