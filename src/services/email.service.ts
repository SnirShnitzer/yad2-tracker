import nodemailer, { Transporter } from 'nodemailer';
import { AdData, EmailConfig, MailOptions } from '../types.js';
import { Logger } from '../utils/logger.js';
import { validateEmailConfig } from '../utils/helpers.js';

/**
 * Service for sending email notifications
 */
export class EmailService {
    private transporter: Transporter | null = null;

    constructor(private emailConfig: EmailConfig) {
        this.initializeTransporter();
    }

    /**
     * Initialize email transporter
     */
    private initializeTransporter(): void {
        // Debug environment variables
        Logger.debug(`GMAIL_USER: ${process.env.GMAIL_USER ? 'Set' : 'Not set'}`);
        Logger.debug(`GMAIL_APP_PASSWORD: ${process.env.GMAIL_APP_PASSWORD ? 'Set' : 'Not set'}`);
        
        if (validateEmailConfig()) {
            // Create a fresh config with current environment variables
            const currentConfig = {
                service: 'gmail',
                auth: {
                    user: process.env.GMAIL_USER,
                    pass: process.env.GMAIL_APP_PASSWORD
                }
            };
            
            this.transporter = nodemailer.createTransport(currentConfig);
            Logger.success('Email transporter initialized');
        } else {
            Logger.warning('Email configuration missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
        }
    }

    /**
     * Send email notification with new ads
     */
    public async sendEmailNotification(newAds: AdData[]): Promise<void> {
        if (newAds.length === 0) {
            Logger.info('No new ads to notify about');
            return;
        }

        // Check if email sending is disabled via environment variable
        if (process.env.SEND_EMAILS === 'false' || process.env.SEND_EMAILS === '0') {
            Logger.info(`📧 שליחת אימייל מבוטלת (SEND_EMAILS=false) - היו נשלחים ${newAds.length} דירות חדשות`);
            return;
        }

        if (!this.transporter) {
            Logger.error('Email configuration missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
            return;
        }

        try {
            const subject = `🏠 ${newAds.length} דירות חדשות נמצאו ביד2!`;
            const htmlBody = this.generateEmailBody(newAds);

            // Get recipients from environment variable or default to GMAIL_USER
            const recipients = process.env.EMAIL_RECIPIENTS || process.env.GMAIL_USER!;
            
            const mailOptions: MailOptions = {
                from: process.env.GMAIL_USER!,
                to: recipients, // Send to specified recipients
                subject: subject,
                html: htmlBody
            };

            await this.transporter!.sendMail(mailOptions);
            Logger.email('Email sent');
        } catch (error) {
            Logger.error('Error sending email:', error as Error);
        }
    }

    /**
     * Generate HTML email body in Hebrew
     */
    private generateEmailBody(newAds: AdData[]): string {
        let htmlBody = `
            <h2>דירות חדשות נמצאו</h2>
            <p>נמצאו ${newAds.length} דירות חדשות התואמות לקריטריונים שלך:</p>
            <ul>
        `;

            newAds.forEach(ad => {
                htmlBody += `
                    <li>
                        <strong><a href="${ad.link}">${ad.title}</a></strong><br>
                        <strong>מחיר:</strong> ${ad.price}<br>
                        <strong>כתובת:</strong> ${ad.address}<br>
                        <strong>פרטי לקוח:</strong> ${ad.description || 'פרטי'}<br>
                        <hr>
                    </li>
                `;
            });

        htmlBody += '</ul>';
        return htmlBody;
    }

    /**
     * Test email configuration
     */
    public async testEmailConfiguration(): Promise<boolean> {
        if (!this.transporter) {
            return false;
        }

        try {
            await this.transporter.verify();
            Logger.success('Email configuration is valid');
            return true;
        } catch (error) {
            Logger.error('Email configuration test failed:', error as Error);
            return false;
        }
    }
}
