import React from "react";
import { FaUserCircle } from "react-icons/fa";

const UserList = ({ users, activeUser, selectUser }) => {
  return (
    <div className="sidebar">
      <h3>Users</h3>
      <ul>
        {users.map((user) => (
          <li
            key={user.username}
            className={activeUser === user.username ? "active" : ""}
            onClick={() => selectUser(user.username)}
          >
            <FaUserCircle style={{ marginRight: "8px" }} />
            {user.username}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
