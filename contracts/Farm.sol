// SPDX-License-Identifier: GPL-3.0
pragma solidity >= 0.5.2;
// pragma experimental ABIEncoderV2;
contract Farm{
    address public contract_admin;

    constructor() public{
        contract_admin = msg.sender;
        add_admin("Inspector 1", 45, "Tehsil Manager");
    }

    struct CropRequirement {
        uint id;
        address business;
        string crop_name;
        uint quantity_in_kg;
        uint price_per_kg;
        uint delivery_time;
        bool status;//for tracking whether this crop requirement is completed or not.
        uint totalPrice;
        uint advancedPayment;
    }

    struct admin {
        uint256 id;
        string name;
        uint256 age;
        string designation;
    }
    
    struct farmer {
        address id;
        string name;
        uint256 age;
        string city;
        string aadharNumber;
        string panNumber;
        string land_document;
    }

    struct business {
        address id;
        string business_name;
        string city;
        string companyRegistrationNumber;
        string GSTnumber;
        string document;
        string email;
    }
    
    struct farmContract {
        address business;
        address farmer;
        uint id;
        string crop_name;
        uint quantity_in_kg;
        uint price_per_kg;
        uint deadline;
        uint totalPrice;
        uint advancedPayment;
    }

    farmContract[] public Contracts;
    
    mapping(uint256 => admin) public InspectorMapping;

    address[] public businesses;
    mapping(address => business) public businessMapping;
    

    address[] public farmers;
    mapping(address => farmer) public farmerMapping;

    mapping(address => bool) public RegisteredAddressMapping;
    mapping(address => bool) public RegisteredBusinessMapping;
    mapping(address => bool) public RegisteredFarmerMapping;
    mapping(address => bool) public Verification;
    
    // mapping(address => CropRequirement[]) public CropReqMap;//This map is for storing CropRequirements of particular company.
    CropRequirement[] public CropReqMap;
    mapping(address => bool) public rejection;

    mapping(uint256 => address[]) public requestMapping;    
    
    uint256 public contractsCount = 5;
    uint256 public inspectorsCount;
    uint256 public farmersCount;
    uint256 public businessCount;
    uint256 public CropReqMapCount;
    uint256 public totalRequest;

    function getBusinessCount() public view returns(uint256){
        return businessCount;
    }

    function getInspectorCount() public view returns(uint256){
        return inspectorsCount;
    }

    function getFarmersCount() public view returns(uint256){
        return farmersCount;
    }
    function getCropReqCount() public view returns(uint256){
        return CropReqMapCount;
    }

    function getTotalRequestCount() public view returns(uint256){
        return totalRequest;
    }

    // function getRequestCount(uint index) public view returns(uint256) {
    //     return requestMapping[index].length;
    // } 

    function add_admin(string memory _name, uint256 _age, string memory _designation) private{
        inspectorsCount++;
        InspectorMapping[inspectorsCount] = admin(
            inspectorsCount,
            _name,
            _age,
            _designation
        );
    }

    function addFarmer( string memory name,
                        uint256 age,
                        string memory city,
                        string memory aadharNumber,
                        string memory panNumber,
                        string memory land_document
    ) public {
        require(!RegisteredAddressMapping[msg.sender]);
        farmersCount++;
        farmers.push(msg.sender);
        RegisteredAddressMapping[msg.sender] = true;
        RegisteredFarmerMapping[msg.sender] = true;
        farmerMapping[msg.sender] = farmer( msg.sender, name, age, city, aadharNumber, panNumber, land_document);
    }

    function updateFarmer( string memory _name,
                        uint256 _age,
                        string memory _city,
                        string memory _aadharNumber,
                        string memory _panNumber,
                        string memory _land_document
    ) public {
        require(RegisteredAddressMapping[msg.sender] && farmerMapping[msg.sender].id == msg.sender);

        
        farmerMapping[msg.sender].name = _name;
        farmerMapping[msg.sender].age = _age;
        farmerMapping[msg.sender].city = _city;
        farmerMapping[msg.sender].aadharNumber = _aadharNumber;
        farmerMapping[msg.sender].panNumber = _panNumber;
        farmerMapping[msg.sender].land_document = _land_document;
    }

    function getFarmers() public view returns (address[] memory) {
        return (farmers);
    }

    //here we are returning the whole farmer struct to stop stack too deep error
    function getFarmerDetails(address i) public view returns (string memory, uint, string memory, string memory, string memory, string memory) {
        return (farmerMapping[i].name, 
                farmerMapping[i].age, 
                farmerMapping[i].city, 
                farmerMapping[i].aadharNumber, 
                farmerMapping[i].panNumber, 
                farmerMapping[i].land_document);
    }

    function addBusiness(string memory business_name,
        string memory city,
        string memory companyRegistrationNumber,
        string memory GSTnumber,
        string memory document,
        string memory email
    ) public {
        require(!RegisteredAddressMapping[msg.sender]);

        businessCount++;
        businesses.push(msg.sender);
        RegisteredAddressMapping[msg.sender] = true;
        RegisteredBusinessMapping[msg.sender] = true;
        businessMapping[msg.sender] = business( msg.sender, business_name, city, companyRegistrationNumber, GSTnumber, document, email);
    }

    function updateBusiness(string memory _business_name,
        string memory _city,
        string memory _companyRegistrationNumber,
        string memory _GSTnumber,
        string memory _document,
        string memory _email
    ) public {
        require(RegisteredAddressMapping[msg.sender] && businessMapping[msg.sender].id == msg.sender);

        businessMapping[msg.sender].business_name = _business_name;
        businessMapping[msg.sender].city = _city;
        businessMapping[msg.sender].companyRegistrationNumber = _companyRegistrationNumber;
        businessMapping[msg.sender].GSTnumber = _GSTnumber;
        businessMapping[msg.sender].document = _document;
        businessMapping[msg.sender].email = _email;
    }

    function getBusinesses() public view returns (address[] memory) {
        return (businesses);
    }

    function getBusinessDetails(address i)
        public
        view
        returns (
            string memory,
            string memory,
            string memory,
            string memory,
            string memory,
            string memory
        )
    {
        return (
            businessMapping[i].business_name,
            businessMapping[i].city,
            businessMapping[i].companyRegistrationNumber,
            businessMapping[i].GSTnumber,
            businessMapping[i].document,
            businessMapping[i].email
        );
    }

    function isFarmer(address _id) public view returns (bool) {
        if (RegisteredFarmerMapping[_id]) {
            return true;
        } else {
            // Handle the case where it's not verified
            return false;
        }
    }

    function isAdmin1 (address _id) public view returns (bool) {
        if(_id == contract_admin) return true;
        else return false;
    }

    function isBusiness(address _id) public view returns (bool) {
        if (RegisteredBusinessMapping[_id]) {
            return true;
        } else {
            // Handle the case where it's not verified
            return false;
        }
    }

    modifier isAdmin {
        require(msg.sender == contract_admin);
        _;
    }

    modifier isVerified{
        require(Verification[msg.sender] == true);
        _;
    }

    function isVerified1(address _id) public view returns (bool) {
        if(Verification[_id] == true) return true; 
        else return false;
    }

    function verify(address walletID) isAdmin public{
        Verification[walletID] = true;
    }

    function reject(address walletID) isAdmin public {
        rejection[walletID] = true;
    }

    function isRejected(address walletID) public view returns (bool)  {
        if(rejection[walletID]) return true;
        else return false;
    }

    function addCropRequirement (
        string memory crop_name,
        uint quantity_in_kg,
        uint price_per_kg,
        uint256 deliveryTime, 
        uint256 _total,
        uint256 _advPayment) public isVerified{
            require(RegisteredBusinessMapping[msg.sender] == true);
            
            CropReqMapCount++;
            uint id_temp = CropReqMap.length + 1;
            // CropReqMapComplete[id_temp] = false;
            CropReqMap.push(CropRequirement(id_temp, msg.sender, crop_name, quantity_in_kg, price_per_kg, block.timestamp+deliveryTime, false, _total, _advPayment));    
    }

    //below set of functions is for getting information about cropRequirement.
    function getCropRequirementBusiness(uint256 i) public view returns(address){
        return CropReqMap[i].business;
    }
    
    function getCropRequirementCropName(uint256 i) public view returns(string memory){
        return CropReqMap[i].crop_name;
    }
    function getCropRequirementQuantity(uint256 i) public view returns(uint256){
        return CropReqMap[i].quantity_in_kg;
    }
    function getCropRequirementPrice(uint256 i) public view returns(uint256){
        return CropReqMap[i].price_per_kg;
    }
    function getCropRequirementDelTime(uint256 i) public view returns(uint256){
        return CropReqMap[i].delivery_time;
    }
    function getCropRequirementStatus(uint256 i) public view returns (bool){
        return CropReqMap[i].status;
    }
    function getCropRequirementTotalPrice(uint256 i) public view returns (uint256) {
        return CropReqMap[i].totalPrice;
    }
    function getCropRequirementAdvPayment(uint256 i) public view returns (uint256) {
        return CropReqMap[i].advancedPayment;
    }
    //end

    function requestContract(uint256 i) public isVerified{
        require(RegisteredFarmerMapping[msg.sender] == true);
        totalRequest++;
        requestMapping[i].push(msg.sender);  
    }

    function isRequested(uint256 index) public view returns (bool){
        uint256 length = requestMapping[index].length;
        for(uint256 i=0; i<length; i++){
            if(requestMapping[index][i] == msg.sender){
                return true;
            }
        }
        return false;
    }

    uint256 ContractsCount = 0;

    struct forExtension {
        bool farmerReq;
        bool businessAcceptance;
        uint256 time;
    }
    
    mapping(uint256 => forExtension) public extensionReq;//This array is for extension requests.
    bool[] public advancedPaymentReceived; 
    bool[] public PaymentReceived; 


    function signContract(address payable farmerAddress, uint256 i) public payable isVerified{
        require(RegisteredBusinessMapping[msg.sender] == true);

        ContractsCount++;
        CropReqMap[i].status = true;
        extensionReq[i] = forExtension(false, false, 0);
        advancedPaymentReceived.push(false);
        PaymentReceived.push(false);
        Contracts.push(farmContract(msg.sender, 
                                    farmerAddress, 
                                    ContractsCount, //id of contract
                                    CropReqMap[i].crop_name, 
                                    CropReqMap[i].quantity_in_kg, 
                                    CropReqMap[i].price_per_kg, 
                                    CropReqMap[i].delivery_time, 
                                    CropReqMap[i].totalPrice, 
                                    CropReqMap[i].advancedPayment));
        
        //Triggering advanced payment
        //we have to take care of msg.value from frontend.
            /* First access the advancedPayment value from CropReqMap using index i 
               and pass it using web3.js frontend(refer "makePayment.js" for this)*/
        farmerAddress.transfer(msg.value);
        advancedPaymentReceived[i] = true;
    }


    //below are the functions for displaying contracts data to the frontend
    function getContractBusiness(uint i) public view returns (address) {
        return Contracts[i].business;
    }
    function getContractFarmer(uint i) public view returns (address) {
        return Contracts[i].farmer;
    }
    function getContractId(uint i) public view returns (uint) {
        return Contracts[i].id;
    }
    function getContractCropName(uint i) public view returns (string memory) {
        return Contracts[i].crop_name;
    }
    function getContractQuantity(uint i) public view returns (uint) {
        return Contracts[i].quantity_in_kg;
    }
    function getContractPrice(uint i) public view returns (uint) {
        return Contracts[i].price_per_kg;
    }
    function getContractDeadLine(uint i) public view returns (uint) {
        return Contracts[i].deadline;
    }
    function getContractTotalPrice(uint i) public view returns (uint) {
        return Contracts[i].totalPrice;
    }
    function getContractAdvPayment(uint i) public view returns (uint) {
        return Contracts[i].advancedPayment;
    }
    //----------end--------------(these functions will be used to display the contracts data to the frontend)



    //Below Implementation is for extension part.
    function requestExtension(uint _i, uint256 _time) public {
        require(RegisteredAddressMapping[msg.sender] && farmerMapping[msg.sender].id == msg.sender && Contracts[_i].farmer == msg.sender);

        extensionReq[_i].farmerReq = true;
        extensionReq[_i].time = _time;
    }

    function getExtensionInformation(uint _i) public view returns (bool, bool, uint) {
        return (extensionReq[_i].farmerReq,
                extensionReq[_i].businessAcceptance,
                extensionReq[_i].time);
    }

    function acceptExtension(uint _i) public {
        require(RegisteredAddressMapping[msg.sender] && businessMapping[msg.sender].id == msg.sender && Contracts[_i].business == msg.sender);
        extensionReq[_i].businessAcceptance = true;
    }

    function updateContract(uint _i) public isAdmin {
        require(extensionReq[_i].farmerReq == true && extensionReq[_i].businessAcceptance == true);
        Contracts[_i].deadline += extensionReq[_i].time;
    }

    //function for remaining payment
    function payRemaining(address payable _farmer, uint256 id) public payable {
        PaymentReceived[id] = true;
        _farmer.transfer(msg.value);
    }

    function isComplete(uint256 id) public view returns (bool) {
        return PaymentReceived[id];
    }
    
}