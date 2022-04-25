public with sharing class ContactSelector {
    @AuraEnabled
    public static List<Contact> getContacts(){
        try{
            return [Select Id,Name,Phone,Email from Contact];
        }
        catch(Exception e){
            throw new AuraHandledException(e.getMessage());
        }
        
    }
}
