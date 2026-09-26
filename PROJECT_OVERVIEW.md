# Transparent Charity Donation and Fund Distribution System

## 1. Project Overview

This project is a **Transparent Charity Donation and Fund Distribution System** using blockchain.

The system allows charity organizations to create fundraising campaigns, donors to donate cryptocurrency, and users to view donation and fund distribution information transparently.

Blockchain is used to record important financial transactions so that donation and fund distribution data can be verified.

---

## 2. Project Objectives

The main objectives are:

* Allow organizations to create charity campaigns.
* Allow donors to view campaigns and make donations.
* Record donations on the blockchain.
* Allow organizations to request fund distributions.
* Allow administrators to approve fund distributions.
* Record fund distributions on the blockchain.
* Provide a transparency dashboard.
* Allow users to verify blockchain transactions.

---

## 3. User Roles

The system has three main roles.

### Donor

A donor can:

* View charity campaigns.
* View campaign information.
* Connect MetaMask.
* Donate ETH.
* View donation history.
* Check donation transactions.

### Organization

A charity organization can:

* Create campaigns.
* Manage its campaigns.
* View donations.
* Request fund distribution.
* View distribution status.

### Administrator

An administrator can:

* View campaigns.
* Review fund distribution requests.
* Approve or reject distribution requests.
* Monitor donation and distribution activities.

---

## 4. Main Functions

### Campaign Management

Organizations can create and manage charity campaigns.

A campaign contains information such as:

* Campaign name
* Description
* Fundraising goal
* Start date
* End date
* Organization wallet
* Campaign status

---

### Donation

Donors can donate ETH to an active campaign.

Basic flow:

```text
Donor
  ↓
View Campaign
  ↓
Connect MetaMask
  ↓
Enter Donation Amount
  ↓
Confirm Transaction
  ↓
Smart Contract
  ↓
Blockchain
```

After the transaction is confirmed, the system records the transaction information.

---

### Fund Distribution

Organizations can request money from the campaign for approved purposes.

Basic flow:

```text
Organization
      ↓
Create Distribution Request
      ↓
Administrator Reviews
      ↓
Approve / Reject
      ↓
If Approved
      ↓
Execute Distribution
      ↓
Blockchain
```

The system checks that the organization has enough available funds and that the same request cannot be executed twice.

---

### Transparency Dashboard

The dashboard displays information such as:

* Total campaigns
* Total donations
* Total donated amount
* Total distributed amount
* Recent transactions
* Donation history
* Fund distribution history

Users can use this information to understand how campaign funds are received and distributed.

---

## 5. Blockchain

The project uses the **Ethereum Sepolia test network**.

The smart contract is written in **Solidity**.

MetaMask is used by users to connect their wallets and confirm transactions.

The blockchain stores important transaction information such as:

* Donation transactions
* Fund distribution transactions
* Transaction hashes
* Blockchain events

The blockchain is considered the main source of truth for financial transactions.

---

## 6. Smart Contract

The project uses one main smart contract:

```text
CharityDonation.sol
```

Main functions:

```text
createCampaign()
donate()
createDistributionRequest()
approveDistribution()
executeDistribution()
```

Main events:

```text
DonationReceived
FundDistributionApproved
FundDistributed
```

These events allow the backend to detect changes on the blockchain and update the database.

---

## 7. System Architecture

The system has three main parts:

```text
React Frontend
      |
      | REST API
      ↓
Node.js Backend
      |
      ↓
MongoDB Database
```

Blockchain interaction:

```text
React
  |
MetaMask
  |
Ethereum Sepolia
  |
Smart Contract
  |
Blockchain Events
  |
Node.js Backend
  |
MongoDB
```

### Frontend

React is used to build the user interface.

The frontend allows users to:

* View campaigns
* Connect MetaMask
* Donate ETH
* View transactions
* View the transparency dashboard

### Backend

Node.js is used to build the backend.

The backend is responsible for:

* Managing campaign information
* Managing database data
* Listening for blockchain events
* Providing APIs for the frontend
* Synchronizing blockchain information with the database

### Database

MongoDB is used to store application data.

Main data includes:

* Campaigns
* Donations
* Distribution requests
* Transaction information

The database mainly helps the application search, display, and organize information.

---

## 8. Technologies

The project uses a simple technology stack:

| Technology       | Purpose                   |
| ---------------- | ------------------------- |
| React            | Frontend                  |
| Node.js          | Backend                   |
| JavaScript       | Programming language      |
| MongoDB          | Database                  |
| Solidity         | Smart contract            |
| Ethereum Sepolia | Blockchain network        |
| MetaMask         | Wallet                    |
| Ethers.js        | Blockchain communication  |
| Remix IDE        | Smart contract deployment |

The project intentionally uses a simple technology stack because it is a university project.

---

## 9. Important Data Flow

### Donation Data Flow

```text
Donor
  ↓
React
  ↓
MetaMask
  ↓
Smart Contract
  ↓
Ethereum Sepolia
  ↓
DonationReceived Event
  ↓
Node.js
  ↓
MongoDB
  ↓
React Dashboard
```

### Distribution Data Flow

```text
Organization
  ↓
React
  ↓
Node.js
  ↓
Distribution Request
  ↓
Administrator Approval
  ↓
Smart Contract
  ↓
Ethereum Sepolia
  ↓
FundDistributed Event
  ↓
Node.js
  ↓
MongoDB
  ↓
Transparency Dashboard
```

---

## 10. Project Scope

The project focuses on:

* Charity campaign management
* ETH donations
* Fund distribution
* Blockchain transactions
* Blockchain events
* Transaction verification
* Transparency dashboard

The project does **not** focus on:

* Real cryptocurrency
* Real-world banking
* NFT
* Cryptocurrency token creation
* Complex payment systems
* Advanced AI
* Complex enterprise architecture

All blockchain transactions are performed on the **Sepolia test network**.

---

## 11. Expected Result

At the end of the project, the system should allow a user to:

1. Open the website.
2. View charity campaigns.
3. Connect MetaMask.
4. Donate ETH on Sepolia.
5. See the blockchain transaction.
6. View the donation in the system.
7. Create and review fund distribution requests.
8. Approve and execute a distribution.
9. View donation and distribution information on the transparency dashboard.
10. Verify transactions using the blockchain transaction hash.

---

## 12. Project Structure

A simple project structure is:

```text
transparent-charity/
│
├── PROJECT_REPORT.md       # Báo cáo học thuật đồ án chi tiết (Nguyễn Quang Đoàn)
├── PROJECT_OVERVIEW.md     # Tài liệu tổng quan đề tài
├── HD_SU_DUNG.md           # Hướng dẫn cài đặt và kiểm thử 3 vai trò
├── README.md               # Giới thiệu tổng quan dự án và tài liệu GitHub
├── frontend/               # Ứng dụng React 19 + Vite 8
├── backend/                # Máy chủ Node.js + Express + MongoDB Atlas
└── blockchain/             # Smart Contract CharityDonation.sol
```

---

## 13. Deployment & Author Information

* **Student Author:** **Nguyễn Quang Đoàn**
* **Ethereum Network:** Sepolia Testnet
* **Smart Contract Address:** `0x61528fc1d666AD81F252b67ab047ca12862e3E8b`
* **Etherscan Link:** [https://sepolia.etherscan.io/address/0x61528fc1d666AD81F252b67ab047ca12862e3E8b](https://sepolia.etherscan.io/address/0x61528fc1d666AD81F252b67ab047ca12862e3E8b)
* **Live Web Application:** [https://nguyen-2cb8.onrender.com](https://nguyen-2cb8.onrender.com)
* **GitHub Repository:** [https://github.com/Doanmika/Nguyen.git](https://github.com/Doanmika/Nguyen.git)


