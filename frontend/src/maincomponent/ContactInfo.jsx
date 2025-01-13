
import React from 'react';
import { Facebook, Instagram, ArrowRight, MapPin, Phone, Mail, Package, FileText, Users, Store, Coffee, Twitter, Linkedin, Youtube, Pinterest, Snapchat, Github, TikTok   } from 'lucide-react';
import './ContactInfo.css';

const ContactInfo = () => {
  const sections = [
    {
      title: "SHIPPING INFO",
      items: [
        { label: "Payments", icon: <Package /> },
        { label: "Shipping & Exchange", icon: <FileText /> },
        { label: "Bulk queries", icon: <Users /> },
        { label: "Terms & Conditions", icon: <FileText /> },
        { label: "Privacy policy", icon: <FileText /> },
        { label: "Fabric/Print disclaimer", icon: <FileText /> }
      ]
    },
    {
      title: "THE COMPANY",
      items: [
        { label: "About", icon: <Users /> },
        { label: "Our Company", icon: <Store /> },
        { label: "Contact us", icon: <Phone /> },
        { label: "Store locator", icon: <MapPin /> },
      ]
    },
    {
      title: "MY ACCOUNT",
      items: [
        { label: "Track Order", icon: <Package /> },
        { label: "Exchange Request", icon: <ArrowRight /> }
      ]
    }
  ];

  return (
    <footer className="footer-container">
      <div className="footer-content">
        
        
        
        <div className="footer-sections">
          {sections.map((section, index) => (
            <div key={index} className="footer-section">
              <h2 className="section-title">{section.title}</h2>
              <nav className="section-links">
                {section.items.map((item, idx) => (
                  <div key={idx} className="link-item">
                    <span className="icon">{item.icon}</span>
                    <span className="label">{item.label}</span>
                  </div>
                ))}
              </nav>
            </div>
          ))}
        </div>



        <div className="footer-section benefits-section">
          <h2 className="section-title" style={{textAlign:'center'}}>EXCLUSIVE BENEFITS</h2>
          <div className="benefits-content">
            <div className="email-signup">
              <input type="email" placeholder="Enter email here" />
              <button className="submit-btn">
                <ArrowRight />
              </button>
            </div>
            <p className="benefits-text">
              Apply for our free membership to receive exclusive deals, news, and events.
            </p>
            
            <div className="social-icons">
              <Facebook className="social-icon" />
              <Instagram className="social-icon" />
                <Twitter className="social-icon" />
                <Linkedin className="social-icon" />
                <Youtube className="social-icon" />

            </div>
          </div>
        </div>




      </div>
      
        <div className="copyright">
          <p>© 2025, mrx gshankar the coder Clothing. All rights reserved.</p>
        </div>
    </footer>
  );
};

export default ContactInfo;