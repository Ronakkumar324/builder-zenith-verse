import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Plus,
  LogOut,
  Settings,
  Bell,
  UserCheck,
  BarChart3,
  Star,
  ArrowRight
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  // Simulate user data - in a real app this would come from auth context
  const [user] = useState({
    name: "Ronak",
    email: "ronak@college.edu",
    role: "organizer", // Can be "participant" or "organizer"
    avatar: "/placeholder.svg"
  });

  const registeredEvents = [
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      date: "March 15, 2024",
      time: "10:00 AM",
      location: "Main Auditorium",
      status: "upcoming",
      category: "Technology",
      attendees: 150,
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "Annual Cultural Festival",
      date: "March 22, 2024",
      time: "6:00 PM",
      location: "College Grounds",
      status: "upcoming",
      category: "Cultural",
      attendees: 500,
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Web Development Workshop",
      date: "March 8, 2024",
      time: "2:00 PM",
      location: "Computer Lab",
      status: "completed",
      category: "Education",
      attendees: 45,
      image: "/placeholder.svg"
    }
  ];

  const organizedEvents = [
    {
      id: 4,
      title: "AI & Machine Learning Seminar",
      date: "April 12, 2024",
      time: "11:00 AM",
      location: "Conference Hall",
      status: "upcoming",
      category: "Technology",
      registrations: 89,
      capacity: 120,
      image: "/placeholder.svg"
    },
    {
      id: 5,
      title: "Spring Career Fair",
      date: "April 18, 2024",
      time: "9:00 AM",
      location: "Student Center",
      status: "upcoming",
      category: "Career",
      registrations: 234,
      capacity: 300,
      image: "/placeholder.svg"
    }
  ];

  const handleLogout = () => {
    // Simulate logout
    navigate("/");
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </Link>
            <nav className="hidden md:flex items-center space-x-8">
              <Link to="/" className="text-gray-700 hover:text-indigo-600 font-medium">Home</Link>
              <Link to="/events" className="text-gray-700 hover:text-indigo-600 font-medium">Events</Link>
              <Link to="/dashboard" className="text-indigo-600 font-medium border-b-2 border-indigo-600">Dashboard</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src={user.avatar} />
                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Greeting Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome, {user.name}! 👋
              </h1>
              <p className="text-gray-600 flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                {user.role === "organizer" ? "Event Organizer" : "Event Participant"}
              </p>
            </div>
            <div className="mt-4 sm:mt-0 flex items-center space-x-3">
              {user.role === "organizer" && (
                <Link to="/create-event">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
              <Button 
                variant="outline" 
                onClick={handleLogout}
                className="border-red-200 text-red-600 hover:bg-red-50"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-gray-600">Registered Events</p>
                  <p className="text-2xl font-bold text-gray-900">{registeredEvents.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.role === "organizer" && (
            <>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <BarChart3 className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Events Organized</p>
                      <p className="text-2xl font-bold text-gray-900">{organizedEvents.length}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Total Registrations</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {organizedEvents.reduce((sum, event) => sum + event.registrations, 0)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "participant" && (
            <>
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <Star className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Events Attended</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {registeredEvents.filter(e => e.status === "completed").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-gray-600">Upcoming</p>
                      <p className="text-2xl font-bold text-gray-900">
                        {registeredEvents.filter(e => e.status === "upcoming").length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="registered" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2 lg:grid-cols-3">
            <TabsTrigger value="registered">My Events</TabsTrigger>
            {user.role === "organizer" && (
              <TabsTrigger value="organized">Organized</TabsTrigger>
            )}
            <TabsTrigger value="profile">Profile</TabsTrigger>
          </TabsList>

          {/* Registered Events Tab */}
          <TabsContent value="registered" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">My Registered Events</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {registeredEvents.map((event) => (
                    <Card key={event.id} className="hover:shadow-lg transition-shadow">
                      <div className="relative">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-t-lg"
                        />
                        <Badge className={`absolute top-3 right-3 ${getStatusColor(event.status)}`}>
                          {event.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                        <div className="space-y-1 text-sm text-gray-600 mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2" />
                            {event.location}
                          </div>
                        </div>
                        <Link to={`/event-details/${event.id}`}>
                          <Button variant="outline" size="sm" className="w-full">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2" />
                          </Button>
                        </Link>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Organized Events Tab (Only for Organizers) */}
          {user.role === "organizer" && (
            <TabsContent value="organized" className="space-y-6">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="text-xl font-semibold">Events I'm Organizing</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedEvents.map((event) => (
                      <Card key={event.id} className="hover:shadow-lg transition-shadow">
                        <div className="relative">
                          <img
                            src={event.image}
                            alt={event.title}
                            className="w-full h-32 object-cover rounded-t-lg"
                          />
                          <Badge className="absolute top-3 right-3 bg-green-100 text-green-800">
                            Organizing
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold text-gray-900 mb-2">{event.title}</h3>
                          <div className="space-y-1 text-sm text-gray-600 mb-3">
                            <div className="flex items-center">
                              <Calendar className="w-4 h-4 mr-2" />
                              {event.date}
                            </div>
                            <div className="flex items-center">
                              <Clock className="w-4 h-4 mr-2" />
                              {event.time}
                            </div>
                            <div className="flex items-center">
                              <Users className="w-4 h-4 mr-2" />
                              {event.registrations}/{event.capacity} registered
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              Edit
                            </Button>
                            <Button size="sm" className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600">
                              Manage
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          )}

          {/* Profile Tab */}
          <TabsContent value="profile" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge className="mt-1 bg-indigo-100 text-indigo-800">
                      {user.role === "organizer" ? "Event Organizer" : "Event Participant"}
                    </Badge>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline">Edit Profile</Button>
                  <Button variant="outline">Change Password</Button>
                  <Button variant="outline">Notification Settings</Button>
                  <Button variant="outline">Privacy Settings</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
