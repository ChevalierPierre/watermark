class FileService {
    private file: File;
    private text: string;

    constructor(file: File, text: string) {
        this.file = file;
        this.text = text;
    }

    static getFileExtension(fileName: string): string {
        const fileNames: Array<string> = fileName.split('.');

        if (fileNames.length === 0) {
            return '';
        }

        return fileNames[fileNames.length - 1];
    }

    async embedFile() {
        const fetchResponse = await fetch('http://localhost:8080/embedFile', {
            method: 'POST',
            body: this.getFormData(),
        })
        if (fetchResponse.ok != true) {
            return "error";
        }
        const url = await fetchResponse.text();
        console.log('Received URL:', url);

        // Create a link element for downloading
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'image.png'); // Set the desired filename
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Clean up the link
        document.body.removeChild(link);
        return url;
    }

    async decryptFile() {
        const fetchResponse = await fetch('http://localhost:8080/decryptFile', {
            method: 'POST',
            body: this.getFormData(),

        })
        if (fetchResponse.ok != true) {
            return "error";
        }
        const url = await fetchResponse.text();
        console.log('Received URL:', url);

        // Create a link element for downloading
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'image.png'); // Set the desired filename
        document.body.appendChild(link);

        // Simulate a click on the link to trigger the download
        link.click();

        // Clean up the link
        document.body.removeChild(link);
        return url;
    }

    private getFormData(): FormData {
        const formData = new FormData();
        formData.append('file', this.file);
        formData.append('text', this.text);
        return formData;
    }
}



export default FileService;
