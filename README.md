# Bank Loan System API

## Overview
A RESTful backend system for managing bank loans, payments, and customer accounts. This API allows banks to process loans, accept payments, and provide transaction history to customers.

## Features
- Loan creation with EMI calculation
- Payment processing (EMI and lump sum)
- Transaction history tracking
- Customer account overview
- SQLite database integration

## Technologies
- Node.js (v18+)
- Express.js
- SQLite3
- REST architecture

## Installation
1. Clone the repository:
   git clone https://github.com/[your-username]/bank-loan-system.git
   cd bank-loan-system

2. Install dependencies:
   npm install

3. Start the server:
   node app.js

## API Endpoints

### 1. Create Loan (LEND)
POST /api/lend
Request Body:
{
  "customer_id": "string",
  "loan_amount": number,
  "loan_period": number, // in years
  "interest_rate": number // in percentage
}

Response:
{
  "loan_id": number,
  "total_amount": number,
  "monthly_emi": number
}

### 2. Record Payment (PAYMENT)
POST /api/payment
Request Body:
{
  "loan_id": number,
  "amount": number,
  "is_emi": boolean // true for EMI, false for lump sum
}

Response:
{
  "message": "Payment recorded",
  "balance_amount": number,
  "emis_left": number
}

### 3. View Ledger (LEDGER)
GET /api/ledger/:loan_id
Response:
{
  "payments": [
    {
      "payment_id": number,
      "amount": number,
      "is_emi": boolean,
      "payment_date": "ISO date string"
    }
  ],
  "balance_amount": number,
  "monthly_emi": number,
  "emis_left": number
}

### 4. Account Overview
GET /api/account/:customer_id
Response:
[
  {
    "loan_id": number,
    "principal": number,
    "total_amount": number,
    "emi_amount": number,
    "total_paid": number,
    "emis_left": number
  }
]

## Calculation Formulas
1. Interest (I) = Principal (P) × Period in Years (N) × Interest Rate (R)
2. Total Amount (A) = P + I
3. Monthly EMI = A / (N × 12)

## Database Schema
The system uses two SQLite tables:

1. loans table:
   - loan_id (PK)
   - customer_id
   - principal
   - interest_rate
   - period_years
   - total_amount
   - emi_amount
   - created_at

2. payments table:
   - payment_id (PK)
   - loan_id (FK)
   - amount
   - is_emi
   - payment_date

## Testing
Test the API using Postman or cURL:

1. Create a loan:
curl -X POST http://localhost:3000/api/lend -H "Content-Type: application/json" -d '{"customer_id":"cust123","loan_amount":10000,"loan_period":2,"interest_rate":5}'

2. Make a payment:
curl -X POST http://localhost:3000/api/payment -H "Content-Type: application/json" -d '{"loan_id":1,"amount":500,"is_emi":true}'

3. View ledger:
curl http://localhost:3000/api/ledger/1

## Error Handling
The API returns appropriate HTTP status codes:
- 200 OK for successful requests
- 400 Bad Request for invalid inputs
- 404 Not Found for non-existent resources
- 500 Internal Server Error for database issues

## Assumptions
1. Interest is calculated using simple interest formula
2. No authentication/authorization implemented
3. All currency values are in the same denomination
4. No minimum/maximum limits on loan amounts

## Future Enhancements
1. Add user authentication
2. Implement loan approval workflow
3. Add reporting features
4. Support for different currency types
5. Automated EMI payment scheduling

## License
MIT License - Free for academic and commercial use
