import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  PlusIcon,
  CalendarIcon,
  MapPinIcon,
  UserIcon,
  Trash2,
  Edit,
} from "lucide-react";

interface Event {
  id: number;
  title: string;
  desc: string;
  location: string;
  date: string;
  userId: number;
  User?: { name: string };
}

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [open, setOpen] = useState(false);
  const [editEventId, setEditEventId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [form, setForm] = useState({
    name: "",
    description: "",
    location: "",
    date: "",
    time: "",
  });

  const fetchEvents = async () => {
    try {
      setLoading(true);
      const res = await api.get("/api/events");
      setEvents(res.data.events || res.data);
    } catch (err: any) {
      console.error("Failed to fetch events:", err);
      if (err.response?.status === 401) {
        toast.error("Please login to view events");
      } else {
        toast.error("Failed to fetch events");
      }
      setEvents([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await api.get("/api/auth/me");
      setCurrentUserId(res.data.userId);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUserId(null);
    }
  };

  const handleCreate = async () => {
    if (!form.name.trim() || !form.description.trim() || !form.date) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setCreating(true);
      const dateTime = form.time
        ? `${form.date}T${form.time}:00.000Z`
        : `${form.date}T00:00:00.000Z`;

      await api.post("/api/events", {
        title: form.name.trim(),
        desc: form.description.trim(),
        location: form.location.trim() || undefined,
        date: dateTime,
      });

      toast.success("Event created successfully!");
      resetForm();
      setOpen(false);
      fetchEvents();
    } catch (err: any) {
      console.error("Failed to create event:", err);
      toast.error("Failed to create event", {
        description:
          err.response?.data?.message ||
          "Please check your input and try again",
      });
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async () => {
    if (
      !editEventId ||
      !form.name.trim() ||
      !form.description.trim() ||
      !form.date
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setUpdating(true);
      const dateTime = form.time
        ? `${form.date}T${form.time}:00.000Z`
        : `${form.date}T00:00:00.000Z`;

      await api.put(`/api/events/${editEventId}`, {
        title: form.name.trim(),
        desc: form.description.trim(),
        location: form.location.trim() || undefined,
        date: dateTime,
      });

      toast.success("Event updated successfully!");
      resetForm();
      setOpen(false);
      fetchEvents();
    } catch (err: any) {
      console.error("Failed to update event:", err);
      toast.error("Failed to update event", {
        description:
          err.response?.data?.message ||
          "Please check your input and try again",
      });
    } finally {
      setUpdating(false);
    }
  };

  const handleDelete = async (eventId: number) => {
    try {
      setDeleting(true);
      await api.delete(`/api/events/${eventId}`);
      toast.success("Event deleted successfully!");
      fetchEvents();
    } catch (err: any) {
      console.error("Failed to delete event:", err);
      toast.error("Failed to delete event");
    } finally {
      setDeleting(false);
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      location: "",
      date: "",
      time: "",
    });
    setEditEventId(null);
  };

  const prepareEditForm = (event: Event) => {
    const dateObj = new Date(event.date);
    const date = dateObj.toISOString().split("T")[0];
    const time = dateObj.toTimeString().substring(0, 5);

    setForm({
      name: event.title,
      description: event.desc,
      location: event.location,
      date,
      time,
    });
    setEditEventId(event.id);
    setOpen(true);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        weekday: "short",
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  useEffect(() => {
    fetchEvents();
    if (isAuthenticated()) {
      fetchCurrentUser();
    }
  }, []);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Events</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading events...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Events</h1>
        {isAuthenticated() && (
          <Button
            onClick={() => {
              resetForm();
              setOpen(true);
            }}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Event
          </Button>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center">
          <CalendarIcon className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No events found</h3>
          <p className="text-muted-foreground mb-4">
            {isAuthenticated()
              ? "Be the first to create an event!"
              : "Please login to view and create events."}
          </p>
          {isAuthenticated() && (
            <Button
              onClick={() => {
                resetForm();
                setOpen(true);
              }}
            >
              <PlusIcon className="w-4 h-4 mr-2" />
              Create First Event
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => {
            const isOwner = currentUserId === event.userId;

            return (
              <Card
                key={event.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="space-y-3 p-6">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg line-clamp-2">
                      {event.title}
                    </CardTitle>
                    {isOwner && isAuthenticated() && (
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => prepareEditForm(event)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDelete(event.id)}
                          disabled={deleting}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <p className="text-muted-foreground text-sm line-clamp-3">
                    {event.desc}
                  </p>

                  <div className="space-y-2 text-sm text-muted-foreground">
                    <div className="flex items-center gap-2">
                      <CalendarIcon className="w-4 h-4" />
                      <span>{formatDate(event.date)}</span>
                    </div>

                    {event.location && (
                      <div className="flex items-center gap-2">
                        <MapPinIcon className="w-4 h-4" />
                        <span>{event.location}</span>
                      </div>
                    )}

                    {event.User && (
                      <div className="flex items-center gap-2">
                        <UserIcon className="w-4 h-4" />
                        <span>By: {event.User.name}</span>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      <Dialog
        open={open}
        onOpenChange={(isOpen) => {
          if (!isOpen) {
            resetForm();
            setOpen(false);
          }
        }}
      >
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editEventId ? "Edit Event" : "Create New Event"}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="name">Event Name *</Label>
              <Input
                id="name"
                placeholder="Enter event name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Description *</Label>
              <Input
                id="description"
                placeholder="Enter event description"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>

            <div>
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                placeholder="Enter event location"
                value={form.location}
                onChange={(e) => setForm({ ...form, location: e.target.value })}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="date">Date *</Label>
                <Input
                  id="date"
                  type="date"
                  value={form.date}
                  onChange={(e) => setForm({ ...form, date: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="time">Time</Label>
                <Input
                  id="time"
                  type="time"
                  value={form.time}
                  onChange={(e) => setForm({ ...form, time: e.target.value })}
                />
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <Button
                variant="outline"
                onClick={() => {
                  resetForm();
                  setOpen(false);
                }}
                className="flex-1"
                disabled={creating || updating}
              >
                Cancel
              </Button>
              <Button
                onClick={editEventId ? handleUpdate : handleCreate}
                className="flex-1"
                disabled={creating || updating}
              >
                {creating
                  ? "Creating..."
                  : updating
                    ? "Updating..."
                    : editEventId
                      ? "Update Event"
                      : "Create Event"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
