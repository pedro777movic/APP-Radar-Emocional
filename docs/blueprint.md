# **App Name**: Emotional Radar

## Core Features:

- Local Login: Secure local login with a 4-digit PIN or 'Guest' mode.
- Interactive Quiz: A short quiz (4 questions by default) to assess the user's emotional state. Loads questions from `/assets/content.json`.
- Emotional Analysis: Calculates an emotional balance score based on quiz responses and determines an emotional level (Low, Medium, High) using data from `/assets/content.json`.
- Personalized Action Plan: Displays a 3-step action plan tailored to the user's emotional level using content from `/assets/content.json`.
- Toolkit Access: Provides access to helpful message templates and phrases, loaded from `/assets/content.json`.
- Settings Management: Allows users to clear local data and change their PIN.
- Local Data Persistence: Utilizes IndexedDB/SQLite/SecureStorage to store user data locally, encrypted with AES. Supports data deletion and optional local data export.

## Style Guidelines:

- Background: Dark gray (#0B0F16) to provide a calm and focused environment.
- Primary: Vibrant blue (#1E6FFF) to evoke trust and confidence.
- Accent: Soft purple (#8A6EF0) adds a premium, feminine touch to key elements.
- Highlight: Delicate pink (#FFC6E7) used sparingly for details.
- Text Primary: Off-white (#E6EDF3) ensures readability against the dark background.
- Text Secondary: Light gray (#98A3B3) for less prominent text.
- Headline font: 'Poppins' (sans-serif) for headlines, providing a smooth and readable appearance. Note: currently only Google Fonts are supported.
- Body font: 'Inter' (sans-serif) for body text to create a clean, minimalist reading experience. Note: currently only Google Fonts are supported.
- Simple, elegant icons aligned with the minimalist design and subtle sci-fi touch.
- Mobile-first design with intuitive card-based layouts, 8px rounded corners, and subtle blue glow effects for buttons.
- Smooth, calming animations (≤300ms) with subtle touch feedback, progress bars, and optional confetti for positive reinforcement.