pragma solidity ^0.4.24;

import "./SafeMath.sol";

contract AttendEnsure {
    using SafeMath for uint;

    address owner;
    uint eventCounter;

    mapping(uint => Event) public events;

    struct Event {
        uint eventId;
        uint min_deposit;
        string name;
        uint start_time;
        uint end_time;
        uint event_balance;
        uint registeredCount;
        uint attendedCount;

        mapping(address => Attendee) attendees;
        address[] registered_list;
        address[] attended_list;
    }

    struct Attendee {
        uint deposit;
        bool registered;
        bool attended;
    }

    modifier onlyOwner {
        require(msg.sender == owner);
        _;
    }

    event EventCreated(address _creator, string _eventName, uint _min_deposit, uint _start_time, uint _end_time);
    event EventStarted(uint _startTime, bool _registered);
    event EventEnded(uint _endTime, bool _attended);
    event DepositAndRegistered(uint _eventId, address _addr, uint _amount);
    event Transfer(address _to, uint _amount);

    constructor() public payable {
        owner = msg.sender;
        eventCounter = 0;
    }

    function contractBalance() public view returns (uint) {
        return address(this).balance;
    }

    function createEvent(string _eventName, uint _min_deposit, uint _start_time, uint _end_time) public onlyOwner returns (uint) {
        require(_start_time < _end_time);
        events[eventCounter].eventId = eventCounter;
        events[eventCounter].name = _eventName;
        events[eventCounter].min_deposit = _min_deposit;
        events[eventCounter].start_time = _start_time;
        events[eventCounter].end_time = _end_time;
        events[eventCounter].event_balance = 0;
        events[eventCounter].registeredCount = 0;
        events[eventCounter].attendedCount = 0;

        emit EventCreated(msg.sender, events[eventCounter].name, events[eventCounter].min_deposit, events[eventCounter].start_time, events[eventCounter].end_time);
        return eventCounter += 1;
    }

    function depositAndRegister(uint _eventId) public payable returns (bool) {
        require(!events[_eventId].attendees[msg.sender].registered);
        require(msg.value > events[_eventId].min_deposit);
        events[_eventId].attendees[msg.sender].deposit += msg.value;
        events[_eventId].attendees[msg.sender].registered = true;
        events[_eventId].registeredCount += 1;
        events[_eventId].registered_list.push(msg.sender);
        emit DepositAndRegistered(_eventId, msg.sender, msg.value);
        return true;
    }

    function attendEvent(uint _eventId, address _addr) public returns (bool) {
        require(_addr != address(0));
        require(_addr != address(this));
        require(_eventId >= 0 && _eventId <= eventCounter);
        require(events[_eventId].attendees[_addr].registered);
        events[_eventId].attendees[_addr].attended = true;
        _addr.transfer(events[_eventId].attendees[_addr].deposit);
        events[_eventId].attended_list.push(_addr);
        emit Transfer(_addr, events[_eventId].attendees[_addr].deposit);
    }

    function registered_List(uint _eventId) public view returns (address[]) {
        return events[_eventId].registered_list;
    }

    function attended_List(uint _eventId) public view returns (address[]) {
        return events[_eventId].attended_list;
    }

    function registered_Count(uint _eventId) public view returns (uint) {
        return events[_eventId].registeredCount;
    }

    function deposit_Balance(uint _eventId) public view returns (uint) {
        return events[_eventId].event_balance;
    }

    function attended_Count(uint _eventId) public view returns (uint) {
        return events[_eventId].attendedCount;
    }

    function check_Registered(uint _eventId, address _addr) public view returns (bool) {
        return events[_eventId].attendees[_addr].registered;
    }

    function check_Attended(uint _eventId, address _addr) public view returns (bool) {
        return events[_eventId].attendees[_addr].attended;
    }

    function check_EventEnded(uint _eventId) public view returns(bool) {
        if (events[_eventId].end_time < now) return true;
        return false;
    }

    function rewardToAttendants(uint _eventId) public onlyOwner returns (bool) {
        require(address(this).balance > 0);
        require(_eventId >= 0 && _eventId <= eventCounter);
        uint X = events[_eventId].event_balance;
        uint each = X.div(events[_eventId].attendedCount);
        for (uint i = 0; i< events[_eventId].attendedCount; i++) {
            events[_eventId].attended_list[i].transfer(each);
            emit Transfer(events[_eventId].attended_list[i], each);
        }
    }

}
