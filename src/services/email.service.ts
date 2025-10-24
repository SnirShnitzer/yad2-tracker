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
        if (validateEmailConfig()) {
            this.transporter = nodemailer.createTransport(this.emailConfig);
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

        if (!this.transporter) {
            Logger.error('Email configuration missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
            return;
        }

        try {
            const subject = `🏠 ${newAds.length} New Yad2 Rental Listings Found!`;
            const htmlBody = this.generateEmailBody(newAds);

            const mailOptions: MailOptions = {
                from: process.env.GMAIL_USER!,
                to: process.env.GMAIL_USER!, // Send to yourself
                subject: subject,
                html: htmlBody
            };

            await this.transporter.sendMail(mailOptions);
            Logger.email('Email sent');
        } catch (error) {
            Logger.error('Error sending email:', error as Error);
        }
    }

    /**
     * Generate HTML email body
     */
    private generateEmailBody(newAds: AdData[]): string {
        let htmlBody = `
            <h2>New Rental Listings Found</h2>
            <p>Found ${newAds.length} new rental listings that match your criteria:</p>
            <ul>
        `;

        newAds.forEach(ad => {
            htmlBody += `
                <li>
                    <strong><a href="${ad.link}">${ad.title}</a></strong><br>
                    <strong>Price:</strong> ${ad.price}<br>
                    <strong>Location:</strong> ${ad.location}<br>
                    <strong>Description:</strong> ${ad.description}<br>
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
