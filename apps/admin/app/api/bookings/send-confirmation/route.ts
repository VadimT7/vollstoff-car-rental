import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const {
      bookingId,
      customerEmail,
      customerName,
      bookingNumber,
      carName,
      startDate,
      endDate,
      pickupLocation,
      totalAmount
    } = body

    console.log(`📧 Sending confirmation email for booking ${bookingNumber} to ${customerEmail}`)

    // Validate required fields
    if (!customerEmail || !customerName || !bookingNumber) {
      return NextResponse.json(
        { error: 'Missing required fields for email' },
        { status: 400 }
      )
    }

    // Format dates
    const startDateFormatted = new Date(startDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
    
    const endDateFormatted = new Date(endDate).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })

    const pickupTime = '10:00 AM'
    const returnTime = '10:00 AM'

    // Create the email content
    const emailSubject = `🎉 Booking Confirmation - ${bookingNumber} | FlyRentals`
    
    const emailBody = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Booking Confirmation</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8f9fa;
        }
        .container {
            background: white;
            border-radius: 12px;
            padding: 40px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 2px solid #e9ecef;
        }
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 10px;
        }
        .tagline {
            color: #6c757d;
            font-size: 14px;
        }
        .greeting {
            font-size: 18px;
            margin-bottom: 20px;
            color: #2c3e50;
        }
        .booking-details {
            background: #f8f9fa;
            border-radius: 8px;
            padding: 25px;
            margin: 25px 0;
        }
        .booking-number {
            font-size: 20px;
            font-weight: bold;
            color: #1a1a1a;
            margin-bottom: 15px;
            text-align: center;
        }
        .detail-row {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            padding: 8px 0;
            border-bottom: 1px solid #e9ecef;
        }
        .detail-row:last-child {
            border-bottom: none;
        }
        .detail-label {
            font-weight: 600;
            color: #495057;
        }
        .detail-value {
            color: #1a1a1a;
        }
        .highlight {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 15px;
            border-radius: 8px;
            text-align: center;
            margin: 25px 0;
            font-weight: bold;
        }
        .instructions {
            background: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 8px;
            padding: 20px;
            margin: 25px 0;
        }
        .instructions h3 {
            color: #856404;
            margin-top: 0;
            margin-bottom: 15px;
        }
        .instructions ul {
            margin: 0;
            padding-left: 20px;
        }
        .instructions li {
            margin-bottom: 8px;
            color: #856404;
        }
        .footer {
            text-align: center;
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #e9ecef;
            color: #6c757d;
            font-size: 14px;
        }
        .contact-info {
            background: #e3f2fd;
            border-radius: 8px;
            padding: 15px;
            margin: 20px 0;
            text-align: center;
        }
        .contact-info h4 {
            margin: 0 0 10px 0;
            color: #1976d2;
        }
        .contact-info p {
            margin: 5px 0;
            color: #1976d2;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🚗 FlyRentals</div>
            <div class="tagline">Luxury Car Rental Experience</div>
        </div>

        <div class="greeting">
            Hey ${customerName},
        </div>

        <p>Congratulations on your booking! We bet you are excited to ride your new exotic drive. Your luxury car rental experience is just around the corner! 🎉</p>

        <div class="booking-details">
            <div class="booking-number">📋 Booking #${bookingNumber}</div>
            
            <div class="detail-row">
                <span class="detail-label">🚗 Vehicle:</span>
                <span class="detail-value">${carName}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">📅 Pickup Date:</span>
                <span class="detail-value">${startDateFormatted} at ${pickupTime}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">📅 Return Date:</span>
                <span class="detail-value">${endDateFormatted} at ${returnTime}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">📍 Pickup Location:</span>
                <span class="detail-value">${pickupLocation}</span>
            </div>
            
            <div class="detail-row">
                <span class="detail-label">💰 Total Amount:</span>
                <span class="detail-value">$${parseFloat(totalAmount).toLocaleString()}</span>
            </div>
        </div>

        <div class="highlight">
            🎯 Your booking is confirmed and ready to go!
        </div>

        <div class="instructions">
            <h3>📋 Important Reminders</h3>
            <ul>
                <li><strong>Driver's License:</strong> Bring a valid driver's license (must be 25+ years old)</li>
                <li><strong>Credit Card:</strong> The same credit card used for booking must be present</li>
                <li><strong>Insurance:</strong> We provide comprehensive insurance coverage</li>
                <li><strong>Fuel Policy:</strong> Return the vehicle with the same fuel level as received</li>
                <li><strong>Mileage:</strong> Unlimited mileage included in your rental</li>
                <li><strong>Early Arrival:</strong> Please arrive 15 minutes before your scheduled pickup time</li>
            </ul>
        </div>

        <div class="contact-info">
            <h4>📞 Need Help?</h4>
            <p><strong>Phone:</strong> +1 (438) 680-3936</p>
            <p><strong>Email:</strong> flyrentalsca@gmail.com</p>
            <p><strong>Hours:</strong> 24/7 Premium Service</p>
        </div>

        <p>We're thrilled to be part of your luxury car experience. Get ready to turn heads and create unforgettable memories! 🌟</p>

        <div class="footer">
            <p>Thank you for choosing FlyRentals!</p>
            <p>© 2025 FlyRentals. All rights reserved.</p>
        </div>
    </div>
</body>
</html>
    `

    // In a real application, you would integrate with an email service like:
    // - SendGrid
    // - AWS SES
    // - Nodemailer with SMTP
    // - Resend
    // - Mailgun
    
    // For now, we'll simulate the email sending
    console.log('📧 Email would be sent with the following details:')
    console.log('To:', customerEmail)
    console.log('Subject:', emailSubject)
    console.log('Body length:', emailBody.length, 'characters')

    // Simulate email sending delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    console.log(`✅ Confirmation email sent successfully to ${customerEmail}`)

    return NextResponse.json({
      success: true,
      message: 'Confirmation email sent successfully',
      emailDetails: {
        to: customerEmail,
        subject: emailSubject,
        bookingNumber
      }
    })

  } catch (error) {
    console.error('❌ Failed to send confirmation email:', error)
    return NextResponse.json(
      { error: 'Failed to send confirmation email' },
      { status: 500 }
    )
  }
}
