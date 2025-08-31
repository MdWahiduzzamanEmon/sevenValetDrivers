# Firebase Setup Instructions

## Security Notice

The `google-services.json` file contains sensitive API keys and should never be committed to version control.

## Setup Steps

1. **Download your Firebase configuration:**

   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Select your project: "seven-valet-drivers"
   - Go to Project Settings
   - Download the `google-services.json` file for Android

2. **Place the file:**

   - Copy the downloaded `google-services.json` to `android/app/`
   - The file should contain your actual API keys and project information

3. **Verify the file structure:**
   ```json
   {
     "project_info": {
       "project_number": "433118017041",
       "project_id": "seven-valet-drivers",
       "storage_bucket": "seven-valet-drivers.firebasestorage.app"
     },
     "client": [
       {
         "client_info": {
           "mobilesdk_app_id": "1:433118017041:android:d84c85f013bd828118e3b0",
           "android_client_info": {
             "package_name": "com.sevenvaletdrivers"
           }
         },
         "oauth_client": [],
         "api_key": [
           {
             "current_key": "YOUR_ACTUAL_API_KEY"
           }
         ],
         "services": {
           "appinvite_service": {
             "other_platform_oauth_client": []
           }
         }
       }
     ],
     "configuration_version": "1"
   }
   ```

## Important Security Notes

- Never commit `google-services.json` to git
- The API key in this file should be restricted in Firebase Console
- Regularly rotate your API keys
- Monitor usage in Firebase Console for unauthorized access

## API Key Restrictions (Recommended)

In Firebase Console > Project Settings > General > Web API Key:

1. Set HTTP referrers restrictions
2. Limit to specific Android apps
3. Enable only necessary APIs
