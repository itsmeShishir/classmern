// multer -> kun chai path 
// path
import multer from "multer";
import path from "path";

// set storage engine
const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, "public/uploads")
    },
    filename(req, file, cb){
        cp(
            null,
            `${file.filename}-${Date.now}()${path.extname(file.originalname)}`
        );
    },
});

// Image check
function checkFileType(file, cb){
    const filetype = /jpg|jpge|png|webp/;
    const extname = filetype.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = filetype.test(file.mimetype);

    if(extname && mimetype){
        return cb(null, true);
    }else{
        cb(new Error("Image Only"))
    }
}

const upload = multer({
    storage,
    limits: {fileSize: 10 * 1024 * 1024}, //10 MB samma ko size 
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
})

export default upload;