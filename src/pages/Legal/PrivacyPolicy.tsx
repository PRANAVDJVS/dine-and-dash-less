
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <>
      <Header />
      <main className="pt-20 min-h-screen">
        <Container>
          <div className="py-12 max-w-3xl mx-auto">
            <Link to="/">
              <Button variant="ghost" className="mb-6">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            
            <h1 className="text-4xl font-medium mb-8">Privacy Policy</h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Last Updated: April 5, 2025
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Introduction</h2>
                <p>
                  Welcome to Flavours of India ("we," "our," or "us"). We respect your privacy and are committed to protecting 
                  your personal data. This Privacy Policy explains how we collect, use, disclose, and safeguard your information 
                  when you visit our website and use our services.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Information We Collect</h2>
                <p className="mb-4">We may collect the following types of information:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Personal Information:</strong> Name, email address, phone number, delivery address, 
                    and payment information when you place an order or create an account.
                  </li>
                  <li>
                    <strong>Usage Data:</strong> Information about how you interact with our website, such as 
                    pages visited, time spent on pages, and other analytical data.
                  </li>
                  <li>
                    <strong>Device Information:</strong> Information about the device you use to access our website, 
                    including IP address, browser type, and operating system.
                  </li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">How We Use Your Information</h2>
                <p className="mb-4">We use your information for various purposes, including:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Processing and delivering your orders</li>
                  <li>Managing your account and providing customer support</li>
                  <li>Sending you order confirmations and updates</li>
                  <li>Improving our website and services</li>
                  <li>Marketing and promotional communications (with your consent)</li>
                  <li>Complying with legal obligations</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">How We Share Your Information</h2>
                <p className="mb-4">We may share your information with:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Delivery partners to fulfill your orders</li>
                  <li>Payment processors to complete transactions</li>
                  <li>Service providers who help us operate our business</li>
                  <li>
                    Legal authorities when required by law or to protect our rights, 
                    privacy, safety, or property
                  </li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Your Rights</h2>
                <p className="mb-4">Depending on your location, you may have the right to:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>Access the personal information we hold about you</li>
                  <li>Correct inaccurate or incomplete information</li>
                  <li>Delete your personal information</li>
                  <li>Restrict or object to the processing of your data</li>
                  <li>Request the transfer of your data</li>
                  <li>Withdraw consent at any time</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Data Security</h2>
                <p>
                  We implement appropriate security measures to protect your personal information. 
                  However, please note that no method of transmission over the internet or electronic 
                  storage is 100% secure, and we cannot guarantee absolute security.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Changes to This Privacy Policy</h2>
                <p>
                  We may update this Privacy Policy from time to time. The updated version will be 
                  indicated by an updated "Last Updated" date, and the updated version will be effective 
                  as soon as it is accessible. We encourage you to review this Privacy Policy frequently 
                  to stay informed about how we are protecting your information.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
                <p>
                  If you have any questions or concerns about this Privacy Policy, please contact us at:
                </p>
                <ul className="list-disc pl-6 space-y-2 mt-4">
                  <li>Email: info@flavoursofindia.com</li>
                  <li>Phone: 6309667777</li>
                  <li>Address: Flavours of India, Benz Circle, Vijayawada</li>
                </ul>
              </section>
            </div>
          </div>
        </Container>
      </main>
      <Footer />
    </>
  );
}
