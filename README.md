In the modern digital era, traditional password-based authentication mechanisms are highly vulnerable to 
phishing, brute-force attacks, and credential leaks. Users often reuse or choose weak passwords, making them prone 
to exploitation. Although techniques such as two-factor authentication (2FA) and biometrics (fingerprints, facial 
recognition) have emerged, these require additional hardware or devices, making them less practical for large-scale 
deployment. 
 
This project proposes an advanced authentication system that leverages keystroke dynamics as a behavioural 
biometric. Keystroke dynamics refers to the unique typing rhythm of a user, including parameters such as dwell time 
(time a key is pressed), flight time (time between two consecutive key presses), and overall typing speed. Since users 
are deeply familiar with their own passwords, they tend to type them with a distinctive pattern, which can be utilized 
for authentication. 
 
Several studies have demonstrated the effectiveness of keystroke dynamics in improving security. Early 
approaches relied on static thresholds for matching user patterns, but recent advancements employ machine learning 
techniques such as Support Vector Machines (SVM), Random Forest, and Neural Networks to classify genuine users 
and impostors more accurately. By combining traditional password entry with keystroke-based behavioural 
biometrics, a dual-layer security mechanism is established without requiring additional hardware. 
 
This project enhances the existing research by introducing: 
• Cross-platform dataset collection for capturing typing behaviour across devices and environments. 
• Threshold tuning to balance security and usability. 
• Fallback mechanisms (like OTP verification) in case of mismatched typing patterns. 
• Feature vector storage (average dwell time, standard deviation, latency distribution) instead of raw timestamps, 
ensuring efficiency and privacy. 
• Adaptive dataset learning, where user profiles are continuously updated through successful login attempts. 
 
Thus, the project integrates password security with behavioural biometrics to develop a robust and adaptive 
authentication model.
