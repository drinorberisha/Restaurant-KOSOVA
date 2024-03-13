Restaurant Ordering System

Project Description

This project provides a comprehensive ordering system designed for restaurants and bars. It offers efficient order creation and management for waiters, along with an integrated back-office and database manipulation features for admins.

## Key Features

    Waiter-Friendly Ordering:
        Intuitive interface for quickly inputting customer orders.
        In-memory order tracking for seamless management.
        Accurate price calculations for each order.
        Fiscal coupon generation to ensure compliance.
    Admin Dashboard:
        User management (adding, editing, and managing permissions for admins and waiters).
        Product management (adding, editing, deleting, and managing stock levels).
        Easy-to-use database manipulation tools.

## Technologies

    Frontend: Next.js (React-based framework)
    Backend: Node.js with Express.js
    Database: PostgreSQL

## Getting Started

## Prerequisites

    Node.js and npm (or yarn) installed
    A basic understanding of JavaScript, React, and web development concepts

## Installation

    Clone this repository.
    Navigate to the project's root directory:
    $ cd RESTAURANT-KOSOVA

## Install dependencies:

npm install --prefix restaurant
npm install --prefix backend

## Running the Development Servers
    Running manually in separate terminals  
    Start the backend (open a new terminal):
    cd backend
    npm run dev

    Start the frontend (open a new terminal):
    cd restaurant
    npm run dev

## Accessing the Application

Open http://localhost:3000 in your browser (the frontend typically runs on port 3000, backend port may vary - check your backend configuration).


## Database Setup

    A You will interact with the live version of the database, or create a new PostgreSQL database locally and change the .env POSTGRES_URL to the server of the database.

## Admin Access

    Initial admin credentials are defined in the backend configuration.
    Access the administration panel (the route will be specified in the backend setup).

## Additional Notes

    This project is under active development.
    Configuration files may be necessary for setting database paths or other project settings.
    For production deployment, please refer to the documentation for Next.js and your chosen backend deployment process.
