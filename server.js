// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const app = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));

const imageDataPath = path.join(__dirname, 'imageData.json');
function readImageData() {
    try {
        const fileContents = fs.readFileSync(imageDataPath, 'utf8');
        if (fileContents.trim() === '') {
            return {};
        }
        return JSON.parse(fileContents);
    } catch (error) {
        if (error.code === 'ENOENT' || error instanceof SyntaxError) {
            return {};
        }
        throw error;
    }
}


// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'C:/Users/zakfr/Desktop/uploadphotos/public/uploads');
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });


// File upload route
app.post('/upload', upload.single('image'), (req, res) => {
    let data = readImageData();
    data.imageName = req.file.filename;
    fs.writeFileSync(imageDataPath, JSON.stringify(data));
    res.json({ file: req.file });
});

// Home route
app.get('/', (req, res) => {
  let data = readImageData();
  res.render('profile', { imageName: data.imageName || null });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
