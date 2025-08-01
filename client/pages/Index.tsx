import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { eventStorage, type Event } from "@/lib/events";
import {
  Calendar,
  Users,
  MapPin,
  Clock,
  Star,
  ArrowRight,
  Plus,
} from "lucide-react";

export default function Index() {
  const [realTimeStats, setRealTimeStats] = useState({
    activeEvents: 0,
    totalStudents: 0,
    thisMonth: 0,
    featured: 0,
  });

  useEffect(() => {
    updateRealTimeStats();
    updateFeaturedEvents();
  }, []);

  const updateRealTimeStats = () => {
    const allEvents = eventStorage.getAllEvents();
    const activeEvents = eventStorage.getActiveEvents();

    // Calculate this month's events
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    const thisMonthEvents = allEvents.filter((event) => {
      const eventDate = new Date(event.date);
      return (
        eventDate.getMonth() === currentMonth &&
        eventDate.getFullYear() === currentYear
      );
    });

    // Calculate total students (sum of all attendees)
    const totalStudents = allEvents.reduce(
      (sum, event) => sum + event.attendees,
      0,
    );

    // Count featured events (you can add a featured property to events later)
    const featuredEvents = activeEvents.filter(
      (event) => event.attendees > 100, // Consider high-attendance events as "featured"
    );

    setRealTimeStats({
      activeEvents: activeEvents.length,
      totalStudents: totalStudents,
      thisMonth: thisMonthEvents.length,
      featured: featuredEvents.length,
    });
  };

  // Get real featured events from localStorage
  const [featuredEvents, setFeaturedEvents] = useState([]);

  const updateFeaturedEvents = () => {
    const activeEvents = eventStorage.getActiveEvents();

    // Sort by attendees and take top 3 as featured
    const sortedEvents = activeEvents
      .sort((a, b) => b.attendees - a.attendees)
      .slice(0, 3);

    // Convert to the format expected by the UI
    const formattedEvents = sortedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      date: eventStorage.formatDate(event.date),
      time:
        event.startTime && event.endTime
          ? `${event.startTime} - ${event.endTime}`
          : event.time || event.startTime,
      location: event.venue,
      attendees: event.attendees,
      category: event.category,
      image: event.image || "/placeholder.svg",
      featured: event.attendees > 100, // Mark high-attendance events as featured
    }));

    setFeaturedEvents(formattedEvents);
  };

  const stats = [
    {
      label: "Active Events",
      value: realTimeStats.activeEvents.toString(),
      icon: Calendar,
    },
    {
      label: "Total Students",
      value:
        realTimeStats.totalStudents > 0
          ? `${realTimeStats.totalStudents.toLocaleString()}+`
          : "0",
      icon: Users,
    },
    {
      label: "This Month",
      value: realTimeStats.thisMonth.toString(),
      icon: Clock,
    },
    {
      label: "Featured",
      value: realTimeStats.featured.toString(),
      icon: Star,
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-indigo-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <Calendar className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                EventHub
              </span>
            </div>
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

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-16 pb-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Discover Amazing
              <span className="block bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                College Events
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              Join, create, and manage college events seamlessly. Connect with
              your community and never miss out on exciting opportunities.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/create-event">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-lg px-8"
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Create Event
                </Button>
              </Link>
              <Link to="/events">
                <Button
                  size="lg"
                  variant="outline"
                  className="text-lg px-8 border-indigo-200 hover:bg-indigo-50"
                >
                  Browse Events
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-xl mb-4">
                  <stat.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-1">
                  {stat.value}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Events
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Don't miss out on these exciting upcoming events happening at our
              college
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredEvents.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No Featured Events Yet
                </h3>
                <p className="text-gray-600 mb-6">
                  Create some events to see them featured here!
                </p>
                <Link to="/create-event">
                  <Button className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Create Your First Event
                  </Button>
                </Link>
              </div>
            ) : (
              featuredEvents.map((event) => (
                <Card
                  key={event.id}
                  className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg bg-white/80 backdrop-blur-sm"
                >
                  <div className="relative">
                    <img
                      src={event.image}
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                    />
                    {event.featured && (
                      <Badge className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white">
                        <Star className="w-3 h-3 mr-1" />
                        Featured
                      </Badge>
                    )}
                    <Badge className="absolute top-4 right-4 bg-white/90 text-gray-700">
                      {event.category}
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 group-hover:text-indigo-600 transition-colors">
                      {event.title}
                    </h3>
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
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
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-2" />
                        {event.attendees} attending
                      </div>
                    </div>
                    <Link to={`/event-details/${event.id}`}>
                      <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                        View Details
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-indigo-100 mb-8">
            Join thousands of students already using EventHub to discover and
            create amazing events
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/signup">
              <Button
                size="lg"
                className="bg-white text-indigo-600 hover:bg-gray-50 text-lg px-8"
              >
                Sign Up Free
              </Button>
            </Link>
            <Link to="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-indigo-600 text-lg px-8 transition-colors duration-300"
              >
                Sign In
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
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
