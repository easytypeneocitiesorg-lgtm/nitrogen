let messages = []; // In-memory storage (resets on cold start)

// Vercel serverless function
export default function handler(req, res) {
    if (req.method === "GET") {
        // Return last 50 messages
        res.status(200).json(messages.slice(-50));
    } else if (req.method === "POST") {
        const { user, text } = req.body;
        if (!text || !user) {
            return res.status(400).json({ error: "Missing user or text" });
        }

        const message = {
            user,
            text,
            timestamp: new Date().toISOString()
        };

        messages.push(message);
        // Keep only last 100 messages in memory to avoid growing infinitely
        if (messages.length > 100) messages.shift();

        res.status(200).json({ success: true, message });
    } else {
        res.status(405).json({ error: "Method not allowed" });
    }
}
