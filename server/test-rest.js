
import dotenv from 'dotenv';
dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    console.error("No API Key found");
    process.exit(1);
}

const url = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;

console.log("Fetching models from:", url.replace(API_KEY, "HIDDEN_KEY"));

try {
    const response = await fetch(url);
    if (!response.ok) {
        console.error(`Error: ${response.status} ${response.statusText}`);
        const text = await response.text();
        console.error("Body:", text);
    } else {
        const data = await response.json();
        console.log("Available models:");
        data.models.forEach(m => {
            if (m.name.includes('gemini') || m.name.includes('flash')) {
                console.log(`- ${m.name} (${m.displayName})`);
            }
        });
    }
} catch (error) {
    console.error("Fetch error:", error);
}
