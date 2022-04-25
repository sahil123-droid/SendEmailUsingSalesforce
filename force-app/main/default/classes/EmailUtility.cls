public with sharing class EmailUtility {
    @AuraEnabled
    public static void sendEmail(List<String> emailTo, String emailSubject, String emailBody ,Id fileId){
        try{
            
            Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
            mail.setToAddresses(emailTo);
            mail.setSubject(emailSubject);
            mail.setPlainTextBody((emailBody==null?'This email body is empty':emailBody));
            if(fileId != null){
                ContentVersion file = ContentVersionSelector.getSpecificContentVersion(fileId);
                System.debug(file.title + '->' + file.versiondata);
                blob body = file.versiondata;
                Messaging.EmailFileAttachment attach = new Messaging.EmailFileAttachment();
                attach.setFileName(file.PathOnClient);
                attach.setInline(false);
                attach.setBody(body);
                mail.setFileAttachments(new Messaging.EmailFileAttachment[] { attach }); 
            }
            List<Messaging.SendEmailResult> results = Messaging.sendEmail(new Messaging.SingleEmailMessage[] { mail });  
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        
    }
}