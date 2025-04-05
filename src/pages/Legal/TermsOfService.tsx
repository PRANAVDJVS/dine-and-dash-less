
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";

export default function TermsOfService() {
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
            
            <h1 className="text-4xl font-medium mb-8">Terms of Service</h1>
            
            <div className="prose max-w-none">
              <p className="text-lg text-muted-foreground mb-6">
                Last Updated: April 5, 2025
              </p>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Introduction</h2>
                <p>
                  Welcome to Flavours of India. These Terms of Service govern your use of our website, services, and mobile 
                  application (collectively, the "Service"). By accessing or using our Service, you agree to be bound by these 
                  Terms. If you disagree with any part of these Terms, you may not access the Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Use of Our Service</h2>
                <p className="mb-4">
                  By using our Service, you agree to the following:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You will use the Service in a manner consistent with applicable laws and regulations.</li>
                  <li>You will provide accurate information when creating an account or placing orders.</li>
                  <li>You are responsible for maintaining the confidentiality of your account information.</li>
                  <li>You will promptly notify us of any unauthorized use of your account or security breaches.</li>
                  <li>We reserve the right to refuse service, terminate accounts, or cancel orders at our discretion.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Orders and Payments</h2>
                <p className="mb-4">
                  When you place an order through our Service:
                </p>
                <ul className="list-disc pl-6 space-y-2">
                  <li>You agree to pay all charges associated with your order at the prices in effect at the time.</li>
                  <li>You represent that you have the legal right to use the payment method you provide.</li>
                  <li>We reserve the right to refuse or cancel orders due to pricing errors, product unavailability, or other reasons.</li>
                  <li>Delivery times are estimates and not guaranteed. Factors like weather and traffic may affect delivery times.</li>
                  <li>Orders may be subject to a minimum order amount and delivery fees, which will be clearly indicated during checkout.</li>
                </ul>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Intellectual Property</h2>
                <p>
                  The Service and its original content, features, and functionality are owned by Flavours of India and 
                  are protected by international copyright, trademark, patent, trade secret, and other intellectual 
                  property or proprietary rights laws. You may not reproduce, distribute, modify, create derivative works 
                  of, publicly display, publicly perform, republish, download, store, or transmit any of the material on our Service.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">User Content</h2>
                <p>
                  When you submit content to our Service, such as reviews or comments, you grant us a non-exclusive, 
                  worldwide, royalty-free license to use, reproduce, modify, and display such content in connection 
                  with our Service. You represent that you have the right to provide such content and that it does not 
                  violate the rights of any third party or applicable laws.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Flavours of India shall not be liable for any indirect, 
                  incidental, special, consequential, or punitive damages arising out of or in connection with your 
                  use of the Service. Our total liability for any claims under these Terms shall not exceed the 
                  amount paid by you for your most recent order.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Indemnification</h2>
                <p>
                  You agree to indemnify, defend, and hold harmless Flavours of India, its affiliates, officers, 
                  directors, employees, and agents from any claims, liabilities, damages, losses, and expenses 
                  arising out of or in any way connected with your use of the Service or violation of these Terms.
                </p>
              </section>
              
              <section className="mb-8">
                <h2 className="text-2xl font-medium mb-4">Changes to Terms</h2>
                <p>
                  We reserve the right to modify or replace these Terms at any time. If a revision is material, 
                  we will provide at least 30 days' notice prior to any new terms taking effect. What constitutes a 
                  material change will be determined at our sole discretion. By continuing to access or use our 
                  Service after any revisions become effective, you agree to be bound by the revised terms.
                </p>
              </section>
              
              <section>
                <h2 className="text-2xl font-medium mb-4">Contact Us</h2>
                <p>
                  If you have any questions about these Terms, please contact us at:
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
