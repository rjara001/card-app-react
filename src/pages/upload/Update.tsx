
import useDrivePicker from "react-google-drive-picker/dist/index.js";

var CLIENT_ID = process.env.REACT_APP_PUBLIC_GOOGLE_CLIENT_ID || '';
var API_KEY = process.env.REACT_APP_GOOGLE_DRIVE_API_KEY || '';

export const FileUpload = () => {
    const [openPicker, authResponse] = useDrivePicker();
    // const customViewsArray = [new google.picker.DocsView()]; // custom view
    const handleOpenPicker = () => {
        openPicker({
            clientId: CLIENT_ID,
            developerKey: API_KEY,
            viewId: "DOCS",
            // token: token, // pass oauth token in case you already have one
            showUploadView: true,
            showUploadFolders: true,
            supportDrives: true,
            multiselect: true,
            // customViews: customViewsArray, // custom view
            callbackFunction: (data) => {
                if (data.action === 'cancel') {
                    console.log('User clicked cancel/close button')
                }
                console.log(data)
            },
        })
    };

    return (
        <div>
            <button onClick={() => handleOpenPicker()}>Open Picker</button>
        </div>
    );
}
