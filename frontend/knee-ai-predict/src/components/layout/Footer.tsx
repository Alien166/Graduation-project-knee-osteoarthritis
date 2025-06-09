import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Footer = () => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'ar';

  const currentYear = new Date().getFullYear();

  const footerLinks = {
    main: [
      { name: t('navigation.home'), path: '/' },
      { name: t('navigation.dashboard'), path: '/dashboard' },
      { name: t('navigation.predict'), path: '/predict' },
      { name: t('navigation.history'), path: '/history' }
    ],
    company: [
      { name: t('common.about'), path: '/about' },
      { name: t('common.contact'), path: '/contact' },
      { name: t('common.features'), path: '/features' }
    ],
    account: [

      { name: t('common.login'), path: '/auth/login' },
      { name: t('common.signup'), path: '/auth/register' }
    ]
  };

  const socialLinks = [
    { icon: <Facebook className="h-5 w-5" />, href: 'https://facebook.com' },
    { icon: <Twitter className="h-5 w-5" />, href: 'https://twitter.com' },
    { icon: <Instagram className="h-5 w-5" />, href: 'https://instagram.com' },
    { icon: <Linkedin className="h-5 w-5" />, href: 'https://linkedin.com' }
  ];

  const contactInfo = [
    { icon: <Mail className="h-5 w-5" />, text: 'contact@kneeai.com' },
    { icon: <Phone className="h-5 w-5" />, text: '+1 (555) 123-4567' },
    { icon: <MapPin className="h-5 w-5" />, text: t('footer.address') }
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
  };

  return (
    <footer className="bg-gradient-to-br from-[#2C3E50] to-[#3498DB] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <motion.div
            variants={fadeInUp}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="space-y-4"
          >
            <h3 className="text-xl font-bold">Knee AI Predict</h3>
            <p className="text-white/80">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors duration-300"
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </motion.div>

          {/* Quick Links */}
          {Object.entries(footerLinks).map(([section, links], index) => (
            <motion.div
              key={section}
              variants={fadeInUp}
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="space-y-4"
            >
              <h3 className="text-lg font-semibold capitalize">{section}</h3>
              <ul className="space-y-2">
                {links.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      to={link.path}
                      className="text-white/80 hover:text-white transition-colors duration-300"
                    >
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Contact Info */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-12 pt-8 border-t border-white/10"
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {contactInfo.map((info, index) => (
              <div key={index} className="flex items-center space-x-3">
                <div className="p-2 rounded-full bg-white/10">
                  {info.icon}
                </div>
                <span className="text-white/80">{info.text}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Copyright */}
        <motion.div
          variants={fadeInUp}
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          className="mt-8 pt-8 border-t border-white/10 text-center text-white/60"
        >
          <p>
            © {currentYear} Knee AI Predict. {t('footer.rights')}
          </p>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;