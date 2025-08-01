import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Users, 
  Settings, 
  BarChart3, 
  Shield, 
  Check, 
  X, 
  Ban, 
  Trash2, 
  Eye,
  AlertTriangle,
  Activity,
  UserCheck,
  Clock,
  ArrowLeft
} from "lucide-react";
import { useState } from "react";

export default function AdminPanel() {
  const navigate = useNavigate();
  
  // Static data for events
  const [events, setEvents] = useState([
    {
      id: 1,
      title: "Tech Innovation Summit 2024",
      organizer: "Tech Club",
      date: "March 15, 2024",
      status: "pending",
      category: "Technology",
      attendees: 150,
      maxSeats: 200
    },
    {
      id: 2,
      title: "Annual Cultural Festival",
      organizer: "Cultural Committee",
      date: "March 22, 2024",
      status: "approved",
      category: "Cultural",
      attendees: 500,
      maxSeats: 500
    },
    {
      id: 3,
      title: "Career Fair Spring 2024",
      organizer: "Career Services",
      date: "April 5, 2024",
      status: "approved",
      category: "Career",
      attendees: 300,
      maxSeats: 400
    },
    {
      id: 4,
      title: "Unauthorized Party Event",
      organizer: "Anonymous User",
      date: "March 10, 2024",
      status: "pending",
      category: "Entertainment",
      attendees: 25,
      maxSeats: 100
    },
    {
      id: 5,
      title: "AI Workshop Series",
      organizer: "CS Department",
      date: "April 15, 2024",
      status: "rejected",
      category: "Education",
      attendees: 0,
      maxSeats: 50
    }
  ]);

  // Static data for users
  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Ronak Bhambu",
      email: "ronak@college.edu",
      role: "organizer",
      status: "active",
      joinDate: "Jan 2024",
      eventsCreated: 3,
      avatar: "/placeholder.svg"
    },
    {
      id: 2,
      name: "Sarah Johnson",
      email: "sarah@college.edu",
      role: "participant",
      status: "active",
      joinDate: "Feb 2024",
      eventsCreated: 0,
      avatar: "/placeholder.svg"
    },
    {
      id: 3,
      name: "Mike Chen",
      email: "mike@college.edu",
      role: "organizer",
      status: "active",
      joinDate: "Dec 2023",
      eventsCreated: 5,
      avatar: "/placeholder.svg"
    },
    {
      id: 4,
      name: "Anonymous User",
      email: "anon@college.edu",
      role: "participant",
      status: "flagged",
      joinDate: "Mar 2024",
      eventsCreated: 1,
      avatar: "/placeholder.svg"
    },
    {
      id: 5,
      name: "Lisa Rodriguez",
      email: "lisa@college.edu",
      role: "participant",
      status: "banned",
      joinDate: "Jan 2024",
      eventsCreated: 0,
      avatar: "/placeholder.svg"
    }
  ]);

  // Statistics
  const stats = {
    totalUsers: users.length,
    activeUsers: users.filter(u => u.status === "active").length,
    totalEvents: events.length,
    pendingEvents: events.filter(e => e.status === "pending").length,
    approvedEvents: events.filter(e => e.status === "approved").length,
    rejectedEvents: events.filter(e => e.status === "rejected").length
  };

  const handleEventAction = (eventId: number, action: 'approve' | 'reject') => {
    setEvents(prev => prev.map(event => 
      event.id === eventId 
        ? { ...event, status: action === 'approve' ? 'approved' : 'rejected' }
        : event
    ));
  };

  const handleUserAction = (userId: number, action: 'ban' | 'delete') => {
    if (action === 'delete') {
      setUsers(prev => prev.filter(user => user.id !== userId));
    } else {
      setUsers(prev => prev.map(user => 
        user.id === userId 
          ? { ...user, status: user.status === 'banned' ? 'active' : 'banned' }
          : user
      ));
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "active":
        return "bg-green-100 text-green-800";
      case "banned":
        return "bg-red-100 text-red-800";
      case "flagged":
        return "bg-orange-100 text-orange-800";
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
              <Link to="/dashboard" className="text-gray-700 hover:text-indigo-600 font-medium">Dashboard</Link>
              <Link to="/admin-panel" className="text-indigo-600 font-medium border-b-2 border-indigo-600">Admin</Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Badge className="bg-red-100 text-red-800">
                <Shield className="w-3 h-3 mr-1" />
                Admin
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
        </div>

        {/* Page Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 flex items-center">
            <Shield className="w-8 h-8 mr-3 text-indigo-600" />
            Admin Panel
          </h1>
          <p className="text-gray-600">
            Manage events, users, and monitor system activity
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 mb-8">
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Users className="w-5 h-5 text-blue-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <UserCheck className="w-5 h-5 text-green-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Active Users</p>
                  <p className="text-xl font-bold text-gray-900">{stats.activeUsers}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-purple-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Total Events</p>
                  <p className="text-xl font-bold text-gray-900">{stats.totalEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-yellow-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-xl font-bold text-gray-900">{stats.pendingEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <Check className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-xl font-bold text-gray-900">{stats.approvedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-4">
              <div className="flex items-center">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-xl font-bold text-gray-900">{stats.rejectedEvents}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content with Tabs */}
        <Tabs defaultValue="events" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="events">Events</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          {/* Events Tab */}
          <TabsContent value="events" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Event Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Event</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Organizer</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Date</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Attendees</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {events.map((event) => (
                        <tr key={event.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div>
                              <div className="font-medium text-gray-900">{event.title}</div>
                              <div className="text-sm text-gray-500">{event.category}</div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{event.organizer}</td>
                          <td className="py-4 px-4 text-gray-700">{event.date}</td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(event.status)}>
                              {event.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-700">
                            {event.attendees}/{event.maxSeats}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => navigate(`/event-details/${event.id}`)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {event.status === 'pending' && (
                                <>
                                  <Button
                                    size="sm"
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => handleEventAction(event.id, 'approve')}
                                  >
                                    <Check className="w-4 h-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="destructive"
                                    onClick={() => handleEventAction(event.id, 'reject')}
                                  >
                                    <X className="w-4 h-4" />
                                  </Button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Users Tab */}
          <TabsContent value="users" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Users className="w-5 h-5 mr-2" />
                  User Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-700">User</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Email</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Role</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Events</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-gray-50">
                          <td className="py-4 px-4">
                            <div className="flex items-center space-x-3">
                              <Avatar className="w-8 h-8">
                                <AvatarImage src={user.avatar} />
                                <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div>
                                <div className="font-medium text-gray-900">{user.name}</div>
                                <div className="text-sm text-gray-500">Joined {user.joinDate}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{user.email}</td>
                          <td className="py-4 px-4">
                            <Badge className={user.role === 'organizer' ? 'bg-blue-100 text-blue-800' : 'bg-gray-100 text-gray-800'}>
                              {user.role}
                            </Badge>
                          </td>
                          <td className="py-4 px-4">
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </td>
                          <td className="py-4 px-4 text-gray-700">{user.eventsCreated}</td>
                          <td className="py-4 px-4">
                            <div className="flex space-x-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className={user.status === 'banned' ? 'border-green-500 text-green-600 hover:bg-green-50' : 'border-orange-500 text-orange-600 hover:bg-orange-50'}
                                onClick={() => handleUserAction(user.id, 'ban')}
                              >
                                {user.status === 'banned' ? 'Unban' : <Ban className="w-4 h-4" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleUserAction(user.id, 'delete')}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardHeader>
                <CardTitle className="text-xl font-semibold flex items-center">
                  <Settings className="w-5 h-5 mr-2" />
                  System Settings
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">Event Settings</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <Calendar className="w-4 h-4 mr-2" />
                        Auto-approve Events
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Users className="w-4 h-4 mr-2" />
                        Default Max Capacity
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Clock className="w-4 h-4 mr-2" />
                        Event Duration Limits
                      </Button>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900">User Settings</h3>
                    <div className="space-y-3">
                      <Button variant="outline" className="w-full justify-start">
                        <UserCheck className="w-4 h-4 mr-2" />
                        Registration Settings
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <Shield className="w-4 h-4 mr-2" />
                        Permission Management
                      </Button>
                      <Button variant="outline" className="w-full justify-start">
                        <AlertTriangle className="w-4 h-4 mr-2" />
                        Content Moderation
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="border-t pt-6">
                  <h3 className="font-semibold text-gray-900 mb-4">System Actions</h3>
                  <div className="flex space-x-4">
                    <Button variant="outline">
                      <BarChart3 className="w-4 h-4 mr-2" />
                      Export Reports
                    </Button>
                    <Button variant="outline">
                      <Activity className="w-4 h-4 mr-2" />
                      System Logs
                    </Button>
                    <Button variant="destructive">
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Emergency Shutdown
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
