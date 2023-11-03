const multer = require("multer")



const multerFilter = (allowedExt) => {
    return multer({
        fileFilter : (req , file , callback, next ) => {
          const allowedMimeTypes =allowedExt;
    
          if (!allowedMimeTypes.includes(file.mimetype)) {
              const err = new Error(`Only ${allowedMimeTypes.join(', ')} allowed to upload!`);
              return callback(err, false);
          }
          callback(null, true);
      },
      onError: (err, next) => {
        console.log('error',err);
        next(err);
    }
    })
}

module.exports = {
    imageFilter : multerFilter(['image/png', 'image/jpeg'])
}
