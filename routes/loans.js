const express = require('express');
const router = express.Router();
const db = require('../db/database');
const Loan = require('../models/Loan');

// LEND: Create a new loan
router.post('/lend', async (req, res) => {
    const { customer_id, loan_amount, loan_period, interest_rate } = req.body;
    try {
        const { loanId, totalAmount, emi } = await Loan.createLoan(
            db, customer_id, loan_amount, loan_period, interest_rate
        );
        res.json({
            loan_id: loanId,
            total_amount: totalAmount,
            monthly_emi: emi
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// PAYMENT: Record payment (EMI or Lump Sum)
router.post('/payment', (req, res) => {
    const { loan_id, amount, is_emi } = req.body;
    db.run(
        `INSERT INTO payments (loan_id, amount, is_emi) VALUES (?, ?, ?)`,
        [loan_id, amount, is_emi ? 1 : 0],
        function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({ message: 'Payment recorded' });
        }
    );
});

// LEDGER: Get loan transactions
router.get('/ledger/:loan_id', (req, res) => {
    const loanId = req.params.loan_id;
    db.all(
        `SELECT * FROM payments WHERE loan_id = ? ORDER BY payment_date`,
        [loanId],
        (err, payments) => {
            if (err) return res.status(500).json({ error: err.message });
            
            db.get(
                `SELECT total_amount, emi_amount FROM loans WHERE loan_id = ?`,
                [loanId],
                (err, loan) => {
                    if (err) return res.status(500).json({ error: err.message });
                    
                    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0);
                    const remainingAmount = loan.total_amount - totalPaid;
                    const emisLeft = Math.ceil(remainingAmount / loan.emi_amount);

                    res.json({
                        payments,
                        balance_amount: remainingAmount,
                        monthly_emi: loan.emi_amount,
                        emis_left: emisLeft
                    });
                }
            );
        }
    );
});

module.exports = router;