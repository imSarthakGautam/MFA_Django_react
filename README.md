
# Auth_2FA_DjangoReact

A full-stack web application built with Django REST Framework and React, implementing user authentication with two-factor authentication (2FA) using TOTP (Time-based One-Time Password). 

The backend provides APIs for user registration, login, and MFA setup/verification, while the frontend offers a responsive interface for user interaction.

## MultiFactor Authentication
![Flow of this application's MFA](./Untitled%20diagram%20_%20Mermaid%20Chart.png)




## Features
- **User Registration**: Register with email and password, generating a JWT token and TOTP secret for 2FA.
- **User Login**: Authenticate with email and password, supporting 2FA if enabled.
- **Two-Factor Authentication (2FA)**: Setup and verify TOTP codes using an authenticator app (e.g., Google Authenticator).
- **QR Code Generation**: Displays a QR code for 2FA setup during registration.
- **JWT Authentication**: Secure API endpoints with JSON Web Tokens.
- **CORS Support**: Configured to allow frontend-backend communication.
- **Responsive Frontend**: Built with React and Tailwind CSS for a modern UI.

## Technologies
- **Backend**:
  - Django 5.2.4
  - Django REST Framework
  - Django REST Framework SimpleJWT
  - django-cors-headers
  - pyotp (for TOTP generation)
  - qrcode and Pillow (for QR code generation)
- **Frontend**:
  - React 18
  - React Router DOM
  - react-qr-code
  - Tailwind CSS
  - Axios (via custom `useApi` hook)
- **Environment**:
  - Python 3.11+
  - Node.js 18+
  - npm or yarn

## Project Structure
```
Auth_2FA_DjangoReact/
├── backend/
│   ├── authentication/
│   │   ├── api/
│   │   │   ├── serializers/
│   │   │   │   ├── auth.py
│   │   │   │   ├── mfa.py
│   │   │   │   └── __init__.py
│   │   │   ├── views/
│   │   │   │   ├── auth.py
│   │   │   │   ├── mfa.py
│   │   │   │   └── __init__.py
│   │   │   └── urls.py
│   │   └── models/
│   │       └── user.py
│   ├── config/
│   │   ├── settings/
│   │   │   └── base.py
│   │   └── urls.py
│   ├── manage.py
│   └── requirements.txt
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── RegisterForm.jsx
│   │   │   ├── LoginForm.jsx
│   │   │   ├── MFAForm.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── hooks/
│   │   │   └── useApi.js
│   │   ├── routes/
│   │   │   ├── Register.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── MFA.jsx
│   │   │   └── Dashboard.jsx
│   │   ├── utils/
│   │   │   └── validation.js
│   │   └── App.jsx
│   ├── package.json
│   └── .env
├── README.md
```

## Prerequisites
- Python 3.11+
- Node.js 18+
- npm or yarn
- An authenticator app (e.g., Google Authenticator, Authy)
- A modern web browser (e.g., Chrome, Firefox)

## Installation
1. **Clone the Repository**:
   ```bash
   git clone https://github.com/<your-repo>/Auth_2FA_DjangoReact.git
   cd Auth_2FA_DjangoReact
   ```

2. **Backend Setup**:
   - Navigate to the backend directory:
     ```bash
     cd backend
     ```
   - Create a virtual environment:
     ```bash
     python -m venv venv
     source venv/bin/activate  # On Windows: venv\Scripts\activate
     ```
   - Install dependencies:
     ```bash
     pip install -r requirements.txt
     ```
   - Apply migrations:
     ```bash
     python manage.py migrate
     ```
   - Create a `requirements.txt` if not present:
     ```text
     django==5.2.4
     djangorestframework
     djangorestframework-simplejwt
     django-cors-headers
     pyotp
     qrcode
     Pillow
     ```

3. **Frontend Setup**:
   - Navigate to the frontend directory:
     ```bash
     cd ../frontend
     ```
   - Install dependencies:
     ```bash
     npm install
     ```
     or
     ```bash
     yarn install
     ```
   - Create a `.env` file in the `frontend` directory:
     ```env
     REACT_APP_API_URL=http://localhost:8000
     ```
     Ensure `REACT_APP_API_URL` matches your backend URL.

## Running the Application
1. **Start the Backend**:
   ```bash
   cd backend
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   python manage.py runserver
   ```
   The backend runs at `http://localhost:8000`.

2. **Start the Frontend**:
   ```bash
   cd frontend
   npm run dev
   ```
   or
   ```bash
   yarn dev
   ```
   The frontend runs at `http://localhost:5173`.

3. **Access the Application**:
   Open `http://localhost:5173` in your browser.

## API Endpoints
 Method  Endpoint                     Description                             Request Body                           Response Body                                
------------------------------------------------------------------------------------------------------------------------------------------------------------------
 POST    `/api/v1/auth/register`      
 Register a new user with 2FA setup     
 
 POST    `/api/v1/auth/login`        
 Authenticate a user             
         
 GET     `/api/v1/auth/mfa/setup`     
 Get QR code for 2FA setup       

 POST    `/api/v1/auth/mfa/verify`    
 Verify TOTP code                        `                   

- **JWT Authentication**: Protected endpoints (`/api/v1/auth/mfa/*`) require an `Authorization: Bearer <token>` header.
- **CORS**: Configured to allow requests from `http://localhost:5173`.

## Frontend Routes

 `/`         -  `Register`       User registration form                 
 `/register` -  `Register`       User registration form                 
 `/login`    -  `Login`          User login form                        
 `/mfa`      -  `MFA`            2FA setup and TOTP verification        
 `/dashboard` - `Dashboard`      User dashboard after authentication    

