# Mailer
## The mailer server of uShare

This server take care of sending email when it is needed.

When we need to send an email to a user, our mains servers create a document into the mail collection into MongoDB. Then the mailer server see it, send the corresponding mail then the document is marked as sended.