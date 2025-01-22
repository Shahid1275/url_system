# URL Shortener System

A powerful and efficient **URL Shortener System** built using the **MERN stack** (MongoDB, Express.js, React.js, Node.js). This platform allows users to shorten long URLs into compact links, manage their generated URLs, and track basic information like usage statistics.

---

## Features

- **URL Shortening**: Convert long URLs into short, user-friendly links.
- **Custom Short URLs**: Option to create personalized short URLs.
- **Redirect Functionality**: Automatically redirect short URLs to their original destinations.
- **User Authentication**: Secure login and signup using JSON Web Tokens (JWT).
- **Dashboard Management**: Manage, edit, and delete shortened URLs in a responsive React-based interface.
- **Expiration Dates**: Set expiration dates for short URLs for better control.
- **Clipboard Copying**: Quickly copy the shortened URL with one click.
- **Statistics**: Basic statistics for tracking the number of times a short URL was accessed.
- **Fully Responsive UI**: Clean and modern design optimized for all devices.

---

## Tech Stack

### Frontend:
- **React.js**: User interface and state management.
- **Bootstrap/Tailwind CSS**: Styling for a clean and responsive UI.

### Backend:
- **Node.js**: Server-side logic.
- **Express.js**: Backend API and routing.

### Database:
- **MongoDB**: NoSQL database for storing original and short URLs, as well as user data.

### Additional Tools:
- **Mongoose**: ORM for MongoDB.
- **JSON Web Tokens (JWT)**: Authentication and authorization.
- **Nanoid**: For generating unique short URLs.

---

## Installation and Setup

### Prerequisites:
Ensure the following are installed on your system:
- **Node.js** (v14+)
- **MongoDB** (local or cloud-based like MongoDB Atlas)
- **Git**

### Steps:
1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/url-shortener-system.git
   cd url-shortener-system
   ```

2. Install dependencies:
   ```bash
   npm install
   cd client && npm install
   ```

3. Set up environment variables:
   Create a `.env` file in the root directory and configure the following:
   ```
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```

4. Run the backend server:
   ```bash
   npm run server
   ```

5. Start the frontend:
   ```bash
   cd client
   npm start
   ```

6. Access the application:
   Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## Folder Structure

```
url-shortener-system/
├── client/          # React frontend
├── server/          # Node.js and Express backend
├── models/          # MongoDB models
├── routes/          # API routes
├── controllers/     # Business logic for APIs
├── middlewares/     # Authentication and validation middleware
├── utils/           # Helper functions
└── README.md        # Project documentation
```

---

## Usage

1. **Signup/Login** to access the dashboard.
2. Paste your **long URL** into the input field and click **"Generate Short URL"**.
3. Copy the generated short URL and share it with others.
4. Use the dashboard to manage and track all your short URLs.

---

## Future Enhancements

- **QR Code Generation**: Provide QR codes for shortened URLs.
- **Advanced Analytics**: Track clicks, geographical data, and device types.
- **Custom Domain Support**: Allow users to use their own domains for shortened URLs.

---

## License

This project is open-source and available under the [MIT License](LICENSE).

---

## Contributing

Contributions are welcome! Feel free to open issues or submit pull requests to enhance the system.
