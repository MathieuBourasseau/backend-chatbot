import multer from "multer";

// --- FILES ACCEPTED BY BACKEND --- 
const MIME_TYPES = {
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg',
    'image/png' : 'png',
    'image/webp' : 'web'
}

// --- METHOD TO GET, SAVE AND RENAME THE FILES RECEIVED --- 
const storage = multer.diskStorage({

    // Where to save the files received
    destination: (req, file, callback) {
        callback(null, 'uploads');
    }
})

