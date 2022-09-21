forever stopall

git stash
git pull
cd frontend
REACT_APP_BE_IP=`dig +short myip.opendns.com @resolver1.opendns.com` npm run build
cd ..
cd backend
npm run build
cd ..
forever start backend/server.js
serve -p 80 -s frontend/build