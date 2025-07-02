// package com.vinayak.email_reader.service;

// import com.vinayak.email_reader.model.EmailSummary;
// import jakarta.mail.*;
// import jakarta.mail.internet.MimeMultipart;
// import jakarta.mail.search.FlagTerm;

// import org.springframework.stereotype.Service;

// import java.text.SimpleDateFormat;
// import java.util.*;

// @Service
// public class EmailService {

//    public List<EmailSummary> fetchUnreadToday(String user, String appPassword) throws Exception {
//     Properties props = new Properties();
//     props.put("mail.store.protocol", "imaps");

//     Session session = Session.getInstance(props);
//     Store store = session.getStore();
//     store.connect("imap.gmail.com", user, appPassword);

//     Folder inbox = store.getFolder("INBOX");
//     inbox.open(Folder.READ_ONLY);

//     // 1. Search only unread messages (fast server-side search)
//     Flags seen = new Flags(Flags.Flag.SEEN);
//     FlagTerm unseenFlagTerm = new FlagTerm(seen, false);
//     Message[] unseenMessages = inbox.search(unseenFlagTerm);

//     // 2. Sort messages by most recent
//     Arrays.sort(unseenMessages, (a, b) -> {
//         try {
//             return b.getSentDate().compareTo(a.getSentDate());
//         } catch (MessagingException e) {
//             return 0;
//         }
//     });

//     // 3. Prepare formatter for date comparison
//     SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
//     String today = sdf.format(new Date());

//     // 4. Collect only top 20 unread messages from today
//     List<EmailSummary> summaries = new ArrayList<>();
//     for (int i = 0; i < unseenMessages.length && summaries.size() < 20; i++) {
//         Message msg = unseenMessages[i];
//         String msgDate = sdf.format(msg.getSentDate());
//         if (msgDate.equals(today)) {
//             summaries.add(new EmailSummary(msg.getSubject(), msgDate));
//         }
//     }

//     inbox.close(false);
//     store.close();
//     return summaries;
// }



//     public String readEmailBody(String user, String appPassword, String subjectToMatch) throws Exception {
//         Properties props = new Properties();
//         props.put("mail.store.protocol", "imaps");

//         Session session = Session.getInstance(props);
//         Store store = session.getStore();
//         store.connect("imap.gmail.com", user, appPassword);

//         Folder inbox = store.getFolder("INBOX");
//         inbox.open(Folder.READ_ONLY);

//         Message[] messages = inbox.getMessages();
//         for (int i = messages.length - 1; i >= 0; i--) {
//             Message msg = messages[i];
//             if (!msg.isSet(Flags.Flag.SEEN) && msg.getSubject().equalsIgnoreCase(subjectToMatch)) {
//                 Object content = msg.getContent();
//                 if (content instanceof String) {
//                     return (String) content;
//                 } else if (content instanceof MimeMultipart) {
//                     MimeMultipart multipart = (MimeMultipart) content;
//                     StringBuilder sb = new StringBuilder();
//                     for (int j = 0; j < multipart.getCount(); j++) {
//                         BodyPart bodyPart = multipart.getBodyPart(j);
//                         sb.append(bodyPart.getContent().toString());
//                     }
//                     return sb.toString();
//                 }
//             }
//         }

//         inbox.close(false);
//         store.close();
//         return "Email not found.";
//     }
// }




package com.vinayak.email_reader.service;

import com.vinayak.email_reader.model.EmailSummary;
import jakarta.mail.*;
import jakarta.mail.internet.MimeMultipart;
import jakarta.mail.search.FlagTerm;
import org.springframework.stereotype.Service;

import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class EmailService {

    /**
     * Fetches top 20 unread emails from today.
     * Only returns subject and date (no body), using IMAP header fetch.
     */
    public List<EmailSummary> fetchUnreadToday(String user, String appPassword) throws Exception {
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");
        props.put("mail.imap.connectiontimeout", "5000");
        props.put("mail.imap.timeout", "10000");
        props.put("mail.imap.writetimeout", "5000");

        Session session = Session.getInstance(props);
        Store store = session.getStore();
        store.connect("imap.gmail.com", user, appPassword);

        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        // Fetch only unread messages
        Flags seen = new Flags(Flags.Flag.SEEN);
        FlagTerm unseenFlagTerm = new FlagTerm(seen, false);
        Message[] unseenMessages = inbox.search(unseenFlagTerm);

        // Fetch only headers (fast)
        FetchProfile fp = new FetchProfile();
        fp.add(FetchProfile.Item.ENVELOPE);
        inbox.fetch(unseenMessages, fp);

        // Sort most recent first
        Arrays.sort(unseenMessages, Comparator.comparing((Message m) -> {
            try {
                return m.getSentDate();
            } catch (MessagingException e) {
                return new Date(0);
            }
        }).reversed());

        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd");
        String today = sdf.format(new Date());

        List<EmailSummary> summaries = new ArrayList<>();
        for (int i = 0; i < unseenMessages.length && summaries.size() < 20; i++) {
            Message msg = unseenMessages[i];
            String msgDate = sdf.format(msg.getSentDate());
            if (msgDate.equals(today)) {
                summaries.add(new EmailSummary(msg.getSubject(), msgDate));
            }
        }

        inbox.close(false);
        store.close();
        return summaries;
    }

    /**
     * Reads full body of one specific unread email matching subject.
     */
    public String readEmailBody(String user, String appPassword, String subjectToMatch) throws Exception {
        Properties props = new Properties();
        props.put("mail.store.protocol", "imaps");

        Session session = Session.getInstance(props);
        Store store = session.getStore();
        store.connect("imap.gmail.com", user, appPassword);

        Folder inbox = store.getFolder("INBOX");
        inbox.open(Folder.READ_ONLY);

        // Only search unread messages (faster than scanning all)
        Flags seen = new Flags(Flags.Flag.SEEN);
        FlagTerm unseenFlagTerm = new FlagTerm(seen, false);
        Message[] messages = inbox.search(unseenFlagTerm);

        for (int i = messages.length - 1; i >= 0; i--) {
            Message msg = messages[i];
            if (msg.getSubject() != null && msg.getSubject().equalsIgnoreCase(subjectToMatch)) {
                Object content = msg.getContent();
                if (content instanceof String) {
                    return (String) content;
                } else if (content instanceof MimeMultipart) {
                    MimeMultipart multipart = (MimeMultipart) content;
                    StringBuilder sb = new StringBuilder();
                    for (int j = 0; j < multipart.getCount(); j++) {
                        BodyPart bodyPart = multipart.getBodyPart(j);
                        sb.append(bodyPart.getContent().toString());
                    }
                    return sb.toString();
                }
            }
        }

        inbox.close(false);
        store.close();
        return "Email not found.";
    }
}
