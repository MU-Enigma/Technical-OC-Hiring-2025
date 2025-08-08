import { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { ArrowLeft, Edit, Trash2, Calendar, User } from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  posted: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  User?: {
    id: number;
    name: string;
  };
}

export default function BlogViewPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const isAuthenticated = useCallback(() => {
    return !!localStorage.getItem("token");
  }, []);

  const fetchCurrentUser = useCallback(async () => {
    try {
      const res = await api.get("/api/auth/me");
      setCurrentUserId(res.data.userId);
    } catch (err) {
      console.error("Failed to fetch current user:", err);
      setCurrentUserId(null);
    }
  }, []);

  const fetchBlog = useCallback(async () => {
    if (!id) return;

    try {
      setLoading(true);
      const res = await api.get(`/api/blogs/${id}`);
      setBlog(res.data);
    } catch (err: any) {
      console.error("Failed to fetch blog:", err);
      if (err.response?.status === 404) {
        toast.error("Blog not found");
      } else if (err.response?.status === 403) {
        toast.error("You don't have permission to view this blog");
      } else {
        toast.error("Failed to load blog");
      }
      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  }, [id, navigate]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this blog? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setDeleting(true);
      await api.delete(`/api/blogs/${id}`);
      toast.success("Blog deleted successfully!");
      navigate("/blogs");
    } catch (err: any) {
      console.error("Failed to delete blog:", err);
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
    }
  };

  const handleEdit = () => {
    navigate(`/blogs/edit?id=${id}`);
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "Invalid date";
    }
  };

  useEffect(() => {
    if (!id) return;

    fetchBlog();
    if (isAuthenticated()) {
      fetchCurrentUser();
    }
  }, [id, fetchBlog, fetchCurrentUser, isAuthenticated]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Loading blog...</div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-center px-4">
        <h3 className="text-lg font-semibold mb-2">Blog not found</h3>
        <p className="text-muted-foreground mb-4">
          The blog you're looking for doesn't exist or has been removed.
        </p>
        <Button onClick={() => navigate("/blogs")}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Blogs
        </Button>
      </div>
    );
  }

  const isOwner = currentUserId === blog.authorId;

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Header with navigation and actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Button
          variant="outline"
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Blogs
        </Button>

        {isOwner && isAuthenticated() && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={handleEdit}
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              Edit
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </div>
        )}
      </div>

      {/* Blog content */}
      <Card className="w-full">
        <CardContent className="p-6 sm:p-8">
          {/* Title and status */}
          <div className="space-y-4 mb-6">
            <div className="flex items-start justify-between gap-4">
              <h1 className="text-3xl font-bold leading-tight break-words flex-1 max-w-[calc(100%-50px)]">
                {blog.title}
              </h1>
              {!blog.posted && (
                <span className="bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 px-3 py-1 rounded-full text-sm font-medium flex-shrink-0">
                  Draft
                </span>
              )}
            </div>

            {/* Meta information */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground border-b pb-4">
              {blog.User && (
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4" />
                  <span>By {blog.User.name}</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Published {formatDate(blog.createdAt)}</span>
              </div>
              {blog.updatedAt !== blog.createdAt && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  <span>Updated {formatDate(blog.updatedAt)}</span>
                </div>
              )}
            </div>
          </div>

          {/* Blog content */}
          <div
            className="prose prose-lg max-w-none dark:prose-invert
                       prose-headings:font-semibold
                       prose-a:text-blue-600 dark:prose-a:text-blue-400
                       prose-blockquote:border-l-blue-500 prose-blockquote:bg-blue-50 dark:prose-blockquote:bg-blue-950/30
                       prose-code:bg-gray-100 dark:prose-code:bg-gray-800
                       prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800
                       break-words overflow-hidden
                       prose-p:max-w-[90ch] prose-img:mx-auto prose-img:rounded-lg"
            dangerouslySetInnerHTML={{ __html: blog.content }}
          />
        </CardContent>
      </Card>

      {/* Back to blogs button at bottom */}
      <div className="flex justify-center pt-6">
        <Button
          variant="outline"
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to All Blogs
        </Button>
      </div>
    </div>
  );
}
