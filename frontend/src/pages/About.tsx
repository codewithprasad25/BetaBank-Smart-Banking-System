import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building2, 
  Shield, 
  Users, 
  Award,
  Globe,
  Clock,
  CheckCircle,
  TrendingUp
} from 'lucide-react';

const About = () => {
  const values = [
    {
      icon: Shield,
      title: "Security First",
      description: "We prioritize the security of your financial data with bank-grade encryption and multi-layered protection systems."
    },
    {
      icon: Users,
      title: "Customer Focused",
      description: "Our customers are at the heart of everything we do. We're committed to providing exceptional service and support."
    },
    {
      icon: TrendingUp,
      title: "Innovation",
      description: "We continuously innovate to provide cutting-edge banking solutions that meet your evolving financial needs."
    },
    {
      icon: Globe,
      title: "Accessibility",
      description: "Banking should be accessible to everyone, anywhere, anytime. That's why we've built a platform that works for you."
    }
  ];

  const stats = [
    { label: "Customers Served", value: "500,000+" },
    { label: "Years of Excellence", value: "15+" },
    { label: "Countries", value: "25+" },
    { label: "Customer Satisfaction", value: "99.9%" }
  ];

  const milestones = [
    { year: "2008", event: "Sky Bank founded with a vision to revolutionize digital banking" },
    { year: "2012", event: "Launched our first mobile banking app" },
    { year: "2016", event: "Expanded internationally, serving customers across 25 countries" },
    { year: "2020", event: "Introduced AI-powered financial insights and budgeting tools" },
    { year: "2023", event: "Achieved carbon-neutral operations and launched sustainable banking initiatives" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="banking-hero py-20">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center space-x-2 mb-6">
            <Building2 className="h-12 w-12 text-white" />
            <span className="text-3xl font-bold text-white">Sky Bank</span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            About Sky Bank
          </h1>
          
          <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
            Since 2008, Sky Bank has been at the forefront of digital banking innovation, 
            providing secure, accessible, and customer-centric financial services to millions worldwide.
          </p>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground mb-12">
              To democratize banking by making financial services more accessible, secure, and transparent 
              for individuals and businesses around the world. We believe that everyone deserves access to 
              modern banking tools that help them achieve their financial goals.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-16">
            {stats.map((stat, index) => (
              <Card key={index} className="banking-card text-center">
                <CardContent className="pt-6">
                  <div className="text-3xl font-bold text-primary mb-2">{stat.value}</div>
                  <p className="text-muted-foreground">{stat.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Values</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              These core principles guide everything we do and shape the way we serve our customers.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <Card key={index} className="banking-card text-center">
                <CardHeader>
                  <div className="inline-flex items-center justify-center w-16 h-16 banking-hero rounded-2xl mx-auto mb-4">
                    <value.icon className="h-8 w-8 text-white" />
                  </div>
                  <CardTitle className="text-xl">{value.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Journey</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              A timeline of key milestones in Sky Bank's evolution and growth.
            </p>
          </div>
          
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              {milestones.map((milestone, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 banking-hero rounded-full flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                  </div>
                  <div className="flex-grow">
                    <div className="banking-card p-6">
                      <div className="flex items-center space-x-3 mb-2">
                        <span className="text-2xl font-bold text-primary">{milestone.year}</span>
                        <CheckCircle className="h-5 w-5 text-success" />
                      </div>
                      <p className="text-muted-foreground">{milestone.event}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Leadership Team</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Meet the experienced professionals who lead Sky Bank's mission to transform digital banking.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {[
              { name: "Rankesh Sharma", role: "Chief Executive Officer", experience: "15+ years in fintech" },
              { name: "Suryadarshan Desai", role: "Chief Technology Officer", experience: "12+ years in banking tech" },
              { name: "Sam Desai", role: "Chief Security Officer", experience: "10+ years in cybersecurity" }
            ].map((leader, index) => (
              <Card key={index} className="banking-card text-center">
                <CardHeader>
                  <div className="w-24 h-24 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center">
                    <Users className="h-12 w-12 text-white" />
                  </div>
                  <CardTitle className="text-xl">{leader.name}</CardTitle>
                  <p className="text-primary font-medium">{leader.role}</p>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{leader.experience}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-20 banking-hero">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Ready to Bank with Sky Bank?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join millions of customers who trust Sky Bank for their financial needs. 
            Experience the future of digital banking today.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Card className="banking-card max-w-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Customer Support</h3>
                <p className="text-muted-foreground text-sm mb-2">Available 24/7</p>
                <p className="text-primary font-medium">1-800-SKY-BANK</p>
              </CardContent>
            </Card>
            <Card className="banking-card max-w-sm">
              <CardContent className="pt-6">
                <h3 className="font-semibold mb-2">Email Support</h3>
                <p className="text-muted-foreground text-sm mb-2">Response within 2 hours</p>
                <p className="text-primary font-medium">help@skybank.com</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;