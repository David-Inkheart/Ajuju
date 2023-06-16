## Ajuju: Your Instant Answer Hub

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Ajuju is a fast and intuitive Q&A platform that connects users willing to answer questions in their interest niche or expertise. It delivers precise and trustworthy answers at your fingertips. No more waiting or sifting through irrelevant information!

### Key Features

- **RESTful API**: A robust API allows for easy integration with other applications.
- **User Authentication**: Verified users with niche expertise ensure credible and reliable answers.
- **Basic User Profiles**: Build your reputation and connect with others in the community through user profiles.
- **Forget Password**: Reset your password with a 5-digit code sent to your email.
- **Search**: Find questions and answers based on keywords.
- **Voting and Feedback System**: Upvote or downvote answers based on quality, ensuring the best rise to the top.
- **Simple and Intuitive Interface**: A clean and user-friendly interface allows users to easily post questions and receive answers.


### Future Features

- **AI Chatbot Integration**: Instant responses and suggestions powered by an AI chatbot enhance the user experience.
- **Real-time Notifications**: Stay updated with push notifications for answered questions and relevant discussions.
- **AI Powered Answer Generation**: Generate answers to questions using an AI language model.


### Technologies Used

- **Backend Development**: TypeScript, Node.js, Express.js
- **Data Persistence**: PostgreSQL, Prisma ORM (TypeScript), Redis for caching
- **Frontend Development**: React.js

### Getting Started

Follow these steps to get started with the Ajuju project:

1. Clone the repository:

   ```
   git clone https://github.com/your-username/ajuju.git
   ```

2. Install the dependencies:

   ```
   cd ajuju
   npm install
   ```

3. Set up the environment variables:
   - Create a `.env` file based on the provided `.env.example` file.
   - Set the necessary environment variables for the database connection and other configurations.

4. Run the server:

   ```
   npm start
   ```

5. Access the application:

   Open your web browser and visit `http://localhost:3000` to access Ajuju.

### API Endpoints

#### Authentication

- `POST /auth/register`: Register a new user on the platform.
- `POST /auth/login`: Log in to the platform with your email and password.
- `POST /auth/password`: Change your password.
- `POST /auth/password-reset`: Reset your password using the 5-digit code sent via email.
- `POST /auth/password-reset/confirm`: Confirm your password reset with the code and new password.

#### Followers/Following

- `GET /search/accounts?email={email}`: Get the profile of a user based on their email address.
- `POST /accounts/follow`: Follow a user by submitting their user ID.
- `POST /accounts/following`: See a list of the accounts you are following.

#### Questions & Answers

- `POST /questions`: Create a new question with a title and description.
- `GET /questions`: Get a list of questions you've asked.
- `POST /answers`: Create a new answer to a question with a title and description.
- `GET /answers`: Get a list of answers to a question.

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

### Contribution

Contributions are welcome! Please follow the guidelines in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

### Acknowledgements

- This project was inspired by the Quora platform.

### Contact

Let's connect and dive into the world of knowledge together!