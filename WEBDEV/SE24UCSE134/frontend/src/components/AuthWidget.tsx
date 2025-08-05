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
import { z } from "zod";

type AuthMode = "login" | "register";

interface UserData {
  name: string;
  isAdmin: boolean;
}

const loginSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const registerSchema = loginSchema.extend({
  name: z.string().min(1, "Name is required"),
});

export function AuthWidget() {
  const [user, setUser] = useState<UserData | null>(null);
  const [dialog, setDialog] = useState<AuthMode | null>(null);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setUser(null);
      return;
    }

    try {
      const res = await api.get("/api/auth/me", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUser({
        name: res.data.name || "User",
        isAdmin: res.data.isAdmin || false,
      });
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    } catch (err) {
      localStorage.removeItem("token");
      setUser(null);
      delete api.defaults.headers.common["Authorization"];
    }
  };

  useEffect(() => {
    checkAuth();
    const handleStorageChange = () => checkAuth();
    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [navigate]);

  const handleAuth = async (mode: AuthMode) => {
    setLoading(true);
    try {
      const schema = mode === "login" ? loginSchema : registerSchema;
      const validatedData = schema.parse(form);

      const res = await api.post(`/api/auth/${mode}`, validatedData);
      const { token, user } = res.data;

      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;
      setUser({
        name: user.name,
        isAdmin: user.isAdmin || false,
      });

      toast.success(
        mode === "login" ? "Login successful" : "Registration successful",
        { description: `Welcome, ${user.name}!` }
      );

      setDialog(null);
      setForm({ name: "", email: "", password: "" });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        const firstError = err.errors[0];
        toast.error("Validation error", {
          description: firstError.message,
        });
      } else {
        toast.error("Authentication failed", {
          description: err.response?.data?.error || "Something went wrong",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    delete api.defaults.headers.common["Authorization"];
    setUser(null);
    toast("Signed out", { description: "You have been logged out." });
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
            placeholder="Enter your name"
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
          placeholder="Enter your email"
        />
      </div>
      <div>
        <Label htmlFor="password">Password</Label>
        <Input
          id="password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          placeholder="Enter your password"
        />
      </div>
      <Button
        onClick={() => handleAuth(mode)}
        disabled={loading}
        className="w-full mt-2"
      >
        {loading ? "Please wait..." : mode === "register" ? "Sign Up" : "Login"}
      </Button>
    </div>
  );

  return (
    <div className="flex items-center gap-2 sm:gap-4 flex-wrap">
      {/* Always visible navigation buttons */}
      <Button
        onClick={() => navigate("/blogs")}
        variant="ghost"
        className="text-sm sm:text-base"
      >
        Blogs
      </Button>
      <Button
        onClick={() => navigate("/events")}
        variant="ghost"
        className="text-sm sm:text-base"
      >
        Events
      </Button>

      {/* Authentication section */}
      {user ? (
        <>
          <span className="text-muted-foreground text-sm">
            Hi, <b>{user.name}</b>
            {user.isAdmin && (
              <span className="ml-1 text-xs bg-primary text-primary-foreground px-1.5 py-0.5 rounded-full">
                Admin
              </span>
            )}
          </span>
          <Button
            variant="outline"
            onClick={handleLogout}
            size="sm"
            className="text-sm sm:text-base"
          >
            Sign Out
          </Button>
        </>
      ) : (
        <>
          <Button
            onClick={() => setDialog("login")}
            size="sm"
            className="text-sm sm:text-base"
          >
            Login
          </Button>
          <Button
            variant="secondary"
            onClick={() => setDialog("register")}
            size="sm"
            className="text-sm sm:text-base"
          >
            Sign Up
          </Button>

          <Dialog
            open={dialog === "login"}
            onOpenChange={() => setDialog(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Login to your account</DialogTitle>
              </DialogHeader>
              {renderForm("login")}
            </DialogContent>
          </Dialog>

          <Dialog
            open={dialog === "register"}
            onOpenChange={() => setDialog(null)}
          >
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create new account</DialogTitle>
              </DialogHeader>
              {renderForm("register")}
            </DialogContent>
          </Dialog>
        </>
      )}
    </div>
  );
}
