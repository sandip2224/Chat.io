# ChatIO🚀

<!-- PROJECT LOGO -->

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?style=for-the-badge)](http://shields.io/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

<!-- ABOUT THE PROJECT -->

## Built With

- Frontend
   - EJS Templates
   - CSS
- Backend
   - Node.js
   - Express.js
- Libraries
   - Mongoose
   - Socket.io
- Database
   - MongoDB Atlas
---

# 📈 UML Diagram

![ChatIO UML](https://user-images.githubusercontent.com/61842142/168413410-21214e15-d79a-4c51-ae73-0142f0921d07.jpeg)

## 🔥 Screenshots

| Landing Page |
| - |
| ![client/media/1.PNG](client/media/1.PNG) |

| Chat Page |
| - |
| ![client/media/2.PNG](client/media/2.PNG) |

## 🚩New Updates

- Added `{user} is typing` functionality.
- Added persistent chat storage in MongoDB Atlas
- Added push notification support on local environment


<!-- BUILT WITH -->  

## How to Install Locally

**1. Fork and clone this repository using**

   ```
   git clone https://github.com/sandip2224/ChatIO.git && cd ChatIO/
   ```  
   
**2. Install required dependencies/dev dependencies using**  

   ```
   npm install && npm install -D && touch .env
   ```  
**3. Add the following key-value pairs inside the .env file**  

> Generate the VAPID keys using the following command:  
> ```
> ./node_modules/.bin/web-push generate-vapid-keys
> ```

  ```
  MONGO_URI=<Unique MongoDB Cluster URL>
  PUBLIC_KEY=<Public VAPID Key>
  PRIVATE_KEY=<Private VAPID Key>
  ```

**4. Run server in development mode at `localhost:3000` using**  

  ```
  npm run dev
  ```
  
---

## Contributing

If you'd like to contribute, please **fork** the repository and then raise a PR with necessary changes. Thank you.

---

## 🤎 Found this project interesting?

If you found this project useful, then please leave a :star: on Github💔.

---

## :man: Project Maintained By-
  - [Sandipan Das](https://linkedin.com/in/sandipan0164/)
