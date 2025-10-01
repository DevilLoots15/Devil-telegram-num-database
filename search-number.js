import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    // ✅ Get query params
    const { key, username } = req.query;

    // ✅ Strong key check (replace with your strong key)
    const STRONG_KEY = "YOUR_VERY_STRONG_KEY_123456!@#";

    if (!key || key !== STRONG_KEY) {
        return res.status(403).json({
            error: true,
            status: "forbidden",
            message: "Invalid key"
        });
    }

    if (!username) {
        return res.status(400).json({
            error: true,
            status: "error",
            message: "Username is required"
        });
    }

    // ✅ Read database.txt
    const filePath = path.join(process.cwd(), 'database.txt');
    const data = fs.readFileSync(filePath, 'utf-8');

    // ✅ Split by line
    const lines = data.split(/\r?\n/);

    let result = null;
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        if (line.startsWith('@') && line.toLowerCase() === username.toLowerCase()) {
            // Username found
            const number = lines[i + 1] ? lines[i + 1].trim() : null;
            const userId = lines[i + 2] ? lines[i + 2].trim() : null;

            result = {
                error: false,
                status: "success",
                username: line,
                number: number,
                user_id: userId
            };
            break;
        }

        i++;
    }

    // If username not found, check if username is actually a number or user id
    if (!result) {
        for (let j = 0; j < lines.length; j++) {
            if (lines[j].trim() === username) {
                // check next line(s) for details
                const number = lines[j + 1] ? lines[j + 1].trim() : null;
                const userId = lines[j + 2] ? lines[j + 2].trim() : null;

                result = {
                    error: false,
                    status: "success",
                    username: null,
                    number: number,
                    user_id: userId
                };
                break;
            }
        }
    }

    if (!result) {
        return res.status(404).json({
            error: true,
            status: "not found",
            message: "Username/Number not found"
        });
    }

    // ✅ Return JSON response
    res.status(200).json(result);
}
