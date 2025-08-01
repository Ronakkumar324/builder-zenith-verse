import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { eventStorage, type Event } from "@/lib/events";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Search,
  Filter,
  ArrowRight,
  UserCheck,
  Star,
  LogIn,
} from "lucide-react";

export default function Events() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [isLoading, setIsLoading] = useState(true);
  const [registeringEvents, setRegisteringEvents] = useState<Set<string>>(
    new Set(),
  );

  const categories = [
    "Technology",
    "Cultural",
    "Career",
    "Education",
    "Sports",
    "Health & Wellness",
    "Entertainment",
    "Social",
    "Professional",
    "Academic",
  ];

  useEffect(() => {
    loadEvents();
  }, []);

  useEffect(() => {
    filterEvents();
  }, [events, searchTerm, selectedCategory]);

  const loadEvents = () => {
    try {
      const activeEvents = eventStorage.getActiveEvents();
      setEvents(activeEvents);
    } catch (error) {
      console.error("Failed to load events:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filterEvents = () => {
    let filtered = events;

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.venue.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.organizer.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter(
        (event) => event.category === selectedCategory,
      );
    }

    setFilteredEvents(filtered);
  };

  const formatDate = (dateString: string) => {
    return eventStorage.formatDate(dateString);
  };

  const getAvailableSeats = (event: Event) => {
    return event.maxSeats - event.attendees;
  };

  const getRegistrationPercentage = (event: Event) => {
    return Math.round((event.attendees / event.maxSeats) * 100);
  };

  const isUserRegistered = (event: Event) => {
    const currentUserEmail = "ronak@college.edu"; // In real app, get from auth context
    return event.registrations.includes(currentUserEmail);
  };

  const handleRegister = async (eventId: string) => {
    // Prevent multiple registrations for the same event
    if (registeringEvents.has(eventId)) return;

    setRegisteringEvents((prev) => new Set(prev).add(eventId));

    try {
      // Simulate API delay for better UX
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // In a real app, you'd get this from auth context
      const currentUser = {
        email: "ronak@college.edu",
        name: "Ronak",
      };

      // Use the event storage registration method
      const success = eventStorage.registerForEvent(eventId, currentUser.email);

      if (success) {
        // Show success message
        alert(
          `✅ Successfully registered for the event! A confirmation has been sent to ${currentUser.email}`,
        );

        // Reload events to show updated registration count
        const updatedEvents = eventStorage.getActiveEvents();
        setEvents(updatedEvents);
      } else {
        // Handle registration failure
        const event = eventStorage.getEventById(eventId);
        if (!event) {
          alert("❌ Event not found!");
        } else if (event.registrations.includes(currentUser.email)) {
          alert("ℹ️ You are already registered for this event!");
        } else if (event.attendees >= event.maxSeats) {
          alert("⚠️ Sorry, this event is fully booked!");
        } else {
          alert("❌ Registration failed. Please try again.");
        }
      }
    } catch (error) {
      console.error("Registration error:", error);
      alert("❌ Registration failed. Please try again.");
    } finally {
      setRegisteringEvents((prev) => {
        const newSet = new Set(prev);
        newSet.delete(eventId);
        return newSet;
      });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading events...</p>
        </div>
      </div>
    );
  }

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
              <Link
                to="/"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Home
              </Link>
              <Link
                to="/events"
                className="text-indigo-600 font-medium border-b-2 border-indigo-600"
              >
                Events
              </Link>
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-indigo-600 font-medium"
              >
                Dashboard
              </Link>
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Sign Up
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover Amazing Events
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Browse through our collection of exciting events and find the
            perfect ones for you
          </p>
        </div>

        {/* Search and Filter Section */}
        <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg mb-8">
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search Input */}
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search events by title, description, venue, or organizer..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>

              {/* Category Filter */}
              <div className="lg:w-64">
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                >
                  <SelectTrigger className="h-12 border-gray-200 focus:border-indigo-500 focus:ring-indigo-500">
                    <Filter className="w-4 h-4 mr-2" />
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Filter Summary */}
            <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
              <div>
                Showing {filteredEvents.length} of {events.length} events
                {searchTerm && <span> for "{searchTerm}"</span>}
                {selectedCategory !== "all" && (
                  <span> in {selectedCategory}</span>
                )}
              </div>
              {(searchTerm || selectedCategory !== "all") && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSearchTerm("");
                    setSelectedCategory("all");
                  }}
                  className="text-indigo-600 hover:text-indigo-700"
                >
                  Clear filters
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Events Grid */}
        {filteredEvents.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-12 text-center">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {events.length === 0
                  ? "No Events Available"
                  : "No Events Found"}
              </h3>
              <p className="text-gray-600 mb-6">
                {events.length === 0
                  ? "There are no events currently available. Check back later or create your own event!"
                  : "Try adjusting your search terms or filters to find more events."}
              </p>
              {events.length === 0 && (
                <Link to="/create-event">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    Create Your First Event
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event, index) => (
              <Card
                key={event.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300 group animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="relative overflow-hidden">
                  <img
                    src={event.image || "/placeholder.svg"}
                    alt={event.title}
                    className="w-full h-48 object-cover rounded-t-lg transition-transform duration-300 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                  <div className="absolute top-4 right-4">
                    <Badge className="bg-white/90 text-gray-800 font-medium">
                      {event.category}
                    </Badge>
                  </div>
                  {getAvailableSeats(event) <= 10 &&
                    getAvailableSeats(event) > 0 && (
                      <div className="absolute top-4 left-4">
                        <Badge className="bg-red-500 text-white font-medium">
                          Limited Seats
                        </Badge>
                      </div>
                    )}
                  {getAvailableSeats(event) === 0 && (
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-gray-500 text-white font-medium">
                        Sold Out
                      </Badge>
                    </div>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                    {event.title}
                  </h3>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                    {event.description}
                  </p>

                  <div className="space-y-2 text-sm text-gray-500 mb-4">
                    <div className="flex items-center">
                      <Calendar className="w-4 h-4 mr-2 text-indigo-500" />
                      {formatDate(event.date)}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-2 text-indigo-500" />
                      {event.startTime && event.endTime
                        ? `${event.startTime} - ${event.endTime}`
                        : event.time || event.startTime}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2 text-indigo-500" />
                      {event.venue}
                    </div>
                    <div className="flex items-center">
                      <UserCheck className="w-4 h-4 mr-2 text-indigo-500" />
                      By {event.organizer}
                    </div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-2 text-indigo-500" />
                      {getAvailableSeats(event)} seats left
                    </div>
                  </div>

                  {/* Registration Progress Bar */}
                  <div className="mb-4">
                    <div className="flex justify-between text-xs text-gray-500 mb-2">
                      <span>{event.attendees} registered</span>
                      <span>{event.maxSeats} capacity</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-gradient-to-r from-indigo-500 to-purple-600 h-2 rounded-full transition-all duration-300"
                        style={{
                          width: `${getRegistrationPercentage(event)}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    {isUserRegistered(event) ? (
                      <Button
                        disabled
                        className="flex-1 bg-green-600 text-white cursor-default"
                      >
                        <UserCheck className="w-4 h-4 mr-2" />
                        Registered
                      </Button>
                    ) : getAvailableSeats(event) > 0 ? (
                      <Button
                        onClick={() => handleRegister(event.id)}
                        disabled={registeringEvents.has(event.id)}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium disabled:opacity-70"
                      >
                        {registeringEvents.has(event.id) ? (
                          <>
                            <div className="w-4 h-4 mr-2 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Registering...
                          </>
                        ) : (
                          <>
                            <LogIn className="w-4 h-4 mr-2" />
                            Register
                          </>
                        )}
                      </Button>
                    ) : (
                      <Button
                        disabled
                        className="flex-1 bg-gray-400 text-white cursor-not-allowed"
                      >
                        Sold Out
                      </Button>
                    )}
                    <Link to={`/event-details/${event.id}`}>
                      <Button
                        variant="outline"
                        className="px-4 border-gray-300 hover:bg-gray-50"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Footer CTA */}
        {events.length > 0 && (
          <div className="mt-12 text-center">
            <Card className="bg-gradient-to-r from-indigo-500 to-purple-600 border-0 shadow-xl">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-white mb-4">
                  Want to organize your own event?
                </h3>
                <p className="text-indigo-100 mb-6">
                  Join our community of event organizers and create memorable
                  experiences
                </p>
                <Link to="/create-event">
                  <Button
                    variant="secondary"
                    className="bg-white text-indigo-600 hover:bg-gray-100 font-medium"
                  >
                    Create Your Event
                    <Star className="w-4 h-4 ml-2" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold">EventHub</span>
              </div>
              <p className="text-gray-400">
                The ultimate platform for college event management and
                discovery.
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Platform</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/events" className="hover:text-white">
                    Browse Events
                  </Link>
                </li>
                <li>
                  <Link to="/create-event" className="hover:text-white">
                    Create Event
                  </Link>
                </li>
                <li>
                  <Link to="/dashboard" className="hover:text-white">
                    Dashboard
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Account</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <Link to="/login" className="hover:text-white">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link to="/signup" className="hover:text-white">
                    Sign Up
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Support</h3>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a
                    href="mailto:adishinde62020@gmail.com?subject=EventHub Support&body=Phone: 8830899840"
                    className="hover:text-white"
                  >
                    Contact Us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Help Center
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2024 EventHub. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
