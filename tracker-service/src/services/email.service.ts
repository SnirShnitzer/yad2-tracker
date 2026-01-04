import nodemailer, { Transporter } from 'nodemailer';
import { AdData, EmailConfig, MailOptions } from '../types.js';
import { Logger } from '../utils/logger.js';
import { validateEmailConfig } from '../utils/helpers.js';
import { DatabaseService } from './database.service.js';

/**
 * Service for sending email notifications
 */
export class EmailService {
    private transporter: Transporter | null = null;
    private databaseService: DatabaseService | null = null;

    constructor(private emailConfig: EmailConfig, databaseService?: DatabaseService) {
        this.databaseService = databaseService || null;
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
     * Get email settings from database
     */
    private async getEmailSettings(): Promise<{ sendEmails: boolean; recipients: string }> {
        if (!this.databaseService) {
            // Fallback to environment variables if no database
            return {
                sendEmails: process.env.SEND_EMAILS !== 'false' && process.env.SEND_EMAILS !== '0',
                recipients: process.env.EMAIL_RECIPIENTS || process.env.GMAIL_USER || ''
            };
        }

        try {
            const client = await this.databaseService.getClient();
            const result = await client.query('SELECT key, value FROM settings WHERE key IN ($1, $2)', ['send_emails', 'email_recipients']);
            
            const settings: Record<string, string> = {};
            result.rows.forEach(row => {
                settings[row.key] = row.value;
            });

            return {
                sendEmails: settings.send_emails === 'true',
                recipients: settings.email_recipients || process.env.EMAIL_RECIPIENTS || process.env.GMAIL_USER || ''
            };
        } catch (error) {
            Logger.warning('Failed to get email settings from database, using environment variables');
            return {
                sendEmails: process.env.SEND_EMAILS !== 'false' && process.env.SEND_EMAILS !== '0',
                recipients: process.env.EMAIL_RECIPIENTS || process.env.GMAIL_USER || ''
            };
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

        // Get email settings from database
        const emailSettings = await this.getEmailSettings();

        // Check if email sending is disabled
        if (!emailSettings.sendEmails) {
            Logger.info(`📧 שליחת אימייל מבוטלת - היו נשלחים ${newAds.length} דירות חדשות`);
            return;
        }

        if (!this.transporter) {
            Logger.error('Email configuration missing. Please set GMAIL_USER and GMAIL_APP_PASSWORD environment variables');
            return;
        }

        if (!emailSettings.recipients) {
            Logger.warning('No email recipients configured');
            return;
        }

        try {
            const subject = `🏠 ${newAds.length} דירות חדשות נמצאו ביד2!`;
            const htmlBody = this.generateEmailBody(newAds);
            
            const mailOptions: MailOptions = {
                from: process.env.GMAIL_USER!,
                to: emailSettings.recipients,
                subject: subject,
                html: htmlBody
            };

            await this.transporter!.sendMail(mailOptions);
            Logger.email(`Email sent to: ${emailSettings.recipients}`);
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
