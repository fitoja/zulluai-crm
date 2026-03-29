import React, { useEffect, useState } from "react";
import "./users.scss";
import Layout from "../layout";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    try {
      const res = await fetch("https://api.zulluai.com/api/get-all-users-info");
      const data = await res.json();

      if (data.success) {
        setUsers(data.data);
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Layout>
      <div className="users-page">
        <h2>All Users</h2>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>User</th>
                  <th>Email / Phone</th>
                  <th>Available Credits</th>
                  <th>Joined</th>
                </tr>
              </thead>

              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td className="user-info">
                      {/* <img
                        src={
                          user.profilePicture ||
                          user.avatar ||
                          "https://via.placeholder.com/40"
                        }
                        alt="avatar"
                      /> */}
                      {user.name || "No Name"}
                    </td>

                    <td>{user.email || user.phoneNumber || "N/A"}</td>

                    <td>{user.availableCredits}</td>

                    <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Users;
