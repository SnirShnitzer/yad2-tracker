/**
 * Logger utility for consistent console output
 */
export class Logger {
    static info(message: string): void {
        console.log(`ℹ️  ${message}`);
    }

    static success(message: string): void {
        console.log(`✅ ${message}`);
    }

    static warning(message: string): void {
        console.log(`⚠️  ${message}`);
    }

    static error(message: string, error?: Error): void {
        console.error(`❌ ${message}`);
        if (error) {
            console.error(error);
        }
    }

    static debug(message: string): void {
        console.log(`🐛 ${message}`);
    }

    static start(message: string): void {
        console.log(`🚀 ${message}`);
    }

    static schedule(message: string): void {
        console.log(`⏰ ${message}`);
    }

    static email(message: string): void {
        console.log(`📧 ${message}`);
    }
}
