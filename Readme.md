https://app.eraser.io/workspace/YtPqZ1VogxGy1jzIDkzj

\
https://mrkandreev.name/snippets/gitignore-generator/#Node

javascript me 2 tarah se importing hoti hai ek common js se ek module se we will use module so package.json me type me module kar do

Nodemon is used when we want to run the server as soon as wwe saave the files
https://nodemon.io/

we use dev dependency so that it dont go in production code
npm install --save-dev nodemon

package,json ki devdependencies me nodemon aa gaya
aur src ki index file me jo bhi likhnege unko ye run kar dega
uske liye scripts me dev bana liya aur npm run dev kate hi nodeman chal jata hai
"dev": "nodemon src/index.js"

prettier nodemon waali website se nikal lo prettier bhi dev dependency hai it is needed when many people are working on same product koi semicolon laga aur koi nahi lagaya

npm i -D prettier d dev dependency ke liye hai

due to prettier we need to add some files manually
.prettierrc

prettier me code likhne ke badd click on niche preetier jo diya hai

prettierignore me jo jo file me prettier nahi laga wo likhenge

api reference wali video
cookies install karo npmjs se module wali cors bhi cross origin resource sharing

note app.use(cors()) is used when we need middleware and configuration setting

middleware beech me check karega ki login hai ki nahi

utils me async handler bnaya gaya hai because database se hum baar baar baat karenge toh usko ke seperate file me bana ke export kar do

cloudnary ko as a utility rakhenge hum



seepost man configuratuon and everything
login karne ke baad refreshtoken and accesstoken aa jayega cookies me 

access and refresh token help user not to log in frenquently refresh token is kept in database  after access token gets expired  user gets 401 request access expires and refresh token is used to get access again we send refresh token and match with the
refreshtoken in backend sif both ar same then we get new access and refresh token and we get anew session