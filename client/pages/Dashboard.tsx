import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ThemeToggle } from "@/components/ui/theme-toggle";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
  ArrowRight,
  User,
  Palette,
  Shield,
  HelpCircle,
} from "lucide-react";
import { useState } from "react";

export default function Dashboard() {
  const navigate = useNavigate();
  // Simulate user data - in a real app this would come from auth context
  const [user] = useState({
    name: "Ronak",
    email: "ronak@college.edu",
    role: "organizer", // Can be "participant" or "organizer"
    avatar: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
    },
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
      image: "/placeholder.svg",
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
      image: "/placeholder.svg",
    },
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
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-indigo-900 transition-colors duration-500">
      {/* Background Pattern */}
      <div className="fixed inset-0 bg-grid-slate-100 dark:bg-grid-dark [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:[mask-image:linear-gradient(0deg,black,rgba(0,0,0,0.6))] -z-10" />

      {/* Header */}
      <header className="navbar-glass sticky top-0 z-50">
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
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Events
              </Link>
              <Link
                to="/dashboard"
                className="text-indigo-600 font-medium border-b-2 border-indigo-600"
              >
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="hover:bg-muted/80 relative">
                    <Bell className="w-5 h-5" />
                    <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-bold">2</span>
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-4 border-b">
                    <h3 className="font-semibold text-lg">Notifications</h3>
                  </div>
                  <div className="max-h-96 overflow-y-auto">
                    <DropdownMenuItem className="p-4 hover:bg-muted cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">New event registration</p>
                          <p className="text-xs text-muted-foreground">Someone registered for your Tech Summit event</p>
                          <p className="text-xs text-muted-foreground mt-1">2 hours ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                    <DropdownMenuItem className="p-4 hover:bg-muted cursor-pointer">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Event reminder</p>
                          <p className="text-xs text-muted-foreground">Your Cultural Festival is tomorrow</p>
                          <p className="text-xs text-muted-foreground mt-1">1 day ago</p>
                        </div>
                      </div>
                    </DropdownMenuItem>
                  </div>
                  <div className="p-2 border-t">
                    <Button variant="ghost" className="w-full text-sm">View all notifications</Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="hover:bg-muted/80"
                  >
                    <Settings className="w-5 h-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Palette className="mr-2 h-4 w-4" />
                    <span>Appearance</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Shield className="mr-2 h-4 w-4" />
                    <span>Privacy & Security</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <HelpCircle className="mr-2 h-4 w-4" />
                    <span>Help & Support</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
                    <Avatar className="w-8 h-8 ring-2 ring-background shadow-lg cursor-pointer hover:ring-primary transition-all">
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white font-medium">
                        {user.name.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-64">
                  <div className="p-4 border-b">
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={user.avatar} />
                        <AvatarFallback className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
                          {user.name.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1">
                        <p className="font-semibold">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        <Badge className="mt-1 bg-indigo-100 text-indigo-800 text-xs">
                          {user.role === "organizer" ? "Event Organizer" : "Participant"}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <DropdownMenuItem>
                    <User className="mr-2 h-4 w-4" />
                    <span>View Profile</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="mr-2 h-4 w-4" />
                    <span>Account Settings</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Bell className="mr-2 h-4 w-4" />
                    <span>Notifications</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Sign Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
                Welcome, {user.name}! ���
              </h1>
              <p className="text-gray-600 flex items-center">
                <UserCheck className="w-4 h-4 mr-2" />
                {user.role === "organizer"
                  ? "Event Organizer"
                  : "Event Participant"}
              </p>
            </div>
            <div className="mt-4 sm:mt-0">
              {user.role === "organizer" && (
                <Link to="/create-event">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Event
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid-cards mb-8">
          <Card className="card-elevated group hover:scale-105 transition-all duration-300 animate-fade-in">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                  <Calendar className="w-6 h-6 text-white" />
                </div>
                <div className="ml-4">
                  <p className="text-sm text-muted-foreground">
                    Registered Events
                  </p>
                  <p className="text-2xl font-bold text-foreground">
                    {registeredEvents.length}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {user.role === "organizer" && (
            <>
              <Card
                className="card-elevated group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                      <BarChart3 className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">
                        Events Organized
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {organizedEvents.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="card-elevated group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-purple transition-all duration-300">
                      <Users className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">
                        Total Registrations
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {organizedEvents.reduce(
                          (sum, event) => sum + event.registrations,
                          0,
                        )}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {user.role === "participant" && (
            <>
              <Card
                className="card-elevated group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow transition-all duration-300">
                      <Star className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">
                        Events Attended
                      </p>
                      <p className="text-2xl font-bold text-foreground">
                        {
                          registeredEvents.filter(
                            (e) => e.status === "completed",
                          ).length
                        }
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card
                className="card-elevated group hover:scale-105 transition-all duration-300 animate-fade-in"
                style={{ animationDelay: "0.2s" }}
              >
                <CardContent className="p-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-glow-purple transition-all duration-300">
                      <Clock className="w-6 h-6 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="text-sm text-muted-foreground">Upcoming</p>
                      <p className="text-2xl font-bold text-foreground">
                        {
                          registeredEvents.filter(
                            (e) => e.status === "upcoming",
                          ).length
                        }
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
            <Card className="card-elevated animate-slide-in-up">
              <CardHeader>
                <CardTitle className="text-xl font-semibold text-gradient-primary">
                  My Registered Events
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid-cards">
                  {registeredEvents.map((event, index) => (
                    <Card
                      key={event.id}
                      className="card-modern group hover:scale-105 animate-fade-in"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="relative overflow-hidden">
                        <img
                          src={event.image}
                          alt={event.title}
                          className="w-full h-32 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                        <Badge
                          className={`absolute top-3 right-3 ${getStatusColor(event.status)} shadow-lg`}
                        >
                          {event.status}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold text-foreground mb-2 group-hover:text-primary transition-colors">
                          {event.title}
                        </h3>
                        <div className="space-y-1 text-sm text-muted-foreground mb-3">
                          <div className="flex items-center">
                            <Calendar className="w-4 h-4 mr-2 text-primary" />
                            {event.date}
                          </div>
                          <div className="flex items-center">
                            <Clock className="w-4 h-4 mr-2 text-primary" />
                            {event.time}
                          </div>
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-primary" />
                            {event.location}
                          </div>
                        </div>
                        <Link to={`/event-details/${event.id}`}>
                          <Button className="w-full btn-primary group-hover:shadow-lg">
                            View Details
                            <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover:translate-x-1" />
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
                  <CardTitle className="text-xl font-semibold">
                    Events I'm Organizing
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {organizedEvents.map((event) => (
                      <Card
                        key={event.id}
                        className="hover:shadow-lg transition-shadow"
                      >
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
                          <h3 className="font-semibold text-gray-900 mb-2">
                            {event.title}
                          </h3>
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
                            <Button
                              variant="outline"
                              size="sm"
                              className="flex-1"
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600"
                            >
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
                <CardTitle className="text-xl font-semibold">
                  Profile Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center space-x-4">
                  <Avatar className="w-20 h-20">
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback className="text-2xl">
                      {user.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="text-lg font-semibold">{user.name}</h3>
                    <p className="text-gray-600">{user.email}</p>
                    <Badge className="mt-1 bg-indigo-100 text-indigo-800">
                      {user.role === "organizer"
                        ? "Event Organizer"
                        : "Event Participant"}
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
