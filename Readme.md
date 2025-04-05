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