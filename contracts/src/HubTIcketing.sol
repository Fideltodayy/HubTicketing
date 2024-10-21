// SPDX-License-Identifier: MIT
pragma solidity 0.8.28;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./Counters.sol";

/**
 * @title ALXTechHubAccess
 * @dev Contract for managing student credentials and access control at ALX Tech Hub
 */
contract ALXTechHubAccess is Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private _counter;    

    // Custom errors
    error StudentAlreadyRegistered(uint256 studentId);
    error DuplicateEmailAddress(string email);
    error DuplicateWalletAddress(address wallet);
    error InvalidStudentId();
    error InvalidEmailFormat();
    error InvalidNameFormat();
    error StudentNotFound();

    enum TimeZone {
        Morning,
        Afternoon,
        Evening,
        Night
    }
    
    enum Program {
        SoftwareEngineering,
        DataScience,
        Cybersecurity,
        AIandMACHINELEARNING,
        SalesForce
    }

    struct StudentStruct {
        string firstName;      // Added first name
        string lastName;       // Added last name
        string email;
        uint256 studentId;
        bool isRegistered;
        address studentsAddress;
    }

    struct Credential {
        uint256 id;
        uint256 studentId;
        Program program;
        TimeZone timezone;
        uint256 expirationTime;
        bool isValid;
        string studentEmail;
        string studentFirstName;  // Added first name
        string studentLastName;   // Added last name
    }

    // Frontend-friendly credential view
    struct CredentialView {
        uint256 id;
        uint256 studentId;
        string studentEmail;
        string studentFirstName;  // Added first name
        string studentLastName;   // Added last name
        Program program;
        TimeZone timezone;
        uint256 expirationTime;
        bool isValid;
        bytes32 credentialHash;
    }

    mapping(uint256 => StudentStruct) public student;
    mapping(bytes32 => Credential) public credentials;
    mapping(string => bool) private usedEmails;
    mapping(address => bool) private usedAddresses;
    mapping(uint256 => bytes32[]) private studentCredentials;
    Counters.Counter private _credentialIds;
    uint256 public studentCount;
    uint256[] private studentIds;

    event UserRegistered(
        address indexed userAddress, 
        string firstName,
        string lastName,
        string email
    );
    
    event CredentialIssued(
        uint256 indexed credentialId, 
        uint256 studentId, 
        string studentFirstName,
        string studentLastName,
        string studentEmail,
        Program program, 
        TimeZone timezone, 
        uint256 expirationTime,
        bytes32 credentialHash
    );
    
    event CredentialRevoked(
        uint256 indexed credentialId, 
        string studentFirstName,
        string studentLastName,
        string studentEmail
    );

    constructor() Ownable(msg.sender) {}

    /**
     * @dev Validates email format using basic checks
     */
    function isValidEmail(string memory email) private pure returns (bool) {
        bytes memory emailBytes = bytes(email);
        if(emailBytes.length < 3) return false;
        
        bool hasAtSymbol = false;
        bool hasDotAfterAt = false;
        uint256 atPosition;
        
        for(uint i = 0; i < emailBytes.length; i++) {
            if(emailBytes[i] == '@') {
                if(hasAtSymbol) return false;
                hasAtSymbol = true;
                atPosition = i;
            } else if(hasAtSymbol && emailBytes[i] == '.') {
                if(i > atPosition + 1) hasDotAfterAt = true;
            }
        }
        
        return hasAtSymbol && hasDotAfterAt;
    }

    /**
     * @dev Validates that a name is not empty and contains valid characters
     */
    function isValidName(string memory name) private pure returns (bool) {
        bytes memory nameBytes = bytes(name);
        if(nameBytes.length == 0 || nameBytes.length > 50) return false;
        return true;
    }

    /**
     * @dev Registers a new student in the system
     */
    function registerUser(
        address _studentAddress, 
        string memory _firstName,
        string memory _lastName,
        string memory _email, 
        uint256 _studentId
    ) external onlyOwner returns(string memory) {
        if(_studentId == 0) revert InvalidStudentId();
        if(!isValidEmail(_email)) revert InvalidEmailFormat();
        if(!isValidName(_firstName) || !isValidName(_lastName)) revert InvalidNameFormat();
        
        if(student[_studentId].isRegistered) {
            revert StudentAlreadyRegistered(_studentId);
        }
        
        if(usedEmails[_email]) {
            revert DuplicateEmailAddress(_email);
        }
        
        if(usedAddresses[_studentAddress]) {
            revert DuplicateWalletAddress(_studentAddress);
        }
        
        student[_studentId] = StudentStruct({
            firstName: _firstName,
            lastName: _lastName,
            email: _email,
            studentId: _studentId,
            isRegistered: true,
            studentsAddress: _studentAddress
        });
        
        usedEmails[_email] = true;
        usedAddresses[_studentAddress] = true;
        studentCount++;
        studentIds.push(_studentId);

        emit UserRegistered(_studentAddress, _firstName, _lastName, _email);
        return "Student Registered Successfully";
    }

    /**
     * @dev Gets details of a specific student
     */
    function getStudent(uint256 _studentId) external view returns (StudentStruct memory) {
        StudentStruct memory studentDetails = student[_studentId];
        if (!studentDetails.isRegistered) revert StudentNotFound();
        return studentDetails;
    }

    /**
     * @dev Gets all registered students
     */
    function getAllStudents() external view returns (StudentStruct[] memory, uint256) {
        StudentStruct[] memory allStudents = new StudentStruct[](studentCount);
        
        for (uint256 i = 0; i < studentIds.length; i++) {
            allStudents[i] = student[studentIds[i]];
        }
        
        return (allStudents, studentCount);
    }

    /**
     * @dev Gets students by page for efficient retrieval
     */
    function getStudentsByPage(uint256 _page, uint256 _perPage) 
        external 
        view 
        returns (StudentStruct[] memory, uint256) 
    {
        require(_perPage > 0, "Items per page must be greater than 0");
        
        uint256 startIndex = _page * _perPage;
        require(startIndex < studentIds.length, "Page out of bounds");
        
        uint256 endIndex = startIndex + _perPage;
        if (endIndex > studentIds.length) {
            endIndex = studentIds.length;
        }
        
        uint256 itemsToReturn = endIndex - startIndex;
        StudentStruct[] memory pagedStudents = new StudentStruct[](itemsToReturn);
        
        for (uint256 i = 0; i < itemsToReturn; i++) {
            pagedStudents[i] = student[studentIds[startIndex + i]];
        }
        
        return (pagedStudents, studentCount);
    }

    /**
     * @dev Issues a new credential to a student
     */
    function issueCredential(
        uint256 _studentId,
        Program _program, 
        TimeZone _timezone,
        uint256 _validityPeriod
    ) external onlyOwner returns (bytes32 credentialHash, CredentialView memory credentialView) {
        require(student[_studentId].isRegistered, "Invalid student");
        StudentStruct memory studentData = student[_studentId];

        _credentialIds.increment();
        uint256 newCredentialId = _credentialIds.current();
        uint256 expirationTime = block.timestamp + _validityPeriod;

        credentialHash = keccak256(abi.encodePacked(
            newCredentialId,
            _studentId,
            _program,
            _timezone,
            expirationTime
        ));

        credentials[credentialHash] = Credential({
            id: newCredentialId,
            studentId: _studentId,
            program: _program,
            timezone: _timezone,
            expirationTime: expirationTime,
            isValid: true,
            studentEmail: studentData.email,
            studentFirstName: studentData.firstName,
            studentLastName: studentData.lastName
        });

        studentCredentials[_studentId].push(credentialHash);

        credentialView = CredentialView({
            id: newCredentialId,
            studentId: _studentId,
            studentEmail: studentData.email,
            studentFirstName: studentData.firstName,
            studentLastName: studentData.lastName,
            program: _program,
            timezone: _timezone,
            expirationTime: expirationTime,
            isValid: true,
            credentialHash: credentialHash
        });

        emit CredentialIssued(
            newCredentialId, 
            _studentId,
            studentData.firstName,
            studentData.lastName,
            studentData.email,
            _program, 
            _timezone, 
            expirationTime,
            credentialHash
        );
    }

    /**
     * @dev Get all credentials for a specific student
     */
    function getStudentCredentials(uint256 _studentId) 
        external 
        view 
        returns (CredentialView[] memory) 
    {
        require(student[_studentId].isRegistered, "Invalid student");
        
        bytes32[] memory studentCreds = studentCredentials[_studentId];
        CredentialView[] memory views = new CredentialView[](studentCreds.length);
        
        for (uint256 i = 0; i < studentCreds.length; i++) {
            Credential memory cred = credentials[studentCreds[i]];
            views[i] = CredentialView({
                id: cred.id,
                studentId: cred.studentId,
                studentEmail: cred.studentEmail,
                studentFirstName: cred.studentFirstName,
                studentLastName: cred.studentLastName,
                program: cred.program,
                timezone: cred.timezone,
                expirationTime: cred.expirationTime,
                isValid: cred.isValid,
                credentialHash: studentCreds[i]
            });
        }
        
        return views;
    }

    /**
     * @dev Get a single credential by its hash
     */
    function getCredentialDetails(bytes32 _credentialHash) 
        external 
        view 
        returns (CredentialView memory) 
    {
        Credential memory cred = credentials[_credentialHash];
        require(cred.id != 0, "Credential does not exist");
        
        return CredentialView({
            id: cred.id,
            studentId: cred.studentId,
            studentEmail: cred.studentEmail,
            studentFirstName: cred.studentFirstName,
            studentLastName: cred.studentLastName,
            program: cred.program,
            timezone: cred.timezone,
            expirationTime: cred.expirationTime,
            isValid: cred.isValid,
            credentialHash: _credentialHash
        });
    }

    /**
     * @dev Verifies the validity of a credential
     */
    function verifyCredential(bytes32 _credentialHash) 
        external 
        view 
        returns (bool, uint256, string memory, string memory, Program, TimeZone, uint256) 
    {
        Credential memory credential = credentials[_credentialHash];
        require(credential.isValid, "Credential is not valid");
        require(credential.expirationTime > block.timestamp, "Credential has expired");

        return (
            true,
            credential.studentId,
            credential.studentFirstName,
            credential.studentLastName,
            credential.program,
            credential.timezone,
            credential.expirationTime
        );
    }

    /**
     * @dev Revokes a credential
     */
    function revokeCredential(bytes32 _credentialHash) external onlyOwner {
        require(credentials[_credentialHash].isValid, "Credential is not valid or doesn't exist");
        Credential memory cred = credentials[_credentialHash];
        credentials[_credentialHash].isValid = false;
        
        emit CredentialRevoked(
            cred.id,
            cred.studentFirstName,
            cred.studentLastName,
            cred.studentEmail
        );
    }

    /**
     * @dev Generates a credential hash
     */
    function getCredentialHash(
        uint256 _id,
        uint256 _studentId,
        Program _program,
        TimeZone _timezone,
        uint256 _expirationTime
    ) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(_id, _studentId, _program, _timezone, _expirationTime));
    }
}