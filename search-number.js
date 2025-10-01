import fs from 'fs';
import path from 'path';

export default function handler(req, res) {
    const { key, username } = req.query;

    // ✅ Replace with your very strong key
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

    // ✅ Read database
    const filePath = path.join(process.cwd(), 'database.txt');
    const data = fs.readFileSync(filePath, 'utf-8');

    const lines = data.split(/\r?\n/);
    let result = null;
    let i = 0;

    while (i < lines.length) {
        const line = lines[i].trim();

        // Match username
        if (line.startsWith('@') && line.toLowerCase() === username.toLowerCase()) {
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

    // If not found by username, check if it’s number/user id
    if (!result) {
        for (let j = 0; j < lines.length; j++) {
            if (lines[j].trim() === username) {
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

    res.status(200).json(result);
}
