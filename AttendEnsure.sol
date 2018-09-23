pragma solidity ^0.4.24;

import "./SafeMath.sol";

contract AttendEnsure {
    using SafeMath for uint;
    
    string eventName ="DoraHacks";
    address owner;
    //uint deadline;
    //string eventName;
    
    uint registerCount;
    uint attendedCount;

    mapping(address => Attendee) attendees;

    struct Attendee {
        uint deposit;
        bool registered;
        bool attended;
    }

    address[] attended_list;
    
    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }
    
    event EventCreated(address _creator, string eventName, uint time);
    
    //event EventStarted(uint _startTime);
    //event EventEnded(uint _endTime);
    
    event DepositAndRegistered(uint _amount, address _addr);
    event Transfer(address _to, uint _amount);
    
    constructor() public payable {
        owner = msg.sender;
        registerCount = 0;
        attendedCount = 0;
        emit EventCreated(msg.sender, eventName, now);
    }
    
    function depositAndRegister() public payable returns (bool) {
        require(msg.value > 0.01 ether);
        attendees[msg.sender].deposit = msg.value;
        attendees[msg.sender].registered = true;
        registerCount += 1;
        emit DepositAndRegistered(msg.value, msg.sender);
    }
    
    function eventAttended(address _addr) public onlyOwner returns (bool) {
        require(_addr != address(0));
        require(_addr != address(this));
        attendees[_addr].attended = true;
        _addr.transfer(attendees[_addr].deposit);
        attendedCount += 1;
        attended_list.push(_addr);
        emit Transfer(_addr, attendees[_addr].deposit);
    }
    
    function rewardRemaining() public onlyOwner returns (bool) {
        require(address(this).balance > 0);
        uint remaining = address(this).balance;
        uint each = remaining.div(attendedCount);
        for(uint i=0; i<attendedCount; i++) {
            attended_list[i].transfer(each);
            emit Transfer(attended_list[i], each);
        }
    }
    
}