const imagekit = require("../libs/imagekit")
const path = require("path")
const {PrismaClient} = require("@prisma/client")
const prisma = new PrismaClient()

module.exports = {
    uploadImage : async (req , res ,next ) => {
        try {
            if (!req.file) throw new Error("no image selected", {cause : 400});
            const{judul,deskripsi}  = req.body
            
            const fileInStr  = req.file.buffer.toString('base64')
    
            const {url,fileId}  = await imagekit.upload({
                file : fileInStr, //required
                fileName : Date.now()+ path.extname(req.file.originalname)
            })
            
    
            const newimage = await prisma.gambar.create({
                data : {
                    judul : judul,
                    deskripsi : deskripsi,
                    url : url,
                    file_id : fileId
                }
            }) 
    
            const result = {
                    status : "success",
                    message : "succesfullly add image",
                    data : newimage
                }
            
            return res.json(result)
            
        } catch (err) {
            next(err)
        }
    },


    findAll : async (req ,res ,next ) => {

        try {
            const allImage  = await prisma.gambar.findMany()
    
            const result  = {
                status : "success",
                message : "succesfullly view all image",
                data : allImage
            }
    
            res.json(result)
        } catch (err) {
            
        }
    
    },

    remove : async (req  , res , next ) => {
        try {
            const id  = Number(req.params.id)
            if (isNaN(id) || !id) throw new Error("id not valid", {cause : 400}) 
                
            const foundImage = await prisma.gambar.findUnique({
                where : {
                    id : id
                }
            })
            if (!foundImage) throw new Error("No image found", {cause : 400});
    
            const deleted = await prisma.gambar.delete({
                where : {
                    id
                }
            })
    
            await imagekit.deleteFile(deleted.file_id)
    
            
            const result  = {
                status : "success",
                message : "succesfullly delete image",
                data : deleted
            }
            res.json(result)
    
        } catch (err) {
            next(err)
        }
    },

    findById : async (req , res, next) => {
        try {
            const id  = Number(req.params.id)
            if (isNaN(id) || !id) throw new Error("id not valid", {cause : 400}) 
                
            const foundImage = await prisma.gambar.findUnique({
                where : {
                    id : id
                }
            })
            if (!foundImage) throw new Error("No image found", {cause : 400});
    
            const result  = {
                status : "success",
                message : "succesfullly delete image",
                data : foundImage
            }
            res.json(result)
    
        } catch (err) {
            next(err)
        }
    },


    update : async (req , res , next ) => {
        try {
            const id  = Number(req.params.id)
            
            const {judul,deskripsi} = req.body
            if (isNaN(id) || !id) throw new Error("id not valid", {cause : 400}) 
            const foundImage = await prisma.gambar.findUnique({
                 where : {
                    id : id
                }
            })
            if (!foundImage) throw new Error("No image found", {cause : 400})
    
            const updated = await prisma.gambar.update({
                where : {
                    id : id
                },
                data : {
                    judul : judul,
                    deskripsi : deskripsi
                }
            })
    
            const result = {
                status : "success",
                message : "succesfullly update image info",
                data : updated
            }
            res.json(result)
    
        } catch (err) {
            next(err)
        }
    },

    resizeImage : async (req,res,next) => {
        try {
            const id  = Number(req.params.id)
            
            const size = req.body.size 
            const quality = req.body.quality 

            console.log(quality);
            
            if (isNaN(id) || !id) throw new Error("id not valid", {cause : 400}) 
            if (isNaN(size) || size < 0 ) throw new Error("size not valid", {cause : 400}) 
            if (isNaN(quality) || quality < 0) throw new Error("quality not valid", {cause : 400}) 

            const foundImage = await prisma.gambar.findUnique({
                 where : {
                    id : id
                }
            })

            const oldUrl = (foundImage.url).slice(8)
            let splitter = oldUrl.split('/')

            if (splitter.length > 3) {
                splitter[2] = `tr:w-${size},q-${quality}`
            } else {
                splitter[3] = splitter[2]
                splitter[2] = `tr:w-${size},q-${quality}`
            }

            const resizedUrl = 'https://'+(splitter.join("/"))


            if (!foundImage) throw new Error("No image found", {cause : 400})
            const updated = await prisma.gambar.update({
                where : {
                    id : id
                },
                data : {
                    url : resizedUrl
                }
            })
            const result = {
                status : "success",
                message : "succesfullly update image info",
                data : updated
            }
            res.json(result)
        } catch (err) {
            next(err)
        }
    }
}