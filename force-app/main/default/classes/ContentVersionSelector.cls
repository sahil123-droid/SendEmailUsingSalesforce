public with sharing class ContentVersionSelector {
    @AuraEnabled
    public static List<ContentVersion> getFilesFromSalesforce(){
        try {
            return [Select Id,title,PathOnClient,FileType,VersionData from ContentVersion];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }
    public static ContentVersion getSpecificContentVersion(Id fileId){
        ContentVersion file = [Select Id,title,PathOnClient,FileType,VersionData FROM ContentVersion where Id = :fileId LIMIT 1];
        return file;
    }
}
