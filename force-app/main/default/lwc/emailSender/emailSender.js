import { LightningElement } from 'lwc';
import getContacts from '@salesforce/apex/ContactSelector.getContacts';
import getFiles from '@salesforce/apex/ContentVersionSelector.getFilesFromSalesforce';
import sendBulkEmail from '@salesforce/apex/EmailUtility.sendEmail';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
const columns = [
    { label : 'Id' , fieldName : 'Id' },
    { label: 'Name', fieldName: 'Name' },
    { label: 'Email', fieldName: 'Email', type: 'email' },
    { label: 'Phone', fieldName: 'Phone', type: 'phone' },
];
export default class EmailSender extends LightningElement {
    data;
    columns = columns;
    subject
    body;
    files;
    selectedFileLabel
    selectedFileId
    selectedRows;


    handleClick(){
        let emailString = [];
        this.selectedRows.forEach((each)=>{
            emailString.push(each.Email);
        })
        let fileId = this.selectedFileId != null || this.selectedFileId != undefined ? this.selectedFileId : null;
        sendBulkEmail({ emailTo: emailString, 
            emailSubject: this.subject, emailBody : this.body,fileId : fileId})
            .then(result => {
                const evt = new ShowToastEvent({
                    title: 'Email Sent Successfully',
                    message: 'Your Email Request to following contacts has been sent',
                    variant: 'success',
                });
                this.dispatchEvent(evt);
            })
            .catch(error => {
                const evt = new ShowToastEvent({
                    title: 'Oops ! some error occured',
                    message: 'there were some error encourted or occured while sending emails.This might be due to empty body or empty subject and many more reasons.',
                    variant: 'error',
                });
                this.dispatchEvent(evt);
            });
    }
    handleFileChange(event){
        this.selectedFileLabel = event.detail.label;
        this.selectedFileId = event.detail.value
        console.log(this.selectedFileId);
    }
    handleInputChange(event){
        this.subject = event.detail.value;
        console.log(this.subject);
    }
    handleChange(event){
        this.body = event.detail.value;
        console.log(this.body)
    }
    get acceptedFormats() {
        return ['.pdf', '.png','.txt','.csv','.xlsx','.docx'];
    }
    handleUploadFinished(event) {
        // Get the list of uploaded files
        const uploadedFiles = event.detail.files;
        alert('No. of files uploaded : ' + uploadedFiles.length);
    }
    connectedCallback(){
        getContacts()
            .then(result => {
                this.data = result;
                console.log(this.data);
            })
            .catch(error => {
                console.log(error);
            });

        getFiles()
            .then(result => {
                let temparray = [];
                result.forEach((each)=>{
                    temparray.push({ value : each.Id , label : each.PathOnClient})
                })
                this.files=[...temparray]
                console.log(this.files)
            })
            .catch(error => {
                console.log(error);
            });
    }
    getSelectedName(event) {
        const selectedRows = event.detail.selectedRows;
        for (let i = 0; i < selectedRows.length; i++) {
            console.log('You selected: ' + selectedRows[i].Id);
        }
        this.selectedRows= [...event.detail.selectedRows];
        console.log(this.selectedRows);
    }
}