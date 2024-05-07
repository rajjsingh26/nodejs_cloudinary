const express = require('express');
const fileUpload = require('express-fileupload');
const cloudinary = require('cloudinary').v2
const app = express();

cloudinary.config({
    cloud_name: 'xxxx',
    api_key: 'xxxx',
    api_secret: 'xxxxxx'
})


app.set('view engine', 'ejs')

//middleware
app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: '/tmp/'
}))



app.get('/get',(req,res)=>{
    console.log(req.body);
    res.send(req.query);
})

app.post('/post',async (req,res)=>{
    console.log(req.body);
    console.log(req.files)

    let result
    let imageArray = [];

    // multiple images
    if (req.files) {
        for (let index = 0; index < req.files.samplefile.length; index++) {
          let result  = await cloudinary.uploader.upload(req.files.samplefile[index].tempFilePath,{
                folder: 'users'
            })

            imageArray.push({
                public_id: result.public_id,
                secure_id: result.secure_url
            })
        }
    }


    // single file upload
    // let file = req.files.samplefile

    // result = await cloudinary.uploader.upload(file.tempFilePath, {
    //     folder: 'users'
    // })

    console.log(result)

    details = {
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        result,
        imageArray
    }
    console.log(details)

    res.send(details);
})

app.get('/myget',(req,res)=>{
    res.render('getform')
})

app.get('/mypost',(req,res)=>{
    res.render('postform')
})

app.listen(4000,()=>{
    console.log("Server is running.")
})