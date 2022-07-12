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
        const response = await fetchResponse.blob()
        const blob = response.slice(0, response.size, "image/png")
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png");
        document.body.appendChild(link);
        link.click();
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
        const response = await fetchResponse.blob()
        const blob = response.slice(0, response.size, "image/png")
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "image.png");
        document.body.appendChild(link);
        link.click();
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
