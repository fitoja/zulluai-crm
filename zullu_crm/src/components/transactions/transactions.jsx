import React, { useEffect, useState } from "react";
import "./transactions.scss";
import Layout from "../layout";

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const res = await fetch("https://api.zulluai.com/api/get-all-transactions");
      const data = await res.json();

      if (data.success) {
        setTransactions(data.data);
      }
    } catch (err) {
      console.error("Error fetching transactions:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Layout>
      <div className="transactions-page">
        <h2>All Transactions</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Plan</th>
                  <th>Credits</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {transactions.map((txn) => {
                  const userName = txn.email || txn.phoneNumber || "N/A";

                  return (
                    <tr key={txn._id}>
                      <td>
                        {userName}
                      </td>

                      <td>{txn.planName}</td>

                      <td>{txn.creditsPurchased}</td>

                      <td>₹{txn.amountPaid}</td>

                      <td>
                        <span className={`status ${txn.status}`}>
                          {txn.status}
                        </span>
                      </td>

                      <td>{new Date(txn.createdAt).toLocaleDateString()}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Transactions;
