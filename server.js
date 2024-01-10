// server.js
import express from 'express';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
app.set('view engine', 'ejs');

app.use(express.static('public'));




app.get('/', (req, res) => {
  res.render('profile');
})



// Multer setup
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Log for debugging
        console.log("Uploading file:", file.originalname);
        console.log("Storage path set to: 'C:/Users/zakfr/Desktop/uploadphotos/public/uploads'");

        // Directly use the absolute path for the destination
        cb(null, 'C:/Users/zakfr/Desktop/uploadphotos/public/uploads');
    },
    filename: (req, file, cb) => {
        const newFilename = file.fieldname + '-' + Date.now() + path.extname(file.originalname);

        // Log for debugging
        console.log("Generated filename:", newFilename);

        // Filename configuration remains the same
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });





// File upload route
app.post('/upload', upload.single('image'), (req, res) => {
    res.json({ file: req.file });
});

// Start server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
