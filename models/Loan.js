class Loan {
    static calculateInterest(principal, years, rate) {
        return principal * years * (rate / 100);
    }

    static calculateEMI(totalAmount, years) {
        const months = years * 12;
        return totalAmount / months;
    }

    static async createLoan(db, customerId, principal, years, rate) {
        const interest = this.calculateInterest(principal, years, rate);
        const totalAmount = principal + interest;
        const emi = this.calculateEMI(totalAmount, years);

        return new Promise((resolve, reject) => {
            db.run(
                `INSERT INTO loans (customer_id, principal, interest_rate, period_years, total_amount, emi_amount) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [customerId, principal, rate, years, totalAmount, emi],
                function (err) {
                    if (err) reject(err);
                    resolve({
                        loanId: this.lastID,
                        totalAmount,
                        emi
                    });
                }
            );
        });
    }
}

module.exports = Loan;