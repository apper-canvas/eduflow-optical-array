import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Card from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Input from "@/components/atoms/Input";
import Textarea from "@/components/atoms/Textarea";
import Select from "@/components/atoms/Select";
import Badge from "@/components/atoms/Badge";
import ApperIcon from "@/components/ApperIcon";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import { announcementService } from "@/services/api/announcementService";

const Announcements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState(null);
  
  const [newAnnouncement, setNewAnnouncement] = useState({
    title: "",
    content: "",
    targetAudience: ["students"],
    priority: "medium"
  });

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      setLoading(true);
      setError("");
      
      const announcementsData = await announcementService.getAll();
      // Sort by date created (newest first)
      const sortedAnnouncements = announcementsData.sort((a, b) => 
        new Date(b.dateCreated) - new Date(a.dateCreated)
      );
      setAnnouncements(sortedAnnouncements);
    } catch (err) {
      setError("Failed to load announcements. Please try again.");
      console.error("Error loading announcements:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAnnouncement = async (e) => {
    e.preventDefault();
    
    try {
      const createdAnnouncement = await announcementService.create({
        ...newAnnouncement,
        authorId: 1 // Mock admin user ID
      });
      
      setAnnouncements(prev => [createdAnnouncement, ...prev]);
      setNewAnnouncement({
        title: "",
        content: "",
        targetAudience: ["students"],
        priority: "medium"
      });
      setShowAddModal(false);
      toast.success("Announcement created successfully!");
    } catch (err) {
      toast.error("Failed to create announcement");
      console.error("Error creating announcement:", err);
    }
  };

  const handleEditAnnouncement = (announcement) => {
    setEditingAnnouncement(announcement);
    setNewAnnouncement(announcement);
    setShowAddModal(true);
  };

  const handleUpdateAnnouncement = async (e) => {
    e.preventDefault();
    
    try {
      const updatedAnnouncement = await announcementService.update(
        editingAnnouncement.Id, 
        newAnnouncement
      );
      
      setAnnouncements(prev => prev.map(a => 
        a.Id === editingAnnouncement.Id ? updatedAnnouncement : a
      ));
      
      setNewAnnouncement({
        title: "",
        content: "",
        targetAudience: ["students"],
        priority: "medium"
      });
      setEditingAnnouncement(null);
      setShowAddModal(false);
      toast.success("Announcement updated successfully!");
    } catch (err) {
      toast.error("Failed to update announcement");
      console.error("Error updating announcement:", err);
    }
  };

  const handleDeleteAnnouncement = async (announcement) => {
    if (!confirm("Are you sure you want to delete this announcement?")) {
      return;
    }
    
    try {
      await announcementService.delete(announcement.Id);
      setAnnouncements(prev => prev.filter(a => a.Id !== announcement.Id));
      toast.success("Announcement deleted successfully!");
    } catch (err) {
      toast.error("Failed to delete announcement");
      console.error("Error deleting announcement:", err);
    }
  };

  const getPriorityVariant = (priority) => {
    switch (priority) {
      case "high": return "error";
      case "medium": return "warning";
      case "low": return "info";
      default: return "default";
    }
  };

  const audienceOptions = [
    { value: "students", label: "Students" },
    { value: "parents", label: "Parents" },
    { value: "teachers", label: "Teachers" },
    { value: "all", label: "All" }
  ];

  const priorityOptions = [
    { value: "low", label: "Low Priority" },
    { value: "medium", label: "Medium Priority" },
    { value: "high", label: "High Priority" }
  ];

  if (loading) {
    return <Loading message="Loading announcements..." />;
  }

  if (error) {
    return <Error message={error} onRetry={loadAnnouncements} />;
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Announcements</h1>
          <p className="text-gray-600">Keep your school community informed</p>
        </div>
        <Button onClick={() => setShowAddModal(true)}>
          <ApperIcon name="Megaphone" className="h-4 w-4 mr-2" />
          Create Announcement
        </Button>
      </div>

      {/* Announcements List */}
      {announcements.length === 0 ? (
        <Empty
          title="No announcements yet"
          message="Start by creating your first announcement"
          icon="Megaphone"
          actionText="Create Announcement"
          action={() => setShowAddModal(true)}
        />
      ) : (
        <div className="space-y-4">
          {announcements.map((announcement) => (
            <Card key={announcement.Id} className="hover:shadow-md transition-shadow duration-200">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <h3 className="text-xl font-semibold text-gray-900 flex-1">
                      {announcement.title}
                    </h3>
                    <Badge variant={getPriorityVariant(announcement.priority)}>
                      {announcement.priority} priority
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3 leading-relaxed">
                    {announcement.content}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Calendar" className="h-4 w-4" />
                    {new Date(announcement.dateCreated).toLocaleDateString()}
                  </div>
                  <div className="flex items-center gap-2">
                    <ApperIcon name="Users" className="h-4 w-4" />
                    {announcement.targetAudience.join(", ")}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleEditAnnouncement(announcement)}
                  >
                    <ApperIcon name="Edit" className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="small"
                    onClick={() => handleDeleteAnnouncement(announcement)}
                    className="text-error hover:text-error hover:bg-error/10"
                  >
                    <ApperIcon name="Trash2" className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 pt-4 border-t border-gray-100 text-sm text-gray-500">
                <div className="flex items-center gap-1">
                  <ApperIcon name="Eye" className="h-4 w-4" />
                  <span>142 views</span>
                </div>
                <div className="flex items-center gap-1">
                  <ApperIcon name="MessageCircle" className="h-4 w-4" />
                  <span>8 responses</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {/* Add/Edit Announcement Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-gray-900">
                {editingAnnouncement ? "Edit Announcement" : "Create Announcement"}
              </h2>
              <Button
                variant="ghost"
                onClick={() => {
                  setShowAddModal(false);
                  setEditingAnnouncement(null);
                  setNewAnnouncement({
                    title: "",
                    content: "",
                    targetAudience: ["students"],
                    priority: "medium"
                  });
                }}
              >
                <ApperIcon name="X" className="h-5 w-5" />
              </Button>
            </div>

            <form onSubmit={editingAnnouncement ? handleUpdateAnnouncement : handleAddAnnouncement} className="space-y-4">
              <Input
                label="Title"
                value={newAnnouncement.title}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, title: e.target.value})}
                placeholder="Enter announcement title"
                required
              />
              
              <Textarea
                label="Content"
                value={newAnnouncement.content}
                onChange={(e) => setNewAnnouncement({...newAnnouncement, content: e.target.value})}
                placeholder="Write your announcement content here..."
                rows={6}
                required
              />
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Target Audience
                  </label>
                  <div className="space-y-2">
                    {audienceOptions.map((option) => (
                      <label key={option.value} className="flex items-center gap-2 text-sm">
                        <input
                          type="checkbox"
                          checked={newAnnouncement.targetAudience.includes(option.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                targetAudience: [...newAnnouncement.targetAudience, option.value]
                              });
                            } else {
                              setNewAnnouncement({
                                ...newAnnouncement,
                                targetAudience: newAnnouncement.targetAudience.filter(a => a !== option.value)
                              });
                            }
                          }}
                          className="rounded"
                        />
                        {option.label}
                      </label>
                    ))}
                  </div>
                </div>
                
                <Select
                  label="Priority"
                  options={priorityOptions}
                  value={newAnnouncement.priority}
                  onChange={(e) => setNewAnnouncement({...newAnnouncement, priority: e.target.value})}
                />
              </div>
              
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingAnnouncement(null);
                    setNewAnnouncement({
                      title: "",
                      content: "",
                      targetAudience: ["students"],
                      priority: "medium"
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingAnnouncement ? "Update Announcement" : "Create Announcement"}
                </Button>
              </div>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
};

export default Announcements;