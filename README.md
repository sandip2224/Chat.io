# ChatIO🚀

<!-- PROJECT LOGO -->

[![Website shields.io](https://img.shields.io/website-up-down-green-red/http/shields.io.svg?style=for-the-badge)](http://shields.io/)
[![Maintenance](https://img.shields.io/badge/Maintained%3F-yes-green.svg?style=for-the-badge)](https://GitHub.com/Naereen/StrapDown.js/graphs/commit-activity)

<!-- ABOUT THE PROJECT -->

## Built With

- Frontend: EJS, Vanilla CSS, JavaScript
- Backend: Node.js (Express.js)
- Database: MongoDB Atlas
- Containerization Framework: Docker
---

# 📈 UML Diagram

<details>
   <summary>Unoptimized Architecture (old)</summary>
   <img src="https://user-images.githubusercontent.com/61842142/168617573-a0cbdbd9-804c-4108-ba86-4a9136d56416.png"/ alt="Previous UML Architecture">
</details>

<details>
   <summary>Optimized Architecture (revamped)</summary>
   <img src="https://user-images.githubusercontent.com/61842142/172811785-3ed66bf7-0635-42f5-87a5-d58ff641bb0d.png"/ alt="Revamped UML Diagram">
</details>

<!-- BUILT WITH -->  

## 🚩 How to install locally

#### Fork and clone this repository using

   ```bash
   git clone https://github.com/sandip2224/ChatIO.git
   cd ChatIO
   ```  
   
#### Create a _.env_ file inside the root directory and include the following:

   ```bash
   # Database URI
   MONGO_DEV_URI=<Unique MongoDB Dev Cluster URL>
   MONGO_PROD_URI=<Unique MongoDB Prod Cluster URL>

   # VAPID Keys
   PUBLIC_KEY=<Public VAPID Key>
   PRIVATE_KEY=<Private VAPID Key>

   # Base URL
   BASE_URL=<http://localhost:3000> || <>
   ```  
   > Note: Get the following URL from MongoDB official website. You need to configure the `username`, `password` and `dbname` accordingly.
   ```bash
   mongodb+srv://<username>:<password>@cluster0.x1ccn.mongodb.net/<dbname>?retryWrites=true&w=majority
   ```

#### Generate VAPID keys for push notification support using

   ```bash
   npx web-push generate-vapid-keys
   ```
   
   Set these VAPID keys inside the .env file `(mandatory)`
 
#### Start the application locally using

   ```bash
   docker compose up
   ```

#### Test the API locally at _localhost:<PORT>_ or in production at _<>_

---

## ✨ Project Maintained By-
  - [Sandipan Das](https://linkedin.com/in/sandipan0164/)
