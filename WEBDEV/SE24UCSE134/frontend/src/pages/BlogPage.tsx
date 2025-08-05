import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  PlusIcon,
  Trash2,
  Edit,
  BookOpen,
  Eye,
  EyeOff,
  Home,
} from "lucide-react";

interface Blog {
  id: number;
  title: string;
  content: string;
  posted: boolean;
  createdAt: string;
  updatedAt: string;
  authorId: number;
  User?: { name: string };
}

export default function BlogPage() {
  const navigate = useNavigate();
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [publishedBlogs, setPublishedBlogs] = useState<Blog[]>([]);
  const [unpublishedBlogs, setUnpublishedBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const publicRes = await api.get("/api/blogs");
      const publicBlogs = publicRes.data.blogs || publicRes.data;

      let myBlogs: Blog[] = [];
      if (isAuthenticated()) {
        try {
          const myRes = await api.get("/api/blogs/me");
          myBlogs = Array.isArray(myRes.data) ? myRes.data : [];
        } catch (err) {
          console.error("Failed to fetch user blogs:", err);
        }
      }

      const allBlogs = [...publicBlogs, ...myBlogs];
      const uniqueBlogs = allBlogs.filter(
        (blog, index, self) => index === self.findIndex((b) => b.id === blog.id)
      );

      setBlogs(uniqueBlogs);
      setPublishedBlogs(uniqueBlogs.filter((blog) => blog.posted));
      setUnpublishedBlogs(
        uniqueBlogs.filter(
          (blog) => !blog.posted && blog.authorId === currentUserId
        )
      );
    } catch (err: any) {
      console.error("Failed to fetch blogs:", err);
      toast.error("Failed to fetch blogs");
      setBlogs([]);
      setPublishedBlogs([]);
      setUnpublishedBlogs([]);
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

  const handleDelete = async (blogId: number) => {
    try {
      setDeletingId(blogId);
      await api.delete(`/api/blogs/${blogId}`);
      toast.success("Blog deleted successfully!");
      fetchBlogs();
    } catch (err: any) {
      console.error("Failed to delete blog:", err);
      toast.error("Failed to delete blog");
    } finally {
      setDeletingId(null);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    } catch {
      return "Invalid date";
    }
  };

  const isAuthenticated = () => {
    return !!localStorage.getItem("token");
  };

  const createPreview = (content: string, maxLength: number = 150) => {
    const textContent = content
      .replace(/<[^>]*>/g, "")
      .replace(/&nbsp;/g, " ")
      .replace(/&amp;/g, "&")
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&quot;/g, '"')
      .trim();

    if (textContent.length <= maxLength) return textContent;

    const cutoff = textContent.lastIndexOf(" ", maxLength);
    return textContent.substring(0, cutoff > 0 ? cutoff : maxLength) + "...";
  };

  const handleCreate = () => {
    navigate("/blogs/edit");
  };

  const handleEdit = (blog: Blog) => {
    navigate(`/blogs/edit?id=${blog.id}`);
  };

  const renderBlogCard = (blog: Blog) => {
    const isOwner = currentUserId === blog.authorId;
    const previewContent = createPreview(blog.content);

    return (
      <Card
        key={blog.id}
        className={`hover:shadow-md transition-shadow h-full flex flex-col ${
          !blog.posted ? "border-red-300 dark:border-red-700" : ""
        }`}
      >
        <CardContent className="space-y-3 p-4 sm:p-6 flex flex-col flex-grow">
          <div className="flex justify-between items-start gap-2">
            <CardTitle className="text-lg leading-tight break-words flex-1 min-w-0">
              {blog.title}
              {!blog.posted && (
                <span className="ml-2 text-xs text-red-500 font-normal">
                  (Draft)
                </span>
              )}
            </CardTitle>
            {isOwner && isAuthenticated() && (
              <div className="flex gap-1 flex-shrink-0">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(blog)}
                  className="h-8 w-8 p-0"
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(blog.id)}
                  disabled={deletingId === blog.id}
                  className="h-8 w-8 p-0"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          <div className="text-muted-foreground text-sm leading-relaxed break-words flex-grow">
            {previewContent}
          </div>

          <div className="flex items-center justify-between text-sm text-muted-foreground gap-2 mt-2">
            <span className="flex-shrink-0">{formatDate(blog.createdAt)}</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(`/blogs/${blog.id}`)}
              className="flex-shrink-0"
            >
              Read More
            </Button>
          </div>

          {blog.User && (
            <div className="text-sm text-muted-foreground break-words mt-2">
              <span>By: {blog.User.name}</span>
            </div>
          )}
        </CardContent>
      </Card>
    );
  };

  useEffect(() => {
    if (isAuthenticated()) {
      fetchCurrentUser();
    }
    fetchBlogs();
  }, [currentUserId]);

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Blogs</h1>
        </div>
        <div className="flex justify-center items-center h-64">
          <div className="text-muted-foreground">Loading blogs...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => navigate("/")}
          >
            <Home className="w-5 h-5" />
          </Button>
          <h1 className="text-2xl font-bold">Blogs</h1>
        </div>
        {isAuthenticated() && (
          <Button onClick={handleCreate} className="w-full sm:w-auto">
            <PlusIcon className="w-4 h-4 mr-2" />
            Create Blog
          </Button>
        )}
      </div>

      {blogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 text-center px-4">
          <BookOpen className="w-12 h-12 text-muted-foreground mb-4" />
          <h3 className="text-lg font-semibold mb-2">No blogs found</h3>
          <p className="text-muted-foreground mb-4 max-w-md">
            {isAuthenticated()
              ? "Be the first to create a blog!"
              : "Please login to view and create blogs."}
          </p>
          {isAuthenticated() && (
            <Button onClick={handleCreate} className="w-full sm:w-auto">
              <PlusIcon className="w-4 h-4 mr-2" />
              Create First Blog
            </Button>
          )}
        </div>
      ) : (
        <>
          {publishedBlogs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <Eye className="w-5 h-5" /> Published Blogs
              </h2>
              <div className="relative">
                <div className="overflow-x-auto pb-4">
                  <div className="flex space-x-4 w-max min-w-full">
                    {publishedBlogs.map((blog) => (
                      <div key={blog.id} className="w-72 flex-shrink-0">
                        {renderBlogCard(blog)}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {isAuthenticated() && unpublishedBlogs.length > 0 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold flex items-center gap-2">
                <EyeOff className="w-5 h-5" /> My Drafts
                <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded-full">
                  {unpublishedBlogs.length}
                </span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {unpublishedBlogs.map((blog) => (
                  <div key={blog.id} className="h-full">
                    {renderBlogCard(blog)}
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
