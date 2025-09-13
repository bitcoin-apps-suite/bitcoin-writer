// Bitcoin Writer - Professional Landing Page JavaScript

class BitcoinWriter {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.animateOnLoad();
        this.setupIntersectionObserver();
    }

    setupEventListeners() {
        // Launch app button
        const launchButton = document.querySelector('.cta-button');
        if (launchButton) {
            launchButton.addEventListener('click', () => this.launchApp());
        }

        // Add smooth scroll to footer links
        const footerLinks = document.querySelectorAll('.footer-links a');
        footerLinks.forEach(link => {
            link.addEventListener('click', (e) => this.handleFooterLink(e));
        });

        // Add keyboard navigation
        document.addEventListener('keydown', (e) => this.handleKeyboard(e));
    }

    launchApp() {
        // Animate button press
        const button = document.querySelector('.cta-button');
        button.style.transform = 'scale(0.98)';

        setTimeout(() => {
            button.style.transform = '';

            // Show coming soon message with animation
            this.showNotification('Bitcoin Writer is coming soon! Secure your documents on the blockchain.', 'info');

            // You could also redirect to a different page or open the main writer
            // window.location.href = './index.html';
        }, 150);
    }

    handleFooterLink(e) {
        e.preventDefault();
        const href = e.target.getAttribute('href');

        switch(href) {
            case '#privacy':
                this.showNotification('Privacy Policy - Coming Soon', 'info');
                break;
            case '#terms':
                this.showNotification('Terms of Service - Coming Soon', 'info');
                break;
            case '#docs':
                this.showNotification('Documentation - Coming Soon', 'info');
                break;
        }
    }

    handleKeyboard(e) {
        // Space or Enter on CTA button
        if ((e.key === ' ' || e.key === 'Enter') &&
            document.activeElement === document.querySelector('.cta-button')) {
            e.preventDefault();
            this.launchApp();
        }

        // Escape key
        if (e.key === 'Escape') {
            // Could close modals or return to main page
            // window.location.href = './index.html';
        }
    }

    animateOnLoad() {
        // Animate title on load
        const title = document.querySelector('.main-title');
        const subtitle = document.querySelector('.subtitle');

        if (title) {
            title.style.opacity = '0';
            title.style.transform = 'translateY(30px)';

            setTimeout(() => {
                title.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                title.style.opacity = '1';
                title.style.transform = 'translateY(0)';
            }, 200);
        }

        if (subtitle) {
            subtitle.style.opacity = '0';

            setTimeout(() => {
                subtitle.style.transition = 'all 1s cubic-bezier(0.4, 0, 0.2, 1)';
                subtitle.style.opacity = '1';
            }, 600);
        }
    }

    setupIntersectionObserver() {
        // Animate feature items when they come into view
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, observerOptions);

        // Observe all feature items
        const featureItems = document.querySelectorAll('.feature-item');
        featureItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(30px)';
            item.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
            observer.observe(item);
        });

        // Observe CTA section
        const ctaSection = document.querySelector('.cta-section');
        if (ctaSection) {
            ctaSection.style.opacity = '0';
            ctaSection.style.transform = 'translateY(30px)';
            ctaSection.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';

            observer.observe(ctaSection);
        }
    }

    showNotification(message, type = 'info') {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <span class="notification-icon">${this.getNotificationIcon(type)}</span>
                <span class="notification-text">${message}</span>
            </div>
        `;

        // Style the notification
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            backgroundColor: type === 'info' ? '#f7931a' : '#4CAF50',
            color: 'white',
            padding: '16px 20px',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
            zIndex: '10000',
            fontSize: '14px',
            fontWeight: '500',
            maxWidth: '400px',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)'
        });

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);

        // Auto remove after 4 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        switch(type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
            default:
                return 'ℹ';
        }
    }
}

// Add notification styles to head
const notificationStyles = `
    .notification-content {
        display: flex;
        align-items: center;
        gap: 12px;
    }

    .notification-icon {
        font-size: 18px;
        font-weight: bold;
    }

    .notification-text {
        flex: 1;
        line-height: 1.4;
    }
`;

const style = document.createElement('style');
style.textContent = notificationStyles;
document.head.appendChild(style);

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new BitcoinWriter();
});

// Export for potential use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = BitcoinWriter;
}
