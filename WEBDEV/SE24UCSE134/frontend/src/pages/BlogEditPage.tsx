import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, ArrowLeft } from "lucide-react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

interface Blog {
  id?: number;
  title: string;
  content: string;
  posted: boolean;
}

export default function BlogEditPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const id = searchParams.get("id"); // blogs/:id

  const [form, setForm] = useState<Blog>({
    title: "",
    content: "",
    posted: false,
  });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(!!id);

  useEffect(() => {
    if (id) {
      const fetchBlog = async () => {
        try {
          const res = await api.get(`/api/blogs/${id}`);
          setForm({
            id: res.data.id,
            title: res.data.title,
            content: res.data.content,
            posted: res.data.posted,
          });
        } catch (err) {
          console.error("Failed to fetch blog:", err);
          toast.error("Failed to load blog");
          navigate("/blogs");
        } finally {
          setLoading(false);
        }
      };
      fetchBlog();
    }
  }, [id, navigate]);

  const handleSubmit = async () => {
    if (!form.title.trim() || !form.content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSaving(true);
      if (id) {
        await api.put(`/api/blogs/${id}`, {
          title: form.title.trim(),
          content: form.content,
          posted: form.posted,
        });
        toast.success("Blog updated successfully!");
      } else {
        await api.post("/api/blogs", {
          title: form.title.trim(),
          content: form.content,
          posted: form.posted,
        });
        toast.success("Blog created successfully!");
      }
      navigate("/blogs");
    } catch (err: any) {
      console.error(
        id ? "Failed to update blog" : "Failed to create blog",
        err
      );
      toast.error(id ? "Failed to update blog" : "Failed to create blog", {
        description: err.response?.data?.message || "Please try again",
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-muted-foreground">Loading blog...</div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="outline"
          size="icon"
          onClick={() => navigate("/blogs")}
          className="flex-shrink-0"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <h1 className="text-2xl font-bold">
          {id ? "Edit Blog" : "Create New Blog"}
        </h1>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="title">Title *</Label>
          <Input
            id="title"
            placeholder="Enter blog title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="content">Content *</Label>
          <div className="min-h-[400px] h-[60vh]">
            <ReactQuill
              theme="snow"
              value={form.content}
              onChange={(value) => setForm({ ...form, content: value })}
              className="[&_.ql-toolbar]:bg-neutral-400 [&_.ql-toolbar]:border-gray-200 [&_.ql-toolbar]:rounded-t-lg
                           [&_.ql-container]:border-gray-200 [&_.ql-container]:rounded-b-lg
                           [&_.ql-editor]:min-h-[300px]
                           [&_.ql-toolbar_button]:text-gray-600 hover:[&_.ql-toolbar_button]:text-gray-900
                           [&_.ql-active]:text-gray-900 [&_.ql-active]:bg-gray-200
                           [&_.ql-picker-label]:text-gray-600 [&_.ql-picker-options]:bg-gray-50
                           [&_.ql-picker-options]:border-gray-200 [&_.ql-picker-item]:text-gray-700
                           h-full"
              style={{ height: "calc(100% - 42px)" }}
              modules={{
                toolbar: [
                  [{ header: [1, 2, 3, false] }],
                  ["bold", "italic", "underline", "strike"],
                  [{ color: [] }, { background: [] }],
                  [{ list: "ordered" }, { list: "bullet" }],
                  [{ indent: "-1" }, { indent: "+1" }],
                  ["blockquote", "code-block"],
                  ["link", "image"],
                  ["clean"],
                ],
              }}
              formats={[
                "header",
                "bold",
                "italic",
                "underline",
                "strike",
                "list",
                "bullet",
                "indent",
                "link",
                "image",
                "color",
                "background",
                "blockquote",
                "code-block",
                "clean",
              ]}
            />
          </div>
        </div>

        <div className="flex items-center space-x-4 pt-4">
          <Button
            variant={form.posted ? "default" : "outline"}
            onClick={() => setForm({ ...form, posted: !form.posted })}
            className="flex items-center gap-2"
          >
            {form.posted ? (
              <>
                <Eye className="w-4 h-4" />
                <span>Published</span>
              </>
            ) : (
              <>
                <EyeOff className="w-4 h-4" />
                <span>Save as Draft</span>
              </>
            )}
          </Button>
          <span className="text-sm text-muted-foreground">
            {form.posted
              ? "Will be visible to everyone"
              : "Only you can see this"}
          </span>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => navigate("/blogs")}
            className="flex-1"
            disabled={saving}
          >
            Cancel
          </Button>
          <Button onClick={handleSubmit} className="flex-1" disabled={saving}>
            {saving ? "Saving..." : id ? "Update Blog" : "Create Blog"}
          </Button>
        </div>
      </div>
    </div>
  );
}
