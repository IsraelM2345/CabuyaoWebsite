<?php

namespace App\Mail;

use App\Models\PublicContactMessage;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Mail\Mailables\Address;
use Illuminate\Queue\SerializesModels;

class ContactReplyMail extends Mailable implements ShouldQueue
{
    use Queueable, SerializesModels;

    public PublicContactMessage $contact;
    public string $replyText;

    public function __construct(PublicContactMessage $contact)
    {
        $this->contact = $contact;
        $this->replyText = (string) $contact->reply;
    }

    public function envelope(): Envelope
    {
        return new Envelope(
            from: new Address(config('mail.from.address'), config('mail.from.name')),
            subject: 'City of Cabuyao — Reply to Your Message',
        );
    }

    public function content(): Content
    {
        return new Content(
            view: 'emails.contact_reply',
            with: [
                'name' => $this->contact->name,
                'subject' => $this->contact->subject,
                'reply_text' => $this->replyText,
                'reference_id' => $this->contact->id,
            ],
        );
    }

    public function build()
    {
        return $this->to($this->contact->email);
    }
}

