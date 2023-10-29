const router = require("express").Router()
const {uploadImage,findAll,findById,remove,update} = require("../controllers/galerry.controller") 
const {imageFilter} = require("../libs/multer")


router.post("/upload",imageFilter.single('file'),uploadImage)
router.get("/findAll",findAll)
router.get("/findById/:id",findById)
router.delete("/remove/:id",remove)
router.put("/update/:id",update)

module.exports = router
