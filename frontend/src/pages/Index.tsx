import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Shield, 
  Smartphone, 
  CreditCard, 
  ArrowRight,
  CheckCircle,
  Users,
  TrendingUp,
  Lock
} from 'lucide-react';
import heroImage from '@/assets/banking-hero.jpg';

const Index = () => {
  const features = [
    {
      icon: Shield,
      title: "Bank-Grade Security",
      description: "Your money and data are protected with military-grade encryption and multi-factor authentication."
    },
    {
      icon: Smartphone,
      title: "Mobile First Design",
      description: "Access your accounts anywhere, anytime with our responsive mobile-first banking platform."
    },
    {
      icon: CreditCard,
      title: "Multiple Account Types",
      description: "Choose from Savings, Checking, or Business accounts tailored to your financial needs."
    },
    {
      icon: TrendingUp,
      title: "Real-Time Analytics",
      description: "Track your spending, view transaction history, and monitor your financial health in real-time."
    }
  ];

  const benefits = [
    "No monthly fees or minimum balance requirements",
    "24/7 customer support and fraud protection",
    "Instant transfers between accounts",
    "Mobile check deposits and bill pay",
    "Advanced budgeting and savings tools",
    "FDIC insured up to $250,000"
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden banking-hero">
        <div className="absolute inset-0">
          <img 
            src={heroImage} 
            alt="Modern digital banking interface" 
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-secondary/90" />
        </div>
        
        <div className="relative container mx-auto px-4 py-24 md:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center space-x-2 mb-6">
                <Building2 className="h-8 w-8 text-white" />
                <span className="text-2xl font-bold text-white">Sky Bank</span>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Banking 
                <span className="block text-primary-glow">Reimagined</span>
              </h1>
              
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Experience the future of digital banking with our secure, intuitive platform. 
                Manage your finances with confidence and ease.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Button size="lg" variant="secondary" className="banking-button-secondary" asChild>
                  <Link to="/register">
                    Get Started Free
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="border-white/80 bg-white/90 text-black hover:bg-white hover:text-black backdrop-blur-sm" asChild>
                  <Link to="/login">
                    Sign In
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="hidden lg:block">
              <div className="relative">
                <div className="banking-card p-8 max-w-md ml-auto">
                  <div className="text-center mb-6">
                    <div className="inline-flex items-center justify-center w-16 h-16 banking-hero rounded-2xl mb-4">
                      <Lock className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold">Secure Banking</h3>
                    <p className="text-muted-foreground">Your trusted financial partner</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-black">Digital Banking</span>
                      <span className="font-semibold text-primary">24/7 Access</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-black">Security Level</span>
                      <span className="font-semibold text-black">Bank Grade</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                      <span className="text-sm text-black">Customer Support</span>
                      <span className="font-semibold text-secondary">Always Here</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Why Choose Sky Bank?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We combine cutting-edge technology with personalized service to give you 
              the banking experience you deserve.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="banking-card text-center hover:scale-105 transition-transform duration-200">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 banking-hero rounded-2xl mx-auto mb-4">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Everything You Need in One Place
              </h2>
              <p className="text-xl text-muted-foreground mb-8">
                From everyday banking to long-term financial planning, we've got you covered 
                with comprehensive tools and services.
              </p>
              
              <div className="grid grid-cols-1 gap-4">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
              
              <div className="mt-8">
                <Button size="lg" className="banking-button-primary" asChild>
                  <Link to="/register">
                    Open Your Account Today
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
            
            <div className="space-y-6">
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-primary" />
                    <span>Trusted by 500,000+ Customers</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                  Join hundreds of thousands of satisfied customers who trust 
                    Sky Bank with their financial future.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="banking-card">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5 text-primary" />
                    <span>FDIC Insured & Regulated</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">
                    Your deposits are protected up to $250,000 by FDIC insurance, 
                    and we're regulated by federal banking authorities.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 banking-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Get Started?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Open your Sky Bank account in minutes and start experiencing 
            the future of digital banking today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="banking-button-secondary" asChild>
              <Link to="/register">
                Create Free Account
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="border-white bg-white/90 text-black hover:bg-white hover:text-black" asChild>
              <Link to="/login">
                Existing Customer? Sign In
              </Link>
            </Button>
          </div>
          
          <p className="text-white/70 text-sm mt-6">
            No credit check required • No monthly fees • FDIC Insured
          </p>
        </div>
      </section>
    </div>
  );
};

export default Index;
