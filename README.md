````md
# BloodConnect 🩸

BloodConnect is a full-stack MERN application that helps people find nearby blood donors based on blood-group compatibility, location, donor availability, and donation history.

The platform is designed around a privacy-first approach where donor contact information is shared only after the donor accepts a contact request.

---

## 🚀 Features

- User registration and login
- Server-side session-based authentication
- Secure password hashing with bcrypt
- Donor profile creation and availability management
- Blood request creation with urgency and required-by date
- Blood-group compatibility matching
- Location-based donor discovery
- MongoDB geospatial search using `2dsphere` and `$geoNear`
- Location search and reverse geocoding using Geoapify
- Browser-based current location detection
- Donor prioritization based on distance and donation history
- Consent-based donor contact requests
- Donor accept/reject workflow
- Contact details revealed only after donor approval
- Protected REST APIs
- Responsive React frontend

---

## 🛠️ Tech Stack

### Frontend

- React
- React Router
- Tailwind CSS
- React Icons
- Fetch API

### Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- Express Session
- Connect Mongo
- bcryptjs

### External Services

- Geoapify Geocoding API
- Browser Geolocation API

---

## 🏗️ Architecture

```text
                    ┌─────────────────────┐
                    │     React Client    │
                    │                     │
                    │  Pages & Components │
                    └──────────┬──────────┘
                               │
                               │ REST API
                               ▼
                    ┌─────────────────────┐
                    │   Express Server    │
                    │                     │
                    │ Routes              │
                    │ Controllers         │
                    │ Middleware          │
                    │ Services            │
                    │ Utilities           │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │       MongoDB       │
                    │                     │
                    │ Users               │
                    │ Donor Profiles      │
                    │ Donations           │
                    │ Blood Requests      │
                    │ Contact Requests    │
                    │ Sessions            │
                    └─────────────────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │      Geoapify       │
                    │   Geocoding API     │
                    └─────────────────────┘
````

---

## 📂 Project Structure

```text
bloodconnect/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   └── package.json
│
├── server/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   ├── utils/
│   │   └── app.js
│   │
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🧠 How BloodConnect Works

### 1. User Authentication

Users can register and log in to the application.

Passwords are hashed using bcrypt and authentication is maintained using server-side sessions stored in MongoDB.

```text
Register
   ↓
Password Hashing
   ↓
User Created
   ↓
Login
   ↓
Session Created
   ↓
Protected API Access
```

---

### 2. Donor Profile

A user can create a donor profile containing:

* Blood group
* Location
* Availability

Locations are stored internally as GeoJSON coordinates.

```text
Donor Profile
├── Blood Group
├── Location Name
├── Coordinates
└── Availability
```

Exact donor coordinates are not exposed to recipients.

---

### 3. Blood Request

A user can create a blood request containing:

* Blood group
* Number of units
* Location
* Urgency
* Required-by date

Example:

```text
Blood Group: O+
Units: 2
Location: Gurugram
Urgency: HIGH
```

---

## 🔎 Donor Matching

BloodConnect uses a multi-step donor matching system.

```text
Blood Request
      ↓
Blood Compatibility
      ↓
Available Donors
      ↓
Geospatial Search
      ↓
Donation History
      ↓
Priority Score
      ↓
Sorted Matching Donors
```

### Blood Compatibility

The system checks whether a donor's blood group is compatible with the requested blood group.

For example:

```text
Donor: O-
Request: A+

Compatible: Yes
```

The compatibility logic is implemented separately in:

```text
server/src/utils/bloodCompatibility.js
```

---

### Geospatial Matching

Donors are searched based on their geographic distance from the blood request.

MongoDB's geospatial features are used:

```text
2dsphere index
      +
$geoNear aggregation
```

This allows the backend to calculate the distance between the request location and available donors.

---

### Donor Priority

Matching donors are assigned a priority score based on factors such as:

* Distance from the blood request
* Time since the latest recorded donation

The purpose of the score is to prioritize potential matches for the application.

> The priority score is an application ranking mechanism and is not a medical eligibility determination.

---

## 🔐 Privacy & Contact System

BloodConnect does not immediately expose donor phone numbers.

Instead, it uses a consent-based workflow:

```text
Recipient
    │
    │ Contact Request
    ▼
  Donor
    │
    ├───────────────┐
    │               │
  Accept          Reject
    │               │
    ▼               ▼
Contact Shared    Request Rejected
```

Before acceptance, the recipient only sees limited donor information.

After acceptance, the recipient can access the donor's contact information.

This prevents donor contact information from being publicly exposed during the matching process.

---

## 📍 Location System

BloodConnect supports two ways of selecting a location.

### Manual Location Search

```text
User enters location
        ↓
Geoapify Search
        ↓
Location Suggestions
        ↓
User selects location
        ↓
Coordinates stored internally
```

### Current Location

```text
Browser GPS
    ↓
Latitude + Longitude
    ↓
Geoapify Reverse Geocoding
    ↓
Readable Location
    ↓
Coordinates stored internally
```

Users never need to manually enter latitude or longitude.

---

## 🔑 Authentication & Security

The application uses server-side session authentication.

```text
Client
  ↓
Login Request
  ↓
Express
  ↓
Credentials Verified
  ↓
Session Created
  ↓
MongoDB Session Store
  ↓
Session Cookie
```

Protected routes verify the active session before allowing access.

Security-related practices include:

* bcrypt password hashing
* Server-side sessions
* MongoDB session storage
* Protected API routes
* Environment variables for secrets
* Consent-based contact sharing
* No exposure of exact donor coordinates

---

## 🗃️ Main Data Models

### User

```text
User
├── name
├── email
├── phone
├── password
└── role
```

### DonorProfile

```text
DonorProfile
├── userId
├── bloodGroup
├── locationName
├── location
└── isAvailable
```

### Donation

```text
Donation
├── donorId
├── donationDate
└── bloodBank
```

### BloodRequest

```text
BloodRequest
├── requesterId
├── bloodGroup
├── units
├── location
├── urgency
├── requiredBy
└── status
```

### ContactRequest

```text
ContactRequest
├── requesterId
├── donorId
├── bloodRequestId
└── status
```

---

## 🌐 API Overview

### Authentication

| Method | Endpoint             | Description      |
| ------ | -------------------- | ---------------- |
| POST   | `/api/auth/register` | Register user    |
| POST   | `/api/auth/login`    | Login            |
| GET    | `/api/auth/me`       | Get current user |
| POST   | `/api/auth/logout`   | Logout           |

### Donor

| Method | Endpoint                  | Description               |
| ------ | ------------------------- | ------------------------- |
| POST   | `/api/donor`              | Create donor profile      |
| GET    | `/api/donor/me`           | Get donor profile         |
| PATCH  | `/api/donor/availability` | Update donor availability |

### Donations

| Method | Endpoint           | Description            |
| ------ | ------------------ | ---------------------- |
| POST   | `/api/donation`    | Create donation record |
| GET    | `/api/donation/me` | Get donation history   |

### Blood Requests

| Method | Endpoint                                | Description           |
| ------ | --------------------------------------- | --------------------- |
| POST   | `/api/blood-request`                    | Create blood request  |
| GET    | `/api/blood-request/me`                 | Get user's requests   |
| GET    | `/api/blood-request/:requestId/matches` | Find matching donors  |
| PATCH  | `/api/blood-request/:requestId/status`  | Update request status |

### Contact Requests

| Method | Endpoint                                  | Description                |
| ------ | ----------------------------------------- | -------------------------- |
| POST   | `/api/contact-request`                    | Send contact request       |
| GET    | `/api/contact-request/me`                 | Get received requests      |
| GET    | `/api/contact-request/sent`               | Get sent requests          |
| GET    | `/api/contact-request/my-contacts`        | Get accepted contacts      |
| PATCH  | `/api/contact-request/:requestId`         | Accept or reject request   |
| GET    | `/api/contact-request/:requestId/contact` | Get accepted donor contact |

### Location

| Method | Endpoint                | Description                 |
| ------ | ----------------------- | --------------------------- |
| POST   | `/api/location/search`  | Search locations            |
| POST   | `/api/location/reverse` | Reverse geocode coordinates |

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure you have:

* Node.js
* MongoDB
* Git
* Geoapify API key

---

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd bloodconnect
```

---

### 2. Install Backend Dependencies

```bash
cd server
npm install
```

---

### 3. Configure Environment Variables

Create a `.env` file inside the `server` directory:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_session_secret
GEOAPIFY_API_KEY=your_geoapify_api_key
```

Do not commit the `.env` file to Git.

---

### 4. Start the Backend

```bash
npm run dev
```

The backend will run on:

```text
http://localhost:5000
```

---

### 5. Install Frontend Dependencies

Open another terminal:

```bash
cd client
npm install
```

---

### 6. Start the Frontend

```bash
npm run dev
```

Open the local URL provided by Vite in your browser.

---

## 🔄 Example Application Flow

### Donor Flow

```text
Register
   ↓
Login
   ↓
Create Donor Profile
   ↓
Select Blood Group
   ↓
Select Location
   ↓
Set Availability
```

### Blood Request Flow

```text
Login
   ↓
Create Blood Request
   ↓
Select Blood Group
   ↓
Enter Units
   ↓
Select Location
   ↓
Set Urgency
   ↓
View Matching Donors
```

### Contact Flow

```text
Matching Donors
      ↓
Select Donor
      ↓
Send Contact Request
      ↓
Donor Receives Request
      ↓
Accept / Reject
      ↓
If Accepted
      ↓
Recipient Gets Contact Details
```

---

## 📊 Request Lifecycle

Blood requests can move through the following states:

```text
OPEN
 │
 ├──→ FULFILLED
 │
 ├──→ CANCELLED
 │
 └──→ EXPIRED
```

Pending contact requests can similarly move through:

```text
PENDING
   │
   ├──→ ACCEPTED
   │
   ├──→ REJECTED
   │
   └──→ CANCELLED
```

---

## 🚧 Future Improvements

Possible future improvements include:

* Email and SMS notifications
* Emergency push notifications
* Admin dashboard
* Donor/request moderation
* Automated blood request expiration
* Improved notification system
* Production deployment
* API rate limiting
* Audit logging
* Advanced donor ranking
* Monitoring and analytics

---

## ⚠️ Disclaimer

BloodConnect is a software project demonstrating blood donor discovery, matching, and communication workflows.

The donor priority system is an application-level ranking mechanism and should not be considered medical advice or a determination of blood donation eligibility.

Actual donation eligibility, transfusion decisions, and medical compatibility should be determined by qualified healthcare professionals and authorized blood banks.

---

## 👨‍💻 Author

**Your Name**

Built with:

```text
React
Node.js
Express.js
MongoDB
Mongoose
Tailwind CSS
Geoapify
```

### Project Focus

```text
Full-Stack Development
REST API Design
Authentication
Geospatial Search
MongoDB Aggregation
Privacy-Aware Workflows
Real-World Business Logic
```

---

⭐ If you find this project interesting, feel free to explore the repository and its implementation.
