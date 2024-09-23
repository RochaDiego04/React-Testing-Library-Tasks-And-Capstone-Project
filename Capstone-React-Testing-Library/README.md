# Final task for React Testing Library

## Introduction

```shell
npm install

npm run start for frontend

npm run server for backend

```

## 1 Cover given code with tests (minimum is 60% of coverage)

## 2 Add tests in TDD approach and then add this features

Before implementing the feature, you write tests that define the expected behavior. These tests will initially fail. Then Implement the feature and check if tests are green

### 1 Add Task Prioritization

Objective: Add a priority level to tasks (e.g., Low, Medium, High) and ensure tasks can be sorted by priority.

### 2 Implementing a Due Date Reminder Feature

Objective: Add a feature that highlights tasks with a due date within the next day and marks them with a "Due Soon" label.

### 3 Task Progress Bar

Objective: Add a progress bar to each project that shows the percentage of tasks completed. This bar should dynamically update as tasks are completed or reopened.

## Mock server

This project uses json-Server. Get Familiar with [documentation](https://github.com/typicode/json-server#getting-started)
Feed db.json it into [JSON Server](https://github.com/typicode/json-server) to GET your mock API. Make sure to check to know how to get and update your data.

```shell
npm run server
```

or

```shell
json-server --watch db.json --port 3001
```

### Authentication

Authentication is simplified

> :warning: **Mock server stores passwords as plain text**:
> Remember do not provide any sensitive data into it

#### Login

In order to log user in you need to try getting them by username (like `http://localhost:3000/users/johnsmith`), if you got 200 and user - login successfull, if 404 - username or password wrong.

#### Signup

In order to sign user up just `POST` the form contents to `http://localhost:3000/users`, 200 response means signup was succesfull and user is authenticated now.
