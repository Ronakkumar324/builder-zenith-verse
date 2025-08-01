import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  ArrowLeft, 
  Share2, 
  Heart,
  CheckCircle,
  Star,
  User,
  Phone,
  Mail,
  Globe
} from "lucide-react";
import { useState } from "react";

export default function EventDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isRegistered, setIsRegistered] = useState(false);

  // Static event data - in a real app this would be fetched based on the ID
  const eventData = {
    1: {
      id: 1,
      title: "Tech Innovation Summit 2024",
      description: "Join us for an exciting day of technological innovation and networking. This summit brings together industry leaders, students, and tech enthusiasts to explore the latest trends in artificial intelligence, machine learning, and emerging technologies. Experience keynote speeches from top executives, interactive workshops, and hands-on demonstrations of cutting-edge tech solutions.",
      date: "March 15, 2024",
      time: "10:00 AM - 6:00 PM",
      venue: "Main Auditorium, Building A",
      address: "123 College Street, Campus Area, City 12345",
      image: "/placeholder.svg",
      category: "Technology",
      seatsLeft: 45,
      totalSeats: 150,
      price: "Free",
      organizer: {
        name: "Tech Club",
        avatar: "/placeholder.svg",
        email: "techclub@college.edu",
        phone: "+1 (555) 123-4567"
      },
      tags: ["AI", "Machine Learning", "Innovation", "Networking"],
      featured: true
    },
    2: {
      id: 2,
      title: "Annual Cultural Festival",
      description: "Celebrate the diversity and richness of our college culture with performances, food, art exhibitions, and cultural displays from students representing various backgrounds. This festival showcases traditional and contemporary art forms, music performances, dance shows, and interactive cultural workshops. Experience the vibrant traditions and modern expressions of our diverse student community.",
      date: "March 22, 2024",
      time: "6:00 PM - 11:00 PM",
      venue: "College Grounds, Main Campus",
      address: "College Main Grounds, Campus Area, City 12345",
      image: "/placeholder.svg",
      category: "Cultural",
      seatsLeft: 120,
      totalSeats: 500,
      price: "Free",
      organizer: {
        name: "Cultural Committee",
        avatar: "/placeholder.svg",
        email: "cultural@college.edu",
        phone: "+1 (555) 123-4568"
      },
      tags: ["Culture", "Music", "Dance", "Art", "Food"],
      featured: false
    },
    3: {
      id: 3,
      title: "Career Fair Spring 2024",
      description: "Connect with top employers and explore exciting career opportunities across various industries. This comprehensive career fair features representatives from leading companies in technology, finance, healthcare, consulting, and more. Participate in on-the-spot interviews, attend career workshops, and network with industry professionals to kickstart your career journey.",
      date: "April 5, 2024",
      time: "9:00 AM - 4:00 PM",
      venue: "Student Center, Hall B & C",
      address: "Student Center Building, Campus Area, City 12345",
      image: "/placeholder.svg",
      category: "Career",
      seatsLeft: 67,
      totalSeats: 300,
      price: "Free",
      organizer: {
        name: "Career Services",
        avatar: "/placeholder.svg",
        email: "careers@college.edu",
        phone: "+1 (555) 123-4569"
      },
      tags: ["Career", "Jobs", "Networking", "Interview", "Professional"],
      featured: false
    }
  };

  const event = eventData[id as keyof typeof eventData] || eventData[1];

  const handleRegister = () => {
    setShowSuccessModal(true);
    setIsRegistered(true);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: event.title,
          text: event.description,
          url: window.location.href,
        });
      } catch (err) {
        console.log('Error sharing:', err);
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
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
            </nav>
            <div className="flex items-center space-x-4">
              <Link to="/login">
                <Button variant="ghost" className="text-gray-700 hover:text-indigo-600">
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="text-gray-600 hover:text-indigo-600"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Events
          </Button>
        </div>

        {/* Event Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Event Image */}
            <div className="lg:w-2/3">
              <div className="relative">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-64 lg:h-80 object-cover rounded-xl shadow-lg"
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
            </div>

            {/* Event Quick Info */}
            <div className="lg:w-1/3">
              <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl sticky top-24">
                <CardContent className="p-6">
                  <div className="text-center mb-6">
                    <div className="text-3xl font-bold text-gray-900 mb-2">{event.price}</div>
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Users className="w-4 h-4" />
                      <span>{event.seatsLeft} seats left of {event.totalSeats}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center text-gray-700">
                      <Calendar className="w-5 h-5 mr-3 text-indigo-600" />
                      <span>{event.date}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="w-5 h-5 mr-3 text-indigo-600" />
                      <span>{event.time}</span>
                    </div>
                    <div className="flex items-start text-gray-700">
                      <MapPin className="w-5 h-5 mr-3 text-indigo-600 mt-0.5" />
                      <div>
                        <div>{event.venue}</div>
                        <div className="text-sm text-gray-500">{event.address}</div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    {!isRegistered ? (
                      <Button 
                        onClick={handleRegister}
                        className="w-full h-12 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-medium"
                      >
                        Register Now
                      </Button>
                    ) : (
                      <Button 
                        disabled
                        className="w-full h-12 bg-green-600 text-white font-medium"
                      >
                        <CheckCircle className="w-4 h-4 mr-2" />
                        Registered Successfully
                      </Button>
                    )}
                    
                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm" className="flex-1" onClick={handleShare}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button variant="outline" size="sm" className="flex-1">
                        <Heart className="w-4 h-4 mr-2" />
                        Save
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>

        {/* Event Details */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Title and Description */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{event.title}</h1>
                
                {/* Tags */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {event.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="bg-indigo-100 text-indigo-800">
                      {tag}
                    </Badge>
                  ))}
                </div>

                <div className="prose prose-gray max-w-none">
                  <h3 className="text-xl font-semibold mb-3">About This Event</h3>
                  <p className="text-gray-700 leading-relaxed">{event.description}</p>
                </div>
              </CardContent>
            </Card>

            {/* Event Schedule */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-xl font-semibold mb-4">Event Schedule</h3>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Registration & Check-in</div>
                      <div className="text-sm text-gray-600">9:30 AM - 10:00 AM</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Opening Ceremony</div>
                      <div className="text-sm text-gray-600">10:00 AM - 10:30 AM</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Main Event</div>
                      <div className="text-sm text-gray-600">10:30 AM - 5:00 PM</div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-2 h-2 bg-indigo-600 rounded-full"></div>
                    <div>
                      <div className="font-medium">Networking & Closing</div>
                      <div className="text-sm text-gray-600">5:00 PM - 6:00 PM</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Organizer Info */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Organized By</h3>
                <div className="flex items-center space-x-3 mb-4">
                  <Avatar className="w-12 h-12">
                    <AvatarImage src={event.organizer.avatar} />
                    <AvatarFallback>
                      <User className="w-6 h-6" />
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium text-gray-900">{event.organizer.name}</div>
                    <div className="text-sm text-gray-600">Event Organizer</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {event.organizer.email}
                  </div>
                  <div className="flex items-center text-gray-600">
                    <Phone className="w-4 h-4 mr-2" />
                    {event.organizer.phone}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Venue Map */}
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Venue</h3>
                <div className="bg-gray-200 h-32 rounded-lg flex items-center justify-center mb-4">
                  <span className="text-gray-500">Map Placeholder</span>
                </div>
                <div className="text-sm">
                  <div className="font-medium">{event.venue}</div>
                  <div className="text-gray-600">{event.address}</div>
                </div>
                <Button variant="outline" size="sm" className="w-full mt-3">
                  <Globe className="w-4 h-4 mr-2" />
                  View in Maps
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent className="bg-white border-0 shadow-2xl max-w-md">
          <DialogHeader className="text-center pb-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-gray-900 mb-2">
              Registration Successful!
            </DialogTitle>
          </DialogHeader>
          <div className="text-center space-y-4">
            <p className="text-gray-600">
              You have successfully registered for <span className="font-medium text-gray-900">{event.title}</span>
            </p>
            <p className="text-sm text-gray-500">
              A confirmation email has been sent to your registered email address with event details and instructions.
            </p>
            <div className="flex space-x-3 pt-4">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowSuccessModal(false)}
              >
                Close
              </Button>
              <Link to="/dashboard" className="flex-1">
                <Button className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700">
                  Go to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
