import { Resend } from 'resend'
import { prisma } from '@valore/database'
import { format } from 'date-fns'

// Initialize Resend with a dummy key if not provided (for build purposes)
const resend = new Resend(process.env.RESEND_API_KEY || 're_dummy_key_for_build')

export interface EmailTemplate {
  subject: string
  html: string
  text?: string
}

export interface SendEmailParams {
  to: string | string[]
  template: EmailTemplate
  replyTo?: string
  attachments?: Array<{
    filename: string
    content: Buffer
    contentType?: string
  }>
}

/**
 * Send an email using Resend
 */
export async function sendEmail({
  to,
  template,
  replyTo = process.env.EMAIL_REPLY_TO || 'flyrentalsca@gmail.com',
  attachments = [],
}: SendEmailParams): Promise<string> {
  const { data, error } = await resend.emails.send({
    from: process.env.EMAIL_FROM || 'flyrentalsca@gmail.com',
    to: Array.isArray(to) ? to : [to],
    subject: template.subject,
    html: template.html,
    text: template.text,
    reply_to: replyTo,
    attachments,
  })
  
  if (error) {
    throw new Error(`Failed to send email: ${error.message}`)
  }
  
  return data?.id || ''
}

/**
 * Send booking confirmation email
 */
export async function sendBookingConfirmation(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      car: {
        include: {
          images: { take: 1 },
        },
      },
      addOns: {
        include: {
          addOn: true,
        },
      },
    },
  })
  
  if (!booking) {
    throw new Error('Booking not found')
  }
  
  const recipientEmail = booking.user?.email || booking.guestEmail
  if (!recipientEmail) {
    throw new Error('No recipient email found')
  }
  
  const template = generateBookingConfirmationTemplate(booking)
  
  try {
    const emailId = await sendEmail({
      to: recipientEmail,
      template,
    })
    
    // Log notification
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        channel: 'EMAIL',
        type: 'BOOKING_CONFIRMATION',
        subject: template.subject,
        content: template.html,
        status: 'SENT',
        sentAt: new Date(),
        metadata: { resendId: emailId },
      },
    })
  } catch (error) {
    // Log failed notification
    await prisma.notification.create({
      data: {
        userId: booking.userId,
        bookingId: booking.id,
        channel: 'EMAIL',
        type: 'BOOKING_CONFIRMATION',
        subject: template.subject,
        content: template.html,
        status: 'FAILED',
        failedAt: new Date(),
        failureReason: error instanceof Error ? error.message : 'Unknown error',
      },
    })
    
    throw error
  }
}

/**
 * Send pickup reminder email
 */
export async function sendPickupReminder(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
    include: {
      user: true,
      car: true,
    },
  })
  
  if (!booking || booking.status !== 'CONFIRMED') {
    return
  }
  
  const recipientEmail = booking.user?.email || booking.guestEmail
  if (!recipientEmail) {
    return
  }
  
  const template = generatePickupReminderTemplate(booking)
  
  await sendEmail({
    to: recipientEmail,
    template,
  })
}

/**
 * Generate booking confirmation email template
 */
function generateBookingConfirmationTemplate(booking: any): EmailTemplate {
  const pickupDate = format(booking.startDate, 'EEEE, MMMM d, yyyy')
  const returnDate = format(booking.endDate, 'EEEE, MMMM d, yyyy')
  const pickupTime = format(booking.startDate, 'h:mm a')
  const returnTime = format(booking.endDate, 'h:mm a')
  
  const subject = `Booking Confirmation - ${booking.car.displayName} | FlyRentals`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
      <style>
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          line-height: 1.6;
          color: #1a1a1a;
          background-color: #f5f5f5;
          margin: 0;
          padding: 0;
        }
        .container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
        }
        .header {
          background-color: #000000;
          color: #ffffff;
          padding: 40px 20px;
          text-align: center;
        }
        .header h1 {
          margin: 0;
          font-size: 28px;
          font-weight: 300;
          letter-spacing: 2px;
          text-transform: uppercase;
        }
        .content {
          padding: 40px 20px;
        }
        .booking-details {
          background-color: #f9f9f9;
          border: 1px solid #e5e5e5;
          border-radius: 8px;
          padding: 20px;
          margin: 20px 0;
        }
        .detail-row {
          display: flex;
          justify-content: space-between;
          padding: 10px 0;
          border-bottom: 1px solid #e5e5e5;
        }
        .detail-row:last-child {
          border-bottom: none;
        }
        .detail-label {
          font-weight: 600;
          color: #666;
        }
        .detail-value {
          text-align: right;
        }
        .car-image {
          width: 100%;
          max-width: 500px;
          height: auto;
          margin: 20px 0;
          border-radius: 8px;
        }
        .button {
          display: inline-block;
          background-color: #000000;
          color: #ffffff;
          padding: 12px 30px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: 600;
          letter-spacing: 1px;
          text-transform: uppercase;
          margin: 20px 0;
        }
        .footer {
          background-color: #f5f5f5;
          padding: 20px;
          text-align: center;
          font-size: 14px;
          color: #666;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>FlyRentals</h1>
          <p style="margin: 10px 0 0 0; font-size: 16px; font-weight: 300;">
            Your Luxury Experience Awaits
          </p>
        </div>
        
        <div class="content">
          <h2 style="font-size: 24px; font-weight: 300; margin-bottom: 10px;">
            Booking Confirmed
          </h2>
          <p>Dear ${booking.user?.name || booking.guestName || 'Valued Customer'},</p>
          <p>
            Thank you for choosing FlyRentals. Your booking for the 
            <strong>${booking.car.displayName}</strong> has been confirmed.
          </p>
          
          ${booking.car.images[0] ? `
            <img src="${booking.car.images[0].url}" alt="${booking.car.displayName}" class="car-image">
          ` : ''}
          
          <div class="booking-details">
            <h3 style="margin-top: 0;">Booking Details</h3>
            <div class="detail-row">
              <span class="detail-label">Booking Number</span>
              <span class="detail-value">${booking.bookingNumber}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Vehicle</span>
              <span class="detail-value">${booking.car.displayName}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pickup Date</span>
              <span class="detail-value">${pickupDate} at ${pickupTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Return Date</span>
              <span class="detail-value">${returnDate} at ${returnTime}</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Pickup Location</span>
              <span class="detail-value">${
                booking.pickupType === 'DELIVERY' 
                  ? 'Delivery to your location' 
                  : 'FlyRentals Showroom'
              }</span>
            </div>
            <div class="detail-row">
              <span class="detail-label">Total Amount</span>
              <span class="detail-value" style="font-size: 18px; font-weight: 600;">
                $${booking.totalAmount.toFixed(2)}
              </span>
            </div>
          </div>
          
          ${booking.addOns.length > 0 ? `
            <div class="booking-details">
              <h3 style="margin-top: 0;">Selected Add-ons</h3>
              ${booking.addOns.map((item: any) => `
                <div class="detail-row">
                  <span class="detail-label">${item.addOn.name}</span>
                  <span class="detail-value">$${item.totalPrice.toFixed(2)}</span>
                </div>
              `).join('')}
            </div>
          ` : ''}
          
          <div style="text-align: center; margin: 40px 0;">
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/account/bookings/${booking.id}" class="button">
              View Booking
            </a>
          </div>
          
          <h3>What's Next?</h3>
          <ol>
            <li>You'll receive a reminder 24 hours before your pickup date</li>
            <li>Please bring your valid driver's license and the credit card used for booking</li>
            <li>Our concierge team is available 24/7 for any special requests</li>
          </ol>
          
          <p>
            If you have any questions or need to make changes to your booking, 
            please don't hesitate to contact us at 
            <a href="mailto:flyrentalsca@gmail.com">flyrentalsca@gmail.com</a> 
            or call us at +1 (438) 680-3936.
          </p>
        </div>
        
        <div class="footer">
          <p>© ${new Date().getFullYear()} FlyRentals. All rights reserved.</p>
          <p>
            This email was sent to ${booking.user?.email || booking.guestEmail}. 
            If you no longer wish to receive these emails, you can 
            <a href="${process.env.NEXT_PUBLIC_APP_URL}/unsubscribe">unsubscribe here</a>.
          </p>
        </div>
      </div>
    </body>
    </html>
  `
  
  const text = `
FlyRentals - Booking Confirmation

Dear ${booking.user?.name || booking.guestName || 'Valued Customer'},

Thank you for choosing FlyRentals. Your booking for the ${booking.car.displayName} has been confirmed.

BOOKING DETAILS
---------------
Booking Number: ${booking.bookingNumber}
Vehicle: ${booking.car.displayName}
Pickup Date: ${pickupDate} at ${pickupTime}
Return Date: ${returnDate} at ${returnTime}
Pickup Location: ${booking.pickupType === 'DELIVERY' ? 'Delivery to your location' : 'FlyRentals Showroom'}
Total Amount: $${booking.totalAmount.toFixed(2)}

WHAT'S NEXT?
------------
1. You'll receive a reminder 24 hours before your pickup date
2. Please bring your valid driver's license and the credit card used for booking
3. Our concierge team is available 24/7 for any special requests

If you have any questions or need to make changes to your booking, please contact us at flyrentalsca@gmail.com or call +1 (438) 680-3936.

© ${new Date().getFullYear()} FlyRentals. All rights reserved.
  `.trim()
  
  return { subject, html, text }
}

/**
 * Generate pickup reminder email template
 */
function generatePickupReminderTemplate(booking: any): EmailTemplate {
  const pickupDate = format(booking.startDate, 'EEEE, MMMM d, yyyy')
  const pickupTime = format(booking.startDate, 'h:mm a')
  
  const subject = `Pickup Reminder - ${booking.car.displayName} Tomorrow | FlyRentals`
  
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${subject}</title>
    </head>
    <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; line-height: 1.6; color: #1a1a1a; margin: 0; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto;">
        <h1 style="font-size: 24px; font-weight: 300;">Your ${booking.car.displayName} Awaits</h1>
        <p>Your luxury experience begins tomorrow!</p>
        
        <div style="background-color: #f9f9f9; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <p><strong>Pickup Time:</strong> ${pickupDate} at ${pickupTime}</p>
          <p><strong>Location:</strong> ${
            booking.pickupType === 'DELIVERY' 
              ? booking.deliveryAddress 
              : 'FlyRentals Showroom, 123 Luxury Avenue, Monaco'
          }</p>
        </div>
        
        <p>Remember to bring:</p>
        <ul>
          <li>Valid driver's license</li>
          <li>Credit card used for booking</li>
          <li>Booking confirmation (this email)</li>
        </ul>
        
        <p>Our team looks forward to providing you with an exceptional experience.</p>
        
        <p>Best regards,<br>The FlyRentals Team</p>
      </div>
    </body>
    </html>
  `
  
  return { subject, html }
}
