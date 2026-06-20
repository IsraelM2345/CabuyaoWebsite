<!doctype html>
<html lang="en">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Contact Reply</title>
</head>
<body style="font-family: Arial, Helvetica, sans-serif; background:#f8fafc; margin:0; padding:24px;">
    <div style="max-width:640px; margin:0 auto; background:#ffffff; border:1px solid #e5e7eb; border-radius:12px; padding:24px;">
        <h2 style="margin:0 0 16px 0; color:#0f172a;">City of Cabuyao — Reply to Your Message</h2>

        <p style="margin:0 0 12px 0; color:#334155;">
            Hello <strong>{{ $name }}</strong>,
        </p>

        <p style="margin:0 0 16px 0; color:#334155;">
            Your inquiry has been addressed. Below is the staff reply:
        </p>

        <div style="margin:0 0 16px 0; padding:14px; background:#f1f5f9; border:1px solid #e2e8f0; border-radius:10px;">
            <p style="margin:0 0 8px 0; font-weight:700; color:#0f172a;">Subject</p>
            <p style="margin:0; color:#0f172a;">{{ $subject }}</p>
        </div>

        <div style="margin:0 0 16px 0; padding:14px; background:#ffffff; border:1px solid #e2e8f0; border-radius:10px;">
            <p style="margin:0 0 8px 0; font-weight:700; color:#0f172a;">Staff Reply</p>
            <p style="margin:0; color:#0f172a; white-space:pre-wrap;">{{ $reply_text }}</p>
        </div>

        <p style="margin:0 0 4px 0; color:#334155; font-size:13px;">
            Reference ID: <strong>{{ $reference_id }}</strong>
        </p>

        <p style="margin:14px 0 0 0; color:#6b7280; font-size:12px;">
            This email was sent automatically by the City Government E-Governance Portal.
        </p>
    </div>
</body>
</html>

