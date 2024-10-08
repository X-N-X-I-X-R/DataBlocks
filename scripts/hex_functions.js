import { saveHexData } from './firebase_functions.js';

export function addHex() {
    console.log("Starting to add a new hex...");

    // קבלת הערכים מהשדות
    const subject = document.getElementById('subjectInput').value;
    const language = document.getElementById('languageInput').value;
    const type = document.getElementById('typeInput').value;
    const command = document.getElementById('commandInput').value;
    const explanation = document.getElementById('explanationInput').value;
    const code = document.getElementById('codeInput').value;

    console.log("Collected Data:", { subject, language, type, command, explanation, code });

    // יצירת ריבוע חדש עם התוכן שהוזן
    const hexGrid = document.getElementById('hexGrid');
    const newHex = document.createElement('div');
    newHex.classList.add('hex');
    newHex.innerHTML = `
        <div class="hex-content">
            <div class="command"><strong>נושא:</strong> ${subject}</div>
            <div class="command"><strong>שפה:</strong> ${language}</div>
            <div class="command"><strong>${type}:</strong> ${command}</div>
            <div class="explanation"><strong>הסבר:</strong> ${explanation}</div>
            ${code ? `<pre><code>${code}</code></pre>` : ''}
        </div>
    `;
    hexGrid.appendChild(newHex);

    console.log("Added hex to the DOM");

    // שמירת הנתונים ב-Firebase
    saveHexData(subject, language, type, command, explanation, code);

    // איפוס השדות אחרי ההוספה
    document.getElementById('subjectInput').value = '';
    document.getElementById('languageInput').value = 'Python';
    document.getElementById('typeInput').value = 'פקודה';
    document.getElementById('commandInput').value = '';
    document.getElementById('explanationInput').value = '';
    document.getElementById('codeInput').value = '';
    document.getElementById('highlightedCode').textContent = '';    

    console.log("Form fields reset");

    // הוספת הפונקציה למחיקת הריבוע אחרי 10 שניות
    setTimeout(() => {
        newHex.classList.add('fade-out'); // הפעלת האנימציה
        setTimeout(() => {
            newHex.remove(); // מחיקת הריבוע מה-DOM אחרי שהאנימציה מסתיימת
        }, 6000); // זמן האנימציה (2 שניות)
    }, 6000); // 10 שניות לפני ההפעלה
}

// הוספת הפונקציה ל- window
window.addHex = addHex;

export function highlightCode() {
    let code = document.getElementById("codeInput").value;
    // הוספת רווח לאחר נקודתיים אם אין תו נוסף אחריה
    code = code.replace(/:($|\s)/g, ": ");
    const highlightedCode = document.getElementById("highlightedCode");
    highlightedCode.textContent = code; // עדכון התוכן של תצוגת הקוד
    Prism.highlightElement(highlightedCode); // הפעלת Prism להדגשת התחביר
}

// הוספת הפונקציה ל- window
window.highlightCode = highlightCode;
