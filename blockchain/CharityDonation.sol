// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title CharityDonation
 * @dev He thong quyen gop tu thien va phan phoi quy minh bach bang Blockchain
 *  tuong thich deploy qua Remix IDE
 */
contract CharityDonation {
    // Dia chi cua Administrator he thong
    address public admin;

    // Bo dem ID chien dich va ID yeu cau phan phoi
    uint256 public campaignCount;
    uint256 public requestCount;

    // Cau truc du lieu Chien dich (Campaign)
    struct Campaign {
        uint256 id;
        string title;
        string description;
        address payable organization;
        uint256 goalAmount;        // Muc tieu quyen gop (tinh bang Wei)
        uint256 totalDonated;      // Tong so tien da nhan quyen gop
        uint256 totalDistributed;  // Tong so tien da duoc phan phoi
        uint256 startDate;
        uint256 endDate;
        bool isActive;
    }

    // Cau truc du lieu Yeu cau phan phoi quy (Distribution Request)
    struct DistributionRequest {
        uint256 id;
        uint256 campaignId;
        address payable recipient; // Nguoi nhan tien phan phoi
        uint256 amount;            // So tien phan phoi (Wei)
        string purpose;            // Muc dich phan phoi quy
        bool isApproved;           // Da duoc Admin duyet chua
        bool isExecuted;           // Da thuc hien giai ngan chuyen ETH chua
    }

    // Luu tru thong tin tren Blockchain
    mapping(uint256 => Campaign) public campaigns;
    mapping(uint256 => DistributionRequest) public distributionRequests;

    // Danh sach cac requestId thuoc ve mot chien dich
    mapping(uint256 => uint256[]) public campaignToRequests;

    // ================= EVENTS =================
    event CampaignCreated(
        uint256 indexed campaignId,
        string title,
        address indexed organization,
        uint256 goalAmount,
        uint256 startDate,
        uint256 endDate
    );

    event DonationReceived(
        uint256 indexed campaignId,
        address indexed donor,
        uint256 amount,
        uint256 timestamp
    );

    event FundDistributionRequested(
        uint256 indexed requestId,
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount,
        string purpose
    );

    event FundDistributionApproved(
        uint256 indexed requestId,
        uint256 indexed campaignId,
        address admin
    );

    event FundDistributed(
        uint256 indexed requestId,
        uint256 indexed campaignId,
        address indexed recipient,
        uint256 amount,
        uint256 timestamp
    );

    // ================= MODIFIERS =================
    modifier onlyAdmin() {
        require(msg.sender == admin, "Chi Administrator moi co quyen thuc hien");
        _;
    }

    modifier onlyOrganization(uint256 _campaignId) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Chien dich khong ton tai");
        require(
            msg.sender == campaigns[_campaignId].organization,
            "Chi to chuc so huu chien dich moi co quyen thuc hien"
        );
        _;
    }

    constructor() {
        admin = msg.sender;
    }

    // ================= CHUC NANG CHINH =================

    /**
     * @notice Tao mot chien dich tu thien moi
     * @param _title Ten chien dich
     * @param _description Mo ta chi tiet
     * @param _goalAmount Muc tieu can quyen gop (Wei)
     * @param _durationInDays Thoi han chien dich (so ngay)
     */
    function createCampaign(
        string memory _title,
        string memory _description,
        uint256 _goalAmount,
        uint256 _durationInDays
    ) external returns (uint256) {
        require(bytes(_title).length > 0, "Tieu de khong duoc de trong");
        require(_goalAmount > 0, "Muc tieu phai lon hon 0");
        require(_durationInDays > 0, "Thoi gian phai lon hon 0 ngay");

        campaignCount++;
        uint256 currentId = campaignCount;
        uint256 startTime = block.timestamp;
        uint256 endTime = startTime + (_durationInDays * 1 days);

        campaigns[currentId] = Campaign({
            id: currentId,
            title: _title,
            description: _description,
            organization: payable(msg.sender),
            goalAmount: _goalAmount,
            totalDonated: 0,
            totalDistributed: 0,
            startDate: startTime,
            endDate: endTime,
            isActive: true
        });

        emit CampaignCreated(
            currentId,
            _title,
            msg.sender,
            _goalAmount,
            startTime,
            endTime
        );

        return currentId;
    }

    /**
     * @notice Quyen gop ETH vao mot chien dich
     * @param _campaignId ID cua chien dich
     */
    function donate(uint256 _campaignId) external payable {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Chien dich khong ton tai");
        Campaign storage campaign = campaigns[_campaignId];
        require(campaign.isActive, "Chien dich da dong hoac khong hoat dong");
        require(block.timestamp <= campaign.endDate, "Chien dich da het han quyen gop");
        require(msg.value > 0, "So tien quyen gop phai lon hon 0");

        campaign.totalDonated += msg.value;

        emit DonationReceived(_campaignId, msg.sender, msg.value, block.timestamp);
    }

    /**
     * @notice To chuc tao yeu cau rut/phan phoi tien tu quy chien dich
     * @param _campaignId ID cua chien dich
     * @param _recipient Dia chi vi nguoi nhan tien (nguoi thu huong/nha cung cap)
     * @param _amount So tien yeu cau phan phoi (Wei)
     * @param _purpose Muc dich su dung tien
     */
    function createDistributionRequest(
        uint256 _campaignId,
        address payable _recipient,
        uint256 _amount,
        string memory _purpose
    ) external onlyOrganization(_campaignId) returns (uint256) {
        Campaign storage campaign = campaigns[_campaignId];
        require(_recipient != address(0), "Dia chi nguoi nhan khong hop le");
        require(_amount > 0, "So tien yeu cau phai lon hon 0");
        
        // Kiem tra so du kha dung cua chien dich
        uint256 availableFunds = campaign.totalDonated - campaign.totalDistributed;
        require(_amount <= availableFunds, "So tien yeu cau vuot qua so du kha dung");

        requestCount++;
        uint256 newRequestId = requestCount;

        distributionRequests[newRequestId] = DistributionRequest({
            id: newRequestId,
            campaignId: _campaignId,
            recipient: _recipient,
            amount: _amount,
            purpose: _purpose,
            isApproved: false,
            isExecuted: false
        });

        campaignToRequests[_campaignId].push(newRequestId);

        emit FundDistributionRequested(
            newRequestId,
            _campaignId,
            _recipient,
            _amount,
            _purpose
        );

        return newRequestId;
    }

    /**
     * @notice Administrator phe duyet yeu cau phan phoi quy
     * @param _requestId ID cua yeu cau phan phoi
     */
    function approveDistribution(uint256 _requestId) external onlyAdmin {
        require(_requestId > 0 && _requestId <= requestCount, "Yeu cau khong ton tai");
        DistributionRequest storage request = distributionRequests[_requestId];
        require(!request.isApproved, "Yeu cau nay da duoc phe duyet truoc do");
        require(!request.isExecuted, "Yeu cau da duoc thuc hien truoc do");

        request.isApproved = true;

        emit FundDistributionApproved(_requestId, request.campaignId, msg.sender);
    }

    /**
     * @notice Thuc hien chuyen tien phan phoi sau khi da duoc Admin phe duyet
     * @param _requestId ID cua yeu cau phan phoi
     */
    function executeDistribution(uint256 _requestId) external {
        require(_requestId > 0 && _requestId <= requestCount, "Yeu cau khong ton tai");
        DistributionRequest storage request = distributionRequests[_requestId];
        require(request.isApproved, "Yeu cau chua duoc phe duyet boi Admin");
        require(!request.isExecuted, "Yeu cau da duoc thuc hien roi");

        Campaign storage campaign = campaigns[request.campaignId];
        // Nguoi goi phai la Admin hoac To chuc cua chien dich
        require(
            msg.sender == admin || msg.sender == campaign.organization,
            "Chi Admin hoac To chuc chien dich moi co the thuc thi"
        );

        uint256 availableFunds = campaign.totalDonated - campaign.totalDistributed;
        require(request.amount <= availableFunds, "So du quy khong du de thuc hien");
        require(address(this).balance >= request.amount, "So du contract khong du");

        // Danh dau da thuc thi truoc khi chuyen tien de phong reentrancy
        request.isExecuted = true;
        campaign.totalDistributed += request.amount;

        // Chuyen ETH den nguoi nhan
        (bool success, ) = request.recipient.call{value: request.amount}("");
        require(success, "Chuyen tien that bai");

        emit FundDistributed(
            _requestId,
            request.campaignId,
            request.recipient,
            request.amount,
            block.timestamp
        );
    }

    // ================= HAM HO TRO XEM THONG TIN (VIEW) =================

    /**
     * @notice Lay danh sach ID yeu cau phan phoi cua mot chien dich
     */
    function getCampaignRequests(uint256 _campaignId) external view returns (uint256[] memory) {
        return campaignToRequests[_campaignId];
    }

    /**
     * @notice Lay so du kha dung hien tai cua mot chien dich
     */
    function getCampaignBalance(uint256 _campaignId) external view returns (uint256) {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Chien dich khong ton tai");
        Campaign storage c = campaigns[_campaignId];
        return c.totalDonated - c.totalDistributed;
    }

    /**
     * @notice Dong chi dich da het han (ai co the goi sau khi het han)
     * @param _campaignId ID cua chien dich
     */
    function closeExpiredCampaign(uint256 _campaignId) external {
        require(_campaignId > 0 && _campaignId <= campaignCount, "Chien dich khong ton tai");
        Campaign storage c = campaigns[_campaignId];
        require(block.timestamp > c.endDate, "Chien dich chua het han");
        require(c.isActive, "Chien dich da dong");

        c.isActive = false;
    }
}
