import { useEffect, useState } from "react";
import ListLayout from "../list-layout/ListLayout";
import Card from "../card/Card";
import './users-list.css';

export default function UsersList({ users }) {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const pageSize = 2;

  const filteredUsers = users.filter((user) => {
    const s = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(s) ||
      user.lastName.toLowerCase().includes(s) ||
      user.email.toLowerCase().includes(s) ||
      user.phoneNumber.toString().includes(s) ||
      user.id.toString().includes(s)
    );
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  const totalPages = Math.max(1, Math.ceil(filteredUsers.length / pageSize));

  const paginatedUsers = filteredUsers.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <ListLayout searchValue={search} onSearchChange={setSearch} page={page} totalPages={totalPages}
      onPrev={() => setPage(p => Math.max(1, p - 1))}
      onNext={() => setPage(p => Math.min(totalPages, p + 1))} searchPlaceholder="Search users">
      {paginatedUsers.map((user) => (
        <Card key={user.id} type="user" data={user} />
      ))}
    </ListLayout>
  );
}
