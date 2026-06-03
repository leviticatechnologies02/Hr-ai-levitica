// Email Service for sending emails
import { BASE_URL, API_ENDPOINTS } from "../constants/api.config";

/**
 * Send email via API
 * @param {Object} emailData - Email data object
 * @param {string|string[]} emailData.to - Recipient email(s)
 * @param {string} emailData.subject - Email subject
 * @param {string} emailData.body - Email body/content
 * @param {string|string[]} emailData.cc - CC email(s) (optional)
 * @param {string|string[]} emailData.bcc - BCC email(s) (optional)
 * @param {Array} emailData.attachments - Attachments array (optional)
 * @returns {Promise<Object>} Response from API
 */
export const sendEmail = async (emailData) => {
  const {
    to,
    subject,
    body,
    cc = null,
    bcc = null,
    attachments = [],
    html = false
  } = emailData;

  try {
    // Get auth token
    const token = localStorage.getItem('token');

    // Prepare email payload
    const payload = {
      to_email: Array.isArray(to) ? to : [to],
      subject: subject,
      body: body,
      is_html: html,
      ...(cc && { cc_email: Array.isArray(cc) ? cc : [cc] }),
      ...(bcc && { bcc_email: Array.isArray(bcc) ? bcc : [bcc] }),
      ...(attachments.length > 0 && { attachments })
    };

    // Send email via API
    const response = await fetch(`${BASE_URL}${API_ENDPOINTS.EMAIL.SEND}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      },
      body: JSON.stringify(payload)
    });

    if (response.ok) {
      const result = await response.json();
      return {
        success: true,
        message: 'Email sent successfully',
        data: result
      };
    } else {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.detail || errorData.message || `Failed to send email: ${response.status}`);
    }
  } catch (error) {
    console.error('Email sending error:', error);
    return {
      success: false,
      message: error.message || 'Failed to send email',
      error: error
    };
  }
};

/**
 * Send bulk emails to multiple recipients
 * @param {Array} recipients - Array of recipient objects {email, name, ...}
 * @param {string} subject - Email subject
 * @param {Function} bodyTemplate - Function that generates email body for each recipient
 * @param {Object} options - Additional options
 * @returns {Promise<Object>} Result with success count and failures
 */
export const sendBulkEmails = async (recipients, subject, bodyTemplate, options = {}) => {
  const results = {
    total: recipients.length,
    success: 0,
    failed: 0,
    errors: []
  };

  for (const recipient of recipients) {
    try {
      const body = typeof bodyTemplate === 'function' 
        ? bodyTemplate(recipient) 
        : bodyTemplate;

      const emailData = {
        to: recipient.email,
        subject: subject,
        body: body,
        ...options
      };

      const result = await sendEmail(emailData);
      
      if (result.success) {
        results.success++;
      } else {
        results.failed++;
        results.errors.push({
          recipient: recipient.email,
          error: result.message
        });
      }
    } catch (error) {
      results.failed++;
      results.errors.push({
        recipient: recipient.email,
        error: error.message
      });
    }
  }

  return results;
};

/**
 * Copy email content to clipboard (fallback method)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {Promise<boolean>} Success status
 */
export const copyEmailToClipboard = async (to, subject, body) => {
  try {
    const emailContent = `To: ${to}\nSubject: ${subject}\n\n${body}`;
    await navigator.clipboard.writeText(emailContent);
    return true;
  } catch (error) {
    console.error('Failed to copy to clipboard:', error);
    return false;
  }
};

/**
 * Generate mailto link (alternative method)
 * @param {string} to - Recipient email
 * @param {string} subject - Email subject
 * @param {string} body - Email body
 * @returns {string} mailto URL
 */
export const generateMailtoLink = (to, subject, body) => {
  const params = new URLSearchParams({
    subject: subject,
    body: body
  });
  return `mailto:${to}?${params.toString()}`;
};

const emailService = {
  sendEmail,
  sendBulkEmails,
  copyEmailToClipboard,
  generateMailtoLink
};

export default emailService;

