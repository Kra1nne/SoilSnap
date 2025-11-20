import rateLimit from 'express-rate-limit';

// Login rate limiter - more restrictive
export const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 5, // Limit each IP to 5 login requests per windowMs
    message: {
        error: "Too many login attempts from this IP, please try again after 15 minutes."
    },
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    // Skip successful requests
    skipSuccessfulRequests: true,
    // Custom key generator (optional) - you can use IP + email for more granular control
    keyGenerator: (req) => {
        return req.ip; // Rate limit by IP address
    },
    // Optional: Custom handler for when limit is exceeded
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many login attempts from this IP, please try again after 15 minutes.",
            retryAfter: Math.round(req.rateLimit.resetTime - Date.now() / 1000)
        });
    }
});

// General API rate limiter - less restrictive
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 1000, 
    message: {
        error: "Too many requests from this IP, please try again later."
    },
    standardHeaders: true,
    legacyHeaders: false,
});

// Password reset rate limiter
export const passwordResetLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 3, // Limit each IP to 3 password reset requests per hour
    message: {
        error: "Too many password reset attempts from this IP, please try again after 1 hour."
    },
    standardHeaders: true,
    legacyHeaders: false,
    keyGenerator: (req) => {
        return req.ip;
    },
    handler: (req, res) => {
        res.status(429).json({
            success: false,
            message: "Too many password reset attempts from this IP, please try again after 1 hour.",
            retryAfter: Math.round(req.rateLimit.resetTime - Date.now() / 1000)
        });
    }
});
