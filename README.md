# **Hub Ticketing**

## **Tagline**

_Enhancing security and privacy for students accessing the ALX Tech Hub through secure digital ticketing._

---

## **Table of Contents**

1. [Introduction](#introduction)
2. [Motivation](#motivation)
3. [Problem Statement](#problem-statement)
4. [Challenges Addressed](#challenges-addressed)
5. [How Hub Ticketing Works](#how-hub-ticketing-works)
6. [Features](#features)
7. [User Journey](#user-journey)
8. [Challenges Faced During Development](#challenges-faced-during-development)
9. [Future Roadmap](#future-roadmap)
10. [Survey Results & Statistics](#survey-results-and-statistics)
11. [Technologies Used](#technologies-used)
12. [Installation and Setup](#installation-and-setup)
13. [Contributing](#contributing)
14. [Live Demo & Video](#live-demo-and-video)
15. [License](#license)

---

## **Introduction**

Hub Ticketing is a decentralized, blockchain-based platform designed to enhance the security and privacy of students attending sessions at the ALX Tech Hub. The platform simplifies and secures the ticketing and verification process, reducing the risk of personal data exposure by leveraging smart wallets and QR codes for secure and efficient access management.

---

## **Motivation**

As students at ALX, an EdTech organization focused on ICT skills training, we frequently visit the ALX Tech Hub—a collaborative physical workspace. The current access system involves presenting sensitive personal information during security checks, which has raised significant privacy concerns.

This project aims to introduce a system that respects users' privacy while maintaining a secure and seamless method for accessing the hub. By using blockchain technology, Hub Ticketing ensures that sensitive information is only shared when necessary and remains under user control.

---

## **Problem Statement**

The current security check process at the ALX Tech Hub requires students to present sensitive information such as national IDs, which are sometimes photographed and stored. This poses a significant risk to students’ data privacy, as personal information is exposed to third parties and can be mishandled.

**Key issues include:**

- Overexposure of sensitive information (national ID, phone numbers).
- Security risks from central storage of personal data.
- Inefficient manual verification leading to longer wait times.

---

## **Challenges Addressed**

- **Privacy Concerns**: Reducing the risk of data breaches by eliminating the need for sensitive information to be shared manually.
- **Security Risks**: Minimizing centralized data storage, which is prone to hacking and unauthorized access.
- **Manual Verification**: Streamlining the verification process to avoid delays and inefficiencies.
- **User Experience**: Simplifying the process for students unfamiliar with blockchain while ensuring security.

---

## **How Hub Ticketing Works**

### **Smart Wallet Integration**

For now, the students are to connect to a smsart wallet because for them to be issued with a Verifiable credential, they are calling a function in the smart contract, this needs them to pay for gas fees alongside hence demanding the need to have a wallet. However, I was diving into research on how to approach this issue and learnt a ton of cool stuff. I learnt the concept of paymsters and relayers. A Relayer is an ethereum wallet established by the developer(with private keys stored somewhere in teh server) with gass that will be used by the user indirectly whenever they want to call a function in the smart contract. I found this quite interesting but because oof time constraints I could not actualise it. Looking foward to achieve this.

### **QR Code-Based Verification**

At the hub, students present a QR code from their smart wallet that contains minimal information (e.g., name and ticket validity). Security scans the QR code, retrieving only necessary details, protecting sensitive data.

### **Web2 to Web3 Transition**

I have implemented Smart wallets that are used for easy login, allowing Web2 users to interact with the Web3 platform without in-depth blockchain knowledge.

---

## **Features**

1. **Blockchain-Based Verification**
2. **Privacy-First Design**
3. **Seamless Web2/Web3 Integration**
4. **QR Code Access**
5. **Decentralized Data Storage**
6. **Scalability**

---

## **User Journey**

1. **Sign Up/Login**: Log in using Google Authentication linked to the smart wallet.
2. **Program and Session Selection**: Choose the time slot for hub access.
3. **Ticket Booking**: Book and get issued with a ticket/Verifiable Credential.
4. **Security Check**: Present the QR code to verify credentials.
5. **Hub Entry**: Gain access with minimal personal data shared.

---

## **Challenges Faced During Development**

- **Smart Wallet Integration**: Balancing traditional login methods and blockchain technology.
- **User Interface**: Designing an intuitive UI for students unfamiliar with blockchain.
- **Privacy vs. Security**: Ensuring only necessary data is shared during verification.
- **Scalability**: Optimizing for peak usage during large events. Hence the use of Reactjs for Single Page Applications served once upon request.

---

## **Future Roadmap**

Apart from teh below near-future roadmap, I would wish to make this as an infrastructure project. Here I aim to have enable developers implement Verifiable Credentials to improve on data privacy issues. THis is just a strategic objective and jotted below are some actiivities for the near roadmap:

- **Multi-Hub Support**: Expand the platform to other ALX hubs and workspaces beyond the current tech hub.
- **Mobile Application**: Develop a mobile application for easier access to the platform and tickets on-the-go.

- **Advanced Features**: Introduce premium features like priority access, personalized event notifications, and attendee analytics.

- **Cross-Platform Integration**: Support integration with other popular authentication methods and smart wallets for enhanced user flexibility.

---

## **Survey Results and Statistics**

I conducted a survey through [this form](https://forms.gle/qe4aR2PnSd8kGERZ6) among ALX students and the following statistics from the survey highlight the data privacy concerns:

- **83%** of respondents felt uncomfortable sharing their national ID during security checks.
- **72%** expressed concerns about potential misuse of personal data.
- **68%** preferred a system that only shares necessary information during security checks.

**Survey Screenshots**:  
[Privacy concerns](/public/privacy.png)
[Feedback from Respondents](/public/feedback.png)

---

## **Technologies Used**

- **Blockchain**: For ticketing, verification and decentralized data control.
- **Smart Wallets**: For interactions with the smart contract functions.
- **QR Codes**: For easy, contactless verification of credentials at the ALX Tech Hub.
- **Frontend**: React with Tailwind CSS.

---

## **Installation and Setup**

### **Installation Steps**

1. **Clone the repository:**

   ```bash
   git clone https://github.com/Fideltodayy/HubTicketing
   cd HubTicketing
   ```

2. **Install dependencies:**

   ```bash
   npm install
   ```

3. **Run the application:**

   ```bash
   npm start
   ```

4. **Access the app**: Open your browser and navigate to `http://localhost:3000`.

---

## **Contributing**

We welcome contributions from the community! If you'd like to contribute:

1. Fork the repository.
2. Create a new branch for your feature (`git checkout -b feature/your-feature`).
3. Commit your changes (`git commit -m 'Add feature'`).
4. Push to the branch (`git push origin feature/your-feature`).
5. Create a Pull Request.

---

## **Live Demo & Video**

**Live Demo:**
[Hub Ticketing Deployed Solution
](https://hub-verifiable-credentials-fideltodayy-fideltodayys-projects.vercel.app/)
**Video Demo:**
[Watch the Demo Video](https://vimeo.com/1021621558)

## **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
