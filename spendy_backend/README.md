# Spendy - Monthly Expense Tracker

A full-stack personal finance management application to track income, expenses, budgets, and financial insights. Built with a secure Spring Boot backend and designed to support scalable frontend integration.

## Features

* User registration and login with JWT authentication
* Secure role-based access control
* Add, update, delete transactions
* Categorize income and expenses
* Filter transactions by date range
* Monthly dashboard and summaries
* Budget planning and tracking
* CSV import/export support
* Swagger / OpenAPI API documentation
* Scheduler support for recurring tasks (planned)

## Tech Stack

### Backend

* Java
* Spring Boot
* Spring Security
* Spring Data JPA
* Hibernate
* JWT Authentication
* Maven
* MySQL / PostgreSQL (configurable)

### Tools

* Postman
* Git & GitHub
* IntelliJ IDEA / VS Code

## Project Structure

```text
src/main/java/com/rohitcodes/expense_tracker/
├── config
├── controller
├── dto
├── entity
├── exception
├── repository
├── security
├── service
└── util
```

## Getting Started

### Prerequisites

* Java 21+
* Maven 3.8+
* MySQL or PostgreSQL
* IDE of your choice

### Installation

1. Clone the repository

```bash
git clone https://github.com/your-username/monthly-expense-tracker.git
```

2. Navigate into the project folder

```bash
cd monthly-expense-tracker
```

3. Configure database credentials in `application.properties`

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/expense_tracker
spring.datasource.username=your_username
spring.datasource.password=your_password
```

4. Run the application

```bash
mvn spring-boot:run
```

5. Server runs at:

```text
http://localhost:8085
```

## API Documentation

After starting the server, open:

```text
http://localhost:8085/swagger-ui.html
```

## Example API Endpoints

### Auth

* `POST /api/auth/register`
* `POST /api/auth/login`

### Transactions

* `POST /api/transactions`
* `GET /api/transactions`
* `PUT /api/transactions/{id}`
* `DELETE /api/transactions/{id}`

### Categories

* `GET /api/categories`
* `POST /api/categories`

## Future Improvements

* Frontend with React / Next.js
* AI-powered spending insights
* Email alerts and reminders
* Mobile app version
* Recurring expense automation
* Multi-currency support

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss improvements.

## License

This project is for educational and portfolio purposes.

## Author

**Rohit Singh Chouhan**
