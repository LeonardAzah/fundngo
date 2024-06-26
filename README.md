# FundNgo

## Getting Started

To get started with this project, follow the instructions below.

### Clone the Repository

```bash
git clone https://github.com/LeonardAzah/fundngo.git
```

### Install Dependencies

After cloning the repository, navigate to the project directory and install the dependencies using npm.

```bash
npm install
```

### Start the Application

Once the dependencies are installed, you can start the Node.js application using the following command:

```bash
npm start
```

### Usage

After starting the application, you can access it by navigating to http://localhost:5000

### Environment Variables

```bash
PORT = 5000
MONGO_URI=mongodb://127.0.0.1:27017/fundngo_db

PAYSTACK_SECRET_KEY=sk_test_paystack_private_key

# JWT
# JWT secret key
JWT_SECRET=thisisasamplesecret
REFRESH_TOKEN_PRIVATE_KEY=this is a private key
JWT_LIFETIME=1d
# Email
# Gmail keys
EMAIL=gmail for user
PASSWORD=gmail password
# Cloudinary
# Cloudinaryl keys
CLOUD_NAME=vlound name
CLOUD_API_KEY=key
CLOUD_API_SECRET=clound key
# Google OAuth
# OAuth keys
GOOGLE_CLIENT_ID = google-client-id from the google
GOOGLE_CLIENT_SECRET=google-client-secret from google
GOOGLE__OAUTH_REDIRECT_URL = google redirect url

NODE_ENV =development
```

### API Documemntation

To view the list of available APIs and their specifications, run the server and go to http://localhost:5000 in your browser. This documentation page is automatically generated using docgen definitions written as comments in the route files. Or go to https://fundngo.onrender.com

#### API Endpoints

List of available routes:

##### Auth routes:
