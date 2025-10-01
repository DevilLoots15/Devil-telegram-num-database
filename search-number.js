import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    try {
        // Only allow GET requests
        if (req.method !== 'GET') {
            return res.status(405).json({ error: true, status: "method_not_allowed", message: "Use GET request" });
        }

        // Get query parameters
        const { key, username } = req.query;

        // Replace with your strong key
        const STRONG_KEY = "YOUR_VERY_STRONG_KEY_123456!@#";

        if (!key || key !== STRONG_KEY) {
            return res.status(403).json({
                error: true,
                status: "forbidden",
                message: "Invalid key"
            });
        }

        if (!username || username.trim() === '') {
            return res.status(400).json({
                error: true,
                status: "error",
                message: "Username or number is required"
            });
        }

        // Read database.txt
        const filePath = path.join(process.cwd(), 'database.txt');
        if (!fs.existsSync(filePath)) {
            return res.status(500).json({
                error: true,
                status: "error",
                message: "Database file not found"
            });
        }

        const data = fs.readFileSync(filePath, 'utf-8');
        const lines = data.split(/\r?\n/).map(line => line.trim()).filter(line => line !== '');

        let result = null;

        // Loop through database to find username/number
        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];

            // Match username
            if (line.startsWith('@') && line.toLowerCase() === username.toLowerCase()) {
                const number = lines[i + 1] || null;
                const userId = lines[i + 2] || null;
                result = { error: false, status: "success", username: line, number, user_id: userId };
                break;
            }

            // Match number or user ID directly
            if (line === username) {
                const nextLine = lines[i + 1] || null;
                const nextNextLine = lines[i + 2] || null;
                result = {
                    error: false,
                    status: "success",
                    username: null,
                    number: line.match(/^\+/) ? line : nextLine,
                    user_id: line.match(/^\+/) ? nextLine : line
                };
                break;
            }
        }

        if (!result) {
            return res.status(404).json({
                error: true,
                status: "not_found",
                message: "Username or Number not found"
            });
        }

        return res.status(200).json(result);

    } catch (err) {
        return res.status(500).json({
            error: true,
            status: "error",
            message: "Server error: " + err.message
        });
    }
                  }
