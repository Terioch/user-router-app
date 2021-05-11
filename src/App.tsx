import React, { useEffect, useState } from "react";
import { Route, Link, useLocation } from "react-router-dom";
import "./styles.css";

interface Picture {
  large: string;
}

interface Registered {
  age: number;
}

interface Name {
  title: string;
  first: string;
  last: string;
}

interface User {
  gender: String;
  name: Name;
  email: string;
  registered: Registered;
  picture: Picture;
  phone: string;
}

interface State {
  user: User;
}

interface Location {
  state: State;
}

const UserRoute: React.FC = () => {
  const location: Location = useLocation();
  const {
    gender,
    email,
    registered: { age },
    picture: { large }
  } = location.state.user;

  return (
    <>
      <img src={large} alt="loading..." />
      <ul style={{ listStyle: "none" }}>
        <li>{age}</li>
        <li>{gender}</li>
        <li>{email}</li>
      </ul>
      <div>
        <Link to="/">Go back</Link>
      </div>
    </>
  );
};

const UserList: React.FC<{ users: Array<User> }> = ({ users }) => {
  const getUserName = (user: User) => {
    const {
      name: { first, last }
    } = user;
    return `${first} ${last}`;
  };

  const getUserRouteParams = (user: User) => {
    return {
      pathname: `/user/${user.phone}`,
      state: { user }
    };
  };

  return (
    <ul>
      {users.map((user: User, idx) => (
        <li key={idx} style={{ listStyle: "none" }}>
          <Link to={getUserRouteParams(user)}>{getUserName(user)}</Link>
        </li>
      ))}
    </ul>
  );
};

export default function App() {
  const [users, setUsers] = useState<User[]>([]);

  const fetchData = async () => {
    const res = await fetch("https://randomuser.me/api/?results=10");
    const data = await res.json();
    return data.results;
  };

  useEffect(() => {
    fetchData().then((data) => {
      setUsers(data);
    });
  }, []);

  return (
    <div className="App">
      <h1>User Router</h1>
      <hr />
      <Route exact path="/">
        <UserList users={users} />
      </Route>
      <Route path="/user/:id" component={UserRoute} />
    </div>
  );
}
