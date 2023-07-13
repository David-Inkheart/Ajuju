# Ajuju
 *ask, know more, share...*

[![License](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

Ajuju is a backend service that powers a fast and intuitive Q&A platform that connects users willing to answer questions in their interest niche or expertise. It delivers 
conversational answers at your fingertips. No more waiting or sifting through irrelevant information!

![Alt text](Ajuju.png)

### Key Features

- **RESTful API**: A robust API allows for easy integration with other applications.
- **User Authentication**: Verified users with niche expertise ensure credible and reliable answers.
- **Basic User Profiles**: Build your reputation and connect with others in the community through user profiles.
- **Forgot Password**: Reset your password with a 5-digit code sent to your email.
- **Email message on registration**: Receive a welcome email after registering on the platform.
- **Ask Questions**: Ask questions and get answers from experts in the community.
- **Answer Questions**: Share your knowledge and expertise by answering questions.
- **Search**: Find a user based on their email address.
- **Followers/Following**: Follow users and see who is following you.
- **Voting and Feedback System**: Upvote or downvote question and answers based on quality, ensuring the best rise to the top.


### Future Features

- **Simple and Intuitive Interface**: A clean and user-friendly interface allows users to easily post questions and receive answers.
- **AI Chatbot Integration**: Instant responses and suggestions powered by an AI chatbot enhance the user experience.
- **Real-time Notifications**: Stay updated with push notifications for answered questions and relevant discussions.
- **AI Powered Answer Generation**: Generate answers to questions using an AI language model.


### Technologies Used

- **Backend Development**: TypeScript, Node.js, Express.js, RabbitMQ, Nodemailer, JWT, Bcrypt
- **Data Persistence**: PostgreSQL, Prisma ORM (TypeScript), Redis for caching
- **Testing**: Jest. 

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
   npm run dev
   ```

5. Access the application:

   Open your web browser and visit `http://localhost:3000` to access Ajuju.

### API Endpoints Documentation

The API endpoints documentation is available [here](https://documenter.getpostman.com/view/27102918/2s946bDajr).

### License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).

### Contribution

Contributions are welcome! Please follow the guidelines in the [CONTRIBUTING.md](./CONTRIBUTING.md) file.

### Acknowledgements

- This project was inspired by the Quora platform.

### Contact

Let's connect and dive into the world of knowledge together!