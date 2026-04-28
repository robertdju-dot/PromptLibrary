"use client";

import { useState, useEffect } from "react";
import { User } from "@/lib/mockData";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Ban, ShieldCheck } from "lucide-react";
import { getUsers, banUser, unbanUser } from "@/actions/users";

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function load() {
      try {
        const data = await getUsers();
        setUsers(data as User[]);
      } catch (error) {
        console.error("Failed to load users", error);
      }
    }
    load();
  }, []);

  const handleBan = async (uid: string) => {
    await banUser(uid);
    setUsers(users.map(u => u.id === uid ? { ...u, status: "BANNED" } : u));
  };

  const handleUnban = async (uid: string) => {
    await unbanUser(uid);
    setUsers(users.map(u => u.id === uid ? { ...u, status: "ACTIVE" } : u));
  };
  
  const filteredUsers = users.filter(u => 
    u.name?.toLowerCase().includes(search.toLowerCase()) || 
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input 
            placeholder="Search users..." 
            className="pl-9 bg-card border-border/50"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border border-border/50 bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Tier</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>
                  <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={user.tier === "PREMIUM" ? "border-primary text-primary" : ""}>
                    {user.tier}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={user.status === "ACTIVE" ? "default" : "destructive"}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  {user.status === "ACTIVE" ? (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-destructive hover:text-destructive hover:bg-destructive/10"
                      onClick={() => handleBan(user.id)}
                    >
                      <Ban className="w-4 h-4 mr-2" />
                      Ban
                    </Button>
                  ) : (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-green-500 hover:text-green-500 hover:bg-green-500/10"
                      onClick={() => handleUnban(user.id)}
                    >
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Unban
                    </Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
