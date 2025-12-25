import multer from "multer";
import path from "path";
import fs from "fs";

// 1. ensure we have upload directory
const uploadDir = path.join(process.cwd(), "public/uploads");

if(!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir, {recursive: true});
    console.log("Upload directory created at ", uploadDir);
};

//2. Set Storage Engine
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, uploadDir);
    },
    filename(req, file, cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `${file.fieldname}-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

// 3. File Filter
const checkFileType = (file, cb) => {
    const allowedFileTypes = /jpeg|jpg|png|gif|webp|svg/;
    const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedFileTypes.test(file.mimetype);

    if(extname && mimetype){
        return cb(null, true);
    } else {
        cb(new Error("Only images are allowed (jpeg, jpg, png, gif)"));
    }
};

// 4. Initialize Upload
const upload = multer({
    storage: storage,
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    },
    limits: { fileSize: 5 * 1024 * 1024 } // 5 MB limit
});

export default upload;