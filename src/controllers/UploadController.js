
const totalStorage = 1048576;
const actualStorage = [];
let actualStorageFree = [];
let totalFilesUser = [];
let totalFiles = [];

const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null,"uploads/");
    },
    filename: function(req, file, cb){
        cb(null, Date.now() + file.originalname);
    }
});

const upload = multer({storage:storage, limits:{fileSize:1048576}}).single("uploaded_file");

const uploadMiddleware = (req, res) => {
 
  upload(req, res, (err) => {
      if (err instanceof multer.MulterError) {
          return res.status(400).send({ message: err.message })
      } else if (err) {
          return res.status(400).send({ message: err.message })
      }

      const file  = req.file;
      const size  = file.size;
      
      actualStorage.push(size);
  
      sum = lodash.sum(actualStorage);;

      if(totalFiles !== 0) {
        if(sum  > actualStorageFree){
         return res.status(400).send({ message:"no space" });
        }
      }
  
      actualStorageFree = totalStorage - sum;
      console.log(actualStorageFree);
  
      if(sum > totalStorage){
            return res.status(400).send({ message:"Insuficient space" });
            }
       
      totalFiles++;
      totalFilesUser++;

      res.status(200).send({
          file: file.originalname,
          filename: file.filename,
          size: file.size +"kb",
       });
   });
};


router.get("/upload/:filename", (req, res) => {
    const filename = req.params.filename;
    const upload = `${__dirname}/uploads/${filename}`;
    res.download(upload);
});

router.post("/upload", uploadMiddleware,(req,res) => {
    res.send({ message:"Arquivo recebido"});
});

router.get("/actualStorageFree",(req,res) => {
    res.send(`Espaço livre de ${actualStorageFree}kb`);
});

router.get("/totalFiles",(req,res) => {
    res.send(totalFiles === 1 ? totalFiles + " arquivo" : totalFiles + " arquivos");
});

module.exports = router;