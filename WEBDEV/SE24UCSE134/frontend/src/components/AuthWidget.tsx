"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

type AuthMode = "login" | "register";

export function AuthWidget() {
  const [user, setUser] = useState<{ name: string } | null>(null);
  const [dialog, setDialog] = useState<AuthMode | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    api
      .get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() => {
        setUser({ name: "User" });
        api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      })
      .catch(() => {
        localStorage.removeItem("token");
        setUser(null);
      });
  }, []);

  const handleAuth = async (mode: AuthMode) => {
    setLoading(true);
    try {
      const res = await api.post(`/api/auth/${mode}`, form);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({ name: user.name });

      toast.success(
        mode === "login" ? "Login successful" : "Registration successful",
        {
          description: `Welcome, ${user.name}!`,
        }
      );

      setDialog(null);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      toast.error("Authentication failed", {
        description: err.response?.data?.error || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);

    toast("Signed out", {
      description: "You have been logged out.",
    });
  };

  const renderForm = (mode: AuthMode) => (
    <div className="space-y-4">
      {mode === "register" && (
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
        </div>
      )}
      <div>
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
      </div>
      <Button
        onClick={() => handleAuth(mode)}
        disabled={loading}
        className="w-full"
      >
        {loading ? "Please wait..." : mode === "register" ? "Sign Up" : "Login"}
      </Button>
    </div>
  );

  return (
    <div className="flex items-center gap-4 flex-wrap">
      {user ? (
        <>
          <span className="text-muted-foreground">
            Hi, <b>{user.name}</b>
          </span>
          <Button onClick={() => navigate("/blogs")} variant="secondary">
            Blogs
          </Button>
          <Button onClick={() => navigate("/events")} variant="secondary">
            Events
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button onClick={() => setDialog("login")}>Login</Button>
          <Button variant="secondary" onClick={() => setDialog("register")}>
            Sign Up
          </Button>

          <Dialog
            open={dialog === "login"}
            onOpenChange={() => setDialog(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Login</DialogTitle>
              </DialogHeader>
              {renderForm("login")}
            </DialogContent>
          </Dialog>

          <Dialog
            open={dialog === "register"}
            onOpenChange={() => setDialog(null)}
          >
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Sign Up</DialogTitle>
              </DialogHeader>
              {renderForm("register")}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
