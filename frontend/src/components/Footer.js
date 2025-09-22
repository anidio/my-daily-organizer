import React from 'react';
import './Footer.css';

// Ícone do Instagram em SVG
const InstagramIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" strokeWidth="2"></rect>
      <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01" strokeWidth="2"></path>
    </svg>
);

const Footer = () => {
    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-title">Este é um produto MangueBit Code.</h3>
                    <p className="footer-text">Criamos soluções inovadoras, de sistemas para restaurantes a ferramentas de conformidade e hardware.</p>
                    <a href="https://instagram.com/manguebitcode" target="_blank" rel="noopener noreferrer" className="instagram-link">
                        <InstagramIcon />
                        Siga-nos no Instagram!
                    </a>
                </div>
                <div className="footer-contact">
                    <p>Contato: contato@manguebitcode.com | (81) 99999-8888</p>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; 2025 MangueBit Code. Todos os direitos reservados.</p>
            </div>
        </footer>
    );
};

export default Footer;