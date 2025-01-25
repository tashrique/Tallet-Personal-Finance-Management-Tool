# Tallet - Personal Finance Management Tool (AI-Powered)

Tallet is a backend-focused personal finance management tool that allows users to track their expenses, sync with bank accounts (via Plaid), and gain actionable insights through AI. The tool is built using Node.js, Express.js, MongoDB, and incorporates secure JWT-based authentication. It is designed for developers who want to deep dive into backend development while managing finances programmatically.


---

## Features
- **User Authentication**: Secure user registration and login using JWT.
- **Bank Transaction Sync**: Fetch and sync expenses directly from TD Bank and other financial institutions using Plaid.
- **Expense Management**:
  - Add, edit, and delete expenses.
  - Categorize expenses for better organization.
- **AI Insights**:
  - Analyze spending habits and suggest areas for saving.
  - Monthly spending summaries and trend predictions.
- **Advanced Filtering**:
  - Query expenses by date, category, or amount.
  - Sorting and pagination for large datasets.
- **Data Export**: Export expenses as CSV or PDF.
- **Role-Based Access Control (RBAC)**: Admin and regular user permissions.
- **Scalable Architecture**: Built for performance and scalability.


## Tech Stack
- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Bank Integration**: Plaid API
- **Authentication**: JSON Web Tokens (JWT) & bcrypt
- **AI Insights**: OpenAI API integration
- **Testing**: Jest and Supertest
- **Deployment**: Docker, Render/AWS