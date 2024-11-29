# React Native Shared Lists Application

This is a **React Native** application that enables users to manage personal and shared lists. Users can create, update, share, and join lists using invitation codes. The app is integrated with **Firebase Firestore** for real-time data storage and retrieval and supports **push notifications** to notify users when a list is shared.

---

## Features
- **User Onboarding**:
  - Username selection during the initial app setup.
  - Usernames stored using AsyncStorage for seamless login.

- **Personal Lists**:
  - Create, edit, delete, and manage personal lists.
  - Convert personal lists to shared lists with an invitation code.

- **Shared Lists**:
  - View lists shared by others.
  - See the owner's username for each shared list.
  - Join shared lists using invitation codes.

- **Push Notifications**:
  - Receive notifications when a list is shared.

- **Real-Time Updates**:
  - Shared Lists screen updates automatically upon list sharing.

---

## Screens
1. **Onboarding Screen**:
   - Prompts the user to set a unique username during the first app launch.

2. **My Lists Screen**:
   - Manage personal lists.
   - Share lists with other users using invitation codes.

3. **Shared Lists Screen**:
   - View and join lists shared by others.
   - Displays the owner's username for each shared list.

4. **List Details Screen**:
   - View and manage the contents of a specific list.

5. **Settings Screen**:
   - Placeholder for user settings and preferences.

---

## Technologies Used
- **React Native**: For building cross-platform mobile applications.
- **Firebase Firestore**: For cloud-based real-time database management.
- **Expo**: For streamlined app development and deployment.
- **AsyncStorage**: For local storage of user information.
- **Push Notifications**: Using Expo's notification service for updates.

---

## Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/your-repo/react-native-shared-lists.git
   cd react-native-shared-lists](https://github.com/sajibnet90/ShoppingList-ListSharing-FirebaseApp.git
   npm install
   ```

2.Set up Firebase:

Create a Firebase project.
Enable Firestore and push notifications in your Firebase console.
Download the google-services.json (for Android) and GoogleService-Info.plist (for iOS) files and place them in the appropriate folders.

3.Start the Metro bundler:
npm start

4. Choose the platform

