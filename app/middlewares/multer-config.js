import multer from "multer";

// --- FILES ACCEPTED BY BACKEND --- 
const MIME_TYPES = {
    'image/jpeg' : 'jpg',
    'image/jpg' : 'jpg',
    'image/png' : 'png',
    'image/webp' : 'webp'
}

// --- METHOD TO GET, SAVE AND RENAME THE FILES RECEIVED --- 
const storage = multer.diskStorage({

    // Save the files in the uploads directory
    destination: (req, file, callback) => {
        callback(null, 'uploads');
    },

    // Method to rename the file 
    filename: (req, file, callback) => {

        // Get the original file name by replacing spaces by underscore and removing the extension
        const name = file.originalname.split(' ').join('_').split('.')[0];

        // Find the right extension
        const extension = MIME_TYPES[file.mimetype];

        // Create the final name 
        callback(null, name + Date.now() + '.' + extension)
    }
});

export default multer({ storage: storage }).single('avatar');

